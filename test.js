var Entry = require('./lib/entry')
  , Batch = require('./lib/batch')
  , File  = require('./lib/file')
  , _     = require('lodash');
var utils    = require('./lib/utils');

var fs = require('fs');

var routingNumber = "281073555";// Pulaski routing number
var companyIdentification = "983597258";
var companyName = "Zipline Labs Inc";
var transactionDiscription = 'Zip Transfer';
	
var achFile = new File({
	immediateDestination: '281074114',
	immediateOrigin: '123456789',
	immediateDestinationName: 'Pulaski Bank',
	immediateOriginName: 'Zipline Labs Inc.',
	referenceCode: '#A000001',
});

var creditTransaction = new Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '35.21',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Glen Selle',
	discretionaryData: 'A1',
	transactionCode:'22'
});

var debitTransaction = new Entry({
	receivingDFI: '101000019',
	DFIAccount: '923698412584',
	amount: '35.21',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Tom Horner',
	discretionaryData: 'A1',
	transactionCode:'27'
});


var creditLow = new Batch({
	serviceClassCode: '220',
	companyName: companyName,
	standardEntryClassCode: 'WEB',
	companyIdentification: companyIdentification,
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: utils.computeBusinessDay(0).format('MMM D'),
	effectiveEntryDate: new Date(utils.computeBusinessDay(0).format()),
	originatingDFI: routingNumber 
});

creditLow.addEntry(creditTransaction);

var creditHigh = new Batch({
	serviceClassCode: '220',
	companyName: companyName,
	standardEntryClassCode: 'WEB',
	companyIdentification: companyIdentification, 
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: utils.computeBusinessDay(3).format('MMM D'),
	effectiveEntryDate: new Date(utils.computeBusinessDay(3).format()),
	originatingDFI: routingNumber 
});

var debit = new Batch({
	serviceClassCode: '225',
	companyName: companyName,
	standardEntryClassCode: 'PPD',
	companyIdentification: companyIdentification,
	companyEntryDescription: transactionDiscription,
	companyDescriptiveDate: utils.computeBusinessDay(0).format('MMM D'),
	effectiveEntryDate: new Date(utils.computeBusinessDay(0).format()),
	originatingDFI: routingNumber 
});

creditLow.addEntry(creditTransaction);
creditHigh.addEntry(creditTransaction);
debit.addEntry(debitTransaction);

achFile.addBatch(creditLow);
achFile.addBatch(creditHigh);
achFile.addBatch(debit);

achFile.generateFile(function(fileString){
	fs.writeFile('NACHA.txt', fileString, function(err) {
		if(err) console.log(err);
		console.log(fileString);
	})
});