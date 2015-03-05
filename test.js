var nach = require('./index')
var _ = require('lodash');
var utils = require('./lib/utils');
var moment = require('moment');

var fs = require('fs');

var routingNumber = "281073555"; // Pulaski routing number
var companyIdentification = "471934319";
var companyName = "Zipline Labs Inc";
var transactionDiscription = 'Zip Transfer';
	
// Create the file
var achFile = new nach.File({
	immediateDestination: '281073555', // 281074114
	immediateOrigin: '471934319',
	immediateDestinationName: 'Pulaski Bank',
	immediateOriginName: 'Zipline Labs Inc.',
	referenceCode: '#A000001',
});

// Create the entries
var firstCreditTransaction = new nach.Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '35.21',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Glen Selle',
	discretionaryData: 'A1',
	transactionCode: '22'
});

var secondCreditTransaction = new nach.Entry({
	receivingDFI: '081000210',
	DFIAccount: '5654221',
	amount: '23',
	idNumber: 'RAj##32b1kn1bb3',
	individualName: 'Melanie Gibson',
	discretionaryData: 'A1',
	transactionCode: '22'
});

var thirdCreditTransaction = new nach.Entry({
	receivingDFI: '081000210',
	DFIAccount: '5654221',
	amount: '24.99',
	idNumber: 'RAj##32b1kn1bb3',
	individualName: 'Roger Phlaster',
	discretionaryData: 'A1',
	transactionCode: '22'
});

var fourthCreditTransaction = new nach.Entry({
	receivingDFI: '081000210',
	DFIAccount: '5654221',
	amount: '10',
	idNumber: 'RAj##32b1kn1bb3',
	individualName: 'Mark Rather',
	discretionaryData: 'A1',
	transactionCode: '22'
});

var fifthCreditTransaction = new nach.Entry({
	receivingDFI: '081000210',
	DFIAccount: '5654221',
	amount: '175',
	idNumber: 'RAj##32b1kn1bb3',
	individualName: 'Luke Skywalker',
	discretionaryData: 'A1',
	transactionCode: '22'
});

var debitTransaction = new nach.Entry({
	receivingDFI: '101000019',
	DFIAccount: '923698412584',
	amount: '150.00',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Tom Horner',
	discretionaryData: 'A1',
	transactionCode: '27'
});

// Create the batches
var creditLow = new nach.Batch({
	serviceClassCode: '220',
	companyName: companyName,
	standardEntryClassCode: 'WEB',
	companyIdentification: companyIdentification,
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: moment(utils.computeBusinessDay(1)).format('MMM D'),
	effectiveEntryDate: utils.computeBusinessDay(1),
	originatingDFI: routingNumber 
});
creditLow.addEntry(firstCreditTransaction);
creditLow.addEntry(secondCreditTransaction);
creditLow.addEntry(thirdCreditTransaction);
creditLow.addEntry(fourthCreditTransaction);

var creditHigh = new nach.Batch({
	serviceClassCode: '220',
	companyName: companyName,
	standardEntryClassCode: 'WEB',
	companyIdentification: companyIdentification, 
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: moment(utils.computeBusinessDay(8)).format('MMM D'),
	effectiveEntryDate: utils.computeBusinessDay(8),
	originatingDFI: routingNumber
});
creditHigh.addEntry(fifthCreditTransaction);

var allDebits = new nach.Batch({
	serviceClassCode: '225',
	companyName: companyName,
	standardEntryClassCode: 'PPD',
	companyIdentification: companyIdentification,
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: moment(utils.computeBusinessDay(2)).format('MMM D'),
	effectiveEntryDate: utils.computeBusinessDay(2),
	originatingDFI: routingNumber
});
allDebits.addEntry(debitTransaction);

// Add the batches to the file
achFile.addBatch(creditLow);
achFile.addBatch(creditHigh);
achFile.addBatch(allDebits);

achFile.generateFile(function(fileString){
	fs.writeFile('NACHA.txt', fileString, function(err) {
		if(err) console.log(err);
		console.log(fileString);
	})
});