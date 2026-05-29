---
layout: post
title: Distributed computing
subtitle: Accelerate library for beginners
tags: [distributed-computing]
comments: true
author: dzungphieuluuky
---

Training big models isn't interesting because it's hard — it's interesting because it's boring. The engineering part is getting the boring bits right: device placement, data sharding, sync, and reliable checkpoints. Hugging Face Accelerate removes most of that boring plumbing while keeping the parts you actually care about: the model, the data, and the math.

This note is pragmatic: how I use Accelerate to move from a laptop prototype to multi‑GPU runs without rewriting my training loop every time.

## Motivation — stop writing setup code

When models and datasets grow, two things happen:
- Your single GPU runs out of memory.
- Your scripts become full of `if rank == 0` and `os.environ` hacks.

Accelerate gives you a small, predictable surface to solve both problems. You keep your PyTorch loops; you wrap the pieces that need distribution. That minimal change is the whole win.

## The pattern I use

1. Construct model, optimizer, dataloaders.
2. Create `Accelerator()` with sensible defaults (mixed precision, accumulation).
3. Call `accelerator.prepare(model, optimizer, dataloader, val_dataloader)`.
4. Run the exact same training loop you had before, replacing `loss.backward()` with `accelerator.backward(loss)` and guarding I/O with `if accelerator.is_main_process`.

Small example:

```python
from accelerate import Accelerator
from tqdm.auto import tqdm

def train(model, optimizer, train_loader, val_loader):
    accelerator = Accelerator(mixed_precision="fp16", gradient_accumulation_steps=4)
    model, optimizer, train_loader, val_loader = accelerator.prepare(
        model, optimizer, train_loader, val_loader
    )

    for epoch in range(epochs):
        model.train()
        for batch in tqdm(train_loader, disable=not accelerator.is_main_process):
            with accelerator.accumulate(model):
                outputs = model(**batch)
                loss = outputs.loss
                accelerator.backward(loss)
                optimizer.step(); optimizer.zero_grad()

        accelerator.wait_for_everyone()
        if accelerator.is_main_process:
            accelerator.save_state(f"ckpt_epoch_{epoch}")

    return accelerator.unwrap_model(model)
```

Notes:
- Call `prepare()` before `torch.compile()` if you intend to compile — I usually prepare then compile the unwrapped model.
- Use `accelerator.is_main_process` to keep logs and checkpoints single‑threaded.

## Why not raw DDP?

Raw DDP is powerful but boilerplatey. You write code that assumes a specific launch method, set up process groups manually, and sprinkle `rank` checks everywhere. Accelerate still uses DDP under the hood where appropriate, but it gives you:

- automatic device mapping and `DistributedSampler` for dataloaders;
- `accelerator.backward` which handles mixed precision scaling;
- context managers like `split_between_processes` for easy distributed inference.

Use raw DDP if you need low‑level control (custom collectives, exotic scheduling). Use Accelerate for day‑to‑day work and prototyping.

## Distributed inference — simple patterns that scale

Two common modes:

- Data‑parallel inference: replicate the model on each device and split the input list across processes.
- Model sharding: split layers or tensors across devices for models that don't fit in one GPU.

A compact inference recipe:

```python
from accelerate import PartialState

state = PartialState()
model.to(state.device)
prompts = ["..." ] * 1024
with state.split_between_processes(prompts) as local_prompts:
    inputs = tokenizer(local_prompts, return_tensors="pt", padding=True).to(state.device)
    with torch.inference_mode():
        out = model.generate(**inputs, max_new_tokens=120)
    texts = tokenizer.batch_decode(out, skip_special_tokens=True)
all_texts = state.gather(texts)
```

`split_between_processes` does the boring work of partitioning and optional padding; `state.gather` collects results on the main process.

## A few practical details I always check

- Seeds: set `torch.manual_seed(42 + accelerator.process_index)` so each process gets a deterministic offset.
- Checkpointing: save only on `accelerator.is_main_process` and call `accelerator.wait_for_everyone()` before/after saving.
- Memory: with accumulation and mixed precision you can simulate larger batches. Effective batch size follows

$$EFB = 	ext{batch	n per device} \times \text{num	n devices} \times \text{accumulation	n steps}$$

- Clean shutdown: prefer `accelerator.end_training()` for training runs; for ad‑hoc inference loops use `accelerator.free_memory()` and `destroy_process_group()` if you need to avoid warnings.

## Common pitfalls

- Hanging: usually mismatched tensor sizes when gathering — use the `--debug` launch for diagnostics.
- OOM: lower per‑device batch size, increase accumulation, or use model sharding / `infer_auto_device_map`.
- Logging spam: only log from `accelerator.is_main_process`.

## Accelerate vs Lightning

Lightning is an opinionated training framework with many bells and whistles (callbacks, logging, standardized `Trainer`). Accelerate is deliberately small: it keeps your loop and makes it distributed. Use Lightning when you want framework‑level features; use Accelerate when you want to keep your code explicit and simple.

## Closing

Accelerate is one of those tools that pays off immediately: change three lines, and your script runs on one GPU, many GPUs, or a TPU with no further surgery. If you care about experiments and iteration speed, it buys you time back to think about models instead of launch flags.

If you'd like, I can:
- convert one of your existing training scripts to Accelerate, or
- add a small runnable example to the repo.

Happy to do either — tell me which script to convert.
