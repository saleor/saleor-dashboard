---
"saleor-dashboard": patch
---

Voucher detail page: fixed how we calculate minimal requirements state. After this change we won't take selected channel into consideration for checking if requirement is `minimal order value` - instead we will use channel listing `minSpent` amount. Thanks to that UI should now properly display requirement.
