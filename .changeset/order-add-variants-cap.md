---
"saleor-dashboard": patch
---

Order “add product” dialog now loads a capped page of variants per product (with a truncation hint) instead of fetching every variant at once, so adding lines stays usable for products with large variant catalogs.
