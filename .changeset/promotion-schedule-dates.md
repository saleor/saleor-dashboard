---
"saleor-dashboard": patch
---

Promotion schedules no longer save dates the merchant did not enter. Previously, a partly typed hour was saved as midnight, so a promotion could start or end hours early. A cleared end date with "Set end date" still on removed the end date, so the promotion ran with no end. An end at or before the start was sent to the API, or saved when both were the same instant, so the promotion never ran. A year still being typed, such as 0202, was saved as that year. All showed "Promotion updated". Now these show an inline error under the date or hour and nothing is saved. Voucher schedules now block a year still being typed too. The Schedule status no longer changes to Active or Ended while a date or hour is only partly typed.
