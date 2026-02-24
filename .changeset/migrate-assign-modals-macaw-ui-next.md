---
"saleor-dashboard": minor
---

Migrated all "Assign ..." dialog components from legacy macaw-ui and Material-UI to macaw-ui-next. Replaced MUI tables with Box-based layouts, MUI TextField/Radio/Checkbox with macaw-ui-next equivalents, makeStyles with CSS Modules, and the legacy Form component with react-hook-form in ShippingZoneCountriesAssignDialog. Removed `@ts-strict-ignore` from migrated files. Added Storybook stories for visual comparison.
