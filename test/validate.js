var chai     = require('chai')
  , expect   = chai.expect
  , validate = require('../lib/validate');

describe('Validate', function(){
    describe('Required Fields', function(){
        it('required fields cannot be left blank', function(){
            var testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 6,
                    position: 9,
                    required: true,
                    type: 'alphanumeric',
                    value: ''
                }
            };

            // The test should fail since the field is required but the value is '' (empty string)
            expect(function () { validate.validateRequiredFields(testObjectOne) }).to.throw('fieldOne is a required field but its value is empty.');

            // Change the value to a valid alphanumeric string
            testObjectOne.fieldOne.value = 'some value';

            // Test to make sure it now passes validation
            expect(function () { validate.validateRequiredFields(testObjectOne) }).to.not.throw(Error);
        });
    });
});


// fieldTwo: {
//     name: 'fieldTwo',
//     width: 10,
//     position: 7,
//     required: true,
//     type: 'numeric'
// }