FROM node:23-alpine AS build

WORKDIR /app

RUN npm install typescript -g

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Servons le build avec nginx
FROM nginx:alpine

# Copie les fichiers de build générés dans le dossier dist vers le répertoire nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"] 