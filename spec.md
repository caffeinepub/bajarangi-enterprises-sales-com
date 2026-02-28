# Specification

## Summary
**Goal:** Build a full-screen, dark-themed, Canva-like photo editor with core editing tools, layer management, and an AI prompt editing feature backed by persistent storage.

**Planned changes:**
- Full-screen editor layout with a left tools panel, center canvas workspace, right properties panel, and top toolbar (Upload, Download, Undo, Redo)
- Core editing tools: crop/resize, free-hand drawing/brush (size & color), text overlay (add/move/resize/style), shapes (rectangle, circle, line, arrow), image filters (brightness, contrast, saturation, blur, grayscale, sepia), and sticker/emoji overlays
- Layer management panel with drag-to-reorder, visibility toggle, and delete per layer; canvas updates in real time
- "AI Edit" panel accessible from the toolbar: text prompt input, keyword-based canvas transformation (color adjustments, filters, overlays, blur, vignette, etc.), loading indicator, undo support, and prompt history displayed in the panel
- Backend storage for AI prompt history (id, prompt text, transformation descriptor, timestamp) with save mutation and sorted query, persisted across upgrades
- Sleek dark-mode design using deep charcoal/slate panels, teal or amber accent color, clean sans-serif typography, and smooth hover/active transitions

**User-visible outcome:** Users can upload an image, edit it with a full suite of canvas tools and layer management, apply natural-language AI-style prompt edits (simulated via keyword parsing), and review their past AI edit prompts — all within a polished dark-themed editor interface.
