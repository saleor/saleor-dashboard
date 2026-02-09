---
"saleor-dashboard": patch
---

Product availability diagnostics now skip shipping zone warnings for non-shippable products (digital goods, activation codes, etc.). Products with isShippingRequired: false on their product type will no longer see false positive warnings about missing shipping zones or unreachable warehouses via shipping.
