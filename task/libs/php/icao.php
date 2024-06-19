<?php
// Start time for execution measurement
$executionStartTime = microtime(true);

// Build the request URL
$url = 'http://api.geonames.org/weatherIcaoJSON?ICAO=' . $_REQUEST['airportCode'] . '&username=billboney';

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // Verify SSL in production
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute cURL request
$result = curl_exec($ch);

// Check for cURL errors
if ($result === false) {
    $output['status']['code'] = curl_errno($ch);
    $output['status']['name'] = "error";
    $output['status']['description'] = curl_error($ch);
    $output['data'] = [];
    curl_close($ch);
} else {
    curl_close($ch);
    
    // Decode JSON response
    $decode = json_decode($result, true);
    
    if (isset($decode['weatherObservation'])) {
        // Prepare output
        $output['status']['code'] = 200;
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) * 1000 . " ms";
        $output['data'] = $decode['weatherObservation'];
    } else {
        $output['status']['code'] = 500;
        $output['status']['name'] = "error";
        $output['status']['description'] = "Invalid response from API";
        $output['data'] = [];
    }
}

// Set content type header
header('Content-Type: application/json; charset=UTF-8');

// Output JSON
echo json_encode($output);
?>
