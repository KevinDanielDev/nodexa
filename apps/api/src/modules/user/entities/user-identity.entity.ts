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
import { EIdentityProvider } from '../enums/index.js';

@Index('uq_user_identity_provider_subject', ['provider', 'providerSubject'], {
  unique: true,
})
@Index('uq_user_identity_user_provider', ['userId', 'provider'], {
  unique: true,
})
@Entity('user_identities')
export class UserIdentity {
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
    type: 'enum',
    name: 'provider',
    enum: EIdentityProvider,
    nullable: false,
    unique: false,
  })
  provider: EIdentityProvider;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'provider_subject',
    nullable: false,
    unique: false,
  })
  providerSubject: string;

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
  @ManyToOne(() => User, (user) => user.identities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
