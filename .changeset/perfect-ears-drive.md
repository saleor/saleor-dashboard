---
"saleor-dashboard": patch
---

Previously we allowed user to select either flat rates or any tax app. To avoid problems if there are more tax apps installed this change adds ability to select tax app that will be used to calculated taxes per channel. User can also select tax app for country exception while configuring taxes. Related [RFC](https://github.com/saleor/saleor/issues/12942)
