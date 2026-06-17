---
"saleor-dashboard": patch
---

Refund and return reasons can now be captured as structured data alongside free text.

- Granted refunds now support a reason and a structured reason reference both for the whole refund and per refunded line.
- Returns now support a reason and a structured reason reference both for the whole return and per returned line.
- A new combined **Refunds & returns settings** screen (Configuration → Refunds & returns settings) lets you choose the Model Type whose Models are offered as refund reasons and as return reasons. When a type is configured, a structured reason picker appears in the refund and return flows; when none is configured, only free-text reasons are used.
- Saved reasons are now shown on fulfillment cards (overall and per line) and next to granted refunds in the order's refund table.
- When granting a refund automatically while returning items (the "Grant refund for returned items" option), you can now provide a reason note and a structured reason for that granted refund. The picker uses the refund reason type configured in Refunds & returns settings, and is hidden when none is set.
