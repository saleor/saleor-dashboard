---
"saleor-dashboard": patch
---

Typing a promotion rule reward below 1 no longer drops digits. Previously, the reward field cleared a typed leading zero, so typing `0.05` left `5` in the field. Saving it created a 5% or $5 reward instead of 0.05. Now the field keeps what was typed, and a new rule's reward field starts empty. A reward of 0 now asks for more than 0 instead of saying the reward is required.
