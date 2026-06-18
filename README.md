URL du site web : https://egorkhaybulov.fr
Identifiants admin :
- Mail: egor@admin.fr
- Mot de passe: egor

# Documentation Déploiement Kubernetes - QuizzYnov

## 1. Choix des Images Docker & Optimisations

L'application repose sur une architecture multi-services (Frontend, Backend, Base de données) dont les images ont été optimisées avant d'être poussées sur le registre.

* **Images de base :** Utilisation systématique d'images basées sur Alpine Linux (`node:20-alpine`, `nginx:alpine`) afin de minimiser l'empreinte disque et réduire la surface d'attaque.
* **Multi-stage Build (Backend & Frontend) :** Séparation stricte entre l'environnement de compilation (TypeScript, Vite) et l'environnement d'exécution. Les images finales ne contiennent que les assets statiques ou le code JavaScript compilé, excluant les dépendances de développement (`devDependencies`).
* **Sécurité Non-Root :** Le processus backend est exécuté via l'utilisateur système restreint `node` prévu par l'image, limitant les privilèges en cas de compromission.

## 2. Architecture Réseau Kubernetes & Exposition

L'infrastructure est déployée dans un namespace dédié (`quizzy-namespace`).

* **Réseau Interne (ClusterIP) :** La résolution DNS interne de Kubernetes est utilisée. Le backend et le frontend communiquent avec la base de données via le service `mysql-service` sur le port 3306, qui n'est pas exposé à l'extérieur.
* **Exposition NodePort & Reverse Proxy :** Le TP étant réalisé sur un VPS de production, l'Ingress natif a été remplacé par une exposition en `NodePort`. L'API est exposée sur le port `30081` et le Frontend sur le port `30082`. Un reverse proxy Nginx installé sur l'hôte gère les certificats SSL et redirige le trafic web vers ces ports de manière transparente.

## 3. Persistance et Sécurité des Données

* **Stockage (PVC) :** Un `PersistentVolumeClaim` (PVC) nommé `mysql-pvc` est rattaché au pod MySQL. Cela garantit que l'intégralité du schéma, des utilisateurs et des scores survit à un crash ou au redémarrage du pod de base de données.
* **Gestion des Secrets :** Les identifiants sensibles de la base de données (Root password, User, Password) ne sont pas codés en dur. Ils sont stockés de manière chiffrée dans un objet `Secret` Kubernetes (`app-secret`), tandis que les variables non sensibles sont gérées via un `ConfigMap` (`app-config`).

## 4. Haute Disponibilité et Cycle de Vie (Probes)

Afin d'assurer une résilience maximale de l'application, des sondes de santé sont configurées sur les pods applicatifs :
* **Liveness Probe & Readiness Probe :** Kubernetes effectue des requêtes HTTP régulières sur les conteneurs (ex: sur la route `/api/users` pour le backend). Si l'application cesse de répondre (code HTTP différent de 200), Kubernetes tue automatiquement le conteneur bloqué et en redémarre un nouveau sans intervention humaine.

## 5. Commandes de Déploiement

Pour déployer l'intégralité de l'infrastructure sur le cluster, l'ordre des manifestes est géré par le dossier Kustomize/Classic. Il suffit d'exécuter :

```bash```

## 6. Choix Techniques & Industrialisation Helm

L'ensemble des fichiers statiques a été converti en un Chart Helm dynamique et réutilisable, contrôlé centralement par un unique fichier de configuration.

* **Zéro Valeur en Dur (`values.yaml`) :** Toutes les configurations spécifiques (nombre de réplicas, dépôts et tags d'images Docker, quotas et limites de ressources CPU/RAM) sont entièrement externalisées.
* **Sécurité & Gestion des Variables :** Les secrets de la base de données saisis en clair dans le `values.yaml` sont chiffrés à la volée en Base64 à l'aide de la fonction native Helm `b64enc` lors de la génération automatique du manifeste de l'objet `Secret`.
* **Fichier de Fonctions Partagées (`_helpers.tpl`) :** Intégration d'un fichier d'outils standardisés générant dynamiquement les noms des ressources (tronqués à 63 caractères pour Kubernetes) ainsi que les labels d'étiquetage communs pour assurer la traçabilité.

## 7. Refactoring & Consolidation des Manifestes

Le passage à Helm a permis d'optimiser l'organisation des manifestes de l'Étape 1. Plutôt que de conserver 6 fichiers distincts, l'architecture a été restructurée autour de **5 fichiers de templates fonctionnels** (hors `_helpers.tpl`), en regroupant les ressources de même nature.

* **Consolidation par Séparateurs (`---`) :** Afin d'éviter l'éparpillement des fichiers dans le dossier `templates/`, les composants partageant la même logique ont été fusionnés :
  * `templates/deployment.yaml` : Centralise l'intégralité des trois `Deployments` (Frontend, API, MySQL).
  * `templates/service.yaml` : Regroupe l'ensemble de l'infrastructure de support, à savoir les trois `Services` réseau et le `PersistentVolumeClaim` (PVC) de la base de données.
* **Fichiers de Configuration Isolés :** Les configurations globales restent sectorisées dans leurs fichiers respectifs pour des raisons de clarté : `templates/configmap.yaml`, `templates/secret.yaml` et `templates/ingress.yaml`.

## 8. Gestion Dynamique de la Scalabilité

Le principal avantage de cette industrialisation réside dans la flexibilité du cycle de vie des pods, désormais piloté centralement :

* **Orchestration des Réplicas :** Le template Helm permet de faire varier instantanément l'échelle de l'application (Scalability). La modification de la variable `replicaCount` dans le `values.yaml` (ou via l'argument `--set`) propage automatiquement la création ou la suppression des pods Frontend ou API sur le cluster, sans interruption de service et sans avoir à modifier les manifestes profonds.


