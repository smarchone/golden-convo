---
schema: 1
id: 2026-10-23-agent-governance-layers-and-the-converging-agent
title: Agent governance layers and the converging agent infra stack (Google, AWS, Vercel, Cloudflare)
why: Agent infra is converging on session-as-compute, microVM sandboxes with snapshots, a split between harness and tool machine, and two gateways — with governance enforced at the tool gateway.
why_source: suggested
harness: claude-code
harness_version: 2.1.309
model: claude-opus-5-5
session_id: d3f309ce-6929-47b9-9c04-1eaa3243cf22
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/d3f309ce-6929-47b9-9c04-1eaa3243cf22.jsonl
started: "2026-10-23T23:29:03.096Z"
captured: "2026-10-23T23:59:11Z"
cwd: ~/Documents/proj/claude/spark/ideas
turns: 4
complete: true
golden_turns: [4]
labels: [agents, platforms, agent-runtime]
status: raw
---

### 1 · **user:**

i think google has a governed layer for managing custom built agents.
help me feel what it looks like.

lets also explore similar platforms

### 2 · **assistant:**

[ran: WebSearch — Google Gemini Enterprise agent governance registry custom agents 2026]
[ran: WebSearch — agent control plane governance registry Microsoft Agent 365 AWS AgentCore ServiceNow AI Control Tower 2026]

Yes. Google calls it the **Gemini Enterprise Agent Platform**. The governed layer is mostly two parts, **Agent Registry** and **Agent Gateway**, with an identity for every agent. Here's how it fits together.

## The Google picture

```
   Builders                         ┌──────────────── GOVERNED LAYER ────────────────┐
   ────────                         │                                                 │
   ADK code agent ──┐               │  AGENT REGISTRY  (GA Jun 18 2026)               │
   No-code designer ├── deploy ───▶ │  ┌─────────────────────────────────────────┐   │
   3P partner agent ┘  (auto-reg)   │  │ invoice-triage  v3  ADK   owner: fin-ops│   │
                                    │  │   tools: sap.read, mcp:jira.create      │   │
                                    │  │   identity: agent://…/invoice-triage    │   │
                                    │  │   status: APPROVED                      │   │
                                    │  ├─────────────────────────────────────────┤   │
                                    │  │ mcp:jira   MCP server  v1.4  APPROVED   │   │
                                    │  │ mcp:scrape MCP server  v0.2  PENDING ⚠  │   │
                                    │  └─────────────────────────────────────────┘   │
                                    │                    │                            │
   Employee ── "pay this invoice" ──┼─▶ agent ──tool call──▶ AGENT GATEWAY ──▶ SAP   │
                                    │                    │   • is tool in registry?   │
                                    │                    │   • does agent identity    │
                                    │                    │     have rights?           │
                                    │                    │   • semantic policy:       │
                                    │                    │     "user asked to pay     │
                                    │                    │      $400; call says       │
                                    │                    │      $40,000" → BLOCK      │
                                    │                    ▼                            │
                                    │   Audit log: every action → agent's crypto ID   │
                                    └─────────────────────────────────────────────────┘
```

What it feels like for each role:
- **Builder:** you write an agent in ADK and deploy it to Agent Platform. It shows up in the registry automatically with its version, framework and MCP tool names. You don't fill in a registration form.
- **Admin:** you get one console listing every agent in the org: ones Google built, ones employees built, custom ADK agents and partner agents. It works like an app catalog, except each entry declares what it can *do*.
- **Security:** the gateway sits in the path of tool calls. The new piece is **semantic governance policy** (Preview, June 2026). It checks a proposed tool call against what the user asked for and against business rules. A static rule like "agent X may call SAP" can't do that.

### Why it's built this way
It's the IAM + API gateway + service catalog pattern again, with two changes that matter for agents:
1. **The principal is new.** An agent is neither the user nor a service account. It acts *for* a user, with judgment you can't fully predict. So it gets its own identity, and audit logs record "agent A acting for user U", not just U.
2. **The risk sits in the arguments.** A prompt-injected agent calls *permitted* tools with *wrong* intent. Allow-lists can't see that, so the gateway has to reason about intent. That's an LLM judging an LLM, so expect added latency and its own false positives. This is the least mature part of the stack.

The registry also covers **MCP servers and tools**, not only agents, and that matters most. Most of the attack surface is in which tools an agent can reach, not in the agent itself.

## Similar platforms

They split into two groups: platforms that **govern what runs on their own cloud**, and platforms that **govern across clouds**.

| Platform | Scope | Distinctive bit |
|---|---|---|
| **Google Gemini Enterprise Agent Platform** | Own cloud, plus partner agents | Semantic policy at the gateway; auto-registration on deploy |
| **AWS Bedrock AgentCore + Agent Registry** | Own cloud | Runtime, identity, gateway and policy on tool calls; registry reportedly GA Aug 2026 with approval workflows and CloudTrail audit |
| **Microsoft Agent 365** | Cross-cloud (aims to be *the* directory) | GA May 2026; extends Entra identity to agents. Reported limits: AWS/GCP sync still in preview, and stop/delete actions listed as "coming soon" |
| **ServiceNow AI Control Tower** | Cross-platform, GRC-flavoured | ~30 connectors to discover agents on other clouds; publishes its agents *into* Agent 365. Treats agents like governed assets with risk and compliance workflows |
| **Traccia, Lyzr, etc.** | Vendor-neutral, some self-hosted | Smaller players aiming at the gap between the hyperscalers |

### Where this is heading
Every vendor wants to own the **agent directory**, the way Active Directory / Entra became the place where identities live. You can already see it:
- ServiceNow publishes its agents into Microsoft's directory instead of competing with it.
- Microsoft is pulling in AWS and GCP agents.
- Google and AWS make registration automatic on deploy, so their registries fill up without extra work.

I expect two layers to settle out. Each cloud keeps enforcement close to the runtime (its gateway). Org-wide inventory and policy move to whoever owns identity, and today that leans toward Microsoft. Runtime blocking is where the products differ most: one comparison rates Agent 365's blocking as partial, while AgentCore's enforcement sits in the request path.

**How reliable this is:** the Google details come from Google's own docs and blogs. Much of the information on the other platforms comes from comparison blogs written by vendors in the same market, and some launch dates conflict across sources. Treat those dates and capability ratings as likely, not confirmed.

If you want to go further, I can build a clickable mock of the registry and gateway console. You could approve a pending MCP server and watch a malicious tool call get blocked.

Sources:
- [What's new in Gemini Enterprise](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise)
- [Introducing Agent Compute Engine and expanding agent governance](https://cloud.google.com/blog/topics/ai-infrastructure/introducing-agent-compute-engine-and-expanded-agent-governance)
- [Agents overview – Gemini Enterprise Agent Platform docs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents)
- [Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)
- [Agent Gateway codelab](https://codelabs.developers.google.com/cloudnet-agent-gateway)
- [Securing the Agentic Era (Google Cloud Security Community)](https://security.googlecloudcommunity.com/security-command-center-4/securing-the-agentic-era-new-gemini-enterprise-agent-platform-7376)
- [egen.ai: AI governance going to platform standards](https://egen.ai/insights/ai-governance-is-going-from-custom-plumbing-to-platform-standards/)
- [eigent.ai: Gemini Managed Agents explained](https://www.eigent.ai/blog/gemini-managed-agents-explained)
- [Forbes: Microsoft makes governance the gate](https://www.forbes.com/sites/janakirammsv/2026/06/09/microsoft-makes-governance-the-gate-for-enterprise-ai-agents/)
- [ServiceNow + Microsoft agent governance](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-agent-governance-through-deeper-integration-with-Microsoft/default.aspx)
- [AI Control Tower June 2026 release](https://www.servicenow.com/community/ai-control-tower-articles/ai-control-tower-what-s-new-in-the-june-2026-release/ta-p/3561445)
- [Traccia: Top AI agent control planes](https://traccia.ai/blog/top-ai-agent-control-planes/)
- [Lyzr: Platforms for enterprise agent management](https://www.lyzr.ai/blog/platforms-for-enterprise-ai-agent-management)
- [StackScout: Microsoft Agent 365 review](https://stackscout.co/blog/microsoft-agent-365-review-2026/)

### 3 · **user:**

lets compare the infra/platform primitive for agents by google, vercel, cloudflare etc..
i want to see the direction the industry is converging

### 4 · **assistant:**

[ran: WebSearch — Google Agent Compute Engine announcement agent runtime sandbox primitives]
[ran: WebSearch — Vercel agents infrastructure 2026 Workflow Sandbox AI Gateway Fluid compute]
[ran: WebSearch — Cloudflare Agents SDK 2026 Durable Objects sandbox containers MCP agents platform]
[ran: WebSearch — AWS Bedrock AgentCore runtime memory gateway browser code interpreter 2026; Anthropic Claude Managed Agents; OpenAI agen]

Everyone is building the same stack, just starting from different positions. At the bottom, the unit of compute is moving from the **request** to the **session**. Above that, the product is moving from compute to a **managed harness**.

## The primitive matrix

| Primitive | Google | AWS | Vercel | Cloudflare |
|---|---|---|---|---|
| **Unit of compute** | Agent Engine / Cloud Run; GKE **Sandbox** resource | AgentCore Runtime: **a microVM per session** | Fluid compute: you pay for active CPU, not while waiting on the model | **Durable Object**: one long-lived actor per agent |
| **Code sandbox** | gVisor (Kata optional), warm pools; GKE Agent Sandbox (CNCF); Cloud Run sandboxes | AgentCore Code Interpreter + Browser | **Vercel Sandbox**: Firecracker microVM, persistent, snapshots, Docker | **Sandbox SDK 1.0** (Sep 30 2026): a container owned by your Durable Object; snapshots in beta |
| **Durability / long runs** | Agent Engine sessions | Runtime sessions | **Workflow SDK**: steps checkpoint and resume after failure | Durable Object storage + alarms (state lives with the agent) |
| **Model gateway** | Vertex / Gemini | Bedrock (now also serves OpenAI models) | **AI Gateway**: 400+ models, budgets, fallbacks | AI Gateway + Workers AI |
| **Tool gateway / MCP** | **Agent Gateway** (semantic policy) | AgentCore Gateway | (lighter; you write it yourself) | McpAgent, MCP over Durable Object bindings instead of HTTP |
| **Identity / registry** | Agent Registry, an identity per agent | AgentCore Identity, AWS Agent Registry | thin | thin |
| **Managed harness** | ADK + Agent Platform | AgentCore Harness (GA Jun 2026), Bedrock Managed Agents | Vercel Agent (beta) | Agents SDK; opened to other frameworks (Flue) |

Model vendors are moving down into the same space: **Claude Managed Agents** (public beta Apr 2026) and the **OpenAI Agents API** (public beta Sep 2026) both run the agent loop for you, and the sandbox can be theirs or yours.

## The four starting points

Each vendor is extending the abstraction it already had into "agent":

```
Google      Kubernetes  ──▶ Sandbox as a Kubernetes resource (Sandbox / Template / Claim)
AWS         VMs/IAM     ──▶ microVM per session + IAM-style identity for agents
Vercel      Serverless  ──▶ make serverless survive waiting (Fluid) + resume (Workflow)
Cloudflare  Edge actors ──▶ the agent IS an actor; its sandbox hangs off the actor
```

Cloudflare's model is the cleanest. A Durable Object gives each agent one address, single-threaded state and wake-on-alarm, which is what an agent session needs. Since Sandbox SDK 1.0, the Durable Object also owns its container's lifecycle, so the agent and the machine it works on share one identity and one lifetime.

Vercel's is the most pragmatic. It doesn't give you an actor. It makes stateless functions cheap while they wait on the model and adds checkpoint/resume on top. The trade-off is that your state lives in workflow steps, not in an object.

## Where it's converging

**1. Session is the new request.** Agents run for minutes to hours, mostly waiting on the model, then burst into CPU work. All four providers re-priced or re-architected around that: active-CPU billing, per-session microVMs, actors that hibernate. Request-scoped serverless doesn't fit this load.

**2. Isolation means microVM or gVisor, made fast with warm pools and snapshots.** A plain container isn't trusted for model-written code. Firecracker (Vercel, AWS), gVisor (Google) and Cloudflare's rebuilt containers (~650ms median start in one benchmark, down from ~4s) all hit the same problem: strong isolation starts slowly. So the race is on warm pools and snapshot/restore. Snapshots also give you fork and rewind of an agent's working machine, and that will matter more than raw speed.

**3. The agent and its computer are splitting apart.** Harness (the loop, the context, the model calls) and tool-execution machine are separating. Managed-agent APIs let the vendor run the harness while *your* sandbox runs the tools. Cloudflare makes it explicit (Durable Object = brain, container = hands). This split decides where data lives, what's in the trust boundary and who sees the logs. Example: OpenAI's docs reportedly say that bringing your own sandbox does *not* make the Agents API eligible for zero data retention, because session state still sits with them.

**4. Two gateways: one in front of models, one in front of tools.** The model gateway (routing, budgets, fallbacks) is close to a commodity now. The tool gateway (MCP, identity, policy) is the strategic one, and it's where the governance from your last question gets enforced. The hyperscalers are strong here and Vercel and Cloudflare are thin. I'd expect them to partner rather than build a full identity and registry stack.

**5. The managed harness is the product.** Compute providers are adding harnesses (AgentCore Harness, Vercel Agent, Agent Platform). Model providers are adding runtimes (Claude Managed Agents, OpenAI Agents API). AWS hosting a managed-agent product built on OpenAI's harness, with AgentCore underneath, shows the stack becoming interchangeable layers.

### The rough end state
```
┌─────────────────────────────────────────────┐
│ Registry · Identity · Policy (governance)    │  ← hyperscalers / Microsoft fight here
├─────────────────────────────────────────────┤
│ Harness (loop, context, memory)              │  ← model vendors vs. platforms
├──────────────────────┬──────────────────────┤
│ Model gateway        │ Tool gateway (MCP)   │
├──────────────────────┴──────────────────────┤
│ Durable session (actor / workflow)           │
├─────────────────────────────────────────────┤
│ Sandbox: microVM/gVisor + snapshot/fork      │
└─────────────────────────────────────────────┘
```

Two questions are still open:
- **Will the harness standardise?** Today each one is proprietary, and A2A/MCP only standardise the edges. If a portable spec appears, the runtime becomes a commodity.
- **Does state live in an actor or in a workflow log?** Cloudflare uses the actor, Vercel the workflow log. Actors suit chatty, stateful agents; workflow logs suit auditable, replayable pipelines. My bet is both survive and serve different workloads.

**How reliable this is:** Cloudflare's details come from its own changelog and blog. Several AWS, Google GKE and managed-agent dates and statuses come from secondary blogs whose dates sometimes conflict. Treat those dates as approximate.

Sources:
- [Cloudflare Sandbox SDK 1.0 changelog](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/)
- [Cloudflare Containers rebuilt for agent sandboxes](https://noise.getoto.net/2026/09/30/cloudflare-containers-rebuilt-to-scale-agent-sandboxes/)
- [TechReport on Cloudflare Containers](https://techreport.ngo/ai-ml/cloudflare-containers-rebuilt-to-scale-agent-sandboxes/)
- [Cloudflare Agents SDK v0.6.0](https://developers.cloudflare.com/changelog/post/2026-02-25-agents-sdk-v060)
- [Cloudflare: Flue on Agents platform](https://blog.cloudflare.com/agents-platform-flue-sdk)
- [Cloudflare Project Think](https://blog.cloudflare.com/project-think/)
- [Lilting: Cloudflare Agents Week 2026](https://lilting.ch/en/articles/cloudflare-agents-week-sandboxes-facets-unified-cli)
- [Vercel: Agentic Infrastructure](https://vercel.com/blog/agentic-infrastructure)
- [Vercel: It takes a platform to run agents](https://vercel.com/blog/anyone-can-build-agents-but-it-takes-a-platform-to-run-them)
- [Vercel Agents](https://vercel.com/agents)
- [Vercel AI Cloud roadmap survey](https://yage.ai/share/vercel-ai-cloud-platform-survey-en-20260605.html)
- [Developers Digest: Vercel agentic stack](https://www.developersdigest.tech/blog/vercel-agentic-infrastructure-stack)
- [InfoQ: GKE Agent Sandbox](https://infoq.com/news/2026/05/gke-agent-sandbox-hypercluster)
- [TechInformed: Google Agent Sandbox](https://techinformed.com/google-launches-agent-sandbox-for-secure-ai-agents-on-kubernetes/)
- [DEV: Google Agent Substrate on GKE](https://dev.to/leobaniak/googles-pitch-put-agent-substrate-on-top-of-gke-agent-sandbox-and-call-it-the-ai-agent-runtime-2blm)
- [Forkast: Cloud Run sandboxes](https://forkast.news/google-cloud-run-sandboxes-serverless-agent-sandboxing-becomes-a-native-primitive/)
- [Managed agent runtimes compared (Konishi)](https://hidekazu-konishi.com/entry/managed_agent_runtimes_what_each_platform_holds.html)
- [AWS: Bedrock OpenAI models & Managed Agents](https://aws.amazon.com/about-aws/whats-new/2026/04/bedrock-openai-models-codex-managed-agents/)
- [Futurum: AWS agent stack](https://futurumgroup.com/insights/aws-pushes-the-agent-stack-quick-connect-verticals-openai-on-amazon-bedrock/)
- [Omnara: Self-hosted managed agents](https://www.omnara.com/guides/self-hosted-managed-agents)
