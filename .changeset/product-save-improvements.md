---
"saleor-dashboard": patch
---

Product edit save behavior is clearer and safer:

- The save bar lists what will be saved (details, channels, variants). Partial failures show which steps applied, and a failed save keeps the draft for retry.
- Generated variants are staged until Save and appear in an editable draft grid (name, SKU, prices, stock).
- Retrying after a partial failure doesn't recreates variants the API already accepted.
- Tax class can be cleared to fall back to the product type default.
- Clearing rating or SEO title/description now persists correctly instead of silently keeping the old values.
