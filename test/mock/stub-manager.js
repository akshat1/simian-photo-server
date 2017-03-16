/**
 * @module stub-manager
 * Utilities for stubbing methods.
 */
const sinon = require('sinon');

const StubManager = {
  stubs: [],

  /**
   * @param {Object} obj - The object whose method is to be mocked
   * @param {string} methodName - Name of the method to be stubbed
   * @param {*} [returnValue] - Value to be returned (you can always change it later)
   */
  stub: function (obj, methodName, returnValue) {
    const stub = sinon.stub(obj, methodName);
    this.stubs.push(stub);
    stub.returns(returnValue);
    return stub;
  },

  restoreAll: function () {
    this.stubs.forEach(stub => stub.restore());
  }
};


module.exports = StubManager;
