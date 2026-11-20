---
schema: 1
id: 2026-11-20-signals-vs-the-landscape-decision-ledgers-exist
title: "Signals vs the landscape: decision ledgers exist, the promotion test and sweep don't"
why: Signals' parts already exist elsewhere. What's new is the promotion test, the bottom-up sweep and harvesting decisions from the session, so pitch it as where each decision lives, not as decision memory.
why_source: suggested
harness: claude-code
harness_version: 2.1.329
model: claude-opus-5-5
session_id: 75eaf52c-1d77-427c-9e41-62a85edc3a4c
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-signals/75eaf52c-1d77-427c-9e41-62a85edc3a4c.jsonl
started: "2026-11-20T17:46:09.280Z"
captured: "2026-11-20T18:04:02Z"
cwd: ~/Documents/proj/claude/spark/signals
turns: 2
complete: true
golden_turns: [2]
labels: [agents, context-infra, competitive-analysis, knowledge-mgmt]
thread: signals
status: raw
---

### 1 · **user:**

is any one building @TODO  like layer ?

### 2 · **assistant:**

[ran: WebSearch — architecture decision records for AI coding agents context layer 2026]
[ran: WebSearch — spec-driven development tool coding agents decisions memory Kiro spec-kit BMAD]
[ran: WebSearch — agent decision log promote to project memory human approval coding agent open source]

Yes, several projects overlap with parts of it. I didn't find any that combines the specific pieces that make up signals. Caveat: this comes from one round of searches over READMEs, blogs and two papers. I haven't checked anyone's code.

**Closest neighbours**

| Project | Overlap with signals | Difference |
|---|---|---|
| **Data Olympus** | Agents propose learnings, humans promote them, and only knowledge still in force is served | Closest to your gate 2. I only saw it in a curated list, so it's worth checking directly |
| **projectmem** (MIT, arXiv paper) | Append-only typed log (issue/attempt/fix/decision), with promotion into memory | Promotion follows rules (failed attempts always promote), not human approval. It's about avoiding repeated failures, not steering |
| **Selvedge** / **Lockstep** | Decision ledgers: the decision, rejected approaches, when to revisit | Close to your `why / not` entry shape. There's no tiering by abstraction level and no promotion test |
| **Lore** (arXiv) | Says ADRs miss implementation-level decisions and go stale | Stores decisions in git commit messages, which is roughly your code ctx problem solved a different way |
| **ADR-as-agent-memory** (O'Reilly, several blogs) | Retrieves the relevant ADRs and injects them before the agent writes code | Usually one flat tier, with no build log and no sweep |
| **Spec Kit / Kiro / BMAD / OpenSpec** | A constitution or PRD acts as standing high-level context | Specs are written up front for each feature. Decisions don't flow back up from builds |

**What I didn't find anywhere**

1. **One promotion test that sends each decision to a tier.** "Costly to reverse or felt by the user" goes to exec ctx, "recurs and not visible in code" goes to code ctx, everything else stays in the build log. Others either keep everything or use one tier.
2. **Bottom-up sweep.** Catching patterns across runs ("3 builds, 3 date formats") that no single build would flag.
3. **Treating the chat session as the plan.** Harvesting decisions from the chat, with gate 1 only when they conflict with ctx. Spec tools need an explicit spec or plan step first.
4. **Higher ctx wins, with drift tolerated.** Ctx is allowed to be ahead of the code, and the next build reconciles them.
5. **Builds that never read past build logs.** Most memory tools do the opposite and retrieve everything.

**Takeaway:** the parts (decision ledgers, human-approved promotion, ADRs as context) are well covered. The promotion test, sweep and session harvesting, plus putting humans at exec level by default, look new. That's probably the pitch: other tools remember decisions, signals decides where each one lives.

I'd look at Data Olympus and projectmem first, since they're closest to gate 2 and the build log.

Sources:
- [projectmem paper (arXiv)](https://arxiv.org/html/2606.12329v1) · [projectmem repo](https://github.com/michael-chen2010/projectmem)
- [Awesome-Agent-Memory (lists Data Olympus, Selvedge, Lockstep)](https://github.com/TeleAI-UAGI/Awesome-Agent-Memory)
- [Lore: commit messages as knowledge protocol (arXiv)](https://arxiv.org/pdf/2603.15566)
- [O'Reilly: When Architecture Decisions Actually Apply](https://www.oreilly.com/radar/when-architecture-decisions-actually-apply/)
- [ADRs as an AI agent's memory](https://www.andrewconnell.com/articles/architecture-decision-records-ai-agents/)
- [Decision Records for AI-Driven Development](https://www.glukhov.org/app-architecture/documentation/decision-records-ai-driven-development/)
- [ADRs with Codex CLI](https://codex.danielvaughan.com/2026/04/28/codex-cli-architecture-decision-records-adr-automated-governance/)
- [AGENTS.md Is Not Enough](https://dev.to/reapollo/agentsmd-is-not-enough-building-project-memory-for-ai-coding-agents-1o01)
- [Archcore project context](https://archcore.ai/project-context/)
- [Martin Fowler: Kiro, spec-kit, Tessl](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Spec Kit vs BMAD vs OpenSpec](https://dev.to/willtorber/spec-kit-vs-bmad-vs-openspec-choosing-an-sdd-framework-in-2026-d3j)
