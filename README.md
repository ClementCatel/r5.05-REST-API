# R5.05 – Concevoir et sécuriser une API REST

Code du cours R5.05 consacré à la conception et à la sécurisation d’une API REST avec [Hono](https://hono.dev).

## Organisation du dépôt

Chaque partie du cours dispose de deux branches.

- `partie-N` contient le code obtenu à la fin de la partie, avant l’exercice.
- `partie-N-solution` contient le même code, complété par la solution de l’exercice.

| Partie | Code du cours | Solution de l’exercice |
| --- | --- | --- |
| 1. Créer un serveur HTTP avec Node.js | `partie-1` | `partie-1-solution` |
| 2. Mise en place d’une API avec Hono | `partie-2` | `partie-2-solution` |
| 3. Structurer l’API (routeurs, middlewares et erreurs) | `partie-3` | `partie-3-solution` |
| 4. Valider les données reçues | `partie-4` | `partie-4-solution` |
| 5. Persister les données avec SQLite | `partie-5` | `partie-5-solution` |
| 6. Authentifier les utilisateurs | `partie-6` | `partie-6-solution` |
| 7. Protéger les routes avec un token JWT | `partie-7` | `partie-7-solution` |
| 8. Gérer les autorisations | `partie-8` | `partie-8-solution` |

Le code est réparti dans deux dossiers.

- `server-node/` contient le serveur de la partie 1, écrit avec le module `http` de Node.js.
- `api-hono/` contient l’API construite avec Hono à partir de la partie 2.

## Lancer le code

Pour la partie 1 :

```bash
cd server-node
node --watch server.js
```

À partir de la partie 2 :

```bash
cd api-hono
npm install
npm run dev
```

L’API est ensuite accessible sur [http://localhost:8000](http://localhost:8000).

À partir de la partie 5, le module `node:sqlite` nécessite Node.js 22.13 ou plus récent.

À partir de la partie 7, créez d’abord un fichier `api-hono/.env` contenant la variable `JWT_SECRET`, comme indiqué dans le cours. Ce fichier n’est pas versionné.
