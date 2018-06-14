class Place {

  constructor(id, props) {
    
    let that = this;

    this.id = id;
    this.isActive = false;
    this.domWrapper;

    for (var key in props) {
      if (that.hasOwnProperty(key)) {
          that[key] = props[key];
      }
    }

    this.parent = props.parent;

    this.setupDomWrapper();
    this.preparedContent = document.createTextNode("");
    this.setContent(this.preparedContent);

    
  }

  setupDomWrapper() {
    this.domWrapper = document.createElement("div");
    this.domWrapper.classList.add("place");
    this.domWrapper.classList.add("place-id-"+ this.id);
    this.domWrapper.setAttribute("place-id", "place-" + this.id);
  }

  setContent(content) {
    this.domWrapper.innerHTML = "";
    this.domWrapper.appendChild(content);
  }

  constructCSS() {
    // stubby stub stub. overload this plz.
  }

  activate () {
    this.isActive = true;
    console.log("activating");
    this.constructCSS();
    this.parent.appendChild(this.domWrapper);
  }

  deactivate() {
    this.isActive = false;
    let hasChild = this.domWrapper.parentNode == this.parent;
      if (hasChild) {
            console.log("DEACTIVATING");

        console.log("deactivating");
        this.parent.removeChild(this.domWrapper);
      }
  }
}

class GridPlace extends Place {
  // Assumed to be CSS Grid
  constructor(id, props){
    super(id, props);

    //category, row, column, spanrows, spancols

    this.row = props.row;
    this.column = props.col;
    this.spanRows = props.spanRows;
    this.spanCols = props.spanCols;
    

  }

  constructCSS() {
    // from row, column, spanrows, spancols, etc;
    
    this.domWrapper.style.gridRow = this.row + " / span " + this.spanRows;
    this.domWrapper.style.gridColumn = this.column + " / span " + this.spanCols;
    
  }
}