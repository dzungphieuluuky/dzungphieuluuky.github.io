---
layout: post
title: But what is a diffusion language model?
subtitle: When language models learn to sketch before they write
tags: [diffusion, language]
comments: true
author: dzungphieuluuky
---

Here's a question that's been sitting with me: what if a language model could hold the whole sentence in its mind at once, instead of building it word by word?

Not just predicting what comes next — but keeping a blurry draft of the entire thought, and gradually sharpening it until every word clicks into place. Like a painter who sketches the whole composition before committing pigment to any single corner of the canvas.

That's the quiet revolution behind diffusion language models. And once you see it, you start to notice how strange the familiar way of doing things actually is.

---

## The strange ritual of writing left to right

Every major language model you've used — GPT, Gemini, Claude — shares the same hidden rhythm. It reads your prompt, then begins its answer one token at a time, marching from left to right, each new word leaning on everything that came before.

This is called *autoregressive* generation. And it works. It works astonishingly well.

But there's something peculiar about it. The model is permanently blind to its own future. When it writes word forty-seven, it has no idea what word forty-eight will be. It can't revise. It can't hold a half-formed intuition in suspense and wait for the rest to clarify. It commits, word by word, with no going back.

You and I don't write this way. We wander. We write a sentence, delete half of it, change direction. We sometimes know roughly where we're going before we know exactly how we'll get there. The autoregressive model never has that luxury. It walks forward with its eyes fixed on the ground, never looking up to see the horizon.

---

## What diffusion brings: the art of iterative refinement

Diffusion models were born in the world of images. The idea is simple enough to feel like a kind of magic: take a photograph and slowly add noise until it becomes pure static — then train a neural network to reverse that process, to find the image hidden in the noise.

What makes this powerful is that if you can learn to reverse the diffusion, you can *generate* images by starting from random static and progressively cleaning it up, step by step, until a coherent picture emerges from the chaos.

Now apply that same intuition to language.

A diffusion language model doesn't generate tokens one by one. Instead, it starts with a sequence of noise — masked or jumbled words, placeholders where meaning should be — and iteratively refines the *entire sequence at once*. Every token can influence every other token at every step. The model isn't marching blindly forward; it's circling its thought, revising the whole thing simultaneously, pass after pass, until the noise resolves into something worth saying.

Imagine trying to remember a dream. At first, only fragments come: a face, a feeling, a room you've never seen. You hold them together, let them sit, and slowly they connect into a scene. That's what diffusion language models do. They don't build the dream from beginning to end — they let it coalesce.

---

## The mathematics, without the equations

Behind this is a training process that feels almost paradoxical at first. You take a clean sentence, corrupt it with noise, and ask the model to predict what you've done — to see through the static and recognize the signal beneath. Over and over, across millions of examples, the model learns what clean language looks like, and more importantly, it learns the path from noise back to meaning.

Many diffusion language models work in a continuous space of word-like vectors rather than on discrete tokens directly. This is a subtle but important shift. Words become points in a landscape, and denoising becomes a kind of navigation — moving those points step by step until they settle into positions that correspond to real words in real sentences.

It's not words being generated anymore. It's meaning, being coaxed into form.

---

## LLaDA: when the idea became real

For years, diffusion language models were a curiosity — elegant in theory, but never quite able to keep up with the brute efficiency of autoregressive generation. They belonged in papers, not in products.

Then came LLaDA — Large Language Diffusion with mAsking — presented at NeurIPS 2025. An eight-billion-parameter model trained from scratch, using a masking-based diffusion process. During forward diffusion, tokens are progressively hidden; during reverse diffusion, they're progressively revealed. Think of it like BERT's masked language modeling, but made iterative and generative rather than simply predictive.

The result that turned heads: LLaDA performs comparably to LLaMA 3 8B across a wide range of benchmarks.

But the numbers aren't the most interesting part. What caught my attention is *where* LLaDA excels. It handles reversed text far better than autoregressive models — it doesn't suffer from the *reversal curse*, where models trained on "A implies B" fail to infer "B implies A". It also allows something remarkable: you can tell the model that word five must be "quantum" and word twelve must be "entanglement", and it will build a coherent sentence around those fixed points. Autoregressive models struggle with this kind of constraint. They're built for flow, not for anchors.

These aren't minor differences. They suggest something deeper: that the two architectures aren't just different implementations of the same capability. They have genuinely different kinds of intelligence.

---

## Two ways of thinking

The contrast is worth sitting with.

Autoregressive models are linear thinkers. They move forward, never backward, building meaning in a straight line. This makes them fast and surprisingly reliable. But they can't revise. They can't hold a contradiction in mind and wait for it to resolve. They commit, and they live with the consequences.

Diffusion models are iterative thinkers. They start with a blur and sharpen. They can see the whole field at once, which means they can notice when something doesn't fit, and adjust accordingly. This makes them slower, but also more flexible. They can be constrained in ways linear thinkers can't.

The sampling speed gap is real. An autoregressive model generates one token at a time, but each step is cheap. A diffusion model runs many full passes over the entire sequence. Efficient sampling techniques close this gap somewhat, but it remains a practical consideration.

What's more striking, though, is emerging evidence that diffusion language models may be more data-efficient — able to match autoregressive performance with significantly less training data. If this holds at scale, it changes the economics of language modeling entirely. It suggests that learning to refine might be a more natural path to language than learning to predict.

---

## A personal convergence

I come to this from an unusual angle. My own research lives at the intersection of reinforcement learning and diffusion models for physical simulation. For a long time, language modeling felt like a separate continent — relevant, but distant.

Diffusion language models pull those threads together in a way that feels almost inevitable.

There's also a resonance with work I've been following on looped transformers — models that refine their output by running the same transformer multiple times in a loop. The Ouro model from ByteDance is a beautiful example: it iterates over its own representations, sharpening them with each pass. I've been analyzing these models on reasoning tasks that require moving forward *and* backward through chains of facts. Bidirectional processing is the key.

Diffusion language models have bidirectionality built into their bones. Looped models achieve it through iteration. The mechanisms differ, but both are responses to the same insight — that purely linear thinking is not always enough for the hard problems.

I suspect these approaches — diffusion generation, looped refinement, recursive architectures — are converging on something important. They're all, in different ways, about *iterative refinement of a complete thought* rather than linear construction of a sequence. And that pattern resonates because it's how good thinking actually works. We don't think in straight lines. We think in circles, in revisions, in second guesses that turn out to be right.

---

## What this opens up

For years, autoregressive models were the only game in town. They defined what it meant to generate language. Their limitations became invisible, simply because there was nothing to compare them to.

Now there's an alternative. Not just a tweak or a variant, but a genuinely different way of approaching the problem. Diffusion language models think in wholes rather than parts. They revise rather than commit. They can be anchored to constraints that would trip up a linear thinker.

Whether they eventually displace autoregressive models, or complement them, or merge with them into something new — I don't know. But the existence of a competitive alternative, after years of single-paradigm dominance, is itself significant. It forces a question that had gone unasked:

What other assumptions are we carrying, simply because we've never had reason to doubt them?

That's the kind of question I find most worth asking.