<?php
// Input validation and sanitization
$openExchangeRatesKey = isset($_REQUEST['openExchangeRatesKey']) ? htmlspecialchars($_REQUEST['openExchangeRatesKey']) : '';

$url = "https://openexchangerates.org/api/latest.json?app_id=$openExchangeRatesKey";

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
}

// Close the cURL session
curl_close($ch);
?>
