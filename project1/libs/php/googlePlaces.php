<?php
// Retrieve and sanitize input parameters
$googlePlaceskey = isset($_REQUEST['googlePlaceskey']) ? htmlspecialchars($_REQUEST['googlePlaceskey']) : '';
$countryName = isset($_REQUEST['countryName']) ? htmlspecialchars($_REQUEST['countryName']) : '';
$searchType = isset($_REQUEST['searchType']) ? htmlspecialchars($_REQUEST['searchType']) : '';

// Validate input parameters
if (empty($googlePlacesKey) || empty($countryName) || empty($searchType)) {
    echo json_encode(['error' => 'Missing required parameters.']);
    exit;
}

// Construct the URL with the provided parameters
$url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=${googlePlaceskey}&query=${searchType}+in+${countryName}";

// Initialize cURL
$ch = curl_init();

// Set the cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request and get the result
$result = curl_exec($ch);

// Check for cURL errors
if ($result === false) {
    error_log('Curl error: ' . curl_error($ch));
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

// Close the cURL session
curl_close($ch);

// Debug: Print the raw result
error_log("API Response: " . $result);

// Check if the result is in JSON format
$output = json_decode($result, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    // Handle JSON decode error
    error_log("JSON Decode Error: " . json_last_error_msg());
    echo json_encode(['error' => 'JSON decode error: ' . json_last_error_msg()]);
} else {
    // Set content type header
    header('Content-Type: application/json; charset=UTF-8');
    // Output JSON
    echo json_encode($output);
}
?>
