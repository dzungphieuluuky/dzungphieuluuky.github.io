---
layout: post
title: "FontDiffusion: Generating Sino-Nom Fonts with Diffusion Models"
subtitle: A STAR+R project story — from dataset pipeline to multi-GPU inference
tags: [project-story, diffusion, sino-nom, deep-learning, font-generation]
author: dzungphieuluuky
mathjax: true
---

| Field | Detail |
|:------|:-------|
| **Project** | FontDiffusion — Sino-Nom font generation via diffusion models |
| **Stack** | PyTorch, Hugging Face Diffusers, Accelerate, WandB |
| **Data format** | Parquet (Apache Arrow) on HF Hub |
| **Training status** | Phase 1 complete (loss plateaued), Phase 2 FSTDiff integration in debug |
| **Inference speed** | ~1.7 s/sample on 2× GPU (Kaggle) |

---

## S — Situation

[fill in: Describe the problem space — why Sino-Nom font generation matters to you personally. What gap in existing work or personal motivation led to this project?]

> *The Chữ Nôm script — a logographic writing system used in Vietnam for centuries — has thousands of character forms scattered across historical manuscripts, but no modern generative pipeline to synthesize new glyph variants at scale. Existing font generation work (e.g., FontDiffuser, FSTDiff) targets Latin or CJK scripts; Sino-Nom is underrepresented. The goal was to build an end-to-end system that takes a content character image plus a handful of style reference images and produces a stylised Nôm glyph through a conditional diffusion process.*

---

## T — Task

[fill in: What were your concrete goals? What did "done" look like?]

> *Three objectives:*
>
> 1. *Reproduce and adapt the FontDiffusion architecture for Sino-Nom characters using Hugging Face Diffusers + Accelerate for multi-GPU training and inference.*
> 2. *Build a dataset pipeline that generates ~10k content-style pairs, stores them as Parquet on HF Hub, and supports checkpoint-resumable batch generation.*
> 3. *Establish quality metrics (LPIPS, SSIM, FID) and contrastive-learning setup (16 negative style images) to evaluate and improve generated glyphs.*

---

## A — Action

### Dataset pipeline

The generation pipeline uses content character images (Chữ Nôm Tự Tạo dataset, ~10k characters) paired with style reference images. Each batch is generated via Accelerate for multi-GPU inference:

```bash
accelerate launch FontDiffusion/sample_batch_multi_gpus.py \
    --characters "NomTuTao/Ds_10k_ChuNom_TuTao.txt" \
    --style_images "FontDiffusion/styles_images" \
    --ckpt_dir "ckpt/" \
    --ttf_path "FontDiffusion/fonts/NomNaTong-Regular.otf" \
    --output_dir "my_dataset/train_original" \
    --num_inference_steps 20 \
    --guidance_scale 7.5 \
    --batch_size 35 \
    --enable_xformers
```

[fill in: Describe your specific experience running this pipeline — any bottlenecks, hacks, or discoveries during data generation.]

> *The pipeline uses `results_checkpoint.json` to track which characters have been generated, so interrupted runs can resume without duplicating work. Upload and download to HF Hub uses Parquet (Apache Arrow), which outperformed raw image folders by a wide margin — a single `push_to_hub()` call handles thousands of images without per-file I/O.*

### Training

Phase 1 training uses perceptual loss (coefficient 0.07), offset loss (coefficient 0.6), and standard diffusion loss, logged to WandB:

```bash
accelerate launch FontDiffusion/my_train.py \
    --experience_name="FontDiffuser_training_phase_1" \
    --data_root="my_dataset" \
    --output_dir="outputs/FontDiffuser" \
    --resolution=96 \
    --train_batch_size=16 \
    --gradient_accumulation_steps=2 \
    --max_train_steps=1500 \
    --learning_rate=1e-4 \
    --lr_scheduler="cosine" \
    --mixed_precision="fp16" \
    --report_to="wandb"
```

[fill in: What did you learn during training? Any hyperparameter decisions you made and why?]

### Contrastive learning setup

The training framework expects 16 negative style images per positive style for contrastive loss computation. Currently sourcing additional style images to expand beyond the initial 15 — a small gap but one that affects the contrastive signal.

### FSTDiff integration (Phase 2, in progress)

The Font Style Transformation (FST) module from the FSTDiff paper is being integrated for Phase 2. Currently debugging tensor dimension mismatches in the style encoder pathway. The goal is to combine FontDiffuser's content-style fusion with FSTDiff's dedicated style transformation capacity.

[fill in: Describe what specific tensor issues you hit or what you expect FSTDiff to improve.]

---

## R — Result

| Metric | Value |
|:-------|:------|
| Inference speed | ~1.7 s/sample (2× Kaggle GPU) |
| Dataset storage | Parquet on HF Hub, faster I/O than raw image dirs |
| Phase 1 training | 1500 steps, losses logged on WandB (train, perceptual, offset, diffusion) |
| Trained weights | content_encoder, style_encoder, unet (.safetensors) + scr_210000.pth (Phase 2) |

[fill in: What were your concrete outcomes? Quantify what you can.]

> *Phase 1 converged to a plateau — train loss and perceptual loss stopped improving meaningfully after ~1000 steps despite tuning loss coefficients upward. This indicated model capacity saturation rather than underfitting, pointing toward the need for architectural changes (FSTDiff module) rather than more training.*

### Validation split

The dataset supports three evaluation regimes crucial for generalisation assessment:

- **SCUS** — seen content, unseen style
- **UCSS** — unseen content, seen style
- **UCUS** — unseen content, unseen style (primary evaluation target)

Full evaluation is pending integration with a matching module (Hưng's image comparison component).

---

## +R — Reflection

[fill in: What would you do differently? What surprised you? What non-obvious lessons emerged?]

> *Key takeaways:*
>
> - **Model saturation is a signal, not a failure.** Phase 1 losses plateaued — the model learned what it could from the current architecture. Rather than chasing loss curves, the right move was to identify the bottleneck (style transformation capacity) and plan architectural changes.
> - **Parquet was the right call.** Switching from raw image directories to Parquet (Apache Arrow) on HF Hub eliminated upload/download friction entirely. Worth the upfront migration effort.
> - **Contrastive learning needs diversity.** The 16-negative-style setup assumes enough variation in the style pool. With only 15 initial images, the contrastive signal is weak. Expanding the style collection is a prerequisite, not an afterthought.
> - **Checkpoint management saves hours.** `results_checkpoint.json` turned what would have been a restart-from-scratch problem into a resume-and-continue operation across GPU session interruptions.
>
> Next steps: FSTDiff style module integration, multi-scale feature extraction (combining FontDiffuser and FSTDiff architectures), and loss consistency regularisation once tensor dimensions are resolved.

---

## Connection to GSTAR

[fill in: How does this project connect to your broader GSTAR (Graduate Studies, research trajectory, or academic program)? What skills, methods, or research themes does it advance?]

> *This project sits at the intersection of deep generative models and digital humanities — using diffusion-based synthesis to preserve and extend a historical script system. The technical stack (conditional diffusion, contrastive learning, multi-scale feature extraction) maps directly to ongoing research in controllable image generation. The dataset and pipeline are built to be reproducible and shareable via HF Hub, lowering the barrier for downstream researchers working on low-resource script generation.*

---

## Resources

- **Source code:** [github.com/dzungphieuluuky/FontDiffusion](https://github.com/dzungphieuluuky/FontDiffusion) — topics: `huggingface-diffusers`, `font-generation`, `sino-nom`
- **Kaggle notebook:** [kaggle.com/code/dzung271828/font-diffusion](https://www.kaggle.com/code/dzung271828/font-diffusion) — pre-configured environment, run cells sequentially
- **Generated dataset (HF Hub):** [huggingface.co/datasets/dzungpham/font-diffusion-generated-data](https://huggingface.co/datasets/dzungpham/font-diffusion-generated-data) — train_original split + pre-split train/val
- **Trained weights (HF Hub):** [huggingface.co/dzungpham/font-diffusion-weights](https://huggingface.co/dzungpham/font-diffusion-weights) — content_encoder, style_encoder, unet (.safetensors), scr_210000.pth (Phase 2)
