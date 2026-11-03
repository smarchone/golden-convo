---
schema: 1
id: 2026-11-03-browser-moba-how-dota-2-s-architecture-works-and
title: "Browser MOBA: how Dota 2's architecture works and which existing pieces to stitch together"
why: Masking latency with animations (like Dota) lets an off-the-shelf stack — Colyseus, bitECS, recast, Three.js WebGPU — carry a browser MOBA; only the sim, abilities, fog and feel layer are mine to build.
why_source: suggested
harness: claude-code
harness_version: 2.1.316
model: claude-opus-5-5
session_id: b3cd81f8-d831-4451-9dbc-fa69b066a624
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-dota3/b3cd81f8-d831-4451-9dbc-fa69b066a624.jsonl
started: "2026-11-02T15:49:43.800Z"
captured: "2026-11-03T05:27:04Z"
cwd: ~/Documents/proj/claude/spark/dota3
mode: "skill:productivity:intuition-panel"
turns: 6
complete: true
golden_turns: [4, 6]
labels: [product-idea, system-design, build-vs-buy, game-dev]
thread: browser-moba
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

### 5 · **user:**

mask latency with animations, like dota... i like it.
do a research to stitch existing solutions to make this

### 6 · **assistant:**

[ran: WebSearch — Colyseus authoritative multiplayer server 2026 release]
[ran: WebSearch — WebTransport browser support Safari 2026]
[ran: WebSearch — open source browser MOBA WebGL authoritative server netcode]
[ran: WebSearch — OpenMatch Agones matchmaking dedicated game server kubernetes 2026]
[ran: WebSearch — Recast Detour navmesh WASM javascript recast-navigation-js crowd]
[ran: WebSearch — Three.js WebGPU renderer production ready 2026 instanced skinned mesh]
[ran: WebSearch — Nakama open source matchmaker authoritative match handler 2026]
[ran: WebSearch — Edgegap OR Rivet OR Hathora browser game server hosting WebSocket 2026]
[ran: WebSearch — bitECS javascript ECS performance 2026 multiplayer snapshot]
[ran: WebSearch — Quaternius KayKit CC0 low poly fantasy characters animated glTF]

**CEO:** The good news from the research: **every layer except the game itself already exists off the shelf.** No open-source browser MOBA has solved the hard part ([OpenMOBA](https://github.com/mmiszy/OpenMOBA) is an early alpha), so the sim is yours to build. Everything around it you can put together from existing pieces.

**Architect:** Here's the stack, layer by layer:

```
┌─ CLIENT (browser tab) ──────────────────────────────────────┐
│ Three.js WebGPURenderer ──(auto-fallback)──► WebGL2         │
│ HTML/CSS UI overlay  ← Dota's Panorama UI is the same idea  │
│ KayKit / Quaternius CC0 low-poly heroes (glTF, animated)    │
│ interpolation buffer, ~100ms behind the server              │
└──────────────── WebSocket now · WebTransport later ─────────┘
                              │
┌─ GAME SERVER (one process per match) ───────────────────────┐
│ Colyseus room   ← rooms, delta state sync, reconnect        │
│   └─ YOUR SIM (TypeScript, shared with client)              │
│        bitECS             ← entities as TypedArrays, fast   │
│        recast-navigation  ← navmesh + Crowd for creep waves │
│        abilities as data  ← JSON defs, like Dota's KV files │
│        fog of war         ← per-team view filtering         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─ PLATFORM ──────────────────────────────────────────────────┐
│ matchmaking: Colyseus queue (v0) → Nakama (parties/MMR)     │
│ hosting:     Edgegap or regional VMs (Hathora shut down)    │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Pick | Why | Watch out |
|---|---|---|---|
| Rendering | **Three.js WebGPURenderer** | Production-ready, falls back to WebGL2 automatically | Instanced *skinned* crowds aren't an official API. Use the bone-texture GPU skinning trick |
| Netcode + rooms | **Colyseus 0.18** | Authoritative Node server, schema 5.0 delta encoder, queue matchmaking built in | WebTransport is still beta. Ship on WebSocket first |
| Transport (later) | **WebTransport** | Baseline since Safari 26.4 (Mar 2026), so UDP-like datagrams everywhere | Server protocol-token quirks; test on real devices |
| Sim core | **bitECS** | TypedArray ECS, ~14x faster than an OOP object graph, has snapshot serializers | You write the delta and visibility layer yourself |
| Pathing | **recast-navigation-js** | WASM Recast/Detour that runs in Node *and* the browser, Crowd handles creep avoidance | Bake the navmesh offline |
| Matchmaking | Colyseus queue → **Nakama** | Nakama adds accounts, parties, MMR, leaderboards | Open Match 2 + Agones is overkill until you're big |
| Hosting | **Edgegap** / plain regional VMs | Edge orchestration, fine with WebSockets | Hathora and Unity Multiplay both shut down in 2026 |
| Art | **KayKit, Quaternius, 100 Avatars** | CC0 rigged and animated low-poly characters | Check each pack's license (some Quaternius packs aren't CC0) |

**PM:** Your "mask latency with animations" choice is what makes this stack work. With no client prediction, Colyseus's plain "server sends state, client interpolates" model is *enough*. You skip the rollback and reconciliation work that sinks most indie netcode.

**Architect:** One warning from the research: [Carlini's JS MOBA](https://nicholas.carlini.com/writing/2021/javascript-moba-13k.html) found that a naive authoritative loop was *unplayable at 200ms*. Masking only works if every action has a wind-up longer than the round trip. That means **turn rate, cast points and attack windups are netcode parameters, not just balance numbers.** Tune them together.

**CEO:** Here's the part you build yourself, and it's where the game's identity lives:
1. **The MOBA sim**: creep waves, tower aggro, last-hit and deny, gold and XP
2. **The ability engine**: data-driven, so hero #10 is a JSON file, not a code sprint
3. **Fog of war**: server-side, filtering what each team is sent
4. **The feel layer**: instant click markers, voice barks and animation starts that hide the wait

**PM:** First milestone: **1 hero, 1 lane, creeps, 1 tower, 2 browser tabs, with 150ms of fake lag.** If last-hitting still feels good under that lag, the stack is proven.

---

**Your call:** should the sim be **TypeScript** (one language from client to server, fastest to build) or **Rust compiled to WASM** (faster, deterministic, harder to iterate on)? I'd go TypeScript until profiling says otherwise. Want me to scaffold that first milestone?

Sources:
- [Colyseus v1.0 roadmap](https://docs.colyseus.io/roadmap) · [Colyseus on npm](https://npmjs.com/package/colyseus) · [Cinevva multiplayer guide 2026](https://app.cinevva.com/guides/multiplayer-browser-game)
- [WebTransport is now Baseline](https://webrtc.ventures/2026/04/webtransport-is-now-baseline-what-it-means-for-real-time-media/) · [Frontier Web APIs 2026](https://www.utsubo.com/blog/frontier-web-apis-2026-production-ready)
- [Three.js WebGPU migration guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide) · [What's new in Three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed) · [Instanced skinned meshes thread](https://discourse.threejs.org/t/animated-instanced-skinned-meshes-gltf/41958) · [three.js PR #32240](https://github.com/mrdoob/three.js/pull/32240)
- [bitECS](https://github.com/NateTheGreatt/bitECS) · [Data locality benchmark](https://ankursethi.com/blog/data-locality-sometimes-beats-algorithmic-complexity/)
- [recast-navigation on npm](https://npmjs.com/package/recast-navigation)
- [Nakama authoritative multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/) · [Nakama match handler](https://www.heroiclabs.com/docs/nakama/server-framework/typescript-runtime/function-reference/match-handler/)
- [Agones](https://github.com/googleforgames/agones) · [Open Match 2 setup](https://tech-insider.org/?p=29386)
- [Edgegap: migrating from Hathora](https://edgegap.com/blog/how-to-migrate-from-hathora) · [Edgegap in 2026](https://crux.supercraft.host/blog/edgegap-orchestration-alternatives/)
- [OpenMOBA](https://github.com/mmiszy/OpenMOBA) · [Carlini JS13k MOBA](https://nicholas.carlini.com/writing/2021/javascript-moba-13k.html)
- [KayKit Adventurers](https://kaylousberg.itch.io/kaykit-adventurers) · [Free rigged characters 2026](https://app.cinevva.com/guides/free-rigged-3d-character-models) · [Quaternius RPG characters](https://opengameart.org/content/lowpoly-rpg-characters)
