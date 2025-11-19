---
"saleor-dashboard": patch
---

Fix row checkbox visibility in DataGrid by overriding rowMarkerTheme accentColor. Previously, checked row checkboxes had light gray background with white checkmark, making them invisible. Now they use dark text color for background, matching header checkbox appearance.
