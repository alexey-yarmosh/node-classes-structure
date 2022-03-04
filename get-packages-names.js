const fs = require('fs/promises');
const _ = require('lodash');

const DIR_PATH = './nodejs-site/nodejs.org/api';
const REGEX = /require<\/span>\(<span class="hljs-string">'(.+?)'<\/span>/;


(async () => {
  const modules = [];
  const files = await fs.readdir(DIR_PATH);
  for (const file of files) {
    const fileData = await fs.readFile(`${DIR_PATH}/${file}`, 'utf-8');
    const match = fileData.match(REGEX);
    if (match) {
      modules.push(match[1]);
    }
  }

  console.log('modules', modules);
})();
