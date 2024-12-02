# Utilisons l'image PHP 8.2 avec FPM

FROM php:8.2-fpm

# Dépendances nécessaires pour PostgreSQL
# Dépendance pour l'extension zip
# Dépendance pour zip 

RUN apt-get update && apt-get install -y \
    libpq-dev \     
    libzip-dev \   
    zlib1g-dev \ 
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Extensions de PHP
RUN docker-php-ext-install pdo pdo_pgsql zip

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/back

COPY . /var/www/back/

# Installer les dépendances de l'application Symfony via Composer
RUN composer install 
#--no-dev --optimize-autoloader

EXPOSE 8000

# Commande pour lancer le serveur
CMD php -S 0.0.0.0:8000 -t public
