---
layout: post
title: Viettel Digital Talent Recap
subtitle:
cover-img:
thumbnail-img:
share-img:
tags: [personal, viettel]
author: dzungphieuluuky
---

# Introduction

Here is my recap after finishing Phase 1 of Viettel Digital Talent 2026. Several months have passed since I first heard about this programme and decided to apply. This post covers everything from the application process to the biggest, fastest-paced solo project I have ever taken on myself.

# Discovery & Application

One day, while doom-scrolling through Facebook Reels, I stumbled across a post about a programme called "Project X Vietnam 2026." Feeling curious and bored after months of doing nothing meaningful, I clicked through to their fan page. There, I spotted a poster featuring someone from my university major (actually, he was a friend of my friend), wearing a shirt that read "Viettel Digital Talent."

That was when I realised I might have found something interesting enough to pull me out of my rut. I went straight to their website. Fortunately, applications were open until March 15, so I still had a few days left.

**Round 1: English & IQ tests.** The first hurdle was the TOEIC entrance test, which was predictable since I did not have any English certificates yet. It was fairly straightforward; I scored 955 on the listening and reading sections. On the same day, I also sat through an IQ logic test with mysterious squares, rectangles, and hidden patterns. I have always been sceptical of these tests, since I do not believe they judge anything meaningful about a person; eventually I scored around 112 out of 160. That felt average compared to other guys; I heard that some of them had mysteriously achieved 140+ scores on this test.

**Round 2: Aptitude test.** A few days later came the aptitude test, the final screening round. The content depends on which track you apply for. I went with Data Science and Artificial Intelligence (DSAI), so my test covered those topics. Other tracks, i.e., 5G, networking, digital design and verification, software engineering, data engineering, and so on, each received a tailored exam.

I scored 35 out of 45, which I did not consider very high. The test included data science concepts like SARIMA, ARIMA, and time-series processing, not my strong suit (since my interest leans much more towards deep learning). Despite the mediocre score, I heard that I was passed straight into the programme without an interview. Word on the forum was that scores of 33–34 might trigger an interview, while 35 and above meant direct entry. Lucky break.

And so, my journey with Viettel Digital Talent began.

# First Lectures

At the beginning of the programme, we only needed to attend a few lectures each week. They covered a wide range of topics: recommender systems, speech processing, satellite image processing with spectral analysis, fine-tuning large language models, transformers, mixture of experts, and agentic systems. To be honest, this stage was quite boring. We sat there, opened Zoom, watched the lecture, or muted it and did something else. (I highly do not recommend it.)

We were told that a mini project would be assigned to each of us, but the details were not yet available. So I skimmed through this phase and moved on to the real challenge: the project. Despite being called "mini," I later discovered this single project was on par with some of my past semester-long projects. What a surprise.

# Project Announcement

On the day the mini projects were announced, there were around 122 in total. That blew my mind. With roughly 180 participants in the programme, each project had only two slots to maximise diversity.

Scrolling through the list, I found several interesting options. At the time, I was quite interested in generative models (diffusion and flow matching) and deep reinforcement learning, i.e., either policy training for general agents or reasoning training for LLMs. Here are the four that stood out:

## Self-Evolving AI Agent for Telecom Failures

This project sounded exciting. The methods ranged from fine-tuning with reinforcement learning to agentic techniques like memory management, skills, and harnesses over an agent's lifecycle. But the tech stack read like a sysadmin's wishlist: Airflow, Astronomer Cosmos, OpenLineage, Marquez, and more. It felt more like a software engineering project than an ML/AI one. Despite its coolness, the overwhelming stack pushed me away.

## Applying AI/ML in Penetration Testing and Red Teaming

This project focused on auto red-teaming with agentic systems for network security. The deliverable was a CLI tool that used an AI agent to perform cryptographic attacks. Cryptography is the last thing I want to dive into; one trial semester was enough. Easy pass.

## Adaptive Learning System

This project aimed to build software that accelerates learning for high school students. It was run by Viettel Business Solutions, so it was probably the closest to production among the four. Features included personalised syllabi, redundant lesson reduction, and accelerated mastery. It mentioned some reinforcement learning techniques, but not enough to pull me in.

## Function Calling using Reinforcement Learning with Verifiable Rewards

This was the one I chose. The project aimed to use RLVR (Reinforcement Learning with Verifiable Rewards) to train a small language model to perform function (tool) calling, targeting performance comparable to much larger models.

I picked it for a few reasons:

- **Core technique**: RL is my favourite domain in deep learning right now (alongside generative models, but there were no generative projects on the list).

- **Focus on training, not plumbing**: The contribution centred on training and inference techniques rather than building agentic systems around a frozen model with vendor-imposed rate limits. Subjectively, I consider projects with training and inference details "AI projects"; everything else is software engineering.

- **Name twin**: Another participant sharing two-thirds of my name was also interested in this project. I thought that would confuse the mentor beautifully.

As a bonus, the mentor assigned to guide me happened to be the champion of Viettel AI Race 2025, an AI competition hosted by Viettel. I felt incredibly lucky to have picked the right project.

# Dataset

Before training, I needed to pick a reference algorithm. The project involved: synthetic dataset generation from available function schemas, a training pipeline with ablation studies, evaluation of tool-calling performance, and, of course reports and slides for submission.

I was given 26 function schemas in a raw format and had to transform them into OpenAI-compatible JSON schemas. I split the data into two sets: **seen functions** for training and **unseen functions** for testing. To prevent overfitting to the telecom domain, I also injected dummy functions, i.e., `get_weather`, `get_traffic`, and similar, to distract the model from the core telecom functions and encourage generalisation.

The dataset covered several calling scenarios:

- **Single call**: the query required exactly one function call.

- **Parallel calls**: multiple independent functions needed to be invoked.

- **No call**: the query was irrelevant or out of scope, so the model had to abstain, a crucial skill for saving compute and maintaining security in production.

After standardising everything into a homogeneous format (I have little data engineering experience, so this stage was tedious and soul-draining), I turned to algorithm selection.

I wanted a GRPO variant. GRPO (Group Relative Policy Optimization) appealed to me because it eliminates the need for a separate critic and reward model, keeping only the policy and reference models, substantially reducing the computational overhead compared to traditional PPO.

# Trainer

I chose **RC-GRPO** (Reward-conditioned Group Relative Policy Optimization), a variant of GRPO introduced in a February 2026 arXiv paper. Its key innovation is maintaining diversity within each group rollout during GRPO training.

Here is the problem it solves: traditional GRPO requires a supervised fine-tuning (SFT) warm start. By the time GRPO begins, the model has already converged to a peak policy that generates high-quality responses with the correct format. This means all rollouts in a group look similar, rewards become nearly identical, and the advantage signal collapses, i.e., vanishingly small gradients. That is **advantage collapse**.

To evaluate different approaches, I planned several training pipelines:

- SFT only

- GRPO only

- SFT → GRPO

- RCTP → GRPO

- SFT → RC-GRPO

- RCTP → RC-GRPO

Each pipeline has two phases:

**Phase 1: SFT or RCTP.** RCTP (Reward-conditioned Trajectory Policy Fine-tuning) is similar to SFT but injects a reward token, i.e., `<|high_reward|>` or `<|low_reward|>`, into the system prompt to steer the model toward generating responses of the desired quality. This makes the model steerable from the start.

**Phase 2: GRPO or RC-GRPO.** In RC-GRPO, during each group rollout, high- and low-reward tokens are injected into the system prompt of each completion. The probability of seeing the high-reward token follows the proportion of high-reward samples in the RCTP dataset, preventing distribution shift.

# Bugs

Here are some of the most interesting bugs I encountered during three hellish weeks of building this project:

## The 14-hour training estimation time and wrong masking

This bug happened in the early stages of training when I found that the estimated time for training was around 14 hours, despite running on RTX 6000 Blackwell Pro with only a 4B base model with LoRA training. This number definitely had something wrong with it, since this was an unimaginably large number for such a small training run. Therefore, before executing training, I printed out all the relevant context: the hyperparameters, the model architecture, the text that the model would see during its training, etc. After several rounds like that, I found that I had set the maximum sequence length of the model to only 4096 tokens, while the average token length in the training dataset was around 5000 tokens. This meant that the model couldn't see the entire training sample, since it was truncated even before the sample completes its system prompt, user query, and retrieval function information. The model had no room left to produce reasoning or answers. When I printed out all loss values at the interval of every 10 steps, all the losses were zero, consuming a lot of processing time. After raising the maximum sequence length to 8192 tokens, the bugs were gone. This bug reminded me of a very popular tip for ML projects by Andrej Karpathy that I read many months ago. In his recipe blogs on ML training, he advised everyone that to print out all the input fed into their models, at least once, especially those who are working on vision tasks. If the input fed into the model is not what we expect, the training is doomed from that moment. I remember a day when I sat in front of my laptop and fought this bug brutally for around 14 hours, from 9 am to around 2 am of the next day. Lots of lessons learned, though it was hellishly frustrating.

## Reasoning length increasing

The next bug lay in the post-training with GRPO. When enabling the KL divergence to anchor the model on the reference checkpoint weights after SFT training, the model somehow learnt to cheat by increasing its reasoning trace indefinitely in post-training. Watching the logs showed everything; the mean completion length in the first 200 steps was around 200 tokens. However, by the time the training steps reached 500 steps, the mean completion length was already 512 tokens, which is the maximum completion length I had configured for the model. This observation indicated that the model had all completions in a group reaching the max completion length, highly unstable and suspicious. I tried to fix it by disabling the KL divergence with the reference SFT model, effectively eliminating the problem, though I had not understood the problem well enough. Another surprise came from disabling the KL divergence: the tremendous decrease in training time. The training time with KL enabled was around 1 hour and 50 minutes, while its counterpart without KL enabled only consumed 50 minutes. How efficient!

## New special tokens: to train or not to train?

The RC-GRPO algorithm that I chose to use in this project required injecting two special tokens: `<|high_reward|>` and `<|low_reward|>` into the model vocabulary set. There are two strategies to choose at the time:

### 1. Inject raw tokens into the chat message

This strategy only requires us to inject these two tokens at the beginning of the conversation prompt, system prompt or user prompt, your choice. However, since the tokenizer of the model was still unchanged, they can tokenize these special tokens into separate parts such as `<|`, `low`, `_`, `reward`, `|>` rather than a whole token as specified. As we can see, since the token was still processed in the old ways, their effect has negligible impact on the model performance. I painfully observed these results when running evaluation for the model between different settings. The accuracy between models initiated with SFT or RCTP were mainly the same with no noteworthy difference, while the difference between GRPO and non-GRPO was much more pronounced.

### 2. Re-training the embeddings for special tokens

This strategy is, of course, much more computationally expensive than the first one. Training the model using the first strategy involved only around $1-3\%$ LoRA trainable parameters, easily enabling efficient and fast finetuning. However, when adding the special tokens to the model's vocabulary set, we instruct the tokenizer to tokenize these tokens differently than before. That said, consider them as one single token like any other special tokens such as `<bos_token>` or `<|im_start|>`, etc. This would require the model to retrain its learned embeddings on these new tokens entirely, leading to a significant leap in number of trainable parameters. Specifically, the total trainable parameters rose from only 33 million to over 800 million out of the total parameters for a model of 4 billion parameters. This observation means that we had to train around $15\%$ of the total parameters, disabling fast finetuning and increasing the computational demand drastically. Although this strategy definitely enables much more performance than the first one due to its core innovations and first principles insight, I chose the first one because I would want to do a lot of experiments to compare different things, thus, the first one is definitely faster and gave me more time to do that.

# Closing Thoughts

After finishing all submissions — source code on my GitHub repository and a report in DOCX (yes, in docx, not Markdown or PDF, bruh) — I was told that I had been chosen for the final defense presentation with the council containing leading mentors from each department of Viettel Group. It was an honour but also a confusing moment, since I didn't think my result was good enough to be chosen. I even thought that my mentor had done something behind the scenes to help me get selected for the final defense :D. Eventually, I had to prepare a slide presentation for the defense. On the day the defense took place, I was given only 15 minutes to present all of my work, since underrepresenting it would lead to a fatal blow—the judges might think we hadn't done much, while in fact, we had done a lot. I spoke at the speed of light to finish the presentation. One of the judges asked me a question related to the metrics measured in the evaluation section that seemed quite confusing and misleading. I clarified with him their relationship and how they were calculated. Finally, he agreed with me and accepted my answer. The defense section had come to an end and I finally got freedom from all of this hard work once and for all.

In this project, I can say that I gained a handful of hands-on experience with NLP projects. I have done a small finetuning with DeepSeekOCR before but that was just a small assignment, no big deal, so I didn't gain much experience that time. This project truly enhanced my skills and experience in the field, although I don't intend to follow the natural language domain in the long term. Still, this journey still served as one of my most useful experiences in the last year. Hope other projects in the future still serve me well like this one, which means, they should not be too easy :D
