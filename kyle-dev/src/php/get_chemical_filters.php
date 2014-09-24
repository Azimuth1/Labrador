<?php
session_start();
if(isset($_SESSION['chemical_filters']) && (!is_null($_SESSION['chemical_filters'])) && is_array($_SESSION['chemical_filters']) && (!empty($_SESSION['chemical_filters']))) {
echo json_encode($_SESSION['chemical_filters']);
} else {
	echo '';
}


?>