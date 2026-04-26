<?php
require "../db.php";

$employeur_id = $_GET["employeur_id"];

$sql = "SELECT * FROM jobs WHERE employeur_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $employeur_id);
$stmt->execute();

$result = $stmt->get_result();
$offres = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($offres);