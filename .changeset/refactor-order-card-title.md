---
"saleor-dashboard": patch
---

Refactored OrderCardTitle component for improved maintainability and type safety. Split monolithic component into focused modules (StatusIndicator, WarehouseInfo, TrackingNumberDisplay), eliminated duplicate code, removed @ts-strict-ignore, and implemented discriminated unions for props. Added accessibility improvements with aria-labels for status indicators and copy button.
