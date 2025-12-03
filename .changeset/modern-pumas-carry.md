---
"saleor-dashboard": patch
---

Fixed broken permissions on product edit page, if user did not have MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES permission. It was caused by "Attribute" object being fetched with privateMetadata on every page, not only "attribute edit" page
