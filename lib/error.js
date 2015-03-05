'use strict';
// Create a new object, that prototypally inherits from the Error constructor.
var nACHError = function(errorObj) {
  this.name = 'nACHError['+errorObj.name+']' || 'nACHError';
  this.message = errorObj.message || 'Uncaught nACHError';
};
nACHError.prototype = Object.create(Error.prototype);
nACHError.prototype.constructor = nACHError;

module.exports = nACHError;