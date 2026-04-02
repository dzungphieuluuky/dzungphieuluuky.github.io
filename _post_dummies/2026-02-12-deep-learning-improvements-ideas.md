---
layout: post
title: Some incomplete ideas
subtitle: Interesting patterns for architectural innovations
cover-img: 
thumbnail-img: 
share-img: 
tags: [personal, machine-learning]
author: dzungphieuluuky
---

# Introduction
Most state-of-the-art deep leanring architectures sometimes won't be the one to suggest an entirely different and novel architecture that has never appear in history, but rather some simple, minimalistic ways that effectively increase performance the effectiveness of features extraction to the extent that we might not imagine. For example, people usually believe that **Attention is all you need** paper is the cornerstone paper that create the biggest breakthroughs in language modeling and give birth to popular LLM that increasingly become indispensable from our current work habits: ChatGPT, Gemini, Claude, etc. The biggest thing I think about this paper is that they bravely remove unnecessary modules from RNN and LSTM from the old days, to only rely on attention mechanism to handle all the transformations on dimensions. Perhaps, the biggest improvements in some scenarios may not be driven from a novel idea, but from a brave decision of removing the components that are not suitable with the problem at hand. I’ve spent my sophomore year at university teaching myself deep learning and reinforcement learning outside of school coursework. Around February 2025, while taking Operating Systems as one of my courses at that time, I decided to finally work through **Reinforcement Learning: An Introduction** by Sutton and Barto. At the same time, I was taking a course on **Probability theory and Statistics**. It turned out to be a perfect strategy at the time to learn probability from the ground up from the class and see them in action through my external materials, how they behave, how researchers use them in their work, how they are used to estimate things that are seemingly intractable and computationally intensive.

---
Most of my time spending reading a wide variety of articles, blog posts and books from outstanding researchers spanning across various disciplines in aritficial intelligence: basic machine learning, deep learning with neural networks, representation learning, reinforcement learning, diffusion generative modeling, etc. Throughout the journey, I found that some of the most groundbreaking innovations bear in their intrinsic properties an incredibly strong connections with our everyday lives. Their core mechanism and philosophies appear nearly everywhere we come, denoting that simple yet powerful ideas can bring about the biggest achievements in history of humanity's boundaries of civilization. In this post, I would like to do a little retrospective of some interesting yet powerful ideas that help to enhance the capabilities of AI systems. This post are expected to be continuing, with more ideas being appended to the post along my learning journey.

# 1. High and low dimension

## Data distribution

In this first section, I would like to talk about the simplest approach in deep leanring architecture design for processing inputs data. There is a harsh truth in generative modeling field of deep learning that every researcher know is that the data we gather from our real world lies on a very high-dimensional space. Although we live in a 3D geometric space, but the real data that come from this space is usually built from very little pieces such as pixel (for vision tasks), tokens (for language modeling), etc. To articulate what I want to say, let's first examine the data distribution in images processing. Suppose we have an image of size $1024 * 1024$, each pixel in the image has RGB format with 256 different values for each indices in the tuple. Therefore the total combinations that one pixel has is $256^3$, and since we have $1024 * 1024$ ones like that, we have a total of $(256^3)^{1024^2}$ different combinations. Although there are a vast space of total possible images can be generated using this settings, only a very small amount of them are real meaningful image containing something that actually exists in the real world. We can use a short piece of code with `numpy` library to see this if we wish to see its visualization. Because of this phenomenon, we have a quite popular theory in machine learning disciplines, which is the **Manifold Hypotheses**. This theory said that most natural images (images that have real meaning and can be interpreted as some objects rather than just pure noise) lie on a much lower dimensional manifold (subspace) in the real high dimensional space of all possible images. From this perspective, we can interpret training a generateive model (text, images, videos, actions, etc.) is equivalent to fitting our machine learning model to this low dimensional manifold, i.e, learn this distributions that we can sample real data from.

## Representations

Now we look into how deep learning models especially neural network based model extracts information from the training data to find this distribution. Coming from our assumption that those meaningful data lies on a very low dimensional distribution compare to the total space, it's a straightforward idea to build an encoder that gradually fewer neurons as we deep dive into the network. The first layer may contains a large number of input neurons: 748 (grayscale images of size 2828) or 2048 neurons depending on the size of our input data. Then, as we move deeper into the network, this size gradually becomes smaller, likely $2048, 1024, 512, 256, 128, 64, 32$. Researchers in this field have an intangible interest with any numbers that are exponentials of two. Conventionally, each time we move one step deeper, we double the number of channels and half the size of height and width of our images. This approach create the chance for the model to learn a much more compact representation (or embeddings, although they are still quite different) of the original data input, hopefully to represent these messy data in some more meaningful ways rather than raw pixels. There are several problems and approaches under research in representation learning to hopefully yield better results on this manner.

## Some examples

Now we talk about one of the most prominent achievements with this innovation, denoting as latent diffusion model. Computer vision tasks, especially, the generative tasks that involve generating images based on some input conditions (text prompts, reference images, etc.) has been widely under researched for decades. Their improvements come from the first model class that can generate realistic images that resemble real images to some extent, GAN, or Generative Adversarial Networks, proposed by Ian Goodfellow et al. This model class harness the beauty of game theory and use its foundation to construct a training paradigm that utilize the mutual adversarial interaction between two entities to improve both of them simultaneously. Several years later, VAE (Variational Autoencoder) comes out of the box to jump into the vision generative domain. This model contains two main parts: an encoder and a decoder. The encoder tries to map the input space into a latent space, which act as a compact representation for the input space. This latent space is assumed to have much lower dimension than the original input space. When we have a compact representation of the original space, the decoder tries to decode this representation back to its original input space at the output head, hopefully to generate an image that lies on the same distribution with the input image but has some variations in it. Because of this design, VAE or Autoencoder in general are often described as a neural network architecture that learns an identity function. This definition sometimes confuse readers, because if we just want an identity funciton, then why we just return exactly the input rather than training a complex neural network like this? This popular confusion comes from the lack of the key point: we don't actually want to return the input itself, we want the model to give us the output that also lies on the same distribution (manifold) with the input, not just a simple classification tasks or regression tasks in traditional machine learning setups, but a new instance, hence the name *Generative*. Now, we transmit ourselves to a new paradigm of generative AI: diffusion models (DMs). If VAE use just one step to generate new images, DMs instead gradually generate new images through multiple of iterative steps. In each step of denoising process, the image becomes clearer than its previous versions, eventually become a high-fidelity image that can be visually interpreted as a fully meaningful image, denoting some kinds of objects based on our input prompts: a dog, a cat, a house, buildings, abstract figures or geometries, etc. But there are still problems, DMs take so many steps to denoise, yet they perform this computationally intensive tasks directly on input space, leading to bursting on energy demands. Therefore, Latent Diffusion Models (LDMs) come to the rescue. Instead of computing directly on the expensive input space, they compress this space into a latent space and start its denoising process in this space. This approach leads to a huge efficiency compared to the old days methods, savings an unfathomable amount of energy demands. More insights on LDMs can be discovered from their original paper: [High-Resolution Image Synthesis with Latent Diffusion Models](https://www.alphaxiv.org/abs/2112.10752)

---

# 3. Distribution vs absolute values

## Different scales
Talking about large datasets, we cannot expect all the attributes in our dataset to have the same value range. Their value ranges are different from each other, and desperately, by a large margin. To make our stories become more terrifying, neural networks are surprisingly sensitive to scale.

Pass in one feature that ranges from $[0,1]$ and another that ranges from $[0,1000]$, and the second will dominate the gradient updates, by not being actually more important, but just simply because of its larger numerical values. To counter such a problem, there is a very wide addopting approach namedly normalization, or standardization, as in some textbooks. Personally, I prefer the word normalization because standardization potentially has an entirely different meanings.

There are some of the most popular normalization techniques such as: BatchNorm, LayerNorm, InstanceNorm, etc. These techniques all focus on normalize raw values of input tensors to a more reasonable range of values that facilitate computation and enhance stability for training. However, which dimensions/aspects they choose to normalize their data is different from each other. Let's look at a few example of this technique:
- BatchNorm: Batch normalization. As the name suggest, this technique normalize values on a batch of data that consists many samples rather instead of considering every single samples separately. The batch size is a tunable hyperparameter and can greatly influence the training performance. Usually, bigger batch size drives more stability but demand more computational power, while smaller batch size facilitate update speed but take risk of overfitting and big bias. This techique is widely used in vision tasks that involve CNN architecture since the dawn of its birth in 2015.
- LayerNorm: Layer normalization. This tehcnique is widely adopted after BatchNorm has shown some inefficiency when dealing with sequence modeling models at the time, namely RNN and LSTM for sequence-to-sequence tasks. Instead of normalizing across batch dimension for each feature separately, this technique normalize across all feature dimensions in every sample independently. This approach can be interpreted as a tranpose form of BatchNorm. 

To elucidate the difference between these methods, suppose we are dealing with a matrix of size $m*n$, representing $m$ samples of data with $n$ features each. 
    - Doing BatchNorm is equivalent to take normalization for each column, which is actually computed across all samples in a batch for each feature dimension.
    - Doing LayerNorm is equivalent to take normalization for each row in the matrix, which is actually computed across all feature dimensions for each sample independently. This is versatile enough to be fit perfectly for sequence-to-sequence tasks. 

Although there are a wide variety of normalization techniques apart from these two techniques: InstanceNorm, GroupNorm, SpectralNorm, etc., what I want to say is that what we truly care about is not just raw values, but the distribution that is built from a large numbers of them. We don't really care much about their direct appearance, but about their distribution, how large they are compared to each other. with the mean-centering effect and calibrated variance after apply normalization techniques, this relative relationship between values in the same feature (with the same value ranges) gains more transparency by a large margin.

## Zero as implicit baselines

Apart from data normalization in supervised learning settings, reinforcement learning (RL) offers another approach on non-stationary data distribution that changes along with policy distribution. In RL settings, we often use another terminology for "data", which is "observation". The reasons leads to this interesting transition lies in the core mechanism of RL problems, where the agent must perform interactions with the environment rather training directly on a fixed dataset beforehand. Therefore, it's understandable to call these data as observations, since the agent directly experience (in other words, see) that data coming from the response of the environment following its actions.

The technique I'm talking about is the advantage function:

$$A(s,a) = Q(s,a) - V(s)$$

Let's take a quick look into the meanings of each entity in the equation:
- $A(s,a)$: The advantage function that calcualates how much advantage we get from performing action $a$ at the state $s$. This value can be interpreted how better the situation get if we perform this action at the current state, denoting its relative benefit compared the current state rather than raw values.
- $Q(s,a)$: This is the Q-value we get from performing action $a$ at the state $s$. This concept is a little bit confusing with the aforementioned advantage since this quantiti measures how good (in terms of raw values) this state becomes after we perform this action.
- $V(s)$: This quantity acts as the baseline for this advantage calculation. Of course, we can choose another function to act as a baseline, theoretically there are no strict rules on choosing what functions. However, to get the best estimation on how the situation get better for our agent, we should choose the expected value of the Q-value of the current state across all actions, so that the it makes a fair and stable baseline for all actions to be compared equally. Since $V(s)$ is exactly the expectation we are seeking, it would be wise to choose this function as our baseline.

Without baseline function in advantage calculation, its value is equivalent to the raw Q-value of the state-action pair. Therefore, we can rewrite the equation as:
$$A(s,a) = Q(s,a) - 0$$
With this representation, we can see that without a baseline function, zero would be naturally the default baseline for the calculation, In other words, we are expecting that taking all possible actions at the current state into account would lead to a baseline value of zero. This spikes an enormous and dangerous assumption about the current environment settings, since we have no guarantee evidence that this would be true. This careless approach eventually gives us wrong learning signals, easily leading to the degradation in performance of the model due to high-basied esimation without a proper baseline value.


The point is not the absolute values of quantities we take into our calculation, but the relative value and relationship between them that actually leads us to the right estimation and drive meaningful decision.

---

# 4. Sparsity


---

# 5. Looking through different lens


---

To be continued.

---