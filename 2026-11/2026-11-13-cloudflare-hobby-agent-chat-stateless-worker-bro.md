---
schema: 1
id: 2026-11-13-cloudflare-hobby-agent-chat-stateless-worker-bro
title: "Cloudflare hobby agent chat: stateless Worker + browser history, neurons are the only real limit"
why: A hobby agent chat app on Cloudflare can be one stateless Worker with history in the browser and Workers AI streamed as SSE; the real free-tier limit is neurons, not bandwidth or storage.
why_source: suggested
harness: claude-code
harness_version: 2.1.323
model: claude-opus-5-5
session_id: f3003464-8c6d-4cc3-8166-4c80c172fdfb
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/f3003464-8c6d-4cc3-8166-4c80c172fdfb.jsonl
started: "2026-11-13T19:07:06.675Z"
captured: "2026-11-13T19:33:01Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:intuition-panel"
turns: 2
complete: true
golden_turns: [6, 8]
labels: [agents, platforms, system-design, agent-runtime]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

i want to deploy an agentic app on cloudflare. it seems to support free hosting and token usage for hobby projects.
this a chat app with customizations on agent. the chats need not be stored.
the app servers a UI and proxies a agent harness with system prompt and skill.

is this possible and help me build mental model of cloudflare features for agent dev and deployment and maintanance and ecosystem

### 2 · **assistant:**

**Yes, this works well on Cloudflare.** A stateless chat app with a UI, a system prompt and a skill can run as one Worker, free, with no servers to manage.

## What "free" covers (limits as I last knew them; check the current pricing pages)
- **Workers:** about 100k requests/day. The 10ms CPU limit doesn't count time spent waiting on the model, so streaming responses are fine.
- **Workers AI:** about 10k "neurons"/day, which works out to a few hundred to a few thousand chat turns depending on the model. **This free usage only applies to the open models Cloudflare hosts** (Llama, Qwen, gpt-oss, etc.).
- **Claude or GPT:** you use your own API key and they bill you. AI Gateway can sit in front for free and add logging, caching and rate limits.
- **Public URL risk:** anyone who finds your URL can use up your daily quota. Add Turnstile or the rate-limit binding from the start.

## Your app's shape (the minimum)
```
Browser ──► Worker
            ├─ /           → static assets (UI)
            └─ /api/chat   → [system prompt + SKILL.md] + messages
                              → env.AI.run(model, {stream:true}) → SSE back
```
- **Skill:** bundle `SKILL.md` as a text import. Either put it in the system prompt, or expose it as a tool the model calls when it needs it (progressive disclosure, the way Claude skills work).
- **No storage:** the client sends the full message history each turn. Nothing to persist, so no database.

## Mental model: 5 layers
| Layer | Pieces | Use it when |
|---|---|---|
| **Compute** | **Workers** (stateless V8 isolates) · **Durable Objects** (one stateful actor per ID, with SQLite, websockets and alarms) · **Workflows** (durable multi-step jobs) · **Containers / Sandbox** (a real Linux box) | Workers by default. DOs when an agent needs memory or a live connection. Sandbox for running code the model writes |
| **Agent framework** | **Agents SDK** (`agents` npm). An `Agent` class built on a DO, plus `AIChatAgent`, a `useAgent` React hook, scheduling and an MCP client/server | Agents that are stateful, long-running, resumable or scheduled. **You don't need it yet** |
| **AI** | Workers AI (inference) · AI Gateway (proxy for any provider) · Vectorize · AI Search (managed RAG) · Browser Rendering (headless browser as a tool) | Model calls, retrieval, web-browsing tools |
| **Storage** | KV (config) · D1 (SQL) · R2 (blobs) · DO storage (per-agent state) | Later, if you ever keep chats |
| **Ops** | `wrangler dev` (runs the real runtime locally) · `wrangler deploy` · git-connected builds · secrets · `wrangler tail` and Observability · versions and gradual rollouts | Day to day |

**The key idea:** a Worker is a function and a Durable Object is an object. Cloudflare's "agent" is just a Durable Object with AI helpers attached. Stateless chat only needs the function.

## Maintenance
- **Pin the runtime:** set `compatibility_date` in `wrangler.toml` so platform updates don't change your app's behaviour.
- **Watch the model:** Workers AI retires models, so pin the model ID and keep an eye on the changelog.
- **Little else:** there's no OS, no scaling and no TLS for you to handle.

Want me to scaffold it in `ideas/cf-agent-chat/`? That would be the Worker, a minimal UI, a sample SKILL.md, Workers AI streaming and a Turnstile guard, ready for `wrangler deploy`.
