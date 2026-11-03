---
schema: 1
id: 2026-11-03-lightweight-browser-moba-poc-shape-feel-dial-and
title: "Lightweight browser MOBA: POC shape, feel dial, and buildable stack"
why: "Browser MOBA intuition: shrink the session, not the feel; a combat\u2194strategy dial tuned as data; and no ready-made core exists, so assemble Colyseus + Three.js/Phaser."
why_source: suggested
harness: claude-code
harness_version: 2.1.316
model: claude-opus-5-5
session_id: dbd08a4f-0961-4029-8f45-1d9b984c9f12
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-dota3/dbd08a4f-0961-4029-8f45-1d9b984c9f12.jsonl
started: "2026-11-02T15:23:44.752Z"
captured: "2026-11-03T05:24:15Z"
cwd: ~/Documents/proj/claude/spark/dota3
mode: "skill:productivity:intuition-panel"
turns: 10
complete: true
golden_turns: [4, 6, 10]
labels: [product-idea, system-design, build-vs-buy, game-dev]
status: raw
---

### 1 · **user:**

/productivity:intuition-panel can we build a lightweight dota2 on web, while maintaining engagement ?

### 2 · **assistant:**

**CEO:** Don't shrink Dota. Keep the feeling instead: outplaying someone with one well-timed spell. Build our own MOBA that fits in a 12-minute browser match, with 3v3, one lane plus jungle, and heroes designed from scratch.

**PM:** Who's playing it? A lapsed MOBA player on a lunch break, or someone who's never touched the genre? The core loop changes completely depending on which.

**Architect:** Ping matters more than graphics. Browsers run fine on low-poly 2D/2.5D, but a lockstep or authoritative server needs sub-100ms latency, or skill-shots feel like mud. Build netcode first and art second.

```
 Dota feel            Web-lite feel
 ─────────            ─────────────
 45 min        →      10–12 min
 5v5, 3 lanes  →      3v3, 1 lane + jungle
 100+ heroes   →      ~12 sharp kits
 item tree     →      3 build "paths"
 download      →      click link → in match < 20s
```

**CEO:** People stay for the moment you share the link and your friend is in your lobby 10 seconds later. That's the hook.

**PM:** So what's the one moment players should feel every match? Is it a teamfight wipe, a solo outplay, or a comeback?

**Architect:** Pick one, because it decides tick rate, map size and how many hero mechanics you can afford.

---

**Your call:** What moment should every match deliver, and who's it for: MOBA veterans or newcomers?

### 3 · **user:**

thinking of building a POC to test the waters and feel. then extend to 5v5 with full gaming experience

### 4 · **assistant:**

**CEO:** Good. Make the POC the smallest thing that can feel fun: one lane, two heroes each side, bots as filler. If a 2v2 isn't fun, 5v5 won't save it.

**PM:** What's the test? I'd measure one thing: does a player hit "rematch" without being asked? That one click tells you whether the feel works.

**Architect:** Design the netcode for 10 players from day one, even if the POC runs 4. You can scale up the map later, but rewriting a sync model built for 2v2 is a tear-down.

```
 POC (weeks)              →   Extend (months)
 ───────────                  ───────────────
 1 lane, 2v2 + bots           3 lanes, 5v5
 4 heroes, 3 skills each      roster grows
 last-hit + 1 tower           jungle, objectives
 local / single server        matchmaking, regions
 metric: rematch rate         metric: D7 retention
```

**CEO:** One warning: "full gaming experience" is where projects die. Expand only when the POC earns it.

**PM:** Which feel do you want to prove first: the moment-to-moment combat (aim, dodging, last-hits), or the strategy layer (builds, map pressure)? You can't test both in a POC.

**Architect:** Combat feel means fixing input latency and hit-feedback first. Strategy feel means you could even get away with slower ticks. So the answer decides the stack.

---

**Your call:** Should the POC prove that combat feels good or that the strategy holds up?

### 5 · **user:**

can we have a dial ?

### 6 · **assistant:**

**CEO:** Yes, but make it one dial, not a settings menu. One knob from "twitch brawl" to "chess with spells" lets you find the sweet spot by playtesting instead of debating.

```
   COMBAT ◄━━━━━━━━━━●━━━━━━━━━━► STRATEGY
     │                │                │
  skill-shots      hybrid          auto-attacks
  fast TTK         ~8s fights      slow TTK
  dodge/aim        some aim        positioning
  short CDs        mid CDs         long CDs, items matter
  small map        mid map         big map, rotations
```

**PM:** Ask playtesters to set it themselves and record where they land. If veterans cluster in one spot and newcomers in another, you've found your audience split for free.

**Architect:** It's feasible if the dial moves *data*, not code: time-to-kill, cooldowns, projectile speed, hitbox size and map scale all as tunable parameters. If it moves netcode, it's two games. So build for the combat end, which needs the tightest latency, and the strategy end comes along for free.

**CEO:** Use the dial to find a default, then hide it. Shipping the dial would split your player base.

**PM:** Do you want the dial live mid-match (a dev tool for fast feel tests), or set per lobby (an A/B test across groups)?

**Architect:** Live mid-match means every system has to handle parameter changes at runtime. That costs a little more up front, and it makes iteration much faster.

---

**Your call:** Should the dial be a live dev slider or a per-lobby A/B setting? And what's your gut on where the sweet spot lands?

### 7 · **user:**

if i want to get the same experience of dota2, 5v5 etc.. whats the effort ?
i am on mac and dont want to install 70 GB

### 8 · **assistant:**

**CEO:** These are two separate questions. If you just want to *play* that experience on a Mac without the 70 GB download, try cloud gaming (GeForce NOW-style streaming) first. Check whether Dota 2 is in their library. Building is only worth it if you want something *of your own*.

**PM:** For building, "same experience" really means three things: about 120 hero kits, thousands of item interactions, and ten years of balance tuning. Players don't feel the 5v5. They feel the depth. You can't copy that, and you shouldn't. Make your own MOBA with its own identity.

**Architect:** Rough effort tiers for an original browser MOBA:

```
 Tier                         Team      Time        Feel
 ────                         ────      ────        ────
 POC 2v2, 4 heroes            1–2 dev   4–8 wks     "is it fun?"
 Playable 5v5, 10 heroes      3–5       6–12 mo     indie MOBA
 Polished 5v5, 30+ heroes,    15–30     2–3 yrs     real competitor
   ranked, matchmaking, anti-cheat
 Dota-grade depth             100+      10+ yrs     ✗ not a target
```

**CEO:** The browser helps you here: a 50–150 MB download, instant join, runs on any Mac. That's your advantage. Don't spend it chasing Dota's graphics.

**PM:** The hardest 5v5 problem isn't the code. It's filling 10 slots fast. Without a crowd, matches need bots, and good bots are a project of their own.

**Architect:** The hard parts in order: authoritative netcode for 10 players with lag compensation, then matchmaking, then bot AI. Rendering in WebGL/WebGPU is the *easy* part.

---

**Your call:** Is the goal to *play* something like Dota on your Mac, or to *build* your own MOBA? If it's building, are you solo or do you have a team?

### 9 · **user:**

do some research for any existing core available that we can make use for our web based replica ?

### 10 · **assistant:**

[ran: WebSearch — open source browser MOBA game engine multiplayer WebGL github]
[ran: WebSearch — Colyseus vs Nakama vs Geckos.io multiplayer game server browser authoritative]
[ran: WebSearch — deterministic lockstep RTS netcode javascript library rollback browser]

**CEO:** Short answer: there's no ready-made MOBA core you can just reskin. What exists are good pieces you'd put together yourself. One thing to set now: aim for "original MOBA with that feel", not a Dota replica. Copied heroes, map and art are a legal problem and give you no identity. The genre is open to anyone; Valve's specific content isn't.

**PM:** What I found:

```
 LAYER          OPTION                      VERDICT
 ─────          ──────                      ───────
 MOBA starter   OpenMOBA (Three.js)         early design doc, no releases → reference only
 Renderer       Three.js / Babylon.js       mature, pick one (Babylon = more "engine")
                PlayCanvas / Phaser (2D)    Phaser if you go top-down 2D
 Full engine    Godot (web export)          editor + tooling; heavier first load
 Realtime srv   Colyseus (Node, MIT)        rooms + state sync + matchmaking ✓ POC fit
 Backend        Nakama (Go/TS/Lua)          accounts, chat, leaderboards for later 5v5
 Transport      geckos.io (WebRTC/UDP)      faster than WebSockets, you write the logic
 Netcode        NetplayJS                   rollback works; lockstep still WIP
```

**Architect:** The real missing piece is netcode. No mature JS lockstep library exists, and keeping JS deterministic across browsers is unproven, so use integer math if you ever go lockstep. For the POC, go **server-authoritative with Colyseus** plus client-side prediction. It's well-trodden and good enough for 2v2→5v5.

**CEO:** My stack for the POC is Three.js (or Phaser for 2D), Colyseus and TypeScript everywhere. Add Nakama only once you need accounts and matchmaking at scale.

**PM:** Is the POC 2D top-down or 3D isometric? That decides the renderer and roughly halves or doubles your art cost.

**Architect:** With 2D you can test feel within days. 3D looks more like a MOBA, but you'll spend your first month on camera, models and pathing.

---

**Your call:** Do you want a 2D top-down POC (Phaser) or 3D isometric (Three.js)? Pick one and I can scaffold the Colyseus + client skeleton.

Sources:
- [OpenMOBA](https://github.com/mmiszy/OpenMOBA)
- [Intensity Engine mailing-list post](https://www.khronos.org/webgl/public-mailing-list/public_webgl/1001/msg00190.php)
- [Multiplayer browser game guide 2026 (Cinevva)](https://app.cinevva.com/es/guides/multiplayer-browser-game)
- [Geckos vs Colyseus – Phaser forum](https://phaser.discourse.group/t/geckos-vs-colyseus/10383)
- [Nakama vs Colyseus – Heroic Labs forum](https://forum.heroiclabs.com/t/nakama-vs-colyseus/1632)
- [Colyseus vs managed backend](https://gsb.supercraft.host/blog/colyseus-vs-managed-backend/)
- [Reactor alternatives (AlternativeTo)](https://alternativeto.net/software/reactor-multiplayer-engine)
- [NetplayJS (npm)](https://www.npmjs.com/package/netplayjs)
- [vibinet-ts](https://github.com/VictorTaelin/tmp)
- [Lockstep & rollback concepts (meseta)](https://meseta.medium.com/netcode-concepts-part-3-lockstep-and-rollback-f70e9297271)
