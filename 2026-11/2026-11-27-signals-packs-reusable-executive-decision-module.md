---
schema: 1
id: 2026-11-27-signals-packs-reusable-executive-decision-module
title: "Signals packs: reusable executive-decision modules; learning layers are commoditizing"
why: "Packs pivot: if signals stays an executive-decision layer, packs become reusable decision modules whose compatibility check is just the existing conflict review \u2014 and the vehicle for cross-project learnings."
why_source: suggested
harness: claude-code
harness_version: 2.1.332
model: claude-opus-5-5
session_id: f355b21b-e2c0-45b8-8184-d8dd18e1836e
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-signals/f355b21b-e2c0-45b8-8184-d8dd18e1836e.jsonl
started: "2026-11-27T18:55:17.950Z"
captured: "2026-11-27T19:48:35Z"
cwd: ~/Documents/proj/claude/spark/signals
mode: "skill:i-have-adhd"
turns: 30
complete: true
golden_turns: [6, 20, 22, 30]
labels: [product-idea, agents, competitive-analysis, knowledge-mgmt]
thread: signals
status: raw
---

### 1 · **user:**

is there any similar idea of decision layer for coding agents that people are working on ?

### 2 · **assistant:**

Yes, there are a handful. Most of them fall into four groups, and none of the ones I found combines all of what signals does.

**1. ADR tooling for agents (the most common)**
- **adr-kit** is a drop-in skill, agent and template for keeping Architecture Decision Records with Claude Code, Cursor, Copilot and Codex. ([awesome.ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Frvdbreemen%2Fadr-kit))
- **Everything Claude Code (ECC)** has an ADR skill. It spots decision moments on its own and logs the context, the alternatives and the reasoning. ([SKILL.md](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/architecture-decision-records/SKILL.md))
- **Nimbalyst Wiki** has the agent write ADRs at the end of a session. It puts one-line rules in AGENTS.md and the full record in a wiki. ([Nimbalyst](https://nimbalyst.com/blog/architecture-decision-records-written-by-your-coding-agent/))
- There's also a fair amount of writing on the pattern: O'Reilly's [Coding agents love decision records](https://oreilly.com/radar/coding-agents-love-decision-records/), [ADRs as long-term memory for Claude Code](https://smartscope.blog/en/blog/claude-code-adrs-as-long-term-memory-stop-2026/) and DoiT's [Who owns the decisions?](https://www.doit.com/blog/your-ai-writes-the-code-who-owns-the-decisions).

These tools are almost all architecture-only, and most let the agent write records with no approval step.

**2. Decision or memory layers with a gate**
- **Lockstep** is described in a DEV post as a decision layer for teams. Approved decisions carry the choice, the reason, rejected options, an owner, a scope and a status, and team choices are kept apart from personal auto-memory. From the search summary this sounds like the closest match to signals, but I only saw that summary and haven't checked the product. ([DEV](https://dev.to/naman_here/ai-coding-agent-memory-why-agents-forget-and-the-fix-25j7))
- **PROJECTMEM** is a 2026 arXiv preprint. It keeps an append-only log of typed events, including decisions, serves it over MCP, and has a "pre-action gate" that warns the agent before it repeats a failed fix or edits a fragile file. ([arXiv](https://arxiv.org/html/2606.12329v1))
- A Blueprint whitepaper argues for the same principle signals uses: keep human-approved constraints separate from what the agent observed. In its words, "AI proposes…a human explicitly decides." ([PDF](https://bpcs.com/wp-content/uploads/2026/09/whitepaper-Blueprint_Champion-Series_Saket-Suman_AI-Coding-Agents.pdf))

**3. Spec-driven development**
- **GitHub Spec Kit** keeps a `constitution.md` of non-negotiable principles that every later command reads. The flow is constitution → specify → plan → tasks → implement. ([Spec Kit](https://github.github.com/spec-kit/), [Microsoft blog](https://developer.microsoft.com/blog/spec-driven-development-spec-kit/))
- **Kiro** works from requirements to design to implementation and uses steering files.

These are top-down and up-front: you write the spec, then the agent builds from it. Little flows back from the build into the spec.

**4. Plain rules files**
CLAUDE.md, AGENTS.md and Cursor rules work as a decision store with no structure, no owners and no conflict detection.

**Where signals still differs:**
- **Decisions owned by roles (CEO, PM, Architect).** Everything I found treats decisions as one flat type, usually architectural only. Product and business decisions next to architecture ones look rare.
- **The agent asks the store before choosing**, and answers come back with citations or "Undecided". Most tools only record decisions after they're made.
- **A batch review after a build** that collects the executive choices the agent made along the way. Lockstep and PROJECTMEM come nearest, but neither seems to run a review step like this.
- **Conflicts with stored decisions are shown to you, not resolved automatically.** I didn't find this described explicitly anywhere.

The idea is in the air: "decision records plus human approval" is clearly forming as a pattern. What looks less taken is the org-role framing and the loop of asking before choosing, then reviewing after the build.

If it helps for positioning, I can look closely at Lockstep and PROJECTMEM to see how close they really are.

### 3 · **user:**

yes, dig into Lockstep and PROJECTMEM

### 4 · **assistant:**

Lockstep is the real neighbour. PROJECTMEM shares the plumbing but is mostly a different product.

## Lockstep ([getlockstep.dev](https://www.getlockstep.dev/blog/persistent-memory-ai-coding-agents))
Everything here comes from Lockstep's own launch post, reposted on DEV on Nov 7, 2026. It reads as company marketing, not an independent review. The post says it's open source (Apache-2.0), self-hostable and "early", working with design partners. It gives no repo link.

**What overlaps with signals:**
- It calls itself a "decision layer" for coding agents, made for the context that "nobody owns."
- It covers product, billing and architecture decisions, not just ADRs.
- Each decision has an owner, a scope, a status, the reason and the rejected options. Old decisions are "superseded, not rewritten."
- Agents pull decisions "before an agent writes code" through an MCP tool, `get_product_context`.
- An owner approves each decision with one click.

**Where it differs:**
- **Capture comes from team tools**, not the build. Decisions are picked up where people make them (Slack first, then Notion, Jira, Confluence, Docs, PRs). Signals captures the choices the agent makes while coding.
- **Conflicts are checked at the PR.** A check flags changes that might contradict an approved decision; it warns by default and can be set to block. Signals catches them during the session and shows them for you to resolve.
- **Ownership is a single owner field.** It has no CEO/PM/Architect roles and doesn't route decisions by domain.
- **It's a hosted service.** Storage isn't described, but it looks like a service you run. Signals is markdown files in the repo.
- **Checking is optional for the agent.** The post itself says rules "guide behavior; they don't enforce it."

**Takeaway:** Lockstep targets team decisions coming from conversations, a top-down SaaS. Signals targets decisions made by one agent while building, a bottom-up skill. Their pitches will sound alike ("decision layer, human-approved, served to agents"). The clearest difference is where decisions come from: Slack versus the agent's own build.

## PROJECTMEM ([arXiv 2606.12329](https://arxiv.org/html/2606.12329v1), [repo](https://github.com/riponcm/projectmem))
A University of Utah preprint from June 2026, MIT licensed, installed with `pip install projectmem`.

- It's an append-only `.projectmem/events.jsonl` log with five event types: issue, attempt, fix, decision and note.
- Events come in through git hooks, a file-churn watcher, a CLI and 14 MCP tools. The agent writes events directly, and **I found no human-approval step** in the text the subagent read.
- Its "pre-action gate," `precheck_file(path)`, is a deterministic lookup run on a file. It warns about past failed attempts, open issues and frequently changed files ("you tried this 2 days ago—it failed"). **It does not check decisions.**
- It has no handling for superseding or contradicting decisions, no roles, and supports a single local user.
- The evaluation is the authors using it themselves for two months: 10 projects and 207 events. Token savings are estimated, and it makes no claim to prevent failures.

**Takeaway:** PROJECTMEM is a debugging memory ("don't repeat failed fixes") with decisions as a minor event type. It confirms the plumbing signals uses (plain text in the repo, served to the agent) but doesn't compete on decision governance. One idea worth borrowing is a deterministic, cheap precheck: a hook that raises the relevant decisions when the agent touches certain files or areas.

## What signals still has to itself
1. **Decisions owned by roles (CEO, PM, Architect).** Neither has it.
2. **Gating while the agent builds:** the agent asks the store, gets "Undecided", proposes, and waits for your approval. Lockstep checks at the PR; PROJECTMEM doesn't gate decisions at all.
3. **A batch review after a build** of the choices the agent made on its own. Neither has it.
4. **Conflicts shown in the session for you to resolve.** Lockstep's PR warning is the closest.

Sources:
- [Lockstep post on DEV](https://dev.to/naman_here/ai-coding-agent-memory-why-agents-forget-and-the-fix-25j7), originally on [getlockstep.dev](https://www.getlockstep.dev/blog/persistent-memory-ai-coding-agents)
- [PROJECTMEM paper](https://arxiv.org/html/2606.12329v1)
- [PROJECTMEM repo](https://github.com/riponcm/projectmem)

### 5 · **user:**

i think integrating failures as mem is an interesting idea to extend signals. these failures (experiences / learnings - agent & human) can fuel not just current project! -- logging what did not work and what worked !

### 6 · **assistant:**

Yes, I think this fits, as long as it stays at the same level as the rest of signals. Here's how I'd shape it.

**Why it fits.** A decision records what you chose. A learning records what you tried and what happened. Learnings are the evidence behind decisions, and the store mostly has this already in a weaker form. A rejected option is a learning without its outcome. A superseded decision is a failure with its reason.

**The risk is flooding.** PROJECTMEM logs every failed fix. Do that in signals and the executive store fills with debugging trivia like "the retry loop crashed on null". Only keep learnings that change an executive decision. "Tried JWT, the refresh-token handling got out of hand, moved to server sessions" belongs. "The regex was off by one" doesn't. It's the same rule the CEO, PM and Architect roles already follow.

**Using learnings across projects is the big idea, and also the risky part.** A learning from project A can be wrong in project B. "SQLite was fine" holds for a single-user tool, not a multi-tenant SaaS. So:
- **Every learning records the conditions it held under**: scale, users, constraints. Without those it can't be judged in a new project.
- **Learnings from other projects are evidence, never decisions.** A role can cite one: "In project X, a 7-day trial converted worse." It still goes through the normal proposal and your approval. The gate stays.
- **Learnings move up deliberately.** A project learning goes into a global `~/.signals/` only when you mark it, much like PROJECTMEM promotes only lessons marked as durable.

**Agent and human learnings are different kinds of evidence:**
- Agent learnings are technical: "lib X can't do Y", "this approach needed three rewrites."
- Human learnings are about product and market: "users ignored the onboarding tour", "nobody paid for tier 2."

The human kind is the one no coding-agent memory tool captures, and it fits the CEO and PM roles better than anything else.

**Smallest version worth trying:**
1. When a decision is superseded, record the outcome: what happened and the conditions at the time. Each reversal then becomes a learning automatically.
2. Add a "tried / didn't work" prompt to the `/signals update` review, so the build's dead ends are collected alongside its choices.
3. Later: a global store of learnings you've explicitly promoted, which roles can cite as evidence from other projects.

This also serves your TODO goal of "regenerate codebase just with context". Rebuilding a project from its decisions alone repeats its dead ends. Decisions plus learnings don't.

Want me to record this as a proposed PM decision with `/signals update`? Something like "signals captures learnings (outcomes of tried approaches) as evidence for decisions; learnings from other projects are advisory and never bypass the gate." Then it's settled before anyone builds it.

### 7 · **user:**

what can we learn from PROJECTMEM and Lockstep  that are interesting to integrate in signals ?

### 8 · **assistant:**

I read signals' current `SKILL.md` first, so I've left out what it already does. Replacing decisions with a reason (`not: … replaced <date>: reason`), code scope (`code: <globs>`), `drift` and `revisit:` triggers are all there. Here's what's left, best first.

### Worth taking

**1. A file-based check before edits (from PROJECTMEM's `precheck_file`).** This is the biggest gain. Signals currently depends on the agent remembering to ask the store. Lockstep's own post admits rules "guide behavior; they don't enforce it." But each decision already has `code: <globs>`. A small PreToolUse hook on Edit/Write could look up decisions whose globs match the file being edited and put them in front of the agent:
```
signals: editing src/auth/session.ts → arch/auth#server-sessions (30-day idle, no JWT)
```
It needs no model call, it's deterministic, and it turns "ask the store before choosing" from a hope into the default.

**2. Drift as a PR check (from Lockstep).** Run `drift` only on decisions whose `code:` globs touch the diff, as a CI step or a step in `/ship`. It warns by default and blocks only if you opt in, which is Lockstep's design and the right one. Drift becomes ongoing instead of something you have to remember to run.

**3. Remember rejected proposals (from Lockstep's `rejected` status).** Today rejected drafts are deleted, so next session the agent can propose the same thing again. Record a rejection as a `not:` line on the nearest decision, with your reason. It's tiny, and it's the first piece of the failures-as-memory idea: "what didn't work" includes "what the board said no to."

**4. Seed the store from git history (from PROJECTMEM's `pjm init` backfill).** An empty store is the barrier to adopting signals. `/signals init` could read git history, the README and PR descriptions for executive choices, and put them all into one batch review. The gate stays intact because nothing lands without your approval. Reverts and rewrites become `not:` entries with reasons, which are learnings again.

**5. Repeated rewrites as a hint that something is undecided (from PROJECTMEM's churn signal).** If a file gets rewritten 3+ times in a session, there's usually an unsettled choice behind it. The `/signals update` review could ask: *"auth flow rewritten 3× — is there an undecided choice here?"* It catches the executive choices the agent makes without saying so.

### Leave out
- **Append-only event log.** Signals keeps current state, and git already keeps the history.
- **MCP server and hosted storage.** Markdown in the repo is what lets any agent read the store without integration.
- **Slack and Notion capture.** That's Lockstep's team-SaaS niche. PR review comments might be worth adding to the batch review later.
- **Context limited by token budget.** Main files plus partitions already bound the load.

### Suggested order
Do 3 first: about one line in the skill, and it seeds learnings. Then 1, the hook, which changes the most. Then 4, which removes the cold start. 2 and 5 can wait.

Want me to prototype the hook (1)? It's a small script plus a `settings.json` entry, and I'd test it against `test/.signals/`.

### 9 · **user:**

why MCP server and hosted storage ?? how does it help ?

### 10 · **assistant:**

I put those under "leave out", but there is a real case for them. Here's what they buy and why I don't think signals needs them yet.

### What an MCP server gives
An MCP server puts the store behind tools like `get_decisions(path)` and `propose_decision(...)`, instead of the agent reading markdown files.

- **Works in any agent without the skill.** Cursor, Codex and others can query it with no SKILL.md installed.
- **Rules run in code, not in the prompt.** "Never write without approval" and "no conflicts in the store" become checks the server performs. Today a careless agent can edit `.signals/arch/auth.md` directly, and the only thing stopping it is the skill's instructions.
- **Lookups don't cost context.** The agent asks "what applies to `src/auth/`?" and gets 3 decisions back, instead of loading main files plus partitions.
- **A structured interface.** Decisions come back as typed fields, so tooling (CI checks, dashboards) has something stable to call.

### What hosted storage gives
Hosted storage keeps the store in a service instead of the repo.

- **Several repos share one store.** This is where it matters for your learnings idea: CEO decisions and learnings can cover several projects (one company, many services). Files in each repo can't share that without copying.
- **People who don't use git can take part.** A PM or founder approves decisions from a web page or Slack, which is Lockstep's whole pitch. Today the board has to be inside an agent session.
- **Approvals happen outside a session.** Today a decision can only be approved while an agent session is running. With a service, the agent proposes, the owner gets notified, approves later, and the agent continues.
- **Access control and an audit trail:** who may approve CEO decisions, and who approved what and when.

### Why I'd still wait
- **Markdown in the repo is the product's edge.** It's diffable, reviewable in PRs, versioned with the code it governs, needs no install, and any agent can read it. Hosting gives that up and makes signals a Lockstep competitor in Lockstep's own space.
- **Most of what MCP gives can be had more cheaply.** The hook (idea 1) enforces lookups. A pre-commit check can block edits to `.signals/` that weren't approved. Both cost little and keep the files as they are.
- **The hosted benefits are team benefits.** They matter once several people or repos share decisions. Signals today is one developer working with one agent.

### When it would change
I'd revisit this if any of these comes true:
1. **Learnings across projects become real.** A global store is needed, and a local `~/.signals/` will do for one person, but a team needs something shared.
2. **Someone who doesn't code needs to approve decisions.**
3. **People want signals in agents that don't support skills.** At that point a thin MCP layer could serve the same markdown files, with no hosting needed.

Option 3 is the middle path. A local MCP server that reads and writes `.signals/*.md` gets you enforcement and portability without giving up files in the repo.

### 11 · **user:**

dump this discussion into RESEARCH.md

### 12 · **assistant:**

I've saved the whole discussion to `RESEARCH.md` in the repo root. It covers:

- **The landscape:** ADR tools, gated memory layers, spec-driven development and plain rules files.
- **Lockstep and PROJECTMEM:** what overlaps with signals and what doesn't. The Lockstep part relies on the company's own marketing post.
- **What signals still has to itself.**
- **Failures and learnings as memory:** your idea, including the risks of sharing learnings across projects.
- **What to borrow:** five ideas, what to leave out, and a suggested order.
- **Sources.**

The file isn't committed.

### 13 · **user:**

/i-have-adhd

### 14 · **assistant:**

ADHD mode is on and stays on until you say "stop adhd mode".

**Where things are:** `RESEARCH.md` is written in the repo root but not committed.

**Next (2 min):** pick one:
1. Commit `RESEARCH.md`.
2. Add the one-line change to `SKILL.md` that records rejected proposals as `not:` lines. About 5 minutes.
3. Prototype the hook that shows matching decisions before the agent edits a file. About 30–45 minutes, including a test against `test/.signals/`.

Reply 1, 2 or 3.

### 15 · **user:**

what are some interesting non-trivial ways to monetise signals ?

### 16 · **assistant:**

The skill is Apache-2.0, so anyone can fork it. Money has to come from what a fork can't copy: data, trust, routing approvals to people, and services. Here are 5 options, best first.

**1. Audit trail for AI-written code** (recommended: clearest buyer, and money now)
- Signals already records who decided what: the agent proposed, a named human approved, with the reason and the rejected options.
- Regulated teams need exactly that as evidence of human oversight of AI code, for SOC 2, ISO 27001 or the EU AI Act.
- Sell: signed exports of the decision history, plus a dashboard of decisions and drift per repo.
- Buyer: CTO or compliance lead. Willingness to pay is high and the purchase isn't optional for them.

**2. Shared learnings across teams** (most interesting, and the long-term moat)
- Pool anonymized learnings tagged with their conditions: "server sessions over JWT, SMB SaaS, under 1k users, worked."
- A role can then cite evidence from other projects: "7 projects like yours tried X; 5 reverted."
- A fork can't copy the data. Paid tier: access to the pool.
- Risks: privacy, and learnings that don't hold in a new project. It needs many users before it's worth anything.

**3. Decision dossiers for handovers**
- `/signals explain` becomes a paid deliverable: agency handover to a client, contractor offboarding, or technical due diligence for an acquisition.
- Agencies resell it as "you get the code and every decision behind it."
- Charge per dossier or per agency seat.

**4. Approvals routed to real people (team tier)**
- Today one human is the whole board. For teams, route each approval to the person who owns that role: CEO decisions to the founder, Architect decisions to the tech lead, through Slack or the PR.
- This is Lockstep's territory. The difference is roles and capture during the build.
- Charge per seat.

**5. Starter decision packs**
- Pre-made stores written by experts: "B2B SaaS: auth, billing, multi-tenancy", "HIPAA app: data and hosting."
- They solve the empty-store problem. Run it as a marketplace with revenue share.
- It's cheap to start, but the market is small.

**Next (2 min):** choose 1 or 2 as the direction to explore first. I can then run a `/signals panel` on it, since a business model is a CEO decision and isn't in the store yet.

### 17 · **user:**

starter decision packs is awesome !

### 18 · **assistant:**

**Next (2 min):** pick which pack to build first. My suggestion is "B2B SaaS starter", because `test/.signals/` already holds auth, onboarding and business decisions you can reuse for it.

**Why packs fit signals**
- **They remove the empty store.** That's the biggest barrier to anyone adopting signals.
- **The gate stays intact.** Installing a pack loads its decisions as proposals into one batch review, and you approve, drop or reword each one. A pack never writes decisions directly.
- **They carry learnings.** Every pack decision has `not:` and `revisit:` lines, which are a team's learnings in a form people can sell.

**Risks to design around**
1. **Decisions that don't fit the project.** A pack decision made for 10k users is wrong for a hobby app. Each pack decision needs a "holds when" line (scale, audience, budget), and the review shows it.
2. **Small revenue.** Packs on their own are a small market. They work better as the way people find signals: free starter packs, paid expert packs.
3. **Paid packs connect to compliance.** Paid compliance packs (HIPAA, SOC 2) lead straight into option 1, the audit trail. Packs bring people in; the audit trail is what makes money.

**Smallest test (about 1 hour)**
1. Copy `test/.signals/` to `packs/b2b-saas/` and add a "holds when" line to each decision.
2. Start an agent in an empty folder and install the pack through a batch review.
3. Check: does reviewing about 10 pack decisions take under 5 minutes and feel useful?

This is a CEO decision (big bet plus business model), and the store has nothing on it yet. If you want it recorded, say "record it": I'll draft "starter decision packs, installed as proposals through review; free starter packs, paid expert and compliance packs" for your approval.

### 19 · **user:**

how are packs different from skills or documentations

### 20 · **assistant:**

A pack is the only one of the three that turns into your project's binding decisions, and only after you approve it. Docs tell you what's possible, a skill tells the agent how to do something, and a pack proposes what this project should choose.

| | Docs | Skill | Pack |
|---|---|---|---|
| Says | what's possible, how things work | how to do a task | what to choose here |
| Form | explanations | procedures for the agent | decisions: what / why / not / revisit |
| Binding? | no, reference only | it shapes how the agent acts | yes, once you approve it |
| Checked against code? | no | no | yes, by drift and conflict checks |
| Changes over time? | rewritten by its author | updated by its author | your copy changes through review, with a reason |

**Example: auth**
- **Docs:** "JWT vs sessions: pros and cons."
- **Skill:** "How to implement session auth in Express."
- **Pack:** "Server sessions, 30-day idle timeout, no JWT. Why: SMB users hate logging in again. Not: JWT, because revocation is hard. Revisit: if you add a mobile app."

After approval, the pack's line is your Architect's decision. The agent has to follow it, and drift flags code that breaks it.

**The honest caveat:** without signals, a pack is just opinionated docs. The difference comes from the engine (approval, conflict checks, drift). So:
- signals is the engine, which is free and can be forked;
- packs are content that runs on it, which is where the value is.

**Distribution:** a pack can ship as a skill package, installed with `npx skills add`, that contains a seed store. Use skills as the delivery channel; the product stays the decisions.

**Next (2 min):** say whether the pack test from before is still on (copy `test/.signals/` into `packs/b2b-saas/`).

### 21 · **user:**

pack pivot : 
if working only on exec decision layer works, packs can be modular thing that can be reused across.
yes there might be compatibility checks before using it.

if not marketplace of packs, atleast it a good dev exp.

### 22 · **assistant:**

**Next (2 min):** say "record it" and I'll draft this as a PM decision for your approval:
> Packs are reusable modules of executive decisions. Installing one runs the existing conflict check and loads the pack's decisions into a review as proposals.

**Why the pivot holds:** most of the compatibility check already exists. Installing a pack is the same as a batch review of outside decisions, and the review already runs conflict checks against your store. A clash shows up as a forced choice, like any other conflict.

**What a modular pack needs** (beyond what signals already does)
1. **Requires:** the decisions the pack assumes, e.g. "has a server" or "SMB audience". If one is missing, the pack is incompatible before the review even starts.
2. **Source tag:** each decision installed from a pack records where it came from, e.g. `from: auth-sessions@1`. That's what makes upgrades possible.
3. **Upgrades:** pack v2 changes a decision → you see the difference as a review, and decisions you edited locally are kept.
4. **Packs that use each other:** an auth pack plus a billing pack can link through `serves:`, so they combine and don't just sit side by side.

**The developer-experience win:** you make packs from your own finished projects. A command like `/signals pack arch/auth` exports a partition from project A, and you install it in project B. That's also where cross-project learnings live: a pack is how learnings move between your projects, with their conditions and `not:` lines attached. One mechanism covers both ideas.

A marketplace can come later; it's just packs other people publish.

**Smallest test (about 1 hour)**
1. Export `test/.signals/arch/auth.md` as a pack with a requires line.
2. Install it into an empty store. It should load as proposals.
3. Install it into a store that has a JWT decision. It should show up as a conflict.

### 23 · **user:**

add the packs pivot to RESEARCH.md

### 24 · **assistant:**

I added two sections to `RESEARCH.md`, just before Sources:
- **Monetization options:** the 5 options, ranked.
- **Packs:** how packs differ from docs and skills, the pivot to packs as modules, what a modular pack needs, the "make packs from your own projects" idea, the business angle and the 1-hour test.

`RESEARCH.md` is still not committed.

**Next (2 min):** say "commit it" to commit `RESEARCH.md`, or "record it" and I'll draft the packs pivot as a decision for your approval.

### 25 · **user:**

is it worth to build my own software factory ?

is it worth to build my own software factory with signals ?
will i be able to compete in that space just with signals experience ?

### 26 · **assistant:**

**Short answer:** build a factory for your own projects, yes. Compete with it commercially on signals alone, no. Make signals the decision layer that factories plug into.

**Why competing as a factory is hard**
- **Your rivals own the models.** Anthropic, OpenAI and GitHub, plus funded startups like Devin, Factory, Replit and Lovable, all ship factories directly.
- **A factory is mostly infrastructure.** Sandboxes, agent coordination, CI, evals, integrations and security. Signals covers none of it, and each piece is months of work.
- **You'd be fighting for users** against products that come bundled with the tools people already use.

**What signals does give you**
- **Steering is the weak spot every factory has.** Factories build fast but drift from what the humans wanted, and "who decided this?" has no answer. Signals answers it: the human is the board.
- **It's model-neutral.** It's markdown in the repo, so it works with whatever factory wins. Being neutral is the position the platforms can't easily take.
- **Packs and learnings build a lead that grows with use** if many factories run on them. A factory of your own doesn't build that lead.

**Ranked options**
1. **Decision layer for every factory** (recommended). Signals plus packs, with ways to plug into Claude Code, Codex and Devin. Small to build; the risk is that a platform builds its own.
2. **Your own factory as a test bed.** Claude Code + signals + hooks + `/ship`, used on your own projects. Roughly 1–2 weekends for a first loop. Worth it for what you learn and for using signals in real work, not as a product.
3. **Factory for one niche** where decisions dominate, e.g. agencies building client apps, with packs plus handover dossiers. Possible, but only after option 2 shows the loop works.
4. **General commercial factory.** Not on signals experience alone. You'd need capital, an infrastructure team, and a reason people would switch.

One caveat: the factory list comes from what I knew by mid-2026. I haven't searched the market as it is now.

**Next (2 min):** say "panel it" and I'll run a `/signals panel` on option 1 vs option 3. Choosing a direction is a CEO decision, and nothing is recorded yet.

### 27 · **user:**

should i just opensource it ?

### 28 · **assistant:**

It's already open source. The repo `smarchone/signals` is public under Apache-2.0, and anyone can install it with `npx skills add smarchone/signals -g`. So the real question is what stays open and what you can charge for later.

**Keep open (recommended): the engine and the free packs.**
- Being the decision layer every factory uses (option 1) needs people adopting it. Open is how a markdown skill spreads.
- Being neutral is the advantage, and a closed decision layer isn't neutral.
- Right now users and feedback are worth more than revenue.

**Can be paid later: things a fork can't copy.**
1. Hosted audit trail and compliance exports.
2. The shared pool of learnings across teams (the data is the moat).
3. Paid expert and compliance packs.
4. Routing approvals to the right people on a team, as a hosted service.

**What Apache-2.0 means for you**
- Anyone, including the AI platforms, can fork it and ship it commercially. That's the trade you make for adoption.
- Forks must keep your NOTICE and attribution. That part is already set up.
- You could license future versions differently, but the code released so far stays Apache.
- The name matters more than the license. Consider registering "signals" as a trademark if it ever becomes a product. It's also a very common word, so check for conflicts first.

**Next (2 min):** say "commit it" to commit `RESEARCH.md`. These open-vs-paid notes can go in it too if you want.

### 29 · **user:**

are there any learning and experience layers in the market ? 
that dreams on sessions and creates the layers useful for future sessions ?
opensource or commercial

### 30 · **assistant:**

Yes, and the space is crowded. Anthropic ships "Dreaming" itself, and at least 5 open-source tools turn past sessions into memory or lessons. A few of them already have human approval gates.

**Built by the platforms**
1. **Anthropic Dreaming** (Claude Managed Agents, research preview, around May 2026). It takes a memory store plus up to 100 past sessions and writes a new store: duplicates merged, stale entries replaced, new insights added. [workshop](https://claude.com/code-with-claude/session/ldn-ext-agents-that-remember) · [setup guide](https://vantaige.io/blog/claude-code-dreaming-memory-consolidation-setup-2026)
2. **Codex CLI** pulls memories out of past sessions and consolidates them, according to a survey of coding-agent source code. [arXiv](https://arxiv.org/pdf/2604.03515)
3. **Letta sleep-time agents.** Background agents reorganize shared memory between sessions. It's open source, marked experimental, and moving to memory stored as git-backed files. [Letta](https://letta.com/blog/sleep-time-compute) · [docs](https://docs.letta.com/guides/agents/architectures/sleeptime/index.md)

**Open source, closest to your idea**
1. **agent-dream**: runs a background pass over recent sessions for Claude Code, Codex, Gemini CLI, Cursor and OpenCode. It "applies nothing until you approve." [GitHub](https://github.com/Ariiima/agent-dream)
2. **Beacon** (Asymptote Labs, MIT): captures sessions and turns lessons into skills. A human approves each lesson before it becomes one. [beacon.sh](https://beacon.sh/)
3. **OpenReflex** (MIT): learns from each task, advises the next one, and flags failure loops while the agent works. Its lessons come from verified outcomes. [GitHub](https://github.com/vishnu-77/openreflex)
4. **Hindsight** (Vectorize, MIT): extracts facts from each session, then a background step consolidates them into observations backed by quoted evidence. [review](https://academy.codearia.com/en/articles/hindsight-agent-memory-claude-code)
5. **projectmem**: the one from before; failed attempts plus warnings before the agent acts. [GitHub](https://github.com/riponcm/projectmem)

Two more search past sessions but don't turn them into lessons: [session-recall](https://github.com/AbsoluteMode/session-recall) and [deja-vu](https://github.com/vshulcz/deja-vu).

**Research:** [Auto-Dreamer](https://arxiv.org/pdf/2605.20616) learns how to consolidate memory offline. [MemDream](https://arxiv.org/pdf/2609.34545) has memory probe and evolve itself.

All of these claims come from READMEs and blog posts. I didn't test the tools or check whether they're maintained.

**What this means for signals**
- **A general learning layer is turning into a commodity.** The platforms ship it natively, so don't build one.
- **"Gated" is no longer unique on its own.** agent-dream and Beacon also wait for human approval.
- **What's still open:** none of these work at the executive level, with roles, conflict checks against stored decisions, or reusable packs. They learn what happened. Signals decides what should hold.
- **The better move: use dreaming as an input.** A dream pass over sessions could propose executive decisions and learnings into the `/signals update` batch review. You get Anthropic's or agent-dream's consolidation for free, and signals stays the gate and the source of truth.

**Next (2 min):** say "add it" and I'll append this to `RESEARCH.md`.
