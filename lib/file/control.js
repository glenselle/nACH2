module.exports = {
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
		type: 'numeric',
		value: 0
	},

	blockCount: {
		name: 'Block Count',
		width: 6,
		position: 3,
		type: 'numeric',
		value: 0
	},

	addendaCount: {
		name: 'Addenda Count',
		width: 8,
		position: 4,
		type: 'numeric',
		value: 0
	},

	entryHash: {
		name: 'Entry Hash',
		width: 10,
		position: 5,
		type: 'numeric',
		value: 0
	},

	totalDebit: {
		name: 'Total Debit Entry Dollar Amount in File',
		width: 12,
		position: 6,
		type: 'numeric',
		value: 0,
		number: true
	},

	totalCredit: {
		name: 'Total Credit Entry Dollar Amount in File',
		width: 12,
		position: 7,
		type: 'numeric',
		value: 0,
		number: true
	},

	reserved: {
		name: 'Reserved',
		width: 39,
		position: 8,
		type: 'alphanumeric',
		blank: true,
		value: ''
	}
};