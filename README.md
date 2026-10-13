# golden-convo

Landing zone for golden sessions: conversations with agents worth keeping. Captured with [`/golden`](https://github.com/smarchone/skills/tree/main/productivity/golden).

```
<YYYY-MM>/
  <YYYY-MM-DD>-<slug>.md     frontmatter (why, provenance, labels) + full text of every turn
index.json                   whitelist: the session paths the site publishes
index.html                   the site: renders the .md files in the browser
tools/build-posts.mjs        writes posts.json (each listed session's frontmatter) at deploy time
.github/workflows/pages.yml  builds posts.json and deploys to GitHub Pages on every push to main
```

Raw transcripts stay local; `source_path` points at them best-effort.

## Site

The index renders from `posts.json`, one small file with each listed session's title, why, date, golden turns and tags. A session's `.md` is fetched only when it is opened, then rendered with marked. `posts.json` is built by the pages workflow and never committed; pull requests run the same build, so a listed path that is missing or has broken frontmatter fails the check. Golden turns show in full; other turns fold into a row you can open. Readers can switch between terminal, reader and skim views.

Preview locally with `python3 -m http.server` and open `http://localhost:8000`. Without `posts.json` the page falls back to fetching every listed `.md` up front; to preview the built path, run `npm i --no-save js-yaml@4.1.0 && node tools/build-posts.mjs` first. The site shows only the sessions listed in `index.json`, so publishing one means adding its path there, and leaving a path out keeps that session off the site (the file stays in the repo and is still public).

`.nojekyll` stops GitHub Pages from converting the `.md` files to HTML.
