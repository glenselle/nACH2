//TODO: Maybe validate position with indexes

var _                    = require('lodash')
  , utils                = require('./utils')
  , nACHError 					 = require('./error')
  , ACHAddendaTypeCodes  = ['02','05','98','99']
  , ACHTransactionCodes  = ['22','23','24','27','28','29','32','33','34','37','38','39']
  , ACHServiceClassCodes = ['200','220','225']
  , numericRegex         = /^[0-9]+$/
  , alphaRegex           = /^[a-zA-Z]+$/
  , alphanumericRegex    = /^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$/
  , array
  , sum;

// Validate required fields to make sure they have values
function validateRequiredFields(object) {
	_.forEach(object, function(field) {
		// This check ensures a required field's value is not NaN, null, undefined or empty. Zero is valid, but the data type check will make sure any fields with 0 are numeric.
		if(field.required === true && (_.isNaN(field.value) || _.isNull(field.value) || _.isUndefined(field.value) || field.value.toString().length === 0)) {
			throw new nACHError({
					    	name: 'Required Field Blank',
					    	message: field.name+' is a required field but its value is: ' + field.value
						});
		}
	});

	return true;
}

// Validate the lengths of fields by using their `width` property
function validateLengths(object) {
	_.forEach(object, function(field) {
		if(field.value.toString().length > field.width) {
			throw new nACHError( {
					    	name: 'Invalid Length',
					    	message: field.name+'\'s length is '+field.value.length+', but it should be no greater than '+field.width+'.'
						});
		}
	});

	return true;
}

function getNextMultipleDiff(value, multiple) {
	return (value + (multiple - value % multiple)) - value;
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

function validateACHAddendaTypeCode(addendaTypeCode) {
	if(addendaTypeCode.length !== 2 || !_.includes(ACHAddendaTypeCodes, addendaTypeCode)) {
		throw new nACHError({
				    name: 'ACH Addenda Type Code Error',
				    message: 'The ACH addenda type code '+addendaTypeCode+' is invalid. Please pass a valid 2-digit addenda type code.'
				});
	}

	return true;
}

// Insure a given transaction code is valid
function validateACHCode(transactionCode) {
	if(transactionCode.length !== 2 || !_.includes(ACHTransactionCodes, transactionCode)) {
		throw new nACHError({
				    name: 'ACH Transaction Code Error',
				    message: 'The ACH transaction code '+transactionCode+' is invalid. Please pass a valid 2-digit transaction code.'
				});
	}

	return true;
}

function validateACHServiceClassCode(serviceClassCode) {
	if(serviceClassCode.length !== 3 || !_.includes(ACHServiceClassCodes, serviceClassCode)) {
		throw new nACHError({
				    name: 'ACH Service Class Code Error',
				    message: 'The ACH service class code '+serviceClassCode+' is invalid. Please pass a valid 3-digit service class code.'
				});
	}

	return true;
}

function validateRoutingNumber(routing) {
	// Make sure the routing number is exactly 9-digits long
	if(routing.toString().length !== 9) {
		throw new nACHError({
				    name: 'Invalid ABA Number Length',
				    message: 'The ABA routing number '+routing+' is ' + routing.toString().length + '-digits long, but it should be 9-digits long.'
				});
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
		throw new nACHError({
				    name: 'Invalid ABA Number',
				    message: 'The ABA routing number '+routing+' is invalid. Please ensure a valid 9-digit ABA routing number is passed.'
				});
	}

	return true;
}

module.exports.validateRequiredFields      = validateRequiredFields;
module.exports.validateLengths             = validateLengths;
module.exports.validateDataTypes           = validateDataTypes;
module.exports.validateACHAddendaTypeCode  = validateACHAddendaTypeCode;
module.exports.validateACHCode             = validateACHCode;
module.exports.validateACHServiceClassCode = validateACHServiceClassCode;
module.exports.validateRoutingNumber       = validateRoutingNumber;
module.exports.getNextMultipleDiff         = getNextMultipleDiff;
