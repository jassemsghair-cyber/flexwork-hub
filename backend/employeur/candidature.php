<?php
require "../db.php";

$job_id = $_GET["job_id"];

$sql = "
SELECT c.id, u.nom, u.email, c.statut, c.message
FROM candidatures c
JOIN users u ON u.id = c.candidat_id
WHERE c.job_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $job_id);
$stmt->execute();

$result = $stmt->get_result();
echo json_encode($result->fetch_all(MYSQLI_ASSOC));