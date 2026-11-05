---
"saleor-dashboard": patch
---

Switching a saved free shipping voucher to another scope and back to Free shipping no longer leaves "Unsaved changes: General settings" behind. Previously the form recorded a different voucher type than the one the voucher loaded with, so Save stayed on and leaving the page asked about unsaved changes even after saving.
