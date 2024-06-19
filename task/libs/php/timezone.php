<?php
// Start time for execution measurement
$executionStartTime = microtime(true);

// Validate input parameters
if (!isset($_REQUEST['lat']) || !isset($_REQUEST['lng']) || !is_numeric($_REQUEST['lat']) || !is_numeric($_REQUEST['lng'])) {
    $output['status']['code'] = 400;
    $output['status']['name'] = "error";
    $output['status']['description'] = "Invalid input parameters";
    $output['data'] = [];
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit();
}

// Sanitize input
$lat = filter_var($_REQUEST['lat'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$lng = filter_var($_REQUEST['lng'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

// Build the request URL
$url = 'http://api.geonames.org/timezoneJSON?lat=' . $lat . '&lng=' . $lng . '&radius=50&username=billboney';

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
    
    if (isset($decode)) {
        // Prepare output
        $output['status']['code'] = 200;
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) * 1000 . " ms";
        $output['data'] = $decode;
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
