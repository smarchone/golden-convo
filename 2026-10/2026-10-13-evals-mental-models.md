---
schema: 1
id: 2026-10-13-evals-mental-models
title: "Evals mental models: context is signal, evals are verification"
why: Context is about signal and evals are about verification; evals and traces find issues across layers, and context and tools are what we tune.
why_source: suggested
harness: claude-code
harness_version: 2.1.283
model: claude-opus-5-5
session_id: a77bb0f6-3455-4aad-ba71-0418b59a9bf0
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/a77bb0f6-3455-4aad-ba71-0418b59a9bf0.jsonl
started: "2026-09-27T17:16:13.388Z"
captured: "2026-10-13T05:30:00Z"
cwd: ~/Documents/proj/claude/spark/ideas
turns: 14
complete: true
golden_turns: [2, 8, 10, 12]
labels: [agents, evals, context-infra]
status: raw
---

### 1 · **user:**

i understand the evals for agents is just question answer pairs.... but i want to understand and build mental models. help me

### 2 · **assistant:**

Q&A pairs are only the simplest kind of eval. Below are a few mental models, from simplest to most complete, each one building on the last.

---

## 1. The core model: an eval is a task, an environment and a grader

A Q&A pair is this model in its simplest form:

| Part | Q&A eval | Agent eval |
|---|---|---|
| **Task** | "What's the capital of France?" | "Refund order #123 if it's eligible under policy" |
| **Environment** | none | a sandbox with tools, a database, files, a fake user |
| **Grader** | `answer == "Paris"` | check the DB: was the refund issued and the right amount charged? |

Once you see that "answer" is really **the end state of the world after the agent acted**, evals stop looking like trivia quizzes. They start looking like **integration tests for a program you can't read**.

---

## 2. Grade outcomes, not claims

An agent says "I've refunded your order!" That tells you nothing on its own. The real question is whether the refund exists in the database.

```
Transcript ──► what the agent SAID it did     (weak signal)
World state ─► what the agent ACTUALLY did    (strong signal)
```

This is the biggest change from Q&A thinking. For agents, **the environment is the answer key**. SWE-bench grades by running the repo's tests, and τ-bench grades by comparing the database state against the expected state.

---

## 3. Three kinds of grader

From cheapest and most reliable to most expensive and flexible:

1. **Code graders.** Exact match, a regex, "do the tests pass?", "does the DB row exist?", "was tool X called with arg Y?" Use these wherever you can.
2. **Model graders (LLM-as-judge).** An LLM scores against a rubric: "Did it stay polite? Did it ask for missing info before acting?" Use them for fuzzy qualities, and calibrate them against human labels.
3. **Human graders.** The gold standard, but slow. Use them to build and check the other two.

A good eval often **stacks** them: a code check on the outcome plus a rubric check on the process.

---

## 4. Outcome vs. trajectory

An agent's run is a **trajectory**: think → call a tool → observe → think → … → finish. You can grade two different things:

- **Outcome:** did it get there? This is usually what matters.
- **Trajectory:** how did it get there? It could have taken 40 tool calls, deleted a file it shouldn't have, or looped.

Hold outcome as the main metric and trajectory as a set of **guardrails**: cost, steps, safety violations. Don't over-specify the path. Agents often find valid routes you didn't anticipate, and a grader that demands one exact path punishes that.

---

## 5. Agents are stochastic: pass@k vs pass^k

Run the same task 5 times and you might get 3 passes. A single run is an anecdote. So:

- **pass@k:** did it succeed *at least once* in k tries? This measures capability: can it do this at all?
- **pass^k:** did it succeed *every time* in k tries? This measures reliability: can I ship it?

An agent at 90% pass@1 might be only about 60% pass^5. That gap is often the real story for production.

---

## 6. Two jobs for evals: capability and regression

- **Capability evals** are hard tasks you currently fail. They are the hill you're climbing, and a low score is expected.
- **Regression evals** are tasks you already pass. They are the floor that should never drop, and a failure here blocks a change.

Tasks graduate from the first group to the second as the agent improves.

---

## 7. Where evals come from: the error-analysis loop

This is the part people skip, and it matters most:

```
run agent ─► read transcripts ─► name the failure types ─► write evals for them ─► fix ─► repeat
```

Good evals are **not** brainstormed up front. They are distilled from reading real failures. For example, "it keeps refunding without checking the date" becomes 5 tasks with orders just inside and just outside the refund window.

---

## 8. Failure modes of the evals themselves

- **Reward hacking:** the agent passes the grader without doing the task, for example by editing the test file instead of fixing the bug. Lock down what the agent can touch.
- **Leaky environments:** state carries over between runs, so reset the sandbox every trial.
- **Saturation:** everything passes and the eval stops telling you anything, so add harder tasks.
- **Grader bugs:** a wrong answer key fails correct agents. Spot-check failures by hand.

---

## One-paragraph summary

> An agent eval is a **reproducible world** + a **goal** + a **check on the world's final state**, run **many times**, with **guardrails** on how the agent got there. The eval set **grows from real failures**, and is split into what you're **climbing toward** and what you must **never lose**.

---

**Suggested next step:** the fastest way to make this stick is to build a tiny version. That could be a toy "bank" environment (a JSON file as the database), 2–3 tools, about 5 tasks, a code grader that checks final state, a rubric grader for tone, and a runner that reports pass@k and pass^k. It would be around 150 lines of Python in a folder here. I can build it if you'd like, or go deeper on any one of the models above.

result: Explained agent evals as eight mental models, from "task + environment + grader" through pass@k vs pass^k to building evals from real failures, and offered to build a small hands-on eval harness.

### 3 · **user:**

in production setting while using popular platforms like arize or langfuse; how does it fit? help me understand with situations and some simulated conversations

### 4 · **assistant:**

The toy eval harness is being built in a separate fork. This answer covers where evals sit once an agent is live and you're using a platform like Langfuse or Arize (Phoenix or Arize AX).

## The key shift: in production you don't know the answers ahead of time

In the earlier models, each task came with a known correct end state to check against. Real users don't send tasks with answer keys, so production evals work in two modes:

| | **Offline evals** (before deploying) | **Online evals** (in production) |
|---|---|---|
| Input | A curated **dataset** of tasks | Live **traces** from real users |
| Answer key | Yes: expected state or answer | Usually **no** |
| Graders | Code checks and judges that compare to a reference | Judges that need no reference, user signals, heuristics |
| Question answered | "Is v2 better than v1?" | "Is something going wrong right now?" |
| Platform feature | Datasets and Experiments | Tracing, online evaluators, Monitors, Annotation queues |

**The platform's job is to connect these two modes into a loop:**

```
          ┌──────────── production ────────────┐
 users ─► agent ─► TRACES ─► online judges / thumbs-down / monitors
                      │                  │
                      │         flagged traces
                      ▼                  ▼
               human review (annotation queue)
                      │
                      ▼  "promote to dataset"
               DATASET (now with an answer key a human wrote)
                      │
                      ▼
      EXPERIMENT: run v1 vs v2 on the dataset ─► compare scores ─► deploy
          └──────────── offline / pre-deploy ──┘
```

Everything rests on **tracing**. A trace is the trajectory from mental model #4, recorded automatically as nested spans:

```
Trace: "refund my order"            user=u_882  session=s_19  latency 8.2s  cost $0.031
├─ LLM call (plan)                  model=..., prompt=refund_agent@v7
├─ Tool: lookup_order(id=123)       → {date: 2026-08-01, amount: 49.00}
├─ LLM call (decide)
├─ Tool: issue_refund(id=123, amt=49.00)   → ok
└─ LLM call (reply)                 "Done! Refunded $49."
   Scores: helpfulness=0.9 (judge) | policy_compliance=0 (judge) | user_feedback=👎
```

Here's how that loop plays out in five situations.

---

## Situation 1: Before launch, "Is prompt v8 better than v7?"

You have 60 hand-written refund tasks stored as a **dataset** in Langfuse or Arize. Each has an input and an expected outcome.

> **Eng (Priya):** I changed the system prompt so it checks the refund window first. Ran an experiment on the `refund-core` dataset, 3 runs each.
> **PM (Sam):** And?
> **Priya:** v7 scored 81% on `policy_correct`, v8 scored 90%. But `avg_tool_calls` went from 3.1 to 4.4, and cost is up 30%.
> **Sam:** Where did v8 get worse?
> **Priya:** The side-by-side view shows 4 tasks v7 passed and v8 fails. All four are partial refunds; v8 now refuses them.
> **Sam:** So it's safer but overcautious. Fix partials, then re-run.

**What's really happening:** mental models #1 (task, environment, grader) and #6 (capability vs regression evals), with the platform storing the dataset and diffing the runs.

**The part the platform doesn't do:** for agents, "running the dataset" means your code executes the agent against a **sandboxed or mocked environment**, such as fake order APIs. The platform stores the tasks, collects the traces and holds the scores. **You** build the replayable world. People new to these tools are often surprised by this.

---

## Situation 2: A customer complaint becomes a regression test

> **Support lead:** A customer got a refund on a 70-day-old order. Policy is 30 days.
> **Eng (Marco):** Filtering traces by `user_id`... found it. The `lookup_order` span returned the date correctly, but the model read `2026-08-01` as the *delivery* date, not the order date.
> **Support lead:** Is it just this one?
> **Marco:** I'm checking. The online `policy_compliance` judge flagged 23 traces this week with the same pattern. They were sitting in the annotation queue and nobody reviewed them.
> **Support lead:** Ouch.
> **Marco:** I'm adding this trace and 5 variations to the `refund-core` dataset with the correct expected outcome. It becomes a regression test that must never fail again.

**What's really happening:** mental model #7, the error-analysis loop. **Your best evals come from production failures.** "Add trace to dataset" is probably the most important button on these platforms.

---

## Situation 3: A model upgrade and a slow drift

You switch to a newer model. Offline experiments look fine. Two weeks later:

> **Monitor alert:** `hallucinated_policy` rate is 4.1% (7-day baseline: 1.2%)
> **Eng (Priya):** Offline evals passed. Why is prod worse?
> **Marco:** Grouping flagged traces by topic: they're mostly about *international* orders. Our dataset has almost none.
> **Priya:** So the dataset didn't represent real traffic.
> **Marco:** Right. Let's sample 50 international traces, have a human label them in the annotation queue, and add them to the dataset.

**Lesson:** an offline dataset is a *model* of real traffic, and traffic changes over time. Online evals catch the gap; offline evals keep the fix in place. You need both.

---

## Situation 4: A judge you can't trust yet

Online judges are LLMs grading LLMs. They can be wrong.

> **Sam:** The `helpfulness` judge scores 0.92 on average. Great, right?
> **Priya:** I pulled 100 traces a human had also rated. The judge agrees with the human only 68% of the time. It gives high scores to long, confident answers, even wrong ones.
> **Sam:** So the 0.92 means nothing?
> **Priya:** Not yet. I'm rewriting the rubric to be binary with examples: "Did the agent resolve the stated problem? yes/no". Then I'll re-check agreement. Our target is above 85% before we alert on it.

**Lesson:** **calibrate judges against human labels** before trusting their dashboards. Human annotations on the platform are how you evaluate the evaluator.

---

## Situation 5: CI blocks a merge

> **CI bot on PR #412:** ❌ Regression suite `refund-core` (86 tasks × 3 runs)
> pass^3 fell from 91% to 84%. 6 tasks newly failing. [link to experiment comparison]
> **Dev:** I only changed the tool description for `lookup_order`...
> **Reviewer:** The tool description is part of the prompt. Look at task #44: it now calls `lookup_order` twice and loops.

**What's really happening:** mental model #5 (pass^k measures reliability) plus #6 (the regression floor), triggered by the platform's SDK or API from CI.

---

## How the earlier mental models map to the platforms

| Mental model | Langfuse / Arize equivalent |
|---|---|
| Task + environment + grader | Dataset item + **your** harness + evaluator/score |
| Trajectory | Trace with spans (LLM calls, tool calls, retrievals) |
| Grade outcome, not claims | Score from the tool-call span or DB check, not the final message text |
| Code / model / human graders | Custom scores via SDK / LLM-as-judge evaluators / annotation queues |
| pass@k, pass^k | Several runs per experiment, compared across runs |
| Capability vs regression | Separate datasets, e.g. `hard-new` and `regression-core` |
| Error-analysis loop | Filter traces → annotate → add to dataset |
| Guardrails (cost, steps) | Built-in latency, token and cost metrics per trace, plus monitors |

## The one-line mental model

> **Tracing is your flight recorder. Online evals are smoke detectors. Datasets and experiments are your crash-test lab. The platform's real value is the pipe that turns every fire the smoke detectors find into a new crash test.**

Two practical notes:
- **Signals you get without any evals:** user thumbs-down, a human-escalation rate, a user rephrasing the same request, sessions abandoned mid-task. Log them as scores on traces; they're often more reliable than judges.
- **Where the effort goes:** the tools make storing and comparing easy. The hard, valuable work is building the replayable environment, writing good rubrics and reading traces every week.

If it helps, the next step could be extending the toy harness from the fork so it sends traces and scores to a local Langfuse or Phoenix instance (both can be self-hosted with Docker). You'd then see this loop with your own data.

result: Explained how agent evals fit into Langfuse/Arize in production (offline dataset experiments vs online scoring of live traces, joined by a traces → review → dataset loop), with five team scenarios and a table mapping the earlier mental models to platform features.

### 5 · **user:**

<task-notification>
<task-id>abuild-it-61fa7d65bed15765</task-id>
<output-file>/private/tmp/claude-501/-Users-smarch-Documents-proj-claude-spark-ideas/a77bb0f6-3455-4aad-ba71-0418b59a9bf0/tasks/abuild-it-61fa7d65bed15765.output</output-file>
<status>completed</status>
<summary>Agent "build it" finished</summary>
<note>A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.</note>
<result>I built the toy agent eval harness in `agent-evals-toy/`. It isn't committed, because this folder isn't a git repo and I couldn't create a worktree, so the files are written directly there.

**What I checked:** I ran it with the flawed mock agent at 5 and 10 trials per task, and with every flaw switched off. The `--agent claude` path and the LLM judge have not been run, because no `ANTHROPIC_API_KEY` is set.

**Files:**
- `env.py` — a small bank world (2 accounts, 3 orders) with 4 tools. The tools don't enforce the rules (30-day refund window, no overdrawing), so the agent has to check them itself. Every trial gets a fresh copy of the world.
- `tasks.py` — 7 tasks: 5 must-always-pass (regression) and 2 harder ones (capability). Each is graded by a check on the final state of the world, not on what the agent said.
- `agents.py` — two agents:
  - a scripted mock agent with three realistic flaws you can turn up or down: skipping the rule check, claiming success without acting, and wasting steps;
  - a real Claude tool-use loop (`claude-sonnet-5`).
- `graders.py` — three graders:
  - **outcome** (code): is the world in the right state?
  - **guardrails** (code): too many steps, or claimed success with no successful action?
  - **rubric**: an LLM judge if a key is set; otherwise a keyword stand-in.
- `run.py` — runs each task k times, saves every transcript as JSON, and prints pass@1, pass@k and pass^k per task and per group, plus the most common failure types.
- `README.md` — maps each earlier mental model to the code, plus 7 exercises.

**Results:**
- With k=10, the flawed mock agent scores regression pass@1 78%, pass@10 100%, pass^10 0%. All four failure types show up: wrong outcome, claimed without acting, bad reply, too many steps. That is the gap between "can do it" and "does it every time".
- With all flaws switched off, it scores 100% on every metric.

**Try it:**
```
cd agent-evals-toy
python3 run.py -k 10
python3 run.py --flaw skips_policy_check=0   # switch off one flaw at a time
```

result: Built a runnable toy agent eval harness in `agent-evals-toy/` (bank sandbox, 7 tasks, outcome + guardrail + rubric graders, pass@1/pass@k/pass^k runner, README with 7 exercises); it runs as `python3 run.py` without an API key.</result>
<usage><subagent_tokens>60566</subagent_tokens><tool_uses>12</tool_uses><duration_ms>151708</duration_ms></usage>
</task-notification>

### 6 · **assistant:**

The build fork has finished. I'll run the harness once to confirm it works before summarizing.

[ran: Bash — List harness files and run it with 10 trials]

I built the toy harness and ran it once here with 10 trials per task. It works with no API key.

**Where it is:** `agent-evals-toy/`. It isn't committed, because this folder isn't a git repo, so the files are just saved there.

**What my run showed:**
```
regression  pass@1=78%  pass@10=100%  pass^10=0%
capability  pass@1=70%  pass@10=100%  pass^10=0%
failure modes: bad_reply=11, wrong_outcome=10, claimed_without_acting=10, too_many_steps=2
REGRESSION FAILURES: this change would be blocked.
```
The main lesson shows up straight away. The mock agent usually succeeds (78%) and every task succeeds at least once in 10 tries (100%). But no task succeeds all 10 times (0%). That is the difference between "can do it" and "can be shipped". The fork also reported that switching every flaw off gives 100% on every metric; I didn't re-run that myself.

**How it maps to the models:**
- `env.py` is a small bank world with 4 tools, reset for every trial. The tools don't enforce the rules, so the agent has to check them itself (model #1).
- `tasks.py` has 7 tasks, each graded by the final state of the world, not by what the agent says (#2). They're split into 5 regression tasks and 2 capability tasks (#6).
- `graders.py` has three graders:
  - a code check on the outcome;
  - guardrail checks for too many steps and for claiming success without acting;
  - a tone rubric (#3, #4).
- `agents.py` has a scripted mock agent with three flaws you can turn on and off, and a real Claude tool-use loop.
- `run.py` prints pass@1, pass@k and pass^k per task and lists the most common failure types (#5, #7). It saves every transcript to `runs/`, which works like the trace store in Langfuse or Arize.

**Not tested:** the real Claude agent and the LLM judge, because no `ANTHROPIC_API_KEY` is set. My type checker (Pyright) also reports warnings in that code. They don't affect the mock run, and I haven't checked whether they cause problems with a key set.

**Try it:**
```
cd agent-evals-toy
python3 run.py -k 10
python3 run.py --flaw skips_policy_check=0   # switch off one flaw and watch the scores move
```
`README.md` has 7 exercises. A good one after the last answer is to send the saved `runs/` transcripts to a local Langfuse or Phoenix instance. You'd see the traces-to-dataset loop working on your own data.

result: Toy agent eval harness is in `agent-evals-toy/` and runs without an API key. My check run showed 78% pass@1 but 0% pass^10 on the must-pass tasks, and it flagged four failure types. The real Claude agent and LLM judge are untested because no API key is set.

### 7 · **user:**

context is about signal and evals is about verification.
so, prompts, skills, agents, wiki docs, docs over mcp etc... are all context sources.
context quality and retrieval strength needs to be tuned with evals to improve the agent behaviour

### 8 · **assistant:**

Your thesis: context supplies the signal and evals do the verification. Prompts, skills, agents, wiki docs and docs over MCP are all context sources, and you tune their quality and retrieval with evals to improve how the agent behaves.

**That's the right frame, and it's how most serious teams think about it.** The model is mostly fixed for you, so context is your main lever. Evals turn tuning that lever from gut feel into engineering. Four refinements make the model sharper.

## 1. "Retrieval" is really three layers, and each fails differently

```
 ROUTING           →   RETRIEVAL            →   USAGE
 did the agent         did the RIGHT info       given the right info,
 decide to look?       reach the window?        did it act on it correctly?

 skill didn't          MCP search returned      doc was there, agent
 trigger; never        stale v2 policy          ignored it / misread it
 called the wiki tool
```

If you score only the final outcome, all three layers look like "the agent got it wrong". **Evaluate them separately, or you'll fix the wrong layer.** For example, you might rewrite a doc when the real problem was that the skill never triggered.

## 2. The most useful test: give the agent the right context directly

To find which layer failed, **put the correct doc into the context window by hand** and re-run the failing task:

- **It still fails:** the problem is usage or model capability. Better retrieval won't help, so change the instructions, the doc's structure, or the task design.
- **Now it passes:** the problem is routing or retrieval. Fix search, chunking, the skill description, or the tool description.

This one experiment saves weeks of tuning the wrong thing.

## 3. More context isn't better; precision matters too

Each context source costs something:
- **Distraction:** irrelevant chunks pull attention away from what matters.
- **Contradiction:** the wiki says 30 days while the system prompt says 14, so the agent picks one at random. This is very common and very hard to spot without evals.
- **Staleness:** the doc was right six months ago.
- **Budget:** tokens and latency.

So evals should measure **both recall and precision**: did the right thing get in, and did the junk stay out? One useful exercise is to remove one source, re-run the dataset and see what changes. Some sources turn out to be pure noise.

## 4. Not every failure is a context problem

Agent behavior depends on three things:
- **the model**, which sets the capability ceiling;
- **the context**, which is your main lever;
- **the harness**: tool design, loop limits, permissions.

If the oracle test in #2 still fails with perfect context, you've hit the model's limit or a harness problem. Tool definitions are a tricky case, because they are context *and* actions. Each tool result also becomes new context mid-run, so context keeps changing during the loop rather than being set once at the start.

## Putting it together

| Layer | What to measure | Example eval | Where the fix goes |
|---|---|---|---|
| Routing | Did it fetch or trigger when it should, and not when it shouldn't? | "Refund question → the policy skill loads" | Skill or tool descriptions |
| Retrieval | Recall and precision of what landed in context | "Correct policy chunk is in the top 3" | Search, chunking, doc freshness |
| Usage | Given the right context, is the outcome correct? | The oracle test | Instructions, doc structure |
| End-to-end | Final state of the world | The toy harness's outcome grader | Whichever layer the above points to |

**In production (Langfuse or Arize):** log **which context sources were loaded** as attributes on each trace. Then you can filter to failing traces and ask "what did these have in common?", such as "they all loaded wiki page X". That turns the platform into a tool for finding which source caused a failure.

**One-line version:**
> Context is the input you control. Evals tell you whether a change to it helped, and at *which layer*: routing, retrieval or usage.

**Possible next step for the toy harness:** add a "policy doc" context source with three setups: none, retrieved (sometimes stale) and oracle (correct doc injected by hand). You'd watch the three layers separate in the scores. I can add it if you'd like.

result: Your thesis holds (context is the signal, evals verify it). I added four refinements: split "retrieval" into routing, retrieval and usage and evaluate each separately; use the hand-injected correct-doc test to find which layer failed; measure precision as well as recall, since more context isn't better; and remember some failures come from the model or harness, not context.

### 9 · **user:**

evals and traces help identify issus across layers; need not be just context.
context and tools are the only things left out for us to tune.
querying context is a subsystem like rag and its variants

### 10 · **assistant:**

You made three points: evals and traces find problems across every layer, not only context; context and tools are the only things left for us to tune; and fetching context is its own subsystem, like RAG and its variants. I agree with the first and third. I'd adjust the second slightly.

## 1. Evals and traces diagnose every layer ✅

Traces show *where* something went wrong: a routing miss, a bad tool result, a loop, a misread doc, a slow step. Evals show *how often* and whether a fix helped. Together they are a general way to diagnose the whole system, not only context.

## 2. "Only context and tools": almost, with one more knob

If you build on a model you don't train, your controls are:

| Knob | What it is | Examples |
|---|---|---|
| **Context** | What the model *knows* | Prompts, skills, docs, memory, retrieved chunks |
| **Tools** | What the model *can do* | Tool set, names, descriptions, input schemas, output format |
| **Control flow** (harness) | How the loop *runs* | Step limits, retries, single agent or sub-agents, when to ask a human, what to do when context gets long, guardrails |
| *Model choice* | Which model, not how it's trained | Routing cheap tasks to a small model, effort settings |

You could argue control flow is just how you arrange context and tools. But it fails in its own ways, like infinite loops, sub-agents losing context, and early stopping, and traces show those failures clearly. So it's worth tracking as a third knob. **Tools are also a context source:** tool descriptions sit in the prompt, and tool results feed new context back into the loop mid-run.

## 3. Context retrieval is a subsystem ✅, and a spectrum

```
static ──────────► indexed ──────────────► agentic
always loaded      fetched by a pipeline    agent searches with tools, iteratively

system prompt      vector RAG               grep / file reads (Claude Code style)
CLAUDE.md          hybrid (BM25 + vector)   MCP search tools
                   re-ranking               skills: name → body → files as needed
                   graph RAG                memory the agent writes and reads back
```

The further right you go, the more **retrieval turns into tool use**. At that end, your "context" and "tools" knobs become the same thing. That's why modern agents often use grep instead of vector databases: the model does the retrieving.

**Because it's a subsystem, it gets its own component evals**, like unit tests alongside integration tests:
- **Component:** measures the subsystem in isolation, e.g. recall@k, precision, re-ranking quality on a set of queries paired with the right docs. These are cheap and fast to iterate on.
- **End-to-end:** did the agent succeed? This is what actually matters.

**Watch out:** the two can disagree. Retrieval recall can rise while end-to-end success stays flat, for example because the agent now gets more noise, or because retrieval was never the bottleneck. **Tune on component evals, but approve changes on end-to-end ones.**

## The combined model

```
             ┌─ context (static / RAG / agentic retrieval) ─┐
   model  ◄──┼─ tools (actions + more context)              ┼──► behavior
             └─ control flow (loop, sub-agents, guardrails) ┘
                               ▲                                   │
                               └──── traces (where) + evals (how often) ◄─┘
```

> You tune three things: context, tools and control flow. Traces show where a failure happens and evals show how often. Retrieval is a subsystem with its own evals, but end-to-end evals decide whether a change ships.

result: I agreed that evals and traces diagnose every layer and that context retrieval is a subsystem, running from always-loaded context through RAG pipelines to agents searching with tools, and needing its own evals plus end-to-end checks. I added control flow (loop, sub-agents, guardrails) as a third knob alongside context and tools.

### 11 · **user:**

does llm load skill into context window everytime it decides to invoke ?

### 12 · **assistant:**

Not quite. A skill loads in three stages, and once it's loaded it stays in the conversation.

## Three stages, loaded only as needed

```
Level 1: METADATA             always in context, every session
  name + description          (~dozens of tokens per skill)
        │  model decides "this task matches"
        ▼
Level 2: SKILL.md BODY        loaded when the skill is invoked
  instructions                (injected into the conversation as a message)
        │  instructions point to more material
        ▼
Level 3: BUNDLED FILES        loaded only if the model reads or runs them
  reference docs, scripts     (a script runs, and only its *output* enters context)
```

You can see level 1 in this session. My system prompt holds a list of skill names and one-line descriptions, like `dataviz`, `pdf` and `loop`. None of their full instructions are loaded until one is invoked.

## What happens after it's invoked

- **Later in the same conversation:** the skill body is now part of the conversation history, so it's still "in context" on later turns. The model doesn't need to invoke it again. My own instructions here say that if a skill is already loaded, I should follow it rather than call it again.
- **The model itself keeps no state.** Every API call sends the *whole* conversation again, skill body included. So in a sense it's re-read on every turn, but it's re-sent as history, not re-invoked. Prompt caching keeps that cheap.
- **After context compaction:** when a long conversation gets summarized, the skill body can be shortened or dropped, and the model may need to invoke it again.
- **New session:** you're back to level 1, names and descriptions only.

## Why this matters for your mental model

This design is **retrieval with the model as router** (the agentic end of the spectrum from last time):
- The **description** is the retrieval key. It's the only thing the model sees when deciding whether to invoke.
- The **body** is the retrieved document.
- The **bundled files** are a second round of retrieval, done by the model.

So skills have the same three failure layers:

| Layer | Failure | Eval |
|---|---|---|
| Routing | Skill doesn't trigger, or triggers on the wrong tasks | Triggering evals: should-trigger and should-not-trigger prompts, testing the description |
| Retrieval | Body loads but the needed reference file is never read | Check traces for the file read |
| Usage | Instructions loaded but not followed | Outcome evals with the skill loaded on purpose, like the correct-doc test |

In practice, **most skill failures are routing failures**, so the description usually deserves more tuning than the body. The `skill-creator` skill available here has tooling to optimize descriptions against triggering evals.

One caveat: I described the general Agent Skills design and how it behaves in this session. Exact details, like what happens if the same skill is invoked twice or how compaction treats skill content, can differ between harnesses and versions.

result: No. Only each skill's name and description are always in context. The full SKILL.md loads when the skill is invoked and then stays in the conversation history (re-sent each turn, cheap with caching) until compaction or a new session, and bundled files load only if read. The description acts as the routing key, so it's where most skill tuning pays off.

### 13 · **user:**

do people write evals for skills ?

### 14 · **assistant:**

I'll check how the skill tooling available here structures skill evals, so the answer is concrete.

[ran: Bash — Find skill-creator skill files and grep its eval guidance]
[ran: Bash — Read the eval file format and triggering-eval section]

Yes, it's becoming standard practice, though many teams still just try a few prompts by hand. The `skill-creator` skill installed here has a full skill-eval workflow built in. Its approach has two parts, which match the routing and usage layers from earlier.

## 1. Triggering evals: does the skill load when it should?

These test the routing layer, which means they test the **description**. From skill-creator's instructions:

```json
[
  {"query": "can you turn this sales csv into a chart for my deck", "should_trigger": true},
  {"query": "what's the capital of Peru",                           "should_trigger": false}
]
```

- About 20 queries: 8–10 should trigger and the rest should not.
- The should-trigger set deliberately mixes phrasings: casual, formal, cases where the user never names the skill, and cases where this skill competes with a similar one and should win.
- The should-not-trigger set checks the skill doesn't fire on nearby but wrong requests.
- Each query runs **3 times** to get a trigger *rate*, because results vary from run to run (the pass@k idea).
- An optimizer script (`run_loop`) rewrites the description automatically. It splits the queries **60% for tuning / 40% held out**, and picks the best description by its **held-out** score so the wording doesn't just memorize the test queries.

Skill-creator also notes that Claude tends to **under-trigger** skills. That's why routing is usually the first thing to fix.

## 2. Output evals: does the skill improve the result?

These test the usage layer. Stored in `evals/evals.json`:

```json
{"id": 1, "prompt": "User's task prompt",
 "expected_output": "Description of expected result",
 "files": [], "assertions": [...]}
```

The key design choice is that **every test runs twice, once with the skill and once without**:
- For a new skill, the comparison is no skill at all.
- For an improved skill, it's the previous version, saved as a snapshot.

A skill that doesn't beat that comparison isn't adding anything, however good it looks. Other details:
- Checkable assertions are graded by scripts; subjective qualities are left to human review in a viewer.
- Results are summed up as pass rate, time and tokens, with mean ± spread and the difference from the comparison run. So you see what the skill costs as well as what it gains.
- A final review pass flags **non-discriminating assertions** (they pass with or without the skill, so they test nothing) and **flaky tests** (high variance between runs).

## How this maps to what we've discussed

| Our concept | In skill evals |
|---|---|
| Routing layer | Triggering evals on the description |
| Usage layer / correct-doc test | Output evals with the skill loaded on purpose |
| Held-out tests | 60/40 split when optimizing the description |
| pass@k | Each trigger query run 3 times |
| Regression evals | Re-run the suite when the skill or the model changes |
| Guardrails | Token and time cost compared against the no-skill run |

**When people actually write them:** the skill is shared or used heavily, it replaces something important, or the model gets upgraded. A newer model may not need parts of a skill anymore, and the with/without comparison shows which parts.

**To try it:** pick any skill, or write a tiny one here, and run `/skill-creator` on it. It will draft both kinds of eval, run the with/without comparison and open the results in a browser viewer.

result: Yes, people write evals for skills. The installed skill-creator does two kinds: about 20 should/shouldn't-trigger prompts, each run 3 times, to tune the description with a 60/40 held-out split; and output evals that run every test with and without the skill, reporting pass rate, time and token cost.
