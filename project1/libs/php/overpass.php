<?php
if (isset($_GET['southWestLat'], $_GET['southWestLng'], $_GET['northEastLat'], $_GET['northEastLng'])) {
    $southWestLat = $_GET['southWestLat'];
    $southWestLng = $_GET['southWestLng'];
    $northEastLat = $_GET['northEastLat'];
    $northEastLng = $_GET['northEastLng'];

    $query = "
        [out:json];
        (
          node['tourism'='museum']($southWestLat,$southWestLng,$northEastLat,$northEastLng);
          node['amenity'='bank']($southWestLat,$southWestLng,$northEastLat,$northEastLng);
          node['amenity'='police']($southWestLat,$southWestLng,$northEastLat,$northEastLng);
        );
        out;
    ";

    $url = 'https://overpass-api.de/api/interpreter?data=' . urlencode($query);

    $response = file_get_contents($url);
    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch data"]);
        exit;
    }

    header('Content-Type: application/json');
    echo $response;
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid parameters"]);
}
?>
