
---
layout: post
title: Improvement ideas for free over here
subtitle: Personal notes on architectural improvements I found interesting
cover-img: 
thumbnail-img: 
share-img: 
tags: [deep-learning, research-ideas, architecture, interpretability]
author: dzungphieuluuky
---

I’ve spent the past year teaching myself deep learning and reinforcement learning outside of coursework. Around February 2025, while I was learning Operating Systems as one of my university courses that semester, I taught myself deep reinforcement learning using the bibl written by Richard Sutton and Andrew Barto. You can find it at [Reinforcement Learning: An Introduction](https://www.amazon.com/Reinforcement-Learning-Introduction-Adaptive-Computation/dp/0262039249), although several free versions are already available online.

Most of my time has been spent *absorbing*—reading papers, running experiments that fail, staring at loss curves that refuse to descend (or sometimes descend for a while before spiking like crazy after a few steps). The notoriously famous instability of deep reinforcement learning has always been around the corner.

But lately, I’ve started to notice patterns in what makes certain architectures feel elegant versus clunky. These aren’t formal research claims. They’re hunches. Intuitions that have crystallized from enough late-night debugging sessions.

Across my learning journey, I discovered several interesting patterns when designing algorithms and deep learning architectures that may be useful—not as solutions, but as directions worth exploring. Maybe they spark something. Maybe they’re wrong. Either way, writing them down will definitely clarify my thoughts, as the Feynman Technique has enlightened me.

**Attention, attention!** This post is expected to expand indefinitely depending on my observations and experience in the future, so the content in this post is always in **to be continued** mode :D

---

## 1. Where to compute?

Working directly in input space is expensive. An image is millions of pixels. A text sequence is thousands of tokens. Yet most of what matters for a task is compressed into a much lower-dimensional representation.

We already do this implicitly—every encoder is a compression mechanism. But I wonder: **what if we deliberately shifted more computation into the latent space itself?**

Instead of:
- Input → process → output

Why not:
- Input → encode → **process entirely in latent** → decode

Although we have not gained full understanding of latent space representations of inputs due to their high-dimensional nature, we can still comprehend it as a way to compress the input to a much more compact and efficient representation, such that every point in the latent space affects multiple points in the input space.

This is how the original diffusion models evolved into a more advanced and modern architecture called Stable Diffusion or Latent Diffusion Models, which only act on the latents rather than the raw inputs. Maybe this kind of design choice can be applied to several other fields—perhaps all vision-related architectures, such as perception and decision-making for robots in robot learning, which directly inherits many properties of reinforcement learning, since it is also about training some kind of agent in a given environment.

---

## 2. A basis for latent representations

We treat latent dimensions as if they encode features. But there’s no guarantee these features are orthogonal, or even non-redundant. Multiple dimensions might encode variations of the same attribute; a single dimension might encode multiple entangled concepts. We can only calm ourselves by saying that by encapsulating all the raw inputs into the latent space, the model gets more expressive signals and utilizes much more efficient computational resources and memory. But we don't actually know which number in the latents corresponds to which feature of the input—maybe the color, shapes, textures, everything we can think of—but we cannot dissect it directly and meticulously.

This bothers me.

In linear algebra, a basis is efficient because each vector contributes something unique: generate the whole space with minimal redundancy. Given that any generating set that contains enough vectors can generate the whole vector space, it might contain redundant information that is not so efficient to store (especially when we are living in the era of big data, where data is so large and the cost is ridiculously expensive to store them). What makes the basis so special is that it guarantees our vectors contain entirely different information about the vector space, and we can use them effectively and efficiently to construct the whole space without wasting anything.

Our latent representations aren’t bases—they’re generating sets, full of overlap that we can't directly prove. If we want to use latent representation of inputs as efficiently as possible to construct outputs (images, texts, trajectories, anything, …), we might want to convert the latents from being a generating set to a basis to contain information as compactly as possible.

**What would orthogonalization look like?** Not rigid orthogonality constraints (which might harm expressivity), but encouraging latent dimensions to capture distinct factors of variation. Sparse coding did this years ago. Could we bring similar ideas into modern architectures?

If latent vectors were less entangled, they’d be:
- More interpretable
- More compact (same representational power with fewer dimensions → save more memory)
- More amenable to controlled generation

I'm currently in search of this kind of approach. Maybe there are already loss functions designed to guide the model in this direction, but yeah, there might be more innovations waiting for us in the future to build a more efficient architecture that is both effective (containing meaningful features) and efficient (using low-dimensional vectors rather than high-dimensional ones).

---

## 3. Relative values > absolute values

Neural networks are surprisingly brittle to feature scale. Pass in a feature that ranges from $[0,1]$ and another that ranges from $[0,1000]$, and the latter will dominate gradient updates unless normalization steps in and treats each attribute differently.

Normalization is always an important and indispensable task in most machine learning problems we are trying to solve. In traditional supervised learning, you may want to normalize values that have different scales to the same scale, usually in the range $[0,1]$, to treat them equally and eliminate the influence from exceedingly large values coming from attributes that possess a large-scale domain value.

You also encounter this technique used in reinforcement learning. In such settings, we might want to normalize the reward signal that the agent receives to a much smaller scale to stabilize training, because stability is a holy grail in RL training. Sometimes, too-small reward values barely train the agents; other times, too-large values make the gradient flow so aggressive that it leads to exploding gradients and degrades performance.

---

## 4. Sparse structure

The traditional way of doing both training and inference is to activate all parameters in the network model. While using all the capabilities the network can provide, this method demands expensive computational resources—not to mention that there are some parameters that barely activate during the forward pass, which means we don't actually need to activate all of them. Therefore, as modern technologies appear, we are seeing more and more methods that leverage sparse structure in neural networks. All of them share the same mechanism: only activate a subset of parameters compared to the total capacity of the model, greatly speeding up inference and saving a lot of energy.

**Mixture of Experts (MoE)** is one of the strongest examples of this kind of optimization. This technique mainly wants to say that we use all parameters during training but only use a subset of around just 10% during inference. There was a time I was working with DeepSeek OCR just for my assignment in my NLP course. Although the model contains around 3B parameters, the correspondence with the model said that they only allow around 580M parameters to be activated during inference—just nearly $1/6$ of the total parameters. Therefore, we can experience a much shorter time before it generates its full output for us. Using all parameters for the task would undeniably consume much more time.

Apart from **MoE**, **Pruning** research shows most networks are heavily overparameterized and can lose 90% of their weights with minimal accuracy drop after training. This mindset of pruning things actually can be traced back to the Minimax algorithm and its Alpha-Beta pruning version. In the original algorithm, you would do a full traversal across the entire tree to predict what the opponent's next move will be, what our next moves will be, and what the opponent's next next move will be, all the way until we reach the final state of the game, get its utility score, and finally traverse back to the current state to choose the best next move. Noting that we can leverage useful information from sibling branches of the branch being considered, we can greatly reduce the need to traverse many unnecessary branches by pruning those branches. With this optimization, we can cut off nearly around $30-40\%$ of the entire tree and still get the same results.

Although pruning comes from a very simple idea and just a small observation on how we can leverage information to make better decisions instead of blindly discovering everything out there, this technique still remains hard to dissect and fully understand its capabilities under different scenarios. That said, dissecting its complexities across different situations still remains a challenge. Maybe I will do a little research on this topic and release a post for it :D

---

## 5. At different scales

In the natural world, we don't look at a forest and then wait a few seconds to load the entire tree. We perceive the texture of the bark and the vastness of the canopy simultaneously. Yet, in deep learning, we often force models to process information at a single resolution—one pixel or one token at a time—before downsampling through strides or pooling to find the bigger picture.

To see global patterns, we usually rely on tricks or depth: stacking dozens of layers, using dilated convolutions, or building complex feature pyramids and U-Net skip connections. These methods work, but they feel like a workaround rather than a fundamental design.

Imagine a model that doesn't need to get deeper to see more; instead, it processes the input once and extracts features at every scale in parallel. We see glimpses of this in how autoencoders produce varied representations at different bottleneck depths, or how cross-attention could, in theory, listen to multiple resolutions at once. By making multi-scale extraction a Day 1 priority, we might find that shallow, multi-scale networks can actually outperform the massive, single-scale giants we build today.

In my recent projects, multi-scale feature extraction is definitely one of the most effective techniques used to train encoders in my network, especially for vision tasks. Rather than just encoding at a single resolution from the input, we might want to try different alternatives for encoding representations, such as parallelizing feature extraction at different scales/resolutions simultaneously. There might be around 3 to 5 scales extracting features from the same image, with resolutions like: $[64, 96, 128, 256, 512]$. This way, we can provide the model with different lenses of the same images that it needs to see and understand, significantly giving the representations in the latent space much more informative signal for learning.

The main point of this idea doesn't only stop at extracting at different resolutions like this. We can also design some kind of architecture that captures the same input but with different perspectives, generally speaking. My example is about feature extraction for vision, so I think resolution or number of channels is the easiest one to think of, but we can try designing something similar for text or even multi-modal tasks.

---

## 6. Zero is an implicit expectation

This final hunch is a lesson I’ve carried over from reinforcement learning. You can even anticipate what I'm going to say with this header if you are also addicted to the beauty of reinforcement learning just like me. That being said, I'm still going to give a very whole-hearted explanation of what this idea is talking about :33.

In RL, we’ve learned that raw rewards are noisy and inefficient. Usually, they are affected greatly by the environment settings of the researchers in charge, or just maybe because of the nature of the environment. Some difficulties we might encounter: the environment gives rewards that have very large variance. Sometimes it's low (0.001 score), other times it skyrockets (99999999 scores) if the agent happened to do something great.

To counter this problem, we use **advantage**—the gap between what actually happened and what we expected would happen. By centering the signal around a meaningful baseline—depending on the specific task we are trying to solve at hand—we slash the variance and make learning much smoother. Because each task may have a different expectation tailored specifically to its nature, we can have a very low expected value for states in extremely difficult problems where the agent still fails consecutively for a very large number of tries, or we can have a very high expected one for piece-of-cake problems where the agent can learn blazingly fast how to complete the task with perfect score in just a short amount of time.

Therefore, setting up realistic baselines using expected values—different for each scenario—is incredibly better than using raw values, which, as we can see, is currently using zero as an implicit baseline.

To be continues...
---