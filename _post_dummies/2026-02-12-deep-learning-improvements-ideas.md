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
Most state-of-the-art deep leanring architectures sometimes won't be the one to suggest an entirely different and novel architecture that has never appear in history, but rather some simple, minimalistic ways that effectively increase performance the effectiveness of features extraction to the extent that we might not imagine. For example, people usually believe that **Attention is all you need** paper is the cornerstone paper that create the biggest breakthroughs in language modeling and give birth to popular LLM that increasingly become indispensable from our current work habits: ChatGPT, Gemini, Claude, etc. The biggest thing I think about this paper is that they bravely remove unnecessary modules from RNN and LSTM from the old days, to only rely on attention mechanism to handle all the transformations on dimensions. Perhaps, the biggest improvements in some scenarios may not be driven from a novel idea, but from a brave decision of removing the components that are not suitable with the problem at hand. I’ve spent my sophomore year at university teaching myself deep learning and reinforcement learning outside of school coursework. Around February 2025, while taking Operating Systems as one of my courses at that time, I decided to finally work through **Reinforcement Learning: An Introduction** by Sutton and Barto. At the same time, I was taking a course on **Probability theory and Statistics**. It turned out to be a perfect strategy at the time to learn probability from the ground up from the class and see them in action through my external materials, how they behave, how researchers use them in their work, how they are used to estimate things that are seemingly intractable and computationally intensive.

---
Most of my time spending reading a wide variety of articles, blog posts and books from outstanding researchers spanning across various disciplines in aritficial intelligence: basic machine learning, deep learning with neural networks, representation learning, reinforcement learning, diffusion generative modeling, etc. Throughout the journey, I found that some of the most groundbreaking innovations bear in their intrinsic properties an incredibly strong connections with our everyday lives. Their core mechanism and philosophies appear nearly everywhere we come, denoting that simple yet powerful ideas can bring about the biggest achievements in history of humanity's boundaries of civilization. In this post, I would like to do a little retrospective of some interesting yet powerful ideas that help to enhance the capabilities of AI systems. This post are expected to be continuing, with more ideas being appended to the post along my learning journey.

# 1. High and low dimension

## Data distribution

In this first section, I would like to talk about the simplest approach in deep leanring architecture design for processing inputs data. There is a harsh truth in generative modeling field of deep learning that every researcher know is that the data we gather from our real world lies on a very high-dimensional space. Although we live in a 3D geometric space, but the real data that come from this space is usually built from very little pieces such as pixel (for vision tasks), tokens (for language modeling), etc. To articulate what I want to say, let's first examine the data distribution in images processing. Suppose we have an image of size $1024 * 1024$, each pixel in the image has RGB format with 256 different values for each indices in the tuple. Therefore the total combinations that one pixel has is $256^3$, and since we have $1024 * 1024$ ones like that, we have a total of $(256^3)^{1024^2}$ different combinations. Although there are a vast space of total possible images can be generated using this settings, only a very small amount of them are real meaningful image containing something that actually exists in the real world. We can use a short piece of code with `numpy` library to see this if we wish to see its visualization. Because of this phenomenon, we have a quite popular theory in machine learning disciplines, which is the **Manifold Hypotheses**. This theory said that most natural images (images that have real meaning and can be interpreted as some objects rather than just pure noise) lie on a much lower dimensional manifold (subspace) in the real high dimensional space of all possible images. From this perspective, we can interpret training a generateive model (text, images, videos, actions, etc.) is equivalent to fitting our machine learning model to this low dimensional manifold, i.e, learn this distributions that we can sample real data from.

## Representations

Now we look into how deep learning models especially neural network based model extracts information from the training data to find this distribution. Coming from our assumption that those meaningful data lies on a very low dimensional distribution compare to the total space, it's a straightforward idea to build an encoder that gradually fewer neurons as we deep dive into the network. The first layer may contains a large number of input neurons: 748 (grayscale images of size 2828) or 2048 neurons depending on the size of our input data. Then, as we move deeper into the network, this size gradually becomes smaller, likely $2048, 1024, 512, 256, 128, 64, 32$. Researchers in this field have an intangible interest with any numbers that are exponentials of two. Conventionally, each time we move one step deeper, we double the number of channels and half the size of height and width of our images. This approach create the chance for the model to learn a much more compact representation (or embeddings, although they are still quite different) of the original data input, hopefully to represent these messy data in some more meaningful ways rather than raw pixels. There are several problems and approaches under research in representation learning to hopefully yield better results on this manner.

## Some examples

Now we talk about one of the most prominent achievements with this innovation, denoting as latent diffusion model. Computer vision tasks, especially, the generative tasks that involve generating images based on some input conditions (text prompts, reference images, etc.) has been widely under researched for decades. Their improvements come from the first model class that can generate realistic images that resemble real images to some extent, GAN, or Generative Adversarial Networks, proposed by Ian Goodfellow et al. This model class harness the beauty of game theory and use its foundation to construct a training paradigm that utilize the mutual adversarial interaction between two entities to improve both of them simultaneously. Several years later, VAE (Variational Autoencoder) comes out of the box to jump into the vision generative domain. This model contains two main parts: an encoder and a decoder. The encoder tries to map the input space into a latent space, which act as a compact representation for the input space. This latent space is assumed to have much lower dimension than the original input space. When we have a compact representation of the original space, the decoder tries to decode this representation back to its original input space at the output head, hopefully to generate an image that lies on the same distribution with the input image but has some variations in it. Because of this design, VAE or Autoencoder in general are often described as a neural network architecture that learns an identity function. This definition sometimes confuse readers, because if we just want an identity funciton, then why we just return exactly the input rather than training a complex neural network like this? This popular confusion comes from the lack of the key point: we don't actually want to return the input itself, we want the model to give us the output that also lies on the same distribution (manifold) with the input, not just a simple classification tasks or regression tasks in traditional machine learning setups, but a new instance, hence the name *Generative*. Now, we transmit ourselves to a new paradigm of generative AI: diffusion models (DMs). If VAE use just one step to generate new images, DMs instead gradually generate new images through multiple of iterative steps. In each step of denoising process, the image becomes clearer than its previous versions, eventually become a high-fidelity image that can be visually interpreted as a fully meaningful image, denoting some kinds of objects based on our input prompts: a dog, a cat, a house, buildings, abstract figures or geometries, etc. But there are still problems, DMs take so many steps to denoise, yet they perform this computationally intensive tasks directly on input space, leading to bursting on energy demands. Therefore, Latent Diffusion Models (LDMs) come to the rescue. Instead of computing directly on the expensive input space, they compress this space into a latent space and start its denoising process in this space. This approach leads to a huge efficiency compared to the old days methods, savings an unfathomable amount of energy demands. More insights on LDMs can be discovered from their original paper: [High-Resolution Image Synthesis with Latent Diffusion Models](https://www.alphaxiv.org/abs/2112.10752)

---

# 3. Distribution vs absolute values

## Different scales
Talking about large datasets, we cannot expect all the attributes in our dataset to have the same value range. Their value ranges are different from each other, and desperately, by a large margin. To make our stories become more terrifying, neural networks are surprisingly sensitive to scale.

Pass in one feature that ranges from $[0,1]$ and another that ranges from $[0,1000]$, and the second will dominate the gradient updates, by not being actually more important, but just simply because of its larger numerical values. To counter such a problem, there is a very wide addopting approach namedly normalization, or standardization, as in some textbooks. Personally, I prefer the word normalization because standardization potentially has an entirely different meanings.

There are some of the most popular normalization techniques such as: BatchNorm, LayerNorm, InstanceNorm, etc. These techniques all focus on normalize raw values of input tensors to a more reasonable range of values that facilitate computation and enhance stability for training. However, which dimensions/aspects they choose to normalize their data is different from each other. Let's look at a few example of this technique:
- BatchNorm: Batch normalization. As the name suggest, this technique normalize values on a batch of data that consists many samples rather instead of considering every single samples separately. The batch size is a tunable hyperparameter and can greatly influence the training performance. Usually, bigger batch size drives more stability but demand more computational power, while smaller batch size facilitate update speed but take risk of overfitting and big bias. This techique is widely used in vision tasks that involve CNN architecture since the dawn of its birth in 2015.
- LayerNorm: Layer normalization. This tehcnique is widely adopted after BatchNorm has shown some inefficiency when dealing with sequence modeling models at the time, namely RNN and LSTM for sequence-to-sequence tasks. Instead of normalizing across batch dimension for each feature separately, this technique normalize across all feature dimensions in every sample independently. This approach can be interpreted as a tranpose form of BatchNorm. 

To elucidate the difference between these methods, suppose we are dealing with a matrix of size $m*n$, representing $m$ samples of data with $n$ features each. 
    - Doing BatchNorm is equivalent to take normalization for each column, which is actually computed across all samples in a batch for each feature dimension.
    - Doing LayerNorm is equivalent to take normalization for each row in the matrix, which is actually computed across all feature dimensions for each sample independently. This is versatile enough to be fit perfectly for sequence-to-sequence tasks. 

Although there are a wide variety of normalization techniques apart from these two techniques: InstanceNorm, GroupNorm, SpectralNorm, etc., what I want to say is that what we truly care about is not just raw values, but the distribution that is built from a large numbers of them. We don't really care much about their direct appearance, but about their distribution, how large they are compared to each other. with the mean-centering effect and calibrated variance after apply normalization techniques, this relative relationship between values in the same feature (with the same value ranges) gains more transparency by a large margin.

## Zero as implicit baselines

Apart from data normalization in supervised learning settings, reinforcement learning (RL) offers another approach on non-stationary data distribution that changes along with policy distribution. In RL settings, we often use another terminology for "data", which is "observation". The reasons leads to this interesting transition lies in the core mechanism of RL problems, where the agent must perform interactions with the environment rather training directly on a fixed dataset beforehand. Therefore, it's understandable to call these data as observations, since the agent directly experience (in other words, see) that data coming from the response of the environment following its actions.

VIẾT TIẾP TẠI ĐÂY!

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

# 4. Sparsity

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

# 5. Looking through different lens

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

Take an input image. Generate downsampled versions at resolutions like $64, 96, 128, 256, 512$. Pass each through a separate encoder stream—or share weights across streams, tied convolutions, something learned. Fuse the resulting representations through concatenation, attention, or learned weights.

The low-resolution stream captures global structure. The high-resolution stream preserves fine details. Together, they provide complementary information that depth alone struggles to reconstruct.

Each scale is a different lens. A different aperture. A different answer to the question: what matters in this image?

This principle isn't just about vision.

For text, vary the context window size. Or the granularity of tokenization—characters, subwords, words, phrases. For time series, vary the temporal resolution—milliseconds, seconds, minutes, hours. For graphs, vary the neighborhood radius—immediate neighbors, two-hop neighborhoods, community structure.

The principle: Don't force your model to reconstruct wide views from narrow inputs. Give it multiple apertures from the start.

---

To be continued.

---