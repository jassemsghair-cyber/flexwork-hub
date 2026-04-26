<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$candidatId = isset($_GET['candidat_id']) ? (int)$_GET['candidat_id'] : 0;
if ($candidatId <= 0) json_err("Paramètre candidat_id requis", 400);

$statutFilter = isset($_GET['statut']) ? trim((string)$_GET['statut']) : '';

$sql = "SELECT c.id, c.job_id, c.candidat_id, c.statut, c.message, c.created_at AS date_postulation,
               j.title AS offre_titre, j.entreprise, j.lieu, j.secteur, j.salaire, j.horaire
        FROM candidatures c
        INNER JOIN jobs j ON j.id = c.job_id
        WHERE c.candidat_id = ?";
$params = [$candidatId];
$types  = "i";

if ($statutFilter !== '' && in_array($statutFilter, ['en_attente','acceptee','refusee'], true)) {
    $sql .= " AND c.statut = ?";
    $params[] = $statutFilter;
    $types   .= "s";
}
$sql .= " ORDER BY c.created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$res = $stmt->get_result();

$rows = [];
while ($row = $res->fetch_assoc()) $rows[] = $row;

$stmt->close();
$conn->close();

json_ok(["candidatures" => $rows, "total" => count($rows)]);
