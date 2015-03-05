var assert = require('assert')
  , Entry  = require('../lib/entry')
  , Batch  = require('../lib/batch')
  , File   = require('../lib/file');

describe('Entry', function(){
  describe('Create Entry', function(){
    it('should create an entry successfully', function(){
      	var entry = new Entry({
    			receivingDFI: '081000210',
    			DFIAccount: '12345678901234567',
    			amount: '3521',
          transactionCode: '22',
    			idNumber: 'RAj##23920rjf31',
    			individualName: 'Glen Selle',
    			discretionaryData: 'A1'
    		});
    });
  });
});