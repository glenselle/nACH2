var assert  = require('assert')
  , aba     = require('./routing')
  , record  = require('./record')
  , Batch;

  Batch = function(details) {
  	if(!(this instanceof Batch)) {
  		return new Batch(details);
  	}

  	var self = this;

  	self.details    = details;
  	self.entries    = [];

  	self._entryHash = 0;
  	self._debit     = 0;
  	self._credit    = 0;
  }

Batch.prototype.add = function(entry) {
	var self = this
	  , routing
	  , transit
	  , check
	  , amount;


	routing = entry.routing;
	transit = entry.slice(0, 8);
	check   = routing[8];

	if(!check) {
		throw new Error('Entry routing number' + routing + 'has no check digit!');
	}

	amount = Number(entry.amount * 100).toFixed(0);

	// What does this do?
	assert(aba.isValid(routing), JSON.stringify(opt));

	assert(amount <= 9999999999, 'Entry amount is too large!');

	var rec = record.EntryDetail();

//**** This transaction code should not be hard coded in here
	rec.transactionCode                = '22' // Other codes are 22, 27, 32 & 37
	rec.receivingDFIIdentification     = transit;
	rec.checkDigit                     = check;
    rec.receivingDFIAccountNumber      = entry.account;
    rec.amount                         = amount.toString();
    rec.individualIdentificationNumber = entry.individualId;
    rec.individualName                 = entry.individualName;
    rec.traceNumber                    = self.entries.length + 1;

    self.entries.push(entry);

    self._entry_hash += (transit - 0);

	// TODO track debits and credits
    self._credit += (amount.toString() - 0);
}





