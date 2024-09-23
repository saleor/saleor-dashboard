---
"saleor-dashboard": patch
---

Some end-to-end Playwright tests now have extended timeouts for UI elements to load. This means that automation tests should fail less. Playwright retires value has been set to 0.