---
"saleor-dashboard": patch
---

Added app problems display to the installed extensions list. Each app now shows reported problems with severity badges, timestamps, and dismissal support. The "Open the app" action link is only shown for third-party apps. Requires Saleor 3.22+.

:::warning 
This release *requires* Saleor core [`3.22.36`](https://github.com/saleor/saleor/releases/tag/3.22.36). Used with older version, Extensions page will break
:::
