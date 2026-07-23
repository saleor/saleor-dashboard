---
"saleor-dashboard": patch
---

Reverted the client-side product media file size pre-check introduced in the media management improvements. Oversized images are no longer blocked in the browser before upload; Saleor Core enforces the configured size limit.
