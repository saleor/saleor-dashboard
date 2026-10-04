---
"saleor-dashboard": patch
---

Keep Dashboard sessions during temporary token-refresh outages with bounded retries. Handle boot-time recovery failures without an unhandled rejection or an endless loading state, and prevent an older refresh response from restoring a logged-out session or overwriting a newer login. Explicitly rejected refresh tokens still log the user out.
