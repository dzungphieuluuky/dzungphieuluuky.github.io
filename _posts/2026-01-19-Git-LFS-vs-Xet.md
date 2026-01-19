---
layout: post
title: Git LFS vs Xet - File-based Versioning vs Content-Aware Data System
subtitle: From file-based thinking to content-defined chunking in real ML workflows
author: dzungphieuluuky
tags: [git, git-lfs, xet, datasets, ml-infra, learning-journey]
comments: true
---
{: .box-success}
**Success / Tip:**  
This post compares two prominent approaches to managing large files in Git repositories: the traditional Git LFS and the newer, content-aware Xet system, which is the new backend for data storage for Huggingface Hub in 2025.

# Introduction
The content includes detailed explanations, practical implications for machine learning workflows, and visual aids to clarify the underlying storage models.  

**In modern machine learning development, data is no longer a static asset — it is an evolving, iterative component as important as code itself, such characteristics introduce more demands on version control not only for source, for data too!  The choice of large-file versioning tool fundamentally shapes how efficiently teams can work with this reality.**

## The Three Pillars of ML Projects and the Data Versioning Gap

A typical deep learning project consists of three primary components:

- **Source code** — usually maintained in standard GitHub / GitLab repositories
- **Models** — versioned and shared via Hugging Face Model Hub (or equivalent)
- **Datasets** — the often-neglected middle layer that lacks a natural, frictionless versioning story

While code benefits from Git's fine-grained diffing and branching, and models are handled elegantly by model registries, datasets frequently become the weak link.  
They grow large, change incrementally, and are regenerated frequently — exactly the conditions under which vanilla Git fails catastrophically.

This post examines two widely used solutions — **Git LFS** and **Xet** — and explains why the difference between them becomes decisive once data iteration becomes central to productivity.

## What Is Git LFS?

Git Large File Storage (LFS) extends Git to handle large binary files without polluting the repository history.

### Core Mechanism

1. Files matching tracked patterns (e.g., `*.pt`, `*.parquet`, `*.zip`) are replaced in Git with small **pointer files**.
2. The actual content is uploaded to a remote LFS server (GitHub provides one by default). Normally, our source code is directly stored on GitHub repositories, but files that are tracked with Git LFS are stored in another location.
3. During checkout/pull, Git LFS downloads the real files on demand.

Here is the typical workflow:

```bash
# Track large file types
git lfs track "*.pt" "*.safetensors" "*.parquet"
# Information on tracked files with Git LFS will be stored in a file called .gitattributes

# Add and commit as usual
git add model_final.pt
git commit -m "Add fine-tuned model weights v1.2"
git push
# git LFS automatically handles differently for files that are listed in .gitattributes under the hood
```

### Strengths of Git LFS

- Seamless integration — commands remain pure Git, no commands changing, just add one line `git lfs track <something>`
- Excellent for static or slowly changing large assets (pre-trained checkpoints, final datasets, release artifacts)
- Official GitHub support with generous storage quotas for public repositories
- Help us escape the storage size limitations of GitHub because our data is normally very large, not suitable for its source-driven storage design.

### Critical Limitation

Git LFS treats every version of a file as a completely new blob.  
Even a 1-byte change anywhere in a 50 GB dataset forces a full re-upload and re-download on the next pull.  
This behavior becomes prohibitively expensive as soon as datasets are actively iterated upon.

## What Is Xet?
Xet (now also powering parts of Hugging Face's data ecosystem) rethinks large-file storage by applying **content-defined chunking (CDC)** technique for its intelligent data versioning system and facilitation for fast uploading/downloading data from the Huggingface Hub.

### Core Mechanism

- Files are broken into variable-sized chunks using a rolling hash algorithm (similar to ```rsync``` or backup systems like Borg).
- Chunk boundaries are determined by content, not fixed offsets.
- Each chunk is stored under its cryptographic hash → perfect deduplication.
- Files become ordered lists of chunk references.

Here is the standard Xet workflow (identical Git commands):

```bash
# Initialize a Xet repository (one-time)
xet init

# Add data normally
git add data/ annotations.csv processed/
git commit -m "Update dataset with new augmentations v0.4"
git push
```

### Resulting Properties

- A small insertion/deletion shifts only a few chunks
- Identical content across files/versions/branches is stored exactly once
- Pull operations transfer only missing or changed chunks
- Storage growth is proportional to **novel content**, not file size

## Side-by-Side Comparison — When the Difference Matters

| Dimension                     | Git LFS                              | Xet                                      |
|-------------------------------|--------------------------------------|------------------------------------------|
| Storage granularity           | Whole file                           | Variable content-defined chunks          |
| Deduplication                 | Almost none                          | Excellent (cross-version, cross-branch)  |
| Cost of small change          | Full file re-upload/download         | Only affected chunks                     |
| Iteration cost                | Scales with file size                | Scales with delta size                   |
| Best suited for               | Static assets, infrequent updates    | Actively evolving datasets, preprocessing|
| Git compatibility             | Extension (requires git-lfs client)  | Native Git + Xet CLI (drop-in compatible)|
| Branching overhead            | High (duplicates full files)         | Near-zero (shared chunks)                |
| Ecosystem momentum (2026)     | Mature, ubiquitous                   | Growing fast, especially in ML/HF space  |

## Real-World Behavioral Impact in ML Workflows

Once Xet replaced Git LFS in several active projects, the following changes became noticeable:

### 1. Versioning becomes a first-class habit

```
Before (LFS): "This preprocessing change is small — no need to commit a 40 GB dataset again."
After (Xet):  Commit becomes cheap → small label fixes, filter tweaks, augmentation experiments are versioned naturally.
```

### 2. Branching turns from painful to liberating

```
Before: Creating an experiment branch meant potentially duplicating hundreds of GBs.
After: Branches share the same underlying chunks → instant, zero-cost branching.
```

### 3. Collaboration friction drops dramatically

New team members or reviewers pull only missing chunks.  
Shared preprocessing results are deduplicated automatically across forks and branches.

These second-order effects compound quickly — teams start treating data versioning as naturally as code versioning.

## When Git LFS remains the right choice

Git LFS is still preferable when:

- Large files are mostly static (final model releases, frozen evaluation sets)
- Simplicity and zero learning curve are top priorities, highly adaptable with those already familiar with Git workflows
- You already rely heavily on GitHub-native LFS quotas and UI integration
- Iteration primarily happens in code, not data

Usually software engineering projects with regular source code modifications rather than data falls into this category.

## When Xet becomes the lifeboat

Xet delivers outsized value when:

- Datasets are regenerated or updated weekly or daily
- Successive versions share 85–99% similarity
- You frequently branch for experiments
- Pull/checkout times and storage costs are limiting iteration speed
- You work with tabular data, preprocessed tensors, or intermediate artifacts that evolve incrementally

This continuous changing nature of dataset often falls into machine learning or deep learning projects, rather than traditional software engineering projects. 

## Closing Thoughts

Git LFS preserves Git’s file-based worldview — effective until data becomes dynamic.  
Xet embraces the reality that in machine learning, data changes incrementally, just like code, thus version control is also necessary for data.

Once that mindset shift occurs, the decision between the two stops being technical — it becomes philosophical:  
Do you want your data versioning system to fight the nature of machine learning iteration, or to support it?
The future of ML infrastructure increasingly favors the latter.

## More about Content-defined chunking technique
**Content-Defined Chunking (CDC)** is a data splitting technique designed to divide large files or streams into variable-sized pieces (chunks) where the chunk boundaries are determined by the **content itself** rather than by fixed sizes or arbitrary offsets. Therefore it is named content-defined chunking.

This approach is the fundamental technology behind modern deduplicating storage systems (including Xet, restic, BorgBackup, ZFS send/receive with dedup, Tahoe-LAFS, and many cloud backup solutions).

### Core Idea

Instead of cutting a file every 4 MB regardless of content, CDC looks for **natural breakpoints** that appear in roughly the same places even after small local modifications.

### How the Classic Rabin Fingerprinting CDC Works

The most widely used algorithm is based on the **Rabin rolling hash** (also called Rabin-Karp fingerprinting adapted for streaming).

**Algorithm steps:**

1. Choose two parameters:
   - A **sliding window size** w (typical values: 48–64 bytes)
   - A large **prime modulus** M (usually ~2³¹ or ~2⁶¹–1)
   - A **gear** (base) value b (commonly 257 or 271)

2. Define a **target mask** (e.g. last 13–20 bits must be zero)  
   → This mask determines average chunk size  
   → Average chunk size ≈ 2^k where k = number of zero bits required

3. Maintain a rolling hash value H over the current window of w bytes

4. For each new byte that arrives:
   - Update the rolling hash (very cheap O(1) operation):
     ```
     H = (H × b - old_byte × b^w + new_byte) mod M
     ```
   - Check if the lowest k bits of H are zero (the "breakpoint condition")

5. When the condition is met → declare a chunk boundary at current position

6. Start new chunk and continue

### Visual Intuition

Imagine this simplified 32-byte window with target: last 3 bits = 000

```
Position:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
Bytes:    [A] [B] [C] [D] [E] [F] [G] [H] [I] [J] [K] [L] [M] [N] [O] [P]

Rolling hash at pos 15 →  ...xxx01000  ← last 3 bits not zero → continue
Next byte Q arrives
New hash →          ...xxx00000  ← last 3 bits are zero! → cut here!
```

Now the important part — what happens after small change:

```
Original:    ABCDEFGHIJKLMNOP
After insert X between F and G:

New stream:  ABCDEF X GHIJKLMNOP

The rolling hash window slides normally.
Because the hash function is rolling and depends mostly on local bytes,
the places where hash mod 2^k = 0 tend to **reappear at similar offsets**
after the modification point → most chunks after the change remain the same!
```

### Why This Property Is Extremely Powerful

| Type of change                  | Git LFS (whole file) | Fixed-size chunks | Content-Defined Chunking |
|-------------------------------|-----------------------|-------------------|---------------------------|
| Append 1 byte at the end       | Full re-upload        | Only last chunk   | Only last few chunks      |
| Insert 1 byte in the middle    | Full re-upload        | All chunks after  | Usually 1–3 chunks        |
| Delete 100 bytes in middle     | Full re-upload        | All chunks after  | Usually 1–5 chunks        |
| Change bytes in first 1%       | Full re-upload        | Many chunks       | Usually 2–10 chunks       |
| Reorder two distant blocks     | Full re-upload        | Many chunks       | Potentially many chunks   |

### Summary – Why CDC Matters for ML/Data Versioning

Content-defined chunking transforms the economics of versioning:

- **Before CDC** (Git LFS, plain Git, fixed-size): cost of change ≈ size of file  
- **After CDC** (Xet, modern deduplication systems): cost of change ≈ size of **delta** + small constant

This difference becomes decisive when:
- datasets are tens to hundreds of GB
- they are updated multiple times per week
- most changes are local (preprocessing, label correction, filtering, augmentation)
- many experimental branches exist simultaneously

In such environments, CDC-based systems like Xet do not just save storage — they fundamentally change developer behavior toward more frequent, finer-grained data versioning, which directly improves research velocity and reproducibility.

# References
For further reading on this technology of Xet Hub Storage backend, reference these materials for better understanding:
[HuggingFace Xet Storage](https://huggingface.co/docs/hub/en/xet/index)
[Original XetHub Website](https://xethub.com/)