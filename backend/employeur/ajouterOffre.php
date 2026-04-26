<?php
require "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$titre = $data["titre"];
$description = $data["description"];
$employeur_id = $data["employeur_id"];

$sql = "INSERT INTO jobs (titre, description, employeur_id)
        VALUES (?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $titre, $description, $employeur_id);
$stmt->execute();

echo json_encode(["success" => true]);