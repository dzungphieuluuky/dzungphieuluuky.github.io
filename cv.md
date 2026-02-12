---
layout: page
title: Curriculum Vitae
subtitle: My Resume & Experience
---

<div class="cv-container">
  
  <div class="cv-download-section">
    <h2>Download My CV</h2>
    <div class="cv-download-buttons">
      <a href="{{ '/assets/cv/resume.pdf' | relative_url }}" class="btn btn-primary" download>
        <i class="fas fa-file-pdf"></i> Download PDF
      </a>
      <a href="{{ '/assets/cv/resume.tex' | relative_url }}" class="btn btn-primary" download>
        <i class="fas fa-file-code"></i> Download LaTeX
      </a>
    </div>
  </div>

  <div class="cv-viewer-section">
    <h2>View Online</h2>
    <iframe 
      src="{{ '/assets/cv/resume.pdf' | relative_url }}" 
      width="100%" 
      height="900px"
      style="border: 1px solid var(--border-primary); border-radius: var(--radius-lg);">
    </iframe>
  </div>

</div>