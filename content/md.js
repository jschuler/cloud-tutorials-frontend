const unified = require('unified');

const processor = unified()
  .use(require('remark-parse'))
  .use(require('remark-rehype'), {allowDangerousHtml: true})
  .use(require('rehype-raw'))
  .use(require('rehype-sanitize'))
  .use(require('rehype-stringify'));

// Renders all 
function renderMD(quickstart) {
  Object.entries(quickstart).forEach(([key, val]) => {
    if (typeof val === 'string' && key !== 'icon') {
      val = processor.processSync(val);
      quickstart[key] = val.contents;
    }
    else if (typeof val === 'object') {
      renderMD(val);
    }
  });
}

module.exports = { renderMD };
