---
layout: post
title: The bitter lesson
subtitle: Limitations of human's insight
cover-img:
thumbnail-img:
share-img:
tags: [ai, learning, deep-learning]
author: dzungphieuluuky

---

# An observation

In 2019, Richard Sutton published a short essay titled "The Bitter Lesson." It's deceptively simple, and worth reading in full if you haven't already. The core observation is this: throughout the history of AI, methods that rely on human knowledge and domain expertise eventually lose to methods that leverage more computation and data. Always. Not sometimes, not in most cases—always. The always-ness of this phenomenon is what makes it truly harsh for us, as human researchers.

This contradicts something deep in how we think about intelligence. As practitioners, we prize insight. We celebrate elegant solutions. A domain expert who hand-crafts the right feature seems more valuable than ten GPUs grinding through raw data. The bitter lesson says this intuition is backwards.

Before we dive in, here's what we'll explore in this blog:

1. **How we got here**: Why hand-crafted features dominated for decades
2. **Why it happened**: What mechanisms cause general methods to win
3. **The historical pattern**: Examples from chess to vision to language
4. **The uncomfortable implications**: What this means for how we build systems
5. **The caveat**: Why scaling alone isn't sufficient
6. **What to do about it**: Where human insight actually matters

This is my thoughts on Sutton's essay in particular and on the metamorphosis in AI advancements in general. Let's start with a concrete story.

## The reign of SIFT

Picture computer vision in 2005. The field had largely settled on a particular approach: extract hand-crafted features from images using mathematical methods designed by experts. The most famous of these features was SIFT (Scale-Invariant Feature Transform), developed by David Lowe in the late 1990s.

SIFT was genuinely clever. It could find the same location in an image across different scales, rotations, and lighting conditions. The descriptor was mathematically elegant, and it worked well. For nearly a decade, if you wanted to match images or recognize objects, SIFT was your answer. The method was so dominant that computer vision competitions were essentially competitions about how to best use SIFT features.

Then something changed.

In 2012, Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton released AlexNet. It didn't use SIFT or any other hand-crafted features. Instead, it trained a deep convolutional neural network on ImageNet—a large dataset of labeled images. The network learned what features to extract directly from data, without any human specification. 

The results were shocking. AlexNet outperformed every hand-crafted approach by a wide margin. Within a few years, SIFT was relegated to the history books. Today, if you mention it in a computer vision conversation, you'll get polite nods and references to "classical methods."

This same pattern has repeated everywhere we look in AI.

## The pattern repeats

**In game-playing**: Chess engines like Deep Blue (1997) relied on hand-crafted evaluation functions. Grandmasters would distill their intuition about a position into numerical scores: piece activity matters, control of the center matters, king safety matters. Engineers encoded this knowledge into evaluation functions. It worked beautifully. Then AlphaGo arrived and beat the world Go champion by learning strategies that violated human intuition about what mattered in the game.

**In speech recognition**: Specialists spent decades designing hand-crafted features like Mel-frequency cepstral coefficients (MFCCs). These features were based on human understanding of how hearing works. Then deep learning models trained on raw audio learned better representations automatically, without anyone telling them how hearing should work.

**In natural language processing**: Hand-crafted parse trees, linguistic rules, carefully designed syntax trees—all replaced by embeddings and transformer models trained on massive amounts of text.

The pattern is so consistent that it's hard to dismiss as coincidence. Yet we keep reaching for the design option.

## Why hand-crafted features fail

To the best of my knowledge and intutition, there are several predictable and interpretable reasons on why human-crafted features are not the true answer to our advancements. Among them, there are (at least) three mechanisms at work:

**First: Representation is lossy.** When you hand-craft a feature, you're translating human understanding into something a machine can process. This translation is never lossless. You have an intuition. You encode it as a mathematical formula. But, the problem is, there are an infathomable amount of representations can be used to convey our ideas, and among them the encoding we choose is almost always suboptimal. A neural network exploring millions of possible representations often finds something better than what we might expect.

Consider AlexNet and SIFT again. SIFT captures certain invariances humans care about: rotation, scale, illumination. These are important features. But they're not the only invariances that matter. AlexNet learned additional patterns—correlations between patches, hierarchical structure, relationships across the image. These relationships situate in a much deeper representation that contains some kind of abstract meanings that we cannot imagine using our intutition alone. They were too subtle to hand-code but turned out critical for classification. The network found them because it had the capacity to explore thousands of different possibilities using its vast capacity with ultimate overparamerisation. They contains millions to billions of parameters that are able to allow them travel through a vast space of nearly every possible states and paths that can lead to a much more effective way of represent data features. While our intuition is nearly just a handful of salt in that vast space. 

**Second: Capacity grows faster than your insight.** As models gain parameters, their representational capacity scales exponentially, one of the benefits we get from the curse of dimensionality. Your hand-crafted knowledge becomes a fixed point in an ever-expanding space of possibilities. The insight you inject becomes increasingly negligible.

Think about modern diffusion models, which Francisco Rombach and colleagues explored in their latent diffusion work. Early image generation systems relied on carefully designed loss functions and architectural tricks. Modern diffusion models use relatively simple objectives—predict noise at each timestep—but learn tremendously rich representations because they have the capacity to do so. The design choice matters less; capacity matters more.

We're veering firmly into opinion territory here, but I suspect this is why design feels less impactful in 2025 than it did in 1995. The models are so large that clever tricks barely register.

**Third: Specificity doesn't generalize.** A feature engineered for chess doesn't transfer to Go. A detector trained on cats doesn't work as well on dogs. Hand-crafted methods are optimized for the specific problem we're solving at the time, especially those problems that we have lots of experience with. The moment the problem shifts to another domain with data distribution, our painstakingly designed work either breaks or requires expensive re-engineering over the whole process, from data processing to features engineering must be re-done from the start.

General methods are different. They're often less efficient on any individual task, but they work across tasks. ImageNet-trained CNNs transfer to medical imaging, satellite imagery, and tasks their designers never anticipated. The hand-crafted SIFT feature transfers poorly.

## The model's perspective

Here's another way to think about this. When you inject a hand-crafted feature into a model, you're constraining what the model can learn. You're saying: "Look at this, it's important." But you're also implicitly saying: "Ignore this other thing you might have found."

A model with billions of parameters exploring billions of possible patterns through gradient descent will often find something better than your constraint. Not because you designed poorly, but because you're limited by human attention and human intuition. A model is limited only by compute and data.

This isn't pessimistic about human intelligence. It's optimistic about learning systems. It's saying: stop trying to be clever in ways computation can do automatically. Be clever about what computation to do.

## The tension

All of this creates a fundamental tension:

If you have limited data and limited compute, hand-crafted knowledge wins. It's efficient. It leverages human insight. A well-designed feature reduces the problem space.

If you have abundant data and abundant compute, general methods win. They explore more possibilities. They're less efficient per unit of compute, but there's so much compute that efficiency doesn't matter.

We clearly live in the second regime. The trend lines crossed years ago. The evidence is overwhelming. Yet we keep designing features. Why?

Probably because design is satisfying. Building something clever feels productive. Scale feels inelegant and somehow less intellectually honest. There's also, I suspect, a small psychological component: if intelligence comes from scale rather than insight, what does that say about the value of deep thinking?

(Though this feels like a false dichotomy—the real intelligence is in designing the right learning setup, as we'll discuss below.)

## What the bitter lesson actually says

The lesson doesn't claim that expertise is useless. Domain knowledge is valuable for:

- Defining the problem correctly
- Understanding what good looks like
- Collecting and labeling data
- Debugging failures
- Evaluating whether results make sense

It's useful for everything except the actual learning algorithm.

Sutton's original essay suggests the practical takeaway: "The biggest lessons from 50 years of AI research is that the actual methods matter less; the power of the search and the breadth of the search matters more."

In other words: build systems that search broadly and deeply through possibility space. Feed them data. Let them learn. Your job isn't to tell the system what to learn; it's to create an environment where good learning can happen.

You'll be wrong about what matters. Repeatedly. A parameter you thought critical will turn out irrelevant. A relationship you assumed necessary will emerge naturally. A trick you invented will be harmful. Accept this and move forward.

## What's incomplete about this picture

The bitter lesson is simultaneously true and incomplete.

**It's true**: Scale wins. General methods win. Hand-crafted knowledge loses in the long run. The evidence is overwhelming and I don't see how to argue against it honestly.

**It's incomplete**: Scaling alone isn't sufficient. AlphaGo needed a hand-crafted architecture (the CNN + tree search combination). ImageNet needed a good loss function (cross-entropy). You can't scale infinitely and expect success.

The real intelligence is in designing the right learning setup: the architecture, the objective, the training procedure. Then letting the system learn what to do within that framework. This is where human insight still matters enormously.

This is why I find the bitter lesson so interesting—it's not saying domain expertise is worthless. It's saying domain expertise should be invested upstream, in the setup, not downstream in the features. It's arguing for a shift in where we apply our insight, not that we abandon insight altogether.

## Closing thoughts

Here's what I'd suggest: next time you're tempted to hand-craft a feature or a loss function or an architectural detail, pause. Ask: Could I solve this with scale instead? Could I let the model learn this?

Often, the answer is yes. And when it is, the bitter lesson suggests you should. Not because you're being lazy, but because you're being smart about where your insight is needed most.

That's not pessimistic about human intelligence. It's optimistic about learning systems. And it's maybe the most important lesson fifty years of AI research has to offer.

## References

- Sutton, R. S. (2019). "The Bitter Lesson." Retrieved from http://www.incompleteideas.net/IncIdeas/BitterLesson.html

- Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). "ImageNet Classification with Deep Convolutional Neural Networks." In Advances in Neural Information Processing Systems (pp. 1097-1105).

- Lowe, D. G. (2004). "Distinctive Image Features from Scale-Invariant Keypoints." International Journal of Computer Vision, 60(2), 91-110.

- Silver, D., Huang, A., Maddison, C. J., et al. (2016). "Mastering the Game of Go with Deep Neural Networks and Tree Search." Nature, 529(7587), 484-489.