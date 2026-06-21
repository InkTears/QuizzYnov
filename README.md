# Compte-rendu : Déploiement Ansible sur Debian 13

### 1. Moteur de conteneurs choisi
**Docker CE**. Son intégration est gérée via la collection Ansible `community.docker`.

### 2. Usages de shell/command
**Aucun**. Le déploiement est géré exclusivement via des modules spécialisés (`apt`, `deb822_repository`, `get_url`, `service`, `docker_image`, `docker_container`) pour garantir une infrastructure propre et idempotente.

### 3. Résultat d'une exécution du playbook
Voici la sortie confirmant l'idempotence parfaite du rôle (seconde exécution, aucune modification) :

```text
PLAY [Atelier - Deploiement applicatif avec Ansible] *******************************************************************

TASK [Gathering Facts] *************************************************************************************************
ok: [debian_target]

TASK [deploy_app : MAJ Cache Paquets APT] ******************************************************************************
ok: [debian_target]

TASK [deploy_app : Installation des paquets] ***************************************************************************
ok: [debian_target]

TASK [deploy_app : Création Dossier Clés de sécurité APT] **************************************************************
ok: [debian_target]

TASK [deploy_app : Téléchargement clé GPG officielle dépôt Docker] *****************************************************
ok: [debian_target]

TASK [deploy_app : Ajout Dépôt Docker au format moderne DEB822] ********************************************************
ok: [debian_target]

TASK [deploy_app : MAJ Cache APT suite à l'ajout du dépôt Docker] ******************************************************
ok: [debian_target]

TASK [deploy_app : Installation du moteur Docker avec ses plugins] *****************************************************
ok: [debian_target]

TASK [deploy_app : Activation et Démarrage du service Docker] **********************************************************
ok: [debian_target]

TASK [deploy_app : Téléchargement Image Docker Nginx] ******************************************************************
ok: [debian_target]

TASK [deploy_app : Création et Démarrage du conteneur Nginx] ***********************************************************
ok: [debian_target]

TASK [deploy_app : Vérification Statut Conteneur Nginx] ****************************************************************
ok: [debian_target]

PLAY RECAP *************************************************************************************************************
debian_target              : ok=12   changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
