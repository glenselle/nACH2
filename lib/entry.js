// Entries

var utils    = require('./utils')
  , validate = require('./validate')
  , _        = require('lodash')
  , Entry
  , options;

Entry = function(userOptions) {

	this.recordTypeCode = {
		name: 'Record Type Code',
		width: 1,
		type: 'numeric',
		value: '6'
	}

	this.transactionCode = {
		name: 'Transaction Code',
		width: 2,
		type: 'numeric'
	}

	this.receivingDFI = {
		name: 'Receiving DFI Identification',
		width: 8,
		type: 'numeric'
	}

	this.checkDigit = {
		name: 'Check Digit',
		width: 1,
		type: 'numeric'
	}

	this.DFIAccount = {
		name: 'DFI Account Number',
		width: 17,
		type: 'alphanumeric'
	}

	this.amount = {
		name: 'Amount',
		width: 10,
		type: 'numeric'
	}

	this.idNumber = {
		name: 'Individual Identification Number',
		width: 15,
		type: 'alphanumeric'
	}

	this.individualName = {
		name: 'Individual Name',
		width: 22,
		type: 'alphanumeric'
	}

	this.discretionaryData = {
		name: 'Discretionary Data',
		width: 2,
		type: 'alphanumeric'
	}

	this.addendaId = {
		name: 'Addenda Record Indicator',
		width: 1,
		type: 'numeric'
	}

	this.traceNumber = {
		name: 'Trace Number',
		width: 15,
		type: 'numeric',
		value: ''
	}

	// Set our values
	this.transactionCode.value   = userOptions.transactionCode || '22';
	this.receivingDFI.value      = userOptions.receivingDFI.slice(0, -1);
	this.checkDigit.value        = userOptions.receivingDFI.slice(-1);
	this.DFIAccount.value        = userOptions.DFIAccount.slice(0, this.DFIAccount.width);
	this.amount.value            = userOptions.amount;
	this.idNumber.value          = userOptions.idNumber;
	this.individualName.value    = userOptions.individualName.slice(0, this.individualName.width);
	this.discretionaryData.value = userOptions.discretionaryData || '';
	this.addendaId.value         = userOptions.addendaId || '';

	// Validate the entry's ACH transaction code
	validate.validateACHCode(this.transactionCode.value);

	// Validate the routing number (ABA)
	validate.validateRoutingNumber(this.receivingDFI.value + this.checkDigit.value);

	// Validate field lengths
	validate.validateLengths([this.transactionCode, this.receivingDFI, this.checkDigit, this.DFIAccount, this.amount, this.idNumber, this.individualName, this.discretionaryData, this.addendaId]);

	// Validate datatypes
	validate.validateDataTypes([this.transactionCode, this.receivingDFI, this.checkDigit, this.DFIAccount, this.amount, this.idNumber, this.individualName, this.discretionaryData, this.addendaId]);


	// Check for a valid routing number.
	// if(!utils.isRoutingValid(userOptions.DFINumber)) {
	// 	throw {
	// 	    name: "Validation Error",
	// 	    message: "The routing number was invalid. Please pass a valid 9-digit ABA number."
	// 	};
	// }

	// Routing numbers must always be 9 digits, otherwise they will fail the ABA test.
	// Here we remove the check digit and store both numbers separately.
	// this.DFINumber  = userOptions.DFINumber.slice(0, -1);
	// this.checkDigit = this.DFINumber.slice(-1);

	// Insure the transaction code is a valid ACH transaction code.
	// if(this.transactionCode.value.length !== 2 || !_.contains(ACHCodes, this.transactionCode.value)) {
	// 	throw {
	// 	    name: "ACH Transaction Code Error",
	// 	    message: "The ACH transaction code specified is invalid. Please pass a valid 2-digit transaction code."
	// 	};
	// }

	// Trim account numbers to 17 characters. This in accordance with the ACH spec.
	//this.DFIAccount.slice(0, 17);

	// Pad the amount field and remove any currency symbols/decimals
	//this.amount = utils.pad(this.amount, 10);

	// Names can only be 22 characters. Otherwise, they'll simply be trimmed.
	//this.fullName.slice(0, 22);

	
	return this;
}

Entry.prototype.validate = function() {

}


module.exports = Entry;