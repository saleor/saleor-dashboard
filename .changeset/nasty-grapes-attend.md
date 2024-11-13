---
"saleor-dashboard": patch
---

Refactor tests to replace `waitForDOMToFullyLoad` with `waitForLoaderToDisappear`, making the test shorter by waiting only for the loader to disappear instead of the entire DOM to load.
