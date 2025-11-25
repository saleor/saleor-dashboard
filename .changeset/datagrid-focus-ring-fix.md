---
"saleor-dashboard": patch
---

Remove focus border from datagrid cells while preserving header click highlight

Previously, clicking on datagrid cells displayed a visible focus border around the cell. The border has been removed by setting `drawFocusRing={false}` on the DataEditor component, while maintaining the header selection color functionality.
