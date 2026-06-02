---
title: "Benchmarking LLM context scaling on a local RTX 5090 setup"
description: "Measured real-world context scaling performance of Qwen 3.6 27B and Qwen 3.6 35B-A3B on a local RTX 5090 using Ollama."
publishedAt: 2026-06-02
tags: ["llm", "ollama", "qwen", "rtx5090", "ai"]
draft: false
---

## Why I ran this benchmark

Large context windows are one of the most advertised features of modern LLMs.

Most model cards focus on maximum supported context lengths, often quoting numbers like 128k or even 1M tokens.

What is rarely discussed is the real-world latency cost.

I wanted to measure how context scaling affects interactive usage on consumer hardware and determine whether larger context windows are actually useful for coding workflows.

The benchmark was performed locally on a single RTX 5090 using Ollama.

## Hardware setup

- RTX 5090 (32GB VRAM)
- AMD Ryzen 9 9950X
- 64GB DDR5 RAM
- Samsung 9100 Pro Gen5 SSD
- Ollama CUDA runtime
- Ubuntu Linux
- Remote execution over SSH from macOS

## Models tested

### qwen3.6:27b

Dense model with all parameters active for every token.

### qwen3.6:35b-a3b

Mixture-of-Experts model where only a subset of experts are activated per token.

The benchmark compares how both architectures behave as context grows.

## Benchmark methodology

Each benchmark was executed three times.

The same prompt was used for every run.

The prompt consisted of:

- A synthetic TypeScript monorepo
- Approximately 20,000 generated source file entries
- A coding task requiring implementation of a typed EventEmitter

Example task:

```ts
Implement a typed EventEmitter with:
- on
- off
- once
- emit
Include explanation and edge cases.
```

Generation settings:

```json
{
  "temperature": 0,
  "num_predict": 1024
}
```

Context sizes tested:

- 32k
- 64k
- 96k
- 128k

Metrics collected:

- TTFT (time to first token)
- Total generation time
- End-to-end throughput
- Relative context scaling behavior

All reported values are averages across three runs.

## Results

### qwen3.6:27b

| Context | TTFT  | tok/s | Total Time |
| ------- | ----- | ----- | ---------- |
| 32k     | 14.9s | 23.9  | 40.8s      |
| 64k     | 31.4s | 15.2  | 63.7s      |
| 96k     | 52.2s | 10.8  | 92.8s      |
| 128k    | 80.1s | 6.8   | 147.6s     |

### qwen3.6:35b-a3b

| Context | TTFT  | tok/s | Total Time |
| ------- | ----- | ----- | ---------- |
| 32k     | 8.1s  | 49.8  | 19.6s      |
| 64k     | 15.7s | 32.5  | 30.9s      |
| 96k     | 24.6s | 21.8  | 44.1s      |
| 128k    | 50.0s | 10.7  | 93.5s      |

## Throughput degradation

### qwen3.6:27b

| Context | Relative Speed |
| ------- | -------------- |
| 32k     | 100%           |
| 64k     | 64%            |
| 96k     | 45%            |
| 128k    | 28%            |

### qwen3.6:35b-a3b

| Context | Relative Speed |
| ------- | -------------- |
| 32k     | 100%           |
| 64k     | 65%            |
| 96k     | 44%            |
| 128k    | 22%            |

Interestingly, both models follow almost the exact same degradation curve.

This strongly suggests the bottleneck is not model architecture but KV-cache growth and memory bandwidth pressure.

## Key findings

### 1. The MoE model is dramatically faster

At 32k context:

- qwen3.6:35b-a3b reaches ~50 tok/s
- qwen3.6:27b reaches ~24 tok/s

The MoE model delivers roughly double the throughput despite having a larger parameter count.

This was the largest performance difference observed during the benchmark.

### 2. Context scaling is expensive

Doubling context size does not double latency.

It often increases latency significantly more than expected.

TTFT grows especially aggressively:

| Context | 27B TTFT | 35B-A3B TTFT |
| ------- | -------- | ------------ |
| 32k     | 14.9s    | 8.1s         |
| 64k     | 31.4s    | 15.7s        |
| 96k     | 52.2s    | 24.6s        |
| 128k    | 80.1s    | 50.0s        |

Interactive responsiveness degrades long before throughput becomes unusable.

### 3. 64k appears to be the sweet spot

For coding workloads:

- 32k is fastest
- 64k provides significantly more workspace while remaining responsive
- 96k starts feeling noticeably slower
- 128k becomes difficult to justify for interactive use

### 4. Bigger context does not make the model smarter

One of the most common misconceptions around LLMs is that larger context windows improve reasoning.

The benchmark shows the opposite tradeoff:

Increasing context size primarily increases latency.

Model intelligence remains unchanged.

The question is not:

> "How much context can the model support?"

The more useful question is:

> "How much context can I afford before the user experience collapses?"

## Conclusion

For local coding assistants running on RTX 5090-class hardware:

- 32k is ideal for speed
- 64k is the best overall balance
- 96k is useful for analysis-heavy tasks
- 128k should be reserved for batch-style workloads

The most surprising result was not how slow 128k became.

It was how consistently both models followed the same degradation pattern.

The limiting factor appears to be memory bandwidth and KV-cache scaling rather than model architecture itself.
