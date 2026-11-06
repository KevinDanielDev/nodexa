import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { EUserStatus } from '../enums/index.js';
import { EMAILS_DOMAINS } from '../constants/email-domains.constants.js';
import { UserCredential } from './user-credential.entity.js';
import { UserIdentity } from './user-identity.entity.js';
import { UserSession } from './user-session.entity.js';
import { UnprocessableEntityException } from '@nestjs/common';

// Indexes
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: false,
    length: 254,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'normalized_email',
    nullable: false,
    unique: true,
    length: 254,
  })
  normalizedEmail: string;

  @Column({
    type: 'varchar',
    name: 'first_name',
    nullable: false,
    unique: false,
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    nullable: false,
    unique: false,
    length: 100,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    name: 'display_name',
    nullable: true,
    unique: false,
    length: 150,
  })
  displayName: string | null;

  @Column({
    type: 'text',
    name: 'avatar_url',
    nullable: true,
    unique: false,
    default: null,
  })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    name: 'status',
    nullable: false,
    unique: false,
    enum: EUserStatus,
    default: EUserStatus.ACTIVE,
  })
  status: EUserStatus;

  @Column({
    type: 'timestamptz',
    name: 'email_verified_at',
    nullable: true,
    unique: false,
    default: null,
  })
  emailVerifiedAt: Date | null;

  @Column({
    type: 'timestamptz',
    name: 'last_login_at',
    nullable: true,
    unique: false,
    default: null,
  })
  lastLoginAt: Date | null;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
    unique: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'updated_at',
    nullable: false,
    unique: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column({
    type: 'timestamptz',
    name: 'deleted_at',
    nullable: true,
    unique: false,
    default: null,
  })
  deletedAt: Date | null;

  // Relations
  // One-to-One relation with UserCredential entity
  @OneToOne(() => UserCredential, (credential) => credential.user)
  credential: Relation<UserCredential>;

  // One-to-Many relation with UserIdentity entity
  @OneToMany(() => UserIdentity, (identity) => identity.user)
  identities: Relation<UserIdentity[]>;

  // One-to-Many relation with UserSession entity
  @OneToMany(() => UserSession, (session) => session.user)
  sessions: Relation<UserSession[]>;

  // Prepare Data Before Insert
  @BeforeInsert()
  prepareDataBeforeInsert() {
    this.prepareNormalizedEmail(this.email);
    this.prepareDisplayName(this.firstName, this.lastName);
  }

  // Private Methods
  private prepareNormalizedEmail(email: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const domain = email.split('@').at(-1)?.toLowerCase();

    if (!domain || !EMAILS_DOMAINS.includes(domain))
      throw new UnprocessableEntityException('Email domain is not allowed');

    this.normalizedEmail = normalizedEmail;
  }

  private prepareDisplayName(firstName: string, lastName: string): void {
    this.displayName = `${firstName} ${lastName}`.trim();
  }
}
