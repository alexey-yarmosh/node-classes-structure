const { writeFileSync } = require('fs');
const _ = require('lodash');

const classRegistry = require('./class-registry');

function getChartData(chains) {
  const chartData = [];
  for (const chain of chains) {
    for (let i = 0; i < chain.length; i++) {
      const currentClass = chain[i];
      const nextClass = chain[i+1];
      const chartElement = {
        id: classRegistry.getName(currentClass),
        name: classRegistry.getName(currentClass),
        parent: nextClass ? classRegistry.getName(nextClass) : null,
        color: classRegistry.getColor(currentClass),
        outline_color: classRegistry.getOutlineColor(currentClass)
      }
      chartData.push(chartElement);
    }
  }
  const uniqChartData = _.uniqBy(chartData, ({ id }) => id);
  const sortedChartData = sortChartData(uniqChartData);
  return sortedChartData;
}

function sortChartData(chartData) {
  const sortedChartData = [];
  const parentNames = [null];
  for (const parentName of parentNames) {
    const childs = chartData.filter(chartElem => chartElem.parent === parentName);
    sortedChartData.push(...childs);
    const newParentNames = childs.map(chartElem => chartElem.id);
    parentNames.push(...newParentNames);
  }
  return sortedChartData;
}

function saveChartData(chartData) {
  writeFileSync('./data/data.json', JSON.stringify(chartData, null, 2));
}

function generateChartData(chains) {
  const chartData = getChartData(chains);
  saveChartData(chartData);
}

module.exports = generateChartData;
