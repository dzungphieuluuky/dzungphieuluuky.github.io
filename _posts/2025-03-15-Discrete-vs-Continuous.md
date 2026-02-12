---
layout: post
title: Discrete vs. Continuous?
subtitle: The divine battle between discrete and continuous
tags: [physics, mathematics, quantum-mechanics, classical-mechanics, discrete-math, continuous-math, philosophy-of-science]
comments: true
author: dzungphieuluuky
---

Ever since my high school days wrestling with physics, I’ve been fascinated by a quiet tension running underneath everything we learn. On the surface, physics feels beautifully continuous—smooth curves, flowing time, differential equations describing how planets glide and pendulums swing. Calculus, with its infinitely small steps, seemed to be the native language of the universe. From the perspectives of a high school student that possesses great amount of passion for physics, I thought that every process in the world could be described by the smooth and continuous functions under the framework of physics, as the scientists in Newton era once thought. 

Then came quantum mechanics, and the floor fell out. Suddenly, at the subatomic level, things *jumped*. Energy came in chunks, electrons occupied specific orbits, and the smooth, predictable world of Newton fractured into something discrete and probabilistic. It felt like the universe had two different sets of rules, and I couldn’t stop wondering: which one is more *real*? Or,maybe we can have another question, which one will be the main orchestrator for a given phenomenon, does quantum physics also manifest itself elsewhere besides the subatomic scale of particles like electrons? And the most seemingly popular question in general physics whether we can unify these two ideas into one single framework that can perfectly describe every phenomenon from microscale to the universal scale?

In my free time, I kept circling back to this idea. Discrete and continuous aren’t just math concepts or physics tools—they feel like two fundamental, almost philosophical, lenses for understanding reality itself. One is granular, countable, digital. The other is fluid, seamless, analog. Our entire body of knowledge seems to rest on this duality.

## A seemingly divergence between mathematics and physics

It’s funny how their stories unfolded in opposite directions. This is only my own observations according to my own knowledge, so perhaps not everything said here is right.

Mathematics started with the discrete. Ancient humans counted stones, tracked moons, and carved tallies. Numbers were whole things. The idea of a smooth, continuous line—a number line where you could point to a value between any two others—came much later, a triumph of abstraction through limits and infinitesimals.

Physics took the opposite path. Isaac Newton gave us a powerful framework to analyze continuous functions and changes, along with Leibniz, gave us a len that we can observe and dissect how the  continuous universe works mathematically. Time flowed, space was infinitely divisible, and motion was described by smooth, differentiable functions. For centuries, this continuous view worked astonishingly well. It built our engineering, powered the Industrial Revolution, and sent us to the moon.

Then the 20th century arrived, and quantum mechanics turned everything on its head. Energy, angular momentum, even light itself became quantized—discrete. The very foundation of physical reality seemed to shift from a flowing river to a series of precise, tiny steps. In that strange world, micro things such as particles, electrons or even light themselves are not a continuous flow of energy anymore but rather a discrete stream of separate quanta - a single unit that contains a fixed amount of energy.

This reversal has always struck me as deeply meaningful. It’s as if mathematics built upward from the discrete to imagine the continuous, while physics, probing deeper into nature, discovered the discrete hiding within what it thought was continuous. It makes you ask: is reality built from a digital substrate, with continuity just a convenient illusion at our scale? Or is continuity fundamental, with discreteness being a limitation of how we measure? Regardless of which perspectives we choose to view, they seems to be two face of the same coin and will coexist with each other in any phenomenon, the final problem is which face we are allowed to see in the given phenomenon.

## In mathematics

Math doesn’t pick a side—it gives us full, rigorous toolkits for both, and often blends them.

### 1. Number Theory

Here, we live in the world of integers. Primes, divisibility, modular arithmetic—it’s all about distinct, separate objects. There’s no “half a prime number.”

Take the fundamental theorem of arithmetic: every integer greater than 1 is a unique product of primes.

$$ n = p_1^{a_1} p_2^{a_2} \dots p_k^{a_k} $$

It’s a statement of pure discreteness. This isn’t just academic; it’s the bedrock of modern cryptography. The security of RSA encryption leans entirely on the discrete difficulty of factoring large integers back into their prime pieces.

### 2. Calculus

This is where change becomes smooth. Calculus is the mathematics of flows, slopes, and accumulated quantities. It asks questions like, “What is the *instantaneous* rate of change?” and answers them with the limit:

$$ f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} $$

That tiny $h$ approaching zero embodies the ideal of continuity. I find that the concept of approaching quite interesting and hard to grasp especially for those who has just encountered this guy for the first time. Today, this isn’t just for physicists. It’s the engine of optimization in machine learning. Gradient descent treats a complex loss function as a continuous landscape, rolling downhill to find the lowest point. In some books and papers I have read, there is a very interesting view on datasets when training large machine learning models. In that view, the whole data that we can theoretically gather in the universe is lying on some mysterious distribution that is considered to be intractable because there are infinitely possible combinations of sample and their features respectively to create that dataset. In the dataset, our desired data, those we want the deep learning models especially the generative ones, to be able to generate for us, say, an image of a dog or a cat or perhaps some strange creatures based on our description in text, seems to lie on some manifolds, which can be intuitively viewed as a subset of the space that the whole dataset represent. And our lifelong mission when training a model is to teach them how to find that manifolds to do something meaningful for us, because only those meaningful and truly useful lie on that manifolds.

### 3. Probability Theory

Probability gracefully straddles the divide. Some things are inherently discrete: you can flip a coin 3 times, and get 0, 1, 2, or 3 heads—no in-between.

$$ P(k) = \binom{n}{k} p^k (1-p)^{n-k} $$

Other things are continuous: the exact height of a person, the time until a radioactive atom decays. These are modeled by smooth curves like the Gaussian:

$$ f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} $$

And the magic is, they talk to each other. The central limit theorem uses a *discrete* event (like a coin flip) to build a *continuous* distribution (the normal curve) when you repeat it enough, of course `enough` here means something very large, very diverse so that the convergence may happen. It’s the same trick statistical mechanics pulls: using the discrete motion and kinetic energy  of countless particles to explain the continuous pressure and temperature of a gas as a whole without suffering the pain of dissecting and analyzing each particles separately because it would be impossible to do such things. In a small amount of gas, there are already billions of air particles or even more, which makes us think that the contribution of each particles to the whole is so small that we can easily neglect them without any drawbacks, but that would be wrong if we neglect them all, then the gas would be completely nothing, no different from a vacuum. This topic actually give me some ideas on philosophy where tiny elements of a whole would make seemingly no significant contribution, but ignore all of them would end up in zero gains, zero observation of the whole. Then perhaps there would be some critical point in the middle which would tells us whether we have crossed the line yet?

## In physics

Physics mirrors this dance, with each paradigm dominating its own domain.

### 1. Classical Mechanics

This is Newton’s world, and it feels intuitive. Forces cause smooth acceleration ($F = m \frac{d^2x}{dt^2}$). Planets trace out elegant, continuous ellipses. We model satellite trajectories and the swing of a bridge in this language of differential equations, trusting that space and time are infinitely divisible. Since classical mechanics covers a lot of fields in physics, such as motion and dynamics of point of matter to the dynamics of rigid bodies and planets of the universe. This field in physics is considered to be the most intuitive, say, nearest to our daily lives. My teacher once told me that he even come up with new problems on classical mechanics while he was attending to a political training course of the Party, just because he felt the course, the lecture, so boring and he needs to find something else to do to bring up his emotions, and creating new problems that he find interesting is definitely the choice. That's why when I was preparing for the national physics olympiad, we had so many problems to work with, ranging from one to many rigid bodies in motion together.

### 2. Quantum Mechanics

Then you peer inward, and the rules change. In an atom, an electron can’t have just any energy. It’s restricted to specific, discrete levels:

$$ E_n = -\frac{13.6}{n^2} \text{ eV} $$

That $n$ is an integer—1, 2, 3, no 2.5 allowed. This discreteness wasn’t just surprising; it was revolutionary. It’s why we have semiconductors, lasers, and the entire digital age. It also gave us mind-bending thought experiments like Schrödinger’s cat, forcing us to grapple with a reality that is fundamentally probabilistic and granular at its core. Quantum mechanics in some ways, can be considered to be the embodiment of a popular quote I have read somewhere, says, "The universe is under no obligation to make sense to you", which makes our natural understanding about the world seems to be embarrasingly naive and unreliable to a certain degree.

### 3. Thermodynamics

Macroscopically, ideal gas which is hythepotical kind of gas that is assumed to have no volume for each particles and neglect the collision between particles following the Clapeyron-Mendeleev equation $PV = nRT$. Statistical mechanics is the brilliant translator, connecting the discrete micro-world (billions of particles with Boltzmann distributions) to the continuous macro-world we measure (temperature, pressure). It’s a perfect example of how discrete parts can create a continuous whole.

## Towards a Unified Reality

The most interesting places aren’t where one paradigm wins, but where they blur and collaborate.

*   **Numerical Methods:** To solve a continuous physics problem on a computer, we *discretize* it—chop space and time into a finite grid and separate time steps so that they are so small that we can use them to approximate the infinitesimals properties. Since computing something continuous is probably intractable and impossible for digital machines, we have to borrow the power from discretization to simplify our problem and make the computation possible and can adequately approximate the true results as close as possible.
*   **Quantum Field Theory:** This marries the two concepts elegantly. It starts with continuous fields permeating all of space, and the particles we see (like electrons or photons) are discrete excitations *of* those fields.
*   **Fractal Geometry:** A coastline is a continuous curve, but its length depends on how finely you measure it. Fractals have a fractional dimension, $D = \frac{\log N}{\log (1/s)}$, existing in a strange, beautiful zone between dimensions. They look continuous from afar but reveal self-similar, discrete-like patterns upon zooming in.

This interplay tells me that asking “discrete *or* continuous?” might be the wrong question. Reality seems to use both, in layers. The continuous emerges from the discrete, and the discrete is often best described by continuous mathematics.

## Conclusion

Looking back, the journey is telling. Math built from the discrete to imagine the continuous. Physics discovered the continuous, then, by looking closer, found the discrete waiting underneath.

By exploring their roles—in number theory, calculus, and probability, or in classical mechanics, quantum theory, and thermodynamics—we don’t just learn tools. We see a deeper pattern: our understanding of reality expands not by choosing a side, but by learning to translate between these two fundamental languages. This tranlation between two sides of the same coin also manifest itself in the wave-particle duality of light, where in some experiments, light has wave properties with reflection, refraction and diffraction, while in other experiments, light represents as a particle interacting with other particles through photoelectric phenomenon and Compton collision.

The discrete-continuous divide isn’t a battlefield; it’s a conversation. And it’s in that dialogue—the synthesis of the granular and the smooth—that we find a richer, more complete picture of the world, and perhaps, of knowledge itself.oth—that we find a richer, more complete picture of the world, and perhaps, of knowledge itself.