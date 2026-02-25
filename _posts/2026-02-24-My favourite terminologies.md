---
layout: post
title: My favourite terminologies
subtitle: Terminologies make up the fanciness for AI
cover-img:
thumbnail-img:
share-img:
tags: [machine-learning, personal]
author: dzungphieuluuky
---

Another late night. The screen's blue glow has that particular quality—intimate, almost conspiratorial—that comes when the rest of the city has surrendered to sleep. A diffusion paper blinks back at me, equations swimming in and out of focus. And there they are again, those words that keep appearing like recurring motifs in a long symphony, words that are so ubiquitous that appear everywhere in those literatures I read.

They're not jargon. Not academic decorations meant to impress or exclude. These words or terminologies indeed sound so fancy and likely to give engineer boredom and way too abstract compared to little details in engineering disciplines.

Now these terms bridge the abstract beauty of physics—the world I grew up competing in—and the generative worlds I'm chasing through self-study. They're the vocabulary of a new kind of inquiry, one that asks: what does it mean for a machine to learn, to represent, to create? And in asking, we find ourselves circling back to older questions: what does it mean for *us* to do the same?

Let's walk through them slowly. No hurry. The night is young, or old, depending on how you measure these things.

# Latent – hidden architecture

**Latent** comes from the Latin *latere*—to lie hidden. Concealed, not directly measured, yet somehow more essential than what presents itself to the senses.

In variational autoencoders, diffusion models, or just about any modern generative architecture, we compress high-dimensional data—millions of pixels, thousands of tokens—into a lower-dimensional **latent space**, personally I think the term somehow sounds really cringe and too fancy to translate to my mother tongue - Vietnamese. A quieter, more essential representation where noise is stripped away and core patterns emerge from the static. The model learns to encode the visible world into this hidden code. This hidden code acts as the general representatives for all the inputs that it has consumed, and to see their neighbors that did not appear directly in the inputs space but still possess considerable similarities with the original inputs. Then the models decode or denoise from it to create something that never existed before but feels like it should have. This output response, we can view them as the neighbors of the original inputs that we feed into our models. We can imagine that when we feed into the models an image of a dog, it can be any dog in this vast and beautiful world: husky, corgi, shiba inu,$\dots$. Then the model extract meaningful features from the raw inputs space and carry them to the latent space, where the actual understanding of the images are presented. After the model sees the distribution that the input images lie on, they can generate an ouptut conditioned on our signals (such as text prompts, reference images,$\dots$) that also lies in that same distribution, which in this case, might generate an image of another dog.

It reminds me of statistical mechanics during olympiad prep with phase changes of ideal gas and real gas from a state to another. We never tracked every particle since it is impossible, pointless and meaningless to do calculations rigorously for every particles in a block of air. Instead we worked with macroscopic summaries: temperature, pressure, entropy. These statistical properties act as the representatives of the whole gas and can give us meaningful information about the particles and the interaction between them without requiring us to dissect everything in details. Temperature gives us information about the kinetic energy of all particles as a whole rather than bothering ourselves with individual velocity of each particle. Pressure and entropy describe how those particles interact with each other and how disorder the system currently is. Latent variables do the same for images or trajectories. They're the thermodynamic potentials of the pixel world, free us from the hell of dissecting everything in details with little meanings obtained.

# Representation & Embedding – hidden geometry

**Representation** is the internal language a network invents for itself. Hierarchical features learned through exposure: edges, then textures, then parts, then objects, then scenes. Each layer abstracts further from the pixel, closer to the concept. The deeper we go into the model, the further it is from machine understanding, the closer it is to human's understanding.

**Embedding** makes that abstraction concrete—dense, low-dimensional vectors where semantic similarity becomes geometric proximity. Things that mean similar things live near each other in this vector space. We have such an incredible tool to describe how things relate and how similarities can be verified computationally rather than being described with human abstract languages. Two words that share the same meanings or strongly relate to each other in some aspects should create a small angle between them, thus show that the similarity between them is high in the representated space.

Word embeddings (Word2Vec, GloVe, fastText) are exactly what we're talking about. They are vectors that use so many numbers to represent the meanings of each word, sometimes just a few hundreds of numbers but can raise up to thousands of floating point numbers. "King" – "man" + "woman" ≈ "queen". That arithmetic has become the cornerstone when explaining vector space model for word embeddings for beginner who has just stepped into the world of language modeling. We can see from the arithmetic that when subtracting "King" for "man", we gained some attributes that describe the difference between the normal man and a king, that might be the dignity, benevolence or any ingredients that separate a male commoner from the governor of a country. When add that attribute to the "woman", we create a new word that describe a person that is a female and holds the government of a country in her hands, which results in "queen". The subtle and intangible nature of meanings in words seems to be tractable with the help of incomprehensively long vectors in a high-dimensional space, which seems too vague and meaningless to humans but meaningful to computers.

CLIP takes it further, and this is where it gets properly wondrous: images and captions now live in the *same* embedding space. Text saying "a photo of an astronaut riding a horse" gets embedded close to actual photos of that scene, which presumably don't exist until someone generates them. The model learned a shared conceptual coordinate system across modalities—vision and language, pixel and word—without anyone ever aligning them explicitly. It's like discovering that French and Mandarin share a deep grammar nobody bothered to write down.

Embeddings turn discrete symbols into continuous geometry. That shift—from one-hot sparsity to dense, meaningful vectors—still feels revolutionary to me, years after I first encountered it. It suggests that meaning itself might be fundamentally geometric, that the universe of concepts has a shape we're only beginning to map.

# Manifold – surface that holds most of the meanings

The **manifold hypothesis** is one of those ideas that seems obvious once you've heard it, and impossible before: high-dimensional data (a 512×512 image = 262,144 dimensions) actually lies on a much lower-dimensional curved surface embedded in that vast space.

Think of a piece of paper crumpled into a ball in three dimensions. From a distance, it occupies a volume. But up close, it's still intrinsically two-dimensional—every point has a local neighborhood that looks flat, even though the global shape is folded and compressed. The paper hasn't gained a dimension; it's just twisted the ones it has.

Real data is like that crumpled paper. A face in a million-pixel space isn't randomly distributed—it's constrained by the structure of faces: two eyes, one nose, symmetry, lighting, expression. The true degrees of freedom are far fewer than the pixels suggest. The manifold is the shape those constraints carve out.

Diffusion models learn to reverse-engineer that geometry. They start from isotropic noise—every point in the high-dimensional space equally likely—then walk backward step by step, following learned gradients until they land on the true data manifold. It's pure physics poetry: diffusion processes, Fokker-Planck equations, entropy gradients, all borrowed from statistical mechanics to generate cat photos or robot trajectories.

Visual intuition: data points tracing spirals or sheets, never uniformly filling the cube.

The manifold reminds me of general relativity, another love from those library nights. Spacetime tells matter how to move; matter tells spacetime how to curve. Here, the data distribution tells the model where to go; the model's traversal tells us the shape of the distribution. Geometry and information, entangled.

# Attractor – the destination

Borrowed from dynamical systems, an **attractor** is a set of states that nearby trajectories converge to over time. Drop a pendulum with friction anywhere in its swing, and it ends at rest hanging straight down—that point is an attractor. The Lorenz system's butterfly wings are a *strange attractor*—a set the system never leaves but never exactly repeats.

In recurrent networks, diffusion reverse processes, or even training dynamics, certain configurations act as attractors. The reverse diffusion walk is pulled toward high-probability regions of the data manifold—those are the attractors. During training, we sculpt the loss landscape so good solutions (accurate generations, correct classifications) become strong attractors, while bad ones (mode collapse, overfitting traps) become weak or unstable.

I think about attractors when I consider my own intellectual trajectories. Certain ideas keep pulling me back: the measurement problem in quantum mechanics, the nature of consciousness, the relationship between information and reality. No matter where I start, I end up circling these same questions. They're my strange attractors, the basins my mind keeps falling into.

During training, we sculpt the loss landscape so good solutions become strong attractors.

The same mathematics appears in chaos theory, in reinforcement learning value functions, in the dynamics of ecosystems and economies. The system "wants" to settle there. Not through intention, but through structure.

# Disentanglement – independent meanings

**Disentanglement** is the quest for latent representations where each dimension controls one meaningful, independent factor of variation. In β-VAEs or FactorVAEs trained on faces, one dimension might handle smile intensity, another glasses presence, another hair color—each knob turns one thing, and only one thing.

When it works—and it rarely works perfectly, which is part of the fascination—traversing a single latent axis produces clean edits: age changes without identity shift, pose changes without expression change. It's like finding the "true" basis vectors of reality instead of a rotated, mixed-up basis that confounds everything.

Disentanglement remains stubbornly hard. Real-world factors are correlated—smiling eyes change the whole face, age affects hair color, pose alters apparent expression. The model has to learn to separate what nature has tangled. But when a small model achieves even partial success, it feels like peeking behind the curtain of how the world is composed. Like discovering that the universe might actually have a clean factorization, if only we knew the right basis.

It's Plato's cave, upgraded for the deep learning age. The shadows on the wall are the entangled pixels; the disentangled factors are the Forms—the pure ideas casting those shadows. We're trying to learn the Forms from the shadows alone.

# Emergence – quantity leads to quality

**Emergence**: stack enough simple rules (neurons, gradients, next-token prediction), scale compute and data, and suddenly capabilities appear that no one explicitly programmed. Multi-step reasoning. Few-shot learning. Theory-of-mind-like behavior in large language models. Translation between languages never seen together in training.

Philip Anderson's 1972 essay "More Is Different" said it first: at each level of complexity, new properties appear whose behavior isn't reducible to the lower-level rules. Water freezing into hexagonal ice crystals: individual H₂O molecules follow local electromagnetic rules, yet global order—the six-fold symmetry, the lattice structure—emerges at the phase transition. You can't derive the ice crystal from the Schrödinger equation of a single molecule. More really is different.

Scaling laws in AI show the same phenomenon: abrupt jumps once certain thresholds are crossed. Performance doesn't improve smoothly; it plateaus, then leaps. The phase transitions of intelligence.

The philosophical weight here is considerable. If minds are emergent from neurons following electrochemical rules—if consciousness itself is an emergent property of enough simple processors interacting—then what are we witnessing in these models? Not claiming sentience, not yet. But the analogy demands pause. When enough complexity accumulates, new things become possible. Always has. Why would this stop now?

# Convergence & Divergence – eternal tension

**Convergence** is the optimizer descending into minima, loss flattening, training curves plateauing. Relief, then anxiety about overfitting, about whether the model has learned the data or just memorized it.

**Divergence** measures distance between distributions—KL, JS, Wasserstein—quantifying how far the generated world strays from the real one. Generative training minimizes divergence to the data, pulling the model's outputs toward the manifold of reality.

Yet exploration wants divergence. Reinforcement learning pushes policies away from safe-but-suboptimal attractors, seeking better performance in uncharted territory. The optimizer wants convergence; the explorer wants divergence. The whole training process is a negotiation between these opposing forces.

I feel the same tension in my own learning. Converge on fundamentals—master the basics until they're automatic, until the equations flow without conscious effort. Then diverge into new rabbit holes: category theory, neuroscience, generative audio, whatever looks interesting. Converge again. Diverge again. Without both, stagnation.