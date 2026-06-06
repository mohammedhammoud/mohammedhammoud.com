---
title: "Re-running my RTX 5090 LLM benchmark on Ollama 0.30"
description: "Ollama 0.30 delivered dramatically better performance on my RTX 5090, especially for Qwen 3.6 35B-A3B."
publishedAt: 2026-06-06
tags: ["llm", "ollama", "qwen", "rtx5090", "ai"]
draft: false
---

## Why I re-ran the benchmark

A few days ago I published a benchmark measuring how Qwen 3.6 models behaved as context size increased on a local RTX 5090 setup.

After upgrading from Ollama 0.26 to Ollama 0.30, I noticed something surprising.

The models felt dramatically faster.

Instead of relying on subjective impressions, I re-ran the benchmark using the same hardware and a similar workload to see whether the difference was real.

It was.

## Hardware setup

- RTX 5090 with 32GB VRAM
- AMD Ryzen 9 9950X
- 64GB DDR5 RAM
- Samsung 9100 Pro Gen5 SSD
- Ollama 0.30
- Ubuntu Linux

## Models tested

### qwen3.6:27b

Dense model with all parameters active for every token.

### qwen3.6:35b-a3b

Mixture-of-Experts model where only a subset of experts are activated per token.

## Benchmark methodology

The benchmark uses a large synthetic TypeScript monorepo prompt and asks the model to implement a typed EventEmitter.

Generation settings:

json { "temperature": 0, "num_predict": 1024 }

Each benchmark was executed three times.

The first run includes cold-cache behavior.

The following runs benefit from prompt caching and are representative of repeated interactions during normal usage.

Metrics collected:

- TTFT (time to first token)
- Generation throughput
- Total execution time

Unlike my previous benchmark, these numbers use Ollama's reported token statistics rather than estimating output size from generated text.

## Results

### qwen3.6:27b

| Context |  TTFT | tok/s | Total Time |
| ------- | ----: | ----: | ---------: |
| 32k     |  3.7s |  64.8 |      19.6s |
| 64k     |  7.3s |  59.9 |      24.4s |
| 96k     | 12.7s |  55.4 |      31.3s |

### qwen3.6:35b-a3b

| Context | TTFT | tok/s | Total Time |
| ------- | ---: | ----: | ---------: |
| 32k     | 2.4s | 206.2 |       7.4s |
| 64k     | 3.9s | 180.6 |       9.6s |
| 96k     | 5.5s | 163.2 |      11.9s |

## The surprising part

The biggest surprise was not context scaling.

It was how much faster the MoE model became.

At 32k context:

| Model           |  Throughput |
| --------------- | ----------: |
| qwen3.6:27b     |  64.8 tok/s |
| qwen3.6:35b-a3b | 206.2 tok/s |

The 35B-A3B model is more than three times faster despite having a larger overall parameter count.

Even at 96k context:

| Model           |  Throughput |
| --------------- | ----------: |
| qwen3.6:27b     |  55.4 tok/s |
| qwen3.6:35b-a3b | 163.2 tok/s |

The gap remains enormous.

## Context scaling is still expensive

Larger context windows continue to have a cost.

### qwen3.6:27b

| Context | Relative Speed |
| ------- | -------------: |
| 32k     |           100% |
| 64k     |            92% |
| 96k     |            85% |

### qwen3.6:35b-a3b

| Context | Relative Speed |
| ------- | -------------: |
| 32k     |           100% |
| 64k     |            88% |
| 96k     |            79% |

Performance still declines as context grows, but the drop is far less dramatic than what I observed in my earlier benchmark.

The practical impact is that 96k context now feels completely usable interactively.

## What changed?

I cannot definitively attribute the improvement to a single component.

Possible contributors include:

- Ollama 0.30 improvements
- Newer llama.cpp backend
- Better CUDA kernels
- Better handling of MoE architectures
- Changes in model packaging or quantization

What I can say is that the difference is large enough to be noticeable without benchmarking.

The benchmark simply confirmed what I was already feeling during daily use.

## Practical takeaway

For local coding assistants and agent workflows on an RTX 5090:

- qwen3.6:35b-a3b is now my default model
- 32k context feels extremely fast
- 64k context is effectively free
- 96k context remains highly responsive
- Large-context workflows no longer feel like a compromise

The most surprising result is not that the models can run at these context sizes.

It is that they can do so while remaining genuinely interactive.

## Conclusion

When I published my original benchmark, my takeaway was that larger context windows came with a noticeable responsiveness penalty.

After upgrading to Ollama 0.30, that conclusion needs to be revisited.

Context still has a cost.

But on a single RTX 5090, Qwen 3.6 35B-A3B now delivers between 163 and 206 tokens per second while handling contexts between 32k and 96k.

That is fast enough that the context window largely stops being the bottleneck.

For local AI workflows, that changes the experience considerably.
