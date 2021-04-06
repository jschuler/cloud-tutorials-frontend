const asciidoctor = require('asciidoctor')() 
const content = 
`
https://discuss.asciidoctor.org[Discuss Asciidoctor^,role="green"]
`;
const html = asciidoctor.convert(content, { safe: 'secure' }) 
console.log(html) 