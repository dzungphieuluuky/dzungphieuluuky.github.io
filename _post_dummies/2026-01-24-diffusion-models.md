---
layout: post
title: Diffusion Models
subtitle: From physics to generative AI
cover-img:
thumbnail-img:
share-img:
tags: [diffusion]
author: dzungphieuluuky
---

# Introduction

Generative AI these days are becoming increasingly complex and capable than ever before. The ability to generate realistic images once seems to be impossible for a deterministic computers to generate now becomes something that even an undergraduate students or even high schoolers can approach. Their only needs are internet connection, a computer to access the internet and use powerful and painstakingly pre-trained models that are publicly available. From GAN to VAE, and we end up use diffusion models (especially Stable Diffusion architecture) for most of generative tasks related to image. Of course, some of the research are opening for diffusion model to touch its hand into the language modeling domain with the emergence of Diffusion Language Model. In this blog, I want to tell a little journey how I approach diffusion model and what I think about them, hopefully this will serve as some of my retrospective that my future-self can look back and see how far I went in my journey with this voodoo magic craft. Let's begin.

# Natural Language Processing project

Everything start from the project topic seleciton on Introduction to Natural Language Processing course. In this course, we will need to choose one topic out of list containing around 20 topics and spend the next 10 weeks on that topic alone. Out of these topics, we decided to choose the Sino-Nom transliteration topics. My friend in the team has been a member in a lab of one of the professor in my univeristy so he told me to choose that topic because it seems easier and highly relevant with some work he had already done for the lab. 

- kể về đồ án sino nom transliteration gốc

- thầy Điền rủ đi làm đồ án diffusion và OCR

- đánh nhau với khái niệm diffusion

- đọc blog của lilian weng và sander để nắm sơ ý tưởng

- đám nhau với repo của fontdiffuser và cài đặt version thưu viện

# Mid Journey not midjourney

- kể về quá trình thử các cách như skeleton transform, FFT, LPIPS and SSIM as loss functions, cái fail và cái success

- chật vật thử nghiệm mà ko có ground truth

- tìm tới cuốn sách principles của yang song

- hoảng hốt vì các khái niệm như tweedie và fokker-planck

# Motivation for DLMs

- tìm kiếm đề tài khoá luận

- tìm thầy hướng dẫn, kể về cuộc gặp gỡ với thầy SE và biết domain ổng đang làm

- dự định dùng diffusion vào mảng language để làm khoá luận

- bày tỏ sự chán nản với đề tài trong trường: ảnh y tế, Graph RAG, nhận diện khuôn mặt, explainable AI,...

---

# Conclusion

My journey into diffusion models feels something like coming home. Back when I was preparing for my national olympiad competition, I had touched a little bit on thermodynamics. In this field, there are several transfer process, denoting the heat transfer, particles diffusion and internal friction between layers of fluid. All these topics are considered to be hard topics for high schoolers who are basically has not touch their hands on real calculus or probability distributions deep enough at that time. I also deemed these topics as incredibly difficult at the time. Having a nice meeting with diffusion one more time after a long time from my last participation in the olympiads feel kinds of nostalgic, as if this must be the right time for me to touch deeper on this topic, the topic that I tried to erase from existence due to its overwhelming power that seems like an angry stream of godlike waters that pour directly onto my pathetic brain cells.

---

*My recommended reading materials:*

- [**Yang Song’s blog and papers**](https://yang-song.net/) – for the clearest mathematical foundations of score-based and diffusion models. This guy can be considered to be one of the godfathers of diffusion-based generative modeling. If you are deeply interested in diffusion models, I highly recommend you to read all of his blogs and papers.
- [**Lilian Weng's Lil'Log**](https://lilianweng.github.io/) – for concise, insightful summaries of diffusion research and beyond. Her blogs act as a centralized source of truth that harbors all necessary foundation knowledge on a specific topic and also all SOTA results on frontier research. For those who are suffering from literature review process, her blogs are definitely lifesavers.
- [**UC Berkeley BAIR Blog**](https://bair.berkeley.edu/blog/) – for cutting-edge applications like Diffusion Policy in robotics. BAIR is undeniably one of the strongest labs in the world in the fields of deep reinforcement learning. It has given birth to many famous RL algorithms, notably including soft actor-critic for continuous action spaces.