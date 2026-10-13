---
schema: 1
id: 2026-10-04-vercel-origin-story
title: "Vercel origin story: from ZEIT now to the AI cloud"
why: Where Vercel came from, so its agent strategy makes sense.
why_source: suggested
harness: claude-code
harness_version: 2.1.288
model: claude-opus-5-5
session_id: b4736256-5306-46b8-9457-aeb513eb4045
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/b4736256-5306-46b8-9457-aeb513eb4045.jsonl
started: "2026-10-04T11:37:37.637Z"
captured: "2026-10-13T05:30:00Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:origin-story"
turns: 2
complete: true
golden_turns: [2]
labels: [origin-story, platforms]
thread: vercel-vs-cloudflare
status: raw
---

### 1 · **user:**

/origin-story vercel

### 2 · **assistant:**

I'll check key facts and quotes first, then write the origin story in the skill's format.

[ran: WebSearch — ZEIT now launch 2016 Guillermo Rauch blog "now" realtime global deployments]
[ran: WebSearch — ZEIT renamed Vercel April 2020 Series A $21M Rauch quote]
[ran: WebSearch — Vercel funding 2026 valuation revenue]

Facts confirmed (cofounders Tony Kovanen and Naoyuki Kanezawa, the 2020 rebrand, the Series F). Next I'm pulling exact quotes from the Now 2.0 and Next.js launch posts.

[ran: WebFetch — https://vercel.com/blog/now-2]
[ran: WebFetch — https://vercel.com/blog/next]
[ran: WebSearch — "Now 2.0" ZEIT November 2018 serverless lambdas Docker deprecated blog]
[ran: WebSearch — CVE-2025-29927 Next.js middleware bypass Vercel postmortem; React2Shell CVE-2025-55182 Vercel]

I verified the key facts with a few web searches: founders, rebrand date and funding, the Next.js launch post, and recent funding and security events. Here's the story.

# Vercel — origin story
A frontend cloud: git push → global preview URL → production · 2015 (as ZEIT) · Guillermo Rauch, Tony Kovanen, Naoyuki Kanezawa

## TL;DR
- **Pitch:** "Wouldn't it be interesting if deploying felt like `git push`: every commit gets its own permanent URL, served globally, with no servers to think about?"
- **Aha:** Vercel's lasting insight is that **the framework should decide the infrastructure.** It owns Next.js, so it can read your code's routes and rendering modes and turn them into a CDN, functions and cache rules automatically. Next.js is the funnel and the hosting is the business.

## Before → After
| Before (how the world coped) | After (what it made possible) |
|---|---|
| A frontend dev needed a backend or ops person to get a URL running (Heroku dynos, EC2 plus nginx, S3 plus CloudFront plus scripts) | `now` in any directory gave you a live HTTPS URL in seconds |
| One shared staging server, with "don't deploy, QA is testing" in Slack | Every PR and commit gets its own preview URL that never changes |
| Rollback meant redeploying the old build and hoping it worked | Deploys never change once made, so rollback just points the domain alias back at an older deploy |
| Server rendering React meant building your own Express, webpack and hydration setup | Next.js: put a file in `pages/` and it is server-rendered, with no config |
| CDN, functions and cache headers were wired up by hand for each app | The build output describes what infrastructure it needs, and the platform sets it up for you |

## The Catalyst Problem
- **Who:** Guillermo Rauch, an Argentine developer who had moved to SF. He created **Socket.IO** (2010) and co-founded **LearnBoost** and **Cloudup**. Automattic (the company behind WordPress) acquired Cloudup in 2013.
- **The wall:** At Automattic he watched a huge share of the web run on PHP's model: drop a file and it is live, with server-rendered HTML. JavaScript had the better UI model (React) but no equivalent way to deploy.
- **The thesis:** His 2014 essay *7 Principles of Rich Web Applications* (rauchg.com) argued for server-rendered pages that hydrate and then update in real time. The tools to do that easily didn't exist.
- **Why existing options failed:** Heroku was built around long-running dynos, one app and one URL. AWS was powerful but full of chores. Neither treated *the deploy itself* as the product.
- **The move:** He founded ZEIT in November 2015 with Kovanen and Kanezawa ([Wikipedia](https://www.wikipedia.org/wiki/Vercel)). The mission was "simple, global and real time" cloud deployment.
- **The second bet:** On Oct 25, 2016 they released Next.js, "a small framework for server-rendered universal JavaScript webapps, built on top of React, Webpack and Babel" ([Vercel blog](https://vercel.com/blog/next)). The launch post admits PHP "was actually more suited for the 'server rendering of HTML' job."

## Lineage
- **Borrowed from:**
  - PHP and FTP: file = route, upload = deploy.
  - Heroku: `git push` deploys.
  - Functional programming: immutable values.
  - CDNs: serve from the edge.
  - React: UI as a function of state.
  - Lambda: pay per request.
- **Tried before:**
  - **Heroku (2007):** It nailed the developer experience but sold long-running server processes and never added per-commit previews. Salesforce's ownership slowed it down. *Lesson:* developer experience alone isn't a moat if the platform stops evolving.
  - **Meteor (2012):** It built a full-stack JS framework and paid hosting (Galaxy) as one product. Its proprietary data layer (DDP and Mongo) locked users in, and React won the view layer instead. *Lesson:* own the conventions, not the data layer.
  - **Netlify (2014):** It shipped git-based deploys and preview URLs first and coined "Jamstack." But it had no flagship framework of its own. *Lesson:* hosting without a framework competes on price.
- **Why then:**
  - Node and npm had become every frontend developer's toolchain.
  - React (2013) had won the view layer.
  - Docker (2013) made "package anything and run it" normal.
  - AWS Lambda (2014) made per-request compute cheap.
  - Let's Encrypt (2015–16) made free automatic TLS possible.

## v0.1 (Duct-Tape)
- **What:** the `now` CLI, launched in 2016. You ran `now` in a folder with a `package.json` or `Dockerfile`. It uploaded the source, built it and handed back a unique `*.now.sh` URL.
- **Core trick:** every deploy was a separate, permanent instance with its own URL. `now alias` pointed a domain at one of them.
- **Stack:** Node.js plus Docker containers on rented cloud machines, with HTTP/2 and TLS. The "global" part was thin at first.
- **Users:** Node and open-source developers, mainly people who already followed Rauch from Socket.IO.
- **Faked / missing:**
  - no git integration at first (deploys went straight from the CLI);
  - scaling and multi-region support were limited.
  - In 2018 they rewrote the platform on "serverless Docker", then on Now 2.0's builders that compile to lambdas.
- **Team:** about 3 founders plus a few hires. Revenue came from paid plans for more instances and custom domains.

## Mental Model
- **Abstractions:**
  1. **Deployment:** an immutable build output with a permanent URL. This is the atom everything else builds on.
  2. **Alias / Domain:** a pointer you can move to any deployment. Production is just an alias.
  3. **Project ↔ Git branch:** pushing to a branch makes a preview deploy; pushing to `main` makes the production deploy.
  4. **Framework-defined infrastructure:** the Build Output API maps static files to the CDN, server routes to functions, ISR (Next.js incremental static regeneration) to cache plus revalidation, and middleware to edge code.
  5. **Functions:** stateless, per-request compute. Since 2025, "Fluid compute" lets one instance serve many requests at once.
- **Guarantees:**
  - a deploy never changes after it's made;
  - rollback is instant because nothing gets rebuilt;
  - every commit can be previewed;
  - HTTPS and global CDN delivery by default;
  - zero config for supported frameworks.
- **Non-guarantees:**
  - no long-running processes, stateful servers or WebSockets in the Heroku sense;
  - no first-party database of its own (storage is mostly resold from Neon, Upstash and others);
  - no fixed monthly bill, since you pay per usage.
  - *What that buys:* no ops work and scale-to-zero, at the price of bill-shock risk and platform constraints.
- **Think of it as:** **a compiler whose target is a CDN.** Your framework code is the source. Vercel compiles it into edge caches, functions and routing rules, and each deploy is a versioned binary you can swap out instantly.

## Key Design Decisions
| Chose | Over | Because |
|---|---|---|
| Immutable deploy URLs | Updating one server in place | Previews, instant rollback and simple caching all come free from immutability |
| Serverless lambdas (Now 2.0, Nov 2018) | Docker containers (Now 1.x) | Scale-to-zero and per-request pricing fit frontends. Dropping Docker angered some v1 users, but it made the edge and framework model possible |
| Owning an OSS framework (Next.js) | Being a neutral host only | The framework sets conventions, and conventions decide the infrastructure. It doubles as a free distribution funnel |
| "Frontend cloud" positioning (rebrand to Vercel, Apr 21, 2020) | General-purpose PaaS | They were selling to frontend teams and designers who want to "develop, preview, and ship at the speed of thought" ([Vercel blog](https://vercel.com/blog/zeit-is-now-vercel)) |
| Reselling partners' infra (AWS underneath; storage from Neon and Upstash) | Building their own data centers | Focus stays on developer experience, at the cost of margin dependence on AWS |

## Ecosystem Fit
```
            Upstream (what it runs on)
  AWS (Lambda, regions) · Cloudflare-like edge PoPs · Neon/Upstash (storage)
                          │
     Frameworks ──▶ ┌──────────────────────────┐ ◀── Git (GitHub/GitLab/Bitbucket)
  Next.js (owned)   │  VERCEL                  │
  SvelteKit (owns   │  build → deploy → alias  │
   Rich Harris' job)│  CDN · Functions · ISR   │
  Nuxt, Astro, Remix│  Previews · Firewall     │
                    └──────────────────────────┘
                          │
            Downstream / built on top
  AI SDK (2023) · v0 (Oct 2023, AI UI generator → deploys to Vercel)
  Turborepo (acq. Dec 2021) · Marketplace integrations
                          │
  Competitors: Netlify · Cloudflare Pages/Workers · AWS Amplify
               Render · Railway · Fly.io · self-hosted Next.js (OpenNext)
  Replaced:    Heroku-for-frontends · S3+CloudFront scripts · staging servers
```
Scale today: $300M Series F (Sept 2025) at a $9.3B valuation ([Sacra](https://sacra.com/c/vercel)), and a reported ~$340M revenue run-rate by March 2026.

---
*Say **more** for: timeline & key people · evolution (including the Now 2.0 Docker removal and the AI pivot via v0) · major incidents & lessons (including CVE-2025-29927 middleware bypass and React2Shell).*

Sources: [Vercel – Next.js launch](https://vercel.com/blog/next) · [Vercel – ZEIT is now Vercel](https://vercel.com/blog/zeit-is-now-vercel) · [Wikipedia – Vercel](https://www.wikipedia.org/wiki/Vercel) · [Sacra – Vercel](https://sacra.com/c/vercel) · [SD Times – $21M Series A](https://sdtimes.com/softwaredev/vercel-raises-21-million-to-transform-javascript-front-end-development) · [Packt – Serverless Docker / Now 2.0](https://hub.packtpub.com/zeit-releases-serverless-docker-in-beta)

Unknowns: v0.1's exact build time and first-user counts aren't public, so I left them out. The three quotes (from the Next.js launch and rebrand posts) were checked against Vercel's blog. Background I didn't re-check today: Rauch's pre-ZEIT history, the 2014 essay, and the Turborepo and v0 dates.

result: Vercel origin story delivered as dense markdown: Rauch's ZEIT (2015) → `now` CLI → Next.js (2016) → serverless Now 2.0 (2018) → Vercel rebrand (2020) → $9.3B frontend cloud.
