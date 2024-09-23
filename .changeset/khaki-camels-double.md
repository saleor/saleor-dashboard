---
"saleor-dashboard": patch
---

Adds conditional logic to the Merge Playwright Reports workflow, ensuring that the merge and upload steps are only triggered when the pull request has the run pw-e2e label applied.
