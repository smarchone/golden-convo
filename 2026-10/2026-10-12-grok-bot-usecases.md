---
schema: 1
id: 2026-10-12-grok-bot-usecases
title: Grok Bot — single-job agents sharing one always-on cloud computer logged in as you
why: "grokbot usecases"
harness: claude-code
harness_version: 2.1.296
model: claude-opus-5-5
session_id: d2dcf112-8b16-4f71-8514-b178ab91ba5d
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/d2dcf112-8b16-4f71-8514-b178ab91ba5d.jsonl  # best-effort; the harness may delete it
started: 2026-10-12T20:46:29.903Z
captured: 2026-10-12T21:45:32Z
cwd: ~/Documents/proj/claude/spark/ideas
mode: skill:few-shot
turns: 16
complete: true
golden_turns: [8, 12, 16]
labels: [agents, grok-bot, few-shot]
status: raw
---

### 1 · **user:**

/origin-story https://boskykode.com/

### 2 · **assistant:**

[ran: fetch boskykode.com + web search "boskykode" — both rejected by user; request interrupted]

### 3 · **user:**

/productivity:few-shot grokbot usecases

### 4 · **assistant:**

[ran: asked a question]

I can't pin down "grokbot" for sure, and I don't want to guess and give you shots for the wrong thing. Which one do you mean?
- @grok on X — xAI's Grok as a reply bot you tag in X threads.
- Grok assistant — xAI's Grok chatbot/API used directly.
- A specific product — a niche tool named GrokBot.
- Look it up — let me search the web and pin the target before writing shots.

### 5 · **user:**

Look it up

### 6 · **assistant:**

[ran: web search "grokbot"]
[ran: fetched Cursor docs "Get started with Grok Bot", Vellum's Grok Bot breakdown, Analytics Vidhya's Grok Bot tutorial]

# Grok Bot in 6 shots
xAI's beta agent: named bots doing async work on a persistent cloud computer, using your logins.

*Pinned target:* **Grok Bot**, launched in early beta on Aug 11, 2026 and sold through Cursor and SuperGrok plans. There is also an xAI web crawler with the user agent `GrokBot/1.0`. It's unrelated and I've left it out. The prompts below are illustrative. The behaviour in each Output comes from the docs or from published hands-on reports.

## Shot 1 · Canonical · Hand it off and close the laptop
**Input:** You send one message to a new bot whose only job is perf triage.
```
Job: investigate p95 latency regression on /checkout since Tuesday's deploy.
Sources: Datadog dashboards, Sentry, the release notes in Drive.
Constraints: never change production settings.
Deliverable: report with links + screenshots; evidence and hypotheses in separate sections.
Stop and ask me before: opening any ticket or pinging anyone.
```
**Output:** The bot works on its own cloud VM, which has a browser, filesystem, terminal, connectors and MCP tools, so the work carries on after you close the laptop. You read the report in the morning. Files, browser sessions and memory carry over to the next task.
**Signal:** The unit of work is a brief: outcome, sources, constraints, deliverable and stop point. It isn't a chat turn. Cursor's guide recommends giving each bot one focused job.

## Shot 2 · Real-world · A bug-repro bot meets a real repo
**Input:** Analytics Vidhya tutorial. A GitHub plugin was added with a fine-grained PAT scoped to one repo (Issues read/write, Metadata read-only). The token went into the plugin, not the chat. The bot was then told to reproduce bugs.
**Output:**
- First run: it guessed the wrong repo and reported "0 open issues across 4 repos."
- Pointed at the right repo, it worked out the setup by itself: `requirements.txt`, then `.streamlit/secrets.toml`, then `streamlit run dnd.py` on port 8501.
- The tracker was empty, so the job changed to finding bugs. It found 4 real ones: an XSS through `unsafe_allow_html`, an unpinned `ChatOpenAI` model, swallowed exceptions, and a hero-deselect action that wipes the quest log.
**Signal:** Its environment-bootstrapping is strong. Its guesses about context are weak. You supply scope (repo, URL, staging); it supplies the legwork.

## Shot 3 · Edge · The login wall
**Input:** In the middle of a task, the bot reaches a vendor portal that needs a password and 2FA.
**Output:** It hands over control. You click **Open computer**, type the credentials yourself and give control back. The docs say the bot doesn't see your password, and the session persists on the cloud computer.
**Signal:** Credentials never go into chat (chat is stored server-side). The catch is that every later task runs as you on that site.

## Shot 4 · Edge · Two bots, one computer
**Input:** You run `finance-bot`, which is logged into your bank's web portal, and `research-bot`, which browses arbitrary sites. Both belong to the same user.
**Output:** Multiple named bots share one user-scoped computer, and permissions apply across all of them. A prompt injection on a page `research-bot` reads lands on a machine with a live bank session. Vellum: *"Bot boundaries aren't security boundaries."*
**Signal:** A bot is a unit of context and memory, not an isolation boundary. Real separation comes from separate accounts or approvals (Allow once / Deny / Always allow, plus Auto Review).

## Shot 5 · Near-miss · A nightly ETL from an API
**Input:** "Every night at 2am, pull yesterday's orders from Shopify's API and append them to a BigQuery table."
**Output:** Grok Bot can do this as a routine, but every run spends tokens against a weekly cap and drives a general-purpose agent where a 40-line script would do. A cron job plus a script is cheaper, deterministic and observable.
**Signal:** The good fit is judgment work or sites with no API, which it drives through the browser. A deterministic pipeline over a stable API is the wrong tool.

## Shot 6 · Real-world · Handoff between bots
**Input:** A group chat (2–6 bots) with `account-health` and `qa`. After a release, `account-health` flags a customer whose sessions keep dropping.
**Output:** It writes `at_risk.csv`, including the customer and the date, to the shared cloud filesystem. `qa` reads the file and looks for a frontend regression around that date. Each bot keeps its own memory. Long reports passed through chat lose detail.
**Signal:** Bots coordinate through shared files, the way Unix processes do, not through conversation.

## Pattern
- **Bot = a narrow job plus its own memory**, running on **one shared, persistent VM per user**.
- **Async by design.** You write a brief with a stop point, not a prompt-and-wait.
- **It acts as you.** Logins persist, approvals gate side effects, and bots don't isolate from each other.
- **Browser driving fills API gaps.** That's its edge, and also its silent failure mode (CAPTCHAs, redesigns).
- **Costs scale with tokens.** It pays off on judgment-heavy work, not on deterministic plumbing.

## Coverage
Covered: bots, cloud computer, task briefs, plugins/PAT scoping, login handoff, shared-computer risk, routines vs cron, multi-bot handoff via files.
Not yet: skills and teaching by demonstration, Team Bots, Auto Review modes in detail, custom MCP (must be publicly reachable, so local servers need a tunnel), the iPhone app, memory opacity (no API to inspect or export it), pricing and caps.

Sources disagree on a few points:
- **Linux desktop app:** Cursor's docs list it, but one secondary summary says it doesn't exist.
- **Trial length:** 7 or 14 days.
- **Routines with your computer off:** Analytics Vidhya says they don't run then, which is hard to square with the cloud-VM design. *(disputed, unverified)*

## Your turn
A routine runs nightly at 2am. It logs into a supplier portal that has no API (session kept from Shot 3), downloads invoices and saves them to Drive. Auto Review is set to **Always Allow**. Three weeks in, the supplier redesigns the portal and moves the download button behind a new "Documents" tab.

What do you see the next morning, and what should you have built into the brief to catch it?

Sources:
- [Cursor docs: Get started with Grok Bot](https://cursor.com/docs/grok-bot/get-started)
- [Vellum: Official Grok Bot breakdown](https://www.vellum.ai/blog/official-grok-bot-breakdown) (a vendor-written comparison, so treat its rankings as promotional)
- [Analytics Vidhya: Getting started with Grok Bot](https://www.analyticsvidhya.com/blog/2026/09/grok-bot-automation-tutorial/)
- [GIGAZINE: SpaceXAI Grok Bot](https://gigazine.net/gsc_news/en/20260812-spacexai-grok-bot/)
- [botcrawl: GrokBot crawler](https://botcrawl.com/bots/grokbot)

### 7 · **user:**

give me a distilled version of it. easier for me to read

### 8 · **assistant:**

# Grok Bot, distilled
An AI agent from xAI that does tasks for you on its own cloud computer, even with your laptop closed.

## The 6 shots

| # | Situation | What happens | Lesson |
|---|---|---|---|
| 1 | You give a bot one job, with a clear goal, sources, rules and a point where it should stop and ask | It works overnight on its cloud computer, and the report is waiting in the morning | Give it a written brief, not a chat question |
| 2 | Bug-hunting bot gets a GitHub token limited to one repo | First it picked the wrong repo. Once pointed at the right one, it set up the app on its own and found 4 real bugs | Good at legwork, bad at guessing context |
| 3 | The bot hits a login screen | You take over and type the password and 2FA yourself. The login stays saved | Passwords never go in chat, but after that the bot acts as you |
| 4 | Two bots on one account: one logged into your bank, one browsing random sites | They share one computer, so a malicious page the browsing bot visits could reach the bank session | Separate bots don't protect each other |
| 5 | Nightly data copy from an app that has a proper API | It works, but it costs tokens every night and can break silently | Wrong tool. Use a cron job and a script |
| 6 | Two bots need to pass work along | One writes a file (`at_risk.csv`), the other reads it | Bots hand off through files, not chat |

## The rule
- **One bot = one job.** All your bots share one computer.
- **It works while you're away.** Write the brief up front, including where it should stop.
- **It acts as you.** Saved logins, real actions. Approval prompts are your safety net.
- **Best for:** judgment-heavy work, and websites that have no API.
- **Worst for:** simple, predictable jobs. A script does those better and cheaper.

## Your turn
A nightly bot logs into a supplier website, downloads invoices and saves them to Drive. Approvals are set to "always allow." Then the supplier redesigns its site.

**What do you see the next morning, and what should the brief have said?**

*Say **more** for: skills, Team Bots, approval modes, pricing.*

### 9 · **user:**

is it good for any coding ?

### 10 · **assistant:**

Partly. It's good for coding chores you can hand off and leave. It isn't built for writing code alongside you.

## Good for
- **Finding and reproducing bugs.** In the one hands-on test I found, it set up a Streamlit app by itself and found 4 real bugs, including an XSS hole.
- **Investigations.** For example, "why did latency jump after Tuesday's deploy?" It digs through dashboards and logs while you're away.
- **Overnight background tasks.** It has its own terminal, filesystem and browser, and it keeps going after you close the laptop.
- **Glue work around code.** Triaging issues, writing reports, checking a live app against its source.

## Not good for
- **Writing code with you in your editor.** Use Cursor's own agent, Claude Code or a similar tool for that. Grok Bot runs on a separate cloud machine, not in your IDE.
- **Anything that needs your local setup.** Your local tools and servers aren't reachable unless you expose them publicly (for example with a tunnel).
- **Model choice.** You're locked to xAI models.
- **Unsupervised changes.** It acts with your real access, so stick to staging and keep approvals on.

## Unknowns
- **Code quality.** No independent benchmarks yet, and the product is about 2 months old.
- **Opening PRs on its own.** I didn't see this confirmed. In the tutorial, the bot only had access to GitHub issues.

**Bottom line:** treat it as a background teammate for debugging and investigation, not as your coding assistant.

### 11 · **user:**

so its a team of agents that can work together on a computer with files, browser and terminal.

### 12 · **assistant:**

Yes, that's mostly right. Four things to adjust:

- **Each bot is its own agent, not one team brain.** Every bot has its own job and its own memory. They only work as a team when you put them in a group chat (up to 6 bots).
- **They share one computer per user.** That's how they pass work along (one writes a file, another reads it). It also means the bots aren't walled off from each other: if one is logged into something, they all are.
- **The computer is in the cloud, not yours.** xAI hosts it, it stays on after you log off, and you can't self-host it.
- **The computer is logged in as you.** Browser logins persist, so the bots act with your real accounts. Approval prompts are what stand between them and real actions.

A sharper version of your sentence: **a set of single-job agents sharing one always-on cloud computer that's logged in as you.**

### 13 · **user:**

can the communicate ?

### 14 · **assistant:**

Yes, in two ways:

- **Group chat:** you can put 2 to 6 bots in one chat, and they can pass work to each other there. For example, an account-health bot flags a customer and hands the date to a QA bot, which then checks for a matching bug.
- **Shared files:** they all use the same computer, so one bot can write a file (`at_risk.csv`) and another reads it. The tutorial suggests this for anything detailed, because long reports passed through chat lose detail.

Some limits:
- **Memory isn't shared.** Each bot remembers only its own work, so anything the others need has to go through the chat or a file.
- **Outside a group chat, I'm not sure.** I didn't find anything showing that one bot can message or start another one directly.

So treat chat as the place where bots tell each other what to do, and files as the place where they hand over the actual data.

### 15 · **user:**

are they planning to improve the team behaviour ?

### 16 · **assistant:**

[ran: web search "Grok Bot roadmap multi-agent group chat shared memory xAI Cursor"]
[ran: fetched ZenML's write-up of xAI's multi-agent design post and xAI's "Introducing Grok Bot"]

xAI hasn't published a roadmap for team behaviour. Its launch post has no "coming soon" items. The only forward-looking parts are an Enterprise waitlist and a general line that bots "become more proactive, picking up work before you need to ask."

It has kept shipping team features, though, and I need to correct my last answer.

**Correction:** I said I wasn't sure bots could talk to each other outside a group chat. They can. xAI's launch post says: *"Bots can independently message each other and share context in threads."* One bot can also start work for another bot.

## What exists now
- **Group chats:** bots *"pass work, assign ownership, and only pull you in for judgment calls."*
- **A manager bot:** xAI says its own staff run several bots with *"one to manage the others,"* for example a "Chief of Staff" bot that routes work to specialist bots.
- **Team Bots (public beta, Sept 28, 2026):** one bot shared by a whole team, with shared plugins, logins and memory. Each person's conversations stay private.
- **Shared vs. private:** tools and skills are shared across your bots. Each bot keeps its own memory and routines.

## Still missing or unexplained
- How bots actually hand work to each other: structured messages, shared files or something else.
- Safeguards between bots: what happens when they disagree, how loops are prevented, budget limits, and permission checks. An outside write-up (ZenML) points out these are undocumented.
- Handing work from a bot to a group is text-only for now (reported by secondary coverage).

**Bottom line:** the team features are improving quickly (Team Bots arrived about 7 weeks after launch), but nothing official says what comes next.

Sources:
- [xAI: Introducing Grok Bot](https://x.ai/news/introducing-grok-bot)
- [ZenML: Designing Persistent, Multi-Agent Workflows for Grok Bot](https://www.zenml.io/llmops-database/designing-persistent-multi-agent-workflows-for-grok-bot)
- [AlphaSignal: Grok Team Bots](https://alphasignal.ai/news/xai-s-grok-team-bots-give-entire-teams-one-shared-ai-agent)
- [xAI docs: Grok Bot for teams and enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises)
- [Reworked: xAI wants in on the enterprise](https://www.reworked.co/collaboration-productivity/xai-launches-grok-bot-ai-agents-in-beta/)
