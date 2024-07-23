<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>wills maps</title>
    
    <link rel="icon" href="favicon.png">

    <link rel="stylesheet" href="libs/css/style.css">
    <script src="https://kit.fontawesome.com/9e9d997641.js" crossorigin="anonymous"></script>
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>

    <link rel="stylesheet" href="https://unpkg.com/leaflet-easybutton@2.4.0/src/easy-button.css" />
    <script src="https://unpkg.com/leaflet-easybutton@2.4.0/src/easy-button.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
     crossorigin="anonymous"></script>
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


        <!-- info modal -->
        <div id="infoModal" class="modal" data-bs-backdrop="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content shadow">
                    <div class="modal-header bg-success bg-gradient text-white">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="infoModalTable">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
         </div>

        <!-- people modal -->
        <div id="peopleModal" class="modal" data-bs-backdrop="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content shadow">
                    <div class="modal-header bg-success bg-gradient text-white">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="peopleModalTable">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
         </div>

        <!-- bank modal -->
        <div id="bankModal" class="modal" data-bs-backdrop="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content shadow">
                    <div class="modal-header bg-success bg-gradient text-white">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="bankModalTable">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
         </div>

        <!-- news modal -->
        <div id="newsModal" class="modal" data-bs-backdrop="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content shadow">
                    <div class="modal-header bg-success bg-gradient text-white">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="newsModalTable">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
         </div>

        <!-- driver modal -->
        <div id="driverModal" class="modal" data-bs-backdrop="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content shadow">
                    <div class="modal-header bg-success bg-gradient text-white">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="driverModalTable">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-success btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
         </div>
</body>

<script type="application/javascript" src="libs/js/jquery-3.7.1.min.js"></script>
<script type="module" src="libs/js/script.js"></script>

</html>
