---
layout: post
title: Discrete vs. Continuous and the Nature of Reality
subtitle: The divine battle between discrete and continuous
tags: [physics, mathematics, quantum-mechanics, classical-mechanics, discrete-math, continuous-math, philosophy-of-science]
comments: true
author: dzungphieuluuky
---

{: .box-success}
**Quick Notes:**  
This post examines the interplay between discrete and continuous concepts in mathematics and physics, tracing their historical development and applications across multiple fields.  

**The tension between discrete and continuous representations lies at the heart of our understanding of reality, evolving from Newton's smooth, continuous universe to the quantized world of modern physics, while mathematics traces the opposite path from discrete foundations to continuous abstractions. Personally, I find this phenomneon somehow myteriously interesting and catchy. My interpretation on the development of mathematics might be wrong but I just want to show some thoughts on this topic.**

## The Historical Divergence in Mathematics and Physics

In mathematics, discrete structures emerged first, rooted in ancient counting and number theory. Integers and finite sets formed the basis of early arithmetic, leading gradually to the development of continuous concepts through limits and infinitesimals.  
Conversely, physics began with Isaac Newton's classical mechanics, which modeled the world as infinitely divisible and continuous — position, velocity, and time flowing smoothly without sudden jumps. Nearly all the motion concepts we are talking about at this stage is differentiable and easy for us to track their changes across time.

As time progressed into the 20th century, physics underwent a paradigm shift with quantum mechanics, introducing discrete energy levels and quantized states in electrons and subatomic particles, which brought up huge confusion and misunderstanding for people of the time. This reversal highlights a profound philosophical question: Is reality fundamentally discrete or continuous, or a synthesis of both, just like how wave-particle duality of light works?

## Discrete and Continuous in Mathematics: Three Key Fields

Mathematics provides rigorous frameworks for both paradigms, often intertwining them.

### 1. Number Theory (Primarily Discrete)

Number theory focuses on integers and their properties, embodying discreteness through primes, divisibility, and modular arithmetic.

For example, the fundamental theorem of arithmetic states that every integer greater than 1 is a unique product of primes.

$$ n = p_1^{a_1} p_2^{a_2} \dots p_k^{a_k} $$

**Application:** Cryptography relies on discrete structures like RSA, where security stems from the difficulty of factoring large integers. Another applications is Diffie-Hellman algorithm, which also relies on discrete structures of numbers, specifically the difficulty of Discrete Logarithm Problem (DLP).

### 2. Calculus (Primarily Continuous)

Calculus deals with continuous change, using limits, derivatives, and integrals to model smooth functions over real numbers. This field provides a comprehensive framework to track and monitor the changes of nearly every smooth functions and operations, usually across time. Therefore, it is a compulsory subject/course for those interested or majored in physics or engineering.

The derivative represents instantaneous rate of change:

$$ f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} $$

**Application:** Optimization in machine learning, such as gradient descent, treating objective functions (often loss functions) as some continuous function to minimize/maximize based on the problem definition at hand. They also introduce topology related concepts into the field of deep learning optimization, treating meaningful embeddings or representations of variables as they are part of some manifolds that needs to be found to create intelligent systems.

### 3. Probability Theory (Bridging Discrete and Continuous)

Probability encompasses discrete distributions (e.g., binomial, Bernoulli, hypergeometric) and continuous ones (e.g., Guassian, Chi-square, Cauchy).

A discrete binomial mass probability function:

$$ P(k) = \binom{n}{k} p^k (1-p)^{n-k} $$

Versus continuous Gaussian density probability function:

$$ f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} $$

**Application:** Statistical inference in data science, where discrete events (coin flips) transition to continuous approximations for large samples via the central limit theorem. Continuous distributions are also used in modeling statistical thermodynamics. They facilitate our research by encompassing a large number of particles into one single block to provide macro view for what is happening, specifically transforming air particles' kinetic energy into temperature of the air being examined).

## Discrete and Continuous in Physics: Three Key Fields

Physics mirrors this duality, with classical theories favoring continuity and quantum theories introducing discreteness.

### 1. Classical Mechanics (Continuous Paradigm)

Newton's laws describe motion as continuous trajectories in space and time.

The second law: 
\\( F = m \frac{d^{2}x}{dt^2} \\) (as known as, the famous \\(F = ma\\)) solved via differential equations to describe the motion and trajectories of objects at normal scale and very slow speed in comparison with the speed of light.

**Application:** Orbital mechanics in aerospace engineering, modeling satellite trajectories as continuous curves. Research on motions of normal and day-to-day objects to provide comprehensive of how the world works and interacts with our daily lives.

### 2. Quantum Mechanics (Discrete Energy Levels)

Quantum theory quantizes energy, as in the hydrogen atom where electrons occupy discrete orbits and energy levels rather than possessing a continuous spectrum of energy.

Energy levels: \\( E_n = -\frac{13.6}{n^2} \\) eV, with \\( n \\) integer.

This discreteness emerged in the early 20th century and raise an undeniable amount of skepticisim and confusion especially for those who believed that Newtonian mechanics is enough to describe everything around us, even at subatomic scale.

**Application:** Semiconductor physics in electronics, where discrete band gaps enable transistors and LEDs. The discreteness of quantum mechanics introduce lots of interesting phenomenon and thoughts experiments, one of which is the Schrodinger's cat experiment, which tells us that there is some cat around the world that can live or die both at the same time before a ticking bomb ignites (you can find more about this on the Internet, surely its popularity has not decreased a bit).

### 3. Thermodynamics (From Continuous Macro to Discrete Micro)

Macroscopic thermodynamics treats gases as continuous fluids with properties like pressure and temperature.

Ideal gas law: 

\\( PV = nRT \\)

Microscopically, statistical mechanics reveals discrete particles following Boltzmann distribution.

**Application:** Computational fluid dynamics in engineering, simulating continuous flows, versus molecular dynamics simulations tracking discrete particle interactions.

## Synthesizing Discrete and Continuous: Toward a Unified Reality

In both disciplines, the discrete-continuous divide often blurs.  
Mathematics uses discrete approximations (finite differences) to solve continuous PDEs numerically.  
Physics employs wave-particle duality, where light behaves continuously (waves) or discretely (photons) based on different experiments setup, such as wave behaviour presenting in diffraction but particles properties are caught during Compton collision or photoelectric phenomenon.

Some signs of synthesis between the two:

1. **Numerical Methods (Math/Physics):** Finite element analysis discretizes continuous structures for engineering simulations.
2. **Quantum Field Theory (Physics):** Combines continuous fields with discrete particle excitations.
3. **Fractal Geometry (Math):** Self-similar structures that appear continuous at macro scales but reveal discrete patterns upon zooming.

$$ D = \frac{\log N}{\log (1/s)} $$ (Hausdorff dimension for fractals)

This interplay suggests reality may be neither purely discrete nor continuous but emergent from their interaction.

## Conclusion

The evolution from Newton's continuous universe to quantum discreteness reflects physics' adaptation to empirical evidence, while mathematics' path from discrete integers to continuous reals demonstrates conceptual expansion.  
By examining applications in number theory, calculus, probability (math) and classical mechanics, quantum mechanics, thermodynamics (physics), we see how these paradigms not only coexist but enrich each other, offering a more nuanced view of reality. The combination of discrete and continuous properties is increasingly becoming the new standard for us human race to understand how the world works and facilitates our mindset to have a more open interpretation on nearly everything, especially those interdisciplinary fields.

**Ultimately, the discrete-continuous dichotomy is not a division but a spectrum along the way with each one of them is at the extreme, where synthesis drives scientific progress and provide a more unified framework to see the world.**