---
schema: 1
id: 2026-10-15-storyboard-as-a-new-medium-abstract-stories-dire
title: "Storyboard as a new medium: abstract stories, director mods as personalities"
why: "Storyboard isn't a renderer, it's a medium: abstract stickman stories where the director mod is a storytelling personality, and users create the culture."
why_source: suggested
harness: claude-code
harness_version: 2.1.300
model: claude-opus-5-5
session_id: 116dc4dd-61b8-4752-aed7-3f819c2b2f1c
source_path: ~/.claude/projects/-Users-smarch-Documents-proj-claude-spark-ideas/116dc4dd-61b8-4752-aed7-3f819c2b2f1c.jsonl
started: "2026-10-15T19:09:47.371Z"
captured: "2026-10-15T19:23:51Z"
cwd: ~/Documents/proj/claude/spark/ideas
mode: "skill:intuition-panel"
turns: 8
complete: true
golden_turns: [4, 6, 8]
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
