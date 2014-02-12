var Entry = require('./lib/entry')
  , Batch = require('./lib/batch')
  , File  = require('./lib/file');

nacha.configureOirigin({
	name: 'Zipline Inc.',
	routing: '938848123'
});

nacha.banks.pulaski = {
	name: 'Palauski Bank',
	address: '291 Olive Blvd. St. Louis, Missouri',
	routing: '218007422'
}

nacha.banks.liberty = {
	name: 'Liberty Bank',
	address: '81828 Weste Ln. St. Louis, Missouri',
	routing: '929919818'
}

var NachaFile = nacha.newFile('A', nacha.banks.pulaski);

NachaFile.addEntry({
	type: 'debit',
	routing: '281237029',
	number: '237727123',
	amount: '32.89',
	name: 'Glen Selle'
});

