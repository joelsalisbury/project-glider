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

  <link rel="stylesheet" href="../css/normalize.css">
  <link rel="stylesheet" href="../css/main.css">
</head>

<body>

<?php 
// First, get all phases where this Place has any content.
// Then, for each of those phases, load the part and hide it in the dom.
// Then, listen for Remote Message Broker to indicate phase and "light up" that phase.

$FPInfo = getFlightPlanForPlace($placeId);
$fp = $FPInfo['fp'];
$activeParts = $FPInfo['activeParts'];

echo "<Parts>";
foreach($activeParts as $part) {
    $file = "../parts/".$part."/index.html";
    if(file_exists($file)) {
      echo file_get_contents($file);
    }
}

echo "</Parts>";

// echo "<FlightPlan>";
// echo $fp->saveHTML();
// echo "</FlightPlan>";

include 'FlightPlan.html';



?>

<div class="place place-fluid" id="place-mobile"></div>
</body>

<script src="../js/vendor/modernizr-3.6.0.min.js"></script>

<script src="../js/plugins.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>





<script src="../js/MessageService.js"></script>
<script src="../js/GliderPart.js"></script>
<script src="../js/Place.js"></script>
<script src="../js/GridPlaceGenerator.js"></script>

<script src="../js/FlightPlan.js"></script>
<script>
  let places = [];
  let parent = document.querySelector(".place");
  let place3 = new Place("<?php echo $placeId; ?>", {parent:parent});
  places.push(place3);

  const remotePhase = firebase.database().ref().child('phase');



  //var flightPlan = new FlightPlan(places, {control:false, startingPhaseIndex: remotePhase});

  // should be replaced with subscribe
   remotePhase.on('value', function(snapshot) {
      myphase = snapshot.val();
      flightPlan = new FlightPlan(places, {control:false, startingPhaseIndex: myphase});
    });

</script>
