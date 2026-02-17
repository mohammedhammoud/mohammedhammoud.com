---
title: "Using .env variables in package.json scripts (without surprises)"
description: "A practical 2026 view: shell env vs .env files, when to use dotenv-cli, cross-env, and Node's --env-file."
publishedAt: 2025-12-17
draft: false
---

Most teams have run into this at some point: a script works locally, breaks on Windows, then breaks again in CI. The root cause is usually the same.

## How it actually works

`package.json` scripts don't automatically read `.env`. They run a command in a shell, and the shell only sees variables from the **current process environment**. If nothing exported `PORT`, `$PORT` is empty.

That's why this appears to work but doesn't:

```json
{
  "scripts": {
    "start": "node server.js --port $PORT"
  }
}
```

## The practical options

Three tools worth knowing in 2026:

- **`dotenv-cli`**: the most flexible option, works with any command, including framework CLIs.
- **`cross-env`**: sets inline environment variables in a cross-platform way; does _not_ load `.env`.
- **Node's `--env-file`**: useful when you're running `node` directly, less useful with other CLIs.

Here's the pattern that covers most cases:

```json
{
  "scripts": {
    "dev": "dotenv -- vite",
    "start": "dotenv -e .env.production -- node server.js",
    "test": "dotenv -- cross-env NODE_ENV=test vitest"
  }
}
```

## CI and containers

In CI and production, treat `.env` files as a local developer tool. Use environment variables and secret stores for configuration instead. It's easier to audit and you avoid accidentally committing secrets.

Once you understand that scripts only see the current environment, the solution is straightforward. Pick one approach, use it consistently, and make it clear which environment variables your project depends on.
