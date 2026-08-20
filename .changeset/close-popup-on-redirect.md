---
"saleor-dashboard": patch
---

Close the app extension popup when the app dispatches a `redirect` action to a Dashboard page. Previously the Dashboard navigated behind the popup and the popup stayed open on top of the new page.
