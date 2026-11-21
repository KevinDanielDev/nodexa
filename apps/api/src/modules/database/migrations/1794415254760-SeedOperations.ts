import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOperations1794415254760 implements MigrationInterface {
  name = 'SeedOperations1794415254760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."seed_operations_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "seed_operations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" text NOT NULL, "resource" character varying(150) NOT NULL, "status" "public"."seed_operations_status_enum" NOT NULL DEFAULT 'PENDING', "metadata" jsonb DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "completed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_bcd2bf4ab6c40ed18f087faca8c" UNIQUE ("key"), CONSTRAINT "PK_c61fafdf511fd26fded2d7764d2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "seed_operations"`);
    await queryRunner.query(`DROP TYPE "public"."seed_operations_status_enum"`);
  }
}
