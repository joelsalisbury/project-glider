
// ============================ PART DEFINITIONS ============================

// A Part Type with no views (only one)

class TestPart_SingleView extends Part {
  
    constructor(domNode, args) { 
      
      // These should be required
      
      super(args); // Call Part constructor
      let thisPart = this.shared; // Interface for shared Part store
      
      // Set up variables
  
      this.green = 'Orange';   // This is a Client Property -- local to the Part Client
      thisPart.x = 4;          // This is a Part Property -- shared between all Clients of this Part
      thisPart.y = this.green; // TODO: this makes a copy of 'Orange' and makes it shared. Changing the shared copy does NOT update the local
      
      // TODO: Maybe better to "register" local methods/properties as "shared"?
      
      // A Part method
      // This is a function that, when called, is called on all clients
      
      thisPart.doSomething = function (x) {
        console.log('DOING SOMETHING WITH ARGUMENTS: ');
        console.log(arguments);
        console.log(' -- AND _this_ is set to ' + this.clientId);
      }
      
      // This points to a Client method -- effectively turning it into a
      //  Part method that is "shared" across all Part Clients
      
      thisPart.doSomethingElse = this.doSomethingElse;
  
      // State handlers -- both transitions and method calls
      // By default there is are 'active' and 'inactive' states
      // Is there any reason to add more states? Is there any reason NOT to?
  
      this.when.active.enter        = () => console.log("I'm becoming active!");
      //this.when.active.doSomething3 = () => console.log("I'm active and doing something!"); // NOT IMPLEMENTED - TODO
      this.when.active.exit         = () => console.log("I'm becoming not active!");
      
      this.when.inactive.enter        = () => console.log("I'm becoming inactive!");
      //this.when.inactive.doSomething3 = () => console.log("I'm inactive and (yet) doing something!"); // NOT IMPLEMENTED - TODO
      this.when.inactive.exit         = () => console.log("I'm becoming not inactive!"); 
    }
    
    // A Part method
    
    doSomethingElse(a1,a2,a3) {
      console.log('DOING SOMETHING ELSE! WITH ARGUMENTS:');
      console.log(`${a1}::${a2}::${a3}`);
      console.log('AND THIS: ' + this.clientId);
      return "RETURN VALUE";
    }
  }
  
  
  // A Part Type with multiple views
  
  class TestPart_MultiView extends Part {
    
    constructor(domNode, args) {
      
      // These should be required
      
      super(args); // Call Part constructor
      let thisPart = this.shared; // Interface for shared Part store
      
      // Arg object contains .view which is an array
      //  of { name: <viewname>, domNode: <View DOM Node>, args: <parsed arguments from DOM> }
      
      // Multiple views
      
      this.views = {
        wall: {
          render: () => '<span>On the wall</span>',
          settings: { // These can be edited through the GUI, and values can be overriden in DOM
            width: { type: Number, label: 'The width of the thing', value: 1000 },
            height: { type: Number, label: 'The height of the thing', value: 1000 },
            text:  { type: String, label: 'The text content of the thing', value: '<FILL IN TEXT>' }
          }
        },
        mobile: {
          render: () => '<span>On your phone</span>',
          someViewProperty: 3
        }
      };
      
      /*
      this.views = {
        wall: new PartView({
          render: () => '<span>On the wall</span>',
          parameters: { // These can be edited through the GUI
            width: Number, 
            height: Number, 
            label: String
          }
        }),
        mobile: new PartView({
          render: () => '<span>On your phone</span>',
          someViewProperty: 3
        })
      }
      */
      
      // When .views is set, it automatically pulls in the View options
      //  passed in args
      
      /* OR IS THIS BETTER? 
      
      this.view.wall.render = function () {}
      this.view.wall.width = 300;
      this.view.wall.parameters.height.type = Number;
      this.view.wall.parameters.height.default = 300;
      this.view.wall.parameters.height.title = 'The height of the view';
      
      */
      
    }
  }
  
  // Registry of part types -- keys have to match the DOM classname
  //  e.g. class name "part-frank" requires a key "frank"
  
  Part.types = {
    identity: TestPart_SingleView,
    viewtest: TestPart_MultiView
  }