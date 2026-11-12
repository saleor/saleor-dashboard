---
"saleor-dashboard": patch
---

Editing a promotion rule no longer removes its other channels. The rule dialog edits one channel, but a percentage rule created through the API or an app can apply in several. Previously, saving any change to such a rule, even a new name, removed every channel except the first and showed "Rule updated", so the discount stopped in those channels. Now the dialog names the other channels and keeps them on every save. Its channel can't be changed in the dialog, and a fixed amount is blocked before saving when the other channels use another currency.
