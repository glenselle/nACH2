var Entry = require('./lib/entry')
  , Batch = require('./lib/batch')
  , File  = require('./lib/file');

// var debitFile = new File({
// 	type: 'debit'
// });

var creditLow = new Batch({
	serviceClassCode: '220', // maybe we should allow something along the lines of credit=true as a higher-level api	
	companyName: 'Zipline',
	companyIdentification: '1234567890',
	companyEntryDescription: 'Zip Transfer',
	companyDescriptiveDate: 'Jan 3',
	effectiveEntryDate: new Date(),
	originatingDFI: '281074114'
});

var entry = new Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '3521',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Glen Selle',
	discretionaryData: 'A1'
});

creditLow.addEntry(entry);
creditLow.addEntry(entry);

console.log(creditLow.generateBatch());