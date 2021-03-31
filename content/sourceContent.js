const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { snippetTag, taskTag, titleTag } = require('./asciidoc');
const { renderMD } = require('./md');

const yamlRegex = /\.ya?ml$/;
const yamlDirs = [
  // path.join(__dirname, 'console-operator/quickstarts'),
  path.join(__dirname, 'quarkus')
];

// js-yaml doesn't give us the current filename it's parsing for use in custom tags
// We'll use this global var instead...
global.curFilename = '';

function assertProp(quickstart, prop, filename) {
  if (!Boolean(quickstart[prop])) {
    throw Error(`${filename} must have prop ${prop}`)
  }
}

const requiredProps = [
  'displayName',
  'description',
  'introduction',
  'tasks',
  'conclusion'
];
const allowedProps = requiredProps.concat(...[
  'durationMinutes',
  'icon',
  'prerequisites'
]);

const schema = yaml.DEFAULT_SCHEMA.extend([ snippetTag, taskTag, titleTag ]);
yamlDirs
  .map(dir => fs.readdirSync(dir).map(p => path.join(dir, p)))
  .flat()
  .filter(filename => yamlRegex.test(path.extname(filename)))
  .forEach(filename => {
    console.log(filename.replace(__dirname, ''));
    global.curFilename = filename;
    const text = fs.readFileSync(filename, 'utf8');
    let quickstart = yaml.load(text, { schema });
    const toPath = path.join(
      __dirname,
      '../static/quickstarts',
      `${quickstart.metadata.name}.json`
    );

    // Make sure it has required props
    quickstart = quickstart.spec;

    requiredProps.forEach(prop => assertProp(quickstart, prop, filename));
    // TODO: only keep valid props
    Object.keys(quickstart).forEach(key => {
      if (!allowedProps.includes(key)) {
        delete quickstart[key];
      }
    });
    // Render string fields to md
    renderMD(quickstart);

    fs.outputFileSync(toPath, JSON.stringify(quickstart, null, 2));
  });
