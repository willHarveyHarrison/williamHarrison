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

