---
schema: 1
id: 2026-11-14-connect-the-dots-simulated-experience-with-level
title: "Connect the dots: simulated experience with leveled expert ghost runs"
why: "Connect the dots reframed as simulated experience: one engine (situation, dots, connection, grader) with practice and interview modes, and a report that shows how experts at each level would have worked it \u2014 ghost runs. Success hinges on curated taste and the learning moment."
why_source: suggested
harness: claude-code
harness_version: 2.1.323
model: claude-opus-5-5
session_id: 90a2413f-4bc8-4ab5-acb9-b7ad62fe464b
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-skills/90a2413f-4bc8-4ab5-acb9-b7ad62fe464b.jsonl
started: "2026-11-13T06:52:41.029Z"
captured: "2026-11-14T20:29:40Z"
cwd: ~/Documents/proj/claude/spark/skills
mode: "skill:productivity:intuition-panel"
turns: 14
complete: true
golden_turns: [8, 10, 12]
labels: [product-idea, simulation, learning]
status: raw
---

### 1 · **user:**

/productivity:intuition-panel lets discuss @connect-the-dots.md

### 2 · **assistant:**

**CEO:** This isn't an RCA trainer. It's a **flight simulator for judgment**: hidden truth, scattered evidence, a clock, and someone breathing down your neck. RCA is just the first level.

**PM:** Who's the first player: the junior who wants to get better, or the manager who wants proof they did? Those two lead to different products. One is a game, the other is an assessment.

**Architect:** The hard part isn't the conversation, it's **generating the world**. A hidden truth that leaves consistent fingerprints across 15 observations, with noise that's believable but not a trick. If the world contradicts itself once, the player stops trusting it and the learning is gone.

---

**CEO:** Every variant is the same engine turned along two dials:

```
                 PAST (what happened?)            FUTURE (what will happen?)
              ┌──────────────────────────────┬──────────────────────────────┐
  ONE TRUTH   │ RCA / incident (SRE)         │ Pre-mortem (structural eng:  │
  (findable)  │ Diagnosis (doctor, mechanic) │   "where does this fail?")   │
              │ Forensic audit (accountant)  │ Safety review (nuclear)      │
              ├──────────────────────────────┼──────────────────────────────┤
  NO SINGLE   │ "Why did the metric drop?"   │ Forecast / thesis (economist,│
  TRUTH       │   (data analyst: Simpson's,  │   fin analyst: build a call, │
  (judgment)  │   mix shift, bad joins)      │   world reveals later)       │
              └──────────────────────────────┴──────────────────────────────┘
  + third dial: ADVERSARY. Is someone hiding the truth?
    (fraud, due diligence, intel analyst)  → the evidence lies on purpose
```

**PM:** The loop changes by quadrant. Top-left is "ask, get a dot, revise." Bottom-right has no answer key, so you grade the **reasoning trail**, not the conclusion. That's harder to grade and worth a lot more.

**Architect:** Bottom-right forces a different grader: a rubric covering base rates, disconfirming evidence and stated confidence, not "did you name X." The adversary dial means the world generator has to model **intent**, and that's a step up in difficulty, not just another setting.

---

**CEO:** My bet: start top-left in engineering, then go adversarial before going to finance. "Someone is lying to you" is the most memorable lesson there is.

**PM:** The sharpest question: **what does the player do between dots?** If they just wait for the next one, it's a story they're reading. If they have to *ask for* each dot and every ask costs something (time, credibility, the boss's patience), then it's investigation.

👉 **Is evidence pushed to them, or pulled by them? And what does a bad question cost?**

### 3 · **user:**

i think there can be a third row - few truths (few options)
i think we can create a platform to curate experience blocks and interview blocks

### 4 · **assistant:**

**CEO:** The middle row is where real life happens. It's not "find *the* cause" and it's not "anything goes." It's **3 live hypotheses and you have to rank them**, or several causes that each contribute. That row teaches *weighing*, which is the skill seniors have and juniors don't.

```
  ONE TRUTH    → find it                (convergent)
  FEW TRUTHS   → rank / weigh / choose  (discriminating)   ← new
  NO TRUTH     → defend a position      (judgment)
```

**PM:** The few-truths loop has its own move: **"what evidence would split A from B?"** If the player can ask for the observation that tells two hypotheses apart, they've got it. That one question might be the whole grading criteria.

**Architect:** Few-truths raises the bar on world generation. Each hypothesis needs its own fingerprints, the fingerprints have to overlap, and at least one dot has to separate them. Without a separating dot, it's a coin flip pretending to be a puzzle.

---

**CEO:** Blocks are the right instinct. Split **the world** from **the room**:

```
  EXPERIENCE BLOCK (the world)        INTERVIEW BLOCK (the room)
  ─────────────────────────           ─────────────────────────
  domain: SRE / audit / clinic        mode: Socratic coach
  hidden truth(s): 1 | few | none     mode: impatient VP
  dots + noise ratio                  mode: hiring interviewer
  reveal: dump | drip | on-ask        mode: hostile auditee (lies)
  rubric                              pressure, clock, cost-per-ask
              \                         /
               └──── SESSION = world × room ────┘
```

Same outage, three rooms: a coach teaches you, a VP stresses you, an interviewer grades you. **One world, three products.**

**PM:** That last pairing changes the buyer. World × hiring-interviewer is a **hiring tool**, and companies pay for that today. World × coach is a learning tool, and individuals rarely pay for that. Decide which one is the wedge before the platform gets built.

**Architect:** The blocks only compose if they share a **contract**: the world exposes "truth, dots, reveal rules," and the room only gets to *query* the world, never invent facts. If the room can make things up, the impatient VP will contradict the evidence and the session falls apart.

---

👉 **Sharpest question: who writes the blocks?** Experts curating by hand (high quality, slow), or AI generating them with experts reviewing (fast, but consistency is at risk)? Your answer decides whether this is a **library** or a **platform**.

### 5 · **user:**

instead of world vs room, can we frame it as situation vs stakes?

### 6 · **assistant:**

**CEO:** Yes. **Situation vs Stakes** is better, because it names what the player *feels*. "World/room" describes where you are, "stakes" describes what you stand to lose. And emotional pressure was in your original note, so the frame comes straight from the core idea.

```
  SITUATION (what's true)            STAKES (what it costs to be wrong)
  ───────────────────────            ──────────────────────────────────
  domain, hidden truth(s)            who's watching: peer / VP / regulator
  1 | few | none                     clock: none / 30 min / live outage
  dots, noise, reveal rules          cost per question asked
  adversary? (someone lies)          consequence: learn / lose face / lose the job
```

**PM:** One thing gets dropped: **who's on the other side of the table**. A Socratic coach and a hiring interviewer can have the *same stakes* and still be different products. Stakes is the pressure. The **purpose** (teach vs assess) is a separate dial. Fold it into stakes or keep it as a third block?

**Architect:** The contract still holds with the new names. The **situation owns the facts** and the **stakes own the pressure**, so stakes can speed up the clock or make the VP angrier, but they can never change a dot. Stakes are the easy block to author, and that's good news: a few stakes profiles can be reused across hundreds of situations.

```
  situation  ×  stakes  ×  (purpose?)
     100          5           2       = 1000 sessions from 107 blocks
```

---

👉 **Sharpest question: is "teach vs assess" part of the stakes, or its own block?** If it's part of the stakes, being graded is just high pressure. If it's its own block, you have two products on one engine.

### 7 · **user:**

lets reassess the abstractions:
connect the dots -- (liesurely, leaderboard) practice exercices mode, interview mode (new age interviews)

for a domain and a role, a connection needs to be made given a situation. a grader generates report.
dots will be given, the user interactively tries to make connection.
grader compares  (it may contain rubric) users connection work againt a hidden connection (can be optional).

several types of (sitauations, connections, grader) combo - as discussed above
- one truth -- definite analysis
- few truths -- options/ranking/judgement
- no single truth -- expert opinion (expertise)


things can be made challenging -- adversaries (noise, irrelevent dots, incorrect dots, types, ladders etc..)
dots can be visual as well (to make it more engaging and cognitive friendly)

dots can be lazy revealed, dynamically generated or static -- optional.

this is what i have in mind. everything need not be considered.
i understand initially simplest thing should be done. but we are scoping the space and potential at this point.

lets discuss and understand how it feels and validate the idea

### 8 · **assistant:**

**CEO:** This holds together. Five nouns cover the whole space: **Domain·Role → Situation → Dots → Connection → Grader**. Each new thing you listed is either a dial on one of those nouns or a mode. Nothing needs a sixth noun, and that's the sign the abstraction is right.

```
  MODE:  practice (leisurely, leaderboard)  |  interview (new age hiring)
  ─────────────────────────────────────────────────────────────────────
  DOMAIN·ROLE   SRE · auditor · analyst · structural eng · ...
       │
  SITUATION ── truth type: one | few | none
       │       adversary: noise · irrelevant · false dots · ladder level
       │
  DOTS ─────── form: text · log · chart · photo · diagram
       │       reveal: static | lazy (on ask) | dynamic (generated)
       │
  CONNECTION ─ the user's work: what they linked, why, and in what order
       │
  GRADER ───── vs hidden connection (optional) + rubric → REPORT
```

**PM:** Visual dots plus the name "connect the dots" gives you the core interaction: **the user literally draws the lines**. Dots on a canvas, and they connect them with a "because" on each edge. That *feels* like investigation, it's fun in practice mode, and in interview mode the reasoning is right there on screen.

```
   [p99 latency ↑]───because───▶[deploy 14:02]
          │                            │
       because                      ✗ red herring
          ▼                            ▼
   [conn pool maxed]◀──because──[new retry config]   ← hidden truth
```

**Architect:** That drawing is what makes grading workable. A **graph is comparable**: edges matched, edges missed, false edges, red herrings followed. Free-text conclusions only get vibe-grading. The three truth types become three graph comparisons: *exact match*, *ranked subgraphs*, *rubric over the reasoning trail*. Same grader, different scoring function.

---

**CEO:** Validation in one line: practice mode is **Duolingo for judgment** and interview mode is **the take-home that can't be faked**, because the trail is visible. Both run on one engine. That's real potential.

**PM:** The two modes differ on one thing, though. Practice needs **lots of situations** (variety, replay, leaderboard). Interview needs **a few situations that are calibrated** (fair, comparable across candidates, hard to leak). One mode needs volume and the other needs rigor, so your authoring strategy splits.

**Architect:** Interview mode also brings in requirements practice mode never has: **leak resistance** (dynamic dots, so the same situation never shows the same surface twice) and **grader defensibility** (a candidate rejected by an AI grader will ask why). Dynamic dots fix the first one and make the second one harder.

---

👉 **Sharpest question: is the connection a graph the user draws, or an argument they write?** A drawn graph is gradable, visual and fun, but it may oversimplify expert reasoning (the no-truth row). Written work is richer but hard to grade. Or is it both: **draw the graph, defend it in conversation?**

### 9 · **user:**

im open to ideas and change based on feel. 
content generation for practices demands platform -- authors create packs and practitioners use them over a catalog (but this is a distant one). 

simplest one is I build one pack and pilot it.

interview mode is just a hiden pack to test how the candidate deals with situations.

this is more like simulated experience.

### 10 · **assistant:**

**CEO:** "Simulated experience" is the real name of this. Experience is what seniors have and juniors can't buy: **ten years of incidents compressed into ten evenings.** Interview mode stops being a separate product and becomes *"show me your simulated experience on a pack you haven't seen."* That's one engine with one idea behind it.

```
  PACK = situations for one domain·role, laddered
     │
     ├── public  → practice   (play, replay, leaderboard)
     └── hidden  → interview  (one shot, graded report)

  platform/catalog/authors ......... later, maybe never
```

**PM:** For the pilot pack, build what you can **judge yourself**. You're an engineer, so make it an **SRE/backend RCA pack, one-truth row, 5 situations, laddered**. Then put it in front of 3–5 juniors with a senior watching. The feeling to check for: *do they want to play situation #2?* If they don't come back voluntarily, nothing else matters.

**Architect:** Pilot shape, as small as it can be:

```
  static dots (hand-written)  ──▶  chat + simple "connect" step  ──▶  LLM grader vs hidden truth
  no dynamic gen, no visuals yet, no leaderboard
```

Hand-write the situations; don't generate them. The first thing you're testing is whether **the experience teaches anything**, not whether an LLM can invent consistent worlds. Generation is a separate risk, so tackle it later.

---

**CEO:** One trap: a pilot of 5 one-truth puzzles can feel like **escape rooms**, fun once and then solved. What makes it *experience* rather than *puzzles* is the **debrief**, where the grader shows what a senior would have checked first and why. The report is the actual product.

**PM:** Agreed. The report should read like **a senior's postmortem of your investigation**, not a score.

---

👉 **Sharpest question: what does a junior walk away with after one situation?** A score, a senior's walkthrough of the path they missed, or a habit they'll use in the next real incident? Pick one, and the pilot is designed around it.

### 11 · **user:**

report is how an expert (levels) could have done, i like it

### 12 · **assistant:**

**CEO:** That's the hook: **ghost runs**, like in racing games. You finish, and then you watch how an L3, an L5 and a staff engineer would have worked the same situation, overlaid on your own path. Your score matters less than seeing how far you are from the next level.

```
  YOUR PATH    dot1 → dot4 → dot2 → (red herring 8 min) → dot6 → ✓ 34 min
  L3 ghost     dot1 → dot2 → dot4 → dot6 → ✓ 22 min
  L5 ghost     dot1 → dot6 → ✓ 9 min     "checked what changed first"
  STAFF ghost  dot6 → ✓ 4 min            "asked for the deploy diff before looking"
                                          ▲
                              the habit worth stealing
```

**PM:** The loop is now: **play → see the ghost one level above you → replay.** Your level is defined by the ghosts you can beat, so the skill ladder comes for free and you don't have to design it. "Beat the L5 ghost" is also a goal people will come back for.

**Architect:** Ghosts are **paths, not answers**, so each situation needs authored runs at every level: the order dots were pulled, the reason for each move, where they got stuck. That's about 3× the authoring per situation. The cheap shortcut is to **record real engineers at those levels playing the pack** and turn their runs into ghosts.

---

**CEO:** That shortcut is also a moat. Recorded expert runs are **captured judgment**, the thing nobody writes down. Whoever builds the library of ghost runs owns something hard to copy.

**PM:** For the pilot, have 2–3 seniors you know play your 5 situations first. Their runs become the ghosts, and you'll quickly learn whether the situations hold up under expert play.

---

👉 **Sharpest question: are ghosts recorded from real experts or written as idealized paths?** Real ones are messier and more honest (seniors chase red herrings too). Idealized ones are cleaner but can feel like a textbook. Which one would *you* learn more from?

### 13 · **user:**

to have better experience, the packs needs to be carefully curated. 
or the taste needs to be carefully encoded as skill. 

its all the experience part and the learning part that matters for this to be successful.

### 14 · **assistant:**

**CEO:** Both, in order. **Curate by hand first, then encode the taste.** You can't write down taste you haven't exercised. Hand-build 5 situations, notice what made the good ones good, and that list *becomes* the skill. The pilot doubles as the taste-discovery exercise.

```
  hand-curate 5  ──▶  playtest  ──▶  "why did #3 land and #5 flop?"
                                          │
                                          ▼
                              TASTE.md  (rules for a good situation)
                                          │
                                          ▼
                       skill: generate → lint against taste → expert playtest
```

**PM:** A first guess at what that taste looks like, so you have something to argue with:

```
  1. ONE SEPARATING DOT      there is a moment where it clicks, and it's earned
  2. TEMPTING RED HERRING    wrong in a way a real junior would be wrong
  3. GHOST GAP > SCORE GAP   the L5 path teaches a habit, not just a faster answer
  4. FEELS LIKE A TUESDAY    situations from real life, not puzzles built to trick you
  5. REPLAY REVEALS MORE     the second run shows something the first one didn't
```

If a situation fails #3, it's an escape room, not experience.

**Architect:** Taste can be checked mechanically, but only partly. A linter can verify **structure**: a separating dot exists, the dots are consistent, every ghost path is valid. It can't verify **"did the player learn something."** That stays a human playtest gate, and it should, because it's the one quality bar that can't be faked.

---

**CEO:** Right, the experience *is* the product. The engine, the modes and the platform are all just packaging. If a single situation doesn't make a junior say *"oh, that's how seniors think,"* nothing else helps.

---

👉 **Sharpest question: what was a real moment where *you* connected dots others missed?** Make that situation #1 of the pilot pack. Your own war story is the highest-taste content you have, and writing it up will show you what your taste actually is.
