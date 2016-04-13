(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LeapKeyboard = function () {
	function LeapKeyboard() {
		_classCallCheck(this, LeapKeyboard);

		console.log('test 24');
	}

	LeapKeyboard.prototype.testFunction = function testFunction() {
		console.log('test function 8');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZXM2L2NvbXBvbmVudHMvTGVhcEtleWJvYXJkLmpzIiwic3JjL2pzL2VzNi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBcUI7QUFDcEIsVUFEb0IsWUFDcEIsR0FBYzt3QkFETSxjQUNOOztBQUNiLFVBQVEsR0FBUixDQUFZLFNBQVosRUFEYTtFQUFkOztBQURvQix3QkFLcEIsdUNBQWU7QUFDZCxVQUFRLEdBQVIsQ0FBWSxpQkFBWixFQURjOzs7UUFMSzs7OztRQVVaOzs7OztBQ1RUOzs7O0FBSUEsSUFBSSxXQUFXLGdDQUFYIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExlYXBLZXlib2FyZCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGNvbnNvbGUubG9nKCd0ZXN0IDI0Jyk7XG5cdH1cblxuXHR0ZXN0RnVuY3Rpb24oKSB7XG5cdFx0Y29uc29sZS5sb2coJ3Rlc3QgZnVuY3Rpb24gOCcpO1xuXHR9XG59XG5cbmV4cG9ydCB7IExlYXBLZXlib2FyZCB9OyIsIi8vIE1haW4gYXBwbGljYXRpb24gZW50cnkgcG9pbnRcbmltcG9ydCB7IExlYXBLZXlib2FyZCB9IGZyb20gJy4vY29tcG9uZW50cy9MZWFwS2V5Ym9hcmQnO1xuXG4vLyBJbnN0YW50aWF0ZVxuLy93aW5kb3cuTGVhcEtleWJvYXJkID0gd2luZG93LkxlYXBLZXlib2FyZCB8fCBMZWFwS2V5Ym9hcmQ7XG52YXIgS2V5Ym9hcmQgPSBuZXcgTGVhcEtleWJvYXJkKCk7XG4iXX0=
