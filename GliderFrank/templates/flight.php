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
// The file test.xml contains an XML document with a root element
// and at least an element /[root]/title.
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
?>

<script src="js/vendor/modernizr-3.6.0.min.js"></script>

  <script src="js/plugins.js"></script>






  <script src="js/MessageService.js"></script>
  <script src="js/GliderPart.js"></script>
  <script src="js/Place.js"></script>
  <script src="js/GridPlaceGenerator.js"></script>

  <script src="js/FlightPlan.js"></script>
  <script src="js/main.js"></script>

  <script>

    let customPlace = getRequestParam("place");

    // Should move this to the FlightPlan class
    const MB = new MessageService({});

    // If you're doing a Display Wall type of thing, give this a shot!
    // If we don't want our users to write any JS we can write something to
    //    consume markup to initiate the Places
    let gpg = new GridPlaceGenerator(
      {
        rows:3, 
        cols:4, 
        wrapper: ".central-layout", 
      }
    );
    
    gpg.generatePlaces();

    // Silly Joel...don't do places.push here.
    let places = gpg.getGeneratedPlaces();

    const flightPlan = new FlightPlan(places);


  </script>







<?php
} else {
    exit('Failed to open FlightPlan');
}
?>