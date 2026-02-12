---
layout: post
title: Why learning diffusion models?
subtitle: From chaos to order
cover-img:
thumbnail-img:
share-img:
tags: [personal, diffusion-models, generative-ai, physics]
author: dzungphieuluuky
---

# Introduction

Coming from a physics background, I’ve always been drawn to systems that mirror the elegant, continuous laws of nature. My journey through the National Physics Olympiad taught me to see the world through differential equations, fields, and flows—where change is smooth, predictable, and deeply mathematical.

When I first encountered deep learning, much of it felt like discrete pattern matching. Supervised learning was like memorizing a fixed catalog of answers. Reinforcement learning felt closer to life—learning by interacting, by trial and error—and soon enough it also became my interest in deep learning that I want to pursue further.

Then I discovered **diffusion models**, and something clicked. Here was a generative framework that didn’t just borrow metaphors from physics—it was built on the same mathematical principles I had spent years studying. Heat transfer, random walks, entropy, and the gradual smoothing of signals over time.

In this post, I want to share why diffusion models feel so natural to someone with a physics mindset, and why I believe they represent more than just a tool for image generation—they’re a bridge between how nature evolves and how machines create.

# Small reasons

## Watching noise turn into structure feels like a physics simulation

In supervised learning, you feed data in and get predictions out. It’s useful, but there’s no *process* to observe—no unfolding, no transformation, just direct input output pairs generated out of the blue for you, with no clearly interpretation if you are using very deep learning models especially. With diffusion, you start with pure Gaussian noise and watch it gradually sharpen into a coherent image, molecule, or sound waveform. It’s like watching a cloud of particles condense into a crystal, or heat diffusing in reverse. There’s something deeply satisfying about witnessing that emergence—it doesn’t just give you the answer, it shows you how the answer *forms* iteratively and the wonderful transformation from the garbage and chaotic samples from the very first time step to something majestic and beautiful.

## It’s a continuous, differential journey—not a discrete jump

Many generative models, like VAEs (Variational Autoencoder) or GANs (Generative Adversarial Network), map latent vectors to outputs in one or a few steps. Diffusion models work by taking hundreds of small, incremental steps—each governed by a learned gradient field (the score function). To someone used to solving differential equations in physics, this feels familiar. We’re not making a leap; we’re integrating along a vector field, tracing a smooth path from noise to a clear structure. The process is inherently continuous, iterative, and guided by local gradients—much like how physical systems evolve under external forces and can be described with Newton's laws of classic physcics to see how they change over time and what do their final states look like.

## You can literally see the “physics” in the training objective

The loss function in a diffusion model isn’t some abstract metric—it’s often a straightforward prediction of noise or gradient fields. When you train a model to denoise step by step, you’re essentially teaching it the *dynamics* of structure formation. It’s reminiscent of teaching a physics simulator the rules of fluid flow or heat diffusion, but here the “rules” are learned from data. The training process feels less like fitting a curve and more like discovering the underlying differential equation of the data manifold.

# Big reasons

## Diffusion is a physical process, repurposed for generation

In thermodynamics and statistical mechanics, diffusion describes how particles spread out from regions of high concentration to low concentration, increasing entropy until equilibrium. The forward diffusion process in these models is exactly that: we gradually add noise to data until it becomes pure Gaussian noise—maximum entropy.

The magic lies in the reverse. Learning to invert this process isn’t just a neat trick—it’s like learning the anti-diffusion operator, a way to *decrease entropy* in a controlled, learned manner from the data distributions through the training. This ties directly to the physics of non-equilibrium systems and Boltzmann distributions. For anyone who’s stared at the heat equation or Fick’s laws, seeing them power a generative model is nothing short of thrilling.

## It bridges continuous fields and discrete samples beautifully

In physics, we often describe phenomena in two ways: at the macro scale with continuous fields (temperature, pressure, density), and at the micro scale with discrete particles or states (electron energy levels, subatomic particles and quantized angular momentum). Diffusion models operate in a similar dual regime. The forward and reverse processes are defined in continuous time (via stochastic differential equations, yeah here is a very scary monster that I don't they even exist until I get my hands more dirty with diffusion models), yet they generate discrete, high-dimensional samples (images, audio, protein structures).

This continuous-time formulation isn’t just for show—it allows for flexible sampling, different step sizes, and even connections to optimal transport and fluid dynamics. It’s a framework where the tools of calculus and differential equations are first-class citizens.

## The score function is like a force field guiding creation

At the heart of diffusion models is the **score function**—the gradient of the log-probability density. In physics, gradients of potentials give us force fields: $$ \mathbf{F} = -\nabla \phi $$ In this equation, the $\phi$ acts as the potential energy of the system, the higher the potential energy, the more unstable the system becomes. With the minus sign, we want to say that any physical systems will try to process in a wwy that reduce its potential energy, release its instability to end up in a more stable state that can continue to exist. Here, the score function acts as a “data force field” that pulls samples toward high-probability regions.

During sampling, you start with noise and follow this learned gradient field, much like a particle moving under a force toward equilibrium. This perspective turns generation into a *physics-informed optimization*: you’re not just decoding a latent vector; you’re integrating a dynamical system.

# Fundamental challenges

These are some of the core conceptual and technical challenges in diffusion that make the field intellectually rich.

## The curse of slow sampling

Diffusion models are notoriously slow. Generating one image can take hundreds to thousands of neural network evaluations—one for each reverse step, this process can eat a large amount of your precious time. This is the price of a continuous, iterative process. Research into faster samplers (**DDIM**, **DPM-Solver**) is essentially about finding better numerical integration schemes for the underlying stochastic differential equation. It’s an optimization problem that feels like designing a better ODE solver—something physicists and applied mathematicians have been doing for centuries.

## How to choose the right noise schedule?

The forward process doesn’t have to add noise linearly. You can design schedules that add noise quickly at first and slowly later, or vice versa. The forward noising only tells us to use Gaussian distribution to destroy the samples to prepare for the recovery process, they don't tell us how to schedule our noise, which is regularly notated with $\beta$ notation in many textbooks about diffusion models. This is like designing a temperature annealing schedule in simulated annealing—another concept from statistical physics. The schedule affects both training stability and sampling quality, and finding the right one is part art, part science. It’s a hyperparameter search with a physical interpretation: how quickly should we heat up the data into noise?

## Accuracy vs. efficiency trade-off

In physics simulations, you often choose between a fast, approximate solver and a slow, accurate one. The same trade-off appears here. Fewer sampling steps (larger Δt) is faster but can lead to artifacts or mode collapse. More steps (smaller Δt) gives higher fidelity but costs more compute. Research in diffusion is actively exploring this Pareto frontier, seeking samplers that are both fast and faithful—a classic engineering challenge wrapped in a generative modeling skin. Also, fast samplers mentioned in the above section try to speed up the denoise process to actively reduce the number of inference steps in sampling without trade-off the quality of the outputs.

# The bigger picture: why this matters beyond images

It’s easy to see diffusion models as just another tool for making pretty pictures. But their real potential lies in their *formulation*.

Because they are built on continuous-time dynamics and score matching, they naturally extend to domains where data lives on manifolds or has continuous structure—like molecular conformations, audio waveforms, meaningful language generation or even policy distributions in reinforcement learning. Projects like **Diffusion Policy** in robotics are already showing this: using diffusion to model action sequences as smooth trajectories rather than discrete decisions.

For someone interested in both AI and the fundamental laws of nature, this is exciting. Diffusion models don’t just generate data—they implicitly learn the *geometry* and *dynamics* of the meaningful data manifolds among the vast data distributions of all possible combinations. They’re not just pattern matchers; they’re manifold learners, and in learning that manifold, they might be uncovering something about the structure of reality itself and maybe generating something unexpected that we have not expected.

---

# Conclusion

My journey into diffusion models feels like coming home. Here is a branch of machine learning that speaks the language of differential equations, statistical mechanics, and continuous transformation—the same language I learned from physics. This part of coming home somehow reminds me of the ability that can transform other people into subservient demons called **Domi Reversi** in One Piece :).

It’s more than a technical toolset. It’s a way of thinking about generation as a physical process, about data as a landscape of energy and gradients, and about intelligence as the ability to traverse that landscape with purpose.

We’re moving into an era where AI won’t just classify or predict—it will imagine, design, and create. And for that, we need models that understand not just patterns, but *process*. Diffusion models, with their roots in the physics of noise and order, feel like a step in that direction. Actually, among the process in dynamical systems that I have learnt, including: diffusion process, heat transfer and internal friction between fluid layers. Maybe one day, I would be the one that harness the powers of the two remaining processes that can blend its power into deep learning to bring us something new and powerful.

If you’re also fascinated by the intersection of continuous mathematics, physics, and generative AI, I’d love to connect. The conversation is just beginning.

---

*Recommended reading to dive deeper:*
- [**Yang Song’s blog and papers**](https://yang-song.net/) – for the clearest mathematical foundations of score-based and diffusion models. This guy can be considered to be one of the godfathers of diffusion-based generative modeling. If you are deeply interested in diffusion models, I highly recommend you to read all of his blogs and papers.
- [**Lilian Weng’s Lil’Log**](https://lilianweng.github.io/) – for concise, insightful summaries of diffusion research and beyond. Most of the precious contents that I need to revise on something without looking up for a specific section in any book can be found here with ease.
- [**UC Berkeley BAIR Blog**](https://bair.berkeley.edu/blog/) – for cutting-edge applications like Diffusion Policy in robotics. BAIR is undeniably considered to be one of the strongest labs in the world (or, they are the strongest) in the fields of deep reinforcement learning. It has given birth to many famous RL algorithms notably one of them is soft actor-critic for continuous action spaces.