# Installation de l'environnement backend
## Exemple Node.js/Express 
mkdir taskflow-backend
cd taskflow-backend
npm init -y
npm install express bcrypt jsonwebtoken dotenv pg
npm install --save-dev nodemon jest supertest








# **Structure du Backend**
├── Backend
│   ├── package.json
│   ├── src
│   │   ├── app.js
│   │   ├── config
│   │   │   └── database.js
│   │   ├── Controllers
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── models
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   └── routes
│   │       ├── auth.routes.js
│   │       └── task.routes.js
│   └── tests
│       ├── auth.test.js
│       └── task.test.js
├── LICENSE
├── plan_projet.md
├── README.md
└── Structure du backend.md


## Développement de l'authentification

Créer le modèle User
Implémenter le hachage de mot de passe (bcrypt)
Créer l'endpoint d'inscription (POST / api / auth / register)
Créer l'endpoint de connexion (POST /api/auth/login)
Générer les JWT (Access Token + Refresh Token)
Créer le middleware d'authentification

## Sécurité

Validation des éntrées (enail, mot de passe)
Protection contre les injections SQL
Rate limiting 
Configuration CORS

## API CRUD TASKS

## 4.1 Modèle Task

Créer le modèle Task avec validationns
Définir les relations (User - Tasks)

## 4.2 Endpoints de création et lecture

POST /api/tasks - Créer une tâche
GET /api/tasks - Lister toutes les tâches de l'utilisateur
GET /api/tasks/:id - Détails d'une tâche

## 4.3 Validation et gestion d'erreurs

Valider les données d'entrée
Gérer les erreurs (404, 401, 500)
Formater les réponses JSON

## API CRUD Tasks + Tests

## 5.1 Endpoints de mise à jour et suppresion

 PUT /api/tasks/:id - Modifier une tache complète
 PATCH /api/tacks/:id/status - Modifier uniquement les statut
 DELETE/api/tasks/:id - Supprimer une tache.

 ## 5-2 Fonctionnalités avancées

 GET /api/tasks/search?q=keyword - Recherche par mot-clé
 GET /api/tasks/stats - Statistiques (nb total, terminées, en cours)

 ## 5-3 Tests complets

 Tests unitaires des modèles 
 Tests d'intégration des endpoints
 Tests de sécurité (accès non autorisé)
 Tests de sécurité (accès non autorisé)
 Couverture de code > 70%

 ## 5-4 Documentation API

 Documenter tous les endpoints (Swangger/Postman)
 Exemples de requetes/réponses
 Codes d'erreur
 
