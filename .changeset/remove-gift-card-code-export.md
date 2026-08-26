---
"saleor-dashboard": patch
---

Removed the gift card code export from the Dashboard: the "Export card codes" menu item on the
gift card list and the export dialog are gone. The feature is deprecated — `exportGiftCards` is
removed from the 3.24 API, and on 3.23 it can still be used directly via the API.

Bulk issuing gift cards no longer opens a follow-up dialog offering to email the codes — the
success notification is now the only confirmation, since exporting was that dialog's only action.
