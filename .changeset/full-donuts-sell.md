---
"saleor-dashboard": patch
---

Fix notification links and app redirects opening unrelated apps with the same name or a conflicting identifier. Apps now match by identifier, with a manifest URL fallback only when the identifier is missing.
