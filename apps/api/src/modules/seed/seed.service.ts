import { createHash } from 'crypto';

import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import pLimit from 'p-limit';

import { User } from '../user/entities/user.entity.js';
import { SeedOperation } from './entities/seed-operation.entity.js';
import { UserIdentity } from '../user/entities/user-identity.entity.js';
import { UserCredential } from '../user/entities/user-credential.entity.js';

import { usersSeed } from './data/users.seed.js';
import { ESeedStatus } from './enums/seed-status.enum.js';
import { passwordHash } from '../common/utils/password-hash.js';
import { normalizedEmail } from '../common/utils/normalized-email.js';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly limit = pLimit(4); // Limit concurrent password hashing to 4

  constructor(
    @InjectRepository(SeedOperation)
    private readonly seedOperationRepository: Repository<SeedOperation>,
    private readonly dataSource: DataSource,
  ) {}

  public async insertUsers(req: Request): Promise<string> {
    const resource = req.url;
    const normalizedUsers = this.normalizedUsers(usersSeed);

    const content = JSON.stringify(normalizedUsers);

    // Create Hash of the content
    const contentHash = createHash('sha256').update(content).digest('hex');
    const key = `users_seed:${contentHash}`;

    // Check if the seed operation already exists
    try {
      const existingSeedOperation = await this.seedOperationRepository.findOne({
        where: { key },
      });

      if (
        existingSeedOperation?.key === key &&
        (existingSeedOperation.status === ESeedStatus.COMPLETED ||
          existingSeedOperation.status === ESeedStatus.IN_PROGRESS)
      ) {
        return 'Users have already been seeded.';
      }

      // Create hashed passwords for each user credential
      const usersWithCredentials = normalizedUsers.filter(
        (seed) => seed.credential?.passwordHash,
      );
      const promisesPasswordHashing = usersWithCredentials.map((seed) =>
        this.limit(() => passwordHash(seed.credential!.passwordHash)),
      );

      const hashedPasswords = await Promise.all(promisesPasswordHashing);

      // Replace the plain text passwords with the hashed ones
      usersWithCredentials.forEach((seed, index) => {
        seed.credential!.passwordHash = hashedPasswords[index]!;
      });

      // Claim the seed operation inside the transaction. The unique key and
      // ON CONFLICT guard concurrent requests without creating duplicate data.
      const seedStarted = await this.dataSource.transaction(async (manager) => {
        const seedOperationInsert = await manager
          .createQueryBuilder()
          .insert()
          .into(SeedOperation)
          .values({
            key,
            resource,
            status: ESeedStatus.IN_PROGRESS,
            metadata: {},
          })
          .orIgnore()
          .returning('id')
          .execute();

        if (seedOperationInsert.raw.length === 0) {
          const existingOperation = await manager.findOne(SeedOperation, {
            where: { key },
            lock: { mode: 'pessimistic_write' },
          });

          if (
            existingOperation?.status !== ESeedStatus.FAILED &&
            existingOperation?.status !== ESeedStatus.PENDING
          )
            return false;

          await manager.update(
            SeedOperation,
            { key },
            {
              status: ESeedStatus.IN_PROGRESS,
              metadata: {},
              completedAt: null,
            },
          );
        }

        // Insert users and related data
        for (const seed of normalizedUsers) {
          const user = await manager.save(User, {
            ...seed.user,
            normalizedEmail: seed.user.email,
          });

          if (seed.credential) {
            await manager.save(UserCredential, {
              ...seed.credential,
              userId: user.id,
            });
          }

          if (seed.identities.length > 0) {
            await manager.save(
              UserIdentity,
              seed.identities.map((identity) => ({
                ...identity,
                userId: user.id,
              })),
            );
          }
        }

        await manager.update(
          SeedOperation,
          { key },
          {
            status: ESeedStatus.COMPLETED,
            metadata: {
              usersCount: normalizedUsers.length,
              credentialsCount: normalizedUsers.filter(
                (seed) => seed.credential,
              ).length,
              identitiesCount: normalizedUsers.reduce(
                (acc, seed) => acc + seed.identities.length,
                0,
              ),
            },
            completedAt: new Date(),
          },
        );

        return true;
      });

      if (!seedStarted) return 'Users have already been seeded.';

      return 'Users seeded successfully.';
    } catch (error: unknown) {
      this.logger.error('Error checking seed operation:', error);

      await this.seedOperationRepository.upsert(
        {
          key,
          resource: req.url,
          status: ESeedStatus.FAILED,
          metadata: {
            error: error instanceof Error ? error.message : String(error),
          },
          completedAt: null,
        },
        ['key'],
      );

      throw new BadRequestException('Error checking seed operation.');
    }
  }

  // Private Methods
  private normalizedUsers(users: typeof usersSeed) {
    return users
      .map((seed) => ({
        user: {
          ...seed.user,
          email: normalizedEmail(seed.user.email),
        },
        credential: seed.credential ? { ...seed.credential } : null,
        identities: seed.identities
          .map((identity) => ({ ...identity }))
          .sort((a, b) => a.providerSubject.localeCompare(b.providerSubject)),
      }))
      .sort((a, b) => a.user.email.localeCompare(b.user.email));
  }
}
