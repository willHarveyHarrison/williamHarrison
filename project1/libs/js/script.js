import { tomtomKey } from './keys.js';
import { openCageKey } from './keys.js';
import { geoNameUsername } from './keys.js';
import { openExchangeRatesKey } from './keys.js';
import { openWeatherKey } from './keys.js';
import { countriesGeoJson } from '../geojson/countryBorders.geo.js';
import { serpapiKey } from './keys.js';

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
                    
                }
            });
        }
    }).addTo(map);

    // Find and fit the extrema for the country
    findExtrema(currentCountryFeature);
    changeFlag(currentCountryFeature.properties.iso_a2)
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
        $('#selectCountry').val(countryFeature.properties.iso_a3);
        showCountryByISO(countryFeature.properties.iso_a3);
    } else {
        alert('No country found at the given coordinates.');
    }
}

// Function to display a default country if user location cannot be determined
function showDefaultCountry() {
    showCountryByISO(DEFAULT_COUNTRY_ISO);
}

function changeFlag(countryiso2){
    let flag = [`<img src=https://flagsapi.com/${countryiso2}/flat/64.png></img>`];

    $('#flag').empty().append(flag)
}

//------------------------ Handle User Input -------------------------------------------------------------------//
// Handle country selection form submission
$(document).ready(function() {
    $('#countrySelect').on('change', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        const selectedCountryISO = $('select[name="country"]').val();

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

// Add info button to map
L.easyButton('fa-solid fa-circle-info', function(btn, map) {
    infoButton();
    $("#infoModal").modal("show");
}).addTo(map);


// Function to fetch and display country info using OpenCage API
// this might need preloaderrrrr <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function infoButton() {
    $('#infoModalTable').empty()
    $.ajax({
        url: "libs/php/infoButton.php",
        type: 'GET',
        dataType: 'json',
        data: { 
            openCageKey,
            countryIso_a2: currentCountryFeature.properties.iso_a2,
            countryName: currentCountryFeature.properties.name.trim(),
            lat: searchLat,
            long: searchLong
         },
        success: function(result) {
            const annotations = result.results[0].annotations;
            $.ajax({
                url: "libs/php/geoName.php",
                type: 'GET',
                dataType: 'json',
                data: { 
                    geoNameUsername,
                    countryIso_a2: currentCountryFeature.properties.iso_a2,
                 },
                success: function(result) {
                    let population = Number(result.geonames[0].population).toLocaleString();
                    let capitalCity = result.geonames[0].capital;
                    let areaInSqKm = Number(result.geonames[0].areaInSqKm).toLocaleString();
                    let continent = result.geonames[0].continentName
                    const table = $('<table></table>');
                    const rows = [
                        `<tr>
                        <td class="text-center"><i class="fa-solid fa-city fa-xl text-success"></i></td>
                        <td>Capital City: </td>
                        <td> ${capitalCity}</td>
                        </tr>`,
                        `<tr>
                        <td class="text-center"><i class="fa-solid fa-users fa-xl text-success"></i></td>
                        <td>Population: </td>
                        <td> ${population}</td>
                        </tr>`,
                        `<tr>
                        <td class="text-center"><i class="fa-solid fa-mountain fa-xl text-success"></i></td>
                        <td>Country size: </td>
                        <td> ${areaInSqKm}km<sup>2</sup></td>
                        </tr>`,
                        `<tr>
                        <td class="text-center"><i class="fa-solid fa-earth-europe fa-xl text-success"></i></td>
                        <td>Continent:</td>
                        <td>${continent}</td>
                        </tr>`,
                        `<tr>
                        <td class="text-center"><i class="fa-solid fa-clock fa-xl text-success"></i></td>
                        <td>Timezone:</td>
                        <td>${annotations.timezone.name}</td>
                        </tr>`,
                        `<tr>
                        <td class="text-center"><i class="fa-solid fa-truck-fast fa-xl text-success"></i></td>
                        <td>Driving side:</td>
                        <td>${annotations.roadinfo.drive_on}</td>
                        </tr>`,
                    ];
                    rows.forEach(row => {
                        table.append(row);
                    });
                    $('#infoModalTable').append(table);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert('geoName error: ' + errorThrown);
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('OpenCage error: ' + errorThrown);
        }

        
    });

}

// Add wiki button to map
L.easyButton('fa-solid fa-wikipedia-w', function(btn, map) {
    wikiButton(currentCountryFeature.properties.name);
    $("#wikiModal").modal("show");
}).addTo(map);

function wikiButton(pageTitle) {
    $.ajax({
        url: 'libs/php/wiki.php',
        type: 'GET',
        data: { title: pageTitle },
        dataType: 'json',
        success: function(data) {
            console.log(data)
            var page = Object.values(data.query.pages)[0];
            if (page && page.extract) {
                $('#wikiBody').text(page.extract);
            } else {
                $('#wikiBody').text('No introduction available.');
            }
        },
        error: function() {
            $('#wikiBody').text('Failed to fetch Wikipedia content.');
        }
    });
}

// add bank button and functions to map
$(document).ready(function() {
    let exchangeRate = 4;  // Default value or initial rate
    let currencyCode = ''; // Global variable for currency code

    function updateConversion() {
        const dollars = parseFloat($('#dollars').val());
        if (!isNaN(dollars) && exchangeRate > 0) {
            $('#conversion').val((dollars * exchangeRate).toFixed(2));
        } else {
            $('#conversion').val('');
        }
    }

    $('#bankModalTable').on('input', '#dollars', function() {
        updateConversion();
    });

    function bankButton() {
        $('#bankModalTable').empty();
        $.ajax({
            url: "libs/php/infoButton.php",
            type: 'GET',
            dataType: 'json',
            data: { 
                openCageKey,
                countryIso_a2: currentCountryFeature.properties.iso_a2,
                countryName: currentCountryFeature.properties.name.trim(),
                lat: searchLat,
                long: searchLong
            },
            success: function(result) {
                const currency = result.results[0].annotations.currency;
                currencyCode = result.results[0].annotations.currency.iso_code; // Store currency code globally

                $.ajax({
                    url: "libs/php/openExchangeRates.php",
                    type: 'GET',
                    dataType: 'json',
                    data: { 
                        currencyCode,
                        openExchangeRatesKey,
                    },
                    success: function(result2) {
                        exchangeRate = result2.rates[currencyCode]; // Update global exchange rate

                        const rows = [
                            `<tr><td>Currency :</td><td>${currency.name}</td></tr>`,
                            `<tr><td>Symbol :</td><td>${currency.symbol}</td></tr>`,
                            `<tr><td>Exchange Rate (USD to ${currencyCode}):</td><td>${exchangeRate}</td></tr>`,
                            `<tr><td><input type="number" id="dollars" class="no-arrows"/></td><td><input type="number" id="conversion" class="no-arrows"/></td></tr>`
                        ];
                        rows.forEach(row => {
                            $('#bankModalTable').append(row);
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert('OpenExchangeRates error: ' + errorThrown);
                    }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('OpenCage error: ' + errorThrown);
            }
        });
    }

    // Add bank button to map
    L.easyButton('fa-solid fa-landmark', function(btn, map) {
        bankButton();
        $("#bankModal").modal("show");
    }).addTo(map);

});
// Add news button to map
L.easyButton('fa-solid fa-globe', function(btn, map) {
    newsButton();
    $("#newsModal").modal("show");
}).addTo(map);


function newsButton() {
    var storiesContainer = $('#newsModalTable');
    storiesContainer.empty(); // Clear previous content

    // Optionally, show a loading message or spinner
    storiesContainer.append('<p>Loading news...</p>');

    $.ajax({
        url: 'libs/php/serpapiApi.php',
        type: 'GET',
        data: { 
            serpapiKey: serpapiKey, // Ensure this variable is defined
            countryIso_a2: currentCountryFeature.properties.iso_a2 // Ensure this variable is defined
        },
        dataType: 'json',
        success: function(data) {
            storiesContainer.empty(); // Clear the loading message
            
            if (data && data.news_results && data.news_results.length > 0) {
                $.each(data.news_results, function(index, story) {
                    // Log story to debug
                    console.log('Processing story:', story);

                    // Check if the story object and its properties are defined
                    if (story && story.link && story.title && story.date && story.thumbnail) {
                        var storyHtml = `
                            <div class="story">
                                <h2><a href="${story.link}" target="_blank">${story.title}</a></h2>
                                <p>Date: ${story.date}</p>
                                <a href="${story.link}" target="_blank">
                                    <img src="${story.thumbnail}" alt="${story.title}" class="news-image">
                                </a>
                            </div>
                        `;
                        storiesContainer.append(storyHtml);
                    } else {
                        console.error('Invalid story object:', story);
                    }
                });
            } else {
                storiesContainer.text('No news articles found.');
            }
        },
        error: function(xhr, status, error) {
            storiesContainer.empty(); // Clear the loading message
            storiesContainer.text('Failed to fetch news content. Error: ' + error);
        }
    });
}



// Add weather button to map
L.easyButton('fa-solid fa-cloud-sun', function(btn, map) {
    weatherButton();
    $("#weatherModal").modal("show");
}).addTo(map);

function weatherButton() {
    $('#weatherModalTable').empty();

    // Ensure geoNameUsername and openWeatherKey are defined and valid
    if (typeof geoNameUsername === 'undefined' || typeof openWeatherKey === 'undefined') {
        alert('API keys are not defined.');
        return;
    }

    $.ajax({
        url: "libs/php/geoName.php",
        type: 'GET',
        dataType: 'json',
        data: { 
            geoNameUsername: geoNameUsername,
            countryIso_a2: currentCountryFeature.properties.iso_a2,
            openWeatherKey: openWeatherKey
        },
        success: function(result) {
            if (result.geonames && result.geonames.length > 0) {
                let capitalCity = result.geonames[0].capital;
                console.log(result);
                console.log("Capital city: ", capitalCity);

                // Use a second AJAX call to fetch the city ID for OpenWeatherMap
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=${openWeatherKey}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function(weatherResult) {
                        let cityId = weatherResult.id;

                        // Append the widget container to the table
                        $('#weatherModalTable').append('<div id="openweathermap-widget-15"></div>');
                        $('#weatherModalTable').append('<div id="openweathermap-widget-11" class="weather"></div>')
                        // Configure the weather widget with the fetched city ID
                        window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];
                        window.myWidgetParam.push({
                            id: 15,
                            cityid: cityId,
                            appid: openWeatherKey,
                            units: 'metric',
                            containerid: 'openweathermap-widget-15',
                        });

                        window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];
                        window.myWidgetParam.push({
                            id: 11,
                            cityid: cityId,
                            appid: openWeatherKey,
                            units: 'metric',
                            containerid: 'openweathermap-widget-11',
                        });

                        (function() {
                            var script = document.createElement('script');
                            script.async = true;
                            script.charset = "utf-8";
                            script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
                            var s = document.getElementsByTagName('script')[0];
                            s.parentNode.insertBefore(script, s);
                        })();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert('OpenWeatherMap error: ' + errorThrown);
                    }
                });
            } else {
                alert('No geonames data found.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('geoName error: ' + errorThrown);
        }
    });
}


