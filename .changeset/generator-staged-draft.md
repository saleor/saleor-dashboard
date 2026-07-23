---
"saleor-dashboard": patch
---

Generating variants now stages them on the product until Save, instead of creating them immediately. Unsaved generated variants appear in an editable draft grid below the variants table (name, SKU, prices, stock — delete selected or clear all); use Save to create them with the rest of the product draft.
