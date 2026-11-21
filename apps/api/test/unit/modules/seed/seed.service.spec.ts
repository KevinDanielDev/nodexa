import { BadRequestException } from '@nestjs/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SeedService } from '../../../../src/modules/seed/seed.service.js';
import { ESeedStatus } from '../../../../src/modules/seed/enums/seed-status.enum.js';

const createDependencies = () => {
  const seedOperationRepository = {
    findOne: vi.fn(),
    upsert: vi.fn(),
  };
  const queryBuilder = {
    insert: vi.fn().mockReturnThis(),
    into: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    orIgnore: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute: vi.fn(async () => ({
      identifiers: [{ id: 'operation-id' }],
      raw: [{ id: 'operation-id' }],
    })),
  };
  const manager = {
    createQueryBuilder: vi.fn(() => queryBuilder),
    findOne: vi.fn(),
    save: vi.fn(async (_entity, value) => ({ id: 'user-id', ...value })),
    update: vi.fn(),
  };
  const dataSource = {
    transaction: vi.fn(async (callback) => callback(manager)),
  };
  const service = new SeedService(
    seedOperationRepository as never,
    dataSource as never,
  );

  return { service, seedOperationRepository, dataSource, manager };
};

describe('SeedService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns early when the same seed content was already completed', async () => {
    const { service, seedOperationRepository, dataSource } =
      createDependencies();
    seedOperationRepository.findOne.mockImplementation(async (options) => ({
      key: options.where.key,
      status: ESeedStatus.COMPLETED,
    }));

    const result = await service.insertUsers({ url: '/seed/users' } as Request);

    expect(result).toBe('Users have already been seeded.');
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('persists an in-progress and completed operation around the seed', async () => {
    const { service, seedOperationRepository, manager } = createDependencies();
    seedOperationRepository.findOne.mockResolvedValue(null);

    await expect(
      service.insertUsers({ url: '/seed/users' } as Request),
    ).resolves.toBe('Users seeded successfully.');

    expect(manager.createQueryBuilder).toHaveBeenCalled();
    expect(manager.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ status: ESeedStatus.COMPLETED }),
    );
  });

  it('records a failed operation and exposes a bad request error', async () => {
    const { service, seedOperationRepository } = createDependencies();
    seedOperationRepository.findOne.mockRejectedValue(new Error('database down'));

    await expect(
      service.insertUsers({ url: '/seed/users' } as Request),
    ).rejects.toThrow(new BadRequestException('Error checking seed operation.'));
    expect(seedOperationRepository.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: '/seed/users',
        status: ESeedStatus.FAILED,
        metadata: { error: 'database down' },
        completedAt: null,
      }),
      ['key'],
    );
  });

  it('allows retrying a previously failed seed operation', async () => {
    const { service, seedOperationRepository, manager } = createDependencies();
    seedOperationRepository.findOne.mockResolvedValue({
      key: 'failed-key',
      status: ESeedStatus.FAILED,
    });
    const queryBuilder = manager.createQueryBuilder();
    queryBuilder.execute.mockResolvedValue({ identifiers: [], raw: [] });
    manager.findOne = vi.fn().mockResolvedValue({
      key: 'failed-key',
      status: ESeedStatus.FAILED,
    });

    await expect(
      service.insertUsers({ url: '/seed/users' } as Request),
    ).resolves.toBe('Users seeded successfully.');
    expect(manager.findOne).toHaveBeenCalled();
    expect(manager.update).toHaveBeenCalledWith(
      expect.anything(),
      { key: expect.any(String) },
      expect.objectContaining({ status: ESeedStatus.IN_PROGRESS }),
    );
  });
});
