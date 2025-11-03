---
"saleor-dashboard": patch
---

Switched to the new AppExtension fields introduced in 3.22 patch (mount -> mountName, target -> targetName, options -> settings). This does not introduce a functional change, but is a part of the larger extension logic overhaul.
