const _ = require('lodash');
const generateChartData = require('./generate-chart-data');
const getModulesChains = require('./get-modules-chains');
const getNonImportableChains = require('./get-non-importable-chains');

function main() {
  const chains = [
    ...getModulesChains(),
    ...getNonImportableChains()
  ];
  generateChartData(chains);
}
main();
