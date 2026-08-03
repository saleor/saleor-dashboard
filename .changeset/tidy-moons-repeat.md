---
"saleor-dashboard": patch
---

Fixed the Dashboard becoming unresponsive after the browser tab was left inactive for a long time, for example after closing and reopening a laptop.

Before: returning to a long-idle tab could fire a burst of duplicate session refresh requests, and installed apps could keep running with an expired token that was never renewed.

Now: the session is refreshed once for all pending requests, and app tokens are renewed based on when they actually expire, including an immediate catch-up when you return to the tab.
