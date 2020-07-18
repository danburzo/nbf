# nbf

Tiny, dependency-free, CLI tool for working with the [Netscape Bookmark File](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)?redirectedfrom=MSDN) format. It consumes a JSON file from `stdin` and outputs HTML to `stdout`.

## Installation

Install globally with `npm` or `yarn`:

```bash
# npm:
npm install -g nbf

# yarn:
yarn global add nbf
```

Or run it directly with `npx`:

```bash
npx nbf
```

## JSON format

`nbf` expects JSON items to have the following properties:

```js
{
	"title": "...",
	"uri": "https://",
	"description": "...",
	"dateAdded": "", // something that JS Date() can parse 
	"tags": ["...", "..."], // or:
	"tags": "..., ..., ..."
}
```

## Sources

For convenience, the predefined sources listed below convert the JSON to the proper format for you. Usage:

```bash
curl -sN ... > nbf --source=<source>
```

### Lobste.rs saved bookmarks

`--source=lobsters`

1. In Firefox, go to [lobste.rs/saved](https://lobste.rs/saved) and copy the request from the dev tools Network tab as cURL
2. Paste the cURL comamnd, in the terminal, followed by `-sN | nbf --source=lobsters > output.html`