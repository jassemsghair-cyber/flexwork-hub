<?php
// Statistiques pour le dashboard employeur
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$employeurId = isset($_GET['employeur_id']) ? (int)$_GET['employeur_id'] : 0;
if ($employeurId <= 0) json_err("Paramètre employeur_id requis", 400);

$stats = [
    'offres_total'        => 0,
    'offres_actives'      => 0,
    'offres_en_attente'   => 0,
    'candidatures_total'  => 0,
    'candidatures_en_attente' => 0,
];

// Counts
$stmt = $conn->prepare("SELECT statut, COUNT(*) c FROM jobs WHERE employeur_id = ? GROUP BY statut");
$stmt->bind_param("i", $employeurId); $stmt->execute();
$res = $stmt->get_result();
while ($r = $res->fetch_assoc()) {
    $stats['offres_total'] += (int)$r['c'];
    if ($r['statut'] === 'active')     $stats['offres_actives']    = (int)$r['c'];
    if ($r['statut'] === 'en_attente') $stats['offres_en_attente'] = (int)$r['c'];
}
$stmt->close();

$stmt = $conn->prepare("SELECT c.statut, COUNT(*) c FROM candidatures c
                        INNER JOIN jobs j ON j.id = c.job_id
                        WHERE j.employeur_id = ? GROUP BY c.statut");
$stmt->bind_param("i", $employeurId); $stmt->execute();
$res = $stmt->get_result();
while ($r = $res->fetch_assoc()) {
    $stats['candidatures_total'] += (int)$r['c'];
    if ($r['statut'] === 'en_attente') $stats['candidatures_en_attente'] = (int)$r['c'];
}
$stmt->close();

// Activité récente : 5 dernières candidatures
$stmt = $conn->prepare("SELECT c.id, c.statut, c.created_at,
                               u.name AS candidat_nom, u.email AS candidat_email,
                               j.id AS job_id, j.title AS job_title
                        FROM candidatures c
                        INNER JOIN users u ON u.id = c.candidat_id
                        INNER JOIN jobs  j ON j.id = c.job_id
                        WHERE j.employeur_id = ?
                        ORDER BY c.created_at DESC LIMIT 5");
$stmt->bind_param("i", $employeurId); $stmt->execute();
$res = $stmt->get_result();
$activity = [];
while ($r = $res->fetch_assoc()) $activity[] = $r;
$stmt->close();

$conn->close();

json_ok(["stats" => $stats, "activity" => $activity]);
