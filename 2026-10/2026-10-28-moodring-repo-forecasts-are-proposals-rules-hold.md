---
schema: 1
id: 2026-10-28-moodring-repo-forecasts-are-proposals-rules-hold
title: "MoodRing repo: forecasts are proposals, rules hold authority \u2014 learned without trading background"
why: "Onboarding to a codebase in a domain I knew nothing about: the moment the trading logic clicked was when timing checks (stale, out-of-order, lookahead) were laid out on plain timelines."
why_source: suggested
harness: claude-code
harness_version: 2.1.310
model: claude-opus-5-5
session_id: 83c2517e-c208-4102-8f3c-e5b1f5f40474
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-MoodRing/83c2517e-c208-4102-8f3c-e5b1f5f40474.jsonl
started: "2026-10-28T05:50:18.437Z"
captured: "2026-10-28T08:22:25Z"
cwd: ~/Documents/proj/claude/spark/MoodRing
mode: "skill:few-shot"
turns: 12
complete: true
golden_turns: [6, 8, 12]
labels: [few-shot, system-design, simulation]
status: raw
---

### 1 · **user:**

/productivity:few-shot explain the repo

### 2 · **assistant:**

[ran: Bash — List repo files and read README]
[ran: Bash — List remaining files and read architecture doc]
[ran: Bash — Read decision engine and policy]
[ran: Bash — Map service and API functions]
[ran: Bash — Read errors, decision and trade flow, routes, SEC doc]

# MoodRing, distilled
A local, virtual-money stock-trading simulator. You send it a forecast, and fixed rules decide whether and how much to trade.

## The 8 shots

| # | Situation | What happens | Lesson |
|---|---|---|---|
| 1 | `POST /api/v1/scenarios/{id}/signals` with `prob_up=0.6, mu=0.02, var=0.0004, trade_success_prob=0.6, drawdown_risk=0.05`. Then `POST /api/v1/paper-trading/trade` with that `signal_id` and an idempotency key. | The signal is stored with `decision_json.action="BUY"`. The trade fills at the quote plus 5 bps of slippage and pays a 10 bps fee. Cash drops, and an order, a fill and an equity snapshot are written. | The caller supplies the forecast. `DecisionEngine` decides. Publishing a signal and trading it are two separate steps. |
| 2 | The same signal on a fresh $10k scenario. | The engine sizes it at 120k and clips that to its $10,000 cap. `ScenarioPolicy.budget` then caps it at **$200**, because the default `fixed_pct` is 2% of equity. The other caps are 9,000 (cash reserve) and about 1,886 (risk per trade). | Two layers size every trade, and the smallest cap wins. The engine's number is only an upper limit. |
| 3 | Same as shot 1, but `mu=0.002`. | Net edge is 0.002 − 0.003 (twice the 15 bps cost, for the round trip), which is ≤ 0. The decision is `PASS / NEGATIVE_EXPECTED_NET_EDGE`. The signal is still stored. The trade returns 400 `Signal is not tradeable: NEGATIVE_EXPECTED_NET_EDGE`. | A positive forecast that doesn't cover the round-trip costs gets no trade. Rejections are recorded with a reason code. |
| 4 | `feature_available_at` is later than `prediction_time`, or `prediction_time` is in the future. | 400 `Features must be available at or before prediction time…` | Causality is checked at the boundary, so a lookahead forecast is rejected outright, not just down-weighted. |
| 5 | You try a new entry while an open position's quote is older than `quote_max_age_s` (900s). | 503 `Refresh all open positions before sizing a new entry`. | Stale prices can't authorize trades. The app makes you refresh first and never fills in a placeholder price. |
| 6 | You retry the trade with the same key, then send the same key with a different `dollars`, then a new key on the same signal. | The first returns the original trade. The second gets 409 `…already been used for a different request`. The third gets 400 `Signal has already been traded`. | Writes are safe to retry per user and key, and each signal can open only one position. |
| 7 | `src/models/temporal_transformer.py`, `regime_detector.py` and the FinBERT/sentiment pipelines. | Nothing in the trading path imports them. The architecture doc says research models are "not a verified automated input to this loop merely because they exist." | Near-miss: it looks like an ML trading bot, but the product is the ledger plus the rules. `ingestion/`, `features/`, `macro/` and `models/` are research code. |
| 8 | `ingestion/sec/access.py` (issue #22) | Each request runs in its own child process with a 5s limit on the whole attempt (DNS, TLS and body included). The network is off by default, and per `docs/SEC_ACCESS.md` no real SEC request has been run yet. It isn't wired into the API, the ledger or any store. | This is how new data sources arrive here: contracts, fixtures and mocked tests first, then live access only after separate approval. |

## The rule
- **The forecast is an input, not an order.** Anything you `POST` passes through the engine's gates and the policy's caps before money moves.
- **Each request takes the strictest limit.** Engine cap, % of equity, cash reserve, gross exposure, risk per trade and drawdown pause are all checked, and the smallest one wins.
- **Time is validated.** Every price and forecast carries a timestamp and a maximum age, and anything stale or lookahead is refused (400 or 503), never patched over.
- **Money is Decimal, and writes can be replayed safely.** Amounts are rounded explicitly, cash can't go negative, and idempotency keys make retries safe.
- **Research is quarantined.** The ML and data-ingestion code ships behind contracts and offline tests, and isn't connected to the trading loop.

## Your turn
A scenario's portfolio is down 21%. You publish a signal that would clear every engine gate (like shot 1), then call `/paper-trading/trade`.

**What does `publish` return, and what does `trade` return?** (Status code and why.)

*Say **more** for: auth and user isolation (`PAPER_API_USERS_JSON` → `require_user`), closing trades and auto-exit (stop-loss/take-profit), backtest replay through the same service, the two-database split (`PAPER_DATABASE_URL` SQLite ledger vs `DATABASE_URL` Postgres research), offline vs live quote mode, and the universe/SIC/OHLC contracts.*

### 3 · **user:**

/productivity:intuition this repo

### 4 · **assistant:**

# Intuition: MoodRing's core idea — a forecast is a proposal, not an order

## Elevator Pitch
Most trading tools let a prediction place a trade, so one overconfident model, late price or double-click can wreck the account. MoodRing puts a gatekeeper between the guess and the money. The gatekeeper follows fixed rules, and it can turn a trade down or shrink it but never make it bigger. You'd want this whenever the thing making the calls is something you don't fully trust yet: a beginner, a new model, or an automated agent.

**If you remember nothing else:** anyone can propose a trade, but only the rules can say yes, and they only ever say "no" or "less."

## In the Wild (STAR)

- **Situation:** You connect a homemade forecasting agent to the local API overnight. It publishes a signal every 10 minutes and passes its own `agent_id`. The Wi-Fi is flaky, so requests time out and the agent retries. At 2am the quote provider goes down for 20 minutes. The model is also quietly buggy: some features are stamped *after* the prediction time.
- **Task:** In the morning you need to trust the ledger. That means no duplicate buys from retries, no fills at prices nobody actually saw, no trades that used information from the future, and no single "92% confident" call that bets the account.
- **Action:** The agent can only *propose*. A retry with the same idempotency key returns the original trade. If it reuses the key with a different body, it gets a 409. The lookahead signals are rejected with a 400 when published. While quotes are stale, entries fail with a 503 instead of using the last known price. The signals that pass are cut to the smallest cap: the engine allows $10,000, the policy allows **$200**.
- **Result:** The ledger is exactly right, and every rejection has a reason code you can read over coffee. **The bill:** the agent sat out the outage and missed the move. Most signals came back `PASS`, and the trades that went through feel tiny. The rules are deliberately conservative, so they also block some good trades.

**The tell:** **an untrusted source is making decisions**, and **its mistakes pile up in shared state**, like cash, positions or history, that is hard to undo.

## The Key Insight
**Before:** the usual setup is signal → order. Code reads the model's output (`if prob_up > 0.6: buy(size=f(confidence))`), so the model holds the authority and the risk checks are a filter added afterwards.

**What flipped:** the prediction is treated as an **untrusted claim with a timestamp**. Authority lives in deterministic code that can only *subtract* from it.

The rest of the design follows from that:
- **Sizing is the minimum of several caps**, because the authority can only shrink a trade.
- **Lookahead and stale data are refused, not patched over**, because a claim with a bad timestamp isn't evidence.
- **Retries are deduplicated by key**, because the request is also untrusted, not just the forecast.
- **A `PASS` is stored with its reason**, because a learner has to see why the authority said no.
- **The ML code is kept apart from the trading path**, because nothing earns authority just by existing.

## Negative Space

- **Not an ML trading bot.** *Consequence:* you could delete `src/models/` and the API would still work completely, because predictions come from the caller.
- **Not a realistic broker simulator.** A fill is the quote plus fixed slippage and fee in basis points. *Consequence:* it can't teach you about liquidity, partial fills or market impact. A $200 trade and a $2M trade get the same treatment.
- **Not a standalone backtesting framework.** Replay goes through *the same service and policy*. *Consequence:* a backtest can't use rules the live path wouldn't allow. That's honest, but you can't explore rules outside what the policy permits (for example, leverage or shorting).
- **What it never claimed to solve:** whether your forecast is any *good*. It makes a bad forecast safe and visible. It doesn't make it profitable.

## Explain in Levels

**To a student:** You tell the app "I think this stock will go up." The app checks whether the guess is fresh, whether it's worth the trading fees, and whether it's too big for your account. Then it buys some, less, or none, and tells you why. You practice with fake money and learn from the "why."

**To an engineer:** Each request goes through two steps:
1. **`publish_signal`** runs `DecisionEngine` (gates: stale features, invalid input, net edge after round-trip costs, confidence, minimum size) and stores the decision either way.
2. **`execute_trade`** re-checks everything against a *new* quote, inside a transaction. It looks at quote freshness, signal expiry, whether open positions are stale, whether the ticker is already held and whether the signal was already used. Then `ScenarioPolicy.budget` takes the minimum of the caps (% of equity, cash reserve, gross exposure, risk per trade) and pauses entries during a drawdown.

Money is Decimal throughout. Writes are keyed per (user, idempotency key), so retries are safe. The trade-off: the system is conservative and stateful, and it fails closed (503) whenever data is missing.

**To a PhD:** The design separates *proposal* from *authorization*. The authorization function is deterministic, monotone in the "restrict" direction (each gate only maps a proposal to a smaller one or to ∅) and causal: it requires `feature_available_at ≤ prediction_time ≤ now`, and every input has a maximum age. Re-checking at execution time is a time-of-check/time-of-use defense, since the world can change between publish and trade. Some limits remain open:
- The sizing is heuristic. Fractional Kelly needs calibrated `p` and `b`, which nothing in the trading path provides.
- VaR/CVaR assume Gaussian residuals.
- The ledger isn't fully append-only, because summary rows change when a trade closes. The audit trail exists, but it isn't an immutable event store.

## Question Ladder

```
          Why can't the forecast just place the trade?
         /                    |                     \
  It might be wrong     Its data might        The request might
         |              be late or leaked      arrive twice
  Why not trust a              |                     |
  confidence cutoff?    Why not use the       Why not dedupe
         |              last known price?     by signal id?
  Confidence is the            |                     |
  model's OWN claim,    The fill would be     Can't tell a retry
  uncalibrated          at a price nobody     from a new intent
         |              saw → fictional       without the caller's
         |              ledger                key
          \                    |                    /
           \                   |                   /
        Every input is a claim made by someone else
                               |
          Then who is allowed to change the ledger?
                               |
              ONLY code we own and can replay
                    ┌──────────┴──────────┐
          Deterministic →           Restrict-only →
          same input, same          each check can shrink
          decision + reason         or reject, never enlarge
                    └──────────┬──────────┘
            PROPOSAL vs AUTHORITY  (min of caps,
            400/503/409, PASS reasons, research quarantine)
```

**Why the branches meet:** "the model is wrong", "the price is late" and "the request is duplicated" look like a stats problem, a data problem and a networking problem. All three come down to the same issue: **the ledger is accepting claims it can't verify.** The fix for all three is the same, which is to move authority into code you own.

**Self-test:** an auto-exit with a stop-loss *closes* a position without the user asking. Does that break "restrict-only"? Hint: think about which direction it moves your exposure.

### 5 · **user:**

what is publish_signal... i have no domain understanding of trading

### 6 · **assistant:**

## The vocabulary you need first

| Word | Plain meaning |
|---|---|
| **Scenario** | A practice account with fake money, e.g. $10,000. You can have several, each with its own rules. |
| **Ticker** | A stock's short name, like `AAPL` for Apple. |
| **Quote** | The stock's current price, with the time it was observed. |
| **Prediction** | A guess about the stock: "probably goes up, by about 2%, and here's how sure I am." |
| **Signal** | A prediction that has been *submitted and checked*, and saved with the verdict. |
| **Position / trade** | Shares you actually hold after buying. |

## What `publish_signal` does

It's the **"here's my guess, what do you think?"** step. No money moves yet.

Think of a student pilot and a flight instructor. The student says "I want to take off now." The instructor checks the weather, the fuel and the runway and writes in the logbook: *approved*, or *not approved, because of the crosswind.* The plane hasn't moved. Taking off is a separate step later.

Here's what happens in the code (`src/paper_trading/service.py:222`):

1. **Clean up the ticker.** `" aapl "` becomes `AAPL`, and invalid names are rejected.
2. **Check that the scenario is yours.** If not, you get a 403 or 404.
3. **Look up the current price** of the stock (`_quote`).
4. **Judge the guess** (`_decision`, which calls `DecisionEngine`):
   - Is the guess from the future, or based on data that arrived *after* the guess was made? → reject.
   - Is the guess too old? → expired.
   - After paying fees (about 0.3% to buy and later sell), is the expected gain still positive? If not, the verdict is **PASS** (don't trade).
   - Is the guesser confident enough? If not, PASS.
   - If it passes everything, the verdict is **BUY**, with a suggested amount and a safety exit price (stop-loss: "sell automatically if it drops this far").
5. **Save everything** in one record: your raw guess, the verdict, the price at that moment and an expiry time. It's saved **even if the verdict is PASS**, so you can see later why you were told no.

## Concrete example

You send:

```json
{ "ticker": "AAPL",
  "prob_up": 0.6,                 // 60% chance it goes up
  "mu": 0.02,                     // expect about +2%
  "trade_success_prob": 0.6,
  "var": 0.0004, "drawdown_risk": 0.05,
  "prediction_time": "...10:00",
  "feature_available_at": "...09:55" }   // the data you used existed before you guessed
```

You get back a saved signal with `decision_json.action = "BUY"` and a suggested size.

Change `mu` to `0.002` (+0.2%), and the verdict becomes `PASS / NEGATIVE_EXPECTED_NET_EDGE`. The expected gain is smaller than the fees, so trading would lose money on average.

## How it relates to the next step

```
publish_signal  →  "Is this guess sensible?"   saves a verdict, no money moves
execute_trade   →  "OK, actually buy it."      checks again with a fresh price,
                                               applies account limits, spends fake cash
```

`execute_trade` checks again because time has passed. The price may have moved or gone stale, or you may already own that stock. Being approved at publish time doesn't guarantee the purchase.

**In one line:** `publish_signal` turns "I think AAPL will go up" into a dated, checked, saved record with a yes or no and a reason. Buying is a separate, later step.

### 7 · **user:**

publish signal is for learning, execute_trade also does the same checks followed by trade execution

### 8 · **assistant:**

Partly right. Two corrections.

**1. `publish_signal` isn't optional. You can't trade without it.**
`execute_trade` doesn't take a prediction. It only takes a `signal_id` (`service.py:271`). The guess, its expiry and the price at that moment come from the saved signal. So the flow is required, not a learning extra:

```
publish_signal(prediction)  →  signal_id
execute_trade(signal_id, dollars, idempotency_key)  →  trade
```

The record does help learning, because you can see why a guess was rejected. But its main job is to **lock in the guess** so the trade step works from a fixed, dated claim and not whatever the caller sends at buy time.

**2. `execute_trade` does more than repeat the checks.**
It reruns the same guess-quality check (`_decision`) with a **fresh price**. It also checks things `publish_signal` never looks at:

| Check | In publish? | In execute? |
|---|---|---|
| Guess from the future, expired, fees too high, low confidence | ✅ | ✅ (again, with a new price) |
| Is the price fresh enough (≤ 15 min)? | ❌ | ✅ |
| Is this price older than one already recorded? | ❌ | ✅ |
| Are prices for stocks you already hold up to date? | ❌ | ✅ |
| Do you already own this stock in this account? | ❌ | ✅ |
| Was this signal already used for a trade? | ❌ | ✅ |
| Account limits (2% per trade, keep 10% cash, pause after a 20% loss, …) | ❌ | ✅ |
| Enough cash? | ❌ | ✅ |
| Is this a retry of a request already done (same key)? | ❌ | ✅ |

**Corrected version:** `publish_signal` checks whether the **guess** is sensible and saves it. `execute_trade` checks whether **this account can act on it right now**, then buys.

### 9 · **user:**

so what does close_trade do

### 10 · **assistant:**

[ran: Bash — Read close_trade and its callers]

`close_trade` **sells the whole position** and turns the shares back into fake cash. It's the opposite of `execute_trade`.

## What it does (`service.py:362`)

1. **Check the request.** You need an idempotency key. A retry with the same key returns the earlier result, so the shares can't be sold twice.
2. **Check the trade.** It has to be yours (403/404 otherwise) and still open (409 `Trade is already closed` otherwise).
3. **Get a price.** It fetches the current one, unless a price is passed in (more on that below).
4. **Validate the price.** It must be fresh (≤ 15 min), for the right stock, and not older than the last price recorded for this position. If any of these fail, you get a **503** and nothing is sold. It won't sell at a price it can't trust, even when you're trying to get out.
5. **Do the math**, all in one transaction:
   - Sell price = quote **minus** 0.05% slippage (buying adds it, selling subtracts it, so you lose a little both ways)
   - Proceeds = shares × sell price − 0.1% fee
   - Profit/loss = proceeds − what the purchase cost in total
6. **Update the account.** Cash goes up, the position and trade are marked `closed` with the exit reason, the win/loss counters update, and a sell record and an account snapshot are written.

## Example

| | Price | You pay / get |
|---|---|---|
| Buy (via `execute_trade`) | quote $100 → you pay $100.05 | ~2 shares, **$200.00** including fee |
| Sell (via `close_trade`) | quote $102 → you get $101.95 | **$203.39** after fee |
| **Result** | the stock went up 2% | you made **+$3.39 (1.7%)** |

The missing 0.3% went to slippage and fees on the way in and out. That's the "round-trip cost" `publish_signal` checks for: a guess of "+0.2%" gets a PASS because it would lose money after these costs.

## Two ways it gets called

| Who | When | `exit_reason` |
|---|---|---|
| **You**, via `POST /api/v1/paper-trading/close/{trade_id}` | Whenever you want out | `manual` |
| **The price checker**, automatically (`service.py:503`) | When the price falls to the **stop-loss** ("sell if it drops this far") or rises to the **take-profit** ("sell if it gains this much"). Both were set at buy time. | `stop_loss` / `take_profit` |

For automatic exits, the checker passes in the price it just saw and uses the key `auto:{trade_id}`. If the checker fires twice for the same trade, the second call is a harmless replay. You can turn automatic exits off per account with `auto_exit: false`.

## What it doesn't do
- **No partial sells.** It's all or nothing, and the entire position closes.
- **No judging.** No decision engine and no account limits run here. Selling is always allowed as long as the price can be trusted. Only buying is gated, because buying adds risk and selling removes it.

### 11 · **user:**

what do you mean by price orlder than recrded;  Lookahead and stale data are refused

### 12 · **assistant:**

These are three separate timing checks. Every price and every guess carries a timestamp ("when was this true?"), and each check asks a different question about that timestamp.

## 1. Stale: "Is this price too old to use *now*?"

```
09:00            09:20 (now)
  │ price $100       │  you want to buy
  └──── 20 min ──────┘   limit is 15 min → refused (503)
```

A price is a snapshot. A 20-minute-old snapshot may be wrong now, because the stock could be at $97. If the app filled you at $100, your fake account would show a trade that **couldn't have happened** at that moment.

So the app refuses until it gets a fresh price. It doesn't quietly reuse the old one.

## 2. Out of order: "Is this price older than one I've already used?"

```
         10:05 price $102 ── already used and recorded
10:00 price $100 ── arrives late (slow network or a cache)
```

Both prices may be within the 15-minute limit, so neither is stale. But the app has already recorded that at 10:05 the stock was $102. Accepting $100 from 10:00 now would **move the account backwards in time**.

Results would also become order-dependent: whichever network response happened to arrive last would decide your fill price. The rule is that the clock only moves forward. A price older than the newest one already recorded is rejected.

This is the "older than the last recorded observation" check in `execute_trade` and `close_trade`.

## 3. Lookahead: "Did the guess use information from *after* it was made?"

This one is about the **prediction**, not the price. A prediction carries two times:

- `feature_available_at`: when the data behind the guess existed
- `prediction_time`: when the guess was made

```
OK:       data 09:55  →  guess 10:00
Refused:  guess 10:00  →  data 10:30   ← the guess used data from the future
```

Why would that ever happen? Mostly by accident in research code. For example, a model predicting Monday's move might use a news article or a closing price that was only published Monday evening. When testing on history, that data sits in the same table, so it's easy to grab.

The model then looks brilliant, because it is in effect reading tomorrow's newspaper. In real life that data wouldn't exist yet, and the model would fail.

The app refuses these at `publish_signal` with a 400. It also refuses `prediction_time` values later than "now", since a guess can't be made in the future.

## Side by side

| Check | Question | Example failure | Why it matters |
|---|---|---|---|
| **Stale** | Is the price recent enough for *now*? | 20-min-old price | You'd trade at a price that may no longer exist |
| **Out of order** | Is it newer than what's already recorded? | 10:00 price arrives after the 10:05 one | The account history would go backwards |
| **Lookahead** | Did the guess only use the past? | Guess at 10:00 uses 10:30 data | The model looks smart by cheating |

**What they share:** the app never pretends to know something it couldn't have known at that moment. When it can't be sure, it refuses with a 400 or 503 and doesn't guess.
