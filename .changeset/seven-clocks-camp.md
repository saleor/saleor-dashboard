---
"saleor-dashboard": patch
---

Forced React and ReactDOM to be resolved from project's node_modules. This allows using local linking of other React packages (like app-sdk or MacawUI) which normally break due to 2 React versions installed
