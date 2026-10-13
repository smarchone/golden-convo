---
schema: 1
id: 2026-08-27-twitch-viewer-count-heartbeat-aggregation
title: Twitch viewer counts are sampled heartbeat aggregates, not exact counts
why: "Nobody counts viewers exactly: client heartbeats, aggregated and cached, give a sampled estimate."
why_source: suggested
harness: claude-code
harness_version: 2.1.247
model: claude-opus-5
session_id: 11ea6dd6-d4a9-47e2-9310-9c9415f45b1f
source_path: "agentsview http://127.0.0.1:8080/sessions/11ea6dd6-d4a9-47e2-9310-9c9415f45b1f (original jsonl deleted)"
started: "2026-08-27T15:55:40.145Z"
captured: "2026-10-13T05:48:47Z"
cwd: ~/Documents/proj/exp/claude/ideas
turns: 2
complete: true
golden_turns: [2]
labels: [system-design, distributed-systems]
status: raw
---

### 1 · **user:**

how is viwer count shown in a sytem like twitch

### 2 · **assistant:**

Short version: nobody counts exactly. It's a sampled, aggregated, cached estimate.

**The pipeline**

1. **Heartbeats, not connections.** Each playing client pings a telemetry endpoint every ~30–60s with `(channel_id, session_id, timestamp)`. You don't count TCP/HLS connections — CDN edges are stateless and a viewer opens many segment requests.

2. **Edge aggregation.** Those pings hit regional collectors. Each collector keeps a per-channel sketch of distinct session_ids in the current window — HyperLogLog or similar, so memory is ~KB per channel regardless of 500k viewers. Exact sets are too expensive at millions of channels.

3. **Sliding window.** "Concurrent viewer" = distinct sessions seen in the last N seconds (say 90s, i.e. ~2 missed heartbeats of grace). Sessions that stop pinging age out.

4. **Merge.** HLL sketches merge losslessly across regions, so a central roll-up unions all collectors per channel. That's the global number.

5. **Publish + cache.** Result written to a hot KV store, refreshed every 10–60s. The number you see in the UI is pushed over the same websocket/pubsub that carries chat, or polled from a cached endpoint. Every viewer of the same channel reads the identical cached value — one computation, millions of readers.

**Why it's fuzzy**
- HLL has ~1–2% error, deliberately.
- Window lag means it trails reality by up to a minute.
- Bots/embeds get filtered by heuristics after the fact, so the public number and the creator's dashboard number differ.

**The two-tier trick:** public count is cheap and approximate; the analytics dashboard runs a separate batch job over the raw heartbeat log (Kafka → warehouse) hours later for billable, exact-ish numbers. Realtime and correctness are separate systems on purpose.
