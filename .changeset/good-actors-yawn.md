---
"saleor-dashboard": patch
---

Now there can only be one login request running at a time. This means using a password manager to log in no longer cause an error. If there are too many login requests Dashboard now shows a corresponding error message.
