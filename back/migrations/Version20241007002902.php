<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241007002902 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE categories_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE options_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE questions_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE refresh_token_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_score_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE categories (id INT NOT NULL, category_name VARCHAR(255) NOT NULL, category_image VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE options (id INT NOT NULL, question_id INT NOT NULL, is_correct BOOLEAN NOT NULL, option_text TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D035FA871E27F6BF ON options (question_id)');
        $this->addSql('CREATE TABLE questions (id INT NOT NULL, question_text TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE questions_categories (questions_id INT NOT NULL, categories_id INT NOT NULL, PRIMARY KEY(questions_id, categories_id))');
        $this->addSql('CREATE INDEX IDX_A787FFE4BCB134CE ON questions_categories (questions_id)');
        $this->addSql('CREATE INDEX IDX_A787FFE4A21214B7 ON questions_categories (categories_id)');
        $this->addSql('CREATE TABLE refresh_token (id INT NOT NULL, token VARCHAR(255) NOT NULL, user_identifier VARCHAR(255) NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, user_name VARCHAR(255) NOT NULL, is_verified BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE TABLE user_score (id INT NOT NULL, player_id INT NOT NULL, scores TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D05BCC0999E6F5DF ON user_score (player_id)');
        $this->addSql('COMMENT ON COLUMN user_score.scores IS \'(DC2Type:array)\'');
        $this->addSql('ALTER TABLE options ADD CONSTRAINT FK_D035FA871E27F6BF FOREIGN KEY (question_id) REFERENCES questions (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE questions_categories ADD CONSTRAINT FK_A787FFE4BCB134CE FOREIGN KEY (questions_id) REFERENCES questions (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE questions_categories ADD CONSTRAINT FK_A787FFE4A21214B7 FOREIGN KEY (categories_id) REFERENCES categories (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_score ADD CONSTRAINT FK_D05BCC0999E6F5DF FOREIGN KEY (player_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE categories_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE options_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE questions_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE refresh_token_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE user_score_id_seq CASCADE');
        $this->addSql('ALTER TABLE options DROP CONSTRAINT FK_D035FA871E27F6BF');
        $this->addSql('ALTER TABLE questions_categories DROP CONSTRAINT FK_A787FFE4BCB134CE');
        $this->addSql('ALTER TABLE questions_categories DROP CONSTRAINT FK_A787FFE4A21214B7');
        $this->addSql('ALTER TABLE user_score DROP CONSTRAINT FK_D05BCC0999E6F5DF');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE options');
        $this->addSql('DROP TABLE questions');
        $this->addSql('DROP TABLE questions_categories');
        $this->addSql('DROP TABLE refresh_token');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE user_score');
    }
}
