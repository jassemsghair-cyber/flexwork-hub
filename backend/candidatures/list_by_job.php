<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$jobId = isset($_GET['job_id']) ? (int)$_GET['job_id'] : 0;
if ($jobId <= 0) json_err("Paramètre job_id requis", 400);

$statutFilter = isset($_GET['statut']) ? trim((string)$_GET['statut']) : '';

$sql = "SELECT c.id, c.job_id, c.candidat_id, c.statut, c.message, c.cv, c.created_at AS date_postulation,
               u.name AS candidat_nom, u.email AS candidat_email,
               u.telephone AS candidat_telephone, u.ville AS candidat_ville
        FROM candidatures c
        INNER JOIN users u ON u.id = c.candidat_id
        WHERE c.job_id = ?";
$params = [$jobId];
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
