---
"saleor-dashboard": patch
---

Customer lists can now be filtered by customer attributes.

Open **Customers**, then **Conditions**, and choose **Attribute**. The list uses Saleor 3.23 `customers(where: { attributes })`, so dropdown, boolean, numeric, date, and reference attributes all apply on the server.
