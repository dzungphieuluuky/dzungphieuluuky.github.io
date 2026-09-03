---
layout: post
title: Road to Novelty
subtitle: System thinking for novel innovations
cover-img:
thumbnail-img:
share-img:
tags: [learning-journey, deep-learning]
author: dzungphieuluuky
---

- When reading a paper, wherever a technique is used without a clear explanation why they use it, that's a research gap. Either the technique is effective by the collective wisdom, or they has no careful consideration about it, or it's just so intuitive that the job of asking about its effectiveness seems to be ignored subconsciously.

- Transform data/observations from raw input space to another space before further processing. Fourier, Laplace, Z-transform, everything seems plausible for the current task, because in another space we might be able to disentangle things that heavily intertwined in the raw space.

- For each loss function that based on close form formula such as Fourier coefficients, use their derivatives to create new loss functions to supervise their rate of change, might possibly enable smooth performance

- Use random Monte Carlo simulation as alternative to avoid backpropagating through time. Never backprop through long chains since it will cause gradients instability and vanishing. 

- Bring innovations from other domains to the current domain: nlp, speech, audio, video, image => robot policy, representation learning.

- Learn random advanced maths to seek for inspiration: Koopman representation, spectral decomposition, differential geometry, information geometry, etc.

- Transform old ideas from its unprincipled to principled form, enables explicit objective optimization, no more implicit constraints. A few examples: 
    - Moving from noise prediction in diffusion models to velocity fields in flow matching models. no more blindly denoising with noise that locally at each state, but learn a principled and direct velocity field at every point so that we can determine the next state immediately by the ODE.
    - Migrate from consistency models to meanflow models. Instead of learning the implicit constraints for one step generation, learn the average velocity field directly to determine final state right away. Enforcing the consistency constraints make the training less transparent, harder to understand and lack a clear objective to learn.
    - Migrating from EMA target to something else that would have a transparent objective for the model to learn, leave for future research


