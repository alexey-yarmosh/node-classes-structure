function getInheritanceChain(startClass) {
  const chain = [startClass];
  let currentParent = startClass.prototype.__proto__.constructor;
  while (currentParent) {
    chain.push(currentParent);
    currentParent = currentParent.prototype.__proto__?.constructor;
  }
  return chain;
}

function generateChains(classes) {
  const chains = [];
  for (const cl of classes) {
    chains.push(getInheritanceChain(cl));
  }
  return chains;
}

module.exports = generateChains;
