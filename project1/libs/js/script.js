
//map init
var map = L.map('map');

//map view bound box
map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);

//
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
