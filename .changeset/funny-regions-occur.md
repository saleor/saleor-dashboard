---
"saleor-dashboard": patch
---

Keep category and collection full descriptions in retry requests after an editor read fails, and preserve unsaved-change warnings while editors are being read.

For example, retrying after changing only the name also saves the pending full description.
