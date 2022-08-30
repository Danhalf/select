const { defaultDependency, html, css, minify, images } = require('./Plugins');

const cliSelect = require('cli-select');
const chalk = require('chalk');
const { readFileSync, writeFileSync } = require('fs');

const packagePath = './package.json';

const dependencies = [];

const pushToDependencies = (payload) => {
  const { value } = payload || 0;
  console.log(value);
  switch (value) {
    case 'css&js minified':
      dependencies.push(...Object.entries(minify));
      break;

    default:
      break;
  }
  const [name, version] = value;
  if (!version) dependencies.push(value);
};

const valueRenderer = (values, selected) => {
  if (selected) {
    return chalk.underline.green(values);
  }
  return values;
};

cliSelect({
  values: [...Object.entries(html)],
  valueRenderer,
})
  .then(pushToDependencies)
  .then(() =>
    cliSelect({
      values: [...Object.entries(css)],
      valueRenderer,
    })
  )
  .then(pushToDependencies)
  .then(() =>
    cliSelect({
      values: ['css&js minified', 'css&js not minified'],
      valueRenderer,
    })
  )
  .then(pushToDependencies)
  .then(() => {
    const package = readFileSync(packagePath);
    const parsedPackage = JSON.parse(package);
    const dependency = Object.fromEntries(dependencies);
    parsedPackage.devDependencies = { ...defaultDependency, ...dependency };
    writeFileSync(
      packagePath,
      JSON.stringify(parsedPackage, null, 2),
      'utf8',
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(dependency);
      }
    );
  });
