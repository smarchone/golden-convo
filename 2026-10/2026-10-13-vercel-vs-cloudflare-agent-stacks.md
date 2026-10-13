---
schema: 1
id: 2026-10-13-vercel-vs-cloudflare-agent-stacks
title: "Vercel vs Cloudflare: core abstractions, agent stacks, and why Cloudflare's edge compute evolved"
why: Each Cloudflare product removed the main limitation of the one before; compare that to Vercel's agentic stack.
why_source: suggested
harness: claude-code
harness_version: 2.1.287
model: claude-opus-5-5
session_id: e73ca79c-44cd-4894-8810-34471853d6cc
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/e73ca79c-44cd-4894-8810-34471853d6cc.jsonl
started: "2026-10-02T01:26:18.376Z"
captured: "2026-10-13T05:30:00Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:intuition"
turns: 6
complete: true
golden_turns: [2, 4, 6]
labels: [platforms, agents]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

/intuition im a curious software engineer. want to learn about vercel. help me explore the core services and abstractions. also cover the full agentic stack and the underlying compnents

### 2 · **assistant:**

[ran: WebSearch — Vercel AI Cloud agents stack AI SDK AI Gateway Sandbox Workflow Fluid compute 2026]
[ran: WebSearch — Vercel Ship 2026 announcements agents]
[ran: WebFetch — https://vercel.com/blog/vercel-ship-2026-recap]

# Intuition: Vercel, from the web platform to the agent stack

> **Freshness note:** Vercel ships fast. I checked the agent-stack details below against Vercel's [Ship 2026 recap](https://vercel.com/blog/vercel-ship-2026-recap) (June 2026). Product names may have changed since.

## Elevator Pitch

Most cloud platforms hand you servers, queues and buckets, and you write config to connect your app to them. Vercel works the other way round: **you write the app, and it reads your code to work out what infrastructure to create.** People use it when they want shipping to mean `git push`, not a separate infrastructure project. In the last two years it has used the same approach for AI agents, which are odd workloads: they mostly wait, they run for a long time, and they run code nobody reviewed.

**If you remember nothing else:** on Vercel, your code is the infrastructure spec.

---

## In the Wild (STAR)

- **Situation:** A 4-person startup is building a "fix my failing CI" agent. A user connects a repo. The agent clones it, runs the tests, asks an LLM for a patch, re-runs the tests, and repeats. A typical run takes **18 minutes**, and about **95% of that time is spent waiting** on LLM tokens and test output. The test suites are **user code nobody has reviewed**.
- **Task:** Their first version ran on plain serverless functions and failed in three ways at once:
  - Functions timed out partway through a run.
  - They were billed for 18 minutes of compute while the function sat idle.
  - A deploy partway through a run killed it, and the user lost all progress.

  Also, running a stranger's `npm test` inside their own backend process is a security hole.
- **Action:** They moved to Vercel's agent stack. Each piece answers one of those failures:
  - The **AI SDK** runs the agent loop (model calls and tools) and calls models through the **AI Gateway**, so switching from Claude to GPT is a one-string change and outages fail over automatically.
  - The loop becomes a `"use workflow"` function, and each LLM call or test run becomes a `"use step"`. The **Workflow SDK** checkpoints every step, so a crash or redeploy resumes at step 7 instead of starting over.
  - Repo code runs in **Vercel Sandbox**, an isolated microVM that is discarded after the run.
  - Everything runs on **Fluid compute** with **Active CPU pricing**, so the 17 minutes of waiting cost almost nothing.
- **Result:** Runs survive deploys, idle time is cheap, and untrusted code never touches the backend. **The bill:**
  - The orchestration logic now depends on Vercel-specific directive semantics.
  - Workflow functions have to be **deterministic** because they are replayed. An engineer spent a day on a bug caused by calling `Date.now()` outside a step.
  - Per-unit metering (Gateway tokens, Sandbox minutes, Active CPU) is harder to forecast than one flat VM bill.

**The tell:** the workload **waits far more than it computes**, **outlives a single request**, and **executes code you didn't write**. If two of those three apply, you need this stack or something that copies it.

---

## The Key Insight

**The old belief:** infrastructure is a separate artifact. You write the app, then you write Terraform, YAML or a console checklist describing servers, CDN rules, cron jobs and queues, and you keep the two in sync by hand. When they drift, things break.

**What flipped:** the app's framework already knows what it needs. A page with no data dependencies is static. `revalidate: 60` means "cache this at the edge and refresh it every minute." An `/api` route is a function. **Vercel treats your framework as a compiler whose output includes infrastructure.** Builds emit a standard format, the **Build Output API**: static files, functions, routes and cache rules. The platform provisions that output. Vercel calls this **framework-defined infrastructure**.

Most of the rest follows from that one decision:

- **Immutable deployments with preview URLs.** If infrastructure is derived from a commit, every commit can have its own full copy. Rollback just points the domain at an older build.
- **Agent primitives as code-level markers.** `"use workflow"` and `"use step"` work the same way as `revalidate: 60`. A string in your code compiles into a durable queue plus state storage. You never declare the queue.

---

## Negative Space

- **Not AWS with a nicer UI.** On AWS you can build anything, because you assemble the primitives yourself. On Vercel you can only get infrastructure **that your code can express**. If you need a long-lived socket server with custom kernel settings, you've left the model. Container and Dockerfile support (announced 2026) widens what fits, but you pay for that by giving up some of the inference.
- **Not just "Next.js hosting."** Next.js is the framework Vercel makes, so it is the most thoroughly understood input. But the Build Output API is a contract any framework can target: SvelteKit, Nuxt, and now FastAPI, Flask, Hono and Express. Vercel's lock-in comes from depending on that **contract**, not on React.
- **Not an agent brain.** Nothing in the agent stack makes your agent smarter. The model provides the intelligence. Vercel handles everything around it: **staying alive** (Workflow), **staying contained** (Sandbox), **staying cheap while idle** (Fluid), and **staying swappable** (Gateway).
- **Problem it never claimed to solve:** stateful data. Vercel deliberately does not own your database. Postgres and Redis come through **Marketplace** partners such as Neon and Upstash. Vercel's own storage (Blob, Edge Config) is narrow on purpose.

---

## The Map: core services by layer

```
┌──────────────────────────── AGENT STACK ────────────────────────────┐
│ eve          opinionated agent framework (markdown instructions +   │
│              TS tools; durability, sandbox, approvals wired in)     │
│ AI SDK 7     the agent loop: streaming, tool calling, multi-turn    │
│ Chat SDK     one agent → Slack / Discord / GitHub surfaces          │
│ AI Gateway   one endpoint → hundreds of models, failover, billing   │
│ Workflow SDK "use workflow"/"use step" → durable, resumable runs    │
│ Sandbox      ephemeral microVM for untrusted / generated code       │
│ Connect      short-lived scoped creds for agents (no long tokens)   │
│ Vercel Agent Vercel's own agent: watches prod, investigates, opens PRs│
├──────────────────────────── COMPUTE ────────────────────────────────┤
│ Functions on Fluid compute: many concurrent invocations per         │
│ instance, Active CPU pricing (idle I/O wait ≈ free), waitUntil      │
│ Routing Middleware · Services (multi-service projects, private net) │
│ Containers + Vercel Container Registry · BYOC (run in your AWS)     │
├──────────────────────────── DELIVERY ───────────────────────────────┤
│ Global CDN · ISR (cache + background revalidate) · Firewall/WAF     │
│ Skew protection · Image optimization                                │
├──────────────────────────── BUILD & DEPLOY ─────────────────────────┤
│ git push → framework build → Build Output API → immutable deploy    │
│ Preview URL per commit · instant rollback · env per environment     │
├──────────────────────────── DATA & OPS ─────────────────────────────┤
│ Blob · Edge Config · Marketplace (Neon, Upstash, …) · Observability │
│ Passport (IdP-gated internal apps) · Security dashboard             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Explain in Levels

**To a student:** You hand Vercel your website's code. It reads the code, works out which parts are fixed pages and which parts need a computer to think, and sets up exactly that worldwide. AI agents are programs that spend most of their time waiting for an AI to reply. Vercel added tools so that waiting is cheap, a crash doesn't lose your place, and risky code runs in a disposable box.

**To an engineer:**
- **Web side:** your framework adapter emits a `.vercel/output` directory. Vercel maps each piece to a primitive: static assets go to the CDN, functions go to Fluid compute, prerender configs become ISR cache entries, and routes go to the edge router.
- **Fluid compute** fixes the classic serverless model of one request per instance. A single instance serves many concurrent invocations, and you're billed for active CPU, not wall-clock time. That fits I/O-bound work like LLM streaming.
- **Workflow SDK** is the agent-side twin of ISR: a code annotation that implies infrastructure. Steps are memoized to durable storage, and the workflow function is **replayed** from the event log on resume. The workflow body must therefore be deterministic, and all side effects belong in steps.
- **Sandbox** gives you microVM isolation, which is stronger than containers, with fast boot and a preview URL.
- **When to reach for it:** frontend-heavy products, preview-driven teams, and I/O-heavy agents.
- **When not to:** heavy stateful backends, GPU training, or anywhere the per-unit pricing model works against you.

**To a PhD:** This is **infrastructure-from-code** taken seriously: the deployment topology is a pure function of `(source, framework semantics)`.
- **Assumption:** the framework's semantics fully specify the operational intent. Wherever that assumption fails (cache invalidation across services, data locality), you need escape hatches, and every escape hatch weakens the inference.
- **Workflow SDK** is deterministic-replay durable execution in the Temporal lineage, exposed through compiler directives instead of an SDK client. The compiler splits a function at `"use step"` boundaries into separately invokable units, so a coroutine becomes a persisted state machine.
- **Open subtleties:**
  - Versioning in-flight workflows across deploys. Replay against changed code is the hard problem.
  - Whether inferred infrastructure can express cost and latency tradeoffs a human would choose differently.
  - Whether one vendor owning both the compiler (framework) and the target (platform) produces lock-in that a nominally open output contract only partly offsets.

---

## Question Ladder

```
          Why does `git push` "just work" on Vercel?
                 /                         \
     How does it know what              Why can every commit get
     infra a page needs?                its own live preview URL?
             |                                   |
     The framework already                 Deployments are immutable
     encodes it (static / ISR /            builds, not mutated servers
     function) in its output               |
             |                             Why can infra be rebuilt
             |                             per commit at all?
              \                           /
               \                         /
        INFRA IS A PURE FUNCTION OF CODE  ◄──────────────┐
          (Build Output API = the contract)              │
                         |                               │
          Why is Vercel now an "agent" company?          │
            /              |               \             │
   Agents mostly      Agents outlive     Agents run      │
   WAIT on tokens     one request        foreign code    │
        |                  |                  |          │
   Fluid + Active     "use workflow"      Sandbox        │
   CPU pricing        → durable steps     microVM        │
        |                  |                             │
   Why bill CPU not   How does a string ─────────────────┘
   wall clock?        become a queue?
        |             Compiler splits the fn; the
   Concurrency per    directive IS the infra spec
   instance: idle
   waits share one box
```

**Where the arrows meet:** "how does a string become a durable queue?" sounds like an agent-runtime question. "How does Vercel know a page is static?" sounds like a CDN question. Both lead to the same node: **an annotation in code compiles to infrastructure.** The agent stack is not a pivot. It is the 2020 web idea applied to a workload whose needs are waiting, durability and isolation instead of caching and edge delivery.

**Self-test:** Give an agent requirement that Vercel's model *can't* infer from code. *(Hint: a model choice set by budget, or a human-approval timeout. Both are policies, not code structure. That's why Connect, Gateway config and eve's approval workflows exist as explicit surfaces.)*

---

I can go deeper on one piece next, for example how `"use workflow"` replay works, or Fluid vs. classic Lambda on a cost chart. Say "go deep" on either.

**Sources:**
- [Vercel Ship 2026 recap](https://vercel.com/blog/vercel-ship-2026-recap)
- [The AI Cloud: a unified platform for AI workloads (Vercel)](https://vercel.com/blog/the-ai-cloud-a-unified-platform-for-ai-workloads)
- [Vercel Sandbox KB](https://vercel.com/kb/sandbox)
- [Vercel eve open-source agent framework (Noqta)](https://noqta.tn/en/news/vercel-eve-open-source-agent-framework-2026)
- [Agentic infrastructure 2026 (DEV)](https://dev.to/meghroop_tech/agentic-infrastructure-2026-vercels-vision-for-ai-agents-3l74)
- [Vercel unveils AI Cloud (VKTR)](https://www.vktr.com/ai-news/vercel-unveils-ai-cloud-platform-to-power-agentic-applications/)

### 3 · **user:**

/intuition similarly do for cloudflare

### 4 · **assistant:**

[ran: WebSearch — Cloudflare agents 2026 Agents SDK Durable Objects Sandbox Containers Workflows announcements]
[ran: WebSearch — Cloudflare Birthday Week 2026 announcements]
[ran: WebFetch — https://www.cloudflare.com/pl-pl/press/press-releases/2026/cloudflare-expands-its-agent-cloud-to-power-the-next-generati]

# Intuition: Cloudflare, from the network to the agent stack

> **Freshness note:** I checked the agent-stack details against Cloudflare's [April 2026 Agent Cloud announcement](https://www.cloudflare.com/pl-pl/press/press-releases/2026/cloudflare-expands-its-agent-cloud-to-power-the-next-generation-of-agents/) and [Agents Week 2026](https://softprom.com/cloudflare-agents-week-2026-20-new-features-for-ai-agents) coverage. Names and limits change often.

## Elevator Pitch

Most clouds ask you to pick a region ("us-east-1") and run your app there. Cloudflare has no regions you pick for compute. It has one network in hundreds of cities, and **every machine in it runs every customer's code.** You reach for it when you want your app to be close to every user by default, or when you have millions of small things (users, chats, agents) that each need their own memory and mostly sit idle.

**If you remember nothing else:** Cloudflare is one planet-sized computer. Isolates make code cheap enough to run everywhere, and Durable Objects give each piece of state exactly one home.

---

## In the Wild (STAR)

- **Situation:** A startup runs a personal-assistant agent for **2 million users**. Each user has a **long-lived chat connection**, their **own memory** (preferences, past tasks), and **scheduled follow-ups** ("remind me Thursday to renew the lease"). At any moment, **about 98% of agents are idle.**
- **Task:** The standard architecture is buckling: stateless functions, one central Postgres, Redis pub/sub for WebSockets, and a cron service scanning a `reminders` table.
  - Every message reloads the user's context from the database.
  - WebSocket servers have to stay up for idle users, and **they pay for that idle time.**
  - Two tabs from the same user cause race conditions on that user's memory.
  - The cron scan gets slower each week.
- **Action:** **Each user gets their own Agent**, which is a Durable Object addressed by user ID (`getAgentByName(env.Assistant, userId)`).
  - **Memory:** the agent keeps state in its **own embedded SQLite** (`this.sql`, `this.setState`).
  - **Follow-ups:** it schedules them itself with `this.schedule("thursday 9am", "remind")`.
  - **Idle connections:** it **hibernates** while the WebSocket stays open, so idle users cost almost nothing.
  - **Tool code:** code the model writes runs in a **Dynamic Worker** (a throwaway isolate). Jobs that need a real OS (`git`, `pip`) go to a **Sandbox**.
- **Result:** No central database on the hot path, no Redis, no cron scanner. Races disappear because **each object is single-threaded.** **The bill:**
  - **One user who triggers heavy work is one single-threaded object.** You can't scale that one entity horizontally.
  - "How many users asked about leases this week?" is now a **query across 2 million separate SQLite databases**. You need a separate analytics pipeline for it.
  - The Workers runtime **is not Node.js**. Some npm packages need compatibility flags, and some don't work at all.

**The tell:** **many small, independent entities**, each needing its **own consistent state and a live connection**, that are **mostly idle**. That is the shape of the actor model, and Cloudflare runs actors at planet scale.

---

## The Key Insight

**The old belief:** compute lives in a region. You choose where your servers are, and users far away pay the latency. Serverless helped with ops, but each function still started a container or microVM, which costs hundreds of milliseconds and a lot of memory. That is too heavy to run on every server in every city.

**What flipped:** Cloudflare already had servers in hundreds of cities for its CDN and DDoS protection. To run **customer code on every one of those machines**, the unit of compute had to be roughly a thousand times lighter than a container. So they used the **V8 isolate**, the sandbox browsers use for each tab. One process holds thousands of isolates, and they start in milliseconds or less. That is **Workers**.

**Code with no home then creates a state problem.** If code runs everywhere, where does the data live? Their answer is **Durable Objects**. You don't put state in a region. You give each entity (a room, a document, a user, an agent) **its own globally unique, single-threaded home** with attached storage. Cloudflare places it near whoever first touches it and routes every request for that ID there.

Most of the platform, including the agent stack, is those two moves combined:

- **An agent *is* a Durable Object.** It is addressable by name, keeps its own memory, schedules its own wakeups, and hibernates for free.
- **Dynamic Workers** reuse isolates for **AI-generated code**. Cloudflare claims "100x the speed and a fraction of the cost of containers."

---

## Negative Space

- **Not Vercel.** Vercel **infers** infrastructure from your framework. On Cloudflare you **declare primitives explicitly** as *bindings* in `wrangler.toml` (this KV namespace, this R2 bucket, this DO class), and your code receives them as `env.X`. **Consequence:** more wiring, but nothing is hidden. A queue exists because you wrote it down, not because a directive implied it.
- **Not Lambda.** Lambda gives you a container: any binary, a full OS, and cold starts of roughly 100 ms to seconds. An isolate gives you **JS and WASM only**, with strict CPU and memory limits, but **near-zero cold start and much higher density.** **Consequence:** you can't `apt-get install ffmpeg` in a Worker. That's why **Containers** and **Sandboxes** exist as escape hatches, and they bring back container costs.
- **Durable Object ≠ database; KV ≠ Durable Object.** KV is **eventually consistent**: a write can take up to about a minute to appear everywhere, so it suits config and flags. A DO is **strongly consistent with a single writer**, but it's **one entity's** storage, so you can't `SELECT` across all of them. D1 (SQLite) and Hyperdrive (pooling for your existing Postgres) cover the relational cases in between.
- **Problem it never claimed to solve:** heavy compute next to a big central database. Running code in Sydney that makes ten queries to Postgres in Virginia is slower than running it in Virginia. **Smart Placement** and Hyperdrive are patches that admit this. The default model assumes your **data can move toward users or be split per entity.**

---

## The Map: core services by layer

```
┌──────────────────────────── AGENT STACK ────────────────────────────┐
│ Agents SDK     Agent class = Durable Object + state, SQL, scheduling │
│                WebSockets, hibernation; McpAgent for remote MCP      │
│ Think          persistence framework for long multi-step agent tasks │
│ Dynamic Workers  isolates spun up on the fly for AI-written code     │
│ Code Mode      LLM writes TS against tool APIs, runs it in isolate   │
│ Sandboxes (GA) persistent Linux: shell, FS, background processes     │
│ Artifacts      Git-compatible versioned storage for agent code/files │
│ Workflows v2   durable multi-step execution (retries, sleeps, state) │
│ Workers AI     inference on GPUs inside the network                  │
│ AI Gateway     caching, rate limits, logs, fallback across providers │
│ Vectorize · AI Search · Browser Rendering · Email Service            │
│ Access OAuth · Mesh   agents act on behalf of users; private network │
├──────────────────────────── COMPUTE ────────────────────────────────┤
│ Workers (V8 isolates, everywhere) · Durable Objects (actors+storage) │
│ Queues · Cron Triggers · Containers · Smart Placement                │
├──────────────────────────── DATA ───────────────────────────────────┤
│ KV (eventual, read-heavy) · R2 (S3 API, zero egress) · D1 (SQLite)   │
│ Hyperdrive (pool + cache your Postgres/MySQL) · Analytics Engine     │
├──────────────────────────── NETWORK & SECURITY (the original biz) ──┤
│ Anycast CDN · DNS · DDoS · WAF · Bot Mgmt · AI Crawl Control         │
│ Zero Trust: Access, Gateway, Tunnel, WARP                            │
└─────────────────────────────────────────────────────────────────────┘
       Every layer runs on every server. There is no "us-east-1".
```

---

## Explain in Levels

**To a student:** Cloudflare owns computers in hundreds of cities and runs your program on whichever one is closest to the person using it. To fit everyone's programs on every computer, each program runs in a tiny, light box. When something needs to remember things, like a chat room or an AI assistant, it gets one special home somewhere in the world, and everyone talking to it is sent there.

**To an engineer:**
- **Anycast** sends each request to the nearest PoP, where a **Worker isolate** handles it. Isolates share one V8 process, so cold starts are around a millisecond and you're billed on CPU time, not wall clock.
- **Bindings** inject platform resources into `env`, with capabilities granted per resource.
- **Durable Objects** are actors. Each has a unique ID, a single thread, colocated transactional storage (SQLite), alarms for timers, and **WebSocket hibernation**: the object is evicted from memory while the socket stays open.
- The **Agents SDK** is a thin layer that turns a DO into an agent: state sync to clients, `schedule()`, tool calls, and MCP serving.
- **When to reach for it:** latency-sensitive global apps, per-entity state (chat, docs, games, agents), and egress-heavy storage (R2).
- **When not to:** CPU-heavy jobs, workloads that need Node or native binaries end to end, and query patterns that span all entities.

**To a PhD:**
- The platform is a **globally distributed actor system** with **location transparency**, built on a **stateless edge tier**.
- Isolates trade OS-level isolation for language-VM isolation. Cloudflare adds defenses in depth (process sandboxing, Spectre mitigations, rapid V8 patching). The security argument is weaker than hardware virtualization, which is why Sandboxes and Containers exist for code needing a full OS.
- DOs give you **linearizability per object, by construction**: one thread, one storage, input/output gates that prevent interleaving across `await`. They give **nothing across objects**. Any invariant that spans entities has to be designed in (sagas, Workflows) or avoided by choosing entity boundaries carefully. The **choice of object granularity is the real design decision**, as in Orleans and Erlang.
- **Open subtleties:**
  - Object migration and placement under shifting load.
  - Hot-object throughput limits.
  - Whether "an agent is an actor" survives multi-agent systems where coordination *is* the cross-object invariant.

---

## Question Ladder

```
            Why is a Worker so fast to start?
                          |
            It's an isolate, not a container
                          |
            Why not just use containers?
                          |
        Too heavy to run every customer's code
        on every server in every city
                          |
            Why must it run on every server?
                          |
   ┌──► ONE NETWORK, EVERY MACHINE RUNS EVERYTHING ◄──┐
   │      (no regions; anycast picks the box)         │
   │                      |                           │
   │        If code runs everywhere, where            │
   │        does STATE live?                          │
   │          /                       \               │
   │   Replicate it everywhere    Give each entity    │
   │   (KV: fast reads, but       ONE home, routed    │
   │    eventual consistency)     by ID               │
   │                                   |              │
   │                            DURABLE OBJECTS       │
   │                         (single-threaded actor   │
   │                          + its own SQLite)       │
   │                         /                \       │
   │        Why are agents a DO?        Why can idle  │
   │        memory + timers + socket    agents be ~free?
   │        per user = an actor         hibernation:  │
   │                                    evict, keep   │
   │                                    socket open   │
   │                                        |         │
   │   Why can agents run AI-written   Why is this     │
   │   code cheaply?                   cheap at all?───┘
   └── Dynamic Workers: same isolate,  multi-tenant density
       spun up per snippet             from the same network
```

**Where the arrows meet:** "why do Workers start fast," "why can idle agents be nearly free," and "why can AI-written code run cheaply" sound like three separate selling points. All three come back to the same node: **every machine runs every tenant's code**, so density had to be extreme, and isolates provide it. The second hub, **Durable Objects**, is where the agent questions meet. Once state has no region, an agent can't be anything other than an addressable actor.

**Self-test:** You're building Google Docs on Cloudflare. What is the Durable Object: the user, the document, or the paragraph? *(Hint: pick the boundary where you need strong consistency and where traffic to any one object stays below what one thread can handle. That's the document.)*

---

### Vercel vs Cloudflare in one line each

- **Vercel:** *your code is the infrastructure spec.* The platform reads your framework and decides what to provision.
- **Cloudflare:** *the network is the computer.* You pick explicit primitives, and the platform runs them everywhere, with state anchored per entity.

Both reached agents from opposite sides. Vercel added **durability** to stateless functions with Workflow. Cloudflare already had **stateful actors** in Durable Objects and wrapped them as agents.

If you want to go deeper, good next topics are the Durable Object input/output gates, or Code Mode (why having the LLM write code beats direct tool calls).

**Sources:**
- [Cloudflare expands its Agent Cloud (press release, Apr 2026)](https://www.cloudflare.com/pl-pl/press/press-releases/2026/cloudflare-expands-its-agent-cloud-to-power-the-next-generation-of-agents/)
- [Cloudflare Agents Week 2026: 20+ new features (Softprom)](https://softprom.com/cloudflare-agents-week-2026-20-new-features-for-ai-agents)
- [Cloudflare developer platform changelog](https://developers.cloudflare.com/changelog/product-group/developer-platform/3)
- [Birthday Week 2025 wrap-up](https://blog.cloudflare.com/birthday-week-2025-wrap-up)

### 5 · **user:**

explain ehy and how cloudflare evolved the edge compute

### 6 · **assistant:**

# How and why Cloudflare's edge compute evolved

**The short version:** Cloudflare didn't plan a cloud. It had a global network of identical cache servers, customers kept asking to put logic on them, and **each product removed the main limitation of the one before it.** By about 2023, the meaning of "edge" had changed from *near the user* to *wherever this request or entity should run*.

---

## Phase 0: the starting conditions (2010–2016)

- **What they had:** a reverse proxy (CDN, DDoS, WAF) on anycast. **Every server in every city ran every service.** There were no specialised machines and no regions.
- **The pressure:** customers wanted custom logic: rewrite this header, A/B test that path, block this odd bot. Cloudflare answered with **Page Rules** and settings toggles, and the list of settings kept growing. Every customer's edge case became a new checkbox.
- **The tempting answer:** let customers run code. But Cloudflare's own edge logic was nginx + Lua, and you can't let thousands of strangers run Lua inside your proxy process.

**The constraint that shaped everything later:** any customer code would have to run **on every machine, for every customer, inside a multi-tenant proxy.**

---

## Phase 1: Workers and stateless isolates (2017–2018)

**Why isolates?** Work through the alternatives:

| Option | Why it failed here |
|---|---|
| Container or VM per customer | Tens of thousands of customers × every server = impossible memory and cold-start budget |
| Process per customer | Lighter, but context switches and around 10 MB+ each still don't fit everyone everywhere |
| A config language (like Fastly's VCL) | Safe but limited. Same checkbox problem in a new syntax |
| **V8 isolates** | Chrome's per-tab sandbox: **thousands per process**, startup in milliseconds, only a few MB each |

**The move:** Workers (announced 2017, GA 2018) put V8 isolates inside the edge runtime and used the **browser Service Worker API** (`addEventListener("fetch", …)`) instead of a proprietary one. Later they hid the remaining cold start by **warming the isolate during the TLS handshake**: the SNI tells them which Worker the request will need.

**Competitor context:** Lambda@Edge (2017) ran containers in about a dozen regional edge locations, with cold starts measured in seconds. Cloudflare could run *everywhere* because isolates are cheap enough to run on every server.

**The cost:** JS/WASM only, tight CPU limits, no filesystem, not Node. And **no state.** It was a programmable proxy.

---

## Phase 2: state, part 1, replicate it everywhere (2018)

**The pressure:** if code runs in 300 cities, where are the feature flags, redirects and sessions it reads?

**The move:** **Workers KV**. Data is pushed or cached to every location, so reads are fast everywhere.

**The cost:** **eventual consistency**. Writes take up to about 60 s to propagate. That's fine for config and wrong for a counter, a chat room or a shopping cart. Two cities writing at once gives last-write-wins.

---

## Phase 3: state, part 2, give each entity one home (2020)

**The pressure:** real apps need coordination: "exactly one seat sold," "these 5 people see the same document." Replication everywhere can't provide that.

**The move:** **Durable Objects**. Instead of copying state everywhere, each entity gets **one global home, chosen near its first user.** It runs **single-threaded** with its own storage, and every request for that ID is routed there.

This was the conceptual turning point. **Cloudflare stopped assuming "edge = closest to the user" and started placing things where it's correct.** A DO for a Sydney chat room lives near Sydney. A user in London talking to it pays the round trip, and that's accepted.

**The cost:** no queries across objects, and one hot object is limited to one thread.

---

## Phase 4: becoming a cloud (2020–2023)

**The pressure:** "real apps" need everything a region-based cloud offers. Cloudflare filled the gaps one at a time:

- **Cron Triggers** and **Unbound** (longer CPU budgets) for background work
- **R2** (2021/22): S3-compatible with **zero egress fees**, aimed at the most-resented line on an AWS bill
- **Pages**, **Queues**, **D1** (SQLite), **Workers for Platforms** (your customers' code on your Worker)
- **workerd** open-sourced (2022), partly to answer the lock-in objection

**Then a candid admission (2023): Smart Placement and Hyperdrive.** If your Worker makes 10 queries to Postgres in Virginia, running it in Sydney is *slower*. Smart Placement **moves the Worker next to the data**, and Hyperdrive pools and caches database connections. **The edge model gave ground to data gravity.**

---

## Phase 5: AI and heavy compute (2023–2025)

**The pressure:** inference, and workloads that need a real OS.

- **Workers AI** (2023): **GPUs placed inside PoPs**, consistent with "the network is the computer," plus **AI Gateway** and **Vectorize**
- **Durable Objects with SQLite storage** (2024): each object gets an actual relational database
- **Workflows** (2024): durable multi-step execution built on DOs
- **Containers** and the **Sandbox SDK** (2025): **containers came back, as the escape hatch.** The isolate decision is still the default. Containers are what you pay for when isolates can't do the job.

---

## Phase 6: agents (2025–2026)

**The pressure:** agents are long-lived, stateful, mostly idle, need timers, and run code the model wrote.

**The move needed almost nothing new.** That combination is a **Durable Object**:

- **Agents SDK** (2025): `class MyAgent extends Agent`, which is a DO plus state sync, `schedule()`, WebSockets with hibernation, and MCP serving
- **Code Mode** (2025): instead of calling tools one by one, the LLM **writes TypeScript against the tool APIs**, which runs in an isolate. The isolate design from 2017 now works as an AI code sandbox.
- **Dynamic Workers** (2026): isolates created on the fly for AI-written code, which Cloudflare claims is "100x faster than containers"
- **2026 Agents Week:** Sandboxes GA, Workflows v2, Artifacts (git-like storage), Think (persistence framework), Managed OAuth so agents can act for users

---

## The whole arc in one picture

```
 2010  Identical servers everywhere, every one runs every service
          │  pressure: customers want logic, not checkboxes
 2017  WORKERS ── isolates (only thing light enough for every box)
          │  pressure: stateless
 2018  KV ─────── replicate everywhere (fast, eventually consistent)
          │  pressure: need coordination / correctness
 2020  DURABLE OBJECTS ── one home per entity  ◄── "edge" now means
          │                                          PLACEMENT, not proximity
 2021+ R2, D1, Queues, Pages ── fill in the cloud
          │  pressure: data lives elsewhere
 2023  SMART PLACEMENT / HYPERDRIVE ── move code back toward data
          │  pressure: AI, real OS needs
 2023+ Workers AI (GPUs in PoPs) · 2025 Containers/Sandboxes (escape hatch)
          │  pressure: agents = stateful, idle, timers, run untrusted code
 2025+ AGENTS SDK = DO wrapped  ·  Dynamic Workers / Code Mode = isolates reused
```

## Why each step happened

1. **Fixed constraint:** every server runs every tenant, so compute must be extremely dense, so **isolates**. Nothing later reversed this. Even Containers sit *beside* it.
2. **Fixed constraint:** no regions, so state needs a deliberate home, so **KV, then Durable Objects**.
3. **Moving constraint:** the definition of "edge" itself. It started as *close to the user* and became *placed by the platform per request or entity*: near the user, near the data, or near the object's home.

**The irony:** the two 2017–2020 decisions made to run a CDN better (isolates and per-entity actors) turned out to be close to what an AI agent platform needs: cheap sandboxes for generated code, and cheap stateful homes for millions of mostly idle agents.

> Dates for 2017–2025 are from my own knowledge and may be off by a year in places. The 2026 items come from the sources in my previous answer. If you want, I can check this timeline against Cloudflare's blog.
