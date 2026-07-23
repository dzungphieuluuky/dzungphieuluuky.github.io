---
layout: page
title: Research
subtitle: Learning mechanics, representations, and generative models
---

## Publications

Publications forthcoming.

Format template for future entries:

> [Year] **Title** — Venue. [PDF] [arXiv] [Code]

---

## Research Interests

### Deep Reinforcement Learning

Sample efficiency remains the central bottleneck in reinforcement learning. Current deep RL algorithms require millions of environment interactions to learn competent policies—far beyond what humans or animals need. I am interested in how model-based methods, particularly world models that learn compressed representations of environment dynamics, can close this gap. The idea of an agent that "dreams" to plan and learn—training on imagined rollouts from a learned latent dynamics model—offers a path toward sample-efficient exploration and credit assignment. Key questions I follow: how to balance exploration and exploitation under severe interaction budgets, how to design intrinsic reward signals that drive meaningful discovery, and how to transfer representations across tasks to avoid learning from scratch each time.

### Representation Learning

The quality of a learned representation determines what a model can and cannot express. I am interested in designing regularization techniques that encourage representations to be compact, disentangled, and transferable—without sacrificing capacity. Information fusion across modalities is a particular focus: how do we combine visual, linguistic, and structured data into a shared embedding space where each modality enriches the others rather than drowning them out? This connects to questions about invariance and equivariance—what should a representation preserve, and what should it discard? I find the interplay between information-theoretic principles (mutual information bottlenecks, rate-distortion trade-offs) and practical architectural design to be one of the most fertile areas in deep learning today.

### Diffusion Generative Modeling

Diffusion models have redefined what is possible in generative modeling, achieving state-of-the-art fidelity across images, audio, and molecular structures. But their training dynamics are still poorly understood: why do certain noise schedules work better than others? What implicit regularization emerges from the denoising objective? Beyond media generation, I am interested in applying diffusion-based methods to robotics—specifically, using diffusion models to bridge the simulation-to-reality gap. If a policy trained in simulation can be refined by a diffusion process that gradually removes systematic domain shifts, we might achieve zero-shot or few-shot sim-to-real transfer. This sits at the intersection of generative modeling, control, and representation learning.

---

## Ongoing Projects

### Learning Mechanics

A conceptual framework for understanding how learning algorithms interact with the structure of their loss landscapes. Drawing analogies from statistical physics, this project explores how gradient dynamics, curvature, and noise shape the solutions found by deep networks. [More on the homepage →](/)

## Representation Quality Metrics

Developing quantitative measures for evaluating learned representations beyond downstream task performance. The goal is to build diagnostic tools that reveal when a representation is overfitting to spurious correlations, collapsing modalities, or failing to capture task-relevant structure. [More on the homepage →](/)

## Sim-to-Real via Diffusion

Investigating whether diffusion models can serve as a bridge between simulated and real environments for robotic manipulation. The core idea: train a diffusion process on paired simulation–real data to translate simulated observations into realistic counterparts, enabling policies trained entirely in simulation to transfer without fine-tuning. [More on the homepage →](/)

---

*Last updated: July 2026*
