---
title: "How I Turned Codex CLI into a Structured Engineering Assistant"
description: "Why I built reusable Codex CLI skills to add structure, discipline, and safer workflows to AI-assisted development."
publishedAt: 2026-03-08
tags: ["ai"]
draft: false
---

I've been using the Codex CLI a lot during my parental leave. Some parts of it have been great, and some parts have honestly been pretty bad. Not in a professional day-to-day setting, but often enough that I've had time to form a real opinion about it. Enough to see what it's actually good at, and where it starts making things worse.

Everyone talks about how amazing AI tooling is and how it will increase productivity. Maybe that's true, but it's also pretty subjective. We still don't really know how to measure productivity properly. To me, the biggest downside of AI tooling is that it can make us lazy and, honestly, a bit worse at thinking for ourselves.

I feel this most when I think about junior developers. They haven't yet built the instincts to tell good architecture from bad. That makes it easy to trust AI output when, in a lot of cases, it really shouldn't be trusted. Tools like Codex CLI, Claude, ChatGPT, and similar products are very good at generating code quickly, and the code will often work. But code that works is not the same as code that is actually good. A lot of the time, it doesn't fit the project very well because the tool doesn't really understand the bigger picture or the system's design. You can provide context and instructions, but without enough engineering judgment, it's very easy to build up technical debt.

At the same time, I do think AI tooling is a natural step in how we write software. I don't think, and I really hope not, that we should rely on it to write everything for us. We should stay in the driver's seat and use it as a helper, not act like it can replace judgment.

For a long time, I mostly used GitHub Copilot and the built-in VS Code chat. It was helpful, but also clunky. I had to constantly switch between the editor and the chat, start new sessions for different tasks, and the workflow never really felt smooth.

Then I started using AI through the terminal, and that was much more my thing.

What worked for me wasn't just using Codex CLI directly, but shaping it around how I already like to work. I built a small set of reusable skills, `debug`, `review`, `refactor`, `commit`, and `create-pull-request`, where each skill handles a specific step in my workflow. For example, the `debug` skill is there when I have a real error and want a strict, root-cause-first flow instead of a vague back-and-forth.

That structure changed the interaction quite a bit. `debug` helps me prove root cause instead of jumping straight to fixes. `review` pushes the conversation toward risks, regressions, and weak spots in the diff instead of generic praise. `commit` and `create-pull-request` make the last part of the work feel more consistent.

It doesn't make the model smarter, but it does make the workflow more disciplined.

That was the real shift for me. Instead of treating AI like a generic chat interface, I started treating it more like a structured assistant with clearer boundaries depending on the job. That made the whole thing feel less noisy and a lot more practical.

I put the setup in a separate repository, [codex-skills](https://github.com/mohammedhammoud/codex-skills), so I can reuse it across machines and keep tweaking it over time. The goal isn't to automate my job or hand over responsibility to the tool. The goal is to reduce friction in repetitive or well-scoped tasks while still keeping judgment, trade-offs, and architectural decisions on my side.

That's really the core of how I want to use AI in engineering. I don't want an assistant that jumps in and writes code for everything. I want one that works within clear boundaries, adds structure to the work, and still leaves the responsibility with me.

For me, that's the most useful shift. Not more output, just better constraints.
