document.addEventListener("DOMContentLoaded", function(event) {
	(function () { 
		prepareCentralPlace = () =>{
			let centralPlace = document.querySelector(".central-place");
			if (centralPlace.classList.contains('grid-place')) {
				let rows = centralPlace.getAttribute("rows");
				let cols = centralPlace.getAttribute("cols");
				let gpg = new GridPlaceGenerator(
			      {
			        rows:rows, 
			        cols:cols, 
			        wrapper: ".central-place", 
			      }
			    );
			    
			    gpg.generatePlaces();

			    // Silly Joel...don't do places.push here.
			     places = gpg.getGeneratedPlaces();
			}

		}



    // If you're doing a Display Wall type of thing, give this a shot!
    // If we don't want our users to write any JS we can write something to
    //    consume markup to initiate the Places
    
    prepareCentralPlace();
    const flightPlan = new FlightPlan(places, {control:true, startingPhaseIndex:0});

	})()
});