---
layout: page
title: Curriculum Vitae
subtitle: "Undergraduate researcher in physics & deep learning"
---

<div class="cv-container">

  <!-- ── Download Section ─────────────────────── -->
  <div class="cv-download-section">
    <p class="cv-download-label">Available formats</p>
    <div class="cv-download-buttons">

      <a href="{{ '/assets/cv/resume.pdf' | relative_url }}"
         class="cv-btn cv-btn-primary"
         download
         aria-label="Download CV as PDF">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9"  y1="15" x2="15" y2="15"/>
        </svg>
        <span class="cv-btn-text">
          <strong>PDF</strong>
          <small>Recommended</small>
        </span>
      </a>

      <a href="{{ '/assets/cv/resume.tex' | relative_url }}"
         class="cv-btn cv-btn-secondary"
         download
         aria-label="Download CV LaTeX source">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        <span class="cv-btn-text">
          <strong>LaTeX</strong>
          <small>Source file</small>
        </span>
      </a>

    </div>
  </div>

  <!-- ── PDF Viewer ───────────────────────────── -->
  <div class="cv-viewer-section">
    <div class="cv-viewer-header">
      <span class="cv-viewer-label">Preview</span>
      <a href="{{ '/assets/cv/resume.pdf' | relative_url }}"
         class="cv-open-link"
         target="_blank"
         rel="noopener noreferrer">
        Open in new tab
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>

    <div class="cv-iframe-wrapper">
      <iframe
        src="{{ '/assets/cv/resume.pdf' | relative_url }}#view=FitH"
        title="Curriculum Vitae PDF preview"
        loading="lazy"
        allowfullscreen>
        <p class="cv-iframe-fallback">
          Your browser cannot display PDFs inline.
          <a href="{{ '/assets/cv/resume.pdf' | relative_url }}" download>
            Download the PDF directly.
          </a>
        </p>
      </iframe>
    </div>
  </div>

</div>