// File

var _ = require('lodash');
var async = require('async');
var utils = require('../utils');
var validate = require('../validate');
var highLevelOverrides = ['immediateDestination','immediateOrigin','fileCreationDate','fileCreationTime','fileIdModifier','immediateDestinationName','immediateOriginName','referenceCode'];

function File(options) {
	this._batches = [];

	// Allow the batch header/control defaults to be overriden if provided
	this.header = options.header ? _.merge(options.header, require('./header'), _.defaults) : _.cloneDeep(require('./header'));
	this.control = options.control ? _.merge(options.header, require('./control'), _.defaults) : _.cloneDeep(require('./control'));

	// Configure high-level overrides (these override the low-level settings if provided)
	utils.overrideLowLevel(highLevelOverrides, options, this);
    
    // This is done to make sure we have a 9-digit routing number
    if(options.immediateDestination) {
        this.header.immediateDestination.value = utils.computeCheckDigit(options.immediateDestination);
    }

	this._batchSequenceNumber = Number(options.batchSequenceNumber) || 0

	// Validate all values
	this._validate();
	
	return this;
};

File.prototype.get = function(field) {
	
	// If the header has the field, return the value
	if(this.header[field]) {
		return this.header[field]['value'];
	}

	// If the control has the field, return the value
	if(this.control[field]) {
		return this.control[field]['value'];
	}
};

File.prototype.set = function(field, value) {

	// If the header has the field, set the value
	if(this.header[field]) {
		this.header[field]['value'] = value;
	}

	// If the control has the field, set the value
	if(this.control[field]) {
		this.control[field]['value'] = value;
	}	
};

File.prototype._validate = function() {
	
	// Validate header field lengths
	validate.validateLengths(this.header);

	// Validate header data types
	validate.validateDataTypes(this.header);

	// Validate control field lengths
	validate.validateLengths(this.control);

	// Validate header data types
	validate.validateDataTypes(this.control);
};

File.prototype.addBatch = function(batch) {
	
	// Set the batch number on the header and control records
	batch.header.batchNumber.value = this._batchSequenceNumber
	batch.control.batchNumber.value = this._batchSequenceNumber

	// Increment the batchSequenceNumber
	++this._batchSequenceNumber

	this._batches.push(batch);
};

File.prototype.generatePaddedRows = function(rows, cb) {
	var paddedRows = '';
	
	for(var i = 0; i < rows; i++) {
		paddedRows += utils.newLineChar() + utils.pad('', 94, '9');
	}
	
	// Return control flow back by calling the callback function
	cb(paddedRows);
}

File.prototype.generateBatches = function(done1) {
    var self = this;
    
	var result = '';
    var rows = 2;
    
	var entryHash = 0;
	var addendaCount = 0;
    
	var totalDebit = 0;
	var totalCredit = 0;

	async.each(this._batches, function(batch, done2) {	
		totalDebit += batch.control.totalDebit.value;
		totalCredit += batch.control.totalCredit.value;
        
		async.each(batch._entries, function(entry, done3) {
			entry.fields.traceNumber.value = ( entry.fields.traceNumber.value) ?  entry.fields.traceNumber.value : self.header.immediateOrigin.value.slice(0,8) + utils.pad(addendaCount, 7, false, '0');
			entryHash += Number(entry.fields.receivingDFI.value);
            
            // Increment the addenda and block count
			addendaCount++;
            rows++;
            
			done3();
		}, function(err){

            // Only iterate and generate the batch if there is at least one entry in the batch
            if(batch._entries.length > 0) {

            	// Increment the addendaCount of the batch
            	self.control.batchCount.value++;
            
                // Bump the number of rows only for batches with at least one entry
                rows = rows + 2;
                
    			// Generate the batch after we've added the trace numbers
    			batch.generateString(function(batchString){
    				result += batchString + utils.newLineChar();
    				done2();
    			});
            } else {
                done2();
            }
		});
	}, function(err){
		self.control.totalDebit.value = totalDebit;
		self.control.totalCredit.value = totalCredit;

		self.control.addendaCount.value = addendaCount;
        self.control.blockCount.value = utils.getNextMultiple(rows, 10) / 10;

		// Slice the 10 rightmost digits.
		self.control.entryHash.value = entryHash.toString().slice(-10);

        // Pass the result string as well as the number of rows back
        done1(result, rows);
	});
};

File.prototype.generateHeader = function(cb) {
	utils.generateString(this.header, function(string) {
		cb(string);
	});
};

File.prototype.generateControl = function(cb) {
	utils.generateString(this.control, function(string) {
		cb(string);
	});
};

File.prototype.generateFile = function(cb) {
	var self = this;

	self.generateHeader(function(headerString) {
		self.generateBatches(function(batchString, rows) {
			self.generateControl(function(controlString) {

                // These must be within this callback otherwise rows won't be calculated yet
            	var paddedRows = utils.getNextMultipleDiff(rows, 10);

				self.generatePaddedRows(paddedRows, function(paddedString) {
					cb(headerString + utils.newLineChar() + batchString  + controlString + paddedString);
				});
			});
		})
	});
};

module.exports = File;