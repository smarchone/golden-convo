---
schema: 1
id: 2026-11-26-claude-artifacts-as-a-skill-driven-app-platform
title: "Claude artifacts as a skill-driven app platform: bridge, runtime, state, and why the page is the harness"
why: Artifacts aren't apps that own their powers — the page holds handles, the host is the authority, so the page must orchestrate memory, state and skill rules itself.
why_source: suggested
harness: claude-code
harness_version: 2.1.332
model: claude-opus-5-5
session_id: 17bbff75-78b7-4134-91cb-84954c403bbd
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-variants/17bbff75-78b7-4134-91cb-84954c403bbd.jsonl
started: "2026-11-26T21:47:21.070Z"
captured: "2026-11-26T23:24:25Z"
cwd: ~/Documents/proj/claude/spark/variants
mode: "skill:productivity:intuition-panel"
turns: 48
complete: true
golden_turns: [22, 30, 36, 46]
labels: [platforms, agent-runtime, agents, product-idea, context-infra]
status: raw
---

### 1 · **user:**

/productivity:intuition-panel with the recent claude apps, can we create skills based apps ?

### 2 · **assistant:**

**CEO:** Yes. A skill is already an app without a screen: it holds the know-how and the steps. Claude's newer apps can publish live pages that save data and ask Claude questions. Put the two together and the skill becomes the app's logic, with the page as the part people see. The new idea is that you write the app in plain words, not in code.

**PM:** The test is whether someone comes back to it on day two. Take a "trip planner" skill. Today you rerun it in chat. As an app, it's a page you reopen that remembers your trips and has a "replan" button that sends the skill back to work. Is the person using this the one who wrote the skill, or someone who never sees a prompt?

**Architect:** The skill only runs when Claude runs. The page can't carry the skill's instructions by itself. It has to call Claude every time it needs thinking done. That means each click costs seconds and tokens, so anything that has to answer instantly stays in the page's own code.
```
 SKILL.md  ──(Claude runs it)──▶  publishes / updates
  (logic)                              │
                                       ▼
 user ◀──── page (state + buttons) ── asks Claude when it needs thinking
```

**Your move:** Pick one: (a) who uses it, the skill's author or an end user who never sees the skill; (b) one example skill to turn into an app; (c) the line between what Claude decides and what the page decides by itself.

### 3 · **user:**

how does it work ? i want to create a skill based conversation interface

### 4 · **assistant:**

**CEO:** The skill takes the place of a system prompt. Each turn, Claude reads the user's message with the skill already loaded, so the skill sets how the conversation behaves: its persona, its steps, and when it stops. Your interface is a chat box with a skill underneath. Swap the skill and you get a different app with the same UI.

**PM:** The moment people notice is when the conversation feels guided, not open-ended. A "mock interview" skill asks one question, scores your answer, then gets harder. It never drifts off into general chat. What should the user feel the skill is doing that a plain chatbot wouldn't?

**Architect:** There are two places to run it. Inside Claude, you type `/skill` and the chat itself becomes the interface, like this panel does. In your own app, the Agent SDK or the API loads the skill folder and runs the loop, and your UI just shows the turns. In both cases, every turn replays the whole conversation plus the skill. Long sessions get slower and cost more, so the skill should write its state down rather than rely on memory.
```
 user msg ─▶ [ SKILL.md + history + state ] ─▶ Claude ─▶ reply
                    ▲                                 │
                    └──── state file / page data ◀────┘
```

**Your move:** Pick one: (a) run it inside Claude with a slash command or in your own app with a custom UI; (b) name the first skill-driven conversation you want to build; (c) what gets saved between turns.

### 5 · **user:**

im taking in the context of claude apps.

### 6 · **assistant:**

**CEO:** Then you don't build an interface, because Claude's chat is the interface. You write a skill, people install it, and the conversation turns into your app whenever they call it. What you're really designing is how the conversation goes: the opening line, the turns, and how it ends. This panel works exactly that way.

**PM:** The first thirty seconds decide it. The user types `/coach` or just says "help me prep for my interview." The skill takes over with one sharp question instead of a block of text. Each reply keeps the same shape, so it feels like a product and not a chatbot. What's your opening line?

**Architect:** It has three parts. A `SKILL.md` holds the rules. Its one-line description decides when Claude loads it on its own, and a slash command loads it every time. An optional artifact page adds a screen that can save progress and ask Claude questions on its own. The hard limit is that you don't control the chat window, only what's said in it, and the artifact runs as its own Claude call, separate from the chat.
```
 install skill ─▶ user types /name or matching ask
                      │
                      ▼
   chat = UI  ◀── SKILL.md sets each turn's format
                      │ (optional)
                      ▼
   artifact page ── saves state, asks Claude by itself
```

**Your move:** Pick one: (a) draft the opening line and turn format of your first skill; (b) decide whether it needs an artifact screen or chat alone is enough; (c) how it ends, and what the user takes away.

### 7 · **user:**

get context of the recent release of claude apps

### 8 · **assistant:**

**CEO:** Two releases on November 24 give you the pieces. **Install as app** turns an artifact into a Mac or Windows app that uses your Claude account. **Skills over MCP** lets a connector bring its own skills along, so users don't install anything separately. That gives you skills for behavior, MCP for delivery, and an artifact for the screen. Two weeks earlier, apps also started opening right next to the chat.

**PM:** For the user, it looks like a "Coach" icon in their dock that opens to a guided conversation, with no `/command` to remember. Inside chat, they connect the MCP server once and the skill turns on whenever their request matches. So the question is whether your users start from chat or from a desktop icon.

**Architect:** The key limitation is that none of the pages say an installed app can load a skill. They say the app can call Claude and use connectors, and that each call counts toward the user's plan. So in an installed app, the skill's rules would have to be built into the page or delivered by your MCP server. Both kinds of app need the user online and signed in. Permission resets with every update, and full computer access is limited to apps you made yourself or, on Team and Enterprise plans, apps made inside your org.
```
 Inside chat:   user ─▶ chat ─▶ MCP server ─ ships SKILL ─▶ Claude follows it
 Desktop app:   user ─▶ installed artifact ─ calls Claude (plan usage)
                              └─ skill must live in page or come via MCP
```

**Your move:** Pick one: (a) deliver it as an MCP server with a skill, so it lives inside chat; (b) build an installed artifact app with its own chat window; (c) do both, with the same skill serving chat and the app.

Sources: [Claude release notes](https://support.claude.com/en/articles/12138966-release-notes) · [Install as app](https://claude.com/resources/articles/install-as-app) · [Skills over MCP](https://claude.com/resources/articles/skills-over-mcp-tasks-and-more) · [Interactive connectors](https://claude.com/resources/articles/interactive-connectors-full-tool) · [Sheets, Whiteboards, Data](https://claude.com/resources/articles/sheets-whiteboards-data) · [SiliconANGLE](https://siliconangle.com/2026/11/24/anthropic-is-trying-to-kill-traditional-desktop-apps-with-claude-generated-desktop-apps/)

### 9 · **user:**

what are claude artifacts ?

### 10 · **assistant:**

**CEO:** An artifact is something Claude makes that lives on its own page, outside the chat. It can be a document, a deck, a sheet, a dashboard, or a small working app. Chat is where you talk, and the artifact is what you keep. Now that artifacts can be installed as desktop apps, they're becoming the way Claude ships software.

**PM:** Say you ask for a habit tracker. You get a page with checkboxes that remembers what you ticked and has a link you can share. If you say "add streaks," Claude updates that same page and doesn't start a new one. For your idea, the artifact is the screen your skill-driven conversation runs in.

**Architect:** Under the hood, an artifact is an HTML page that Claude writes and republishes, and every edit makes a new version. It starts private, and sharing is up to you. By default it can only do what a browser can. To do more, it declares capabilities such as saving data, sharing state across viewers, reading your connectors, or asking Claude a question, and each call to Claude counts against the user's plan. The limit: the page holds whatever logic Claude wrote into it, not the chat's skills.
```
 chat ──Claude writes/edits──▶ artifact (HTML, versioned)
                                  │ capabilities
                ┌─────────────────┼──────────────────┐
             save data       ask Claude          connectors
                                  │
                       Share ▶ link  |  Install ▶ desktop app
```

**Your move:** Pick one: (a) build a tiny artifact chat page right now to feel it; (b) choose which capabilities your conversation app needs; (c) work out how the skill's rules get into the page.

### 11 · **user:**

is it an iframe or sandboxed js runtime ... ???

### 12 · **assistant:**

**CEO:** It's both. In Claude it's a sandboxed iframe on its own separate origin, and the JavaScript runs there. It's still a regular web page, not a custom runtime. The only unusual thing is the bridge it gets for calling Claude.

**PM:** In practice, ordinary web code like React, canvas, and localStorage-style state works as you'd expect. What doesn't work is reaching the outside world freely: no random `fetch` to your server and no reading the parent chat. A chat UI you build in it feels like a normal web app. It just talks to Claude, not to your own backend.

**Architect:** Here's how it works. The page loads in an iframe on an isolated domain, with a strict content security policy that blocks arbitrary network calls. The capabilities the page declares show up as a `window.claude.*` API, which passes messages to the host, and the host does the real work: asking Claude, storage, connectors. An installed app runs the same page in its own desktop window, and the permission tiers add the OS-level powers. The docs don't say which webview it uses, so treat that as unknown.
```
 claude.ai (host) ──postMessage bridge──▶ iframe (sandboxed origin)
   │  Claude calls, storage, connectors       │  your HTML/JS
   └──────────── window.claude.* ◀────────────┘  CSP: no free fetch
 Install as app ▶ same page, own window + permission tiers (OS powers)
```

**Your move:** Pick one: (a) I load the capabilities reference and show the actual `window.claude` calls a chat page would use; (b) test what the sandbox blocks with a tiny probe artifact; (c) go back to how the skill's rules get into that iframe.

### 13 · **user:**

how does claude manage the state of the artifact ?

### 14 · **assistant:**

**CEO:** Claude doesn't keep the state itself. The page keeps it, and how long it lasts depends on where it's saved. There are three places to save, plus a live channel that saves nothing. That matters for your idea, because a conversation app's memory has to live in one of those places.

**PM:** For a skill-driven chat, the transcript and progress ("question 3 of 5, scored 7/10") go in `db`, so the user can close the window and pick up where they left off. A draft they're typing can stay in browser storage. Use the page-republishes-itself option only when the page itself is the record, like a finished scorecard you share.

**Architect:** Here's what each option does. **Browser storage** is per viewer, and neither Claude nor other viewers can see it. **`artifact`**: the page saves its whole HTML as a new version. Every open copy reloads to that version, and when two people save at once, one save wins and the other is dropped. **`db`**: documents stored outside the page with access rules and live updates. They survive republishes, and Claude can read or seed them from the chat. **`room`**: presence and messages for whoever has the page open right now, and nothing persists. The catch for you: `sample`, the "ask Claude" call, has no memory between calls. Every turn, the page has to send the skill's rules, the history and the current state.
```
 turn N:  page ─▶ sample([SKILL rules] + history + state) ─▶ reply
            ▲                                                 │
            └──── db: transcript, step, score ◀── page saves ─┘
 Claude in chat ──reads/seeds db──┘   (and republishes the page = new version)
```

**Your move:** Pick one: (a) decide what each turn sends to `sample` (full history or a running summary); (b) I build a tiny skill-driven chat artifact on `db` + `sample` so you can try it; (c) let chat-Claude watch the `db` transcript and adjust the page between sessions.

### 15 · **user:**

explain the bridge, runtime and state in :
- artifact in iframe
- artifact in desktop claude app
- artifact in any other form that i missed

### 16 · **assistant:**

**CEO:** The page is the same everywhere. What changes is the host around it. Each form gives you the same `claude.use(name)` bridge, and the host decides which capabilities answer and which return `null`. So you build one page and let each host switch features on or off.

**PM:** In practice, your chat app works on the web with `sample` and `db`. Installed on a desktop, it also gets a tray icon and global shortcuts. On a phone it works but has no voice output, and a public-link visitor gets a read-only view. The page has to look complete in every one of these, never broken.

**Architect:** One page, several hosts. State saved in `db` or as artifact versions lives on the server, so every form sees the same data. Only browser storage stays on one device.
```
 FORM                    RUNTIME                    BRIDGE answers                 STATE
 ───────────────────────────────────────────────────────────────────────────────────────────
 claude.ai web           sandboxed iframe,          sample, db, artifact, mcp,     db + versions (server)
 (beside chat/full)      isolated origin + CSP      room, user, dictation*, tts*   browser storage (this tab)
 Desktop app, in chat    same iframe inside the     same + host:<local MCP>,       same
                         app's window               host:claude_browser
 Installed as app        own window + icon,         all above + desktop: fs,       same server state
                         permission tiers           processes, tray, shortcuts,    + local disk (full access)
                                                    notifications — asks per version
 Mobile app (iOS/And.)   in-app web view            core caps; tts null,           same server state
                                                    dictation null
 Shared link / outside   same iframe, viewer        mcp, comments, user, tts,      read-only, or db per rules
 viewer / guest          scoped by role             files → null for outsiders
 Typed artifact          type's fixed page +        whatever the type grants       your data files / type store
 (Docs, Slides, Sheets)  your data files            (not installable)
 Published from          same viewer as web;        + files (reads the project)    same
 Claude Code             Code session can watch
 * dictation: Chromium/desktop main window only; tts: not Safari/mobile
```
The bridge's transport isn't documented. It's only promised as `claude.use()` returning a frozen namespace or `null`. Consent prompts come on the first call, not when you call `use()`.

**Your move:** Pick one: (a) choose the host your conversation app targets first, web or installed; (b) design how it degrades when `sample` or `db` is `null`; (c) I build a probe artifact that reports which capabilities answer in each host you open it in.

### 17 · **user:**

currently the db is managed by claude platform ?

### 18 · **assistant:**

**CEO:** Yes. `db` is hosted by Claude, belongs to that one artifact, and comes with no setup: no database to run, no keys, no backend. That's what makes a skill-driven app possible with no code on your side. The tradeoff is that your data lives on Anthropic's platform, under their rules.

**PM:** For your chat app, each user's transcript can live under `data/users/<id>/`, which stays private even from you as the owner. Shared data, like a leaderboard or the coach's question bank, sits in a shared collection. The user never signs up for anything, because their Claude account is their identity.

**Architect:** Here's what's documented. Data is stored as documents and collections, each guarded by access rules (`view < interact < admin < owner`). Pages see changes live through `onSnapshot`, and the data survives republishes. Only two things can reach it: the page (through the bridge) and Claude in a chat session (through ArtifactData reads and writes). The guidance says not to store secrets there, and to treat shared data as untrusted. What I didn't find documented: storage quotas, export, region or retention, or any way for your own server to reach it directly. If you need your own database, run it behind an MCP connector the page calls through `mcp`.
```
           ┌──────── Claude platform ────────┐
 page ─bridge─▶  artifact db (docs + rules)  ◀─ArtifactData─ Claude (chat/Code)
           └─────────────────────────────────┘
 your own DB? ─▶ expose via MCP connector ─▶ page calls it through `mcp`
```

**Your move:** Pick one: (a) keep everything in the platform `db` for a zero-backend v1; (b) put user data in your own store behind MCP; (c) map which data is private per user and which is shared in your conversation app.

### 19 · **user:**

artifacts can use connectors via claue ?

artifacts can use connectors via claude ?

### 20 · **assistant:**

**CEO:** Yes, but they don't go through Claude. The page calls the connector itself through the bridge, using the viewer's own credentials, with no model involved. If you want Claude to decide which connector to call, you wire the two together yourself.

**PM:** Say your coach skill wants your calendar. The page calls the Google Calendar connector straight away to show "interview Thursday 2pm," which is fast and costs nothing. To ask "plan my prep around my week," the page gives Claude a calendar tool, and Claude decides when to use it. Same connector, two different feels: direct data vs. a Claude agent.

**Architect:** It works like this. You declare `mcp: {servers: [{server, tools}]}` with an exact list of tools, never "all tools." The viewer approves it once, and the access tokens are never shown to the page. Use `watchTool` to show data and `callTool` for actions. Viewers from outside your org get `null`. `host:<local server>` works only in the desktop app. Claude in the loop: `sample` accepts `tools: [{name, execute}]`. Those are functions on the page, so the page's `execute` calls `mcp.callTool`, and Claude never touches the connector directly.
```
 direct:   page ──mcp.callTool──▶ bridge ──viewer creds──▶ connector
 agentic:  page ──sample(prompt, tools:[cal])──▶ Claude
                      ◀── "call cal({week})" ──┘
           page.execute ──mcp.callTool──▶ connector ──result──▶ back to Claude
```

**Your move:** Pick one: (a) choose which connectors your conversation app needs and whether each is direct or agentic; (b) let the skill's rules decide when Claude calls tools in `sample`; (c) I build a small probe that does one direct connector call and one agentic call.

### 21 · **user:**

so an artiact can:
- republish
- store data in local/browserstorage
- store data in claude db
- call mcp via bridge
- use claude 

cmiiw. did i miss anything ?

### 22 · **assistant:**

**CEO:** Your five are right, and they're the core of it. What you're missing falls into three groups: knowing **who** is viewing, **live presence**, and **device and media** abilities. Add those and an artifact is a complete small app platform, not just a page.

**PM:** For your conversation app, `user` gives you identity, and `tts` plus `dictation` turn the coach into a voice conversation. `room` lets two people do a mock interview together live. Those three change how it feels far more than anything else on the list.

**Architect:** The full set, with your five marked ✓:
```
 STATE      ✓ artifact (republish)  ✓ browser storage  ✓ db
            + assets     upload/store files (images, PDFs, 20 MiB cap)
 CLAUDE     ✓ sample     memoryless; + page tools, images, model tiers
 OUTSIDE    ✓ mcp        connectors with viewer creds; host:<local> on desktop
            + files      read a Claude Code project's files
 PEOPLE     + user       who's viewing, owner/editor, profiles
            + room       live presence + messages, nothing persists
            + comments   hook page UI into the shell's comment threads
 DEVICE     + dictation  speech → text (Chromium / desktop main window)
            + tts        Claude voice output (not Safari/mobile)
            + downloads  hand the viewer a generated file
            + desktop    installed app: fs, processes, tray, shortcuts, notifications
 BUILT-IN   + permissions  check/request/manage grants (never declared)
```
One rule applies to all of them: each one can return `null` depending on the host or viewer, and consent is asked on the first call. Your page has to work with whatever subset it actually gets.

**Your move:** Pick one: (a) pick the minimal capability set for your skill-driven chat v1; (b) go voice-first with `dictation` + `tts` + `sample`; (c) I build that v1 so you can try it.

### 23 · **user:**

there must be an artifact library thats being used to access above to generate the artifacts

### 24 · **assistant:**

**CEO:** There is one, but you don't import it. The host injects it into the page as `window.claude`, which has a single `use()` method, and it's versioned as a runtime contract (this session runs **0.2.99**). The page holds no SDK bundle. Claude writes plain HTML that asks the host for whatever it needs.

**PM:** For you as a builder, there's nothing to install or keep updated. Claude writes against the contract and the artifact pins that version. Your app keeps working when the platform changes until you deliberately run `contract: 'latest'`, the way you'd bump a version in `package.json`.

**Architect:** It has three layers. **Runtime**: host-injected `window.claude.use(name)` returning frozen namespaces, with the implementation hidden from the page. **Contract**: platform-served type definitions (`claude.d.ts`, `db.d.ts`, `sample.d.ts`, `mcp.d.ts`… one per capability), which are the authoritative API shape. **Generation**: Claude publishes through its Artifact tool with a `capabilities` manifest. Skills guide it (`artifact-capabilities` for the API, `artifact-design` for the look, `artifact-diagramming` for visuals), and typed artifacts like Docs and Slides come from fixed type pages that take only data.
```
 GENERATE   Claude + skills (capabilities/design/diagramming)
              │ Artifact tool: publish(html, capabilities, contract)
              ▼
 CONTRACT   *.d.ts per capability @ 0.2.99  ← what the code is written against
              ▼
 RUNTIME    host injects window.claude.use() → namespace | null
```
I can read the `.d.ts` files, but the runtime's internals and its bridge transport aren't visible to me.

**Your move:** Pick one: (a) I open `claude.d.ts` and `sample.d.ts` and show the real call shapes; (b) write your own skill so Claude generates your chat app the same way every time; (c) build the v1 chat artifact now on contract 0.2.99.

### 25 · **user:**

windows.claude is the bridge ?

### 26 · **assistant:**

**CEO:** Yes. `window.claude` (no "s") is the page's end of the bridge, and it has exactly one method, `use()`. The host on the other side does all the real work. The page only ever holds a handle, never the capability itself.

**PM:** For you, the page has to load and look right before the bridge answers, then switch features on as each `use()` resolves. If you save the HTML to disk and open it, `window.claude` doesn't exist at all. The app only works inside a Claude host.

**Architect:** From `claude.d.ts`: inside a viewer, the page is framed, and `window.claude` exists before your script runs. `use("db")` returns a promise. The host decides whether this view can serve the capability, loads that capability's module, and resolves with a frozen namespace. Otherwise it resolves `null`, and it also gives up with `null` after 10 s if the host never answers. Consent comes later, on the first actual call. Opened as its own page on the artifact's host, every `use()` returns `null` for now. Older **chat artifacts** have a different, flat `window.claude` with no `use()`. The transport itself isn't documented.
```
 page script                 window.claude          host (viewer / desktop app)
 ───────────                 ─────────────          ───────────────────────────
 await claude.use("db") ──▶  use() ───────────────▶ serves db here? granted?
                                                    load db module
        ◀──── frozen namespace | null (≤10 s) ◀─────┘
 db.collection(..).set() ──────────────────────────▶ consent on 1st call → do it
 
 framed in viewer: use() works │ own top-level page: use() → null │ saved file: no window.claude
```

**Your move:** Pick one: (a) open `sample.d.ts` to see the exact Claude-call shape your chat will use; (b) design the page's boot sequence (render, then light up `db`, `sample`, `user`); (c) build the v1 skill-driven chat on this bridge.

### 27 · **user:**

does claude desktop save the artifact db or it proxies the request to claude backend ?

### 28 · **assistant:**

**CEO:** It goes to the backend. The `db` is one store per artifact, held on Claude's servers, and the desktop app is just another client of it. Your phone, the web, and the installed app all see the same data live, which only works if there's one central copy. Desktop adds a local cache in front of it, not a second database.

**PM:** For the user, the chat app opens instantly with the last-seen transcript, marked "may be out of date," then refreshes when the server answers. Their own message shows up immediately, before the server has confirmed it. Offline, it can show old data, but nothing they write is synced or shared until the connection comes back.

**Architect:** From `db.d.ts`: the store is created on the first write and erased when the artifact is deleted, and it survives reloads, republishes and sessions. Updates arrive over a realtime stream, falling back to polling about every 30 s. Snapshots carry `fromCache` (a copy saved from an earlier visit, or delivered during a connectivity gap) and `hasPendingWrites` (your own write shows immediately and stays pending until the server confirms it). Offline, listeners can go silent, with no error, and keep retrying, so you add your own 10 s loading timeout. Where the desktop keeps that cache, and whether it's encrypted, isn't documented. Installed apps also have to be online and signed in to open at all.
```
 desktop/web/mobile page
   db.set() ──▶ shows now (hasPendingWrites) ──▶ Claude backend store ──▶ confirmed
   onSnapshot ◀── cached copy (fromCache) ◀── local cache
              ◀── live stream / ~30s poll ◀──────── backend (source of truth)
 offline: cache only, silent retry, no sync until back
```

**Your move:** Pick one: (a) design the chat's "stale / sending / sent" states around `fromCache` and `hasPendingWrites`; (b) decide whether you need true offline (then use `desktop` fs for local files); (c) build the v1 and watch the cache behavior yourself.

### 29 · **user:**

the installed artifact app talks to local claude desktop app which relays to backend ?

### 30 · **assistant:**

**CEO:** Very likely yes, though it isn't stated outright. The installed app isn't standalone. It's a window run by the Claude desktop app, on that app's session. The signals in `desktop.d.ts` all point that way: it has no login of its own, it follows the desktop app's sign-in and selected org, and its errors are Node-style codes.

**PM:** For the user, that means "Coach" in their Dock behaves like its own app. But if they sign out of Claude, or switch Claude to a different org, the Coach window stops being able to do some things. And Claude has to stay installed for Coach to work, because uninstalling Claude breaks it.

**Architect:** Evidence from `desktop.d.ts`: `window.setOptions` rejects `ENOTSUP` "while the Claude desktop app is signed out or has selected an organization other than the one this window was opened under". Permissions read `unavailable` "while the app signs in". File errors come back "as Node reports them". It's made "from the Claude desktop app", and "closing its window may leave it running." So local powers (fs, processes, tray) run in the desktop app's own Node process. Backend calls (`db`, `sample`, `mcp`) almost certainly go out through the desktop app's signed-in session. Not documented: whether that happens over IPC to a separate process or inside the same process, and how the cache is stored.
```
 ┌──────────── Claude desktop app (Node/Electron-like, signed in, org) ─────────────┐
 │  main window (chat)          installed app window ("Coach", own icon)            │
 │                               page ──window.claude.use()──▶ host bridge          │
 │                                                    ├─ desktop: fs/proc/tray (local Node)
 │                                                    └─ db/sample/mcp ──session──▶ Claude backend
 └───────────────────────────────────────────────────────────────────────────────────┘
   sign out / switch org ⇒ window loses powers  │  uninstall Claude ⇒ app gone
```

**Your move:** Pick one: (a) accept that the installed app depends on Claude desktop and design for the sign-out and org-switch states; (b) keep the chat app web-first and treat installing as an optional extra; (c) I build a probe app you install to watch what it does when you sign out or switch orgs.

### 31 · **user:**

how to drive skill based conversations with custom interface in claude artifact app  ?

### 32 · **assistant:**

**CEO:** Don't ask the skill to write chat text. Have it run a **turn protocol**: each turn returns structured data (say, a question, choices, a score, the next step), and your interface draws it as cards, buttons and progress bars. The skill controls *what happens*, and the page controls *how it looks*. That split is what makes this feel like an app, not a chatbot.

**PM:** In the coach example, the skill says "ask one question, wait, score it 1–10, give one tip, then get harder." Each turn the page shows a question card with a mic button, a score dial and a tip chip, plus "Next" and "Retry" buttons. The user hardly types, they just tap through. Which moments in your conversation should be buttons, not typing?

**Architect:** Here's the loop. The skill text lives in a `db` doc (`skill/current`), so Claude in chat can edit it and the app picks up the change live without republishing. Each turn: `sample([{role:"user", content: SKILL + state + recent history + userInput}], {tools, cache:false, onText})`. The tools are page functions like `advance_step` and `save_score` that write to `db`. The final answer is JSON in a shape the skill fixes, which the page renders as UI. Because `sample` has no memory, send a running summary plus the last few turns, not the whole transcript.
```
   Claude chat ──edits──▶ db: skill/current (rules + output schema)
                                   │ onSnapshot
 user tap/voice ─▶ page ─────────▶ sample(SKILL + state + history + input,
                    ▲                      tools:[advance_step, save_score])
                    │                         │ tool calls ─▶ page.execute ─▶ db
                    │                         ▼
                 render ◀── JSON turn {say, ui:"question|score|choice", options, step}
                    │
                 db: data/users/<id>/session (summary, step, transcript)
```
Limits: every call counts against the viewer's plan, so keep turns short. Skills delivered over MCP aren't documented as loading into `sample`, so the skill has to come from the page or from `db`. Use `modelTier: quick` for scoring and `default` for the main conversation turns.

**Your move:** Pick one: (a) define the turn JSON schema and the 3–4 UI components it maps to; (b) build the coach v1 artifact now (`db` + `sample` + `user`, voice optional); (c) set up chat-Claude as the skill's editor, tuning `skill/current` from your feedback.

### 33 · **user:**

the page orchestrates  conversation log for future turns ?? and users memory less claude calls ?

### 34 · **assistant:**

**CEO:** Yes. The page is the conversation engine, and Claude has no memory between calls. Each turn the page decides what Claude gets to know. That sounds like a limitation, but it's really control: you choose what's remembered, what's forgotten, and what the skill always sees.

**PM:** For the user, it still feels like Claude remembers them. On day three the coach says "last time you rambled on system design, let's tighten that." That's the page loading a saved note from `db` into the prompt. The memory is a product feature you design, not something the model does on its own.

**Architect:** Each call takes a messages array (`[{role:"user"|"assistant", content}]`, ending on `user`), so the page can replay recent turns as real dialogue. Build every call from four parts: **skill rules** (fixed), **state** (step, score), **memory** (a running summary plus pinned facts), and **the last N turns**. The full log lives in `db` and is never sent whole. Every few turns, a cheap `modelTier:"quick"` call folds older turns into the summary. Set `cache:false`, because `cache` only replays an identical call for 5 minutes, which is the wrong behavior for chat.
```
 db: data/users/<id>/
   log[]  ── full transcript (never sent whole)
   memory ── {summary, pinned facts}  ◀── quick sample every ~6 turns folds old log
   state  ── {step, score, skill version}

 each turn, page builds:
   [ user: SKILL + state + memory ]  ← framing
   [ assistant/user … last N turns ] ← real dialogue
   [ user: new input ]               ─▶ sample() ─▶ JSON turn ─▶ append to log
```
Cost grows with what you send, not with how long the log gets, so N and the summary size are your budget controls.

**Your move:** Pick one: (a) set the memory policy: how many recent turns, how often to summarize, which facts get pinned; (b) let chat-Claude read the `db` log and rewrite the skill rules between sessions; (c) build the v1 with this context builder so you can feel the memory working.

### 35 · **user:**

why is that ? why is the claude harness sdk not being exposed ??

### 36 · **assistant:**

**CEO:** Anthropic hasn't said why, as far as I've found, so this is my reading. An artifact is **shared code that runs on the viewer's account**. A full agent harness in that page could take the viewer's connectors, files and plan and run them in a loop, steered by code someone else wrote. A call with no memory, where every action passes through the host's consent, is the safe default.

**PM:** For the user, the worst case is opening a coworker's "fun quiz" artifact that quietly reads their email through connectors, many steps in, with no one checking. With `sample`, every power is a separate grant they approve, and nothing happens out of view. You lose some convenience and gain user trust.

**Architect:** What a harness would add, and why each piece is risky inside the sandbox:
```
 harness piece        risk inside a shared page           what you get instead
 ─────────────────────────────────────────────────────────────────────────────
 session memory       hidden state, hard to meter/inspect  page-owned log in db
 skills auto-load     page can't see/audit what loaded     skill text in page/db
 built-in tools/MCP   agent acts w/ viewer creds unseen    sample tools → page fn → mcp (consented)
 long agent loops     unbounded spend on viewer's plan     per-call metering, rate limits
```
You do still get a loop: `sample` with `tools` lets Claude call page functions during one call, and the page decides what each function is allowed to do. If you want the real harness, run the Agent SDK or Managed Agents on your own backend and expose it as an MCP connector that the page calls through `mcp`. Then you pay for it and control it.

**Your move:** Pick one: (a) stay sandbox-native, with the page as the harness; (b) put the Agent SDK behind your own MCP connector and make the artifact only the UI; (c) a hybrid, with simple turns on `sample` and heavy agent work sent to your backend.

### 37 · **user:**

/brain add this convesation into backlog

### 38 · **assistant:**

dumped: skill-based artifact apps panel

ingested: skill-based artifact apps, ready for your next `/brain` session

### 39 · **user:**

<redacted: background task notification>

what is $BRAIN_REPO ?

### 40 · **assistant:**

`$BRAIN_REPO` is an environment variable that tells the brain script which repo holds your brain. It isn't set in this session, and because of that today's dump probably landed somewhere you don't want it.

**How the script picks the folder** (`brain.py`): the brain lives in a `brain/` folder inside `$BRAIN_REPO`. When the variable isn't set, the script assumes it is running from `<repo>/skill/scripts/brain.py` and takes the folder three levels up as the repo.

**What happened here:**
- The skill is installed at `<redacted>`, not under a `skill/` folder, so "three levels up" is `~/.agents/skills`.
- That makes the brain folder `~/.agents/skills/brain`, which is the skill's own install folder.
- So `backlog/`, `archive/`, `convo/` and `insights/` are being created next to `SKILL.md` and `scripts/`. Today's dump is at `<redacted>`.
- The session step reads `../SOUL.md`, which resolves to `~/.agents/skills/SOUL.md` and probably doesn't exist.

**Fix:** point the variable at your real brain repo (the one with `brain/` and `SOUL.md` at its root), for example in `~/.zshrc`:
```sh
export BRAIN_REPO=~/path/to/your-brain-repo
```
Then move today's dump into that repo's `brain/backlog/`.

Do you want me to find your brain repo and move the dump there, or set `BRAIN_REPO` for this project in `.claude/settings.json`?

### 41 · **user:**

move the backlog into the brain

### 42 · **assistant:**

I moved the dump into your brain repo, so it's now with your other saves at `<redacted>`.

I wasn't able to delete the leftovers the script made today inside the skill's install folder; the permission check blocked removing them. They're the empty `backlog/`, `archive/`, `convo/` folders and `insights/` (holding only a default `index.md`) in `<redacted>`. If you want them gone, run:
```
! rm <redacted> && rmdir <redacted>
```

To keep the next dump from landing in the wrong place again, set `export BRAIN_REPO=<redacted>`, since `SOUL.md` is in that folder.

### 43 · **user:**

the brain dump was not a complete session ??

### 44 · **assistant:**

You're right. My first dump only had your 18 questions plus my own short summary of the answers, not the actual conversation. I've rewritten it with the whole session copied word for word from the session log: all 36 turns, every question of yours and every full panel reply.

- **File:** `<redacted>`
- **Ingest:** the claim, gist, key lines and tags are kept, and the Source section now holds the full session too.
- **Left out on purpose:** the `/brain` dump turn and the cleanup after it, which aren't part of the conversation.
- **Backup:** the earlier version is saved at `<redacted>`.

### 45 · **user:**

/productivity:intuition on this session about claude artifact.

### 46 · **assistant:**

# Intuition: Claude Artifacts (as an app platform)

## Elevator Pitch
You want a small app, like a coach, a tracker or a team board, but you don't want to run servers, handle logins, or pay for an API key. An artifact is a web page Claude writes, and **Claude's platform acts as its backend**: storage, identity, AI calls and connectors are all built in. You reach for it when the app is mostly "a screen plus some thinking plus some memory," and everyone using it already has a Claude account.

**If you remember nothing else:** the page holds no powers, only handles it has to ask the host for, and the host can always answer "no."

## In the Wild (STAR)
- **Situation:** You want a mock-interview coach for your team: voice questions, scoring, and it should remember each person's weak spots across sessions. You have a good skill for it, but it only works in chat.
- **Task:** Teammates won't type `/coach` and read walls of text. They want an app with an icon. You have no backend, no API budget, and no time to build login.
- **Action:** Claude publishes an artifact. It keeps the skill's rules in `db`, saves each person's log and memory under `data/users/<id>/`, and calls `sample` every turn, sending the rules, the summary and the last few turns. Answers come back as JSON that the page draws as cards. `dictation` and `tts` handle voice, and teammates install it as a desktop app.
- **Result:** It ships in an afternoon, with zero infrastructure. **The cost:** every turn uses the viewer's plan, the page has to rebuild Claude's memory on every call, the app breaks when the user is offline or signed out, and your data lives on Anthropic's platform with undocumented quotas.

**The tell:** *every user already has a Claude account*, and the app is mostly UI plus AI plus light state, with no proprietary backend.

## The Key Insight
**The host does the work, and the page is untrusted code running on someone else's account.**

Before, people pictured an "AI app" as code that *owns* its powers: its own database, its own API key, its own agent loop with memory. The belief that flips is **"the app is the authority."** An artifact gets shared, so whoever opens it runs code someone else wrote, using *their* plan and *their* connectors. That forces everything we saw this session:

- **`window.claude.use()` only hands back handles, or `null`.** The page can't assume any power exists.
- **Consent happens on the first call, not at load.** Each action is approved where it happens.
- **`sample` has no memory, and there's no harness inside the page.** Hidden state or long loops would spend the viewer's account where no one can see it.
- **The page orchestrates the conversation.** Since Claude remembers nothing, *you* own the log, the summary and the context.
- **The installed app is a window of the Claude desktop app.** Its powers follow that app's sign-in and selected org.

## Negative Space
- **Not a normal web app:** it can't freely `fetch` your server and has no backend of its own. Take away the host and it's dead (a saved HTML file has no `window.claude`).
- **Not an agent:** `sample` remembers nothing and can't load skills on its own. If you need a real agent loop, it has to live *outside* (Agent SDK behind your own MCP connector).
- **Not a Claude chat:** the chat has skills, memory and tools. The page gets only what it was granted, **and it can change without a model in the loop**: `db` writes and `mcp` calls go straight to the host.
- **Never claimed to solve:** offline use, your own data residency, or users who don't have Claude.

## Explain in Levels
**To a student:** An artifact is a web page Claude builds for you. When it needs to save something, ask Claude a question, or read your calendar, it politely asks the Claude app, and you approve.

**To an engineer:** It's a sandboxed iframe (or a desktop window run by Claude) with a CSP and one injected global, `window.claude.use(name)`, which resolves a frozen namespace or `null`. Capabilities are declared at publish: `db` (server-side document store with access rules, realtime sync and a client cache), `artifact` (republish yourself as a new version), `sample` (memoryless Claude calls with page-side tools), `mcp` (connectors on the viewer's credentials), and `user`, `room`, `desktop`, voice and so on. State lives in three tiers: browser storage, page versions, and `db`. The API is pinned to a runtime contract (0.2.99).

**To a PhD:** It's a capability-security model. Authority goes with the call, not the code. The page is untrusted mobile code, and the host is the reference monitor. Each grant is scoped to a viewer, a call and a version (desktop permissions reset per version). Leaving out a stateful agent harness avoids confused-deputy problems: shared code acting on the viewer's authority with hidden state. The price is that context management moves into application code. Open subtleties: the bridge transport, cache storage and quotas aren't documented. Skills-over-MCP reaches chat but isn't documented as reaching `sample`, so skill delivery to artifacts remains a gap in the design.

## Question Ladder
```
              How do I build a skill-driven app in an artifact?
               /                    |                      \
     Where does state live?   Why is sample memoryless?   Why no Agent SDK inside?
          |                         |                          |
   Host's db, not the page    Hidden memory = unseen      Agent loop would spend
   — why not page-owned?      state on viewer's plan      viewer's creds/plan unseen
          \                         |                          /
           \                        |                         /
            Whose authority does the page run on?  ── the VIEWER's
                                    |
              Shared code + someone else's account
                                    |
         ┌──────── HOST AS REFERENCE MONITOR ────────┐
     handles not powers      consent per call      null-by-default design
         └──────────────┬────────────────────────────┘
                 PAGE = UI + ORCHESTRATOR
          (owns log, memory, turn protocol; asks host for everything)
```
"Where does state live," "why no memory" and "why no SDK" look like three separate design choices. **All three end at the same node: the page runs on the viewer's authority.** That shared node is the whole idea.

---

I can also publish this as a shareable page with the diagrams drawn properly, if you want it.

### 47 · **user:**

more

### 48 · **assistant:**

# Intuition: Claude Artifacts — going deeper

## In the Wild, Part 2: when it's the *wrong* answer
- **Situation:** A startup wants its customer-support bot as an artifact. The customers have no Claude accounts, the data has to stay in their own Postgres in the EU, and the bot needs to work offline at kiosks.
- **Task:** The CEO says "artifacts are zero-infra, just ship it."
- **Action:** Check the requirements against the platform's rules. `db` is Claude-hosted, `sample` runs on the *viewer's* plan, and people from outside the org get `null` for most capabilities. Installed apps need to be online and signed in.
- **Result:** Every requirement fails. They build a normal web app on the API with the Agent SDK. **The cost:** weeks of work on infrastructure, login and billing, which is exactly what artifacts exist to skip.

**The anti-tell:** *the users aren't Claude users*, or *the data has to live somewhere you control.* Either one rules artifacts out.

---

## Rediscover It (Simulated Conversation)
*Two engineers designing "let users ask an AI to build and share small apps." Neither has seen artifacts.*

**Maya:** Easy version: the AI writes a page, and the page calls the Claude API with our key.

**Dev:** The key sits in shared HTML. Anyone who opens it can steal it, and we pay for every stranger's usage.

**Maya:** Then the viewer pastes their own key?

**Dev:** Nobody will. And the person who *wrote* the page controls what it does with that key.

**Maya:** So the page should never hold a credential. It asks us, the host, and we make the call using the viewer's session.

**Dev:** Then let's give the page our full agent: memory, tools, connectors. That's the most powerful option.

**Maya:** Picture someone opening their coworker's "quiz" page. Twenty steps in, the agent is reading their email with *their* connector, and no one approved anything.

**Dev:** …So each power has to be a separate request, approved where it's used. And the AI call can't carry hidden memory, or we can't tell what it's doing.

**Maya:** Which means the page has to keep its own conversation log and resend context every time.

**Dev:** And the page has to work when we say no to anything. Every request returns either a handle or nothing.

*They've rebuilt `window.claude.use()` → namespace | `null`, consent on the first call, and a `sample` with no memory, starting from "never put a key in shared code."*

---

## Apply It (Simulated Conversation)
*Design review. You're proposing the coach artifact. Priya, the security lead, pushes back.*

**You:** The coach runs in an artifact. Skill rules in `db`, per-user memory under `data/users/<id>/`, `sample` each turn.

**Priya:** The skill rules are in a shared `db` doc. Who can edit them?

**You:** By default, Contributors can write shared data. I'll set `skill/` to `write:"admin"`.

**Priya:** Good. Now the transcript. Can *you*, the owner, read my practice answers?

**You:** No. `data/users/<id>/` is private even from the owner.

**Priya:** But you can publish a new version with looser rules, right?

**You:** …Yes. The docs say `self` and access rules aren't encryption. A future version could expose existing rows, and no one would be notified. I'll put that in the app's description.

**Priya:** Who pays for my coaching turns?

**You:** You do, from your own plan. I'll use `quick` for scoring, keep the last 6 turns plus a summary, and show an estimate of how many turns are left.

**Priya:** And if I'm offline?

**You:** You see the cached transcript marked stale, and nothing gets submitted. No offline mode in v1.

*The cost, said out loud: trust in the owner, spending the viewer's plan, no offline. Those are the real price of zero infrastructure.*

---

## A third axis: three things called "memory"
People blur these together, and they break in different ways:

| Memory | Lives in | Who sees it | Dies when |
|---|---|---|---|
| **Conversation context** | the prompt you rebuild each `sample` call | Claude, for one call | the call ends |
| **User memory** (summary, pinned facts) | `db` `data/users/<id>/` | that viewer only (until rules change) | the artifact is deleted |
| **App memory** (skill rules, question bank) | shared `db` docs, or the page itself via `artifact` | everyone, per rules | a republish changes it (page) / the artifact is deleted (db) |

**The point:** Claude never remembers anything. *Your page* turns stored data back into context on every turn.

---

## Question Ladder, deeper: "Why does the page have to do so much?"
```
                 Why does my page orchestrate everything?
                 /                 |                   \
       Why no session      Why do tools run as     Why does every power
       memory in sample?   page functions?          return null-or-handle?
             |                     |                        |
       Memory = state the    Claude can't reach      Host may not serve it,
       viewer can't audit    connectors directly     viewer may refuse,
             |                     |                 outsider gets nothing
       Why must they audit?  Why not?                       |
             |                     |                 Why let a viewer refuse?
             \             Page decides what each           |
              \            fn may do → consent             /
               \           stays at the call              /
                \                  |                     /
                 └─────── Code is written by someone ───┘
                          else, runs on the VIEWER's
                          plan, creds, data
                                   |
                    Why not just trust the author?
                                   |
                    Sharing is the product: an artifact
                    is MADE to be opened by others
                                   |
                     ═══ AUTHORITY ≠ AUTHORSHIP ═══
                                   |
          ┌────────────────────────┼─────────────────────────┐
   host = reference monitor   page = UI + orchestrator   you design memory
          └────────────────────────┼─────────────────────────┘
                     Install-as-app inherits it too:
                  window of Claude desktop, follows its
                  sign-in/org, permission per VERSION
```
**Bottom node:** *authority ≠ authorship.* Whoever wrote the code isn't whoever's account it runs on. That holds only because sharing is the point of artifacts. A page you never share could safely get more, and that's exactly why **full computer access is limited to apps you made yourself** (or, on Team and Enterprise plans, apps made inside your org).

**Self-tests:**
1. Why does the desktop permission reset on *your own* edit? *(Hint: the authority goes with the version, not with you.)*
2. If Skills over MCP reached `sample`, which node in the ladder would get weaker?
3. Why is `room` presence "never authority"?

---

## Edges and open questions (documented vs. inferred)
- **Documented:** the `use()` → namespace | `null` contract, consent on the first call, the `db` cache, pending-write and offline behavior, desktop permission tiers, `sample` having no memory, and the November 24 Install-as-app and Skills-over-MCP releases.
- **Inferred, not stated:** the installed app's backend calls going through the Claude desktop app's session, the bridge transport, and *why* there's no harness (my reading: authority ≠ authorship).
- **Unknown:** `db` quotas, export, region or retention; where the desktop cache lives; whether skills will ever reach artifacts directly.

I can publish both parts as one shareable explainer page if you want it.
