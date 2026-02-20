---
"saleor-dashboard": patch
---

Fix Gift Cards search to use `giftCards.search` query parameter instead of filtering by `code`. This enables searching gift cards by email, user name, and code rather than only by exact code match.
