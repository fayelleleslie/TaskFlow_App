# TaskFlow App

Petit guide pour installer et lancer l'application TaskFlow (Backend + Frontend).

## Prérequis
- Node.js (>=18 recommandé)
- npm
- MongoDB (URI de connexion)
- Optionnel en prod: Redis (pour Bull), un serveur SMTP (pour envoi d'e-mails)

## Structure
- `Backend/` : API Express + Mongoose
- `frontend/` : client React + Vite

## Variables d'environnement
Copiez `.env.example` et renseignez les valeurs essentielles :

- `MONGO_URI` (obligatoire)
- `JWT_SECRET` (obligatoire)
- `FRONTEND_URL` (ex: http://localhost:5173)
- `REDIS_URL` (optionnel pour Bull)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optionnel pour envoi d'e-mails)
- `ADMIN_API_KEY` (pour endpoints admin)

## Installation & lancement (dev)

Backend
```bash
cd Backend
npm install
npm run dev
```

Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes importantes
- Le backend utilise un flux `access token` (JWT) + `refresh token` stocké en cookie httpOnly. Le cookie est envoyé sur le domaine frontend configuré via `FRONTEND_URL`.
- Les refresh tokens sont persistés en base et sont rotatifs (rotation + révocation). Le logout révoque le refresh token et ajoute l'access token à une blacklist temporaire.
- Les reminders (rappels) fonctionnent via une queue Bull si `REDIS_URL` est fourni. Sans Redis, un service de polling local s'exécute en arrière-plan (moins scalable).
- Un sanitizer custom est utilisé pour empêcher les injections NoSQL (les dépendances `express-mongo-sanitize` ont été évitées pour compatibilité Express v5).

## Déploiement / production
- Assurez-vous que `MONGO_URI` et `JWT_SECRET` sont définis.
- Fournissez `REDIS_URL` en production pour la queue de rappel.
- Servez le frontend via HTTPS et configurez le backend derrière un reverse proxy (ex: Nginx) avec TLS.
- Restreignez `FRONTEND_URL` en CORS pour le domaine de production.
- Configurez un job de nettoyage TTL pour les tokens blacklistés et les refresh tokens révoqués si nécessaire.

## Tests et vérifications rapides (smoke)
1. Créer un utilisateur (`POST /api/auth/register`).
2. Se connecter (`POST /api/auth/login`) — vérifiez que `Set-Cookie: refreshToken` est présent.
3. Accéder à une route protégée avec `Authorization: Bearer <accessToken>`.
4. Forcer `POST /api/auth/refresh` en envoyant le cookie pour obtenir un nouvel access token.
5. Logout (`POST /api/auth/logout`) — vérifiez que l'accès est ensuite refusé pour l'ancien access token.

### Exécuter les tests smoke automatisés

Un jeu de tests smoke (`jest` + `supertest`) est fourni dans `Backend/tests/`.

- Par défaut, les tests essaient d'utiliser `mongodb-memory-server` (base en mémoire). Sur certaines distributions Linux, le binaire MongoDB embarqué nécessite `libcrypto.so.1.1` / OpenSSL 1.1. Si l'instance en mémoire échoue à démarrer avec une erreur liée à `libcrypto`, vous pouvez :
	- installer la bibliothèque système correspondante (par ex. `libssl1.1` ou `libssl1.1` package selon votre distribution), ou
	- définir `MONGO_URI` vers une base MongoDB locale/accessible avant de lancer les tests.

Exemples :

```bash
# utiliser une MongoDB locale existante
export MONGO_URI=mongodb://127.0.0.1:27017/taskflow_test
cd Backend
npm run test:smoke

# ou (si votre OS supporte mongodb-memory-server)
cd Backend
npm run test:smoke
```

## Besoin d'aide ?
Voulez-vous que je :
- ajoute des tests automatisés pour les flows `auth` et `reminders`, ou
- configure des exemples `docker-compose` pour MongoDB + Redis pour reproduire l'environnement prod localement ?
