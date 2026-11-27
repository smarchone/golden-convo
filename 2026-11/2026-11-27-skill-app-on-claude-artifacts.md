---
schema: 1
id: 2026-11-27-skill-app-on-claude-artifacts
title: Hosting a skill-based conversation app on Claude artifacts
why: "What it takes to run a skill-driven chat app as a Claude artifact: the page builds the prompt and calls Claude, so hidden prompt content is visible, the viewer pays, and outside viewers can't write the db."
why_source: suggested
harness: claude-code
harness_version: 2.1.332
model: claude-opus-5-5
session_id: 252f8b97-a4a7-4d5f-993c-427ecbcc8730
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-dots/252f8b97-a4a7-4d5f-993c-427ecbcc8730.jsonl
started: "2026-11-27T04:36:50.197Z"
captured: "2026-11-27T05:28:37Z"
cwd: ~/Documents/proj/claude/spark/dots
mode: "skill:signals"
turns: 20
complete: true
golden_turns: [2, 8, 10, 12, 18]
labels: [agent-runtime, platforms, system-design]
status: raw
---

### 1 · **user:**

for the recent claude artifact update where artifacts can be installed on desktop as standalone apps, i want to support deploying <app> as a claude artifact.

the skill on db.
case state and conversations in browser storage.
the artifact page handling the conversation log along with system prompt for making the claude calls.

WDYT ?

### 2 · **assistant:**

I think it works, and it fits better than the Worker does. One stored rule breaks, though, and that needs a decision from you.

**What works**

- **Claude calls from the page (`sample`) bill the person playing, not you.** <redacted>
- **Each Claude call starts with no memory, so the page resends the whole conversation every turn.** <redacted>
- **Phase detection still works on streamed text.** The streaming callback hands back the whole reply each time, so checking for <redacted> is unchanged.
<redacted>
- **Desktop install is just a declaration.** It's `desktop: {}` plus an install button. You don't need any of the file, terminal or shortcut permissions.

**The blocker: "The pack never reaches the browser"**

With `sample`, the page has to send the system prompt, pack included, from the viewer's own browser. No setting hides it from them. Putting the pack in the db doesn't help: if the page can read it to send it, so can the viewer's devtools. A curious player can read the root cause before playing.

I'd accept this, but only for the artifact host. The Node and Worker hosts keep the rule. Players are on their own bill and only cheat themselves. If keeping the answer hidden matters more than that, the artifact host doesn't work.

**Two changes I'd make**

1. **Keep the skill and packs out of the db and bundle them as artifact files when publishing.** The Worker already bundles them from `../<skill>` at deploy time, and the artifact can do the same. The db only helps if you want to edit packs without republishing. The cost is access rules, a signed-in requirement, and load timeouts, and republishing is one command anyway.
2. <redacted>

**Unknowns to check before building**

- Whether people you share it with, especially public-link visitors outside your org, get `sample` at all. If they don't, they can't play.
- Whether browser storage survives in the installed desktop window.

If this direction looks right, I'll record it as a decision with `/signals update` (artifact host, pack visible on that host, viewer-billed) and then start building.

### 3 · **user:**

/reload-skills

/signals update

for get .docs/signals. 
lets follow the new signals skill (.signals)

### 4 · **assistant:**

<redacted>

### 5 · **user:**

instead of integrating with existing, lets create a claude artifact variant of <app> as poc. WDYT ?

### 6 · **assistant:**

Yes, I think that's the better call. A PoC in its own folder avoids rewriting four hard lines just to try an idea.

**Why it works**
<redacted>
- **It can still share the run logic.** `core.js` has no imports and nothing Node-specific, so it runs in the browser unchanged. If the PoC copies it in when publishing, instead of forking it, the run format, phase detection and history-rebuild logic can't drift apart. Gemini rebuilds its chat from the run file each turn, which is the same pattern the page would use.
- **It can be thrown away.** If the PoC lands, you decide then whether it becomes a real host, and the narrowing-by-host review comes back with evidence behind it. If it doesn't, you delete one folder.

**What I'd keep minimal in the PoC**
- **Skill and packs:** bundled as artifact files when publishing, not stored in the db. That means no access rules, no sign-in requirement and no load timeout. You can switch to the db later if you want to update packs without republishing.
- **Runs and trials:** kept in browser storage as the same run markdown.
- <redacted>
- **Desktop install:** `desktop: {}` plus an install button.

**Questions the PoC should answer**
- Can people you share it with, outside your org, use the Claude calls at all?
- Does browser storage survive in the installed desktop window?
- Is the reply speed fine on whatever model Claude picks by default?

If you agree, I'll rewrite the session drafts into one short `arch/artifact-poc` review with no conflicts, then build it.

### 7 · **user:**

i want to keep skill and packs in db.
no post or votes in db - we can store feedback thumbsup or down per case run per user in db. if GA works in artifacts, we can drop collecting the feedback in claude db.
in artifact claude is the only model to use (sonnet).

elaborate what "Questions the PoC should answer" are

### 8 · **assistant:**

I moved your three steers into the drafts in `.signals/session/2026-11-27-artifact-host.md`:
- The skill and packs live in the db.
- Only the 👍/👎 is saved, one per user per case run, and none of it if Google Analytics works in an artifact.
- Sonnet is the only model.

While checking the platform's API definitions I found a problem with the feedback steer. The first question below covers it.

## Questions the PoC should answer

**1. Can your friends actually play, and can their vote be saved?**
This is the one that can sink it.
- **Writing:** People outside your organization can never write to the artifact's db. Most friends will be on their own Claude accounts, which puts them outside it, so their 👍/👎 can't be saved. The only way to give them write access is to invite them as editors, and editors can also change the artifact itself.
- **Reading:** Outside viewers can read the db only when they're signed in and came through a public link or an email invite. Since the skill and packs live there, a signed-out visitor can't load a case at all.
- **Claude calls:** For an artifact from outside their organization, only publicly released models answer. Sonnet 5.5 is released, so that part should be fine.
- **Test:** open the shared link from a second, personal Claude account. Check that a case loads, that Claude replies, and that the vote saves.
- **If the vote fails:** keep it in browser storage and show it <redacted> so a player can screenshot it, or fall back to Google Analytics (question 4).

**2. Does it feel like a teammate?**
- The first Claude call asks the player for permission, so the first "Let's start" has an extra step. <redacted> has to treat that wait as normal, not as a failure.
- Each turn resends everything: about 8 KB of instructions (SKILL.md plus a pack) and up to about 7 KB of run. That's well under the request size limit, so size isn't a problem. What I can't predict is how long the first word takes on Sonnet through these calls, compared with the Node server.
- Answer caching has to be off. With it on, sending the same message twice within 5 minutes replays the old answer.
- **Test:** time the first word on 5 turns and compare with the Node server.

<redacted>

**4. Can Google Analytics run inside an artifact?**
- Artifact pages are sandboxed. I found nothing in the API definitions saying a page can load outside scripts or send data to other sites. My guess is that GA is blocked, but I haven't verified it.
- **Test:** add the GA tag and check whether an event reaches your GA dashboard. If it does, the db feedback goes.

**5. Do runs survive in the installed desktop app?**
- Runs and trials live in browser storage. I don't know whether the installed desktop window keeps that storage between launches, or whether it shares it with the same artifact opened in a browser tab. If it shares, a player's runs follow them. If it doesn't, <redacted>.
- **Test:** play part of a case, quit the app, reopen it, then open the same link in a browser.

**6. Is syncing the skill to the db painless?**
- The sync step copies SKILL.md and the packs from `../<skill>` into the db. If one sync command plus a reload picks up a skill change without republishing, the db choice has paid for itself.
- **Test:** edit a pack, sync, and confirm the next run uses the edit.

<redacted>

### 9 · **user:**

lets remove saving feedback for now.
whats the limit to the turn message size ?
no GA for now.
skill and packs from db.

### 10 · **assistant:**

<redacted>

**Message size limits for a turn**

- **What you send:** at most **256 KiB (262,144 bytes) per Claude call**, counting every message in the call together. There's no separate system-prompt field, so the instructions count against that too.
- **This is a budget for the whole run, not each message.** Every turn resends the instructions plus the conversation so far. Roughly:
  - Instructions: about 8 KB (SKILL.md is 5.1 KB, a pack about 2.5 KB, pilot rules under 1 KB).
  - A finished run: the longest local runs are about 7 KB.
  - Total: about 15 KB, so a typical run uses around 6% of the limit. A run would need to be about 30 times longer than today's before hitting it.
- **What comes back:** the API definitions give no fixed limit on reply length. An answer that gets cut short comes back flagged as cut short. The page should show that honestly, not treat it as a normal reply.
<redacted>

What I'd do in the PoC is cap each typed message at about 2,000 characters, and before each call check the total size and show a clear error if it would go over. These are small implementation choices, so I won't record them as decisions unless you want them recorded.

I'm ready to build `<app>-artifact/` next.

### 11 · **user:**

can we have a bundle step that packages for artifact upload, so that imports from <app>/ are protected and we dont have to package the entire <app>/ for artifact ?? WDYT ? cmiiw

### 12 · **assistant:**

Yes, you're right. A small bundle step is the right shape. The PoC imports only what it needs from `<app>/`, and the upload contains only what the bundle produced.

```
<app>-artifact/
  src/index.html, app.js, style.css    ← PoC source
  build.mjs                            ← bundle step
  dist/index.html                      ← the only thing uploaded
```

**What `build.mjs` does**
1. It bundles `src/app.js` with esbuild. Since `app.js` imports `../../<app>/core.js`, only that file gets pulled in.
2. It inlines the JS and CSS, plus `marked` and `purify` from `<app>/public/vendor/`, into one self-contained `dist/index.html`.
3. It enforces an allowlist: if the bundle pulls in any `<app>/` file other than `core.js` and those two vendor files, the build fails. That protects against the bundle quietly growing to pull in more of the app.
4. It never writes inside `<app>/`.

I'd go with one inlined HTML file rather than a page plus separate files. Publishing is then a single file, nothing depends on how the artifact serves relative imports, and you can see exactly what ships by looking at one file.

**One correction: the skill and packs aren't part of the bundle.** They live in the db, so they're a separate sync step. A script can't write to the artifact's db; only I can, through the artifact data tool. So the flow is:
- `node build.mjs`, then I publish `dist/index.html`. You do this when the code changes.
- "sync the skill": I read `<skill>/SKILL.md` and the 3 packs and write them to the db. You do this when the skill changes, with no republish.

This is build tooling, so I'm not recording it as a signals decision.

Should I build `<app>-artifact/` this way?

### 13 · **user:**

/signals update

### 14 · **assistant:**

<redacted>

### 15 · **user:**

after bundle run.. just remind to ask claude to sync the skill/pack if needed

### 16 · **assistant:**

<redacted>

Committed. Now building `<app>-artifact/`. First, the existing client and run logic:

### 17 · **user:**

continue

### 18 · **assistant:**

Picking up the build. I'm checking the db, desktop and sample APIs I'll call:

Now the page template:

Now the app itself. The browser does the server's job here: runs live in browser storage, and Claude is called through `sample`.

Two fixes before building. A reply that finishes after its run was closed must still clear the busy flag, and an open run restored at boot should re-render once the packs load:

Now the bundle step, with the allowlist enforced:

The build works and the allowlist guard fails as it should. Next, a quick check of the message shape Claude receives:

Messages alternate correctly, the instructions ride on the first user turn, and messages left without a reply merge into the next send. Publishing (artifacts start private):

Published. Now the first sync of the skill and packs into its db:

Synced. Next, one functional check: reading back as a view-only viewer, then trying a write at the contributor level, which should be refused:

Rules hold: view-only viewers can read the packs, and a contributor-level write is refused. Last, a README with the URL and workflow, plus a gitignore for `dist/`:

The PoC is built and published at **<redacted>**, and the skill and 3 packs are synced into its db. I haven't played a case: I can't run the Claude calls from here, so the first real test is you opening the link.

**What I checked**
- **Build:** produces a single 110 KB `dist/index.html`, and its script passes a syntax check.
- **Allowlist:** pointing the app at `<app>/server.js` fails the build with a clear error.
- **Messages to Claude:** the instructions go on the first message, the turns alternate correctly, and if a reply fails, the player's unanswered message is merged into their next one.
- **Database access:** a view-only viewer can read the packs, and a contributor-level write to the skill is refused.

**How it differs from the Node app**
- **Confirmations are built into the page.** The artifact frame silently ignores `confirm()` and `alert()`, so posting to the channel and closing a run use the page's own confirm dialog.
- **The theme follows the viewer's Claude theme**, so there's no theme toggle.
- **No 👍/👎 row.** The run just ends with "Run complete."
- **Message limits:** 2,000 characters per typed message, and a clear error if a whole run would go past 256 KB.
- **Install as app** shows in the sidebar only where the Claude desktop app offers installing.
- **Players need to be signed in to Claude**, because the packs load from the db.

**Decision for you: the UI is a copy, not shared.** `src/app.js` and `src/style.css` are copies of the <app> client, because the allowlist only permits `core.js` and the two vendor libraries. UI fixes made in `<app>/` won't reach the PoC. If you'd rather share the stylesheet, I'd add `public/style.css` to the allowlist. That changes the bundle decision, so I'd run it through `/signals update` first.

**Next steps**
1. **Open the link and play one case end to end.** The first "Let's start" asks you to allow Claude.
2. **Share it with one friend on a personal Claude account.** That covers the biggest open question: whether outside viewers can load the packs and get replies. The artifact is private, so nobody else can open it until you share it from its Share menu.
3. **Optionally add a thumbnail.** Pages that use a db get no automatic preview image in the gallery or link previews; you can set one from the Share menu.

To ship code changes, run `node <app>-artifact/build.mjs` and then ask me to publish. For skill or pack changes, ask me to "sync the <app> skill and packs to the artifact db", with no republish. The README in `<app>-artifact/` has both steps. Nothing is committed to git yet, including `.signals/`.

### 19 · **user:**

sync the <app> skill and packs to the artifact db

### 20 · **assistant:**

I didn't write anything to the db: it already matches your local files exactly. `SKILL.md` and all 3 packs are byte-for-byte identical to the copies I synced earlier, and nothing in `<skill>/` has changed since its last commit, 7 days ago.

Next time you edit the skill or a pack, ask again and I'll push just the files that changed.
