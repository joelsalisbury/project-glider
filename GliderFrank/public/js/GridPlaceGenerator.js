class GridPlaceGenerator {
	constructor(props) {

		this.rows = props.rows;
		this.cols = props.cols;

		this.generatedPlaces = [];

		

		this.parent = document.querySelector(props.wrapper);


	}

	generatePlaces() {
		// create permutations of rows, cols, and spans. probably should use map. sue me.
		
		for (var row = 1; row <= this.rows; row++) {
			for (var col = 1; col <= this.cols; col++) {
				// which starting row, which starting column, how many rows to span, how many cols to span
				for (var spanRow = 1; spanRow <= this.rows; spanRow++) {
					for (var spanCol = 1; spanCol <= this.cols; spanCol++) {
						let props = {
							row: row,
							col: col,
							spanRows: spanRow,
							spanCols : spanCol,
							parent: this.parent
						}

						let id = "r" + row + "c" + col + "h" + spanRow + "w" + spanCol;

						let place = new GridPlace(id, props);

						this.generatedPlaces.push(place);
					}
				}
			}
		}
	}

	getGeneratedPlaces() {
		console.log("Generated Places: ");
		console.log(this.generatedPlaces);
		return this.generatedPlaces;
	}
}