<?php

// If you think about it, each "Place" has its own custom Flight Plan.
// Of course, even a custom Place needs to know about the whole FlightPlan, but not get all the assets
// This helps us not spam the user with downloaded assets they aren't using
// Also helps presenter keep things slim and compartmentalized
// But never fear! @route /flight gives the whole thing as a whole document, for record-keeping, etc.

function getFlightPlanForPlace($place) {
	// get whole flight plan as object
	// whittle out phases where $place isn't referenced
	// return HTML (probably)
	$doc = new DOMDocument();

	$doc->load("FlightPlan.html");
	$fp = $doc->getElementsByTagName("FlightPlan");
	$fp = $fp[0];


	$phases = $fp->getElementsByTagName("phase");

	$new_fp =  new DOMDocument();
	$activeParts = array();

	$i = 0;
	foreach ($phases as $phase) {
		foreach ($phase->getElementsByTagName("display") as $display) {
			if($display->getAttribute("place") == $place) {
				$activeParts[] = $display->getAttribute("part");
				$phase->setAttribute("id", $i);
		   		$new_fp->appendChild($new_fp->importNode($phase, true));
		   	}
		   	$new_fp->saveHTML();
		}
		$i++;
	}

	$ret['activeParts'] = $activeParts;
	$ret['fp'] = $new_fp;

	return $ret;

}

function getPartMarkup($path) {
	$file = $_SERVER['DOCUMENT_ROOT']. "/../parts/".$path."/index.html";
	if(file_exists($file)) {
		return file_get_contents($file);
	} else {
		exit ("file " .$file. " not found.");
	}
}