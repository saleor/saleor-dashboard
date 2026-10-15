---
"saleor-dashboard": patch
---

Searching in the model, category and collection pickers now shows progress. Previously, nothing indicated that a search was running, which on a slow connection made the picker look unresponsive. Now a spinner appears in the search field while you type and until results arrive. On slow responses, the previous results stay visible but dimmed in the meantime.
