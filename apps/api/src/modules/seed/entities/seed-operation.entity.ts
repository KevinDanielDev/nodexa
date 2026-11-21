import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ESeedStatus } from '../enums/seed-status.enum.js';

@Entity('seed_operations')
export class SeedOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'key',
    type: 'text',
    nullable: false,
    unique: true,
  })
  key: string;

  @Column({
    name: 'resource',
    type: 'varchar',
    length: 150,
    nullable: false,
    unique: false,
  })
  resource: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ESeedStatus,
    default: ESeedStatus.PENDING,
  })
  status: ESeedStatus;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    nullable: true,
    default: {},
  })
  metadata: Record<string, unknown> | null;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  completedAt: Date | null;
}
