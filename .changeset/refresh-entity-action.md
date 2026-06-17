---
"saleor-dashboard": patch
---

Dashboard now responds to the `refreshEntity` app-bridge action. Apps embedded as widgets or popups on an entity detail page (orders, draft orders, products, gift cards, customers, collections, vouchers, categories, promotions, models, model types and menus) can request the host page to silently refetch its entity in the background, without a full page reload. The action is a fire-and-forget acknowledgement and refreshes whichever entity the page hosting the app is currently showing.
