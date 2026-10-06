---
"saleor-dashboard": patch
---

Checkout stock reservation in order settings is now toggled with "Enable checkout stock reservation" checkboxes for authenticated and anonymous users. Previously you had to clear the duration input to turn reservation off, which wasn't obvious. Unchecking now saves `0` (reservation disabled) and hides the input; checking shows the input prefilled with a default (400 minutes for authenticated users, 200 for anonymous users).
