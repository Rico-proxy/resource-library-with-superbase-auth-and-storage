# Dyslexia Accessibility Testing Plan

## Purpose
This document defines how the Resource Library project can be tested more explicitly for dyslexia-friendly accessibility. It complements the new in-app accessibility controls by documenting what should be checked during manual review and user testing.

## Implemented Accessibility Supports
- dyslexia-friendly reading font toggle
- high-contrast reading mode
- warm-focus reading mode
- text-to-speech/read-aloud controls
- document preview page read-aloud summary

## Recommended Manual Test Areas

### 1. Font Legibility Testing
Check whether the reading-font mode improves scanning and comprehension for users who struggle with dense text.

Test pages:
- landing page
- resources page
- category page
- upload page
- document preview page

Verify:
- headings remain readable
- body text feels less crowded
- links remain recognizable
- card titles do not become visually cramped

### 2. Contrast and Visual Comfort Testing
Test all three presets:
- default
- high contrast
- warm focus

Verify:
- text remains readable against card and page backgrounds
- buttons keep strong contrast
- links remain visually distinct
- background decorations do not interfere with reading

### 3. Read-Aloud Testing
Verify:
- the global “Read this page” action reads visible page text
- the preview page “Read Details Aloud” button reads key metadata correctly
- the stop-reading action cancels speech immediately
- the feature fails gracefully on unsupported browsers

### 4. Keyboard Accessibility Testing
Verify:
- the accessibility panel can be opened with keyboard navigation
- the panel buttons are reachable in a sensible order
- document cards remain keyboard-usable
- auth and upload forms remain fully operable without a mouse

### 5. Dyslexia-Focused Usability Review
Suggested user questions:
- Is the reading-font mode easier to follow than the default font?
- Which contrast preset feels most comfortable during longer reading?
- Is the page structure easy to scan?
- Are the buttons and labels clear enough without re-reading?
- Does read-aloud reduce effort when navigating resources?

## Suggested Test Scenarios

### Scenario A: Finding a Document
1. Open the resources page.
2. Turn on the dyslexia-friendly reading font.
3. Search for a resource by title.
4. Switch between contrast presets.
5. Confirm whether discovery becomes easier or harder.

### Scenario B: Reading Document Metadata
1. Open a document preview page.
2. Use “Read Details Aloud.”
3. Confirm that title, author, category, and available actions are understandable.

### Scenario C: Uploading a File
1. Go to the upload page.
2. Enable the reading font and a contrast preset.
3. Try to complete the form using keyboard navigation only.
4. Check whether labels, feedback, and validation messages remain easy to process.

## Known Limitation
The current text-to-speech support reads visible page text and document metadata, but it does not directly read embedded PDF contents. Full PDF reading support would require either:
- extracted document text
- OCR/text parsing
- deeper PDF accessibility tooling

## Next Accessibility Improvements
- line spacing and text size controls
- saved per-user accessibility preferences in profile data
- downloadable accessible text summary for resources
- document OCR or text extraction for read-aloud
- WCAG audit notes
- user testing with participants who have dyslexia
