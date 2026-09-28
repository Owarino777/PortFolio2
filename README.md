# Portfolio Astro — démonstration API

Cette branche `portfolio-api-demo` est une démonstration séparée du site déjà en production. Le frontend reste dans ce dépôt GitHub ; le backend Express se trouve dans le dépôt distinct `PortFolio2-API` et possède son propre projet Vercel.

## Développement local

Sous Windows PowerShell, utilisez `npm.cmd` si la politique d'exécution bloque `npm.ps1`.

1. Démarrez le backend dans `C:\Users\malik\Developpement\PortFolio2-API` avec `npm.cmd run dev` ; il écoute sur `http://localhost:3000`.
2. Dans ce dossier, créez une configuration locale et démarrez Astro :

```powershell
cd C:\Users\malik\Developpement\PortFolio2
Copy-Item .env.example .env
npm.cmd ci
npm.cmd run dev
```

Ouvrez `http://localhost:4321`. `PUBLIC_API_BASE_URL` est une URL **publique côté navigateur**, sans secret. Sans cette variable ou si l'API ne répond pas, les contenus Astro pré-rendus restent visibles et le contact par email reste proposé ; le formulaire n'est affiché que lorsque l'URL API est configurée.

Les quatre appels sont utilisés par : la galerie des projets (`GET /api/projects`), chaque fiche (`GET /api/projects/:slug`), la page À propos (`GET /api/profile`) et le formulaire (`POST /api/contact`). Les fiches restent des pages Markdown statiques pour conserver leur URL et leur contenu dans le HTML initial. Lorsqu'un projet est ajouté, publiez sa page dans ce dépôt et son entrée dans le backend avant de le montrer dans la galerie.

## Vérifications

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run build
npm.cmd run preview
```

Le build effectue `astro check` puis génère les pages statiques dans `dist/`. Aucun adapter Vercel n'est nécessaire pour ce site Astro statique. `docs/` contient un ancien export versionné et n'est pas utilisé par le build Vercel de cette branche.

## Publication : actions à réaliser par le propriétaire

L'ordre évite de publier un frontend pointant vers une API inconnue. Aucun commit, push ou changement de visibilité GitHub/Vercel n'est exécuté par l'agent.

### 1. Dépôt et projet Vercel backend

Créez sur GitHub, sous `Owarino777`, un dépôt vide **public** nommé `PortFolio2-API` (sans README initial). Puis exécutez :

```powershell
cd C:\Users\malik\Developpement\PortFolio2-API
npm.cmd ci
npm.cmd run typecheck
npm.cmd test
git init -b main
git add .
git status --short
git commit -m "Build portfolio Express API and Swagger docs"
git remote add origin https://github.com/Owarino777/PortFolio2-API.git
git push -u origin main
```

Dans Vercel, **Add New → Project**, importez `Owarino777/PortFolio2-API` comme **nouveau projet**. Gardez le dossier racine `.` et la branche de production `main`. Après le déploiement, vérifiez `https://<URL_BACKEND>/api/projects`, `/api/profile`, `/openapi.json` et `/docs/`. Notez l'URL HTTPS exacte du backend.

Dans Formspree, créez un formulaire de contact relié à `malikcheikhpro14@gmail.com` et validez l'adresse destinataire demandée par Formspree. Dans le projet Vercel **backend**, ajoutez les variables d'environnement de production :

```text
FORMSPREE_FORM_ID=<identifiant après /f/ dans l'URL Formspree>
FRONTEND_ORIGIN=https://<URL_DU_NOUVEAU_FRONTEND>
```

Ne mettez pas de slash final dans `FRONTEND_ORIGIN`. Redéployez le backend après modification des variables. Tant que Formspree manque, `POST /api/contact` répond `503` et le site propose le lien email. Une règle de limitation du débit pour `/api/contact` dans Vercel Firewall est recommandée pour protéger ce formulaire public.

### 2. Branche et nouveau projet Vercel frontend

La branche locale `portfolio-api-demo` est déjà créée depuis `nouvelle_branche`. Vérifiez qu'elle est active, puis publiez **uniquement** cette branche :

```powershell
cd C:\Users\malik\Developpement\PortFolio2
git branch --show-current
git status --short
git add .gitignore .env.example README.md src
git commit -m "Connect portfolio demo to separate API"
git push -u origin portfolio-api-demo
```

Créez **un second projet Vercel frontend** en important le dépôt GitHub existant `Owarino777/PortFolio2`. Dans **Settings → Environments → Production → Branch Tracking**, choisissez `portfolio-api-demo`. Conservez le projet Vercel actuel et sa branche `nouvelle_branche` tels quels. Dans le nouveau projet frontend, ajoutez pour Production :

```text
PUBLIC_API_BASE_URL=https://<URL_BACKEND>
```

Redéployez la branche `portfolio-api-demo`. Relevez l'URL stable du nouveau projet, renseignez-la dans `FRONTEND_ORIGIN` du backend et redéployez ce dernier. Vérifiez ensuite depuis le nouveau frontend la liste, une fiche (dont `nested/duvet-genius`), la page À propos et un envoi de contact de test. Les changements de variables Vercel exigent un nouveau déploiement pour être pris en compte.

Le dépôt frontend [est déjà public](https://github.com/Owarino777/PortFolio2). Le backend doit être créé public ou rendu public dans **GitHub → Settings → General → Danger Zone → Change repository visibility** par le propriétaire. Les deux projets Vercel restent distincts, avec leurs propres URL et paramètres.

## Point de maintenance connu

Le projet Astro 4.1.2 et son lockfile existaient avant cette branche. L'audit npm local du 25 septembre 2026 signale 23 avis sur ces dépendances, dont un critique. Le frontend produit ici uniquement des pages statiques ; une mise à niveau d'Astro doit néanmoins être planifiée et testée séparément avant d'ajouter du rendu serveur ou d'autres fonctionnalités.
