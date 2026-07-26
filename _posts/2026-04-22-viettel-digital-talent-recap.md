---
layout: post
title: Viettel Digital Talent Recap
subtitle: From doom-scrolling to training LLMs with RL, my journey through Phase 1
cover-img: # TODO: add cover image (e.g., /assets/img/posts/viettel-digital-talent/cover.png)
thumbnail-img: # TODO: add thumbnail image
share-img: # TODO: add social share image
tags: [personal, viettel]
author: dzungphieuluuky
---

# Introduction
Here is my recap after finishing Phase 1 of Viettel Digital Talent 2026. Several months have passed since I first heard about this programme and decided to apply. This post covers everything from the application process to the biggest, fastest-paced solo project I have ever taken on as an undergraduate.

# Discovery & Application

One day, while doom-scrolling through Facebook Reels, I stumbled across a post about a programme called "Project X Vietnam 2026." Feeling curious, and bored after months of doing nothing meaningful, I clicked through to their fanpage. There, I spotted a poster featuring someone from my university major, wearing a shirt that read "Viettel Digital Talent."

That was when I realised I might have found something interesting enough to pull me out of my rut. I went straight to their website. Fortunately, applications were open until March 15, so I still had a few days left.

**Round 1: English & IQ tests.** The first hurdle was the TOEIC entrance test, which was predictable since I did not have any English certificates yet. It was fairly straightforward; I scored 955 on the listening and reading sections. On the same day, I also sat through an IQ logic test with mysterious squares, rectangles, and hidden patterns. I have always been sceptical of these tests, since I do not believe they judge anything meaningful about a person, but I scored around 112 out of 160. That felt average compared to the people who somehow scored 140+.

**Round 2: Aptitude test.** A few days later came the aptitude test (*Bài kiểm tra chuyên môn*), the final screening round. The content depends on which track you apply for. I went with Data Science and Artificial Intelligence (DSAI), so my test covered those topics. Other tracks, i.e., 5G, networking, digital design and verification, software engineering, data engineering, and so on, each received a tailored exam.

I scored 35 out of 45, which I did not consider very high. The test included data science concepts like SARIMA, ARIMA, and time-series processing, not my strong suit (my interest leans toward deep learning). Despite the mediocre score, I heard that I was passed straight into the programme without an interview. Word on the forum was that scores of 33–34 might trigger an interview, while 35 and above meant direct entry. Lucky break.

And so, my journey with Viettel Digital Talent began.

# First Lectures

At the beginning of the programme, we only needed to attend a few lectures each week. They covered a wide range of topics: recommender systems, speech processing, satellite image processing with spectral analysis, fine-tuning large language models, transformers, mixture of experts, and agentic systems. To be honest, this stage was quite boring. We sat there, opened Zoom, watched the lecture, or muted it and did something else. (Do not recommend.)

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

Before training, I needed to pick a reference algorithm. The project involved: synthetic dataset generation from available function schemas, a training pipeline with ablation studies, evaluation of tool-calling performance, and of course reports and slides for submission.

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

**[PLACEHOLDER: Describe each bug, i.e., what happened, why it was tricky, how you fixed it, and what you learned. Consider formatting each as a mini case study.]**

Bug 1: [title]

Bug 2: [title]

Bug 3: [title]

**[PLACEHOLDER: Add any memorable debugging moments, tool output screenshots, or "aha" revelations. These stories make the post relatable!]**

# Closing Thoughts

**[PLACEHOLDER: Write a reflection on the overall experience. Consider touching on:]**
- What was the hardest part of Phase 1 beyond the technical work?
- What would you do differently if you started over?
- What skills or knowledge did this phase develop that you did not expect?
- What are you looking forward to in Phase 2?
- Who would you recommend this programme to?

