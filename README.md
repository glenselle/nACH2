# nACH2

[![npm](https://img.shields.io/npm/v/nach2.svg?maxAge=2592000)](https://www.npmjs.com/package/nach2)
[![Travis](https://img.shields.io/travis/glenselle/nACH.svg?maxAge=2592000)](https://travis-ci.org/glenselle/nACH)
[![Dependencies](https://david-dm.org/zipline/nACH.svg)](https://david-dm.org/zipline/nACH)

nACH is a Node.js module exposing both a high & low-level API for generating ACH (Automated Clearing House) files for use within the ACH network. It's design makes it a high-performance, dependable and frustration-free solution for developers.

 Note: nACH does not bundle a bank agreement/partnership to upload ACH files to the network :)

## Getting Started
To intall nACH, use NPM:

    $ npm install nach

Then include the NPM module like so:

```js
var nach = require('nach');
```

Now you're ready to start creating ACH files.

## ACH File Basics
nACH implements the ACH file specification.

Each ACH file is a flat text file (.txt) which contains records and entries. Within both records and entries, are "columns" called fields. To get a sense for what an ACH file actually looks like, check out the example below:

    101 081000032 0180362811503042207A094101Some Bank              Your Company Inc       #A000001
    5220Your Company Inc                    0018036281WEBTrnsNicknaMar 5 150305   1081000030000000
    622081000210123456789012345670000003521RAj##23920rjf31John Doe              A10081000030000000
    6220810002105654221          0000002300RAj##32b1kn1bb3Bob Dole              A10081000030000001
    6220810002105654221          0000002499RAj##765kn4    Adam Something        A10081000030000002
    6220810002105654221          0000001000RAj##3j43kj4   James Bond            A10081000030000003
    822000000400324000840000000000000000000093200018036281                         081000030000000
    5220Your Company Inc                    0018036281WEBTrnsNicknaMar 16150316   1081000030000001
    6220810002105654221          0000017500RAj##8k765j4k32Luke Skywalker        A10081000030000004
    822000000100081000210000000000000000000175000018036281                         081000030000001
    5225Your Company Inc                    0018036281PPDTrnsNicknaMar 6 150306   1081000030000002
    627101000019923698412584     0000015000RAj##765432hj  Jane Doe              A10081000030000005
    822500000100101000010000000150000000000000000018036281                         081000030000002
    9000003000002000000060050600106000000015000000000026820                                       
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999

Each line in an ACH file is always 94 bytes (or 94 characters) long, and the number of lines in an ACH file is required to *always* be a multiple of 10. This means, if a file doesn't contain enough rows of data to be a multiple of 10, the ACH specification requires you to fill in the remainder of the file with rows of 9s until the number of rows is a multiple of 10. Of course, nACH will handle all of this for you, but it's aways good to know why it's doing it.

## File Anatomy
Let's delve a little deeper into the anatomy of an ACH file. ACH files were originally created when punch-card computers were the "rave", so don't consider ACH files cutting-edge technology. They aren't. But they do provide a means by which to move money from one bank account to another--the entire purpose of the ACH network. As aforementioned, each ACH file has several sections known as "records". These are as follows:

    File header
      First batch header
        First detail record
        ...
        Last detail record
      First batch control
      Second batch header
        First detail record
        ...
        Last detail record
      Second batch control
    File control

As seen above, each file has one file header and one file control (similar to a footer or a closing html bracket). After the file header, the file can contain any number of batches and each batch may contain multiple entry details. While it may seem pointless to use different batches if all the entries could be inserted into one batch, there are various reasons one might choose to divide up entries into different batches. One such reason stems from the fact that only batch headers can specify when the entries within are to be deposited into the respective account. As a result, one might use batch headers to specify different deposit dates for a group of entries.

## Usage

To create a file:

```js
var file = new nach.File({
    immediateDestination: '081000032',
    immediateOrigin: '123456789',
    immediateDestinationName: 'Some Bank',
    immediateOriginName: 'Your Company Inc',
    referenceCode: '#A000001',
});
```

To create a batch

```js
var batch = new nach.Batch({
    serviceClassCode: '220',
    companyName: 'Your Company Inc',
    standardEntryClassCode: 'WEB',
    companyIdentification: '123456789',
    companyEntryDescription: 'Trans Description',
    companyDescriptiveDate: moment(nach.Utils.computeBusinessDay(8)).format('MMM D'),
    effectiveEntryDate: nach.Utils.computeBusinessDay(8),
    originatingDFI: '081000032'
});
```

To create an entry

```js
var entry = new nach.Entry({
    receivingDFI: '081000210',
    DFIAccount: '5654221',
    amount: '175',
    idNumber: 'RAj##32b1kn1bb3',
    individualName: 'Luke Skywalker',
    discretionaryData: 'A1',
    transactionCode: '22'
});
```

To add one or more optional addenda records to an entry

```js
var addenda = new nach.EntryAddenda({
    paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx"
});
entry.addAdenda(addenda);
```

Entries are added to batches like so

```js
batch.addEntry(entry);
```

And batches are added to files much the same way

```js
file.addBatch(batch);
```

Finally to generate the file & write it to a text file

```js
// Generate the file (result is a string with the file contents)
file.generateFile(function(result) {

    // Write result to a NACHA.txt file
    fs.writeFile('NACHA.txt', result, function(err) {
        if(err) console.log(err);

        // Log the output
        console.log(fileString);
    });
});
```

## Tests
Test coverage is currently a work in progress. To run:

    $ npm test

## License

The MIT License (MIT)

Copyright (c) 2016 Glen Selle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
