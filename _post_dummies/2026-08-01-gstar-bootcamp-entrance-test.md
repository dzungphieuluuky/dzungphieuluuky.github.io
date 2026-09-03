---
layout: post
title: GStar Bootcamp 2026 Entrance Test Recap
tags: [personal, gstar]
author: dzungphieuluuky
date: 2026-08-01
---
# 1. But what is GStar Bootcamp?
GStar Bootcamp is an intensive AI training program organized by the New Turing Institute (NTI), in partnership with Google, ViRx@Stanford, ELSA, and VietAI. The 2026 edition builds upon the success of the 2025 program — a 12-week deep-dive bootcamp that attracted 250+ applicants from 120+ cities and 210+ organizations worldwide.

The program is designed to develop the next generation of AI engineers and researchers through a curriculum centered on three core pillars:

Advanced technical foundations — deep-dive training in NLP, LLMs, RLHF, DPO, and other state-of-the-art techniques

Hands-on capstone projects — real-world challenges where participants build and ship production-grade solutions

Leadership development — workshops on communication, influence, and self-management

The 2025 cohort targeted 30–50 fellows with a rigorous admissions process involving technical assessments and interviews. The 2026 program continues this tradition of excellence, with the GStar 2026 Forum scheduled for May 29, 2026, featuring speakers from Google, Qualcomm, FPT, CMU, and MBZUAI.
# 2. Questions
Below are some questions in the technical entrance test retrieved from the memory of the author; there might be some wrong details, but the general concepts and main ideas are guaranteed to be intact. This entrance test serves as the main factor in deciding scholarships for the program.

## 2.1. Mathematics
- Given a dataset with two features:
    - Device type: contains 3 valid values
    - Browser: contains 3 valid values
    
Define a feature group as a combination of each valid value from these features. Identify the minimum number of data samples for the dataset so that we can guarantee that at least 100 samples belong to the same feature group.
- There are three friends, each holding a fair six-sided die. Each round, three people roll the dice simultaneously and identify the minimum number that comes out after the roll. Suppose we roll for 10,000 rounds. Calculate the approximate sum of minimum values across all rounds?
- We are given a 4x4 grid. We want to remove 4 cells from the grid so that each cell lies in a different row and a different column. What is the maximum possible number of connected components remaining on the grid after removing those 4 cells? Assuming that a connected component is considered as the region occupied by cells that share edges.
- Given a function: $f(x) = \ln(1 + x^2)$.
    - Determine the first order derivative, $f'(x)$.
    - What is the maximum value of $f'(x)$?

## 2.2. Machine Learning

- We have a model that has been well trained on a dataset containing these features: hospital names, historical medical diagnosis, historical diseases, heart rate, gender, and name. The dataset contains training and validation samples that were gathered from the same hospital and have been split into different sets correctly from the total original dataset. Both the validation and training errors are low. But when performing real deployment in a new hospital, the performance of the model drops significantly. Identify what is the problem that leads to this scenario.

## 2.3. Deep Learning
- We have a deep neural network architecture defined as below. The training dataset contains 100,000 samples that were generated synthetically from the function
$$f(x) = x^3 + 3x^2 - 2$$
The neural network was trained on this training dataset for 100 epochs. Determine what is the training-vs-validation state of the model after training: underfit, overfit, or good fit, and explain your reasoning?

Network architecture definition:
```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class LReLU(nn.Module):
    def forward(self, x):
        return x

class MyNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden_dim = 256
        self.input_dim = 20
        self.output_dim = 1
        self.net = nn.Sequential(
            nn.Linear(self.input_dim, self.hidden_dim),
            LReLU(),
            nn.Linear(self.hidden_dim, self.hidden_dim),
            LReLU(),
            nn.Linear(self.hidden_dim, self.output_dim)
        )

    def forward(self, x):
        return self.net(x)


# --- Dummy training loop: 100 random samples, 20-dim input -> 1-dim output ---
torch.manual_seed(0)

X = torch.randn(100, 20)   # training set: 100 samples, 20-dim input
y = torch.randn(100, 1)    # training set: 100 samples, 1-dim output

model = MyNet()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

for epoch in range(100):
    optimizer.zero_grad()
    pred = model(X)
    loss = loss_fn(pred, y)
    loss.backward()
    optimizer.step()
    if (epoch + 1) % 20 == 0:
        print(f"epoch {epoch + 1:3d} | loss {loss.item():.4f}")
```
- Given the computational graph of the neural network model as the diagram below. Perform backpropagation and determine the gradients of the output with respect to these parameters: $w_0, x_0, w_1, x_1, w_2$.
- Explain why the residual connections proposed in the ResNet paper help improve the stability of the training process and prevent the vanishing gradients problem?
- We are surveying the clipped policy ratio formula and its corresponding surrogate objective function in the Proximal Policy Optimization algorithm, which is defined as:

$$
L = \min(\rho A, \operatorname{clip}(\rho A, 1 - \epsilon, 1 + \epsilon))
$$

One student proposes that we could just cut off the minimum operation, leaving the equation as:

$$
L = \operatorname{clip}(\rho A, 1 - \epsilon, 1 + \epsilon)
$$

where:

- $\rho(i, t, \theta) = \frac{\pi_{\theta}(i, t)}{\pi_{\text{old}}(i, t)}$

- $\pi_{\theta}$: the current policy used for generating rollouts.

- $\pi_{\text{old}}$: the last policy used as reference policy for calculating the ratio.

- $i$: the $i^{\text{th}}$ rollout in a group after rollout generation, refer GRPO algorithm for more context.

- $t$: the $t^{\text{th}}$ token in a rollout sequence.

Do you agree with the student's proposed modification? Explain your reasoning with examples and why or why not we should use this new version?

- You are training a language model in the pre-training stage. You want to align the model generation distribution with the target distribution. Which of these loss functions are suitable for this task? Choose all options that you deem suitable:
    - F1-score
    - Accuracy
    - Cross entropy
    - Mean squared error
    - Focal loss

- You are given a task to determine the house price from other features such as size, number of bedrooms, number of bathrooms, etc. In this hometown, you can only gather data about 10 different houses for your analysis, due to security and privacy enforcement. Which of these algorithms are most suitable for this task:
    - Naive Bayesian Regression
    - K-nearest neighbor Regression
    - Deep neural networks with 2 hidden layers and Sigmoid activation function
    - Linear regression
    - Logistic regression


# 2.4. Transformers

- Given a code snippet that performs pre-training for a language model on one single sample from the dataset. The code is implemented as below:

```python
tokens = tokenizer.encode(document)
inputs = tokens
targets = tokens

predicts = model(inputs)
criterion = nn.CrossEntropyLoss()
loss = criterion(predicts, targets)
optimizer.zero_grad()
loss.backward()
optimizer.step()
```
However, the code cannot perform correct pre-training for the model. Identify the problem and write the corrected code.

- Given a code that implements the forward function for a Transformer block that contains self-attention layers and linear layers according to the original implementation in the paper "Attention is all you need". The code is implemented as below: 

```python
def forward(x):
    attn_out = self.attn(x, x, x)
    x = x + attn_out
    x = self.norm1(x)
    ffn_out = self.ffn(x)
    x = ffn_out + x
    x = self.norm2(x)
    return x
```

There are some errors in the code that make the loss values continue to rise to infinity and eventually return NaN values. Identify the problems and write the corrected code.

- Determine the module in the "Attention is all you need" paper that appears most frequently, and describe what the purpose of that module is?
- In the original paper, the sinusoidal positional embedding function is quite complicated. Why don't we use a simpler version of that function defined as below:

$$
p_i = [\sin(i), \cos(i), \sin(i), \ldots, \sin(i), \cos(i)]
$$

Explain why this version of the positional embedding function is less suitable than the original proposed version and explain your reasoning.
