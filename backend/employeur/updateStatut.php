<?php
require "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$candidature_id = $data["candidature_id"];
$statut = $data["statut"]; // acceptee | refusee

$sql = "UPDATE candidatures SET statut = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $statut, $candidature_id);
$stmt->execute();

echo json_encode(["success" => true]);