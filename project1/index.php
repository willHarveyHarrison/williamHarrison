<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>wills maps</title>
    
    <link rel="icon" href="favicon.png">

    <link rel="stylesheet" href="libs/css/style.css">

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>

</head>

<body>
    <div id="map">
        <div id="flag">hello</div>
        <form id="countrySelect">
            <?php
            // Path to the GeoJSON file
            $geoJsonFile = './libs/geojson/countryBorders.geo.json';
    
            // Check if the file exists
            if (file_exists($geoJsonFile)) {
                // Read the GeoJSON file contents
                $geoJsonData = file_get_contents($geoJsonFile);
    
                // Decode the GeoJSON data
                $data = json_decode($geoJsonData, true);
    
                // Check if the data was decoded successfully
                if ($data !== null) {
                    // Extract the country names and ISO codes
                    $options = [];
                    foreach ($data['features'] as $feature) {
                        $name = $feature['properties']['name'];
                        $isoCode = $feature['properties']['iso_a3'];
                        $options[] = "<option value=\"$isoCode\">$name</option>";
                    }
    
                    // Generate the HTML <select> element
                    echo '<select name="country">';
                    echo implode('', $options);
                    echo '</select>';
                } else {
                    echo '<p>Error decoding GeoJSON data.</p>';
                }
            } else {
                echo '<p>GeoJSON file not found.</p>';
            }
            ?>
            <input type="submit" id="submitCountry">
        </form>
    </div>
</body>

    <script type="application/javascript" src="libs/js/jquery-3.7.1.min.js"></script>
    <script type="module" src="libs/js/script.js"></script>
</html>
