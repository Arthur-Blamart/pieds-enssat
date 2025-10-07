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

# Expose le port utilisé par Vite
EXPOSE 5173

# Commande pour démarrer l'application avec l'host configuré pour Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]