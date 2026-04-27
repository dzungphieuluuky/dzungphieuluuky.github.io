# ICLR Blog Post Checklist
## Write Research-Grade Posts That Engage Both Practitioners & Researchers

---

## PRE-WRITING: The Foundation

### Define Your Core Contribution
- [ ] **What is the novelty?** Identify one non-obvious insight (algorithm insight, empirical finding, theoretical connection, or reframing)
- [ ] **Who cares and why?** Map stakeholders: ML practitioners, a specific subfield, theoreticians, practitioners, or cross-disciplinary audiences?
- [ ] **What problem does this solve?** Frame around pain points, not features
- [ ] **Why now?** What recent work, trend, or limitation makes this relevant in 2026?
- [ ] **Is this ICLR-track worthy?** Could this spark discussion at a venue? Does it advance the field's thinking?

### Research & Context
- [ ] Identify 3–5 foundational papers (go to originals, not just surveys)
- [ ] Map the lineage: How did we get here? What prior work built the path?
- [ ] Find the gap: Where is the community's blind spot, assumption, or limitation?
- [ ] Gather empirical anchors: Specific numbers, benchmarks, results to ground claims
- [ ] Review related blog posts (Distill, Anthropic, OpenAI, DeepMind) for tone and structure

---

## STRUCTURE: Architect for Navigation & Depth

### Opening Strategy: Start with a Concrete Hook
- [ ] **Lead with a scene, question, or surprising finding** (not a definition or background dump)
  - ❌ "Attention mechanisms are a key component of transformers..."
  - ✅ "A 7B-parameter model trained on diverse data sometimes outperforms a 100B model on specialized tasks. Why?"
- [ ] **State the motivation in one sentence:** Why should a busy researcher care?
- [ ] **Promise the payoff:** What will they understand by the end?
- [ ] Include reading time estimate at top (15–45 min for ICLR-level posts)

### Build a Map Early
- [ ] Create a **Table of Contents with clear section hierarchy** (H1 → H2 → H3)
  - Each section should have **one purpose**, defensible in a sentence
  - Section headings should be descriptive and searchable, not clever
  - Use numbered sections (1., 2., etc.) for navigability
- [ ] Add a **"Roadmap" paragraph** after intro explaining the narrative flow
  - "We'll first review X, then empirically test Y, then explore the implications for Z"
- [ ] Use **anchor links** throughout so readers can jump to relevant sections

### Middle Structure: Evidence → Explanation → Implication
- [ ] **Each major section opens with a concrete thing** (result, diagram, theorem statement, code snippet)
- [ ] **Then explain:** What does it mean? Why should we believe it? Where does it fit in the narrative?
- [ ] **Close with implication:** How does this change our thinking? What's the next question?

### Subsection Discipline
- [ ] Break long sections (>1000 words) into clearly labeled subsections (H3/H4)
- [ ] Each subsection should be **self-contained yet cohesive**—readers can skip or revisit
- [ ] Use bold topic sentences at paragraph starts to enable skim reading
- [ ] Limit paragraphs to 4–5 sentences; one idea per paragraph

### Closing: Relentless Summarization
- [ ] Include a **"Closing Thoughts" section** that distills the entire post into 5–7 bullet points
- [ ] **Recap what changed in the reader's mental model**
- [ ] Explicitly state limitations and open questions
- [ ] Point to concrete next steps or follow-up work
- [ ] Avoid soft conclusions; be direct about implications

---

## WRITING: Rigor Meets Clarity

### Lead with Intuition, Ground in Math
- [ ] **Explain the intuition first**, then the formalism
  - Before: $$\mathcal{L} = \mathbb{E}[D_{KL}(q_\phi(z|x) \| p(z))] + \mathbb{E}[D_{KL}(p(x|z) \| q_\phi(x))]$$
  - After: "Variational autoencoders balance two competing goals: compress the input into a bottleneck (the KL term) while still reconstructing it accurately (the reconstruction term). Here's why:" *[then show formula]*
- [ ] Use **thought experiments** to build intuition
  - "Imagine training a 1B model on 1T tokens, then a 10B model on the same tokens. Which learns faster?"
- [ ] Provide **analogies grounded in familiar domains**
  - Scaling laws ↔ returns on investment in engineering
  - Attention mechanisms ↔ selective focus in human vision
  - Latent representations ↔ abstract concepts in psychology

### Explain the "Why" Chain
- [ ] For each technical claim, answer: "Why is this true?" or "Why do we care?"
- [ ] For algorithmic choices: "Why this design and not another?"
- [ ] For empirical results: "What's the underlying mechanism?"
- [ ] For limitations: "What would it take to overcome this?"

### Terminology & Definitions
- [ ] Define technical terms **at first use**, not in a separate glossary
- [ ] Use **consistent terminology** throughout (pick one term per concept; note synonyms once)
- [ ] For domain-specific jargon, provide a brief parenthetical or footnote
- [ ] If the field uses a term loosely, flag it: "What practitioners call 'fine-tuning' actually encompasses..."

### Tone & Voice
- [ ] Write **conversationally but rigorously**—no marketing hype, no filler
- [ ] Use active voice where possible; passive only when emphasizing the action, not the actor
- [ ] **Be opinionated** (flag opinions explicitly: "We believe..." or "Importantly...")
- [ ] **Be honest about uncertainty:** "This is speculative, but..." or "The evidence is mixed..."
- [ ] Avoid generic transitions ("Furthermore," "Moreover"); use specific connectors ("As we discussed earlier..." or "This contrasts with...")

### Avoid These Anti-Patterns
- ❌ Generic openings: "In today's rapidly evolving landscape of AI..."
- ❌ Vague claims without evidence: "Attention is revolutionary"
- ❌ Invented metrics or unsourced quotes
- ❌ Passive constructions masking attribution: Use active voice and cite sources
- ❌ Tangential depth: Keep main text focused; use footnotes or sidebars for asides
- ❌ Overstated claims beyond what evidence supports

---

## VISUALS: Strategic Diagrams & Figures

### Figures Must Explain, Not Decorate
- [ ] **Every figure should answer a specific question**
  - ❌ "Here's what an attention head looks like"
  - ✅ "Attention heads specialize: head 1 attends locally, head 2 attends to specific tokens"
- [ ] Include a **descriptive caption** for each figure: "Figure N: What this shows and why it matters"
- [ ] Use **consistent visual style** across all figures (colors, fonts, line weights)
- [ ] Ensure figures are **readable at 80% zoom** (critical for small screens)

### Diagram Types for ICLR Posts
- [ ] **Architecture diagrams:** Clearly show data flow and skip connections
- [ ] **Learning curves:** Include error bars or confidence intervals; label convergence behavior
- [ ] **Comparison tables:** Use color/weight to highlight surprising findings
- [ ] **Interactive visualizations:** If feasible, use D3.js or similar (e.g., embedding projections)
- [ ] **Conceptual illustrations:** Draw analogies visually (e.g., scaling laws as economic investment curves)

### Text Hierarchy & Visual Flow
- [ ] Use **bold for key concepts** (not all caps or colored text)
- [ ] Use **italics for variables** ($$x$$, $$\theta$$) and emphasis
- [ ] Break long text blocks with subheadings, bullet lists, or visual separators
- [ ] Ensure **sufficient whitespace** (no dense walls of text)
- [ ] Number equations if they're referenced; use a clear caption

---

## RIGOR & REFERENCES: Academic Integrity

### Citations & Attribution
- [ ] **Cite primary sources** (go to the original paper, not the summary)
- [ ] **Cite liberally:** Even for well-known concepts, link to the foundational work
- [ ] Include **inline links to papers** (via DOI or arXiv) where possible
- [ ] For each major claim, ensure a citation or explicit caveat ("To our knowledge...")
- [ ] **Acknowledge related blog posts** and prior art; don't reinvent wheels

### References Section
- [ ] Include a **full References section** at the end with proper formatting
- [ ] Provide **BibTeX snippets** for academic readers (formatted code block)
- [ ] Organize by theme or chronology (your choice, but be consistent)
- [ ] Verify **all links work** 1 week before publishing

### Reproducibility & Examples
- [ ] If presenting empirical results, link to **code or datasets** (GitHub, Hugging Face)
- [ ] For algorithms, include **pseudocode or reference implementation** links
- [ ] Note computational requirements (GPU hours, memory, etc.)
- [ ] If results depend on hyperparameter tuning, be transparent about search methodology

---

## ENGAGEMENT: Build a Conversation, Not a Lecture

### Opinionated Positioning
- [ ] **Take a stance:** What is an unconventional view you're defending?
- [ ] **Address counterarguments directly:** "One might think X, but here's why Y..."
- [ ] **Separate facts from interpretation:** Use phrases like "We interpret this as..." or "This suggests..."
- [ ] **Invite critique:** "Does this model hold up in your domain? Let us know in the comments"

### Accessibility Without Dumbing Down
- [ ] **Signal the audience level upfront:** "This assumes familiarity with transformers" or "We explain each step"
- [ ] **Provide sidebars or footnotes for tangential depth** (keep main narrative uncluttered)
- [ ] **Use "show your work"** pedagogically—walk through one concrete example fully
- [ ] **Recap frequently** for long posts: "To recap: X, Y, and Z set the stage for..."

### Emotional & Intellectual Resonance
- [ ] **Why does this matter beyond the paper?** Connect to broader implications
- [ ] **Acknowledge limitations honestly:** Strengthens credibility
- [ ] **Thank collaborators or influences:** "This work builds on conversations with..."
- [ ] **Use occasional humor** (dry, self-aware, not forced)
- [ ] **End with a question or open problem** to seed follow-up thinking

---

## BEFORE PUBLISHING: The Final Pass

### Clarity & Flow
- [ ] **Read aloud** to catch awkward phrasing, run-on sentences, or unclear jargon
- [ ] **Share with a peer unfamiliar with the topic** and get feedback on clarity
- [ ] **Check narrative coherence:** Does each section follow logically from the previous?
- [ ] **Verify consistency:** One term per concept; consistent notation; tone alignment

### Technical Accuracy
- [ ] **Verify all equations:** Check derivations; ensure notation is consistent
- [ ] **Test code examples:** Run all snippets; verify outputs
- [ ] **Double-check empirical claims:** Are numbers/citations correct?
- [ ] **Peer review if possible:** Have an expert in the domain review technical sections

### Formatting & Accessibility
- [ ] **Mobile testing:** Check layouts, equations, code blocks on small screens
- [ ] **Verify all links:** Test internal anchors and external URLs
- [ ] **Check math rendering:** Equations should display cleanly (KaTeX or MathJax)
- [ ] **Image quality:** All figures at ≥150 DPI; readable text labels

### SEO & Discoverability
- [ ] **Descriptive title:** Include key concepts (e.g., "Scaling Laws Beyond Chinchilla: LLM Efficiency..." not "Thoughts on Scaling")
- [ ] **Summary paragraph:** First 2–3 sentences capture the gist for social sharing
- [ ] **Add header-level keywords naturally** (don't keyword-stuff; it's obvious)
- [ ] **Use descriptive alt text for images**

### Final Polish
- [ ] Proofread for grammar and typos (use a tool like Grammarly or Hemingway Editor)
- [ ] Ensure consistent capitalization and punctuation
- [ ] Remove any placeholder text or draft comments
- [ ] Validate YAML front matter (date, tags, author)

---

## POST-PUBLISHING: Maintenance & Feedback

### Versioning & Updates
- [ ] **Add publication date prominently** (at the top or in metadata)
- [ ] **If updating:** Add a dated "Update" note explaining what changed and when
- [ ] **Link to subsequent related posts** as they're published
- [ ] **Periodically audit references:** Fix broken links within 3 months of publication

### Engagement & Iteration
- [ ] Monitor feedback and discussions
- [ ] Correct errors transparently: "We corrected X on [date]"
- [ ] Note if new papers supersede claims: "Recent work (2026) has shown..."
- [ ] Celebrate thoughtful engagement: Reply to substantive comments

---

## Meta: How This Post Should Feel

**To a practitioner:** "Concrete, useful, not overwhelming. I can apply or test the ideas by end."

**To a researcher:** "Rigorous, novel perspective. Connects to my work. Honestly acknowledges limitations."

**To an ICLR organizer:** "Accessible yet technical. Advances thinking. Well-executed. Invites discussion."

**To an AI/ML generalist:** "I don't need a PhD to get value, but there's depth for those who dig."