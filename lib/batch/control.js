module.exports = {
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
		type: 'numeric',
		value: ''
	},

	addendaCount: {
		name: 'Addenda Count',
		width: 6,
		position: 3,
		required: true,
		type: 'numeric',
		value: 0
	},

	entryHash: {
		name: 'Entry Hash',
		width: 10,
		position: 4,
		required: true,
		type: 'numeric',
		value: 0
	},

	totalDebit: {
		name: 'Total Debit Entry Dollar Amount',
		width: 12,
		position: 5,
		required: true,
		type: 'numeric',
		value: 0,
		number: true
	},

	totalCredit: {
		name: 'Total Credit Entry Dollar Amount',
		width: 12,
		position: 6,
		required: true,
		type: 'numeric',
		value: 0,
		number: true
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
		required: false,
		type: 'numeric',
		value: 8
	}
};