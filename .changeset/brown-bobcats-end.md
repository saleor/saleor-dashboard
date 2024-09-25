---
"saleor-dashboard": patch
---

Implemented on-demand authentication for Playwright tests to mitigate rate-limiting issues. Authenticates only the admin user during initial setup and uses a helper function to authenticate other roles as needed within tests.
