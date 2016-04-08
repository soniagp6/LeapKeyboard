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
		console.log('test function');
	};

	return LeapKeyboard;
}();

exports.default = LeapKeyboard;


module.exports = LeapKeyboard;

},{}],2:[function(require,module,exports){
'use strict';

var _LeapKeyboard = require('./components/LeapKeyboard');

var _LeapKeyboard2 = _interopRequireDefault(_LeapKeyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Instantiate
window.LeapKeyboard = window.LeapKeyboard || _LeapKeyboard2.default; // Main application entry point


testFunction();

},{"./components/LeapKeyboard":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZXM2L2NvbXBvbmVudHMvTGVhcEtleWJvYXJkLmpzIiwic3JjL2pzL2VzNi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBcUI7QUFDcEIsVUFEb0IsWUFDcEIsR0FBYzt3QkFETSxjQUNOOztBQUNiLFVBQVEsR0FBUixDQUFZLFNBQVosRUFEYTtFQUFkOztBQURvQix3QkFLcEIsdUNBQWU7QUFDZCxVQUFRLEdBQVIsQ0FBWSxlQUFaLEVBRGM7OztRQUxLOzs7Ozs7QUFVckIsT0FBTyxPQUFQLEdBQWlCLFlBQWpCOzs7Ozs7Ozs7Ozs7QUNOQSxPQUFPLFlBQVAsR0FBc0IsT0FBTyxZQUFQLDBCQUF0Qjs7O0FBRUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGVhcEtleWJvYXJkIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Y29uc29sZS5sb2coJ3Rlc3QgMjQnKTtcblx0fVxuXG5cdHRlc3RGdW5jdGlvbigpIHtcblx0XHRjb25zb2xlLmxvZygndGVzdCBmdW5jdGlvbicpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGVhcEtleWJvYXJkOyIsIi8vIE1haW4gYXBwbGljYXRpb24gZW50cnkgcG9pbnRcbmltcG9ydCBMZWFwS2V5Ym9hcmQgZnJvbSAnLi9jb21wb25lbnRzL0xlYXBLZXlib2FyZCc7XG5cbi8vIEluc3RhbnRpYXRlXG53aW5kb3cuTGVhcEtleWJvYXJkID0gd2luZG93LkxlYXBLZXlib2FyZCB8fCBMZWFwS2V5Ym9hcmQ7XG5cbnRlc3RGdW5jdGlvbigpO1xuIl19
