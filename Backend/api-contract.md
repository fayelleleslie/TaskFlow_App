# Contrat d'Interface API - TaskFlow

**Base URL:** `http://127.0.0.1:3000/api`


## 1. Authentification

### POST /auth/register
* **Description:** Création d'un nouveau compte utilisateur.
* **Request Body (JSON):**
    ```json
    {
      "username": "SandraDev",
      "email": "sandra@example.com",
      "password": "SecretPassword123"
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "message": "Utilisateur créé avec succès !"
    }
    ```

### POST /auth/login
* **Description:** Connexion de l'utilisateur.
* **Success Response (200 OK):**
    ```json
    {
      "accessToken": "eyJhbGci...",
      "user": {
        "id": "65f1...",
        "username": "SandraDev"
      }
    }
    ```


## 2. Tâches (Tasks)

### GET /tasks
* **Description:** Récupérer les tâches de l'utilisateur (avec filtres optionnels).
* **Query Params:** `status` (Non terminée|Terminée), `search` (string)
* **Success Response (200 OK):**
    ```json
    [
      {
        "_id": "65f2...",
        "title": "Finir le contrat API",
        "description": "Détailler les JSON pour Leslie",
        "status": "Non terminée",
        "createdAt": "2026-04-15T..."
      }
    ]
    ```

### POST /tasks
* **Description:** Créer une nouvelle tâche.
* **Request Body (JSON):**
    ```json
    {
      "title": "Apprendre React",
      "description": "Suivre le tuto sur les Hooks",
      "status": "Non terminée"
    }
    ```