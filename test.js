var Entry = require('./lib/entry')
  , Batch = require('./lib/batch')
  , File  = require('./lib/file');
	
var debitFile = new File({
 	type: 'debit',
	immediateDestination: '281074114',
	immediateOrigin: '123456789',
	immediateDestinationName: 'Pulaski Bank',
	immediateOriginName: 'Zipline Labs Inc.',
	referenceCode: '#A000001'
});

var entry = new Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '3521',
	idNumber: 'RAj##23920rjf31',
	individualName: 'Glen Selle',
	discretionaryData: 'A1'
});

var creditLow = new Batch({
	serviceClassCode: '220', // maybe we should allow something along the lines of credit=true as a higher-level api	
	companyName: 'Zipline',
	standardEntryClassCode: 'WEB', // Use PPD to pull funds and WEB to push funds
	companyIdentification: '1234567890',
	companyEntryDescription: 'Zip Transfer',
	companyDescriptiveDate: 'Jan 3',
	effectiveEntryDate: new Date(),
	originatingDFI: '281074114'
});

creditLow.addEntry(entry);

var creditHigh = new Batch({
	serviceClassCode: '220', // maybe we should allow something along the lines of credit=true as a higher-level api	
	companyName: 'Zipline',
	standardEntryClassCode: 'WEB', // Use PPD to pull funds and WEB to push funds
	companyIdentification: '1234567890',
	companyEntryDescription: 'Zip Transfer',
	companyDescriptiveDate: 'Jan 3',
	effectiveEntryDate: new Date(),
	originatingDFI: '281074114'
});

creditHigh.addEntry(entry);
creditHigh.addEntry(entry);

debitFile.addBatch(creditLow);
debitFile.addBatch(creditHigh);

console.log(debitFile.generateFile());