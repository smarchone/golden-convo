---
schema: 1
id: 2026-10-11-docker-agent-runtime-for-simple-agents
title: Docker Agent (cagent) is an agent runtime + harness for simple, tool-heavy agents, not a workflow engine
why: Docker Agent = stop stitching an agent from scratch every time; great for simple tool-heavy agents, wrong tool for complex workflows.
why_source: suggested
harness: claude-code
harness_version: 2.1.296
model: claude-sonnet-5-5
session_id: c92f6d05-b8bd-4ae7-893d-f86c03b2d77c
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/c92f6d05-b8bd-4ae7-893d-f86c03b2d77c.jsonl
started: "2026-10-11T00:31:34.131Z"
captured: "2026-10-13T05:29:59Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:origin-story"
turns: 24
complete: true
golden_turns: [8, 18, 22, 24]
labels: [agents, agent-runtime, origin-story]
status: raw
---

### 1 · **user:**

/origin-story docker agents

### 2 · **assistant:**

[ran: WebSearch — Docker cagent multi-agent runtime announcement origin Docker Agent]
[ran: WebSearch — docker/cagent GitHub first commit David Gageot Djordje Lukic agent builder runtime]

# Docker agents (cagent → "Docker Agent") — origin story
An open-source, Docker-native runtime where agents and agent teams are declared in YAML and shipped as OCI artifacts · public Sept 2025 · Docker, Inc.

I read "docker agents" as **cagent**, which some sources now call "Docker Agent." I did not fetch the GitHub history or Docker's blog, so the first commit, who started it, and the rename date are unknown. Everything below comes from search snippets or is my inference, and I've marked which.

## TL;DR
- **Pitch:** Docker already packaged apps as images. Its bet was that agents could use the same workflow: write a file, `run` it, `push` it to Hub, `pull` it elsewhere. *(inference from the product shape)*
- **Aha:** An agent is config, not code. The model, instructions, sub-agents and tools (MCP servers) live in one YAML file. The runtime is a Go binary, and Docker's registry and tooling handle distribution.

## Before → After
| Before (how the world coped) | After (what it made possible) |
|---|---|
| Agent = Python/TS app on LangChain, CrewAI or AutoGen, with a bespoke repo and deps per agent | One YAML file; the same `cagent run` binary runs every agent |
| Sharing an agent meant sharing a repo plus env setup | `cagent push` / `pull` through Docker Hub as an OCI artifact |
| Each framework wired MCP tools its own way | Tools are declared as MCP servers, which can come from Docker's MCP catalog |
| Multi-agent meant writing the orchestration yourself | A root agent with declared sub-agents delegates to them |
| Cloud models only, or hand-rolled local inference | Local models through Docker Model Runner, or any hosted provider *(inference)* |

## The Catalyst Problem
- By 2025 MCP had become the common tool-calling protocol. The agent frameworks sitting on top of it were Python-heavy, each with its own packaging story.
- Docker's real pain was relevance. Its core product was commoditized, and the AI-era question was "what does Docker do for agents?"
- It answered with a stack: Model Runner (local LLMs), MCP Catalog and Toolkit (containerized MCP servers), Compose support for models and agents, and cagent as the agent layer on top.
- The people I can confirm: Djordje Lukic (Principal Software Engineer at Docker) discussed cagent as Docker's open-source agent builder and runtime. David Gageot (`dgageot`) authored many early merged PRs ([release notes](https://newreleases.io/project/github/docker/cagent/release/v1.19.5)). Whether either started it is **unknown**.

## Lineage
- **Borrowed from:**
  - Docker's own model of images and registries, applied to agents.
  - Compose-style declarative YAML.
  - MCP as the tool interface.
- **Tried before:** Declarative or low-code agent attempts such as LangFlow, Flowise and CrewAI's YAML configs. I'm not claiming a specific failure story for them.
- **Why then:** MCP standardized tools, local models became usable through Model Runner, and agents became a mainstream developer workflow. Docker also had a distribution channel (Hub and Desktop) that competitors lacked.

## v0.1 (Duct-Tape)
- Unknown in detail. What's verifiable is that it went public around early Sept 2025. The [Landscape listing](https://landscape.jimmysong.io/projects/cagent/) shows 2025-09-01, and the first AUR package was submitted 2025-09-04.
- It is Go, and was labeled experimental. It later shipped with Docker Desktop 4.49+ ([Chaganti intro](https://ravichaganti.com/blog/docker-cagent-an-introduction/)).
- It also appeared as a published `docker/cagent` image on Docker Hub.

## Mental Model
- **Abstractions:**
  - **Agent:** model, instruction, toolsets.
  - **Team:** a root agent plus its sub-agents.
  - **Toolset:** a built-in (shell, filesystem, todo, memory/think) or an MCP server.
  - **Model:** a provider alias, such as OpenAI, Anthropic, Gemini or Docker Model Runner.
  - **Artifact:** the agent YAML pushed to a registry as OCI.
- **Guarantees:**
  - A declarative, reproducible agent definition.
  - A uniform way to run and share agents.
  - Tools isolated as containers when you use MCP via Docker.
- **Non-guarantees:**
  - No deterministic workflows. It is an LLM-driven loop, not a DAG engine.
  - No durable-execution semantics.
  - Not a framework for custom control flow, which is the trade for not writing code.
- **Think of it as:** `docker-compose.yml` for LLM agents, with Hub as the app store.

## Key Design Decisions
| Chose | Over | Because |
|---|---|---|
| YAML config | A Python/TS SDK | Lower barrier, language-agnostic, and shareable as plain data |
| OCI artifacts on Hub | A new registry or format | Reuses existing infra, auth and the user's muscle memory |
| MCP for tools | Proprietary plugins | Ecosystem leverage, plus Docker's own MCP catalog |
| Single Go binary | A Python runtime | Easy to bundle into Desktop and no dependency hell |
| Multi-provider models | A single vendor | Fits Docker's neutral-infrastructure positioning |

*(The "because" column is my inference from the design.)*

## Ecosystem Fit
```
Upstream:    MCP spec · Docker MCP Catalog/Toolkit · Docker Model Runner · Hub (OCI)
Runtime:     cagent / Docker Agent  (Go, YAML)  ← bundled in Docker Desktop
Downstream:  Teams sharing agents via Hub · Compose for deploying agent stacks
Competitors: CrewAI · LangGraph · AutoGen · OpenAI Agents SDK · Google ADK
Adjacent:    Claude Code / Codex style coding agents (cagent can be an alternative harness)
```

**Open questions:** the first commit and author, the exact reason for the rename to "Docker Agent," and Docker's internal motivation. Check `git log --reverse` on github.com/docker/cagent and Docker's launch blog post.

Sources: [Buttondown repost](https://buttondown.com/nuno/archive/docker-cagent-runtime-for-ai-agents) · [Chaganti intro](https://ravichaganti.com/blog/docker-cagent-an-introduction/) · [Docker blog (ja)](https://www.docker.com/ja-jp/blog/cagent-build-and-distribute-ai-agents-and-workflows/) · [Landscape](https://landscape.jimmysong.io/projects/cagent/) · [Collabnix](https://dockerlabs.collabnix.com/docker-workshop/lab10/overview)

---
*Say **more** for: timeline & key people · evolution · major incidents & lessons. If you meant Docker Sandboxes for coding agents, or the Model Runner and MCP Toolkit stack, tell me and I'll redo it.*

### 3 · **user:**

what kind of agents are these ?

### 4 · **assistant:**

They're **LLM-driven tool-calling agents**: a model in a loop that reads instructions, decides which tool to call, observes the result, and repeats until done. cagent is a runtime for that loop, not a new kind of agent. This is from my general knowledge of cagent's design. I haven't verified it against the repo.

**Type**
- **Not workflow or DAG agents.** There are no fixed steps or branches. The model chooses the control flow each turn.
- **Not autonomous long-running services.** They're mostly interactive or one-shot: a TUI chat session, `cagent run`, or an API/MCP server mode. There's no durable state, scheduler or resume-after-crash.
- **Closest relatives** are Claude Code, Codex and Aider-style coding agents, and CrewAI's role-based crews. It sits between those, with a harness you configure instead of code.

**Anatomy of one agent (YAML)**
- `model`: provider and model, such as Anthropic, OpenAI, Gemini or a local Docker Model Runner model.
- `instruction`: the system prompt, which defines the role.
- `toolsets`: built-ins (shell, filesystem, todo, think, memory) plus MCP servers, often containerized through Docker's MCP catalog.
- `sub_agents`: other agents it can delegate to.

**Multi-agent shape**
- It's a **hierarchy, not a swarm.** A root agent receives the task and hands pieces to specialist sub-agents, for example a "developer" and a "researcher." Each has its own model, prompt and tools, and results come back up.
- The main benefit is separate contexts and tool scopes per role, which keeps prompts small and limits what each agent can touch.

**Typical uses**
- Coding helpers that read and edit a repo and run shell commands.
- Research or summarizing agents backed by MCP tools (GitHub, web fetch, databases).
- Internal "persona" agents shared across a team through Hub.

**Limits to expect**
- Shell and filesystem tools run with whatever access the process has, so safety depends on sandboxing and approval prompts. This is why Docker also pushes containers and Sandboxes around it.
- Reliability is that of the model's tool loop. There are no guarantees about step order or retries.

If you want a concrete example, I can write a small multi-agent YAML or check the repo for the exact config schema.

### 5 · **user:**

what about skills

### 6 · **assistant:**

[ran: WebSearch — docker cagent skills SKILL.md agent skills support]

Yes. Docker Agent (cagent) supports the open `SKILL.md` format, the same one Claude Code uses. This comes from search snippets of Docker's docs. I haven't read the full pages or tried it.

**How it works**
- A skill is a directory with a `SKILL.md` file that says when and how to use it. It can also hold references and assets.
- The runtime scans standard skill directories and puts only each skill's **name and description** into the system prompt. It reads the full body only when a request matches. This is progressive disclosure, which keeps context small.
- You turn skills on per agent with `skills: true`. The agent also needs a **filesystem toolset**, because loading a skill is just reading its files.
- `skills` can also take a list, which limits the agent to a named subset.
- Inline skills can be defined directly in the agent YAML. They can't bundle supporting files (no `read_skill_file`) and can't use `` !`command` `` expansion. If a skill needs scripts or reference files, use a real directory.

**Skills vs the other pieces**

| Piece | What it adds | When it loads |
|---|---|---|
| `instruction` | The agent's role and standing rules | Always in context |
| Toolset / MCP | New capabilities (actions) | Tool schemas are always present |
| **Skill** | Procedural know-how, such as a runbook, conventions or a workflow | On demand, when the description matches |
| Sub-agent | A separate context, model and tool scope | When the parent delegates |

Skills are for **knowledge and procedure**, not capability. They need no server or code, and they're portable across Claude Code, Docker Agent and other tools that read the format. The cost is that they rely on the model matching the description well, so a vague description means the skill never fires.

**Docker Skills:** Docker also publishes a separate official collection of skills for coding agents. Those are Docker-related skills (for example, working with Docker itself), not part of the runtime.

Sources: [Docker Agent skills docs](https://docs.docker.com/ai/docker-agent/features/skills/) · [Docker Skills](https://docs.docker.com/ai/skills/) · [Mintlify mirror](https://www.mintlify.com/docker/docker-agent/features/skills)

I can fetch the docs page for the exact config syntax and skill search paths if you want them.

### 7 · **user:**

so docker agent is an agent sdk packaged in docker eco system

### 8 · **assistant:**

Mostly yes, with one correction: it's closer to an **agent runtime plus harness** than an SDK.

**Why "SDK" is only partly right**
- An SDK (OpenAI Agents SDK, Claude Agent SDK, ADK) is a library you import and write control flow around. Docker Agent is a **binary you configure**. The YAML is the whole program, and you rarely write code.
- It's closer to Claude Code than to the Claude Agent SDK. You get a ready-made loop, TUI, tool handling, skills and MCP, and you configure it instead of building it.
- Some embedding is possible, since it's Go and has API and MCP server modes. I haven't verified how polished that is, so treat it as a secondary use.

**What makes it "Docker ecosystem" and not just another harness**
- **Distribution:** an agent's YAML is pushed and pulled through OCI registries like Docker Hub.
- **Tools:** MCP servers run as containers via Docker's MCP Catalog and Toolkit, which gives isolation and one-line install.
- **Models:** it can use local models through Docker Model Runner, or hosted providers.
- **Packaging:** it ships with Docker Desktop and runs in containers or Sandboxes.

**One-line summary:** a declarative agent harness whose differentiator is packaging and distribution through Docker's existing infrastructure. The agent loop itself is not novel, and the registry, container isolation and catalog are the part Docker adds.

**Picking one**
- You want custom control flow, evals or embedding in your own service: use an SDK.
- You want to define, share and run agents without writing code: use Docker Agent.

### 9 · **user:**

what does cagent contain ? agent loop, graph, harness ??

### 10 · **assistant:**

[ran: WebFetch — https://github.com/docker/cagent]

**Short answer:** it has an agent loop and a harness. I found no evidence of a graph. The README confirms the user-facing pieces. The internals below are my general understanding, not verified, because the README doesn't cover the loop or `pkg/` layout.

**Confirmed by the README**

| Layer | What's there |
|---|---|
| Config | YAML (`agent-schema.json`) with `model`, `description`, `instruction`, `toolsets` |
| Models | OpenAI, Anthropic, Gemini, Bedrock, Mistral, xAI, Docker Model Runner |
| Tools | Built-in think, todo and memory tools, plus any MCP server (local, remote, or Docker-based like `docker:duckduckgo`) |
| Multi-agent | Teams where agents delegate to specialists |
| RAG | Pluggable retrieval: BM25, embeddings, hybrid search, reranking |
| Packaging | Push and pull of agents to OCI registries; runs as a `docker agent` CLI plugin |
| Frontends | TUI, CLI, MCP mode (it can expose agents as an MCP server) |
| Repo | Go: `cmd/`, `pkg/`, `examples/`, `e2e/`, `.agents/skills/` |

**Your three terms**
- **Agent loop: yes.** This is the standard cycle of calling the model, executing the tool calls it returns, appending results and repeating until the model stops. Every tool-using agent runtime has it.
- **Harness: yes, and this is most of the product.** The harness is everything around the loop: the TUI, tool and MCP wiring, skills, memory, RAG, permission or approval prompts, and model-provider abstraction.
- **Graph: no evidence.** Delegation is the only orchestration the README mentions. As I understand it, a parent agent calls a delegation tool and a sub-agent runs in its own context. That is a tree of tool calls, not a LangGraph-style state graph with nodes, edges, checkpoints and conditional routing. It is dynamic, with the model deciding, not a declared topology.

**Not verified**
- The loop's actual implementation, including streaming, retries and context compaction.
- The name and semantics of the delegation tool. I believed it was `transfer_task` but couldn't confirm it.
- Session persistence.
- Whether any workflow or sequential-pipeline mode exists. Check the Multi-Agent and configuration reference pages before assuming not.

To settle the internals, read `pkg/` in the repo. I can dig in and map the loop, runtime and delegation code if you want.

### 11 · **user:**

what kind of agents can i build ? what are the business usecases it can fit ? where does it not fit ?

### 12 · **assistant:**

This is my judgment from the architecture we've covered (LLM-driven loop, YAML config, MCP tools, skills, RAG, sub-agent delegation, OCI distribution). I haven't tested these against Docker Agent, so treat the fit calls as reasoned, not proven.

## Agents you can build
| Type | How it maps |
|---|---|
| **Coding/repo agent** | Filesystem and shell toolsets, plus skills for your repo conventions |
| **Research/summarizer** | Web/fetch MCP, RAG over docs, a "writer" sub-agent |
| **Ops/DevOps assistant** | MCP for GitHub, Kubernetes, cloud CLIs, Docker itself |
| **Knowledge Q&A** | RAG (BM25, embeddings, rerank) over internal docs |
| **Triage/router** | A root agent that classifies and delegates to specialists |
| **Persona/role teams** | A lead, a reviewer and a tester, each with its own prompt and tool scope |
| **Tool-exposing agent** | MCP mode, so other agents or IDEs call your agent as a tool |

## Business use cases that fit
- **Internal developer productivity:** PR review, test generation, migration helpers, release notes. Agents are shared as one pullable artifact, so teams get identical setups.
- **Support and ops runbooks:** an on-call helper that reads logs through MCP and follows a runbook skill, with a human running or approving it.
- **Internal knowledge assistants:** HR, policy, or engineering-docs Q&A via RAG.
- **Analyst-style research:** competitive or vendor scans with a human reviewing output.
- **Agent distribution inside an org:** a platform team publishes vetted agents to a private registry and everyone else runs them. This is where the Docker packaging is a real advantage.
- **Prototyping:** testing an agent idea in an afternoon before deciding whether it deserves real code.

The common thread is **human-in-the-loop, interactive, tolerant of imperfect output, tool-heavy, and low on custom logic.**

## Where it doesn't fit
- **Deterministic business workflows:** order processing, approvals, ETL. The model picks the control flow, and there is no graph or step guarantee. Use a workflow engine (Temporal, Airflow, LangGraph) and call an LLM inside steps.
- **Durable, long-running, or scheduled agents:** I saw no checkpoint, resume-after-crash or queue semantics. Hours-long jobs and retries are your problem.
- **High-volume customer-facing serving:** multi-tenant auth, rate limiting, per-user state, SLAs, and evals aren't what a CLI-style runtime is for. You'd be building a product around it.
- **Custom control flow or tight integration:** branching on structured outputs, parallel fan-out and reduce, or embedding in an existing service. An SDK fits better.
- **Strict compliance or high-stakes actions:** shell and filesystem access plus an LLM needs sandboxing, approval gates and audit logging. Check what's built in before relying on it.
- **Cost- or latency-critical paths:** the loop makes many model calls, so cost and latency are unpredictable.
- **Evals and regression testing:** I didn't see first-class tooling for this (unverified). If you need measured reliability, you'll build it yourself.

## Rule of thumb
Use it when the agent's value is **a good prompt, the right tools, and easy sharing**. Don't use it when the value is **guaranteed process, state, or scale**.

I can sketch one concrete agent for a specific use case, or compare it directly to LangGraph or the Claude Agent SDK for your case.

### 13 · **user:**

so each agent supports a single session. subagents talk to each other via a2a

### 14 · **assistant:**

I can't confirm either claim, and the second one probably doesn't match how it works.

**"Sub-agents talk via A2A": probably not**
- As I understand it, sub-agents in a team run in the **same process**. The parent calls a delegation tool, the runtime runs the child agent's loop with its own prompt, model and tools, and the result comes back as a tool result. That's an internal function call, not a network protocol.
- A2A (Agent2Agent) is for **separate agents, possibly from different vendors, talking over HTTP**. It isn't needed between sub-agents inside one runtime.
- Docker Agent may also have an A2A *server* mode, so an agent can be exposed to outside A2A clients. I have a vague recollection of this, but I haven't verified it, and neither the README nor the searches confirmed it. Even if it exists, it would be how the outside world calls your agent, not how its sub-agents talk to each other.
- Sub-agents don't talk to each other peer-to-peer either. As I understand it, all communication goes through the parent: the parent sends a task down and gets a result back. That's a hierarchy, not a mesh.

**"Each agent supports a single session": also unverified**
- I don't know the session model. What I can say is that the TUI and `run` modes are session-oriented, with a conversation history per run.
- Whether one running agent can serve several concurrent sessions (for example in its API or server mode), or whether sessions persist across restarts, is something I haven't seen documented. The README doesn't cover it.
- A sub-agent probably gets its own context for the duration of a delegated task. Whether that context persists across multiple delegations isn't something I know.

**To settle both**
- Session and persistence: look for session handling in `pkg/` and the CLI/API docs.
- Delegation: look at the Multi-Agent docs and the delegation tool's implementation.
- A2A: search the repo for `a2a`.

I can do that and report what the code shows, which would be more reliable than my recollection.

### 15 · **user:**

but it seems way easier to deploy

### 16 · **assistant:**

For getting an agent running on other machines, yes. For running it as a production service, only partly.

**Where it is easier**
- **Packaging:** the agent is a YAML file, and `push`/`pull` through a registry replaces writing a repo, a Dockerfile and dependency pins.
- **No runtime to manage:** it's a single Go binary that ships with Docker Desktop, so there's no Python environment or version conflicts.
- **Tools:** MCP servers come as containers from the catalog, so there's no per-tool install.
- **Reuse of what you already have:** your registry, auth, CI and Docker habits all apply.
- **Time to first agent:** minutes, because you configure and don't code.

So the claim holds for distribution and for a developer or team running agents interactively.

**What "easy to deploy" doesn't cover**
- **Serving:** running it as an always-on service means you choose the hosting, networking, and auth in front of it. Whether it handles concurrent users per process is the session question we left open.
- **State:** memory, history and session storage need to survive restarts and scale out, and I haven't verified how it handles that.
- **Secrets and access:** API keys, MCP credentials and shell or filesystem permissions are yours to manage, along with the sandboxing around them.
- **Operations:** logs, tracing, cost tracking, evals and rollback of a bad prompt change aren't things the packaging gives you.
- **Reliability:** deploying is easy, but the agent still behaves like an LLM loop. Packaging doesn't make output deterministic.

**Summary:** it lowers the cost of *shipping and running* an agent, which is where SDK-based agents usually hurt most. It doesn't lower the cost of *operating* one at scale. If the plan is for people on your team to run shared agents, that gap may not matter. If it's a customer-facing service, expect to build the surrounding platform.

### 17 · **user:**

the tag line should be like : lets not figure out stitching an agent from scratch every time

### 18 · **assistant:**

That framing works. It names the real pain, which is rebuilding the same loop, tool wiring, model switching, packaging and sharing for every agent. It also fits the Docker precedent, where nobody rewrites how to run a process each time.

**Tightened options**
- **"Stop re-stitching agents from scratch."** This is closest to your wording.
- **"Agents as config, not glue code."** This says the mechanism.
- **"Write the agent, not the plumbing."** This is the shortest.
- **"`docker run`, but for agents."** This is the Docker-native pitch, though it overclaims on isolation and determinism.

**Two cautions**
- "From scratch" is the key phrase. The claim is that the harness (loop, tools, skills, MCP, packaging) is solved once. It doesn't claim the agent's behavior, reliability or operations are solved. If the tagline implies the latter, it will disappoint the engineers you're pitching to.
- It's accurate for the "configure and share" case. For custom control flow, state or scale, people will still stitch things themselves, as we covered.

For the origin-story format, I'd use this for the **Pitch** line: *"Wouldn't it be interesting if every agent didn't need its loop, tool wiring and packaging rebuilt from scratch, and an agent were just a file you could pull and run?"* That's my framing, not a quote from Docker.

### 19 · **user:**

can i make a data analyst agent ?

### 20 · **assistant:**

Yes, it fits the "interactive, tool-heavy, human reviews output" profile. The main design question is how the agent runs queries and code safely.

**How you'd build it**
- **Data access via MCP:** use a database MCP server (Postgres, SQLite, BigQuery, Snowflake or similar) for schema inspection and queries. Prefer a **read-only** credential.
- **Computation:** SQL covers most analysis. For pandas, charts or stats, the agent needs a code-execution path. Options are the shell toolset running Python (risky on the host), a Python or code-interpreter MCP server in a container (safer), or running the whole agent in a sandbox.
- **Context:** a skill holds your metric definitions, table meanings, join rules and "what counts as an active user." This is where most of the quality comes from, and skills load on demand so the schema doc doesn't fill the context.
- **RAG:** optional, for a data dictionary or past analyses.
- **Team shape:** a root "analyst" that plans the work, plus a "SQL writer" sub-agent and a "reviewer" that sanity-checks results. The split mostly helps by keeping contexts small. I wouldn't start with it.

**Sketch (schema is illustrative, not verified; check `agent-schema.json`)**
```yaml
agents:
  root:
    model: anthropic/claude-sonnet-5-5
    description: Data analyst
    instruction: |
      Inspect the schema before writing SQL. Use read-only queries.
      State assumptions, show the SQL, and flag low-confidence results.
    skills: true
    toolsets:
      - type: mcp
        ref: docker:postgres   # example; check the catalog for a real ref
      - type: filesystem
      - type: think
```

**What works well**
- Ad-hoc questions ("revenue by cohort last quarter") with a human checking the SQL.
- Exploratory analysis and drafting queries for analysts to refine.
- Summarizing a table or dataset and spotting anomalies.
- Sharing one vetted analyst, with its metric skill, across a team as a pullable artifact.

**Where it breaks**
- **Wrong but plausible answers:** the usual failure is a bad join, a double-counted metric or a wrong filter. Mitigate with metric definitions in skills, forced display of the SQL, and a reviewer step. Don't trust numbers that go straight into decisions.
- **Large data:** results go through the model's context, so it can't ingest big tables. It should aggregate in SQL, not pull rows.
- **Scheduled reports and dashboards:** it's interactive, with no scheduler. Use it to *write* the query, then put that in your BI or orchestration tool.
- **Access control:** row-level permissions, PII and audit trails need enforcing in the database and MCP layer. The agent won't enforce them.
- **No evals:** I didn't see built-in tooling, so you'd build a small question-and-expected-answer set yourself.

I can draft a fuller version with a real MCP ref and the skill file, if you tell me which database you'd use.

### 21 · **user:**

creating a complex workflow might not be suitable here

### 22 · **assistant:**

Agreed, with one nuance on what "complex" means.

**Fits poorly**
- **Fixed multi-step pipelines**, such as extract, validate, transform, load, then notify. Order, retries and branching should be guaranteed, but here the model decides them.
- **Conditional routing and loops on structured state**, such as "if the check fails, go back to step 2, at most 3 times."
- **Parallel fan-out and reduce** over many items with deterministic aggregation.
- **Durable runs** with checkpoints, resume after failure, human approval gates that pause for days, and scheduled triggers.

All of that is the graph and workflow-engine territory, which we saw no evidence of here.

**Where "complex" is fine**
- **Complex reasoning** in one open-ended task, such as debugging a failing pipeline or investigating a metric drop. The model's loop handles that well.
- **Many tools** or a **deep skill library**. Progressive disclosure keeps this manageable.
- **Role-split teams** where the parent delegates to specialists and the path doesn't need to be fixed.

**Hybrid pattern**
Keep the process deterministic in a workflow tool (Temporal, Airflow, LangGraph, plain code) and call the agent for the steps that need judgment. A step could be "ask the analyst agent to explain this anomaly" with the result passed on. The agent works as a worker, not the orchestrator. If it exposes an MCP or API mode as I believe, that's how you'd call it. I haven't verified that part.

**Rule of thumb:** use the agent when the path is unknown and a human watches. Use a workflow engine when the path is known and must be repeatable.

### 23 · **user:**

so just simple agents

### 24 · **assistant:**

Mostly yes, but "simple" describes the control flow, not the capability.

**Simple in structure**
- One agent, or a small tree of a parent and a few specialists.
- A short prompt, a few tools and a handful of skills.
- No fixed process, branching or state machine to maintain.

**Not simple in what they can do**
- They can handle open-ended, multi-step tasks like investigating a bug or answering a hard data question, because the model plans as it goes.
- They can use many tools and a large body of knowledge through skills and RAG.
- Coding agents like Claude Code are structurally the same kind of thing, a loop with tools, and they do very hard work.

So the limit isn't task difficulty. It's **how much you need to control the path**. If you can describe the goal and let the model find the route, this works. If you must dictate and guarantee the route, it doesn't.

**Practical advice**
- Start with one agent. Add sub-agents only when one context gets too crowded or the tool scopes need separating.
- Keep the agent thin and put process knowledge in skills.
- Treat anything that must happen exactly the same way every time as code or a workflow, and let the agent call it as a tool.
