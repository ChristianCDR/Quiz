<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241220204317 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE refresh_token ADD user_identifier_id INT NOT NULL');
        $this->addSql('ALTER TABLE refresh_token DROP user_identifier');
        $this->addSql('ALTER TABLE refresh_token ADD CONSTRAINT FK_C74F21951F7E0A6 FOREIGN KEY (user_identifier_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C74F21951F7E0A6 ON refresh_token (user_identifier_id)');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT fk_8d93d649f765f60e');
        $this->addSql('DROP INDEX uniq_8d93d649f765f60e');
        $this->addSql('ALTER TABLE "user" DROP refresh_token_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE refresh_token DROP CONSTRAINT FK_C74F21951F7E0A6');
        $this->addSql('DROP INDEX UNIQ_C74F21951F7E0A6');
        $this->addSql('ALTER TABLE refresh_token ADD user_identifier VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE refresh_token DROP user_identifier_id');
        $this->addSql('ALTER TABLE "user" ADD refresh_token_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT fk_8d93d649f765f60e FOREIGN KEY (refresh_token_id) REFERENCES refresh_token (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX uniq_8d93d649f765f60e ON "user" (refresh_token_id)');
    }
}
