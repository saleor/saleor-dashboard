---
"saleor-dashboard": patch
---

Redesign order details payments and transactions section

Introduced new `OrderSummary` component that consolidates order value and payments information into a unified, two-column layout. The new design provides:

- **Order Value column**: Displays subtotal, shipping, taxes, discounts, and gift cards with clear itemization
- **Payments Summary column**: Shows payment status, authorized/captured/refunded amounts, and transaction state
- **Improved visual hierarchy**: Card-based layout with clear separation between order value and payment status
- **Better payment flow handling**: Distinct UI for legacy payments API vs. transactions API
- **Enhanced transaction display**: Consolidated view of all payment transactions with status pills

This redesign improves clarity when reviewing order financial information and payment states.
