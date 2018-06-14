<!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Grid Layout Example</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="manifest" href="site.webmanifest">
  <link rel="apple-touch-icon" href="icon.png">
  <!-- Place favicon.ico in the root directory -->

  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/main.css">
</head>

<body>


<?php
// The file FlightPlan.html contains a document that represents the FlightPlan
if (file_exists('FlightPlan.html')) {

	echo "<Parts>";
    $activeParts = glob('../parts/*' , GLOB_ONLYDIR);
	foreach($activeParts as $dir) {
		$file = $dir."/index.html";
		if(file_exists($file)) {
			echo file_get_contents($file);
		}
	}
	echo "</Parts>";

	include 'FlightPlan.html';
  include 'CentralPlace.html';
?>

  <script src="js/vendor/modernizr-3.6.0.min.js"></script>

  <script src="js/plugins.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
  <script src="js/MessageService.js"></script>
  <script src="js/GliderPart.js"></script>
  <script src="js/Place.js"></script>
  <script src="js/GridPlaceGenerator.js"></script>

  <script src="js/FlightPlan.js"></script>
  <script src="js/Flight.js"></script>

<?php
} else {
    exit('Failed to open FlightPlan');
}
?>