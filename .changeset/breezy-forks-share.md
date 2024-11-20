---
"saleor-dashboard": patch
---

Removed unnecessary expect that was waiting for the success banner, as it was causing delays on CI. Instead, the test rely on other assertions to verify that changes have been applied
