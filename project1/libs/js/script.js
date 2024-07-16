import { tomtomKey } from './keys.js'; // Correct import syntax
import { countriesGeoJson } from '../geojson/countryBorders.geo.js'
//map init
var map = L.map('map');

//map view bound box
map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);

// init satellite layer
var tomtomsatellite = L.tileLayer(`https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=${tomtomKey}`, {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// init streetview layer
var streetView = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add tile layers to object for controll panel
var baseMaps = {
    "satellite": tomtomsatellite,
    "street": streetView
};


streetView.addTo(map);



// add tile control panel to map
L.control.layers(baseMaps).addTo(map);
// add country borders to map
//this adds all countries to the map => L.geoJSON(countriesGeoJson).addTo(map);


// Function to filter and display the country
function showCountry(country) {
    var countryFeature = countriesGeoJson.features.filter(function(feature) {
        return feature.properties.name === country;
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
//shows poligon for selected country
showCountry("United States");

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

// Find the extrema in the GeoJSON MultiPolygon for Australia
var extrema = findExtrema(countriesGeoJson, "United States");
console.log('Southernmost point:', extrema.south);
console.log('Westernmost point:', extrema.west);
console.log('Easternmost point:', extrema.east);
console.log('Northernmost point:', extrema.north);

map.fitBounds([
    [extrema.south, extrema.west],
    [extrema.north, extrema.east]
]);