---
"saleor-dashboard": patch
---

Opening `/taxes` or `/discounts` directly now lands on a real page instead of a blank one.

Both sections route all of their pages under a sub-path (`/taxes/channels`, `/discounts/sales`, …) and had no route for the section root, so a bookmarked or hand-typed section URL matched nothing and rendered an empty page. The roots now redirect to the tab the navigation already points at — taxes to Channels, discounts to Promotions.
