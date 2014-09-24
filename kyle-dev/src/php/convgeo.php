<?php

$string = file_get_contents("coords2.geojson"); 
$json = json_decode($string, true);


$coords=array();

foreach ($json["features"] as $feature){
   $id = $feature["properties"]["SampleLoca"];
   $coords[$id]['X'] = $feature["geometry"]["coordinates"][0];
   $coords[$id]['Y'] = $feature["geometry"]["coordinates"][1];
   $coords[$id]['id'] = $id;
}

file_put_contents("coords.txt",serialize($coords));

echo "Done.";
?>




