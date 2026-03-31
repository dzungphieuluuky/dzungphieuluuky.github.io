---
layout: post
title: Reinforcement learning
subtitle: The magic of reinforcement learning
cover-img:
thumbnail-img:
share-img:
tags: [reinforcement-learning]
author: dzungphieuluuky
---

# Introduction

Back in my high school, physics was my main interest. I also enrolled in my high school with a main focus in physics and gained some achievements in competitions including the Vietnam National Physics Olympiad (VPhO). Studying physics taught me a lot about how the world works and how some common principles could be used to predict new events which we don't need to observe physically ourselves (or in some cases, it is not feasible enough for us to observe them in practice).

When I encountered maths in university, things became so discrete with all of Karnaugh maps, boolean algebra and true/false things. Honestly I don't like those things since I was with physics for a long time and everything there was all continuous. They are continuous and can be modeled using continuous functions, so that we can trace their changes over time easily. Thus I kind of struggled with coursework in university for the first few semesters. Only when I heard that AI and specifically deep learning are built with mainly calculus and optimizations including continuous functions, I began to feel that this field may be the right field for me to dive deep into it.

First I started to learn some basic things about machine learning. This field contains a lot of stuff including bias-variance tradeoff, loss functions, optimizations with first order and second order derivatives, etc. One of the most fascinating parts of machine learning is definitely deep learning, where we are moving away from using simple models such as decision trees to very deep neural networks that may contain up to one thousand layers or neurons. As everyone else, the first one you encounter when self-teaching deep learning is training a neural network on a research-ready dataset. This type of learning is called **Supervised Learning (SL)**. At this point, again, I feel bored with this kind of training paradigm. Although learning from data is the most straightforward method you can think of when talking about training since we need something already good to mimic them, I want the training to be somehow more universal, since preparing a training dataset can consume an unfathomable amount of time and difficulties with data engineering. That is when I learned about the existence of a very fantastic branch of machine learning, so-called **Reinforcement Learning (RL)**, which aims to create an intelligent agent by training itself through a series of interactions between the agent and the environment that it is working on. In this blog I would like to share some of my thoughts why I find RL is much more fascinating than traditional SL and why it would likely be the next cornerstone of artificial intelligence development in general. Following the views of some popular AI researchers, RL is considered to be the paradigm that can lead us to ASI (Artificial Superintelligence) or AGI (Artificial General Intelligence) depending on which word is to your preference.

# Small reasons

## Fitting a model vs Training an agent
In this section, I would like to compare a little between these two paradigms of training to provide some differences and insights on how they are so different from each other. These comparisons are performed entirely based on my intuition and collective experience up to the time I write this blog post, so things might need to be checked several times more but I will try my best to validate them myself. Now, we would jump to the traditional settings of supervised learning first.

### Supervised Learning
In supervised learning settings, we are trying to fit a model to a fixed training dataset and evaluate that model on another dataset, a test dataset, to assess its performance in real life scenarios. To create, train and use a model for production, there is a big picture to consider. But here, I just want to point out some important steps in our journey to do such a task:
- **First**, in order to train a model, we must have enough data. Machine learning demands a large amount of dataset for the training step and even larger if we are talking about deep learning with billion-parameters models. Therefore, the first and foremost of everything is gathering a large number of data samples that represent our objectives. This data can be drawn from real life data, synthesized using some kinds of formulas or even using another well-trained model.
- **Second**, we tend to do exploratory data analysis. This is one of the most important steps in our journey, surely those who are working with temporal or financial data must not forget this step. This step provides us with precious information on how our dataset looks like, what are some of its notable traits that need to be considered carefully while modeling. Without this step, we barely know anything about the dataset which makes our choice in model selection suboptimal and even misleading.
- **Third**, from all the insights that the second step has given us, we begin to make some assumptions about what the real world dataset distribution should look like. From these assumptions, we choose a mathematical, specifically a statistical, model that we believe might fit well to the dataset to help us perform prediction for unseen data. Wait, if machine learning allows us to create such an intelligent model that can perform without explicit instructions, then we should choose a model that is as generalized as possible? Unfortunately, that is not the case. We are prevented from this holy blessing, which is described in the **No Free Lunch Theorem**. No model can be trained without making any assumptions about the dataset we are working on.
- **Fourth**, we try to fit our chosen model to our training dataset. This step contains a lot of stuff that feels fascinating and overwhelming at the same time, especially if we are working with deep learning and very large neural network models. Some things we might consider are: loss functions, optimizers, training steps, learning rate (and its scheduler), feature engineering (to enhance the expressiveness of the data to the model), etc. This step is undeniably the most popular thing when people are talking about doing ML stuff since training a model is such an exciting task (but it does not downgrade the importance of the previous steps).
- **Finally**, we evaluate our best model on a separate test set to see if its performance matches what we have expected earlier and decide whether it is ready for production use. This step often introduces some hidden bugs that we might not expect without a lot of experience. Some unpleasant problems would come to see us including: the test set has such a different distribution from the training set, the model performs not good enough on both sets (underfitting), the model performs too well on the training set but too bad on the test set (overfitting), the model performs very well on both sets but fails dismally on real world scenarios (the test set has a different distribution from the real world distribution), etc. So many problems with only the symptoms would come and we might have to act as doctors to perform thousands of diagnostics to identify which enemy we are fighting against.

Now, let's look at how RL differs from SL, specifically differs from the aforementioned steps that we were talking about.

### Reinforcement Learning
Now, we switch our attention to the superstar in my heart, Reinforcement Learning. In this settings, there actually is a neverending interaction between data and model.

- **Data Gathering**: in the previous settings, we only need to gather the already existed data from various sources from the internet. that might come from articles, blog posts, books, newspapers, images of humans and animals, new anime release announcements, etc. All kinds of data are already there and we just need to collect them. But the story for RL is entirely different. Since we want to train our agent through the interaction with the environment, we can only gather data from that only environment. In other words, we must use the agent to perform a lot of different actions and gather a lot of states, rewards and any useful information about the environment. In this manner, we cannot simply use the data from an energy management environment to train an agent that was supposed to manage the traffic flows on roads through controlling the traffic lights. Therefore, we have to gather data ourselves to guide the agent later without relying on any curated dataset that was done by someone else. This first challenge drives us to parallelize this phase as much as possible for faster collection speed. For example, in order to train Bob, an agent in the channel [AI Warehouse](https://www.youtube.com/@aiwarehouse), the author had to perform experience collection in 200 scenarios at the same time to gather data as fast as possible.
- **Non-stationarity**: now it's time for one of the strangest properties that differ RL paradigm from SL paradigm, the non-stationarity in the data distribution. In SL settings, the data distribution is fixed and is assumed to be drawn from the same underlying distribution, which we can theoretically model it using infinite amount of data samples. On the other hand, in RL settings, since our data is drawn from the interaction between the agent and the environment, the data distribution is depending on the model parameters or, policy distribution. During the training progress, that policy distribution is updated continually a long the way, which makes the data distribution shifts from what it was before. Therefore, our data distribution is not fixed, it is changing over time. Noting this interesting behaviour, all kinds of policy learning algorithms can be categoried into two categories: on-policy learning vs off-policy learning. The former tells us to train the model using its own policy distribution at hand to generate data and learn from that data. The latter tells us to draw data observation from another distribution (for example, the $\epsilon$-greedy algorithm) and use the data from that distribution to update ours. Of course, since off-policy learning introduces another distribution, we have to perform importance sampling to correct the bias induced by the discrepancy between distributions.

## RL resembles how we actually learn to walk or speak when we were babies

No one handed us a labeled dataset of 10,000 correct walking frames when we were toddlers. We stood up, gravity took over, and we hit the floor. That pain from falling to the ground was a negative reward. The sensation of moving forward was a positive one. RL feels more natural in every way of learning from humans to animals because it’s based on the loop of Trial → Error → Adjustment. It’s the physics of life applied to code. The learning journey relies on how the environment responds to your action or your decision, and from that response you decide to act differently in that same scenario the next time you encounter it. This way the learning feels more natural and self-evolutionary rather than static and heavily reliant on a fixed dataset that someone throws at us.

## RL training process is much more fascinating and uncontrollable than traditional training

In SL, the loss curve is usually a boring slide downward. In RL, it’s a roller coaster. Because the agent’s actions determine its future data, a small mistake can lead to a death spiral or a stroke of genius can lead to a breakthrough. It’s chaotic, unpredictable, and—coming from a physics background—it feels like watching a complex dynamical system reach equilibrium. Therefore, training an RL agent encounters such instability that training a SL model won't give you. On the other hand, we don't have to gather data and perform preprocessing techniques on the data before training because the agent generates data from its interaction with the environment. The agent on one hand generates new data and on the other hand uses that data to update itself. Such a trade-off!

# Big reasons

## The push and pull counterparts between RL training and SL training

While SL and RL are all machine learning subfields, I discovered they have a push-and-pull relationship which is very interesting. Both aim at one single thing, to train a model to become better at predicting or acting for a specific problem.

We can view the SL training setup as a pulling process that continuously pulls the current model towards some specific target, in this case it may be a loss function or an objective function in case we are defining a new function to instruct the model better at our problem. We can see that the target that the model is trying to achieve is actually fixed, it is always there waiting for the model to reach it. It is indeed a stationary target and quite easy for the model to learn it, assuming that other factors such as optimizers, initializations and network architectures are not considered.

On the other hand, we can see that the target of the RL training setup is only trying to increase the total expected reward over a period of time. It is non-stationary and dynamic with unbounded and unknown optimal values. It only tries to increase this value as much as possible as this function acts as the model's objective function. So we can see that training an RL agent is pushing it far away from its terrible state or more likely from its initial state and hoping it to reach its optimal policy to effectively draw out the best action given a specific state.

In conclusion, SL provides us with an exact target and a clear goal for our model to reach, RL on the other hand does not do such benevolent things, it forces the agent to interact with the environment and update its internal policy distribution to respond to the environment as effectively as possible to gain the maximum expected total reward possible.

## The interaction between model and data: static and dynamic

In SL, the dataset is a dead artifact—a tomb of information that never changes. The data is static and has a one-way influence on the model and does not gain any influence from the model. Therefore the interaction between the model and the data, which are the two pillars in any machine learning setup, flows only from the data to the model. This facilitates the training process to be more stable as we have a strong assumption—the data that we have created before is perfect and can be used as the single source of truth (assuming that the data preprocessing contains no major flaws).

On the other hand, RL gives us a two-way communication between data and model. First, we don't have any data to train, thus we have to guide our model to select actions randomly in the first few steps (or episodes, based on how we define the problem). Only when the data is enough based on some criteria, we start to train the model based on the data that it has just generated. When the model gets upgraded, its internal policy has changed and the data distribution that it will generate in the future will also change according to that dynamics; this time we have an entirely new model and an entirely new dataset with different distributions from the former phase. This reason is why we say that the RL training process possesses such a property called non-stationarity.

# Fundamental challenges
These are some of the most fundamental challenges scientists encounter when trying to solve RL problems that I deem interesting and noteworthy.

## Credit Assignment

Beyond the dynamic nature of the data, RL introduces some fundamental hurdles that SL simply doesn't have to deal with. The most famous one is the **Credit Assignment Problem**. Imagine a robot trying to walk that performs 100 different joint movements and then eventually falls over. Was it the very last move at step 100 that caused the fall, or was it a poor decision made back at step 20? In SL, the culprit is right there for every single data point, but in RL, the reward is often delayed. To solve this, we have to use things like the **Value Function** $V(s)$ to estimate the long-term benefit of a state, which feels a lot like calculating potential energy in physics to predict future motion.

Basically, the credit assignment problem actually has 2 forms: one spatial (space) and one temporal (time).

- **Temporal assignment problem**: this is the case I talked about in the previous paragraph, in a long trajectory of actions that the agent has performed in its life, we cannot actually know what actions or what decisions specifically in the past that lead to a particular result in the future, thus it creates some kind of difficulty when trying to find the best policy to teach the agent.

- **Spatial assignment problem**: this case is actually not happening in a single-agent setup, because its primary domain is in multi-agent setup. In that scenario, we have multiple agents acting together collaboratively or competitively based on how we define the problem. When a specific result happens to all the agents in the system, we cannot actually know what is the true culprit of that result, assuming that we only care about which agent is the culprit (not a specific action in a particular agent's action trajectories, that would be a space-time assignment problem, which is much harder).

## Exploration-Exploitation trade-off

Another thing I find quite exciting is the **Exploration-Exploitation trade-off**. In SL, the model just tries to fit the data you give it. But in RL, the agent faces a dilemma: should it stick with the best action it knows so far to get a guaranteed reward (Exploitation), or should it try something completely random and potentially stupid to see if there is a better path it hasn't discovered yet (Exploration)? 

We often use a simple strategy like $\epsilon$-greedy to handle this:

$$\pi(a|s) = \begin{cases} \text{random action} & \text{with probability } \epsilon \\ \arg\max_a Q(s,a) & \text{with probability } 1-\epsilon \end{cases}$$

This reminds me of thermal noise in physics—sometimes you need a bit of heat or randomness in the system to jump out of a local trap and find the true global optimum. For someone who likes the smooth shape and continuous representations of physics, watching an agent navigate these high-dimensional policy spaces and solve these hurdles is much more satisfying than just fitting a curve to a static cloud of points.

This is the end of my beginning blog on technical things on my personal website. If you (I don't know whether someone will actually discover this place) are also interested in reinforcement learning (especially deep reinforcement learning, I like deep things) and diffusion models or just one of them, feel free to contact me via my email and github profile on my page. Below are some resources that you may find useful and interesting to use as materials for your learning journey.

# Resources to look at

If you’re interested in this stuff, I really recommend checking out these labs and blogs. They helped me bridge the gap between standard AI and the more advanced research that's happening right now:

### 1. Research Labs and Academic Blogs

* [**UC Berkeley BAIR Lab:**](https://bair.berkeley.edu/blog/) This is a gold mine for anyone into robotics and RL. Their posts on **Diffusion Policy** are a must-read if you want to see how generative models (like the ones that make images) are being used to help robots move.

### 2. Theoretical Foundations

* [**Yang Song’s Blog:**](https://yang-song.net/) This is probably the best place on the internet to learn about the math of **Diffusion** and **Score-based models**. He explains how we turn noise back into data in a way that actually makes sense.
* [**Lilian Weng’s Blog (Lil'Log):**](https://lilianweng.github.io/) Lilian is an expert at summarizing massive amounts of research. Her posts are like the ultimate cheat sheets for technical summaries on RL and newer generation techniques. She had been doing research at OpenAI and currently is working at [Thinking Machines Lab](https://thinkingmachines.ai) with John Schulman, one of the pioneers in reinforcement learning at OpenAI.

---

# Conclusion

My path from Physics to Reinforcement Learning has taught me that the coolest systems are the ones that can adapt to the laws of their environment without any fixed dataset given beforehand.

We’re moving into a time where AI isn't just mimicking a fixed dataset like in **Supervised Learning**. Instead, with the mix of **RL and Diffusion**, agents are starting to imagine a path and then act on it. For me, coming from a background where I spent all my time looking at the smooth curves and continuous laws of physics, seeing an RL agent learn to navigate a complex problem is more than just a coding project—it’s like watching artificial physics in action.

I believe the next big thing in AI won't just be a model that reacts to what we give it, but a model that understands the physics of its own world well enough to plan its own future.

---