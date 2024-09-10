---
"saleor-dashboard": patch
---

SALEOR_37 now waits for expected options to appear, preventing fails in some test runs. Playwright retires has been set to 0. SALEOR_191 has been marked as a slow test meaning PW shouldn't fail due to timeout. SALEOR_119 now waits for app's UI to load. 
