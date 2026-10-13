# golden-convo

Landing zone for golden sessions: conversations with agents worth keeping. Captured with [`/golden`](https://github.com/smarchone/skills/tree/main/productivity/golden).

```
<YYYY-MM>/
  <YYYY-MM-DD>-<slug>.md     frontmatter (why, provenance, labels) + full text of every turn
index.json                   list of session paths the site loads
index.html                   the site: renders the .md files in the browser, no build
```

Raw transcripts stay local; `source_path` points at them best-effort.

## Site

`index.html` fetches each path in `index.json` and renders it with marked. Golden turns show in full; other turns fold into a row you can open. Readers can switch between terminal, reader and skim views.

Preview locally with `python3 -m http.server` and open `http://localhost:8000`. When you add a session, add its path to `index.json`:

```sh
ls 20*/*.md | python3 -c "import sys,json; print(json.dumps(sorted(l.strip() for l in sys.stdin), indent=2))" > index.json
```

`.nojekyll` stops GitHub Pages from converting the `.md` files to HTML.
