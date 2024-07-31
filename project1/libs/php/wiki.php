<?php
header('Content-Type: application/json');

// Check if 'title' is provided in the query string
if (isset($_GET['title'])) {
    $pageTitle = urlencode($_GET['title']);
    
    // Wikipedia API URL
    $url = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=$pageTitle&prop=extracts&exintro=True&explaintext=True&origin=*";
    
    // Fetch the content from Wikipedia
    $response = file_get_contents($url);
    
    // Output the response
    echo $response;
} else {
    echo json_encode(['error' => 'No title provided']);
}
?>