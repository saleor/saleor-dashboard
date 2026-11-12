---
"saleor-dashboard": patch
---

When the dashboard can't reach Saleor, a banner above the page now says so: "You're offline" when the browser has no network connection, or "Can't reach Saleor" when requests get no answer, including when a proxy answers with a 502, 503 or 504 page. It says you're still signed in and unsaved changes stay on the page, stays in view while you scroll, keeps checking on its own, and offers Try now. Once Saleor answers, it shows "Connected again" for a few seconds, and the parts of the page that failed to load during the outage load by themselves. A single dropped request no longer looks like an outage: the banner only appears if a check a second later fails too. If part of a page keeps failing while Saleor answers other requests, "Couldn't load some data" says so once instead. The "Can't reach Saleor" screen at startup now also tries again as soon as Saleor answers.
