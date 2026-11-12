---
"saleor-dashboard": patch
---

A failed promotion save no longer removes the end date. Turning off "Set end date" and moving the start past the old end saves in two steps. Previously, when the second step failed, for example because the name was over 255 characters or the connection dropped, the end date was already gone. A promotion that had ended went live again with no end, and the page reloaded that state and discarded the new start date and name. Now the end date is put back, and the page keeps the changes with the error shown, so the merchant can fix it and save again. If the end date cannot be put back, an error says the promotion now has no end date.
