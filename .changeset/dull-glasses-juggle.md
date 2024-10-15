---
"saleor-dashboard": patch
---

Mailpit service uses has been removed due to issues with checking email during E2E runs on PRs. This means the tests no longer check if export emails have been received.
