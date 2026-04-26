<?php
// Listes statiques pour les filtres (secteurs, villes, horaires)
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$secteurs = [];
$res = $conn->query("SELECT DISTINCT secteur FROM jobs WHERE secteur IS NOT NULL AND secteur <> '' ORDER BY secteur");
while ($r = $res->fetch_assoc()) $secteurs[] = $r['secteur'];

$villes = [];
$res = $conn->query("SELECT DISTINCT lieu FROM jobs WHERE lieu IS NOT NULL AND lieu <> '' ORDER BY lieu");
while ($r = $res->fetch_assoc()) $villes[] = $r['lieu'];

$horaires = ["Matin", "Soir", "Weekend", "Flexible"];

$conn->close();

json_ok([
    "secteurs" => $secteurs,
    "villes"   => $villes,
    "horaires" => $horaires,
]);
