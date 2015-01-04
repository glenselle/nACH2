// Entry

var _ = require('lodash');
var utils = require('./../utils');
var validate = require('./../validate');

var highLevelOverrides = ['transactionCode','receivingDFI','checkDigit','DFIAccount','amount','idNumber','individualName','discretionaryData','addendaId','traceNumber'];

function Entry(options) {

	// Allow the file header defaults to be overriden if provided
	this.fields = options.fields ? _.merge(options.fields, require('./fields'), _.defaults) : _.cloneDeep(require('./fields'));

	// Some values need special coercing, so after they've been set by overrideLowLevel() we override them
	if(options.receivingDFI) {
		this.fields.receivingDFI.value = options.receivingDFI.slice(0,-1);
		this.fields.checkDigit.value = options.receivingDFI.slice(-1);
	}

	if(options.DFIAccount) {
		this.fields.DFIAccount.value = options.DFIAccount.slice(0, this.fields.DFIAccount.width);  
	}
	
	if(options.amount) {
		this.fields.amount.value = Number(options.amount);
	}

	if(options.idNumber) {
		this.fields.idNumber.value  = options.idNumber;
	}

	if(options.individualName) {
		this.fields.individualName.value = options.individualName.slice(0,this.fields.individualName.width);
	}

	if(options.discretionaryData) {
		this.fields.discretionaryData.value = options.discretionaryData;
	}

	// Validate required fields have been passed
	this._validate();
	
	return this;
}

Entry.prototype.generateString = function(cb) {
	utils.generateString(this.fields, function(string) {
		cb(string);
	});
};

Entry.prototype._validate = function() {
	
	// Validate required fields
	validate.validateRequiredFields(this.fields);

	// Validate the ACH code passed is actually valid
	validate.validateACHCode(this.fields.transactionCode.value);

	// Validate the routing number
	validate.validateRoutingNumber(this.fields.receivingDFI.value + this.fields.checkDigit.value);

	// Validate header field lengths
	validate.validateLengths(this.fields);

	// Validate header data types
	validate.validateDataTypes(this.fields);
};

Entry.prototype.get = function(category) {
	
	// If the header has it, return that (header takes priority)
	if(this.fields[category]) {
		return this.fields[category]['value'];
	}
};

Entry.prototype.set = function(category, value) {

	// If the header has the field, set the value
	if(this.fields[category]) {
		this.fields[category]['value'] = value;
	}
};

module.exports = Entry;