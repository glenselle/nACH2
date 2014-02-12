//TODO: Maybe validate position with indexes

var _                    = require('lodash')
  , utils                = require('./utils')
  , ACHTransactionCodes  = ['22','23','24','27','28','29','32','33','34','37','38','39']
  , ACHServiceClassCodes = ['200','220','225']
  , routingRegex         = /^(\d{9})$/
  , numericRegex         = /^[0-9]+$/
  , alphaRegex           = /^[a-zA-Z]+$/
  , alphanumericRegex    = /^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$/
  , array
  , sum;

// Validate required fields to make sure they have values
function validateRequiredFields(object) {
	_.forEach(object, function(field) {
//**** Should I be using Boolean here???
		if(field.required === true && Boolean(field.value) != field.required) {
			throw {
		    	name: 'Required Field Blank',
		    	message: field.name+' is a required field but its value is empty.'
			};
		}
	});

	return true;
}

// Validate the lengths of fields by using their `width` property
function validateLengths(object) {
	_.forEach(object, function(field) {
		if(field.value.length > field.width) {
			throw {
		    	name: 'Invalid Length',
		    	message: field.name+'\'s length is '+field.value.length+', but it should be no greater than '+field.width+'.'
			};
		}
	});

	return true;
}

// Validate the data given is of the correct ACH data type
function validateDataTypes(object) {
	_.forEach(object, function(field) {
		if(field.blank !== true) {
			switch(field.type) {
			case 'numeric':
				utils.testRegex(numericRegex, field);
				break;
			case 'alpha':
				utils.testRegex(alphaRegex, field);
				break;
			case 'alphanumeric':
				utils.testRegex(alphanumericRegex, field);
				break;
			}
		}
	});

	return true;
}

// Insure a given transaction code is valid
function validateACHCode(transactionCode) {
	if(transactionCode.length !== 2 || !_.contains(ACHTransactionCodes, transactionCode)) {
		throw {
		    name: 'ACH Transaction Code Error',
		    message: 'The ACH transaction code '+transactionCode+' is invalid. Please pass a valid 2-digit transaction code.'
		};
	}

	return true;
}

function validateACHServiceClassCode(serviceClassCode) {
	if(serviceClassCode.length !== 3 || !_.contains(ACHServiceClassCodes, serviceClassCode)) {
		throw {
		    name: 'ACH Service Class Code Error',
		    message: 'The ACH service class code '+serviceClassCode+' is invalid. Please pass a valid 3-digit service class code.'
		};
	}

	return true;
}

function validateRoutingNumber(routing) {
	// Test the routing number against the regex.
//**** routing_num.length? I don't think so.
// The routing number validation regex insures the routing number is composed of only nine (no more, no less) digits.
	if(!routingRegex.test(routing)) {
		throw {
		    name: 'Invalid ABA Number',
		    message: 'The ABA routing number '+routing+' is invalid. Please ensure a valid 9-digit ABA routing number is passed.'
		};
	}

	// Split the routing number into an array of numbers. `array` will look like this: `[2,8,1,0,8,1,4,7,9]`.
	array = routing.split('').map(Number);

	// Validate the routing number (ABA). See here for more info: http://www.brainjar.com/js/validation/
	sum = 
		3 * (array[0] + array[3] + array[6]) +
		7 * (array[1] + array[4] + array[7]) +
		1 * (array[2] + array[5] + array[8]);

	// Throw an error if the the result of `sum` modulo 10 is not zero. The value of `sum` must be a multiple of 10 to be a valid routing number.
	if(sum % 10 !== 0) {
		throw {
		    name: 'Invalid ABA Number',
		    message: 'The ABA routing number '+routing+' is invalid. Please ensure a valid 9-digit ABA routing number is passed.'
		};
	}

	return true;
}

module.exports.validateRequiredFields      = validateRequiredFields;
module.exports.validateLengths             = validateLengths;
module.exports.validateDataTypes           = validateDataTypes;
module.exports.validateACHCode             = validateACHCode;
module.exports.validateACHServiceClassCode = validateACHServiceClassCode;
module.exports.validateRoutingNumber       = validateRoutingNumber;