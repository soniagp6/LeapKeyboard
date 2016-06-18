
export default class Pointable {
	constructor() {
		var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];
	}

	addToPointableString(pointable) {
		pointableString += "<div style='width:250px; float:left; padding:5px'>Test string";

		// if (thisPointable.tool) {
		// 	pointableString += "Pointable ID: " + thisPointable.id + "<br />";
		// 	// pointableString += "Classified as a tool <br />";
		// 	// pointableString += "Length: " + thisPointable.length.toFixed(1) + " mm<br />";
		// 	// pointableString += "Width: "  + thisPointable.width.toFixed(1) + " mm<br />";
		// 	pointableString += "Direction: " + vectorToString(thisPointable.direction, 2) + "<br />";
		// 	pointableString += "Tip position: " + vectorToString(thisPointable.tipPosition) + " mm<br />"
		// }
		// else {
		// 	pointableString += "Pointable ID: " + thisPointable.id + "<br />";
		// 	pointableString += "Type: " + fingerTypeMap[thisPointable.type] + "<br />";
		// 	// pointableString += "Belongs to hand with ID: " + thisPointable.handId + "<br />";
		// 	// pointableString += "Classified as a finger<br />";
		// 	// pointableString += "Length: " + thisPointable.length.toFixed(1) + " mm<br />";
		// 	// pointableString += "Width: "  + thisPointable.width.toFixed(1) + " mm<br />";
		// 	pointableString += "Direction: " + vectorToString(thisPointable.direction, 2) + "<br />";
		// 	pointableString += "Extended?: "  + thisPointable.extended + "<br />";
		// 	thisPointable.bones.forEach( function(bone){
		// 		pointableString += boneTypeMap[bone.type] + " bone <br />";
		// 		pointableString += "Center: " + vectorToString(bone.center()) + "<br />";
		// 		pointableString += "Direction: " + vectorToString(bone.direction()) + "<br />";
		// 		pointableString += "Up vector: " + vectorToString(bone.basis[1]) + "<br />";
		// 	});
		// 	pointableString += "Tip position: " + vectorToString(thisPointable.tipPosition) + " mm<br />";
		// }
		pointableString += "</div>";
		return pointableString;
	}

	//readFingerPosition(fingerTypeMap[thisPointable.type], thisPointable.tipPosition[1], hand.palmPosition[1]);
}

export { Pointable };