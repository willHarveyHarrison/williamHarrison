<?php
// Input validation and sanitization
$capitalCity = isset($_REQUEST['capitalCity']) ? htmlspecialchars($_REQUEST['capitalCity']) : '';
$openWeatherKey = isset($_REQUEST['openWeatherKey']) ? htmlspecialchars($_REQUEST['openWeatherKey']) : '';

if ($capitalCity && $openWeatherKey) {
    $url = "http://api.openweathermap.org/geo/1.0/direct?q=$capitalCity&appid=$openWeatherKey";

    // Debug: Print the URL
    error_log("API URL: " . $url);

    // Initialize a cURL session
    $ch = curl_init();
    // Set options to return the result as a string and follow redirects if any
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    // Set a timeout for the cURL request
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    // Set the URL for the cURL session
    curl_setopt($ch, CURLOPT_URL, $url);

    // Execute the cURL request and get the result
    $result = curl_exec($ch);

    // Check for cURL errors
    if ($result === false) {
        error_log('Curl error: ' . curl_error($ch));
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {
        // Debug: Print the raw result
        error_log("API Response: " . $result);

        // Check if the result is in JSON format
        $geoData = json_decode($result, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Handle JSON decode error
            error_log("JSON Decode Error: " . json_last_error_msg());
            echo json_encode(['error' => 'JSON decode error: ' . json_last_error_msg()]);
        } else {
            if (!empty($geoData)) {
                // Assuming the first result is the most relevant
                $lon = $geoData[0]['lon'];
                $lat = $geoData[0]['lat'];

                $url2 = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$openWeatherKey";

                curl_setopt($ch, CURLOPT_URL, $url2);
                $result = curl_exec($ch);

                if ($result === false) {
                    error_log('Curl error: ' . curl_error($ch));
                    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
                } else {
                    // Debug: Print the raw result
                    error_log("API Response: " . $result);

                    // Check if the result is in JSON format
                    $weatherData = json_decode($result, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        // Handle JSON decode error
                        error_log("JSON Decode Error: " . json_last_error_msg());
                        echo json_encode(['error' => 'JSON decode error: ' . json_last_error_msg()]);
                    } else {
                        // Set content type header
                        header('Content-Type: application/json; charset=UTF-8');
                        // Output JSON
                        echo json_encode($weatherData);
                    }
                }
            } else {
                echo json_encode(['error' => 'No geolocation data found for the specified capital city.']);
            }
        }
    }

    // Close the cURL session
    curl_close($ch);
} else {
    echo json_encode(['error' => 'Invalid input parameters.']);
}
?>
