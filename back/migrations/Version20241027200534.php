<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241027200534 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX uniq_d05bcc0999e6f5df');
        $this->addSql('ALTER TABLE user_score ADD quiz_id INT NOT NULL DEFAULT 1');
        $this->addSql('ALTER TABLE user_score ADD score_rate INT NOT NULL DEFAULT 100');
        $this->addSql('ALTER TABLE user_score DROP scores');
        $this->addSql('CREATE INDEX IDX_D05BCC0999E6F5DF ON user_score (player_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX IDX_D05BCC0999E6F5DF');
        $this->addSql('ALTER TABLE user_score ADD scores TEXT NOT NULL');
        $this->addSql('ALTER TABLE user_score DROP quiz_id');
        $this->addSql('ALTER TABLE user_score DROP score_rate');
        $this->addSql('COMMENT ON COLUMN user_score.scores IS \'(DC2Type:array)\'');
        $this->addSql('CREATE UNIQUE INDEX uniq_d05bcc0999e6f5df ON user_score (player_id)');
    }
}
