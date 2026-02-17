---
title: "Installing npm packages from GitHub (safely)"
description: "How to use forks and unreleased fixes without making your dependency setup hard to maintain."
publishedAt: 2026-01-07
draft: false
---

Installing directly from GitHub is sometimes the only way to get unblocked, whether that's pulling in a fix that hasn't been released yet or using your own fork. But it skips the protections you get from the registry: immutable versions, semver, and a reliable source of truth. If you're going to do it, keep it predictable.

## Pin to a specific commit or tag

Never depend on a branch name. Branches move. Pin to a tag if you're using an actual release, or a full commit SHA if it's a fork or an unreleased patch.

```json
{
  "dependencies": {
    "some-lib": "owner/repo#v2.3.1",
    "patched-lib": "your-org/upstream-fork#abc1234def5678"
  }
}
```

This matters when something breaks in production: "what code are we actually running?" should have a clear answer.

## Forks add maintenance, so track them

A fork-based dependency rarely feels temporary, but it becomes permanent by default if you don't keep track of it. Link it to an upstream issue or PR and define an exit in advance: upgrade to release X, or drop the override when the fix ships.

## For transitive deps, use overrides

If the package you need to pin is a dependency of a dependency, don't add it as a direct dependency only to force a version. Use your package manager's override mechanism instead.

```json
{
  "overrides": {
    "vulnerable-transitive-dep": "your-org/patched-fork#abc1234def5678"
  }
}
```

## Private registries and CI

If you need private packages (GitHub Packages, Artifactory, etc.), configure the registry in `.npmrc`, inject tokens via environment variables in CI, and don't commit credentials.

The point isn't to avoid GitHub installs entirely. It's to do it in a way that doesn't come back to bite you. If you can answer "what exact code is deployed?" and "when do we remove this?" without digging through CI logs, you're in good shape.
