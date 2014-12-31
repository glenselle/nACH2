// Entry

var utils = require('./../utils');
var validate = require('./../validate');
var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


var highLevelOverrides = ['transactionCode','receivingDFI','checkDigit','DFIAccount','amount','idNumber','individualName','discretionaryData','addendaId','traceNumber'];


var Entry = function(options) {
	EventEmitter.call(this);

	// Allow the file header defaults to be overriden if provided
	this.fields = options.header ? _.merge(options.header, require('./fields'), _.defaults) : require('./fields');

	// Set our values
	utils.overrideLowLevel('header', highLevelOverrides, options, this);

	if(options.receivingDFI){
		this.fields.receivingDFI.value = options.receivingDFI.slice(0,-1);
		this.fields.checkDigit.value = options.receivingDFI.slice(-1);
	}

	if(options.DFIAccount){
		this.fields.DFIAccount.value = options.DFIAccount.slice(0, this.fields.DFIAccount.width);  
	}

	// if(options.amount){
	// 	this.fields.amount.value  = parseFloat(options.amount).toFixed(2).replace(/\./, '');
	// }

	if(options.idNumber){
		this.fields.idNumber.value  = options.idNumber;
	}

	if(options.individualName){
		this.fields.individualName.value = options.individualName.slice(0,this.fields.individualName.width);
	}

	if(options.discretionaryData) {
		this.fields.discretionaryData.value = options.discretionaryData;
	}


	// Validate required fields have been passed
	this._validate();
}

// Entry.prototype = {
// 	generateString: function() {
// 		return utils.generateString(this.fields);
// 	}
// }

Entry.prototype.generateString = function(cb) {
	utils.generateString(this.fields, function(string) {
		cb(string);
	});
}


Entry.prototype._validate = function() {
	validate.validateRequiredFields(this.fields);

	validate.validateACHCode(this.fields.transactionCode.value);

	validate.validateRoutingNumber(this.fields.receivingDFI.value + this.fields.checkDigit.value);

	// Validate header field lengths
	validate.validateLengths(this.fields);

	// Validate header data types
	validate.validateDataTypes(this.fields);

}

Entry.prototype.get = function(category) {
	
	// If the header has it, return that (header takes priority)
	if(this.fields[category]) {
		return this.fields[category]['value'];
	}
}

Entry.prototype.set = function(category, value) {

	// If the header has the field, set the value
	if(this.fields[category]) {
		this.fields[category]['value'] = value;
	}
}


module.exports = Entry;