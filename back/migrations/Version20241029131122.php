<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241029131122 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_score ALTER quiz_id DROP DEFAULT');
        $this->addSql('ALTER TABLE user_score ALTER score_rate DROP DEFAULT');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D05BCC09853CD175 ON user_score (quiz_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX UNIQ_D05BCC09853CD175');
        $this->addSql('ALTER TABLE user_score ALTER quiz_id SET DEFAULT 1');
        $this->addSql('ALTER TABLE user_score ALTER score_rate SET DEFAULT 100');
    }
}
