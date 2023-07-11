---
"saleor-dashboard": patch
---

Experimental filters: refactor API hooks.

This PR refactors API hooks used to fetch data. Right now they return the provider which then is used by the filter container to update options coming from API.
