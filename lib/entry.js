// Entries

var utils    = require('./utils')
  , validate = require('./validate')
  , _        = require('lodash')
  , Entry
  , options;

Entry = function(userOptions) {

	this.fields = {

		recordTypeCode: {
			name: 'Record Type Code',
			width: 1,
			position: 1,
			required: true,
			type: 'numeric',
			value: '6'
		},

		transactionCode: {
			name: 'Transaction Code',
			width: 2,
			position: 2,
			required: true,
			type: 'numeric'
		},

		receivingDFI: {
			name: 'Receiving DFI Identification',
			width: 8,
			position: 3,
			required: true,
			type: 'numeric'
		},

		checkDigit: {
			name: 'Check Digit',
			width: 1,
			position: 4,
			required: true,
			type: 'numeric'
		},

		DFIAccount: {
			name: 'DFI Account Number',
			width: 17,
			position: 5,
			required: true,
			type: 'alphanumeric'
		},

		amount: {
			name: 'Amount',
			width: 10,
			position: 6,
			required: true,
			type: 'numeric'
		},

		idNumber: {
			name: 'Individual Identification Number',
			width: 15,
			position: 7,
			required: false,
			type: 'alphanumeric'
		},

		individualName: {
			name: 'Individual Name',
			width: 22,
			position: 8,
			required: true,
			type: 'alphanumeric'
		},

		discretionaryData: {
			name: 'Discretionary Data',
			width: 2,
			position: 9,
			required: false,
			type: 'alphanumeric'
		},

		addendaId: {
			name: 'Addenda Record Indicator',
			width: 1,
			position: 10,
			required: true,
			type: 'numeric'
		},

		traceNumber: {
			name: 'Trace Number',
			width: 15,
			position: 11,
			required: false,
			type: 'numeric',
			blank: true,
			value: ''
		}
	}

	// Set our values
	this.fields.transactionCode.value   = userOptions.transactionCode   || '22';
	this.fields.receivingDFI.value      = userOptions.receivingDFI      ? userOptions.receivingDFI.slice(0, -1)                                 : '';
	this.fields.checkDigit.value        = userOptions.receivingDFI      ? userOptions.receivingDFI.slice(-1)                                    : '';
	this.fields.DFIAccount.value        = userOptions.DFIAccount        ? userOptions.DFIAccount.slice(0, this.fields.DFIAccount.width)         : '';
	this.fields.amount.value            = userOptions.amount            ? userOptions.amount                                                    : '';
	this.fields.idNumber.value          = userOptions.idNumber          ? userOptions.idNumber                                                  : '';
	this.fields.individualName.value    = userOptions.individualName    ? userOptions.individualName.slice(0, this.fields.individualName.width) : '';
	this.fields.discretionaryData.value = userOptions.discretionaryData ? userOptions.discretionaryData                                         : '';
	this.fields.addendaId.value         = userOptions.addendaId         || '0';

	// Validate required fields have been passed
	validate.validateRequiredFields(this.fields);

	// Validate the fields's ACH transaction code
	validate.validateACHCode(this.fields.transactionCode.value);

	// Validate the routing number (ABA)
	validate.validateRoutingNumber(this.fields.receivingDFI.value + this.fields.checkDigit.value);

	// Validate field lengths
	validate.validateLengths(this.fields);

	// Validate datatypes
	validate.validateDataTypes(this.fields);
		 
	// At this point, everything should be valid. Now we create a string (with padding) that should represent the ACH "row"
	this.result = utils.generateString(this.fields);

//**** Remove when finished developing
	console.log(this.result);

	return this;
}

module.exports = Entry;