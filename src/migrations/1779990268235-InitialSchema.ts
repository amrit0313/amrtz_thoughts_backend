import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1779990268235 implements MigrationInterface {
  name = 'InitialSchema1779990268235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "thought_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "thoughtId" integer, CONSTRAINT "UQ_017c3f3a868a939ae3eb94b2a1b" UNIQUE ("userId", "thoughtId"), CONSTRAINT "PK_1e2c980a4194b1e910c7f694616" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "thought_share" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "thoughtId" integer, CONSTRAINT "PK_5169f366dadca758c4cf562e878" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "thoughts" ("id" SERIAL NOT NULL, "thought" character varying NOT NULL, "likeCount" integer NOT NULL DEFAULT '0', "shareCount" integer NOT NULL DEFAULT '0', "user_id" integer, CONSTRAINT "PK_0ba624def0c7fea81660f5786d4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."friendships_status_enum" AS ENUM('pending', 'accepted', 'declined', 'blocked', 'unfriended')`,
    );
    await queryRunner.query(
      `CREATE TABLE "friendships" ("id" SERIAL NOT NULL, "status" "public"."friendships_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer, "receiverId" integer, CONSTRAINT "PK_08af97d0be72942681757f07bc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_genre_enum" AS ENUM('romantic', 'thriller', 'literature', 'comedy', 'fantasy', 'humor', 'news', 'introvert')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "genre" "public"."user_genre_enum" NOT NULL DEFAULT 'comedy'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profilePic" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_like" ADD CONSTRAINT "FK_2fe18bcbd48b228044aee80bb46" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_like" ADD CONSTRAINT "FK_cf264a4878b725027576900a81b" FOREIGN KEY ("thoughtId") REFERENCES "thoughts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_share" ADD CONSTRAINT "FK_608dc5bed97b7149b998c34352b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_share" ADD CONSTRAINT "FK_4ce9350da746ceb24ef633504f8" FOREIGN KEY ("thoughtId") REFERENCES "thoughts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "thoughts" ADD CONSTRAINT "FK_e4b9c780595aeebbe53ff3046fe" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" ADD CONSTRAINT "FK_02ebdc40b6af5b1621300a3bf38" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" ADD CONSTRAINT "FK_76977c4ed1415e3b1cdf7848a8c" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friendships" DROP CONSTRAINT "FK_76977c4ed1415e3b1cdf7848a8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friendships" DROP CONSTRAINT "FK_02ebdc40b6af5b1621300a3bf38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "thoughts" DROP CONSTRAINT "FK_e4b9c780595aeebbe53ff3046fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_share" DROP CONSTRAINT "FK_4ce9350da746ceb24ef633504f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_share" DROP CONSTRAINT "FK_608dc5bed97b7149b998c34352b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_like" DROP CONSTRAINT "FK_cf264a4878b725027576900a81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "thought_like" DROP CONSTRAINT "FK_2fe18bcbd48b228044aee80bb46"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePic"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "genre"`);
    await queryRunner.query(`DROP TYPE "public"."user_genre_enum"`);
    await queryRunner.query(`DROP TABLE "friendships"`);
    await queryRunner.query(`DROP TYPE "public"."friendships_status_enum"`);
    await queryRunner.query(`DROP TABLE "thoughts"`);
    await queryRunner.query(`DROP TABLE "thought_share"`);
    await queryRunner.query(`DROP TABLE "thought_like"`);
  }
}
