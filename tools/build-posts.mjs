// Builds posts.json: the frontmatter of every session, so the index renders from one small file and a session's .md
// is fetched only when it is opened. Sessions listed in index.json show on the index; every other session file is
// emitted with `unlisted: true`, so its #id link still opens while the index leaves it out.
// Fails on a listed path that is missing or has no frontmatter; an unlisted file with broken frontmatter is skipped.
// It also writes <id>.md next to the output (the same id as the #<id> link): each session's markdown without its frontmatter, a plain URL for agents.
// Usage: node tools/build-posts.mjs [out]   (npm install first, for js-yaml). tools/serve.mjs reuses buildPosts().
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const KEEP = ['title', 'why', 'captured', 'turns', 'golden_turns', 'labels', 'model', 'status', 'mode'];

function post(path) {
  const m = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`${path}: no frontmatter`);
  const fm = yaml.load(m[1]) || {};
  if (!fm.title || !fm.captured) throw new Error(`${path}: frontmatter needs title and captured`);
  const meta = Object.fromEntries(KEEP.filter(k => fm[k] != null).map(k => [k, fm[k]]));
  return { path, id: fm.id || path.split('/').pop().replace(/\.md$/, ''), fm: meta };
}

// Every <YYYY-MM>/<file>.md in the repo.
function sessionFiles() {
  return readdirSync('.', { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{4}-\d{2}$/.test(d.name))
    .flatMap(d => readdirSync(d.name).filter(f => f.endsWith('.md')).map(f => `${d.name}/${f}`));
}

// A session's markdown with the frontmatter removed: just the turns.
export function rawBody(path) {
  return readFileSync(path, 'utf8').replace(/^---\n[\s\S]*?\n---\n?/, '').trim() + '\n';
}

export function buildPosts() {
  const listed = JSON.parse(readFileSync('index.json', 'utf8'));
  const posts = listed.map(post);
  for (const path of sessionFiles()) {
    if (listed.includes(path)) continue;
    try { posts.push({ ...post(path), unlisted: true }); }
    catch (err) { console.warn(`skipped unlisted ${err.message}`); }
  }
  return posts;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2] || 'posts.json';
  const posts = buildPosts();
  writeFileSync(out, JSON.stringify(posts) + '\n');
  const dir = dirname(out);
  mkdirSync(dir, { recursive: true });
  for (const p of posts) writeFileSync(join(dir, `${p.id}.md`), rawBody(p.path));
  const hidden = posts.filter(p => p.unlisted).length;
  console.log(`${out}: ${posts.length - hidden} listed, ${hidden} unlisted sessions, raw markdown as <id>.md`);
}
