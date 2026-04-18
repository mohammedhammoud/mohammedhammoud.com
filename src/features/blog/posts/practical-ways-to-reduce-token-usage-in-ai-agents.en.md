---
title: "Practical Ways to Reduce Token Usage in AI Agents"
description: "Practical, real-world techniques for reducing token usage in AI agents by controlling context, input, and output."
publishedAt: 2026-04-18
tags: ["ai"]
draft: false
---

One of the biggest problems I've run into when using AI agents isn't the model quality itself, but how quickly they burn through tokens.

It doesn't really matter if you're on a subscription plan or paying per usage. Once you start using agents heavily, you hit limits faster than expected. You won't eliminate the problem completely, but you can reduce it significantly by being more intentional with how you use them.

## Output helps, but context matters more

The first thing that gave me a noticeable improvement was adding RTK (Rust Token Killer).

It's essentially a command-line proxy that trims command output before it ever reaches the agent. This is especially useful for CLI-heavy workflows where commands like `git status`, `git diff`, and `git commit` produce a lot of noise.

Instead of changing how you work, RTK just sits in front and reduces the amount of unnecessary output the agent sees.

It's simple to set up: <https://github.com/rtk-ai/rtk>

If you're using Homebrew:

```bash
brew install rtk
rtk init --help # to see how to set it up with your shell
```

This helped, but it wasn't the biggest improvement.

## Start fresh sessions

The bigger issue is input. AI agents get expensive when they carry too much context, and most of it is self-inflicted.

One thing that helped immediately was to always start a new session when beginning a new task. Dragging old conversations along might feel convenient, but it leaks context and quickly fills up your token budget without much benefit.

## Plan first, act second

Another thing that made a noticeable difference was using plan mode before doing any real work.

Instead of letting the agent jump straight into changes, you force it to structure the task first. It adds a small upfront cost, but reduces unnecessary back-and-forth later. More importantly, it gives you a chance to verify that the agent is actually heading in the right direction.

## Be strict about what you send in

More context usually makes the model worse, not better.

Instead of sending an entire file, send only the relevant function. Instead of pasting long logs, trim them to the part that actually matters. Instead of including the whole codebase, reference only what's needed for the task.

A smaller, focused input usually leads to better output. If you are precise, the agent tends to respond more precisely as well.

Some tools, like Codex CLI, show how much context you've used and what's left. Pay attention to that, otherwise you'll hit limits without understanding why.

## Avoid full automation unless you're watching closely

Running agents in full automatic mode can be tempting, but it often leads to wasted tokens.

If the agent starts going in the wrong direction or gets stuck, it can burn through a lot of context very quickly. If you do use it, keep an eye on what the agent is doing and stop early if things start drifting.

## What actually worked

After testing different approaches, the biggest improvements came from:

- reducing CLI noise
- starting fresh sessions more often
- using plan mode before execution
- limiting how much context is sent in
- breaking tasks into smaller steps

Interestingly, a lot of things that sound smart didn't help much in practice, like trying to optimize prompts or adding more abstraction layers.
