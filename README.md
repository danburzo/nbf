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

## Guide

### Prerequisites

* [curl](https://curl.haxx.se/)
* [jq](https://stedolan.github.io/jq/) ([tutorial](
https://programminghistorian.org/en/lessons/json-and-jq))

### Mastodon 

Grab an archive of your Mastodon account with [mastodon-archive](https://github.com/kensanata/mastodon-backup).

In the example below, we use `jq` to look at favourites that have a card attached to them, and reshape the JSON to fit our schema:

```bash
cat mastodon.social.user.danburzo.json | \
jq '[
		.favourites[] | 
		select(.card) | 
		{ 
			dateAdded: .created_at, 
			uri: .card.url, 
			title: .card.title, 
			description: "\(.card.description)\nvia: \(.url)" 
		}
	]' | \
nbf > mastodon-faves.html
```

### Lobste.rs

### Firefox bookmarks

TODO

### Safari bookmarks

TODO

## Sources

For convenience, the predefined sources listed below convert the JSON to the proper format for you. Usage:

```bash
curl -sN ... > nbf --source=<source>
```

### Lobste.rs

Lobste.rs offers a JSON format for some things, such as your saved stories or your submissions.

`--source=lobsters`

1. In Firefox, go to [lobste.rs/saved.json](https://lobste.rs/saved.json) and copy the request from the dev tools Network tab as cURL
2. Paste the cURL comamnd, in the terminal, followed by `-sN | nbf --source=lobsters > output.html`