# nbf

CLI tool for working with the [Netscape Bookmark File](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)?redirectedfrom=MSDN) format.

It takes JSON from stdin and outputs HTML.

## Sources

### Lobste.rs saved bookmarks

`--source=lobsters`

1. In Firefox, go to [lobste.rs/saved](https://lobste.rs/saved) and copy the request from the dev tools Network tab as cURL
2. Paste the cURL comamnd, in the terminal, followed by `-sN | nbf --source=lobsters > output.html`

