---
title: "Using .env variables in package.json scripts"
description: "Shell env vs .env files: when to use dotenv-cli, cross-env, and Node's --env-file."
publishedAt: 2025-12-17
tags: ["nodejs", "tooling", "environment"]
draft: false
---

## How it actually works

`package.json` scripts don't automatically read `.env`. They run a command in a shell, and the shell only sees variables from the **current process environment** (so `$PORT` is empty unless it was exported).

That's why this appears to work but doesn't:

```json
{
  "scripts": {
    "start": "node server.js --port $PORT"
  }
}
```

Also, env var syntax is shell-specific: `$PORT` (bash), `%PORT%` (cmd), `$env:PORT` (PowerShell).

## Options

- **`dotenv-cli`**: loads `.env` for any command.
- **`cross-env`**: sets inline env vars; does _not_ load `.env`.
- **Node `--env-file`**: for `node` only (Node >= 20.6.0; existing env wins).

This covers most cases:

```json
{
  "scripts": {
    "dev": "dotenv -- vite",
    "test": "dotenv -- cross-env NODE_ENV=test vitest"
  }
}
```

## CI and containers

In CI and production, treat `.env` files as a local dev tool. Use environment variables and secret stores instead.
