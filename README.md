# TaskFlow_App
TaskFlow est une application web complète de gestion de tâches qui permet aux utilisateurs de créer, organiser et suivre leurs tâches quotidiennes.


# Stack Technique Final

- Frontend :
  -React.js
  -Tailwindcss
  -Axios
  -Toastify
  -React Router

- Backend : 
 * Environnement : Node.js,
 * Framework Express.js

- Base de données : MongoDB (via Mongoose ODM)

- Sécurité : 
 * Authentification : JWT (JSON Web Tokens), 
 * Hachage de mots de passe : Bcryptjs,
 * Validation : Express-Validator, 
 * Protection : Helmet, CORS , Mongo-Sanitize

- Architecture : MVC (Model-View-Controller) / Folder-by-Feature

- Communication : API REST

- Outils : Git, Postman, Nodemon, Dotenv

# Fonctionnalités
- Inscription et Connexion sécurisées (Hachage Bcrypt)
- Authentification par Token JWT (Access & Refresh)
- CRUD complet des tâches (Créer, Lire, Modifier, Supprimer)
- Protection des routes par Middleware
- Validation des entrées et protection NoSQL Injection

# Architecture du Projet
Le backend suit une structure modulaire pour une meilleure maintenabilité :

- src/models/ : Schémas de données MongoDB.
- src/controllers/ : Logique métier (Auth, Tasks).
- src/routes/ : Définition des points d'entrée de l'API.
- src/middleware/ : Sécurité et vérification des tokens.
- src/config/ : Configuration de la base de données.
- test : gestion des test (Auth, Tasks).
- Package.json : description du projet et la gestion des dépendances( gestion des library du projet) 
- .env : sert à stocker des variables d'environnement ou de configuration, c'est pour la protection des données sensibles
- .gitignore : signaler à Git quels fichiers ou dossier il doit ignorer

# Installation et Lancement

## Installation du Backend

### Pré-requis
- Node.js installé
- MongoDB local

1. Cloner le projet sur son terminal:
   - bash
   - git clone <url-du-repo>
   - Aller dans le dossier du projet : cd TaskFlow 
   - Aller dans le dossier backend : cd backend
2. Installer les dépendances : npm install

3. Configuration des variables d'environnement : 
   Créer un fichier .env à la racine du dossier backend :
   - PORT=3000
   - MONGO_URI=votre_lien_mongodb
   - JWT_SECRET=votre_secret_ultra_securise

4. Installer les package.json : 
   - npm init
   - npm init -y

5. Lancement de l'application :
   -  npm run dev


# Répartition des roles:

Leslie — Architecture + Documentation + Frontend 
Sandra — Backend + Base de données + Authentification
