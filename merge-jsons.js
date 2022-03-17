const data1 = require('./data/data');
const data2 = require('./data/data-v1-with-comments');
const fs = require('fs');

data1.forEach(itemD1 => {
  const data2Item = data2.find(itemD2 => itemD1.id === itemD2.id);
  if (data2Item && data2Item.attributes) {
    itemD1.attributes = data2Item.attributes;
  }
});
fs.writeFileSync('./data/data.json', JSON.stringify(data1, null, 2));
