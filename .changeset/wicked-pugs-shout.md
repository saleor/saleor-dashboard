---
"saleor-dashboard": patch
---

Order list view now uses new `where` API for filtering. This means that additional new filter options were added:

Payment filters:

- `authorizeStatus` - Authorization status (replaces part of old paymentStatus)
- `chargeStatus` - Charge status (replaces part of old paymentStatus)
- `totalGross` - Total gross amount with range support
- `totalNet` - Total net amount with range support
- `transactions.transactionsPaymentType` - Payment type used in transactions
- `transactions.transactionsCardBrand` - Card brand used in transactions

Order content filters:

- `hasInvoices` - Boolean filter for orders with invoices
- `hasFulfillments` - Boolean filter for orders with fulfillments
- `invoices.createdAt` - Invoice creation date with datetime range
- `number` - Order number (exact match or range)
- `linesCount` - Number of order lines (exact or range)
- `checkoutId` - Checkout ID (exact match)
- `voucherCode` - Voucher code used
- `fulfilments.warehouse` - Warehouse from which fulfillment was made

Customer details filters:

- `userEmail` - Customer email (more specific than old customer)
- `billingPhoneNumber` - Billing phone number
- `billingCountry` - Billing country
- `shippingPhoneNumber` - Shipping phone number
- `shippingCountry` - Shipping country

Metadata filters:

- `lines.metadata` - Order lines metadata
- `transactions.metadata` - Transactions metadata
- `fulfillments.metadata` - Fulfillments metadata

Modified Filters:

- `giftCard` was split into:
  - `isGiftCardBought` - Boolean for gift card purchases inside order
  - `isGiftCardUsed` - Boolean for gift card usage
- `status` - Now "Order Status" (previously named "Fulfillment Status"), has options for order statuses (e.g. Cancelled, Draft, etc.)
- `fulfilments.status` (previously `fulfillmentStatus`) - Separate fulfillment status filter (e.g. Fulfilled, Partially Fulfilled, Refunded, etc.)

Due to migration to `where` API, following filters were removed:

- `preorder` - Preorder filter completely removed
- `paymentStatus` - Replaced by more specific payment status filters

