---
"saleor-dashboard": patch
---

After saving a structure where moving or deleting some items failed, the item tree now reloads and shows what was actually saved. Before, it went back to how the structure looked before the save, so the moves and deletions that did go through looked undone until the page was reloaded. The error messages for failed changes are unchanged.
