# **Conception architecturale d'une application de gestion de taches**

## **1. Introduction**

Il s'agit ici, de concevoir l'architecture d'une application de gestion de taches avec une interface simple, intuitive et lisible, créer les diagrammes d'architecture, définir la structure des dossiers et fichiers, rédiger le document de conception afin de permettre à un utilisateur d'organiser et de suivre ses activités quotidiennes.

## **2. Objectifs**

Les principaux objectifs du projet sont:

- Appliquer les principes d'architecture full stack
- Mise en place d'une architecture 3 tiers
- Définir une API REST Sécurisée
- Séparer clairement les différentes responsabilités
- Produire une documentation de conception détaillée
- Définir les flux de données et responsabilités 
- Gérer l'Interface Responsive
- Gestion de la base de données
- Gestion de l'authentification de la sécuritée

## **3. Besoins Fonctionnels**

### **3.1 Authentification**
 
- Création d'un compte
- Connection sécurisée
- Déconnexion sécurisée
- Protection des routes(accès uniquement aux tâches de l'utilisateur connecté)

### **3.2 Gestion des taches**

- Créer une tâche avec titre, description, priorité, date de création automatique
- Modifier une tâche (titre, description, priorité, statut)
- Supprimer une tâche avec confirmation
- Afficher la liste complète des tâches
- Consulter le détail d'une tâche
- Filtrer par statut
- Rechercher par mot-clé
- Notifications et rappels

## **4. Besoins Non-Fonctionnels**

l'application devra garantir:

- Protection contre les injections SQL
- Validation des données 
- Protection des informations sensibles
- Traitement automatique des requetes 
- Assurer l'intégrité des données
- Gestion fluide des données
- Temps de chargement de page et réponse rapide
- Bonne structuration et compréhension 
- Bonne organisation
- Clarté et simplicité

## **5. Contraintes Techniques**

- Avoir une architecture 3 tiers
- Respecter un modèle client/serveur
- Avoir une communication sécurisée
- Etre accessible sur un navigateur web 
- Sécurité des sessions
- Cohérence des données
- Performance du système
- Versionage
- Etre accessible sur différent système d'exploitation
- Avoir une structure de projet organisée
- Faire une séparation claire entre frontend et backend
- Avoir un diagramme d'architecture

## **6. Architecture du système**

les couches de notre architecture sont les suivantes:

- Front-end: Composants React modulaires, pages(login,dashboard,tasks), gestion de l'état global, communication HTTP avec l'API.
- Back-end: Configuration, Controleurs, services(logique métier), middleware(authentification,validation), gestions des erreurs, models, routes
- Base de données: Modèlisation de données, repositories, base de données relationnelle

Voici un schéma logique démonstratif:

Utilisateur 
    |
    v
Front-end (React.js)
    |API REST
    v
Back-end (Node.js)
    |
    v
Base de données (MongoDB)


### **6.1 Choix des technologies**

les technologies proposées sont les suivantes:

| Couche | Technologie |
|--------|-------------|
| Frontend | React.js |
| Backend | Node.js |
| Base de données | MongoDB |
| Authentification | JWT |
| Communication | API REST |
| Versioning | Git |

### **6.2 Responsabilités de chaque composants**

*Pour le Frontend*
- Affichage et rendu de l'interface utilisateur
- Gestion des interactions utilisateur (clics, saisies, navigation)
- Validation côté client (première ligne de défense)
- Gestion de l'état local de l'application
- Communication avec le back-end via des requêtes HTTP
- Optimisation des performances côté client

*Pour le Backend*
- Traitement de la logique métier complexe
- Authentification et autorisation des utilisateurs
- Validation rigoureuse des données (sécurité)
- Gestion des sessions et des tokens
- Communication avec la base de données
- Exposition d'APIs pour le front-end
- Gestion des erreurs et logging

*Pour la base de données*
- Stockage permanent des données
- Gestion des transactions (ACID)
- Maintien de l'intégrité référentielle
- Optimisation des requêtes et indexation
- Gestion de la concurrence d'accès
- Sauvegarde et récupération des données

## **7. Modélisation des données**

**Table : users**

| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique |
| email | VARCHAR | Email unique |
| password_hash | VARCHAR | Mot de passe haché |
| created_at | DATE | Date de création |


**Table: tasks**

| Champ | Type | Description |
|-------|------|-------------|
| id | INT | Identifiant unique |
| user_id | INT (FK) | Référence à l'utilisateur |
| title | VARCHAR | Titre de la tâche |
| description | TEXT | Description |
| priority | ENUM | low / medium / high |
| status | BOOLEAN | Terminé ou non |
| created_at | DATE | Date de création automatique |


## **8. Endpoints de l'API**

les Endpoints principaux avec implémentation du CRUD sont les suivants:

| CRUD | Méthode | URL | Action | Validation côté serveur |
|------|---------|-----|--------|-------------------------|
| Create | POST | /auth/register | Créer un compte | Username obligatoire (3–30 caractères), email obligatoire , password obligatoire (≥8 caractères, hashé avant stockage) |
| Create | POST | /auth/login | Se connecter | mail obligatoire, password obligatoire, vérification existence utilisateur, comparaison mot de passe hashé |
| Create | POST | /auth/logout | Se déconnecter | utilisateur authentifié requis, token/session valide, invalidation du token |
| Create | POST | /tasks | Créer une tâche |utilisateur authentifié, title obligatoire (3–100 caractères), description ≤500 caractères, status appartient à {Non terminée, Terminée}, valeur par défaut = Non terminée | 
| Read | GET | /tasks | Lire toutes les tâches | utilisateur authentifié, retourner uniquement les tâches du user connecté, pagination, limite max requêtes |
| Read | GET | /tasks/:id | Lire une tâche | utilisateur authentifié, id valide (INT), tâche existe, appartient au user
| Read | GET | /tasks?status= | Filtrer par statut | Utilisateur authentifié, id valide, tâche appartient au user |
| Read | GET | /tasks?search= | Rechercher par mot-clé | Utilisateur authentifié |
| Update | PUT | /tasks/:id | Modifier une tâche | Utilisateur authentifié, id valide, tâche appartient au user, validation champs modifiés |
| Delete | DELETE | /tasks/:id | Supprimer une tâche | Utilisateur authentifié, id valide, tâche existe, appartient au user |

---

## **9. Flux des données**

L’utilisateur interagit avec l’interface
               |
               v  
Le front-end envoie une requête HTTP
               |
               v 
L’API traite la requête
               |
               v  
Les données sont enregistrées ou récupérées
               |
               v  
Une réponse JSON est retournée
               |
               v  
L’interface est mise à jour  

## **10. Structure du projet**

```
├── README.md
├── taskflow/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── frontend/
│       └── src/
│           ├── components/
│           ├── pages/
│           └── services/
```
---

**Explication**

- frontend/ : contient l’interface utilisateur développée avec React.

- components/ : regroupe les composants réutilisables.

- services/ : contient la gestion des appels API.

- pages/ : structure les différentes vues de l’application.

- backend/ : contient la logique serveur.

- controllers/ : gèrent le traitement des requêtes.

- models/ : représentent la structure des données.

- routes/ : définissent les endpoints REST.

- config/ : contient la configuration de la base de données.

## **11. Conclusion**

Ce projet nous permettra de concevoir, de developper et de maintenir des applications complétes front-end / 
back-end , sécurisées, performantes et l'évolution en s'appuyant sur une architure cohérente.De ce fait, ce 
cahier des charges définira les fonctionnalitées essentielles pour garantir une gestion de tâches fluide et 
intuitive. Cependant, ce document servira de guide de référence tout au long du développement pour s'assurer 
que l'application finale réponde parfaitement aux besoins d'organisation et de productivité identifiés.