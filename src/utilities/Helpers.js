var jsface = require('jsface'),
	fs     = require('fs'),
	Errors = require('./ErrorHandler'),
	_und   = require('underscore');

/** 
 * @name Helpers
 * @namespace
 * @classdesc Helper class with useful methods used throughout Newman
 */
var Helpers = jsface.Class({
	$singleton: true,

    /**
     * @function
     * @memberOf Helpers
     * @param  {String}  url [Takes a URL as an input]
     * @return {Boolean}     [Returns is the url is valid or not.]
     */
    validateCollectionUrl: function(url) {
		var result = url.match(/(https|http):\/\/([_a-z\d\-]+(\.[_a-z\d\-]+)+)(([_a-z\d\-\\\.\/]+[_a-z\d\-\\\/])+)*/);
		if (!result)  {
			Errors.terminateWithError("Please specify a valid URL");
		}
    },

	validateDataFile: function(file) {
		if (!fs.existsSync(file)) {
			Errors.terminateWithError("The data file passed is not a valid json / csv file");
		}
	},

	validateCollectionFile: function(file) {
		if (!fs.existsSync(file)) {
			Errors.terminateWithError("Please specify a Postman Collection either as a file or a URL");
		}
	},

	// transforms an array of 
	// [{"id": 1, "name":"foo"}, { .. }, ..] 
	// into an object {"key": "id", "value": "foo"}]
	transformToKeyValue: function(json) {
		return _und.map(_und.pairs(json), function(pair){
			return { key: pair[0], value: pair[1] };
		}, []);
	},

	// transforms an array of 
	// [{ "key": "id", "value": "20" }, { "key": "name", "value": "joe" }] 
	// into an object {"id": "20", "name": "joe"}
	transformFromKeyValue: function(kvpairs) {
		return _und.object(_und.pluck(kvpairs, "key"), _und.pluck(kvpairs, "value"));
	},

	// generates a header object from a string where headers are of the form
	// Accept-Language: En\nCache-Control: 123\nPragma: Akamai\n
	generateHeaderObj: function(headers) {
		var headerObj = {};
		headers.split('\n').forEach(function(str) {
			if (str) {
				var splitIndex = str.indexOf(':');
				headerObj[str.substr(0,splitIndex)] = str.substr(splitIndex + 1).trim();
			}
		});
		return headerObj;
	}
});

// symbols for logging
exports.symbols =  {
	err: (process.platform === "win32") ? "\u00D7 " : "✗ ",
	ok:  (process.platform === "win32") ? "\u221A " : "✔ "
};

module.exports = Helpers;
