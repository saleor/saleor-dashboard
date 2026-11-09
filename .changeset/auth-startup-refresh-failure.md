---
"saleor-dashboard": patch
---

The dashboard no longer hangs on the loading screen when it can't reach Saleor at startup. Previously, when renewing the saved session failed (offline, a timeout, a 502 or 503), the loader showed until the page was reloaded, with an unhandled error in the console. Now the dashboard retries twice, then shows "Can't reach Saleor" with the API address, a Try again button and a way to sign in with another account. The saved session is kept, and the dashboard tries again when the browser comes back online and every 30 seconds, so it continues once Saleor answers.
