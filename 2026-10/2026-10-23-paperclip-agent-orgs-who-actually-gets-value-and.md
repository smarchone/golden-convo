---
schema: 1
id: 2026-10-23-paperclip-agent-orgs-who-actually-gets-value-and
title: "Paperclip agent orgs: who actually gets value, and the control-plane mental model"
why: Paperclip is a control plane, not a brain. Value only shows up where a numeric gate filters agent output and the human holds just the money and publish gates.
why_source: suggested
harness: claude-code
harness_version: 2.1.309
model: claude-opus-5-5
session_id: d2612049-ce47-43b2-99e6-7e8c03256350
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/d2612049-ce47-43b2-99e6-7e8c03256350.jsonl
started: "2026-10-23T20:27:33.961Z"
captured: "2026-10-23T23:23:16Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:productivity:few-shot"
turns: 8
complete: true
golden_turns: [4, 6]
labels: [agents, platforms]
status: raw
---

### 1 · **user:**

/productivity:few-shot how are people using paperclip to run an org ? do some research and get me interesting insights.

### 2 · **assistant:**

[ran: WebSearch — Paperclip AI agents zero-human company orchestration open source]
[ran: WebSearch — paperclip.ing experience running company with AI agents CEO agent heartbeat budget lessons]
[ran: WebFetch — https://github.com/paperclipai/paperclip]
[ran: WebFetch — https://dev.to/jangwook_kim_e31e7291ad98/how-we-built-a-company-powered-by-14-ai-agents-using-paperclip-4bg6]
[ran: WebFetch — https://www.zenml.io/llmops-database/open-source-agent-orchestration-platform-for-multi-agent-business-automation]
[ran: WebSearch — paperclip agents reddit OR hacker news "paperclip" agent company burned tokens OR "infinite loop" OR "CEO agent" experie]
[ran: WebFetch — https://felipefontoura.com/articles/paperclip-ai-agent-company/]
[ran: WebFetch — https://www.niran.ai/blog/paperclip-how-we-cleaned-up-the-agentic-company]

# Paperclip (paperclip.ing), distilled
An open-source control plane that runs coding agents as an org chart with a board, tickets, and budgets.

*Scope: this is `paperclipai/paperclip`, the MIT-licensed "zero-human company" tool released in March 2026. The field reports come from blog write-ups. I found no Reddit or HN threads.*

## The 9 shots

| # | Situation | What happens | Lesson |
|---|---|---|---|
| 1 | You run `npx paperclipai onboard --yes` and give it a mission. | The first hire is a CEO agent. It reads the goal, proposes a strategy, and creates tickets only after you approve. Every ticket keeps a link back to the goal it serves. | You act as the board. The CEO does the planning, and you approve its plans. |
| 2 | You try to hire a researcher by writing a custom agent in Paperclip. | Paperclip has no agent logic of its own. It wakes Claude Code, Codex, OpenCode, Hermes, or any HTTP or Bash process. The README says "If it can receive a heartbeat, it's hired." | It manages agents. It isn't an agent framework like CrewAI. |
| 3 | You @-mention an agent in a comment and wait for it to act. | Nothing happens. The FAQ says "A mention alone does not assign work or wake another agent." Work moves only through issues, which have one assignee and an atomic checkout lock. | The ticket is the only unit of work, and chat doesn't count. |
| 4 | One user set department timers on a local Qwen 122B setup. | Usage went from about 10 runs and 30K tokens a day to 82.3M tokens a day, with the GPU at 94%. Background wake-ups then took the GPU from the user's interactive agent, so they added priority preemption. | Heartbeats turn idle agents into steady work, and that work competes for your compute. |
| 5 | A 14-agent company (Effloow) asked agents for sample content to test site rendering. | The agents made up blog posts, statistics, and experiment results. The fix was a rule in every agent's prompt to write `[TBD: awaiting real data]` when real data is missing. | Agents fill any missing data with plausible fiction unless a rule tells them not to. |
| 6 | A department head got back an issue it had delegated, now in review. | The head treated it as new work and delegated it again, over and over. The fix was a rule: "in-review + assigned to you = a return; judge it and advance." | Paperclip models the org chart, but you still have to define the handoffs in writing. |
| 7 | An agent ran a long tool call and printed nothing for about 4 minutes. | Paperclip judges liveness from stdout, so it treated the agent as dead. It started a duplicate run, and the duplicate took the lock. A 15-line keepalive fixed it. | Real deployments break in the runtime layer before they break in the reasoning. |
| 8 | The same model (GLM-5.1) ran through OpenCode, then through Paperclip with Hermes. | It scored 9.55 through OpenCode and 7.0 to 7.9 through Paperclip with Hermes. The persona arrived as a user message under a 14k-character system prompt. Giving each agent its own scratch directory cut input from 9,044 to 6,992 tokens. | Wrapping a model in more layers can make it worse. Check where your prompt actually ends up. |
| 9 | The human board went quiet for about 5 days. | Agents escalated up the chain, and the CEO agent rescoped the week's work. Without that, work piles up in a queue of approvals. | You become the bottleneck. Design the approval step as carefully as the agents. |

## The rule
- **It manages coordination, not thinking.** Paperclip holds the state: tickets, ownership, goal links, budgets, and audit logs. The model behind each agent does the actual work.
- **Keep the company's state out of the model.** The users who got it working moved delegation out of chat history and markdown files into parent and child tickets with blockers.
- **One file per job, one role per agent.** Split identity, role, standing orders, and knowledge into separate files. The agent that does the work should never grade it.
- **Start with the smallest loop that closes.** Both successful users started small: a CEO plus two or three workers, with only department heads on timers. One of them took six weeks to get a loop that closed without manual nudges.
- **Calling it "zero-human" overstates it.** In practice it gives you a board seat over AI workers. Plan reviews, publish gates, and QA still need a person.

## Your turn
You hire a CEO and 8 workers, all using Claude Code on one Claude subscription. Each runs on a 30-minute heartbeat, and the mission is "grow the business." You leave for the weekend.

**What do you find on Monday, and which two constraints fail first?**

*Say **more** for: budgets and the 80% and 100% thresholds (and why enforcement lags in-flight spend), routines (cron and webhooks), exporting and importing org packages and what leaks in them, multi-company instances, plan-approval checkpoints, choosing models per role (Opus for the CEO, cheaper models for workers), and the missing multi-user support.*

Sources:
- [paperclipai/paperclip README](https://github.com/paperclipai/paperclip)
- [Paperclip docs: 5-minute path](https://docs.paperclip.ing/guides/getting-started/five-minute-path/)
- [Felipe Fontoura: Running a 13-agent company on Hermes](https://felipefontoura.com/articles/paperclip-ai-agent-company/)
- [niran.ai: I started using Paperclip, now I burn millions of tokens](https://www.niran.ai/blog/paperclip-how-we-cleaned-up-the-agentic-company)
- [DEV: 14 AI agents using Paperclip (Effloow)](https://dev.to/jangwook_kim_e31e7291ad98/how-we-built-a-company-powered-by-14-ai-agents-using-paperclip-4bg6)
- [ZenML LLMOps case study](https://www.zenml.io/llmops-database/open-source-agent-orchestration-platform-for-multi-agent-business-automation)
- [AI Never Sleeps: built an AI company in 60 minutes](https://aineversleeps.substack.com/p/i-built-an-ai-company-in-60-minutes)
- [ToolCenter review](https://www.toolcenter.ai/en/articles/paperclip-review-2026)
- [MindStudio explainer](https://www.mindstudio.ai/blog/what-is-paperclip-zero-human-ai-company-framework-3)

### 3 · **user:**

not whats generic. i want specific  ways people are using paperclip to run businesses which actually generate value.

### 4 · **assistant:**

[ran: WebSearch — paperclip AI agents company revenue results "paperclip" case study MRR OR customers OR "first sale"]
[ran: WebSearch — "paperclip" agents used for agency OR SEO OR ecommerce OR newsletter OR client work results 2026]
[ran: WebSearch — site:x.com OR site:reddit.com paperclip agents "my company" revenue dotta]
[ran: WebFetch — https://paperclip.ing/blog]
[ran: Bash — Fetch recent Paperclip GitHub discussions]
[ran: WebSearch — paperclip agents "dentist" OR "roofing" OR "security firm" dotta demo users business]
[ran: Bash — Read key Paperclip discussions in full]
[ran: WebFetch — https://paperclip.ing/blog/who-is-using-paperclip-on-github/]
[ran: WebFetch — https://cybernative.ai]
[ran: WebFetch — https://paperclip.ing/blog/now-your-paperclip-has-a-bank-account/]
[ran: WebFetch — https://paperclip.ing/blog/when-one-ai-assistant-stops-being-enough-for-a-marketing-campaign/]
[ran: Bash — Inspect named Paperclip-built business repos]
[ran: Bash — Read more of Quant Zero README]
[ran: WebSearch — "paperclip" AI agents "I run" OR "we run" business clients revenue agency 2026 first-hand]
[ran: WebSearch — Greg Isenberg dotta paperclip tips "startup ideas" podcast how to use paperclip]

# Paperclip in businesses that produce something, distilled
These are the uses where Paperclip is tied to a product, a sale, or a real decision, not demos.

**The honest headline:** I found no operator who publicly reports revenue from a Paperclip-run business. One third-party write-up says the maintainer called Paperclip itself zero-revenue (*unverified*). The examples below produce real artifacts, filters, or products. Where money changes hands, it's mostly small.

## The 8 shots

| # | Situation | What happens | Lesson |
|---|---|---|---|
| 1 | **Quant Zero**, an agent-run trading research shop. The human acts as CEO and approves only at gates. Three director agents manage six worker agents. | The pipeline went from 51 hypotheses to 39 strategies, 72 backtests, and 1 strategy in paper trading. Gate 1 has 16 numeric tests, and 11 of them fail a strategy outright. A failure log of 41 entries is read before each new hypothesis is proposed. | It works where agents can generate a lot and a machine-checkable bar throws out nearly all of it. Here the pass rate was about 1 in 72. |
| 2 | **NULL**, a fashion brand run by 5 agents (CEO, Research, Design, Content, Engineering). It took 206+ heartbeats to produce three seasons. | The store accepts USDC on Base through x402, so an AI agent can buy without a human step. Season 03 sells "nothing" for 5 USDC and issues a receipt NFT. | When an agent-run company sells, its product is often the story of being agent-run. Its buyers are partly other agents. |
| 3 | **CyberNative AI LLC**, one human founder plus agents, past 13,000 tasks. | It sells what it learned from running agents. That includes free guardrail skills, a paid pack at $49 or $19/month, and a $99 container-image check paid after the result. Its own fixes cut scheduled cycles from about 212 to about 47 a day and stopped an 80-run loop. | The business that's easiest to verify sells the lessons from running an agent company. |
| 4 | **Founder product builds.** Paperclip's own GitHub study found 14,267 commits across 884 repos from 562 owners. | Examples: RealHQ, a commercial property platform with 640 commits and 54 database models. A Middle East GPU marketplace with 541 commits. A Spanish legal-claims site. A UK peptide store. The median repo has 3 commits, and the top 100 repos hold 70.5% of all commits. | The main real use is extra engineering staff for a solo founder, not running a company. Most people try it and stop. |
| 5 | **Effloow**, a 14-agent content and micro-tools site meant to earn from ads and affiliate links. | It had $0 revenue at launch. The agents invented posts and stats while filling sample content. | Org-chart overhead on a content farm with no distribution gives you cost without revenue. |
| 6 | **A small family office** used it for bookkeeping, a chart of accounts, and a monthly close. | Within days it was creating hundreds of tasks on its own, asking endless questions, and burning tokens. The user reports finishing the same job in another tool. | Open-ended ops work with no pass/fail gate makes the org grow instead of finishing. |
| 7 | **Ramp for Agents** integration. An agent incorporates the company, applies for Ramp, and sets up cards and bill pay. | Every step that commits money goes to a human approval first. No named users. | Back-office setup is a real job for it: few steps, each one gated. |
| 8 | **The approval queue.** One operator found board approvals sat untouched until someone opened the dashboard. | They built a bot that pushes each approval to Slack or Telegram. Fontoura found the same thing: when the board is slow, finished work piles up. | Throughput is capped by how fast humans approve, so the useful work is cutting approval latency. |

## The rule
- **Value needs a filter with a number on it.** Quant Zero works because "OOS Sharpe > 0.7, PBO ≤ 0.5" can reject output with no human involved. Bookkeeping and content had nothing like that.
- **The human holds only the gates that commit money or publish.** The setups that work keep one human at capital, publishing, or payment decisions, and nowhere else.
- **The money is mostly in selling tools to other Paperclip users.** Guardrail packs, $59 org templates from PaperclipOrg, and approval bots are where cash visibly changes hands.
- **Use it for builds that end.** Product repos produce something you can ship. "Run my company" goals that never end turn into self-generated busywork.
- **Watch flat-rate cost blindness.** Subscription runs are recorded at $0, so budgets never stop them, and loops hide there.

## Your turn
A solo founder wants Paperclip to run B2B outbound. A researcher agent finds leads, a writer agent drafts emails, and a sender agent sends them. The goal is booked demos.

**Using shots 1 and 6, where do you put the gate, and what number must a batch hit to pass it?**

*Say **more** for: Quant Zero's full gate spec and knowledge-base loop, NULL's x402 store, the multi-client agency setup (pitched but unproven), and a cost comparison of local models vs subscriptions vs API billing.*

Sources:
- [Quant Zero repo](https://github.com/marcohwlam/quant-zero)
- [NULL fashion brand repo](https://github.com/BLE77/null) · [getnull.online](https://getnull.online)
- [CyberNative guardrails discussion](https://github.com/paperclipai/paperclip/discussions/16618) · [cybernative.ai](https://cybernative.ai)
- [Who Is Actually Using Paperclip on GitHub?](https://paperclip.ing/blog/who-is-using-paperclip-on-github/)
- [RealHQ / propra-app](https://github.com/REAIAN18/propra-app)
- [Effloow 14-agent case](https://dev.to/jangwook_kim_e31e7291ad98/how-we-built-a-company-powered-by-14-ai-agents-using-paperclip-4bg6)
- [Family office "Pretty terrible" discussion](https://github.com/paperclipai/paperclip/discussions/17075)
- [Now Your Paperclip Has a Bank Account](https://paperclip.ing/blog/now-your-paperclip-has-a-bank-account/)
- [Approvals to Slack/Telegram](https://github.com/paperclipai/paperclip/discussions/15386)
- [Felipe Fontoura: 13-agent company](https://felipefontoura.com/articles/paperclip-ai-agent-company/)
- [PaperclipOrg templates](https://papercliporg.com/)
- [o-mega: zero-revenue note](https://o-mega.ai/articles/paperclip-ai-agent-companies-and-the-multi-agent-landscape)

### 5 · **user:**

whats the working mental model to operate with paperclip ? 
what does it provide ? AI agent management layer ?

### 6 · **assistant:**

Yes, it's a management layer for AI agents. The project calls it a **control plane** (the creator's phrase is "human control plane for AI labor"). The most useful way to think about it:

> **Paperclip is a ticketing system with a scheduler, an org chart, and a budget ledger, built for workers who forget everything between shifts.**

The models do the thinking. Paperclip holds everything that has to persist between runs.

## The stack

```
  YOU (the board)     goals · approvals · budgets · gates
        │
  PAPERCLIP           who · what · when · how much · who decides · record
  (control plane)     ── durable state in Postgres, outlives any model call
        │  heartbeat → adapter
  RUNTIMES            Claude Code · Codex · Hermes · OpenCode · HTTP/Bash
  (the "employees")   does the actual reasoning and tool use; stateless between wakes
```

## What it provides: six things

| Question | Paperclip primitive | What it really is |
|---|---|---|
| **Who?** | Org chart: roles, reporting lines, permissions | A routing graph for handing work down and escalating up, plus who may assign or approve. It isn't a metaphor about employees. |
| **What?** | Issues with a goal chain, one assignee, atomic checkout, blockers | A work queue with locks. It's the only way work moves; a mention doesn't wake anyone. |
| **When?** | Heartbeats (wake on assignment or on a timer) and routines (cron, webhook) | A scheduler. Agents aren't always on. They wake, do one unit of work, and go back to sleep. |
| **How much?** | Budgets per company, agent, and project | A spend ledger with an 80% warning and a pause at 100%. It's based on recorded spend, so subscription runs logged at $0 are never stopped. |
| **Who decides?** | Approvals, plan review, versioned config | Human gates for anything that commits money, publishes, or hires. |
| **What happened?** | Audit log, comments, artifacts | The company's memory. The next wake reads it instead of chat history. |

## The core loop: one heartbeat

```
wake (assigned / timer / follow-up)
 → budget check
 → checkout issue (lock)
 → build context: role files + goal chain + issue thread
 → run adapter (Claude Code, etc.)
 → write back: comment · status · child issues · artifacts
 → release lock, sleep
```

Everything else follows from this. An agent remembers only what got written back to the ticket. Anything left in its context window is gone at the next wake.

## What it doesn't provide
- **Intelligence.** Output quality is the runtime's, and wrapping a model in more layers can make it worse (shot 8 earlier: the same model scored 9.55 on its own and 7.0 to 7.9 through Paperclip).
- **Judgment about quality.** Approval and review stages exist, but you define the pass bar.
- **Memory or knowledge**, beyond tickets and instruction files. That part is only partly built.
- **Real cost limits** on flat-rate subscriptions.
- **A reliable sandbox.** It depends on the adapter and environment.

## How to operate it, from the people who got value

1. **Design it as a workflow and use the org chart to route it.** Start from the work: propose, test, evaluate, ship. Then assign roles to steps. Don't hire a CEO and hope it figures the business out.
2. **Tickets are the API.** Keep delegation, status, and handoffs in issues with parent, child, and blocker links, never in chat or markdown files.
3. **Use numeric gates wherever you can.** Agents generate, a measurable bar filters, and a human signs off only where money or publishing is involved (the Quant Zero pattern).
4. **Department heads judge and workers produce.** Whoever made the work never grades it. Only heads run on timers.
5. **Kill empty wakes.** Turn on skip-when-no-work and use two-strikes rules for loops. Most timer cycles find nothing to do.
6. **Your approval speed caps throughput.** Push approvals to where you'll see them, such as Slack, or the work piles up in a queue.
7. **Start with the smallest loop that closes.** A CEO plus two or three workers and a single gate. Add headcount only once the loop runs without nudges.

**In one line:** treat Paperclip as the company's operating records and treat the agents as interchangeable workers. Your job as the board is to design the gates and the handoffs, not to write prompts.

### 7 · **user:**

from a CEO perspective, to run an agent org, what problems does this solve. answer concisel

### 8 · **assistant:**

From a CEO's seat, Paperclip handles the management overhead of running many agents:

| CEO problem | What Paperclip gives you |
|---|---|
| **"Who's working on what?"** No view across 10+ agent sessions. | One board showing every agent, its current ticket and status, with an audit trail. |
| **"Is this work moving the business?"** | Every ticket links back to a company goal, so you can trace why the work exists. |
| **"Two agents did the same thing."** | One assignee per ticket and a lock while it's being worked. |
| **"Things fall through the cracks."** Context dies with the chat session. | The company's state lives in tickets, not in the agents' context, so work survives restarts and handoffs. |
| **"I'm the bottleneck for every handoff."** | Work is routed through the org chart. Heads delegate and escalate, so you don't relay messages. |
| **"Costs are unpredictable."** | Budgets per agent and per project, with a warning at 80% and a pause at 100%. |
| **"Agents doing things I didn't sign off on."** | Approvals for hiring, spending, strategy and publishing, plus config changes you can roll back. |
| **"Agents only work when I prompt them."** | Heartbeats and routines make them pick up work on a schedule or when an event fires. |
| **"I'm locked into one model vendor."** | Mix Claude, Codex, Gemini and local models by role, with expensive models for judgment and cheap ones for routine work. |

**It doesn't solve:** whether the output is any good, what the strategy should be, or how fast you approve things. Those are still your job, and your approval speed is now what limits throughput.
