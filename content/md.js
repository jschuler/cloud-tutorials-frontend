const unified = require('unified');
var merge = require('deepmerge')
var gh = require('hast-util-sanitize/lib/github')
var sanitize = require('hast-util-sanitize')
var schema = merge(gh, {
  attributes: {
    '*': ['className']
  },
  clobberPrefix: ''
})

const processor = unified()
  .use(require('remark-parse'))
  .use(require('remark-rehype'), {allowDangerousHtml: true})
  .use(require('rehype-raw'))
  .use(require('rehype-sanitize'), schema)
  .use(require('rehype-stringify'));

// Renders all 
function renderMD(quickstart) {
  Object.entries(quickstart).forEach(([key, val]) => {
    if (typeof val === 'string' && key !== 'icon') {
      val = processor.processSync(val);
      quickstart[key] = removeParagraphWrap(val.contents);
    }
    else if (typeof val === 'object') {
      renderMD(val);
    }
  });
}

function removeParagraphWrap(html) {
  return html.replace(/^<p>|<\/p>$/g, '');
}


module.exports = { renderMD, removeParagraphWrap };
