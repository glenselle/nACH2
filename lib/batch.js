// Batches

var utils    = require('./utils')
  , validate = require('./validate')
  , _        = require('lodash')
  , Batch
  , options;

Batch = function(userOptions) {

	this.header = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			type: 'numeric',
			value: '5'
		},

		serviceClassCode: {
			name: 'Service Class Code',
			width: 3,
			position: 2,
			type: 'numeric'
		},

		companyName: {
			name: 'Company Name',
			width: 16,
			position: 3,
			type: 'alphanumeric'
		},

		companyDiscretionaryData: {
			name: 'Company Discretionary Data',
			width: 20,
			position: 4,
			type: 'alphanumeric'
		},

		companyIdentification: {
			name: 'Company Identification',
			width: 10,
			position: 5,
			type: 'numeric'
		},

		standardEntryClassCode: {
			name: 'Standard Entry Class Code',
			width: 3,
			position: 6,
			type: 'alpha'
		},

		companyEntryDescription: {
			name: 'Company Entry Description',
			width: 10,
			position: 7,
			type: 'alphanumeric',
			value: ''
		},

		companyDescriptiveDate: {
			name: 'Company Descriptive Date',
			width: 6,
			position: 8,
			type: 'alphanumeric',
			value: ''
		},

		effectiveEntryDate: {
			name: 'Effective Entry Date',
			width: 6,
			position: 9,
			type: 'numberic'
		},

		settlementDate: {
			name: 'Settlement Date',
			width: 3,
			position: 10,
			type: 'numeric',
			blank: true,
			value: ''
		},

		originatorStatusCode: {
			name: 'Originator Status Code',
			width: 1,
			position: 11,
			type: 'numeric',
			value: '1'
		},

		originatingDFI: {
			name: 'Originating DFI',
			width: 8,
			position: 12,
			type: 'numeric'
		},

		batchNumber: {
			name: 'Batch Number',
			width: 7,
			position: 13,
			type: 'numeric'
		}
	}

	this.control = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			type: 'numeric',
			value: '8'
		},

		serviceClassCode: {
			name: 'Service Class Code',
			width: 3,
			position: 2,
			type: 'numeric'
		},

		addendaCount: {
			name: 'Addenda Count',
			width: 6,
			position: 3,
			type: 'numeric'
		},

		entryHash: {
			name: 'Entry Hash',
			width: 10,
			position: 4,
			type: 'numeric'
		},

		totalDebit: {
			name: 'Total Debit Entry Dollar Amount',
			width: 12,
			position: 5,
			type: 'numeric'
		},

		totalCredit: {
			name: 'Total Credit Entry Dollar Amount',
			width: 12,
			position: 6,
			type: 'numeric'
		},

		companyIdentification: {
			name: 'Company Identification',
			width: 10,
			position: 7,
			type: 'numeric'
		},

		messageAuthenticationCode: {
			name: 'Message Authentication Code',
			width: 19,
			position: 8,
			type: 'alphanumeric',
			blank: true,
			value: ''
		},

		reserved: {
			name: 'Reserved',
			width: 6,
			position: 9,
			type: 'alphanumeric',
			blank: true,
			value: ''
		},

		originatingDFI: {
			name: 'Originating DFI',
			width: 8,
			position: 10,
			type: 'numeric'
		},

		batchNumber: {
			name: 'Batch Number',
			width: 7,
			position: 11,
			type: 'numeric'
		}
	}

	this.entries = [];

//**** Set our values
	this.header.serviceClassCode.value         = userOptions.serviceClassCode || '200';
	this.header.companyName.value              = userOptions.companyName.slice(0, this.header.companyName.width);
	this.header.companyDiscretionaryData.value = userOptions.companyDiscretionaryData || '';
	this.header.companyIdentification.value    = userOptions.companyIdentification;
	this.header.standardEntryClassCode.value   = userOptions.standardEntryClassCode;
	this.header.companyEntryDescription.value  = userOptions.companyEntryDescription.slice(0, this.header.companyEntryDescription.width);
	this.header.companyDescriptiveDate.value   = userOptions.companyDescriptiveDate.slice(0, this.header.companyDescriptiveDate.width) || '';
	this.header.effectiveEntryDate.value       = userOptions.effectiveEntryDate.yymmdd();
	this.header.originatingDFI.value           = userOptions.originatingDFI;

	// Validate required fields have been passed
	validate.validateRequiredFields(this.fields);

	// Validate the batch's ACH service class code
	validate.validateACHServiceClassCode(this.header.serviceClassCode.value);

	// Validate the routing number (ABA)
	//validate.validateRoutingNumber(this.header.originatingDFI.value + this.checkDigit.value);

	// Validate field lengths
	//validate.validateLengths([this.transactionCode, this.receivingDFI, this.checkDigit, this.DFIAccount, this.amount, this.idNumber, this.individualName, this.discretionaryData, this.addendaId]);

	// Validate datatypes
	//validate.validateDataTypes([this.transactionCode, this.receivingDFI, this.checkDigit, this.DFIAccount, this.amount, this.idNumber, this.individualName, this.discretionaryData, this.addendaId]);
		 
	// At this point, everything should be valid. Now we create a string (with padding) that should represent the ACH "row"
	this.result = utils.generateString(this.header);
console.log(this.result);
	return this;
}

Batch.prototype = {
	addEntry: function(entry) {
		this.entries.push(entry);
	}
}

module.exports = Batch;