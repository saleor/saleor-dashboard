---
"saleor-dashboard": patch
---

Unify success notification messages

- Pattern: {Entity} {action} - e.g., "Product updated", "Order cancelled"
- Past tense - the action is complete
- No filler words - avoid "successfully", "has been", "was"
- Specific over generic - avoid commonMessages.savedChanges, use contextual messages
- Compound actions use comma - "Products returned, refund granted"
