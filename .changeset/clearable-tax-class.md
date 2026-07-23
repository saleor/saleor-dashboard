---
"saleor-dashboard": patch
---

Product, product type, and shipping tax class fields can be unset via an explicit empty option in the list (e.g. “Product type default” on products). Choosing it removes the assignment so products fall back to the product type tax class.
