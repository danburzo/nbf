# nbf

Tiny, dependency-free, CLI tool for working with the [Netscape Bookmark File](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)) format. 

Its only function is to take a JSON object from `stdin` and output HTML to `stdout`.

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
	"uri": "https://...",
	"description": "...",
	"dateAdded": "...", // something that JS Date() can parse 
	"tags": ["...", "..."], // or:
	"tags": "..., ..., ..."
}
```

Folders and subfolders are possible: 

```js
{
	"title": "...",
	"children": [
		// ...
	]
}
```

## Guide to exporting bookmarks

### Prerequisites

Most of these recipes use: 

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
			description: "\(.card.description)\nvia: \(.url)",
			tags: ["from:mastodon"] 
		}
	]' | \
nbf > mastodon-faves.html
```

### NetNewsWire starred articles

On macOS, NetNewsWire keeps user data in a SQLite database. We can browse and query it, and grab a JSON of the result, using [`datasette`](https://github.com/simonw/datasette): 

```bash
datasette serve ~/Library/Containers/com.ranchero.NetNewsWire-Evergreen/Data/Library/Application\ Support/NetNewsWire/Accounts/OnMyMac/DB.sqlite3
```

(Older versions of NNW store their database under `~/Library/Application\ Support/NetNewsWire/Accounts/OnMyMac/DB.sqlite3`)

Head over to [`http://127.0.0.1:8001/DB`](http://127.0.0.1:8001/DB) and run this query:

```sql
select 
  a.title as title, 
  a.summary as description, 
  coalesce(a.url, a.externalURL) as uri,
  a.datePublished * 1000 as dateAdded
from articles as a join statuses as s 
on a.articleID = s.articleID 
where s.starred = 1;
```

Then follow the `json` link, and add the `_shape=array` query parameter — this shapes the JSON in a way that we can use directly. We can `curl -nS` it in our command:

```bash
curl -nS http://127.0.0.1:8001/DB.json?_shape=array&sql=select+%0D%0A++a.title+as+title%2C+%0D%0A++a.summary+as+description%2C+%0D%0A++coalesce(a.url%2C+a.externalURL)+as+uri%2C%0D%0A++a.datePublished+*+1000+as+dateAdded%0D%0Afrom+articles+as+a+join+statuses+as+s+%0D%0Aon+a.articleID+%3D+s.articleID+%0D%0Awhere+s.starred+%3D+1%3B | \
nbf > nnw.html
```

### GitHub starred repos

[GitHub CLI](https://cli.github.com/) (currently in beta) makes it easy to collate paginated responses from the GitHub API.

```bash
gh api user/starred \
	-H "Accept: application/vnd.github.v3.star+json" \
	-H "Accept: application/vnd.github.mercy-preview+json" \
	--paginate \
| jq '
        .[] | select(.repo.private == false) | {
                title: .repo.full_name,
                uri: .repo.html_url,
                dateAdded: .starred_at,
                description: "\(.repo.description)\n\(.repo.homepage // "")",
                tags: ["source:github"]
}' \
| jq -s '.' \
| nbf > stars.html
```

If you also want to include repository topics and/or language as tags — but be aware that people can go overboard with topics in an effort to make their repos more discoverable:

```
tags: (
    (.repo.topics // []) +
    [.repo.language // ""] +
    ["source:github"]
) | map(. | ascii_downcase) | unique
``` 

If afterwards you want to unstar the repos in bulk, use:

```bash
gh api user/starred | \
jq -r '.[] | "user/starred/\(.full_name)"' | \
xargs -L1 gh api --method=DELETE
```

Variations: 

* plop an `--interactive` flag for xargs to confirm each unstar with the `y` key + Enter. (Is there a way to get Yes by default? 🤔)
* use the `--paginate` flag on `gh api` to go through *all* your starred repos, but that might get you rate-limited.

### Lobste.rs

Lobste.rs offers a JSON endpoint for most things, for example [lobste.rs/saved.json](https://lobste.rs/saved.json). Because you need the session cookie to make this request from the command-line, we go to the browser's dev tools, right-click the select and choose _Copy as cURL_. 

```bash
curl ... | jq '[.[] | {
	title: .title,
	description: "\(.description)\nvia: \(.short_id_url)",
	uri: .url,
	tags: ((.tags // []) + ["source:lobste.rs"]),
	dateAdded: .created_at
}]' | nbf
```

### Firefox bookmarks

TODO

### Safari bookmarks

TODO
