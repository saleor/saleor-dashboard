---
"saleor-dashboard": patch
---

Playwright tests were updated to address a server rate limit issue for login attempts (1 second). Concurrent login requests occurred when tests ran in parallel across multiple PRs, with 2 shards per PR and 4 workers per shard, sometimes sharing the same IP, leading to simultaneous logins.

To fix this, login requests are now performed on demand based on required permissions, not at the start of the tests. A file-lock mechanism ensures only one login happens at a time. Tokens are reused to limit the number of login requests.
