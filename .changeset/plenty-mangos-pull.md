---
"saleor-dashboard": patch
---

Fixed `appBridge` redirects to treat different ports on the same domain as different origins (for example `localhost:3000` vs `localhost:8000`).
