---
layout: post
title: Some incomplete ideas over here
subtitle: Interesting patterns for architectural innovations
cover-img: 
thumbnail-img: 
share-img: 
tags: [deep-learning, research-ideas, architecture, interpretability]
author: dzungphieuluuky
---

I’ve spent the past year teaching myself deep learning and reinforcement learning outside of coursework.

Around February 2025, while taking Operating Systems as one of my courses at that time, I decided to finally work through Reinforcement Learning: An Introduction by Sutton and Barto. At the same time, I was taking a probability theory course. It turned out to be perfect timing to learn about distributions and what will they look like in the real world of world class research, rather than some toy problems we meet in textbooks.

RL, at its core, is a sea of distributions.

There are state distributions that describe how the environment behaves—what configurations it can be in, what it tends to do. From these states, the agent selects actions. Sometimes deterministically, sometimes stochastically. Once it acts, we get a next-state distribution: given where we were and what we did, where do we land? Which states become more likely in the vast space of possible states that the environment contains? Which become unreachable? Then the environment returns a reward, which is also a draw from some distribution—sometimes fixed, sometimes random, always informative. This reward value is regularly a deterministic value and it is usually notated as $$R(s, a, s')$$
Notice that $s, a, s'$ are the current state the agent was in, the action that the agent selected and the result next state depending on this selection. Writing these 3 concepts in that order from left to right feels natural to read and easier to remember what are their roles.

The reward is the learning signal. It's the compass that guides the agent toward better decisions, toward states that are more valuable, toward behaviors that persist.

Distributions all the way down. State distributions, action distributions, next-state distributions, reward distributions, return distributions. Learning RL while wrestling with probability theory wasn't an extra burden. It was symbiotic. The math I learned in one place gave me language for the other.

---

Most of my time this past year hasn't been spent building things that work. It's been spent absorbing.

Reading papers. Running experiments that fail. Staring at loss curves that refuse to descend—or descend for a while and then spike violently, erasing hours of training in seconds. The instability of deep RL is infamous. It's always around the corner, waiting to sabotage a promising run. You learn to recognize the signs. The gradient norm suddenly inflating. The value estimate diverging to infinity. The policy collapsing to deterministic stupidity.

But lately, I've started noticing patterns.

Not in the results—most of my results are still garbage. But in the design. Certain architectural choices keep appearing in systems that feel right. Clean. Stable. Scalable. Not the systems that achieve SOTA on some benchmark and then vanish, but the ones that persist. The ones that get reused, repurposed, absorbed into the collective toolbox.

These aren't research claims. They're small tips and tricks. Intuitions that crystallized during late-night debugging sessions, while waiting for another run to crash.

I'm writing them down to clarify my own thinking. Maybe they spark something for you too. Maybe they're completely wrong. Either way, writing helps. Actually, "you" I'm talking about here is actualy my future-self.

This post will keep growing. I add to it when I notice something new. Consider it permanently in to be continued mode.

---

## 1. Where to compute

Processing raw inputs is expensive.

An image is millions of pixels. Most of those pixels are redundant—adjacent values, repeated textures, irrelevant backgrounds. A text sequence is thousands of tokens, but the information density is low. The meaning of a sentence doesn't live in every character; it lives in the relationships between words, in syntax, in semantics.

Yet most of what matters for a task can be represented in far fewer dimensions than the raw input occupies. This is not a coincidence. It's a property of the world we model. Natural data is compressible.

Diffusion models make this painfully clear. Generating images by processing every pixel through every denoising step is computationally brutal. Each step requires a full forward pass through a U-Net operating on tens of thousands of pixels. There are all kinds of blocks inside U-Net: downsampling, upsampling, average pooling, max poling, convolutional layers with many different strides, dilations and kernel sizes.

The solution? Don't.

Encode the image into a lower-dimensional latent vector. Do the heavy lifting there—the denoising, the sampling, the iterative refinement. Decode at the end, once, when you're done. This is how Stable Diffusion works. It's why latent diffusion models replaced pixel-based ones almost overnight. The insight wasn't that latents are better representations. It was that computation should happen where the data is smallest.

We don't fully understand the geometry of latent spaces. They're high-dimensional and weird—curved manifolds with non-intuitive distance metrics, directions that don't align with semantic axes, regions that map to gibberish. But we can still use them as compact encodings. Bottlenecks that condense what matters into something processable.

The idea: Move the core computation—planning, reasoning, simulation, search—into latent space. Use the encoder to get there, the decoder to leave, and do everything important in between on compressed representations.

This already works for generation. Could it work for other things?

- Robot policies that operate on perceptual latents instead of raw camera feeds, so they can reason about scenes without rendering every pixel.
- World models that plan entirely in learned latent dynamics, simulating trajectories not in ground truth state space but in a compressed approximation of it.
- Multimodal systems that reason in a shared compressed space, translating between modalities without leaving the manifold.

The hard part isn't compression. We know how to compress. The hard part is: what makes a latent space good for computation, not just compression?

A latent space that's good for reconstruction isn't necessarily good for planning. A latent space that's good for classification isn't necessarily good for control. We don't yet know what properties matter when we want to manipulate representations rather than just decode them.

---

## 2. Latent spaces

We talk about latent dimensions as if they encode features. As if the first coordinate corresponds to "has wheels" and the second to "is red" and the third to "facing left."

There's no guarantee of this. None.

Multiple dimensions might capture variations of the same attribute, redundantly encoding the same information because the loss found a local optimum that spreads representations across many coordinates. A single dimension might entangle several concepts—color, orientation, and category all mixed together in a single float that resists interpretation.

We comfort ourselves by saying compression saves compute. True. But we still don't know which coordinate corresponds to which property. Color? Shape? Texture? Something we haven't even named because our language doesn't have categories for the kinds of features neural networks discover? We can't dissect it. We can probe it, intervene on it, measure its effect on outputs—but we're always guessing, always reverse-engineering something that was never designed to be legible.

This bothers me.

In linear algebra, a basis spans a space with no redundancy. Every vector contributes something unique. Together, they form a minimal generating set—you can't remove any vector without losing the ability to represent some part of the space.

A generating set can also span the space. It contains enough vectors to represent everything. But it contains overlap. Redundancy. Waste.

Our latent representations are generating sets.

They work, but they're messy. Some redundancy is fine—it can even help with robustness, providing backup pathways when some dimensions are corrupted or noisy. But uncontrolled redundancy means we're using more dimensions than necessary, and we can't interpret what those dimensions actually represent.

What would less redundant latents look like?

Not strict orthogonality. Enforcing orthogonal weight matrices kills expressivity—it's too rigid, too constrained. But soft pressure toward dimensions that capture distinct, minimally overlapping factors of variation? That's attractive.

People have tried this before, in various forms:

- Sparse coding, where each input is represented by a small subset of basis vectors.
- Independent component analysis, which seeks statistically independent components.
- β-VAE and other disentanglement losses, which penalize dependence between latent dimensions.
- Information bottleneck methods, which compress away task-irrelevant variation.

None of these have scaled successfully to large modern architectures. Not really. The losses are unstable, the trade-offs are harsh, and the benefits often disappear at scale. But the goal is still attractive:

- More interpretable latents. Dimensions that actually correspond to something we can name.
- More compact representations. Same representational power with fewer dimensions.
- More controllable generation. Targeted edits without collateral damage to unrelated attributes.

I don't know how to do this at scale. But I keep wishing we could.

---

## 3. Relative > absolute

Neural networks are surprisingly sensitive to scale.

Pass in one feature that ranges from 0–1 and another that ranges from 0–1000, and the second will dominate gradient updates. Not because it's more important. Because it's numerically bigger. The network doesn't know that the units are different. It just sees large numbers and assigns large weights, then spends the rest of training trying to unlearn that initial mistake.

We fix this with normalization. BatchNorm, LayerNorm, all the Norms. They rescale activations to have consistent statistics across channels, across batches, across time. They're not just optimization conveniences—they're structural necessities. ResNet without BatchNorm doesn't train. Transformer without LayerNorm doesn't converge.

Reinforcement learning offers a sharper version of the same lesson.

Raw rewards are noisy. High-variance. Environment-dependent. A reward of +1 in one environment might be equivalent to +1000 in another, depending on how the designer scaled things. Optimizing directly against raw returns is like trying to steer a ship by watching individual waves instead of reading the compass.

The solution is the advantage function:

$$
A(s,a) = Q(s,a) - V(s)
$$

Instead of learning from the raw reward, learn from how much better things went than expected. Center the signal around a baseline. The baseline doesn't have to be perfect—it just has to be correlated enough with the true expectation to reduce variance.

This isn't a trick. It's a shift in how we think about learning signals.

Absolute values are brittle. They depend on arbitrary scales, arbitrary offsets, arbitrary units. Deviations from expectations are stable. They isolate the information in the signal from its context.

The same pattern shows up everywhere:

- Residual networks learn deviations from identity. The default behavior—the baseline—is to pass the input through unchanged. The network only needs to learn the delta.
- Reward normalization rescales returns to have zero mean and unit variance, removing environment-specific scaling.
- Contrastive losses compare relative similarity, not absolute labels. An image is more similar to its augmented version than to a different image.
- Centered activations shift distributions to have zero mean, improving gradient flow through saturating nonlinearities.

Zero is the default baseline everywhere. It's convenient. It requires no computation, no estimation, no learning.

But it's rarely optimal.

Making that baseline explicit and learnable—estimating $V(s)$ instead of assuming it's zero, learning the residual instead of the full mapping—almost always helps. It's not about the specific mathematical form. It's about the principle: tell the network what's normal, so it can focus on what's surprising.

---

## 4. Sparse structure

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

## 5. At multiple scales

When you look at a forest, you don't render individual leaves first, then branches, then trees, then the canopy.

You see texture and structure at all scales simultaneously. The grain of the bark. The pattern of branches against the sky. The shape of the canopy. These aren't processed sequentially. They're perceived in parallel, integrated into a single coherent experience.

Most vision architectures don't work this way.

They process at a single resolution. Usually high. Then they progressively downsample—strides, pooling, convolutions with increasing dilation—to recover global structure through depth. Information flows bottom-up, from fine details to coarse abstractions, through dozens of layers.

It works. It's the foundation of modern computer vision. But it feels indirect.

Why force the network to reconstruct wide-angle views from pinhole inputs? Why require depth to see the big picture?

What if multi-scale processing was a Day 1 design decision?

Not an emergent property of deep stacking. Not something the network has to learn to do over many layers. But a structural constraint: the input is processed at multiple resolutions from the very first layer, and these parallel streams are integrated throughout the network.

Examples already exist, scattered across the literature:

- Feature pyramids and U-Net skip connections, which combine coarse semantic features with fine spatial details.
- Parallel encoders operating at different resolutions, their outputs concatenated or attentively fused.
- Cross-scale attention, where tokens at one scale attend to tokens at another.
- Hierarchical transformers with nested context windows.

In my own projects, I've found that parallel encoders processing the same image at multiple resolutions consistently outperform single-scale baselines.

Take an input image. Generate downsampled versions at resolutions like [64, 96, 128, 256, 512]. Pass each through a separate encoder stream—or share weights across streams, tied convolutions, something learned. Fuse the resulting representations through concatenation, attention, or learned weights.

The low-resolution stream captures global structure. The high-resolution stream preserves fine details. Together, they provide complementary information that depth alone struggles to reconstruct.

Each scale is a different lens. A different aperture. A different answer to the question: what matters in this image?

This principle isn't just about vision.

For text, vary the context window size. Or the granularity of tokenization—characters, subwords, words, phrases. For time series, vary the temporal resolution—milliseconds, seconds, minutes, hours. For graphs, vary the neighborhood radius—immediate neighbors, two-hop neighborhoods, community structure.

The principle: Don't force your model to reconstruct wide views from narrow inputs. Give it multiple apertures from the start.

---

## 6. Zero is an implicit baseline

Reinforcement learning taught me this.

Raw rewards are messy. They spike when the agent discovers something good. They vanish when the environment enters a low-reward region. They depend entirely on how someone configured the reward function—the scaling, the clipping, the sparse vs. dense design choices.

Optimizing policy gradients directly against raw returns is painful. The variance is enormous. A single lucky trajectory can dominate an entire batch. The signal-to-noise ratio is abysmal.

The fix: subtract a baseline.

Learn what you expect to happen—the value function $V(s)$, the average return from this state. Then learn from the gap between expectation and reality. The advantage. The residual. The surprise.

This slices variance. It centers the learning signal around zero. It stabilizes training.

But the deeper pattern isn't about RL. It's about baselines.

Many of our systems implicitly assume zero is the right baseline. It almost never is.

- Residual connections assume identity is a reasonable default. The network only needs to learn the deviation. But is identity actually a good prior? For some tasks, yes. For others, no. The assumption is baked in.
- Centered activations assume zero mean helps optimization. This is empirically true for many architectures, but it's still an assumption about the optimal distribution of pre-activations.
- Contrastive losses assume relative comparison is more stable than absolute prediction. Instead of predicting a class label, predict which of two samples is more similar to a query.
- Normalization layers assume that rescaling to zero mean and unit variance is beneficial. They learn affine parameters to undo this if needed, but the default is zero.

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