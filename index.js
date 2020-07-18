#!/usr/bin/env node

const wrapper = content => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks Menu</H1>
<DL><p>
${content}
</DL><p>`;

const sanitize_html = str => 
	(str + "")
		.replace(/&/g,"&amp;")
		.replace(/</g,"&lt;")
		.replace(/>/g,"&gt;")
		.replace(/"/g,"&quot;")
		.replace(/'/g,"&#x27;");

// Format the JSON object for the bookmark item into a HTML fragment
const bookmark_to_html = item => {

	let tags = Array.isArray(item.tags) ? item.tags.join(',') : item.tags;

	return `<DT><A HREF="${item.uri}" ADD_DATE="${toDate(item.dateAdded)}" ${ tags ? `TAGS="${tags}"` : ''}>${sanitize_html(item.title)}</A>
${item.description ? '<DD>' + sanitize_html(item.description) : ''}
	`;
};

// Transform the Javascript timestamp (in milliseconds from Jan 1, 1970) to the 
// Epoch time (in seconds from Jan 1, 1970) used in Netscape format
const toDate = date => Math.round(new Date(date).getTime() / 1000);

const render = (obj, source) => {
	if (Array.isArray(obj)) {
		return obj.map(item => render(item, source)).join('\n');
	}
	if (source) {
		obj = source(obj);
	}
	if (Array.isArray(obj.children)) {
		// folder
		return `<DT><H3 FOLDED ${obj.dateAdded ? `ADD_DATE="${toDate(obj.dateAdded)}"` : ''}>${sanitize_html(obj.title)}</H3>
    <DL><p>
${render(obj.children)}
    </DL><p>`;
	} else if (obj.uri) {
		// item
		return bookmark_to_html(obj);
	}
};

process.stdin.setEncoding('utf8');

let content = '';

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    content += chunk;
  }
});

process.stdin.on('end', () => {
	let source = process.argv.map(item => item.match(/--source=([a-z0-9-_]+)/i)).find(it => it);
	process.stdout.write(
		wrapper(
			render(JSON.parse(content), source && source[1] ? require(`./sources/${source[1]}`) : t => t)
		)
	);
});