---
layout: post
title: Some reasons I like reinforcement learning
subtitle: rationale behind my RL bias
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

In SL, you are a data entry clerk; in RL, you are a coach. Instead of telling your model "this is a cat," you're throwing it into a "tall grass" environment and watching it struggle until it learns to "level up." There’s a certain thrill in defining a reward function—your version of a Rare Candy—and watching the agent suddenly evolve from spinning in circles to performing complex tasks. You don’t provide the answers; you just provide the incentives and watch the "evolution" happen. Since the results of RL training are intelligent agents that can help you to automate something or navigate an environment on itself, you can view it somehow a pokemon and you are its trainer.

## RL resembles how we actually learn to walk or speak when were babies

No one handed us a labeled dataset of 10,000 "correct walking frames" when we were toddlers. We stood up, gravity took over, and we hit the floor. That pain from falling to the ground was a negative reward. The sensation of moving forward was a positive one. RL feels more natural it every ways of learning from human to animals because it’s based on the loop of Trial → Error → Adjustment. It’s the physics of life applied to code. The learning journey relies on how the environment reponse to your action or your decision, from that response you decide to act differently in that same scenario the next time you encounter it. This way the learning feels more natural and self-evolutionary rather than static and heavily relies on fixed dataset that someone throws at us.

## RL training process is much more fascinating and uncontrollable than traditional training

In SL, the loss curve is usually a boring slide downward. In RL, it’s a roller coaster. Because the agent’s actions determine its future data, a small mistake can lead to a death spiral or a stroke of genius can lead to a breakthrough. It’s chaotic, unpredictable, and—coming from a physics background—it feels like watching a complex dynamical system reach equilibrium. Therefore, training an RL agent encounters such instability that training a SL model won't give you. On the other hand, we don't have to gather data and perform preprocessing techniques on the data before training because the agent generates data from its interaction with the environment. The agent on one hand generates new data and on the other hand use that data to update itself. Such a trade-off!

# Big reasons

## The push and pull counterparts between RL training and SL training

While SL and RL are all machine learning subfields, I discovered they have a push-and-pull relationship which is very interesting. Both aim at one single thing, to train a model to become better at predicting or acting for a specific problem.

We can view the SL training setup as a pulling process that continuously pull the current model towards some specific target, in this case it may be a loss function or an objective function in case we are defining a new function to instruct the model better at our problem. We can see that the target that the model is trying to achieve is actually fixed, it is always there waiting the model to reach it. It is indeed a stationary target and quite easy for the model to leanr it, assuming that other factors such as optimizers, initializations and network architectures not considered.

On the other hand, we can see that the target of the RL training setup is only 

## The interaction between model and data: static and dynamic

In SL, the dataset is a "dead" artifact—a tomb of information that never changes. In RL, the dataset is "alive." As the agent improves, the data it collects becomes more sophisticated. This creates a feedback loop where the model’s own behavior shapes its future learning environment. It’s the difference between studying a map (SL) and actually driving the car (RL).

## Major challenges that RL gives you but SL does not, and I'm quite excited with these things

RL introduces the "Credit Assignment Problem": if a robot falls over at step 100, was it because of the move at step 99 or step 10? Solving this requires dealing with delayed rewards and non-stationarity. These aren't just bugs; they are fundamental hurdles that make RL feel like the "Final Boss" of AI. For someone who likes the "smooth shape" of physics, the way RL agents navigate high-dimensional policy spaces is much more satisfying than simply fitting a curve to a static cloud of points.