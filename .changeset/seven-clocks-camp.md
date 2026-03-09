---
"saleor-dashboard": patch
---

Added Vite aliases so bare `react` and `react-dom` imports resolve from the project's node_modules. This allows using local linking of other React-based packages (like app-sdk or MacawUI) which normally break due to two React versions being installed.
