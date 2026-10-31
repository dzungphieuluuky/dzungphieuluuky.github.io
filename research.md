---
layout: page
title: Research
subtitle: Learning mechanics, representations, and generative models
---

## Research Interests

### Deep Reinforcement Learning

Sample efficiency remains the central bottleneck in reinforcement learning. Current deep RL algorithms require millions of environment interactions to learn competent policies, far beyond what humans or animals need. I am interested in how model-based methods, particularly world models that learn compressed representations of environment dynamics, can close this gap. The idea of an agent that "dreams" to plan and learn—training on imagined rollouts from a learned latent dynamics model—offers a path toward sample-efficient exploration and credit assignment. Key questions I follow: how to balance exploration and exploitation under severe interaction budgets, how to design intrinsic reward signals that drive meaningful discovery, and how to transfer representations across tasks to avoid learning from scratch each time.

I admire David Silver (DeepMind, AlphaGo/AlphaZero, model-based RL) and Richard Sutton (author of Reinforcement Learning: An Introduction, foundational gradient and temporal-difference methods) deeply—much of my motivation in this area traces to their work on world models, sample-efficient exploration, and the mathematical structure of learning.
### Representation Learning

The quality of a learned representation determines what a model can and cannot express. I am interested in designing regularization techniques that encourage representations to be compact, disentangled, and transferable—without sacrificing capacity. Information fusion across modalities is a particular focus: how do we combine visual, linguistic, and structured data into a shared embedding space where each modality enriches the others rather than drowning them out? This connects to questions about invariance and equivariance—what should a representation preserve, and what should it discard? I find the interplay between information-theoretic principles (mutual information bottlenecks, rate-distortion trade-offs) and practical architectural design to be one of the most fertile areas in deep learning today.

### Generative Modeling

Generative modeling spans diffusion models, flow-based methods, Schrödinger bridges, and optimal-transport formulations. Diffusion approaches achieve state-of-the-art fidelity by gradually denoising structured noise, but their training dynamics remain poorly understood: why do certain noise schedules dominate, and what implicit regularization emerges from the score-matching objective? Flow models and continuous normalizing flows offer faster sampling by defining invertible transformations between distributions. Schrödinger bridges and entropy-regularized optimal transport provide a principled framework for learning dynamics that minimize cost between distributions, with applications in robotics—using generative processes to bridge simulation-to-reality gaps without fine-tuning. I am interested in how these paradigms intersect with representation learning and control to build sample-efficient, compositional generative systems.

---

*Last updated: July 2026*

