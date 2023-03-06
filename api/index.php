<?php

require '../vendor/autoload.php';

//
$_POST = GUMP::xss_clean($_POST);

$is_valid = GUMP::is_valid($_POST, [
    'name' => 'required|max_len,200',
    'phone' => 'required|max_len,200',
    'address' => 'required|max_len,2000',
    'product' => 'required|max_len,200',
]);

header('Content-Type: application/json');

if ($is_valid === true) {

    //
    date_default_timezone_set('CET');

    //
    $spreadsheetId = "1OEkMtaZHtOX6HjfSRmCym_I-MdFzZLG53RznG9JIs1M";

    // 
    $ip = $_SERVER['REMOTE_ADDR'];
    $ipGeoLocation = json_decode(file_get_contents("http://ip-api.com/json/$ip"));
    $city = $ipGeoLocation->city ?? '';
    
    // 
    $client = new \Google_Client();
    $client->setApplicationName('Google Sheets and PHP');
    $client->setScopes([\Google_Service_Sheets::SPREADSHEETS]);
    $client->setAccessType('offline');
    $client->setAuthConfig(__DIR__ . '/credentials.json');
    $service = new Google_Service_Sheets($client);

    $service->spreadsheets_values->append(
        $spreadsheetId, 
        'A2:F2', 
        new Google_Service_Sheets_ValueRange([
            'values' => [
                [
                    date('d/m/Y H:i'),
                    $_POST['name'],
                    $_POST['phone'],
                    $_POST['address'],
                    $city,
                    $_POST['product']
                ]
            ]
        ]), 
        [ 'valueInputOption' => 'RAW' ]
    );

    echo json_encode(['message' => 'Done!']);
    
} else {
    header("HTTP/1.0 400 Bad Request");
    echo json_encode(['message' => 'Invalid request']);
}