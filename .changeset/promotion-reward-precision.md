---
"saleor-dashboard": patch
---

A promotion rule's reward is now checked against what Saleor can store before the rule is saved. A percentage with more than 3 decimal places, or a fixed amount with more decimals than the channel's currency allows (such as 10.999 USD), shows an error under the reward value. Previously 0.0001% was saved as 0% without a warning, and a fixed amount like 10.999 USD was rejected only after the rule dialog had closed.
