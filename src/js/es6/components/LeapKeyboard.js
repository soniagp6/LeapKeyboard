export default class LeapKeyboard {
	constructor() {
		console.log('test 24');
		//Store frame for motion functions
		var previousFrame = null;
		var paused = false;
		var pauseOnGesture = false;

		// Setup Leap loop with frame callback function
		var controllerOptions = {enableGestures: true};
		var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

		var verticalRange = [10, -70];
		var verticalDistance = verticalRange[0] - verticalRange[1];
		var triggerInterval = 10;
		var highestPoint;
		var lowestPoint;
		var currentPosition;
		var readyForKeyUp = false;
		var readyForKeyDown = false;
		var lastTenPositions = [];
		var sum;
		var outputContainer;
		var fingerType;

		// to use HMD mode:
		// controllerOptions.optimizeHMD = true;

		Leap.loop(controllerOptions, function(frame) {
		  if (paused) {
		    return; // Skip this update
		  }

		  // Display Frame object data
		  var frameOutput = document.getElementById("frameData");

		  var frameString = "Fingers: " + frame.fingers.length + "<br />";

		  // Frame motion factors
		  if (previousFrame && previousFrame.valid) {
		    var translation = frame.translation(previousFrame);
		    frameString += "Translation: " + vectorToString(translation) + " mm <br />";

		    var rotationAxis = frame.rotationAxis(previousFrame);
		    var rotationAngle = frame.rotationAngle(previousFrame);
		    frameString += "Rotation axis: " + vectorToString(rotationAxis, 2) + "<br />";
		    frameString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

		    var scaleFactor = frame.scaleFactor(previousFrame);
		    frameString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
		  }
		  frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + frameString + "</div>";

		  // Display Hand object data
		  var handOutput = document.getElementById("handData");
		  var handString = "";
		  if (frame.hands.length > 0) {
		    for (var i = 0; i < frame.hands.length; i++) {
		      var hand = frame.hands[i];

		      handString += "<div style='width:300px; float:left; padding:5px'>";
		      handString += "Hand ID: " + hand.id + "<br />";
		      // handString += "Type: " + hand.type + " hand" + "<br />";
		      // handString += "Direction: " + vectorToString(hand.direction, 2) + "<br />";
		      handString += "Palm position: " + vectorToString(hand.palmPosition) + " mm<br />";
		      // handString += "Grab strength: " + hand.grabStrength + "<br />";
		      // handString += "Pinch strength: " + hand.pinchStrength + "<br />";
		      // handString += "Confidence: " + hand.confidence + "<br />";
		      // handString += "Arm direction: " + vectorToString(hand.arm.direction()) + "<br />";
		      // handString += "Arm center: " + vectorToString(hand.arm.center()) + "<br />";
		      // handString += "Arm up vector: " + vectorToString(hand.arm.basis[1]) + "<br />";

		      // Hand motion factors
		      if (previousFrame && previousFrame.valid) {
		        var translation = hand.translation(previousFrame);
		        handString += "Translation: " + vectorToString(translation) + " mm<br />";

		        var rotationAxis = hand.rotationAxis(previousFrame, 2);
		        var rotationAngle = hand.rotationAngle(previousFrame);
		        handString += "Rotation axis: " + vectorToString(rotationAxis) + "<br />";
		        handString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

		        var scaleFactor = hand.scaleFactor(previousFrame);
		        handString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
		      }

		      // IDs of pointables associated with this hand
		      if (hand.pointables.length > 0) {
		        var fingerIds = [];
		        for (var j = 0; j < hand.pointables.length; j++) {
		          var pointable = hand.pointables[j];
		            fingerIds.push(pointable.id);
		        }
		        if (fingerIds.length > 0) {
		          handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
		        }
		      }

		      handString += "</div>";
		    }
		  }
		  else {
		    handString += "No hands";
		  }
		  handOutput.innerHTML = handString;

		  // Display Pointable (finger and tool) object data
		  var pointableOutput = document.getElementById("pointableData");
		  var pointableString = "";
		  if (frame.pointables.length > 0) {
		    var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
		    var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];
		    for (var i = 0; i < 2; i++) {
		      var pointable = frame.pointables[i];

		      pointableString += "<div style='width:250px; float:left; padding:5px'>";

		      if (pointable.tool) {
		        pointableString += "Pointable ID: " + pointable.id + "<br />";
		        // pointableString += "Classified as a tool <br />";
		        // pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
		        // pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
		        pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
		        pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />"
		        pointableString += "</div>";
		      }
		      else {
		        pointableString += "Pointable ID: " + pointable.id + "<br />";
		        pointableString += "Type: " + fingerTypeMap[pointable.type] + "<br />";
		        // pointableString += "Belongs to hand with ID: " + pointable.handId + "<br />";
		        // pointableString += "Classified as a finger<br />";
		        // pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
		        // pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
		        pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
		        pointableString += "Extended?: "  + pointable.extended + "<br />";
		        pointable.bones.forEach( function(bone){
		          pointableString += boneTypeMap[bone.type] + " bone <br />";
		          pointableString += "Center: " + vectorToString(bone.center()) + "<br />";
		          pointableString += "Direction: " + vectorToString(bone.direction()) + "<br />";
		          pointableString += "Up vector: " + vectorToString(bone.basis[1]) + "<br />";
		        });
		        pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />";
		        pointableString += "</div>";
		      }

		      readFingerPosition(fingerTypeMap[pointable.type], pointable.tipPosition[1], hand.palmPosition[1]);
		    }
		  }
		  else {
		    pointableString += "<div>No pointables</div>";
		  }
		  pointableOutput.innerHTML = pointableString;


		  // Display Gesture object data
		  var gestureOutput = document.getElementById("gestureData");
		  var gestureString = "";
		  if (frame.gestures.length > 0) {
		    if (pauseOnGesture) {
		      togglePause();
		    }
		    for (var i = 0; i < frame.gestures.length; i++) {
		      var gesture = frame.gestures[i];
		      gestureString += "Gesture ID: " + gesture.id + ", "
		                    + "type: " + gesture.type + ", "
		                    + "state: " + gesture.state + ", "
		                    + "hand IDs: " + gesture.handIds.join(", ") + ", "
		                    + "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
		                    + "duration: " + gesture.duration + " &micro;s, ";

		      switch (gesture.type) {
		        case "circle":
		          gestureString += "center: " + vectorToString(gesture.center) + " mm, "
		                        + "normal: " + vectorToString(gesture.normal, 2) + ", "
		                        + "radius: " + gesture.radius.toFixed(1) + " mm, "
		                        + "progress: " + gesture.progress.toFixed(2) + " rotations";
		          break;
		        case "swipe":
		          gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
		                        + "current position: " + vectorToString(gesture.position) + " mm, "
		                        + "direction: " + vectorToString(gesture.direction, 1) + ", "
		                        + "speed: " + gesture.speed.toFixed(1) + " mm/s";
		          break;
		        case "screenTap":
		        case "keyTap":
		          gestureString += "position: " + vectorToString(gesture.position) + " mm";
		          break;
		        default:
		          gestureString += "unkown gesture type";
		      }
		      gestureString += "<br />";
		    }
		  }
		  else {
		    gestureString += "No gestures";
		  }
		  gestureOutput.innerHTML = gestureString;

		  // Store frame for motion functions
		  previousFrame = frame;
		})
	}

	vectorToString(vector, digits) {
	  if (typeof digits === "undefined") {
	    digits = 1;
	  }
	  return "(" + vector[0].toFixed(digits) + ", "
	             + vector[1].toFixed(digits) + ", "
	             + vector[2].toFixed(digits) + ")";
	}

	togglePause() {
	  paused = !paused;

	  if (paused) {
	    document.getElementById("pause").innerText = "Resume";
	  } else {
	    document.getElementById("pause").innerText = "Pause";
	  }
	}

	pauseForGestures() {
	  if (document.getElementById("pauseOnGesture").checked) {
	    pauseOnGesture = true;
	  } else {
	    pauseOnGesture = false;
	  }
	}




	readFingerPosition(pointableType, tipPositionY, handPositionY) {
	  outputContainer = document.getElementById("content");
	  currentPositionRead = parseFloat((tipPositionY - handPositionY).toFixed(2));
	  lastTenPositions.push(currentPositionRead);
	  fingerType = pointableType;
	  if (lastTenPositions[9]) {
	    lastTenPositions.shift();
	  }
	  var sum = lastTenPositions.reduce(function(a, b) { return a + b; });
	  currentPosition = sum/lastTenPositions.length;
	  //console.log('currentPosition', currentPosition);
	  if (highestPoint && lowestPoint) {
	    setHighestPoint();
	    setLowestPoint();
	  }
	  else {
	    reset();
	  }
	  if (readyForKeyDown) {
	    checkForKeyDown();
	  }
	  if (readyForKeyUp) {
	    checkForKeyUp();
	  }
	}

	setHighestPoint() {
	  highestPoint = (currentPosition >= highestPoint) ? currentPosition : highestPoint;
	  //console.log('highestPoint', highestPoint);
	}

	setLowestPoint() {
	  lowestPoint = (currentPosition <= lowestPoint) ? currentPosition : lowestPoint;
	  //console.log('lowestPoint', lowestPoint);
	}

	checkForKeyDown() {
	  if (currentPosition <= highestPoint - triggerInterval) {
	    readyForKeyDown = false;
	    lowestPoint = currentPosition;
	    //console.log('KEYDOWN', 'currentPosition', currentPosition, 'highestPoint', highestPoint, 'lowestPoint', lowestPoint);
	    readyForKeyUp = true;
	    //console.log('readyForKeyUp');
	  }
	}

	checkForKeyUp() {
	  if (currentPosition >= lowestPoint + triggerInterval) {
	    //console.log('KEYUP', 'currentPosition', currentPosition, 'highestPoint', highestPoint, 'lowestPoint', lowestPoint);
	    console.log('t;ype', fingerType);
	    if (fingerType == 'Thumb') {
	      sendSpace();
	    }
	    else {
	      sendKey();
	    }
	    reset();
	  }
	}

	reset() {
	  readyForKeyUp = false;
	  highestPoint = currentPosition;
	  lowestPoint = currentPosition;
	  readyForKeyDown = true;
	  //console.log('readyForKeyDown');
	  //console.log('reset positinos highest', highestPoint, 'reset positions lowest', lowestPoint);
	}

	sendSpace() {
	  outputContainer.innerHTML = outputContainer.innerHTML + " ";  
	}

	sendKey() {
	  var positionLinear = (verticalRange[0] - lowestPoint)/verticalDistance;
	  var positionBracket = Math.floor(positionLinear * alphabet.length);
	  // console.log('highestPoint', highestPoint);
	  // console.log('lowestPoint', lowestPoint);
	  // console.log('keypress', alphabet[positionBracket]);
	  if (alphabet[positionBracket]) {
	    outputContainer.innerHTML = outputContainer.innerHTML + alphabet[positionBracket];  
	  }
	}
}

export { LeapKeyboard };