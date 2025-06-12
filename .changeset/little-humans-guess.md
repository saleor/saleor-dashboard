---
"saleor-dashboard": patch
---

Change how dashboard fetches GraphQL schema. After this change GraphQL schema is fetched from Saleor repository instead of Saleor API. If you wants the old behavior use `npm run fetch-local-schema`.
