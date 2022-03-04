const assert = require('assert');
const async_hooks = require('async_hooks');
const buffer = require('buffer');
const child_process = require('child_process');
const cluster = require('cluster');
const console = require('console');
const crypto = require('crypto');
const dgram = require('dgram');
const diagnostics_channel = require('diagnostics_channel');
const dns = require('dns');
const domain = require('domain');
const fs = require('fs');
const fsPromises = require('fs/promises');
const events = require('events');
const http = require('http');
const http2 = require('http2');
const https = require('https');
const inspector = require('inspector');
const modulePackage = require('module');
const net = require('net');
const os = require('os');
const path = require('path');
const perf_hooks = require('perf_hooks');
const process = require('process');
const punycode = require('punycode');
const querystring = require('querystring');
const readline = require('readline');
const readlinePromises = require('readline/promises');
const repl = require('repl');
const stream = require('stream');
const string_decoder = require('string_decoder');
const timers = require('timers');
const timersPromises = require('timers/promises');
const tls = require('tls');
const trace_events = require('trace_events');
const tty = require('tty');
const url = require('url');
const util = require('util');
const v8 = require('v8');
const vm = require('vm');
const streamWeb = require('stream/web');
const worker_threads = require('worker_threads');
const zlib = require('zlib');

const _ = require('lodash');
const { writeFileSync } = require('fs');
const { String2HexCodeColor } = require('string-to-hex-code-color');

class ClassRegistry {
  constructor () {
    this.string2color = new String2HexCodeColor();
    this.classesMap = new Map();
    this.classesMap.set(Object, Object.name);
  }

  register (cl, moduleName) {
    this.classesMap.set(cl, `${moduleName}.${cl.name}`);
  }

  getName (cl) {
    const name = this.classesMap.get(cl);
    if (name === 'Object') {
      return 'global.Object';
    }
    if (name) {
      return name;
    }
    try {
      eval(cl.name);
    } catch (error) {
      return `hidden.${cl.name}`;
    }
    return cl.name ? `global.${cl.name}` : '[Function (anonymous)]';
  }

  getColor (cl) {
    const name = this.getName(cl);
    const moduleName = name.split('.')[0];
    return this.string2color.stringToColor(moduleName, 0.6);
  }

  getOutlineColor (cl) {
    const name = this.getName(cl);
    const moduleName = name.split('.')[0];
    return this.string2color.stringToColor(moduleName, -0.1);
  }
}
const classRegistry = new ClassRegistry();

function getInheritanceChain(startClass) {
  const chain = [startClass];
  let currentParent = startClass.prototype.__proto__.constructor;
  while (currentParent) {
    chain.push(currentParent);
    currentParent = currentParent.prototype.__proto__?.constructor;
  }
  return chain;
}

function getClassesFromModule(module) {
  const classes = [];
  const entries = Object.entries(module);
  entries.forEach(([key, value]) => {
    const isClassName = getIsClassName(key);
    if (isClassName) {
      classes.push(value);
    }
  });
  return classes;
}

function getIsClassName(str) {
  return /[A-Z][a-z]/.test(str.slice(0, 2));
}

function handleModule (moduleName, module) {
  const classes = getClassesFromModule(module);
  const chains = [];
  for (const cl of classes) {
    classRegistry.register(cl, moduleName);
    chains.push(getInheritanceChain(cl));
  }
  return chains;
}

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

function main() {
  const chains = [
    ...handleModule('assert', assert),
    ...handleModule('async_hooks', async_hooks),
    ...handleModule('buffer', buffer),
    ...handleModule('child_process', child_process),
    ...handleModule('cluster', cluster),
    ...handleModule('console', console),
    ...handleModule('crypto', crypto),
    ...handleModule('dgram', dgram),
    ...handleModule('diagnostics_channel', diagnostics_channel),
    ...handleModule('dns', dns),
    ...handleModule('domain', domain),
    ...handleModule('fs', fs),
    ...handleModule('fs/promises', fsPromises),
    ...handleModule('events', events),
    ...handleModule('http', http),
    ...handleModule('http2', http2),
    ...handleModule('https', https),
    ...handleModule('inspector', inspector),
    ...handleModule('module', modulePackage),
    ...handleModule('net', net),
    ...handleModule('os', os),
    ...handleModule('path', path),
    ...handleModule('perf_hooks', perf_hooks),
    ...handleModule('process', process),
    ...handleModule('punycode', punycode),
    ...handleModule('querystring', querystring),
    ...handleModule('readline', readline),
    ...handleModule('readline/promises', readlinePromises),
    ...handleModule('repl', repl),
    ...handleModule('stream', stream),
    ...handleModule('string_decoder', string_decoder),
    ...handleModule('timers', timers),
    ...handleModule('timers/promises', timersPromises),
    ...handleModule('tls', tls),
    ...handleModule('trace_events', trace_events),
    ...handleModule('tty', tty),
    ...handleModule('url', url),
    ...handleModule('util', util),
    ...handleModule('v8', v8),
    ...handleModule('vm', vm),
    ...handleModule('stream/web', streamWeb),
    ...handleModule('worker_threads', worker_threads),
    ...handleModule('zlib', zlib),
  ];
  const chartData = getChartData(chains);
  saveChartData(chartData);
}
main();
