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
Most state-of-the-art deep leanring architectures sometimes won't be the one to suggest an entireyl different and novel architecture that has never appear in history, but rather try in some vey simple, minimalistic ways that effectively increase performance the effectiveness of feature sextraction to the extent that we might not imagine. For example, people usually believe that **Attention is all you need** paper is the cornerstone paper that create the biggest breakthroughs in language modeling and give birth to popular LLM that we use on a regular basis: ChatGPT, Gemini, Claude, etc. I don't want to say that I'm opposed to this point of view, but rather I think that the biggest point that such paper make is not what the architecture they propose, because literally attention mechanism has  been proposed earlier in a 2015 paper. Other normalization layers (LayerNorm) and encoder layers have also bene under massive research for a few years. The biggest thing I think about this paper is that they bravely remove unnecessary modules from RNN and LSTM from the old days, to only rely on attention mechanism to do its work. Perhaps, the biggest improvements in some scenarios may not be driven from a novel idea, but from a brave decision of removing something that are not too fit with our problem. In this blog, I would like to reflect myself some of the innovation ideas in deep learning architectures that I find useful and fascinating.I’ve spent the past year teaching myself deep learning and reinforcement learning outside of coursework. Yes, somehow I feel that I'm kind of opposed to the learning process at uni, rather I'm more inclined to random things on the Internet that I find fascinating.Around February 2025, while taking Operating Systems as one of my courses at that time, I decided to finally work through **Reinforcement Learning: An Introduction** by Sutton and Barto. At the same time, I was taking a probability theory course. It turned out to be perfect timing to learn about distributions and what will they actually look like in AI research, rather than toy problems with overly idealistic settings we have met in textbooks.

---
Most of my time spending reading a lot of articles, blog posts from popular researchers in textbooks in several disciplines in AI such as: representaiton learning, reinforcement learning, mathematics and deep learning, both in principles and practices, some papers that I find interesting on ArXiv. Throughout the journey, I found that several innovations are ubiquitous. They appear nearly everywhere I come, inferring their importance through their appearance in some of the most groundbreaking research breakthroughs in the field. In this post, I would like to share some of the ideas that I find them universal and so general that we can nearly apply them almost everywhere in our AI systems. this post are expected to be continuing, with more and more ideas being appended to the post along my learning journey.

# 1. High and low dimension

## High-dimensional data distribution

In this first section, I would like to talk about the simplest approach in deep leanring architecture design for processing inputs data. There is a harsh truth in generative modeling field of deep learning that every researcher know is that the data we gather from our real world lies on a very high-dimensional space. Although we live in a 3D geometrical space, but the real data that come from this space is usually built from very little pieces such as pixel (for vision tasks), tokens (for language modeling), etc. To articulate what I want to say, let's first examine the data distribution in images processing. Suppose we have an image of size 1024 * 1024, each pixel in the image has RGB format with 256 different values for each indices in the tuple. Therefore the total combinations that one pixel has is 256^3, and since we have 1024 * 1024 ones like that, we have a total of (256^3)^{1024^2} different combinations. Although there are a vast space of total possible images can be generated using this settings, only a very small amount of them are real meaningful image containing something that actually exists in the real world. We can use a short piece of code with `numpy` library to see this if we wish to see its visualization. Because of this phenomenon, we have a quite popular theory in machine learning disciplines, which is the **Manifold Hypotheses**. This theory said that most natural images (images that have real meaning and can be interpreted as some objects rather than just pure noise) lie on a much lower dimensional manifold (subspace) in the real high dimensional space of all possible images. From this perspective, we can interpret training a generateive model (text, images, videos, actions, etc.) is equivalent to fitting our machine learning model to this low dimensional manifold, i.e, learn this distributions that we can sample real data from.

## Representations

Now we look into how deep learning models especially neural network based model extracts information from the training data to find this distribution. Coming from our assumption that those meaningful data lies on a very low dimensional distribution compare to the total space, it's a straightforward idea to build an encoder that gradually fewer neurons as we deep dive into the network. The first layer may contains a large number of input neurons: 748 (grayscale images of size 28*28) or 2048 neurons depending on the size of our input data. Then, as we move deeper into the network, this size gradually becomes smaller, likely 2048, 1024, 512, 256, 128, 64, 32. Researchers in this field have an intangible interest with any numbers that are exponentials of two. Conventionally, each time we move one step deeper, we double the number of channels and half the size of height and width of our images. This approach create the chance for the model to learn a much more compact representation (or embeddings, although they are still quite different) of the original data input, hopefully to represent these messy data in some more meaningful ways rather than raw pixels. There are several problems and approaches under research in representation learning to hopefully yield better results on this manner.

## Latent diffusion model

This is perhaps one of the most prominent manifestation of this optimizatoin approach, latent diffusion model. Generative AI, especially, generative models for vision tasks have been thoroughly researched and discussed throughout decades, with improvements from GAN to VAE, to naive diffusion model at its infancy to this high-end approach that is mainly the core for state-of-the-art diffusion model for image generation (Stable Diffusion 3, for example). 

---

# 2. Latent spaces

---

# 3. Relative > absolute

Neural networks are surprisingly sensitive to scale.

Pass in one feature that ranges from 0–1 and another that ranges from 0–1000, and the second will dominate gradient updates. Not because it's more important. Because it's numerically bigger. The network doesn't know that the units are different. It just sees large numbers and assigns large weights, then spends the rest of training trying to unlearn that initial mistake.

We fix this with normalization. BatchNorm, LayerNorm, all the Norms. They rescale activations to have consistent statistics across channels, across batches, across time. They're not just optimization conveniences—they're structural necessities. ResNet without BatchNorm doesn't train. Transformer without LayerNorm doesn't converge.

Reinforcement learning offers a sharper version of the same lesson.

Raw rewards are noisy. High-variance. Environment-dependent. A reward of +1 in one environment might be equivalent to +1000 in another, depending on how the designer scaled things. Optimizing directly against raw returns is like trying to steer a ship by watching individual waves instead of reading the compass.

The solution is the advantage function:

A(s,a) = Q(s,a) - V(s)

Instead of learning from the raw reward, learn from how much better things went than expected. Center the signal around a baseline. The baseline doesn't have to be perfect—it just has to be correlated enough with the true expectation to reduce variance.

This isn't a trick. It's a shift in how we think about learning signals.

Absolute values are brittle. They depend on arbitrary scales, arbitrary offsets, arbitrary units. Deviations from expectations are stable. They isolate the information in the signal from its context.

The same pattern shows up everywhere:

-   Residual networks learn deviations from identity. The default behavior—the baseline—is to pass the input through unchanged. The network only needs to learn the delta.
-   Reward normalization rescales returns to have zero mean and unit variance, removing environment-specific scaling.
-   Contrastive losses compare relative similarity, not absolute labels. An image is more similar to its augmented version than to a different image.
-   Centered activations shift distributions to have zero mean, improving gradient flow through saturating nonlinearities.

Zero is the default baseline everywhere. It's convenient. It requires no computation, no estimation, no learning.

But it's rarely optimal.

Making that baseline explicit and learnable—estimating V(s) instead of assuming it's zero, learning the residual instead of the full mapping—almost always helps. It's not about the specific mathematical form. It's about the principle: tell the network what's normal, so it can focus on what's surprising.

---

# 4. Sparse structure

Standard practice: every parameter, every input, every forward pass.

This is expensive. It's also wasteful.

Many parameters barely activate during the forward pass. Their weights are near zero, or their outputs are consistently suppressed by ReLU, or they're in parts of the network that specialize in patterns that rarely appear. Yet we pay the computational cost for them on every example, regardless of whether they contribute.

Two different research directions converge on the same observation: you don't need full capacity for every example.

Mixture of Experts (MoE) is the most prominent example.

During training, all experts receive gradients. Every parameter gets updated based on the batch. But during inference, each input is routed to only a small subset of experts—typically 10–20% of the total parameters. The router learns to assign inputs to the experts best suited for them.

I experienced this firsthand while using DeepSeek OCR for an NLP assignment. The model has roughly 3B parameters total. But only about 580M are activated during inference—barely one-sixth of the total. Outputs arrive in a fraction of the time. The model doesn't need its full capacity to process any single input. It needs that capacity to cover the distribution of possible inputs. Each input only needs a slice.

Pruning tells a complementary story.

Research shows that most trained networks are massively overparameterized. You can remove 90% of the weights—set them to zero, eliminate them entirely—and accuracy drops only a few points, sometimes less. The network had the capacity to do the task with far fewer parameters all along. Training just used the extra capacity to find a good solution faster, or to navigate the loss landscape more smoothly.

This idea echoes an much older algorithm: Minimax with Alpha-Beta pruning.

In vanilla Minimax, you traverse the entire game tree. Every branch, every leaf, every evaluation. The computation grows exponentially with depth. Alpha-Beta pruning exploits a simple insight: if you already know that one branch leads to a worse outcome than another branch already evaluated, you can stop exploring it. You don't need to know exactly how bad it is. Just that it's bad enough.

With this optimization, you can eliminate 30–40% of the tree—sometimes much more—and still arrive at the exact same decision.

What fascinates me is that MoE and pruning, despite their modern sophistication, are descendants of this simple, powerful insight: you don't need to explore everything if you already know where value lies.

Yet despite its simplicity, sparse computation remains surprisingly hard to analyze theoretically. Why do some architectures prune cleanly while others collapse? How does sparsity affect the geometry of the representation manifold? Can sparse structure emerge naturally from learning dynamics, or does it need to be architected in?

I don't know. But I suspect this is going to become a primary axis of architectural design, not just an optimization footnote.

---

# 5. At multiple scales

When you look at a forest, you don't render individual leaves first, then branches, then trees, then the canopy.

You see texture and structure at all scales simultaneously. The grain of the bark. The pattern of branches against the sky. The shape of the canopy. These aren't processed sequentially. They're perceived in parallel, integrated into a single coherent experience.

Most vision architectures don't work this way.

They process at a single resolution. Usually high. Then they progressively downsample—strides, pooling, convolutions with increasing dilation—to recover global structure through depth. Information flows bottom-up, from fine details to coarse abstractions, through dozens of layers.

It works. It's the foundation of modern computer vision. But it feels indirect.

Why force the network to reconstruct wide-angle views from pinhole inputs? Why require depth to see the big picture?

What if multi-scale processing was a Day 1 design decision?

Not an emergent property of deep stacking. Not something the network has to learn to do over many layers. But a structural constraint: the input is processed at multiple resolutions from the very first layer, and these parallel streams are integrated throughout the network.

Examples already exist, scattered across the literature:

-   Feature pyramids and U-Net skip connections, which combine coarse semantic features with fine spatial details.
-   Parallel encoders operating at different resolutions, their outputs concatenated or attentively fused.
-   Cross-scale attention, where tokens at one scale attend to tokens at another.
-   Hierarchical transformers with nested context windows.

In my own projects, I've found that parallel encoders processing the same image at multiple resolutions consistently outperform single-scale baselines.

Take an input image. Generate downsampled versions at resolutions like [64, 96, 128, 256, 512]. Pass each through a separate encoder stream—or share weights across streams, tied convolutions, something learned. Fuse the resulting representations through concatenation, attention, or learned weights.

The low-resolution stream captures global structure. The high-resolution stream preserves fine details. Together, they provide complementary information that depth alone struggles to reconstruct.

Each scale is a different lens. A different aperture. A different answer to the question: what matters in this image?

This principle isn't just about vision.

For text, vary the context window size. Or the granularity of tokenization—characters, subwords, words, phrases. For time series, vary the temporal resolution—milliseconds, seconds, minutes, hours. For graphs, vary the neighborhood radius—immediate neighbors, two-hop neighborhoods, community structure.

The principle: Don't force your model to reconstruct wide views from narrow inputs. Give it multiple apertures from the start.

---

# 6. Zero is an implicit baseline

Reinforcement learning taught me this.

Raw rewards are messy. They spike when the agent discovers something good. They vanish when the environment enters a low-reward region. They depend entirely on how someone configured the reward function—the scaling, the clipping, the sparse vs. dense design choices.

Optimizing policy gradients directly against raw returns is painful. The variance is enormous. A single lucky trajectory can dominate an entire batch. The signal-to-noise ratio is abysmal.

The fix: subtract a baseline.

Learn what you expect to happen—the value function V(s), the average return from this state. Then learn from the gap between expectation and reality. The advantage. The residual. The surprise.

This slices variance. It centers the learning signal around zero. It stabilizes training.

But the deeper pattern isn't about RL. It's about baselines.

Many of our systems implicitly assume zero is the right baseline. It almost never is.

-   Residual connections assume identity is a reasonable default. The network only needs to learn the deviation. But is identity actually a good prior? For some tasks, yes. For others, no. The assumption is baked in.
-   Centered activations assume zero mean helps optimization. This is empirically true for many architectures, but it's still an assumption about the optimal distribution of pre-activations.
-   Contrastive losses assume relative comparison is more stable than absolute prediction. Instead of predicting a class label, predict which of two samples is more similar to a query.
-   Normalization layers assume that rescaling to zero mean and unit variance is beneficial. They learn affine parameters to undo this if needed, but the default is zero.

In each case, we're replacing an implicit zero baseline with something more informed. Sometimes learnable. Sometimes just a better default.

Zero is convenient. It costs nothing to compute. It requires no estimation, no auxiliary networks, no additional loss terms.

But it's rarely the right expectation.

If your architecture assumes zero anywhere—baselines, initializations, residuals, centering—ask whether you could learn a better one. Not because zero is bad, but because the right baseline is almost never zero.

Moving from absolute values to relative ones—from raw scores to advantages, from full mappings to residuals, from classification to contrast—is not just a trick, but a very dark, very powerful trick! (Dumbledore reference on dark magic)

Learning is not about accumulating points. It's about registering surprise.

The magnitude of the signal should reflect how unexpected the outcome was, not its raw value. A reward of +1 when you expected +0.9 is a small surprise, a small update. A reward of +1 when you expected -10 is a huge surprise, a huge update. The same raw reward, different information content.

This is how humans learn. We don't memorize absolute outcomes. We update our beliefs when reality diverges from expectation. The more surprising the divergence, the larger the update.

Our architectures should do the same.

---

To be continued.

---