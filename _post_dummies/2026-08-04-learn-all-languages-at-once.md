---
layout: post
title: Learn All the Languages at Once
subtitle: What multilingual neural networks teach us about the human brain
cover-img:
thumbnail-img:
share-img:
tags: [learning, deep-learning, personal]
author: dzungphieuluuky
---

Here's a belief most of us carry without ever questioning it: you should master your mother tongue before you touch a foreign one. Learn Vietnamese properly. Then, and only then, start English. And definitely don't try to learn two foreign languages at the same time — you'll just confuse yourself.

I used to believe this too. Then I spent a few years training neural networks, and I noticed something strange: the machines that learn languages best do the exact opposite of what we tell ourselves to do.

A multilingual model like XLM-R doesn't master English first, then add French, then add Swahili. It trains on a hundred languages *at once*, in the same network, in the same batch. And it beats the sequential approach — sometimes by a lot.

This post is about what that gap between machine and human learning actually means. Not as a metaphor, but as a set of concrete, testable insights.

Here's the map:

* [The bitter lesson of sequential learning](#the-bitter-lesson-of-sequential-learning)
* [One shared space, not many](#one-shared-space-not-many)
* [Interleaving: the difficulty that works](#interleaving-the-difficulty-that-works)
* [The critical period is a softer wall than we think](#the-critical-period-is-a-softer-wall-than-we-think)
* [Positive transfer, negative transfer](#positive-transfer-negative-transfer)
* [The honest cost: capacity dilution](#the-honest-cost-capacity-dilution)
* [Closing thoughts](#closing-thoughts)

---

## The bitter lesson of sequential learning

In machine learning, there's a well-documented failure mode called **catastrophic forgetting**. Train a neural network on task A, then train it on task B, and it doesn't just fail to improve at A — it actively destroys what it learned about A. The weights that encoded A get overwritten by B.

This was first shown in 1989 by McCloskey and Cohen, and it's brutal. In a 2023 study on multilingual continual learning, researchers trained models on languages *one at a time* — the way we're told to learn languages. The result: performance dropped by 4 to 17 F1 points compared to training on all languages at once. The model literally forgot earlier languages as it learned later ones.

Here's the key part. The same study showed that when you train on the languages **interleaved** — mixed together in the same batches — the forgetting mostly disappears. The network learns all of them, and each one helps the others.

The researchers were explicit about the takeaway: *"Training a full model on all languages always performs best, outperforming training on one language at a time."*

Now, humans don't forget catastrophically. McCloskey and Cohen themselves noted that human forgetting is far milder than what neural networks do. Your brain doesn't wipe out Vietnamese when you start English. But the deeper lesson still lands: **sequential, blocked learning is the worst of the available options.** It's not that you *must* master L1 first — it's that doing so is actively suboptimal compared to mixing.

---

## One shared space, not many

Here's the most surprising thing about multilingual models. When you train one network on a hundred languages, it doesn't build a hundred separate little language modules. It builds **one shared representation space** — a single geometric map where the Vietnamese word for "dog" and the English word for "dog" land near each other, because they mean the same thing.

This is why mBERT and XLM-R can do *zero-shot cross-lingual transfer*. Train the model to classify sentiment in English, and it can classify sentiment in Swahili without ever seeing a Swahili training example. The knowledge transfers across languages because they share one underlying space.

The neuroscience literature points the same direction. A 2026 systematic review of the bilingual brain found that with proficiency, L1 and L2 converge onto shared neural substrates rather than operating as separate systems. The brain doesn't keep two isolated dictionaries — it builds one conceptual system with multiple labels attached.

This has a practical consequence that most language learners miss: **learning a second language makes the third one easier.** Not because you're "good at languages," but because you've already built the shared conceptual machinery. The third language plugs into a space that already exists. Multilingual people often report this — the first foreign language is the hardest, and each one after gets cheaper. That's not a personality trait. That's transfer learning.

---

## Interleaving: the difficulty that works

If you've ever taken a language class, you know the standard structure: a week on past tense, a week on the subjunctive, a vocabulary unit on food, then a unit on travel. This is called **blocked practice**, and it feels great. You finish a unit and you feel like you've mastered it.

The problem is that feeling is a lie.

Cognitive science has known for decades that blocked practice produces a false sense of mastery. It lets you settle into a robotic rhythm — you know exactly what kind of problem is coming, so you don't actually have to think. The moment the test mixes everything together, the performance collapses.

**Interleaving** — mixing different skills and topics in the same session — feels harder and produces worse immediate performance. That's why it's called a *desirable difficulty*. But it produces dramatically better retention and generalization. In one study, interleaved practice was nearly immune to forgetting: a 30-fold increase in test delay dropped scores by less than a tenth.

The machine learning version of this is data mixing. Multilingual models don't train on one language for a week, then switch. They sample from all languages every batch, every step. The interleaving is baked into the training loop.

So the advice "don't learn two languages at once, you'll confuse yourself" is backwards. The confusion you feel is the desirable difficulty working. It's the signal that you're actually discriminating between two systems instead of mindlessly repeating one.

---

## The critical period is a softer wall than we think

The strongest argument for "master your mother tongue first" is the critical period hypothesis: the idea that after some age, you simply can't learn a language natively. If that were true, then yes — you'd want to front-load language learning into childhood, one language at a time, before the window closes.

The evidence is more nuanced than the myth.

The largest study ever done on this — Hartshorne, Tenenbaum, and Pinker, analyzing 2/3 million English speakers — found that a critical period *does* exist, but its offset is much later than puberty. Grammar-learning ability stays high until around age 17 or 18, then declines. That's not "learn it before you're twelve or it's hopeless." That's "you have until adulthood."

And the strong form of the hypothesis — that full acquisition is impossible after a certain age — has been rejected by the field. Adults often learn *faster* than children in the early stages, because they can use explicit reasoning and declarative memory. What adults lose is the automatic, accent-free procedural fluency. Vocabulary, notably, has no critical period at all.

So the "window" isn't a door that slams shut. It's a gradient that stays open for most of your life. The belief that you must master L1 first because the L2 window is closing is built on a version of the science that the science itself has moved past.

---

## Positive transfer, negative transfer

Here's where the ML analogy gets honest, because not all transfer is helpful.

In machine learning, **positive transfer** is when learning one thing helps another. Related languages share vocabulary, grammar, and script, so a model trained on Spanish transfers well to Italian. This is why learning a second Romance language is cheaper than learning the first.

**Negative transfer** is when learning one thing hurts another. In multilingual models, this shows up as *language confusion* — the model starts producing the wrong language because two similar languages interfere. The same thing happens to humans: learn Spanish and Italian at the same time, and you'll mix up "embarazada" and "embarazada" in ways that are both funny and frustrating.

This is the real argument *for* the "master L1 first" instinct — but only for *similar* languages. The interference is real. The ML research shows that cross-lingual transfer correlates strongly with linguistic similarity and shared vocabulary. Distant languages (Vietnamese and English) interfere far less than close ones (Spanish and Italian).

So the refined advice isn't "don't learn multiple languages." It's: **be deliberate about which languages you pair.** Mixing distant languages is cheap. Mixing near-identical ones is where the confusion actually bites.

---

## The honest cost: capacity dilution

I want to flag something before this post turns into pure hype. We are firmly in opinion territory here, but the opinion is grounded in a real ML trade-off.

Multilingual models have a documented cost called **capacity dilution**. Every language you add shares the same fixed set of parameters. Add too many, and each individual language gets a thinner slice of the model's capacity. XLM-R's own paper discusses the trade-off between *positive transfer* and *capacity dilution* — more languages help low-resource ones, but they can slightly hurt the high-resource ones.

The human version of this is real too. You cannot learn ten languages simultaneously to native level. Attention is finite. Time is finite. Every language you add competes for the same waking hours and the same neural resources.

But here's the thing: the ML evidence says the sweet spot is not "one language, mastered, then the next." The sweet spot is a *small number of languages, learned together, deliberately chosen*. The benefit of shared representation and interleaving outweighs the dilution cost — up to a point.

The practical translation: learning two or three languages at once is not just feasible, it's arguably *better* than the sequential grind. Learning eight at once is a fantasy. The optimal strategy is not at the extreme you were told to aim for.

---

## Closing thoughts

Let me distill this into what I actually believe, and what I'd tell a friend who asked whether they can start a second language before mastering their first.

* **You don't need to master L1 first.** The "master it, then move on" model is sequential learning, and sequential learning is the worst option in both machines and humans. Interleaving wins.
* **Learn multiple languages together, deliberately.** Two or three, chosen to be *distant* from each other, is the sweet spot. The shared conceptual space makes each one cheaper.
* **The confusion is a feature, not a bug.** When two languages blur together, that's the desirable difficulty doing its job — you're discriminating between systems, which is exactly what builds durable knowledge.
* **The critical period is a gradient, not a cliff.** It extends into adulthood, and vocabulary never closes. The "too late" story is mostly myth.
* **Watch out for similar languages.** Positive transfer is real, but so is negative transfer. Pairing Spanish with Italian invites interference; pairing Vietnamese with English mostly doesn't.
* **Respect capacity dilution.** A few languages at once is optimal. A dozen is a fantasy. The answer to "how many?" is not "one" and not "all" — it's "a small, deliberate set."

The machines that learn languages best don't master one before starting the next. They hold many in mind at once, let them share one space, and let each one sharpen the others. Maybe the human brain — which is, after all, the original neural network — was built for the same thing.