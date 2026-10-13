---
schema: 1
id: 2026-10-11-meko-learned-vs-atlan-governed-context
title: Meko turns mem0 into generic context infra; Atlan is governed data context
why: "Meko wraps mem0 into context infra over memory, KB, convos and traces (context mining); Atlan is the other half: learned context vs governed context."
why_source: suggested
harness: claude-code
harness_version: 2.1.296
model: claude-sonnet-5-5
session_id: 12470daa-20b9-4a30-a1a5-88fdec4b314c
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/12470daa-20b9-4a30-a1a5-88fdec4b314c.jsonl
started: "2026-10-11T01:46:07.649Z"
captured: "2026-10-13T05:29:59Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:origin-story"
turns: 32
complete: true
golden_turns: [12, 26, 30, 32]
labels: [agents, context-infra, knowledge-mgmt, origin-story]
thread: context-layer
status: raw
---

### 1 · **user:**

/origin-story yugabyte's meko

### 2 · **assistant:**

[ran: WebSearch — Yugabyte Meko]
[ran: WebSearch — YugabyteDB Meko announcement]

Let me read the primary sources.

[ran: WebFetch — https://thenewstack.io/yugabyte-meko-ai-agent-state/]
[ran: WebFetch — https://www.yugabyte.com/blog/meko-data-infrastructure-for-agents-that-work-and-learn-together/]
[ran: WebFetch — https://www.yugabyte.com/blog/meko-agent-memory-with-built-in-discernment/]
[ran: WebFetch — https://tessl.io/blog/why-multi-agent-ai-breaks-in-production-and-how-yugabytes-meko-is-trying-to-fix-it]

# Meko — origin story
Agent-native data layer (memory, knowledge, conversations, traces) over a single MCP endpoint · launched 2026-05-07 · Yugabyte

*Caveat: Meko is five months old. Nearly all the sources are Yugabyte's own material or friendly trade coverage, and I found no independent benchmarks or customer case studies. Where I infer something, I mark it.*

## TL;DR
- **Pitch:** Wouldn't it be interesting if agents shared a database built for what agents know, instead of tables, vectors and graphs you wire together yourself?
- **Aha:** Multi-agent systems fail on shared state, not on reasoning. Yugabyte's pitch is that this is "infrastructure problems that need infrastructure solutions" (Karthik Ranganathan, co-CEO, via [Tessl](https://tessl.io/blog/why-multi-agent-ai-breaks-in-production-and-how-yugabytes-meko-is-trying-to-fix-it)).

## Before → After
| Before (how the world coped) | After (what it made possible) |
|---|---|
| Postgres + pgvector + graph DB + object store + custom tiering, caching and observability glue | One datapack with one MCP endpoint |
| Each agent's learnings stay in its own context | Per-agent memory with explicit promotion to a shared layer |
| Memory extraction and entity/graph updates run in agent code and spend agent tokens | The LLM-driven extraction runs inside the data layer |
| Observability shows what agents did | Traces record the chain: prompt → plan → tool calls → reasoning → what was learned |
| Bad learning gets baked in | Provenance on each memory write, so bad entries can be traced and removed (not prevented) |

Sources: [Yugabyte launch post](https://www.yugabyte.com/blog/meko-data-infrastructure-for-agents-that-work-and-learn-together/) (Andrew Marshall, 2026-05-07) and the Tessl piece.

## The Catalyst Problem
- Yugabyte sells a distributed, Postgres-compatible database. Its [homepage](https://www.yugabyte.com/) now leads with "AI-native".
- The launch post cites the MAST study (arXiv 2503.13657). It attributes 36.9% of multi-agent failures to inter-agent misalignment.
- Marshall's framing: "Multi-agent applications don't fail because the agents can't reason; they fail because they can't share what they know."
- Tessl names three failure modes:
  - state divergence, where agents act on different versions of a fact
  - redundant retrieval, which drives up token and infra cost
  - weak traceability of how knowledge spread between agents
- Ranganathan concedes the DIY route works for demos: "You can build a working prototype by stitching together memory, vector databases, and LangChain." The claim is that it doesn't survive production.
- *Unknown:* I found no account of the internal moment, team, or timeline that led to Meko. Treat any founding-story narrative as unsourced.

## Lineage
- **Borrowed from:**
  - mem0, the default memory implementation. Other providers plug in through the same interface.
  - Postgres-style hybrid queries: vector, relational and metadata filters in one SQL statement.
  - Tiered storage: hot in YugabyteDB, older history in S3, then summaries only.
  - MCP as the integration surface.
- **Tried before:**
  - Stitched stacks (memory service + vector DB + LangChain).
  - Vendor memory features (OpenAI, Anthropic) and smaller players (LanceDB, Augment, Letta Code). Tessl frames these as personalization or coding-context memory, not shared coordination infrastructure.
  - Observability tools. They record actions but not how learning propagated.
- **Why then** *(inferred from the sources)*:
  - Multi-agent systems were moving from demos to production.
  - MCP gave a common client interface, with Claude Code, Claude Desktop and Cursor named as clients.
  - EU AI Act documentation expectations are cited, including a 10-year retention policy for high-risk systems.

## v0.1 (Duct-Tape)
- The launch was a managed service, with access **by request**.
- Open source, multi-region and multi-cloud were all "planned" at launch, with no dates.
- Auto-sharing of memories is "coming soon". Promotion from private to shared is human-gated today ([discernment post](https://www.yugabyte.com/blog/meko-agent-memory-with-built-in-discernment/)).
- Entity extraction and graph building run in the background after a memory is created, and take a few seconds.
- A Yugabyte update dated 2026-09-14 says agent-created daily databases are up 10x since the May launch. It gives no absolute numbers, so I can't judge the scale.
- *Unknown:* team size, build time, and whether it was dogfooded internally.

## Mental Model
- **Abstractions:**
  - **Datapack:** the unit that bundles storage, indexing and retrieval. It holds per-agent memory and shared knowledge, and each tenant gets its own logical database.
  - **Memory:** five types (working, episodic, semantic, procedural, shared). Private by default, shared by choice.
  - **Knowledge:** ingested PDFs, SQL tables, HTML, markdown and live feeds, with embeddings and summaries and incremental updates.
  - **Conversations:** three tiers (hot, S3, summaries) with verbatim history retained.
  - **Traces:** decision lineage, exportable to existing observability tools.
- **Guarantees:**
  - Isolation: recall of private memory is limited to the agent that created it.
  - Provenance on every memory write, scoped memory, and permissions on knowledge layers.
  - Retention policies that expire working memory.
  - Handoffs that carry the reasoning, not only the output.
- **Non-guarantees:**
  - "Meko isn't a fact-checker" (Ranganathan).
  - It doesn't prevent bad information from entering shared memory ("you don't entirely prevent it"). The goal is to "make bad learning recoverable instead of permanent".
  - Contradiction resolution and trust scoring aren't documented, so I can't say they exist.
  - The trade-off: governance and auditability instead of automatic truth-checking.
- **Think of it as:** a git-like audit trail plus a team wiki for agents, with a staging branch (private) and a main branch (shared). Promotion is the merge.

## Key Design Decisions
| Chose | Over | Because |
|---|---|---|
| Agent concepts (memory, knowledge, conversations, traces) as the API | Exposing tables, vectors and graphs | Teams otherwise "build infrastructure instead of agents" |
| Extraction and memory work inside the data layer | Doing it in agent code | Saves agent token budgets |
| Private by default, explicit promotion | Auto-share everything | Teams should see distilled insight, not every draft |
| Tracing and auditability in the architecture | An observability add-on | Provenance and compliance can't be retrofitted |
| YugabyteDB underneath (SQL, vector, graph in one engine) | Polyglot persistence | Removes cross-system latency and cost. Serverless multi-tenancy suits bursty agent load. |

## Ecosystem Fit
```
Upstream:    YugabyteDB (distributed Postgres-compatible), S3, mem0 (default memory provider)
Interface:   MCP -> Claude Code, Claude Desktop, Cursor, other MCP clients
Meko:        datapack = memory + knowledge + conversations + traces
Downstream:  observability export, audit/compliance (EU AI Act framing)
Alternatives: stitched stacks (pgvector + LangChain), vendor memory (OpenAI/Anthropic),
              LanceDB, Augment, Letta Code
Adjacent:    Tessl (versioned skills and context, a different layer)
Replaces:    hand-built Postgres + vector + graph + object-store glue
```

**Licensing is unclear.** The launch post says Meko will be released as open source, with no date. One trade article calls it open source already, and Tessl doesn't address it. I'd trust Yugabyte's own wording: managed, by request, open source planned.

The New Stack article didn't load for me, so I haven't used it.

*Say **more** for: timeline & key people · evolution · major incidents & lessons.* Given how new Meko is, expect those sections to be thin.

Sources: [Yugabyte launch post](https://www.yugabyte.com/blog/meko-data-infrastructure-for-agents-that-work-and-learn-together/) · [Discernment post](https://www.yugabyte.com/blog/meko-agent-memory-with-built-in-discernment/) · [Tessl](https://tessl.io/blog/why-multi-agent-ai-breaks-in-production-and-how-yugabytes-meko-is-trying-to-fix-it) · [Business Wire release](https://www.businesswire.com/news/home/20260507728812/en/Yugabyte-Launches-Meko-a-Data-Infrastructure-to-Solve-the-Multi-Agent-Memory-and-Knowledge-Problem) · [DBTA](https://www.dbta.com/Editorial/News-Flashes/Yugabyte-Meko-Delivers-a-Data-Infrastructure-to-Solve-the-Multi-Agent-Memory-and-Knowledge-Problem-174806.aspx)

### 3 · **user:**

what was yugabyte strategy for meko

### 4 · **assistant:**

Yugabyte hasn't published a strategy document for Meko. What follows is what the sources state, plus my inferences, which I've marked.

## Stated (from Yugabyte's posts and Tessl)
- **Positioning:** Meko is an "agent-native data layer", not a new database. The pitch is that agent builders shouldn't assemble Postgres, pgvector, a graph DB and S3 themselves.
- **Wedge:** Multi-agent failures come from shared state. Yugabyte cites MAST's 36.9% inter-agent misalignment figure and names three failure modes: state divergence, redundant retrieval cost, and weak traceability.
- **Distribution:** A single MCP endpoint. It works with Claude Code, Claude Desktop, Cursor and any other MCP client, so Yugabyte doesn't have to win an agent framework.
- **Differentiation:** Auditability and governance, not recall quality. Provenance on each write, private-by-default memory, retention policies, and traces tied to EU AI Act expectations. Ranganathan says the aim is to "make bad learning recoverable instead of permanent."
- **Against alternatives:** Stitched stacks are "prototype, not production". Vendor memory (OpenAI, Anthropic) is per-user personalization, not shared coordination. Observability tools show what agents did, not how learning spread.
- **Rollout:** A managed service by request first. Open source (community-driven, local/private/public/hybrid), multi-region and multi-cloud are all planned, with no dates.
- **Brand surface:** A separate identity from the database: mekodata.ai, its own docs site, a Discord, and a blog category.

## Inferred (not stated by Yugabyte)
- **Moves YugabyteDB up the stack.** The core database competes on distributed-SQL features. Meko sells an agent-shaped product on the same engine, so agent workloads become database consumption. The "10x daily databases created by agents" stat in the September update fits this. The serverless, per-tenant logical database design supports it.
- **Open source as a later adoption lever.** Yugabyte's history is open-core. Holding the OSS release until the managed service has traction is a common sequencing, but they haven't said why.
- **Enterprise-first angle.** Compliance and audit framing targets regulated buyers, who a mem0-style startup would reach more slowly.
- **Risks I'd flag:** the memory layer defaults to mem0, so the memory logic isn't proprietary. The differentiator is the infrastructure and governance around it. Contradiction handling isn't documented. I found no independent benchmarks or customers.

If you want to go further, the useful next step is Yugabyte's earnings-style commentary, such as the Ranganathan interviews and the New Stack piece I couldn't load. They would show whether the company describes Meko as a new revenue line or as a driver of YugabyteDB adoption. I haven't searched for that yet.

### 5 · **user:**

so instead of selling databases, they are selling api

### 6 · **assistant:**

Partly. The interface is an API, but what they sell is still managed state.

- **What's true:** The customer never touches SQL, schemas or vector indexes. They get an MCP endpoint and four concepts (memory, knowledge, conversations, traces). The abstraction level moves from tables to agent concepts. That is the "agent-native" claim in the launch post.
- **What's not:** It isn't a stateless API like an LLM call. The value is durable, isolated, audited state: per-tenant logical databases, S3 tiering, retention, provenance. Yugabyte is still running a database for you. The database just isn't the product surface.
- **Closer analogy:** Supabase or Firebase over Postgres, or Stripe over bank rails. The same engine sits underneath, and you pay for the opinionated layer, which is a managed service.
- **Why it matters** *(my inference, not stated by Yugabyte)*:
  - It sells to a different buyer. An agent builder who would never evaluate distributed SQL will try an MCP endpoint.
  - Pricing can follow agent activity (datapacks, memory operations) rather than nodes or clusters. I haven't seen Meko's pricing, so I can't confirm the model.
  - The moat shifts from the database to the governance and workflow layer. That's also the weaker position, since the memory layer defaults to mem0 and MCP makes switching easy.
- **Still a database business:** The 10x growth in agent-created databases is a database-consumption metric. Meko works as a new way to sell YugabyteDB as much as a separate product.

I'd call it a new packaging of the same underlying business. Whether it becomes a separate revenue line isn't something the sources answer.

### 7 · **user:**

easier memory management drove more agents , increasing the business

### 8 · **assistant:**

It's a plausible flywheel, but the sources don't show it.

**The mechanism, if it holds:**
- Cheaper shared memory means each added agent costs less to integrate.
- More agents means more datapacks, and each one is a tenant database on YugabyteDB.
- Yugabyte bills for the underlying consumption, so database usage grows with agent count.

**Why I wouldn't state it as fact:**
- **The stat is weaker than it sounds.** The only figure I have is a search snippet: agent-created daily databases up 10x "since Meko's launch (May 2026)". I never opened the page it came from. I don't know whether it counts Meko datapacks or all agent-created YugabyteDB databases, or what the baseline was. It also gives no revenue figures.
- **Correlation, not causation.** Agent workloads were growing across the industry over that period. A 10x rise after a launch doesn't isolate Meko's effect. The same rise could come from MCP adoption or from tools like Claude Code spinning up databases on their own.
- **Which direction?** Meko may have caught demand that already existed, not created it. Easier memory management is only one possible driver.
- **Database count isn't revenue.** Agent-created databases are likely small and bursty. 10x more tiny databases could add little revenue. I haven't seen Meko's pricing.

To test your hypothesis, I'd look for the source of that 10x claim, whether Meko-specific usage is broken out, and any pricing or revenue commentary from Ranganathan. I can search for those if you want.

### 9 · **user:**

how does meko differ from mem0

### 10 · **assistant:**

They aren't really alternatives. The [launch post](https://www.yugabyte.com/blog/meko-data-infrastructure-for-agents-that-work-and-learn-together/) says mem0 is Meko's default memory implementation, with other providers pluggable through the same interface. Meko wraps mem0.

My description of mem0 comes from background knowledge, not fresh research, so verify the details.

| | mem0 | Meko |
|---|---|---|
| **What it is** | A memory layer library and service: extract facts from conversations, store them, retrieve them | A data layer that includes memory, plus knowledge, conversations and traces |
| **Scope** | Memory only | Memory, knowledge ingestion (PDFs, SQL, live feeds), tiered conversation history, decision traces |
| **Storage** | You choose the backing vector or graph store | Fixed: YugabyteDB, with S3 for older history |
| **Sharing across agents** | Scoped by user, agent or session identifiers | Private by default, with explicit human-gated promotion to Collective Memory. Auto-share is "coming soon". |
| **Governance** | Not its focus | Provenance on every write, permissions, retention policies, audit traces |
| **Interface** | SDK/API | One MCP endpoint |
| **Deployment** | Open source plus a hosted platform | Managed, by request. Open source planned. |

**What Meko adds on top** (stated by Yugabyte):
- Memory scoping and promotion semantics.
- Traces that capture "the WHY", meaning the reasoning chain behind a memory.
- The same database backs knowledge and memory, so hybrid queries run as one SQL statement.
- Memory work runs inside the data layer, not in agent code.

**What Meko doesn't change** (my inference):
- The extraction quality is mem0's. Yugabyte's docs don't describe how contradictions between memories are resolved, so I can't say Meko improves on mem0 there.
- A team that only wants fact memory for one agent gets little from Meko over plain mem0. The case for Meko starts with multiple agents, audit requirements, or knowledge and memory that must share one store.

**Open question:** If mem0 is the default engine, Yugabyte's moat is the infrastructure and governance around it, not the memory algorithm. I didn't check mem0's license terms or whether it has its own multi-agent sharing features, which would affect how much overlap there is.

### 11 · **user:**

narrate an elevator pitch on how yugabyte turned the primitive mem0 into meko with added advantages of handling KB, traces and convo by utilizing the corresponding storage surfaces in yugabyte

### 12 · **assistant:**

*(Reconstructed pitch. The per-surface mapping is my inference from Yugabyte's posts, not their wording.)*

---

"Every team building multi-agent systems hits the same wall. Their agents can reason, but they can't share what they know. Today the fix is a stack: mem0 for memory, pgvector for documents, a graph database, S3 for history, plus glue code and a separate observability tool.

Yugabyte already runs a distributed, Postgres-compatible database that handles SQL, vector, graph and time-series workloads in one engine. So Meko starts from a simple idea: take mem0, which extracts and recalls facts, and put the rest of an agent's state on the same database.

- **Memory:** mem0 does the extraction. Meko adds scoping on top. Memories are private by default, and a human promotes them to a shared layer.
- **Knowledge base:** PDFs, tables and live feeds are chunked, embedded and indexed in the same database. A single SQL statement can combine vector search, relational joins and metadata filters, with no cross-system hop.
- **Conversations:** Recent history stays hot in YugabyteDB. Older history tiers to S3, and past the retention window only summaries remain. Verbatim history is kept.
- **Traces:** Every decision is recorded as a chain from prompt to plan to tool calls to what was learned. Because traces sit next to memories, you can ask not just what an agent knows but why it believes it.

The customer sees none of that. They connect one MCP endpoint from Claude Code, Cursor or any MCP client, and they get memory, knowledge, history and an audit trail, with each tenant isolated in its own logical database.

Meko isn't a fact-checker, and it won't stop a bad memory from entering. What it does is make bad learning traceable and removable instead of permanent. And every agent that signs up becomes another tenant on YugabyteDB."

---

**Caveats on the pitch:**
- "Primitive" is my framing. Yugabyte's posts call mem0 the default memory provider and say others plug in, but they don't criticize it.
- Yugabyte states that the database covers SQL, vector, graph and time-series, and that conversations tier from YugabyteDB to S3. It doesn't say which engine feature backs traces, so that mapping is my guess.
- Promotion is human-gated today. Auto-sharing is "coming soon".
- No independent benchmarks exist for the "no cross-system hop" advantage.

### 13 · **user:**

so meko is context infra ?

### 14 · **assistant:**

Mostly yes. One of the search results described Meko as "an agent-native context engine", though I don't know if that's Yugabyte's own wording.

**Why it fits:**
- Its four primitives (memory, knowledge, conversations, traces) are the inputs to an agent's context window.
- Context loads at the start of a new conversation, which the [discernment post](https://www.yugabyte.com/blog/meko-agent-memory-with-built-in-discernment/) puts at about a second.
- Handoffs pass the reasoning and context behind a decision to the next agent, not just the output.

**Where "context infra" undersells or overstates it:**
- **It's also state and audit infra.** Traces, provenance, retention and tenant isolation serve compliance and debugging as much as prompting. Yugabyte leans on the EU AI Act framing for that reason.
- **It stores and serves context. I found nothing showing it assembles it.** The sources don't describe how it decides what goes into a prompt, how it ranks or compresses it, or how it handles token budgets. If that logic stays in the agent, Meko is the context store and retrieval layer, not the context engine in the full sense.
- **Tessl's distinction:** it puts its own product, versioned skills and context with evals, on a different layer. That layer decides what good context is. Meko holds what agents learned.

A tighter label is **shared, governed memory and context storage for agents**. I'd call it context infra with the caveat that curation and assembly look like the agent's job.

### 15 · **user:**

if i have to sticth available solutions what would that be

### 16 · **assistant:**

This comes from my background knowledge, not fresh research. Check versions and licenses before committing.

## Minimal stack (Postgres-centric)
| Meko primitive | Stitch with | Notes |
|---|---|---|
| Storage core | **Postgres + pgvector** (or any managed Postgres) | One engine for relational, vector and metadata filters, so hybrid queries stay in one SQL statement. |
| Memory extraction/recall | **mem0** (OSS, same default Meko uses), or **Letta**, **Zep/Graphiti** | Zep/Graphiti adds temporal graph memory. mem0 takes pgvector as its backend. |
| Knowledge base | **LlamaIndex** or **Unstructured** for parsing and chunking, plus pgvector | Incremental re-ingest is yours to build. |
| Conversations | Postgres table for hot history, **S3** for archives, a cron/worker to summarize and tier | The three-tier policy is custom code. |
| Traces | **OpenTelemetry** with **Langfuse**, **Arize Phoenix** or **LangSmith** | Records what agents did. See the gap below. |
| Interface | A small **MCP server** over all of the above | Gives you the single endpoint. |
| Isolation | Schema- or database-per-tenant, or Postgres row-level security | |

## What you have to build yourself
These are the parts Meko claims to provide as a product:
1. **Promotion layer:** private to shared memory, with approval flow and provenance on every write.
2. **Trace-to-memory linkage:** observability tools record actions. Linking "this memory came from this reasoning chain" is custom schema work.
3. **Retention and expiry policies:** working-memory expiry, summary-only aging, and compliance retention.
4. **Revocation:** finding and removing a bad memory and anything derived from it. Meko says it makes this possible, and I haven't seen how.
5. **One MCP facade** so agents don't see five systems.
6. **Ops:** backups, scaling, and multi-tenant noisy-neighbor handling for bursty agent load.

## Trade-offs
- **Stitching wins** if you have one or a few agents, no audit requirement, and want to avoid vendor lock-in. A Postgres, pgvector and mem0 setup is a weekend, and Ranganathan himself concedes prototypes work.
- **The cost shows up** at multiple agents, compliance needs, and operating it. Items 1–4 above are where teams spend months.
- **Middle path:** use Postgres + mem0 + Langfuse, and build only the promotion and provenance schema first. That is the piece most specific to shared memory.

If you want, I can run the build-vs-buy analysis with rough numbers, or sketch the Postgres schema for promotion and provenance.

### 17 · **user:**

sketch the mcp for meko

### 18 · **assistant:**

[ran: WebFetch — https://docs.mekodata.ai]
[ran: WebFetch — https://docs.mekodata.ai/reference/mcp-server/]
[ran: WebFetch — https://docs.mekodata.ai/reference/api-keys/]

Meko's MCP server is documented, so this isn't a guess. The tool list comes from the [MCP server reference](https://docs.mekodata.ai/reference/mcp-server/) and [API keys page](https://docs.mekodata.ai/reference/api-keys/).

## Shape
```
Client (Claude Code / Cursor / Codex / Claude Desktop / Kiro)
   │  HTTPS  https://mcp.mekodata.ai/mcp
   │  Authorization: Bearer mko_tkn_…   +   User-Agent required
   ▼
Meko MCP server — 24 tools, every one takes datapack_id
   ├─ datapack_*      create · describe · list · update · delete
   ├─ conversation_*  create · add_message · get · list · update · delete · track_token_usage
   ├─ memory_*        add · search · get_all · get_by_id · update · delete_by_id · delete_all · promote
   ├─ knowledgebase_* search · delete_document
   └─ artifact_*      put · get   (content-addressed)
```

## How the four primitives show up in the tools
| Primitive | Tools | Observation |
|---|---|---|
| Memory | `memory_*` | `memory_search` ranks by semantic, keyword and entity-aware scoring. `memory_promote` moves memories to the shared layer. |
| Knowledge | `knowledgebase_search`, `knowledgebase_delete_document` | **There's no ingest tool.** Agents only search and delete, so documents get in some other way, such as the UI (my inference). |
| Conversations | `conversation_*` | `conversation_add_message` takes `input`, `output`, `reasoning` and `plan` (an array of action strings). |
| Traces | no dedicated tool | Traces seem to be a by-product of conversations: `reasoning` and `plan` on messages, plus `track_token_usage`. `agent_id` is for trace attribution. |
| Artifacts | `artifact_put/get` | Uploads return a content hash, and identical bytes give the same hash. Under 1 MB comes back inline, larger files are written to a local directory. |

## Details that matter
- **Ownership:** `memory_update` and `memory_delete_by_id` require `agent_id` to match the writer. Private memory is agent-isolated.
- **Promotion is a move, not a copy.** `memory_promote` is one-way and removes memories from the private store. Only datapack owners and maintainers can call it. That corrects my earlier git-merge analogy.
- **Destructive calls are gated.** `datapack_delete` needs an explicit `datapack_id`, and `knowledgebase_delete_document` requires user confirmation.
- **Auth is account-level.** Keys are `mko_tkn_…`, scoped to the account and not to a datapack. There are up to 10 active keys, each expiring after a year. The docs describe no finer permission tiers, which is a gap for least-privilege agents.
- **`memory_get_all` is a window, not a listing.** It returns about 20 memories plus a count, with no pagination.
- **Versioning:** v2.1.0 retired tool-level `scope` arguments. A shim strips them for now.

## Corrections to what I said earlier
- I said promotion is "human-gated". More exactly, it's gated by role: only owners and maintainers can promote.
- I guessed traces map to a time-series surface. The tool surface shows no trace API, only conversation fields and token tracking.
- I inferred the "context loads in about a second" behavior was a built-in step. The tools don't show an automatic load. The agent calls `memory_search` itself.

The docs don't give full response schemas or name the transport protocol, so I can't sketch exact return types.

### 19 · **user:**

i think the playbook on how to use meko infra is in its skill

### 20 · **assistant:**

[ran: WebFetch — https://docs.mekodata.ai/integrations/]
[ran: WebSearch — Meko skill SKILL.md Yugabyte mekodata.ai agent instructions memory_search memory_add]
[ran: Bash — List files in the meko-skills repo]
[ran: Bash — List files in the meko-skills repo]
[ran: Bash — Find skill files in the plugin]
[ran: Bash — Fetch core Meko skill playbook files]

Found it: Yugabyte ships a `meko-skills` repo with the playbook. I'm reading the saved output now so I can summarize it.

[ran: Read — ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/12470daa-20b9-4a30-a1a5-88fdec4b314c/tool]

You're right. The playbook is in the `meko-mcp-tools` skill (v3.1.0, Apache-2.0) in [yugabyte/meko-skills](https://github.com/yugabyte/meko-skills). I read `SKILL.md` and five reference files. They say more about how Meko actually works than the launch posts do. The skill's text is cut off after the "Automatic conversation capture" heading, so I haven't read the rest of `SKILL.md`.

## The playbook in short
- **Capture is automatic on Claude Code.** SessionStart, PreCompact and SessionEnd hooks capture turns, and the server extracts memories itself. The agent's job is **recall**, not saving. It calls `memory_add` only for:
  - an explicit "remember this"
  - a durable fact that appears only in assistant output or a tool result
  - a correction whose stale fact must be replaced
- **Two read surfaces:**
  - `memory_search` covers personal memory across all of the user's agents.
  - `knowledgebase_search` covers team-shared knowledge (uploaded docs plus promoted memories).
  - For "what do you know about X?", the skill says to call both and name the source of each finding.
- **Promotion** needs explicit user confirmation of exact memory UUIDs. The skill says to explain the team visibility and the eviction of the private record first. Only owners and maintainers can do it.
- **Failure is not emptiness.** An error response means the findings are unknown. Only a successful call with an empty `results` array means "nothing found". The agent should also verify writes by reading them back.
- **Retrieval discipline:** pull about 25 candidates, give the reader at most the top 10, and abstain if nothing supports an answer.
- **Subagents** don't get SessionStart context. The parent must pass `agent_id` and `conversation_id` in the spawn prompt.

## What this corrects in my earlier answers
- **`agent_id` is attribution, not isolation.** It doesn't filter reads, and the skill says to use separate datapacks for anything that must not co-discover content. I had implied per-agent isolation.
- **Memory is per-user, not per-agent.** Reads are scoped by `(datapack_id, user_id)`.
- **There's a real storage mapping, and it differs from my guess:**
  - Memory: mem0 over pgvector, with hybrid semantic, keyword and entity-boost search.
  - Conversations and traces: **Langfuse** sessions and traces, with `reasoning` and `plan` stored on the per-turn observation. So traces aren't a YugabyteDB time-series surface, as I guessed earlier.
  - Knowledge base: ingestion is **UI-only**, through the Cloud UI. Accepted formats are PDF, TXT, MD, JSON and MP4, up to 5 MB each, 10 per batch.
- **Promotion:** it strips `user_id`, keeps `agent_id` as provenance, and evicts the private mem0 record.

## Limits the skill documents
- Free-tier quotas are **lifetime**, not per day: 1,000 `memory_search`, 1,000 `knowledgebase_search` and 10,000 `memory_add`. Standard is 5,000, 5,000 and 30,000. Pro and Enterprise are uncapped. Hitting the cap returns `free_tier_limit_reached`, and the skill says not to retry.
- `memory_get_all` is a window of about 20 recent rows, with no export path.
- There's no semantic search over conversation content.
- Memory extraction handles tabular data poorly, so CSV rows shouldn't go in one by one.

The repo also includes Desktop variants, a datapack-selection skill, hooks for Cursor and Codex, and a BMAD extension. Tell me if you want any of them.

### 21 · **user:**

how does conversation help as context

### 22 · **assistant:**

Less directly than memory does. From the skill and docs I read, a conversation is mostly a faithful record. It reaches an agent's context through three routes, and only one of them is automatic.

## 1. Indirectly, by feeding memory (the main path)
- On Claude Code, hooks capture each turn into a conversation. The server then extracts durable memories from those turns.
- Later, `memory_search` returns those extracted facts, not the transcript.
- So a conversation helps context by being the raw material for memory. The agent recalls the distilled fact, not the dialog.

## 2. Directly, by browsing and re-reading
- `conversation_list` and `conversation_get` let an agent pull a past conversation, with messages if requested.
- This is what the launch post calls resumability and handoffs: the next agent can read what was said and why.
- The limits:
  - There is no semantic search over conversation content. The skill says to browse by `conversation_list`, then inspect candidates with `conversation_get`.
  - `conversation_get` only works for the `agent_id` that created the conversation. Another agent gets `agent_id_mismatch`.
  - So cross-agent handoff through raw conversations is narrower than the marketing suggests. Sharing goes through promoted memory.

## 3. As a record of the why
- `conversation_add_message` stores `input`, `output`, `reasoning` and `plan` on a Langfuse trace.
- The skill requires verbatim text, not summaries, so it's a replayable record for review, debugging and audit.
- This serves the "traces" story more than prompt context. The reasoning is retrievable by a human or an agent that opens the conversation, but nothing in what I read injects it automatically.

## What I haven't verified
- The skill's "Automatic conversation capture" section was cut off in my read, so I don't know exactly what the hooks inject at SessionStart beyond `agent_id` and conversation ID.
- The docs mention experimental conversation-search tools that are hidden unless a deployment enables them. That would change point 2, but it isn't in the default tool list.
- The launch post's three-tier history (hot in YugabyteDB, older in S3, then summaries) doesn't appear in the skill's storage description, which cites Langfuse. I don't know how those fit together.

**Net:** conversations don't work as retrieval context by themselves today. Their value is the memory they produce and the audit trail they keep. If you wanted the agent to recall what was discussed, you'd rely on `memory_search`.

### 23 · **user:**

oh the convo are distilled for insights ?

### 24 · **assistant:**

Yes, but what gets distilled is narrower than "insights", and the conversation itself stays intact.

- **Two copies:** The conversation is kept verbatim (input, output, reasoning, plan). The server separately extracts memories from the captured turns. The memories are the distilled layer, and the transcript is the source record.
- **What extraction produces:** The skill describes mem0-style facts, preferences and entity relationships ("User prefers dark mode", "Alice works at Acme", "Customer budget is $50k"). That is closer to facts about the user and their world than to lessons learned from the work.
- **What it misses:**
  - It reads the **user turn**. A durable fact that appears only in the assistant's output or a tool result isn't captured, so the agent has to call `memory_add` itself.
  - Corrections add the new fact but may keep the old one, so stale memories need an explicit update or delete.
  - Conversational structure, such as turn order and reasoning, is deliberately lost in memory. That's why the skill says not to store a dialog summary with `memory_add`.
- **Curation layer on top:** Extracted memories start private, and promotion to the shared layer is where someone decides what is worth sharing. That matches the discernment post's line "you choose what your agent learned that's worth sharing."

I haven't seen how the server decides what to extract or how it handles duplicates and conflicts. The sources I read don't document it, so I can't say how good the distillation is.

### 25 · **user:**

context mining

### 26 · **assistant:**

"Context mining" is a good name for it, though I haven't seen Yugabyte use that term. In the sources I read, they say "continuous learning from context windows" (from the skill's intro).

## The pipeline, as mining
```
raw ore        conversations (verbatim turns, reasoning, plan)   ← hooks capture automatically
   │ server-side extraction (mem0)
refined        private memories (facts, preferences, entities)
   │ memory_promote (owner/maintainer, user-confirmed UUIDs)
curated        shared knowledge, searchable by the whole datapack
```
The context window is treated as exhaust that is normally thrown away at session end. Meko captures it, mines it for durable facts, and promotes the good ones.

## Where the metaphor holds
- **Mining happens off the agent's critical path.** Hooks capture and the server extracts, so the agent spends no tokens on it. That's Yugabyte's stated design choice.
- **Yield is uneven.** The discernment post admits "some of those memories will be useful, and some won't." Hence the filter step.
- **Tailings are kept.** The verbatim conversation stays, so you can re-inspect the source of any memory.

## Where it's weaker
- **Extraction is shallow.** It yields facts and preferences, not patterns or lessons across sessions. I saw no evidence of cross-session synthesis, though I haven't seen the server code.
- **The refining step is mem0's**, so the quality ceiling is mem0's. Meko's own contribution is capture, scoping, promotion and audit.
- **Extraction reads user turns only.** Insights the agent produced itself are missed unless it saves them explicitly.
- **No assay.** Nothing I read scores the quality of mined memories, and there are no benchmarks.

If you're designing something similar, the part worth copying is the three-stage separation: capture everything cheaply, extract automatically, and promote through a gate. Each stage has a different owner and trust level.

### 27 · **user:**

how is meko different from atlan

### 28 · **assistant:**

[ran: WebSearch — Atlan context layer for AI agents enterprise context MCP data catalog]

They overlap in the pitch ("context layer for agents over MCP") but differ in what the context is about and who writes it. This is based on Atlan's own marketing, not hands-on use of either product.

| | **Meko** | **Atlan** |
|---|---|---|
| **Context about** | What agents and users learned: facts, preferences, decisions, reasoning | What the enterprise's data means: definitions, lineage, ownership, access policy, quality scores |
| **Who writes it** | Agents, via conversation capture and extraction, then promoted by people | Mostly humans and crawlers over 400+ connected sources (self-reported). AI drafts, and experts certify. |
| **Origin** | Emergent, from agent activity | Curated, from existing data estate metadata |
| **Core asset** | Memory, knowledge, conversations, traces | Catalog and lineage graph, plus governed metrics and business terms |
| **Trust model** | Private by default. Promotion by a maintainer. Provenance on writes. | Certification of definitions and authorization checks at inference time |
| **Answers** | "What did we learn or decide last time?" | "What does this metric mean, is it certified, may this requester see it?" |
| **Heritage** | Distributed database (YugabyteDB) | Data catalog and active metadata |
| **Interface** | MCP endpoint (24 tools) | MCP server |

- **Different failure modes.** Meko targets agents diverging on shared state and losing what they learned. Atlan targets agents misreading enterprise data, for example using an uncertified or misdefined metric.
- **Complementary more than competing.** A data-analysis agent could ask Atlan what "active customer" means and ask Meko what a teammate's agent concluded from the last analysis.
- **Trust differs.** Atlan's content is certified before agents see it. In Meko, agent-extracted memories can be wrong, and Ranganathan concedes "Meko isn't a fact-checker," so it aims to make bad memory recoverable instead.
- **Where they could collide:** both are positioning as *the* enterprise context layer. If a buyer wants one, the question is whether context means curated data semantics (Atlan) or accumulated agent experience (Meko). I haven't seen either vendor address the other.

I don't know of any integration between the two. I also didn't check whether Atlan stores agent memory, or whether Meko ingests metadata. Atlan's materials describe the former as outside its scope, but I haven't confirmed that.

Sources: [Atlan context layer](https://atlan.com/context-layer/) · [Atlan MCP server](https://atlan.com/mcp/) · [Atlan: what is Atlan MCP](https://atlan.com/know/what-is-atlan-mcp/) · [Atlan MCP and business context](https://atlan.com/know/mcp-delivers-business-context/) · [AI Engineer profile](https://www.ai.engineer/orgs/atlan)

### 29 · **user:**

meko seems to be generic context infra; atlan seems to be data context indra

### 30 · **assistant:**

Yes, with one refinement: Meko is generic in domain but specific in kind.

- **Domain-agnostic:** Meko doesn't care whether the agents work on code, support, or analytics. Its schema is agent-shaped (memory, conversations, traces), not data-shaped.
- **Specific in kind:** What it holds is experiential context, meaning what happened, what was learned and why. It also has a document knowledge base, but that's a secondary surface. Ingestion is UI-only, with small files (5 MB each).
- **Atlan is domain-specific, and its context is semantic and curated.** It answers what the data means, who owns it and who may use it. Its content is certified metadata rather than agent experience.

You could phrase the split as:

| | Kind of context | Scope |
|---|---|---|
| Meko | Episodic and experiential: what agents did and learned | General |
| Atlan | Semantic and governance: what enterprise data means and who can use it | Data domain |

Both are "context infra". The first is closer to an agent's memory, and the second is closer to its reference library. The first accumulates as agents work, and the second is maintained before they start.

The "generic" label also has a downside. A domain-agnostic layer gets no free semantics, so everything it knows comes from what agents happen to say, and quality depends on extraction (mem0) and human promotion. Atlan's narrower scope buys it a trust model that Meko lacks.

### 31 · **user:**

learned context vs governed context

### 32 · **assistant:**

That framing works. Here's how I'd sharpen it.

| | **Learned context** (Meko) | **Governed context** (Atlan) |
|---|---|---|
| **Source of truth** | What agents observed and concluded | What the organization has certified |
| **Trust arrives** | After the fact, through promotion | Before the fact, through certification |
| **Failure mode** | Plausible but wrong, stale or contradictory memories | Correct but incomplete or out of date, because curation lags reality |
| **Error handling** | Recovery: trace the provenance, then delete or update | Prevention: authorization checks and certified definitions |
| **Strength** | Captures tacit knowledge no one wrote down | Gives a single authoritative answer |
| **Cost** | Quality depends on extraction and a human gate | Needs human curation effort up front |

## Why the two need each other
- Governed context has a coverage problem. Nobody certifies the tacit stuff, such as "this table is stale on Mondays" or "the finance team prefers fiscal weeks".
- Learned context has a trust problem. Without a gate, one agent's mistake becomes every agent's belief.
- Each is trying to borrow the other's strength. Atlan's materials describe AI agents drafting context that experts certify, so learning feeds governance. Meko's promotion step turns a private learned memory into shared, owner-approved knowledge, so governance gates learning.

## The pipeline behind it
```
learned (cheap, broad, unreliable)  ──promotion/certification──▶  governed (costly, narrow, reliable)
```
Both products are building the same promotion path from opposite ends. Meko starts at the learned end, and Atlan starts at the governed end.

For an architect, the useful question is which layer an agent should trust at inference time, and when. A reasonable rule is that governed context wins on conflicts about definitions and policy. Learned context wins on "what did we try last time". I haven't seen either vendor document how a conflict between the two would be resolved.
