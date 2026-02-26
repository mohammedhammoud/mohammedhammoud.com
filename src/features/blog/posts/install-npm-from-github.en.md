---
title: "Installing npm packages from GitHub"
description: "How to use forks and unreleased fixes without making your dependency setup hard to maintain."
publishedAt: 2026-01-07
tags: ["npm", "dependencies", "github"]
draft: false
---

Installing directly from GitHub is sometimes the only way to get unblocked, whether that's pulling in a fix that hasn't been released yet or using your own fork. But it skips the protections you get from the registry: immutable versions, semver, and a reliable source of truth. If you're going to do it, keep it predictable.

## Pin to a specific commit

Never depend on a branch name. Branches move. Tags can also move (or be deleted and recreated). If you want reproducible installs, pin to a full 40-character commit SHA.

```json
{
  "dependencies": {
    "some-lib": "owner/repo#0123456789abcdef0123456789abcdef01234567",
    "patched-lib": "your-org/upstream-fork#89abcdef0123456789abcdef0123456789abcdef"
  }
}
```

Commit your lockfile (`package-lock.json`) so CI and production install the exact same graph. Without it, you're not really pinned.

This matters when something breaks in production: "what code are we actually running?" should have a clear answer.

## Forks add maintenance, so track them

A fork-based dependency rarely feels temporary, but it becomes permanent by default if you don't keep track of it. Link it to an upstream issue or PR and define an exit in advance: upgrade to release X, or drop the override when the fix ships.

## For transitive deps, use overrides

If the package you need to pin is a dependency of a dependency, don't add it as a direct dependency just to force a version. Use npm `overrides`.

```json
{
  "overrides": {
    "vulnerable-transitive-dep": "your-org/patched-fork#fedcba9876543210fedcba9876543210fedcba98"
  }
}
```

## Private GitHub repos

If the GitHub repo you're installing from is private, your install environment needs GitHub auth. In CI, inject a GitHub token via secrets and use it at runtime (never commit credentials to the repo).

The point isn't to avoid GitHub installs entirely. It's to do it in a way that doesn't come back to bite you. If you can answer "what exact code is deployed?" and "when do we remove this?" without digging through CI logs, you're in good shape.
