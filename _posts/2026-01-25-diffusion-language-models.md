---
layout: post
title: But what are Diffusion Language Models?
subtitle: When natural language processing embraces the power of vision generative modeling
tags: diffusion-models, language-models, generative-ai, llada, neurips-2025, deep-learning
comments: true
author: dzungphieuluuky
---

Have you ever been curious about what comes next in AI's journey with language? We've grown accustomed to chatbots that write one word at a time, thinking forward in a straight line. But what if they could think differently—starting with a blur of ideas and refining them into clarity, like an artist sketching and then painting over a canvas? The second approach seems like magic, especially when we think about how a language model could already know and generate a final answer before starting to generate its intermediate reasoning steps. Is it possible to already know the answer before reasoning about how we end up with that answer?

That's the fascinating shift diffusion language models bring to the table. In this post, I'd like to share what makes this approach so intriguing, why it has researchers excited (especially with breakthroughs like LLaDA at NeurIPS 2025), and how it might quietly reshape the way machines understand and generate text. Let's dive into this dark magic together.

**Diffusion language models challenge autoregressive dominance with parallel generation, bidirectional context, and better controllability.**

## Prerequisites
Before jumping right into diffusion language models, you might want to get a clear picture of what diffusion models are. I've already written a friendly blog about this topic on my personal website, and you can also find other materials online because there are way more experts out there who have written about this topic with much more comprehensive and technical detail. Among them, I highly recommend [What are diffusion models?](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/) on Lilian Weng's blog due to its centralized content that contains most important details about diffusion models from many papers and articles—perfect for revisiting anytime.

Now, assuming we have some idea of what diffusion models are for image generation, we'll jump into the next big shift in their applications: text generation.

## What Are Diffusion Language Models?

Diffusion language models (DLMs) adapt the denoising process from image generation to text. Instead of predicting the next token based on previous tokens in sequence (autoregressive generation), DLMs work differently.

Autoregressive models, like GPT or Gemini (and perhaps most LLMs you're using at the moment), generate text token by token. Each new token depends on all previous tokens. We all know that the attention score assigned to each token is calculated by self-attention or cross-attention, depending on whether the query contains only input or both input and output sequences. This mimics how we speak—we think about what we've said to decide what to say next. It's been the standard approach for years since the outstanding 2017 paper, [Attention is All You Need](https://arxiv.org/abs/1706.03762), was released. The most game-changing move of that paper was the total removal of recurrent neural network units from older architectures, relying solely on the attention mechanism for language representation. This bold shift empowered computation with high parallelism and significantly improved training and inference speeds.

Back to our story: diffusion language models take inspiration from diffusion image generation—which was actually its original purpose. In that process, they try to destroy the input image by iteratively adding Gaussian noise, gradually transforming the original data distribution into a uniform Gaussian distribution with noise that our normal eyes would see as nothing meaningful. During training, they try to predict the noise necessary to recover the current noisy image back to its original form and perform the denoising process with that predicted noise. In text generation, they start with random noise and gradually refine it into coherent text through multiple denoising steps. The model can predict all tokens simultaneously at each step, then iteratively improve the output by denoising each token in the output sequence, gradually transforming it into a meaningful sentence that humans can understand normally.

Here's a simple look at how one denoising step might work:

```python
def denoise_step(embeddings_t, t, model):
    predicted_noise = model(embeddings_t, t)
    alpha_t = 1 - beta_schedule[t]
    embeddings_prev = (embeddings_t - sqrt(1 - alpha_t) * predicted_noise) / sqrt(alpha_t)
    return embeddings_prev
```

While the code above contains some mysterious components we can't understand immediately, we can still draw some useful information about what the denoising step is doing:

- First, we have three arguments entering the function:
    - `embeddings_t`: this is the embedding or latent representation of the result being denoised at timestep `t`.
    - `t`: this is the current timestep of the denoising process; it acts as the argument to get the denoising coefficient from the scheduler.
    - `model`: the model being used for the denoising process, probably a U-Net or autoencoder since these models have the capability to encode features into their latent representations.

Many DLMs operate in continuous embedding space, then convert to discrete tokens—avoiding some limitations of autoregressive approaches.

## The Mathematics

DLMs typically add noise to token embeddings according to a schedule, then learn to reverse the process. The training objective minimizes a denoising score matching loss:

$$ L(\theta) = \mathbb{E}_{t, x_0, \epsilon} \left[ \| \epsilon - \epsilon_\theta(x_t, t) \|^2 \right] $$

where \\( x_t = \sqrt{\alpha_t} x_0 + \sqrt{1 - \alpha_t} \epsilon \\).

Of course, this loss function is actually foundational to all diffusion-based models. Depending on the downstream tasks you're trying to solve, there may be a few other loss functions taken into account to provide better alignment with the problems.

To name a few examples to prove I'm not using GPT or other LLMs to generate this entire blog post:
- In style transfer tasks, you might want to train a model that can transform a source image into a target image with different styles while preserving the content. It could be transforming a real-life cat into an animated cat; while the styles differ, they are still cats—not transforming from a cat into a cow or something else. You get my idea. In this case, it would be wise to include a content-preserving loss that measures content representation of the images using other encoders like Vision Transformers or CNN-based networks. This way, we can force the model to effectively preserve content and focus only on style changes.
- In tasks that require models to generate samples that closely resemble one sample while contrasting with others, we might choose contrastive learning approaches as our lifesaver. In this setting, you could add a contrastive loss to our total loss function—for example, an Info Noise Contrastive Estimation (InfoNCE) loss—to better guide the model in distinguishing between positive samples (desired ones) and negative samples (undesired ones). Note that I'm using singular form for the desired one and plural forms for undesired ones to show that we need many contradiction pairs to guide our model better.

Back to the diffusion language world, we've seen a cornerstone in this field at the NeurIPS 2025 conference: the LLaDA model, which uses masking techniques where tokens are progressively revealed during reverse diffusion, combining BERT-style masking with iterative refinement.

## Key Breakthrough: LLaDA (NeurIPS 2025)

**LLaDA** (Large Language Diffusion with mAsking) represents a significant milestone—an 8B-parameter DLM trained from scratch that performs comparably to **LLaMA3** 8B across various benchmarks. It shows particular strength in understanding reversed text (addressing the "reversal curse"—yeah, might need to talk about this later) and offers better controllability through positional constraints. The original paper for the LLaDA architecture can be found at [Large Language Diffusion Models](https://openreview.net/pdf?id=KnqiC0znVF).

This ability to understand reversed text gives DLMs potential advantages in reasoning tasks that require processing information forward and backward multiple times. Hmm, actually I was working with Looped Transformers before in my previous machine learning project, specifically the Ouro model from ByteDance, which uses a looping mechanism to iteratively refine the output response multiple times before generating the final answer. In that work, I was also analyzing the performance of the Ouro model on some reasoning tasks such as n-ary addition, p-hop induction, and i-GSM tasks. Among the three, p-hop induction seems to be the hardest, requiring the model to digest the problem input in both directions—forward and backward—multiple times to generate a highly correct answer. This bidirectional processing somewhat corresponds to the way diffusion language models generate text because they don't use the autoregressive fashion of traditional models. Perhaps diffusion language models and looped language models represent a universal paradigm we could leverage to enhance the reasoning capabilities of language models. Oops, I just remembered that there are also recursive models that were released a few months ago. Hmm, maybe there will be a post comparing these seemingly similar guys. Seems promising, huh? $...$

Other notable developments:
- **Block Diffusion (2025)**: Hybrid approaches that combine autoregressive and diffusion strengths. You, including my future self, can find more information in the original paper [Block Diffusion](https://arxiv.org/pdf/2503.09573).
- Research showing DLMs can be data-efficient learners; the original paper currently sits at [Diffusion Language Models are Super Data Learners](https://arxiv.org/pdf/2511.03276).

## Autoregressive vs. Diffusion Language Models

| Aspect              | Autoregressive (e.g., GPT)              | Diffusion Language Models (e.g., LLaDA)       |
|---------------------|-----------------------------------------|-----------------------------------------------|
| Generation          | Sequential, token-by-token              | Parallel/iterative denoising                  |
| Context             | Unidirectional                          | Bidirectional/infilling                       |
| Controllability     | Limited (prompt-dependent)              | High (masks, guidance, positional)            |
| Strengths           | Fast inference, strong likelihood        | Reversal tasks, reasoning, multimodality      |
| Challenges          | Exposure bias, reversal curse           | Higher compute during sampling                |
| Scaling Behavior    | Standard pre-training                   | Competitive at 8B+, data-efficient            |

DLMs address some limitations of autoregressive models, like sequential dependency (which can lead to degeneration or hallucination based on unwanted tokens generated earlier in the sequence) and poor understanding of reversed text. They offer new capabilities in controlled text synthesis.

While inference speed has been a challenge for DLMs, optimized sampling algorithms like DPM-Solver++ can reduce the number of steps needed, making them more practical—perhaps facilitating real-time applications?

## Why This Excites Me

Coming from a background in physics and a deep interest in reinforcement learning and diffusion models, DLMs feel like a natural evolution. They combine generative flexibility with language understanding in a way that opens new possibilities. This architecture also draws me back into the world of language modeling. Since this field has been advancing tremendously in recent years, I find it has become so popular that when someone talks about AI or machine learning in general, it's very likely they're just talking about LLMs—not AI or machine learning as a broad discipline. But thanks to DLMs, I find myself making a kind of comeback in NLP. 🚀🚀

The potential for iterative refinement—where a model can improve its own output through multiple passes—and the ability to integrate with other approaches like reinforcement learning fuels interesting ideas about adaptive, reasoning-rich AI. This mechanism seems to be more universal than we thought. Perhaps language models in the next era will be developed around iterative refinement mechanisms, though they might differ in what they use to refine. For example, diffusion models use intermediate results to refine them into correctness and readability before arriving at a final answer. On the other hand, looped models refine directly on the output sequence multiple times. We can clearly see that, even though both refine intermediate results, diffusion models cannot generate directly without refinement because the output isn't ready to be considered a final answer. But looped models refine the output itself, so they are always ready to use that output as the final answer—though it might be wrong, it's surely a valid and readable sequence.

The convergence of different disciplines leading to innovations like this is exactly what I find most compelling in research.

## Conclusion

Diffusion language models, with breakthroughs like LLaDA, signal an interesting shift in text generation. They promise more controllable, coherent, and creative text synthesis—and a promising way to generate answers even before reasoning thoughts are available. As research continues through 2025–2026, we may be seeing the beginning of new approaches that complement or even compete with autoregressive methods.

It's worth noting that diffusion models have also inspired related approaches like **Diffusion Policy** in robotics, which combines reinforcement learning with diffusion techniques—a topic for another post.