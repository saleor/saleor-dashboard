---
"saleor-dashboard": patch
---

Requests that fail because Saleor can't be reached no longer show raw error text such as "Failed to fetch" or "Unexpected token '<' … is not valid JSON". While the connection banner is shown, a page that couldn't load gets no separate error toast. On screens without the banner, such as sign-in, it shows "Couldn't load some data. Reload the page to try again." An action that got no answer shows "No answer from Saleor. Check whether the change went through before trying again.", because the change may have reached Saleor even though no answer came back.
