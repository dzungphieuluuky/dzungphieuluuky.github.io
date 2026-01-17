---
layout: post
title: Distributed Training and Inference with Hugging Face Accelerate
subtitle: Learn to write industry-standard distributed code
date: 2026-01-17
author: dzungphieuluuky
tags: [deep-learning, huggingface, accelerate, distributed, mlops]
cover-img:
thumbnail-img:
share-img:
comments: true
---


# Write Once, Run Anywhere: The Accelerate Philosophy

*"But it works on my machine" is a traditional yet ever-lasting problem in software engineering, yet now it reappears in deep learning and machine learning projects. For research scientists and undergraduate students (such as me) with low computational resources, we usually need to change our running platforms continually from Google Colab to Kaggle and vice versa, or another if on-premises GPUs are available. With models growing exponentially and hardware configurations varying wildly, we need a solution that abstracts away distribution complexity. **Hugging Face Accelerate** is definitely our lifeboat.*

For the few past projects I have done, I've developed several deep learning systems that must be designed to run anywhere I want, oscillating between two main GPU resources: Google Colab and Kaggle (both are in possession of Google, yeah what a surprise). **Accelerate** helps me carry my code seamlessly between platforms and effectively harness the full potential on each one—it would be a pain to the eyes if Kaggle offers 2 GPUs but the code is currently only using one of them.

This blog post isn't about basic usage—it's about **production patterns** that prevent deadlocks, optimize performance, and some good tips I find useful when working with **Accelerate** that might provide guidance for my future self.

## My Journey: From Colab Noob to Accelerate Enthusiast

As a third-year computer science student doing deep learning projects, here's my typical workflow:
1. **Prototype on Colab** (free T4, 15GB RAM, sometimes gets disconnected)
2. **Scale on Kaggle** (P100/T4 x2, 30 hours/week limit)
3. **Sometimes run on my laptop's CPU** (unit testing for some module before migrating them to online platforms)

Each platform has different quirks:
- **Colab**: Single GPU, sometimes offers V100/A100 if you're lucky
- **Kaggle**: Usually 2xP100 or 2xT4, excellent for parallel processing
- **My laptop**: CPU-only with 16 cores (yeah I use ThinkPad) which is 4 times Kaggle and 8 times Colab, perfect for debugging

Without Accelerate, I was writing this monstrosity:

```python
# The Dark Ages: Platform-specific code everywhere
import torch
import os

# Platform detection spaghetti
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
        # Hope I did this right...
elif torch.cuda.is_available():
    # Maybe university cluster?
    device = torch.device("cuda")
    num_gpus = torch.cuda.device_count()
    # Need to handle DDP? MPI? Who knows!
else:
    device = torch.device("cpu")
    num_gpus = 0

model = model.to(device)
# Don't forget mixed precision!
# And gradient accumulation!
# And distributed samplers!
# And... (you get the point)
```

This code was:
1. **Brittle**: Broke when moving between platforms
2. **Hard to debug**: "Why is my GPU utilization 30% on Kaggle?"
3. **Non-reproducible**: Different behavior on different hardware
4. **Embarrassing**: Not something I'd show in a portfolio, especially for someone continuously chasing fancy stuffs like me

## Accelerate: The Lifeboat

Then I discovered Hugging Face Accelerate. The change was revolutionary:

```python
# The Enlightenment: One line to rule them all
from accelerate import Accelerator

# That's literally it
accelerator = Accelerator()
model, optimizer, dataloader = accelerator.prepare(model, optimizer, dataloader)
```

Suddenly my code:
- **Worked everywhere**: Colab, Kaggle, my laptop and maybe other GPUs platforms.
- **Used all available GPUs**: Kaggle's 2 GPUs? Both utilized!
- **Handled edge cases**: Mixed precision, gradient accumulation, checkpointing
- **Looked professional**: Clean, maintainable, industry-standard

## Understanding Accelerate

### Grasp the basic understanding for Accelerate

Think of Accelerate as a **universal translator** for your code:
- **Single GPU Colab** → Your code runs normally
- **Dual GPU Kaggle** → Your code automatically splits work
- **8-GPU cluster** → Your code distributes across all of them
- **CPU laptop** → Your code still works (slower, but works)

Each running instance is called a **process**:
- **Process 0**: The main process, saving checkpoints and logging results (we don't want all processes spam their own results simultaneously at our eyes)
- **Process 1, 2, 3...**: Worker processes, just compute

The magic happens in `accelerator.prepare()`:
- It wraps your model for multi-GPU if needed
- It sets up distributed data sampling
- It handles device placement automatically
- It even does mixed precision for you!
 Note: Mixed precision usually talks about floating point 32 bit, floating point 16 bit and brain floating point 16 bit. Maybe I will have another blog on that topic later...

### When accelerators are out of sync

**All processes must execute the same code path.** This caused my first deadlock:

```python
# ❌ My first deadlock (2 hours of debugging)
if accelerator.is_main_process:
    data = load_dataset()  # Only main process loads
    # Process 1 is waiting... forever
process_data(data)  # Process 1: "What data??"

# ✅ The correct way
# Option A: All load (simple but inefficient)
data = load_dataset()

# Option B: Main loads, then broadcasts (efficient)
if accelerator.is_main_process:
    all_data = load_dataset()
else:
    all_data = None
all_data = accelerator.broadcast(all_data, from_process=0)
```

## Training Template

After several projects, this is my go-to template that works everywhere:

```python
def train_student_edition():
    """
    My battle-tested training template that works on:
    - Colab (free tier)
    - Kaggle (2 GPUs)
    - University cluster
    - My sad laptop CPU
    """
    # 1. Initialize Accelerate FIRST
    # This detects hardware and sets everything up
    accelerator = Accelerator(
        mixed_precision="fp16",  # Free speed boost!
        gradient_accumulation_steps=2,  # For larger "virtual" batch sizes
        log_with="wandb" if use_wandb else None,
        project_dir="./logs",
    )
    
    # 2. Set random seeds (AFTER Accelerate!)
    # Crucial for reproducibility between runs
    set_seed(42 + accelerator.process_index)  # Different seed per process
    
    # 3. Create model and data
    # Same as single-GPU code!
    model = CoolModel()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    train_loader = get_data_loader(batch_size=16)
    
    # 4. The magic line ✨
    model, optimizer, train_loader = accelerator.prepare(
        model, optimizer, train_loader
    )
    
    # 5. Training loop (looks exactly like single-GPU!)
    for epoch in range(num_epochs):
        model.train()
        
        # Progress bar only on main process (cleaner output)
        if accelerator.is_main_process:
            pbar = tqdm(train_loader, desc=f"Epoch {epoch}")
        else:
            pbar = train_loader
            
        for batch in pbar:
            # Automatic gradient accumulation
            with accelerator.accumulate(model):
                loss = model(batch)
                accelerator.backward(loss)
                optimizer.step()
                optimizer.zero_grad()
                
                # Update progress bar on main process
                if accelerator.is_main_process:
                    pbar.set_postfix({"loss": loss.item()})
        
        # 6. Save checkpoint (only main process)
        accelerator.wait_for_everyone()  # Sync before saving
        if accelerator.is_main_process:
            # Save to Google Drive on Colab, local on others
            save_path = "/content/drive/MyDrive/checkpoints" if on_colab else "./checkpoints"
            accelerator.save_state(save_path)
            print(f"✅ Checkpoint saved to {save_path}")
        
        accelerator.wait_for_everyone()  # Wait for save to complete
    
    # 7. Clean exit
    accelerator.end_training()
    
    # Return final model (unwrapped for single-GPU use)
    return accelerator.unwrap_model(model)
```

## Useful Patterns

### Pattern 1: Platform-Aware Setup

```python
def setup_for_platform():
    """Detect platform and configure accordingly."""
    import os
    
    # Detect platform
    if 'COLAB_GPU' in os.environ:
        platform = "colab"
        print("🎮 Running on Google Colab")
        # Mount Google Drive for checkpoints
        from google.colab import drive
        drive.mount('/content/drive')
        
    elif 'KAGGLE_KERNEL_RUN_TYPE' in os.environ:
        platform = "kaggle"
        print("🏆 Running on Kaggle")
        # Kaggle has /kaggle/working directory
        
    elif torch.cuda.device_count() > 1:
        platform = "multi_gpu"
        print(f"🚀 Running on {torch.cuda.device_count()} GPUs")
        
    else:
        platform = "single_gpu_or_cpu"
        print("💻 Running on single device")
    
    # Configure Accelerate based on platform
    if platform == "kaggle" and torch.cuda.device_count() == 2:
        # Kaggle often gives 2 GPUs - use them!
        accelerator = Accelerator(
            mixed_precision="fp16",
            num_processes=2,  # Use both GPUs!
        )
    else:
        # Default configuration
        accelerator = Accelerator(mixed_precision="fp16")
    
    return accelerator, platform
```

### Pattern 2: Checkpoint system

```python
def student_checkpoint_system(accelerator, model, platform):
    """
    Save checkpoints that work with:
    - Google Drive (Colab)
    - Kaggle output directory
    - Local filesystem
    - Limited storage space
    """
    accelerator.wait_for_everyone()  # Crucial!
    
    if accelerator.is_main_process:
        # Determine where to save based on platform
        if platform == "colab":
            save_dir = "/content/drive/MyDrive/colab_checkpoints"
            # Google Drive has space limits - clean old checkpoints
            cleanup_old_checkpoints(save_dir, keep_last=3)
        elif platform == "kaggle":
            save_dir = "/kaggle/working/checkpoints"
            # Kaggle deletes after session - save to dataset too?
        else:
            save_dir = "./checkpoints"
        
        os.makedirs(save_dir, exist_ok=True)
        
        # Save only what's necessary (storage is limited!)
        checkpoint = {
            "model": accelerator.unwrap_model(model).state_dict(),
            "epoch": current_epoch,
            "loss": best_loss,
            "platform": platform,  # Remember where this was trained
        }
        
        # Save with platform in filename
        filename = f"checkpoint_epoch{current_epoch}_{platform}.pt"
        torch.save(checkpoint, os.path.join(save_dir, filename))
        
        print(f"💾 Saved checkpoint to {filename}")
        print(f"   Platform: {platform}, Epoch: {current_epoch}")
    
    accelerator.wait_for_everyone()
```

### Pattern 3: Logging everything for sanity check

```python
def debug_like_a_student(accelerator):
    """
    When things go wrong (they will), print everything!
    """
    print("\n" + "="*50)
    print("DEBUG INFO - Process", accelerator.process_index)
    print("="*50)
    
    print(f"📊 Process Info:")
    print(f"   Index: {accelerator.process_index}/{accelerator.num_processes}")
    print(f"   Main process: {accelerator.is_main_process}")
    print(f"   Device: {accelerator.device}")
    
    if accelerator.device.type == "cuda":
        print(f"\n🎮 GPU Info:")
        print(f"   GPU {accelerator.device.index}: {torch.cuda.get_device_name()}")
        print(f"   Memory: {torch.cuda.memory_allocated()/1e9:.2f}GB used")
        print(f"   Utilization: {torch.cuda.utilization()}%")
    
    print(f"\n🔧 Accelerate Configuration:")
    print(f"   Mixed precision: {accelerator.mixed_precision}")
    print(f"   Distributed type: {accelerator.distributed_type}")
    
    # Check for common student mistakes
    if accelerator.num_processes > 1:
        print(f"\n⚠️  Multi-GPU Warnings:")
        if not hasattr(model, 'gradient_checkpointing'):
            print("   Consider enabling gradient_checkpointing for memory savings")
        
    print("="*50 + "\n")
    
    # Sync before continuing
    accelerator.wait_for_everyone()
```

## Kaggle Notebook setup with Accelerate

When I'm competing on Kaggle (usually for the GPU time, not the glory), here's my setup:

```bash
# kaggle_accelerate.sh - My competition script
#!/bin/bash

echo "🚀 Starting Kaggle Competition Setup"

# 1. Install dependencies (Kaggle has most, but not all)
pip install accelerate wandb -q

# 2. Configure Accelerate for Kaggle's 2 GPUs
accelerate config --num_processes=2 --mixed_precision=fp16

# 3. Launch training
echo "Starting training on ${CUDA_VISIBLE_DEVICES} GPUs"
accelerate launch train.py \
    --batch_size 32 \
    --learning_rate 1e-4 \
    --num_epochs 50 \
    --use_wandb \

# 4. Save final model to Kaggle dataset
echo "Saving final model..."
python save_final_model.py --output /kaggle/working/final_model

echo "✅ Done! Check /kaggle/working for outputs"
```

```python
# train.py - My competition training script
import argparse
from accelerate import Accelerator
import torch

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--learning_rate", type=float, default=1e-4)
    parser.add_argument("--use_wandb", action="store_true")
    parser.add_argument("--competition_name", type=str, default="")
    args = parser.parse_args()
    
    # Initialize with competition-specific settings
    accelerator = Accelerator(
        mixed_precision="fp16",
        log_with="wandb" if args.use_wandb else None,
    )
    
    if accelerator.is_main_process:
        print(f"🏆 Starting {args.competition_name} training")
        print(f"   Batch size: {args.batch_size}")
        print(f"   Learning rate: {args.learning_rate}")
        print(f"   Using {accelerator.num_processes} GPUs")
    
    # ... training logic here ...
    
    if accelerator.is_main_process:
        print(f"✅ {args.competition_name} training complete!")

if __name__ == "__main__":
    main()
```

## Common Student Pitfalls and How I Fixed Them

### Pitfall 1: "Why is only one GPU being used on Kaggle?"

**The Problem**: Kaggle gives 2 GPUs, but `nvidia-smi` shows only GPU 0 at 100%.

**The Solution**: I wasn't using `accelerator.prepare()` on my dataloader!

```python
# ❌ Wrong: Only model is prepared
model, optimizer = accelerator.prepare(model, optimizer)
# Dataloader still single-process!

# ✅ Correct: Prepare everything
model, optimizer, train_loader = accelerator.prepare(
    model, optimizer, train_loader
)
# Now DistributedSampler is used!
```

We should use ```prepare()``` method for all of our model, optimizers, data loaders for both training and validation so that Accelerate can carry them all and utilize the most potential from the platforms.
### Pitfall 2: "My Colab session crashed and I lost everything!"

**The Problem**: Colab disconnects, Kaggle sessions expire, university clusters have time limits.

**The Solution**: Frequent checkpointing + cloud saving.

```python
def save_checkpoint_often(accelerator, model, epoch, platform):
    """Save checkpoints frequently because sessions can end."""
    if epoch % 5 == 0:  # Every 5 epochs
        accelerator.wait_for_everyone()
        
        if accelerator.is_main_process:
            # Save locally
            torch.save(model.state_dict(), f"checkpoint_epoch_{epoch}.pt")
            
            # Also save to cloud if possible
            if platform == "colab":
                # Copy to Google Drive
                shutil.copy(f"checkpoint_epoch_{epoch}.pt", 
                           f"/content/drive/MyDrive/checkpoint_epoch_{epoch}.pt")
            elif platform == "kaggle":
                # Kaggle saves to /kaggle/working automatically
                pass
            
            print(f"📁 Checkpoint saved at epoch {epoch}")
        
        accelerator.wait_for_everyone()
```

### Pitfall 3: "Different results on Colab vs Kaggle"

**The Problem**: Same code, different random seeds.

**The Solution**: Set seeds properly and log them.

```python
def set_seeds_properly(seed=42):
    """Set all random seeds for reproducibility."""
    import random
    import numpy as np
    import torch
    
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    
    # For Accelerate, we need different seeds per process
    from accelerate.utils import set_seed
    set_seed(seed + accelerator.process_index)  # Different per process!
    
    print(f"🌱 Seeds set: base={seed}, process_offset={accelerator.process_index}")
```

Sidewalk note: Setting manually for all kinds of seeds sometimes feel boring and there are potential some seeds that are not set yet, of course we can't be sure whether we have set all running seeds already. For this problem, I recommend we should integrate PyTorch Lightning with our current project from the start because they have a method called ```seed_everything()``` that actually performs manual seeding on every seeds available including:
- NumPy seeds.
- Built-in `random` library seeds.
- Torch manual and distributed seeds.

## My Accelerate Cheat Sheet

<pre><code class="text">
ESSENTIALS:
1. Initialize FIRST: accelerator = Accelerator()
2. Prepare everything: model, optimizer, loader = accelerator.prepare(...)
3. Use accelerator.backward(loss) not loss.backward()
4. Only main process does I/O: if accelerator.is_main_process:
5. Sync often: accelerator.wait_for_everyone()

COMMON MISTAKES:
- Forgetting to prepare dataloader → Single GPU usage
- Setting seeds before Accelerate → Different randomness per GPU
- Multiple processes writing to same file → Corruption
- Not unwrapping model before saving → Can't load on single GPU

DEBUGGING:
1. accelerator.print() instead of print()
2. Check nvidia-smi on all GPUs
3. Use Accelerate(cpu=True) for quick tests
4. Add timeouts to catch deadlocks

PLATFORM TIPS:
- Colab: Mount Drive for checkpoints
- Kaggle: Use both GPUs! (num_processes=2)
- University: Ask for help with SLURM
- Laptop: Accelerate(cpu=True) works!

COMMANDS:
- accelerate config    # Setup
- accelerate test      # Test config
- accelerate launch    # Run training
```

## What I Wish I Knew Earlier

1. **Start with Accelerate from day one**: Refactoring later is painful
2. **Test on CPU first**: `Accelerator(cpu=True)` saves so much time
3. **Version your checkpoints**: Include platform, date, and hyperparameters
4. **Log everything**: When something breaks at 3 AM, you'll need logs
5. **It's okay to ask for help**: The Hugging Face community is amazing, confidently we can find somewhere useful on the forum, which is maybe a suitable libraries setup that no longer introduce version conflict...

## Resources



## My Project Structure with Accelerate

Here's how I organize my projects now:

<pre><code class="text">
project/
├── train.py                 # Main training (uses Accelerate)
├── configs/
│   ├── colab.yaml          # Colab-specific config
│   ├── kaggle.yaml         # Kaggle-specific config
│   └── local.yaml          # Local machine config
├── src/
│   ├── models/             # Model definitions
│   ├── data/               # Data loading
│   └── utils/              # Utilities (including Accelerate helpers)
├── scripts/
│   ├── run_colab.sh        # Colab setup and run
│   ├── run_kaggle.sh       # Kaggle submission script
│   └── run_local.sh        # Local testing
└── README.md               # With Accelerate setup instructions
```

## Final talks

Learning Accelerate transformed my projects from "it runs on my Colab" to "it runs anywhere". There is something noteworthy that may be helpful:

1. **Writing portable code** that works on any hardware from the start of the project, there is nearly zero chance that we will grasp the fruits easily in only one environment. Portability is key.
2. **Debugging distributed systems**: if using Accelerate for distributed setup, carefully watch the `wait_for_everyone()` positions and `destroy_process_group()` existence.
3. **Optimizing resource usage**: harness the best resources from any multi-GPU environments and ready to switch between them.
4. **Building reproducible experiments**: might needs to integrate with **Weights and Biases** or another experiment tracking tool.

As a student, you might think distributed training is only for big companies with GPU clusters. But with tools like Accelerate, these techniques are accessible to everyone. The code you write for your class projects can be the same quality as production code at top AI labs.

The best part? When you show potential employers your GitHub with Accelerate-powered projects, they see someone who understands modern ML infrastructure, not just model architectures.

### My personal advice:
1. **Use Accelerate in your next project**, no matter how small
2. **Document your setup** for each platform (Colab, Kaggle, etc.)
3. **Share what you learn** - write blog posts, make tutorials
4. **Contribute back** - report bugs, suggest features, help others

The gap between academic projects and industry practice is smaller than you think. Tools like Accelerate are bridges, and as students, we should be the first to cross them.

---

**Keep learning, keep building, and may your gradients always converge!** 🚀