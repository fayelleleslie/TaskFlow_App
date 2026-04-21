# TaskFlow_App - Application de gestion de taches

TaskFlow est une solution Full-Stack moderne conçue pour organiser et suivre vos tâches quotidiennes. Ce projet a été réalisé dans le cadre de la 3ème année de Bachelor en Conception et Développement d'Applications (CDA).

## Description

TaskFlow est une application web complète de gestion de tâches qui permet aux utilisateurs de créer des comptes,de s'authentifier de manière unique, organiser et suivre leurs tâches quotidiennes de manière sécurisée.L'accent a été mis sur la sécurité (hachage, tokens, validations) et sur une architecture backend robuste.

## Répartition des roles:

Leslie — Architecture + Documentation + Frontend et Sandra — Backend + Base de données + Authentification

## Stack Technique Final
* **Frontend :** React.js
* **Backend :** Node.js/Express.js
* **Base de données :** MongoDB (Mongoose ODM)
* **Sécurité:** 
   - Hachage de mots de passe : Bcryptjs 
   - Authentification : JWT (JSON Web Tokens) 
   - Validation : Express-Validator
   - Protection : Helmet, CORS, Mongo-Sanitize
* **Architecture :** MVC (Model-View-Controller)
* **Communication :** API REST
* **Versionning :** Git
* **Outils :** Postman, Nodemon, Dontenv

## Fonctionnalités
- Inscription et Connexion sécurisées (Hachage Bcrypt)
- Authentification par Token JWT (Access & Refresh)
- CRUD complet des tâches (Créer, Lire, Modifier, Supprimer)
- Protection des routes par Middleware
- Validation des entrées et protection NoSQL Injection

## Architecture du Projet
Le backend suit une structure modulaire pour une meilleure maintenabilité :
- `src/models/` : Schémas de données MongoDB.
- `src/controllers/` : Logique métier (Auth, Tasks) et lanipulation des données.
- `src/routes/` : Définition des points d'entrée de l'API (Endpoints).
- `src/middleware/` : Filtré la Sécurité (Auth, Validation) et vérification des tokens.
- `src/config/` : Configuration de la base de données.
- .gitignore : Signale à Git d'ignorer les fichiers ou dossiers sensibles.
- .env : Stocker des variables d'environnement
- Package.json : description du projet et gestion des dépendances
- Test : Efectuer les différents test
## Installation et Lancement

### Pré-requis
- Node.js installé
- MongoDB localsssss

### Installation du Backend
1. **Cloner le projet :**
   ```bash
   git clone <url-du-repo>
2. Aller dans le dossier backend : `cd backend`
3. Installer les dépendances : `npm install`
4. Créer un fichier `.env` à la racine du dossier backend pour configurer l'environnement:
   ```env
   PORT=3000
   MONGO_URI=votre_lien_mongodb
   JWT_SECRET=votre_secret_ultra_securise
5. Lancer le serveur: npm run dev   