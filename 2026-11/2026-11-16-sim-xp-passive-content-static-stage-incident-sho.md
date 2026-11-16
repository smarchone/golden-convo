---
schema: 1
id: 2026-11-16-sim-xp-passive-content-static-stage-incident-sho
title: "Sim-XP passive content: static-stage incident Shorts via a Remotion kit, plumbing borrowed from open source"
why: People only adopt learning products that produce an output in their life; the passive path is a static-stage incident Short built by my own Remotion kit, with open-source plumbing borrowed, not an off-the-shelf generator.
why_source: suggested
harness: claude-code
harness_version: 2.1.325
model: claude-opus-5-5
session_id: 509b361f-99b9-44e5-999e-894b781df790
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-sim-xp/509b361f-99b9-44e5-999e-894b781df790.jsonl
started: "2026-11-16T13:20:54.839Z"
captured: "2026-11-16T14:57:34Z"
cwd: ~/Documents/proj/claude/spark/sim-xp
mode: "skill:productivity:intuition-panel"
turns: 20
complete: true
golden_turns: [3, 4, 6, 16, 20]
labels: [simulation, learning, product-idea, incident-response]
thread: uptimelabs-simulation-core
status: raw
---

### 1 · **user:**

/productivity:intuition-panel from initial idea of this repo was around the idea of simulated experiences; a paradigm between theory and pracical experience; just like pilot training.
optimized for human cost, time and confidence and competency.
but for product adoption perspective, the early simlulation panel got pivoted to a video like experience.
a high effort pitch is to have a full blown interactive simulation with instructor agent, chaos agent, full observability and control center. the operator learns in this env. but this being complicated, i simplified it to observer model where the simulated situation plays and the user just observes and learns.

lets discuss the vide like experience content gen pitch

### 2 · **assistant:**

**CEO:** Stop calling it a video. It's a **flight recorder replay**: a real incident played back as a live system on screen, with the reasons narrated over it. The pitch is "every postmortem your company ever wrote becomes a sim you can sit through in 6 minutes." The product is the content engine, and the player is just the screen it plays on.

**PM:** Who presses play, and when? I'd bet on the on-call engineer the night before their first rotation: "show me how Kafka dies here." If they finish the replay and still can't predict the next failure, all we've made is a nicer blog post. What's the one moment where they lean forward?

**Architect:** The hard limit is **plausibility**. An LLM can turn a story into a playbook, but if the metrics, logs and timing don't hold together, any senior engineer will spot it in 10 seconds and stop trusting it. Story-to-playbook needs a **physics layer**: a small system model that the narrative has to obey.

```
  story / postmortem ──► [playbook gen] ──► [physics check] ──► narrated replay
         (cheap)              (LLM)         (the moat / the     (observer mode)
                                             hard part)              │
                                                                     ▼
                              future: pause ─► "what would you do?" ─► branch
                                       (bridge back to the instructor/chaos vision)
```

**CEO:** That dotted line at the bottom is where the strategy lives. Observer mode builds the library now, and every playbook is already a script that can later become interactive.

**PM:** Then the one interaction I'd add before anything else is **pause-and-predict**. You don't need to steer anything. You just commit to a guess before the reveal. That's what makes pilot training work.

---

**Sharpest question, for you:** Where does the content come from? Is it **public postmortems** (scalable, generic, a marketing engine) or **a company's own incidents** (private, sticky, an enterprise wedge)? Your answer sets who generates the content and who it's for.

### 3 · **user:**

i learned with time that people wont pay or wont adopt unless the product generates some output in their life.
tests getting hiring (recruiters and candidates are willing to pay), 
or a leaderboard to achieve good standing,
or completion of a course etc..
otherwise this is just a glorified burried feature.

### 4 · **assistant:**

**CEO:** Agreed, and it's harsh but correct: learning alone isn't a product, and **proof that you learned** is what people pay for. So the replay isn't the product. It's the **exam room**. The output is a credential: "this person has handled 40 production incidents in sim, and here's how they reason under pressure." That makes it a pilot's logbook, not a course certificate.

**PM:** Of your three options, pick **hiring**, because it's the only one where two sides pay. A candidate watches the Kafka freeze, gets paused at minute 3, and answers "what do you check next?" That's a better signal than LeetCode for SRE and backend roles, and recruiters will pay for it. Leaderboards and courses work for consumers, but those users churn.

**Architect:** Once there's an output, the hard limit becomes **assessment integrity**. A video isn't a test, so you need graded decision points, a rubric, and resistance to cheating, since a candidate can just ask ChatGPT about a public postmortem. That forces two things: **private or generated scenarios** and **rubric-based scoring of free-form reasoning**.

```
   OBSERVE            PREDICT              PROVE
 ┌──────────┐      ┌──────────────┐     ┌──────────────────┐
 │ replay   │ ───► │ pause points │ ──► │ scored logbook   │
 │ (today)  │      │ "what next?" │     │ → shareable /    │
 │          │      │ graded by    │     │   recruiter view │
 └──────────┘      │ rubric agent │     └──────────────────┘
   free hook       └──────────────┘        what people pay for
```

**CEO:** Here's what's good about it: you don't have to give up the observer model. Observer mode is the free study material, and the pause points are where it becomes a test. The interactive instructor/chaos vision comes back as an advanced tier of the exam, not as the starting point.

**PM:** Content generation also becomes a moat: there's an **endless supply of new, ungoogleable incidents**, and fresh test items can't leak.

---

**Sharpest question, for you:** Who's the first buyer? Is it the **candidate** proving themselves (B2C, the "I'm SRE-ready" badge) or the **hiring team** screening people (B2B, "send this sim instead of a take-home")? They need different first screens.

### 5 · **user:**

solve an incident, pause and predict are good ideas.
a full simulator authoring and getting the experience correct will take lot of time.
too much noise will spoil the experience unless there are stakes (which there are few in simulations).

im thinking just chat based basic simulation.
also short video content pipeline for the situations (situation -> incident -> mitigation -> debrief) structured and purposeful and is aligns with the objective of better than theory learning experience and feel.

passive : shot/med length videos
active  : chat based simulations -- i see a lot of potential here (not just engineering)

### 6 · **assistant:**

**CEO:** That's the right call. A chat simulation is a **tabletop exercise**, which militaries, hospitals and incident commanders have run for decades with nothing but a facilitator and a script. The format already works. You're replacing the human facilitator with an agent, which makes it on-demand and cheap. Then the same engine works for an SRE, an ER resident, a sales rep or a new manager.

**PM:** The passive and active modes aren't two products. They're **one playbook in two modes**: the video teaches the pattern, and the chat makes you live it. The four acts map straight across:

```
              PLAYBOOK (one source of truth)
   situation ─► incident ─► mitigation ─► debrief
       │            │            │            │
 PASSIVE  watch       watch        watch        watch     (2–6 min video)
 ACTIVE   briefed  ─► you decide ─► consequences ─► scored debrief
                     (chat)       (world reacts)   (the output)
```

Each session is about 10 minutes: get briefed, make 3–5 decisions under pressure, then get a debrief that **compares your path to the expert's**.

**Architect:** The biggest risk is that **LLMs are people-pleasers**. Without guardrails the sim agrees with whatever the user does, and with no consequences there are no stakes. You need a **hidden world state**: facts, a clock and failure triggers the narrator can't bend. The model tells the story, and the state decides what actually happens.

```
  user msg ─► [narrator LLM] ◄──reads/writes──► [world state: facts, clock, triggers]
                    │                                (rules the LLM can't override)
                    ▼
               consequence ─► debrief scorer (vs. expert path)
```

**CEO:** That's also where your stakes come from. In chat, stakes don't need visual noise. They come from **time and irreversibility**: "You restarted the broker. 40k orders are now stuck. The clock is running." Text is enough to make people sweat.

**PM:** Stay narrow at first, though. "Not just engineering" is a direction for later, not your launch.

---

**Sharpest question, for you:** What's the **first domain where chat sims produce an output people already pay for**? Engineering incidents sold through hiring is the obvious one. Or is there a domain you know better (medicine, sales, management, crisis comms) where a failed decision is expensive and practice is rare?

### 7 · **user:**

lets focus on passive content gen first.
lets close the v3 that ive build accidentally.
may be there are better ways to automate it.
the content has definite structure and predictable segments.
modes : 60 sec and 5 min.
research interesting and popular way of generating this off the shelf.
the stake here is, content upload (for views and learning) -- which could be only for me.

### 8 · **assistant:**

[ran: WebSearch — programmatic video generation pipeline 2026 Remotion AI agent explainer shorts]
[ran: WebSearch — automated technical explainer video tools Manim Motion Canvas Revideo JSON template video API 2026]

**CEO:** Close v3 by **keeping its brain and dropping its body**. The playbook JSON (story → structured segments → narration) is the valuable part. The browser player was just the first renderer. Freeze it, and send the playbook into a real video renderer.

**PM:** With fixed acts, every video is the same template with different data. So the format, not the topic, is the product:

```
              60s (9:16 Short)          5 min (16:9)
situation     0–8s   HOOK: the stakes   0:00–0:45  context + system sketch
incident      8–30s  it breaks          0:45–2:30  timeline, signals, wrong turns
mitigation    30–50s the move           2:30–4:00  the fix + why it works
debrief       50–60s 1 lesson + CTA     4:00–5:00  pattern, how to spot it next time
```

The 60s video is the **hook** for views, and the 5 min is the **lesson**. Generate both from one playbook every time.

**Architect:** The default off-the-shelf choice in 2026 is **Remotion** (React → MP4) driven by Claude Code. It has official agent skills and is strongest at exactly this kind of templated, data-driven output. Its commercial license only matters for companies, so it's free for you as a solo creator. The pipeline:

```
story ─► [story-to-playbook skill] ─► playbook.json ─► [Remotion: 4 scene components × 2 aspect ratios]
                (you have this)                │                     ▲
                                               └─► TTS narration ────┤ (you have this too)
                                                   whisper ─► word-level captions
                                                                     ▼
                                                     render 60s + 5min ─► YouTube Data API upload
```

The rule: **the LLM writes the data, never the video code.** You build the 4 scene components once by hand and get them right. After that, every new episode is just a JSON file. Manim fits math-heavy videos and Motion Canvas suits hand-polished one-offs. Both are wrong for a batch pipeline.

**CEO:** Since you're the stakeholder and the uploader, judge success by **one metric: 60s retention past 3 seconds.** If the hook doesn't hold viewers, no one watches the 5-minute lesson.

**PM:** And look at the alternative: the v3 player plus a headless screen recording would also give you video by tomorrow. But that locks you into a browser animation layout that wasn't designed for the 9:16 phone screen.

---

**Sharpest question, for you:** What's the **visual language** of a scene? Options are **diagrams and animated system maps** (pure Remotion, cheap, consistent), **AI-generated b-roll** (Veo/Sora style, vivid but generic and costly), or **you on camera plus overlays** (the strongest for views but not automatable). That one choice decides how automated "automated" really is.

*(Admin note: v3 has an uncommitted Kafka playbook and an updated index. Want me to commit it as the final v3 snapshot before we move on?)*

Sources (mostly blogs, so check details against remotion.dev):
- [Remotion agent skills guide 2026](https://aividpipeline.com/blog/remotion-agent-skills-guide-2026)
- [Remotion + Claude Code programmatic video](https://timewell.jp/en/columns/remotion-claude-code-programmatic-video)
- [Why Remotion is a big deal](https://www.pootlepress.com/2026/01/why-remotion-is-such-a-big-deal-explained-for-non-techies/)
- [Remotion vs Motion Canvas vs Manim (2026)](https://beginnersinai.org/remotion-vs-motion-canvas-vs-manim/)
- [Agentic Remotion videos](https://vloggingpro.com/ai/workflows/agentic-remotion-videos/)
- [AI explainer video tools, ranked](https://vidpros.com/ai-explainer-video/)

### 9 · **user:**

i recently saw https://www.youtube.com/shorts/nRGQ4tU0-R0 which was awesome, svg based world generation for narrating educational short form videos. 
i feel short form videos are good marketing front door for customers

### 10 · **assistant:**

[ran: Agent — Fetch YouTube short metadata]

**CEO:** Look at that title: *"How a single leaf can stop a train."* That's an **incident postmortem** with a better title. A tiny cause leads to a huge effect, and the physics explains why. Your incidents follow exactly that shape: *"How a single slow consumer froze all of Kafka."* The Short is the front door and the hook formula is ready to use: **tiny thing → giant failure → the hidden mechanism**.

**PM:** The funnel then becomes the whole product line, with each step earning the next:

```
  60s Short (SVG world, hook)      → views, curiosity        [front door, free]
        ▼  "full breakdown →"
  5 min episode (same world, deeper) → learning, trust       [library]
        ▼  "think you'd catch it? →"
  chat sim (same incident, you decide) → output: score/logbook [what people pay for]
```

Your thinking from turns ago comes back here: one playbook feeds all three.

**Architect:** What makes "SVG world generation" work is that **the LLM never draws**. It arranges pieces from a hand-made kit: a world spec (entities, positions, states), camera moves (zoom to the leaf, pull back to the train) and state changes synced to the narration timestamps. A raw LLM-generated SVG looks like clip art. A **component kit plus a scene spec** looks like a channel.

```
playbook.json ─► scene spec (entities, camera, beats@timestamps)
                        │
   [SVG kit: broker, queue, consumer, packet, alarm, clock...]  ← drawn once, by you/designer
                        ▼
              Remotion renders ─► 9:16 short + 16:9 episode
```

**CEO:** The hard creative call is that **infrastructure is invisible**. A leaf and a train are vivid, but a partition and a consumer group aren't. You'll need a **metaphor world** (a factory, a city, a postal system) or very good literal diagrams.

---

**Sharpest question, for you:** Should the world be **literal** (brokers, queues and packets drawn as clean system diagrams, accurate but dry) or **metaphorical** (a consistent city or factory world where Kafka is a post office, vivid and shareable but lossy)? A metaphor world could make the channel recognizable, but every episode then has to be translated into it.

*(I couldn't watch the video. YouTube only returned its title, so this is based on the title and your description.)*

### 11 · **user:**

how did they do it ?

### 12 · **assistant:**

[ran: WebSearch — "How a single leaf can stop a train" short]

I can't tell you for sure, because I can't watch the video. YouTube only gave me the title, and searching it turned up articles about the leaf/pectin physics but nothing about how the video was made. The panel can still reverse-engineer the likely recipe:

**Architect:** Videos that look like this usually come from one of two pipelines, and you can tell them apart by watching closely:

```
A) TRUE SVG / CODE-ANIMATED                 B) "SVG-LOOKING" IMAGES + MOTION
script (LLM) → TTS w/ timestamps            script (LLM) → TTS
→ LLM emits scene spec / SVG code           → image model in flat-vector style per beat
→ animated in Remotion / Motion Canvas      → pan/zoom/parallax, cuts on the beat
   / GSAP / Manim                           → captions burned in

tells: parts move independently,            tells: whole frame pans/zooms, parts never
crisp at any zoom, shapes morph,            move on their own, slight style drift
camera dives *into* the leaf                between shots
```

If the leaf really falls, gets crushed under the wheel, and a film spreads on the rail as separate moving parts, it's **A**, and it's built from code.

**PM:** Either way, the craft is in the **storyboard, not the tool**. The physics of this topic is perfect for a Short: a dime-sized contact patch, crushed leaves forming a slippery film, a train sliding past the station. The camera dives from the macro scene (the train) to the micro cause (the leaf) and back. That zoom-in move is the format.

**CEO:** That's your template: **zoom from the outage down to the one slow consumer, then back out to the frozen cluster.** Same structure, different world.

---

**To find out for real:** Send me the channel name, or a few screenshots or a screen recording. I can analyze frames from a local video file and tell you whether it's A or B, and match it to likely tools.

Sources (physics only, nothing on how the video was made): [Network Rail](https://www.networkrail.co.uk/stories/tackling-leaves-on-the-line-using-water-trak/) · [NBC Connecticut](https://www.nbcconnecticut.com/news/local/how-fall-foliage-and-can-impact-train-operations-in-connecticut/3786751/?amp=1) · [Westport Local](https://westportlocal.com/news/rknf2twti0ne8zq1cnwy2dm076zcum) · [Railsmartr](https://railsmartr.co.uk/?p=1214) · [Interesting Engineering](https://interestingengineering.com/videos/leaves-on-the-track-phenomena-explained)

### 13 · **user:**

https://www.youtube.com/@quietly-works - channel
[Image #2]

### 14 · **assistant:**

The screenshot settles one thing: **it isn't SVG. It's a real-time 3D render.** Here's what the frame shows:

- **3D geometry with real perspective.** The track goes off to a vanishing point, and the gravel is made of individual 3D stones with lighting and shadows.
- **Stylized, simple models.** The train is low-detail and clean-edged, and the headlights look like friendly "eyes." That's a hand-built or kit asset, not a photoreal AI video, which would have messy, drifting details.
- **Atmosphere effects:** fog/haze toward the horizon, soft lighting, and falling leaves as particles.
- **Word-by-word captions** with the current word underlined. These are synced captions, probably from TTS timestamps.

**Architect:** The most likely stack is **Blender (EEVEE)**, or possibly Unreal or Three.js. With a channel this consistent, I'd bet it's **agent-driven Blender**: an LLM writes `bpy` Python scripts that place objects from a reusable asset kit (train, track, trees), set the camera and keyframes, then render. Blender + Claude via MCP/Python is a known 2026 workflow. That's my inference, not confirmed. If other videos on the channel reuse the same trees, track and lighting, that's a strong sign of a kit-plus-script pipeline.

```
script ─► TTS + word timestamps ─► shot list (camera, objects, actions per beat)
                                        │
                     LLM → bpy script over a fixed asset kit
                                        ▼
                     Blender EEVEE render ─► composite captions ─► 9:16 MP4
```

**PM:** What makes it work is the **physical world, not the tech**. A train, leaves and rails are objects anyone can picture. Your topics (brokers, partitions) don't come with a physical form, so the metaphor-world question from before matters even more now.

**CEO:** Don't copy the 3D. Copy the **grammar**: one stylized world, one camera move per beat, macro to micro and back. You could stay in the same pipeline by using **Remotion + Three.js** (`@remotion/three`), which renders 3D scenes inside your React video template. That would give you about 80% of this look while keeping one pipeline driven by JSON.

---

**Sharpest question, for you:** Are you willing to own a **3D asset kit** (a one-time art investment: about 10–15 reusable objects for your "infra world")? Or should the first version be **2.5D/SVG** to ship fast and see whether your hooks hold attention before spending on looks?

*(I couldn't confirm the tools: the channel page returns no metadata to automated fetches. Their About section or comments may name the stack.)*

### 15 · **user:**

my animations are diagrams, graphs, logs, alerts etc... not 3d

### 16 · **assistant:**

**CEO:** Good, that's actually your advantage. For engineers, the **dashboard is the physical world**. A latency graph falling off a cliff hits an SRE the way a train sliding past a station hits everyone else. You don't need a metaphor. The control room is the setting.

**PM:** Keep their grammar and change the camera: zoom from the macro symptom down to the micro cause and back out. In your world the "leaf" is **one log line**:

```
MACRO ─────────────────────────────────────────────► MICRO ──► back out
system diagram     a graph cliffs     zoom one node     THE log line      fix lands,
all green      ─►  p99 ↑ 40x      ─►  lag 2.1M msgs ─►  "rebalance..." ─►  graph recovers
 (situation)        (incident)                          (the leaf)        (mitigation/debrief)
```

The first 2 seconds of every Short should be **an alert firing or a graph cliffing**. That's your hook shot.

**Architect:** This is Remotion's sweet spot: plain SVG + React, deterministic and fast to render. You need a kit of about 8 primitives, built once:

```
TopologyDiagram   nodes/edges, health states, packets flowing
TimeSeries        line that draws in, threshold, cliff, recovery
LogStream         lines scrolling, one line highlighted/zoomed
AlertToast        fires, stacks, escalates
Terminal          command typed → output
Timeline          incident clock T+00:00 ticking
Callout           arrow + label pointing at the cause
Camera            pan/zoom across the canvas (the "dive")
```

The playbook JSON just choreographs them: which primitive shows up at which timestamp, with what data. Two hard constraints:
1. **9:16 kills wide diagrams.** Vertical means one primitive on screen at a time, stacked or cut between, not a full dashboard.
2. **Frame-driven, not time-driven.** Animations must be a function of the frame number. Your v3 player probably uses timers and CSS transitions, and that has to change.

**CEO:** That's the clean way to **close v3**: port its visuals into frame-driven Remotion components. v3 was a prototype of this kit all along.

---

**Sharpest question, for you:** What's the **"leaf" in your first episode**? In other words, which single, tiny, visual thing (a log line, a config value, one slow consumer) caused the whole Kafka freeze? If you can't name it in 5 words, the Short has no hook yet.

### 17 · **user:**

system architecture diagrams need not be zoom in /out. 
its fairly static for me. its the narrative and rich visuals to explain the incidents

### 18 · **assistant:**

[ran: Bash — Peek at the Kafka playbook structure]

**CEO:** Then your format is a **static stage with a moving story**, like a weather forecast: the map stays put, and the meaning moves across it. The diagram is the set. Highlights, evidence and the voice are the performance.

**PM:** I just looked at your Kafka playbook, and it's already that script. `components` is the stage, `timeline` beats have `focus` + `notes` (what lights up, what's said), `dashboard` panels carry a `why`, and `report` is the debrief. The 5-minute version basically **exists**: the timeline runs to about 300s. The 60s version is an **edit**: pick about 6 beats out of the timeline.

```
9:16 SHORT                         16:9 EPISODE
┌──────────────────┐               ┌────────────────────┬───────────────┐
│  STATIC DIAGRAM  │ ← stage,      │                    │  evidence     │
│  (focus glows)   │   never moves │   STATIC DIAGRAM   │  card stack   │
├──────────────────┤               │   (focus glows,    │  graph / log  │
│  EVIDENCE CARD   │ ← one at a    │    badges, flows)  │  / alert      │
│  graph│log│alert │   time, swaps ├────────────────────┴───────────────┤
├──────────────────┤   per beat    │  captions  ·  T+02:14 clock        │
│  captions        │               └────────────────────────────────────┘
└──────────────────┘
```

**Architect:** With a static stage, the hard constraint becomes **sync**: every highlight and every card swap has to land on a word in the narration. That means narration timestamps drive the visuals, not the other way around. Generate the TTS first, get word timings, and pin each beat's `focus` to a word ("...and then **the producer buffer** filled" → the buffer node glows on "producer"). Rich visuals with sloppy timing look like a slideshow. Tight timing makes them look produced.

**CEO:** And the 60s edit has to be **opinionated**, not a sped-up 5 min: hook (the alert), one wrong guess, the leaf, the fix, one lesson. Five beats.

---

**Sharpest question, for you:** Who makes the **60s cut**: an LLM picking beats from the full timeline automatically, or a separate `short` section *authored into each playbook* (a hook line, 5 beat refs, a punchline)? The first gives you more volume. The second probably keeps viewers watching longer.

### 19 · **user:**

content is a differnet discussion. 
i want a pipeline that can generate this.
what do you recommend. and are there any opensource ones available?

### 20 · **assistant:**

[ran: WebSearch — open source automated short video generator github remotion TTS captions MoneyPrinterTurbo short-video-maker revideo 202]

**CEO:** My recommendation is to **build your own pipeline on Remotion and borrow the plumbing from open source**. There's no off-the-shelf tool for "incident explainer with diagrams, graphs and logs." The open-source short-video generators are built around stock footage, and your visuals are your product.

**Architect:** Here's what's out there and how much of it fits:

| Project | What it is | Fit for you |
|---|---|---|
| [short-video-maker](https://dev.co/ai/mcp/short-video-maker) (MIT) | Kokoro TTS → Whisper.cpp captions → Pexels b-roll → Remotion, exposed as a REST/MCP API | **Borrow the plumbing** (TTS, word timings, caption styling, render). Skip the stock footage. It may be stale: last update reported mid-2025. |
| [OpenMontage](https://pinggy.io/amp/blog/openmontage_agentic_video_production/) | Agentic studio where your coding agent (Claude Code) is the director: WhisperX captions, ElevenLabs/OpenAI TTS, Remotion render | **Closest in spirit** to how you work. It's a good reference for the agent-as-director pattern, but probably heavier than you need. |
| [reelstack](https://awesome.ecosyste.ms/projects/github.com%2Fjurczykpawel%2Freelstack) | Text → reels via FFmpeg + Playwright | Basically headless-browser recording, the same as recording v3. Not recommended. |
| Remotion itself | React → MP4, frame-driven, official agent skills | **The engine.** Free for individuals, needs a license for companies with 4+ people. |
| Motion Canvas / Revideo (MIT) | Code-animated scenes | Only if you want a fully open-source license. Weaker for batch/headless rendering. |

**PM:** Your pipeline is about 5 stages, and you already own the first one:

```
playbook.json ──(you have this)
   │
   ├─► 1. CUT        select beats → 60s / 5min edit (data only)
   ├─► 2. VOICE      TTS per beat (Kokoro free / ElevenLabs paid) ─► whisper word timings
   ├─► 3. SYNC       pin each beat's focus/card to a word timestamp → render plan
   ├─► 4. RENDER     Remotion: <Stage diagram/> + <EvidenceCard graph|log|alert/>
   │                 + <Captions/> × {9:16, 16:9}
   └─► 5. SHIP       title/thumbnail/description → YouTube Data API (private → you review → public)
```

**Architect:** The one part nobody can sell you is **stage 4's component kit**: diagram, time series, log stream, alert, terminal, captions. Build those once by hand, frame-driven, and port v3's visuals into them. Everything else is plumbing you can borrow. Also keep uploads **private by default** and publish by hand: that's your quality gate.

---

**Sharpest question, for you:** Should **v3's player stay as the live/interactive renderer** (for the future chat sim) next to the new Remotion kit? Or should Remotion **replace it** completely, with the browser player retired? That decides whether you maintain one visual kit or two.

Sources: [short-video-maker](https://dev.co/ai/mcp/short-video-maker) · [short-video-maker (sourcepulse)](https://www.sourcepulse.org/projects/2566801) · [OpenMontage (pinggy)](https://pinggy.io/amp/blog/openmontage_agentic_video_production/) · [OpenMontage review](https://dev.to/andrew-ooo/openmontage-review-open-source-agentic-video-production-296l) · [OpenMontage on DEV](https://dev.to/creeta/openmontage-has-45k-stars-and-no-proprietary-orchestrator-437i) · [reelstack](https://awesome.ecosyste.ms/projects/github.com%2Fjurczykpawel%2Freelstack) · [topic → YouTube Short pipeline](https://dev.to/tsensei/i-open-sourced-an-ai-pipeline-that-turns-any-topic-into-a-youtube-short-e77) · [Remotion agent skills guide](https://aividpipeline.com/blog/remotion-agent-skills-guide-2026)
