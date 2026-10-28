---
schema: 1
id: 2026-10-28-repo-report-panel-on-moodring-adhd-friendly-rewr
title: Repo report panel on MoodRing, ADHD-friendly rewrite, and USP check against paper-trading apps
why: "A dense repo report collapsed into a 30-second scan once I said 'i have adhd' \u2014 and the USP check found the real edge: a coach that explains why a trade was refused."
why_source: suggested
harness: claude-code
harness_version: 2.1.312
model: claude-opus-5-5
session_id: cf94aad3-d9a5-4c42-a8e5-5b6703e66e0a
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-MoodRing/cf94aad3-d9a5-4c42-a8e5-5b6703e66e0a.jsonl
started: "2026-10-28T05:51:03.670Z"
captured: "2026-10-28T08:22:29Z"
cwd: ~/Documents/proj/claude/spark/MoodRing
mode: "skill:productivity:report-panel"
turns: 8
complete: true
golden_turns: [4, 8]
labels: [product-idea, adhd, competitive-analysis]
status: raw
---

### 1 · **user:**

/productivity:report-panel this repo

### 2 · **assistant:**

I'll read the repo itself (README, docs, code layout, recent history) as the source, then write the report panel.

[ran: Bash — List repo files and history]
[ran: Bash — Read READMEs and PRD]
[ran: Bash — Read architecture, rules, results docs]

The docs give the product story. Now a quick pass over the code to check what's actually running versus what the docs claim: API endpoints, the policy, the research models, and size.

[ran: Bash — Inspect API endpoints, code size, models, CI]
[ran: Bash — Read endpoints, policy, sentiment, research notes, CI]

I've read enough to write the report. This repo is a codebase, not a talk, so I used the README, the four spec docs (PRD, architecture, data models, rules), the evidence docs (review fixes, capacity results, provider review, SEC access), the API routes, the policy code and CI as the source.

# MoodRing: a paper-trading simulator for learning, built to be trusted before it's built to be smart

**Source:** `VitalSheaths/MoodRing` @ `0cd6f7e` (main, 52 commits, about 12.6k lines of Python under `src/`, about 328 test functions, 17 API routes) · **For:** general reader (no role given, so the default order is used)
> Source note: the docs are unusually explicit about what is implemented, planned or excluded, and that labelling is what this report relies on. Pass counts quoted from the docs date from 2026-10-10. I did not run the tests or the demo. The research notes in `src/Architecture4Objectives.md` describe a 5-head transformer that the docs themselves say is "not acceptance evidence", so I treat it as aspiration.

## CEO note
**What's happening:** MoodRing is a local-first, virtual-money stock simulator for beginners, with a research path for swing-strategy signals behind it. Today it consists of an API and an offline demo. The dashboard and automated predictions are planned.

**Why it matters:** the moat it's building is **trust, not prediction**. Every claim is labelled implemented, planned or excluded. A deterministic risk engine has the final say over any model. An LLM "must not invent authoritative prices, probabilities, confidence, risk limits or trade instructions". Stale quotes can't authorize a trade. The name says "mood" (sentiment), but sentiment is deliberately held out of the trading loop until it is benchmarked.

**The real constraint is data rights, not engineering.** The provider review found no zero-cost, publicly redistributable, real-time top-100 feed. Alpha Vantage's free tier allows 25 requests a day, which can't cover 100 tickers. Massive Basic is end-of-day only, and its storage and replay rights are unresolved. So the public demo stays synthetic.

**Opportunity / threat / watch:**
- *Opportunity:* "explainable rejections" (why a trade was refused) are a real teaching hook that brokerage paper modes don't sell on ⚑.
- *Threat:* the last roughly 10 PRs all went to SEC, PostgreSQL and capacity plumbing behind approval gates. None improved what a learner sees, and that learner still has to use Swagger and a bearer token ⚑.
- *Watch:* issue #1 (replace local token auth before public hosting) and whether any provider gets approved.

**Bottom line:** the trust architecture is solid and well evidenced. The product a beginner can actually touch hasn't started yet.

## The product
**Capabilities**

| Capability | What it does | Where it sits | Status |
|---|---|---|---|
| Independent scenarios | Each scenario has its own cash, policy, positions and equity curve | `paper_trading/service.py`, `/api/v1/scenarios*` | Implemented |
| Simulated trades | Long fractional entry and full exit, with costs; idempotent order keys stop double-spending | `/paper-trading/trade`, `/close/{id}` | Implemented |
| Risk gates and sizing | Fixed %, confidence-weighted or fractional-Kelly sizing; caps on exposure, cash reserve and drawdown; freshness limits | `paper_trading/policy.py`, `engine/decision_engine.py` | Implemented |
| Explicit predictions | Signals carry their timing, feature availability and version metadata | `/scenarios/{id}/signals` | Implemented (manual input only) |
| Quote polling | Batched, cached, indicative prices; stale marks stay visible | `market.py`, `checker.py`, `/market/*` | Implemented (offline synthetic by default) |
| Historical replay | Chronological replay through the same service and policy; every signal gets a terminal outcome | `backtest.py`, `/backtest/*` | Implemented |
| Scenario comparison | Side by side, including the effect of costs | `/scenarios/compare`, `/backtest/compare` | Implemented |
| Sentiment / transformer / regime research | Hierarchical FinBERT resolver, temporal transformer, calibration, regime detector | `features/`, `models/`, `experiments/` | Research code, not in the loop |
| Ingestion contracts | SEC metadata and SIC codes, universe and top-100 ranking, OHLC and index data, PostgreSQL job checkpoints | `ingestion/sec`, `universe`, `market`, `jobs` | Offline or synthetic only; live access gated |
| Dashboard, advisory, public hosting | Beginner UI, explanations linked to evidence, multi-user deployment | none | Planned or deferred |

**How it fits**
```
            ┌──────────── learner (Swagger / API client, bearer token) ────────────┐
            ▼                                                                        │
   explicit prediction ──► DecisionEngine + ScenarioPolicy ──► simulated order/fill │
   (manual today)          (eligibility, freshness, sizing,     (atomic, idempotent)│
                            risk caps → explainable reject)            │            │
            ▲                      ▲                                   ▼            │
            │                quote adapter ◄── offline synthetic   ledger (SQLite / │
            │                (poll, cache, stale flag)  │ live opt-in  PostgreSQL)  ─┘
            │                                                          │
   ┄┄┄┄┄ research side (not wired in) ┄┄┄┄┄                    history / compare / replay
   SEC metadata · universe · OHLC jobs · sentiment · transformer ··► (future: validated signals)
```
Loop: create scenario → submit prediction → decision explains accept or reject → simulated fill → marks and costs update → close → compare scenarios → adjust policy or prediction → back to submit.

## PM view
- **Experience vision:** learning starts with a scenario, not with an account or a real feed. The learner's role is to form a prediction and watch how costs, sizing and risk limits change the outcome. What goes away is real money, broker setup and the illusion that a model "knows". Rejections are framed as lessons ("rejections must remain understandable").
- **Impact claimed:** no learning outcomes have been measured. What exists is engineering evidence. The offline demo closes two positions for net +$9.37 and +$18.74 after costs (synthetic data). Tests reported 44 passed, including PostgreSQL, on 2026-10-10. Capacity runs used 11 synthetic jobs and grew storage by about 409 KB. All of these numbers are directional.
- **Novel approaches:**
  - Replay gives every input signal a terminal status (`traded`, `expired`, `rejected`, `never_eligible`…), so learners see why ideas didn't trade, not just P&L.
  - Freshness is enforced as part of the experience: a stale price cannot open or close a trade, and the UI is meant to show staleness instead of faking a timestamp.
  - Scenario comparison turns "how much do costs matter?" into a direct A/B.
- **Gaps and open questions:**
  - There is no learner-facing surface. Setup needs a venv, environment variables and a token pasted into Swagger.
  - There's no defined lesson path or success metric for "learned the basics".
  - The sentiment "mood" that names the product isn't something the user can experience yet.
  - Is the target user a beginner (needs a UI) or a practitioner (wants live data)? The roadmap spends on the second ⚑.

## Architect view
**Layers**

| Component | Key property |
|---|---|
| FastAPI server | Local bearer auth; ownership-scoped; generic 503s that don't leak provider errors; health reports `production_ready: false` |
| Simulation service | Atomic cash and position changes, explicit decimal rounding, per-user idempotency keys |
| Decision engine and policy | Deterministic, with final authority; models and LLMs can't override it |
| Ledger | One SQLAlchemy schema on SQLite (default) or PostgreSQL; not fully append-only |
| Research storage | Separate `DATABASE_URL` on PostgreSQL (JSONB, DB-side joins); no sync with the ledger |
| Ingestion jobs | Bounded pages, leases, checkpoints, replay; explicit PostgreSQL migration fencing |
| SEC transport | Child process per request with a hard 5 s total deadline; network off by default; manual CLI only |

**Key design decisions**

| Chose | Gives up |
|---|---|
| Deterministic risk authority over models | Speed of shipping model-driven signals |
| Synthetic or offline data by default | Realism, and the "live market" hook |
| Two independent databases (ledger and research) | One source of truth; needs explicit bridging later |
| Phase gates with human approval per boundary | Velocity; most recent work is gate evidence, not features |
| Process-isolated SEC fetches | Process overhead; needs a local Python executable |
| Causal "available-at" timestamps everywhere | Simpler feature joins |

**Hard problems:**
- Point-in-time correctness for features and SEC revisions, which is stated in the docs.
- Data rights for storing and replaying provider data, which is stated.
- An immutable audit trail, stated: trade summary rows mutate when a trade closes.
- Moving from a SQLite single user to shared multi-replica state with real identity, which is stated.
- ⚑ Bridging research outputs into the explicit-prediction contract without leaking future data.

**Extension points:**
- The signal endpoint, the seam where validated models plug in.
- `ScenarioPolicy` sizing modes.
- The quote adapter interface (`PAPER_QUOTE_MODE`).
- Ingestion connector bases (`ingestion/connectors/base.py`).
- A future structured-advisory layer behind the risk engine.

---
Checks: I compared every implemented, planned or excluded label above against the PRD table and the architecture doc. I confirmed the API routes and policy fields from `server.py` and `policy.py`, and the CI steps from the workflow file. I didn't run the tests or the demo, and I made no changes to the repo.

result: Report panel for the MoodRing repo (CEO, product, PM and architect views). It's a trustworthy simulator core with no learner-facing UI yet, and data rights are its main constraint.

I can also publish this as a shareable page if you'd like.

### 3 · **user:**

i have adhd

### 4 · **assistant:**

Since you have ADHD, here's the same report cut to the essentials: short lines, the bottom line first.

# MoodRing: what you need to know

**Bottom line:** MoodRing is a practice stock-trading app with fake money. It's carefully built, but there's nothing yet for a beginner to click on.

## CEO
- ✅ **Strength:** it's honest. A rules engine decides every trade, AI can't override it, and outdated prices can't be traded on.
- 🚧 **Blocker:** there's no free stock data it's allowed to share publicly, so it runs on fake prices.
- ⚠️ **Risk:** recent work went into plumbing, not into what learners see.

## Product
- **Works now:** practice accounts, buying and selling, risk limits, trading costs, replaying past prices, comparing accounts.
- **Not yet:** a dashboard, automatic predictions, the news-mood ("MoodRing") feature, and public hosting.

## PM
- 💡 **Best idea:** it explains why a trade was refused. That's the lesson.
- ❌ **Gap:** to use it you set up Python and paste a token into an API page. That's too hard for a beginner.

## Architect
- 🔒 One rules engine has the final say on every trade.
- 🗄️ Two separate databases: one for trades, one for research.
- 🧱 **Hard parts:** using only data that was available at the time, the legal right to use market data, and multi-user login.

**Suggested next move:** build a simple beginner screen before adding more data. (This is my suggestion, not something the repo says.)

result: I shortened the MoodRing report to a quick-scan summary: it's a well-built fake-money stock simulator with no beginner screen yet, held back by stock-data rights.

Want me to keep my replies this short from now on?

### 5 · **user:**

how is this local-first when there is apo

how is this local-first when there is api

### 6 · **assistant:**

You asked how it can be "local-first" when there's an API. Having an API doesn't mean it runs in the cloud.

- 🖥️ **The API runs on your own computer.** It listens at `127.0.0.1:8000`, which only your machine can reach.
- 💾 **Your data stays on your computer.** Trades are saved in a SQLite file in that folder, with no account and no remote server.
- 📴 **It works without internet.** It uses fake (synthetic) prices by default.
- 🚫 **It isn't on the web.** The README says "Keep the server local; public hosting is not supported yet."

The API is just how you talk to the app, like a menu. Local-first means where that menu lives: on your machine.

A fair criticism: for a beginner, "local-first" still means setting up Python and pasting in a token. Being local doesn't make it easy.

result: MoodRing is local-first because its API runs only on your own machine (127.0.0.1), saves to a local SQLite file and works offline; the API is just its interface, not a cloud service.

### 7 · **user:**

validate this project idea against current ecosystem. i want to see the USP of this as a product or value

### 8 · **assistant:**

I'll look up current competitors and compare MoodRing against them, then keep the answer short.

[ran: WebSearch — best paper trading apps for beginners 2026]
[ran: WebSearch — AI stock trading education app explains trades beginners 2026]
[ran: WebSearch — open source paper trading simulator backtesting sentiment self-hosted]

You asked what makes MoodRing unique compared with what's out there. Short answer: not much yet, but one strong angle exists.

## What's already out there
| Type | Examples | They already do |
|---|---|---|
| 🏦 Broker practice modes | Webull, Thinkorswim, TradingView, eToro | Free, polished, real prices, apps |
| 🤖 AI learning apps | Finademy, TradeScan AI, Finelo | Lessons, an AI coach, trade reviews |
| 🧑‍💻 Open-source, runs on your computer | TradingCLI, Open Paper Trading MCP, QuantDinger | Fake-money trading, backtesting, local SQLite |

## Where MoodRing loses
- ❌ **Real prices and a nice app:** brokers win easily.
- ❌ **"Runs on your computer":** other free tools already do this.
- ❌ **AI coaching:** other apps already ship it. MoodRing's AI isn't connected yet.

## The real USP
**"A practice coach that tells you exactly why your trade was refused, and AI can't overrule it."**

- 🛑 Fixed rules check every trade (cash, size, losses, outdated prices) and explain each refusal.
- 💸 You can see what trading costs did to your result.
- 🔒 AI may explain but never decides. ⚑ This could matter more now, because regulators are warning about misleading AI investing products.

⚑ None of the apps I found clearly teach risk this way. Their AI explains charts, not why the rules said no.

## Verdict
- 👍 **The value is real:** a trustworthy risk teacher.
- 👎 **The product isn't there yet:** no screen for beginners.
- 👉 **Next step:** build one simple screen showing the refusal explanation, and test it with 5 beginners.

⚑ = my inference, not something the sources say.
Caveat: most sources are reviews that earn affiliate fees or app store listings. I didn't check GitHub directly.

result: MoodRing's possible USP is a practice trading coach that explains why each trade was refused and lets fixed rules overrule AI; competitors win on real prices, polished apps and AI coaching, and it still needs a beginner screen.

Sources:
- [NerdWallet: best paper trading platforms](https://www.nerdwallet.com/investing/best/brokers-paper-trading)
- [TradeAlgo: paper trading apps 2026](https://www.tradealgo.com/trading-guides/tools/best-paper-trading-apps-for-practicing-without-risk-in-2026)
- [Mitrade: paper trading platforms](https://www.mitrade.com/insights/share/share-trading/best-paper-trading-platform)
- [ForexTester: paper trading simulators](https://forextester.com/blog/best-paper-trading-simulators)
- [DaytradingZ](https://daytradingz.com/best-paper-trading-platforms/)
- [askfuzz: AI trading tools for beginners](https://askfuzz.ai/discover/news/investment-ideas/8-ai-stock-trading-tools-for-beginners-in-2026)
- [Finademy (App Store)](https://apps.apple.com/jm/app/finademy-learn-stock-basics/id1452928156)
- [TradeScan AI (App Store)](https://apps.apple.com/app/id6748858564)
- [TradingCLI](https://glama.ai/mcp/servers/ryanrodrigues25200525-svg/tradingcli)
- [Open Paper Trading MCP](https://glama.ai/mcp/servers/Open-Agent-Tools/open-paper-trading-mcp)
- [QuantDinger / Open Byte](https://www.everydev.ai/developers/open-byte-inc)
- [TradeSim AI](https://dev.to/anupam99jain/tradesim-ai-3hlf)
