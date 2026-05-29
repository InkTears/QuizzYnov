URL du site web : egorkhaybulov.fr
Identifiants admin :
- Mail: egor@admin.fr
- Mot de passe: egor


# Documentation Conteneurisation - QuizzYnov

## 1. Choix de l'Image Docker & Optimisations
* **Image de base :** `node:20-alpine`. Le choix d'Alpine Linux permet d'avoir une image ultra-légère, réduisant la surface d'attaque et l'empreinte disque.
* **Multi-stage Build :** Séparation claire entre l'étape de compilation (TypeScript via `npm run build`) et l'étape d'exécution. L'image finale ne contient pas les outils de développement ni les fichiers sources TS, mais uniquement le JS compilé.
* **Gestion du Cache :** Copie isolée des fichiers `package.json` avant le reste des sources afin d'éviter de réinstaller les dépendances à chaque modification du code.
* **Sécurité Non-Root :** L'application est exécutée via l'utilisateur système `node` intégré à l'image, limitant les privilèges du processus en cas de faille de sécurité.

## 2. Architecture Réseau et Exposition
* **Ports publiés :** Seul le port `3000` de l'application est exposé sur la machine hôte.
* **Isolation :** La base de données `db` n'expose aucun port vers l'extérieur. Elle communique de manière isolée et sécurisée avec l'application via le réseau Docker nommé `app-network`.
* **Nom d'hôte :** L'application contacte la base de données via le nom d'hôte interne `db`.

## 3. Persistance des Données
Un volume nommé `db-data` est monté sur le répertoire `/var/lib/mysql` du conteneur de base de données.
* **Données conservées :** L'intégralité des tables du quiz, des utilisateurs et des scores.
* **Impact en cas de suppression :** Si le conteneur est supprimé via `docker compose down`, les données restent intactes dans le volume local. Si la commande `docker compose down -v` est exécutée, le volume est purgé et toutes les données sont réinitialisées.

## 4. Instructions de Lancement
1. Dupliquer le fichier d'exemple et configurer vos accès :
   ```bash
   cp .env.example .env