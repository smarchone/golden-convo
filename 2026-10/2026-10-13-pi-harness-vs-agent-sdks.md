---
schema: 1
id: 2026-10-13-pi-harness-vs-agent-sdks
title: "pi agent harness: a minimal loop vs agent SDKs and managed agents"
why: pi sits in the same layer as agent SDKs but bets on minimal; the gap vs managed agents is operations, not intelligence.
why_source: suggested
harness: claude-code
harness_version: 2.1.283
model: claude-opus-5-5
session_id: faab302f-71e2-440a-9bf9-b34c73cdc7f1
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/faab302f-71e2-440a-9bf9-b34c73cdc7f1.jsonl
started: "2026-09-27T12:03:23.493Z"
captured: "2026-10-13T05:30:00Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:evolve"
turns: 6
complete: true
golden_turns: [4, 6]
labels: [agents, agent-runtime]
status: raw
---

### 1 · **user:**

/evolve pi agent harness

### 2 · **assistant:**

# pi (agent harness): how it evolved
An open-source (MIT), deliberately minimal coding-agent harness plus TypeScript SDK (`badlogic/pi-mono`, by Mario Zechner, who created libGDX) · best known as the agent runtime embedded inside OpenClaw (early 2026) · ~1 year old (public launch Nov 2025)

> This is from memory. pi changes fast and I didn't research it, so exact dates and version numbers are marked *(unverified)*. Say "grounded" if you want a pass checked against sources.

## Business ↔ Tech
- **End product:** Two things.
  - `pi`, a terminal coding agent with only 4 tools, a system prompt under ~1k tokens, and no guardrails by default.
  - The libraries under it (`pi-ai`, `pi-agent-core`, `pi-tui`). Other products embed these as their agent loop.
- **Revenue model:** None. It's a solo, hobby-funded open-source project. Users bring their own model access: API keys or subscription logins (Claude Pro/Max, ChatGPT/Codex, Copilot, Gemini) *(unverified; this exposes pi to vendors' ToS changes on third-party OAuth use)*.

| Need | Tech answer |
|---|---|
| Stay model-agnostic as vendors churn | `pi-ai`: one API over OpenAI/Anthropic/Google/etc.; a single context can be handed off between providers mid-session |
| Predictable behaviour (the main complaint about Claude Code) | Tiny, stable system prompt; only 4 tools (`read`, `write`, `edit`, `bash`); nothing hidden gets injected into context |
| Say no to features but still let users have them | Extension API (TypeScript) replaces built-in MCP, sub-agents, plan mode and permission prompts |
| Embeddable in other products | Agent loop split into its own package (`pi-agent-core`); print/JSON/RPC modes plus an SDK |
| Full visibility into what the agent did | Sessions stored as plain JSONL on disk; each run can be inspected, branched and replayed |

## Architecture Evolution
LLM tooling for GPU pods → minimal CLI agent → split into core + SDK → extensions replace built-in features → session trees → pi packages and embedding (OpenClaw)

### 2025 · Foundations (self-hosted model tooling → unified LLM layer)
**Forced by:** Mario was running open-weight models on rented GPU pods (vLLM) and wanted one client for them and the hosted APIs. Every provider had different tool-call, streaming and "thinking" formats (~4+ wire formats).
```
BEFORE
  script ──► OpenAI SDK ──► vLLM pod
  script ──► Anthropic SDK ──► Claude
AFTER
  script ──► *pi-ai (unified msgs, tools, streaming, thinking)*
                 ├─► vLLM pod  *(pi-pods manages pods)*
                 ├─► Anthropic / OpenAI / Google / …
```
| | Before | After |
|---|---|---|
| Provider switch | Rewrite call sites | Change one config; context carries across providers |
| Token/cost tracking | Different per SDK | Normalized usage and cost per message |
**Trade-off:** Now there's a good model layer but no agent loop on top of it. Mario was using Claude Code and getting frustrated with it.

### Nov 2025 · Launch of `pi` (someone else's agent → own minimal CLI)
**Forced by:** Claude Code changed its system prompt, tools and context injection on nearly every release (he'd been tracking the prompt diffs in `cchistory` *(unverified)*). That made its behaviour drift, and there was no reliable way to see exactly what the model received.
```
BEFORE
  user ─► Claude Code (closed loop, ~10k+ tok prompt, many tools,
          hidden reminders, sub-agents) ─► Anthropic
AFTER
  user ─► *pi CLI* ─► *agent loop (4 tools, <1k-tok prompt)* ─► pi-ai ─► any model
             │                         └─► *AGENTS.md from the project*
             └─► *pi-tui (differential rendering)*   *session.jsonl*
```
| | Before | After |
|---|---|---|
| Context overhead | ~10k+ tokens of prompt and tool definitions *(unverified)* | Roughly 1–2k tokens |
| Reproducibility | Changes whenever the vendor ships | Pinned by the pi version plus your AGENTS.md |
| Safety model | Permission prompts | Runs everything by default ("YOLO"); isolation is up to you (container/VM) |
Results: competitive Terminal-Bench 2.0 scores against much heavier agents *(unverified exact rank)*.
**Trade-off:** Users immediately asked for MCP, sub-agents, plan mode, todos and permission gates. Saying no to all of it only works if there's a way to add them outside the core.

### Late 2025 · Core split (a single CLI → loop as a library plus several front ends)
**Forced by:** Other front ends needed the same loop: `mom`, a Slack bot; a web UI; and outside embedders. Copy-pasting the loop doesn't scale.
```
BEFORE
  pi CLI ─► loop + tools + TUI (one package) ─► pi-ai
AFTER
  pi CLI ──┐
  *mom (Slack)* ──┼─► *pi-agent-core (loop, state, events)* ─► pi-ai
  *pi-web-ui* ────┤        ▲
  *3rd-party* ─(SDK / *RPC over stdio* / *--print --json*)
```
| | Before | After |
|---|---|---|
| Integration surface | TUI only | SDK, RPC and JSON event stream |
| Reuse | None | Same loop in the CLI, Slack and web |
**Trade-off:** Embedders and power users now want to change behaviour *inside* the loop (tools, prompts, UI). That needs a proper plugin model.

### Dec 2025 – Jan 2026 · Extensions (fixed feature set → user-programmable harness)
**Forced by:** Refusing features one by one doesn't scale. Separate early mechanisms (hooks, custom tools) were being merged into a single **extension** API *(unverified exact sequence)*.
```
BEFORE
  pi-agent-core ─► fixed 4 tools, fixed prompt
AFTER
  pi-agent-core ─► tools ◄── *extensions (TS): tools, event hooks,
                  prompt  ◄──   commands, TUI widgets, providers*
                  context ◄── *skills (SKILL.md, loaded on demand)*
                          ◄── *prompt templates, themes*
```
| | Before | After |
|---|---|---|
| MCP, sub-agents, plan mode | Not available | Available as extensions (e.g. sub-agents run as `pi` processes spawned via bash) |
| Base context cost | Fixed | Still small: skills are loaded only when needed |
**Trade-off:** The core stays small, but the ecosystem splinters and extensions need a way to be distributed.

### ~Jan 2026 · Session trees (linear log → branched history)
**Forced by:** Long sessions need two things a flat append-only log can't give cleanly: going back to try a different approach, and compaction (summarizing old turns to save context).
```
BEFORE
  session.jsonl: msg ─ msg ─ msg ─ msg   (linear)
AFTER
  session.jsonl: *entries with id / parentId*
      msg ─ msg ─┬─ msg ─ msg        (branch A)
                 └─ *compaction* ─ msg (branch B, current leaf)
  */tree* to navigate · *fork* to a new file · export to HTML
```
| | Before | After |
|---|---|---|
| Undo or trying alternatives | Start a new session | Branch in place; full history kept |
| Compaction | Rewrites or loses history | Compaction is stored as an entry; the originals stay |
**Trade-off:** Session files become a real data format. Other tools that read them depend on that format staying compatible.

### Jan – Feb 2026 · Platform layer (a solo tool → runtime under other products)
**Forced by:** OpenClaw (formerly Clawdbot/Moltbot, by Peter Steinberger) went viral. It reached ~100k+ GitHub stars (Jan–Feb 2026) *(unverified)* and runs pi's SDK as its agent runtime. Extension authors also needed a way to install each other's work.
```
BEFORE
  users ─► pi CLI ─► pi-agent-core ─► pi-ai
AFTER
  users ─► pi CLI ─┐
  *OpenClaw (chat apps, always-on)* ─► pi SDK ─► pi-agent-core ─► pi-ai
  *pi packages* (npm / git: extensions+skills+themes) ─► *pi install*
```
| | Before | After |
|---|---|---|
| Reach | Mainly Mario's own users | Indirectly, a very large downstream user base via OpenClaw *(unverified size)* |
| Distribution | Copying files by hand | Versioned packages installed with `pi install` |
**Trade-off:** Maintenance load and API-stability pressure land on essentially one maintainer. Two things are now fragile: using pi without guardrails inside always-on bots, and relying on subscription OAuth when providers restrict third-party clients. There were reports of maintainer/org changes in 2026 *(unverified)*.

---
Throughout these shifts the core has stayed about the same size. Nearly every change added capability *around* it (library split, extensions, packages) instead of into it.

### 3 · **user:**

do some research and update

### 4 · **assistant:**

[ran: WebFetch — https://mariozechner.at/posts/2025-11-30-pi-coding-agent/]
[ran: WebFetch — https://github.com/badlogic/pi-mono]
[ran: WebSearch — Mario Zechner pi Earendil joins Armin Ronacher 2026]
[ran: WebSearch — OpenClaw built on pi agent Mario Zechner SDK]
[ran: WebFetch — https://lucumr.pocoo.org/2026/1/31/pi/]
[ran: WebFetch — https://rfc.earendil.com/0015/]
[ran: WebFetch — https://newsletter.pragmaticengineer.com/p/building-pi-and-what-makes-self-modifying]
[ran: WebFetch — https://www.pi-map.org/news/pi-joins-earendil/]
[ran: WebSearch — pi coding agent changelog extensions "pi install" packages session tree /tree release]
[ran: WebSearch — Anthropic blocks third-party OAuth Claude subscription pi OpenCode OpenClaw 2026]

Progress so far: I've confirmed the move to Earendil (Apr 2026), the repo rename, the licensing RFC and the timeline of the OAuth ban. Two more lookups, then I'll write the update.

[ran: WebFetch — https://piagent.fyi/news/pi-joins-earendil/]
[ran: WebFetch — https://github.com/earendil-works/pi/blob/main/packages/coding-agent/CHANGELOG.md]
[ran: Bash — Download pi changelog and find when features first appeared]
[ran: Bash — Map feature changelog lines to pi version headers]
[ran: Bash — Resolve versions for session trees, extensions, telemetry, and current release]
[ran: Bash — Resolve remaining versions and fetch repo and npm stats]
[ran: Bash — List current packages and check early repo history]

I've finished collecting the version dates from the changelog. One last check on the new server/client packages, then I'll write it up.

[ran: Bash — Read summaries and earliest dates of the newer packages]

# pi (agent harness): how it evolved *(grounded)*
A minimal, self-extending coding-agent harness plus TypeScript SDK (`earendil-works/pi`, MIT) · ~110k GitHub stars, ~14k forks (Sep 2026) · ~13.6M npm downloads/month across the old and new package names (Aug–Sep 2026; much of that is transitive installs via OpenClaw) · repo started Aug 2025, launched Nov 2025, now at v0.87.1 (22 Sep 2026)

## Business ↔ Tech
- **What users get:**
  - `pi`, a CLI with 4 tools (`read`, `write`, `edit`, `bash`) and a system prompt under ~1k tokens including tool definitions. It deliberately ships without MCP, sub-agents, plan mode, permission prompts, todos or background bash.
  - The SDK underneath it (`pi-ai`, `pi-agent-core`, `pi-tui`), which products like OpenClaw embed.
- **Funding:**
  - **Nov 2025 → Apr 2026:** Solo open source (Mario Zechner).
  - **Since 8 Apr 2026:** Owned by **Earendil**, a public-benefit corporation in Vienna founded by Armin Ronacher (creator of Flask) and Colin Daymond Hanna. Mario became a stakeholder and leads technical direction.
- **Revenue model (RFC 0015, 30 Mar 2026):**
  - The core stays MIT permanently.
  - Planned add-ons: Fair Source components (convert to open source later), plus proprietary cloud and enterprise features. Earendil also enforces the "Pi" trademark.
  - No paid product was visible when I checked *(unverified)*.
- **Model access:** Users bring their own API keys or subscription logins. Anthropic tightened this in stages:
  - **9 Jan 2026:** Server-side block on third-party OAuth (OpenCode and others).
  - **20 Feb 2026:** Terms updated to ban subscription tokens in third-party tools.
  - **4 Apr 2026:** Enforced against OpenClaw.
  - **Since then:** Partial reversals reported *(disputed)*.

| Need | Tech answer |
|---|---|
| Stay model-agnostic | `pi-ai`: one API over 8+ providers; a context can be handed off between Claude, GPT and Gemini mid-session (thinking traces are converted to `<thinking>` tags) |
| Predictable behaviour | Tiny fixed prompt; nothing hidden injected; MCP skipped because its tool definitions cost 7–9% of the context window |
| Say no to features without losing users | Extensions: the agent writes its own tools and hot-reloads them |
| Embeddable in other products | RPC mode, `createAgentSession()` SDK, separate agent-core package |
| Monetize without closing the core | MIT core with Fair Source/proprietary add-ons on top; experimental server/protocol layer (Jul 2026 →) |

## Architecture Evolution
Minimal CLI (Nov 2025) → multiple front ends + SDK (Nov–Dec) → extensions (Dec–Jan) → session trees (Jan 2026) → packages + OpenClaw embedding (Jan) → Earendil consolidation (Apr–May) → durable client/server harness (Jul–Sep 2026, experimental)

### Aug – Nov 2025 · Birth (Claude Code → own minimal harness)
**Forced by:** Claude Code had become "a spaceship with 80% of functionality I have no use for." Its prompt and tool changes broke Mario's workflows, and it injected context that the UI never showed. The monorepo started 9 Aug 2025 with LLM, agent, TUI and GPU-pod (`pods`) packages. `pi` shipped as v0.10.0 on 25 Nov and the launch post followed on 30 Nov.
```
BEFORE
  user ─► Claude Code (large prompt, many tools, hidden
          reminders, sub-agents) ─► Anthropic only
AFTER
  user ─► *pi CLI* ─► *loop: 4 tools, ~1k-tok prompt* ─► *pi-ai* ─► 8+ providers
             │              └─► *AGENTS.md*
             └─► *pi-tui (differential rendering)*   *session.jsonl*
```
| | Before | After |
|---|---|---|
| Context overhead | Large; MCP alone costs 7–9% of the window | ~1k tokens for prompt plus tools |
| Benchmark | — | Competitive on Terminal-Bench 2.0 with Opus 4.5; Terminus 2 (plain tmux) scoring close by supports the minimal approach |
| Safety | Permission prompts | Runs everything by default ("YOLO"); isolate with containers |
**Trade-off:** Only one front end exists, but people immediately want pi inside other programs.

### Nov – Dec 2025 · Multiple front ends (TUI only → TUI, RPC and SDK)
**Forced by:** The Slack bot (`mom`), the web UI and third-party programs all needed the same loop. v0.10.x refactored to "multiple frontends with shared agent logic."
```
BEFORE
  pi CLI ─► loop + tools + TUI ─► pi-ai
AFTER
  TUI ────────┐
  *--rpc (JSON stdin/stdout)* ─┼─► *AgentSession (shared)* ─► pi-agent-core ─► pi-ai
  *SDK createAgentSession()* ──┘
```
| | Before | After |
|---|---|---|
| Integration | Interactive only | RPC mode (v0.10.3, 28 Nov); SDK (v0.26, 22 Dec) |
| Control | — | SDK sets model, tools, hooks, skills, persistence and settings |
**Trade-off:** Embedders now want to change behaviour *inside* the loop, not just drive it from outside.

### Dec 2025 – Jan 2026 · Extensions (three plug-in mechanisms → one)
**Forced by:** Refusing features one at a time didn't scale. Three separate mechanisms arrived within a week: hooks (v0.18, 10 Dec), skills (v0.19, 12 Dec; compatible with Claude Code and Codex `SKILL.md`) and custom tools (v0.23, 17 Dec). Hooks and custom tools were both TypeScript factory modules, so v0.35 (5 Jan 2026) merged them into **extensions**: "one concept, one discovery location, one CLI flag."
```
BEFORE
  core ◄─ hooks (events) ◄─ custom tools (TS) ◄─ skills
         (separate dirs, flags, docs, SDK paths)
AFTER
  core ◄─ *extensions: tools + events + commands + TUI (pi.ui)*
       ◄─ skills (loaded on demand)  ◄─ prompt templates, themes
  *agent writes an extension → hot-reload → test → loop*
```
| | Before | After |
|---|---|---|
| MCP, sub-agents, plan mode | Refused | Built as extensions, often by pi itself |
| SDK surface | `additionalHookPaths` + `additionalCustomToolPaths` | `additionalExtensionPaths` |
**Trade-off:** Extensions need persistent state and a way to be distributed, and sessions need to support branching.

### Jan 2026 · Session trees (flat file per branch → one tree per session)
**Forced by:** `/branch` created a new file for every branch, which made history hard to trace. Compaction also needed to happen without losing history. v0.31 (2 Jan) added "session trees for in-place branching… and structured compaction with file tracking."
```
BEFORE
  a.jsonl: m─m─m        b.jsonl (branchedFrom: a) : m─m
AFTER
  s.jsonl: *entries with id/parentId*
      m─m─┬─m─m                 (branch A)
          └─*compaction(files touched)*─m   (current leaf)
  */tree* navigate/bookmark · */share* → secret gist via pi.dev
```
| | Before | After |
|---|---|---|
| Side quests (e.g. a review) | Separate session, copy results back by hand | Branch off, then bring findings back into the main line |
| Compaction | Lost detail | Structured summary that tracks touched files |
**Trade-off:** The JSONL session format is now a public contract that other tools depend on.

### Jan 2026 · Packages + OpenClaw (a tool → a platform)
**Forced by:**
- Extensions were being shared by copying files around. v0.50 (26 Jan) added `pi install / remove / update / list` for npm and git packages.
- In the same weeks OpenClaw (formerly Clawdbot/Moltbot) went viral. Reports say ~145k stars in about a week.
```
BEFORE
  users ─► pi CLI ─► agent-core ─► pi-ai
AFTER
  users ─► pi CLI ─┐
  *OpenClaw gateway (WhatsApp, Telegram, Slack, Discord, Signal, iMessage…)*
                 └─► pi SDK ─► agent-core ─► pi-ai
  *pi packages (npm:/git:)* ─► *pi install* ─► extensions/skills/themes
```
| | Before | After |
|---|---|---|
| Distribution | Copying files | Versioned packages, listed on pi.dev |
| Reach | pi's own users | OpenClaw users at much larger scale; pi becomes infrastructure |
**Trade-off:** One maintainer is carrying infrastructure-level load. Relying on subscription OAuth breaks when providers restrict it (see the dates above).

### Apr – May 2026 · Company home (solo repo → Earendil)
**Forced by:** Maintenance load and the need for a sustainable business. The licensing RFC came 30 Mar and the "I've sold out" post 8 Apr.
```
BEFORE
  badlogic/pi-mono · @mariozechner/* · ai, agent, tui, coding-agent,
  web-ui, *mom*, *pods*
AFTER
  *earendil-works/pi* · *@earendil-works/** (v0.73.1, 7 May: pi update --self migrates)
  mom → *pi-chat (separate repo)* · pods *removed* (30 Apr)
  *opt-in install telemetry: per-version counter only* (v0.67.1, 13 Apr)
```
| | Before | After |
|---|---|---|
| Scope | Everything in one repo | Harness only; side projects removed |
| Licence | MIT | MIT core plus planned Fair Source/proprietary add-ons |
**Trade-off:** A local, single-process harness can't support multi-device, remote or enterprise use. The business needs a server-side story.

### Jul – Sep 2026 · Durable client/server harness (local process → routed sessions, experimental)
**Forced by:** The same feature needs to run in an agent worker, a terminal UI and a remote web UI (from the Chord README). Sessions also need to outlive the local process.
```
BEFORE
  TUI/RPC/SDK ─► AgentSession (in-process) ─► session.jsonl
AFTER
  TUI / *web / remote* ─► *pi-client* ═*pi-protocol (CBOR, v8)*═► *pi-server*
                                          │ routes Sessions, multiple attached views
                             *chord (facets, services, replicated state)*
                             *pi-durable: memory | JSONL | SQLite* · *session-backends*
  *ModelRuntime* (v0.80.x, Jul): chat + image generation + classifiers, one auth path
```
| | Before | After |
|---|---|---|
| Session lifetime | Tied to one local process | Durable records; attach and detach from several front ends |
| Transport | stdin/stdout JSON | Transport-neutral (WebSocket, Unix socket), versioned protocol |
**Trade-off:** This contradicts the original "tiny core" idea. It's all labelled *experimental*. The open question is whether the 4-tool CLI stays minimal while the monetizable server layer grows underneath it.

---
The pattern across all of this: the loop and the 4 tools have barely changed. Every expansion happened around them: front ends, extensions, packages and now the server.

**Sources:** [pi launch post](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) · [pi repo](https://github.com/earendil-works/pi) + coding-agent CHANGELOG, package READMEs, GitHub/npm APIs · [Armin Ronacher: Pi in OpenClaw](https://lucumr.pocoo.org/2026/1/31/pi/) · [Mario and Earendil](https://lucumr.pocoo.org/2026/4/8/mario-and-earendil/) · [RFC 0015 Pi Licensing](https://rfc.earendil.com/0015/) · [piagent.fyi on the move to Earendil](https://piagent.fyi/news/pi-joins-earendil/) · [eWeek on OpenClaw/pi](https://www.eweek.com/news/openclaw-pi-coding-agent-ai-tools-neuron/) · [The Register on Anthropic's subscription change](https://www.theregister.com/2026/04/06/anthropic_closes_door_on_subscription/) · [MindStudio on the OAuth ban](https://www.mindstudio.ai/blog/anthropic-openclaw-ban-oauth-authentication) · [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/building-pi-and-what-makes-self-modifying)

### 5 · **user:**

how does pi compare now with agent sdks and managed agents.

### 6 · **assistant:**

[ran: Skill — claude-api]
[ran: Bash — Look up Managed Agents pricing and self-hosting notes]

**Short answer:** pi now sits in the same layer as the Claude Agent SDK. It gives you the agent loop and you run it yourself. Its bet is the opposite, though: a minimal core that works with any model, instead of a batteries-included agent tied to one vendor. It doesn't compete with managed agents yet. Its experimental durable-session server (Jul–Sep 2026) is the first sign it's heading there, self-hosted.

## Two separate questions
1. **Who writes the loop** (the harness, i.e. the agent loop plus context management)?
2. **Who runs it** (servers, sandbox, sessions, scheduling)?

| | You write the loop | Library gives you the loop | Vendor runs loop + infra |
|---|---|---|---|
| Options | Raw model API calls, Vercel AI SDK | **pi**, Claude Agent SDK, OpenAI Agents SDK, Google ADK, LangGraph, Mastra | Claude Managed Agents, AWS Bedrock AgentCore, Vertex AI Agent Engine, OpenAI Codex cloud / AgentKit *(details unverified)* |
| You host it? | Yes | Yes | No (some allow a self-hosted sandbox) |

## pi vs the other agent SDKs

| | **pi** | **Claude Agent SDK** | **OpenAI Agents SDK / ADK / LangGraph** |
|---|---|---|---|
| Core idea | Tiny core that you and the agent extend | The Claude Code harness packaged as a library | A framework for putting agents together (handoffs, graphs, guardrails) |
| Built-in tools | 4: read, write, edit, bash | Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch, plus MCP and subagents | Few or none; you define them |
| Base prompt size | ~1k tokens | Large (Claude Code's prompt) | Up to you |
| Models | 8+ providers; can switch mid-session | Claude only | Mostly one vendor, others via adapters |
| Permissions | None by default ("YOLO"); add via extensions | Built-in permission modes and hooks | Guardrails and approvals built in |
| Sub-agents / MCP | Not built in; add as extensions | Built in | Built in (handoffs, graphs) |
| Session state | Local JSONL tree (branch, compact, share); experimental SQLite / durable store | Local session resume | LangGraph: checkpoint store; others vary |
| Front ends | TUI, RPC, SDK; experimental client/server protocol | SDK plus the Claude Code CLI | SDK only |
| Licence | MIT; Earendil plans paid add-ons | Proprietary, from Anthropic | Mostly open source |

**Where pi wins:**
- You can see and control every token the model receives.
- It's cheap on context.
- It isn't tied to one model vendor, which matters after Anthropic's third-party OAuth ban in 2026.
- It has the strongest "the agent writes its own tools" story.
- It's proven as an embedded runtime (OpenClaw).

**Where pi loses:**
- There's no safety layer out of the box.
- You build (or install) MCP, sub-agents and plan mode yourself.
- It's TypeScript only.
- The API surface is still changing: v0.x, 87 minor versions in 10 months.

## pi vs managed agents

| | **pi (today)** | **Claude Managed Agents** |
|---|---|---|
| Where the loop runs | Your process | Anthropic's servers |
| Where tools run | Your machine or container | Anthropic's per-session container, or your own sandbox via `self_hosted` |
| Agent config | Code and files on disk | Stored, versioned agent objects; each session pins a version |
| Long-running work | You keep the process alive | Server-side sessions with an event stream |
| Secrets | Environment variables on your machine | Vault credentials substituted on the way out; the sandbox never sees them |
| Scheduling / outcomes | Build it yourself (cron + RPC) | Built in: scheduled deployments, a grader that iterates against your rubric, multi-agent rosters, memory stores |
| Cost | Tokens only, plus your own infra | Tokens plus a platform runtime fee *(exact pricing unverified)* |
| Lock-in | None | Claude only; Managed Agents isn't on Bedrock, Vertex or Foundry |

**The gap is operations, not intelligence.** A managed service gives you sandboxing, secrets, persistence, scheduling, grading and multi-tenant sessions. pi's Jul–Sep 2026 packages are aimed at exactly the persistence and multi-front-end part:
- `pi-protocol`, `pi-server` and `pi-client`
- `chord` (replicated state)
- `pi-durable` (SQLite/JSONL storage)

Earendil's plan to put proprietary cloud features on top of the MIT core suggests they intend to offer a hosted pi. The core would stay open and model-agnostic, so they'd be selling operations, not model access. Much of this is still experimental.

## Which to pick
- **You want control, several model vendors, and a small context:** pi (or Vercel AI SDK if you'd rather write the loop yourself).
- **You're all-in on Claude, want Claude Code behaviour, and will host it:** Claude Agent SDK.
- **You want multi-agent workflows and orchestration primitives:** OpenAI Agents SDK, ADK or LangGraph.
- **You don't want to run sandboxes, sessions or schedulers:** Claude Managed Agents (or Bedrock AgentCore / Vertex Agent Engine on those clouds).
- **You want pi's philosophy with managed operations:** not available yet. Watch Earendil's `pi-server` work.

The pi facts come from the research earlier in this conversation. The Claude SDK and Managed Agents facts are from Anthropic's current docs. Details of the OpenAI, Google and AWS products are from memory and I haven't checked them. I can do a sourced pass on those if you want.
