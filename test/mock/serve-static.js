import sinon from 'sinon';


function getServeStatic() {
  return sinon.stub();
}


const serveStatic = getServeStatic();


export default serveStatic;
