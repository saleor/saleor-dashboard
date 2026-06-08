---
"saleor-dashboard": patch
---

Fixed the rich text editor (e.g. product description) duplicating its content on load and then becoming empty and non-editable. This happened in development due to the editor being initialized twice; it now mounts a single editor instance.
