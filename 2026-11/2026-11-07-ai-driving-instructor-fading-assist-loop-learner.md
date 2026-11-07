---
schema: 1
id: 2026-11-07-ai-driving-instructor-fading-assist-loop-learner
title: "AI driving instructor: fading-assist loop, learner model, India driving-school channel"
why: The agent instructor's moat is a fading-assist loop plus a learner model, and India's instructor shortage turns driving schools into the channel.
why_source: suggested
harness: claude-code
harness_version: 2.1.319
model: claude-opus-5-5
session_id: 43daa93a-83fd-4641-b612-e6d8bee90bf8
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas-g29-sim/43daa93a-83fd-4641-b612-e6d8bee90bf8.jsonl
started: "2026-11-07T16:44:24.948Z"
captured: "2026-11-07T18:06:35Z"
cwd: ~/Documents/proj/claude/spark/ideas/g29-sim
mode: "skill:intuition-panel"
turns: 14
complete: true
golden_turns: [10, 12, 14]
labels: [product-idea, agents, simulation, competitive-analysis]
status: raw
---

### 1 · **user:**

rename the github repo as driving-school

### 2 · **assistant:**

[ran: Bash — Rename GitHub repo and update local remote URL]

I renamed the GitHub repo from `smarchone/driving-sim` to `smarchone/driving-school`. I also pointed your local `origin` remote at the new address, `<redacted>:smarchone/driving-school.git`. GitHub forwards links that use the old name to the new one.

### 3 · **user:**

/anthropic-skills:intuition-panel i want to build a driving school with an instructor agent.
this is for people who already have the hardware (logitech g29 wheel with pedals etc..)
the value i think is, an instructor agent will interactively guide a novice beginner learn driving in an at home simulator.
there can be situation/feature based lessons.
the agentic experience is the moat.
from telemetry, the agent can suggest in near real time; immediately retry a section of drive; add overlay on how its done (just before a section or during)  etc..
this will be a highly personalized learning experience.

race mode, city mode, long drive mode etc...
community can extend maps, visuals etc...

am i reinventing the wheel ? is anyone doing this already.

### 4 · **assistant:**

**CEO:** Partly. The two halves exist separately, but nobody has put them together. City Car Driving already sells a road-rules "driving school" that works with a G29, though its lessons are scripted and don't adapt to you. Trophi.ai and Track Titan already do AI coaching from telemetry, but only for racing. Your opening is the one nobody has: a *road-driving novice* with an *adaptive agent*. Keep that, drop race mode, and you're not reinventing anything.

**PM:** Who does someone with a G29 actually want to become? Most of those owners are sim racers who can already drive. The true novice, a 16-year-old or an adult who's never driven, mostly doesn't own a wheel. So is this for the hardware owner, or for their kid sitting in the hardware owner's rig?

**Architect:** Building the simulator is the trap. Physics, traffic AI and city maps will take your whole first year. Run on top of an existing sim's telemetry, like BeamNG (its Lua and telemetry APIs are open), the way the racing coaches sit on iRacing and ACC. Then all you build is the agent loop.

```
 existing sim ──telemetry──▶ [ instructor agent ] ──▶ voice / overlay / "rewind 10s, try again"
   (BeamNG etc.)               ▲ lesson graph + learner model
                               └── this is the only thing you build
```

**CEO:** Your moat isn't the overlays. It's an instructor that knows *you* stall on hill starts and won't move you on to the next lesson until you've stopped doing it.

**Sharpest question:** is your first user the sim racer, or the novice who has never touched a car? The answer changes the lessons, the tone, and whether "race mode" exists at all.

*(The competitor names come from what I already knew, not a fresh search. Say the word and I'll run a proper market scan.)*

### 5 · **user:**

do a quick research

### 6 · **assistant:**

[ran: WebSearch — AI driving instructor simulator steering wheel learn to drive at home 2026]
[ran: WebSearch — AI real-time voice coach sim racing telemetry trophi.ai track titan]
[ran: WebSearch — City Car Driving simulator driving school lessons Logitech G29]

I ran three searches and kept the panel format.

**CEO:** You're not reinventing it, but the gap is smaller than it looked. The scripted road-driving lessons and the AI racing coach both exist and both support the G29. Nobody sells a home product that puts an *adaptive agent* on top of *road* lessons. That's still your opening, but expect someone to fill it within 12–18 months.

```
                 SCRIPTED LESSONS            ADAPTIVE AI COACH
 ROAD / NOVICE   City Car Driving            ← EMPTY (you)
                 Virtual Driving School (UK)    (only research: NTNU, Toyota "Driving Sensei")
                 myDRIVESCHOOL (AU, B2B)
 RACING          Coach Dave, VRS             trophi.ai (live voice, 59 langs)
                                             Track Titan × MOZA, MOZA AI Coach
```

**PM:** The threat is MOZA. A wheel maker already shipping AI coaching, including a demo at Gamescom 2026 where the wheel physically moves to *show* you the input. If they point that at road driving, the hardware company owns your loop. Your edge has to be lesson design and a learner model, not the wheel.

**Architect:** The stack is already proven. trophi.ai shows live voice coaching from telemetry works on top of someone else's sim. NTNU found an AI instructor's feedback matched a human's in a full simulator. What nobody has proven is a **"rewind 10s and retry"** feature in *traffic*, because that means running on a sim you control.

**CEO:** That's a fork in the road. Run on top of an existing sim and you ship fast with no retry feature. Build your own and you get rewinds, but it takes years. Which do you pick?

**Sharpest question:** is the instant retry essential to the product, or just nice to have? If it's essential, you're building a simulator. If not, you're building something like trophi.ai for road driving.

Notes on what I found:
- **Virtual Driving School** is the closest scripted rival. It covers clutch, roundabouts and parking. Its listings disagree on whether it has fully launched.
- **City Car Driving** user reviews are mixed. One estimate puts it at "50–60% realistic," useful for basics only.
- Most of the trophi.ai sources are promotional pages, so treat its feature claims as marketing.

Sources:
- [Virtual Driving School – Steam](https://store.steampowered.com/app/1515220) · [vgdb listing](https://www.vgdb.co/games/virtual-driving-school)
- [City Car Driving – Steam](https://store.steampowered.com/app/493490/City_Car_Driving/) · [G29 settings guide](https://www.briankoponen.com/city-car-driving-logitech-g29-g920-settings/) · [TechEnclave thread](https://techenclave.com/t/how-does-steering-wheel-use-in-games-eg-logitech-g29-923-compare-to-actual-car-driving-in-real-life/265553)
- [myDRIVESCHOOL / Sign For Work](https://www.signforwork.org.au/?p=9821)
- [NTNU: digital instructor as good as a real one](https://norwegianscitechnews.com/2024/08/a-digital-driving-instructor-is-just-as-good-as-a-real-one/)
- [Toyota Research: Driving Sensei](https://medium.com/toyotaresearch/driving-sensei-87e049e5d2bc)
- [trophi.ai](https://trophi.ai) · [Mansell AI voice coach](https://get.trophi.ai/f1/clkn/rel/a-2-lightbox.html) · [Top Gear opinion](https://www.topgear.com/car-news/gaming/opinion-can-ai-make-you-a-better-driver)
- [MOZA × Track Titan](https://traxion.gg/moza-partners-with-track-titan-to-produce-ai-coaching-app) · [MOZA AI Coach](https://mozaracing.com/pages/ai-coach) · [MOZA at Gamescom 2026](https://boxthislap.org/moza-racing-lab-ai-coach-gamescom-2026/)
- [Can racing sims teach you to drive?](https://racinggames.gg/article/can-racing-sims-actually-teach-you-to-drive-the-ultimate-learners-guide)

### 7 · **user:**

playback feature with ai assisted overlay will accelerate learning.
the problem that im solving is learning experience.
hardware can be shared or this can be solved parallely by others or a different solution (its a distribution problem - rentals, cobranding etc..) -- lets say not my concern.
what if we help local driving schools to rent these hardware devices... this can be an opportunity.
WDYT ?

### 8 · **assistant:**

**CEO:** Yes, and it changes who your customer is. Your buyer stops being a gamer with a G29 and becomes a driving school that's short on instructor hours. Pitch it as more lessons per instructor, with the hardware rental bundled in. Then the "distribution problem" you set aside is solved by the channel itself.

```
  learner ──books──▶ driving school ──rents rig + seat──▶ you
                         │                              │
                  instructor watches         agent coaches, records,
                  2–4 sim bays at once       plays back with AI overlay
                         └──── student shows up to the real car "pre-warmed" ────┘
```

**PM:** Make playback the hero feature. "Watch your roundabout again, with the AI showing where your eyes and hands should have been" sells to a learner *and* lets the human instructor explain it. The question is what the school owner is buying. Is it more students, a higher price per student, or fewer wasted hours in the real car? Pick one, because that becomes your pitch.

**Architect:** Playback is far easier than rewind-and-retry. It's just recorded telemetry plus a ghost car and annotations, which works on top of an existing sim. A school deployment adds work a home user never needs: several students per rig, a dashboard for instructors, and hardware that survives 40 teenagers a week. Also, as far as I know, sim hours count toward a licence only in a few countries. Elsewhere it's practice only, and that affects what schools will pay.

**CEO:** Start with one school in your city. Run it by hand, and measure whether students need fewer real-car hours to pass. That one number sells the next fifty schools.

**Sharpest question:** what do you predict that number is? Does a student with 5 hours on your sim need 3 fewer real lessons, or just feel more confident? If it's only confidence, it's hard to sell to a school.

### 9 · **user:**

im from india... there are lots of people and less driving schools....

### 10 · **assistant:**

**CEO:** In India this stops being a home-sim hobby and becomes a big market. Huge demand, not enough instructors, and quality that varies wildly. Build the instructor where there are too few of them. And Indian traffic is a moat in itself: manual gearboxes, two-wheelers on every side, autos cutting in, cows, no lane discipline. No Western sim models any of that.

```
  demand (millions of learners/yr)  ████████████████████
  qualified instructors             ███
  gap your agent fills              ─────────────────▶  1 instructor : 4 sim bays : Hindi/Tamil/Telugu voice coach
```

**PM:** Who's your first user: the Bengaluru techie who wants confidence before facing traffic, or the tier-2 learner who just needs a licence? The techie pays for a confidence-building course. The licence-seeker pays for "pass the test." Those are two different products. Voice in a local language beats any overlay for both.

**Architect:** Look at the rules before you build. As far as I know, MoRTH's accredited driver training centre rules (2021, extended to private schools in 2024) let graduates skip the RTO driving test, and simulators show up in the facility requirements. If that's right, schools *have to* buy a simulator, so you're selling something they need, not a nice-to-have. Check the exact clauses. Also, a G29 + PC rig costs roughly ₹80k–1L, so it only works shared across many students, never one per student.

**CEO:** If simulators really are on the accreditation checklist, then a "simulator that teaches by itself" is the cheapest way for a school to get accredited and better than what they'd otherwise buy. That's the pitch.

**Sharpest question:** do you want the confident city driver or the licence-seeker? I'd start with **urban adults afraid of Indian traffic**: they pay more, the problem is emotional, and playback ("see how you froze at that junction") hits hardest for them.

*(The accreditation details are from memory. I can look up the actual MoRTH rules if you want.)*

### 11 · **user:**

now that there is a possibility of business, lets focus on product

### 12 · **assistant:**

**CEO:** The product is one loop, repeated until the student stops making the mistake. Don't build a map, build *moments*. A lesson is the 40 seconds around something hard, like a half-clutch start on a flyover incline with a bike pressed against your door. Get that one moment right and you know what everything else should feel like.

```
  BRIEF ──▶ DRIVE ──▶ AGENT FLAGS ──▶ PLAYBACK + OVERLAY ──▶ RETRY ──▶ MASTERED?
  (10s voice)  (the moment)  ("you rolled back 40cm")  (ghost of correct inputs)  (same spot)   no ─┐
     ▲                                                                                          │
     └──────────────────── next moment from skill graph ◀── yes ◀─────────────────────────────┘
```

**PM:** The wow moment comes in minute three. The student stalls, the agent says "watch this" in Hindi, replays their own feet next to the correct pedal curve, and puts them back at the same spot. If that loop doesn't feel magical, nothing else matters. So the first lesson should be the most universal Indian fear: **stop-go traffic with a manual clutch**.

**Architect:** Everything rests on three things:
- **Telemetry capture**: pedals, wheel, gaze proxy.
- **A scene you can restart**: put the car and the traffic back exactly.
- **A skill graph**: clutch → incline → junction → overtaking.

Existing sims can't do the restart well, and none has Indian traffic, so you'll own the sim. Keep it tiny: one street, scripted chaos, rebuilt in the same state on every retry.

**CEO:** Start with five moments, not five modes. Race mode and long-drive mode can wait until the school pays.

**Sharpest question:** what is the agent *allowed* to do mid-drive? It can talk only, it can freeze time, or it can take the wheel (force feedback nudging your hands). Each makes for a very different instructor, and you need to pick one.

### 13 · **user:**

agreed.
so the core is the same regardless of mode.
sim/mode + assist (pre-viz) -> telemetry -> detect issues -> retry with assist
lessons, modes, chaos, skill graph etc... will enrich the product
WDYT ?

### 14 · **assistant:**

**CEO:** Agreed, that's the right spine. One thing is missing, and it's the thing that makes it a *school*: **assist has to fade**. Retrying with the same assist forever is a crutch, not a lesson. You've mastered a moment when you pass it with the assist turned off.

```
  sim/mode + assist(level N) ─▶ telemetry ─▶ detect issues ─▶ retry with assist(N±1)
                    ▲                                              │
                    └──────────── learner model (remembers you) ◀──┘
          assist ladder:  ghost car + pedal overlay → voice cue only → silent → exam
```

**PM:** The learner model is your personalization claim. Without it, every student gets the same loop. With it, the agent knows Priya rides the clutch on inclines but brakes fine. She skips braking drills and gets three extra incline retries. That memory is the "instructor" part.

**Architect:** In your pipeline, **detect issues** is the hard box. A detector needs to know what "correct" looks like *for this moment*: a reference trace, rules ("rolled back > 20cm", "no mirror check before lane change"), or a demo from an expert driver. Make every moment declare its own success criteria, and keep the engine generic: scenario → events → detectors → assist renderers. Then lessons, modes and chaos are all just data plugged into the same engine, which is also what lets the community extend it.

**CEO:** So the product is the engine plus the learner model. Content is how you grow, and modes are just packaging.

**Sharpest question:** who writes the definition of "correct" for each moment: you, real instructors, or the agent learning from expert drivers? That decides how fast you can add lessons.
