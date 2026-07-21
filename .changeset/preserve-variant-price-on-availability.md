---
"saleor-dashboard": patch
---

Fixed product variant channel price being reset to 0 when availability was turned off and back on before saving. The original price is now kept when re-enabling availability in the same edit session.
