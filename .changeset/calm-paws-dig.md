---
"saleor-dashboard": patch
---

Prevent accidental variant metadata edits from order context

Previously, users could edit product variant metadata directly from the Order Line Metadata dialog. This could be misleading because variant metadata is shared across all orders—changes made here would affect the variant globally, not just this order.

Variant metadata is now displayed as read-only in the order context, with a direct link to the variant page for intentional edits.