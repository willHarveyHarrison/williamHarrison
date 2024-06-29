$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
    $(this).remove();
    });
    }
    });
    

$(document).ready(function() {
    $('#button1').click(function() {
        $.ajax({
            url: "libs/php/icao.php",
            type: 'GET',
            dataType: 'json',
            data: {
                airportCode: $('#airportCode').val(),
            },
            success: function(result) {
                if (result.status.name === "ok") {
                    $('#result1').html(
                        `<table>
                            <tr><td>Clouds:</td><td>${result.data.clouds}</td></tr>
                            <tr><td>Humidity:</td><td>${result.data.humidity}</td></tr>
                            <tr><td>Wind Speed:</td><td>${result.data.windSpeed}</td></tr>
                            <tr><td>Wind Direction:</td><td>${result.data.windDirection}</td></tr>
                        </table>`
                    );
                } else {
                    $('#result1').html('Error: ' + result.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#result1').html('Error retrieving data: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });

    $('#button2').click(function() {
        $.ajax({
            url: "libs/php/timezone.php",
            type: 'GET',
            dataType: 'json',
            data: {
                lat: $('#lat').val(),
                lng: $('#lng').val(),
            },
            success: function(result) {
                if (result.status.name === "ok") {
                    $('#result2').html(
                        `<table>
                            <tr><td>Country:</td><td>${result.data.timezoneId}</td></tr>
                            <tr><td>Timezone:</td><td>${result.data.time}</td></tr>
                        </table>`
                    );
                } else {
                    $('#result2').html('Error: ' + result.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#result2').html('Error retrieving data: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });

    $('#button3').click(function() {
        $.ajax({
            url: "libs/php/earthquakes.php",
            type: 'GET',
            dataType: 'json',
            data: {
                north: $('#north').val(),
                south: $('#south').val(),
                east: $('#east').val(),
                west: $('#west').val(),
            },
            success: function(result) {
                if (result.status.name === "ok") {
                    let earthquakes = result.data.earthquakes;
                    let table = `<table>
                                    <thead>
                                        <tr>
                                            <th>Datetime</th>
                                            <th>Depth</th>
                                            <th>Longitude</th>
                                            <th>Source</th>
                                            <th>EQID</th>
                                            <th>Magnitude</th>
                                            <th>Latitude</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                    earthquakes.forEach(earthquake => {
                        table += `<tr>
                                    <td>${earthquake.datetime}</td>
                                    <td>${earthquake.depth}</td>
                                    <td>${earthquake.lng}</td>
                                    <td>${earthquake.src}</td>
                                    <td>${earthquake.eqid}</td>
                                    <td>${earthquake.magnitude}</td>
                                    <td>${earthquake.lat}</td>
                                  </tr>`;
                    });
                    table += `</tbody></table>`;
                    $('#result3').html(table);
                } else {
                    $('#result3').html('Error: ' + result.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#result3').html('Error retrieving data: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });
});
