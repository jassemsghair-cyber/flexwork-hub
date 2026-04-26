# FlexWork — Backend PHP

Backend natif **PHP + MySQL** pour la plateforme FlexWork.
Aucun framework, aucun composer — fichiers PHP plats compatibles **XAMPP / WAMP / MAMP**.

---

## 1. Installation (XAMPP / WAMP)

1. Copier le dossier `backend/` dans `htdocs/flexwork-backend/` (XAMPP) ou `www/flexwork-backend/` (WAMP).
2. Démarrer **Apache** + **MySQL** depuis le panneau XAMPP/WAMP.
3. Ouvrir **phpMyAdmin** → **Importer** → choisir `backend/database.sql`.
   > ⚠️ Le script est **idempotent** : il supprime les anciennes tables avant de les recréer.
   > Vous pouvez donc le ré-importer à tout moment sans erreur.
4. Vérifier les identifiants MySQL dans `backend/db.php` (par défaut: `root` / mot de passe vide).

URL de base de l'API : **`http://localhost/flexwork-backend/`**

### Comptes de test
| Rôle      | Email                    | Mot de passe |
|-----------|--------------------------|--------------|
| Admin     | admin@flexwork.tn        | password     |
| Candidat  | yasmine@email.tn         | password     |
| Employeur | contact@cafemedina.tn    | password     |

> Tous les seeds utilisent `password` (hashé avec bcrypt).

---

## 2. Tous les endpoints

### 🔐 Authentification (à la racine)
| Méthode | URL | Body JSON | Description |
|---|---|---|---|
| POST | `login.php` | `{ email, password }` | Connexion (renvoie l'utilisateur sans le mot de passe) |
| POST | `register.php` | `{ name, email, password, role, telephone?, ville?, entreprise?, secteur? }` | Inscription candidat ou employeur |

### 💼 Offres (`/jobs/`)
| Méthode | URL | Description |
|---|---|---|
| GET  | `jobs/list.php?search=&secteur=&lieu=&horaire=&salaire_min=&salaire_max=&statut=&sort=` | Liste filtrable des offres |
| GET  | `jobs/get.php?id=1` | Détail d'une offre |
| POST | `jobs/create.php` `{ employeur_id, title, description, secteur, lieu, salaire, horaire, type, competences[] }` | Créer une offre (statut = en_attente) |
| POST | `jobs/update.php` `{ id, ... }` | Modifier une offre |
| POST | `jobs/delete.php` `{ id }` | Supprimer une offre |
| GET  | `jobs/by_employeur.php?employeur_id=7` | Toutes les offres d'un employeur (+ nb candidatures) |
| GET  | `jobs/employeur_stats.php?employeur_id=7` | KPI + activité récente du dashboard employeur |

### 📨 Candidatures (`/candidatures/`)
| Méthode | URL | Description |
|---|---|---|
| POST | `candidatures/apply.php` `{ job_id, candidat_id, message?, cv? }` | Postuler à une offre |
| GET  | `candidatures/list_by_candidate.php?candidat_id=2&statut=` | Mes candidatures (avec infos offre) |
| GET  | `candidatures/list_by_job.php?job_id=1&statut=` | Candidats d'une offre |
| POST | `candidatures/update_status.php` `{ id, statut }` | Accepter / refuser |
| POST | `candidatures/delete.php` `{ id }` | Supprimer |

### 👤 Utilisateurs (`/users/`)
| Méthode | URL | Description |
|---|---|---|
| GET  | `users/profile_get.php?id=2` | Récupérer un profil complet |
| POST | `users/profile_update.php` `{ id, name?, email?, telephone?, ville?, disponibilites[]?, competences[]?, password? ... }` | Mettre à jour profil / mot de passe |

### 🛡️ Admin (`/admin/`)
| Méthode | URL | Description |
|---|---|---|
| GET  | `admin/dashboard_stats.php` | KPI + secteurs + dernières inscriptions + offres en attente |
| GET  | `admin/users_list.php?role=&search=` | Liste utilisateurs |
| POST | `admin/users_update_status.php` `{ id, statut }` | Bloquer / débloquer (`actif`\|`bloque`) |
| POST | `admin/users_delete.php` `{ id }` | Supprimer un utilisateur |
| GET  | `admin/jobs_list.php?statut=` | Modérer les offres |
| POST | `admin/jobs_moderate.php` `{ id, statut }` | Approuver / rejeter (`active`\|`rejetee`\|...) |
| POST | `admin/jobs_delete.php` `{ id }` | Supprimer une offre |

### 🔎 Listes utilitaires (`/lookups/`)
| Méthode | URL | Description |
|---|---|---|
| GET  | `lookups/lists.php` | `{ secteurs, villes, horaires }` pour les filtres |

---

## 3. Format de réponse

Toutes les réponses suivent la même structure JSON :
```json
{ "success": true, "message": "OK", "...payload": "..." }
```
En cas d'erreur :
```json
{ "success": false, "message": "Description de l'erreur" }
```

---

## 4. CORS

Tous les endpoints autorisent `Access-Control-Allow-Origin: *` pour le développement local
(React sur `localhost:5173` / `localhost:8080`). En production, restreindre à votre domaine.

---

## 5. Sécurité

✅ Déjà fait :
- Hash bcrypt des mots de passe (`password_hash` / `password_verify`).
- Requêtes préparées (anti-injection SQL).
- Validation des champs et des statuts (whitelist).
- Comptes bloqués refusés à la connexion.

⚠️ À ajouter avant production :
- Vraie auth (sessions PHP ou JWT) — actuellement les endpoints font confiance à l'`id` envoyé par le client.
- Middleware admin (vérifier `role = 'admin'`) sur toutes les routes `/admin/*`.
- Restreindre CORS au domaine du front.
- Rate limiting sur `login.php` et `register.php`.
