---
schema: 1
id: 2026-11-27-skill-app-on-claude-artifacts-distilled
title: Hosting a skill-based conversation app on Claude artifacts
why: "What it takes to run a skill-driven chat app as a Claude artifact: the page builds the prompt and calls Claude, so hidden prompt content is visible, the viewer pays, and outside viewers can't write the db."
why_source: suggested
format: distilled
harness: claude-code
harness_version: 2.1.332
model: claude-opus-5-5
session_id: 252f8b97-a4a7-4d5f-993c-427ecbcc8730
started: "2026-11-27T04:36:50.197Z"
captured: "2026-11-27T06:05:00Z"
cwd: ~/Documents/proj/claude/spark/dots
mode: "skill:signals"
turns: 13
complete: true
golden_turns: [1, 3, 7, 9, 11, 13]
labels: [agent-runtime, platforms, system-design]
status: distilled
---

### 1 · **assistant:**

## Elevator pitch

A skill-driven chat app (a SKILL.md plus content files that steer a model through a conversation) can run entirely as a Claude artifact, with no server. The page becomes the host: it keeps the conversation log in browser storage, loads the skill from the artifact's db, rebuilds the full prompt every turn, and calls the viewer's own Claude through `sample`. You trade away three things a server gave you: a secret prompt, billing you control, and write access for people outside your organization.

## Highlights

- **The page is the server.** `sample` is memoryless and has no system-prompt field, so the page sends the skill as text on the first user turn and resends the whole conversation every turn, as a `[{role, content}]` list that ends on a user turn.
- **Nothing in the prompt is secret.** Whatever the page sends to Claude, the viewer can read in devtools. Putting it in the db doesn't hide it, because the page must read it to send it.
- **The viewer pays.** Every call spends the viewer's own Claude usage. The first call asks for consent, and a decline rejects with `not_granted` for the rest of that page load. Spend caps written to protect an operator's bill stop being needed.
- **Outside viewers can read but never write.** People outside the artifact's organization never write to its db, and they read it only when signed in through a public link or an email invite. Per-user data written to the db fails for them, and the only fix, inviting them as editors, also lets them edit the artifact.
- **256 KiB per call, for the whole conversation.** `maxPromptBytes` is 262,144 bytes across every turn's content, instructions included. Replies have no fixed cap but can come back `truncated`.
- **Turn off answer caching for chat.** By default an identical input within 5 minutes replays the stored answer.
- **The frame breaks `confirm()` and `alert()`.** They silently do nothing, so confirmations have to be built into the page.
- **Bundle to one file with an allowlist.** The artifact build pulls only pure, import-free modules from the existing app and fails on anything else.
- **Only Claude can write the db.** No script can, so updating the skill means asking Claude to sync it.

## Summary

The starting proposal: the skill lives in the artifact db, case state and conversations live in browser storage, and the page manages the conversation log and the system prompt for each Claude call. It holds up mechanically. `sample` is memoryless, and the streaming callback returns the whole text so far on each update. That means any logic that reads the model's own output markers keeps working, and a history format that already rebuilds the chat from a stored transcript each turn carries over unchanged. Desktop install is only a declaration (`desktop: {}` plus a button that calls `desktop.install.request()`).

The blocker was a hard line: "the hidden content never reaches the browser." With `sample` it always does. So did the system it would join: billing by the operator, cookie sessions, and files on a server. The artifact was not added as a third host that rewrites those rules. It became a separate, throwaway proof of concept in its own folder. The existing rules are scoped to the existing app's code paths and don't bind the new folder. The pure run-logic module, with no imports and no Node APIs, is reused unchanged by inlining it at build time.

Decisions taken: the skill and its content files live in the db, so they update without a republish. Sonnet is the only model, named explicitly. There is no feedback collection, because outside viewers can't write the db and Google Analytics is very likely blocked by the artifact CSP. Runs live in browser storage, wrapped in try/catch with an in-memory fallback. The build is a single inlined HTML file, the only upload. The db rules are root `read: view, write: owner`, and a check at lower access levels confirmed them.

Decisions avoided, and why:
- **A third host inside the existing app.** It would have overridden four stored hard lines: hidden content server-side, operator billing, cookie sessions, runs as server files.
- **Bundling the skill as artifact files (my recommendation).** The user chose the db so the skill updates without republishing. The cost: players must be signed in, plus access rules and a load timeout.
- **Hiding the prompt in the db.** Impossible, since the page has to read it in order to send it.
- **Per-user votes in the db.** Outside viewers can't write, and inviting them as editors gives away edit rights.
- **Google Analytics.** The CSP allows scripts from a few CDNs only and blocks fetch/XHR to other hosts. Untested.
- **Letting the platform pick the model tier.** Rejected for an explicit `model`. Outside the viewer's organization only released models answer, and a model that can't answer falls back to `modelTier`. Check `modelApplied`.
- **esbuild.** Rejected for a plain-text inline, because the shared module has no imports. esbuild was only there as a transitive dependency.
- **A page plus a files map.** Rejected for one file: one upload, no dependence on how relative imports are served, and what ships is visible.
- **The old per-run message cap.** It protected an operator's bill. It was replaced by a 2,000-character per-message cap and a total-bytes check before each call.

Still open: whether viewers outside the organization get `sample` at all, whether browser storage persists in the installed desktop window and whether it's shared with the browser tab, and first-word latency through `sample`.

*The turns below are a simplified conversation, written to drive the point.*

### 2 · **user:**

Artifacts can now be installed on desktop as standalone apps. I want to deploy my skill-based conversation app as a Claude artifact. The skill goes in the db, case state and conversations in browser storage, and the artifact page handles the conversation log along with the system prompt for making the Claude calls. WDYT?

### 3 · **assistant:**

It works, and it fits better than a server host, but one rule breaks.

**What works**
- **The page calls Claude through `sample`, which bills the viewer, not you.** Spend caps that protected an operator's bill no longer have a job, and you get real Claude without an API key.
- **Each call is memoryless, so the page resends the whole conversation every turn.** A history format that already rebuilds the chat from the stored transcript each turn carries over unchanged.
- **Logic that reads the model's own output still works.** The streaming callback hands back the *whole* reply so far each time, so detecting markers the skill emits is unchanged.
- **Per-player state in browser storage** matches a cookie-per-browser, no-accounts model.
- **Desktop install is a declaration,** `desktop: {}` plus an install button. No file, terminal or shortcut permissions are needed.

**The blocker: hidden content can't stay hidden.** The page has to send the system prompt, hidden content included, from the viewer's own browser, and no setting hides it. Putting it in the db doesn't help: if the page can read it to send it, so can devtools. Accept that, or don't use the artifact host.

**Unknowns:** whether people outside your organization get `sample` at all, and whether browser storage survives in the installed desktop window.

### 4 · **user:**

Instead of integrating with the existing app, let's create a Claude artifact variant as a PoC. WDYT?

### 5 · **assistant:**

Better call.
- **No stored rule has to change.** The conflicting decisions are scoped to the existing app's code path. A PoC in its own folder isn't bound by them, and its exceptions (hidden content in the page, viewer-billed, browser state) go in their own decision partition. Don't put it in a subfolder of the existing app, because that path would fall under the old rules.
- **It still shares the run logic.** The run-logic module has no imports and nothing Node-specific, so it runs in the browser unchanged. Inline it at build time instead of forking it, and the transcript format and history rebuild can't drift.
- **It's throwable.** If it lands, the "third host" decision comes back with evidence. If not, you delete one folder.

### 6 · **user:**

Keep the skill and its content in the db. Store a thumbs up or down per run per user in the db, and if Google Analytics works in artifacts, drop that. Claude Sonnet is the only model. What exactly should the PoC answer?

### 7 · **assistant:**

**1. Can outside viewers play, and can their vote be saved?** This one can sink it.
- **Writes:** people outside the artifact's organization can never write to its db. Friends on personal Claude accounts are outside it, so their votes can't be saved. The only way in is inviting them as editors, which also lets them edit the artifact.
- **Reads:** outside viewers read the db only when signed in through a public link or an email invite. With the skill in the db, a signed-out visitor can't load anything (`use("db")` resolves `null`).
- **Model:** for an artifact from outside the viewer's organization, only released models answer. A named model that can't answer falls back to `modelTier`.
- **Test:** open the shared link from a second, personal account.

**2. Does it feel live?**
- The first call shows a consent dialog, so treat that wait as normal, not as a failure.
- Each turn resends about 8 KB of instructions plus the run, well under the cap. Time to first word is unknown.
- **Turn off answer caching** (`cache: false`). Otherwise the same input within 5 minutes replays the stored answer.

**3. Does the skill behave the same** when its instructions arrive as the first user turn instead of a system prompt? Play one run end to end.

**4. Can Google Analytics run?** Artifact pages are sandboxed. Scripts load only from a few allowlisted CDNs, and fetch/XHR to other hosts is blocked. Probably not. Test it before relying on it.

**5. Does browser storage persist in the installed desktop app,** and is it shared with the same artifact in a browser tab? If not, one person gets two separate states.

**6. Is the db sync painless?** Edit, sync, and check that the next run picks it up without a republish.

### 8 · **user:**

Remove saving feedback for now, and no GA. What's the limit on turn message size?

### 9 · **assistant:**

- **Input:** at most **256 KiB (262,144 bytes) per call**, counting every message's content together. There's no separate system-prompt field, so the instructions count too.
- **It's a budget for the whole conversation, not per message,** because every turn resends everything. In this app: about 8 KB of instructions (skill 5.1 KB, a content file about 2.5 KB, app rules under 1 KB) plus about 7 KB for a long finished run, so about 15 KB, roughly 6% of the cap. A run would need to be about 30 times longer to hit it.
- **Output:** no fixed reply cap, but a reply can come back `truncated: true`. Show that honestly; don't treat it as a full reply.
- **Caps that protected an operator's bill don't apply.** Instead: about 2,000 characters per typed message, and a total-bytes check before each call with a clear error.

### 10 · **user:**

Can we have a bundle step that packages for artifact upload, so imports from the existing app are protected and we don't package the whole app? Correct me if I'm wrong.

### 11 · **assistant:**

Right shape.
- **One self-contained `dist/index.html`** with JS and CSS inlined is the only upload. Nothing depends on how the artifact serves relative files, and what ships is visible in one file.
- **Allowlist:** from the existing app, the bundle may take only the pure run-logic module and two vendor libraries (a markdown renderer and a sanitizer). Anything else fails the build. The build never writes into the existing app.
- **Correction: the skill isn't part of the bundle.** It lives in the db, and **no script can write an artifact's db; only Claude can,** through its artifact-data tool. So there are two flows: build then publish for code changes, and "ask Claude to sync" for skill changes, with no republish. The build prints that reminder.

### 12 · **user:**

Build it.

### 13 · **assistant:**

Built, published and synced. What the build taught:
- **`confirm()` and `alert()` are no-ops in the artifact frame,** so post and close confirmations are an in-page dialog.
- **Browser storage can throw or come back empty** (private windows, previews), so every read and write is in try/catch with an in-memory fallback. It's per artifact origin and survives republishes.
- **The theme follows the viewer.** Light and dark tokens sit under `prefers-color-scheme` *and* `data-theme`, with no in-app toggle.
- **Message shape:** the skill rides on the first user turn, roles alternate, consecutive same-role turns merge, and a user turn left without a reply merges into the next send.
- **No bundler needed.** The shared module has no imports, so the build strips `export` and inlines it, then fails if it ever gains imports.
- **db rules:** root `read: view, write: owner`. Verified by reading at the `view` level (works) and writing at the `interact` level (refused).
- **Content docs:** `content/skill` and `packs/<file-without-.md>` (dots aren't safe in path segments), loaded with a 10 s timeout. An empty db shows "ask the owner to sync."
- **Republishing:** rebuild, then publish the same `dist` path. Never patch `dist` in place, because the next build overwrites it.
- **Sync is diff-first.** When the db already matched the local files byte for byte, nothing was written.
- **A page that uses the db gets no automatic gallery thumbnail.** Set one from the Share menu.
- **Open decision:** the UI files are a copy, not shared, because the allowlist doesn't include the stylesheet. UI fixes in the existing app won't reach the PoC unless the allowlist grows.
