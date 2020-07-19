#!/usr/bin/env node
let { toNBF } = require('./index.js');
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
		stdout.write(toNBF(JSON.parse(content)));
	});