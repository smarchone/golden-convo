---
schema: 1
id: 2026-11-21-cloudflare-agents-sdk-do-vs-workflows
title: "Cloudflare Agents SDK: hibernating actors on Durable Objects; DOs for conversations, Workflows for graphs"
why: The Agents SDK's real edge isn't integration — it's a hibernating actor (compute + SQLite + WebSockets) that idles for free; DOs carry conversations, Workflows carry deterministic graphs.
why_source: suggested
harness: claude-code
harness_version: 2.1.330
model: claude-opus-5-5
session_id: 5ba52a5a-0949-4131-a54e-c19e4dd7bfc9
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/5ba52a5a-0949-4131-a54e-c19e4dd7bfc9.jsonl
started: "2026-11-21T10:04:24.396Z"
captured: "2026-11-21T10:43:32Z"
cwd: ~/Documents/proj/claude/spark/ideas
turns: 4
complete: true
golden_turns: [4]
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
