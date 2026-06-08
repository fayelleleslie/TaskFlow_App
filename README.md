# TaskFlow_App
TaskFlow est une application web complète de gestion de tâches qui permet aux utilisateurs de créer, organiser et suivre leurs tâches quotidiennes.


# Stack Technique Final

- Frontend : React.js

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

- Outils : Git, Postman, Nodemon, Dotenv, figma  

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

## Pré-requis
- Node.js installé
- MongoDB local

## Installation du Backend

1. Cloner le projet sur son terminal:
   - bash
   - git clone <url-du-repo>
   - Aller dans le dossier du projet : cd TaskFlow 
   - Aller dans le dossier backend : cd backend
2. Installer les dépendances : npm install puis npm run dev

3. Configuration des variables d'environnement : 
   Créer un fichier .env à la racine du dossier backend :
   - PORT=3000
   - MONGO_URI=votre_lien_mongodb (obligatoire)
   - JWT_SECRET=votre_secret_ultra_securise (obligatoire)
    
4. Installer les package.json : 
   - npm init
   - npm init -y

5. Lancement de l'application :
   -  npm run dev
  
## Installation du frontend





















## Notes importantes
- Le backend utilise un flux access token (JWT) + refresh token stocké en cookie httpOnly. Le cookie est envoyé sur le domaine frontend configuré via FRONTEND_URL.
- Les refresh tokens sont persistés en base et sont rotatifs (rotation + révocation). Le logout révoque le refresh token et ajoute l'access token à une blacklist temporaire.
- Les reminders (rappels) fonctionnent via une queue Bull si REDIS_URL est fourni. Sans Redis, un service de polling local s'exécute en arrière-plan (moins scalable).
- Un sanitizer custom est utilisé pour empêcher les injections NoSQL (les dépendances express-mongo-sanitize ont été évitées pour compatibilité Express v5).
 
 
## Déploiement / production
- Assurez-vous que MONGO_URI et JWT_SECRET sont définis.
- Fournissez REDIS_URL en production pour la queue de rappel.
- Servez le frontend via HTTPS et configurez le backend derrière un reverse proxy (ex: Nginx) avec TLS.
- Restreignez FRONTEND_URL en CORS pour le domaine de production.
- Configurez un job de nettoyage TTL pour les tokens blacklistés et les refresh tokens révoqués si nécessaire.

## Tests et vérifications rapides (smoke)
1. Créer un utilisateur (POST /api/auth/register).
2. Se connecter (POST /api/auth/login) — vérifiez que Set-Cookie: refreshToken est présent.
3. Accéder à une route protégée avec Authorization: Bearer <accessToken>.
4. Forcer POST /api/auth/refresh en envoyant le cookie pour obtenir un nouvel access token.
5. Logout (POST /api/auth/logout) — vérifiez que l'accès est ensuite refusé pour l'ancien access token.


# Répartition des roles:

Leslie — Architecture + Documentation + Frontend 
Sandra — Backend + Base de données + Authentification
