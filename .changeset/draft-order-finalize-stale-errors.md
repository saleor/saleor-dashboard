---
"saleor-dashboard": patch
---

Draft order errors now disappear once the missing details are filled in.

Clicking "Finalize" on an incomplete draft order marks the missing billing address, shipping address and shipping method. Those errors come from the `draftOrderComplete` result, which Apollo keeps until the mutation runs again, so they stayed on screen even after the customer, addresses and carrier had been picked. Each of them is now dropped as soon as the draft actually carries the data it was complaining about.
