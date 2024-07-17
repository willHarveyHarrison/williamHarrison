import { tomtomKey } from './keys.js';
import { countriesGeoJson } from '../geojson/countryBorders.geo.js';

// Map initialization
var map = L.map('map').setView([20, 0], 2); // Initial view set globally

// Initialize satellite layer
var tomtomsatellite = L.tileLayer(`https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=${tomtomKey}`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize street view layer
var streetView = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add tile layers to object for control panel
var baseMaps = {
    "Satellite": tomtomsatellite,
    "Street": streetView
};

// Add default layer to map
streetView.addTo(map);

// Add tile control panel to map
L.control.layers(baseMaps).addTo(map);

// Function to filter and display the country by ISO code
function showCountryByISO(isoCode) {
    var countryFeature = countriesGeoJson.features.filter(function(feature) {
        return feature.properties.iso_a3 === isoCode;
    });

    // Clear existing country layers
    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Add the filtered feature to the map
    L.geoJSON(countryFeature, {
        onEachFeature: function (feature, layer) {
            layer.on({
                click: function (e) {
                    openCountryPanel(feature.properties.name);
                }
            });
        }
    }).addTo(map);
}

// Function to find the extrema for a specific country
function findExtrema(geoJson, countryName) {
    let south = Infinity;
    let west = Infinity;
    let east = -Infinity;
    let north = -Infinity;

    let countryFeature = geoJson.features.find(feature => feature.properties.name === countryName);

    if (countryFeature) {
        if (countryFeature.geometry.type === "MultiPolygon") {
            countryFeature.geometry.coordinates.forEach(polygon => {
                polygon.forEach(ring => {
                    ring.forEach(coord => {
                        let [lon, lat] = coord;
                        if (lat < south) south = lat;
                        if (lat > north) north = lat;
                        if (lon < west) west = lon;
                        if (lon > east) east = lon;
                    });
                });
            });
        } else if (countryFeature.geometry.type === "Polygon") {
            countryFeature.geometry.coordinates.forEach(ring => {
                ring.forEach(coord => {
                    let [lon, lat] = coord;
                    if (lat < south) south = lat;
                    if (lat > north) north = lat;
                    if (lon < west) west = lon;
                    if (lon > east) east = lon;
                });
            });
        }
    }

    return { south, west, east, north };
}

// Handle country selection form submission
$(document).ready(function() {
    $('#countrySelect').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        const selectedCountryISO = $('select[name="country"]').val();
        console.log('Selected Country ISO Code:', selectedCountryISO);

        // Find the selected country by ISO code
        const country = countriesGeoJson.features.find(feature => feature.properties.iso_a3 === selectedCountryISO);

        if (country) {
            // Show the selected country
            showCountryByISO(selectedCountryISO);

            // Find and fit the extrema for the selected country
            var extrema = findExtrema(countriesGeoJson, country.properties.name);
            map.fitBounds([
                [extrema.south, extrema.west],
                [extrema.north, extrema.east]
            ]);
        }
    });
});




// Initial display of Japan for demonstration
showCountryByISO('JPN');
var extrema = findExtrema(countriesGeoJson, "Japan");
map.fitBounds([
    [extrema.south, extrema.west],
    [extrema.north, extrema.east]
]);
