// NACHA File

var utils    = require('./utils')
  , validate = require('./validate')
  , _        = require('lodash')
  , File
  , options;

var File = function(userOptions) {

	this.header = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			required: true,
			type: 'numeric',
			value: '1'
		},

		priorityCode: {
			name: 'Priority Code',
			width: 2,
			position: 2,
			required: true,
			type: 'numeric',
			value: '01'
		},

		immediateDestination: {
			name: 'Immediate Destination',
			width: 10,
			position: 3,
			required: true,
			type: 'numeric'
		},

		immediateOrigin: {
			name: 'Immediate Origin',
			width: 10,
			position: 4,
			required: true,
			type: 'numeric'
		},

		fileCreationDate: {
			name: 'File Creation Date',
			width: 6,
			position: 5,
			required: true,
			type: 'numeric'
		},

		fileCreationTime: {
			name: 'File Creation Time',
			width: 4,
			position: 6,
			required: true,
			type: 'numeric'
		},

		fileIdModifier: {
			name: 'File Modifier',
			width: 1,
			position: 7,
			required: true,
			type: 'alphanumeric'
		},

		recordSize: {
			name: 'Record Size',
			width: 3,
			position: 8,
			type: 'numeric',
			required: true,
			value: '094'
		},

		blockingFactor: {
			name: 'Blocking Factor',
			width: 2,
			position: 9,
			type: 'numberic',
			required: true,
			value: '10'
		},

		formatCode: {
			name: 'Format Code',
			width: 1,
			position: 10,
			required: true,
			type: 'numeric',
			value: '1'
		},

		immediateDestinationName: {
			name: 'Immediate Destination Name',
			width: 23,
			position: 11,
			required: true,
			type: 'alphanumeric'
		},

		immediateOriginName: {
			name: 'Immediate Origin Name',
			width: 23,
			position: 12,
			required: true,
			type: 'alphanumeric'
		},

		referenceCode: {
			name: 'Reference Code',
			width: 8,
			position: 13,
			required: true,
			type: 'alphanumeric'
		}
	}

	this.control = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			type: 'numeric',
			value: '9'
		},

		batchCount: {
			name: 'Batch Count',
			width: 6,
			position: 2,
			type: 'numeric'
		},

		blockCount: {
			name: 'Block Count',
			width: 6,
			position: 3,
			type: 'numeric'
		},

		addendaCount: {
			name: 'Addenda Count',
			width: 8,
			position: 4,
			type: 'numeric'
		},

		entryHash: {
			name: 'Entry Hash',
			width: 10,
			position: 5,
			type: 'numeric'
		},

		totalDebit: {
			name: 'Total Debit Entry Dollar Amount in File',
			width: 12,
			position: 6,
			type: 'numeric'
		},

		totalCredit: {
			name: 'Total Credit Entry Dollar Amount in File',
			width: 12,
			position: 7,
			type: 'numeric'
		},

		reserved: {
			name: 'Reserved',
			width: 39,
			position: 8,
			type: 'alphanumeric',
			blank: true,
			value: ''
		}
	}

	this.batches = [];

	// Validate the routing number (ABA)
	validate.validateRoutingNumber(userOptions.immediateDestination);

	// Set our values	
	this.header.immediateDestination.value     = userOptions.immediateDestination     ? userOptions.immediateDestination     : '';
	this.header.immediateOrigin.value          = userOptions.immediateOrigin          ? userOptions.immediateOrigin          : '';
	this.header.fileCreationDate.value         = new Date().yymmdd();
	this.header.fileCreationTime.value         = new Date().hhmm();
	this.header.fileIdModifier.value           = userOptions.fileIdModifier || 'A';
	this.header.immediateDestinationName.value = userOptions.immediateDestinationName ? userOptions.immediateDestinationName : '';
	this.header.immediateOriginName.value      = userOptions.immediateOriginName      ? userOptions.immediateOriginName      : '';
	this.header.referenceCode.value            = userOptions.referenceCode            ? userOptions.referenceCode            : '';
	
	// Validate field lengths
	validate.validateLengths(this.header);

	// Validate datatypes
	validate.validateDataTypes(this.header);
	
	// Set our values
	this.control.batchCount.value   = 0;
	this.control.blockCount.value   = 0;
	this.control.addendaCount.value = 0;
	this.control.entryHash.value    = 0;
	this.control.totalDebit.value   = 0;
	this.control.totalCredit.value  = 0;
	
	// Validate field lengths
	validate.validateLengths(this.control);

	// Validate datatypes
	validate.validateDataTypes(this.control);

	return this;
}

File.prototype = {
	addBatch: function(batch) {
		// Increment the addendaCount of the batch
		++this.control.addendaCount.value;
		
		this.batches.push(batch);
	},
	generateHeader: function() {
		return utils.generateString(this.header);
	},
	generateControl: function() {
		return utils.generateString(this.control);
	},
	generateBatches: function() {
		var result = '';

		_.forEach(this.batches, function(batch) {
			result += batch.output + '\n';
		});

		return result;
	},
	generateFile: function() {
		return this.generateHeader() + '\n' + this.generateBatches()  + this.generateControl();
	}
}

module.exports = File;