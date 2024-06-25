//airport weather
    $('#button1').click(function() {

        $.ajax({
            url: "libs/php/icao.php",
            type: 'GET',
            dataType: 'json',
            data: {
                airportCode: $('#airportCode').val(),
            },
            success: function(result) {
                console.log(JSON.stringify(result));
                if (result.status.name === "ok") {
                    $('#clouds').html(result['data']['clouds']);
                    $('#humidity').html(result['data']['humidity']);
                    $('#windSpeed').html(result['data']['windSpeed']);
                    $('#windDirection').html(result['data']['windDirection']);
                } else {
                    $('#clouds').html('Error: ' + result.status.description);
                    $('#humidity').html('Error: ' + result.status.description);
                    $('#windSpeed').html('Error: ' + result.status.description);
                    $('#windDirection').html('Error: ' + result.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error fetching data: ", textStatus, errorThrown);
                $('#clouds').html('Error retrieving data: ' + textStatus + ' - ' + errorThrown);
            }
        });

    });
//timezones
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
                console.log(JSON.stringify(result));
                if (result.status.name === "ok") {
                    $('#timezoneCountry').html(result['data']['timezoneId']);
                    $('#timezone').html(result['data']['time']);
                } else {
                    $('#timezoneCountry').html('Error: ' + result.status.description);
                    $('#timezone').html('Error: ' + result.status.description);

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error fetching data: ", textStatus, errorThrown);
                $('#clouds').html('Error retrieving data: ' + textStatus + ' - ' + errorThrown);
            }
        });

    });
//earthquake
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
                console.log(JSON.stringify(result));
                if (result.status.name === "ok") {
                    const earthquakes = result.data.earthquakes;
                    let tableBody = $('#earthquakeTable tbody');
                    tableBody.empty(); // Clear any existing rows

                    earthquakes.forEach(earthquake => {
                        let row = `<tr>
                            <td>${earthquake.datetime}</td>
                            <td>${earthquake.depth}</td>
                            <td>${earthquake.lng}</td>
                            <td>${earthquake.src}</td>
                            <td>${earthquake.eqid}</td>
                            <td>${earthquake.magnitude}</td>
                            <td>${earthquake.lat}</td>
                        </tr>`;
                        tableBody.append(row);
                    });
                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error fetching data: ", textStatus, errorThrown);
                $('#magnitude').html('Error retrieving data: ' + textStatus + ' - ' + errorThrown);
            }
        });

    });


