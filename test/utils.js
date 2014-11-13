var chai     = require('chai'),
	expect   = chai.expect,
	moment   = require('moment');

describe('Utils', function(){

	describe('pad', function() {
		it('should add pad', function(){
			var testS = "1991";
			var testW = '0';

			expect(function(){ utils.pad(testS,testW) }).not.to.throw('Padding not adding');
		});
	});
	
	describe('GenerateString', function(){
		it("Test to see if object can be passed", function(){
		var utils = require('./../lib/utils');

		var testObj = {

			testRecord: {
					name: 'Record Type Code',
					width: 1,
					position: 1,
					required: true,
					type: 'numeric',
					value: '5'
				}
			};
			
			expect( function() { utils.generateString(testObj) }).not.to.throw('Not passing object correctly.');
		});
	});

	describe('YYMMDD',function() {
		it('Must return the current date',function() {
			var utils = require('./../lib/utils');

			var day = moment().get('date').toString();
			var year = moment().get('year').toString().slice(-2);
			var month = (moment().get('month')+1).toString();

			var date = year + month + day;

			 var dateNum = Date.prototype.yymmdd();

			if(dateNum === date) { expect(function() { utils.dateNum }).not.to.throw('Dates match'); }	

			else { expect(function() { utils.dateNum }).to.throw('Dates don\'t match');}	

		});
	});

	describe('HHMM', function() {
		it('Must return the current time', function() {
			var utils = require('./../lib/utils');

			var hour = moment().hour().toString();
			var minute = moment().minute().toString();
			var time = hour + minute;

			var utilsTime = Date.prototype.hhmm();
			
			if(utilsTime === time) { expect(function() { utils.utilsTime }).not.to.throw('Times match'); }
			else { expect(function() { utils.utilsTime }).to.throw('Times don\'t match.') }
		});
	});

});