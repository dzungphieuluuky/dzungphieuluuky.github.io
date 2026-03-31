---
layout: post
title: Some incomplete ideas
subtitle: Interesting patterns for architectural innovations
cover-img: 
thumbnail-img: 
share-img: 
tags: [personal, machine-learning]
author: dzungphieuluuky
---

# Introduction

The biggest breakthrough in "Attention Is All You Need" wasn't adding attention. It was having the bravery to remove everything else. 

Most state-of-the-art architectures don't suggest an entirely novel structure. Instead, they try simple, minimalistic ways to effectively increase performance and feature extraction. Attention mechanisms had been proposed earlier. Normalization layers and encoder layers had been researched for years. The real innovation was stripping away the unnecessary modules from RNNs and LSTMs, relying purely on attention to do the work. 

Sometimes, the biggest improvement comes from a brave decision to remove what doesn't fit. 

I’ve spent the past year teaching myself deep learning and reinforcement learning. Around February 2025, while taking an Operating Systems course, I decided to finally work through *Reinforcement Learning: An Introduction* by Sutton and Barto. At the same time, I was taking a probability theory course. It turned out to be perfect timing. I learned what distributions actually look like in AI research, rather than the toy problems with overly idealistic settings we meet in textbooks.

Throughout my reading—spanning representation learning, reinforcement learning, mathematics, and deep learning—I found several architectural innovations that are ubiquitous. They appear nearly everywhere, inferring their importance through their presence in some of the most groundbreaking breakthroughs in the field. 

Here are the universal ideas I've found so far.

---

# 1. High and low dimension

Take an image of size 1024 × 1024, where each pixel has an RGB format with 256 different values. The total combinations a single image can have is $(256^3)^{1024^2}$. 

That is an unfathomably high-dimensional space. Yet, although there is a vast space of total possible images you can generate, only a very small fraction of them are meaningful images containing things that actually exist in the real world. 

Because of this, we have the **Manifold Hypothesis**. This theory states that most natural, meaningful images lie on a much lower-dimensional manifold (or subspace) within the high-dimensional space of all possible images. Training a generative model is equivalent to fitting our machine learning model to this low-dimensional manifold. We are learning the distribution so we can sample real data from it.

To find this distribution, we build encoders that gradually reduce the number of neurons as we dive deeper into the network. A first layer might contain 2048 input neurons. As we move deeper, the size gradually halves: 1024, 512, 256, 128, 64, 32. In vision tasks, we typically double the number of channels and halve the spatial dimensions at each step. 

This approach forces the model to learn a much more compact representation (or embedding) of the original data. Instead of dealing with raw, messy pixels, it represents the data in more meaningful ways. The most prominent manifestation of this approach is the latent diffusion model—the core architecture behind state-of-the-art image generation models like Stable Diffusion.

---

# 2. Relative baselines > absolute values

Neural networks are surprisingly sensitive to scale.

Pass in one feature that ranges from 0–1 and another that ranges from 0–1000, and the second will dominate gradient updates. Not because it's more important, but because it's numerically bigger. The network doesn't know the units are different. It just sees large numbers, assigns large weights, and spends the rest of training trying to unlearn that initial mistake.

We fix this with normalization. BatchNorm, LayerNorm, all the Norms. They rescale activations to have consistent statistics. They're not just optimization conveniences—they're structural necessities. ResNet without BatchNorm doesn't train. Transformers without LayerNorm don't converge.

Reinforcement learning offers a sharper version of the same lesson.

Raw rewards are messy. They are high-variance and environment-dependent. A reward of +1 in one environment might be equivalent to +1000 in another. Optimizing directly against raw returns is like trying to steer a ship by watching individual waves instead of reading the compass. The variance is enormous, and a single lucky trajectory can dominate an entire batch.

The solution is the advantage function:

$A(s,a) = Q(s,a) - V(s)$

Instead of learning from the raw reward, we learn from how much better things went than expected. We center the signal around a baseline. The baseline doesn't have to be perfect—it just has to be correlated enough with the true expectation to reduce variance. 

Absolute values are brittle. Deviations from expectations are stable. 

Zero is the default baseline everywhere. It costs nothing to compute. It requires no estimation and no additional loss terms. But it is rarely optimal. Many systems implicitly assume zero is the right baseline:
- **Residual networks** learn deviations from identity. Passing the input through unchanged is the baseline, and the network only needs to learn the delta.
- **Contrastive losses** compare relative similarity rather than absolute labels. An image is more similar to its augmented version than to a different image.
- **Centered activations** shift distributions to have zero mean, improving gradient flow.

Making the baseline explicit and learnable—estimating $V(s)$ instead of assuming it's zero, learning the residual instead of the full mapping—almost always helps. 

Learning is not about accumulating points. It's about registering surprise. A reward of +1 when you expected +0.9 is a small surprise, a small update. A reward of +1 when you expected -10 is a huge surprise, a huge update. The magnitude of the signal reflects how unexpected the outcome was. 

Tell the network what's normal, so it can focus on what's surprising.

---

# 3. Sparse structure

Standard practice: every parameter, every input, every forward pass.

This is expensive. It's also wasteful.

Many parameters barely activate during the forward pass. Their weights are near zero, their outputs are consistently suppressed by ReLU, or they specialize in patterns that rarely appear. Yet we pay the computational cost for them on every example.

Two different research directions converge on the same observation: you don't need full capacity for every example.

**Mixture of Experts (MoE)** routes inputs to only a small subset of experts during inference—typically 10–20% of the total parameters. I experienced this firsthand while using DeepSeek OCR. The model has roughly 3B parameters total, but only about 580M are activated during inference. The model doesn't need full capacity to process any single input; it needs that capacity to cover the distribution of possible inputs.

**Pruning** tells a complementary story. Most trained networks are massively overparameterized. You can remove 90% of the weights, and accuracy barely drops. The network had the capacity to do the task with far fewer parameters all along.

This echoes an older algorithm: Minimax with Alpha-Beta pruning. If you already know that one branch leads to a worse outcome than another, you stop exploring it. With this optimization, you can eliminate much of the search tree and still arrive at the exact same decision. You don't need to explore everything if you already know where value lies.

I suspect sparse computation will become a primary axis of architectural design, not just an optimization footnote.

---

# 4. At different scales

When you look at a forest, you don't render individual leaves first, then branches, then trees, then the canopy. 

You see texture and structure at all scales simultaneously. The grain of the bark and the shape of the canopy are perceived in parallel, integrated into a single coherent experience.

Most vision architectures don't work this way. They process at a single high resolution, then progressively downsample to recover global structure through depth. Information flows bottom-up, from fine details to coarse abstractions, through dozens of layers.

Why force the network to reconstruct wide-angle views from pinhole inputs? 

What if multi-scale processing was a Day 1 design decision? Not an emergent property of deep stacking, but a structural constraint: the input is processed at multiple resolutions from the very first layer.

Examples already exist:
- Feature pyramids and U-Net skip connections.
- Parallel encoders operating at different resolutions, attentively fused.
- Hierarchical transformers with nested context windows.

In my own projects, parallel encoders processing the same image at multiple resolutions consistently outperform single-scale baselines. Take an input image, generate downsampled versions at resolutions like [64, 96, 128, 256, 512], and pass each through a separate encoder stream. The low-resolution stream captures global structure. The high-resolution stream preserves fine details. 

Each scale is a different lens. A different aperture. 

The principle applies everywhere. For text, vary the context window size or tokenization granularity. For time series, vary the temporal resolution. Don't force your model to reconstruct wide views from narrow inputs. Give it multiple apertures from the start.

---

To be continued.

---