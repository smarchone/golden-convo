---
schema: 1
id: 2026-11-03-lightweight-browser-moba-poc-shape-feel-dial-and
title: "Lightweight browser MOBA: POC shape, feel dial, and buildable stack"
why: "Browser MOBA intuition: shrink the session, not the feel; a combat\u2194strategy dial tuned as data; and no ready-made core exists, so assemble Colyseus + Three.js/Phaser."
why_source: suggested
harness: claude-code
harness_version: 2.1.316
model: claude-opus-5-5
session_id: b3cd81f8-d831-4451-9dbc-fa69b066a624
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-dota3/b3cd81f8-d831-4451-9dbc-fa69b066a624.jsonl
started: "2026-11-02T15:49:43.800Z"
captured: "2026-11-03T05:23:20Z"
cwd: ~/Documents/proj/claude/spark/dota3
mode: "skill:productivity:intuition-panel"
turns: 4
complete: true
golden_turns: [4, 6, 10]
labels: [product-idea, system-design, build-vs-buy, game-dev]
status: raw
---

### 1 · **user:**

/productivity:intuition-panel in order to build minimal but not simple version of dota2 what would it take ?
if i want to play dota2, i need a big pc with good graphics and storage. this adds a lot of overhead.
i want to make it web based. i might loose some flexibility optimizations, but atleast i want to replicate experience.

### 2 · **assistant:**

**CEO:** You don't want Dota 2. You want the *Dota feeling*: last-hitting tension, a teamfight that turns on one perfect spell, the comeback at minute 40. So we build an original browser MOBA that delivers that feeling, with our own heroes, map and identity. "Open a tab, you're in lane in 10 seconds" is the whole pitch.

**PM:** What makes it "not simple"? I'd say it's **depth per hero**, not hero count. 10 heroes with 4 skills that combo and counter each other beat 120 shallow ones. Sharpest question: is a match **5v5 for 40 minutes**, or **3v3 for 15**? Commuters with a browser tab won't sit through 40.

**Architect:** Graphics are the easy part. Stylized low-poly in WebGL/WebGPU runs on any laptop. The hard part is the **netcode**: a server-authoritative simulation at a fixed tick rate, with client prediction so clicks feel instant. That's where the "Dota experience" either survives or dies.

```
  Browser (thin)                 Game Server (the truth)
 ┌──────────────┐  inputs only  ┌─────────────────────────┐
 │ render 60fps │ ────────────► │ sim @ 30 ticks/s        │
 │ predict self │ ◄──────────── │ creeps · towers · fog   │
 │ interpolate  │   snapshots   │ (fog = server-side, or  │
 └──────────────┘   (deltas)    │  map hacks are trivial) │
                                └─────────────────────────┘
   "big PC" cost moves ──► from your GPU to our server
```

**CEO:** That's the real trade. Players stop paying for the heavy machine and we pay for it in servers. Worth it.

**PM:** And the first thing to build isn't a match. It's **one lane, one hero, creeps, one tower**. If last-hitting feels good in a browser, everything else follows. If it doesn't, nothing else matters.

**Architect:** Agreed. One hard rule from day one: **fog of war is computed on the server**. It's the one constraint you can't add later.

---

**Your call:** what's the match shape? **5v5 / 40 min** (full depth) or **3v3 / 15 min** (made for browser sessions)? And which moment has to feel exactly right: the last-hit, the teamfight, or the comeback?

### 3 · **user:**

whats the current dota2 architecture like ? matchmaking engine, game server, state sync, client side optimizations etc..

### 4 · **assistant:**

**CEO:** One thing to know first: Dota 2 is **not** a peer-to-peer lockstep RTS like StarCraft. It's a client-server shooter architecture (Source 2) running a strategy game. That's the model to copy.

**Architect:** Here's the overall shape from what's publicly known (the internals aren't documented, but replay parsers and dev talks reveal most of it):

```
┌────────────────────── STEAM BACKEND ──────────────────────┐
│  Game Coordinator (GC)                                    │
│  • party, role queue, MMR, behavior score, region/ping    │
│  • builds a 10-player lobby → reserves a dedicated server │
│  • after the match: records results, MMR, items, replays  │
└───────────────┬───────────────────────────────────────────┘
                │ "you're on server X"
                ▼
┌──────── Steam Datagram Relay (Valve's private network) ───┐
│  Clients never see the server's IP (stops DDoS).          │
│  Traffic takes Valve's backbone, not the public internet. │
└───────────────┬───────────────────────────────────────────┘
                ▼
┌──────────── DEDICATED GAME SERVER (the truth) ────────────┐
│  sim @ 30 ticks/s: units, creeps, abilities, items, AI    │
│  per-team visibility → only sends what your team sees     │
│  snapshot = delta-compressed entity properties            │
│  same stream → replays (.dem) + delayed spectator feed    │
└───────────────┬───────────────────────────────────────────┘
                ▼ snapshots          ▲ orders (move/cast/attack)
┌──────────────────────── CLIENT ───────────────────────────┐
│  interpolates between snapshots (renders slightly behind) │
│  little real prediction: the hero moves once server acks  │
│  instant *cosmetic* feedback: click marker, voice, anim   │
│  Panorama UI (HTML/CSS/JS-like) · Vulkan/DX11 renderer    │
└───────────────────────────────────────────────────────────┘
```

**PM:** The surprising part is that Dota **doesn't predict much**. Latency is hidden by the *game design*: turn rate, cast points and attack backswing. A 50 ms round trip disappears inside a 0.3 s cast animation. The design itself does the netcode's job.

**Architect:** The key parts, briefly:
- **State sync:** a snapshot/delta model, not lockstep. Each entity has networked properties, and only the changed fields go out each tick. A reconnect just receives a full snapshot.
- **Fog of war:** decided by the server per team. Hidden enemies are never sent, which is why map hacks mostly died (the old leaks were particle effects).
- **Anti-ghosting:** the spectator/broadcast feed runs on a delay (minutes, not seconds).
- **Ability system:** data-driven definitions (KeyValues files) plus C++, with Lua for custom games. Heroes are mostly *data*, not bespoke code.
- **Client weight:** the ~50GB+ is mostly assets: cosmetics, voice lines, high-res textures. The simulation itself is tiny.

**CEO:** And that's your opening. The "big PC" cost is **art and cosmetics**, not the game. The sim plus netcode fits easily in a browser plus one server process.

**PM:** For a web version, three things map over almost 1:1:
- GC becomes a matchmaking service
- the dedicated server becomes a Node/Rust/Go authoritative sim
- the client becomes WebGL plus a WebTransport/WebSocket connection

**Architect:** The one thing that doesn't map cleanly is **transport**. Browsers have no raw UDP. WebSocket means TCP head-of-line blocking, so use **WebTransport** (QUIC datagrams) where it's supported and WebSocket as the fallback. Steam's relay network has no browser equivalent, so you'd put regional servers behind a CDN-style edge.

---

**Your call:** do you copy Dota's "mask latency with animations" approach (simpler server, the design does the work), or go shooter-style with client prediction (snappier, much more complex)? This choice shapes everything downstream.
