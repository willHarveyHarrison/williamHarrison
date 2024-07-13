import { tomtomKey } from './keys.js'; // Correct import syntax
import { countriesGeoJson } from '../geojson/countries.js'
import { countryGeo } from '../geojson/Country.js'
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
//this adds all countries to the map => L.geoJSON(countryGeo).addTo(map);


// Function to filter and display the country

function showCountry(countryName) {
    var countryFeature = countryGeo.features.filter(function(feature) {
        return feature.properties.SOVEREIGNT === countryName;
    });

    // Add the filtered feature to the map
    L.geoJSON(countryFeature, {
        onEachFeature: function (feature, layer) {
            layer.on({
                click: function (e) {
                    openCountryPanel(feature.properties.SOVEREIGNT);
                }
            });
        }
    }).addTo(map);
}

showCountry("France");
