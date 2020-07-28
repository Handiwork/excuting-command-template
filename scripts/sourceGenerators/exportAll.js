const fs = require('fs');
const path = require('path');
const folder = process.argv[2];
const _outFile = process.argv[3] || 'index.ts';

const files = fs.readdirSync(folder);
const modules = files.filter(f => !/index/.test(f));

let result = "";
for (let m of modules) {
  let moduleName = m.split(".")[0];
  result += (
    `export * from './${moduleName}';
`
  )
}

// console.log(result);

let outFile = path.resolve(folder, _outFile);
fs.writeFileSync(outFile, result);
