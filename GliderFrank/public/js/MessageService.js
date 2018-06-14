class MessageService {

  constructor(props) {
    this.messages = [];
    this.subscribers = {};
    this.remoteMessenger = new RemoteMessenger("firebase", {
	    apiKey: "AIzaSyDiG79nyWATW1tcjLsD2YY2Zr5z8qW7ZyU",
	    authDomain: "glider-flightplan-example.firebaseapp.com",
	    databaseURL: "https://glider-flightplan-example.firebaseio.com",
	    projectId: "glider-flightplan-example",
	    storageBucket: "glider-flightplan-example.appspot.com",
	    messagingSenderId: "201089278480"
    })
  }

  addMessage(msg) {
  	this.messages.push(msg);
  }

  send() {
  	
  	for (var i = 0; i <= this.messages.length; i++)
  		var message = this.messages.pop();
  		console.log("======MESSAGING SERVICES SAYS: " + message.msg);
	  	switch (message.msg) {
	  		case "phase-changed":
	  			console.log(message.values);
	  		break;
	  	}


	if(message.values.sendRemote) {
		this.sendRemote(i);
	}
  }

  //set up an object to listen for a certain message to be broadcast;
  subscribe(object, message) {
  		this.subscribers[message].push(object);
  }

  sendRemote(message){
  	this.remoteMessenger.sendMessage(message);
  }
}

class RemoteMessenger {
	constructor(provider, config) {
		switch(provider) {
			case "firebase":
				  //firebase.initializeApp(config);
			break;
		}
	}

	subscribe() {
		
	}

	sendMessage(message) {
		// this will send the message to the "message" remote bucket.
		console.log("==== REMOTE HANDLER IS SENDING MESSAGE ====")
	}

	updateValue(key, value) {
		// this will update any remote values that need to be updated. 
		// possibly the most frequently used method
	}
}
