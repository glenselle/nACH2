// NACHA File

var utils    = require('./utils')
  , validate = require('./validate')
  , _        = require('lodash')
  , File
  , options;

File = function(userOptions) {

	this.header = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			type: 'numeric',
			value: '1'
		},

		priorityCode: {
			name: 'Priority Code',
			width: 2,
			position: 2,
			type: 'numeric',
			value: '01'
		},

		immediateDestination: {
			name: 'Immediate Destination',
			width: 10,
			position: 3,
			type: 'numeric'
		},

		immediateOrigin: {
			name: 'Immediate Origin',
			width: 10,
			position: 4,
			type: 'numeric'
		},

		fileCreationDate: {
			name: 'File Creation Date',
			width: 6,
			position: 5,
			type: 'numeric'
		},

		fileCreationTime: {
			name: 'File Creation Time',
			width: 4,
			position: 6,
			type: 'numeric'
		},

		fileIdModifier: {
			name: 'File Modifier',
			width: 1,
			position: 7,
			type: 'alphanumeric'
		},

		recordSize: {
			name: 'Record Size',
			width: 3,
			position: 8,
			type: 'numeric',
			value: '094'
		},

		blockingFactor: {
			name: 'Blocking Factor',
			width: 2,
			position: 9,
			type: 'numberic',
			value: '10'
		},

		formatCode: {
			name: 'Format Code',
			width: 1,
			position: 10,
			type: 'numeric',
			value: '1'
		},

		immediateDestinationName: {
			name: 'Immediate Destination Name',
			width: 23,
			position: 11,
			type: 'alphanumeric'
		},

		immediateOriginName: {
			name: 'Immediate Origin Name',
			width: 23,
			position: 12,
			type: 'alphanumeric'
		},

		referenceCode: {
			name: 'Reference Code',
			width: 8,
			position: 13,
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

//**** Set our values
	this.header.fileCreationDate = new Date().yymmdd;



	this.transactionCode.value   = userOptions.transactionCode || '22';
	this.receivingDFI.value      = userOptions.receivingDFI.slice(0, -1);
	this.checkDigit.value        = userOptions.receivingDFI.slice(-1);
	this.DFIAccount.value        = userOptions.DFIAccount.slice(0, this.DFIAccount.width);
	this.amount.value            = userOptions.amount;
	this.idNumber.value          = userOptions.idNumber;
	this.individualName.value    = userOptions.individualName.slice(0, this.individualName.width);
	this.discretionaryData.value = userOptions.discretionaryData || '';
	this.addendaId.value         = userOptions.addendaId || '0';

	// Validate the entry's ACH transaction code
	validate.validateACHCode(this.transactionCode.value);

	// Validate the routing number (ABA)
	validate.validateRoutingNumber(this.receivingDFI.value + this.checkDigit.value);

	// Validate field lengths
	validate.validateLengths([this.transactionCode, this.receivingDFI, this.checkDigit, this.DFIAccount, this.amount, this.idNumber, this.individualName, this.discretionaryData, this.addendaId]);

	// Validate datatypes
	validate.validateDataTypes([this.transactionCode, this.receivingDFI, this.checkDigit, this.DFIAccount, this.amount, this.idNumber, this.individualName, this.discretionaryData, this.addendaId]);
		 
	// At this point, everything should be valid. Now we create a string (with padding) that should represent the ACH "row"
	this.result = utils.generateString(this);

	return this;
}

module.exports = File;