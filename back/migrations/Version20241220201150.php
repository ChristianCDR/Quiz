<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241220201150 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ADD refresh_token_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ALTER profile_photo DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649F765F60E FOREIGN KEY (refresh_token_id) REFERENCES refresh_token (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F765F60E ON "user" (refresh_token_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649F765F60E');
        $this->addSql('DROP INDEX UNIQ_8D93D649F765F60E');
        $this->addSql('ALTER TABLE "user" DROP refresh_token_id');
        $this->addSql('ALTER TABLE "user" ALTER profile_photo SET DEFAULT \'filename.jpg\'');
    }
}
