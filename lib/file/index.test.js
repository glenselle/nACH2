const File = require('./index');
const Batch = require('../batch');
const Entry = require('../entry');
const EntryAddenda = require('../entry-addenda');

describe.only('File integration', () => {
  it('creates a File with no options, adds a single batch, and generates the file output (snapshot)', done => {
    const file = new File({
      immediateDestination: '081000032',
      immediateOrigin: '123456789',
      immediateDestinationName: 'Some Bank',
      immediateOriginName: 'Your Company Inc',
      referenceCode: '#A000001',
    });

    const batch = new Batch({
      serviceClassCode: '220',
      originatingDFI: '011000015',
      companyName: 'Test Company',
      companyIdentification: '123456789',
      companyEntryDescription: 'PAYROLL',
      companyDescriptiveDate: '20250812',
      standardEntryClassCode: 'WEB',
      effectiveEntryDate: new Date(2025, 7, 12)
    });

    const entry = new Entry({
      transactionCode: '22',
      receivingDFI: '011000015',
      DFIAccount: '123456789',
      amount: 10000,
      idNumber: 'ID123',
      individualName: 'John Doe',
      discretionaryData: 'A1',
      traceNumber: '000000001'
    });

    const addenda = new EntryAddenda({
      typeCode: '05',
      paymentRelatedInformation: 'Invoice 12345',
      sequenceNumber: 1,
      entryDetailSequenceNumber: '0000001'
    });

    entry.addAddenda(addenda);
    batch.addEntry(entry);
    file.addBatch(batch);

    file.generateFile(result => {
      expect(result).toMatchInlineSnapshot(`
"101 081000032 1234567892508122131A094101Some Bank              Your Company Inc       #A000001
5220Test Company                        123456789 WEBPAYROLL   202508250812   1011000010000000
622011000015123456789        0001000000ID123          John Doe              A11000000001      
705Invoice 12345                                                                   01000000001
82200000020001100001000000000000000001000000123456789                          011000010000000
9000001000001000000010001100001000000000000000001000000                                       
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
`)
      done();
    });
  });
});
