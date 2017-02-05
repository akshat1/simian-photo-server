/**
 * @module stub-manager
 * Utilities for stubbing methods.
 */
const sinon = require('sinon');

const StubManager = {
  stubs: [],

  /**
   * @param {Object} obj - The object whose method is to be mocked
   * @methodName {string} - NAme of the method to be stubbed
   */
  stub: function (obj, methodName) {
    const stub = sinon.stub(obj, methodName);
    this.stubs.push(stub);
    return stub;
  },

  restoreAll: function () {
    this.stubs.forEach(stub => stub.restore());
  }
};


module.exports = StubManager;
