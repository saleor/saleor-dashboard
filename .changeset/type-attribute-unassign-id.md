---
"saleor-dashboard": patch
---

Fix unassigning an attribute from a product type or model type. The confirm dialog now keeps the attribute id, so the request no longer sends `null` and the attribute is actually removed.
