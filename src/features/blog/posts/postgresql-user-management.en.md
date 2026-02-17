---
title: "PostgreSQL user management and access control: a practical guide"
description: "How to set up PostgreSQL roles and privileges that stay manageable as your project grows."
publishedAt: 2026-02-05
draft: false
---

PostgreSQL permissions work well if you think about them upfront. The goal isn't to memorize `GRANT` syntax. It's to set up a role model that stays manageable as teams and services grow.

## Think in roles

PostgreSQL uses _roles_, not "users". A role can be allowed to log in, but it can also be a group role that only holds privileges. That distinction becomes useful the first time you need to rotate credentials, separate read and write access, or give a new service access to the database.

A setup that works well over time:

- Create group roles such as `app_read` and `app_write`.
- Give login roles membership in those group roles.
- Grant privileges to group roles, not to individual logins.

## Least privilege, with defaults

Most permission problems come from overly broad grants that were added quickly and never revisited. The other common issue: grants that apply to current tables but not to tables you create later.

If you grant access to tables, also set default privileges so new tables get the same treatment automatically:

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO app_read;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_write;
```

Without this, your permissions drift over time. New tables end up with different access than old ones, and it's not always obvious.

## RLS for multi-tenancy

Row-Level Security (RLS) is worth considering when you need hard tenant isolation. It moves the tenant filter from application code into the database, so it applies regardless of how the query was written.

The tradeoff: you need to set the tenant context for every connection or transaction, and you need to test the policies the same way you test application code.

## Managed Postgres doesn't change the model

Whether you're using Supabase, Neon, or RDS, the setup is the same: group roles, minimal grants, default privileges, and RLS where appropriate. Managed services only change who handles the admin account and which settings are exposed.

If your permission setup still makes sense a year from now, after you've added services, split read/write paths, and brought in new team members, you've done it right.
