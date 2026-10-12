---
schema: 1
id: 2026-10-12-meta-muse-spark-personal-ai-use-cases-learned-in
title: Meta Muse Spark personal-AI use cases learned in 6 shots, distilled to one table
why: "Few-shot works best when it's pinned to sourced facts: Muse's personal-AI story is about Meta's data surfaces (camera, chats, Marketplace), not the model, and the distilled table version is the one I'll actually reread."
why_source: suggested
harness: claude-code
harness_version: 2.1.296
model: claude-opus-5-5
session_id: b60be177-8532-4a1a-9e32-fc3edbc3aa2f
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/b60be177-8532-4a1a-9e32-fc3edbc3aa2f.jsonl
started: "2026-10-12T21:34:41.902Z"
captured: "2026-10-12T22:51:08Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:productivity:few-shot"
turns: 6
complete: true
golden_turns: [4, 6]
labels: [agents, few-shot, meta-muse]
status: raw
---

### 1 · **user:**

/productivity:few-shot muse facebook personal ai

/productivity:few-shot muse facebook personal ai usecases

### 2 · **assistant:**

I'm not sure what "Muse" refers to here, and the skill says to pin the target before writing any shots. Here's what I'm unsure of:

- **Meta "Muse" (my best guess):** I have a vague memory that Meta Superintelligence Labs released a model family branded "Muse" in 2026, with personal-assistant use cases in the Meta AI app, WhatsApp, Instagram and the Ray-Ban glasses. I can't confirm the name, the release date, what it can do, or any API, and I won't make those up.
- **Microsoft Muse:** a game-world generation model (WHAM) from early 2025. It's well documented, but it's Microsoft's and not a personal-AI product, so swapping it in would be the wrong target.
- **Something else:** an internal codename, a feature inside Meta AI, or a third-party product built on Facebook data.

What would you like me to do?

1. **Look it up.** I'll search for Meta's Muse, confirm what it is and its personal-AI use cases, then build the shots from sourced facts.
2. **You pin it.** Paste a link or a sentence about what it is, and I'll build the shots from that.
3. **Change the target.** For example, "Meta AI personal assistant use cases" in general, where I know the ground well enough to write shots now and would mark anything unverified.

### 3 · **user:**

look it up

### 4 · **assistant:**

[ran: WebSearch — Meta Muse model personal AI Meta Superintelligence Labs]
[ran: WebSearch — Meta Muse Spark use cases Meta AI app personal superintelligence]
[ran: WebFetch — https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/]
[ran: WebFetch — https://ai.meta.com/blog/introducing-muse-spark-msl/]

# Meta Muse (personal-AI use cases) in 6 shots
Meta Superintelligence Labs' closed, multimodal model family; Muse Spark runs Meta AI across its apps and glasses.

*Sourcing note:* the outputs below are Meta's own launch claims (April 8, 2026, updated May 12). No one has verified them independently. The prompts are my paraphrases of Meta's demos, not exact text.

## Shot 1 · Canonical · Camera in, ranked decision out
**Input:** At an airport kiosk, in the Meta AI app:
```
[photo of a snack shelf]
"Which of these has the most protein?"
```
**Output:** The snacks on the shelf are ranked by protein. "Scan a product → compare against alternatives" works the same way.
**Signal:** The main input is a photo of your surroundings, not typed text. The model identifies the items and then reasons over them in one pass, because it's natively multimodal.

## Shot 2 · Canonical · Health answers come back as interactive explainers
**Input:**
```
"What muscles does a Bulgarian split squat actually work?"
"Break down the nutrition of this plate"  [photo]
```
**Output:** You get an interactive visual, such as a highlighted muscle map or a nutrition breakdown, instead of a paragraph. Meta says more than 1,000 physicians helped curate the health training data, and the model handles questions about images and charts.
**Signal:** Health is the flagship consumer area. Answers often come back as small generated interactive pages ("visual coding") rather than prose.

## Shot 3 · Real-world · Parallel agents, at the cost of latency
**Input:** A planning task with many parts, run in a heavier mode:
```
"Plan a 5-day Florida family trip, two kids under 8."
mode: Instant | Thinking | Contemplating
```
**Output:** Meta AI starts subagents in parallel. One drafts the itinerary, one compares Orlando with the Keys, and one finds activities for kids, and the results are merged. Benchmark numbers are tied to the heavy mode: 58% on Humanity's Last Exam and 38% on FrontierScience Research, both *with Contemplating*.
**Signal:** The modes are a dial between speed and capability. The headline benchmark numbers are for the slowest setting, not the default chat experience.

## Shot 4 · Edge · Grounded in Meta's social graph and marketplace
**Input:**
```
(a) In a group chat, tap Meta AI privately: "summarize what we decided"
(b) Tap a location: "what are locals saying about this place?"
(c) "Find a mid-century dresser under $200 near me"
(d) "@<brand> show me fall jackets"
```
**Output:** (a) A "side chat" answers only you, grounded in that group chat. (b) It surfaces public posts from local people. (c) It searches Marketplace and shows a map with price, style and distance filters. (d) It browses that brand's or creator's content.
**Signal:** What makes it "personal" is Meta's data surfaces: your chats, public posts, Marketplace and creators. The same model wouldn't have these answers anywhere else.

## Shot 5 · Real-world · Glasses and Live AI, pointing at the world
**Input:** You're wearing Ray-Ban Meta glasses, or using Live AI on your phone camera:
```
[looking at a dishwasher with a blinking E24 code]
"What's wrong and how do I fix it?"   (voice; you interrupt mid-answer to switch languages)
```
**Output:** It troubleshoots the appliance and can annotate the image. Voice handles interruptions, topic changes and language switches. Glasses rollout was US and Canada first, with Meta Ray-Ban Display "this summer."
**Signal:** The end goal is ambient: the camera and voice are always available, and the assistant sees what you see. Phone chat is an intermediate stage.

## Shot 6 · Near-miss · Wrong tool: long agentic coding or self-hosting
**Input:**
```
(a) "Refactor auth across my 40-file repo, run tests, iterate until green"
(b) "Download the weights and run it on my GPU box"
```
**Output:** (a) Meta itself says performance gaps remain in "long-horizon agentic systems and coding workflows." (b) You can't do it. Muse Spark is **closed**, which is a break from the open-weight Llama approach, and its API is a private preview for select partners only.
**Signal:** Muse Spark is built for consumer assistance. It is not a developer-agent model, and it isn't the "Llama 5" that people might expect.

## Pattern
- **The input is your context:** camera, voice, chats, location. Typed prompts are the least distinctive way in.
- **The output is often an artifact,** such as an interactive explainer, map or mini-app, not prose.
- **The advantage is the data surfaces** (WhatsApp, Instagram, Facebook, Messenger, Threads, Marketplace, glasses), not the size of the model. Meta calls Spark "small and fast by design."
- **Capability is a mode dial:** Instant, then Thinking, then Contemplating with parallel agents. Benchmarks are quoted at the top setting.
- **It's closed and consumer-first.** Coding agents and self-hosting fall outside what it's for.

## Coverage
Covered: visual perception · health · visual coding/artifacts · multi-agent modes · social/Marketplace grounding · glasses/Live AI/voice · closed vs. open boundary
Not yet: **Muse Glimmer** (reportedly an open-weight model of about 30B under Apache 2.0 that runs on-device; *unverified*, and sources disagree on its date) · Muse Image/Video/Code · Spark 1.1/1.2 changes · the safety findings (Apollo Research reported the highest "evaluation awareness" they had seen) · privacy and memory controls, which Meta's posts don't explain · how far the non-US rollout has gone

## Your turn
You're a developer. You want a nutrition-coaching app that reads meal photos **on the user's phone, offline**, using a Muse model. Which Muse model would you reach for, what would you lose compared with the Meta AI app's version of Shot 2, and why?

---
More shots (aimed at the Not yet list), or a harder held-out case?

Sources:
- [Introducing Muse Spark: Meta's Most Powerful Model Yet (Meta Newsroom)](https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/)
- [Introducing Muse Spark: Scaling Towards Personal Superintelligence (Meta AI blog)](https://ai.meta.com/blog/introducing-muse-spark-msl/)
- [Introducing Muse Glimmer (Meta research blog)](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model)
- [Meta AI Research](https://ai.meta.com/research/)
- [Meta Superintelligence Labs (Wikipedia)](https://en.wikipedia.org/wiki/Meta_Superintelligence_Labs)
- [AI Magazine: Is Meta's Muse Spark the Path to Personal Superintelligence?](https://aimagazine.com/news/is-metas-muse-spark-the-path-to-personal-superintelligence)
- [Analytics Vidhya: Meta Muse Spark Review](https://www.analyticsvidhya.com/blog/2026/04/meta-muse-spark-review/)
- [The Daily Star: Meta races toward personal superintelligence](https://www.thedailystar.net/news/tech-startup/news/meta-races-toward-personal-superintelligence-muse-spark-launch-4147666)

### 5 · **user:**

give me a distilled version of it. easier for me to read

### 6 · **assistant:**

# Meta Muse in 6 shots (short version)
**Muse Spark** is Meta's closed, multimodal model. It runs Meta AI in Meta's apps and on its glasses.

| # | Type | You do | It does | Lesson |
|---|---|---|---|---|
| 1 | Canonical | Photograph a snack shelf: "most protein?" | Ranks the snacks shown | The camera is the main input |
| 2 | Canonical | "What muscles does a split squat work?" | Builds an interactive muscle map | Health is the flagship; answers often come back as mini-apps, not text |
| 3 | Real-world | "Plan a Florida family trip" in Contemplating mode | Runs agents in parallel (itinerary, compare places, kids' activities) | Modes trade speed for capability; benchmarks use the slowest one |
| 4 | Edge | Group chat: privately ask "what did we decide?" · "Dresser under $200 near me" | Private answer grounded in that chat · Marketplace map | The edge comes from Meta's data (chats, posts, Marketplace) |
| 5 | Real-world | Glasses: look at a broken dishwasher and ask | Talks you through the fix by voice; you can interrupt | The goal is an assistant that sees what you see |
| 6 | Near-miss | "Refactor my repo" · "Give me the weights" | Weak at long agentic coding (Meta's own admission) · closed; API in private preview | Built for consumers, not developers; not the next Llama |

## Pattern
- **Input:** your surroundings and context (camera, voice, chats, location)
- **Output:** often a small app or visual, not prose
- **Edge:** Meta's apps and data, not model size ("small and fast by design")
- **Boundary:** closed and built for consumers

**Not yet covered:** Muse Glimmer (reportedly open-weight and on-device, *unverified*), Image/Video/Code models, safety findings, privacy controls

## Your turn
You want an **offline, on-phone** app that reads meal photos. Which Muse model do you use, and what do you give up compared with Shot 2?
