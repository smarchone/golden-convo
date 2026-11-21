---
schema: 1
id: 2026-11-21-cloudflare-computer-vs-sandbox
title: "Cloudflare Computer vs Sandbox: a DO-backed VFS for isolate work, containers only for real OS runtimes"
why: Computer is just a DO SQLite VFS that agents edit in isolates for ~80% of turns; Sandbox mounts that same VFS only when a real Linux runtime is needed.
why_source: suggested
harness: claude-code
harness_version: 2.1.330
model: claude-opus-5-5
session_id: 5ba52a5a-0949-4131-a54e-c19e4dd7bfc9
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/5ba52a5a-0949-4131-a54e-c19e4dd7bfc9.jsonl
started: "2026-11-21T10:04:24.396Z"
captured: "2026-11-21T10:43:48Z"
cwd: ~/Documents/proj/claude/spark/ideas
turns: 2
complete: true
golden_turns: [2]
labels: [agents, platforms, system-design, agent-runtime]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

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

### 2 · **assistant:**

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
