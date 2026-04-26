---
layout: post
title: Some incomplete ideas
subtitle: Interesting patterns for architectural innovations
tags: [personal, machine-learning]
author: dzungphieuluuky
---

# Introduction

Most state-of-the-art deep learning architectures are not radical inventions from scratch. Instead, they tend to assemble simple, almost minimalistic modifications — and the magic lies in how these small changes unlock unexpectedly powerful feature extraction. 

Consider the *Attention is All You Need* paper. It is often celebrated as the origin of modern large language models (ChatGPT, Gemini, Claude, and friends). But the truly bold move in that paper was not the invention of attention itself — attention had been around for a while. The breakthrough was a *removal*: they stripped away the recurrent and LSTM machinery that everyone thought was necessary, and showed that attention alone could handle all the transformations. Sometimes progress comes not from adding new things, but from having the courage to discard old ones.

During my sophomore year, I was teaching myself deep learning and reinforcement learning outside of coursework. Around February 2025, while taking an Operating Systems class, I finally worked through Sutton & Barto’s *Reinforcement Learning: An Introduction*. At the same time, I was taking a course in probability and statistics. That turned out to be a perfect combination: I learned probability from the ground up in class, and then saw those ideas in action — how they behave, how researchers use them for estimation, and how they turn intractable problems into tractable ones.

---

Most of my time has been spent reading widely: articles, blog posts, books by outstanding researchers across AI — basic machine learning, deep learning, representation learning, RL, diffusion models. Throughout this journey, I have noticed something striking. Many of the most groundbreaking innovations carry within them deep connections to everyday life. Their core mechanisms and philosophies appear everywhere, suggesting that simple, powerful ideas can push the boundaries of what is possible.

In this post (which will grow over time), I want to reflect on a few such ideas — patterns that improve AI systems in elegant ways.

# 1. High and low dimension

## Data distribution

Let us start with a fundamental truth known to every researcher in generative modeling: the data we collect from the real world lives in a very high-dimensional space. We inhabit a 3D geometric world, but the data we feed into computers — images, text, sensor readings — often consists of many tiny pieces: pixels or tokens. To see the problem, consider a single $1024 \times 1024$ image. Each pixel has RGB values, each ranging from 0 to 255. That gives $256^3$ possibilities per pixel. Multiply that by the number of pixels $(1024^2)$, and the total number of possible images is astronomical:

\[
(256^3)^{1024^2}
\]

Yet only a tiny fraction of those possibilities correspond to meaningful natural images (a cat, a mountain, a face). Most are just noise. This observation leads to the **manifold hypothesis**: natural images lie on a much lower-dimensional manifold (a curved, low-dimensional subspace) embedded inside the high-dimensional space. Training a generative model — whether for images, text, or actions — is essentially learning that low-dimensional manifold, so we can sample new, realistic data from it.

## Representations

How do neural networks find this manifold? Given the manifold hypothesis, a natural design choice is to build an encoder that gradually reduces dimensionality. The first layer might have as many neurons as the input size (e.g., 784 for $28\times28$ grayscale images, or 2048 for larger inputs). Then, as we go deeper, we shrink the representation: 2048 → 1024 → 512 → 256 → 128 → 64 → 32. (Practitioners often like powers of two.) In convolutional architectures for images, a common pattern is to double the number of channels while halving the spatial dimensions. This gives the model a chance to learn compact *embeddings* (or latent representations) that capture meaning far more efficiently than raw pixels.

## Some examples

One of the most prominent successes of this idea is the **latent diffusion model** (LDM). For decades, generating realistic images from text prompts or other conditions was a hard problem. Generative Adversarial Networks (GANs), introduced by Ian Goodfellow and colleagues, brought a game‑theoretic twist: two networks compete, improving each other. Then came Variational Autoencoders (VAEs), which consist of an encoder (mapping input to a low‑dimensional latent space) and a decoder (mapping back to the input space). VAEs are often described as learning an identity function, which can confuse newcomers: why learn to output the input? The key is that we do *not* want the exact input — we want a *new* sample that lies on the same manifold. That is why they are called *generative*.

Diffusion models (DMs) take a different approach: they generate images gradually over many iterative denoising steps. Each step makes the image a little clearer, until finally we obtain a high‑fidelity output. But DMs operate directly on the high‑dimensional input space, which is computationally expensive. **Latent diffusion models** solve this by first compressing the input into a low‑dimensional latent space, then running the denoising process there. This dramatically reduces computation and energy consumption. The original paper — [High‑Resolution Image Synthesis with Latent Diffusion Models](https://www.alphaxiv.org/abs/2112.10752) — is well worth reading for deeper insights.

---

# 3. Distribution vs absolute values

## Different scales

Real‑world datasets are messy. Different features can have wildly different value ranges: one might lie in $[0,1]$, another in $[0,1000]$. Neural networks are surprisingly sensitive to scale. If you feed in such features directly, the feature with the larger range will dominate gradient updates — not because it is more important, but simply because its numbers are bigger.

The standard solution is **normalization** (sometimes called standardization, though I prefer the former because “standardization” can be ambiguous). Popular normalization techniques include BatchNorm, LayerNorm, and InstanceNorm. All of them rescale activations to a reasonable range, improving training stability. They differ in which dimensions they normalize.

- **BatchNorm** normalizes across the batch dimension for each feature separately. For a matrix of size $m \times n$ ($m$ samples, $n$ features), BatchNorm normalizes each column (feature) using the statistics of that column across the batch. It works well for CNNs in vision tasks, but less so for sequence models.
- **LayerNorm** normalizes across all feature dimensions for each sample independently. That is, it normalizes each row of the matrix. This makes it more suitable for sequence‑to‑sequence models like RNNs and Transformers.

The crucial insight is not the raw numbers themselves, but their *distribution* — how they relate to each other. After normalization (centering and scaling), the relative relationships become much clearer.

## Zero as implicit baselines

Reinforcement learning offers a different perspective on non‑stationary data. In RL, the agent interacts with an environment, so the “data” are better called *observations* — they depend on the agent’s own policy, which changes over time.

One powerful technique is the **advantage function**:

\[
A(s,a) = Q(s,a) - V(s)
\]

- $A(s,a)$ tells us how much better taking action $a$ in state $s$ is compared to the average action in that state.
- $Q(s,a)$ is the absolute quality (expected total reward) of taking action $a$ in state $s$.
- $V(s)$ is the baseline — the expected value of $Q(s,a)$ when averaging over all possible actions. Using $V(s)$ as the baseline centers the advantage: positive means “better than average”, negative means “worse than average”.

Without a baseline, we would effectively be assuming

\[
A(s,a) = Q(s,a) - 0
\]

That is, zero becomes the baseline. This is a huge and dangerous assumption: it implies that the average action in any state yields zero future reward, which is rarely true. The result is biased learning signals and poor performance.

The point, once again, is that absolute values matter less than relative comparisons. By subtracting a well‑chosen baseline, we isolate the *advantage* of one action over the average — and that relative signal drives much better decision making.

---

# 4. Sparsity

*(to be continued)*

---

# 5. Looking through different lens

*(to be continued)*

---

*To be continued.*