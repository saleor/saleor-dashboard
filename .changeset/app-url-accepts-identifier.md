---
"saleor-dashboard": patch
---

Extension URLs now accept an app's manifest identifier in place of its ID, so links can be shared between environments. `/extensions/app/saleor.app.adyen` resolves to the installed app and swaps itself for the ID form (`/extensions/app/QXBwOjE=`), keeping any deep path, query string and hash. Existing ID-based URLs are unchanged. If no installed app matches the identifier, the user lands on Explore Extensions.
