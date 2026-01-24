---
layout: post
title: Brief introduction to Hugging Face Accelerate
subtitle: Hands on distributed training and inference
tags: [deep-learning, accelerate, distributed-training, distributed-inference, pytorch, mlops, pytorch-lightning]
comments: true
author: dzungphieuluuky
---

With the increasingly large amount of data and model size in artificial intelligence training, especially deep learning with super massive models, training and inference time is becoming more and more expensive than ever before. They can consume a lot of time and this is raising another demand for distributed and parallel support for both training and inference process.

In this blog, I will try to delve into Hugging Face Accelerate for distributed training and inference, highlighting its abstractions, key methods, comparisons with native PyTorch tools and PyTorch Lightning.

## The Growing Need for Distributed Computing

As deep learning models expand in parameters and dataset sizes, single-device training becomes impractical. Practitioners often navigate diverse environments, from resource-constrained laptops to cloud-based multi-GPU setups. In this blog, we target young researchers and enthusiasts with low computational resources which would drive them to seek out for multiple GPU cloud computing environments for their projects.

Consider these common platforms and their constraints:

| Platform          | Typical Hardware          | Key Limitations                    | Distributed Suitability           |
|:------------------|:--------------------------|:-----------------------------------|:----------------------------------|
| Google Colab      | T4/A100 GPU               | Session timeouts, ~15GB VRAM       | Single-node, basic multi-GPU      |
| Kaggle Notebooks  | P100 or 2×T4 GPUs         | 30 GPU hours/week, ephemeral storage | Multi-GPU friendly, quota-limited |
| Local Laptop      | CPU/MPS or single GPU     | Limited memory, no native multi-GPU| Ideal for prototyping, CPU fallback|
| GPU Cluster       | 4–8× A100/H100            | High cost, setup complexity        | Multi-node scaling, production    |

Without abstraction layers, code devolves into platform-specific hacks, complicating maintenance and reproducibility.

Manual environment checks (e.g., via `os.environ`) and ad-hoc device placements lead to brittle scripts that fail across setups—Accelerate addresses this by unifying the interface. We no longer to care about setup code and have more time to focus on the model itself and core logics.

## Accelerate abstract aways boilerplate code for distributed computing

Hugging Face Accelerate simplifies PyTorch code for any distributed configuration with minimal changes. It detects hardware automatically and handles device placement, parallelism, and optimizations.

Core workflow:

```python
from accelerate import Accelerator

accelerator = Accelerator(mixed_precision="bf16")  # bf16 for modern GPUs

model, optimizer, dataloader = accelerator.prepare(
    model, optimizer, dataloader
)
```

- First, we need to import class `Accelerator` from module **accelerate** to use it.
- Then we initialize the `accelerator` object to wrap around our PyTorch code to enable automatic distributed computing.
- In the final section of the code, we see that `model`, `optimizer` and `dataloader` are wrapped with `prepare()` method, which would move our important objects for training and inference process under `accelerator`'s wings. This should be done before `torch.compile()` if we want to compile the model for faster inference due to static computational graph after compilation. 

## Comparing Accelerate with Native PyTorch DistributedDataParallel (DDP)

Native PyTorch DDP requires explicit management of process groups, ranks, and synchronization—boilerplate that Accelerate hides entirely.

Key differences:

- **Setup Complexity:** DDP demands `torch.distributed.init_process_group(backend='nccl')`, manual rank/world_size handling, and wrapping models with `DistributedDataParallel(model, device_ids=[local_rank])`. Accelerate initializes everything via `Accelerator()` and `prepare()`, which we talked about earlier in the previous code.

- **Abstractions Provided by Accelerate:** It conceals device mapping, automatic `DistributedSampler` for dataloaders, gradient synchronization in `accelerator.backward(loss)`, and mixed-precision scaling. Users focus on core logic without worrying about `torch.distributed.barrier()` or rank-specific code.

- **Advantages of Accelerate:** Portability across CPU/GPU/TPU/MPS, built-in gradient accumulation, and seamless integration with HF ecosystems, you can find ít documentation on HuggingFace documents page. DDP is lower-level, offering more customization but at the cost of verbosity.

- **When to Choose:** Use native DDP for fine-grained control in custom distributed algorithms, in case we have a architecture or processing paradigm that are too customized; prefer Accelerate for rapid prototyping and standard data-parallel training.

Example: Native DDP vs. Accelerate

```python
# Native DDP (simplified)
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel

dist.init_process_group(backend='nccl')
model = DistributedDataParallel(model, device_ids=[local_rank])

# Accelerate equivalent
accelerator = Accelerator()
model = accelerator.prepare(model)  # Internally wraps with DDP if multi-GPU
```
In the native DDP code, we can clearly see that we must do the following things to get the job done:
- Set up import modules for torch distributed package and DistributedDataParallel class to handle distributed processing.
= Initilize the backend for the process group manually and wrap the model with its corresponding device id inside the class DistributedDataParallel.

On the other hand, when using Accelerate, we only needs one line to make the magic happens:

```python
model = accelerator.prepare(model)
```

After this line, all the components inside the `prepare` method is immediately wrapped inside the accelerator object, ready for automatic backend handling. We can put anything related to our training and inference process inside the method such as scheduler, model, optimizer, train/validation/test data loader, etc. If you are intended to use `torch.compile()` method to speed up the inference process, then we should use it after preparing the modules inside accelrator. This order ensures that the pytorch library also compiles all related byproduct happening when accelerator handles our modules for best performance.

## Complete Portable Training Template

Leverage this template for end-to-end training across environments:

```python
from accelerate import Accelerator
import torch
from tqdm.auto import tqdm

def train_model():
    accelerator = Accelerator(
        mixed_precision="fp16",
        gradient_accumulation_steps=4,
        log_with="wandb"
    )

    torch.manual_seed(42 + accelerator.process_index)  # Per-process seed

    model = YourModel()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-5)
    train_loader = your_dataloader(batch_size=64 // accelerator.num_processes)

    model, optimizer, train_loader = accelerator.prepare(model, optimizer, train_loader)

    for epoch in range(10):
        model.train()
        
        # we wrap normal range() with tqdm here for progress bar displaying, you can leave it as is if you don't need it
        pbar = tqdm(train_loader, disable=not accelerator.is_main_process, desc=f"Epoch {epoch}")

        for batch in pbar:
            with accelerator.accumulate(model):
                outputs = model(**batch)
                loss = outputs.loss
                
               
                accelerator.backward(loss)  # be aware not loss.backward(), this is for single gpu training
                optimizer.step()
                optimizer.zero_grad()

            if accelerator.is_main_process:
                pbar.set_postfix({"loss": loss.item()})

        accelerator.wait_for_everyone()  # Sync before epoch-end ops
        
        
        if accelerator.is_main_process: # only main process is allowed to save state to prevent race conditions
            accelerator.save_state(f"checkpoint_epoch_{epoch}")

    accelerator.end_training()  # Cleans up, calls destroy_process_group internally
    return accelerator.unwrap_model(model)  # Access original model
```
## Mastering Distributed Inference

For inference, Accelerate enables parallel batch processing or model sharding.

Data-parallel inference example:

```python
from accelerate import PartialState, infer_auto_device_map

state = PartialState()
model = YourLargeModel().to(state.device)

# For very large models
device_map = infer_auto_device_map(model, max_memory={0: "16GiB", 1: "16GiB"})
model = accelerator.prepare(model, device_map=device_map)

inputs = ["prompt"] * 100
with state.split_between_processes(inputs) as local_inputs: # partition the whole inputs into multiple sub inputs for each process
    outputs = model.generate(local_inputs)
    # Gather outputs if needed
    all_outputs = state.gather(outputs)
```

Avoid direct attribute access on prepared models (e.g., `model.config`); unwrap first: `accelerator.unwrap_model(model).config` to prevent **DistributedDataParallel does not have this property** errors.

## Proper Usage of Key Accelerate Methods

### 1. `prepare()` — Put our weapons under accelerate's wings

Wraps PyTorch objects (models, optimizers, dataloaders, schedulers…) to make them distributed-aware. Ensures DDP wrapping, distributed sampling, and device placement.

Call after creating model/optimizer/dataloader, but before training loop. If we want to compile models for faster inference, we should prepare it first then compile later to ensure the compilation process also touches all of submodules that **accelerate** introduces.

**Example Use Case**

```python
model, optimizer, train_loader, eval_loader = accelerator.prepare(
    model, optimizer, train_loader, eval_loader
)
```

All components are prepared in one call. This is the most common pattern for typical supervised training pipelines (computer vision, NLP, tabular models).

### 2. `accelerator.backward(loss)` — Distributed-aware backpropagation

Replaces `loss.backward()`. Performs gradient synchronization across processes and handles scaling in mixed precision training.

**Use Case 1 — Any training loop with multi-GPU**

```python
with accelerator.accumulate(model):
    loss = model(inputs).loss
    accelerator.backward(loss)
```

Ensures gradients are correctly averaged across all GPUs — required whenever using data parallelism.

**Use Case 2 — Training with gradient checkpointing + mixed precision**

```python
loss = model(inputs, use_checkpointing=True).loss
accelerator.backward(loss)
accelerator.clip_grad_norm_(model.parameters(), max_norm=1.0)
```
Combines safely with gradient checkpointing and clipping — very common when training large transformers with limited memory.

### 3. `accelerator.accumulate(model)` — Gradient accumulation context

Accumulates gradients over several forward-backward passes before performing an optimization step. Allows larger effective batch sizes without increasing VRAM usage.

**Example Use Case — Memory-constrained fine-tuning**

```python
for batch in train_loader:
    with accelerator.accumulate(model):
        loss = model(batch).loss / accelerator.gradient_accumulation_steps
        accelerator.backward(loss)
```

Effective batch size is calculated using number of batches per device, number of devices and gradient accumulation steps — very useful on Colab/Kaggle with small GPU memory.

\\(EFB  = BPD \times  P \times  AS\\)

In the formula:
- **EFB**: effective batch size. This is the total effective batch size conceptually used for training == the normal batch size you may find in textbooks in simple settings.
- **BPD**: batch size per device. When we use distributed or parallel processing, especially data parallelism, this is the batch size that every device in our machine handles independently.
- **AS**: number of accummulation steps. This is the number of the steps that before any gradients update can happen. Because our device may not contains data of all samples in a batch size simultaneously, and we needs large batch size to reduce bias and stabilize training, therefore we can simulate a much larger batch size by preventing gradient updates right way but rather only update after a number of steps. This mechanism ensure our devices do not get burnt with too much data but also mimics the stability of large batch size settings.


### 4. `accelerator.wait_for_everyone()` — Process synchronization barrier

Blocks until all processes reach this point — critical to prevent race conditions during I/O, checkpointing, or evaluation. Synchronizes all processes (like a barrier). Use before main-process-only operations (e.g., saving checkpoints) to avoid races. Ensure to use this regularly to prevent races conditions or out of synchronization.

**Use Case 1 — Safe checkpoint saving**

```python
accelerator.wait_for_everyone()
if accelerator.is_main_process:
    accelerator.save_state("checkpoints/last")
accelerator.wait_for_everyone()
```

Ensures all processes have finished the current step before saving — prevents corrupted states.

**Use Case 2 — Synchronized evaluation across epochs**

```python
accelerator.wait_for_everyone()
if accelerator.is_main_process:
    evaluate_model(model, eval_loader)
accelerator.wait_for_everyone()
```

Guarantees all GPUs have the same model weights before evaluation begins.

### 5. `accelerator.unwrap_model(model)` — Access the original unwrapped model
 
Returns the base model (removing DDP/FSDP wrapper) — necessary when accessing attributes or saving in standard format.

**Use Case 1 — Getting model configuration or tokenizer compatibility**

```python
base_model = accelerator.unwrap_model(model)
print(base_model.config)
tokenizer = AutoTokenizer.from_pretrained(base_model.config.name_or_path)
```

DDP/FSDP-wrapped models don't expose `.config` directly — unwrapping solves this cleanly.

**Use Case 2 — Standard checkpoint saving for later single-GPU inference**

```python
if accelerator.is_main_process:
    torch.save(
        accelerator.unwrap_model(model).state_dict(),
        "model_final.pth"
    )
```

Creates a clean, non-distributed checkpoint that can be loaded anywhere without Accelerate.

### 6. `accelerator.is_main_process` — Process rank check

  
Boolean flag indicating whether current process is rank 0 — used to guard logging, saving, printing, and evaluation. We usually use this method to only allow main process to do these logging, saving, printing things rather than allow every procesess do them at the same time to prevent excessive logging or corrupted files.

**Use Case 1 — Clean logging without duplication**

```python
if accelerator.is_main_process:
    print(f"Epoch {epoch} - loss: {loss.item():.4f}")
    wandb.log({"train_loss": loss.item()})
```

Prevents every GPU from printing/logging the same information thousands of times.

**Use Case 2 — Progress bar visibility**

```python
pbar = tqdm(train_loader, disable=not accelerator.is_main_process)
```

Only rank 0 shows the progress bar — improves console readability in distributed runs.

### 7. `split_between_processes()` — Efficient data partitioning across processes
 
This context manager partitions a list or iterable across all active processes, ensuring each process receives a roughly equal share of the workload and each process handles a non-overlapping set of data to prevent duplicate processing. It is particularly useful for distributed inference, batch processing of large datasets, or parallel evaluation when you want to avoid manual index slicing.  
After processing, `state.gather()` (or `state.gather_for_metrics()`) collects results back to the main process.

**Important:**  
- Works with any iterable (lists, tuples, datasets…). Reference Accelerate documentation for more information.  
- Automatically applies padding if lengths are uneven (controlled by `apply_padding=True`). Some optimization techniques about batch processing tries to group nearly equal length samples together into a batch to prevent massive padding. More on that later...  
- Ideal when the same model runs independently on different data portions (data parallelism for inference/evaluation).

**Example Use Case — Distributed batch inference on large number of prompts**

```python
from accelerate import PartialState

state = PartialState()

model.eval()
model.to(state.device)

prompts = ["Generate a story about..."] * 512  # example large batch

with state.split_between_processes(prompts, apply_padding=True) as my_prompts:
    inputs = tokenizer(my_prompts, return_tensors="pt", padding=True).to(state.device)
    
    with torch.inference_mode(): # will compare with torch.no_grad() later
        outputs = model.generate(**inputs, max_new_tokens=120)
    
    generated = tokenizer.decode(outputs, skip_special_tokens=True) # use decode() instead of batch_decode() because of modern API and highly recommended

all_generated_texts = state.gather(generated)
```
Each GPU processes only ~1/N of the prompts (where N is the number of processes/GPUs). Results are gathered back to rank 0. This pattern scales throughput linearly with the number of GPUs and is widely used for offline batch generation, evaluation on large test sets, or production inference pipelines.

### 8. `accelerator.destroy_process_group()` — Release resources at the end

Manually destroys the current distributed process group (NCCL, Gloo, MPI…), releasing all associated communication handles and resources.

This is a method of `PartialState` and `AcceleratorState` not `Accelerator`. Called automatically in `accelerator.end_training()`. Although `accelerator.end_training()` also release resources but it will bring up some warnings if we use this method in inference phase because it also releases all gradients tracking but inference do not track gradients. To eliminate such annoying warnings, we should call `free_memory()` followed by `destroy_process_group()` in inference phase and only use `end_training()` in training phase.


**Important:**  
- After calling `destroy_process_group()`, any subsequent distributed operation (e.g., `prepare()`, collective communication) will trigger automatic re-initialization of a fresh process group.  
- Use with caution — incorrect usage can lead to hangs or resource leaks.  
- Best practice: Prefer `accelerator.end_training()` for normal training scripts.

**Example Use Case 1 — Multiple independent training stages in one script**

```python
accelerator = Accelerator()

# Stage 1: Pre-training with frozen layers (DDP)
freeze_backbone(model)
train_stage(model, optimizer1, pretrain_loader, accelerator, epochs=3)

# Explicit cleanup before changing strategy
accelerator.destroy_process_group()
accelerator.print("Pre-training stage completed — process group released")

# Stage 2: Full fine-tuning (possibly switching to FSDP)
unfreeze_backbone(model)
train_stage(model, optimizer2, finetune_loader, accelerator, epochs=5)

# Final clean shutdown
accelerator.end_training()
```

This pattern is useful in complex pipelines (e.g., pre-training → supervised fine-tuning → RLHF, or switching between DDP and FSDP). Explicit destruction prevents NCCL handle conflicts and ensures a clean state for the next phase.

**Example Use Case 2 — Debugging or testing multiple short distributed runs**

```python
for experiment_id in range(5):
    accelerator = Accelerator(mixed_precision="bf16")
    
    # Quick hyperparameter test
    model = create_model(hparams[experiment_id])
    model, optimizer, loader = accelerator.prepare(model, optimizer, loader)
    train_short(model, optimizer, loader, accelerator, steps=100)
    
    # Clean up before next experiment
    accelerator.destroy_process_group()
    accelerator.print(f"Experiment {experiment_id} finished")
```
When running many short, independent distributed experiments in a loop (e.g., hyperparameter sweeps, ablation studies), explicitly destroying the process group after each run prevents resource accumulation and potential NCCL/Gloo initialization conflicts.


These methods cover ~90% of day-to-day Accelerate usage patterns in real-world projects. Mastering them allows you to write clean, scalable code that remains nearly identical whether you are training on one GPU, eight GPUs, or across multiple nodes.


## Common Bugs

Distributed setups introduce subtle issues; here are frequent ones from community reports and docs:

| Bug Category      | Description                              | Fix Strategy                              |
|:------------------|:-----------------------------------------|:------------------------------------------|
| Hanging Processes | Tensor shape mismatches in gather/reduce | Use debug mode (`--debug` launch) to detect; pad tensors uniformly. |
| OOM Errors        | Memory exhaustion mid-training           | Employ `find_executable_batch_size()` for auto-reduction; clear memory with `accelerator.free_memory()`. |
| Logging Failures  | Unsynchronized or missing logs           | Switch to `accelerate.logging.get_logger()` with appropriate levels. |
| Non-Reproducible  | Varying results across configs           | Adjust per-device batch size; use process-offset seeds. |
| Gradient Accum.   | Scheduler not adjusting properly         | Manually call `scheduler.step()` only after full accumulation steps. |

On older Linux kernels (<5.5), processes may hang—upgrade your kernel.

<details markdown="1">
<summary>Click to expand: Detailed Fixes for Advanced Bugs</summary>

- **FP16 NaNs:** Enable gradient clipping: `accelerator.clip_grad_norm_(model.parameters(), 1.0)`. Highly recommended to use **BF16** instead for better support for numerical stability, industry standard between data types for the field.

- **Early Stopping Hang:** Use `accelerator.set_trigger()` and `check_trigger()` for sync.

- **Unexpected Keywords:** Check Accelerate version compatibility; remove deprecated args like `logging_dir`.

For more, see [Accelerate troubleshooting guide](https://huggingface.co/docs/accelerate/en/basic_tutorials/troubleshooting).

</details>

## Accelerate vs. PyTorch Lightning: Complementary or Competing?

PyTorch Lightning offers high-level abstractions for training, including automatic distributed handling via `Trainer(strategy="ddp", devices=4, num_nodes=2)`. It manages samplers, sync, and more, similar to Accelerate.

- **Similarities:** Both abstract DDP; Lightning adds logging, callbacks, and experiment management.

- **Differences:** Accelerate is lightweight, focused on distribution (4-line integration); Lightning is a full framework with `LightningModule` for structured code.

- **Integration:** They work together! Lightning can use Accelerate as backend (e.g., via plugins or custom strategies). For HF models, Accelerate suffices for distribution, but Lightning enhances with auto-logging and early stopping.

- **Choice:** Use Accelerate alone for simple scripts; add Lightning for complex workflows. Avoid both if overkill—start with Accelerate for portability.


For HF + Lightning integration, GitHub contains many project templates to work with them, so we can choose any among them to kickstart our projects.


## Conclusion

Hugging Face Accelerate democratizes distributed computing by abstracting complexities, preventing common pitfalls, and integrating with tools like PyTorch Lightning. From hiding DDP details to robust inference scaling, it empowers efficient, portable deep learning.

Embrace these patterns to elevate your projects—focus on innovation, not infrastructure.

**Abstract once, deploy everywhere, scale with ease.**