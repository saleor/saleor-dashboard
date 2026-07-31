---
"saleor-dashboard": patch
---

Extension pages now show who set things up. The extension management page has an "Installed by" section, the token list on custom extension pages has a "Created" column with the date and the staff member who created each token, and pending installations in the extensions list show who requested them. This data requires Saleor 3.23 and the `MANAGE_STAFF` permission; it is not shown for records created before Saleor started tracking it.
