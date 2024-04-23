---
"saleor-dashboard": patch
---

This change replaces old service worker with a noop service worker. Saleor Dashboard will no longer actively use service worker for caching and registering fonts. 
