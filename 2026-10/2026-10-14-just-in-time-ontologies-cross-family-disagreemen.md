---
schema: 1
id: 2026-10-14-just-in-time-ontologies-cross-family-disagreemen
title: "Just-in-time ontologies: cross-family disagreement turns agent misreadings into definitions"
why: Disagreement between model families shows you where a meaning was never defined; each fix becomes a written definition, and those definitions add up to an ontology for one kind of decision, not a universal one.
why_source: suggested
harness: claude-code
harness_version: 2.1.299
model: claude-opus-5-5
session_id: e340b0fc-c3ea-4c14-9a39-83335476ef2f
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/e340b0fc-c3ea-4c14-9a39-83335476ef2f.jsonl
started: "2026-10-14T16:59:07.792Z"
captured: "2026-10-14T17:41:09Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:few-shot"
turns: 14
complete: true
golden_turns: [12, 14]
labels: [agents, few-shot, simulation, knowledge-mgmt]
status: raw
---

### 1 · **user:**

/productivity:few-shot https://www.youtube.com/watch?v=Fa3hQVIKShw

### 2 · **assistant:**

I can't tell what that video covers from the link alone, and I don't want to guess and end up teaching you a different, better-known topic. How do you want to pin it down?

1. **I fetch it:** I'll try to get the title, description and transcript, then write the shots from what the video actually says.
2. **You name it:** Tell me the concept, tool or system it covers in a few words, and I'll build the shots from that.

### 3 · **user:**

get the transcript

### 4 · **assistant:**

[ran: Bash — Download video title and English subtitles]
[ran: Bash — Retry subtitle download with other YouTube clients]
[ran: Bash — Retry English auto-subtitle download]
[ran: Bash — Fetch transcript using youtube-transcript-api]
[ran: Bash — Print transcript]

I got the auto-generated transcript and wrote the shots from it. Auto-captions mangle names, so the model names "Jev" and "Luna" are marked *(unverified)*.

# Just-in-Time Ontologies, distilled
A talk by Hrishi Olickel (Southbridge AI) at AI Engineer, 21 min. Its claim: because intelligence is now cheap, you should build a schema at the moment a decision is made, not ahead of time.

## The 7 shots

| # | Situation | What happens | Lesson |
|---|---|---|---|
| 1 | Define "customer" once, company-wide. | Billing means whoever pays. Support means whoever calls. Compliance means whoever we're on the hook for. The definition only becomes clear once a specific question arrives, such as "refund this order?" | No customer exists apart from the question you're asking. |
| 2 | "Write down the temperature." | Three different uses need different fields. Personal comfort needs readings spread through the day, taken by you. Weather maps need location, time and device. Placing equipment needs you factored out as a variable. When the reading is recorded, nobody knows which use it's for. | There are four schemas: the source, the storage, the decision, and the model's prior. All four are only visible together at decision time. |
| 3 | One coding agent designs the pipeline and also runs inside it. | The two jobs pull in opposite directions. Design wants slow, Opus-class thinking. Work inside the pipeline wants cheap, fast workers that follow instructions and fail in predictable ways. A third role, the "hill-climber", tunes the pipeline. | Split the roles. A new kind of model slots into exactly one of them. |
| 4 | Ohio campaign-finance entity resolution: 203,317 cases, projected at about $10k. | It cost $795 against a fixed $800 budget. Second opinions, settling disagreements and auditing took $545, while first answers took $128. An agent ran for 10 days and tried more than 12 architectures. | Checking cost about 4× as much as doing, so put the budget into verification. |
| 5 | The decision model *(unverified name: "Jev")* says a confident "no" to all 9 household links. | The team rewrote only the question, spelling out what counts as enough evidence. They left the model and thresholds alone. The answers flipped to "yes". | The definition was the problem, not the model. |
| 6 | The source file stores loan amounts as negative numbers. | Several runs decided the minus sign was redundant and stored absolute values. A net of $784k became $5.3M of debt, and multiple models validated it. In another run, dates in a fifth format came out 99.4% empty, but row counts and dollar totals still matched, so the agent moved on. | The model's prior is a schema of its own. Totals that reconcile don't prove the data is right. |
| 7 | Two different model families cross-check 200 held-out families. | They agreed on 194, and none of those shared answers was wrong. Every error was in the 6 where they disagreed. In a separate benchmark, though, 4 families produced the same wrong total because they shared a sign convention. | Disagreement between families pins down where errors are. Shared priors across all LLMs get past it, so list those and add targeted checks. |

## The rule
- **Schemas belong to decisions, not to data.** Keep each record's original context and build its meaning when a question arrives.
- **The model's prior is a fourth schema you didn't write.** Assume it will quietly "fix" your data to match what it believes.
- **Separate the designer, the worker and the optimizer.** Pick a model for each role based on that role's job.
- **Spend most of the budget on checking.** Cross-family disagreement is the cheapest way to find errors.
- **Every ontology is valid if it keeps its receipts.** That means a label for what the answer rests on and how far it was checked, so the next job can reuse it.

## Your turn
You use a small model to check your big model's date parsing. The small model was distilled from the big one. They agree on 100% of rows.

**How much should that agreement lower your audit budget, and what would you check instead?** (No answer here yet.)

*Say **more** for: the three work regimes, the 6-stage self-optimizing process (split → failure surface → bounded pilots → rigs/codons → production), the 4 things models still need (stable harness, bounded experiments, know-how, failure surface), and how "Pareto surfing" swaps in cheaper models over time.*

### 5 · **user:**

what does it mean " you should build a schema at the moment a decision is made, not ahead of time" ? give examples

### 6 · **assistant:**

The talk's actual wording is: *"Doing that merge when the decision space is known instead of ahead of time is what I mean by a just-in-time ontology."* By "merge" he means combining the context a fact was recorded in with the context of the decision that will use it. My one-line summary compressed that. Here are the two approaches side by side on the same data.

## Same data, two approaches

| # | Data | Ahead of time (one canonical schema) | Just in time (built for the decision) |
|---|---|---|---|
| 1 | Customer records from billing, support and sales | You build a `customer` table up front, merging records by email. A reseller who buys for 40 end users becomes one "customer". | **"Refund order #8812?"** needs only `payer`, `payment_method`, `days_since_purchase`, `prior_chargebacks`. Here the customer is whoever paid for *this order*, so the reseller is correct. |
| 2 | The same records | The same merged table is reused for a different question. | **"Extend $50k more credit?"** needs `legal_entity`, `parent_guarantor`, `total_exposure_across_subsidiaries`. Now the customer is the legal entity on the hook, which can mean merging accounts that #1 kept apart. |
| 3 | Ohio donor filings | You decide ahead of time that "same person" means the same name and address. | **"Is this one household?"** forces the question of what counts as enough evidence that two people at one address are linked. In the talk this was settled over 12+ rounds *during* the job, one definition at a time (committee, filer, shared address). |
| 4 | Temperature log | You store `{value, timestamp}` because that's what seemed reasonable. | Building weather maps needs device and exact location. Deciding where to put sensitive equipment needs the person's own effect on the reading removed. The ahead-of-time schema already dropped the fields those decisions need. |

**What the contrast shows:** an ahead-of-time schema bakes in one decision's interpretation and imposes it on every other decision. Often it also throws away fields a future decision would have needed.

## In practice
The pattern the talk describes, sketched:

```
keep raw sources + where each came from (don't flatten early)
        │
decision arrives: "refund order #8812?"
        │
a model reads the raw records and the question
  → works out the minimal fields and definitions this decision needs
  → transforms, labels every answer with what it rests on and how far it was checked
        │
cache that intermediate schema with its receipts; reuse it when the same kind of decision comes back
```

## Edge and near-miss
- **Edge: this doesn't mean recomputing everything every time.** In the talk's "write many, run many" pipelines, the schema built just in time becomes a stored intermediate. It's built the first time a decision needs it, then reused. So it's lazy, not throwaway.
- **Near-miss: schema-on-read (a data lake plus views).** It looks the same, since raw data is kept and structure is applied when you query. The difference *(my framing, not the talk's)* is that schema-on-read still needs a human to write a fixed interpretation into the view. Just-in-time adds judgment: a model interprets messy sources against the specific question. That only became affordable once intelligence got cheap, which is the talk's main argument.
- **When ahead-of-time still wins:** decisions that are fixed, frequent and regulated, like a general ledger or payroll. There the decision is already known ahead of time, so the schema can be built early.

## Your turn
A hospital stores `patient.weight_kg` as one field, recorded at admission.

**Name two decisions that need different schemas for "weight", and say what the stored field loses for each.**

### 7 · **user:**

you are saying schema is infered just in time from the facts, sources and decision

### 8 · **assistant:**

Yes, with three refinements. The last two come from the talk itself.

**1. Each input contributes something different.**
- **The decision sets what's needed:** which fields, which definitions, and how much evidence is enough.
- **The sources and storage set what's possible:** what was captured, in what format, and with what context and caveats.
- **The schema is where the two meet.** Anything the decision needs that the sources lack shows up as a gap you can name, like the missing device field in the temperature example. A schema built ahead of time hides that gap.

**2. A model's prior always gets mixed into the inference.** Whichever model does the inferring brings its own beliefs as the fourth schema. That is how negative loan amounts were "inferred" to be absolute values, which turned $784k into $5.3M. So an inferred schema is a hypothesis, not a fact. The talk's checks are what make it trustworthy:
- a second model from a different family, looking for disagreement
- a small slice checked by hand to serve as the failure surface
- a known list of errors all LLMs share, such as sign conventions and date formats

**3. It's often iterated, not inferred in one pass.** For the Ohio households, the first inferred definition gave "no" on every case. The fix was a human-and-agent loop that rewrote "what counts as enough evidence", repeated over 12+ rounds. So "just in time" means built when the decision is known and refined against failures. It doesn't mean read off the facts in one go.

The refined version of your sentence: **the schema is derived when the decision is known, from what the decision needs and what the sources hold, then checked against failures so the model's prior doesn't slip in.**

### 9 · **user:**

what exactly does schema mean ? what does it have to do with ontology

### 10 · **assistant:**

They're two layers of the same thing. A **schema** is the *shape* of data. An **ontology** is what that data *means*. The talk uses the words almost interchangeably, which is why the distinction blurs.

## Schema: the shape
A schema is the fields, types, keys and constraints that define what a valid record looks like.

```sql
CREATE TABLE customer (
  id          BIGINT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMP
);
```
It tells you that every row has an email and no two rows share one. It doesn't tell you who counts as a customer.

## Ontology: the meaning
An ontology covers the concepts, how they relate, and the rules that decide identity and membership:
- *Customer* is whoever pays for an order. (billing's ontology)
- *Customer* is any legal entity we carry credit exposure to, including subsidiaries through their parent. (finance's)
- Two donor records are *the same person* if the name matches **and** they share an address or employer. (Ohio's)

## Pull them apart

| Case | Schema | Ontology | What it shows |
|---|---|---|---|
| Billing and support both have a `customer` table with identical columns. | Same | Different: payer vs caller | Matching tables don't mean the teams agree on meaning. This is why migrations "succeed" and still give wrong answers. |
| One system stores `amount = -784000`, another stores `{amount: 784000, direction: "repayment"}`. | Different | Same: the money owed went down | Same meaning, different shape. Converting between them is ordinary ETL. |
| An LLM reads `amount = -784000` and stores `784000`. | Still valid | Broken: sign was part of the meaning | Schema checks pass. Only the meaning changed, which is the talk's main class of error. |
| `in_kind` vs `In-Kind` | A string mismatch | Whether this is a gift of goods or of cash | A tiny difference in shape changed the meaning of 15,658 rows. |

## How the talk uses the words
- **"Ontology"**, as in "single ontologies always fail", means the enterprise project of agreeing on one shared meaning for "customer", "account" and so on, and enforcing it with one schema.
- **"Four schemas"** (source, storage, decision, prior) really means four *contexts of meaning*, each with its own shape limits. That's closer to ontology than to DDL. Storage is the one that's actually about shape, like "you can't write the firmware down".
- **"Just-in-time ontology"** means the meaning (identity rules, definitions, what counts as evidence) is settled when the decision is known. The schema (the fields you materialize) then follows from that meaning.

**One line:** ontology decides what "customer" means. Schema decides how that meaning gets stored. The talk's claim is that the first can't be fixed ahead of time, so the second shouldn't be either.

### 11 · **user:**

so this is for data agents which can infer things wrongly. to improve them (as they are expected to run repeatedly) we are using cross model signal (the disagreements) to fish out wrong interpretations. with all the iterations we eventually set a good ontology for our decisions ?

### 12 · **assistant:**

Mostly yes. Four corrections sharpen it.

**1. Cross-model disagreement is one signal, not the whole loop.** The talk uses three failure signals, roughly in order of cost:
- **A failure surface set before starting:** good models plus hand-checking on a small slice, giving a baseline to fail against. Schema and behavior checks fall here too.
- **Cross-family disagreement:** 194/200 agreed and every error was in the 6 disagreements. It's cheap and points at where to look.
- **A known list of errors all LLMs share:** the 4 families that agreed on the same wrong sign convention. Disagreement can't catch these because everyone agrees. You have to list them and check for each one specifically.

**2. What gets fixed is mostly the definitions, not the models.** The household fix rewrote what counts as enough evidence and left the model and thresholds alone. Each of the 12+ rounds settled one definition: committee, filer, shared address. So disagreement points to an *ambiguity in the ontology*, and the fix is to make the meaning explicit. That is how the ontology gets built.

**3. You don't end with one good ontology. You end with one per decision class.** The result is "the ontology for donor entity resolution in campaign finance", stored with receipts (each of the 203,317 labels says what it rests on and how far it was checked). It gets reused when the same decision comes up again: next state, audit cost near zero. A credit decision over the same donors would build a different one. Ending with one universal ontology is the mistake the talk opens by apologizing for.

**4. After it's correct, the iterations keep going, now on cost.** With a verified ontology and baseline, the hill-climber agent does "Pareto surfing". It swaps in cheaper or faster models, compares them against the known intermediate results, and tightens the success criteria. The meaning stays fixed while the cost drops. That's how $10k became $795, and why repeat runs get cheaper.

**Corrected version of your sentence:** data agents get meaning wrong because of their priors. We catch it with a predefined failure surface, cross-family disagreement, and checks for errors all LLMs share. Each catch usually turns into an explicit definition. Over iterations that gives a verified ontology *for that decision class*, which is then reused and made cheaper.

### 13 · **user:**

/intuition just the simulation aspect of the above

### 14 · **assistant:**

# Intuition: catching an agent's wrong interpretations, then turning them into definitions

## Rediscover It (Simulated Conversation)

*Ana and Ravi run an agent that turns 400k vendor invoices into a spend ledger every week. Last week's total was $2.1M too high, and no check flagged it.*

**Ana:** Found it. Credit notes are negative in the source file. The agent decided the minus sign was a formatting artifact and stored them as positive amounts. Row counts matched and the schema validated.

**Ravi:** So use the bigger model. It should know credits are negative.

**Ana:** I tried that. The bigger model did the same thing, and when I asked about it, it *defended* the choice: "amounts are conventionally stored unsigned." It held its belief more firmly, not less.

**Ravi:** Then a human reviews the output every week.

**Ana:** It's 400k rows. A human samples 200, and the bug was in 0.3% of rows. Sampling either misses it or eats a day, and we run weekly. A human can't be the main check.

**Ravi:** Then have the model check its own work. Ask it "is this right?" for each row.

**Ana:** It'll say yes. It's checking against the same belief that made the mistake. I'd get confirmation from a duplicate of the model, not an independent check.

**Ravi:** So the checker has to *believe different things*. A second model from another lab, trained on different data. We don't trust either one. We only look where they disagree.

**Ana:** I'll run it on 200 invoices I've checked by hand. … They agree on 191, and all 191 are correct. Every error is in the 9 disagreements. That's 9 rows for a human to read instead of 200.

**Ravi:** And the 9 aren't random. Six of them are credit notes. One model treats them as negative, the other doesn't. That's not one model being careless. **Our instructions never said what a credit note means.**

**Ana:** So the fix is one sentence: "a credit note reduces spend; keep the sign." It's not a new model. Run it again: 198 agree.

**Ravi:** Here's what bothers me, though. The other 2 rows still have both models agreeing, and both are wrong. They both read "net 30" as a discount, not a payment term. Disagreement can't catch that, because every model makes the same mistake.

**Ana:** Then that one gets its own named check, a list of mistakes all models make. And we couldn't have measured any of this without the 200 hand-checked rows. **The baseline has to exist before the first run.**

**Ravi:** So each week a disagreement shows us a term we never defined, we write the definition down, and the list of definitions keeps growing. … That list ends up being the real model of what "spend" means for *this* ledger.

---

## Apply It (Simulated Conversation)

*Budget review. Mei runs data platform. Dan, VP Finance, is approving next quarter's spend for the campaign-donor pipeline.*

**Dan:** Your own numbers: $128 to produce the answers and $545 to check them. You're paying 4× to check work the model already did. Cut the checking.

**Mei:** The $545 is what found the loan bug. Without it we'd have reported $5.3M of debt when the real net was $784k, and that number had passed *multiple* models. Producing answers is cheap. Being wrong in a board deck isn't.

**Dan:** Then pick the best model and skip the second opinion.

**Mei:** The best model was one of the ones that dropped the sign. Bigger models hold their beliefs harder. The second opinion has to come from a *different family*. On 200 held-out cases, every error was in the 6 they disagreed on. That's what I'm paying for: it shrinks human review from 200 cases to 6.

**Dan:** Two vendors, two contracts, two outage risks. And if the second one is distilled from the first, you've paid twice for the same opinion.

**Mei:** Right. Distilled pairs disagree too rarely to be useful, so we only pair models from different families. The vendor overhead is a real cost, and it's in the budget.

**Dan:** Fine. But after twelve rounds of this, I want *one* donor model that every team uses. Compliance, outreach, fundraising.

**Mei:** That's the part I can't sell you. What we built answers "are these two filings the same donor?" Every label says what it rests on. Outreach asks "is this one household?", and that took its own definition: when do two people at one address count as linked? If you force one model on everyone, someone's question gets the wrong definition.

**Dan:** So every new question means another twelve rounds?

**Mei:** Only for new *kinds* of question. For the same question in the next state, the definitions already exist and we expect audit costs near zero. And when a new model comes out, we try it against results we've already verified, so we can switch to something cheaper without losing correctness.

**Dan:** And the mistakes both models make together?

**Mei:** Disagreement can't see those. We keep a written list, things like sign conventions and date formats, with a specific check for each. **That list is the one part that doesn't get cheaper.**

**Dan:** Then budget the checking explicitly, and show me which definition each fix added. If the list of definitions stops growing, the checking budget comes down.
