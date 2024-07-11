import { tomtomkey } from './keys.js'; // Correct import syntax

//map init
var map = L.map('map');

//map view bound box
map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);

// key GGiMAxkJKRgTAzMbVBjLtVQOHwfEY4Rd
var tomtomsatellite = L.tileLayer(`https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=${tomtomkey}`, {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//
var streetView = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


streetView.addTo(map);

var infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
    $("#exampleModal").modal("show");
  });

  infoBtn.addTo(map);