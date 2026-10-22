# Plan: viettel-post-spelling-grammar

## Overview
Correct ~40 spelling and grammar issues in `_posts/2026-04-22-viettel-digital-talent-recap.md`. One edit pass, one commit. No content restructuring, no factual changes, no stylistic rewrites beyond fixing broken grammar.

## File
`_posts/2026-04-22-viettel-digital-talent-recap.md` (161 lines)

## Tasks

### Task 1: Fix typos in "The 14-hour training estimation time and wrong masking" section

**Edits (heading + paragraph, ~15 fixes):**

| Old | New |
|-----|-----|
| `tiem` (heading) | `time` |
| `runing` | `running` |
| `a small training.` | `a small training run.` |
| `all the the` | `all the` |
| `I found that because I set` | `I found that I had set` |
| `So what would this mean? This would mean` | `This meant` |
| `since it is truncated` | `since it was truncated` |
| `user query and the retrieval functions information` | `user query, and retrieval function information` |
| `The model even had no chance to fill in its reasoning and answers because there was no room for it anymore.` | `The model had no room left to produce reasoning or answers.` |
| `all the loss was zero and consume a lot of time of the model for processing` | `all the losses were zero, consuming a lot of processing time` |
| `the bugs were gone, once and for all.` | `the bugs were gone.` |
| `resembled me with` | `reminded me of` |
| `when doing ML project` | `for ML projects` |
| `we should print out all the input that we feed into our models` | `to print out all the input fed into their models` |
| `is doom from that moment` | `is doomed from that moment` |
| `I sit` | `I sat` |
| `did a brutal combat with this bug around 14 hours that day` | `did brutal combat with this bug for around 14 hours` |
| `of the ntext day` | `the next day` |
| `Lots of experience learned but also frustrated hellishly.` | `Lots of lessons learned, but it was hellishly frustrating.` |

**Acceptance**: Section heading reads "time" not "tiem". All typos corrected. No remaining `runing`, `the the`, `resembled me with`, `is doom`, `I sit`, `ntext` in edited section.

### Task 2: Fix grammar in "Reasoning length increasing" section

**Edits (~10 fixes):**

| Old | New |
|-----|-----|
| `The next bug lied` | `The next bug lay` |
| `SFt` (×2) | `SFT` |
| `Watching the logs show` | `Watching the logs showed` |
| `laready` | `already` |
| `the mean completion length is laready 512` | `the mean completion length was already 512` |
| `the model has all completion in a group reach` | `the model had all completions in a group reaching` |
| `suspecious` | `suspicious` |
| `effectively eliminate the problem` | `effectively eliminating the problem` |
| Attach `Though I have not understood the problem well enough` to previous sentence with `, though I have not understood the problem well enough` |
| `come from` | `came from` |
| `trainig` | `training` |
| `surprise come from` → `surprise came from` (already listed) | |
| `How efficient!` | (keep as-is — intentional irony) |

**Acceptance**: No `lied`, `SFt`, `laready`, `suspecious`, `trainig` in edited section. Tense consistent.

### Task 3: Fix spelling and grammar in "New special tokens" section

**Edits (~12 fixes):**

| Old | New |
|-----|-----|
| `touse` | `to use` |
| `startegies` | `strategies` |
| `neligible` | `negligible` |
| `this results` | `these results` |
| `are mainly the same` | `were mainly the same` |
| `computational expensive` | `computationally expensive` |
| `contained only` | `involved only` |
| `easily enabled` | `easily enabling` |
| `when adding the special tokens into the special tokens vocabulary set of the model` | `when adding the special tokens to the model's vocabulary set` |
| `we command the tokenizer to tokenize these tokens differently than it used to do` | `we instruct the tokenizer to tokenize these tokens differently than before` |
| `lead to` | `leading to` |
| `raise from only 33 millions to over 800 millions` | `rose from only 33 million to over 800 million` |
| `increased the computational demand` → `increasing the computational demand` | |

**Acceptance**: No `touse`, `startegies`, `neligible`, `computational expensive`, `millions`, `this results` in edited section.

### Task 4: Fix grammar in "Closing Thoughts" section

**Edits (~15 fixes):**

| Old | New |
|-----|-----|
| `After finishing all submissions including source code on my GitHub repository and report in DOCX (yes in docx, not markdown or pdf, bruh). I was announced that I have been chosen` | `After finishing all submissions — source code on my GitHub repository and a report in DOCX (yes, in docx, not markdown or PDF, bruh) — I was told that I had been chosen` |
| `contains leading mentors from each departments` | `containing leading mentors from each department` |
| `Such an honour but also a confusing moment, since I didn't my result is good enough` | `It was an honour but also a confusing moment, since I didn't think my result was good enough` |
| `has done something in the dark` | `had done something behind the scenes` |
| `prepare slide presentation` | `prepare a slide presentation` |
| `15 mintes` | `15 minutes` |
| `underpresenting our work` | `underrepresenting our work` |
| `judgers` (×2) | `judges` |
| `seem quite confusing` | `seemed quite confusing` |
| `I could tell that I got a large handful of hands-on experience` | `I can say that I gained a handful of hands-on experience` |
| `no big deal so no experience gain that time` | `no big deal, so I didn't gain much experience that time` |
| `enhances` | `enhanced` |
| `follow natural language domain` | `follow the natural language domain` |
| `one of my most useful experience` | `one of my most useful experiences` |
| `they should be not too easy` | `they should not be too easy` |

**Acceptance**: No `mintes`, `underpresenting`, `judgers`, `didn't my result is`, `from each departments`, `experience` (when plural needed) in edited section.

### Task 5: Verify build

```bash
cd /run/media/dung-pham/DATA/Personal/dzungphieuluuky
bundle exec jekyll build --future
```

**Acceptance**: Exit code 0. Only pre-existing `_site/index.html` conflict warning (harmless).

### Task 6: Commit

Commit message: `fix: correct spelling and grammar in viettel-digital-talent-recap post`

Include full path in diff summary.

## Final verification wave

- [x] F1. `bundle exec jekyll build --future` exits 0
- [x] F2. No remaining typos in file — grep for `tiem|runing|ntext|laready|suspecious|trainig|touse|startegies|neligible|mintes|underpresenting|judgers`
- [x] F3. No remaining `SFt`, `millions`, `resembled me with`, `is doom`, `lie(d|s)` (as the bug sense), `computational expensive` in file

## Commit
```
fix: correct spelling and grammar in viettel-digital-talent-recap post

Fix ~40 spelling and grammar issues across the post: typos, tense
inconsistencies, wrong prepositions, missing articles, pluralization
errors, and sentence fragments. No content restructuring or factual changes.
```
