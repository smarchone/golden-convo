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
turns: 6
complete: true
golden_turns: [4, 6]
labels: [agents, platforms, system-design, agent-runtime]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

extract the conversation from https://share.google/aimode/9faiRA7e7eOVvpHPt

### 2 · **assistant:**

I'll open the share link in Chrome; it's a page that renders with JavaScript, so a plain fetch probably won't get the content.

[ran: Bash — Open share link in Chrome and snapshot page]

Google showed a reCAPTCHA ("unusual traffic") instead of the conversation, so I couldn't get the content.

What I could get from the redirect URL is the first question in the thread: **"any other advantage of cloudflare agent sdk other than rich cloudflare integration ?"** The AI answer and any follow-up questions are behind the CAPTCHA, and I'm not going to try to solve or bypass it myself.

To unblock it, either:
- **Solve the CAPTCHA** in the Chrome tab I opened. It's already on that page. Then tell me and I'll take a snapshot and pull out the full conversation.
- **Or copy the page text** and paste it here, and I'll format it.

needs input: solve the Google reCAPTCHA in the open Chrome tab, or paste the conversation text here, so I can extract the whole conversation.

### 3 · **user:**

<pasted_content id="d48c">
User: any other advantage of cloudflare agent sdk other than rich cloudflare integration ? Assistant: Beyond its ecosystem ties, the biggest advantage of the Cloudflare Agents SDK is its actor-model architecture that bundles compute, persistent SQLite memory, and real-time networking into a single hibernating unit.

Most frameworks (like LangGraph or the OpenAI SDK) are strictly orchestration libraries—they expect you to bring your own server, database, WebSocket layer, and cron runner. Cloudflare flips this by acting as a stateful runtime environment:

Zero-Cost Idle Hibernation: Pay-per-action economics. Each agent instance runs as a Durable Object, automatically sleeping when idle and waking up in milliseconds. You can spin up millions of isolated agents and pay nothing while they wait for input.
Zero-Latency Local State & Automatic Sync: Every agent gets its own private SQLite database co-located with its compute, eliminating network round-trips to external databases. this.setState() automatically persists data and broadcasts updates to frontend clients.
Native "Multiplayer" & Resumable Streaming: Built-in WebSockets allow multiple users to connect to the same agent simultaneously. The SDK natively handles reconnecting and resuming text streams if a connection is lost.
Proactive Execution: Agents can set their own alarms (schedule, scheduleEvery) to wake up later for follow-ups. It includes built-in task queuing and retries, removing the need for external brokers like SQS.
Dual-Mode MCP & Framework Agnosticism: Agents can consume and expose themselves as MCP servers. You can also run other libraries (Vercel AI SDK, LangGraph) inside a Cloudflare Agent to give them persistence.
Trade-Off: Architectural lock-in to Cloudflare's runtime and a focus on TypeScript/JavaScript rather than Python.

---
User: what if i host any other sdk agent? Assistant: Hosting other SDKs (LangGraph, Vercel AI SDK, OpenAI) on standard infrastructure requires manually assembling separate state, networking, and scheduling layers that Cloudflare bundles automatically.

Infrastructure Tax: You must wire up external memory (Redis/Postgres), a custom real-time layer for WebSockets (Ably/Pusher), and separate cron/queues (EventBridge/BullMQ).
Idle Compute vs. Cold Starts: You either pay for 24/7 compute for always-on containers or suffer from cold starts and database reloading in standard serverless environments.
Hybrid Option: You can run other SDKs inside Cloudflare's stateful host wrapper. Use Cloudflare for WebSocket management and SQLite storage, while calling streamText() from Vercel's SDK or using LangGraph for routing.
---
User: can i use cloudflare worker for non-cloudflare agent sdk and still get the sleep behavior when idle ? Assistant: Yes, you can get zero-cost sleep behavior by using Durable Objects or Cloudflare Workflows rather than plain Workers.

Plain Workers: Stateless and event-driven. They sleep when not processing requests, but you must connect external databases for history and cannot use built-in scheduling.
Workers + Durable Objects: The engine behind the Agents SDK. You can instantiate your own SDK inside a Durable Object to get stateful hibernation, though you'll have to write the boilerplate for WebSockets and SQLite manually.
Cloudflare Workflows: Best for long-running background agents. step.sleep() or step.waitForEvent() suspends execution with zero compute cost.
---
User: so cloudflare agent sdk is build on durable workflow? Assistant: No, it is built primarily on Durable Objects (specifically SQLite-backed ones).

Durable Objects: The "brain" and "memory" for interactive, stateful entities.
Workflows: A complementary tool for linear, fault-tolerant background pipelines (e.g., scraping 50 sites) that an agent can trigger.
---
User: what are some example usecases the differentiates DO and workflows for agents (cloudflare agent sdk) Assistant:

Durable Objects (Agents SDK): Best for real-time interactivity and user presence.
Example: A real-time collaborative AI assistant in a shared doc where multiple users connect via WebSockets.
Example: A personal habit coach that schedules daily morning check-ins.
Cloudflare Workflows: Best for multi-step pipelines that need fault tolerance or long pauses.
Example: Deep research agents that must survive crashes during long batch processes.
Example: Human-in-the-loop approval processes that wait days for a manager's click.
Hybrid Pattern: A DO Agent handles the chat interface and triggers a Workflow for heavy-duty background processing.

---
User: DO is good enough for conversations, workflows are for graphs Assistant: Spot on. Durable Objects are for Stateful Conversations & Live Sessions, while Workflows are for Durable Execution Graphs (DAGs) that need retries and checkpoints.

One Nuance: If your "graph" is a dynamic, unpredictable loop (like an agent deciding tools on the fly), it often fits better inside a Durable Object. Workflows are better for structured, deterministic sequences.
</pasted_content id="d48c">

### 4 · **assistant:**

This second paste is the thread the link pointed to: 6 back-and-forths on **the Cloudflare Agents SDK**. Cleaned up below.

---

**1. Any advantage of the Agents SDK beyond Cloudflare integration?**
The main one is the **actor model**. Compute, a SQLite database and real-time networking come bundled in one unit that sleeps when idle. LangGraph and the OpenAI SDK only orchestrate, so you bring the server, database, WebSockets and cron yourself.
- **Free while idle:** each agent is a Durable Object that sleeps when idle and wakes in milliseconds. You can have millions of agents and pay nothing while they wait.
- **Local state:** each agent has its own SQLite database next to its compute. `this.setState()` saves the state and pushes it to clients.
- **Multiplayer and resumable streams:** several users can connect over WebSockets, and a dropped stream picks up where it left off.
- **Agents can wake themselves:** `schedule` / `scheduleEvery` set alarms, with built-in queuing and retries, so you don't need SQS.
- **MCP both ways, and other frameworks work inside it:** an agent can use MCP servers or be one. You can also run the Vercel AI SDK or LangGraph inside an agent to give it persistence.
- **Trade-off:** you're tied to Cloudflare's runtime, and it's TypeScript/JS first, not Python.

**2. What if I host an agent built with another SDK?**
- **You build the infrastructure yourself:** Redis or Postgres for memory, Ably or Pusher for WebSockets, EventBridge or BullMQ for cron and queues.
- **Always-on vs cold starts:** you either pay for always-on containers or put up with cold starts and reloading state.
- **Hybrid:** run the other SDK inside Cloudflare. Cloudflare handles WebSockets and SQLite; the Vercel SDK's `streamText()` or LangGraph handles the logic.

**3. Can a Worker host another SDK and still sleep when idle?**
Yes, but use Durable Objects or Workflows, not plain Workers:
- **Plain Workers:** stateless. You need an external database and get no built-in scheduling.
- **Workers + Durable Objects:** the engine behind the Agents SDK. You get sleep-with-state, but you write the WebSocket and SQLite code yourself.
- **Workflows:** for long-running background agents. `step.sleep()` and `step.waitForEvent()` pause the agent at no compute cost.

**4. Is the Agents SDK built on Workflows?**
No. It's built on **SQLite-backed Durable Objects**. A Durable Object is the agent's brain and memory. Workflows are a separate tool for fault-tolerant pipelines that an agent can kick off.

**5. Example use cases: Durable Objects vs Workflows**

| Durable Objects (Agents SDK) | Workflows |
|---|---|
| Real-time, users connected live | Multi-step, crash-safe, long pauses |
| Shared-doc AI assistant over WebSockets | Deep research agent that survives crashes |
| Habit coach with daily check-ins | Human approval that waits days |

**Hybrid:** a Durable Object agent runs the chat and starts a Workflow for heavy background work.

**6. "Durable Objects for conversations, Workflows for graphs"?**
Spot on: Durable Objects for live, stateful sessions; Workflows for fixed graphs that need retries and checkpoints.
- **Caveat:** a dynamic agent loop, where the model picks tools as it goes, usually fits better in a Durable Object. Workflows suit structured, predictable steps.

---

I only tidied the wording and added nothing new. Not saved to a file; I can save both threads together as one markdown file if you want.

result: Cleaned up the 6-part Google AI Mode conversation on the Cloudflare Agents SDK (built on Durable Objects; Durable Objects for conversations, Workflows for graphs); this is the thread the share link pointed to.

### 5 · **user:**

<pasted_content id="d48c">
The conversation from the "AI Mode" section of the page has been extracted. Here are the threads in Markdown format:

---
Thread 1
User: cloudflare computer vs sandbox AI: Cloudflare Sandboxes are isolated Linux container environments for running untrusted code, shells, and dev servers, whereas Cloudflare Computer is a stateful virtual filesystem backed by SQLite inside a Durable Object that can plug into multiple execution backends—including a sandbox container, a JS isolate, or a shell.

Core Differences:

Primary Purpose: Cloudflare Sandboxes provide full container execution for AI agents. Cloudflare Computer acts as a durable workspace and virtual filesystem.
State & Persistence: Sandboxes rely on container filesystems. Cloudflare Computer stores authoritative state in Durable Object SQLite.
Execution Runtimes: Cloudflare Sandboxes run in isolated container/VM environments. Cloudflare Computer exposes a unified execution interface supporting sandbox containers, isolate shells, or isolate JavaScript.
---
Thread 2
User: why 2 diffrernt ? AI: Cloudflare offers two separate tools because running a full Linux container for every simple agent step is too slow and expensive, while lightweight JavaScript isolates cannot run full operating system tools. They solve two opposite sides of an engineering trade-off: speed and cost vs. full OS capabilities.

The Problem with Using Only Sandboxes: Cold starts and cost are higher; booting a full VM is wasteful for simple tasks like reading a file.
The Problem with Using Only Isolates: No real Linux environment, filesystem, bash shell, or Python interpreter.
How They Work Together:

Computer: Keeps files permanently in a fast Durable Object database.
Sandbox: Attaches a full Linux container to that same filesystem for heavy tasks (compiling C++, running git) and shuts down when finished.
---
Thread 3
User: computer is just DO based vfs on worker AI: Essentially, yes. At its core, Cloudflare Computer is a Durable Object–backed Virtual Filesystem (VFS) paired with a pluggable execution router. It adds three specific pieces of glue:

FUSE Mount Daemon (computerd): Syncs the DO SQLite filesystem into a real Linux directory inside a Sandbox.
In-Isolate Runtimes: Bundles just-bash and Dynamic Worker loaders for running code directly against the VFS.
Unified workspace API: Provides a single interface (workspace.fs and workspace.runtime) regardless of the backend.
---
Thread 4
User: which tasks on sandbox and which on computer AI:

Task Type    Where to Run    Why
File operations (grep, cat)    Computer (Isolate)    Zero container boot time.
Simple shell scripting    Computer (Isolate)    Handled via just-bash.
Python, Go, Rust, C++    Sandbox (Container)    Requires real language runtimes/compilers.
Background servers    Sandbox (Container)    Needs long-running processes and open ports.
---
Thread 5
User: non cloudflare runtime workloads on sandbox isolate compatible workloads on computer AI: Yes, that is the exact architectural rule of thumb.

Cloudflare Computer: Isolate-compatible (JS, TS, Wasm, pure-JS tools).
Cloudflare Sandbox: Non-Cloudflare runtimes (Python, Go, Rust, native Linux binaries).
---
Thread 6
User: coding agents with editing can use computer AI: Yes, coding agents are the primary use case. ~80% of a coding agent's turns (reading files, searching code, applying edits) can run completely inside Computer. This provides instant exploration, fast edits, and eliminates "idle container burn" while the LLM is thinking.

---
Thread 7
User: the vfs can be added to sandbox ? AI: Yes—that is how they connect. You can mount the Durable Object SQLite VFS directly into a Sandbox via:

Live FUSE Mount (computerd): A daemon inside the Sandbox mounts the VFS at /workspace.
On-Demand File Sync (remote-exec): Syncs files in before execution and out after completion.
This ensures files survive container restarts and sleep cycles automatically.
</pasted_content id="d48c">

### 6 · **assistant:**

Here's the conversation you pasted, cleaned up: 7 back-and-forths about **Cloudflare Computer vs Cloudflare Sandbox**.

One mismatch: the link's URL showed a different question, "any other advantage of cloudflare agent sdk…". That question isn't in this paste. It may be a separate thread on that page, or the paste came from another share link.

---

**1. Cloudflare Computer vs Sandbox?**
- **Sandbox:** an isolated Linux container for untrusted code, shells and dev servers. Its state lives in the container's filesystem.
- **Computer:** a virtual filesystem kept in SQLite inside a Durable Object. Its state is permanent. It can run code through several backends: a sandbox container, a JS isolate, or a shell.

**2. Why two different products?**
- Speed and cost vs full OS. Starting a container for every agent step is slow and expensive.
- Isolates are fast but can't run a real OS: no bash, Python or compilers.
- They work together: Computer keeps the files. Sandbox attaches for heavy work (C++, git), then shuts down.

**3. "So Computer is just a Durable Object VFS on Workers?"**
Basically yes. On top of the filesystem it adds three pieces:
- `computerd`: a FUSE daemon that mounts the filesystem as a real directory inside a Sandbox.
- Runtimes that run inside the isolate: `just-bash` and Dynamic Worker loaders.
- One API, `workspace.fs` / `workspace.runtime`, whatever the backend.

**4. Which tasks go where?**

| Task | Where | Why |
|---|---|---|
| File operations (grep, cat) | Computer (isolate) | No container start-up time |
| Simple shell scripting | Computer (isolate) | Handled by `just-bash` |
| Python / Go / Rust / C++ | Sandbox | Needs real runtimes and compilers |
| Background servers | Sandbox | Needs long-running processes and open ports |

**5. Rule of thumb: anything that needs a real OS runtime → Sandbox; anything that runs in an isolate → Computer?**
Yes, that's the rule of thumb. Computer handles JS, TS, Wasm and pure-JS tools. Sandbox handles Python, Go, Rust and native Linux binaries.

**6. Can coding agents that edit files use Computer?**
Yes, that's the main use case. About 80% of an agent's turns (reading, searching, editing) can run in Computer. That makes those steps instant and avoids paying for an idle container while the model is thinking.

**7. Can the VFS be added to a Sandbox?**
Yes, in two ways:
- **Live FUSE mount** (`computerd`): mounts the filesystem at `/workspace`.
- **On-demand sync** (`remote-exec`): copies files in before running and back out after.

Either way, the files survive container restarts and sleep.

---

I tidied the wording but didn't add anything to the content. I haven't saved it to a file; I can if you want one.

result: Cleaned up the 7-part Google AI Mode conversation on Cloudflare Computer vs Sandbox; the agent-SDK question from the link's URL isn't in the paste.
