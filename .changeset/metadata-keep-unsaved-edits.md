---
"saleor-dashboard": patch
---

Metadata editors no longer throw away what you typed, and saving sends only what you changed. When a save fails, your changes stay in the editor so you can try again; before, the editor went back to the saved values. When the metadata reloads while you're editing, your changes stay as they are, and saving still sends only the entries you added, changed or removed, so it never overwrites a newer value an app saved in the meantime. Save stays disabled while the editor reloads the metadata after saving.
