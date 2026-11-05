---
"saleor-dashboard": patch
---

The voucher setup checklist counts each new code once. Previously, codes added on Create voucher, or added to a saved voucher that had no codes yet, were counted twice, so one code showed as "2 codes ready". Now the checklist shows the number of codes you added.
