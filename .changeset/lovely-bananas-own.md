---
"saleor-dashboard": patch
---

Fix combobox components in Attribute selection. "Add new value" option was added again for clear UX. New values are added when clicked "Save" in the form, like previously. Fixed fetching more items in the combobox: now when user enters a value in the input, we fetch options using input from user as `query` parameter.
