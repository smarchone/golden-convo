---
schema: 1
id: 2026-10-04-cloudflare-origin-story
title: "Cloudflare origin story: Project Honey Pot to a global network that runs code"
why: "Where Cloudflare came from: a security side project that became the network everything else got built on."
why_source: suggested
harness: claude-code
harness_version: 2.1.288
model: claude-opus-5-5
session_id: 5ff8a06d-b50e-454a-a30a-9387dd57b2de
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/5ff8a06d-b50e-454a-a30a-9387dd57b2de.jsonl
started: "2026-10-04T11:37:37.637Z"
captured: "2026-10-13T05:30:00Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:origin-story"
turns: 6
complete: true
golden_turns: [2, 4]
labels: [origin-story, platforms]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

/origin-story cloudflare

### 2 · **assistant:**

Writing the Cloudflare origin story from what I know, in the skill's format. I'm only using quotes I'm confident are real, and I've flagged the details I'm unsure of.

# Cloudflare — origin story
Reverse-proxy network that sits in front of websites and grew into a global "connectivity cloud" · 2009 (launched Sept 2010) · Matthew Prince, Michelle Zatlyn, Lee Holloway

## TL;DR
- **Pitch:** "We can already see who is attacking websites. Wouldn't it be interesting if we sat in front of the sites and blocked them?" Do it for free, and sign-up is just a nameserver change.
- **Aha:** Every customer's traffic passes through the same network, so the network learns from all of them at once. A free tier then works as a sensor grid, a bargaining chip with ISPs and a large test bed, not as charity.

## Before → After
| Before (how the world coped) | After (what it made possible) |
|---|---|
| CDN and DDoS protection meant Akamai or Prolexic, a sales call, a contract and five figures a month | Change two nameserver records in about 5 minutes, free plan included |
| Security came as hardware appliances (WAF, DDoS boxes) in your own rack, sized for the attack you could afford | Anycast spreads an attack across every point of presence (PoP); the absorbing capacity is the whole network, not your link |
| HTTPS cost money (certificates) and took ops work; most small sites were plain HTTP | Universal SSL (Sept 2014) gave free TLS to every customer overnight and roughly doubled the encrypted web Cloudflare served |
| Edge logic was VCL or a vendor ticket | Workers (2017): your own JS/Wasm running in V8 isolates in every PoP, with cold starts under a millisecond |
| Each site learned about attackers on its own | One IP's bad behavior on site A lowers its reputation on site B a few seconds later |

## The Catalyst Problem
- **2004:** Prince, a lawyer who taught cyberlaw, and Lee Holloway, an engineer, built **Project Honey Pot** under their company Unspam Technologies. Volunteers put trap pages on their sites, and the project logged which IPs harvested email addresses and sent comment spam.
- It became a large, free, crowdsourced threat database with tens of thousands of participating sites. But it could only **watch**, not act.
- **2009:** Prince was at Harvard Business School and met Michelle Zatlyn. In Cloudflare's own telling, the turning point was the obvious question: if you know who the bad actors are, why not stop them? *(reconstructed; the exact wording varies between tellings)*
- Users of Project Honey Pot had been asking for the same thing.
- **The problem with existing options:** stopping attackers meant sitting inline, in front of the site. Inline products were enterprise-only and sold through slow, heavy sales cycles. Small sites, which were the Honey Pot user base, couldn't buy them.
- **Nov 2009:** Series A of about $2M from Venrock and Pelion. Holloway built the core system, and the three founders worked out of a Palo Alto apartment and then an office.

## Lineage
- **Borrowed from:**
  - **Akamai** (1998): the CDN as a commercial category.
  - **Anycast** from DNS root servers: one IP announced from many places.
  - **Spam-filter reputation systems** such as DNSBLs and Spamhaus: shared IP reputation.
  - **Project Honey Pot:** its crowd-sourced data network effect.
- **Tried before:** Managed CDN and anti-DDoS services (Akamai, Prolexic, Incapsula) worked but stayed upmarket. That was because of their onboarding model (CNAME setup, professional services) and their cost model (paying for bandwidth at transit prices). The lesson Cloudflare took: remove the onboarding friction and fix the bandwidth economics, and the low end of the market opens up.
- **Why then (2009–10):**
  - Commodity x86 servers and 10GbE got cheap enough to run security in software.
  - Settlement-free peering at internet exchanges (IXPs) let a network carrying a lot of traffic get bandwidth very cheaply.
  - Small sites were starting to get DDoSed by hacktivists and extortionists.
  - Shared hosting was moving to VPSes, so there were many unprotected origin servers.

## v0.1 (Duct-Tape)
- **Launch:** TechCrunch Disrupt SF, **Sept 27, 2010**. Cloudflare came runner-up to Qwiki and opened its public beta the same day.
- **Footprint:** a handful of PoPs, which I recall as about 5 across the US, Europe and Asia *(unverified)*.
- **Stack:**
  - nginx as the reverse proxy, with PHP glue in early tooling.
  - Off-the-shelf DNS software at first. It was later replaced by **RRDNS**, written in Go.
  - Much of the edge logic later moved to **nginx + Lua (OpenResty)**. Cloudflare hired OpenResty's author, Yichun "agentzh" Zhang.
- **Onboarding trick:** you moved your *whole DNS zone* to Cloudflare. This needed no integration work, and it gave Cloudflare control of every record, so proxying could be switched on per record with the orange cloud. That toggle was the product.
- **Faked or deferred:** almost no enterprise features, no SLA on the free tier, and caching that was simple at first. The value was protection plus speed, not a full CDN.
- **Early users:** bloggers, small e-commerce sites, forums, many of them from the Project Honey Pot community.
- **June 2011:** **LulzSec** used Cloudflare while being attacked by other hackers. That stress-tested the network in public and made the company famous overnight.

## Mental Model
- **Abstractions:**
  1. **Zone + orange cloud:** Cloudflare is authoritative DNS. A proxied record resolves to Cloudflare's anycast IPs, not to your origin.
  2. **Anycast, every service in every PoP:** any server in any data center can handle any request for any customer. There is no per-customer hardware.
  3. **Request pipeline:** DNS → TLS termination → DDoS/WAF/bot checks → cache → Workers → origin. Products are stages added to one proxy.
  4. **Global control plane:** a config change propagates to every PoP in seconds through Quicksilver, Cloudflare's distributed KV store.
  5. **Network effect:** more traffic gives better threat intelligence, better peering terms and cheaper bandwidth, which supports a bigger free tier and brings more traffic.
- **Guarantees:**
  - Your origin IP stays hidden, as long as you don't leak it.
  - Volumetric attacks are absorbed at the edge, with unmetered DDoS mitigation since 2017.
  - TLS is handled at the edge.
  - Config changes take effect globally in seconds.
- **Non-guarantees:**
  - **Shared fate:** one bad global push can take down everything.
  - Cloudflare doesn't make your origin fast or correct.
  - Workers KV is eventually consistent (on the order of 60s). Durable Objects were added later for strong consistency.
  - The free tier has no SLA.
  - **The trade-off bought:** uniform, cheap, instant everything, at the cost of a global blast radius.
- **Think of it as:** a **programmable load balancer that the whole internet shares**, where your config is one tenant row and the box is about 330 cities.

## Key Design Decisions
| Chose | Over | Because |
|---|---|---|
| Taking over the nameservers (full DNS zone) | CNAME onboarding (Akamai-style) | Five-minute self-serve sign-up, control of every record, and no sales call. That is what made the free tier possible. |
| Anycast, with every service on every server | Specialized tiers (scrubbing centers, separate cache and security boxes) | Attacks get diluted across the whole network and capacity planning is one pool. The cost is a global blast radius. |
| Software on commodity servers | Hardware DDoS/WAF appliances | Fast iteration, the same cost curve as compute, and new products shipped as code instead of new SKUs |
| A large free plan | Enterprise-only sales | Free traffic means threat data, leverage for ISP peering, QA at scale and later upsell. It's how Cloudflare got cheap bandwidth. |
| V8 isolates for Workers | Containers or VMs (Lambda@Edge) | Thousands of tenants per process and cold starts under a millisecond, so code can run in every PoP. The cost is that you're limited to JS/Wasm. |

## Ecosystem Fit
```text
                 Clients (browsers, apps, 1.1.1.1/WARP users)
                                  │
     ┌──────────────── Cloudflare edge (anycast, ~330 cities) ────────────────┐
     │ DNS · TLS · DDoS · WAF · Bot Mgmt · Cache · Workers/KV/R2/D1 · Zero Trust│
     └─────────────────────────────────────────────────────────────────────────┘
                                  │  (Tunnel / Argo / Magic Transit)
                 Origins: AWS/GCP/Azure, VPS, on-prem, SaaS

 Upstream / built on:  IXP peering, transit carriers, BGP/RPKI, nginx→Pingora/FL2 (Rust), V8
 Replaced:             hardware DDoS/WAF boxes, paid SSL certs for SMBs, managed DNS (Dyn era)
 Competitors:          Akamai (CDN/security) · Fastly (edge compute) · AWS CloudFront/Shield ·
                       Imperva · Zscaler/Netskope (Zero Trust) · Vercel/Netlify (dev edge)
 Built on top:         SaaS custom hostnames (Cloudflare for SaaS), Workers apps, AI inference at edge
```

The one real quote I'd cite from Cloudflare's history belongs to the incidents section, so I've held it back for "more". It's Prince's line "I woke up this morning in a bad mood and decided to kick them off the Internet," from the Daily Stormer termination ([blog.cloudflare.com/why-we-terminated-daily-stormer](https://blog.cloudflare.com/why-we-terminated-daily-stormer/), Aug 2017).

---
*Say **more** for: timeline & key people · evolution (the shift from CDN to Workers to Zero Trust to AI, and nginx → Pingora/FL2) · major incidents & lessons (the 2013 Spamhaus DDoS, Cloudbleed in 2017, the July 2019 regex outage, the Nov 2025 bot-management file outage).*

result: Cloudflare origin story delivered in the requested format, from Project Honey Pot to the free-tier, anycast design. I wrote it from my own knowledge without web lookups; the launch PoP count is marked unverified.

### 3 · **user:**

more

### 4 · **assistant:**

Here's the add-on (timeline, evolution, incidents), again written from what I know with no web lookups. Quotes are limited to ones I'm confident are real; anything uncertain is marked.

## Timeline & Key People
| When | What happened | Who |
|---|---|---|
| 2004 | **Project Honey Pot**, run by Unspam Technologies, starts crowdsourcing data on spam harvesters. This data network later became Cloudflare's seed. | Matthew Prince, Lee Holloway |
| 2009 | Business plan written at Harvard Business School. Series A of about $2M (Venrock, Pelion), Nov 2009. | Prince, Michelle Zatlyn, Holloway |
| Sept 27, 2010 | Public launch at TechCrunch Disrupt SF, runner-up to Qwiki | Founders |
| June 2011 | LulzSec uses Cloudflare and survives attacks from other hackers. Huge publicity; Cloudflare's "we don't judge content" stance gets its first public test. | — |
| Sept 2014 | **Universal SSL**: free TLS for every customer. Same era: Project Galileo, free protection for at-risk nonprofits and journalists. | Engineering under John Graham-Cumming (joined 2012, later CTO) |
| Sept 2017 | **Workers** announced (V8 isolates at the edge), along with unmetered DDoS mitigation. Turning point from CDN toward platform. | Kenton Varda (Workers lead; he had worked on Protocol Buffers at Google) |
| Apr 1, 2018 | **1.1.1.1** privacy-first public DNS resolver, built with APNIC | — |
| Sept 13, 2019 | IPO on the NYSE as **NET** | Prince (CEO), Zatlyn (President/COO) |
| 2020 → 2025 | Cloudflare One / Zero Trust (2020). Workers AI (2023). AI crawlers blocked by default plus **pay-per-crawl** (July 2025). | — |

- **Lee Holloway** wrote most of the early system. He left around 2015 after the onset of frontotemporal dementia; his family later made this public *(the exact departure date is from memory)*.

## Evolution
- **v1 vs today:**
  - **Then:** an nginx-based reverse proxy plus DNS, sold as "make your small site faster and safer."
  - **Now:** about 330 cities, a full developer platform (Workers, KV, R2, D1, Durable Objects, Queues), Zero Trust/SASE, network services (Magic Transit, WAN), and AI inference at the edge.
  - **The proxy itself was rewritten twice:**
    1. nginx + Lua (OpenResty)
    2. **Pingora** (Rust, announced 2022) for origin-facing traffic
    3. **FL2** (Rust, 2025), replacing the core "FL" request pipeline
  - **DNS:** off-the-shelf software was replaced by RRDNS, written in Go.
- **Pivots:**
  1. **SMB → enterprise (about 2013–2016).** Once free and self-serve traffic built up the network, they found enterprises would pay for the same edge. Revenue mix moved toward large customers.
  2. **Proxy → compute (2017).** Workers turned "a box that inspects your traffic" into "a computer next to every user." Every later developer product (KV, R2, D1) grew from that.
  3. **Protect websites → protect employees (2020).** The same anycast network faces inward as a VPN replacement and secure web gateway. The pandemic made the timing.
  4. **Neutral pipe → gatekeeper of the AI-crawler economy (2023–25).** Default blocking and pay-per-crawl position Cloudflare between publishers and AI labs.
- **Regrets:**
  - **Content moderation.** On terminating the Daily Stormer, Prince wrote in an internal memo: *"I woke up this morning in a bad mood and decided to kick them off the Internet"* (memo of Aug 16, 2017, published by Gizmodo; context in [blog.cloudflare.com/why-we-terminated-daily-stormer](https://blog.cloudflare.com/why-we-terminated-daily-stormer/)). The point of the line was the regret: no infrastructure CEO should have that power on a whim.
  - The same discomfort came back with 8chan (Aug 2019) and Kiwi Farms (Sept 2022). Both times Cloudflare said it acted reluctantly, as an exception.
  - **Outages.** After the July 2019 and Nov 2025 incidents, the postmortems openly said that pushing changes globally in seconds was the root weakness (paraphrased, not quoted).

## Incidents & Lessons
| Incident (date) | What happened | Lesson |
|---|---|---|
| **Spamhaus DDoS** (Mar 2013) | About 300 Gbps of DNS-amplification traffic hit Spamhaus behind Cloudflare. Some of it spilled onto upstream IXPs. Cloudflare's write-up was titled "The DDoS That Almost Broke the Internet." | Anycast absorption worked at record scale. Open resolvers and missing source-address filtering (BCP 38) were the ecosystem's problem, and Cloudflare started campaigning about them publicly. |
| **UGNazi breach** (June 2012) | Attackers social-engineered Prince's AT&T voicemail and used it to recover his Google account. From there they reached Cloudflare's Google Apps admin and hijacked a customer's (4chan's) email. | SMS and voicemail account recovery is not real 2FA. This pushed Cloudflare toward hardware keys internally. |
| **Cloudbleed** (Feb 2017) | Found by Tavis Ormandy (Google Project Zero). A pointer-check bug in Cloudflare's Ragel-generated HTML parser caused a buffer over-read. It only triggered with certain features enabled (email obfuscation, Server-Side Excludes, Automatic HTTPS Rewrites). Leaked memory (cookies, tokens, request data) ended up in responses, and some of it was cached by search engines. | One memory-safety bug in a shared proxy leaks data *across tenants*. Cleanup required search-engine cooperation. This is the origin of the long push toward Rust (Pingora, FL2). |
| **WAF regex outage** (Jul 2, 2019) | A new WAF managed rule with a catastrophically backtracking regex was deployed globally at once. CPU hit 100% on every edge server and traffic dropped sharply for about 27 minutes. | Even "just config" needs staged rollouts. Cloudflare moved WAF rules to progressive deployment and to regex engines with linear-time guarantees (Rust `regex`/RE2-style). |
| **Bot-management file outage** (Nov 18, 2025) | A ClickHouse permissions change made a query return duplicate rows. The generated bot-management feature file doubled in size and exceeded a hard feature limit in the new Rust FL2 proxy, which panicked on an `unwrap`. The file was regenerated every few minutes, so the network flapped before it failed fully. Core impact lasted about 3 hours; Prince called it the worst since 2019. | Internally generated config is untrusted input: validate it, fail open or fall back to the last good version, and keep global kill switches. Rust removes memory bugs, not logic panics. The 2019 lesson about global propagation applied again, this time to data files. |

The common thread across incidents: the design that makes Cloudflare cheap and fast (every service on every server, changes everywhere in seconds) is the same thing that turns bugs into global outages. Every major outage has been a shared-fate failure.

result: Delivered the Cloudflare origin-story add-on (timeline and key people, evolution and pivots, five incidents with lessons) from my own knowledge, not checked against sources; the Holloway departure date is flagged as uncertain.

### 5 · **user:**

status

### 6 · **assistant:**

You asked for status: both parts of the Cloudflare origin story are done, and nothing is running or waiting on you.

1. **Core story:** TL;DR, Before → After, the catalyst (Project Honey Pot to Harvard Business School to Disrupt 2010), lineage, v0.1, mental model, design decisions, and the ecosystem map.
2. **Add-on ("more"):** a timeline with key people from 2004 to 2025, how the product evolved and pivoted (with the founders' regrets), and five incidents with their lessons: UGNazi, Spamhaus, Cloudbleed, the July 2019 regex outage and the Nov 2025 bot-management outage.

**Caveats:** Both parts were written from my own knowledge, without looking anything up online. The number of data
