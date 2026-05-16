---
layout: post
title: All of the magic is here
tags: [machine-learning, representation-learning, reinforcement-learning]
author: dzungphieuluuky
---

# Introduction

A 1024×1024 RGB image inhabits a space of $(256^3)^{1024^2}$ possibilities, yet modern latent diffusion models reliably sample coherent structures like faces and landscapes. In reinforcement learning, agents routinely navigate combinatorial action spaces to outplay human champions. What connects these disparate successes?

Most state-of-the-art deep learning architectures do not brute-force their way through these spaces. Instead, they rely on a shared set of simple, almost minimalistic architectural motifs. Often, progress is driven not by adding complexity, but by *subtracting* it. Consider the *Attention Is All You Need* architecture: its true breakthrough was not the invention of attention, but the courage to completely discard recurrent and LSTM machinery, proving that a simpler routing mechanism could handle sequence transformations globally.

In this post, we will explore two pervasive patterns that span across vision, language, and reinforcement learning: 

1. **Exploiting low-dimensional manifolds** to make generative sampling tractable.
2. **Using relative distributions over absolute values** to stabilize learning.

---

<h2 id="1-the-manifold-hypothesis-and-generative-bottlenecks">1. The Manifold Hypothesis and Generative Bottlenecks</h2>

### The Curse of Pixel Space

When training generative models, calculating loss directly in the high-dimensional ambient space (like raw pixels) is computationally expensive and statistically inefficient. The **Manifold Hypothesis** posits that real-world, meaningful data actually lies on a low-dimensional manifold embedded within this high-dimensional ambient space.

If the hypothesis holds, calculating diffusion steps or adversarial loss in the ambient space is largely wasted on modeling imperceptible, high-frequency noise.

### The Autoencoding Motif

To operationalize the manifold hypothesis, neural networks explicitly force data through information bottlenecks. 

In a standard convolutional architecture, we see a recurring pattern: spatial dimensions are halved while channel dimensions are doubled, projecting $28 \times 28$ images into highly dense, lower-dimensional tensors. Variational Autoencoders (VAEs) formalize this. They do not just compress; they force the latent space $Z$ to approximate a known prior (like a standard Gaussian).

$$
\mathcal{L} = \mathbb{E}_{q_\phi(z|x)}[\log p_\theta(x|z)] - D_{KL}(q_\phi(z|x) \| p(z))
$$

The intuition here is vital: a VAE does not blindly learn an identity function. It balances reconstruction fidelity against the regularization of the bottleneck, forcing the network to discover the actual underlying manifold parameters.

### Latent Diffusion: Generating on the Manifold

This motif perfectly explains the success of **Latent Diffusion Models (LDMs)**. Standard Diffusion Models iteratively denoise in the ambient pixel space, which is computationally brutal. LDMs circumvent this by pre-training an autoencoder to map the image space into a much smaller latent space. The diffusion process—adding and removing Gaussian noise—is then performed entirely within this compressed latent space.

*Figure 1: Latent Diffusion compresses ambient space to a latent manifold before executing the Markovian denoising chain. (Placeholder)*

By subtracting the high-frequency spatial redundancy before generating, LDMs decoupled the semantic generative process from the perceptual upsampling process. 

---

<h2 id="2-relative-signals-normalization-and-rl-advantages">2. Relative Signals: Normalization and RL Advantages</h2>

### Why Absolute Scale Fails

Neural networks are notoriously brittle when handling disparate numerical scales. If feature $x_1$ ranges from $[0, 1]$ and feature $x_2$ ranges from $[0, 1000]$, gradient updates will be disproportionately dominated by $x_2$. The absolute magnitude eclipses the semantic importance of the feature.

Structural remedies like **BatchNorm** and **LayerNorm** subtract the mean and divide by the variance. 

- **BatchNorm** standardizes across the batch dimension, effectively decorrelating features globally.
- **LayerNorm** standardizes across the feature dimension, ensuring the relative activation pattern of a single sample remains stable regardless of overall magnitude.

In both cases, the absolute numbers are discarded. What the network actually backpropagates through is the *distribution*—how a signal relates to its peers.

### The Advantage Function in RL

This principle of "relative over absolute" is paramount in Reinforcement Learning. Consider an agent evaluating an action's absolute expected return, denoted as the Q-value: $Q(s, a)$.

If we update policy weights based purely on $Q(s, a)$, we implicitly assume the baseline return of the state is zero. If all actions in a highly rewarding state yield $+100$, and the agent takes a slightly suboptimal action yielding $+90$, training purely on the absolute reward ($+90$) would strongly reinforce a suboptimal action simply because the absolute scale is high.

We fix this by introducing the **Advantage Function**:

$$
A(s,a) = Q(s,a) - V(s)
$$

Here, $V(s)$ serves as the baseline—the average expected reward of the state $s$. By subtracting the baseline, we isolate the *relative advantage*. A return of $+90$ against a baseline of $+100$ yields an advantage of $-10$, correctly penalizing the suboptimal behavior.

Just as LayerNorm prevents large pixel values from dominating a gradient, the Advantage function prevents highly rewarding states from blinding the policy to relative action quality.

---

<h2 id="closing-thoughts">3. Closing Thoughts</h2>

The progression of deep learning architectures often looks like a steady march toward greater complexity. Yet, when we inspect the specific mechanisms that enable massive leaps in capability—from Transformers replacing LSTMs to LDMs overtaking pixel-diffusion—we repeatedly find subtractive motifs:

* **Dimensionality reduction** forces models to ignore ambient noise and focus on the true data manifold.
* **Normalization** removes absolute scale to highlight relative feature distributions.
* **Advantage baselines** completely discard absolute rewards to evaluate relative action utility.

By designing architectures that systematically subtract the irrelevant (ambient space, absolute magnitude, expected baselines), we make learning tractable at scale. In our next posts, we will explore how these principles intersect with **Sparsity** and **Dual Perspectives in Optimization**.

---