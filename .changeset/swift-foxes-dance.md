---
"saleor-dashboard": patch
---

Make the variant stock UI mode-aware for Saleor 3.23 stock-availability changes:

- Disambiguate the `VariantDetailsChannelsAvailabilityCard` subtitle so admins don't read it as a stock-availability statement. The card counts channel listings, not customer-facing purchasability — the new copy ("Listed in N of M channels") and accompanying JSDoc on `getAvailabilityCountForVariant` / `getAvailabilityCountForProduct` make that explicit.
- Add a small `StockVisibilityHint` footnote beneath the per-warehouse stock table that explains how the active stock-availability mode (direct warehouse-channel link vs. legacy shipping-zone filtering) governs whether a customer in a given channel sees this stock. Mode is fetched via a tiny per-page `StockVisibilityMode` query (Apollo dedupes, no `ShopInfo` fragment bloat).
