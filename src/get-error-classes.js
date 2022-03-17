/* RUN THIS WITH --expose-internals NODE FLAG */

const net = require('net');
const errors = require('internal/errors');

function getErrorClasses () {
  const rangeError = getRangeError();
  const referenceError = getReferenceError();
  const systemError = getSystemError();
  const typeError = getTypeError();
  return [
    rangeError,
    referenceError,
    systemError,
    typeError
  ]
}

function getRangeError() {
  try {
    net.connect(-1);
    console.log('2')
  } catch (e) {
    return e.constructor;
  }
}

function getReferenceError() {
  try {
    asdf;
  } catch (e) {
    return e.constructor;
  }
}

function getSystemError() {
  return errors.SystemError;
}

function getTypeError() {
  try {
    require('url').parse(123);
  } catch (e) {
    return e.constructor;
  }
}

module.exports = getErrorClasses;
