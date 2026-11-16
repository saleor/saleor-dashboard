---
"saleor-dashboard": patch
---

Saving metadata now sends only the entries you added or changed, plus the keys you removed. Before, every save also re-sent each entry you hadn't touched with the value it had when the editor loaded, so it could undo a change that an app or another user made in the meantime. This applies to every metadata editor in the dashboard.
