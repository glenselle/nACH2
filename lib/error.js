'use strict';

var nACHError = function(errorObj) {
  this.name = errorObj.name ? 'nACHError['+errorObj.name+']' : 'nACHError';
  this.message = errorObj.message || 'Uncaught nACHError';
};
nACHError.prototype = Object.create(Error.prototype);
nACHError.prototype.constructor = nACHError;

module.exports = nACHError;