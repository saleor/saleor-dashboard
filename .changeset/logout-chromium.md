---
"saleor-dashboard": patch
---

Logging out in Chrome and other Chromium-based browsers now finishes cleanly. Before, the sign-in page could stay stuck on its loading indicator, and the browser console showed "InvalidStateError: A request is already pending".
