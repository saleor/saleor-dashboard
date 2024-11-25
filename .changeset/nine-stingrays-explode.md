---
"saleor-dashboard": patch
---

Refactored tests by replacing direct banner visibility checks with `expectSuccessBanner()`.  
Removed unnecessary `waitForNetworkIdleAfterAction` wrappers.  
Simplified test scope for `staffMembers` and removed explicit timeouts where appropriate.
