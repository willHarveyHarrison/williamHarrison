<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>wills maps</title>
    
    <link rel="icon" href="favicon.png">
    <link rel="stylesheet" href="libs/css/style.css">
    <script src="https://kit.fontawesome.com/9e9d997641.js" crossorigin="anonymous"></script>
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet-easybutton@2.4.0/src/easy-button.css" />
    <script src="https://unpkg.com/leaflet-easybutton@2.4.0/src/easy-button.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>

    <script src='//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'></script>

    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css">
    <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
    <script src="libs/js/leaflet.markercluster.layersupport.js"></script>

        
    <link rel="stylesheet" href="libs\coryasilvaLeafletExtraMarkers\dist\css\leaflet.extra-markers.min.css" />
    <script src="libs/coryasilvaLeafletExtraMarkers/dist/js/leaflet.extra-markers.min.js"></script>

</head>
<body>

<span id="selectContainer">
    <?php
        $geoJsonFile = './libs/geojson/countryBorders.geo.json';
        if (file_exists($geoJsonFile)) {
            $geoJsonData = file_get_contents($geoJsonFile);
            $data = json_decode($geoJsonData, true);
            if ($data !== null) {
                $options = [];
                foreach ($data['features'] as $feature) {
                    $name = $feature['properties']['name'];
                    $isoCode = $feature['properties']['iso_a3'];
                    $options[] = "<option value=\"$isoCode\">$name</option>";
                }
                echo '<select name="country" id="countrySelect" class="form-select">';
                echo implode('', $options);
                echo '</select>';
            } else {
                echo '<p>Error decoding GeoJSON data.</p>';
            }
        } else {
            echo '<p>GeoJSON file not found.</p>';
        }
    ?>
</span>

<div id="map"></div>

<!-- info modal -->
<div id="infoModal" class="modal" data-bs-backdrop="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content shadow">
            <div class="modal-header bg-success bg-gradient text-white">
                <h5 class="modal-title">Country Info</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="infoModalTable"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- wiki modal -->
<div id="wikiModal" class="modal" data-bs-backdrop="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content shadow">
            <div class="modal-header bg-warning bg-gradient text-white">
                <h5 class="modal-title">Wiki</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="wikiBody"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- bank modal -->
<div id="bankModal" class="modal" data-bs-backdrop="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content shadow">
            <div class="modal-header bg-secondary bg-gradient text-white">
                <h5 class="modal-title center-text">Currency Calculator</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex justify-content-center align-items-center">
                <img class="fa-solid fa-money-bill-transfer"></img>
            </div>
            <div id="bankModalTable"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- news modal -->
<div id="newsModal" class="modal" data-bs-backdrop="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content shadow">
            <div class="modal-header bg-info bg-gradient text-white">
                <h5 class="modal-title">News</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="newsModalTable"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- weather modal -->
<div id="weatherModal" class="modal" data-bs-backdrop="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content shadow">
            <div class="modal-header bg-danger bg-gradient text-white">
                <h5 class="modal-title">Weather</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="weatherModalTable"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script type="application/javascript" src="libs/js/jquery-3.7.1.min.js"></script>
<script type="module" src="libs/js/script.js"></script>

</html>
