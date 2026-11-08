---
"saleor-dashboard": patch
---

Opening a page you hadn't visited yet while offline, or while Saleor can't be reached, no longer shows the "unexpected error" page. "Couldn't open this page" now appears below the connection banner, and the page opens by itself once the connection is back. Choosing another page from the menu shows that page instead of keeping the message. If the connection works but the page still can't be opened, for example right after a new dashboard version is deployed, a Reload page button opens it.
