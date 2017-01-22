import sinon from 'sinon';


function getServeStatic() {
  return sinon.stub();
}


const serveStatic = getServeStatic();


module.exports = serveStatic;
