# Utilisons l'image PHP 8.2 avec FPM
FROM php:8.2-fpm

# Dépendances nécessaires
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*

# Extensions de PHP
RUN docker-php-ext-install pdo pdo_pgsql

# Crée le répertoire de travail
WORKDIR /var/www/html

# Copie les fichiers de l'application dans l'image Docker
COPY . /var/www/html

# Change le propriétaire et le groupe des fichiers, puis applique les bonnes permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Expose le port 9000 (pour PHP-FPM)
EXPOSE 9000

# Démarre PHP-FPM
CMD ["php-fpm"]
