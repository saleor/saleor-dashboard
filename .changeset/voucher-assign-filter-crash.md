---
"saleor-dashboard": patch
---

Filtering inside a voucher's assign dialog no longer crashes the voucher editor. Previously, applying an attribute filter in Assign products, or an "Is published" filter in Assign collections, replaced the page with an error screen. Now the dialog shows the matching items, and filters set in one assign dialog no longer carry over into the next one you open.
