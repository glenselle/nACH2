# nACH

nACH is a Node.js module exposing both a high & low-level API for generating ACH (Automated Clearing House) files for use within the ACH network. It's design makes it a high-performance, dependable and frustration-free solution for developers.

 Note: nACH does not bundle a bank agreement/partnership to upload ACH files to the network :) 

## Getting Started
To intall nACH, use NPM:

	npm install nach

Then include the NPM module like so:

	var nach = require('nach');

Now you're ready to start creating ACH files.

## ACH File Basics
nACH implements the ACH file specification. Below is a diagram showing the heiracrchy of an ACHA file.

	Diagram here

Each ACH file is a flat text file (.txt) which contains records and entries. Within both records and entries, are "columns" called fields. To get a sense for what an ACH file actually looks like, check out the example below:

	Diagram here

Each line in an ACH file is always 94 bytes (or 94 characters) long, and the number of lines in an ACH file is required to *always* be a multiple of 10. This means, if a file doesn't contain enough rows of data to be a multiple of 10, the ACH specification requires you to fill in the remainder of the file with rows of 9s until the number of rows is a multiple of 10. Of course, nACH will handle all of this for you, but it's aways good to know why it's doing it.

## File Anatomy
Let's delve a little deeper into the anatomy of an ACH file. ACH files were originally created when punch-card computers were the "rave", so don't consider ACH files cutting-edge technology. They aren't. But they do provide a means by which to move money from one bank account to another--the entire purpose of the ACH network. As aforementioned, each ACH file has several sections known as "records". These are as follows:

File Header
   Batch Header
     Entry Detail
     Entry Detail
     Entry Detail
     ...
   Batch Control
   Batch Header
     Entry Detail
     Entry Detail
     ...
   Batch Control
   ...
File Control

As seen above, each file has one file header and one file control (similar to a footer or a closing html bracket). After the file header, the file can contain any number of batches and each batch may contain multiple entry details. While it may seem pointless to use different batches if all the entries could be inserted into one batch, there are various reasons one might choose to divide up entries into different batches. One such reason stems from the fact that only batch headers can specify when the entries within are to be deposited into the respective account. As a result, one might use batch headers to specify different deposit dates for a group of entries.
