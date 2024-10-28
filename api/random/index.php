<?php
$json = file_get_contents('../data.json');
$data = json_decode($json, true);
$randomKey = array_rand($data);
$randomElement = $data[$randomKey];

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'data'  => $randomElement,
    'links' => [
        'self' => 'https://spookpad.nl/api/random/',
    ],
]);