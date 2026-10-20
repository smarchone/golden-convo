---
schema: 1
id: 2026-10-20-document-to-schema-extraction-where-every-value
title: "Document-to-schema extraction where every value is provable: dual readers, cell pointers, context gates"
why: The LLM should point at a cell, never type the number — and a value can be read perfectly and still be wrong in meaning, so disagreement catches misreads and context gates catch the costly errors.
why_source: suggested
harness: claude-code
harness_version: 2.1.304
model: claude-opus-5-5
session_id: 7994825b-1e13-48ca-a1ef-08741e3d7af7
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/7994825b-1e13-48ca-a1ef-08741e3d7af7.jsonl
started: "2026-10-20T09:30:17.293Z"
captured: "2026-10-20T10:59:23Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:productivity:intuition-panel"
turns: 8
complete: true
golden_turns: [4, 8]
labels: [product-idea, system-design, agents]
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
