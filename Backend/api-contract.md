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
      "message": "Utilisateur créé avec succès"
    }
    ```

### POST /auth/login
* **Description:** Connexion de l'utilisateur.
* **Success Response (200 OK):**
    ```json
    {
      "message": "Connexion réussie !",
      "token": "eyJhbGci...",
      "user": {
        "id": "65f1...",
        "username": "SandraDev",
        "email": "sandra@example.com"
      }
    }
    ```

### POST /auth/logout
* **Description:** Déconnexion côté client. Le token JWT est stateless : le client doit supprimer le token stocké.
* **Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
    ```json
    {
      "message": "Déconnexion réussie. Supprime le token côté client pour terminer la session."
    }
    ```


## 2. Tâches (Tasks)

### GET /tasks
* **Description:** Récupérer les tâches de l'utilisateur connecté avec filtres et pagination.
* **Headers:** `Authorization: Bearer <token>`
* **Query Params:** `status` (`Non terminee`|`En cours`|`Terminee`|`all`), `search` (string), `page` (number), `limit` (number, max 100)
* **Success Response (200 OK):**
    ```json
    {
      "tasks": [
        {
          "_id": "65f2...",
          "title": "Finir le contrat API",
          "description": "Détailler les JSON pour Leslie",
          "priority": "moyenne",
          "status": "Non terminee",
          "dueDate": null,
          "reminderAt": null,
          "createdAt": "2026-04-15T..."
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "totalPages": 1
      }
    }
    ```

### POST /tasks
* **Description:** Créer une nouvelle tâche.
* **Request Body (JSON):**
    ```json
    {
      "title": "Apprendre React",
      "description": "Suivre le tuto sur les Hooks",
      "priority": "moyenne",
      "status": "Non terminee",
      "dueDate": "2026-06-10T10:00:00.000Z",
      "reminderAt": "2026-06-10T09:00:00.000Z"
    }
    ```

### GET /tasks/:id
* **Description:** Consulter une tâche précise appartenant à l'utilisateur connecté.
* **Headers:** `Authorization: Bearer <token>`

### PUT /tasks/:id
* **Description:** Modifier une tâche appartenant à l'utilisateur connecté.
* **Headers:** `Authorization: Bearer <token>`

### DELETE /tasks/:id
* **Description:** Supprimer une tâche appartenant à l'utilisateur connecté.
* **Headers:** `Authorization: Bearer <token>`
