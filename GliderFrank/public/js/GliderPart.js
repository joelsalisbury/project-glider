class GliderPart {
	constructor(id, props) {

		this.id = id;
		this.domElement = document.getElementById(id);
		this.defaultViewElement = this.domElement.querySelector('.view-default');

	}

	getDefaultView() {
		//console.log(this.id);
		this.defaultViewElement.style.height="100%";
		this.defaultViewElement.style.width="100%";
		let clone = this.defaultViewElement.cloneNode(true);

		return clone;
	}
}