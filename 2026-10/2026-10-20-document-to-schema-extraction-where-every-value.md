---
schema: 1
id: 2026-10-20-document-to-schema-extraction-where-every-value
title: "Document-to-schema extraction where every value is provable: dual readers, cell pointers, vendor reality check, classical+LLM hybrid"
why: The LLM should point at a cell, never type the number — vendors' second model corrects rather than independently witnesses, so build your own decorrelated reader (classical extractive + calibrated) and let human reviews shrink the LLM's share over time.
why_source: suggested
harness: claude-code
harness_version: 2.1.304
model: claude-opus-5-5
session_id: 7994825b-1e13-48ca-a1ef-08741e3d7af7
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/7994825b-1e13-48ca-a1ef-08741e3d7af7.jsonl
started: "2026-10-20T09:30:17.293Z"
captured: "2026-10-20T21:35:10Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:productivity:intuition-panel"
turns: 16
complete: true
golden_turns: [4, 8, 14, 16]
labels: [product-idea, system-design, agents, build-vs-buy]
status: raw
---

### 1 · **user:**

/productivity:intuition-panel i have documents in differnet formats. pdf, images, xls, images in pdf, images in xls etc.. i want to extract rules (data) from it into structured schema for downstream usecases.
im thinking a document extraction and llm for filling the gaps + with schema match validation.
help me ideate.

### 2 · **assistant:**

**CEO:** You're not building document extraction. You're building a rule compiler: messy human documents go in, machine-checkable rules come out. Format is a distraction. The hard part is semantics, because a rule has conditions, exceptions, and references to other rules, and a row of data has none of those.

**PM:** Who reads the output first, a machine or a human approver? If a wrong rule gets into downstream systems silently, this product is a liability, not an accelerator. **What breaks when one rule is wrong?**

**Architect:** Schema validation checks shape, not truth. `{"limit": 5000}` passes validation even when the document says 50,000. Also, "LLM fills the gaps" is just hallucination with a nicer name. Gaps should be **flagged with a source citation**, never quietly filled.

```
  pdf / img / xls / img-in-pdf / img-in-xls
                  │
        normalize everything → page image + text layer   ← one format to rule them all
                  │
        extract  ──► candidate rule + citation (page, bbox, cell)
                  │
     ┌────────────┼──────────────┐
  schema check  cross-rule check  confidence
  (shape)       (contradictions)  (low → human)
                  │
            reviewed rule set  ──► downstream
```

**CEO:** My position: every field gets a pointer back to the exact pixel or cell it came from. That provenance is the product. Extraction quality is just table stakes.

**PM:** Then the core loop is a reviewer flipping between source and rule side by side, approve/fix/reject, and every fix improves the next run.

**Architect:** Which leads to the biggest unknown. Does your schema already exist and stay fixed, or do the documents themselves tell you what the schema should be? Those are two very different systems.

---

**The question to answer:** What's an example of a "rule" here, like "if X then Y" logic or a lookup table of values? And what breaks downstream when one rule is wrong?

### 3 · **user:**

schema is fixed.
rules are key values from tables or forms etc.
wrong inference means financial loss

### 4 · **assistant:**

**CEO:** A fixed schema plus key-values changes the problem. This isn't open-ended extraction, it's **slot filling against a known form**. Because errors cost money, my position is that the LLM never *invents* a value. It may only find, map, and point at one. An empty slot is a success. A wrong slot is a loss.

**PM:** So the product's promise isn't "we extract everything." It's "**every number we hand you, we can prove**." The person who uses it most is the one who signs off before money moves. Their screen shows the slot, the value, and the cropped source next to it.

**Architect:** Here's the main constraint: **the extractor can't grade its own work.** Run two independent readers, a native parser or OCR and a vision LLM, and only auto-accept a value when they agree. Then re-find the exact value in the source text. If it isn't literally there, reject it.

```
            slot: "max_claim_amount"
                     │
     ┌───────────────┴───────────────┐
  reader A (native cells / OCR)   reader B (vision LLM)
     │  "50,000"                       │  "50000"
     └──────────► normalize ◄──────────┘
                     │
          agree? ── grounded in source? ── units/scale ok?
           │ yes            │ yes              │ yes
           ▼                ▼                  ▼
        AUTO-ACCEPT   (any "no" → human queue with crop)
```

**CEO:** The quiet killer isn't OCR mistakes. It's **context loss**: a header saying "($ in thousands)", a footnote with "excl. tax", a currency symbol two columns away. Wrong scale means a 1000× loss, and it will pass schema validation every time.

**PM:** That points to one metric: the **auto-accept rate at ~zero error**. Start at 30% auto-accepted and grow it. Never trade precision for coverage.

**Architect:** For a native xls, read the cells directly and only use vision on embedded images. Don't OCR data that's already structured. The bigger lever is whether **layouts repeat**. If 80% of your documents come from 20 templates, you learn the templates once and the LLM only handles the long tail.

---

**The question to answer:** Are these documents mostly **recurring templates** (same issuer, same layout, new numbers), or does nearly every one look different? That decides whether this is a template engine with an LLM fallback, or LLM-first with heavy verification.

### 5 · **user:**

i was thinking of using docling for files to json.

### 6 · **assistant:**

**CEO:** Docling is a good choice, but be clear about its role. It's your **normalizer and reader A**, not the product. It converts the mess into one document model with layout. Your product sits on top: mapping that into the schema with proof.

**PM:** The best thing it gives you is **provenance**. Its output keeps page numbers and bounding boxes per element, which is exactly the "crop next to the value" your reviewer needs. Make sure that metadata travels all the way to the review screen. Don't flatten to markdown and lose it.

**Architect:** Two weak spots. First, **table structure**: merged cells, multi-level headers, and tables that split across pages are where any table parser misaligns a row, and a value sliding one row over is exactly the kind of error that costs money. Second, don't let Docling be your *only* reader. Pair it with an independent vision-LLM pass on the page image, and treat disagreement between them as your error detector.

```
 file ──► Docling ──► DoclingDocument (text, tables, bbox, page)
   │                        │
   │                   LLM mapper: "which cell is max_claim_amount?"
   │                        │  → points to cell ref (never retypes the value)
   │                        ▼
   └──► page image ──► vision LLM reads the same slot independently
                            │
                      agree + grounded + scale ok ──► accept
```

**CEO:** One rule worth keeping: the LLM's job is to **pick a cell ID, not output the number**. The value is copied from Docling's cell. That removes the chance of the model mistyping or inventing a value in the auto path.

**PM:** Also make sure Docling keeps nearby text like "($ in thousands)" or a footnote. Feed the mapper the table **plus its caption and surrounding text**, or the scale problem gets past you.

**Architect:** Before committing, check how Docling handles your harder formats, especially images embedded in xls and scanned pages inside PDFs. Run 20 of your worst real documents through it and count misaligned table cells. That number decides how much you lean on the second reader.

---

**The question to answer:** Do your documents mostly come from **recurring templates**, or is nearly every layout different? With Docling as the base, that decides whether the LLM mapper runs on every document or only on the unusual ones.

### 7 · **user:**

give example for the workflow

### 8 · **assistant:**

**CEO:** Here's one real-feeling document traced end to end. Watch the two places where it *should* stop.

**Setup.** The input is `acme_rate_card.pdf`. Page 1 is digital text, and page 2 is a **scanned image** of the pricing table. The schema is fixed:

```json
{ "vendor": str, "currency": "ISO-4217", "min_order_qty": int,
  "unit_price": decimal, "late_fee_pct": decimal, "effective_date": date }
```

**Step 1: Docling normalizes the file (reader A)**

```
#/texts/3   p1 bbox[72,90,300,110]   "Acme Industrial Supply"
#/texts/9   p2 bbox[60,40,280,55]    "Pricing (USD, in thousands)"   ← caption
#/tables/0  p2  (OCR)
   ┌──────────────┬─────────┐
   │ Item         │ Value   │
   ├──────────────┼─────────┤
   │ Min order    │ 500     │  cell[1,1]
   │ Unit price   │ 12.5    │  cell[2,1]
   │ Late fee     │ 1.5%    │  cell[3,1]
   │ Effective    │ 01/04/26│  cell[4,1]
   └──────────────┴─────────┘
```

**Step 2: The LLM mapper points at cells and never retypes values**

```
vendor          → #/texts/3
unit_price      → #/tables/0 cell[2,1]   scale_hint: #/texts/9 "in thousands"
min_order_qty   → #/tables/0 cell[1,1]
late_fee_pct    → #/tables/0 cell[3,1]
effective_date  → #/tables/0 cell[4,1]
currency        → #/texts/9 "USD"
```

**Step 3: A vision LLM reads the same slots from the page-2 image (reader B)**

```
unit_price 12.5 | min_order 500 | late_fee 1.5% | effective "01/04/26"
```

**Step 4: Each field goes through the gates**

| field | A | B | agree | grounded | context | verdict |
|---|---|---|---|---|---|---|
| vendor | Acme… | Acme… | ✅ | ✅ | — | **auto** |
| currency | USD | USD | ✅ | ✅ | — | **auto** |
| min_order_qty | 500 | 500 | ✅ | ✅ | units? | **auto** |
| unit_price | 12.5 | 12.5 | ✅ | ✅ | ⚠️ "in thousands" → 12,500? | **human** |
| late_fee_pct | 1.5 | 1.5 | ✅ | ✅ | per month or per year? | **human** |
| effective_date | 01/04/26 | 01/04/26 | ✅ | ✅ | ⚠️ Jan 4 or Apr 1? | **human** |

**PM:** All six values are correct as read, both readers agree, and the schema check passes. **Three still go to a human anyway.** This is the core of the product: the risk is in the *meaning*, not in reading the characters. The reviewer sees:

```
┌ unit_price ─────────────────────────────────────────┐
│ [crop of p2 table row + caption "in thousands"]     │
│ extracted: 12.5   suggested: 12,500.00 USD          │
│ [ Accept 12,500 ]  [ Keep 12.5 ]  [ Edit ]          │
│ ☐ remember: Acme rate cards are always in thousands │
└─────────────────────────────────────────────────────┘
```

**Architect:** That "remember" checkbox is how this system learns. Each decision becomes a **per-issuer rule** (scale, date locale, fee period). Next month's Acme document then auto-passes all six fields. The checks on each value stay generic, and what you learn about each issuer is where the gains come from.

**CEO:** Also note the case this example didn't show: if OCR had read `12.5` as `125`, readers A and B would disagree, and that alone sends it to a human. **Disagreement catches misreads, the context gate catches meaning errors, and human answers become issuer rules.** That's the whole engine.

---

**The question to answer:** Who resolves the human queue: one internal ops team, or each customer's own reviewers? That decides whether the issuer rules are **shared knowledge** across customers or private to each customer.

### 9 · **user:**

/golden do not add index

### 10 · **assistant:**

[ran: Bash — Check golden repo path and existing labels]
[ran: Bash — Generate golden session file without publishing]
[ran: Bash — Review generated file for cut point and redactions]

The insights are in turns 4 and 8, not 2, so I'm fixing that and publishing without `--index`. Nothing needs redacting ("Acme" is made up).

[ran: Bash — Publish golden session as merged PR without index]

I saved this session as a golden session and merged it: https://github.com/smarchone/golden-convo/pull/28. As you asked, it isn't listed in `index.json`.

- **File:** `2026-10/2026-10-20-document-to-schema-extraction-where-every-value.md`, 8 turns, stopping before `/golden`.
- **Why (my suggestion, since you didn't give one):** "The LLM should point at a cell, never type the number — and a value can be read perfectly and still be wrong in meaning, so disagreement catches misreads and context gates catch the costly errors."
- **Golden turns:** 4 (two independent readers, and the LLM never invents a value) and 8 (the worked example, where three correctly read values still go to a human).
- **Labels:** `product-idea`, `system-design`, `agents`, all already used in the repo.
- **Redactions:** none. There was nothing private in it, and "Acme" is a made-up name.

To undo it, revert PR #28.

### 11 · **user:**

do some research to get this thing up and running in no time.

do some research to get this thing up and running in no time. what are my options.

### 12 · **assistant:**

[ran: WebSearch — Docling 2026 xlsx images OCR table structure release]
[ran: WebSearch — document extraction API structured schema bounding box citations 2026 Reducto Extend LlamaExtract comparison]
[ran: WebSearch — AWS Bedrock Data Automation vs Azure Content Understanding vs Google Document AI custom extractor 2026]
[ran: WebSearch — Claude API PDF support structured outputs citations extraction 2026]

I'd assemble this yourself: Docling as reader A, a hosted extraction API or a vision LLM as reader B, and a simple review screen. That gets you running in days, and it's the only option that fully keeps the rule that the LLM points at a cell and never types the number.

## Your four options

| Option | What you get | Time to first result | Where it falls short |
|---|---|---|---|
| **1. Build it yourself:** Docling + LLM mapper + schema validation | Full control and real cell pointers. Docling handles PDF and XLSX and returns page and bounding-box locations. | Days | You build the second reader, the review screen and the evals |
| **2. Hosted extraction API:** Reducto, Extend or LlamaExtract | Send your schema, get back each value with its page, bounding box and a confidence score | Hours | Per-page cost, a vendor in your data path, and confidence scores that are disputed (below) |
| **3. Cloud provider:** Google Document AI custom extractor, Azure Document Intelligence, AWS | Compliance and data-residency story, fits a cloud you already use | Days to weeks | Some need labelled samples; AWS Textract has no custom schema |
| **4. Send files straight to an LLM:** Claude or Gemini with the PDF or image and your schema | Quickest demo | Minutes | The model retypes values and there's no cell to point at, so it breaks your core rule |

## What the research says that matters for you

- **Treat confidence scores with suspicion.** One comparison found LlamaExtract's per-field confidence was almost always 1.0. It also found Reducto invented a value on a degraded fax and marked it high confidence. That comes from a competitor using a small test set, but it's why your agreement check between two readers matters more than any vendor's confidence score.
- **Most benchmarks are written by vendors.** Extend ranks Extend first, and Reducto cites a dataset it paid for. The one useful neutral reference I found is [ExtractBench](https://arxiv.org/pdf/2607.29677), a benchmark for extraction against a fixed schema. Borrow its approach to build your own test set.
- **Docling (currently v2.95):** it handles XLSX and PDF table structure. Its roadmap lists a new table model for 2026 H1, but I couldn't confirm it shipped. I also couldn't confirm how it handles **images inside xlsx files**, so test that first.
- **I couldn't confirm details for AWS Bedrock Data Automation or Azure Content Understanding.** My searches didn't return their current documentation.

## Fastest path

```
day 1   collect 30 real docs, including the worst ones, and type the correct values by hand
day 2   Docling → JSON; for native xls, read cells directly and send embedded images to OCR
day 3   LLM mapper with structured output: slot → cell_ref (never the value)
        → Pydantic schema check, then confirm the value appears literally in the source
day 4   reader B = trial of Reducto or Extend (or a vision LLM on the page image)
        check that A and B agree, plus scale/units/date-locale checks
day 5   Streamlit review screen: source crop | value | accept/fix, with a "remember for this issuer" option
        measure how many fields pass automatically with zero errors on your 30 docs
```

Using a hosted API as **reader B** instead of your whole pipeline gets you its quality without making it your only source of truth. It also tells you quickly whether building your own reader A is worth it.

## What would change the recommendation

- **Hundreds of documents a month, mostly from repeat issuers:** stay with option 1. Templates you learn per issuer will do most of the work.
- **High volume and you need a demo this week:** start with option 2 and add Docling later as the check against it.
- **Regulated data that can't leave your cloud:** option 3, or option 1 running entirely in your own environment.

Sources:
- [Docling Technical Report](https://arxiv.org/html/2408.09869v5)
- [Docling 2.95.0 (CERN mirror)](https://simple-repository.app.cern.ch/project/docling)
- [Docling 2026 roadmap slides](https://opensource.siemens.com/events/2026/slides/Panos_Vagenas__Docling_The_Open-Source_Document_AI_Engine.pdf)
- [InfoWorld: Docling overview](https://www.infoworld.com/article/3997240/docling-an-open-source-tool-kit-for-advanced-document-processing.html)
- [Reducto vs LlamaParse](https://reducto.ai/compare/reducto-vs-llamaparse)
- [Reducto: parser comparison](https://llms.reducto.ai/document-parser-comparison)
- [Extend: extraction API accuracy rankings](https://www.extend.ai/resources/document-extraction-api-accuracy-rankings)
- [Extend: best PDF extraction APIs](https://www.extend.ai/resources/best-pdf-extraction-apis-for-production)
- [Unsiloed: which extraction API can you trust](https://www.unsiloed.ai/blog/unsiloed-ai-vs-extend-reducto-mistral-claude)
- [Unsiloed: Extend alternatives](https://www.unsiloed.ai/blog/extend-alternatives)
- [ExtractBench](https://arxiv.org/pdf/2607.29677)
- [LandingAI: 7 extraction APIs (DEV)](https://dev.to/landingai/7-document-extraction-apis-worth-building-on-in-2026-h6e)
- [Drive AI: best extraction APIs 2026](https://dev.thedrive.ai/blog/best-document-extraction-apis-2026)
- [Drive AI vs Textract vs Document AI](https://thedrive.ai/blog/drive-ai-vs-aws-textract-vs-google-document-ai)
- [Lido: extraction APIs for developers](https://www.lido.app/blog/best-document-extraction-apis-for-developers)
- [Claude PDF support docs](https://platform.claude.com/docs/en/build-with-claude/pdf-support)
- [AWS: Citations API and PDF support in Bedrock](https://aws.amazon.com/about-aws/whats-new/2025/06/citations-api-pdf-claude-models-amazon-bedrock/)

### 13 · **user:**

whats the accuracy of llamaextract/reducto etc..
for low volume it seems almost free of cost.
whats the data compliance support ?
how do they do it? do they do reader A and B both ?
how do they maintain accuracy/confidence ?

### 14 · **assistant:**

[ran: WebSearch — Reducto security SOC 2 HIPAA zero data retention on-prem VPC deployment pricing credits]
[ran: WebSearch — LlamaExtract LlamaCloud pricing credits per page SOC 2 HIPAA data retention]
[ran: WebSearch — Reducto how it works agentic OCR multi-pass vision model confidence scores architecture]
[ran: WebSearch — Extend AI extraction confidence scores review agent accuracy SOC 2 HIPAA pricing]
[ran: WebSearch — LlamaIndex "what makes an extraction confidence score useful" precision recall cutoff results LlamaExtract Reducto]
[ran: WebSearch — micro1 document extraction benchmark 225 documents results Reducto LlamaExtract Extend precision recall]

Short version: the accuracy numbers depend on who ran the benchmark, the low price comes without the compliance features, and these vendors use a second model to *correct* the first one. Your design needs a second reader that *checks independently* instead.

## 1. Accuracy: the benchmarks disagree

| Benchmark | Who ran it | Result |
|---|---|---|
| LongExtractionBench (225 docs, averaging **358 pages**) | Paid for and designed by Reducto, run by micro1 | Reducto 99.6% precision / 99.6% recall. LlamaExtract 80.0% / 77.5% with 22 failed docs |
| ExtractBench (academic) | Independent | **LlamaExtract Agentic Plus #1**, Reducto #3, Claude Code (Opus 4.8) in the top 3 |
| Extend's own test (45 docs) | Extend | 99.2% mean accuracy |

The rankings flip depending on the test, and none of them looks like your workload. They test long, dense documents, while yours are short forms and tables where a single cell can cost money. **The only accuracy number that will mean anything is one measured on your 30 hand-checked documents.**

## 2. Cost: cheap at low volume, but not on the tiers with compliance features

| Vendor | Entry tier | Compliance tier |
|---|---|---|
| Reducto | $150 free credits, then about $0.01/page (agentic mode costs 2× credits) | Zero data retention, HIPAA agreement and running in your own cloud are on Growth/Enterprise, priced by quote |
| LlamaCloud | 10k free credits/month at $1.25 per 1k credits. Extraction is roughly 25 credits/page, so about 400 free pages | SOC 2 Type II; check the HIPAA agreement on their Trust Center |
| Extend | A competitor says there's a **$300/month minimum** (not verified) | SOC 2, HIPAA, zero retention; running in your own cloud is listed |

The free or cheap tier is fine for a prototype on **sample or redacted documents**. Production financial data will probably push you onto a quoted tier.

## 3. Data compliance

- **Reducto:** SOC 2 Type II, HIPAA agreements, zero data retention, running in your own cloud or fully on-prem/air-gapped, and regional endpoints (US/EU/AU). Its own pages disagree on whether zero retention is the default or only on higher tiers (one says data is deleted within 24 hours).
- **LlamaCloud:** SOC 2 Type II and HIPAA, with US or EU regions that you can't change after setup. A third-party review says files are kept up to **48 hours** and not used for training. I couldn't confirm that in their own policy.
- **Extend:** SOC 2, HIPAA and zero retention per its own pages. Reducto says Extend has no on-prem option.

Nearly all of this comes from the vendors' own marketing. Ask for the SOC 2 report and the actual data-retention terms in writing.

## 4. How they work: are they doing reader A and reader B?

Sort of, but not the way you need.

```
Reducto:   layout CV → OCR → VLM reads regions → verifier VLM re-checks & CORRECTS → 1 value
Extend:    extract → separate "Review Agent" scores each field 1–5
LlamaExtract: agentic extract → per-field confidence score
```

Reducto is the closest. It runs OCR as reader A and a vision model as reader B, then a verifier loop, using 12+ models according to its own post. **But the second model fixes the first one's output instead of reading the page independently.** Two readers that don't see each other's answer give you a real error signal when they disagree. A corrector shares the first reader's mistakes, and once it has merged the two, the disagreement is gone. You get one confident value back.

## 5. How they score confidence, and whether you can trust it

- **LlamaIndex's own analysis:** auto-accepting fields with confidence ≥ 0.77 gave **97% precision but only 66% of fields accepted**. Even then, **3 of every 100 auto-accepted values are wrong**, which is too many when errors cost money.
- **Extend's Review Agent:** LlamaIndex, a competitor, found no cutoff that reached its precision target. Applied strictly, the score accepts *zero* fields.
- **No vendor publishes how well its confidence scores match real accuracy** (dataset, sample size, error curve), according to a third-party comparison from Sep 2026.

Treat their confidence score as a hint. Your own checks decide what gets accepted automatically.

## What this means for your design

Use a vendor as **one reader, not the final judge**:

```
Reducto/LlamaExtract (reader A, gives you bbox)
             +
Docling cell lookup (reader B, independent)
             │
   agree + grounded + scale/locale gate  → auto
   anything else                         → human
```

Next step: put the same 30 redacted documents through Reducto's free credits and LlamaCloud's free tier. On each, check what share of fields would pass automatically with **zero** errors. That picks your vendor more reliably than any of the benchmarks above.

Sources:
- [Reducto: security, compliance, deployment](https://llms.reducto.ai/security-compliance-deployment)
- [Reducto: regulated industries](https://llms.reducto.ai/idp-regulated-industries)
- [Reducto: on-prem deployment](https://llms.reducto.ai/on-prem-deployment-overview)
- [Reducto vs Extend](https://llms.reducto.ai/reducto-vs-extend)
- [Reducto vs Extend (main site)](https://reducto.ai/compare/reducto-vs-extend)
- [Reducto: hybrid architecture deep dive](https://llms.reducto.ai/hybrid-architecture-agentic-ocr-deep-dive)
- [Reducto: Agentic OCR announcement](https://x.com/reductoai/status/1919451825767645544)
- [ZenML: Reducto production parsing](https://www.zenml.io/llmops-database/production-scale-document-parsing-with-vision-language-models-and-specialized-ocr)
- [Reducto: benchmark blog](https://reducto.ai/blog/reducto-leads-benchmark-complex-document-extraction)
- [micro1 LongExtractionBench](https://www.micro1.ai/benchmark/long-extraction)
- [micro1 announcement](https://x.com/micro1_ai/status/2071991994134466872)
- [ExtractBench paper](https://arxiv.org/html/2607.29677v1)
- [ExtractBench GitHub](https://github.com/tijoseymathew/ExtractBench)
- [LlamaIndex: extraction confidence scores](https://www.llamaindex.ai/blog/what-makes-an-extraction-confidence-score-useful)
- [Velrim: Reducto vs LlamaExtract](https://velrim.com/compare/reducto-vs-llamaextract)
- [LlamaParse regions docs](https://developers.llamaindex.ai/llamaparse/general/regions/)
- [aifoxx: LlamaIndex trust review](https://aifoxx.com/trust/llamaindex)
- [Neural Base: LlamaParse compliance](https://theneuralbase.com/llamaparse/learn/advanced/compliance-soc-2-hipaa/)
- [invoiceextractor.ai: LlamaParse pricing](https://invoiceextractor.ai/llamaparse-pricing)
- [ZenML: LlamaIndex pricing](https://www.zenml.io/blog/llamaindex-pricing)
- [Extend: Review Agent docs](https://docs.extend.ai/product/extraction/review-agent)
- [Extend: accuracy rankings](https://www.extend.ai/resources/document-extraction-api-accuracy-rankings)
- [Extend: HIPAA & SOC 2](https://www.extend.ai/resources/parsing-compliance-hipaa-soc2)

### 15 · **user:**

is there a classical ml workflow ? how good it is ? may be hybrid will result in better results ?

### 16 · **assistant:**

Yes, and for your case a hybrid is the right answer. Classical ML has two things LLMs don't: **it can only copy text that's already on the page**, and **its confidence scores can be calibrated against real accuracy**. Those are exactly the two properties that matter when errors cost money.

## The classical approach

```
image/PDF ─► OCR (Tesseract/PaddleOCR) ─► tokens + boxes
                                              │
              ┌───────────────────────────────┼─────────────────────────┐
     template / zonal rules        layout-aware model             key-value linking
     "value right of 'Unit price'" (LayoutLMv3 / LiLT / Donut)    (label → value pairing)
     regex + anchors               labels each token as a field
                                              │
                                   calibrated probability per field
```

This is what older document-processing products like ABBYY and Kofax were built on: templates, then CRFs, and now layout-aware transformers.

## How good is it

| Method | When it works | Accuracy | Where it fails |
|---|---|---|---|
| **Templates / zonal rules** | Same issuer, same layout | Close to 100% on known layouts | Breaks when a layout shifts or a column moves. Needs setup per template |
| **Layout models** (LayoutLMv3 etc.) | Document types you have labelled examples of | Published results (from memory): roughly 90–92 F1 on FUNSD (noisy scanned forms) and about 97 on CORD (receipts) | Needs a few hundred labelled docs per document type, and accuracy drops on unseen layouts |
| **LLM / vision LLM** | Any layout, zero examples | High but uneven, with no guaranteed ceiling | Invents values, mistypes digits, confidence scores don't match real accuracy |

The trade-off is that classical ML is **narrow but trustworthy** and LLMs are **broad but unreliable on details**. Your problem needs both.

## Why classical ML suits your constraints

1. **It can't invent a value.** A token-classification model can only label text the OCR actually found, so it can't output a number that isn't on the page. That builds in your "point at a cell" rule.
2. **Calibration.** A classical classifier's probabilities can be adjusted (temperature scaling, isotonic regression) until "0.98" really means about 98% correct. You can then use **conformal risk control** to *guarantee* the error rate among auto-accepted fields stays below a target. Nothing an LLM self-reports gives you a guarantee like that.
3. **Independent errors.** An OCR-plus-layout model fails in different ways than a vision LLM. That makes disagreement between the two a strong error signal, which is what the reader-A/reader-B design depends on. The hosted vendors' self-correction loop can't give you that.
4. **Cost and data.** It's cheap, runs on CPU or a small GPU, and the data never leaves your machines.

## The hybrid design

```
           ┌──────────────── each document ────────────────┐
tier 0     native parse: xlsx cells, PDF text layer         deterministic, exact
tier 1     known issuer? → template learned from reviews    ~100%, near-zero cost
tier 2     layout model (fine-tuned on YOUR reviewed docs)  reader A: copies text only, calibrated
tier 3     vision LLM                                       reader B, plus context work:
                                                            scale, locale, fee period
           └──────────────────────┬────────────────────────┘
                     gate: A==B, value found in source, context rules,
                           calibrated score ≥ conformal threshold
                       auto ◄─┴─► human review
                                     │
            corrections → (1) new/updated issuer templates
                          (2) training labels for the layout model
                          (3) context rules ("Acme = in thousands")
```

**Over time the LLM handles less.** On day 1 it's doing most of the work. By month 3, recurring issuers are covered by templates and the layout model, and the LLM mostly handles brand-new layouts and context checks. Every human review produces training data, so cost drops and the share of auto-accepted fields grows.

## Things to watch

- **Licences:** LayoutLMv3's weights are, as far as I know, **non-commercial (CC BY-NC-SA)**. Look at LiLT or Donut, or train your own model, if this goes commercial.
- **Cold start:** the layout model needs a few hundred reviewed documents, so start with templates plus LLMs and add it once reviews have built up a labelled set.
- **Don't train on the LLM's own output.** Only use labels a human confirmed, otherwise the layout model learns the LLM's mistakes and the two readers stop being independent.

**Next step:** use the LLM-plus-Docling setup for the first 2–4 weeks and store every human decision as a labelled example. Those labels are what you'll need to train the layout model later.
