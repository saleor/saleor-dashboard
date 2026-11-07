---
"saleor-dashboard": patch
---

Logging out, or signing in to another account, while the dashboard is renewing the session no longer lets the old session come back. Previously, a renewal that finished after logout put the old session's access token back, and requests from the old session were sent again after logout. A renewal refused after another login could also log the new account out. Now a renewal result from a session that has ended is ignored, and requests that were waiting on it are dropped without an error message.
