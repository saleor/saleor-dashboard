---
"saleor-dashboard": patch
---

Prevent a delayed token-refresh response from restoring a logged-out Dashboard session, overwriting a newer login, or clearing the newer session. Keep in-flight requests and token refreshes scoped to the session that started them.
