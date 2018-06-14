  

/*

  TODO: 
  
  Need to work out exactly how default views work
  Test TestPart (single view)

*/

// CONSTANTS - TODO: move to global Glider object or ...?

var PART_CLASSNAME_PREFIX = 'part-',
    PART_ID_PREFIX = 'part-id-',
    PART_CLIENT_ID_PREFIX = 'part-client-id-',

    // parsing @part-options

    PART_OPTIONS_ATTRIBUTE_NAME = 'part-options',
    PART_OPTIONS_SEPARATOR = ',',
    PART_OPTIONS_EQUALS = ':';
  
// ============================ PART BASE CLASSES ============================

// PART BASE CLASS

class Part {
  
  constructor(args) {

    var thisPart = this;
    
    // Proxy for storage -- intercepts changes to properties and 
    //  routes them to message broker
    
    function getPartStorage(sharedStorage) {
      
      // Set up traps
      
      let handler = {
        
        set: (pStore, prop, value) => {
          
          // Only send out update if the property value changes
          // Also, functions are only defined locally 
          //  (for now -- maybe we could make functions read-only instead)
          
          if (typeof(value) === 'function') {
            
            let partMethod = value,
                partMethodName = prop;
            
            let functionHandler, functionHandlerVersion = 2;
            
            // VERSION 1 - Part functions are hung off of .shared
            
            if (functionHandlerVersion === 1) {
              console.log("VERSION 1");
              functionHandler = {
                apply: function(target, thisArg, argumentsList) {
                  thisPart.remoteCallToPart(partMethodName, argumentsList);
                  console.log(`CALLING ${partMethodName}: ${argumentsList}`);
                  return target.apply(thisPart, argumentsList);
                }
              };
            } else if (functionHandlerVersion === 2) {
              console.log("VERSION 2");
              // VERSION 2 - If called via .shared, just calls a local method
              //  Function needs to be registered as a Part function
              
              functionHandler = {
                apply: function(target, thisArg, argumentsList) {
                  console.log(`CALLING ${partMethodName} WITH ARGS ${argumentsList}`);
                  thisPart.remoteCallToPart(partMethodName, argumentsList);
                  return thisPart[partMethodName].apply(thisPart, argumentsList);
                }
              }; 
            }
            
            pStore[prop] = new Proxy(partMethod, functionHandler);

          } else if (pStore[prop] !== value) {
            thisPart.sendToPart('Update ' + prop + ' to value ' + value);
            pStore[prop] = value;
          }
          
          return pStore[prop];
        }
      }

      return new Proxy(sharedStorage, handler);
    }
    
    // PROPERTIES
    
    this.args = args;
    
    this.partId = PART_ID_PREFIX + getIdFromDomPosition(args.domNode);
    this.clientId = PART_CLIENT_ID_PREFIX + createUniqueId();

    // Views
    
    this.viewStore = {};
    this.defaultView = 'DEFAULT VIEW OBJECT PLACEHOLDER'; // = this.createView(PartView.DEFAULT_VIEW_NAME, thisPart); // Create a default view
    this.defaultViewSet = false;
    
    // Shared (Part) storage
    
    this.sharedStorage = {};
    this.shared = getPartStorage(this.sharedStorage);

    // Message sending functions

    let messageBroker = Part.messageBroker;

    this.sendToPart = function(message) {
      // Will want to include this.partId
      messageBroker.send(message);
    }

    this.remoteCallToPart = (functionName, functionArguments) => { 
      // Will want to include this.partId
      messageBroker.remoteCall(functionName, functionArgument);
    }

    // TODO: add this.sendToClient, this.sendToPartsAtPlace, ... ?

    // State properties
    
    let noop = () => {};
    this.when = { // State transition handlers
      init: {},
      active: { enter: noop, exit: noop },
      inactive: { enter: noop, exit: noop }
    }
    
    this.state = 'init';
  }
  
  // METHODS
  
  // State management
  
  changeStateTo(newStateName) {
    
    let oldState = this.when[this.state],
        newState = this.when[newStateName];
    
    if (oldState.exit) oldState.exit(); // Exit old state
    this.state = newStateName;
    if (newState.enter) newState.enter(); // Enter new state
  }
  
  makeActive() { this.changeStateTo('active') }
  makeInactive() { this.changeStateTo('inactive') }
  
  // View management

  putInPlace(placeId) { // If Part is asked to put into a place, put the default view
    // this.defaultView.putInPlace(placeId);
  }
    
  /* TODO: POSSIBLY DELETE THIS

  createView(name) {
    
    if (name === undefined) name = createUniqueId();
    
    this.views[name] = new PartView(name, this);
    
    if (!this.defaultViewSet) {
      this.views[name].setAsDefault();
      //this.views[PartView.DEFAULT_VIEW_NAME] = this.views[name];
      //this.defaultViewSet = true;
    }
    
    return this.views[name];
    
  } */
  
  // Views setter -- this sets up the Part Views and also initializes them
  //  using the settings defined in the DOM
  
  set views(viewDefs) {
    
    // For each view ...
    
    for (let viewName in viewDefs) {
      
      let viewDef = viewDefs[viewName],
          domSettings = this.args.views[viewName].options,
          domNode = this.args.views[viewName].domNode,
          viewConstructorArgs;
      
      viewConstructorArgs = {
        name: viewName,
        parentPart: this,
        render: viewDef.render,
        settings: viewDef.settings,
        domNode: domNode,
        places: [new Place()] // TEMP -- TODO: make this real
      }
      
      // If settings have values set in DOM, 
      //  assign those values now
      
      for (let settingName in domSettings) {
        viewConstructorArgs.settings[settingName].value = domSettings[settingName]
      }
      
      console.log('VIEW CONSTRUCTION ARGUMENTS');
      console.log(viewConstructorArgs);
      
      this.viewStore[viewName] = new PartView(viewConstructorArgs);
    }
  }
  
  get views() {
    return this.viewStore;
  }
  
  get view() { // If only one view (ie default) return that. 
                //  Otherwise, return object
    if (Object.keys(this.viewStore).length === 1)
      return this.viewStore[PartView.DEFAULT_VIEW_NAME]
    else
      return this.viewStore;
  }
  
  // Render function finds the Views that are in the same Place as
  //  the Client, and (if there are any) asks those Views to render
  // TODO: Places have to know if they match with each other
  
  render(clientPlace) {
    
    let viewNames = Object.keys(this.viewStore);
    
    function hasAMatchingPlace(place, placeArr) {
      return placeArr.some((p) => p.matches(place));
    }
    
    // let matchingViewNames = viewNames.filter((viewName) => hasAMatchingPlace(clientPlace, this.viewStore[viewName].places));
    let matchingViewNames = viewNames.filter((viewName) => true); // TEMP
    
    // For matching Part Views, call sysRender()
    
    matchingViewNames.forEach((viewName) => this.view[viewName].sysRender());
  }
  
  // TODO: This may or may not be a good idea
  
  addSharedMethod(method) {
    if (typeof method === 'function') {
      this.shared[method.name] = method;
    }
  }
}

// One message broker shared between all parts
// TODO: Move to Part instance so it has access to part-id and client-id

Part.messageBroker = new MessageBroker();

// PART VIEW BASE CLASS

class PartView {
  constructor(args) {
    this.parentPart = args.parentPart;
    this.domNode = args.domNode;
    this.name = args.name;
    this.id = this.parentPart.partId + '-view-' + this.name;
    this.places = args.places;
    this.render = args.render;
  }
  
  setAsDefault() {
    this.parentPart.views[PartView.DEFAULT_VIEW_NAME] = this;
    this.parentPart.defaultViewSet = true;
  }
  
  putInPlace(placeObject) {
    this.places.push(placeObject);
  }
  
  // User sets PartView.render() but system calls sysRender()
  
  sysRender() {
    
    let rendered = this.render();
    
    // If render() returns a String, then insert that as innerHTML in the
    //  Part View node. Otherwise, do something else (TODO)
    
    if (typeof rendered === 'string') {
      this.domNode.innerHTML = rendered;
    } else if (false) { // TODO: test for jQuery return, DOM Node object, etc.
      // WHAT? 
    }
  }
}

PartView.DEFAULT_VIEW_NAME = '_default';


  
// ============================ PART FACTORY INTERFACE ============================


// Utility function: find all child DOM nodes that have a
//  class that starts with a string and return an information object

function getClassThatStartsWith(domNode, str) {
  let classnames = Array.apply(null, domNode.classList)
                        .filter((cn) => cn.startsWith(str));
  return (classnames.length > 0) ? classnames[0] : false;
}

function hasClassThatStartsWith(domNode, str) {
  return getClassThatStartsWith(domNode, str) !== false;
}

function getStringAfterClassThatStartsWith(domNode, str) {
  let classname = getClassThatStartsWith(domNode, str);
  
  return (classname !== false) ? classname.slice(str.length) : false;
}

// Given a DOM node, look inside to find all elements with
//  a classname that starts with <prefix>.
// Return an object with information about the matches

function findWithClassThatStartsWith(domNode, prefix) {

  let allElements, elementsWithTargetClass, infoObject;
  
  allElements = Array.apply(null, domNode.querySelectorAll('*[class]'))
                      .filter((el) => hasClassThatStartsWith(el, prefix));
  
  infoObject = allElements.map((el) => {

    return { elem: el, 
              classname: getClassThatStartsWith(el, prefix),
              after: getStringAfterClassThatStartsWith(el, prefix) }
  });
  
  return infoObject;
}


// Get Part types from a DOM node's @class

function getPartTypeStringFromDomNode(domNode) {
  
  let classNames = Array.apply(null, domNode.classList),
      partClassNames = (classNames.filter((className) => className.startsWith(PART_CLASSNAME_PREFIX)));
      
  if (partClassNames.length) {
    return partClassNames[0].slice(PART_CLASSNAME_PREFIX.length);
  } else {
    return undefined;
  }
}

// Get Part Views from a Part's DOM node

function getPartViewsFromDomNode(domNode, partType) {
  
  let viewDomNodesInfo, viewInfoArray, viewInfoHash;
  
  viewDomNodesInfo = findWithClassThatStartsWith(domNode, PART_CLASSNAME_PREFIX + partType + '-');
  viewInfoArray = viewDomNodesInfo.map((entry) => { 
    return { 
      name: entry.after, 
      domNode: entry.elem,
      options: getPartArgumentsFromDomNode(entry.elem)
    } 
  });
  viewInfoHash = viewInfoArray.reduce((hash, viewInfo) => {
    hash[viewInfo.name] = viewInfo;
    return hash;
  }, {});
  
  return viewInfoHash;
}

// Parse the key-value pairs from the Part configuration DOM attribute
// First regex from https://gist.github.com/larruda/967110d74d98c1cd4ee1

function parseAttributeText(attributeText) { // NEW VERSION -- USES JSON FORMAT

  let attValue = '{' + attributeText + '}';
  
  let attValueWithQuotes = attValue
    .replace(/({\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g, '$1"$3":') // put quotes around keys
    .replace(/:\s*(['"])?([^,]+)(['"])?\s*([,}])/g, ':"$2"$4');            // put quotes around vals
  
  // console.log(attValueWithQuotes);
  
  // NOTE: the above doesn't allow for quotes or commas or semicolons within the val
  
  return JSON.parse(attValueWithQuotes);
}

function parseAttributeText_V2(attributeText) { // OLD VERSION -- USES JSON-LIKE FORMAT

  return attributeText
    .split(PART_OPTIONS_SEPARATOR)
    .reduce((argsHash, currArg) => {
      let [key, val] = currArg.split(PART_OPTIONS_EQUALS);
      argsHash[key] = val;
      return argsHash;
    }, {});
}

// Create Part constructor args hash

function getPartArgumentsFromDomNode(domNode) { 
  
  let args = {},
      partOptionsAttribute = domNode.getAttribute(PART_OPTIONS_ATTRIBUTE_NAME);
  
  if (partOptionsAttribute !== null)
    args = parseAttributeText(partOptionsAttribute);
  
  return args;
}


// Part factory method -- takes a DOM Node and returns a Part

function partFactory(domNode) {
  
  let partType = getPartTypeStringFromDomNode(domNode),
      partViews = getPartViewsFromDomNode(domNode, partType),
      partConstructor = Part.types[partType],
      partArgs = {};
  
  // Prepare arguments object for Part Constructor
  
  partArgs = getPartArgumentsFromDomNode(domNode);
  partArgs.domNode = domNode;
  partArgs.originalDomNode = domNode.cloneNode(true);
  partArgs.views = partViews; 
  
  return new partConstructor(domNode, partArgs);
}


// ============================ MISC STUFF ============================

// Simple hash function adapted from 
//  https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
// NOTE: Can return negative numbers; e.g. hash for 'strign' is -891986113

function getHash(string) {

    let hash = 0;

    string.split('').forEach((char) => {
        hash = ((hash << 5) - hash) + char.charCodeAt();
        hash = hash & hash; // Convert to 32bit integer
    });

    return hash;
    }

    // Get a unique identifier based on the position of the element in the DOM tree.
    // Good for auto-generating IDs for elements that will be the same across Clients

    function getIdFromDomPosition(domElement) {

    function makeId(domElement) {

        if (domElement === document.body) return ''; // boundary condition

        let previousSiblingCount = 0,
            currSibling = domElement;

        while (currSibling = currSibling.previousSibling) 
        previousSiblingCount++;

        return previousSiblingCount + '.' + makeId(domElement.parentNode);
    }

    return getHash(makeId(domElement));
    }

  // Just a simple generator based on time + random

  function createUniqueId() {
  return String((new Date()).valueOf()).slice(-4) + Math.floor(Math.random() * 1000);
}
