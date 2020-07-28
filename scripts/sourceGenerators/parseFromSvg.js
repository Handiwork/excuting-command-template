const fs = require('fs');
const path = require('path');
const folder = process.argv[2];
const files = fs.readdirSync(folder);

const svgFiles = files.filter(f => path.extname(f) === '.svg');

let result = `
import React,{SVGAttributes} from 'react';
`;

for (let f of svgFiles) {
  let str = fs.readFileSync(path.resolve(folder, f), { encoding: "utf8" });
  let i = str.indexOf("<svg")
  let svg = str.substr(i)
    .replace(/fill="#\w{6}"/g, (m) => `fill="currentColor"`)
    .replace(/(class=\"\w*\")/g, (m, g1) => `{...props}`);
  let componentName = path.basename(f, ".svg")
    .toLowerCase()
    .replace(/-+(\w)/g, (m, g1) => g1.toUpperCase())
    .replace(/\w/, (m) => m.toUpperCase());
  result += `
export function ${componentName}(props:SVGAttributes<SVGElement>){
  return (
    ${svg}
  )
}
`
}

// console.log(result);

let outFile = path.resolve(folder, "index.tsx");
fs.writeFileSync(outFile, result);
