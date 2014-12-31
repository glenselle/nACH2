// NACHA File

var utils    = require('../utils')
  , validate = require('../validate')
  , _        = require('lodash')
  , async    = require('async')
  , util     = require('util')
  , EventEmitter = require('events').EventEmitter
  , File
  , options;

var highLevelOverrides = ['immediateDestination','immediateOrigin','fileCreationDate','fileCreationTime','fileIdModifier','immediateDestinationName','immediateOriginName','referenceCode']

var File = function(options) {
	EventEmitter.call(this);
	this._batches = [];

	this.header = options.header ? _.merge(options.header, require('./header'),_.defaults) : require('./header');
	this.control = options.control ? _.merge(options.header, require('./control'),_.defaults) : require('./control');


	//Configure high-level overrides (these override the low-level settings if provided)
	utils.overrideLowLevel('header', highLevelOverrides, options, this);

	// Validate all values 

	this._validate();

}

//Inherit all of EventEmitter's prototype on Entry
util.inherits(File, EventEmitter);

File.prototype.get = function(field) {
	// If the header has it, return that (header takes priority)
	if(this.header[field]) {
		return this.header[field]['value'];
	}

	if(this.control[field]) {
		return this.control[field]['value'];
	}
}

File.prototype.set = function(field, value) {

	// If the header has the field, set the value
	if(this.header[field]) {
		this.header[field]['value'] = value;
	}

	// If the control has the field, set the value
	if(this.control[field]) {
		this.control[field]['value'] = value;
	}
	
	this.emit('_file:changed');
}

File.prototype._validate = function() {
	// Validate header field lengths
	validate.validateLengths(this.header);

	// Validate header data types
	validate.validateDataTypes(this.header);

	// Validate control field lengths
	validate.validateLengths(this.control);

	// Validate header data types
	validate.validateDataTypes(this.control);
}


File.prototype.addBatch = function(batch) {
	// Increment the addendaCount of the batch
	++this.control.addendaCount.value;
	
	this._batches.push(batch);
}

File.prototype.generatePaddedRows = function(rows, cb) {
	var paddedRows = '';
	
	for(var i = 0; i < rows; i++) {
		paddedRows += utils.newLineChar() + utils.pad('', 94, '9');
	}
		cb(paddedRows);
}

File.prototype.generateBatches = function(done1) {
	var result = ''
		, entryHash = 0
		, totalDebit = 0
		, totalCredit = 0
		, self = this;

	async.each(this._batches, function(batch, done2) {	
		totalDebit += Number(batch.control.totalDebit.value);
		totalCredit += Number(batch.control.totalCredit.value);
		
		async.each(batch.entries, function(entry, done3) {
			entry.fields.traceNumber.value = self.header.immediateDestination.value.slice(0,8) + utils.pad(_.uniqueId(), 7, false, '0');
			entryHash += Number(entry.fields.receivingDFI.value);
			done3();
		}, function(err){
			// Generate the batch after we've added the trace numbers
			 batch.generateString(function(batchString){
				result += batchString + utils.newLineChar();
				done2();
			});
		});
	}, function(err){
		self.control.totalDebit.value = totalDebit;
		self.control.totalCredit.value = totalCredit;
		
		self.control.entryHash.value = entryHash.toString().slice(0,10);
		done1(result);
			// async.each(this._batches, function(batch, done) {
			// 	batch.generateString(function(string) {
			// 		result += string + 'utils.newLineChar()';
			// 		done();
			// 		});
			// 	}, function(err) {
			// 		cb(result);
			// });
	});
}
File.prototype.generateHeader = function(cb) {
	utils.generateString(this.header, function(string) {
	cb(string);
	});
}
File.prototype.generateControl = function(cb) {
	utils.generateString(this.control, function(string) {
	cb(string);
	});
}

File.prototype.generateFile = function(cb) {
		var self = this;
		totalRows = 2 + (this._batches.length * 2) + this.control.addendaCount.value;
		paddedRows = utils.getNextMultipleDiff(totalRows, 10);

		self.generateHeader(function(headerString){
			self.generateBatches(function(batchString){
				self.generateControl(function(controlString){
					self.generatePaddedRows(paddedRows, function(paddedString) {
						cb(headerString + utils.newLineChar() + batchString  + controlString + paddedString);
					});
				});
			})
		});
	}


module.exports = File;