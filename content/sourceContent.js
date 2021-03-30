const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const yamlRegex = /\.ya?ml$/;
const yamlDirs = [
  path.join(__dirname, 'console-operator/quickstarts')
];

yamlDirs
  .map(dir => fs.readdirSync(dir).map(p => path.join(dir, p)))
  .flat()
  .filter(yamlPath => yamlRegex.test(path.extname(yamlPath)))
  .forEach(yamlPath => {
    console.log(yamlPath.replace(__dirname, ''));
    const text = fs.readFileSync(yamlPath, 'utf8');
    const doc = yaml.load(text);

    const toPath = path.join(
      __dirname,
      '../static/quickstarts',
      `${doc.metadata.name}.json`
    );

    fs.outputFileSync(toPath, JSON.stringify(doc, null, 2));
  })
