<?php
// Toutes les offres d'un employeur, avec compteur de candidatures
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$employeurId = isset($_GET['employeur_id']) ? (int)$_GET['employeur_id'] : 0;
if ($employeurId <= 0) json_err("Paramètre employeur_id requis", 400);

$sql = "SELECT j.id, j.title, j.entreprise, j.logo, j.secteur, j.lieu, j.salaire,
               j.horaire, j.type, j.statut, j.created_at,
               (SELECT COUNT(*) FROM candidatures c WHERE c.job_id = j.id) AS nb_candidatures
        FROM jobs j
        WHERE j.employeur_id = ?
        ORDER BY j.created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employeurId);
$stmt->execute();
$res = $stmt->get_result();

$jobs = [];
while ($r = $res->fetch_assoc()) {
    $r['nb_candidatures'] = (int)$r['nb_candidatures'];
    $jobs[] = $r;
}
$stmt->close();
$conn->close();

json_ok(["jobs" => $jobs, "total" => count($jobs)]);
