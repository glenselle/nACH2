class nACHError extends Error {
  constructor(errorObj) {
    super(errorObj.message);
    this.name = 'nACHError['+errorObj.name+']' || 'nACHError';
  }
}

module.exports = nACHError;
