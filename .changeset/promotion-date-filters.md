---
"saleor-dashboard": patch
---

Start and end date filters on the promotions list now use your browser's time zone. Previously the typed time was read as UTC, so a filter could include or leave out promotions a few hours either side of the time you set. A "between" filter with only one date filled in no longer breaks the list with a "Response not successful: Received status code 400" error; it filters by the date that is set.
