FROM debian:bookworm

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    postfix \
    mailutils \
    && apt-get clean

COPY main.cf /etc/postfix/

# Exposer les ports SMTP (25, 587 pour l'envoi)
EXPOSE 25 587

# Lancer postfix en mode serveur
CMD ["postfix", "start-fg"]
