---
"saleor-dashboard": patch
---

Gift cards filters now have option to filder by gift card code explicitly. Previously this was available only in search box, which uses `search` query, this however might not be available immediately after creating a gift card, due to indexing running in the background.
