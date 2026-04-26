<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$stats = [];

// Users counts
$res = $conn->query("SELECT role, COUNT(*) AS c FROM users GROUP BY role");
$byRole = ['candidat' => 0, 'employeur' => 0, 'admin' => 0];
while ($r = $res->fetch_assoc()) $byRole[$r['role']] = (int)$r['c'];
$stats['total_users']       = array_sum($byRole);
$stats['total_candidats']   = $byRole['candidat'];
$stats['total_employeurs']  = $byRole['employeur'];
$stats['total_admins']      = $byRole['admin'];

// Jobs
$res = $conn->query("SELECT statut, COUNT(*) AS c FROM jobs GROUP BY statut");
$byStatut = ['active'=>0,'en_attente'=>0,'rejetee'=>0,'inactive'=>0];
while ($r = $res->fetch_assoc()) $byStatut[$r['statut']] = (int)$r['c'];
$stats['total_jobs']        = array_sum($byStatut);
$stats['jobs_active']       = $byStatut['active'];
$stats['jobs_en_attente']   = $byStatut['en_attente'];
$stats['jobs_rejetee']      = $byStatut['rejetee'];

// Candidatures
$res = $conn->query("SELECT statut, COUNT(*) AS c FROM candidatures GROUP BY statut");
$byApp = ['en_attente'=>0,'acceptee'=>0,'refusee'=>0];
while ($r = $res->fetch_assoc()) $byApp[$r['statut']] = (int)$r['c'];
$stats['total_candidatures']      = array_sum($byApp);
$stats['candidatures_en_attente'] = $byApp['en_attente'];
$stats['candidatures_acceptee']   = $byApp['acceptee'];
$stats['candidatures_refusee']    = $byApp['refusee'];

// Offres par secteur
$res = $conn->query("SELECT secteur, COUNT(*) AS c FROM jobs GROUP BY secteur ORDER BY c DESC");
$sectors = [];
while ($r = $res->fetch_assoc()) $sectors[] = ['secteur' => $r['secteur'], 'count' => (int)$r['c']];
$stats['par_secteur'] = $sectors;

// Inscriptions récentes
$res = $conn->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5");
$recent = [];
while ($r = $res->fetch_assoc()) $recent[] = $r;
$stats['inscriptions_recentes'] = $recent;

// Offres en attente de modération
$res = $conn->query("SELECT id, title, entreprise, lieu, created_at FROM jobs WHERE statut = 'en_attente' ORDER BY created_at DESC");
$pending = [];
while ($r = $res->fetch_assoc()) $pending[] = $r;
$stats['offres_en_attente'] = $pending;

$conn->close();

json_ok(["stats" => $stats]);
