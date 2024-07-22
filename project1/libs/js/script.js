import { tomtomKey } from './keys.js';
import { openCageKey } from './keys.js';
import { countriesGeoJson } from '../geojson/countryBorders.geo.js';

//------------------------------------ Map and Tile Layers -----------------------------------------------------------------------------//
// Global variables
const DEFAULT_COUNTRY_ISO = 'JPN';
let currentCountryFeature = null;
let searchLat = null;
let searchLong = null;

// Map initialization
const map = L.map('map').setView([20, 0], 2); // Initial view set globally

// Initialize satellite and street view layers
const tomtomsatellite = L.tileLayer(`https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=${tomtomKey}`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const streetView = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add tile layers to object for control panel
const baseMaps = {
    "Satellite": tomtomsatellite,
    "Street": streetView
};

// Add default layer to map
streetView.addTo(map);

// Add tile control panel to map
L.control.layers(baseMaps).addTo(map);

// Function to handle opening the country panel
function openCountryPanel(countryName) {
    alert("Opening panel for " + countryName);
}

//------------------------------------ Functions -----------------------------------------------------------------------------//
// Function to filter and display the country by ISO code
function showCountryByISO(isoCode) {
    currentCountryFeature = countriesGeoJson.features.find(feature => feature.properties.iso_a3 === isoCode);

    if (!currentCountryFeature) {
        alert("Country not found!");
        return;
    }

    // Clear existing country layers
    map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    // Add the filtered feature to the map
    L.geoJSON(currentCountryFeature, {
        onEachFeature: (feature, layer) => {
            layer.on({
                click: () => {
                    openCountryPanel(feature.properties.name);
                }
            });
        }
    }).addTo(map);

    // Find and fit the extrema for the country
    findExtrema(currentCountryFeature);
}

// Function to check if a point is inside a polygon
function pointInPolygon(point, vs) {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const [xi, yi] = vs[i];
        const [xj, yj] = vs[j];

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

// Function to find the extrema for a specific country feature
function findExtrema(countryFeature) {
    let south = Infinity, west = Infinity, north = -Infinity, east = -Infinity;

    const coordinates = countryFeature.geometry.type === "MultiPolygon" 
        ? countryFeature.geometry.coordinates.flat(2)
        : countryFeature.geometry.coordinates.flat();

    coordinates.forEach(([lon, lat]) => {
        if (lat < south) south = lat;
        if (lat > north) north = lat;
        if (lon < west) west = lon;
        if (lon > east) east = lon;
    });

    //set position to center
    searchLat = (north + south)/2
    searchLong = (west + east)/2

    console.log(searchLat)
    console.log(searchLong)

    map.fitBounds([[south, west], [north, east]]);


}

// Function to get the user's current position
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => showCountryByLatLon(position.coords.longitude, position.coords.latitude),
            error => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Displaying default country.');
                showDefaultCountry();
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
        showDefaultCountry();
    }
}

// Function to find the country containing the given longitude and latitude
function showCountryByLatLon(lon, lat) {

    const countryFeature = countriesGeoJson.features.find(feature => {
        const coordinates = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
        return coordinates.some(polygon => polygon.some(ring => pointInPolygon([lon, lat], ring)));
    });

    if (countryFeature) {
        showCountryByISO(countryFeature.properties.iso_a3);
    } else {
        alert('No country found at the given coordinates.');
    }
}

// Function to display a default country if user location cannot be determined
function showDefaultCountry() {
    showCountryByISO(DEFAULT_COUNTRY_ISO);
}

//------------------------ Handle User Input -------------------------------------------------------------------//
// Handle country selection form submission
$(document).ready(function() {
    $('#countrySelect').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        const selectedCountryISO = $('select[name="country"]').val();
        console.log('Selected Country ISO Code:', selectedCountryISO);

        const country = countriesGeoJson.features.find(feature => feature.properties.iso_a3 === selectedCountryISO);

        if (country) {
            showCountryByISO(selectedCountryISO);
        } else {
            alert("Selected country not found!");
        }
    });

    // Get and display the user's location on map load
    getUserLocation();
});

// Add easy 1 button to map
L.easyButton('fa-solid fa-circle-info', function(btn, map) {
    buttonOneInfo();
    $("#infoModal").modal("show");
}).addTo(map);

// Function to fetch and display country info using OpenCage API
function buttonOneInfo() {
    $.ajax({
        url: "libs/php/infoButton.php",
        type: 'GET',
        dataType: 'json',
        data: { 
            openCageKey,
            countryIso_a3: currentCountryFeature.properties.iso_a3,
            countryName: currentCountryFeature.properties.name.trim(),
            lat: searchLat,
            long: searchLong
         },
        success: function(result) {
            const annotations = result.results[0].annotations;
            console.log(result.results[0]);
            console.log(annotations);
            console.log("Drive on the " + annotations.roadinfo.drive_on);
            console.log("Timezone: " + annotations.timezone.name);
            console.log("Currency: " + annotations.currency.name);
            console.log(currentCountryFeature.properties.iso_a3);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('OpenCage error: ' + errorThrown);
        }
    });
}

// Add easy 2 button to map
L.easyButton('fa-solid fa-users', function(btn, map) {
    fetchCountryInfo();
    $("#infoModal").modal("show");
}).addTo(map);

// Add easy 3 button to map
L.easyButton('fa-solid fa-landmark', function(btn, map) {
    fetchCountryInfo();
    $("#infoModal").modal("show");
}).addTo(map);

// Add easy 4 button to map
L.easyButton('fa-solid fa-globe', function(btn, map) {
    fetchCountryInfo();
    $("#infoModal").modal("show");
}).addTo(map);

// Add easy 5 button to map
L.easyButton('fa-solid fa-truck-fast', function(btn, map) {
    fetchCountryInfo();
    $("#infoModal").modal("show");
}).addTo(map);