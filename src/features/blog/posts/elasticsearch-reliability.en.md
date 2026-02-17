---
title: "Running Elasticsearch reliably: systemd, Docker Compose, and managed cloud"
description: "What actually matters for reliable Elasticsearch: kernel limits, restart config, readiness checks, and when managed makes more sense."
publishedAt: 2025-12-03
draft: false
---

Most Elasticsearch reliability problems come down to a small set of causes: the node can't start because of kernel limits, it restarts in a way you didn't intend, or downstream services connect before it's actually ready.

## What actually matters

### 1) Kernel limits

If `vm.max_map_count` is too low, Elasticsearch will crash on startup. This setting lives on the Linux host (or the Docker Desktop VM), not inside the container.

### 2) Restart config and persistence

On VMs, a service that's _running_ isn't necessarily _enabled_ to start on reboot. In containers, a restart policy that seems fine can keep restarting a broken node without anyone noticing.

For Compose, keep it simple: a named volume and a restart policy that matches what you actually want.

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8
    environment:
      - discovery.type=single.node
      - xpack.security.enabled=false
    volumes:
      - es_data:/usr/share/elasticsearch/data
    restart: unless-stopped

volumes:
  es_data:
```

### 3) Readiness is not the same as "port is open"

Whether you're using Compose healthchecks or Kubernetes readiness probes, the point is the same: don't send traffic until the node is actually usable. Otherwise your API ends up handling the retry logic instead.

### 4) Self-hosting vs managed

Managed offerings (Elastic Cloud, AWS OpenSearch) take care of snapshots, upgrades, TLS, and node replacement. You lose some control over tuning and plugins. If search is not your core product, managed is usually the right call.

Get the basics right: kernel config, restart behavior, readiness checks. Once those are in place, decisions around shard strategy and managed vs self-hosted become much easier to think about.
