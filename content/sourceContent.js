const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const yaml = require('js-yaml');
const { snippetTag, taskTag, titleTag } = require('./asciidoc');
const { renderMD } = require('./md');

const sourcePatterns = [
  'console-operator/quickstarts/*.{yaml,yml}',
  'mas-guides/!(external-*)/*.{yaml,yml}',
  'app-guides/*.{yaml,yml}'
];

const tutorialPatterns = [
  'tutorials/**/*.{yaml,yml}',
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
  'prerequisites',
  'form'
]);

const schema = yaml.DEFAULT_SCHEMA.extend([ snippetTag, taskTag, titleTag ]);
const convert = ((source, output) => {
  source
    .map(p => glob.sync(p, {
      cwd: __dirname,
      nodir: true
    }))
    .flat()
    .map(filename => path.join(__dirname, filename))
    .forEach(filename => {
      console.log(filename.replace(__dirname, ''));
      global.curFilename = filename;
      const text = fs.readFileSync(filename, 'utf8');
      let quickstart = yaml.load(text, { schema });
      const name = quickstart.metadata.name;

      // Make sure it has required props
      quickstart = quickstart.spec;
      requiredProps.forEach(prop => assertProp(quickstart, prop, filename));
      // Only keep valid props that we render
      Object.keys(quickstart).forEach(key => {
        if (!allowedProps.includes(key)) {
          delete quickstart[key];
        }
      });
      // Render string fields to md
      renderMD(quickstart);

      // Stay compatible with old schema
      quickstart = {
        metadata: { name },
        spec: quickstart
      };

      const toPath = path.join(
        __dirname,
        `../static/${output}`,
        `${name}.json`
      );
      fs.outputFileSync(toPath, JSON.stringify(quickstart, null, 2));
    });
});

convert(sourcePatterns, 'quickstarts');
convert(tutorialPatterns, 'tutorials');