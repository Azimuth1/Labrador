<?php
session_start();

if(isset($_POST['chemical_filters'])) {
	$_SESSION['chemical_filters'] = explode(', ', $_POST['chemical_filters']);
}

echo "All filters are successfully applied"
?>
