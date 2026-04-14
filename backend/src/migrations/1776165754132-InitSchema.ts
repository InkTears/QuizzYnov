import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1776165754132 implements MigrationInterface {
    name = 'InitSchema1776165754132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`option_a\` varchar(255) NOT NULL, \`option_b\` varchar(255) NOT NULL, \`option_c\` varchar(255) NOT NULL, \`option_d\` varchar(255) NOT NULL, \`correct_answer\` enum ('A', 'B', 'C', 'D') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`date\` date NOT NULL, \`score\` int NOT NULL, \`duration\` int NULL, \`completed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UQ_quiz_session_user_date\` (\`user_id\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`quiz_session\` ADD CONSTRAINT \`FK_9fdb55eca0635e04f8605a00639\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quiz_session\` DROP FOREIGN KEY \`FK_9fdb55eca0635e04f8605a00639\``);
        await queryRunner.query(`DROP INDEX \`UQ_quiz_session_user_date\` ON \`quiz_session\``);
        await queryRunner.query(`DROP TABLE \`quiz_session\``);
        await queryRunner.query(`DROP TABLE \`question\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
