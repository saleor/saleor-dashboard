---
"saleor-dashboard": patch
---

Metadata filters will now omit `value` if none is provided for filters that are using `WHERE` API (Products, Orders, etc.). This way users can filter for metadata key existence instead of key:value pairs.
