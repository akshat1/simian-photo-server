const LStorage = {
  get: function get(key) {
    return window.localStorage.getItem(key);
  },


  set: function set(key, value) {
    return window.localStorage.setItem(key, value);
  }
};

module.exports = LStorage;
