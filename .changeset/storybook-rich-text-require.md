---
"saleor-dashboard": patch
---

Storybook stories that show read-only rich text, such as product media translations, failed to load with "require is not defined", which stopped Chromatic from publishing builds. They now load, and the `react-editor-js` package is no longer a dependency.
