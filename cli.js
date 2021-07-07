#!/usr/bin/env node
let convertToHTML = require('./index.js');
let { stdin, stdout } = process;
let content = '';

stdin
	.setEncoding('utf8')
	.on('readable', () => {
		let chunk;
		while ((chunk = stdin.read()) !== null) {
			content += chunk;
		}
	}).on('end', () => {
		stdout.write(convertToHTML(JSON.parse(content)));
	});