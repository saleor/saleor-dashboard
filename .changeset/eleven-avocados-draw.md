---
"saleor-dashboard": patch
---

Moving test cases for activation and deactivation staff members to other file and running it in serial mode to avoid login in two tests in the same time (it can cause error with code LOGIN_ATTEMPT_DELAYED)
