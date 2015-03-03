module.exports = {
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
		type: 'numeric',
		value: ''
	},

	checkDigit: {
		name: 'Check Digit',
		width: 1,
		position: 4,
		required: true,
		type: 'numeric',
		value: ''
	},

	DFIAccount: {
		name: 'DFI Account Number',
		width: 17,
		position: 5,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	amount: {
		name: 'Amount',
		width: 10,
		position: 6,
		required: true,
		type: 'numeric',
		value:'',
		number: true
	},

	idNumber: {
		name: 'Individual Identification Number',
		width: 15,
		position: 7,
		required: false,
		type: 'alphanumeric',
		value: ''
	},

	individualName: {
		name: 'Individual Name',
		width: 22,
		position: 8,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	discretionaryData: {
		name: 'Discretionary Data',
		width: 2,
		position: 9,
		required: false,
		type: 'alphanumeric',
		value: '',
	},

	addendaId: {
		name: 'Addenda Record Indicator',
		width: 1,
		position: 10,
		required: true,
		type: 'numeric',
		value: '0'
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
};