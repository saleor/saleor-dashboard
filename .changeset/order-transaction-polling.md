---
"saleor-dashboard": patch
---

Order details now updates automatically while an async transaction action (charge, refund or cancel requested through a payment app) is being processed. Previously you had to refresh the page to see whether the action succeeded or failed. A spinner next to the Transactions header indicates that an action is still in progress, and the amounts and events update on their own once the payment app responds.
