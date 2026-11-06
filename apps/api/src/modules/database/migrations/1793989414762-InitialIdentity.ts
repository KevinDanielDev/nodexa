import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialIdentity1793989414762 implements MigrationInterface {
    name = 'InitialIdentity1793989414762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "user_credentials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "password_hash" text NOT NULL, "password_changed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_dd0918407944553611bb3eb3dd" UNIQUE ("user_id"), CONSTRAINT "PK_5cadc04d03e2d9fe76e1b44eb34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_identities_provider_enum" AS ENUM('google')`);
        await queryRunner.query(`CREATE TABLE "user_identities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "provider" "public"."user_identities_provider_enum" NOT NULL, "provider_subject" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e23bff04e9c3e7b785e442b262c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_user_identity_user_provider" ON "user_identities"  ("user_id", "provider") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_user_identity_provider_subject" ON "user_identities"  ("provider", "provider_subject") `);
        await queryRunner.query(`CREATE TABLE "user_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "last_used_at" TIMESTAMP WITH TIME ZONE, "revoked_at" TIMESTAMP WITH TIME ZONE, "user_agent" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6596adb3b8927b35bda97e734aa" UNIQUE ("token_hash"), CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_session_expires_at" ON "user_sessions"  ("expires_at") `);
        await queryRunner.query(`CREATE INDEX "idx_user_session_user_id" ON "user_sessions"  ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'suspended', 'disabled')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(254) NOT NULL, "normalized_email" character varying(254) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "display_name" character varying(150), "avatar_url" text, "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "email_verified_at" TIMESTAMP WITH TIME ZONE, "last_login_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_004558cea14a9f05ae8284bdb8f" UNIQUE ("normalized_email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_credentials" ADD CONSTRAINT "FK_dd0918407944553611bb3eb3ddc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_identities" ADD CONSTRAINT "FK_bf5fe01eb8cad7114b4c371cdc7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_e9658e959c490b0a634dfc54783" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_e9658e959c490b0a634dfc54783"`);
        await queryRunner.query(`ALTER TABLE "user_identities" DROP CONSTRAINT "FK_bf5fe01eb8cad7114b4c371cdc7"`);
        await queryRunner.query(`ALTER TABLE "user_credentials" DROP CONSTRAINT "FK_dd0918407944553611bb3eb3ddc"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_session_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_session_expires_at"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
        await queryRunner.query(`DROP INDEX "public"."uq_user_identity_provider_subject"`);
        await queryRunner.query(`DROP INDEX "public"."uq_user_identity_user_provider"`);
        await queryRunner.query(`DROP TABLE "user_identities"`);
        await queryRunner.query(`DROP TYPE "public"."user_identities_provider_enum"`);
        await queryRunner.query(`DROP TABLE "user_credentials"`);
    }

}
