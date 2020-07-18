#!/usr/bin/env node
let { toNBF } = require('./index.js');

process.stdin.setEncoding('utf8');

let content = '';

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    content += chunk;
  }
});

process.stdin.on('end', () => {
	let source;
	let sarr = process.argv.map(item => item.match(/--source=([a-z0-9-_]+)/i)).find(it => it);
	if (sarr) source = sarr[1];
	process.stdout.write(
		toNBF(JSON.parse(content), source)
	);
});