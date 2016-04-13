(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LeapKeyboard = function () {
	function LeapKeyboard() {
		_classCallCheck(this, LeapKeyboard);

		console.log('test 24');
		//Store frame for motion functions
		var previousFrame = null;
		var paused = false;
		var pauseOnGesture = false;

		// Setup Leap loop with frame callback function
		var controllerOptions = { enableGestures: true };
		var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

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

		Leap.loop(controllerOptions, function (frame) {
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
			} else {
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
						pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />";
						pointableString += "</div>";
					} else {
						pointableString += "Pointable ID: " + pointable.id + "<br />";
						pointableString += "Type: " + fingerTypeMap[pointable.type] + "<br />";
						// pointableString += "Belongs to hand with ID: " + pointable.handId + "<br />";
						// pointableString += "Classified as a finger<br />";
						// pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
						// pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
						pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
						pointableString += "Extended?: " + pointable.extended + "<br />";
						pointable.bones.forEach(function (bone) {
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
			} else {
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
					gestureString += "Gesture ID: " + gesture.id + ", " + "type: " + gesture.type + ", " + "state: " + gesture.state + ", " + "hand IDs: " + gesture.handIds.join(", ") + ", " + "pointable IDs: " + gesture.pointableIds.join(", ") + ", " + "duration: " + gesture.duration + " &micro;s, ";

					switch (gesture.type) {
						case "circle":
							gestureString += "center: " + vectorToString(gesture.center) + " mm, " + "normal: " + vectorToString(gesture.normal, 2) + ", " + "radius: " + gesture.radius.toFixed(1) + " mm, " + "progress: " + gesture.progress.toFixed(2) + " rotations";
							break;
						case "swipe":
							gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, " + "current position: " + vectorToString(gesture.position) + " mm, " + "direction: " + vectorToString(gesture.direction, 1) + ", " + "speed: " + gesture.speed.toFixed(1) + " mm/s";
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
			} else {
				gestureString += "No gestures";
			}
			gestureOutput.innerHTML = gestureString;

			// Store frame for motion functions
			previousFrame = frame;
		});
	}

	LeapKeyboard.prototype.vectorToString = function vectorToString(vector, digits) {
		if (typeof digits === "undefined") {
			digits = 1;
		}
		return "(" + vector[0].toFixed(digits) + ", " + vector[1].toFixed(digits) + ", " + vector[2].toFixed(digits) + ")";
	};

	LeapKeyboard.prototype.togglePause = function togglePause() {
		paused = !paused;

		if (paused) {
			document.getElementById("pause").innerText = "Resume";
		} else {
			document.getElementById("pause").innerText = "Pause";
		}
	};

	LeapKeyboard.prototype.pauseForGestures = function pauseForGestures() {
		if (document.getElementById("pauseOnGesture").checked) {
			pauseOnGesture = true;
		} else {
			pauseOnGesture = false;
		}
	};

	LeapKeyboard.prototype.readFingerPosition = function readFingerPosition(pointableType, tipPositionY, handPositionY) {
		outputContainer = document.getElementById("content");
		currentPositionRead = parseFloat((tipPositionY - handPositionY).toFixed(2));
		lastTenPositions.push(currentPositionRead);
		fingerType = pointableType;
		if (lastTenPositions[9]) {
			lastTenPositions.shift();
		}
		var sum = lastTenPositions.reduce(function (a, b) {
			return a + b;
		});
		currentPosition = sum / lastTenPositions.length;
		//console.log('currentPosition', currentPosition);
		if (highestPoint && lowestPoint) {
			setHighestPoint();
			setLowestPoint();
		} else {
			reset();
		}
		if (readyForKeyDown) {
			checkForKeyDown();
		}
		if (readyForKeyUp) {
			checkForKeyUp();
		}
	};

	LeapKeyboard.prototype.setHighestPoint = function setHighestPoint() {
		highestPoint = currentPosition >= highestPoint ? currentPosition : highestPoint;
		//console.log('highestPoint', highestPoint);
	};

	LeapKeyboard.prototype.setLowestPoint = function setLowestPoint() {
		lowestPoint = currentPosition <= lowestPoint ? currentPosition : lowestPoint;
		//console.log('lowestPoint', lowestPoint);
	};

	LeapKeyboard.prototype.checkForKeyDown = function checkForKeyDown() {
		if (currentPosition <= highestPoint - triggerInterval) {
			readyForKeyDown = false;
			lowestPoint = currentPosition;
			//console.log('KEYDOWN', 'currentPosition', currentPosition, 'highestPoint', highestPoint, 'lowestPoint', lowestPoint);
			readyForKeyUp = true;
			//console.log('readyForKeyUp');
		}
	};

	LeapKeyboard.prototype.checkForKeyUp = function checkForKeyUp() {
		if (currentPosition >= lowestPoint + triggerInterval) {
			//console.log('KEYUP', 'currentPosition', currentPosition, 'highestPoint', highestPoint, 'lowestPoint', lowestPoint);
			console.log('t;ype', fingerType);
			if (fingerType == 'Thumb') {
				sendSpace();
			} else {
				sendKey();
			}
			reset();
		}
	};

	LeapKeyboard.prototype.reset = function reset() {
		readyForKeyUp = false;
		highestPoint = currentPosition;
		lowestPoint = currentPosition;
		readyForKeyDown = true;
		//console.log('readyForKeyDown');
		//console.log('reset positinos highest', highestPoint, 'reset positions lowest', lowestPoint);
	};

	LeapKeyboard.prototype.sendSpace = function sendSpace() {
		outputContainer.innerHTML = outputContainer.innerHTML + " ";
	};

	LeapKeyboard.prototype.sendKey = function sendKey() {
		var positionLinear = (verticalRange[0] - lowestPoint) / verticalDistance;
		var positionBracket = Math.floor(positionLinear * alphabet.length);
		// console.log('highestPoint', highestPoint);
		// console.log('lowestPoint', lowestPoint);
		// console.log('keypress', alphabet[positionBracket]);
		if (alphabet[positionBracket]) {
			outputContainer.innerHTML = outputContainer.innerHTML + alphabet[positionBracket];
		}
	};

	return LeapKeyboard;
}();

exports.default = LeapKeyboard;
exports.LeapKeyboard = LeapKeyboard;

},{}],2:[function(require,module,exports){
'use strict';

var _LeapKeyboard = require('./components/LeapKeyboard');

// Instantiate
//window.LeapKeyboard = window.LeapKeyboard || LeapKeyboard;
var Keyboard = new _LeapKeyboard.LeapKeyboard(); // Main application entry point

},{"./components/LeapKeyboard":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZXM2L2NvbXBvbmVudHMvTGVhcEtleWJvYXJkLmpzIiwic3JjL2pzL2VzNi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBcUI7QUFDcEIsVUFEb0IsWUFDcEIsR0FBYzt3QkFETSxjQUNOOztBQUNiLFVBQVEsR0FBUixDQUFZLFNBQVo7O0FBRGEsTUFHVCxnQkFBZ0IsSUFBaEIsQ0FIUztBQUliLE1BQUksU0FBUyxLQUFULENBSlM7QUFLYixNQUFJLGlCQUFpQixLQUFqQjs7O0FBTFMsTUFRVCxvQkFBb0IsRUFBQyxnQkFBZ0IsSUFBaEIsRUFBckIsQ0FSUztBQVNiLE1BQUksV0FBVyxDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsR0FBVCxFQUFhLEdBQWIsRUFBaUIsR0FBakIsRUFBcUIsR0FBckIsRUFBeUIsR0FBekIsRUFBNkIsR0FBN0IsRUFBaUMsR0FBakMsRUFBcUMsR0FBckMsRUFBeUMsR0FBekMsRUFBNkMsR0FBN0MsRUFBaUQsR0FBakQsRUFBcUQsR0FBckQsRUFBeUQsR0FBekQsRUFBNkQsR0FBN0QsRUFBaUUsR0FBakUsRUFBcUUsR0FBckUsRUFBeUUsR0FBekUsRUFBNkUsR0FBN0UsRUFBaUYsR0FBakYsRUFBcUYsR0FBckYsRUFBeUYsR0FBekYsRUFBNkYsR0FBN0YsRUFBaUcsR0FBakcsRUFBcUcsR0FBckcsQ0FBWCxDQVRTOztBQVdiLE1BQUksZ0JBQWdCLENBQUMsRUFBRCxFQUFLLENBQUMsRUFBRCxDQUFyQixDQVhTO0FBWWIsTUFBSSxtQkFBbUIsY0FBYyxDQUFkLElBQW1CLGNBQWMsQ0FBZCxDQUFuQixDQVpWO0FBYWIsTUFBSSxrQkFBa0IsRUFBbEIsQ0FiUztBQWNiLE1BQUksWUFBSixDQWRhO0FBZWIsTUFBSSxXQUFKLENBZmE7QUFnQmIsTUFBSSxlQUFKLENB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U0FBUyxlQUFULENBQUosRUFBK0I7QUFDN0IsbUJBQWdCLFNBQWhCLEdBQTRCLGdCQUFnQixTQUFoQixHQUE0QixTQUFTLGVBQVQsQ0FBNUIsQ0FEQztHQUEvQjs7O1FBeFRrQjs7OztRQThUWjs7Ozs7Ozs7O0FDelRULElBQUksV0FBVyxnQ0FBWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBMZWFwS2V5Ym9hcmQge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRjb25zb2xlLmxvZygndGVzdCAyNCcpO1xuXHRcdC8vU3RvcmUgZnJhbWUgZm9yIG1vdGlvbiBmdW5jdGlvbnNcblx0XHR2YXIgcHJldmlvdXNGcmFtZSA9IG51bGw7XG5cdFx0dmFyIHBhdXNlZCA9IGZhbHNlO1xuXHRcdHZhciBwYXVzZU9uR2VzdHVyZSA9IGZhbHNlO1xuXG5cdFx0Ly8gU2V0dXAgTGVhcCBsb29wIHdpdGggZnJhbWUgY2FsbGJhY2sgZnVuY3Rpb25cblx0XHR2YXIgY29udHJvbGxlck9wdGlvbnMgPSB7ZW5hYmxlR2VzdHVyZXM6IHRydWV9O1xuXHRcdHZhciBhbHBoYWJldCA9IFtcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIixcIm5cIixcIm9cIixcInBcIixcInFcIixcInJcIixcInNcIixcInRcIixcInVcIixcInZcIixcIndcIixcInhcIixcInlcIixcInpcIl07XG5cblx0XHR2YXIgdmVydGljYWxSYW5nZSA9IFsxMCwgLTcwXTtcblx0XHR2YXIgdmVydGljYWxEaXN0YW5jZSA9IHZlcnRpY2FsUmFuZ2VbMF0gLSB2ZXJ0aWNhbFJhbmdlWzFdO1xuXHRcdHZhciB0cmlnZ2VySW50ZXJ2YWwgPSAxMDtcblx0XHR2YXIgaGlnaGVzdFBvaW50O1xuXHRcdHZhciBsb3dlc3RQb2ludDtcblx0XHR2YXIgY3VycmVudFBvc2l0aW9uO1xuXHRcdHZhciByZWFkeUZvcktleVVwID0gZmFsc2U7XG5cdFx0dmFyIHJlYWR5Rm9yS2V5RG93biA9IGZhbHNlO1xuXHRcdHZhciBsYXN0VGVuUG9zaXRpb25zID0gW107XG5cdFx0dmFyIHN1bTtcblx0XHR2YXIgb3V0cHV0Q29udGFpbmVyO1xuXHRcdHZhciBmaW5nZXJUeXBlO1xuXG5cdFx0Ly8gdG8gdXNlIEhNRCBtb2RlOlxuXHRcdC8vIGNvbnRyb2xsZXJPcHRpb25zLm9wdGltaXplSE1EID0gdHJ1ZTtcblxuXHRcdExlYXAubG9vcChjb250cm9sbGVyT3B0aW9ucywgZnVuY3Rpb24oZnJhbWUpIHtcblx0XHQgIGlmIChwYXVzZWQpIHtcblx0XHQgICAgcmV0dXJuOyAvLyBTa2lwIHRoaXMgdXBkYXRlXG5cdFx0ICB9XG5cblx0XHQgIC8vIERpc3BsYXkgRnJhbWUgb2JqZWN0IGRhdGFcblx0XHQgIHZhciBmcmFtZU91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJhbWVEYXRhXCIpO1xuXG5cdFx0ICB2YXIgZnJhbWVTdHJpbmcgPSBcIkZpbmdlcnM6IFwiICsgZnJhbWUuZmluZ2Vycy5sZW5ndGggKyBcIjxiciAvPlwiO1xuXG5cdFx0ICAvLyBGcmFtZSBtb3Rpb24gZmFjdG9yc1xuXHRcdCAgaWYgKHByZXZpb3VzRnJhbWUgJiYgcHJldmlvdXNGcmFtZS52YWxpZCkge1xuXHRcdCAgICB2YXIgdHJhbnNsYXRpb24gPSBmcmFtZS50cmFuc2xhdGlvbihwcmV2aW91c0ZyYW1lKTtcblx0XHQgICAgZnJhbWVTdHJpbmcgKz0gXCJUcmFuc2xhdGlvbjogXCIgKyB2ZWN0b3JUb1N0cmluZyh0cmFuc2xhdGlvbikgKyBcIiBtbSA8YnIgLz5cIjtcblxuXHRcdCAgICB2YXIgcm90YXRpb25BeGlzID0gZnJhbWUucm90YXRpb25BeGlzKHByZXZpb3VzRnJhbWUpO1xuXHRcdCAgICB2YXIgcm90YXRpb25BbmdsZSA9IGZyYW1lLnJvdGF0aW9uQW5nbGUocHJldmlvdXNGcmFtZSk7XG5cdFx0ICAgIGZyYW1lU3RyaW5nICs9IFwiUm90YXRpb24gYXhpczogXCIgKyB2ZWN0b3JUb1N0cmluZyhyb3RhdGlvbkF4aXMsIDIpICsgXCI8YnIgLz5cIjtcblx0XHQgICAgZnJhbWVTdHJpbmcgKz0gXCJSb3RhdGlvbiBhbmdsZTogXCIgKyByb3RhdGlvbkFuZ2xlLnRvRml4ZWQoMikgKyBcIiByYWRpYW5zPGJyIC8+XCI7XG5cblx0XHQgICAgdmFyIHNjYWxlRmFjdG9yID0gZnJhbWUuc2NhbGVGYWN0b3IocHJldmlvdXNGcmFtZSk7XG5cdFx0ICAgIGZyYW1lU3RyaW5nICs9IFwiU2NhbGUgZmFjdG9yOiBcIiArIHNjYWxlRmFjdG9yLnRvRml4ZWQoMikgKyBcIjxiciAvPlwiO1xuXHRcdCAgfVxuXHRcdCAgZnJhbWVPdXRwdXQuaW5uZXJIVE1MID0gXCI8ZGl2IHN0eWxlPSd3aWR0aDozMDBweDsgZmxvYXQ6bGVmdDsgcGFkZGluZzo1cHgnPlwiICsgZnJhbWVTdHJpbmcgKyBcIjwvZGl2PlwiO1xuXG5cdFx0ICAvLyBEaXNwbGF5IEhhbmQgb2JqZWN0IGRhdGFcblx0XHQgIHZhciBoYW5kT3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoYW5kRGF0YVwiKTtcblx0XHQgIHZhciBoYW5kU3RyaW5nID0gXCJcIjtcblx0XHQgIGlmIChmcmFtZS5oYW5kcy5sZW5ndGggPiAwKSB7XG5cdFx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWUuaGFuZHMubGVuZ3RoOyBpKyspIHtcblx0XHQgICAgICB2YXIgaGFuZCA9IGZyYW1lLmhhbmRzW2ldO1xuXG5cdFx0ICAgICAgaGFuZFN0cmluZyArPSBcIjxkaXYgc3R5bGU9J3dpZHRoOjMwMHB4OyBmbG9hdDpsZWZ0OyBwYWRkaW5nOjVweCc+XCI7XG5cdFx0ICAgICAgaGFuZFN0cmluZyArPSBcIkhhbmQgSUQ6IFwiICsgaGFuZC5pZCArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgLy8gaGFuZFN0cmluZyArPSBcIlR5cGU6IFwiICsgaGFuZC50eXBlICsgXCIgaGFuZFwiICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAvLyBoYW5kU3RyaW5nICs9IFwiRGlyZWN0aW9uOiBcIiArIHZlY3RvclRvU3RyaW5nKGhhbmQuZGlyZWN0aW9uLCAyKSArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgaGFuZFN0cmluZyArPSBcIlBhbG0gcG9zaXRpb246IFwiICsgdmVjdG9yVG9TdHJpbmcoaGFuZC5wYWxtUG9zaXRpb24pICsgXCIgbW08YnIgLz5cIjtcblx0XHQgICAgICAvLyBoYW5kU3RyaW5nICs9IFwiR3JhYiBzdHJlbmd0aDogXCIgKyBoYW5kLmdyYWJTdHJlbmd0aCArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgLy8gaGFuZFN0cmluZyArPSBcIlBpbmNoIHN0cmVuZ3RoOiBcIiArIGhhbmQucGluY2hTdHJlbmd0aCArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgLy8gaGFuZFN0cmluZyArPSBcIkNvbmZpZGVuY2U6IFwiICsgaGFuZC5jb25maWRlbmNlICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAvLyBoYW5kU3RyaW5nICs9IFwiQXJtIGRpcmVjdGlvbjogXCIgKyB2ZWN0b3JUb1N0cmluZyhoYW5kLmFybS5kaXJlY3Rpb24oKSkgKyBcIjxiciAvPlwiO1xuXHRcdCAgICAgIC8vIGhhbmRTdHJpbmcgKz0gXCJBcm0gY2VudGVyOiBcIiArIHZlY3RvclRvU3RyaW5nKGhhbmQuYXJtLmNlbnRlcigpKSArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgLy8gaGFuZFN0cmluZyArPSBcIkFybSB1cCB2ZWN0b3I6IFwiICsgdmVjdG9yVG9TdHJpbmcoaGFuZC5hcm0uYmFzaXNbMV0pICsgXCI8YnIgLz5cIjtcblxuXHRcdCAgICAgIC8vIEhhbmQgbW90aW9uIGZhY3RvcnNcblx0XHQgICAgICBpZiAocHJldmlvdXNGcmFtZSAmJiBwcmV2aW91c0ZyYW1lLnZhbGlkKSB7XG5cdFx0ICAgICAgICB2YXIgdHJhbnNsYXRpb24gPSBoYW5kLnRyYW5zbGF0aW9uKHByZXZpb3VzRnJhbWUpO1xuXHRcdCAgICAgICAgaGFuZFN0cmluZyArPSBcIlRyYW5zbGF0aW9uOiBcIiArIHZlY3RvclRvU3RyaW5nKHRyYW5zbGF0aW9uKSArIFwiIG1tPGJyIC8+XCI7XG5cblx0XHQgICAgICAgIHZhciByb3RhdGlvbkF4aXMgPSBoYW5kLnJvdGF0aW9uQXhpcyhwcmV2aW91c0ZyYW1lLCAyKTtcblx0XHQgICAgICAgIHZhciByb3RhdGlvbkFuZ2xlID0gaGFuZC5yb3RhdGlvbkFuZ2xlKHByZXZpb3VzRnJhbWUpO1xuXHRcdCAgICAgICAgaGFuZFN0cmluZyArPSBcIlJvdGF0aW9uIGF4aXM6IFwiICsgdmVjdG9yVG9TdHJpbmcocm90YXRpb25BeGlzKSArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgICBoYW5kU3RyaW5nICs9IFwiUm90YXRpb24gYW5nbGU6IFwiICsgcm90YXRpb25BbmdsZS50b0ZpeGVkKDIpICsgXCIgcmFkaWFuczxiciAvPlwiO1xuXG5cdFx0ICAgICAgICB2YXIgc2NhbGVGYWN0b3IgPSBoYW5kLnNjYWxlRmFjdG9yKHByZXZpb3VzRnJhbWUpO1xuXHRcdCAgICAgICAgaGFuZFN0cmluZyArPSBcIlNjYWxlIGZhY3RvcjogXCIgKyBzY2FsZUZhY3Rvci50b0ZpeGVkKDIpICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICB9XG5cblx0XHQgICAgICAvLyBJRHMgb2YgcG9pbnRhYmxlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBoYW5kXG5cdFx0ICAgICAgaWYgKGhhbmQucG9pbnRhYmxlcy5sZW5ndGggPiAwKSB7XG5cdFx0ICAgICAgICB2YXIgZmluZ2VySWRzID0gW107XG5cdFx0ICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGhhbmQucG9pbnRhYmxlcy5sZW5ndGg7IGorKykge1xuXHRcdCAgICAgICAgICB2YXIgcG9pbnRhYmxlID0gaGFuZC5wb2ludGFibGVzW2pdO1xuXHRcdCAgICAgICAgICAgIGZpbmdlcklkcy5wdXNoKHBvaW50YWJsZS5pZCk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgICBpZiAoZmluZ2VySWRzLmxlbmd0aCA+IDApIHtcblx0XHQgICAgICAgICAgaGFuZFN0cmluZyArPSBcIkZpbmdlcnMgSURzOiBcIiArIGZpbmdlcklkcy5qb2luKFwiLCBcIikgKyBcIjxiciAvPlwiO1xuXHRcdCAgICAgICAgfVxuXHRcdCAgICAgIH1cblxuXHRcdCAgICAgIGhhbmRTdHJpbmcgKz0gXCI8L2Rpdj5cIjtcblx0XHQgICAgfVxuXHRcdCAgfVxuXHRcdCAgZWxzZSB7XG5cdFx0ICAgIGhhbmRTdHJpbmcgKz0gXCJObyBoYW5kc1wiO1xuXHRcdCAgfVxuXHRcdCAgaGFuZE91dHB1dC5pbm5lckhUTUwgPSBoYW5kU3RyaW5nO1xuXG5cdFx0ICAvLyBEaXNwbGF5IFBvaW50YWJsZSAoZmluZ2VyIGFuZCB0b29sKSBvYmplY3QgZGF0YVxuXHRcdCAgdmFyIHBvaW50YWJsZU91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9pbnRhYmxlRGF0YVwiKTtcblx0XHQgIHZhciBwb2ludGFibGVTdHJpbmcgPSBcIlwiO1xuXHRcdCAgaWYgKGZyYW1lLnBvaW50YWJsZXMubGVuZ3RoID4gMCkge1xuXHRcdCAgICB2YXIgZmluZ2VyVHlwZU1hcCA9IFtcIlRodW1iXCIsIFwiSW5kZXggZmluZ2VyXCIsIFwiTWlkZGxlIGZpbmdlclwiLCBcIlJpbmcgZmluZ2VyXCIsIFwiUGlua3kgZmluZ2VyXCJdO1xuXHRcdCAgICB2YXIgYm9uZVR5cGVNYXAgPSBbXCJNZXRhY2FycGFsXCIsIFwiUHJveGltYWwgcGhhbGFueFwiLCBcIkludGVybWVkaWF0ZSBwaGFsYW54XCIsIFwiRGlzdGFsIHBoYWxhbnhcIl07XG5cdFx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG5cdFx0ICAgICAgdmFyIHBvaW50YWJsZSA9IGZyYW1lLnBvaW50YWJsZXNbaV07XG5cblx0XHQgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCI8ZGl2IHN0eWxlPSd3aWR0aDoyNTBweDsgZmxvYXQ6bGVmdDsgcGFkZGluZzo1cHgnPlwiO1xuXG5cdFx0ICAgICAgaWYgKHBvaW50YWJsZS50b29sKSB7XG5cdFx0ICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCJQb2ludGFibGUgSUQ6IFwiICsgcG9pbnRhYmxlLmlkICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAgIC8vIHBvaW50YWJsZVN0cmluZyArPSBcIkNsYXNzaWZpZWQgYXMgYSB0b29sIDxiciAvPlwiO1xuXHRcdCAgICAgICAgLy8gcG9pbnRhYmxlU3RyaW5nICs9IFwiTGVuZ3RoOiBcIiArIHBvaW50YWJsZS5sZW5ndGgudG9GaXhlZCgxKSArIFwiIG1tPGJyIC8+XCI7XG5cdFx0ICAgICAgICAvLyBwb2ludGFibGVTdHJpbmcgKz0gXCJXaWR0aDogXCIgICsgcG9pbnRhYmxlLndpZHRoLnRvRml4ZWQoMSkgKyBcIiBtbTxiciAvPlwiO1xuXHRcdCAgICAgICAgcG9pbnRhYmxlU3RyaW5nICs9IFwiRGlyZWN0aW9uOiBcIiArIHZlY3RvclRvU3RyaW5nKHBvaW50YWJsZS5kaXJlY3Rpb24sIDIpICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAgIHBvaW50YWJsZVN0cmluZyArPSBcIlRpcCBwb3NpdGlvbjogXCIgKyB2ZWN0b3JUb1N0cmluZyhwb2ludGFibGUudGlwUG9zaXRpb24pICsgXCIgbW08YnIgLz5cIlxuXHRcdCAgICAgICAgcG9pbnRhYmxlU3RyaW5nICs9IFwiPC9kaXY+XCI7XG5cdFx0ICAgICAgfVxuXHRcdCAgICAgIGVsc2Uge1xuXHRcdCAgICAgICAgcG9pbnRhYmxlU3RyaW5nICs9IFwiUG9pbnRhYmxlIElEOiBcIiArIHBvaW50YWJsZS5pZCArIFwiPGJyIC8+XCI7XG5cdFx0ICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCJUeXBlOiBcIiArIGZpbmdlclR5cGVNYXBbcG9pbnRhYmxlLnR5cGVdICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAgIC8vIHBvaW50YWJsZVN0cmluZyArPSBcIkJlbG9uZ3MgdG8gaGFuZCB3aXRoIElEOiBcIiArIHBvaW50YWJsZS5oYW5kSWQgKyBcIjxiciAvPlwiO1xuXHRcdCAgICAgICAgLy8gcG9pbnRhYmxlU3RyaW5nICs9IFwiQ2xhc3NpZmllZCBhcyBhIGZpbmdlcjxiciAvPlwiO1xuXHRcdCAgICAgICAgLy8gcG9pbnRhYmxlU3RyaW5nICs9IFwiTGVuZ3RoOiBcIiArIHBvaW50YWJsZS5sZW5ndGgudG9GaXhlZCgxKSArIFwiIG1tPGJyIC8+XCI7XG5cdFx0ICAgICAgICAvLyBwb2ludGFibGVTdHJpbmcgKz0gXCJXaWR0aDogXCIgICsgcG9pbnRhYmxlLndpZHRoLnRvRml4ZWQoMSkgKyBcIiBtbTxiciAvPlwiO1xuXHRcdCAgICAgICAgcG9pbnRhYmxlU3RyaW5nICs9IFwiRGlyZWN0aW9uOiBcIiArIHZlY3RvclRvU3RyaW5nKHBvaW50YWJsZS5kaXJlY3Rpb24sIDIpICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAgIHBvaW50YWJsZVN0cmluZyArPSBcIkV4dGVuZGVkPzogXCIgICsgcG9pbnRhYmxlLmV4dGVuZGVkICsgXCI8YnIgLz5cIjtcblx0XHQgICAgICAgIHBvaW50YWJsZS5ib25lcy5mb3JFYWNoKCBmdW5jdGlvbihib25lKXtcblx0XHQgICAgICAgICAgcG9pbnRhYmxlU3RyaW5nICs9IGJvbmVUeXBlTWFwW2JvbmUudHlwZV0gKyBcIiBib25lIDxiciAvPlwiO1xuXHRcdCAgICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCJDZW50ZXI6IFwiICsgdmVjdG9yVG9TdHJpbmcoYm9uZS5jZW50ZXIoKSkgKyBcIjxiciAvPlwiO1xuXHRcdCAgICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCJEaXJlY3Rpb246IFwiICsgdmVjdG9yVG9TdHJpbmcoYm9uZS5kaXJlY3Rpb24oKSkgKyBcIjxiciAvPlwiO1xuXHRcdCAgICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCJVcCB2ZWN0b3I6IFwiICsgdmVjdG9yVG9TdHJpbmcoYm9uZS5iYXNpc1sxXSkgKyBcIjxiciAvPlwiO1xuXHRcdCAgICAgICAgfSk7XG5cdFx0ICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCJUaXAgcG9zaXRpb246IFwiICsgdmVjdG9yVG9TdHJpbmcocG9pbnRhYmxlLnRpcFBvc2l0aW9uKSArIFwiIG1tPGJyIC8+XCI7XG5cdFx0ICAgICAgICBwb2ludGFibGVTdHJpbmcgKz0gXCI8L2Rpdj5cIjtcblx0XHQgICAgICB9XG5cblx0XHQgICAgICByZWFkRmluZ2VyUG9zaXRpb24oZmluZ2VyVHlwZU1hcFtwb2ludGFibGUudHlwZV0sIHBvaW50YWJsZS50aXBQb3NpdGlvblsxXSwgaGFuZC5wYWxtUG9zaXRpb25bMV0pO1xuXHRcdCAgICB9XG5cdFx0ICB9XG5cdFx0ICBlbHNlIHtcblx0XHQgICAgcG9pbnRhYmxlU3RyaW5nICs9IFwiPGRpdj5ObyBwb2ludGFibGVzPC9kaXY+XCI7XG5cdFx0ICB9XG5cdFx0ICBwb2ludGFibGVPdXRwdXQuaW5uZXJIVE1MID0gcG9pbnRhYmxlU3RyaW5nO1xuXG5cblx0XHQgIC8vIERpc3BsYXkgR2VzdHVyZSBvYmplY3QgZGF0YVxuXHRcdCAgdmFyIGdlc3R1cmVPdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdlc3R1cmVEYXRhXCIpO1xuXHRcdCAgdmFyIGdlc3R1cmVTdHJpbmcgPSBcIlwiO1xuXHRcdCAgaWYgKGZyYW1lLmdlc3R1cmVzLmxlbmd0aCA+IDApIHtcblx0XHQgICAgaWYgKHBhdXNlT25HZXN0dXJlKSB7XG5cdFx0ICAgICAgdG9nZ2xlUGF1c2UoKTtcblx0XHQgICAgfVxuXHRcdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lLmdlc3R1cmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0ICAgICAgdmFyIGdlc3R1cmUgPSBmcmFtZS5nZXN0dXJlc1tpXTtcblx0XHQgICAgICBnZXN0dXJlU3RyaW5nICs9IFwiR2VzdHVyZSBJRDogXCIgKyBnZXN0dXJlLmlkICsgXCIsIFwiXG5cdFx0ICAgICAgICAgICAgICAgICAgICArIFwidHlwZTogXCIgKyBnZXN0dXJlLnR5cGUgKyBcIiwgXCJcblx0XHQgICAgICAgICAgICAgICAgICAgICsgXCJzdGF0ZTogXCIgKyBnZXN0dXJlLnN0YXRlICsgXCIsIFwiXG5cdFx0ICAgICAgICAgICAgICAgICAgICArIFwiaGFuZCBJRHM6IFwiICsgZ2VzdHVyZS5oYW5kSWRzLmpvaW4oXCIsIFwiKSArIFwiLCBcIlxuXHRcdCAgICAgICAgICAgICAgICAgICAgKyBcInBvaW50YWJsZSBJRHM6IFwiICsgZ2VzdHVyZS5wb2ludGFibGVJZHMuam9pbihcIiwgXCIpICsgXCIsIFwiXG5cdFx0ICAgICAgICAgICAgICAgICAgICArIFwiZHVyYXRpb246IFwiICsgZ2VzdHVyZS5kdXJhdGlvbiArIFwiICZtaWNybztzLCBcIjtcblxuXHRcdCAgICAgIHN3aXRjaCAoZ2VzdHVyZS50eXBlKSB7XG5cdFx0ICAgICAgICBjYXNlIFwiY2lyY2xlXCI6XG5cdFx0ICAgICAgICAgIGdlc3R1cmVTdHJpbmcgKz0gXCJjZW50ZXI6IFwiICsgdmVjdG9yVG9TdHJpbmcoZ2VzdHVyZS5jZW50ZXIpICsgXCIgbW0sIFwiXG5cdFx0ICAgICAgICAgICAgICAgICAgICAgICAgKyBcIm5vcm1hbDogXCIgKyB2ZWN0b3JUb1N0cmluZyhnZXN0dXJlLm5vcm1hbCwgMikgKyBcIiwgXCJcblx0XHQgICAgICAgICAgICAgICAgICAgICAgICArIFwicmFkaXVzOiBcIiArIGdlc3R1cmUucmFkaXVzLnRvRml4ZWQoMSkgKyBcIiBtbSwgXCJcblx0XHQgICAgICAgICAgICAgICAgICAgICAgICArIFwicHJvZ3Jlc3M6IFwiICsgZ2VzdHVyZS5wcm9ncmVzcy50b0ZpeGVkKDIpICsgXCIgcm90YXRpb25zXCI7XG5cdFx0ICAgICAgICAgIGJyZWFrO1xuXHRcdCAgICAgICAgY2FzZSBcInN3aXBlXCI6XG5cdFx0ICAgICAgICAgIGdlc3R1cmVTdHJpbmcgKz0gXCJzdGFydCBwb3NpdGlvbjogXCIgKyB2ZWN0b3JUb1N0cmluZyhnZXN0dXJlLnN0YXJ0UG9zaXRpb24pICsgXCIgbW0sIFwiXG5cdFx0ICAgICAgICAgICAgICAgICAgICAgICAgKyBcImN1cnJlbnQgcG9zaXRpb246IFwiICsgdmVjdG9yVG9TdHJpbmcoZ2VzdHVyZS5wb3NpdGlvbikgKyBcIiBtbSwgXCJcblx0XHQgICAgICAgICAgICAgICAgICAgICAgICArIFwiZGlyZWN0aW9uOiBcIiArIHZlY3RvclRvU3RyaW5nKGdlc3R1cmUuZGlyZWN0aW9uLCAxKSArIFwiLCBcIlxuXHRcdCAgICAgICAgICAgICAgICAgICAgICAgICsgXCJzcGVlZDogXCIgKyBnZXN0dXJlLnNwZWVkLnRvRml4ZWQoMSkgKyBcIiBtbS9zXCI7XG5cdFx0ICAgICAgICAgIGJyZWFrO1xuXHRcdCAgICAgICAgY2FzZSBcInNjcmVlblRhcFwiOlxuXHRcdCAgICAgICAgY2FzZSBcImtleVRhcFwiOlxuXHRcdCAgICAgICAgICBnZXN0dXJlU3RyaW5nICs9IFwicG9zaXRpb246IFwiICsgdmVjdG9yVG9TdHJpbmcoZ2VzdHVyZS5wb3NpdGlvbikgKyBcIiBtbVwiO1xuXHRcdCAgICAgICAgICBicmVhaztcblx0XHQgICAgICAgIGRlZmF1bHQ6XG5cdFx0ICAgICAgICAgIGdlc3R1cmVTdHJpbmcgKz0gXCJ1bmtvd24gZ2VzdHVyZSB0eXBlXCI7XG5cdFx0ICAgICAgfVxuXHRcdCAgICAgIGdlc3R1cmVTdHJpbmcgKz0gXCI8YnIgLz5cIjtcblx0XHQgICAgfVxuXHRcdCAgfVxuXHRcdCAgZWxzZSB7XG5cdFx0ICAgIGdlc3R1cmVTdHJpbmcgKz0gXCJObyBnZXN0dXJlc1wiO1xuXHRcdCAgfVxuXHRcdCAgZ2VzdHVyZU91dHB1dC5pbm5lckhUTUwgPSBnZXN0dXJlU3RyaW5nO1xuXG5cdFx0ICAvLyBTdG9yZSBmcmFtZSBmb3IgbW90aW9uIGZ1bmN0aW9uc1xuXHRcdCAgcHJldmlvdXNGcmFtZSA9IGZyYW1lO1xuXHRcdH0pXG5cdH1cblxuXHR2ZWN0b3JUb1N0cmluZyh2ZWN0b3IsIGRpZ2l0cykge1xuXHQgIGlmICh0eXBlb2YgZGlnaXRzID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdCAgICBkaWdpdHMgPSAxO1xuXHQgIH1cblx0ICByZXR1cm4gXCIoXCIgKyB2ZWN0b3JbMF0udG9GaXhlZChkaWdpdHMpICsgXCIsIFwiXG5cdCAgICAgICAgICAgICArIHZlY3RvclsxXS50b0ZpeGVkKGRpZ2l0cykgKyBcIiwgXCJcblx0ICAgICAgICAgICAgICsgdmVjdG9yWzJdLnRvRml4ZWQoZGlnaXRzKSArIFwiKVwiO1xuXHR9XG5cblx0dG9nZ2xlUGF1c2UoKSB7XG5cdCAgcGF1c2VkID0gIXBhdXNlZDtcblxuXHQgIGlmIChwYXVzZWQpIHtcblx0ICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2VcIikuaW5uZXJUZXh0ID0gXCJSZXN1bWVcIjtcblx0ICB9IGVsc2Uge1xuXHQgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZVwiKS5pbm5lclRleHQgPSBcIlBhdXNlXCI7XG5cdCAgfVxuXHR9XG5cblx0cGF1c2VGb3JHZXN0dXJlcygpIHtcblx0ICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZU9uR2VzdHVyZVwiKS5jaGVja2VkKSB7XG5cdCAgICBwYXVzZU9uR2VzdHVyZSA9IHRydWU7XG5cdCAgfSBlbHNlIHtcblx0ICAgIHBhdXNlT25HZXN0dXJlID0gZmFsc2U7XG5cdCAgfVxuXHR9XG5cblxuXG5cblx0cmVhZEZpbmdlclBvc2l0aW9uKHBvaW50YWJsZVR5cGUsIHRpcFBvc2l0aW9uWSwgaGFuZFBvc2l0aW9uWSkge1xuXHQgIG91dHB1dENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKTtcblx0ICBjdXJyZW50UG9zaXRpb25SZWFkID0gcGFyc2VGbG9hdCgodGlwUG9zaXRpb25ZIC0gaGFuZFBvc2l0aW9uWSkudG9GaXhlZCgyKSk7XG5cdCAgbGFzdFRlblBvc2l0aW9ucy5wdXNoKGN1cnJlbnRQb3NpdGlvblJlYWQpO1xuXHQgIGZpbmdlclR5cGUgPSBwb2ludGFibGVUeXBlO1xuXHQgIGlmIChsYXN0VGVuUG9zaXRpb25zWzldKSB7XG5cdCAgICBsYXN0VGVuUG9zaXRpb25zLnNoaWZ0KCk7XG5cdCAgfVxuXHQgIHZhciBzdW0gPSBsYXN0VGVuUG9zaXRpb25zLnJlZHVjZShmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhICsgYjsgfSk7XG5cdCAgY3VycmVudFBvc2l0aW9uID0gc3VtL2xhc3RUZW5Qb3NpdGlvbnMubGVuZ3RoO1xuXHQgIC8vY29uc29sZS5sb2coJ2N1cnJlbnRQb3NpdGlvbicsIGN1cnJlbnRQb3NpdGlvbik7XG5cdCAgaWYgKGhpZ2hlc3RQb2ludCAmJiBsb3dlc3RQb2ludCkge1xuXHQgICAgc2V0SGlnaGVzdFBvaW50KCk7XG5cdCAgICBzZXRMb3dlc3RQb2ludCgpO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgIHJlc2V0KCk7XG5cdCAgfVxuXHQgIGlmIChyZWFkeUZvcktleURvd24pIHtcblx0ICAgIGNoZWNrRm9yS2V5RG93bigpO1xuXHQgIH1cblx0ICBpZiAocmVhZHlGb3JLZXlVcCkge1xuXHQgICAgY2hlY2tGb3JLZXlVcCgpO1xuXHQgIH1cblx0fVxuXG5cdHNldEhpZ2hlc3RQb2ludCgpIHtcblx0ICBoaWdoZXN0UG9pbnQgPSAoY3VycmVudFBvc2l0aW9uID49IGhpZ2hlc3RQb2ludCkgPyBjdXJyZW50UG9zaXRpb24gOiBoaWdoZXN0UG9pbnQ7XG5cdCAgLy9jb25zb2xlLmxvZygnaGlnaGVzdFBvaW50JywgaGlnaGVzdFBvaW50KTtcblx0fVxuXG5cdHNldExvd2VzdFBvaW50KCkge1xuXHQgIGxvd2VzdFBvaW50ID0gKGN1cnJlbnRQb3NpdGlvbiA8PSBsb3dlc3RQb2ludCkgPyBjdXJyZW50UG9zaXRpb24gOiBsb3dlc3RQb2ludDtcblx0ICAvL2NvbnNvbGUubG9nKCdsb3dlc3RQb2ludCcsIGxvd2VzdFBvaW50KTtcblx0fVxuXG5cdGNoZWNrRm9yS2V5RG93bigpIHtcblx0ICBpZiAoY3VycmVudFBvc2l0aW9uIDw9IGhpZ2hlc3RQb2ludCAtIHRyaWdnZXJJbnRlcnZhbCkge1xuXHQgICAgcmVhZHlGb3JLZXlEb3duID0gZmFsc2U7XG5cdCAgICBsb3dlc3RQb2ludCA9IGN1cnJlbnRQb3NpdGlvbjtcblx0ICAgIC8vY29uc29sZS5sb2coJ0tFWURPV04nLCAnY3VycmVudFBvc2l0aW9uJywgY3VycmVudFBvc2l0aW9uLCAnaGlnaGVzdFBvaW50JywgaGlnaGVzdFBvaW50LCAnbG93ZXN0UG9pbnQnLCBsb3dlc3RQb2ludCk7XG5cdCAgICByZWFkeUZvcktleVVwID0gdHJ1ZTtcblx0ICAgIC8vY29uc29sZS5sb2coJ3JlYWR5Rm9yS2V5VXAnKTtcblx0ICB9XG5cdH1cblxuXHRjaGVja0ZvcktleVVwKCkge1xuXHQgIGlmIChjdXJyZW50UG9zaXRpb24gPj0gbG93ZXN0UG9pbnQgKyB0cmlnZ2VySW50ZXJ2YWwpIHtcblx0ICAgIC8vY29uc29sZS5sb2coJ0tFWVVQJywgJ2N1cnJlbnRQb3NpdGlvbicsIGN1cnJlbnRQb3NpdGlvbiwgJ2hpZ2hlc3RQb2ludCcsIGhpZ2hlc3RQb2ludCwgJ2xvd2VzdFBvaW50JywgbG93ZXN0UG9pbnQpO1xuXHQgICAgY29uc29sZS5sb2coJ3Q7eXBlJywgZmluZ2VyVHlwZSk7XG5cdCAgICBpZiAoZmluZ2VyVHlwZSA9PSAnVGh1bWInKSB7XG5cdCAgICAgIHNlbmRTcGFjZSgpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgIHNlbmRLZXkoKTtcblx0ICAgIH1cblx0ICAgIHJlc2V0KCk7XG5cdCAgfVxuXHR9XG5cblx0cmVzZXQoKSB7XG5cdCAgcmVhZHlGb3JLZXlVcCA9IGZhbHNlO1xuXHQgIGhpZ2hlc3RQb2ludCA9IGN1cnJlbnRQb3NpdGlvbjtcblx0ICBsb3dlc3RQb2ludCA9IGN1cnJlbnRQb3NpdGlvbjtcblx0ICByZWFkeUZvcktleURvd24gPSB0cnVlO1xuXHQgIC8vY29uc29sZS5sb2coJ3JlYWR5Rm9yS2V5RG93bicpO1xuXHQgIC8vY29uc29sZS5sb2coJ3Jlc2V0IHBvc2l0aW5vcyBoaWdoZXN0JywgaGlnaGVzdFBvaW50LCAncmVzZXQgcG9zaXRpb25zIGxvd2VzdCcsIGxvd2VzdFBvaW50KTtcblx0fVxuXG5cdHNlbmRTcGFjZSgpIHtcblx0ICBvdXRwdXRDb250YWluZXIuaW5uZXJIVE1MID0gb3V0cHV0Q29udGFpbmVyLmlubmVySFRNTCArIFwiIFwiOyAgXG5cdH1cblxuXHRzZW5kS2V5KCkge1xuXHQgIHZhciBwb3NpdGlvbkxpbmVhciA9ICh2ZXJ0aWNhbFJhbmdlWzBdIC0gbG93ZXN0UG9pbnQpL3ZlcnRpY2FsRGlzdGFuY2U7XG5cdCAgdmFyIHBvc2l0aW9uQnJhY2tldCA9IE1hdGguZmxvb3IocG9zaXRpb25MaW5lYXIgKiBhbHBoYWJldC5sZW5ndGgpO1xuXHQgIC8vIGNvbnNvbGUubG9nKCdoaWdoZXN0UG9pbnQnLCBoaWdoZXN0UG9pbnQpO1xuXHQgIC8vIGNvbnNvbGUubG9nKCdsb3dlc3RQb2ludCcsIGxvd2VzdFBvaW50KTtcblx0ICAvLyBjb25zb2xlLmxvZygna2V5cHJlc3MnLCBhbHBoYWJldFtwb3NpdGlvbkJyYWNrZXRdKTtcblx0ICBpZiAoYWxwaGFiZXRbcG9zaXRpb25CcmFja2V0XSkge1xuXHQgICAgb3V0cHV0Q29udGFpbmVyLmlubmVySFRNTCA9IG91dHB1dENvbnRhaW5lci5pbm5lckhUTUwgKyBhbHBoYWJldFtwb3NpdGlvbkJyYWNrZXRdOyAgXG5cdCAgfVxuXHR9XG59XG5cbmV4cG9ydCB7IExlYXBLZXlib2FyZCB9OyIsIi8vIE1haW4gYXBwbGljYXRpb24gZW50cnkgcG9pbnRcbmltcG9ydCB7IExlYXBLZXlib2FyZCB9IGZyb20gJy4vY29tcG9uZW50cy9MZWFwS2V5Ym9hcmQnO1xuXG4vLyBJbnN0YW50aWF0ZVxuLy93aW5kb3cuTGVhcEtleWJvYXJkID0gd2luZG93LkxlYXBLZXlib2FyZCB8fCBMZWFwS2V5Ym9hcmQ7XG52YXIgS2V5Ym9hcmQgPSBuZXcgTGVhcEtleWJvYXJkKCk7XG5cbiJdfQ==
