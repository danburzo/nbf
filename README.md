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

### NetNewsWire starred articles

On macOS, NetNewsWire keeps user data in a SQLite database. We can browse and query it, and grab a JSON of the result, using [`datasette`](https://github.com/simonw/datasette): 

```bash
datasette serve ~/Library/Application\ Support/NetNewsWire/Accounts/OnMyMac/DB.sqlite3
```

Head over to [`http://127.0.0.1:8001/`](http://127.0.0.1:8001/) and run this query:

```sql
select 
  a.title as title, 
  a.summary as description, 
  coalesce(a.url, a.externalURL) as uri,
  a.datePublished as dateAdded
from articles as a join statuses as s 
on a.articleID = s.articleID 
where s.starred = 1;
```

Then follow the `json` link, and add the `_shape=array` query parameter — this shapes the JSON in a way that we can use directly. We can `curl` it in our command:

```bash
curl http://127.0.0.1:8001/DB.json\?_shape\=array\&sql\=select+%0D%0A++a.title+as+title%2C+%0D%0A++a.summary+as+description%2C+%0D%0A++coalesce%28a.url%2C+a.externalURL%29+as+uri%2C%0D%0A++a.datePublished+as+dateAdded%0D%0Afrom+articles+as+a+join+statuses+as+s+%0D%0Aon+a.articleID+%3D+s.articleID+%0D%0Awhere+s.starred+%3D+1%3B -nS | \
nbf > nnw.html
```

### Lobste.rs

TODO

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