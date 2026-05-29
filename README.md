URL du site web : https://egorkhaybulov.fr
Identifiants admin :
- Mail: egor@admin.fr
- Mot de passe: egor

# Documentation Conteneurisation - QuizzYnov

## 1. Choix des Images Docker & Optimisations

L'application repose sur une architecture multi-services (Frontend, Backend, Base de données).

* **Images de base :** Utilisation systématique d'images basées sur Alpine Linux (`node:20-alpine`, `nginx:alpine`) afin de minimiser l'empreinte disque et réduire la surface d'attaque.
* **Multi-stage Build (Backend & Frontend) :** Séparation stricte entre l'environnement de compilation (TypeScript, Vite) et l'environnement d'exécution. Les images finales ne contiennent que les assets statiques (pour le front) ou le code JavaScript compilé (pour le back), excluant les outils et dépendances de développement (`devDependencies`).
* **Serveur Web Léger :** Le frontend compilé est servi par `nginx:alpine`, optimisé pour la distribution de fichiers statiques.
* **Gestion du Cache :** La copie des fichiers `package.json` et l'installation des dépendances (`npm ci`) précèdent la copie du code source pour optimiser l'utilisation du cache de build Docker.
* **Sécurité Non-Root :** Le processus backend est exécuté via l'utilisateur système restreint `node` prévu par l'image, limitant les privilèges en cas de compromission.

## 2. Architecture Réseau et Exposition

* **Réseau Interne (`app-network`) :** Un réseau de type bridge isole les communications entre les conteneurs. La résolution DNS interne est utilisée (l'application contacte la base de données via le nom d'hôte `db`).
* **Exposition Backend :** Expose le port `3000` vers la machine hôte.
* **Exposition Frontend & Reverse Proxy :** Le conteneur frontend expose le port interne `80` sur le port `8080` de la machine hôte. Un serveur Nginx natif sur le VPS (Reverse Proxy) redirige le trafic externe vers ce port `8080`, évitant les conflits de ports.
* **Isolation de la Base de Données :** Le service `db` (MySQL 8.0) n'expose aucun port vers la machine hôte. Il est strictement inaccessible depuis l'extérieur du réseau Docker.

## 3. Persistance des Données

Un volume nommé `db-data` est monté sur le répertoire `/var/lib/mysql` du conteneur de base de données.
* **Données conservées :** L'intégralité du schéma de la base, des données utilisateurs, questions et scores.
* **Cycle de vie :** Si l'infrastructure est arrêtée via `docker compose down`, le volume persiste sur l'hôte. Les données ne sont réinitialisées qu'en cas de purge explicite des volumes avec la commande `docker compose down -v`.

## 4. Configuration et Déploiement

Les secrets et paramètres liés à l'environnement ne sont pas versionnés dans le dépôt.

**Instructions de lancement :**

1. Dupliquer le fichier d'exemple pour créer le fichier d'environnement de production local au serveur :
```bash
   cp .env.example .env
   ```
2. Renseigner les variables de production dans le fichier `.env` (notamment `MYSQL_ROOT_PASSWORD` et `JWT_SECRET`).
3. Construire et lancer l'infrastructure en mode détaché :
```bash
   docker compose up -d --build
   ```
4. Vérifier l'état de santé des services (le backend est conditionné par le statut *healthy* de la base de données) :
```bash
   docker compose ps
   ```
