<?php

function fetchGeocodeData($url) {
    // Initialize a cURL session
    $ch = curl_init();
    
    // Set the URL option for the cURL session
    curl_setopt($ch, CURLOPT_URL, $url);
    
    // Set options to return the result as a string and follow redirects if any
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    // Execute the cURL request and get the result
    $result = curl_exec($ch);
    
    // Check for cURL errors
    if ($result === false) {
        return 'Curl error: ' . curl_error($ch);
    }
    
    // Close the cURL session
    curl_close($ch);
    
    return $result;
}

// Input validation and sanitization
$openCageKey = isset($_REQUEST['openCageKey']) ? htmlspecialchars($_REQUEST['openCageKey']) : '';
$countryName = isset($_REQUEST['countryName']) ? urlencode(htmlspecialchars($_REQUEST['countryName'])) : '';
$countryIso_a2 = isset($_REQUEST['countryIso_a2']) ? urlencode(htmlspecialchars($_REQUEST['countryIso_a2'])) : '';
$lat = isset($_REQUEST['lat']) ? htmlspecialchars($_REQUEST['lat']) : '';
$long = isset($_REQUEST['long']) ? htmlspecialchars($_REQUEST['long']) : '';

if (empty($openCageKey)) {
    echo 'Error: Missing API key.';
    exit;
}

// Define the URLs with the OpenCage API key and query parameters
$url1 = "https://api.opencagedata.com/geocode/v1/json?key=$openCageKey&q=$countryName&countrycode=$countryIso_a2&pretty=1";
$url2 = "https://api.opencagedata.com/geocode/v1/json?key=$openCageKey&q=$lat%2C$long&pretty=1";

// Try the first URL
$result = fetchGeocodeData($url1);

if (strpos($result, 'Curl error:') !== false) {
    // If there was an error, try the second URL
    $result = fetchGeocodeData($url2);
}

// Output the result
if (strpos($result, 'Curl error:') !== false) {
    // If both requests fail, output the error
    echo $result;
} else {
    // Decode the JSON response
    $output = json_decode($result, true);
    
    // Encode the response in JSON format
    echo json_encode($output, JSON_PRETTY_PRINT);
}

?>
