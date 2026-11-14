---
"saleor-dashboard": patch
---

When saving metadata fails because the request doesn't go through (for example, the connection drops), the metadata editor now stays open instead of saying "Metadata updated" and closing. Before, it reported a save that never happened.
