---
schema: 1
id: 2026-11-21-cloudflare-agents-sdk-and-computer-vs-sandbox
title: "Cloudflare agent runtime: Agents SDK on hibernating DOs (conversations vs Workflows graphs), plus Computer VFS vs Sandbox containers"
why: "Cloudflare's agent stack in two layers: the Agents SDK is a hibernating DO actor (DOs carry conversations, Workflows carry deterministic graphs), and Computer is a DO SQLite VFS for isolate work that a Sandbox mounts only when a real Linux runtime is needed."
why_source: suggested
harness: claude-code
harness_version: 2.1.330
model: claude-opus-5-5
session_id: 5ba52a5a-0949-4131-a54e-c19e4dd7bfc9
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/5ba52a5a-0949-4131-a54e-c19e4dd7bfc9.jsonl
started: "2026-11-21T10:04:24.396Z"
captured: "2026-11-21T10:45:10Z"
cwd: ~/Documents/proj/claude/spark/ideas
turns: 26
complete: true
golden_turns: [12, 24]
labels: [agents, platforms, system-design, agent-runtime]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

any other advantage of cloudflare agent sdk other than rich cloudflare integration ?

### 2 · **assistant:**

The main one is the **actor model**. Compute, a SQLite database and real-time networking come bundled in one unit that sleeps when idle. LangGraph and the OpenAI SDK only orchestrate, so you bring the server, database, WebSockets and cron yourself.
- **Free while idle:** each agent is a Durable Object that sleeps when idle and wakes in milliseconds. You can have millions of agents and pay nothing while they wait.
- **Local state:** each agent has its own SQLite database next to its compute. `this.setState()` saves the state and pushes it to clients.
- **Multiplayer and resumable streams:** several users can connect over WebSockets, and a dropped stream picks up where it left off.
- **Agents can wake themselves:** `schedule` / `scheduleEvery` set alarms, with built-in queuing and retries, so you don't need SQS.
- **MCP both ways, and other frameworks work inside it:** an agent can use MCP servers or be one. You can also run the Vercel AI SDK or LangGraph inside an agent to give it persistence.
- **Trade-off:** you're tied to Cloudflare's runtime, and it's TypeScript/JS first, not Python.

### 3 · **user:**

what if i host any other sdk agent?

### 4 · **assistant:**

- **You build the infrastructure yourself:** Redis or Postgres for memory, Ably or Pusher for WebSockets, EventBridge or BullMQ for cron and queues.
- **Always-on vs cold starts:** you either pay for always-on containers or put up with cold starts and reloading state.
- **Hybrid:** run the other SDK inside Cloudflare. Cloudflare handles WebSockets and SQLite; the Vercel SDK's `streamText()` or LangGraph handles the logic.

### 5 · **user:**

can i use cloudflare worker for non-cloudflare agent sdk and still get the sleep behavior when idle ?

### 6 · **assistant:**

Yes, but use Durable Objects or Workflows, not plain Workers:
- **Plain Workers:** stateless. You need an external database and get no built-in scheduling.
- **Workers + Durable Objects:** the engine behind the Agents SDK. You get sleep-with-state, but you write the WebSocket and SQLite code yourself.
- **Workflows:** for long-running background agents. `step.sleep()` and `step.waitForEvent()` pause the agent at no compute cost.

### 7 · **user:**

so cloudflare agent sdk is build on durable workflow?

### 8 · **assistant:**

No. It's built on **SQLite-backed Durable Objects**. A Durable Object is the agent's brain and memory. Workflows are a separate tool for fault-tolerant pipelines that an agent can kick off.

### 9 · **user:**

what are some example usecases the differentiates DO and workflows for agents (cloudflare agent sdk)

### 10 · **assistant:**

| Durable Objects (Agents SDK) | Workflows |
|---|---|
| Real-time, users connected live | Multi-step, crash-safe, long pauses |
| Shared-doc AI assistant over WebSockets | Deep research agent that survives crashes |
| Habit coach with daily check-ins | Human approval that waits days |

**Hybrid:** a Durable Object agent runs the chat and starts a Workflow for heavy background work.

### 11 · **user:**

DO is good enough for conversations, workflows are for graphs

### 12 · **assistant:**

Spot on: Durable Objects for live, stateful sessions; Workflows for fixed graphs that need retries and checkpoints.
- **Caveat:** a dynamic agent loop, where the model picks tools as it goes, usually fits better in a Durable Object. Workflows suit structured, predictable steps.

### 13 · **user:**

cloudflare computer vs sandbox

### 14 · **assistant:**

- **Sandbox:** an isolated Linux container for untrusted code, shells and dev servers. Its state lives in the container's filesystem.
- **Computer:** a virtual filesystem kept in SQLite inside a Durable Object. Its state is permanent. It can run code through several backends: a sandbox container, a JS isolate, or a shell.

### 15 · **user:**

why 2 diffrernt ?

### 16 · **assistant:**

- Speed and cost vs full OS. Starting a container for every agent step is slow and expensive.
- Isolates are fast but can't run a real OS: no bash, Python or compilers.
- They work together: Computer keeps the files. Sandbox attaches for heavy work (C++, git), then shuts down.

### 17 · **user:**

computer is just DO based vfs on worker

### 18 · **assistant:**

Basically yes. On top of the filesystem it adds three pieces:
- `computerd`: a FUSE daemon that mounts the filesystem as a real directory inside a Sandbox.
- Runtimes that run inside the isolate: `just-bash` and Dynamic Worker loaders.
- One API, `workspace.fs` / `workspace.runtime`, whatever the backend.

### 19 · **user:**

which tasks on sandbox and which on computer

### 20 · **assistant:**

| Task | Where | Why |
|---|---|---|
| File operations (grep, cat) | Computer (isolate) | No container start-up time |
| Simple shell scripting | Computer (isolate) | Handled by `just-bash` |
| Python / Go / Rust / C++ | Sandbox | Needs real runtimes and compilers |
| Background servers | Sandbox | Needs long-running processes and open ports |

### 21 · **user:**

non cloudflare runtime workloads on sandbox isolate compatible workloads on computer

### 22 · **assistant:**

Yes, that's the rule of thumb. Computer handles JS, TS, Wasm and pure-JS tools. Sandbox handles Python, Go, Rust and native Linux binaries.

### 23 · **user:**

coding agents with editing can use computer

### 24 · **assistant:**

Yes, that's the main use case. About 80% of an agent's turns (reading, searching, editing) can run in Computer. That makes those steps instant and avoids paying for an idle container while the model is thinking.

### 25 · **user:**

the vfs can be added to sandbox ?

### 26 · **assistant:**

Yes, in two ways:
- **Live FUSE mount** (`computerd`): mounts the filesystem at `/workspace`.
- **On-demand sync** (`remote-exec`): copies files in before running and back out after.

Either way, the files survive container restarts and sleep.
