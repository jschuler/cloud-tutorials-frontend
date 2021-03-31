const path = require('path');
const yaml = require('js-yaml');
// http://asciidoctor.github.io/asciidoctor.js/master/
const asciidoctor = require('asciidoctor')();

// Adds yaml tags to parse asciidoc into Openshift quickstart format
const docs = {}; // filename: asciidoctor.load
const attributes = {
  qs: 'true'
};

function getDoc(filename) {
  docs[filename] = docs[filename] || asciidoctor.loadFile(filename, { attributes });

  return docs[filename];
}

function resolveDoc(filename) {
  const docFile = path.join(path.dirname(global.curFilename), filename);
  return getDoc(docFile);
}

function splitTag(tag, data) {
  const [filename, id] = data.split("#");
  if (!filename || !id) {
    throw Error(`malformed !${tag} ${str}, must be like !${tag} README.adoc#task-1`);
  }

  return [filename, id];
}

function getBlock(doc, id) {
  const blocks = doc.findBy({ id });
  if (blocks.length === 0) {
    throw Error(`Could not find id=${id} in ${filename}`);
  }
  return blocks[0];
}

// Returns string which is the title
const titleTag = new yaml.Type('!snippet/title', {
  kind: 'scalar',
  construct: tag => {
    const doc = resolveDoc(tag);
    return doc.getDocumentTitle() || `Title of ${doc}`;
  }
});

// Returns string which is the block rendered as html
const snippetTagName = '!snippet';
const snippetTag = new yaml.Type(snippetTagName, {
  kind: 'scalar',
  construct: tag => {
    const [filename, id] = splitTag(taskTagName, tag);
    const doc = resolveDoc(filename);
    const block = getBlock(doc, id);
    return block.getContent();
  }
});

class Task {
  constructor(block) {
    this.title = block.getTitle();
    this.description = block.getContent();
    ;
  }
}

const taskTagName = '!snippet/task';
const taskTag = new yaml.Type(taskTagName, {
  kind: 'scalar',
  construct: tag => {
    const [filename, id] = splitTag(taskTagName, tag);
    const doc = resolveDoc(filename);
    const block = getBlock(doc, id);

    return new Task(block);
  },
  instanceOf: Task
});

module.exports = {
  snippetTag,
  taskTag,
  titleTag
};