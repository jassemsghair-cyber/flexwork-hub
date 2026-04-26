<?php
// Liste paginée + filtrable des offres (utilisée par la page /offres)
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$search    = isset($_GET['search'])   ? trim((string)$_GET['search'])   : '';
$secteur   = isset($_GET['secteur'])  ? trim((string)$_GET['secteur'])  : '';
$lieu      = isset($_GET['lieu'])     ? trim((string)$_GET['lieu'])     : '';
$horaire   = isset($_GET['horaire'])  ? trim((string)$_GET['horaire'])  : '';
$salaireMin = isset($_GET['salaire_min']) ? (float)$_GET['salaire_min'] : 0;
$salaireMax = isset($_GET['salaire_max']) ? (float)$_GET['salaire_max'] : 999999;
$statut    = isset($_GET['statut'])   ? trim((string)$_GET['statut'])   : 'active';
$sortBy    = isset($_GET['sort'])     ? trim((string)$_GET['sort'])     : 'recent';

$sql = "SELECT id, employeur_id, title, description, entreprise, logo, secteur, lieu,
               salaire, horaire, type, competences, statut, created_at
        FROM jobs WHERE 1=1";
$params = [];
$types  = "";

if (in_array($statut, ['active','en_attente','rejetee','inactive'], true)) {
    $sql .= " AND statut = ?";
    $params[] = $statut; $types .= "s";
}
if ($search !== '') {
    $sql .= " AND (title LIKE ? OR entreprise LIKE ? OR description LIKE ?)";
    $like = "%$search%";
    $params[] = $like; $params[] = $like; $params[] = $like; $types .= "sss";
}
if ($secteur !== '') {
    $sql .= " AND secteur = ?";
    $params[] = $secteur; $types .= "s";
}
if ($lieu !== '') {
    $sql .= " AND lieu = ?";
    $params[] = $lieu; $types .= "s";
}
if ($horaire !== '') {
    $sql .= " AND horaire LIKE ?";
    $params[] = "%$horaire%"; $types .= "s";
}
if ($salaireMin > 0) {
    $sql .= " AND salaire >= ?";
    $params[] = $salaireMin; $types .= "d";
}
if ($salaireMax < 999999) {
    $sql .= " AND salaire <= ?";
    $params[] = $salaireMax; $types .= "d";
}

switch ($sortBy) {
    case 'salaire_asc':  $sql .= " ORDER BY salaire ASC"; break;
    case 'salaire_desc': $sql .= " ORDER BY salaire DESC"; break;
    default:             $sql .= " ORDER BY created_at DESC";
}

$stmt = $conn->prepare($sql);
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();
$res = $stmt->get_result();

$jobs = [];
while ($row = $res->fetch_assoc()) {
    $row['competences'] = $row['competences'] ? array_values(array_filter(array_map('trim', explode(',', $row['competences'])))) : [];
    $jobs[] = $row;
}

$stmt->close();
$conn->close();

json_ok(["jobs" => $jobs, "total" => count($jobs)]);
