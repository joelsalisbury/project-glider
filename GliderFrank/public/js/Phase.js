class Phase {
  constructor(id,duration,matchups) {
    this.id = id;
    this.duration = duration;
    this.matchups = matchups
  }

  do() {
    for(var display in matchups) {
      display.place.renderContent(display.part.getContent());
    }
  }
}