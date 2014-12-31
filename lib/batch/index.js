// Batches

var utils = require('./../utils');
var validate = require('./../validate');
var _ = require('lodash');
var util = require('util');
var async = require('async');
var EventEmitter = require('events').EventEmitter;

var highLevelHeaderOverrides = ['serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'];
var highLevelControlOverrides = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];

var Batch = function(userOptions) {

	this.entries = [];
	// Allow the batch header defaults to be overriden if provided
	this.header = userOptions.header ? _.merge(userOptions.header, require('./header'), _.defaults) : require('./header');
	this.control = userOptions.control ? _.merge(userOptions.header, require('./control'), _.defaults) : require('./control');

	// Validate the routing number (ABA) before slicing
	validate.validateRoutingNumber(userOptions.originatingDFI);

	if(userOptions.companyName) {
		this.header.companyName.value = userOptions.companyName.toString().slice(0, this.header.companyName.width); 
	}
	
	if(userOptions.companyEntryDescription) {
		this.header.companyEntryDescription.value = userOptions.companyEntryDescription.toString().slice(0, this.header.companyEntryDescription.width);
	}
	
	if(userOptions.companyDescriptiveDate) {
		this.header.companyDescriptiveDate.value = userOptions.companyDescriptiveDate.toString().slice(0, this.header.companyDescriptiveDate.width);
	}
	
	if(userOptions.effectiveEntryDate) {
		this.header.effectiveEntryDate.value = userOptions.effectiveEntryDate.yymmdd();
	}
	
	if(userOptions.originatingDFI) {
		this.header.originatingDFI.value = userOptions.originatingDFI.toString().slice(0, this.header.originatingDFI.width);
	}

	// Configure high-level overrides (these override the low-level settings if provided)
	utils.overrideLowLevel('header', highLevelHeaderOverrides, userOptions, this);
	utils.overrideLowLevel('control', highLevelControlOverrides, userOptions, this);


	// Set control values which use the same header values
	this.control.serviceClassCode.value = this.header.serviceClassCode.value;
	this.control.companyIdentification.value = this.header.companyIdentification.value;
	this.control.originatingDFI.value = this.header.originatingDFI.value;

	// Perform validation on all the passed values
	this._validate();
}

// Inherit all of EventEmmitter's prototype on Batch
util.inherits(Batch, EventEmitter);

Batch.prototype.addEntry = function(entry) {
		// Increment the addendaCount of the batch
		++this.control.addendaCount.value;
		this.emit('_entry:added');

		// Add the new entry to the entries array
		this.entries.push(entry);
		
		// Cache the most recent output in this.output
		this.generateString(function(output){
			this.output = output;
		});
}

// Batch.prototype.addEntry = function(entry) {
// 	// Increment the addendaCount of the batch
// 	++this.control.addendaCount.value;
// 	this.emit('_entry:added');
// 	// Add the new entry to the entries array
// 	this._entries.push(entry);
	
// 	// Cache the most recent output in this.output
// //****This needs to be furthered addressed as some fields are only updated after being added to a file (batchNumber for example)
// 	this.output = this.generateBatch();
// }


Batch.prototype.generateHeader = function(cb) {
		utils.generateString(this.header, function(string) {
			cb(string);
		});
}

Batch.prototype.generateControl = function(cb) {
	var entryHash = 0
		, totalDebit = 0
		, totalCredit = 0;
	
	_.forEach(this._entries, function(entry) {
			entryHash += Number(entry.fields.receivingDFI.value);
//**** Should add handling for all transactions codes (22, 23, 24, 27, 28, 29, 32, 33, 34, 37, 38 & 39)
		if(entry.fields.transactionCode.value === '22' || entry.fields.transactionCode.value === '32') {
			totalCredit += Number(entry.fields.amount.value);
		} else if(entry.fields.transactionCode.value === '27' || entry.fields.transactionCode.value === '37') {
			totalDebit += Number(entry.fields.amount.value);
		} else {
			console.log('transaction codes did not match');
		}
	});
	
	this.control.totalCredit.value = totalCredit.toString().slice(0, 10);
	this.control.totalDebit.value = totalDebit.toString().slice(0, 10);
	
	// Add up the positions 4-11 and compute the total
	this.control.entryHash.value = entryHash.toString().slice(0, 10);

	utils.generateString(this.control, function(string) {
		cb(string);
	});
}

Batch.prototype.generateEntries = function(cb) {
		var result = '';

		async.each(this.entries, function(entry, done) {
			entry.generateString(function(string) {
				result += string + utils.newLineChar();
				done();
				});
			}, function(err) {
				cb(result);
		});
}

Batch.prototype.generateString = function(cb) {
		var self = this;

		self.generateHeader(function(headerString){
			self.generateEntries(function(entryString){
				self.generateControl(function(controlString){
					cb(headerString + utils.newLineChar() + entryString  + controlString);
				});
			});
		});
}

Batch.prototype._validate = function() {

	// Validate required fields have been passed
	validate.validateRequiredFields(this.header);

	// Validate the batch's ACH service class code
	validate.validateACHServiceClassCode(this.header.serviceClassCode.value);

	// Validate field lengths
	validate.validateLengths(this.header);

	// Validate datatypes
	validate.validateDataTypes(this.header);

	// Validate required fields have been passed
	validate.validateRequiredFields(this.control);
	
	// Validate field lengths
	validate.validateLengths(this.control);
	
	// Validate datatypes
	validate.validateDataTypes(this.control);
}

Batch.prototype.get = function(field) {
	
	// If the header has it, return that (header takes priority)
	if(this.header[field]) {
		return this.header[field]['value'];
	}
	
	if(this.control[field]) {
		return this.control[field]['value'];
	}
}

Batch.prototype.set = function(field, value) {

	// If the header has the field, set the value
	if(this.header[field]) {
		this.header[field]['value'] = value;
	}

	// If the control has the field, set the value
	if(this.control[field]) {
		this.control[field]['value'] = value;
	}
}

module.exports = Batch;