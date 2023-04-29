<?php

$code = $_GET['code'];


$url = "https://www.alphavantage.co/query?function=$code&interval=monthly&apikey=GXZJLWJUQFSQK09S";

$data = json_decode(file_get_contents($url),true);

header('Content-Type: application/json');
echo json_encode($data);

exit;



//The structure in the API Code :
//{
//    "name": "Global Price of Copper", // $data[name]
//    "interval": "monthly",            // $data[interval]
//    "unit": "dollar per metric ton",  // $data[unit]
//    "data": [
//        {
//            "date": "2023-02-01", // $data[data][0]["date"]
//            "value": "8936.587"   // $data[data][0]["value"]
//        }, ...
//}