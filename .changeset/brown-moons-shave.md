---
"saleor-dashboard": patch
---

The customers list now offers "Company name" and "External reference" columns in the column picker. Company name comes from the customer's default billing address. Both columns are hidden by default — enable them from the column picker to have them persist in your list settings.

Column headers that the API cannot order by no longer respond to clicks or show a sort arrow. Previously, clicking such a header (for example "Content type" on the models list) wrote a sort into the URL and drew a sort direction arrow while the rows stayed in their original order.
