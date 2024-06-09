FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Rebuild bcrypt à partir du source
RUN npm rebuild bcrypt --build-from-source

# Copier le reste des fichiers
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
