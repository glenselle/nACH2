// Utility Functions

// Pad a given string to a fixed width using any character or number (defaults to one blank space)
// Both a string and width are required params for this function, but it also takes two optional
// parameters. First, a boolean called 'padRight' which by default is true. This means padding 
// will be applied to the right of the string. Setting this to false will pad the left side of the
// string. You can also specify the character you want to use to pad the string.
function pad(string, width) {
	var padRight
	  , padChar
	  , result
	  , string = string + '';

	if(typeof arguments[2] == 'boolean') {
		padRight = arguments[2];
		padChar  = arguments[3] || ' ';
	} else if(typeof arguments[3] == 'boolean') {
		padRight = arguments[3];
		padChar  = arguments[2];
	} else {
		padRight = true;
		padChar  = arguments[2] || ' ';
	}

	if(string.length >= width) {
		return string;
	} else {
		result = new Array(width - string.length + 1).join(padChar);
		return padRight ? string + result : result + string;
	}
}

// This function is passed a field and a regex and tests the field's value property against the given regex
function testRegex(regex, field) {
	if(!regex.test(field.value)) {
		throw {
	    	name: 'Invalid Data Type',
	    	message: field.name+'\'s data type is required to be '+field.type+', but its contents don\'t reflect that.'
		};
	}

	return true;
}

module.exports.pad       = pad;
module.exports.testRegex = testRegex;
