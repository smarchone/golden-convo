// Writes posts.json: the frontmatter of every session listed in index.json, so the index renders from one small file
// and a session's .md is fetched only when it is opened. Fails on a listed path that is missing or has no frontmatter.
// Usage: node tools/build-posts.mjs [out]   (needs js-yaml: npm i --no-save js-yaml@4.1.0)
import { readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';

const KEEP = ['title', 'why', 'captured', 'turns', 'golden_turns', 'labels', 'model', 'status', 'mode'];
const out = process.argv[2] || 'posts.json';

const posts = JSON.parse(readFileSync('index.json', 'utf8')).map(path => {
  const m = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`${path}: no frontmatter`);
  const fm = yaml.load(m[1]) || {};
  if (!fm.title || !fm.captured) throw new Error(`${path}: frontmatter needs title and captured`);
  const meta = Object.fromEntries(KEEP.filter(k => fm[k] != null).map(k => [k, fm[k]]));
  return { path, id: fm.id || path.split('/').pop().replace(/\.md$/, ''), fm: meta };
});

writeFileSync(out, JSON.stringify(posts) + '\n');
console.log(`${out}: ${posts.length} sessions`);
