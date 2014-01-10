var exec = require('cordova/exec');
/*
var cameraRoll = {
	getPhotos: function(successCallback, errorCallback, options) {
       exec(successCallback, errorCallback, "CameraRoll", "getPhotos", []);
	},
	successCallback: function(result) {
		alert(result);
	},
	errorCallback: function(result) {
		alert(result);
	}
	
}
module.exports = cameraRoll;
*/


var cameraRoll = {};

cameraRoll.getPhotos = function(successCallback, errorCallback, options) {
  exec(successCallback, errorCallback, "CameraRoll", "getPhotos", []);
};



module.exports = cameraRoll;

