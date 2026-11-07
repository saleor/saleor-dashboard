---
"saleor-dashboard": patch
---

A token refresh that fails for a moment no longer logs you out. Previously, when the request that renews the session failed (a dropped connection, a timeout, a 502 or 503), the dashboard treated it as an expired session: it logged out, deleted the saved session and showed "Your session has expired". Now the failed request reports the connection error and the session is kept, so the next request tries the refresh again. A refresh token the API refuses still logs out.
