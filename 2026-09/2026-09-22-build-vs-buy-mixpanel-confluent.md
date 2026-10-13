---
schema: 1
id: 2026-09-22-build-vs-buy-mixpanel-confluent
title: "Build vs buy: buy Mixpanel; buy managed Kafka but unbundle Confluent"
why: Spending $110k of engineer time to save $11k is the trap; for Confluent you pay for three products and use one.
why_source: suggested
harness: claude-code
harness_version: 2.1.278
model: <synthetic>
session_id: 125e2d7d-ff98-491b-a906-4c7d89dfa560
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-exp-claude-ideas/125e2d7d-ff98-491b-a906-4c7d89dfa560.jsonl
started: "2026-09-22T13:34:34.321Z"
captured: "2026-10-13T05:30:01Z"
cwd: ~/Documents/proj/exp/claude/ideas
mode: "skill:build-vs-buy"
turns: 8
complete: true
golden_turns: [6, 8]
labels: [build-vs-buy]
status: raw
---

### 1 · **user:**

/build-vs-buy mixpanel

### 2 · **assistant:**

Login expired · Please run /login

### 3 · **user:**

/build-vs-buy mixpanel

### 4 · **assistant:**

No org profile was supplied with the invocation, so I'm running the analysis against a stated baseline: a ~60-person B2B SaaS company, ~100M analytics events/month, one data engineer's worth of spare capacity. Swap the numbers if your reality differs — the break-even math is the part that moves.

---

## 1. Executive Summary & Verdict

**BUY Mixpanel — but as a queryable front-end over event data you own, not as the system of record.** Product analytics is undifferentiated heavy lifting; the columnar store, session stitching, funnel/retention engine, and the self-serve UI that PMs actually use are worth far more than the ~$25–40k/yr you'd pay, and building them consumes an FTE indefinitely. The one thing worth building is the **event pipeline upstream of Mixpanel**, so the vendor is a replaceable consumer.

---

## 2. Economic & Resource Analysis

**Assumed intake (Phase 1)**
| Metric | Assumption |
| :--- | :--- |
| Volume | 100M events/mo, ~500k MTUs |
| Integration breadth | ~8 producers (web, iOS, Android, backend, billing, CRM, support, marketing) |
| Team | 1 data eng available (~0.5 FTE realistically free) |
| Fully burdened eng cost | $220k/yr per FTE |
| SLA | Dashboards ≤5s p95; analytics is business-critical but not customer-facing |

**SaaS run-rate vs. compute cost**
- **Mixpanel:** at this volume you're past self-serve Growth into negotiated Enterprise. Realistic landing zone **$25k–45k/yr**. Hidden costs: event-volume overages on instrumentation mistakes (a chatty SDK release can double the bill overnight), Data Pipelines / warehouse export often priced as a **separate add-on**, and SSO/audit gated behind Enterprise.
- **DIY infra:** ClickHouse (self-hosted on 3× compute-optimized nodes + object storage) or BigQuery, plus Kafka/Kinesis ingest, plus a BI layer. Raw infra **$18k–30k/yr** at this volume — genuinely competitive, and the number that tempts people into building.

**Engineering opportunity cost**
- Build to parity (ingest, identity resolution, funnel/retention/cohort engines, a UI non-engineers will use): **2–3 engineers × 9–12 months ≈ $400k–650k** one-time.
- Steady-state maintenance tax: **0.5–1.0 FTE forever ≈ $110k–220k/yr** — SDK upkeep across 4 platforms, schema drift, late-arriving events, identity-merge bugs, query-performance firefighting, and the on-call nobody wants.

**Break-even**
Applying the Phase 2 rule: `(SaaS $35k − DIY infra $24k) = $11k` vs. `maintenance $110k+`. **$11k ≪ $110k → BUY, decisively.** The infra savings don't cover a tenth of the human cost. The math only flips around **2–5B events/month**, where vendor pricing scales roughly linearly while ClickHouse cost scales sublinearly and maintenance stays roughly flat — that's 20–50× your current volume. At current growth, that's not a horizon worth architecting for today; it's a horizon worth staying *optionable* for.

---

## 3. Technical Trade-Off Matrix

| Dimension | In-House Build | Mixpanel |
| :--- | :--- | :--- |
| Core functionality | Funnels, retention, cohorts, session replay each a quarter of work; the self-serve UI is the hardest part and the part that decides adoption | Mature out of the box; PMs self-serve on day one without a ticket to data eng |
| Integration & APIs | Total control; you write and version 4+ SDKs yourself | Strong SDK coverage; you inherit their deprecation calendar and rate limits |
| Compliance & security | You own residency and deletion natively — the real advantage | SOC2/GDPR/HIPAA available; EU residency exists but is a config decision made once, hard to reverse; DSR deletion goes through their API on their timeline |
| Query flexibility | Arbitrary SQL, joins against any internal table | Excellent for the modeled questions; awkward once you need to join product events to proprietary domain tables |
| Ongoing maintenance | 0.5–1.0 FTE forever, permanently | Near zero; cost is instrumentation hygiene and taxonomy governance |
| Cost at 100M/mo | ~$24k infra + ~$150k people | ~$35k all-in |
| Cost at 3B/mo | Sublinear infra growth; maintenance roughly flat | Linear or worse; renegotiation leverage weak once embedded |

**Phase 3 disqualifier check:** For the baseline profile, none fire. Buy stands. It flips if you have an **air-gapped or on-prem deployment requirement**, or if your core analytics questions are **domain-specific in a way Mixpanel's event model can't express** — e.g. analytics that must join events against proprietary pricing/risk logic per query, or metrics that are themselves a customer-facing product feature. That last one is the real disqualifier: **if you resell analytics to your customers, that's differentiated and you build it.**

---

## 4. Operational Risk Assessment

**Failure modes of building**
- The 9-month estimate becomes 18. It always does, because the UI — not the storage — is the project, and the first internal version gets used by three engineers and ignored by every PM.
- Identity resolution (anonymous → logged-in merge across devices) is deceptively hard and produces silently wrong retention numbers that leadership trusts for a quarter before anyone catches it.
- Bus factor: the one engineer who understands the pipeline leaves, and you now own a system nobody can safely change.
- Opportunity cost is the real bill — a year of senior capacity not spent on the product.

**Failure modes of buying**
- **Bill shock from volume:** an instrumentation bug or a growth spike blows through the committed tier. Mitigate with client-side sampling controls and a volume alert on your own pipeline, before events leave your perimeter.
- **Lock-in via history:** three years of events living only in Mixpanel makes leaving unaffordable regardless of price. This is the risk that actually matters, and Phase 5 below neutralizes it.
- **Renewal leverage:** once dashboards are embedded in board reporting, your negotiating position erodes each year.
- **Roadmap dependency:** a feature you need is a feature request, with no committed date.
- **Data-deletion obligations** are executed on a third party's timeline under your legal liability.

---

## 5. Architectural Recommendation & Migration Path

The whole strategy is one idea: **make Mixpanel a subscriber, never the source of truth.**

**Phase A — Decouple the contract (do this first, ~2 weeks).**
Never call the Mixpanel SDK from product code. Define an internal `track(event, properties)` interface with a versioned event schema and call that everywhere. The Mixpanel SDK becomes one implementation behind it. This is cheap now and impossible later.

**Phase B — Own the core data (~4–6 weeks).**
Route every event through your own collector (Segment/RudderStack, or a thin Kinesis→S3 writer) and **land raw events in your own object storage first**. Mixpanel becomes one fan-out destination alongside your warehouse. From here, leaving costs a config change and a backfill, not a rebuild. This also gives you volume visibility before the vendor bills you for it.

**Phase C — Buy the analysis layer, govern the taxonomy.**
Let Mixpanel do funnels, retention, cohorts, and self-serve exploration. Spend your engineering effort on the part vendors can't do for you: a maintained event taxonomy, naming conventions, and CI checks that reject unregistered events. Bad instrumentation ruins a bought tool and a built one equally — this is where your analytics quality actually comes from.

**Phase D — Build only the differentiated slice.**
Anything joining product events to proprietary business logic, and anything customer-facing, runs on your warehouse copy, not in Mixpanel. This is a hybrid by design, not a compromise.

**Phase E — Set an explicit revisit trigger.**
Re-run this analysis when **annual Mixpanel spend exceeds ~$150k**, or **monthly volume passes ~1B events**. At that point the build case becomes arguable, and because of Phases A and B you'll have full event history in your own storage and a swappable interface — so the decision stays cheap. That optionality is worth more than the $11k/yr the DIY path would have saved you today.

### 5 · **user:**

i have adhd. please reformat

### 6 · **assistant:**

**Verdict: BUY Mixpanel.** Not close.

---

**The math**

- Mixpanel: ~$35k/yr
- DIY infra: ~$24k/yr
- Savings: **$11k**
- Cost of an engineer babysitting it: **$110k+/yr, forever**

You'd spend $110k to save $11k.

---

**Plus the build cost**

2–3 engineers × ~9 months = **$400k–650k** before you have anything.

And it won't be 9 months. It never is.

---

**Why it's expensive**

The database isn't the hard part. The **UI is the project.** Build it and your PMs will ignore it and file tickets with you instead.

Second killer: identity resolution. Anonymous → logged-in merging across devices. Easy to get subtly wrong, and wrong retention numbers get believed for a whole quarter.

---

**The real risk of buying**

Not price. **History.**

Three years of events living only in Mixpanel = you can never leave, at any price.

---

**So: make Mixpanel a subscriber, not the source of truth.**

Two things, both cheap now and impossible later:

1. **Wrap the SDK.** Product code calls your own `track()`. Mixpanel sits behind it.
2. **Land raw events in your storage first.** Mixpanel is one destination downstream.

Leaving then costs a config change, not a rebuild.

---

**Where to actually spend engineering time**

Event taxonomy + CI checks that reject unregistered events.

Bad instrumentation ruins a bought tool and a built one equally.

---

**When to revisit**

- Spend > ~$150k/yr, **or**
- Volume > ~1B events/mo

That's 20–50× where I assumed you are. Do the two decoupling steps and the decision stays cheap whenever it arrives.

---

**One thing flips this to BUILD**

If you **resell analytics to your customers.** Then it's your product, not your infrastructure — build it.

Also flips: air-gapped/on-prem requirement.

---

*Baseline assumed: ~60 people, 100M events/mo, ~500k MTUs, 1 data eng with spare capacity. Tell me if that's off and I'll rerun it.*

### 7 · **user:**

/build-vs-buy confluent. ive adhd

### 8 · **assistant:**

**Verdict: BUY managed — but probably not full Confluent.**

Confluent is three products bundled. You're likely paying for all three and using one.

---

**Baseline I assumed**

~60-person SaaS, **~50 TB/mo** through Kafka, ~15 producer/consumer services, 3 nines, no dedicated infra team.

Tell me if that's wrong — Kafka economics swing hard on throughput.

---

**The math**

| | /yr |
|---|---|
| Confluent Cloud | **~$180k** |
| AWS MSK | ~$60k |
| Self-managed on EC2 | ~$35k |
| Kafka ops engineer | **~$165k** (0.75 FTE) |

---

**Now apply the rule**

Confluent vs. self-host: **$145k gap** vs. **$165k** of maintenance.

That's a coin flip. Not the slam dunk Mixpanel was.

But MSK vs. self-host: **$25k gap** vs **$165k**. That one's obvious.

**So the real answer isn't build-vs-buy. It's which managed.**

---

**Why self-hosting Kafka is worse than it looks**

It's not install day. It's:

- Partition rebalancing under load
- A broker dies at 2am and ISR won't catch up
- Disk fills, cluster wedges, nobody knows the runbook
- Version upgrades across a live cluster
- ZooKeeper → KRaft migration

You're not buying software. **You're buying somebody else's on-call.**

---

**What you're actually paying Confluent for**

1. Managed Kafka ← MSK does this for 1/3
2. Schema Registry ← genuinely good, genuinely annoying to self-run
3. 120+ connectors + ksqlDB/Flink ← the expensive part

**If you're not using #3, you're overpaying by ~$120k/yr.**

---

**The bill that surprises people**

Confluent charges **networking both ways.** Ingress + egress + inter-AZ.

Add one new consumer group on an existing topic → egress doubles on that topic. No warning, no new data.

Fan-out is where the bill runs away.

---

**Risks of buying**

- Confluent pricing is throughput-linear. Grow 3×, pay 3×.
- Connectors are the sticky part. They're proprietary config, and rewriting 20 of them is the actual exit cost.
- Renewal leverage drops to zero once you're load-bearing.

**Risks of building**

- One person becomes The Kafka Person. They leave. Now nobody can safely touch it.
- Outages are correlated — Kafka down means *everything* down, because you made it the spine.

---

**The disqualifier check**

Nothing in the baseline blocks buying.

Flips to BUILD if: **air-gapped/on-prem**, or **sub-5ms p99** (managed hop costs you), or you're a data-infra company where this *is* the product.

---

**What I'd actually do**

**1. Wrap the client. Now.**
No raw Kafka clients in service code. Your own thin publish/subscribe interface. Cheap today, impossible in two years.

**2. Keep schemas in your repo, not the vendor.**
Registry is a *deployment target*, source of truth is git. This is the single biggest lock-in escape.

**3. Buy MSK, not Confluent** — unless you're really using connectors and stream processing.

**4. Don't buy connectors. Write the 3 you need.**
Managed connectors are the lock-in *and* the premium. A Debezium container you own is boring and portable.

**5. Self-host nothing except Schema Registry** if you want, it's the one lightweight piece.

---

**Revisit when**

- Spend > ~$300k/yr, **or**
- You hire a real platform team

Then self-hosting on Strimzi becomes arguable. Steps 1 and 2 keep that door open for free.

---

**One-line version for your exec**

*"Managed Kafka, yes. Confluent's full platform, only if we're using the connectors — otherwise it's $120k/yr for features we don't touch."*
