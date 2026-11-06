import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity.js';

@Index('idx_user_session_user_id', ['userId'])
@Index('idx_user_session_expires_at', ['expiresAt'])
@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
    unique: false,
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'token_hash',
    nullable: false,
    unique: true,
  })
  tokenHash: string;

  @Column({
    type: 'timestamptz',
    name: 'expires_at',
    nullable: false,
    unique: false,
  })
  expiresAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'last_used_at',
    nullable: true,
    unique: false,
    default: null,
  })
  lastUsedAt: Date | null;

  @Column({
    type: 'timestamptz',
    name: 'revoked_at',
    nullable: true,
    unique: false,
    default: null,
  })
  revokedAt: Date | null;

  @Column({
    type: 'text',
    name: 'user_agent',
    nullable: true,
    unique: false,
    default: null,
  })
  userAgent: string | null;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
    unique: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // Relations
  // Many-to-One relation with User entity
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
