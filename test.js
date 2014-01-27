var Entry = require('./lib/entry');

var test = new Entry({
	receivingDFI: '081000210',
	DFIAccount: '12345678901234567',
	amount: '3521',
	idNumber: 'RA8872D4H12jf31',
	individualName: 'Glen!"#$%&()*+,-./:;<>=?@[]\ ^_`{}|~Selle',
	discretionaryData: 'A1',
	addendaId: '1'
});

console.log(test);

// transactionCode
// receivingDFI
// DFIAccount
// amount
// idNumber
// individualName
// discretionaryData
// addendaId