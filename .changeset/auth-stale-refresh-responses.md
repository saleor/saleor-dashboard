---
"saleor-dashboard": patch
---

Logging out, or signing in to another account, while the dashboard is renewing the session no longer lets the old session come back. Previously, a renewal that finished after logout put the old session's access token back, and requests from the old session were sent again after logout. A renewal refused after another login could also log the new account out. Now a renewal result from a session that has ended is ignored, and requests that were waiting on it are dropped without an error message. Choosing "Sign in with another account" on the "Can't reach Saleor" screen also ends the saved session, so a renewal still running can't open the dashboard as the previous account. If the API refuses to renew the session while a request waits for it, "Your session has expired" now shows, instead of the requests failing with unrelated errors.
