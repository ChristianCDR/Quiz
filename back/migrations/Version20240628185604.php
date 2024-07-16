<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240628185604 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE answers_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE categories_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE questions_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE answers (id INT NOT NULL, questions_id INT DEFAULT NULL, answer_text TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_50D0C606BCB134CE ON answers (questions_id)');
        $this->addSql('CREATE TABLE categories (id INT NOT NULL, category_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE categories_questions (categories_id INT NOT NULL, questions_id INT NOT NULL, PRIMARY KEY(categories_id, questions_id))');
        $this->addSql('CREATE INDEX IDX_D50F2274A21214B7 ON categories_questions (categories_id)');
        $this->addSql('CREATE INDEX IDX_D50F2274BCB134CE ON categories_questions (questions_id)');
        $this->addSql('CREATE TABLE questions (id INT NOT NULL, question_text TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('ALTER TABLE answers ADD CONSTRAINT FK_50D0C606BCB134CE FOREIGN KEY (questions_id) REFERENCES questions (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE categories_questions ADD CONSTRAINT FK_D50F2274A21214B7 FOREIGN KEY (categories_id) REFERENCES categories (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE categories_questions ADD CONSTRAINT FK_D50F2274BCB134CE FOREIGN KEY (questions_id) REFERENCES questions (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE answers_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE categories_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE questions_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE answers DROP CONSTRAINT FK_50D0C606BCB134CE');
        $this->addSql('ALTER TABLE categories_questions DROP CONSTRAINT FK_D50F2274A21214B7');
        $this->addSql('ALTER TABLE categories_questions DROP CONSTRAINT FK_D50F2274BCB134CE');
        $this->addSql('DROP TABLE answers');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE categories_questions');
        $this->addSql('DROP TABLE questions');
        $this->addSql('DROP TABLE "user"');
    }
}
