const cliSelect = require('cli-select');
const chalk = require('chalk');
const { readFile, writeFile } = require('fs');

const packagePath = './package.json';

const html = {
  pug: '^0.0.3',
  handlebars: '^0.4.0',
};
const css = {
  scss: '^2.1.2',
  less: '^5.1.0',
  stylys: '^3.4.0',
};

class Dependencies {
  constructor(deps) {
    this.deps = deps;
  }

  get dependencies() {
    return this.deps;
  }

  set dependencies(value) {
    this.deps = [...this.dependencies, value];
  }

  pushToDependencies({ value }) {
    if (typeof value !== 'string') this.dependencies(value);
  }
}

const dependency = new Dependencies([]);

cliSelect({
  values: ['html only', ...Object.entries(html)],
  valueRenderer: (values, selected) => {
    if (selected) {
      return chalk.underline.blue(values);
    }
    return values;
  },
})
  .then(dependency.pushToDependencies)
  .then(() =>
    cliSelect({
      values: ['pure css', ...Object.entries(css)],
      valueRenderer: (values, selected) => {
        if (selected) {
          return chalk.underline.green(values);
        }
        return values;
      },
    })
  )
  .then(dependency.pushToDependencies)
  .then(() => console.log(Object.fromEntries(dependency.dependencies)));

//   .then(
//  writeFile(packagePath, JSON.stringify(res), 'utf8', (err, data) => {
//    if (err) {
//      console.log(err);
//      return;
//    }
//    console.log(data, ' done');
//  });
//    readFile(packagePath, 'utf8', (error, data) => {
//      if (error) {
//        console.warn(error);
//        return;
//      }
//      const { dependencies } = JSON.parse(data);
//      console.log(dependencies);
//    })
//  )
