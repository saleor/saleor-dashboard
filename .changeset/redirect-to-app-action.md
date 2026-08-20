---
"saleor-dashboard": patch
---

Support the App Bridge `redirectToApp` action. Apps can now redirect to another installed app by its manifest identifier - the Dashboard resolves the identifier to the installed app, builds its URL, appends the optional `path` and navigates in the same tab, like the `redirect` action does.
