---
layout: post
title: Lessons from Deep Learning Projects
cover-img: # TODO: add cover image (e.g., /assets/img/posts/deep-learning-projects/cover.png)
thumbnail-img: # TODO: add thumbnail image
share-img: # TODO: add social share image
tags: [personal, learning]
author: dzungphieuluuky
date: 2026-04-29
---

# What this blog covers

Doing projects is perhaps the most effective way to build knowledge and experience in any field, especially disciplines that require extensive practical experience. Since all my projects focus on machine learning, deep learning, and AI in general, I want to share some lessons learned along the way. Some I learned the hard way, i.e., wasting tons of time, GPU quota, and frustrating days, so documenting them should help me avoid repeating mistakes and demonstrate my learning journey. Applying Feynman's technique, let's go.

### Using wrapper models

While working on a project detecting AI- vs human-generated code, I used Stochastic Weight Averaging (SWA). This technique intervenes in the optimizer's parameter update process, gradually changing model weights more stably with stronger momentum toward old weights. It boosts generalization, prevents overfitting, and controls training stability. More details are available online. The key point: PyTorch provides `torch.optim.swa_utils` and `AveragedModel` to eliminate boilerplate. But after wrapping a model with `AveragedModel`, the model (especially with the `transformers` library) no longer has the `save_pretrained` method that Hugging Face provides. The wrapper only exposes the inner model's methods. You must unwrap the model to access the real method, or checkpoint saving will fail. This small oversight can waste significant training time if you don't do functional testing before building large training pipelines.

### Not unwrapping models enough

Following the note above, sometimes a model is wrapped inside another model that wraps yet another model, a stack of wrappers around a base model. To robustly unwrap the real model and call expected methods (`save_pretrained`, `from_pretrained`, etc.), use a `while` loop to continuously unwrap until no `module` attribute exists, since outer wrappers access inner models through this attribute:

```python
def _unwrap_model(self, model):
    try:
        return self.accelerator.unwrap_model(model)
    except (AttributeError, TypeError):
        # Recursively remove .module wrappers (DataParallel, DDP, etc.)
        while hasattr(model, 'module'):
            model = model.module
    return model
```

Line by line:
- First, try unwrapping with the high-level API from `accelerate`, a fantastic library for distributed training and inference with large models and datasets. This natively gets the inner model without worrying about internals.
- If `accelerator` fails, fall back to a manual solution. Conventionally, `module` accesses the inner model. Use a `while` loop to iterate until no `module` attribute exists, then stop.
- Finally, return the actual model inside those wrapper layers.

### Saving model with tokenizer

For NLP projects, especially models loaded from Hugging Face, the folder from `from_pretrained` contains more files than expected. Beyond `model.safetensors` (the actual weights), several files are indispensable for loading and running training/inference properly. Here's a typical Hugging Face language model folder:

![](../assets/img/some-experience-on-deep-learning-projects/Screenshot%202026-04-30%20001707.png)

Key file groups:

- **Model checkpoint**: `model.safetensors` contains all parameters in dictionary format. It's named "safe" because it stores weights as dictionaries, not execution flow, i.e., no architecture knowledge, just `self.attention.query.1.weight = torch.Tensor([1, 2, 3, 4, 5, 6])`. This prevents unwanted execution on your machine.
- **Configurations**: `config.json`, `config_hyperparams.json`, `training_args.bin`. These contain architecture info for initialization, hyperparameters, and training arguments for tracking.
- **Tokenizer**: `tokenizer.json`, `merges.txt`, `special_tokens_map.json`, `tokenizer_config.json`, `vocab.json`. These handle tokenization before passing tensors to the model. They're easy to miss in manual training; you might forget to save the pretrained tokenizer alongside the model, making inference impossible. **Always ensure these appear in your checkpoint folders**, or your training time is mercilessly wasted.
- **Training State**: `optimizer.pt`, `rng_state.pth`, `scaler.pt`, `scheduler.pt`. These store optimizer state (Adam stores historical gradients and squares), RNG state (for reproducibility), gradient scaling state (for mixed precision), and scheduler state (for cosine/linear decay). Without them, every resume creates a different scenario because all states reset to initialization. Reproducibility becomes impossible.

### Always have degeneration detection in NLP projects

Last semester I worked with Ouro-1.4B, a small looped language model by ByteDance. The model unexpectedly and continually generated degenerate output, i.e., total garbage tokens. I proposed several culprits:

- **Data type**: Kaggle's T4 GPUs (an older generation) don't support `bfloat16`, the industry standard for LLMs. Using `bfloat16` ran without errors, but the documentation said it should error. Silent errors may have occurred.
- **Novel generation mechanism**: Most beginners encounter linear transformers that process text one-way, start to end. This model has loops. The degenerate output might stem from this novelty.
- **Small parameter count**: At 1.4B parameters, limited capacity affects performance. The model also struggled with the exact answer format in the system prompt, i.e., weak instruction following, perhaps from insufficient SFT training.

Since compute isn't free, waiting hours for garbage output is catastrophically expensive. This hard-learned lesson: **a mechanism to detect bad generations is indispensable for NLP projects**. Several strong classical string comparison algorithms fit this task perfectly and can be implemented with help from AI assistants like ChatGPT or Claude.

In the end, I suspect it was a combination of factors rather than a single cause. The bfloat16 silent errors on T4 GPUs likely corrupted weights early on, which the looped architecture then amplified through recurrent processing. The small parameter count just made matters worse. The key lesson: always detect degeneration early rather than waiting for the full output.

### Different backends between interactive and background Kaggle

Kaggle is a friendly companion for free GPU quota (30 hours/week). Notebooks run in two modes: interactive and background sessions. I painfully learned that these backend environments differ significantly. The interactive session tolerates runtime errors more benevolently; the background session is prohibitively strict. Once, using `protobuf` alongside a language model library, a new protobuf version deprecated some modules/classes. The interactive session logged the error but continued running. The background session caught the error immediately and terminated the notebook. The background backend is called Papermill. The error:

```python
AttributeError: 'MessageFactory' object has no attribute 'GetPrototype'
```

### Create a test mode for functional testing before long runs

Running a full training pipeline just to discover a bug at the end is one of the most frustrating ways to waste GPU quota. You queue a 12-hour job, check on it periodically, and only at the final checkpoint do you realize something was silently broken from step one. I've done this more times than I'd like to admit.

The fix is embarrassingly simple: create a test mode that runs a tiny version of your pipeline before committing to the full run. Strip your dataset to 1-2 batches of dummy data, run a single training step, and verify that checkpointing, logging, and saving all work correctly.

```python
if args.test_mode:
    train_dataset = train_dataset.select(range(10))
    eval_dataset = eval_dataset.select(range(5))
    training_args.num_train_epochs = 1
    training_args.max_steps = 2
```

This pattern catches the kind of bugs that only surface after a full epoch: broken `save_pretrained` calls (remember the wrapper model issue?), mismatched tokenizer directories, or silent data loading failures. If the test mode completes without errors, you can kick off the real run with confidence.

This is especially critical on Kaggle, where background sessions behave differently from interactive ones, as I learned the hard way in the previous section. A test mode running in the interactive session catches the Papermill-incompatible errors before you submit a background job that silently fails six hours in. Don't skip it.

### Wrapping Up

Every lesson here cost me compute time. Some cost GPU quota, some cost debugging days, some cost failed Kaggle submissions. The common thread: test early, fail fast, and never trust that a model wrapper exposes the methods you expect.

Here are the takeaways I try to keep in mind before every training run:

- **Unwrap before you save**: `save_pretrained` lives on the inner model, not on `DataParallel` or `AveragedModel` wrappers. Write a robust unwrapper with a `while` loop over `module` attributes.
- **Save the tokenizer**: your `model.safetensors` is useless without `tokenizer.json` and friends. Make sure every checkpoint folder is self-contained.
- **Detect degeneration early**: garbage in, garbage out. Monitor generations during training, not after 12 hours of compute. String comparison metrics are cheap and effective.
- **Test before you train**: a 2-step test mode costs minutes and catches the bugs that waste days. Run it every time you change your pipeline.