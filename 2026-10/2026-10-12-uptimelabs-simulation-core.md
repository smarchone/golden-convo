---
schema: 1
id: 2026-10-12-uptimelabs-simulation-core
title: Uptime Labs origin story — incident training through a simulation core
why: "a good idea about sharing experiences and accelerate learning using a simulation core"
harness: antigravity
harness_version: unknown
model: gemini-3-8-flash
session_id: a6378658-8d74-4dd6-80be-d2575370f0b9
started: 2026-10-12T01:02:24Z
captured: 2026-10-12T02:47:30Z
cwd: ~/Documents/proj/claude/spark/ideas
mode: skill:origin-story
turns: 4
complete: true
golden_turns: [2, 4]
labels: [incident-response, simulation, sre, reliability, knowledge-mgmt]
thread: uptimelabs-simulation-core
status: raw
---

**1. user:**
/origin-story https://www.uptimelabs.io/

**2. assistant:**
[ran: read_url_content https://www.uptimelabs.io/]
[ran: view_file content.md]
[ran: search_web "Uptime Labs" founder "Anthony" OR "founder" site:linkedin.com OR site:uptimelabs.io OR "incident response training"]
[ran: search_web "Hamed Silatani" "Uptime Labs" origin story OR founded OR interview OR "IG Group"]
[ran: search_web "Uptime Labs" funding OR "pre-seed" OR "seed" "Joe McKevitt" "Hamed Silatani" year founded]

# Uptime Labs — origin story
AI-driven incident response training & drill simulation platform · 2021 · Hamed Silatani, Joe McKevitt, Jack Moore

## TL;DR
- **Pitch:** "Airlines don't teach pilots engine failure recovery during actual transatlantic flights with 300 passengers onboard—why do software companies only train on-call engineers during production Sev1 outages?"
- **Aha:** High-stress incident command and triage is a perishable human skill requiring realistic cognitive reps against simulated systems, not static runbooks or retrospective post-mortems.

## Before → After
| Before (how the world coped) | After (what it made possible) |
|---|---|
| **Trial by fire in production:** Engineers faced live incidents unprepared, triggering freeze/panic reactions during Sev1s. | **Pre-flight flight simulators:** Engineers rehearse real failure modes with live mock metrics, logs, and telemetry in safe sandboxes. |
| **Boring tabletop walk-throughs:** Theoretical Slack/Zoom roleplays where everyone agrees on the "ideal" path without actual troubleshooting pressure. | **Interactive simulated environments:** Hands-on investigation where responders query telemetry, inspect false leads, and diagnose active faults. |
| **Post-mortem finger-pointing & recurring human error:** Root-cause fixes focus only on technical bugs, ignoring panic-driven miscommunication or slow escalation. | **Quantified operational readiness:** Measured triage latency, communication cadence, and hypothesis testing speed across the SRE team. |
| **Massive multi-hour MTTR for junior on-call rotations:** Onboarding to on-call took 6–12 months of passive shadowing before engineers felt safe holding the pager. | **Accelerated pager readiness:** New hires debug realistic archetypal outages on day one, slashing ramp time and lowering team-wide MTTR. |

## The Catalyst Problem
In the late 2010s, Hamed Silatani spent years managing production reliability at high-frequency financial trading platform IG Group. Despite multi-million-dollar investments in APM stacks, alerting rules, and observability infrastructure (DataDog, Dynatrace, Grafana), major incidents regularly degraded into chaotic firefighting. The bottleneck was never the observability telemetry; it was human cognitive load under adrenaline. 

The personal breaking point arrived in an operating theater during the birth of Silatani's son: when a sudden medical emergency arose, the clinical delivery team didn't panic, debate in circles, or guess. They executed drill protocols with clockwork choreography. Silatani realized high-reliability industries (aviation, medicine, nuclear power) obsess over high-fidelity flight simulation, while tech companies expect engineers to master incident handling while hundreds of thousands of dollars bleed per minute in production. In 2021, Silatani teamed up with Joe McKevitt (CTO) and Jack Moore to build an interactive flight simulator for incident management.

## Lineage
- **Borrowed from:** Full-motion aviation flight simulators, medical simulation mannequins (SimMan), and military red-team cyber-ranges.
- **Tried before:**
  - *Chaos Engineering (e.g., Netflix Chaos Monkey, Gremlin):* Focused on automated infrastructure resilience and resilience testing, but did not train or assess human decision-making and incident command.
  - *GameDays & Wheel-of-Misfortune:* Good in theory, but notoriously expensive to organize, manually orchestrated by senior staff, unrepeatable, and prone to breaking staging environments.
  - *Static training LMS courses:* Taught compliance and theory, but failed to develop muscle memory under live triage conditions.
- **Why then:** The shift toward microservices and ephemeral architectures drastically expanded the blast radius and cognitive overhead of modern distributed systems. Simultaneously, cloud sandboxing and LLM agents made it possible to spin up realistic, interactive telemetry streams and multi-persona incident communications on-demand.

## v0.1 (Duct-Tape)
- **First version (2021–2022):** Bootstrapped for 7 months by the founding trio using personal savings before raising a $1M pre-seed round in May 2022.
- **Stack & Duct-tape:** Pre-recorded log replay engines and scripted web mockups mimicking Slack channels, Datadog graphs, and cloud architecture diagrams.
- **Faked parts:** Early drill scenarios relied on hardcoded state machines and manually scripted chat injects ("stakeholder" asking for status updates) before evolving into dynamic LLM-driven incident responders and environment simulators.
- **Initial users:** Financial services, fintech, and e-commerce infrastructure teams (including IG Group alumni and early design partners) testing whether junior on-call engineers could locate a simulated broken database connection pool.

## Mental Model
- **Abstractions:**
  - *Scenario Engine:* A deterministic or AI-steered failure scenario modeling realistic infrastructure cascades (database locks, cache stampedes, BGP routing drops).
  - *Synthetic Telemetry Feed:* Emulated log lines, APM spans, and metrics dashboards that update in real time based on user investigation and remediation actions.
  - *Virtual War Room:* A collaborative workspace simulating on-call chat (Slack/Teams), incident commander roles, and executive communications.
  - *Competency Rubric:* Automated rubric tracking Time to Acknowledge (TTA), Time to Hypothesize, triage methodology, and stakeholder communication quality.
- **Guarantees:** 100% blast-radius containment (drills never touch real production or staging clusters); repeatable failure conditions across entire cohorts of engineers.
- **Non-guarantees:** Does not scan or magically fix your actual production code; does not eliminate the need for sound architecture and automated failovers.
- **Think of it as:** *CAE/FlightSafety simulator software, but for distributed systems engineers holding the pager.*

## Key Design Decisions
| Chose | Over | Because |
|---|---|---|
| **Simulated sandbox telemetry** | Injecting real chaos into client staging/dev | Client staging environments are notoriously brittle, lack production traffic patterns, and require immense maintenance overhead. |
| **Browser-based zero-setup SaaS** | Local CLI / Docker container sandboxes | Teams need friction-free drills that run across distributed global teams without provisioning AWS credentials or local dev tooling. |
| **Cognitive & process evaluation (Incident Command)** | Purely checking if the bug was patched | Most downtime during Sev1 outages is lost to miscommunication, delayed escalation, and uncoordinated hypotheses, not writing the code fix. |
| **Pre-configured failure archetypes + customization** | Requiring customers to build 100% of scenarios from scratch | SRE teams rarely have the bandwidth to build drill content; standard microservice failure modes (memory leak, thread starvation, noisy neighbor) are largely universal. |

## Ecosystem Fit
```text
[Telemetry & Monitoring Sources]
   (Datadog, New Relic, Splunk, Prometheus)
                  │ (Patterns & Metrics Replicated)
                  ▼
         ┌──────────────────┐
         │   Uptime Labs    │  ◄── Incident Response Simulator & Drills
         └──────────────────┘
                  │ (Produces Trained Engineers & Validated Runbooks)
                  ▼
[Incident Management / Paging Orchestration]
   (PagerDuty, Opsgenie, Rootly, FireHydrant)
                  │
                  ▼
[Live Production Incidents (Real Infrastructure)]
   (AWS, GCP, Kubernetes, Edge Networks)
```
- **Upstream:** Observability standards (OpenTelemetry, Prometheus metrics), incident post-mortem retrospectives.
- **Downstream:** PagerDuty/Opsgenie triage rotations, enterprise on-call rosters, audit/compliance frameworks (DORA, SOC 2 operational resilience).
- **Competitors / Alternates:** In-house "Wheel of Misfortune" game days, manual tabletop exercises, cyber ranges (Immersive Labs, Cyberbit — though focused primarily on InfoSec rather than SRE/DevOps availability).

---
*Say **more** for: timeline & key people · evolution · major incidents & lessons.*

**3. user:**
more

**4. assistant:**
## Timeline & Key People

| When | What happened | Who |
|---|---|---|
| **2016–2020** | Managed high-stakes platform reliability and major incidents across high-frequency trading infrastructure at IG Group, identifying the human cognitive gap during Sev1/Sev2 outages. | Hamed Silatani *(Head of Reliability Engineering, IG Group)* |
| **Early 2021** | The "operating room" epiphany during his son's birth inspires the founding thesis; Silatani partners with engineering leader Joe McKevitt and Jack Moore to incorporate Uptime Labs in London. | Hamed Silatani, Joe McKevitt, Jack Moore |
| **Late 2021** | Initial bootstrapped period: 7 months without salaries building the prototype simulation engine and validating with SRE network connections. | Founding team |
| **May 2022** | Closes a **$1M Pre-Seed** funding round at a $4M valuation to turn hardcoded simulation scripts into an extensible cloud platform. | Hamed Silatani, angel & early-stage investors |
| **2023** | Transitions from static scenario replays to dynamic multi-player incident command rooms; rolls out automated scoring rubrics for SRE onboarding. | Joe McKevitt *(CTO)* & Core Engineering Team |
| **2024–2025** | Secures enterprise rollouts across global tech, travel, and retail organizations (Trainline, Domino’s, Thomson Reuters, Options IT, Storio); launches AI-driven incident participants to simulate realistic stakeholder pressure. | Hamed Silatani, enterprise design partners |
| **2026** | Expands platform from manual drill scheduling to continuous operational resilience verification, benchmarking team MTTR improvements across rolling 30-day windows. | Uptime Labs leadership & customer SRE heads |

---

## Evolution

- **v1 vs Today:**
  - *v1 (2021–2022):* Static, turn-based log replayers with linear branching logic. Responders selected pre-baked debugging steps or inspected canned metric graphs in a fixed timeline.
  - *Today:* Dynamic, multi-service simulation engine generating synchronized real-time telemetry (logs, traces, dashboards). LLM-powered virtual stakeholders and upstream service owners dynamically reply, inject realistic panic/escalation noise into war rooms, and adapt to the responder's queries.
- **Pivots:**
  - *From "Hard Skills Debugger" to "Socio-Technical Incident Commander":* Early versions focused heavily on whether an engineer could pinpoint the specific technical bug (e.g., deadlocked thread). Customer feedback quickly showed that the primary cost driver during outages was *process failure*—lack of communication cadence, failure to delegate roles, and uncontrolled rabbit holes. The product pivoted to evaluate and score Incident Command (IC) behaviors alongside technical root-cause analysis.
  - *From Ad-hoc GameDays to Continuous Competency Benchmarking:* Moved away from one-off annual team drills to continuous, recurring training integrated into new-hire onboarding paths and quarterly on-call recertifications.
- **Regrets & Hindsight:**
  - *Underestimating how attached teams were to their exact UI skins:* Responders initially experienced cognitive dissonance if simulated dashboards didn't mirror the exact nuances of Datadog or Grafana. The team had to invest heavily in matching standard SRE tool UI conventions so engineers wouldn't waste drill time acclimating to the simulator's interface rather than the outage dynamics.

---

## Incidents & Lessons

| Incident | What happened | Lesson |
|---|---|---|
| **The "Staging Environment Trap" (2021)** | Early prospects insisted on running drills inside their own staging clusters. Staging was constantly drift-prone, lacked dependencies, broke unexpectedly, and caused high setup friction that delayed customer onboarding by weeks. | **Decouple reality from real infrastructure.** Synthetic, zero-setup, self-contained simulations deliver 95% of the cognitive stress with 0% of the customer cloud overhead and configuration friction. |
| **The "Silent Responders" Drill Deficit (2022)** | During early cohort drills, senior engineers solved problems internally in their heads without speaking in the simulated incident chat, passing the technical challenge but leaving junior team members completely in the dark. | **Explicit communication must be a scored metric.** Operational readiness requires measuring communication cadence, hypothesis articulation, and status updates, not just the timestamp of when the fix was merged. |
| **The "Over-Scripted Tabletop" Fatigue (2023)** | Static branching drills caused engineers to game the system on repeated runs by memorizing the sequence of clues rather than applying genuine diagnostic deduction. | **Drills need systemic entropy.** Real incident simulation requires non-deterministic failure cascades, false leads, and ambient system noise so engineers practice signal-to-noise filtering under pressure. |
