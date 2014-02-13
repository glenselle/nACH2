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
			required: true,
			type: 'numeric',
			value: '5'
		},

		serviceClassCode: {
			name: 'Service Class Code',
			width: 3,
			position: 2,
			required: true,
			type: 'numeric'
		},

		companyName: {
			name: 'Company Name',
			width: 16,
			position: 3,
			required: true,
			type: 'alphanumeric'
		},

		companyDiscretionaryData: {
			name: 'Company Discretionary Data',
			width: 20,
			position: 4,
			required: false,
			type: 'alphanumeric',
			blank: true
		},

		companyIdentification: {
			name: 'Company Identification',
			width: 10,
			position: 5,
			required: true,
			type: 'numeric'
		},

		standardEntryClassCode: {
			name: 'Standard Entry Class Code',
			width: 3,
			position: 6,
			required: true,
			type: 'alpha',
			value: 'PPD'
		},

		companyEntryDescription: {
			name: 'Company Entry Description',
			width: 10,
			position: 7,
			required: true,
			type: 'alphanumeric'
		},

		companyDescriptiveDate: {
			name: 'Company Descriptive Date',
			width: 6,
			position: 8,
			required: false,
			type: 'alphanumeric'
		},

		effectiveEntryDate: {
			name: 'Effective Entry Date',
			width: 6,
			position: 9,
			required: true,
			type: 'numberic'
		},

		settlementDate: {
			name: 'Settlement Date',
			width: 3,
			position: 10,
			required: false,
			type: 'numeric',
			blank: true,
			value: ''
		},

		originatorStatusCode: {
			name: 'Originator Status Code',
			width: 1,
			position: 11,
			required: true,
			type: 'numeric',
			value: '1'
		},

		originatingDFI: {
			name: 'Originating DFI',
			width: 8,
			position: 12,
			required: true,
			type: 'numeric'
		},

		batchNumber: {
			name: 'Batch Number',
			width: 7,
			position: 13,
			required: false,
			type: 'numeric',
			value: '',
			blank: true
		}
	}

	this.control = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			required: true,
			type: 'numeric',
			value: '8'
		},

		serviceClassCode: {
			name: 'Service Class Code',
			width: 3,
			position: 2,
			required: true,
			type: 'numeric'
		},

		addendaCount: {
			name: 'Addenda Count',
			width: 6,
			position: 3,
			required: true,
			type: 'numeric'
		},

		entryHash: {
			name: 'Entry Hash',
			width: 10,
			position: 4,
			required: true,
			type: 'numeric'
		},

		totalDebit: {
			name: 'Total Debit Entry Dollar Amount',
			width: 12,
			position: 5,
			required: true,
			type: 'numeric'
		},

		totalCredit: {
			name: 'Total Credit Entry Dollar Amount',
			width: 12,
			position: 6,
			required: true,
			type: 'numeric'
		},

		companyIdentification: {
			name: 'Company Identification',
			width: 10,
			position: 7,
			required: true,
			type: 'numeric'
		},

		messageAuthenticationCode: {
			name: 'Message Authentication Code',
			width: 19,
			position: 8,
			required: false,
			type: 'alphanumeric',
			blank: true,
			value: ''
		},

		reserved: {
			name: 'Reserved',
			width: 6,
			position: 9,
			required: false,
			type: 'alphanumeric',
			blank: true,
			value: ''
		},

		originatingDFI: {
			name: 'Originating DFI',
			width: 8,
			position: 10,
			required: true,
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

	// Set our values
	this.header.serviceClassCode.value         = userOptions.serviceClassCode         || '200';
	this.header.companyName.value              = userOptions.companyName              ? userOptions.companyName.slice(0, this.header.companyName.width)                           : '';
	this.header.companyDiscretionaryData.value = userOptions.companyDiscretionaryData ? userOptions.companyDiscretionaryData                                                      : '';
	this.header.companyIdentification.value    = userOptions.companyIdentification    ? userOptions.companyIdentification                                                         : '';
	//this.header.standardEntryClassCode.value   = userOptions.standardEntryClassCode   ? userOptions.standardEntryClassCode                                                        : '';
	this.header.companyEntryDescription.value  = userOptions.companyEntryDescription  ? userOptions.companyEntryDescription.slice(0, this.header.companyEntryDescription.width)   : '';
	this.header.companyDescriptiveDate.value   = userOptions.companyDescriptiveDate   ? userOptions.companyDescriptiveDate.slice(0, this.header.companyDescriptiveDate.width)     : '';
	this.header.effectiveEntryDate.value       = userOptions.effectiveEntryDate       ? userOptions.effectiveEntryDate.yymmdd()                                                   : '';
	this.header.originatingDFI.value           = userOptions.originatingDFI           ? userOptions.originatingDFI.slice(0, this.header.originatingDFI.width)                     : '';

	// Validate required fields have been passed
	validate.validateRequiredFields(this.header);

	// Validate the batch's ACH service class code
	validate.validateACHServiceClassCode(this.header.serviceClassCode.value);

//**** Determine how to handle 8-digit and 9-digit routing numbers
	// Validate the routing number (ABA)
	//validate.validateRoutingNumber(this.header.originatingDFI.value);

	// Validate field lengths
	validate.validateLengths(this.header);

	// Validate datatypes
	validate.validateDataTypes(this.header);

	return this;
}

Batch.prototype = {
	addEntry: function(entry) {
		this.entries.push(entry);
	},
	generateHeader: function() {
		return utils.generateString(this.header);
	},
	generateControl: function() {
		return utils.generateString(this.control);
	},
	generateEntries: function() {
		var result = '';

		_.forEach(this.entries, function(entry) {
			result += entry.generateString() + '\n';
		});

		return result;
	},
	generateBatch: function() {
		return this.generateHeader() + '\n' + this.generateEntries();// + '\n' + this.generateControl();
	}
}

module.exports = Batch;