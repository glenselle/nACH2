var utils = require('../utils');

module.exports = {
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
		type: 'ABA',
		paddingChar: ' ',
		value: ''
	},

	immediateOrigin: {
		name: 'Immediate Origin',
		width: 10,
		position: 4,
		required: true,
		type: 'numeric',
		paddingChar: ' ',
		value: ''
	},

	fileCreationDate: {
		name: 'File Creation Date',
		width: 6,
		position: 5,
		required: true,
		type: 'numeric',
		value: utils.formatDate(new Date())
	},

	fileCreationTime: {
		name: 'File Creation Time',
		width: 4,
		position: 6,
		required: true,
		type: 'numeric',
		value: utils.formatTime(new Date())
	},

	fileIdModifier: {
		name: 'File Modifier',
		width: 1,
		position: 7,
		required: true,
		type: 'alphanumeric',
		value: 'A'
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
		type: 'numeric',
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
		type: 'alphanumeric',
		value: ''
	},

	immediateOriginName: {
		name: 'Immediate Origin Name',
		width: 23,
		position: 12,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	referenceCode: {
		name: 'Reference Code',
		width: 8,
		position: 13,
		required: true,
		type: 'alphanumeric',
		value: ''
	}
};