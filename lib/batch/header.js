module.exports = {
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
		type: 'numeric',
		value: ''
	},

	companyName: {
		name: 'Company Name',
		width: 16,
		position: 3,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	companyDiscretionaryData: {
		name: 'Company Discretionary Data',
		width: 20,
		position: 4,
		required: false,
		type: 'alphanumeric',
		blank: true,
		value: ''
	},

	companyIdentification: {
		name: 'Company Identification',
		width: 10,
		position: 5,
		required: true,
		type: 'numeric',
		value: ''
	},

	standardEntryClassCode: {
		name: 'Standard Entry Class Code',
		width: 3,
		position: 6,
		required: true,
		type: 'alpha',
		value: ''
	},

	companyEntryDescription: {
		name: 'Company Entry Description',
		width: 10,
		position: 7,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	companyDescriptiveDate: {
		name: 'Company Descriptive Date',
		width: 6,
		position: 8,
		required: false,
		type: 'alphanumeric',
		value: ''
	},

	effectiveEntryDate: {
		name: 'Effective Entry Date',
		width: 6,
		position: 9,
		required: true,
		type: 'numeric',
		value: ''
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
		type: 'numeric',
		value: ''
	},

	batchNumber: {
		name: 'Batch Number',
		width: 7,
		position: 13,
		required: false,
		type: 'numeric',
		value: 0
	}
};