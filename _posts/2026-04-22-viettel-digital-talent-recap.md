---
layout: post
title: Viettel Digital Talent Recap
subtitle:
tags: [personal, viettel]
author: dzungphieuluuky
---

# Introduction

Here is my recap after finishing Phase 1 of Viettel Digital Talent 2026. Several months have passed since I first heard about this programme and decided to apply. This post covers everything from the application process to the biggest, fastest-paced solo project I have ever taken, perhaps.

# Application process

One day, while doom-scrolling through Facebook Reels, I stumbled across a post about a programme called "Project X Vietnam 2026." Feeling curious and bored after months of doing nothing meaningful, I clicked through to their fan page. There, I spotted a poster featuring someone from my university major (actually, he was a friend of my friend), wearing a shirt that read "Viettel Digital Talent."

That was when I realised I might have found something interesting enough to pull me out of my rut. I went straight to their website. Fortunately, applications were open until March 15, so I still had a few days left to apply for it.

**Round 1: English & IQ tests.** The first hurdle was the TOEIC entrance test, which was predictable since I did not have any English certificates yet, so they had to check my English abilities through this test. It was fairly straightforward; I scored 955 on the listening and reading sections. On the same day, I also sat through an IQ logic test with mysterious squares, rectangles, and hidden patterns. I have always been sceptical of these tests, since I do not believe they judge anything meaningful about a person; eventually I scored around 112 out of 160. That felt average compared to other guys; I heard that some of them had mysteriously achieved 140+ scores on this test, kind of mindblowing, or not.

**Round 2: Aptitude test.** A few days later came the aptitude test, the final screening round. The content depends on which track you apply for. I went with Data Science and Artificial Intelligence (DSAI), so my test covered a wide range of topics such as train test validation, learning rate and batch size effect on training, GAN objective functions, time series processing, etc. Other tracks, say, 5G, networking, digital design and verification, software engineering, data engineering, and so on, each received a tailored exam.

I scored 35 out of 45, which I did not consider so impressive. The test included data science concepts like SARIMA, ARIMA, and time-series processing, not my strong suit (since my interest leans much more towards deep learning with extremely deep networks and out-of-the-blue objective functions). Despite the mediocre score, I heard that I was passed straight into the programme without an interview. There were some gossips on the VDT alumni forums stating that scores of 33–34 might trigger an interview for further selection, while 35 and above meant direct entry. Lucky break.

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

- **RL, RL, RL**: RL is my favourite domain in deep learning right now alongside generative models of course, but there were no generative projects on the list.

- **Agentic AI and its relatives**: The contribution centred on training and inference techniques rather than building agentic systems around a frozen model with vendor-imposed rate limits. Subjectively, I consider projects with training and inference details "AI projects"; everything else is software engineering.

- **Absolutely dummy motivation of choice**: Another participant sharing a large portion of my name, since mine is Pham Ngoc Dung and his name is Pham Tien Dung. What a great surprise! I thought if I join this project, the mentor that would be guiding us in the next few weeks would be incredibly confused when mentioning us :D

As support by a mysterious source of serendipity, the mentor assigned to guide me happened to be the champion of Viettel AI Race 2025, an AI competition hosted by Viettel. Later on he also revealed that he was actually in the top 7 most excellent participants of VDT 2025, being awarded the title of talent ambassador for this wonderful project on RL training too. Despite my silly and absolutely nonsense sense of choosing the project, I somehow fell into one of the most prestigious mentors I could found during this cohort of the program.

# Dataset

Before training, I needed to pick a reference algorithm. The project involved: synthetic dataset generation from available function schemas, a training pipeline with ablation studies, evaluation of tool-calling performance, and, of course reports and slides for submission.

I was given 26 function schemas in a raw format and had to transform them into OpenAI-compatible JSON schemas. I split the data into two sets: **seen functions** for training and **unseen functions** for testing. To prevent overfitting to the telecom domain, I also injected dummy functions, i.e., `get_weather`, `get_traffic`, and similar, to distract the model from the core telecom functions and encourage generalisation.

The dataset covered several calling scenarios:

- **Single call**: the query required exactly one function call.

- **Parallel calls**: multiple independent functions needed to be invoked. These situations can contain similar or different function calls.

- **No call (abstention)**: the query was irrelevant or out of scope, so the model had to abstain, a crucial skill for saving cost and maintaining security in production.

After standardising everything into a homogeneous format (I have little data engineering experience, so this stage was tedious and soul-draining much more than I had imagined), I turned to algorithm selection.

I wanted a GRPO variant. GRPO (Group Relative Policy Optimization) appealed to me because it eliminates the need for a separate critic and reward model, keeping only the policy and reference models, substantially reducing the computational overhead compared to traditional PPO.

# Trainer

I chose **RC-GRPO** (Reward-conditioned Group Relative Policy Optimization), a variant of GRPO introduced in a February 2026 arXiv paper. Its key innovation is maintaining diversity within each group rollout during GRPO training.

Here is the problem it solves: traditional GRPO requires a supervised fine-tuning (SFT) warm start. By the time GRPO begins, the model has already converged to a peak policy that generates high-quality responses with the correct format. This means all rollouts in a group look similar, rewards become nearly identical, and the advantage signal collapses, i.e., vanishingly small gradients. That is **advantage collapse**. Some literature addresses this issue as low reward variance, all of these names carry the same idea. 

To evaluate different approaches, I planned several training pipelines:

- SFT only
 
- GRPO only

- SFT → GRPO

- RCTP → GRPO

- SFT → RC-GRPO

- RCTP → RC-GRPO

Each pipeline has two phases:

**Phase 1: SFT or RCTP.** RCTP (Reward-conditioned Trajectory Policy Fine-tuning) is similar to SFT but injects a reward token, i.e., `<|high_reward|>` or `<|low_reward|>`, into the system prompt to steer the model toward generating responses of the desired quality. This makes the model steerable from the start.

**Phase 2: GRPO or RC-GRPO.** In RC-GRPO, during each group rollout, high- and low-reward tokens are injected into the system prompt of each completion. The probability of seeing the high-reward token follows the proportion of high-reward samples in the RCTP dataset, preventing distribution shift between stage 1 and stage 2 training.

# Fantastic bugs and where to find them

Here are some of the most interesting bugs I encountered during three hellish weeks of building this project:

## The 14-hour training estimation time and wrong masking

This bug happened in the early stages of training when I found that the estimated time for training was around 14 hours, despite running on RTX 6000 Blackwell Pro with only a 4B base model with LoRA training. This number definitely had something wrong with it, since this was an unimaginably large number for such a small training run. Therefore, before executing training, I printed out all the relevant context: the hyperparameters, the model architecture, the text that the model would see during its training, etc. After several rounds like that, I found that I had set the maximum sequence length of the model to only 4096 tokens, while the average token length in the training dataset was around 5000 tokens. This meant that the model couldn't see the entire training sample, since it was truncated even before the sample completes its system prompt, user query, and retrieval function information. The model had no room left to produce reasoning or answers. When I printed out all loss values at the interval of every 10 steps, all the losses were zero, consuming a lot of processing time. After raising the maximum sequence length to 8192 tokens, the bugs were gone. This bug reminded me of a very popular tip for ML projects by Andrej Karpathy that I read many months ago. In his recipe blogs on ML training, he advised everyone that to print out all the input fed into their models, at least once, especially those who are working on vision tasks. If the input fed into the model is not what we expect, the training is doomed from that moment. I remember a day when I sat in front of my laptop and fought this bug brutally for around 14 hours, from 9 am to around 2 am of the next day. Lots of lessons learned, though it was hellishly frustrating.

## Reasoning length increasing

The next bug lay in the post-training with GRPO. When enabling the KL divergence to anchor the model on the reference checkpoint weights after SFT training, the model somehow learnt to cheat by increasing its reasoning trace indefinitely in post-training. Watching the logs showed everything; the mean completion length in the first 200 steps was around 200 tokens. However, by the time the training steps reached 500 steps, the mean completion length was already 512 tokens, which is the maximum completion length I had configured for the model. This observation indicated that the model had all completions in a group reaching the max completion length, highly unstable and suspicious. Since the max completion length has been reached, the model has even not completed its response yet, returning invalid tool callings. Sometimes the model has been too verbose which leads to overthinking, eventually dominating all the tokens that were supposed to use for tool calls response. I tried to fix it by disabling the KL divergence with the reference SFT model, effectively eliminating the problem, though I had not understood the problem well enough. Another very unsurprisingly discovery came from disabling the KL divergence: the tremendous decrease in training time :D. The training time with KL enabled was around 1 hour and 50 minutes, while its counterpart without KL enabled only consumed 50 minutes. How efficient! I have already known that cutting off KL divergence would tremendously decrease training cost and time but even to this extent?

## New special tokens: to train or not to train?

The RC-GRPO algorithm that I chose to use in this project required injecting two special tokens: `<|high_reward|>` and `<|low_reward|>` into the model vocabulary set. There are two strategies to choose at the time:

### 1. Inject raw tokens into the chat message

This strategy only requires us to inject these two tokens at the beginning of the conversation prompt, system prompt or user prompt, your choice. However, since the tokenizer of the model was still unchanged, they can tokenize these special tokens into separate parts such as `<|`, `low`, `_`, `reward`, `|>` rather than a whole token as specified, using their pre-trained vocabulary set. As we can see, since the token was still processed in the old ways, their effect has negligible impact on the model performance. I painfully observed these results when running evaluation for the model between different settings. The accuracy between models initiated with SFT or RCTP were mainly the same with no noteworthy difference, while the difference between GRPO and non-GRPO was much more pronounced indicating RLVR training has been successful to some extent in this context.

### 2. Re-training the embeddings for special tokens

This strategy is, of course, much more computationally expensive than the first one. Training the model using the first strategy involved only around $1-3\%$ LoRA trainable parameters, easily enabling efficient and fast fine-tuning with a very small portion of parameters. However, when adding the special tokens to the model's vocabulary set, we instruct the tokenizer to tokenize these tokens differently than before. That said, consider them as one single token like any other special tokens such as `<bos_token>` or `<|im_start|>`. This would require the model to retrain its learned embeddings on these new tokens entirely, leading to a significant leap in number of trainable parameters. Specifically, the total trainable parameters rose from only 33 million to over 800 million out of the total parameters for a 4B model. This observation means that we had to train around $15\%$ of the total parameters, disabling fast finetuning and increasing the computational demand drastically. Although this strategy definitely enables much more performance than the first one due to its core innovations and first principles insight, I chose the first one because I would want to do a lot of experiments to compare different things, thus, the first one is definitely faster and gave me more time to do that.

# Evaluation
After constructing the training and inference pipeline, I had to run evaluation for around 15 checkpoints for different configs and hyperparameters set. Since my mentor had advised that we should do as much ablation studies as possible to show our efforts and gain more insights on the training algorithms and its effect on performance.

## Incredibly poor performance on base model
First of all, there was a big surprise on the performance of the base model Qwen3-4B-Instruct-2507 that I used as the initial checkpoint to conduct further fine-tuning. Although the model has been pretrained extensively and achieved some kind of good performance, it surprisingly performed incredibly bad in this settings. There were several reasons for this situation:
- The model has not been trained so much on telecommunication domain, so some terms and concepts are not too familiar with the model, leading to poor understanding.
- The model were overly verbose and end up using all of its token compute for reasoning, failed to return valid tool calls as answer.

## Naive evaluation on top-k retrieved functions
At first, I integrated the function retriever into the evaluation pipeline as proposed. After some eval runs, I found some results are not so good, the accuracy is not as high as I had expected, and the task success rate, which is the most difficult evaluation metrics of all, is just so horrible. Then I happened to realize that, if the retrieved functions are already wrong, then it is meaningless for the model to evaluate fairly, since it won't see the correct function it needs in the catalog. Therefore, I decided to give the model full set of 31 functions in its conversation history, rather than only the retrieved functions, in order to bypass the haystack given by the retrieval process. Finally, the evaluation metrics only increased a little bit, now I can conclude the poor metrics it got is mainly from the training algorithms and settings, not mainly from the lack of necessary functions in the retrieved sets.

## Embedding model, one last effort
After cutting off the function retriever out of the evaluation pipeline, I gave it a final chance, to benchmark and compare performance of several popular embeddings model that were used for retrieval. There are three of them: 
- BAAI/bge-m3 (bge)
- AITeamVN/Vietnamese_Embedding_v2 (vietnamese-embedding) 
- codefuse-ai/F2LLM-v2-0.6B (f2llm)
After I benchmarked all of these models, the results are very intuitive and easy to understand. Summary, **f2llm** achieved the best results among the three, mainly because it was trained mainly on code dataset with highly structured text such as function and tool calls definition. Therefore, it easily grasped the understanding of the functions set I gave it without too much difficulty. The **bge** fell behind mainly because it was trained on different languages, capable of multilingual capabilities with general language understanding, not specific tailored for code structure related tasks. The **vietnamese-embedding** performed in Vietnamese a little better than **bge** because it was finetuned exclusively on Vietnamese, but only on natural semantic text with verbose understanding, also, not code structure. Therefore, I chose the **f2llm** model to report the results and stated that fine-tuning an embedding model would go beyond the scope of this mini project, I decided not to do that. However, since tool calling tasks in real production would essentially involves both embedding models for retrieved highly relevant functions, and a function calling model for return valid and correct function calls for users, it would require us to optimize these two components simultaneously. It is just a matter of time.

# Final defense presentation
After finishing all submissions — source code on my GitHub repository and a report in DOCX (yes, in docx, not Markdown or PDF, bruh) — I was told that I had been chosen for the final defense presentation with the council containing leading mentors from each department of Viettel Group. It was an honour but also a confusing moment, since I didn't think my result was good enough to be chosen. I even thought that my mentor had done something behind the scenes to help me get selected for the final defense :D. Eventually, I had to prepare a slide presentation for the defense. On the day the defense took place, I was given only 15 minutes to present all of my work, since underrepresenting it would lead to a fatal blow—the judges might think we hadn't done much, while in fact, we had done a lot. I spoke at the speed of light to finish the presentation. One of the judges asked me a question related to the metrics measured in the evaluation section that seemed quite confusing and misleading. I clarified with him their relationship and how they were calculated. Finally, he agreed with me and accepted my answer. The defense section had come to an end and I finally got freedom from all of this hard work once and for all.

# Talent Ambassador Award
After completed the final defense presentation with the council, I relaxed myself for about two weeks before the closing ceremony announcement come to my front door. About two days before the ceremony, I was announced privately that I have been chosen to proceed straightly to phase 2 of the program for my excellent performance. However since this information is guarded with ultimate privacy through a warning in red text :D so I cannot tell anyone prior to the ceremony. Finally on the day of the ceremony, I drive to the MerPerle Crystal Palace hotel. Just a few minutes after the speech from the executives of the Viettel Group has been finished, the award announcement finally began. I was named on the stage as one of the Viettel Talent Ambassador of the program, as a participant from track Data Science & Artificial Intelligence. Wow to be honest, this is somewhat incredible. From the moment I realized that even though I passed the phase 1 of the program, I cannot proceed to phase 2 because they require us to be onsite at Ha Noi, and I still had a lot of work to do in HCM city. Therefore, I decided to go through with the project as fast as possible to escape from this stress. Interestingly, that attitude with the project seems to help me relieve more stress and feels more comfortable with the project, eventually achieved this valuable award. As ambassador, we were awarded with one more certificate denoted the title of Viettel Talent Ambassador and a bunch of flowers (yeah they were real flowers, not fake ones). As far as I could tell, there are about 20-30 ambassadors in total, covering both Ha Noi and HCM city, which makes us around top $3.75\%$ of the total participants of Viettel Digital Talent 2026.

# Closing thoughts

In this project, I can say that I gained a handful of hands-on experience for my expertise. This is also the first and biggest milestone I have ever achieved since the moment I entered university. For a long time, I have been alone and being trained everyday with an infinite well of blogs, articles, research papers, github repositories, etc. This project is truly something I can use all those knowledge to the fullest and even make friends with a super nice mentor from HUST, which, Ha Noi University of Science and Technology. I have done a small finetuning with DeepSeekOCR before but that was just a small assignment, no big deal, so I didn't gain much experience that time. This project truly enhanced my skills and experience in the field, although I don't intend to follow the natural language domain in the long term. Still, this journey still served as one of my most useful experiences in the last year. Hope other projects in the future still serve me well like this one, which means, they should not be too easy :D

