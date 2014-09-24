<?php


ini_set('auto_detect_line_endings', true);
//$dir = dirname(dirname($_SERVER['SCRIPT_FILENAME'])) . '/rawdata/';

//$csv = $dir . "alllabs.lab";
//$coords_filename = $dir . "coords.txt";

$csv =  "/alllabs.lab";
$coords_filename =  "coords.txt";
$geojson = csv2geojson( $csv, $coords_filename);

echo $geojson;


$arr = array();
$col_headers = array();

exit;

/*
0, FieldSampleID
1, Site name
2, Station Name
3, Samp.Date
4, Samp.Top
5, Samp.Base
6, BasisDescription
7, Sample Matrix
8, Compound
9, Value
10, ValueAndFlag
11, Reporting Units
*/

function csv2geojson( $csv, $coords_filename )
{
global $arr;
global $col_headers;
$minDepth=$_GET["minDepth"];
$maxDepth=$_GET["maxDepth"];
$matrix = $_GET["matrix"];

if($_GET["matrix"]){
	$matrix=$_GET["matrix"];
}
else {
	$matrix="Soil Gas";
}


	if(!$csv)
		die("Invalid CSV filename");

	$row = 1;
	$arr = array();

	$coords = file_get_contents($coords_filename);
	$arr_coords = unserialize($coords);

	if(!$coords || !$arr_coords)
		die("Invalid coords.txt file path");

	//$arr_station_names = array();
	$col_headers = false;
	if (($handle = fopen($csv, "r")) !== FALSE) {
		while (($data = fgetcsv($handle, 20000, ",")) !== FALSE) {

			if(!$col_headers)
			{
				$col_headers = $data; //get the column headers from first row

				$attribute_names = $col_headers;
				unset($attribute_names[2]); //this is voodoo...
				continue;
			}

			$row++;  //Do we need this?

			$key = $data[2];           //Station ID (location)
			$value = $data[10];        //value
			$top_depth = $data[4];     //top
			$bottom_depth = $data[5];  //bottom
			$sample_matrix = $data[7];

			if($matrix && $matrix != $sample_matrix)
				continue;

			if(!$value)continue;
			$parameter = $data[8];     //Compound name
			$fieldsampleid = $data[0]; //sample id
			$arr[ $key ][ $parameter ][] = $data;   // Dictionary of stations and compounds as keys to arrays of sample data.
		}
		fclose($handle);
	}

	$arr2 = array();

	$properties = array();

	$arr_all_compounds = array();

	foreach($arr as $station => $compounds)
		foreach($compounds as $compound => $all_details)
			$arr_all_compounds[ trim($compound) ] ++;


	foreach($arr as $station => $compounds) {
		$a=0;
		if(!$arr_coords[$station])
			continue;

		$maxes = array();   //Array to hold the record with the maximum reading for each compound at this station. "$maxes["Chlorobenzene"]==Array

		$properties[$a]['type'] = "Feature";
		$properties[$a]['geometry'] = array("type" => "Point", "coordinates" => array((double)$arr_coords[$station]['X'] , (double)$arr_coords[$station]['Y']));
		foreach($compounds as $compound => $all_details)
		{

			$compound = trim($compound);

			foreach($all_details as $details)
			{
				$details[8] = str_ireplace( array("(", ")"), "", $details[8]);

				if ($details[9] > $maxes[$compound][10]){  //if the current sample value is greater than the maximum, replace the maximum with the current.
					$maxes[$compound]=$details;
				}
			}

			// Rajesh - 28 August 2014 - Show N/A for compounds having NO values.

			if(!$maxes[$compound])
				$maxes[$compound][10]="ND";     // Yes, this should be ND and not NA   -Dalton
		}

		// Rajesh - 28 Aug, 14 - Debug compounds having values from previous stations

		$properties[$a]["properties"]["Compounds"] = false;

		foreach($maxes as $compound => $sampledata)
		{
			$properties[$a]["properties"]["Compounds"][$compound] = $sampledata[10];
		}

		foreach($arr_all_compounds as $compound => $false)
		{
			if(!$properties[$a]["properties"]["Compounds"][$compound])
			{
				$properties[$a]["properties"]["Compounds"][$compound] = "NA";
			}
		}

		// sort the compounds arrays for each location by Compound

		ksort($properties[$a]["properties"]["Compounds"]);

		// Check total no. of compounds
		//echo "total compounds in $station: " . count($properties[$a]["properties"]["Compounds"]). "<br>";

		$properties[$a]["properties"]['StationID'] = $station;
		//$properties[$a]["properties"]['Dilution'] = $sampledata[9];
		$properties[$a]["properties"]['Matrix'] = $matrix;
		$arr2[] = $properties;
		$a++;
		//echo json_encode($maxes)."\n\n";
	}

	$geojson = '';

	$geojson .= '{
	"type": "FeatureCollection",
		"features": [';


	$json_features = "";
	foreach($arr2 as $features)
		foreach($features as $feature)
				$json_features.= "\r\n\t\t" . json_encode($feature) . ",";

	$json_features = trim($json_features, ",");

	$geojson .=  $json_features ;

	$geojson .= '
		]
	}
	';


	return $geojson;

}

