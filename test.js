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
	
var debitFile = new File({
 	type: 'debit',
	immediateDestination: '281074114',
	immediateOrigin: '123456789',
	immediateDestinationName: 'Pulaski Bank',
	immediateOriginName: 'Zipline Labs Inc.',
	referenceCode: '#A000001',
	header: {
		recordTypeCode: {
			value: '1'
		}
	}
});

var entry = new Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '3521',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Glen Selle',
	discretionaryData: 'A1',
	transactionCode:'22'
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

creditLow.addEntry(entry);

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

creditHigh.addEntry(entry);
creditHigh.addEntry(entry);

debitFile.addBatch(creditLow);
debitFile.addBatch(creditHigh);

debitFile.generateFile(function(fileString){
	fs.writeFile('NACHA.txt', fileString, function(err) {
		if(err) console.log(err);

		console.log('saved');
	})
	console.log(fileString);
});