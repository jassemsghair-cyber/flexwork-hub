# FlexWork — Backend PHP

Backend en pur PHP + MySQL pour la plateforme FlexWork.
Aucun framework — fichiers PHP plats compatibles XAMPP / WAMP / MAMP.

## 1. Installation

1. Copier le dossier `backend/` dans `htdocs/flexwork-backend/` (XAMPP).
2. Démarrer Apache + MySQL via XAMPP.
3. Importer `database.sql` dans phpMyAdmin (crée la base `flexwork_hub`).
4. Vérifier les identifiants dans `db.php` (par défaut: root / vide).

L'URL de base devient : `http://localhost/flexwork-backend/`

## 2. Endpoints disponibles

### Authentification
| Méthode | URL | Description |
|---|---|---|
| POST | `/login.php` | Connexion (email + password) |
| POST | `/register.php` | Inscription |
| GET  | `/api.php` | Liste des offres actives |

### Candidatures (`/candidatures/`)
| Méthode | URL | Body / Query | Description |
|---|---|---|---|
| POST | `candidatures/apply.php` | `{ job_id, candidat_id, message?, cv? }` | Postuler à une offre |
| GET  | `candidatures/list_by_candidate.php?candidat_id=1&statut=en_attente` | — | Mes candidatures |
| GET  | `candidatures/list_by_job.php?job_id=1&statut=en_attente` | — | Candidats d'une offre |
| POST | `candidatures/update_status.php` | `{ id, statut: "acceptee"\|"refusee"\|"en_attente" }` | Accepter / refuser |
| POST | `candidatures/delete.php` | `{ id }` | Supprimer |

### Admin (`/admin/`)
| Méthode | URL | Body / Query | Description |
|---|---|---|---|
| GET  | `admin/dashboard_stats.php` | — | KPI + secteurs + récents |
| GET  | `admin/users_list.php?role=candidat&search=ali` | — | Liste utilisateurs |
| POST | `admin/users_update_status.php` | `{ id, statut: "actif"\|"bloque" }` | Bloquer / débloquer |
| POST | `admin/users_delete.php` | `{ id }` | Supprimer un utilisateur |
| GET  | `admin/jobs_list.php?statut=en_attente` | — | Modérer les offres |
| POST | `admin/jobs_moderate.php` | `{ id, statut: "active"\|"rejetee"\|... }` | Approuver / rejeter |
| POST | `admin/jobs_delete.php` | `{ id }` | Supprimer une offre |

## 3. Format des réponses

Toutes les réponses suivent la même structure JSON :

```json
{ "success": true, "message": "OK", "...payload": "..." }
```

En cas d'erreur :
```json
{ "success": false, "message": "Description de l'erreur" }
```

## 4. CORS

Tous les endpoints autorisent `Access-Control-Allow-Origin: *` pour le développement local
(avec React sur `localhost:8080` ou autre). En production, restreindre à votre domaine.

## 5. Sécurité — à faire avant production

- Hasher les mots de passe (`password_hash` / `password_verify`).
- Mettre en place une vraie auth (sessions ou JWT) — actuellement les endpoints
  font confiance au `candidat_id` envoyé par le client.
- Restreindre CORS au domaine du front.
- Ajouter un middleware admin (vérifier `role = 'admin'`) sur toutes les routes `/admin/*`.
