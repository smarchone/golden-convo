---
schema: 1
id: 2026-11-13-cloudflare-hobby-agent-chat-stateless-worker-bro
title: "Cloudflare hobby agent chat: stateless Worker + browser history, neurons are the only real limit"
why: A hobby agent chat app on Cloudflare can be one stateless Worker with history in the browser and Workers AI streamed as SSE; the real free-tier limit is neurons, not bandwidth or storage.
why_source: suggested
harness: claude-code
harness_version: 2.1.323
model: claude-opus-5-5
session_id: af7b396b-da77-4fc1-9874-3d3246eb57c8
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/af7b396b-da77-4fc1-9874-3d3246eb57c8.jsonl
started: "2026-11-13T19:10:56.627Z"
captured: "2026-11-13T19:33:53Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:intuition-panel"
turns: 8
complete: true
golden_turns: [6, 8]
labels: [agents, platforms, system-design, agent-runtime]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

/intuition-panel ❯ i want to deploy an agentic app on cloudflare. it seems to support free hosting and token usage for hobby projects.
  this a chat app with customizations on agent. the chats need not be stored.
  the app servers a UI and proxies a agent harness with system prompt and skill.

  is this possible and help me build mental model of cloudflare features for agent dev and deployment and maintanance and ecosystem. im a senior software engineer

### 2 · **assistant:**

**CEO:** Yes, this works, and Cloudflare is a good fit because what you're describing is mostly a thin proxy. Edge UI, a system prompt and skills held at the edge, and a model behind them. No database, because nothing is stored.

**PM:** The real question is what "customizations" means. If it's a fixed prompt plus a few skills, a single Worker is enough. If each user can tune their own agent, you need per-user state, and then the Agents SDK starts to make sense.

**Architect:** The hard limit is that **"free tokens" means Workers AI's open models (Llama, Qwen, Mistral and similar), not Claude or GPT.** Also, a heavyweight harness like the Claude Agent SDK can't run in a Worker isolate because there's no filesystem or subprocess. That needs Containers or the Sandbox SDK, which are on the paid plan, about $5/mo.

```
                 ┌──────────── Cloudflare edge ─────────────────────────┐
 browser ──WS──▶ │ Worker (static assets = UI)                          │
                 │   │                                                  │
                 │   ▼                                                  │
                 │ Agent (Durable Object, `agents` SDK)                 │
                 │   • system prompt + skills (bundled or in KV/R2)     │
                 │   • tool loop, streaming, ephemeral chat state       │
                 │   │                                                  │
                 │   ▼                                                  │
                 │ AI Gateway  ── logs · cache · rate limit · fallback  │
                 └───┬──────────────────────┬───────────────────────────┘
                     ▼                      ▼
              Workers AI (free tier)   Anthropic / OpenAI (your key, you pay)

 Mental model:   Worker = stateless fn  │ Durable Object = 1 actor per chat/user
                 KV/R2/D1 = config/blob/sql │ Workflows = durable long jobs
                 Containers/Sandbox = real OS, for heavy harnesses (paid)
 Maintenance:    wrangler deploy · wrangler tail · AI Gateway dashboard
```

**CEO:** My recommendation is a Worker plus a Durable Object agent, with AI Gateway in front of every model call. That means swapping between a free model and Claude is a config change, not a rewrite.

**PM:** You said chats don't need to be stored. Does that include losing them when the tab refreshes? If so, you don't even need a Durable Object. A stateless Worker that streams the response is enough.

**Architect:** Free-plan Workers get 10ms of CPU per request, but time spent waiting on the LLM's response doesn't count toward that. So streaming chat fits easily. What you'll run out of first is Workers AI's daily neuron allowance, not compute. These numbers are from what I knew as of training; check current free-tier limits before you rely on them.

---

**Your call:** Do you need Claude or GPT specifically, or are open models good enough? And is your "agent harness" a prompt plus a tool loop, or a real SDK like Claude Agent SDK that needs a sandbox? Those two answers decide whether this stays free.

### 3 · **user:**

i dont think i need a harness for now.
for storing chat sessions in DO, does it have free credits ?

### 4 · **assistant:**

**CEO:** Yes. Durable Objects are on the free plan as long as they use the **SQLite storage backend**. The older key-value backend is paid-only. Without a harness this is a one-Worker app, and the Durable Object gives each chat session its own small database.

**PM:** With no harness, the experience is simple: open the page, chat, close it, and the session is gone, unless you decide sessions should last. Do you want "resume where I left off", or just survive a page refresh? That decides whether you need a Durable Object at all.

**Architect:** These are the free-plan numbers as I knew them at training time, so check them on the Cloudflare pricing page:

```
 Durable Objects (Free, SQLite-backed only)
 ├─ requests     ~100k/day   (shared with Workers)
 ├─ duration     ~13k GB-s/day   ← an open WebSocket counts against this
 ├─ storage      ~5 GB total
 ├─ rows read    ~5M/day
 └─ rows written ~100k/day   ← each saved chat message is at least 1 row

 Hit a limit → requests fail (no surprise bill on Free)
```

**Architect:** Duration is the limit that catches people out. An idle WebSocket keeps counting time unless you use the **Hibernation API**. The `agents` SDK does this for you, and a hand-written Durable Object needs `ctx.acceptWebSocket()`.

**CEO:** My recommendation is to use the `agents` SDK's `AIChatAgent`. It saves messages to the Durable Object's SQLite and handles hibernation for you. Message history and resume then work without extra code.

---

**Your call:** Should chats survive closing the tab, or just a refresh? If it's only a refresh, keep history in the browser and skip the Durable Object. That's the simplest design and the one least likely to hit a free limit.

### 5 · **user:**

if i use user browser as chat session store, and make the worker stateless ?

### 6 · **assistant:**

**CEO:** Yes, and this is the simplest version: a stateless Worker plus history in `localStorage`. The system prompt and skills stay on the server, and the client only holds the conversation turns.

**PM:** For the user, history now lives on one device. Switching devices or clearing browser data loses it. Is that acceptable? For a hobby chat app it usually is.

**Architect:** The trade-off is that the client resends the full history on every request, so input tokens grow with every turn. You'll need to cap or trim history on the server, or long chats will use up your free neurons quickly.

```
 browser (localStorage: [msgs])
    │  POST /chat { messages }        ← full history every turn
    ▼
 Worker (stateless)
    • prepend system prompt + skills  ← never sent to client
    • trim history to N turns/tokens
    • rate-limit per IP / Turnstile   ← public endpoint = your quota
    ▼
 AI Gateway → model ──SSE stream──▶ browser appends reply, saves
```

**Architect:** Two consequences. First, the client controls the history, so a user can edit past turns. That only affects their own session, so it doesn't matter here. Second, your endpoint is public and every call spends your quota. Add a **Rate Limiting binding** or **Turnstile**, or someone else will use up your free tier.

**CEO:** My recommendation is SSE streaming (Server-Sent Events) over plain `fetch`, rather than WebSockets. You don't need a Durable Object or a database. Once AI Gateway is in front, deploying is just `wrangler deploy`.

---

**Your call:** Is this app public or just for you and some friends? If it's private, put **Cloudflare Access** in front, which is free for up to 50 users, and you can skip rate limiting entirely.

### 7 · **user:**

can workers do SSE ? i dont think i need AI gateway, i can simply use workerAI.
i dont think i can avoid chat turns in terms of tokens (but can limit turns), but are ther bandwidth limits ?

### 8 · **assistant:**

**CEO:** Yes to both. Workers can stream SSE, and calling Workers AI directly through its binding is fine. Skipping AI Gateway only costs you its logs and caching, and `wrangler tail` is enough for debugging.

**PM:** Limiting turns is the right lever. A rolling window of the last N turns keeps each request's cost predictable, and the user rarely notices.

**Architect:** Streaming takes very little code, because the Workers AI binding already returns an SSE stream that you can pass straight through:

```ts
const stream = await env.AI.run(model, { messages, stream: true });
return new Response(stream, { headers: { "content-type": "text/event-stream" } });
```

**Architect:** There's no bandwidth meter, because Cloudflare doesn't charge Workers for egress. These are the limits that actually apply, as I knew them at training time, so check current values:

```
 Free plan — what actually bounds you
 ├─ Workers AI   ~10k neurons/day   ← binding constraint (tokens → neurons)
 ├─ Workers      ~100k req/day, 10ms CPU/req (stream wait ≠ CPU)
 ├─ request body ~100 MB            ← history JSON is nowhere near this
 ├─ wall-clock   none while client connected (streams fine)
 └─ egress       no charge/no meter
```

**CEO:** The real limit is neurons, not bandwidth. Your daily budget is roughly the number of turns per day times the tokens in your trimmed history window.

---

**Your call:** Which Workers AI model are you thinking of? Neuron cost per token varies a lot by model size: an 8B model gives you far more turns per day than a 70B one.
