/**
@module mock/nconf
@description A mock nconf; Designed to record which order the sources were specified in.
*/

function getFakeNConf() {
  const fake = {};
  // Sources. Called it markers during a brainfart.
  const markers = [];
  fake.markers = markers;
  function makeTestFunction(marker) {
    return function() {
      markers.push(marker);
      return fake;
    };
  }

  fake.argv = makeTestFunction('argv');
  fake.env = makeTestFunction('env');
  fake.file = makeTestFunction('file');
  fake.defaults = makeTestFunction('defaults');
  fake.get = function(key) {
    return `VALUE-FOR-${key}`;
  };
  return fake;
}


export default getFakeNConf;
