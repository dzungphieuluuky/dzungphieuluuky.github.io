---
layout: post
title: Some reasons I like reinforcement learning
subtitle: Rationale behind my RL bias
cover-img:
thumbnail-img:
share-img:
tags: [personal, reinforcement-learning, AI]
author: dzungphieuluuky
---
# Introduction

Back to my high school, physics is my main interest. I also enrolled in my high school with main focus in physics and gained some achievements in competitions including Vietnam National Physics Olympiad (VPhO). Studying physics taught me a lot about how the world works and how some common principles could be used to predict new events which we don't need to observe them physically ourselves (or in some cases, not feasible enough for us to observe them in practice).

When I encountering maths in university, things are getting so discrete with all of Karnaugh maps, boolean algebra and true/false things. Honestly I don't like those things since I was with physics for a long time and everything there was all continuous. They are are continuous, fuzzy and has some kind of smooth shape in its representation for you to trace them. Thus I kind of struggled with coursework in university at the some first semesters. Only when I heard that AI and specifically deep learning use more calculus and continuous maths than discrete algebra, I began to see some interest in this field. 

First I started to learn some basic things about machine learning and as everyone else, the first one you encounter when talking about deep learning is training a neural network on a preprocessed, fixed dataset, which we call **supervised learning (SL)**. At this point, again, I feel boring with this kind of training paradigm. Although learning from data is the most straightforward thing you can think of when talking about training since we need something already good to mimic them. But I want the training to be somehow more elegant, more universal, not relying on any external data and only on the model itself, somehow we can call it learning on the fly or online learning with the the changing data or environment. That is when I know the existence of something called **Reinforcement Learning (RL)**, which helps the agent (aka the model in this context, although the network model itself can be thought of the engine of the agent, not the agent itself). In this blog I will talk about some comparisons I find interesting when talking about SL and RL and why I think RL is more fascinating and maybe the next cornerstone in deep learning in particular and in artificial intelligence in general.

# Small reasons

## An RL trainer makes you look like a pokemon trainer

In SL, you are a data entry clerk; in RL, you are a coach. Instead of telling your model this is a cat, you're throwing it into a tall grass environment and watching it struggle until it learns to level up. There’s a certain thrill in defining a reward function—your version of a Rare Candy—and watching the agent suddenly evolve from spinning in circles to performing complex tasks. You don’t provide the answers; you just provide the incentives and watch the evolution happen. Since the results of RL training are intelligent agents that can help you to automate something or navigate an environment on itself, you can view it somehow a pokemon and you are its trainer.

## RL resembles how we actually learn to walk or speak when were babies

No one handed us a labeled dataset of 10,000 correct walking frames when we were toddlers. We stood up, gravity took over, and we hit the floor. That pain from falling to the ground was a negative reward. The sensation of moving forward was a positive one. RL feels more natural it every ways of learning from human to animals because it’s based on the loop of Trial → Error → Adjustment. It’s the physics of life applied to code. The learning journey relies on how the environment reponse to your action or your decision, from that response you decide to act differently in that same scenario the next time you encounter it. This way the learning feels more natural and self-evolutionary rather than static and heavily relies on fixed dataset that someone throws at us.

## RL training process is much more fascinating and uncontrollable than traditional training

In SL, the loss curve is usually a boring slide downward. In RL, it’s a roller coaster. Because the agent’s actions determine its future data, a small mistake can lead to a death spiral or a stroke of genius can lead to a breakthrough. It’s chaotic, unpredictable, and—coming from a physics background—it feels like watching a complex dynamical system reach equilibrium. Therefore, training an RL agent encounters such instability that training a SL model won't give you. On the other hand, we don't have to gather data and perform preprocessing techniques on the data before training because the agent generates data from its interaction with the environment. The agent on one hand generates new data and on the other hand use that data to update itself. Such a trade-off!

# Big reasons

## The push and pull counterparts between RL training and SL training

While SL and RL are all machine learning subfields, I discovered they have a push-and-pull relationship which is very interesting. Both aim at one single thing, to train a model to become better at predicting or acting for a specific problem.

We can view the SL training setup as a pulling process that continuously pull the current model towards some specific target, in this case it may be a loss function or an objective function in case we are defining a new function to instruct the model better at our problem. We can see that the target that the model is trying to achieve is actually fixed, it is always there waiting the model to reach it. It is indeed a stationary target and quite easy for the model to learn it, assuming that other factors such as optimizers, initializations and network architectures not considered.

On the other hand, we can see that the target of the RL training setup is only trying to increase the total expected reward over a period of time. It is non-stationary and dynamic with unbounded and unknown optimal values. It only tries to increase this value as much as possible as this functions acts as the model's objective function. So we can see that training an RL agent is pushing it far away from its terrible state or much likely from its initial state and hope it to reach its optimal policy to effectivelt draw out the best action given a specific state.

In conclusion, SL provides us with exact target and a clear goal for our model to reach, RL on the other hand does not do such benevolent things, it forces the agent to interact with the environment and update its internal policy distribution to respond to the environment as effectively as possible to gain the maximum expected total reward as possible.

## The interaction between model and data: static and dynamic

In SL, the dataset is a dead artifact—a tomb of information that never changes. The data is static and have a one-way influence on the model and not gaining any influence from the model. Therefore the interaction between the model and the data, which is the two pillar in any machine learning setup, is flowing only from the data to the model. This facilitates the training process to be more stable as we have a strong assumption-the data that we have created before is perfect and can be used as the single source of truth (assuming that the data preprocessing contains no major flaws).

On the other hand, RL gives us a two-way comunication between data and model. First, we don't have any data to train, thus we have to guide our model to select actions randomly in a few first steps (or episodes, based on how we define the problem), only when the data is enough based on some criteria, we start to train the model based on the data that it has just generated. When the model get upgraded, its internal policy has changed and the data distribution that it will generate in the future will also changed according to that dynamics, this time we have an entire new model and an entire new dataset with different distributions from the former phase. This reason is why we say that RL training process possesses such property called non-stationarity.

# Fundamental challenges: 
These are some of the most fundamental challenges scientists encounter when trying to solve RL problems that I deem interesting and noteworthy.

## Credit Assignment

Beyond the dynamic nature of the data, RL introduces some fundamental hurdles that SL simply doesn't have to deal with. The most famous one is the **Credit Assignment Problem**. Imagine a robot trying to walk that performs 100 different joint movements and then eventually falls over. Was it the very last move at step 100 that caused the fall, or was it a poor decision made back at step 20? In SL, the culprit is right there for every single data point, but in RL, the reward is often delayed. To solve this, we have to use things like the **Value Function** $V(s)$ to estimate the long-term benefit of a state, which feels a lot like calculating potential energy in physics to predict future motion.

Basically, the credit assignment problem actually has 2 forms: one spatial (space) and one temporal (time).

- **Temporal assignment problem**: this is the case I talked about in the previous paragraph, in a long trajectories of actions that the agent has performed in its life, we cannot actually know what actions or what decisions specifically in the past that lead to a particular result in the future, thus it creates some kind of difficulties when try to find the best policy to teach the agent.

- **Spatial assignment problem**: this case is actually not happening in single-agent setup, because its primary domain is in multi-agent setup. In that scenario, we have multiple agents acting together collaboratively or competitively based on how we define the problem. When a specific result happen to all the agents in the system, we cannot actually know what is the true culprit of that result, assuming that we only care that which agent is the culprit (not a specific action in a particular agent's action trajectories, that would be a space-time assignment problem, which is much harder).

## Exploration-Exploitation trade-off

Another thing I find quite exciting is the **Exploration-Exploitation trade-off**. In SL, the model just tries to fit the data you give it. But in RL, the agent faces a dilemma: should it stick with the best action it knows so far to get a guaranteed reward (Exploitation), or should it try something completely random and potentially stupid to see if there is a better path it hasn't discovered yet (Exploration)? 

We often use a simple strategy like $\epsilon$-greedy to handle this:
$$\pi(a|s) = \begin{cases} \text{random action} & \text{with probability } \epsilon \\ \arg\max_a Q(s,a) & \text{with probability } 1-\epsilon \end{cases}$$

This reminds me of thermal noise in physics—sometimes you need a bit of heat or randomness in the system to jump out of a local trap and find the true global optimum. For someone who likes the smooth shape and continuous representations of physics, watching an agent navigate these high-dimensional policy spaces and solve these hurdles is much more satisfying than just fitting a curve to a static cloud of points.

This is the end of my beginning blog on technical things on my personal website, if you (i don't know whether someone will actually discover this place) are also interested in reinforcement learning (especially deep reinforcement learning, I like deep things) and diffusion models or just one of them, feel free to contact me via my email and github profile on my  page. Below are some resources that you may find useful and interesting to use as materials for our learning journey.

# Resources to look at

If you’re interested in this stuff, I really recommend checking out these labs and blogs. They helped me bridge the gap between standard AI and the more advanced research that's happening right now:

### 1. Research Labs and Academic Blogs

* [**UC Berkeley BAIR Lab:**](https://bair.berkeley.edu/blog/) This is a gold mine for anyone into robotics and RL. Their posts on **Diffusion Policy** are a must-read if you want to see how generative models (like the ones that make images) are being used to help robots move.

### 2. Theoretical Foundations

* [**Yang Song’s Blog:**](https://yang-song.net/) This is probably the best place on the internet to learn about the math of **Diffusion** and **Score-based models**. He explains how we turn noise back into data in a way that actually makes sense.
* [**Lilian Weng’s Blog (Lil'Log):**](https://lilianweng.github.io/) Lilian is an expert at summarizing massive amounts of research. Her posts are like the ultimate cheat sheets for technical summaries on RL and newer generation techniques. She had been doing research at OpenAI and currently are working at [Thinking Machines Lab](https://thinkingmachines.ai) with John Schulman, one of the pioneers in reinforcement learning at OpenAI.

---

# Conclusion

My path from Physics to Reinforcement Learning has taught me that the coolest systems are the ones that can adapt to the laws of their environment without any fixed dataset given beforehand.

We’re moving into a time where AI isn't just mimicking a fixed dataset like in **Supervised Learning**. Instead, with the mix of **RL and Diffusion**, agents are starting to imagine a path and then act on it. For me, coming from a background where I spent all my time looking at the smooth curves and continuous laws of physics, seeing an RL agent learn to navigate a complex problem is more than just a coding project—it’s like watching artificial physics in action.

I believe the next big thing in AI won't just be a model that reacts to what we give it, but a model that understands the physics of its own world well enough to plan its own future.

---