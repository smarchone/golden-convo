---
schema: 1
id: 2026-10-12-sim-xp-experience-mods
title: Sim-XP — a core simulation engine where seniors encode experience as community mods
why: "seniors encoding experience as mods so engineers catch up faster"
harness: claude-code
harness_version: 2.1.296
model: claude-opus-5-5
session_id: ae9304ce-4fd6-44e1-8139-3bb6786591d9
started:
captured: 2026-10-12T03:06:22Z
cwd: ~/Documents/proj/claude/spark/sim-xp
mode: skill:intuition-panel (turns 5–20)
turns: 20
complete: true
golden_turns: [14, 16, 18, 20]
labels: [simulation, sre, incident-response, knowledge-mgmt, product-idea]
thread: uptimelabs-simulation-core
status: raw
---

**1. user:**
help me do research about @intent.md

**2. assistant:**
[ran: read intent.md]
[ran: fetched the 7 linked simulators + breakscale.tech; 11 web searches on incident-drill platforms, Uptime Labs, Wheel of Misfortune, OSS sims, AI incident simulators, SadServers/YouBrokeProd, Gary Klein / tacit knowledge, AI skill-formation study, simulation-training transfer evidence]

## Research: simulated-experience training for engineers

**Short answer:** Yes, people are building this, but almost all of it sits in two places, and the "how does it feel to *operate* it" experience you describe is mostly unbuilt. The idea is worth pursuing if you don't build another architecture sandbox.

### 1. Who's already doing it

| Cluster | Examples | Business | What's missing |
|---|---|---|---|
| **Architecture sandboxes** (all 7 of your links) | [SystemForge](https://github.com/vijaygupta18/system-design-simulator) (402★, 35 problems, rule-based score), [System Design Sim](https://systemdesignsim.com/) (deterministic, AWS prices, 23 challenges), [System Design Lab](https://systemdesignlab.netlify.app/) (chaos lab, CAP lab, AI generator), paperdraw ([Blind launch post](https://www.teamblind.com/post/i-built-a-system-design-simulator-drag-simulate-and-break-your-own-architectures-in-minutes-67md4rus): chaos options, forkable links), [Simulador de Arquitetura](https://simuladordearquitetura.com.br/) (AI diagram editing), [Breakscale](https://breakscale.tech/) (discrete-event sim, shows retry storms) | Free side projects, mostly for interview prep. Very crowded, and new ones keep appearing. | You design once and get a score. Nothing plays out over time and your decisions have no lasting consequences. The tool colours the bottleneck red, so you never have to *find* it, and the signals are never ambiguous. |
| **Incident drills** | [Uptime Labs](https://www.g2.com/products/uptime-labs/reviews_and_filters): 4.9★ on G2, about £200 per user per month, customers include Trainline and Domino's, claims MTTR down at least 20% (unverified). [YouBrokeProd](https://www.everydev.ai/tools/youbrokeprod): 10 scenarios built from postmortems. [Wheel of Misfortune](https://openpracticelibrary.com/practice/wheel-of-misfortune/): Google's manual, game-master format. | **Teams have shown they'll pay for this (B2B).** Individuals mostly haven't: YouBrokeProd has about 200 members and [0 paying](https://trustmrr.com/startup/youbrokeprod). | Uptime Labs reviewers say drills are "compressed" and all troubleshooting happens through chat. Scenario libraries are small and scripted, and the drills don't use a real system model. |
| **Real-infra troubleshooting** | [SadServers](https://mrkaran.dev/posts/sad-servers/), KodeKloud, DistSim (real containers) | Freemium; hiring teams also use SadServers for assessments | You fix one box. Nothing operates at scale or across multiple systems. |
| **Research and agent harnesses** | [IncidentLab](https://github.com/AkshitRampershad/IncidentLab), incident-commander-ai | Open source | These test AI agents, not humans. I found no mature product that uses an LLM to generate on-call training scenarios. |

### 2. Is it worth pursuing?

**Reasons to build it:**
- **AI is removing practice opportunities, and there's evidence.** Anthropic ran a randomised trial ([Jan 2026](https://www.anthropic.com/news/AI-assistance-coding-skills), 52 developers). The group using AI scored about 17% lower on understanding, debugging was hit hardest, and they weren't significantly faster. The participants who stayed cognitively engaged kept their learning. That's essentially your pitch.
- **Your framing matches established expertise research.** Gary Klein's recognition-primed decision model says experts recognise patterns rather than reason from scratch. His group's ACTA and Shadowbox methods were built to capture expert judgement and train novices on it ([Commoncog series](https://commoncog.com/the-tacit-knowledge-series/)). Your "encoding experience playbooks" is the same idea.
- **There's a paying market.** Uptime Labs shows organisations pay a lot for incident judgement.

**Risks:**
- **Transfer depends on fidelity, but only for the cues that matter.** Flight-simulator studies find transfer is weaker than gains measured inside the simulator, and it tracks how realistic the important cues are ([FAA 1969](https://www.faa.gov/data_research/research/med_humanfacs/oamtechreports/1960s/1969/196924), [de Winter 2012](https://trid.trb.org/view/1139530)). For operations, the cues are realistic noisy signals and realistic failure behaviour, such as metastable failures, retry storms and GC spirals. A simple formula-based model will teach wrong intuition, which is worse than none.
- **Content is both the moat and the bottleneck.** Writing good scenarios is expensive. Small libraries (YouBrokeProd's 10, Uptime Labs' "up to 20 per year") are where existing products are thin.
- **Selling to individuals is hard.** The evidence suggests selling to teams (onboarding, on-call readiness).

### 3. High-impact features missing from your list

1. **Realistic, imperfect observability.** Metrics that lag, sampled traces, alert storms, red herrings and missing dashboards, so the learner has to decide what to instrument. This is the biggest gap in every sandbox.
2. **Campaign mode, where consequences persist.** For example, a capacity plan in week 1 decides how the flash sale goes in week 3, which leads to the incident, the postmortem, the migration and the cost review. Time compresses between events and slows down for incidents. This is what "how does it feel" really means.
3. **Shadowbox-style debriefs.** At each key decision point, show what 3 senior engineers did and why, next to what the learner did. This turns your experience playbooks into a feedback loop.
4. **An AI cast.** An anxious PM, a VP asking for an ETA, a noisy Slack channel, a vendor support bot, and an adversarial chaos agent that targets the learner's weak spots. Your WebMCP idea fits here: the agent reads and writes sim state through tools.
5. **Scenarios generated from real postmortems.** An LLM turns public postmortems (e.g. the danluu/post-mortems corpus) into scenario scripts with fault timelines. That addresses the content problem.
6. **Import your own architecture.** Build the sim from Terraform, Kubernetes manifests or an OpenTelemetry service graph, so a team rehearses incidents on its *own* system. This is the strongest B2B wedge: onboarding and game days.
7. **A Socratic coach that won't hand over answers.** It asks questions instead, which directly addresses the AI-shortcut problem in your pitch.
8. **Judgement scoring, not pass/fail.** Score time to mitigate, blast radius, cost, communication quality and how calibrated the learner's hypotheses were. The decision log builds a judgement profile, which is also useful for hiring.
9. **Multiplayer roles.** Incident commander, comms and ops working together, so you train coordination as well as individual skill.

### Suggested next step

Pick one experience, like "prepare for a flash sale, handle the live incident, recover, write the postmortem", and build it end to end with high-fidelity signals: a discrete-event core, a fake Grafana and an AI cast. Then test it with 5–10 engineers. Ask whether their decisions were different the second time they played; that's a better test than whether they enjoyed it.

I can turn this into a shareable page or compare a few architecture options for the sim engine if you'd like.

**Sources:** [SystemForge](https://github.com/vijaygupta18/system-design-simulator) · [System Design Sim](https://systemdesignsim.com/) · [System Design Lab](https://systemdesignlab.netlify.app/) · [Simulador de Arquitetura](https://simuladordearquitetura.com.br/) · [SyDe](https://syde.cc/) · [paperdraw on Blind](https://www.teamblind.com/post/i-built-a-system-design-simulator-drag-simulate-and-break-your-own-architectures-in-minutes-67md4rus) · [Breakscale](https://breakscale.tech/) · [Uptime Labs on G2](https://www.g2.com/products/uptime-labs/reviews_and_filters) · [Uptime Labs on Capterra](https://www.capterra.com/p/10036483/Uptime-Labs/) · [Seedtable](https://seedtable.com/companies/uptime-labs) · [YouBrokeProd](https://www.everydev.ai/tools/youbrokeprod) · [TrustMRR](https://trustmrr.com/startup/youbrokeprod) · [Wheel of Misfortune](https://openpracticelibrary.com/practice/wheel-of-misfortune/) · [GOV.UK WoM](https://technology.blog.gov.uk/2021/03/04/wheel-of-misfortune-incident-rehearsal-for-gov-uk-paas/) · [SadServers review](https://mrkaran.dev/posts/sad-servers/) · [IncidentLab](https://github.com/AkshitRampershad/IncidentLab) · [Other OSS sims](https://github.com/Sumit200531/system-design-simulator) · [Anthropic skill-formation study](https://www.anthropic.com/news/AI-assistance-coding-skills) · [arXiv 2601.20245](https://www.arxiv.org/pdf/2601.20245) · [Commoncog tacit knowledge](https://commoncog.com/the-tacit-knowledge-series/) · [Gary Klein](https://en.wikipedia.org/wiki/Gary_A._Klein) · [FAA fidelity report](https://www.faa.gov/data_research/research/med_humanfacs/oamtechreports/1960s/1969/196924) · [de Winter meta-analysis](https://trid.trb.org/view/1139530) · [Rootly drills](https://rootly.com/sre/rootly-recovery-drills-playbook---master-outage-simulations)

**3. user:**
log this as a markdown file

**4. assistant:**
[ran: wrote research.md]

I saved the research to `research.md`, next to `intent.md`. It has the competitor landscape, the case for and against pursuing it, nine feature ideas, a suggested next step and all the sources.

I also added a short section with notes on each of the 7 simulators you linked; that detail wasn't in my earlier reply. The file isn't committed.

**5. user:**
/intuition-panel

**6. assistant:**
**CEO:** This isn't a system design simulator. It's a flight simulator for engineering judgement. Sandboxes teach you to draw boxes; you're selling the 3am feeling of *"I've seen this before."* Own "operate," not "design."

**PM:** Who opens this on a Tuesday? A mid-level engineer two weeks before their first on-call shift, or a staff engineer who wants to rehearse a migration? Pick one. Their first 10 minutes decide everything: are they *watching a dashboard go wrong*, or *making a call under pressure*?

**Architect:** Realism lives in the signals, not the topology. Laggy metrics, misleading alerts and retry storms need a discrete-event core; formulas will teach wrong intuition. Without that, it's a pretty quiz.

```
  calm ──► drift ──► alert ──► fog ──► decision ──► consequence ──► debrief
           (subtle)  (noisy)  (ambiguous)  (you)     (persists)    (vs. expert)
```

**Sharpest question:** In the first scenario, does the learner *prevent* the fire (capacity planning before the flash sale) or *fight* it (incident already in progress)? That choice sets the whole product's feel.

**7. user:**
there is a gap between a junior engineer with theoritical knowledge and little exp and a senior engineer with mid level exp and a general architect and an experienced SRE.
though in above search, companies like uptimelabs are commended, my task is to make the funnel conversion happen faster with less effort.

**8. assistant:**
**CEO:** So the product isn't drills, it's a promotion engine. Uptime Labs sharpens people who are already on-call; you move people *up the ladder*. Each rung is a different kind of judgement: junior → "what's broken", senior → "what to do", architect → "what to build", SRE → "what will break next."

```
 Junior ──► Senior ──► Architect / SRE
 theory     reflexes   foresight
   │          │           │
 "why is    "fix it    "it won't break
  it red?"   safely"    like that again"
     ▲  sim reps  ▲   sim campaigns  ▲
```

**PM:** "Less effort" for whom? If it means the learner, every rep has to be 15 minutes, not a half-day drill. If it means the org, there can be no game master and no scenario authoring. Which one is the real bottleneck today: learner time, or senior engineers' time spent mentoring?

**Architect:** A ladder means you have to *measure the rung*. Without a judgement signal (how fast they formed a hypothesis, how good their mitigation choices were, how big the blast radius was), you can't prove anyone moved faster. Instrument the decisions first and build the content second.

**Sharpest question:** What proves someone is ready for the next rung? Name the one behaviour you'd see in a junior that tells you "they think like a senior now." That behaviour is the core loop.

**9. user:**
i thought ai judge has to measure

**10. assistant:**
**CEO:** Yes, the AI judge is a product feature, not a backstage tool: a senior engineer in your pocket who watches every decision. But a judge without a rubric is just someone with opinions. It needs a definition of what a senior engineer looks like at each rung.

**PM:** When does the judge speak: live, like a mentor nudging mid-incident, or after, like a postmortem reviewer? Speaking live trains reflexes but becomes a crutch, the same problem you're fighting with LLMs. Speaking after builds independent judgement but the feedback loop is slower. Pick one per rung?

**Architect:** The sim is your unfair advantage, because it *knows the ground truth*. So split the scoring: the sim objectively scores outcomes (time to mitigate, blast radius, cost) and the AI judge scores *reasoning* (hypotheses, trade-offs, communication). An LLM judging alone is noisy and gameable; it rewards confident, well-written nonsense. Calibrate it against a handful of real senior engineers' playthroughs.

```
 learner actions ──► SIM ────────► outcome score  (objective)
        │                            │
        └─► reasoning log ──► AI JUDGE ──► judgement score
                                 ▲            │
                    senior playthroughs    rung verdict
                    (calibration set)    "thinks like L+1"
```

**Sharpest question:** Should the learner have to *say their thinking out loud*, typed or spoken, for the judge to grade, or should the judge infer it purely from their actions? Requiring narration adds friction but makes the judge far more accurate.

**11. user:**
we can explore the detailed product experience later. now we are exploring the idea space.

**12. assistant:**
**CEO:** Fair, so zoom out. The idea space has three axes: **what you simulate** (systems / incidents / decisions over years), **who it serves** (individual climber / team / hiring) and **who drives it** (scripted / AI-generated / your own real system). Every competitor sits in one corner; the open space is AI-generated scenarios that compound over time.

```
                  simulates DECISIONS over time
                            ▲
                            │        ★ open space
                            │   (AI-driven, compounding career sim)
                            │
  scripted ◄────────────────┼────────────────► AI-generated
       Uptime Labs ●        │
   Wheel of Misfortune ●    │
                            │   ● 7 sandbox sims
                            ▼
                  simulates a SNAPSHOT (a diagram)
```

**PM:** Each corner is a different product with a different emotion: a *game* (fun, solo), a *gym* (reps, habit), a *rehearsal* (real team, real system) or an *exam* (hiring, certification). Which emotion fits "make the funnel faster"? My bet is the gym.

**Architect:** Whatever shape you pick, one thing stays fixed: someone has to *encode experience*. Choose your corner by where the experience comes from: public postmortems, senior engineers' heads, or the company's own incidents. The source decides the shape.

**Sharpest question:** Is this a **gym** you return to weekly to climb rungs, or a **rehearsal** you run before a specific moment (first on-call, a migration, a flash sale)? Gyms grow habits; rehearsals deliver urgency.

**13. user:**
lets build a core engine, let community collab with mods and extend to add rich experiences and feeling

**14. assistant:**
**CEO:** Now it has a shape: **Factorio meets postmortems.** A core engine, plus a community that turns war stories into playable experiences. Seniors' scar tissue becomes a *mod*. That's how you get past the content bottleneck that kills Uptime Labs and YouBrokeProd.

```
 ┌──────────────── MODS (community) ────────────────┐
 │ "Kafka rebalance hell"  "Black Friday @ 50x"      │
 │ "Postgres → Scylla migration"  "GC death spiral"  │
 ├──────────────── MOD API ──────────────────────────┤
 │ components │ faults │ scenarios │ actors │ judges │
 ├──────────────── CORE ENGINE ──────────────────────┤
 │  discrete-event sim · time · signals/obs · state  │
 └───────────────────────────────────────────────────┘
```

**PM:** Modders are the real users in the beginning. Why would a staff engineer at Netflix spend a weekend encoding their worst incident? Reputation ("my scenario humbled 10K engineers"), teaching, or catharsis? Get that motivation right first and the learners follow.

**Architect:** Modding has a fidelity trap. A buggy mod doesn't just break; it teaches *wrong intuition* that feels right. The engine needs primitives realistic enough that mods compose physics instead of faking it (queues, saturation, retries, partitions), plus a way to validate or rate realism.

**Sharpest question:** What does the smallest mod look like? One YAML file ("inject this fault at this load, show these signals") or a code plugin with new component behaviour? That decides whether 10 people or 10,000 can contribute.

**15. user:**
on bad mods : even though it might teach wrong intuition, as there is no real world impact, atleast people will be elevated from novice thinking. in real world i see them being corrected by senior peers.

**16. assistant:**
**CEO:** Agreed, and it's a better frame. A lot of real-world learning is "mostly right, corrected later." So treat imperfect mods as *sparring partners*, not textbooks. Ship lots of them, imperfect, and let the correction loop do the teaching.

**PM:** Then make the senior-peer correction a *first-class mechanic*. Experienced players annotate runs and mods: "in prod, this would actually cascade via connection pools." The comments become the expertise layer, like Stack Overflow for gut feel.

```
   novice plays mod ──► forms intuition (maybe 70% right)
          ▲                        │
          │                        ▼
   mod gets patched ◄── senior annotates "reality check"
                                   │
                                   ▼
                        novice's intuition corrected
```

**Architect:** That only works if corrections flow back into the mod: forkable, versioned, with a "battle-tested" rating, like GitHub for war stories. Otherwise feedback stays in comment threads and the same wrong lesson ships forever.

**Sharpest question:** Do seniors correct the *mod* (fix the scenario itself) or correct the *player* (review their individual run)? The first scales content; the second scales mentorship.

**17. user:**
encoding experiences by seniors is a contribution to the community. instead of re-explaining things to lots of people, they encode their experience to these engines and let lots of engg catch up. atleast they can later have high level discussions on top of it saving time and energy. this is how i see sharing experiences might look like

**18. assistant:**
**CEO:** That's the thesis: **experience becomes an artefact.** Open source did this for code; this does it for judgement. A senior's war story stops being a 1:1 conversation repeated 50 times and becomes something people *play*. After that, the conversation starts at "you've felt it, so let's discuss trade-offs." That's the leverage.

```
 TODAY                              WITH ENGINE
 senior ──explain──► eng 1          senior ──encode once──► MOD
 senior ──explain──► eng 2                                   │
 senior ──explain──► eng 3       ┌──────────┬──────────┬─────┴────┐
   ... (×50, lossy)              eng 1     eng 2      eng N  (felt it)
                                   └──────────┴────┬─────┘
                                                   ▼
                                  senior ◄── high-level discussion
                                        (shared vocabulary)
```

**PM:** The first payoff is selfish and local: "I encode it once, and my team stops asking me the same question." Community reach is the bonus. So the hook for seniors is time saved within their own team, and the rest of the world benefits as a side effect.

**Architect:** Authoring friction decides everything. Seniors will *tell* a story in 20 minutes but won't *program* one for 2 days. So the engine has to accept the story, and AI drafts the mod from it (topology, fault timeline, signals) for the senior to tweak. AI does the encoding; the senior supplies the truth.

**Sharpest question:** What's the senior's raw input: a **spoken or written story**, a **real postmortem doc**, or a **recording of them playing it themselves**? Each one gives you a very different engine.

**19. user:**
ai definitely accelerates the content.

**20. assistant:**
**CEO:** Then content stops being scarce, and the moat moves. Anyone can generate 10K scenarios; the hard part is knowing which ones *feel true*. The value moves from authoring to **taste and curation**: whose experience is in the mod?

**PM:** If content is abundant, the learner's problem becomes *what do I play next?* So the engine needs a path ("you've mastered cache stampedes, now try a thundering herd during failover") that's personalised to the rung they're climbing.

**Architect:** AI drafts the scenario, and the engine keeps it honest. Generated mods must compile against real sim primitives, and the physics stays non-negotiable. In short, AI handles the *story* layer and the engine handles the *truth* layer, so slop can't break physics.

```
  senior story / postmortem
           │
           ▼
     AI drafts mod ──► engine validates (physics, determinism)
           │                      │
           ▼                      ▼
   senior tweaks "feel"   community plays + rates
           │                      │
           └──────► curated, path-ordered library ◄──┘
```

**Sharpest question:** With AI doing the encoding, what's the one thing a senior contributes that AI *can't* generate: the fault sequence, the misleading signals, or the **decision they got wrong** and what it taught them?
