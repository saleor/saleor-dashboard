---
"saleor-dashboard": patch
---

When saving metadata worked but reloading it afterwards failed, the metadata dialog now still confirms the save with "Metadata updated" and closes. Before, it stayed open without any message, as if the save had failed.
