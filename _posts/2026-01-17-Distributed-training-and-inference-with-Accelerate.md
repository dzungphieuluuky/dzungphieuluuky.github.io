---
layout: post
title: Distributed Training and Inference with Hugging Face Accelerate
subtitle: Learn to write distributed code from your backyard
tags: [deep-learning, accelerate, distributed-computing, mlops, student-projects]
comments: true
author: dzungphieuluuky
---

{: .box-success}
This post shares my journey learning distributed training with Hugging Face Accelerate. I encourage you to [learn markdown basics](https://markdowntutorial.com/) to create technical content like this. Check out the [Beautiful Jekyll documentation](https://beautifuljekyll.com/) for formatting tips and the [Accelerate docs](https://huggingface.co/docs/accelerate) for implementation details.

**"But it works on my machine" is the battle cry of broken distributed systems.** As a student constantly switching between Google Colab, Kaggle, and my laptop, I needed code that worked everywhere—not just where I first wrote it. With models growing larger and hardware configurations varying wildly, we need solutions that abstract complexity without sacrificing control.

## The Platform-Hopping Reality

My typical development workflow involves constant platform switching:

| Platform | GPU Configuration | Key Limitations |
| :--- | :--- | :--- |
| **Google Colab** | Single T4/V100 | Session timeouts, 15GB RAM limit |
| **Kaggle** | 2×P100 or 2×T4 | 30 hours/week, temporary storage |
| **Local Laptop** | CPU only (ThinkPad) | No GPU acceleration, stable environment |

Without Accelerate, I was writing platform-specific spaghetti code:

```python
# Platform detection nightmare
import torch
import os

if 'COLAB_GPU' in os.environ:
    print("Running on Colab")
    device = torch.device("cuda:0")
    num_gpus = 1
elif 'KAGGLE_KERNEL_RUN_TYPE' in os.environ:
    print("Running on Kaggle")
    device = torch.device("cuda:0")
    num_gpus = torch.cuda.device_count()
    if num_gpus > 1:
        model = torch.nn.DataParallel(model)
elif torch.cuda.is_available():
    device = torch.device("cuda")
    num_gpus = torch.cuda.device_count()
else:
    device = torch.device("cpu")
    num_gpus = 0

model = model.to(device)
```

{: .box-warning}
**Why this fails:**
- Code breaks when moving between platforms
- Debugging becomes environment-specific
- Multi-GPU utilization is inconsistent
- Maintenance becomes unsustainable

## Accelerate: The Single-Line Revolution

Hugging Face Accelerate transforms this complexity into simplicity:

```python
from accelerate import Accelerator

# That's it—one line changes everything
accelerator = Accelerator()
model, optimizer, dataloader = accelerator.prepare(
    model, optimizer, dataloader
)
```

This single call handles:
- Device placement (GPU/CPU/MPS)
- Multi-GPU distribution when available
- Mixed precision optimization
- Distributed data sampling
- Gradient accumulation

## Understanding the Accelerate Mental Model

Think of Accelerate as a **universal adapter** for your PyTorch code:

```python
# Before: Platform-specific complexity
# After: Write once, run anywhere

# Key concept: Processes, not devices
# Each GPU = One process
# All processes execute identical code
# Only main process (process 0) handles I/O
```

### The Golden Rule: Symmetric Execution

My first distributed deadlock taught me this lesson:

```python
# ❌ Deadlock: Different code paths
if accelerator.is_main_process:
    data = load_dataset()  # Only main loads
    # Other processes wait forever
process_data(data)  # Other processes crash

# ✅ Solution: Broadcast pattern
if accelerator.is_main_process:
    all_data = load_dataset()
else:
    all_data = None

all_data = accelerator.broadcast(all_data, from_process=0)
```

{: .box-error}
**Critical Rule:** All processes must follow the same execution path. Conditional effects are fine; conditional paths cause deadlocks.

## Complete Training Template

After several projects, this template emerged as my go-to solution:

```python
from accelerate import Accelerator
import torch
from tqdm import tqdm

def train_portably():
    """
    Works on: Colab, Kaggle, local CPU, multi-GPU clusters
    """
    # 1. Initialize Accelerate FIRST
    accelerator = Accelerator(
        mixed_precision="fp16",  # 2x speed boost
        gradient_accumulation_steps=2,  # Larger effective batches
        log_with="wandb",  # Optional: experiment tracking
        project_dir="./logs",
    )
    
    # 2. Set seeds AFTER Accelerate
    set_seed(42 + accelerator.process_index)
    
    # 3. Create components
    model = MyModel()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    train_loader = get_dataloader(batch_size=16)
    
    # 4. Prepare everything
    model, optimizer, train_loader = accelerator.prepare(
        model, optimizer, train_loader
    )
    
    # 5. Training loop (identical to single-GPU!)
    for epoch in range(num_epochs):
        model.train()
        
        # Progress bar only on main process
        if accelerator.is_main_process:
            pbar = tqdm(train_loader, desc=f"Epoch {epoch}")
        else:
            pbar = train_loader
            
        for batch in pbar:
            with accelerator.accumulate(model):
                loss = model(batch)
                accelerator.backward(loss)
                optimizer.step()
                optimizer.zero_grad()
                
                if accelerator.is_main_process:
                    pbar.set_postfix({"loss": loss.item()})
        
        # 6. Safe checkpointing
        accelerator.wait_for_everyone()
        if accelerator.is_main_process:
            accelerator.save_state("./checkpoints")
        
        accelerator.wait_for_everyone()
    
    return accelerator.unwrap_model(model)
```

## Essential Patterns for Students

### Pattern 1: Platform-Aware Setup

```python
def setup_for_platform():
    """Detect and configure for current platform."""
    import os
    
    if 'COLAB_GPU' in os.environ:
        platform = "colab"
        print("🎮 Running on Google Colab")
        from google.colab import drive
        drive.mount('/content/drive')
        
    elif 'KAGGLE_KERNEL_RUN_TYPE' in os.environ:
        platform = "kaggle"
        print("🏆 Running on Kaggle")
        # Kaggle-specific setup
        
    elif torch.cuda.device_count() > 1:
        platform = "multi_gpu"
        print(f"🚀 Using {torch.cuda.device_count()} GPUs")
        
    else:
        platform = "local"
        print("💻 Running locally")
    
    # Platform-optimized configuration
    if platform == "kaggle":
        return Accelerator(mixed_precision="fp16", num_processes=2)
    else:
        return Accelerator(mixed_precision="fp16")
```

### Pattern 2: Student-Friendly Checkpointing

```python
def save_checkpoint_student(accelerator, model, platform):
    """Save checkpoints with platform awareness."""
    accelerator.wait_for_everyone()
    
    if accelerator.is_main_process:
        # Platform-specific save locations
        save_dirs = {
            "colab": "/content/drive/MyDrive/checkpoints",
            "kaggle": "/kaggle/working/checkpoints",
            "local": "./checkpoints"
        }
        
        save_dir = save_dirs.get(platform, "./checkpoints")
        os.makedirs(save_dir, exist_ok=True)
        
        # Save only essentials
        checkpoint = {
            "model": accelerator.unwrap_model(model).state_dict(),
            "epoch": current_epoch,
            "loss": best_loss,
            "platform": platform,
        }
        
        # Atomic write
        torch.save(checkpoint, f"{save_dir}/checkpoint_{current_epoch}.tmp")
        os.replace(f"{save_dir}/checkpoint_{current_epoch}.tmp", 
                   f"{save_dir}/checkpoint_{current_epoch}.pt")
    
    accelerator.wait_for_everyone()
```

### Pattern 3: Debugging Distributed Systems

```python
def debug_distributed(accelerator):
    """Print essential debugging information."""
    print(f"\nProcess {accelerator.process_index}/{accelerator.num_processes}")
    print(f"Device: {accelerator.device}")
    print(f"Main process: {accelerator.is_main_process}")
    
    if accelerator.device.type == "cuda":
        print(f"GPU Memory: {torch.cuda.memory_allocated()/1e9:.2f}GB")
        print(f"GPU Utilization: {torch.cuda.utilization()}%")
    
    print(f"Mixed Precision: {accelerator.mixed_precision}")
```

## Common Student Pitfalls

### Pitfall 1: Underutilized GPUs

```python
# ❌ Wrong: Forgetting to prepare dataloader
model, optimizer = accelerator.prepare(model, optimizer)
# Dataloader uses single process

# ✅ Correct: Prepare all components
model, optimizer, train_loader = accelerator.prepare(
    model, optimizer, train_loader
)
# DistributedSampler activated
```

{: .box-note}
**Remember:** Prepare ALL components—models, optimizers, AND dataloaders—for proper distribution.

### Pitfall 2: Non-Reproducible Results

```python
def set_seeds_properly(seed=42):
    """Set seeds for reproducibility across processes."""
    import random
    import numpy as np
    import torch
    
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    
    # Different seed per process
    from accelerate.utils import set_seed
    set_seed(seed + accelerator.process_index)
```

### Pitfall 3: Lost Work on Platform Crashes

```python
def save_frequently(accelerator, model, epoch):
    """Save checkpoints often—sessions WILL end."""
    if epoch % 5 == 0:  # Every 5 epochs
        accelerator.wait_for_everyone()
        if accelerator.is_main_process:
            torch.save(model.state_dict(), f"checkpoint_epoch_{epoch}.pt")
        accelerator.wait_for_everyone()
```

## Kaggle Competition Setup

When competing on Kaggle, this setup maximizes GPU utilization:

```bash
#!/bin/bash
# kaggle_setup.sh
pip install accelerate wandb -q
accelerate config --num_processes=2 --mixed_precision=fp16
accelerate launch train.py --batch_size 32 --learning_rate 1e-4
```

```python
# train.py - Competition training script
import argparse
from accelerate import Accelerator

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--learning_rate", type=float, default=1e-4)
    args = parser.parse_args()
    
    accelerator = Accelerator(mixed_precision="fp16")
    
    if accelerator.is_main_process:
        print(f"Using {accelerator.num_processes} GPUs")
        print(f"Batch size: {args.batch_size}")
    
    # Training logic here
    
if __name__ == "__main__":
    main()
```

## Performance Comparison

When distributing across \\(N\\) GPUs, Accelerate provides near-linear scaling:

\\[
\text{Efficiency} = \frac{T_1}{N \times T_N} \approx 0.85 \text{ to } 0.95
\\]

where \\(T_1\\) is single-GPU time and \\(T_N\\) is multi-GPU time.

| Platform | Without Accelerate | With Accelerate | Improvement |
| :--- | :--- | :--- | :--- |
| **Kaggle (2 GPUs)** | Single GPU usage | Both GPUs utilized | 1.8× speedup |
| **Code Portability** | Platform-specific | Universal | 100% portable |
| **Debugging** | Complex, scattered | Unified, simple | 3× faster debugging |

## Project Structure for Portability

```
project/
├── train.py              # Main training script
├── configs/
│   ├── colab.yaml       # Colab-specific settings
│   ├── kaggle.yaml      # Kaggle-specific settings
│   └── local.yaml       # Local development settings
├── src/
│   ├── models/          # Model definitions
│   ├── data/            # Data loading pipelines
│   └── utils/           # Accelerate helpers
├── scripts/
│   ├── run_colab.sh     # Colab execution script
│   ├── run_kaggle.sh    # Kaggle execution script
│   └── run_local.sh     # Local testing script
└── README.md            # Setup instructions
```

## Best Practices Checklist

<details markdown="1">
<summary>Click for essential Accelerate practices!</summary>

### Must-Do Practices
1. **Initialize Accelerate first** before any model setup
2. **Prepare all components** (model, optimizer, ALL dataloaders)
3. **Use accelerator.backward()** not loss.backward()
4. **Only main process does I/O** (saving, logging, printing)
5. **Sync with wait_for_everyone()** before shared operations
6. **Set seeds after Accelerate** with process offset
7. **Test with CPU first** using Accelerator(cpu=True)
8. **Version checkpoints** with platform metadata
9. **Enable gradient accumulation** for memory efficiency
10. **Use mixed precision** for performance boost

### Platform-Specific Tips
- **Colab**: Mount Google Drive for persistent storage
- **Kaggle**: Set num_processes=2 to use both GPUs
- **Local**: Use Accelerator(cpu=True) for debugging
- **Clusters**: Configure with accelerate config
</details>

## What I Wish I Knew Earlier

{: .box-success}
**Lessons learned through painful experience:**

1. **Start with Accelerate immediately**—refactoring later is difficult
2. **Test extensively with CPU first**—saves hours of GPU debugging
3. **Version everything**—platform, library versions, random seeds
4. **Log aggressively**—when things fail at 3 AM, logs are your lifeline
5. **Ask for help early**—the Hugging Face community is incredibly supportive

## Resources for Further Learning

| Resource | Purpose | Link |
| :--- | :--- | :--- |
| **Accelerate Documentation** | Official implementation guide | [huggingface.co/docs/accelerate](https://huggingface.co/docs/accelerate) |
| **Beautiful Jekyll Guide** | Blog formatting and styling | [beautifuljekyll.com](https://beautifuljekyll.com/) |
| **PyTorch Distributed** | Underlying concepts | [pytorch.org/tutorials](https://pytorch.org/tutorials/) |
| **Weights & Biases** | Experiment tracking | [wandb.ai](https://wandb.ai/) |
| **Kaggle Accelerate Examples** | Real competition code | [kaggle.com/code](https://www.kaggle.com/code) |

## Final Thoughts

Accelerate transformed my projects from "it runs on my Colab" to "it runs anywhere." As students, we often think distributed training is reserved for large labs with GPU clusters. Tools like Accelerate make these advanced techniques accessible, allowing us to build industry-quality systems on student hardware.

The gap between academic projects and industry practice is smaller than you think. Accelerate is one of those bridges—and as students, we should be the first to cross them.

**Write once. Run anywhere. Build with confidence.**

---

{: .box-note}
**Share your experience!** Have you used Accelerate in your projects? What challenges did you face? Leave a comment below or reach out on [GitHub](https://github.com/)—I'd love to hear your stories and learn from your experiences.

*Keep learning, keep building, and may your gradients always converge!* 🚀