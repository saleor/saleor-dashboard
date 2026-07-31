---
"saleor-dashboard": patch
---

Fix entity ids being passed double-encoded to apps opened from the command palette (Cmd+K). Actions triggered from a detail page received ids such as `UHJvZHVjdDo3Mw%3D%3D` instead of `UHJvZHVjdDo3Mw==`, so app queries failed with `Invalid ID`. Affected every entity context the `SEARCH_ACTION` mount resolves (`productId`, `orderId`, `customerId`, …).
