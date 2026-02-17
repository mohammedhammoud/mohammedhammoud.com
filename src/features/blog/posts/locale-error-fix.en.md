---
title: "Fixing locale.Error: unsupported locale setting in Docker and CI"
description: "The real cause of locale.Error and the two fixes that actually matter: generate locales, or standardize on C.UTF-8."
publishedAt: 2026-01-21
draft: false
---

This error is almost never a Python problem. It's a mismatch between what your environment variables _say_ and what the OS actually _has installed_.

## What's going on

Somewhere in the Python code, `setlocale(..., '')` gets called, which means "use whatever locale `LANG`/`LC_*` says". In minimal environments (slim containers, some CI images, freshly set up servers) those locales are often not installed.

So you end up with `LANG=en_US.UTF-8` set, but no `en_US.UTF-8` locale definition on disk.

## Two fixes

### 1) Use `C.UTF-8`

If you don't need locale-specific sorting or formatting and only need correct UTF-8 handling, `C.UTF-8` is the easiest option. It works reliably in containers and CI.

```dockerfile
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8
```

### 2) Install the locale you need

If you do need locale-aware formatting, install the locale in your OS image and set `LANG`/`LC_ALL` to match. The key is consistency: the environment variables need to match what's actually installed.

## Where to apply the fix

- **In containers**: use `C.UTF-8` unless you have a specific reason not to.
- **On VMs**: install locales once during provisioning.
- **In CI**: don't rely on defaults, set `LANG`/`LC_ALL` explicitly.

Once you treat locale as something you configure explicitly rather than assume is there, this error stops coming back.
