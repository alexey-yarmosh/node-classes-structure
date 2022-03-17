const generateChains = require('./chains-generator');
const getErrorClasses = require('./get-error-classes');
const classRegistry = require('./class-registry');

function getNonImportableChains () {
  const classes = getErrorClasses();
  classRegistry.register(classes, 'hidden');
  const errorChains = generateChains(classes);

  return [
    ...errorChains
  ];
}

module.exports = getNonImportableChains;
