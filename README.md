# golden-convo

Landing zone for golden sessions: conversations with agents worth keeping. Captured with [`/golden`](https://github.com/smarchone/skills/tree/main/productivity/golden).

```
<YYYY-MM>/
  <YYYY-MM-DD>-<slug>.md     frontmatter (why, provenance, labels) + full text of every turn
index.json                   whitelist: the session paths the site publishes
index.html                   the site: renders the .md files in the browser
tools/build-posts.mjs        writes posts.json (each listed session's frontmatter) at deploy time
tools/serve.mjs              local preview: static files plus posts.json built per request
.github/workflows/pages.yml  builds posts.json and deploys to GitHub Pages on every push to main
```

Raw transcripts stay local; `source_path` points at them best-effort.

## Site

The index renders from `posts.json`, one small file with each listed session's title, why, date, golden turns and tags. A session's `.md` is fetched only when it is opened, then rendered with marked. `posts.json` is built by the pages workflow and never committed; pull requests run the same build, so a listed path that is missing or has broken frontmatter fails the check. Golden turns show in full; other turns fold into a row you can open. Readers can switch between terminal, reader and skim views.

Preview locally with `npm install` once, then `npm run dev`, and open `http://localhost:8000`. It builds `posts.json` on every request, so the preview loads like the deployed site and picks up edits on reload. A plain `python3 -m http.server` also works, but without `posts.json` the page falls back to fetching every listed `.md` up front. The site shows only the sessions listed in `index.json`, so publishing one means adding its path there, and leaving a path out keeps that session off the site (the file stays in the repo and is still public).

`.nojekyll` stops GitHub Pages from converting the `.md` files to HTML.
