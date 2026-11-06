import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity.js';

@Entity('user_credentials')
export class UserCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'text',
    name: 'password_hash',
    nullable: false,
    unique: false,
  })
  passwordHash: string;

  @Column({
    type: 'timestamptz',
    name: 'password_changed_at',
    nullable: true,
    unique: false,
    default: null,
  })
  passwordChangedAt: Date | null;

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
  updatedAt: Date;

  // Relations
  // One-to-One relation with User entity
  @OneToOne(() => User, (user) => user.credential, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
