# Utilise une image Node officielle comme image de base
FROM node:20

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .

# Expose le port utilisé par l'application Express
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]