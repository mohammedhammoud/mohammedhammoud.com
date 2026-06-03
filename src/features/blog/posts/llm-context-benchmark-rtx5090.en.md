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

I wanted to measure how context scaling affects interactive usage on consumer hardware and where the practical limits start to appear for local coding assistants, RAG systems and agent workflows.

The benchmark was performed locally on a single RTX 5090 using Ollama.

## Hardware setup

- RTX 5090 with 32GB VRAM
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

- TTFT, time to first token
- Total generation time
- End-to-end throughput
- Relative context scaling behavior

All reported values are averages across three runs.

One important note: token throughput is approximate. The script estimates output tokens using `len(text) // 4`, so the results should be read as practical benchmark numbers rather than exact tokenizer-level measurements.

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

Interestingly, both models follow almost the same degradation curve.

That suggests the bottleneck is less about model architecture and more about the cost of maintaining and attending over a larger context window, especially KV-cache growth and memory bandwidth pressure.

## Key findings

### 1. The MoE model is dramatically faster

At 32k context:

- qwen3.6:35b-a3b reaches about 50 tok/s
- qwen3.6:27b reaches about 24 tok/s

The MoE model delivers roughly double the throughput despite having a larger total parameter count.

This was the largest performance difference observed during the benchmark.

### 2. Context scaling is expensive

Increasing context size has a clear cost.

TTFT grows aggressively as context increases:

| Context | 27B TTFT | 35B-A3B TTFT |
| ------- | -------- | ------------ |
| 32k     | 14.9s    | 8.1s         |
| 64k     | 31.4s    | 15.7s        |
| 96k     | 52.2s    | 24.6s        |
| 128k    | 80.1s    | 50.0s        |

Throughput also drops significantly, but TTFT is what affects the interactive feeling the most.

For local coding and agent workflows, the model can still be generating at an acceptable speed while the initial wait starts to feel expensive.

### 3. 64k is the sweet spot, but 96k is still usable

For this setup:

- 32k is very fast
- 64k feels like the best balance
- 96k is still usable and honestly impressive on consumer hardware
- 128k works, but the UX tradeoff becomes much more noticeable

This is the main practical takeaway.

The question is not whether a model can technically run a large context window. It can.

The better question is whether that context window still feels good to use interactively.

On this RTX 5090 setup, 64k feels like the practical sweet spot for responsiveness. 96k is still useful for larger analysis tasks. 128k is where the latency starts becoming harder to justify unless the workflow is more batch-oriented.

### 4. Bigger context does not make the model smarter

One common misconception around LLMs is that larger context windows improve reasoning.

They do not.

A larger context window gives the model more information to attend over, but the model itself does not become more capable.

The tradeoff is simple:

More context gives more workspace, but it also increases latency.

So the useful question is not:

> "How much context does the model support?"

The more useful question is:

> "How much context can I afford before the user experience becomes too slow?"

## Conclusion

For local coding assistants running on RTX 5090-class hardware:

- 32k is ideal when speed matters most
- 64k is the best overall balance
- 96k is still very usable for larger codebase or analysis-heavy tasks
- 128k works, but is better suited for slower, batch-style workflows

The most interesting result was not simply that 128k became slower.

That was expected.

The more useful finding was where the practical boundary appears on consumer hardware.

A single RTX 5090 can handle surprisingly large context windows, especially with qwen3.6:35b-a3b. But the cost grows quickly, and responsiveness becomes the limiting factor before the model becomes unusable.

Bigger context is useful.

But only if the interaction still feels responsive.
