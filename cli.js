#!/usr/bin/env node
let { jsonToHtml } = require('./index.js');
let { stdin, stdout, NBF_DTD } = process;
let content = '';

stdin
	.setEncoding('utf8')
	.on('readable', () => {
		let chunk;
		while ((chunk = stdin.read()) !== null) {
			content += chunk;
		}
	}).on('end', () => {
		stdout.write(
			content.trim().indexOf(NBF_DTD) === 0 ? 
			htmlToJson(content)
			: jsonToHtml(JSON.parse(content))
		);
	});