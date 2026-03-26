---
layout: post
title: Fancy concepts
subtitle: Terminologies make up the fanciness for AI
cover-img:
thumbnail-img:
share-img:
tags: [machine-learning, personal]
author: dzungphieuluuky
---

In this post, I would like to talk about some terminologies in artifical intelligence or machine learning in general that I find them most interesting and fancy enough to drive our attention towards this fast-pacing field of study. Whoever you are, undergraduate students, graduates, professor or just an independent researcher, you will find these terminologies ubiquitous and nearly everywhere you go, ranging from textbooks, tech reports, blogs to research papers.

# Latent

The term latent is derived from the Latin word latere, meaning to lie hidden. It refers to elements that are concealed and not directly measurable, yet are fundamentally more significant than what is immediately perceptible.

In the context of variational autoencoders, diffusion models, and other modern generative architectures, high-dimensional data (such as millions of pixels or thousands of tokens) is compressed into a lower-dimensional latent space. Personally, I find this term particularly sophisticated and challenging to translate into my native language, Vietnamese, where it is rendered as "không gian tiềm ẩn" or "không gian tiềm tàng." This latent space serves as a more refined representation, where extraneous noise is eliminated, allowing core patterns to emerge. The model learns to encode the observable world into this hidden code, which acts as a general representation for all the inputs it processes. This enables the identification of similar entities that may not be directly present in the input space but share significant similarities with the original inputs. The models then decode or denoise this latent code to generate outputs that, while novel, feel inherently plausible. For instance, when an image of a dog is input into the model, it can generate variations that, although not present in the original dataset, maintain the same perceptual characteristics that we, as human, can perfectly recognize.

These ideas remind me of the time while I was preparing for my physics olympiad competition, in thermodynamics dealing with phase changes of ideal gas and real gas from a state to another. We never tracked every particle since it is impossible, pointless and meaningless to do calculations rigorously for every particles in a block of air. Instead we worked with macroscopic summaries: temperature, pressure, entropy. These statistical properties act as the representatives of the whole gas and can give us meaningful information about the particles and the interaction between them without requiring us to dissect everything in details. Temperature gives us information about the kinetic energy of all particles as a whole rather than bothering ourselves with individual velocity of each particle. Since velocity itself is a vector, not a simple scalar like volume or area. Dissecting every single velocities in the block of air of every particles is impossible, and meaningless because the size of each particle is too small to make any great influence or impact even if we know exactly (which is impossible) how much its velocity are. Pressure and entropy describe how those particles interact with each other and how disorder the system currently is. Pressure helps us to avoid the bitterness of researching on each force created by the change in momentum of each particle, instead, we survey that same property through the lens of pressure of the whole gas. This workaround technique enables us to look into the total dynamics of the whole, how they are affecting and pushing the container on the outside and interaction with other gases. Latent variables do the same for images or trajectories. They're the thermodynamic potentials of the pixel world, free us from the hell of dissecting everything in details with little meanings obtained.

# Representation

**Representation** is the internal language a network invents for itself. Hierarchical features learned through exposure: edges, then textures, then parts, then objects, then scenes. Each layer abstracts further from the pixel, closer to the concept. The deeper we go into the model, the further it is from machine understanding, the closer it is to human's understanding.

**Embedding** makes that abstraction concrete—dense, low-dimensional vectors where semantic similarity becomes geometric proximity. Things that mean similar things live near each other in this vector space. We have such an incredible tool to describe how things relate and how similarities can be verified computationally rather than being described with human abstract languages. Two words that share the same meanings or strongly relate to each other in some aspects should create a small angle between them, thus show that the similarity between them is high in the representated space.

Word embeddings (Word2Vec, GloVe, fastText) are exactly what we're talking about. They are vectors that use so many numbers to represent the meanings of each word, sometimes just a few hundreds of numbers but can raise up to thousands of floating point numbers. "King" – "man" + "woman" ≈ "queen". That arithmetic has become the cornerstone when explaining vector space model for word embeddings for beginner who has just stepped into the world of language modeling. We can see from the arithmetic that when subtracting "King" for "man", we gained some attributes that describe the difference between the normal man and a king, that might be the dignity, benevolence or any ingredients that separate a male commoner from the governor of a country. When add that attribute to the "woman", we create a new word that describe a person that is a female and holds the government of a country in her hands, which results in "queen". The subtle and intangible nature of meanings in words seems to be tractable with the help of incomprehensively long vectors in a high-dimensional space, which seems too vague and meaningless to humans but meaningful to computers.

CLIP takes it further, and this is where it gets properly wondrous: images and captions now live in the *same* embedding space. Text saying "a photo of an astronaut riding a horse" gets embedded close to actual photos of that scene, which presumably don't exist until someone generates them. The model learned a shared conceptual coordinate system across modalities—vision and language, pixel and word—without anyone ever aligning them explicitly. It's like discovering that French and Mandarin share a deep grammar nobody bothered to write down.

Embeddings turn discrete symbols into continuous geometry. That shift—from one-hot sparsity to dense, meaningful vectors—still feels revolutionary to me, years after I first encountered it. It suggests that meaning itself might be fundamentally geometric, that the universe of concepts has a shape we're only beginning to map.

# Manifold

The **manifold hypothesis** is one of those ideas that seems obvious once you've heard it, and impossible before: high-dimensional data (a 512×512 image = 262,144 dimensions) actually lies on a much lower-dimensional curved surface embedded in that vast space.

Think of a piece of paper crumpled into a ball in three dimensions. From a distance, it occupies a volume. But up close, it's still intrinsically two-dimensional—every point has a local neighborhood that looks flat, even though the global shape is folded and compressed. The paper hasn't gained a dimension; it's just twisted the ones it has.

Real data is like that crumpled paper. A face in a million-pixel space isn't randomly distributed—it's constrained by the structure of faces: two eyes, one nose, symmetry, lighting, expression. The true degrees of freedom are far fewer than the pixels suggest. The manifold is the shape those constraints carve out.

Diffusion models learn to reverse-engineer that geometry. They start from isotropic noise—every point in the high-dimensional space equally likely—then walk backward step by step, following learned gradients until they land on the true data manifold. It's pure physics poetry: diffusion processes, Fokker-Planck equations, entropy gradients, all borrowed from statistical mechanics to generate cat photos or robot trajectories.

Visual intuition: data points tracing spirals or sheets, never uniformly filling the cube.

The manifold reminds me of general relativity, another love from those library nights. Spacetime tells matter how to move; matter tells spacetime how to curve. Here, the data distribution tells the model where to go; the model's traversal tells us the shape of the distribution. Geometry and information, entangled.

# Attractor

Borrowed from dynamical systems, an **attractor** is a set of states that nearby trajectories converge to over time. Drop a pendulum with friction anywhere in its swing, and it ends at rest hanging straight down—that point is an attractor. The Lorenz system's butterfly wings are a *strange attractor*—a set the system never leaves but never exactly repeats.

In recurrent networks, diffusion reverse processes, or even training dynamics, certain configurations act as attractors. The reverse diffusion walk is pulled toward high-probability regions of the data manifold—those are the attractors. During training, we sculpt the loss landscape so good solutions (accurate generations, correct classifications) become strong attractors, while bad ones (mode collapse, overfitting traps) become weak or unstable.

I think about attractors when I consider my own intellectual trajectories. Certain ideas keep pulling me back: the measurement problem in quantum mechanics, the nature of consciousness, the relationship between information and reality. No matter where I start, I end up circling these same questions. They're my strange attractors, the basins my mind keeps falling into.

During training, we sculpt the loss landscape so good solutions become strong attractors.

The same mathematics appears in chaos theory, in reinforcement learning value functions, in the dynamics of ecosystems and economies. The system "wants" to settle there. Not through intention, but through structure.

# Disentanglement

**Disentanglement** is the quest for latent representations where each dimension controls one meaningful, independent factor of variation. In β-VAEs or FactorVAEs trained on faces, one dimension might handle smile intensity, another glasses presence, another hair color—each knob turns one thing, and only one thing.

When it works—and it rarely works perfectly, which is part of the fascination—traversing a single latent axis produces clean edits: age changes without identity shift, pose changes without expression change. It's like finding the "true" basis vectors of reality instead of a rotated, mixed-up basis that confounds everything.

Disentanglement remains stubbornly hard. Real-world factors are correlated—smiling eyes change the whole face, age affects hair color, pose alters apparent expression. The model has to learn to separate what nature has tangled. But when a small model achieves even partial success, it feels like peeking behind the curtain of how the world is composed. Like discovering that the universe might actually have a clean factorization, if only we knew the right basis.

It's Plato's cave, upgraded for the deep learning age. The shadows on the wall are the entangled pixels; the disentangled factors are the Forms—the pure ideas casting those shadows. We're trying to learn the Forms from the shadows alone.

# Emergence

**Emergence**: stack enough simple rules (neurons, gradients, next-token prediction), scale compute and data, and suddenly capabilities appear that no one explicitly programmed. Multi-step reasoning. Few-shot learning. Theory-of-mind-like behavior in large language models. Translation between languages never seen together in training.

Philip Anderson's 1972 essay "More Is Different" said it first: at each level of complexity, new properties appear whose behavior isn't reducible to the lower-level rules. Water freezing into hexagonal ice crystals: individual H₂O molecules follow local electromagnetic rules, yet global order—the six-fold symmetry, the lattice structure—emerges at the phase transition. You can't derive the ice crystal from the Schrödinger equation of a single molecule. More really is different.

Scaling laws in AI show the same phenomenon: abrupt jumps once certain thresholds are crossed. Performance doesn't improve smoothly; it plateaus, then leaps. The phase transitions of intelligence.

The philosophical weight here is considerable. If minds are emergent from neurons following electrochemical rules—if consciousness itself is an emergent property of enough simple processors interacting—then what are we witnessing in these models? Not claiming sentience, not yet. But the analogy demands pause. When enough complexity accumulates, new things become possible. Always has. Why would this stop now?