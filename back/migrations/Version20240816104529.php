<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240816104529 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE categories_questions DROP CONSTRAINT fk_d50f2274a21214b7');
        $this->addSql('ALTER TABLE categories_questions DROP CONSTRAINT fk_d50f2274bcb134ce');
        $this->addSql('DROP TABLE categories_questions');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE categories_questions (categories_id INT NOT NULL, questions_id INT NOT NULL, PRIMARY KEY(categories_id, questions_id))');
        $this->addSql('CREATE INDEX idx_d50f2274bcb134ce ON categories_questions (questions_id)');
        $this->addSql('CREATE INDEX idx_d50f2274a21214b7 ON categories_questions (categories_id)');
        $this->addSql('ALTER TABLE categories_questions ADD CONSTRAINT fk_d50f2274a21214b7 FOREIGN KEY (categories_id) REFERENCES categories (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE categories_questions ADD CONSTRAINT fk_d50f2274bcb134ce FOREIGN KEY (questions_id) REFERENCES questions (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
