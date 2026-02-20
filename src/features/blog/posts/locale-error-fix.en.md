---
title: "Fixing locale.Error: unsupported locale setting in Docker and CI"
description: "The real cause of locale.Error and the two fixes that actually matter: generate locales, or standardize on C.UTF-8."
publishedAt: 2026-01-21
draft: false
---

This error is usually not a Python problem. It happens when `LANG`/`LC_*` points to a locale that isn't available in the OS.

## What happens

`setlocale(..., '')` means "use whatever locale `LANG`/`LC_*` says". In slim containers and CI images, that locale is often not generated.

Concrete example: `LANG=en_US.UTF-8`, but `en_US.UTF-8` isn't generated on the system, so the OS can't activate it.

## Two fixes

### Fix 1 (default): use `C.UTF-8`

If you don't need locale-specific sorting/formatting and only need correct UTF-8 handling, `C.UTF-8` is usually the easiest option for Docker and CI.

```dockerfile
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8
```

If `C.UTF-8` isn't available in your image, use Fix 2.

### Fix 2 (when you need a real locale): generate it

If you do need locale-aware formatting (or a specific locale like `en_US.UTF-8`), generate that locale in the OS image and set `LANG`/`LC_ALL` to match exactly.

Debian/Ubuntu example:

```dockerfile
RUN apt-get update \
    && apt-get install -y --no-install-recommends locales \
    && sed -i 's/^# *\(en_US.UTF-8 UTF-8\)/\1/' /etc/locale.gen \
    && locale-gen en_US.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8
```

Configure locale explicitly and this error goes away permanently.
