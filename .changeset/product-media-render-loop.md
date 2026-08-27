---
"saleor-dashboard": patch
---

Fixed the product page freezing while it loads. The media card re-rendered
itself in a loop until the product query resolved, which could lock up the tab
on slower connections.
