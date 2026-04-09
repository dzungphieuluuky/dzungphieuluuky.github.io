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
Most state-of-the-art deep learning architectures don't necessarily suggest an entirely novel architecture that has never appeared in history. Rather, they often employ simple, minimalistic improvements that effectively increase the effectiveness of feature extraction in ways we might not expect. For example, people usually believe that the **Attention is all you need** paper is the cornerstone that created the biggest breakthroughs in language modeling, giving birth to the popular LLMs that increasingly became indispensable to our current work habits: ChatGPT, Gemini, Claude, etc. The biggest thing I think about this paper is that they bravely remove unnecessary modules from RNN and LSTM from the old days, to only rely on attention mechanism to handle all the transformations on dimensions. Perhaps, the biggest improvements in some scenarios may not be driven from a novel idea, but from a brave decision of removing the components that are not suitable with the problem at hand. I’ve spent my sophomore year at university teaching myself deep learning and reinforcement learning outside of school coursework. Around February 2025, while taking Operating Systems as one of my courses at that time, I decided to finally work through **Reinforcement Learning: An Introduction** by Sutton and Barto. At the same time, I was taking a course on **Probability theory and Statistics**. It turned out to be a perfect strategy at the time to learn probability from the ground up from the class and see them in action through my external materials, how they behave, how researchers use them in their work, how they are used to estimate things that are seemingly intractable and computationally intensive.

---
Most of my time has been spent reading a wide variety of articles, blog posts, and books from outstanding researchers spanning various disciplines in artificial intelligence: basic machine learning, deep learning with neural networks, representation learning, reinforcement learning, diffusion generative modeling, etc. Throughout the journey, I found that some of the most groundbreaking innovations bear in their intrinsic properties an incredibly strong connections with our everyday lives. Their core mechanism and philosophies appear nearly everywhere we come, denoting that simple yet powerful ideas can bring about the biggest achievements in history of humanity's boundaries of civilization. In this post, I would like to do a little retrospective of some interesting yet powerful ideas that help to enhance the capabilities of AI systems. This post are expected to be continuing, with more ideas being appended to the post along my learning journey.

# 1. High and low dimension

## Data distribution

In this first section, I would like to discuss the simplest approach in deep learning architecture design for processing input data. There is a truth known to every researcher in the generative modeling field of deep learning: the data we gather from the real world lies in a very high-dimensional space. Although we live in a 3D geometric space, the real data from this space is usually composed of very small pieces such as pixels (for vision tasks) and tokens (for language modeling). To articulate what I want to say, let's first examine the data distribution in images processing. Suppose we have an image of size $1024 * 1024$, each pixel in the image has RGB format with 256 different values for each indices in the tuple. Therefore the total combinations that one pixel has is $256^3$, and since we have $1024 * 1024$ ones like that, we have a total of $(256^3)^{1024^2}$ different combinations. Although a vast space of possible images can be generated using these settings, only a very small fraction are real, meaningful images containing objects that actually exist in the real world. We can use a short piece of code with `numpy` library to see this if we wish to see its visualization. Because of this phenomenon, we have a popular theory in machine learning called the **Manifold Hypothesis**. This theory states that most natural images (images with real meaning that can be interpreted as objects rather than pure noise) lie on a much lower-dimensional manifold (subspace) within the high-dimensional space of all possible images. From this perspective, training a generative model (for text, images, videos, actions, etc.) is equivalent to fitting our machine learning model to this low-dimensional manifold—learning the distribution from which we can sample real data.

## Representations

Now let's examine how deep learning models, especially neural network-based models, extract information from training data to find this distribution. Given our assumption that meaningful data lie on a very low-dimensional distribution compared to the total space, it's straightforward to build an encoder that gradually reduces the number of neurons as we go deeper into the network. The first layer may contains a large number of input neurons: 748 (grayscale images of size 2828) or 2048 neurons depending on the size of our input data. Then, as we move deeper into the network, this size gradually becomes smaller, likely $2048, 1024, 512, 256, 128, 64, 32$. Researchers in this field have a strong preference for numbers that are powers of two. Conventionally, each time we move one step deeper, we double the number of channels and halve the size of the height and width of our images. This approach gives the model a chance to learn a much more compact representation (or embeddings, although they are still quite different) of the original data input, hopefully representing messy data in more meaningful ways than raw pixels. There are several problems and approaches under research in representation learning to hopefully yield better results on this manner.

## Some examples

Now we talk about one of the most prominent achievements with this innovation, denoting as latent diffusion model. Computer vision tasks, especially, the generative tasks that involve generating images based on some input conditions (text prompts, reference images, etc.) has been widely under researched for decades. Their improvements come from the first model class that can generate realistic images that resemble real images to some extent, GAN, or Generative Adversarial Networks, proposed by Ian Goodfellow et al. This model class harness the beauty of game theory and use its foundation to construct a training paradigm that utilize the mutual adversarial interaction between two entities to improve both of them simultaneously. Several years later, VAE (Variational Autoencoder) comes out of the box to jump into the vision generative domain. This model contains two main parts: an encoder and a decoder. The encoder tries to map the input space into a latent space, which act as a compact representation for the input space. This latent space is assumed to have much lower dimension than the original input space. When we have a compact representation of the original space, the decoder tries to decode this representation back to its original input space at the output head, hopefully to generate an image that lies on the same distribution with the input image but has some variations in it. Because of this design, VAE or Autoencoder in general are often described as a neural network architecture that learns an identity function. This definition sometimes confuse readers, because if we just want an identity funciton, then why we just return exactly the input rather than training a complex neural network like this? This popular confusion stems from a missing key point: we don't actually want the model to return the input itself. Instead, we want it to output something that also lies on the same distribution (manifold) as the input—not just a classification or regression task as in traditional machine learning, but a new instance, hence the name *Generative*. Now, let's transition to a new paradigm of generative AI: diffusion models (DMs). While VAEs use just one step to generate new images, DMs instead gradually generate new images through multiple iterative steps. In each denoising step, the image becomes clearer than its previous version, eventually becoming a high-fidelity image that can be visually interpreted as a fully meaningful image, depicting specific objects based on input prompts: a dog, a cat, a house, buildings, abstract figures, or geometries, etc. However, DMs require many denoising steps and perform these computationally intensive tasks directly on the input space, leading to high energy demands. Therefore, Latent Diffusion Models (LDMs) come to the rescue. Instead of computing directly on the expensive input space, they compress this space into a latent space and start its denoising process in this space. This approach leads to a huge efficiency compared to the old days methods, savings an unfathomable amount of energy demands. More insights on LDMs can be discovered from their original paper: [High-Resolution Image Synthesis with Latent Diffusion Models](https://www.alphaxiv.org/abs/2112.10752)

---

# 3. Distribution vs absolute values

## Different scales
When dealing with large datasets, we cannot expect all attributes to have the same value range. Their value ranges vary greatly, often by large margins. To add to the challenge, neural networks are surprisingly sensitive to scale.

If you pass in one feature that ranges from $[0,1]$ and another that ranges from $[0,1000]$, the second will dominate the gradient updates, not because it's more important, but simply due to its larger numerical values. To counter this problem, there is a widely adopted approach called normalization, or standardization, as mentioned in some textbooks. Personally, I prefer the word normalization because standardization can have entirely different meanings.

Some of the most popular normalization techniques include BatchNorm, LayerNorm, and InstanceNorm. These techniques all aim to normalize raw values of input tensors to a more reasonable range that facilitates computation and enhances training stability. However, they differ in which dimensions or aspects they choose to normalize. Let's look at a few example of this technique:
- BatchNorm: Batch normalization. As the name suggests, this technique normalizes values across a batch of data consisting of many samples, rather than considering each sample separately. The batch size is a tunable hyperparameter that can greatly influence training performance. Generally, larger batch sizes drive more stability but demand more computational power, while smaller batch sizes facilitate faster updates but risk overfitting and large bias. This technique is widely used in vision tasks involving CNN architectures since its introduction in 2015.
- LayerNorm: Layer normalization. This technique was widely adopted after BatchNorm showed inefficiency when dealing with sequence models like RNNs and LSTMs for sequence-to-sequence tasks. Instead of normalizing across the batch dimension for each feature separately, this technique normalizes across all feature dimensions in every sample independently. This approach can be seen as a transpose of BatchNorm. 

To elucidate the difference between these methods, suppose we are dealing with a matrix of size $m*n$, representing $m$ samples of data with $n$ features each. 
    - Doing BatchNorm is equivalent to take normalization for each column, which is actually computed across all samples in a batch for each feature dimension.
    - Doing LayerNorm is equivalent to take normalization for each row in the matrix, which is actually computed across all feature dimensions for each sample independently. This is versatile enough to be fit perfectly for sequence-to-sequence tasks. 

Although there are a wide variety of normalization techniques apart from these two techniques: InstanceNorm, GroupNorm, SpectralNorm, etc., what I want to say is that what we truly care about is not just raw values, but the distribution that is built from a large numbers of them. We don't really care much about their direct appearance, but about their distribution, how large they are compared to each other. with the mean-centering effect and calibrated variance after apply normalization techniques, this relative relationship between values in the same feature (with the same value ranges) gains more transparency by a large margin.

## Zero as implicit baselines

Apart from data normalization in supervised learning settings, reinforcement learning (RL) offers another approach on non-stationary data distribution that changes along with policy distribution. In RL settings, we often use another terminology for "data", which is "observation". The reasons leads to this interesting transition lies in the core mechanism of RL problems, where the agent must perform interactions with the environment rather training directly on a fixed dataset beforehand. Therefore, it's understandable to call these data as observations, since the agent directly experience (in other words, see) that data coming from the response of the environment following its actions.

The technique I'm talking about is the advantage function:

$$A(s,a) = Q(s,a) - V(s)$$

Let's take a quick look at the meanings of each entity in the equation:
- $A(s,a)$: The advantage function that calculates how much advantage we get from performing action $a$ at state $s$. This value represents how much better the situation becomes if we perform this action, denoting its relative benefit compared to the current state rather than absolute values.
- $Q(s,a)$: This is the Q-value we get from performing action $a$ at state $s$. This concept is slightly confusing compared to the advantage mentioned above, since this quantity measures how good (in absolute terms) the state becomes after we perform this action.
- $V(s)$: This quantity acts as the baseline for this advantage calculation. Of course, we can choose another function to act as a baseline; theoretically, there are no strict rules for choosing baseline functions. However, to get the best estimation of how much the situation improves for our agent, we should choose the expected value of the Q-value of the current state across all actions, making it a fair and stable baseline for comparing all actions equally. Since $V(s)$ is exactly the expectation we seek, it is wise to choose this function as our baseline.

Without a baseline function in advantage calculation, its value is equivalent to the raw Q-value of the state-action pair. Therefore, we can rewrite the equation as:
$$A(s,a) = Q(s,a) - 0$$
With this representation, we can see that without a baseline function, zero becomes the default baseline for the calculation. In other words, we are assuming that taking all possible actions at the current state into account would lead to a baseline value of zero. This introduces an enormous and dangerous assumption about the current environment, since we have no evidence that this is true. This careless approach eventually gives us wrong learning signals, easily leading to performance degradation due to bias in the estimation without a proper baseline value.


The point is not the absolute values of quantities we take into our calculation, but the relative value and relationship between them that actually leads us to the right estimation and drive meaningful decision.

---

# 4. Sparsity


---

# 5. Looking through different lens


---

To be continued.

---