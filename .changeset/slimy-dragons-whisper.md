---
"saleor-dashboard": patch
---

Changed Product Variant details URL from `/products/<productId>/variant/<variantId>` to `/products/variant/<variantId`.

Old URL will still work and redirect to new one for backwards compatibility, it will be removed in next minor release.
