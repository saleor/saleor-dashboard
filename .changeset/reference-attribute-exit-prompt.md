---
"saleor-dashboard": patch
---

**Fix spurious "Leave without saving changes?" prompt when assigning reference attribute values**

Assigning a value to a reference attribute (e.g. choosing a Collection, Category, Product or Model) on a detail page with unsaved changes no longer triggers the "Leave without saving changes?" exit prompt. Opening and closing URL-driven dialogs (such as the "Assign Collection" modal) is now correctly treated as part of editing the form rather than navigating away from it, so the modal closes cleanly and your changes stay ready to save. This also fixes the same prompt appearing for other URL-driven modals (metadata, remove confirmations, etc.) across Models, Products, Orders and similar detail pages.
