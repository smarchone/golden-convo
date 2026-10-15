---
schema: 1
id: 2026-10-15-storyboard-as-a-new-medium-abstract-stories-dire
title: "Storyboard as a new medium: abstract stories, director mods as personalities"
why: "Storyboard isn't a renderer, it's a medium: abstract stickman stories where directors live in decisions not pixels, mods are generated skills anyone can make, and users create the culture."
why_source: suggested
harness: claude-code
harness_version: 2.1.300
model: claude-opus-5-5
session_id: 116dc4dd-61b8-4752-aed7-3f819c2b2f1c
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/116dc4dd-61b8-4752-aed7-3f819c2b2f1c.jsonl
started: "2026-10-15T19:09:47.371Z"
captured: "2026-10-15T20:01:09Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:intuition-panel"
turns: 14
complete: true
golden_turns: [4, 6, 8, 10, 12, 14]
labels: [product-idea, platforms]
status: raw
---

### 1 · **user:**

/productivity:intuition-panel lets discuss a product that im interest to build. storyboard. 
there is a core engine with director mod, that creates a storyboard as if it were a director. the core renders the storyboard. 
core: how to render a story
mod : what story to tell
wdyt ?

### 2 · **assistant:**

**CEO:** The real product is the separation, not the storyboard. One engine, many directors: a Wes Anderson mod and a Michael Bay mod take the same script and give you two different films. Directors become the content.

**PM:** Who presses "go"? A writer who wants to see their script? A YouTuber who needs a pre-viz? Or a fan who wants to see "Tarantino directs Pride & Prejudice"? Each of those is a different product.

**Architect:** Everything hinges on the contract between mod and core, a shot language: framing, lens, blocking, pacing, transitions. If that language is too thin, every director looks the same. If it's too rich, the core can't render it consistently.

```
  script ──▶ [ DIRECTOR MOD ] ──▶ shot list (the contract) ──▶ [ CORE ] ──▶ frames
              taste, intent        "CU, low angle, 2s hold"     style, consistency,
              what & why                                         characters, render
```

**CEO:** That shot list is the moat. Whoever owns the format the way screenplays own theirs owns the category.

**PM:** What's the "whoa" moment? Seeing your scene through a director's eyes, or swapping directors and watching it re-cut in seconds?

**Architect:** Hard reality: the same character has to look the same in every panel. The core lives or dies on that. Without it you have a mood board.

---

**The question to answer:** Is the mod a *lens* that only changes how a story is shot, or an *author* that also changes what happens in it? Your line ("mod: what story to tell") says author. The diagram assumes lens.

### 3 · **user:**

im thinking of rendering abstract storyboard, not a concrete one. 
story telling with reaskistic concrete details removes imagination.

also we are  not dealing with screenplay or script. the user is not a director or a film expert. 
this tool is intended to help people share their stories in interesting ways with low cognitive effort. 
value is to have fun sharing stories or narrate stories that people love and to inspire them.

eg: stickman storyboard can be simplest version.

### 4 · **assistant:**

**CEO:** Good reframe. This is closer to xkcd than to Pixar. Abstraction is the feature: the viewer fills in the faces, so the story turns into *their* memory. The "director" isn't a cinematographer now. It's the friend who always tells the story better than you.

**PM:** The input is a person rambling: "so this one time at the airport…". Low effort means voice or messy text in, a shareable strip out, in under a minute. Is the share moment a strip people scroll, or a short animated thing they watch?

**Architect:** Stickmen get rid of the consistency problem, and the hard part moves somewhere else. Now it's **beat selection**: which 5 moments of a 2-minute ramble become panels, and what gets left out. The gaps between panels are where imagination happens, and the director mod is the part that picks them.

```
  "so this one time..."  ──▶  [ DIRECTOR ]  ──▶  beats + emphasis  ──▶  [ CORE ]
   messy, rambling             picks 4-6 moments    "tension here,         stickmen,
   voice / text                decides what to      pause, punchline"      arrows, motion
                               leave out                                   lines, captions
```

**CEO:** So the mods are storytelling *personalities*, not film styles: "the dramatic one," "the deadpan one," "the bedtime-story one." Same airport story, three different laughs.

**PM:** What do the people who *receive* it do? If they only look at it, it's a toy. If they reply with their own story, or remix yours with a different director, it's a loop.

**Architect:** An abstract visual vocabulary is small enough to get right: poses, props, arrows, speech bubbles, motion marks. That's a closed grammar, so the core can be deterministic and fast, and only the director has to be smart.

---

**The question to answer:** Is it for **your own stories** (personal, "this happened to me") or for **stories you love** (retelling a myth, a movie plot, grandma's folk tale)? Same engine, but who it's for, the tone, and the sharing loop are different for each.

### 5 · **user:**

both, but start with stories people love. 
applications: content generation - for entertainment, culture, social activism, criticism, journalism, etc..
hope : this will be a new and  interesting form of expression.

it would be helpfull if the core draws the story deterministically (saves tokens). but not a hard constraint. 
if llm agent draws, its more flexible (upside).

### 6 · **assistant:**

**CEO:** "New form of expression" means you're building a **medium**, and a medium is defined by its constraint: 140 characters, 6-second loops, 4-panel strips. Pick the constraint, e.g. "any story in 6 stickman panels," and the culture grows around it. Journalism, activism and criticism come later, made by users, not by you.

**PM:** Starting with stories people love is smart because there's no blank-page problem. "The Odyssey, deadpan" or "the 2008 crash, as a bedtime story" are easy to type. But expression needs a **point of view**. Where does the user's voice go in? Picking the director? Editing a panel? A one-line angle like "tell it as if Icarus was right"?

**Architect:** Go hybrid. The LLM writes a scene in a small grammar and the core renders it deterministically. When the grammar can't express something (a Trojan horse, a ballot box), the agent draws a glyph *once*, and it's cached into the vocabulary for good. That way it's flexible at the edges and cheap at the center.

```
  story + angle ──▶ [ DIRECTOR / LLM ] ──▶ scene grammar ───────▶ [ CORE ] ──▶ panels
                                           pose, prop, arrow,     deterministic,
                                           caption, emphasis      fast, free
                                                │
                                   unknown prop? ──▶ LLM draws glyph ──▶ vocabulary cache
                                                                         (grows with use)
```

**CEO:** That cache is a quiet compounding asset. Every story told makes the language a little richer, like an emoji set that grows on its own.

**PM:** Abstraction is a superpower for activism and journalism. You can show a police raid, a war or a scandal without gore or faces. It's easier to share and harder to take down. Remember that one for later.

**Architect:** Deterministic rendering also makes stories **diffable and remixable**. A story is just data, so "same story, different director" re-renders instantly and costs almost nothing.

---

**The question to answer:** What's the **atomic unit** of this medium, the thing someone posts? A fixed strip (say 6 panels, read at your own pace), or a short animated sequence (15 seconds, plays at the director's pace)? That decides whether the director controls *composition* or *timing*.

### 7 · **user:**

lets discuss that later. for now idea only.

so, i create a platform/tool, users create culture

### 8 · **assistant:**

**CEO:** Yes, that's the shape. You build the instrument and users make the music. But culture doesn't start on an empty platform. It starts on someone else's: the first strips live on X, TikTok and group chats, and the platform comes later as the place they point back to.

**PM:** Every medium that made culture had a **remix verb**: retweet, duet, stitch, quote. Here it falls out of the design: *same story, new director* and *same director, new story*. Remixing is how culture spreads.

**Architect:** There are three layers, and each one can be opened to users separately:

```
  LANGUAGE   glyphs, poses, props        ← grows from use (the cache)
  DIRECTORS  storytelling personalities  ← you seed them... then users?
  STORIES    what people post            ← users, from day one
```

**CEO:** The middle layer is the interesting bet. If users can make directors, then *a way of telling* becomes something people create and follow. You'd follow a director, not just a creator.

**PM:** That's also where a community could form: people who love the "deadpan historian" director gather around it the way a fandom gathers around a voice.

**Architect:** User-made directors are just prompts plus a style for the grammar. They're cheap to make, but quality varies wildly. Some curation will be needed.

---

**The question to answer:** Do **you** own the directors (a curated, consistent voice, like a publisher), or do **users** make them too (an open, messy ecosystem of storytelling styles)?

### 9 · **user:**

is anyone doing this already ?

### 10 · **assistant:**

[ran: WebSearch — AI stick figure comic generator from story text]
[ran: WebSearch — AI storyboard generator from text 2026]
[ran: WebSearch — AI comic strip app retell stories narrator style remix social]

Partly. The pieces exist, but I didn't find anyone who has put them together the way you're describing. That's based on three quick searches and the vendors' own pages; I haven't used any of these products.

**What already exists**

| Group | Examples | How it differs from your idea |
|---|---|---|
| Storyboards for film | [Storyboarder.ai](https://www.atlabs.ai/blog/ai-storyboard-generator-2026), [Drawstory](https://www.drawstory.ai/blog/best-ai-tools-story-to-comics-storyboards), [StoryboardHero](https://storyboardhero.ai/storyboardhero-ai-script-to-storyboard-generator), [Adobe Firefly Boards](https://www.adobe.com/in/products/firefly/features/storyboard.html) | Built for filmmakers who start from a script. They aim for realistic frames and consistent characters, the opposite of your direction. |
| Text-to-comic generators | [LlamaGen](https://llamagen.ai/features/ai-comic-strips-maker), [Pollo](https://pollo.ai/comic-strip-maker), [Fotor](https://www.fotor.com/features/ai-comic-generator/), [Komiko](https://komiko.app/ai-comic-generator), [Comicsify](https://comicsify.com/) | Image generators with a "style" dropdown. They have no storytelling personality and no remix loop. |
| Stick-figure tools | [Stickify Tales](https://peerlist.io/ajbatac/project/stickify-tales), [LlamaGen's stick-figure generator](https://llamagen.ai/en-gb/tools/stick-figure-comic-generator--abcd32a) | The closest in look. They're small tools that turn prompts into panels. |
| Comics with a social feed | [Commix](https://commix.ai/) | The closest in shape: an AI cartoon feed with "narrator stories," persona packs, voice-over and publishing. Look at this one first. |

**What nobody seems to have claimed**

1. **The director as the product.** Everyone else offers *visual* styles. A storytelling *personality* that decides which beats to show, what to leave out and where the punchline lands doesn't show up anywhere. Commix's "persona packs" might be close, so check what they actually do.
2. **Abstraction as the point.** The whole category is racing toward realism and consistent characters. Stick figures are offered as a cheap style, never as a deliberate way to leave room for the reader's imagination.
3. **A grammar and a deterministic renderer.** These products all generate pixels. Treating a story as data, so it can be re-rendered instantly with a different director, is a structural difference, not just a feature.
4. **A medium rather than a tool.** None of them define a format (like "any story in 6 panels") with a remix verb built in.

**Honest risk:** in a demo, the gap is easy to miss. "Stick-figure comic from text" already exists. You only stand out if the difference in storytelling between two directors is obvious within one strip.

The question this raises: would you test it first by showing that a single director is *good* (one strip people want to share), or that directors are *different* (the same story told three ways, side by side)?

### 11 · **user:**

may be we can pitch as a study for filmmakers. how would quntin make this story or quntin vs wes on same story

### 12 · **assistant:**

**CEO:** "Quentin vs Wes on the same story" is a great **hook** and a weak **market**. Filmmakers are a small group who want realistic pre-viz, which pulls you back toward the storyboard tools you were trying to get away from. Use the matchup as the trailer for the medium, not as the customer.

**PM:** The real pull is from **film fans and students**, not filmmakers. "How would Tarantino tell Cinderella?" is a video essay you can make in 30 seconds. That's the bridge: it starts as entertainment, and the analysis comes along for free.

**Architect:** Abstraction helps more than you'd expect. A director's signature lives mostly in **structure**, which stickmen can show perfectly well:

```
             TARANTINO                         WES ANDERSON
  order:     ch.3 → ch.1 → ch.2 (out of order)  in order, with title cards
  framing:   low trunk shot, close-ups          dead-center, symmetric, flat
  beats:     long talk → sudden violence        tidy, deadpan, small heartbreak
  gaps:      skips the event, shows the fallout  narrator tells you what's missing
```

**CEO:** That table is the pitch. If stickmen can make Tarantino and Wes *recognizable*, you've shown that directors live in decisions, not pixels. That's the thesis of the whole product.

**PM:** The share format is a side-by-side split: same story, two directors, and people vote or argue. Arguing about whose version is better is the engagement loop.

**Architect:** Hard reality: a director's *style* can't be copyrighted, but their *name* in your marketing is a right-of-publicity and endorsement problem. Plan for "In the style of…" or labels like "The Nonlinear Bloodbath vs The Symmetric Deadpan." Users will name the directors themselves.

---

**The question to answer:** Is "Quentin vs Wes" your **launch demo**, or your **product category** ("director studies")? The first draws people into the broader medium. The second narrows you down to film nerds, who are a great audience but a small one.

### 13 · **user:**

launch demo, not the category. thats why we have mods. people can add mods of who ever they want. mod is just a skill i guess which can be generated

### 14 · **assistant:**

**CEO:** Then the real unlock is that *a way of telling stories* becomes something anyone can write, share and fork. Mods are to this medium what fonts are to type. "Quentin vs Wes" gets people in the door. "Make a director out of your grandma" makes them stay.

**PM:** If a mod is a generated skill, the creation loop has to be as easy as telling a story: *"make a director who tells everything like a nature documentary"* gets you a mod you can use immediately. The share moment is "try my director on your story."

**Architect:** A mod is a skill whose output is the scene grammar. That's the only contract it has with the core:

```
  "tell it like a nature doc"  ──▶ [ MOD GENERATOR ] ──▶  mod (skill)
                                                          ├─ voice: hushed, observational
                                                          ├─ beats: patience → sudden action
                                                          ├─ framing: wide, distant, still
                                                          └─ gaps: never explains motive
                                                                │
                              any story ──▶ [ mod ] ──▶ scene grammar ──▶ [ CORE ] ──▶ strip
```

**CEO:** Mods that anyone can generate also give you the long tail for free: activists, critics and teachers each build the voice they need. You never have to predict their use cases.

**PM:** The risk is that generated mods all drift toward the same polished "LLM storyteller" voice. A mod is only worth something if it's **distinct**. Run the same story through two mods, and if the strips look alike, the mod failed.

**Architect:** That gives you a built-in quality check: render a standard set of stories through each new mod and measure how far its output is from the others'. Distinctiveness is the score, not polish.

---

**The question to answer:** Is a mod made by **describing** it ("tell it like a nature documentary") or by **showing** it (feeding in 3 examples of the voice you want, such as Tarantino scenes or grandma's voice notes)? Describing is easy but generic. Showing is harder but captures the real thing.
