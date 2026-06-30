---
"saleor-dashboard": patch
---

On the order page, a transaction's Capture and Cancel actions are now disabled while a previous capture or cancel request for that transaction is still being processed by the payment app. The button shows a spinner and an "in progress" label, and becomes available again once the action succeeds or fails. Previously you could trigger the same action multiple times before the first one resolved.
