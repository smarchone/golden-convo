---
schema: 1
id: 2026-10-30-extracting-insurance-commission-and-override-rul
title: "Extracting insurance commission and override rules from PDFs/images/XLS: six approaches, failure modes, and the simplest build with costs"
why: The simplest commission-rule extractor is one Claude call per doc with a strict schema plus code validators — the model is ~$0.30/doc, human review is the real cost.
why_source: suggested
harness: claude-code
harness_version: 2.1.312
model: claude-opus-5-5
session_id: 83639b81-f11a-422d-a122-445b878cb679
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/83639b81-f11a-422d-a122-445b878cb679.jsonl
started: "2026-10-28T12:59:24.864Z"
captured: "2026-10-30T07:09:07Z"
cwd: ~/Documents/proj/claude/spark/ideas
turns: 6
complete: true
golden_turns: [2, 6]
labels: [system-design, build-vs-buy, document-extraction]
status: raw
---

### 1 · **user:**

i want to use commission rules from insurance pdf documents. give me everything about how to extract them. do a research on this. find possible solutions that people follow. give me a technical summary of each solution. consider cost, accuracy and completeness.

### 2 · **assistant:**

[ran: WebSearch — extract commission schedules from insurance carrier PDF contracts LLM]
[ran: WebSearch — insurance commission statement PDF parsing automation agency software AI]
[ran: WebSearch — PDF table extraction benchmark 2026 Docling Reducto LlamaParse Textract accuracy]
[ran: WebSearch — LLM extract business rules from contracts structured output rules engine DSL]
[ran: WebSearch — incentive compensation management insurance carrier compensation schedule ingestion AI Varicent CaptivateIQ Sapiens]
[ran: WebSearch — Gemini Claude native PDF vision structured extraction tables accuracy vs OCR pipeline 2026]

# Extracting commission rules from insurance PDFs

## How hard is this?

Extracting a commission table is easy. Extracting the commission *rules* is much harder. A carrier compensation agreement usually contains:

- **Rate grids** by product, plan, issue age band, premium band, policy year (first year vs renewal 2–10), and state.
- **Conditions buried in prose and footnotes.** For example: "excess premium paid at 3%", "not applicable in NY", "reduced 50% for issue ages 76+".
- **Hierarchy and overrides.** Agent, GA, MGA and IMO levels, with street level vs contract level and override spreads.
- **Lifecycle terms**: chargeback or clawback windows, vesting, persistency bonuses, advance vs as-earned.
- **Amendments** that supersede rows from a given effective date, sometimes retroactively. Nomad Data's material notes that quarterly addenda break spreadsheet workflows for exactly this reason ([Nomad Data](https://www.nomad-data.com/doc-chat/automating-commission-table-extraction-for-producer-compensation-analytics-property-homeowners-and-auto-36875)).

That leaves three separate problems, and each one fails in its own way:

1. **Parsing**: getting the PDF into text and tables. This fails on merged cells, multi-level headers, scans and rotated pages.
2. **Structuring**: turning that into typed rules. This fails by mixing up dimensions and by missing conditions in footnotes.
3. **Completeness**: proving nothing was missed. This is the hardest, and most tools ignore it.

Also, don't confuse contracts with commission statements. Statements record what was paid. Contracts set the rules. Most vendor "commission AI" handles statements ([Sensible](https://sensible.so/blog/how-to-extract-data-from-commission-statements-with-sensible), [Photon Commerce](https://www.photoncommerce.com/insurance), [pyq](https://www.g2.com/sellers/pyq)). Statements do become very useful later, as validation data (see solution 6).

---

## Six approaches people use

### 1. Manual or outsourced keying into a compensation rules engine
**How it works:** Analysts read each contract and configure rules directly in a compensation management system (EvolveICM, Herald Logic, SAP and others). These engines natively model percentage-of-premium, flat-fee and tiered structures ([EvolveICM](https://evolvenxt.com/evolve-icm/), [Herald Logic](https://insuremo.com/en/partner/herald-logic)).

- **Cost:** High, and it grows linearly with documents. Some carriers have tens of thousands of distinct schedules ([PwC](https://www.pwc.com/en_US/us/financial-services/publications/viewpoints/assets/pwc-simplifying-life-insurer-incentive-compensation.pdf)).
- **Accuracy:** Good with double-keying and a maker-checker review. Typing errors are the main risk.
- **Completeness:** The best of the six, because a human reads the footnotes.
- **Takeaway:** This is the baseline to beat. The rules engine is still worth keeping as the target system, whatever approach feeds it.

### 2. Template or zonal OCR (custom models per carrier)
**How it works:** AWS Textract or Azure Document Intelligence custom models, or Sensible-style per-carrier configs with fixed anchors and column positions. Sensible's pattern is deterministic configs for known carriers plus an LLM fallback for the long tail ([Sensible](https://sensible.so/blog/how-to-extract-data-from-commission-statements-with-sensible)).

- **Cost:** Cheap per page (about a cent or less), but each template costs engineering time and breaks when a carrier changes layout.
- **Accuracy:** Very high on the exact layout it was built for, and collapses on anything else.
- **Completeness:** Poor for contracts. It extracts only what you anchored, so prose conditions are invisible to it.
- **Takeaway:** Good for high-volume, stable documents (statements). Wrong for contracts, which vary per carrier, product and version.

### 3. Layout parser, then an LLM with a schema
**How it works:**
1. Run a layout-aware parser such as Docling (open source), Reducto, LlamaParse, Azure DI or Textract. You get Markdown or HTML with table structure kept intact, plus page and bounding-box coordinates.
2. Chunk by section or table.
3. Have an LLM fill a strict JSON schema for the rules (structured outputs or tool use).

The parser choice matters most for tables:
- Reducto's own 1,000-table benchmark: Reducto 90.2%, Azure 82.7%, Textract 80.9%, Google 64.6% ([Reducto](https://reducto.ai/blog/evaluating-llamaparse-for-pdf-parsing)). It is self-run, but the merged-cell and hierarchical-header cases it targets match rate grids.
- An open benchmark puts pdfplumber at 93.4% and Docling at 84.5% on table structure (TEDS) for digital PDFs ([GitHub](https://github.com/applied-artificial-intelligence/pdf-parser-benchmark)).
- Docling is strong on clean digital files and weak on scans ([Moda](https://moda.app/blog/docling-alternatives)).
- Extend's field-level benchmark: LlamaParse and Reducto in agentic modes about 91–92%, Textract 70.5% ([Extend](https://www.extend.ai/resources/pdf-parsing-api-comparison-ai-agents)).

Scores:
- **Cost:** Moderate. Docling is free plus compute. Hosted parsers cost about 1–5 cents per page. The LLM pass adds a few cents per page.
- **Accuracy:** High on tables. The weak point is linking a footnote to the cells it changes, because chunking separates them.
- **Completeness:** Medium, and it only gets better if you engineer for it (see below).
- **Takeaway:** This is the workhorse most teams use. You keep control, can audit each stage, and can swap parsers.

### 4. A multimodal LLM reading PDF pages directly
**How it works:** Send page images or the native PDF to Claude or Gemini with the schema and get rules back. There is no separate parser.

- **Cost:** About 1.5–3k input tokens per page as an image, so roughly a few cents per page on a frontier model. One source says traditional OCR is 10–100× cheaper per page ([Parsli](https://parsli.co/blog/llm-ocr-vs-traditional-ocr)). Check current model pricing before budgeting.
- **Accuracy:** Competitive on tables. An older Reducto test had Gemini 2.0 Flash at 0.84, Claude Sonnet at 0.81 and Textract at 0.80 ([Gigazine](https://www.gigazine.net/gsc_news/en/20250210-ingesting-pdf-gemini-2-0)). Its big advantage: the model sees the footnote marker and the footnote on the same page, so it links conditions better than chunked pipelines.
- **Main risk:** Confident wrong output with no warning ([YMeadows on Gemini's hidden OCR](https://ymeadows.com/en/insights/blog/understanding-geminis-hidden-ocr/)). Results also vary a lot by document ([HN thread](https://hn.nuxt.dev/item/48662999)). Bounding-box citations are weak ([Artifex](https://artifex.com/blog/pdf-native-vs-vision-models-gemini-3)), and that hurts auditability.
- **Completeness:** Good per page. Across the whole document it is unreliable, because long contracts get "lazy" outputs that drop rows.
- **Takeaway:** The fastest way to a prototype, and a strong second opinion. Don't use it alone without validation.

### 5. Vertical insurance SaaS
**Vendors:** Nomad Data Doc Chat (contracts and override schedules, with page-level citations) ([Nomad](https://www.nomad-data.com/doc-chat/automating-commission-table-extraction-for-producer-compensation-analytics-property-homeowners-and-auto-36875)), Photon Commerce (claims 99.5%+ on statements) ([Photon](https://www.photoncommerce.com/insurance)), Cassidy ([Cassidy](https://www.cassidyai.com/solutions/ai-agent-commission-calculation-agent)), Unstract ([Unstract](https://unstract.com/insurance-automation/commission-payout/)) and LlamaIndex's insurance offering ([LlamaIndex](https://llamaindex.ai/services/insurance-document-automation)).

- **Cost:** Enterprise contracts, usually unpublished.
- **Accuracy and completeness:** Unverified. None publish benchmarks on contract-to-rule extraction, and most are built for statements.
- **Takeaway:** Buy if speed matters more than control. Run a bake-off on 20–30 of your own contracts with a hand-labelled answer key.

### 6. Compile the rules to code, then back-test them (the accuracy multiplier)
**How it works:** Don't stop at extracting JSON. Compile it into an executable form: a DSL, decision tables, or rules-engine config. Then **replay historical commission statements through those rules** and diff your computed commission against what was actually paid. Every mismatch points to a wrong or missing rule.

- Research supports the compile step. The BREX/ExIde work splits documents into atomic condition→action rules and finds that an intermediate pseudo-code step works best for nested logic ([arXiv 2505.18542](https://arxiv.org/html/2505.18542v3)). Separate work tests LLMs generating a formal legal DSL (Symboleo) from contracts ([arXiv 2411.15898](https://arxiv.org/html/2411.15898v1)).
- There is a warning in the research too. One study found LLMs fill fixed templates at about 98% accuracy but extract obligations at only about 71% ([RUG thesis](https://fse.studenttheses.ub.rug.nl/34210/1/mAI2024CornelisG.pdf)). Conditional rules behave like obligations, not form fields. So expect the prose-to-rule step to be where errors pile up, and check it with execution rather than more prompting.

Scores:
- **Cost:** Engineering time up front. The marginal cost per document is low.
- **Accuracy:** This is the only approach with its own ground truth. You measure accuracy rather than estimate it.
- **Completeness:** It catches missing rules that a reviewer would never notice, such as "policies in state X pay 2% less than our rules predict."
- **Takeaway:** This is the step most teams miss. It turns "the LLM seems right" into a measured, regression-tested system.

---

## Recommended architecture (combining 3, 4 and 6)

```
PDF ─► classify (contract / schedule / amendment / statement), detect scan vs digital
    ─► Parse A: layout parser (Docling or Reducto) → tables + text + bboxes
    ─► Parse B: multimodal LLM over page images
    ─► Structuring LLM → strict schema, every rule cites page + bbox + verbatim source span
    ─► Reconcile A vs B (cell-level diff) → disagreements go to human review
    ─► Deterministic validators
    ─► Effective-date resolution (amendments supersede by key + date)
    ─► Compile to rules engine / DSL
    ─► Back-test against historical statements → mismatches go to review
```

**Rule schema essentials.** Each rule should carry:
- `carrier`, `product/plan`, `jurisdiction[]`, `issue_age_range`, `premium_band`, `policy_year_range`
- `hierarchy_level`, `basis` (target / excess / flat / % of premium), `rate`
- `conditions[]`, `exceptions[]`, `effective_from/to`, `supersedes`
- `source{doc, page, bbox, quote}`, `confidence`

Make ranges first-class types rather than strings. That is what makes the validators possible.

**How to get completeness, which is the part people skip:**
- **Coverage ledger:** every table and paragraph must be either mapped to at least one rule or explicitly marked as not a rule. Anything unmapped gets flagged. That turns "did we miss something?" into a check you can query.
- **Structural invariants:** age and premium bands must be contiguous with no gaps or overlaps. Every product × year cell in a grid must be filled. Override spreads must be ≥ 0 up the hierarchy. Rates must fall within plausible bounds.
- **Footnote resolution:** detect markers (*, †, ¹, "see note") and require each one to bind to an exception rule.
- **Two independent extractions** (parser path vs vision path), then diff them. Agreement is a cheap confidence signal, and disagreement is where humans should look.
- **Chunk per table, never per document.** Long outputs drop rows silently, so emit one call per table and check the row count against what the parser detected.

**Rough cost per 100-page contract** (order-of-magnitude estimates, not quotes):

| Stage | Approx. cost |
|---|---|
| Parser | $0 (Docling) to $5 (hosted) |
| Two LLM passes | ~$2–10, depending on model tier |
| Human review of flagged items only | Usually most of the total, but limited to disagreements and back-test misses rather than full re-keying |

## Bottom line
- **Prototype:** solution 4, a multimodal LLM with a strict schema. You'll have results in days.
- **Production:** solution 3 as the main path, solution 4 as the cross-check, and solution 6 as the accuracy gate.
- **Buy instead (solution 5):** only if a vendor beats that pipeline on your own labelled contracts.
- **Avoid template OCR (solution 2)** for contracts.

One caution: none of these approaches has independent, published accuracy numbers for extracting commission rules from contracts. Every benchmark above is either general-purpose or run by a vendor. Your own labelled set plus statement back-testing is the only accuracy number you can trust.

Sources:
- [Nomad Data – commission table extraction](https://www.nomad-data.com/doc-chat/automating-commission-table-extraction-for-producer-compensation-analytics-property-homeowners-and-auto-36875)
- [Sensible – commission statements](https://sensible.so/blog/how-to-extract-data-from-commission-statements-with-sensible)
- [Photon Commerce](https://www.photoncommerce.com/insurance)
- [pyq (G2)](https://www.g2.com/sellers/pyq)
- [Cassidy](https://www.cassidyai.com/solutions/ai-agent-commission-calculation-agent)
- [Unstract](https://unstract.com/insurance-automation/commission-payout/)
- [LlamaIndex insurance](https://llamaindex.ai/services/insurance-document-automation)
- [Reducto – LlamaParse evaluation / RD-TableBench](https://reducto.ai/blog/evaluating-llamaparse-for-pdf-parsing)
- [PDF parser benchmark (GitHub)](https://github.com/applied-artificial-intelligence/pdf-parser-benchmark)
- [Extend – parsing API comparison](https://www.extend.ai/resources/pdf-parsing-api-comparison-ai-agents)
- [Moda – Docling alternatives](https://moda.app/blog/docling-alternatives)
- [Artifex – PDF-native vs vision](https://artifex.com/blog/pdf-native-vs-vision-models-gemini-3)
- [YMeadows – Gemini hidden OCR](https://ymeadows.com/en/insights/blog/understanding-geminis-hidden-ocr/)
- [Parsli – LLM OCR vs traditional](https://parsli.co/blog/llm-ocr-vs-traditional-ocr)
- [Gigazine – Gemini 2.0 PDF ingestion](https://www.gigazine.net/gsc_news/en/20250210-ingesting-pdf-gemini-2-0)
- [HN discussion](https://hn.nuxt.dev/item/48662999)
- [BREX/ExIde – arXiv 2505.18542](https://arxiv.org/html/2505.18542v3)
- [Symboleo DSL generation – arXiv 2411.15898](https://arxiv.org/html/2411.15898v1)
- [RUG thesis – obligation extraction](https://fse.studenttheses.ub.rug.nl/34210/1/mAI2024CornelisG.pdf)
- [EvolveICM](https://evolvenxt.com/evolve-icm/)
- [Herald Logic](https://insuremo.com/en/partner/herald-logic)
- [PwC – life insurer incentive comp](https://www.pwc.com/en_US/us/financial-services/publications/viewpoints/assets/pwc-simplifying-life-insurer-incentive-compensation.pdf)

### 3 · **user:**

what are  merged cells, multi-level headers, scans and rotated pages.

### 4 · **assistant:**

These four things break PDF table extraction, and commission schedules contain all of them. Underneath, a PDF has no concept of a table: it only stores "draw this text at these coordinates" and "draw a line here." A parser has to rebuild rows and columns from that geometry, and each of these cases breaks the rebuild in a different way.

## 1. Merged cells
A merged cell is one cell that spans several rows or columns, so its value applies to all of them.

```
┌──────────────┬──────────┬────────┐
│ Product      │ Issue Age│ Year 1 │
├──────────────┼──────────┼────────┤
│              │ 0–65     │ 90%    │
│ Term Life 20 ├──────────┼────────┤
│              │ 66–75    │ 70%    │
├──────────────┼──────────┼────────┤
│ Whole Life   │ All      │ 55%    │
└──────────────┴──────────┴────────┘
```

"Term Life 20" is printed once, centered vertically, but it belongs to two rows.

**Why parsers fail:** the text sits at one y-coordinate, so the parser places it in one row. The other row gets an empty product:

```
Term Life 20 | 0–65  | 90%     ← or the label lands in the 66–75 row instead
             | 66–75 | 70%     ← product = "" → the rule is orphaned
```

**What goes wrong:** you end up with a rule saying "70% for issue ages 66–75" that is attached to no product, or to the wrong one. The fix is to fill merged values down (or across) into every cell they span. Good parsers return row and column spans so you can do that.

## 2. Multi-level headers
The column headers are stacked, and the meaning of a column is the combination of all the header levels above it.

```
┌─────────┬───────────────────────┬───────────────────────┐
│         │      Target Premium   │     Excess Premium    │
│ Product ├───────┬───────┬───────┼───────┬───────┬───────┤
│         │ Yr 1  │ Yr 2–5│ Yr 6+ │ Yr 1  │ Yr 2–5│ Yr 6+ │
├─────────┼───────┼───────┼───────┼───────┼───────┼───────┤
│ IUL Max │ 100%  │ 5%    │ 2%    │ 4%    │ 2%    │ 1%    │
└─────────┴───────┴───────┴───────┴───────┴───────┴───────┘
```

The "4%" means *Excess Premium × Year 1*. Note that the top-level headers are also merged cells, so the two problems usually appear together.

**Why parsers fail:** many parsers flatten the header to a single row, which gives you `Yr 1, Yr 2–5, Yr 6+, Yr 1, Yr 2–5, Yr 6+`. Now there are two columns named "Yr 1" and nothing records which one is target and which is excess. Commission grids typically nest three dimensions in the headers, such as premium basis × policy year × hierarchy level (agent / GA / MGA).

**What goes wrong:** the parser swaps target and excess rates, a 100% vs 4% difference that the reader of the data can't detect. The fix is to build the full header path for each column (`Target Premium > Yr 1`) before handing anything to the LLM.

## 3. Scans
A scanned PDF is a photo of paper. It contains no text layer, only pixels.

You can test this quickly: if you can't select or copy text in the viewer, it's a scan. With `pdffonts file.pdf`, a scan lists no fonts. Commission contracts are often scans because they are signed paper agreements, faxed amendments, or old schedules pulled from a filing cabinet.

**Why parsers fail:**
- **Characters must be recognized by OCR before anything else happens.** Typical OCR misreads that matter here: `5%` read as `S%`, `1.5%` read as `15%` when the decimal point is faint, `0` vs `O`, `1` vs `l`.
- **Table lines are faint, broken or missing**, so the parser has to infer the grid from whitespace.
- **Skew, stamps, signatures and handwritten notes** ("rate changed to 80% eff. 3/1") overlap the content.

**What goes wrong:**
- The errors are silent: `1.5%` becoming `15%` is still a perfectly plausible-looking number.
- Handwritten amendments often carry the most important information and are the hardest to read.

This is where the "Docling is great on digital, weak on scans" result came from. Use a stronger OCR or vision model on scans, and add plausibility checks on the values.

## 4. Rotated pages
A rotated page is printed sideways. Wide commission grids (12 policy-year columns × 3 hierarchy levels) don't fit portrait, so they get laid out in landscape.

The PDF can encode this in two ways:
- **A page `/Rotate` flag.** This is easy, because the viewer and most parsers simply undo it.
- **Text drawn sideways on a portrait page**, or a scan taken sideways. This is the hard case.

**Why parsers fail:** if the rotation isn't detected, the parser reads the page in the wrong reading order:
- Columns are read as rows.
- Header words come out one character per line ("T a r g e t").
- The whole table can be treated as a figure and skipped entirely.

**What goes wrong:** the parser drops the whole rate grid. That's the worst outcome for completeness, because nothing errors and the table is simply absent from the output. A mixed document makes this more likely, for example a portrait contract with one landscape schedule in the middle. The fix is to detect each page's orientation and normalize it before parsing.

---

## How this ties back to the pipeline
All four cause **silent** errors. The output looks well-formed, but the rule behind it is wrong or missing. That's why the validators in the earlier architecture matter:

| Problem | Caught by |
|---|---|
| Merged cells | Required-field check (no rule without a product) and filling values down |
| Multi-level headers | Schema forces `basis` + `policy_year`, and a plausibility check (an excess rate of 100% is a red flag) |
| Scans | Range and plausibility checks, comparing the parser output with a vision-model pass, and statement back-testing |
| Rotated pages | Coverage ledger (a page with no extracted tables or rules gets flagged) and per-page orientation detection |

The vision-LLM path (solution 4) handles merged cells, nested headers and rotation better than classic parsers because it sees the page as a layout. It is still prone to OCR-style misreads on poor scans, which is why the pipeline runs both paths and compares them.

### 5 · **user:**

im wrking on contract a dn overriding schedules for insurance commission rules pdfs/images/xls.
whats the simplest thing that i can build that works and how much ot would cost cost.

### 6 · **assistant:**

[ran: Skill — claude-api]

# The simplest version that works, and what it costs

**In short:** convert each file into something Claude can read, make one Claude call per document that fills a strict JSON schema, run a few checks in code, and have a person review the result next to the source page. You don't need a parsing vendor, OCR service, rules engine or agent framework for version 1.

## The pipeline

```
upload (PDF / image / XLS)
  ├─ PDF   → send the PDF directly to Claude (it reads both the text and the page image)
  ├─ image → send as an image (convert TIFF or fax files to PDF first)
  └─ XLS   → read with pandas/openpyxl → CSV or Markdown text → Claude
        ▼
Claude Opus 5.5 + structured output (your rule schema)
        ▼
checks in code (about 100 lines)
        ▼
review screen: PDF page on the left, extracted rows on the right, approve or edit
        ▼
Postgres table of rules (with source page and verbatim quote)
```

Some notes on each step:

- **Don't send XLS files to the model as images.** The cells are already structured, so extract them as text. Forward-fill merged cells and join stacked headers into one path (for example `Target > Yr 1`) before passing them on. Spreadsheets are your cheapest and most accurate input.
- **Native PDF input deals with most of the parsing problems from before.** Claude sees the table and its footnotes on the same page. Rotated pages and decent scans are usually fine. Bad faxes will still produce misreads, and the checks and the reviewer catch those.
- **One call per document, or one per schedule section if the document is long.** If a contract is 100+ pages, first find the pages that contain schedules or tables and extract only those. That keeps the output from dropping rows.
- **Citations can't be combined with structured outputs in the API (that returns an error).** Put the source in your schema instead: `source_page` and `source_quote` on every rule. The reviewer then jumps straight to it.

## The schema (covers contracts and override schedules)

```json
{
  "document": { "carrier", "doc_type": "contract|schedule|amendment",
                "effective_from", "effective_to", "supersedes_doc" },
  "rules": [{
    "product", "plan_code", "states_included": [], "states_excluded": [],
    "issue_age_min", "issue_age_max",
    "premium_band_min", "premium_band_max",
    "policy_year_from", "policy_year_to",
    "basis": "target|excess|flat|percent_of_premium",
    "hierarchy_level": "agent|GA|MGA|IMO|...",
    "rate_type": "commission|override",
    "rate",
    "override_calc": "fixed|spread_to_downline|null",
    "conditions": [], "footnote_refs": [],
    "source_page", "source_quote", "confidence"
  }],
  "unmapped_content": [{ "page", "text", "reason" }]
}
```

`unmapped_content` makes the model say explicitly what it decided was not a rule. It's the cheap version of a coverage ledger.

Override schedules mostly differ in two fields: `hierarchy_level` and `override_calc`. Overrides are often written as an upline contract level minus a downline level, so store both levels and compute the spread. Don't trust a spread the model calculated itself.

## Checks that catch most errors (about 100 lines of code)

1. **Required fields:** every rule has a product, basis, rate and source page. This catches merged-cell problems.
2. **Ranges:** age, premium and policy-year bands have no gaps and no overlaps for each product, basis and level.
3. **Plausible rates:** typically 0–150% for first year and under 20% for renewal. Tune these to your products. This catches OCR misreads like 1.5% turning into 15%.
4. **Footnotes:** every `*`, `†` or `¹` marker in the source is attached to at least one rule.
5. **Override consistency:** upline level ≥ downline level for the same product and year.
6. **Row counts:** for XLS files, extracted rows match the number of sheet rows (exact). For PDFs, a page with a table but zero extracted rules gets flagged.

Anything that fails a check is highlighted in the review screen. Everything else gets a quick visual check.

## Cost

Rates as of now:
- **Opus 5.5:** $4 per million input tokens, $20 per million output tokens.
- **Sonnet 5.5:** $2 / $10.
- **Haiku 5.5:** $0.10 / $0.50.
- **Batch API** takes 50% off if results can wait (they usually come back within hours).

A PDF page costs roughly 1.5–3k input tokens.

| A typical 20-page contract with schedules | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
|---|---|---|---|
| Input: about 50k tokens | $0.20 | $0.10 | $0.005 |
| Output: about 5–8k tokens of rules JSON | $0.10–0.16 | $0.05–0.08 | under $0.01 |
| **Per document** | **about $0.30–0.40** | **about $0.15–0.20** | **about $0.01** |
| Per document with Batch | about $0.15–0.20 | about $0.08–0.10 | under $0.01 |

Total cost of running it (rough estimates):

| | 500 docs/yr | 5,000 docs/yr |
|---|---|---|
| Opus 5.5 API | about $200 | about $2,000 |
| Hosting (small VM or serverless, Postgres, file storage) | about $20–50/mo | about $50–150/mo |
| **Human review** (about 10–20 min/doc, versus 1–3 hrs of manual keying) | **about 80–170 hrs** | **about 800–1,700 hrs** |
| One-time build (one engineer) | about 1–2 weeks | same |

**Review time is where the money goes, not the model.** Use Opus 5.5. Saving $0.20 per document with a cheaper model isn't worth it if it adds even a minute of review. Try Haiku only for XLS input, where the structure is already there, and only after you've measured it on your own documents.

## What to leave out of version 1, and when to add it

| Leave out for now | Add it when |
|---|---|
| Layout parser or OCR vendor | Scans regularly fail your checks |
| Two independent extraction passes compared against each other | Review shows mistakes slipping through the checks |
| Back-testing rules against past commission statements | You have statement data. This gives the biggest accuracy gain of anything here. |
| Rules engine or DSL | You're calculating commissions from the rules, not just storing them |
| Amendment handling with effective dates | From day one if amendments are common. Otherwise, keep `supersedes_doc` and resolve them by hand. |

## Before you build: measure it
Hand-label 20 real documents: about 10 contracts and 10 override schedules, including 3–4 scans and 2–3 XLS files. Run the pipeline on them and score field-level accuracy. That takes about a day, costs under $10 in API calls, and tells you whether version 1 is good enough or which item from the table above to add first.

If you tell me your stack (Python or TypeScript), I can write the extraction call, schema and checks as a working script.
