export default class Type {
	constructor(pointableType, tipPositionY, handPositionY) {
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

		readFingerPosition(pointableType, tipPositionY, handPositionY);
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

	
	