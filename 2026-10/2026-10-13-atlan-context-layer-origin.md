---
schema: 1
id: 2026-10-13-atlan-context-layer-origin
title: "Atlan's context layer: from data catalog to context for AI agents"
why: How Atlan went from a data catalog to selling the context layer for agents.
why_source: suggested
harness: claude-code
harness_version: 2.1.289
model: claude-opus-5-5
session_id: 70677c58-694c-4fd9-af3f-8cfcc7498cdd
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/70677c58-694c-4fd9-af3f-8cfcc7498cdd.jsonl
started: "2026-10-04T20:27:57.736Z"
captured: "2026-10-13T05:29:59Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:origin-story"
turns: 2
complete: true
golden_turns: [2]
labels: [context-infra, knowledge-mgmt, origin-story]
thread: context-layer
status: raw
---

### 1 · **user:**

/origin-story atlan context layer

### 2 · **assistant:**

I'll research Atlan's context layer (sources, dates, quotes) and then write the origin story.

[ran: WebSearch — Atlan "context layer" AI agents launch]
[ran: WebSearch — Prukalpa Sankar Varun Banka Atlan origin SocialCops data team]
[ran: WebFetch — https://atlan.com/context-layer/]
[ran: WebSearch — Atlan Activate 2025 "context" metadata lakehouse MCP server announcement Prukalpa]
[ran: WebSearch — Atlan Series C $105 million 2024 GIC valuation active metadata]
[ran: WebFetch — https://atlan.com/know/context-layer-stopped-being-theoretical-activate-2026/]
[ran: WebSearch — Prukalpa Sankar "context layer" OR "context is the new" AI agents interview quote 2026]
[ran: WebSearch — Prukalpa Sankar "Data Catalog 3.0" active metadata 2021 essay]
[ran: WebFetch — https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist]
[ran: WebFetch — https://atlan.com/know/gdd-who-will-own-ai-context/]
[ran: WebSearch — Atlan SocialCops "failed three times" data catalog internal tool Prukalpa quote]
[ran: WebSearch — Atlan rebrand "context layer for AI" homepage shift from "active metadata" when announced]
[ran: WebFetch — https://atlan.com/know/activate-2025-recap/]

Research is done (Atlan's own pages, the founders' essays, press coverage of the funding round, the Great Data Debate). Here's the origin story.

# Atlan Context Layer — origin story
Software that gathers a company's knowledge about its data (meaning, lineage, metrics, access rules) and serves it to AI agents · launched as metadata infrastructure in Aug 2025, renamed the "context layer" by 2026 · Atlan (Prukalpa Sankar, Varun Banka)

## TL;DR
- **Pitch:** "Wouldn't it be interesting if the metadata we built so humans could find data turned out to be what AI agents need in order to answer correctly?"
- **Aha:** Every company has access to the same models. What differs is each company's own context. So the durable asset isn't the agent. It's the governed, versioned, portable context behind it. In Sankar's words: *"The framework was becoming disposable. The context on the other hand, was not."* ([Context & Chaos, Jul 2026](https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist))

## Before → After
| Before (how the world coped) | After (what it made possible) |
|---|---|
| Each agent or copilot had business definitions copied into its prompt or a RAG index | One certified store of context that every agent reads at runtime over MCP, an API or SQL |
| Writing documentation by hand took 9–12 months per estate | Context Agents write drafts and humans certify them. Atlan claims this takes about 30 days ([Activate 2026](https://atlan.com/know/context-layer-stopped-being-theoretical-activate-2026/)) |
| Metadata stayed locked inside the catalog UI, which only people could browse | The metadata sits in Iceberg tables that Snowflake and Databricks can query, and agents read it too |
| Sales, customer-success and BI agents each held their own context. Sankar: *"I have agent sprawl. I have context sprawl."* ([GDD 2026](https://atlan.com/know/gdd-who-will-own-ai-context/)) | "Any team, any tool, same answer" (Elastic's governance lead, at Activate 2026) |
| Access policies were applied when people queried data | The same policies are applied per user when an agent reads context |

## The Catalyst Problem
- **The first wall (around 2014–2019, at SocialCops):** Sankar and Banka's earlier company did data work for the Government of India, UNICEF and the UN, in 50+ countries. The team kept losing time to messy backend data ([NTU](https://www.ntu.edu.sg/alumni/alumni-stories-news/detail/prukalpa-sankar-atlan-ntu)).
- Sankar on that period: *"We failed three times over implementing a data catalog and ourselves as a team and like the fourth time around we built Atlan."* ([DataCamp, Jun 2024](https://www.datacamp.com/podcast/building-trust-through-data-with-prukalpa-sankar-co-founder-of-atlan))
- **The second wall (2024–25):** companies moved from GenAI pilots to production and the pilots stalled. Atlan's pitch leans on two outside numbers: MIT's figure that 95% of GenAI pilots fail, and Gartner's that 60% of AI projects get abandoned ([Atlan](https://atlan.com/context-layer/)).
- A CIO quoted in Atlan's Activate 2025 recap put it this way: *"The models turned out to be easy. The data and context are what's breaking us."* ([recap](https://atlan.com/know/activate-2025-recap/))
- Atlan already had what that problem called for: a graph of glossary terms, lineage, owners and certifications. But only humans could use it, through a UI. The fix was to make that graph readable by machines and give it a new name.

## Lineage
- **Borrowed from:**
  - Data catalogs, including Atlan's own "active metadata" idea: metadata flowing both ways between the catalog and the other data tools.
  - Semantic layers and metrics stores.
  - Knowledge graphs and ontologies.
  - Git, for review and versioning ("Context Repos").
  - Lakehouse architecture: storing data in open Iceberg tables.
- **Tried before:**
  - Catalogs of the 2010s became documentation graveyards. Writing context by hand cost a lot and nobody was required to use it. **Lesson:** context has to be generated and actually consumed, not just stored.
  - Semantic layers in BI tools only covered metrics, and each was tied to one tool. **Lesson:** context needs to sit independently of any one tool.
- **Why then:**
  1. MCP (late 2024) gave agents a standard way to pull context.
  2. LLMs made it cheap to draft documentation.
  3. Agents in production made the cost of missing context visible, as wrong answers.

## v0.1 (Duct-Tape)
- **Activate, 21 Aug 2025** ([recap](https://atlan.com/know/activate-2025-recap/)):
  - **Metadata Lakehouse:** Atlan's existing metadata, rewritten into Iceberg tables.
  - **MCP Server:** an adapter that lets ChatGPT and Claude read from Atlan.
  - **AI Search:** search grounded in glossary terms, owners and lineage.
- **What was really new (my reading):** the storage format and the access protocol. The content was mostly the catalog graph Atlan already had. The "context layer" label came later and was a rename of this stack.
- **First users:** existing Atlan enterprise customers. Mastercard's CDO praised the metadata lakehouse's scale ("hundreds of millions of assets").
- **Unknown:** team size and build time. Neither is public.

## Mental Model
- **Abstractions:**
  1. **Enterprise data graph:** assets, lineage and owners, pulled from 100+ connectors.
  2. **Context Lakehouse:** Iceberg storage with graph, file and vector search on top.
  3. **Context Agents:** draft definitions, metrics and ontology.
  4. **Certification:** humans approve what the agents drafted.
  5. **Delivery:** agents read the result over MCP, an API or SQL.
- **The lifecycle Atlan describes:** Unify → Bootstrap → Collaborate → Activate.
- **Guarantees:**
  - One canonical meaning per business term.
  - Lineage and provenance for each piece of context.
  - Access policies applied per user at read time.
  - An open format, so customers aren't locked in.
- **Non-guarantees:**
  - It doesn't run agents. That is left to agent frameworks.
  - It doesn't store or compute on the data itself. That is left to the warehouse.
  - It can't certify that the context is correct; humans do that.
  - **Trade-off bought:** staying neutral across vendors, at the cost of being one more layer to integrate and keep fed.
- **Think of it as:** a package registry plus a type system for business meaning. Agents are callers that come and go. Context is the versioned, reviewed library they import.

## Key Design Decisions
| Chose | Over | Because |
|---|---|---|
| Iceberg storage that others can query | A proprietary metadata store | Context shouldn't be locked to one vendor, and warehouses can join against it |
| MCP as the main way to serve context | Vendor-specific plugins | A single integration works with every agent framework |
| An independent layer | Context living in the warehouse, the system of record, or the agents | Sankar's position in the 2026 debate: the main problem is sprawl across vendors ([GDD](https://atlan.com/know/gdd-who-will-own-ai-context/)) |
| Agents draft and humans certify | Fully automatic, or fully manual | Atlan reports a 40× gain in volume (1M+ AI-drafted descriptions vs 25k written by humans), while humans still give the sign-off |
| Context Repos with review workflows | Static documentation pages | *"Git versions text, not meaning"*. Context needs owners, dependencies and conflict detection |

## Ecosystem Fit
```
 Sources:  Snowflake · Databricks · dbt · Airflow · BI tools · SaaS (100+ connectors)
                              │
                              ▼
          ┌─────────── ATLAN CONTEXT LAYER ─────────────┐
          │ data graph → Context Agents → human certify │
          │ Context Lakehouse (Iceberg) · Context Repos │
          │ policy at read time (partners: Immuta, Cyera)│
          └──────────────┬──────────────────────────────┘
                         │ MCP / API / SQL
                         ▼
 Consumers: ChatGPT · Claude · custom agents · BI copilots · "talk-to-data"

 Competing owners of context:
   Warehouses (Snowflake/Databricks semantics) · enterprise search (Glean)
   Platform agents (Agentforce, Microsoft) · catalogs (Collibra, Alation, OSS DataHub)
 Replaces: hand-written catalog docs · per-agent RAG indexes · prompt-stuffed glossaries
 Built on: Iceberg · MCP · Atlan's active-metadata graph
```

**Company context:**
- Series C: $105M led by GIC and Meritech in May 2024, at a valuation above $750M ([Entrackr](https://entrackr.com/2024/05/atlan-raises-105-mn-in-series-c-round)).
- Named a Leader in Gartner's Magic Quadrant for Metadata Management in Nov 2025 ([BusinessWire](https://www.businesswire.com/news/home/20251124723002/en/Atlan-Named-a-Leader-in-the-2025-Gartner-Magic-Quadrant-for-Metadata-Management-Solutions)).
- Founding year *(disputed)*: NTU says 2019 and the press says 2020. The credible version is that the tool began inside SocialCops and became a separate company around 2019–20.

**Caveat:** usage numbers (8B context reads in 90 days, "5× accuracy", 400+ enterprises) come from Atlan's own material and haven't been independently checked.

---
*Say **more** for: timeline & key people · evolution · major incidents & lessons.*

result: Wrote an origin story of Atlan's Context Layer: it grew out of SocialCops' three failed catalog attempts, then Atlan's metadata became Iceberg tables served to AI agents over MCP (Aug 2025), renamed the "context layer" by 2026.

Sources:
- [Atlan – Context Layer](https://atlan.com/context-layer/)
- [Activate 2025 recap](https://atlan.com/know/activate-2025-recap/)
- [Activate 2026](https://atlan.com/know/context-layer-stopped-being-theoretical-activate-2026/)
- [The GitHub for Context Doesn't Exist Yet](https://contextandchaos.substack.com/p/the-github-for-context-doesnt-exist)
- [Great Data Debate 2026](https://atlan.com/know/gdd-who-will-own-ai-context/)
- [DataCamp podcast](https://www.datacamp.com/podcast/building-trust-through-data-with-prukalpa-sankar-co-founder-of-atlan)
- [NTU alumni story](https://www.ntu.edu.sg/alumni/alumni-stories-news/detail/prukalpa-sankar-atlan-ntu)
- [Entrackr Series C](https://entrackr.com/2024/05/atlan-raises-105-mn-in-series-c-round)
- [BusinessWire Gartner MQ](https://www.businesswire.com/news/home/20251124723002/en/Atlan-Named-a-Leader-in-the-2025-Gartner-Magic-Quadrant-for-Metadata-Management-Solutions)
- [Atlan homepage](https://atlan.com/)
