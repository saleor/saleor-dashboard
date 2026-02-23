---
name: saleor-dashboard-styles
description: Styling guide for Saleor Dashboard React components using macaw-ui design system. Use when creating, refactoring, or modifying React components that need styling - especially layout, spacing, colors, borders, or any visual changes. Triggers on component creation, UI refactors, and style-related tasks.
---

# Saleor Dashboard Styling

Two strategies for styling components. Choose based on complexity.

## Strategy 1: Box Inline Props (Simple Styles)

Use `<Box>` from `@saleor/macaw-ui-next` when you need a few CSS properties (layout, spacing, colors).

```tsx
import { Box, Text } from "@saleor/macaw-ui-next";

<Box display="flex" gap={2} alignItems="center" padding={4} backgroundColor="default1">
  <Text color="default2" size={2}>
    Label
  </Text>
</Box>;
```

Box supports sprinkle props for: `display`, `flexDirection`, `alignItems`, `justifyContent`, `gap`, `padding*`, `margin*`, `width`, `height`, `borderRadius`, `backgroundColor`, `position`, `cursor`, `opacity`, `flexGrow`, `flexShrink`, `flexWrap`, `gridTemplateColumns`, `gridColumn`, `order`.

All spacing/sizing props accept token numbers: `0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52`

Responsive values: `display={{ mobile: "none", tablet: "flex", desktop: "grid" }}`

Escape hatch for arbitrary CSS values via `__` prefix:

```tsx
<Box __width="25%" __transition="background-color 0.2s ease" __minWidth="200px" />
```

Hover/state-dependent values:

```tsx
<Box backgroundColor={{ default: "transparent", hover: "default2" }} />
```

### When Box Props Are Enough

- Flex/grid layouts with spacing
- Padding, margin, gap adjustments
- Background and text colors from the design system
- Border radius
- Simple responsive breakpoints

## Strategy 2: CSS Modules (Complex Styles)

Use `.module.css` when you need pseudo-selectors, animations, media queries, complex selectors, or more than ~5 CSS rules.

Create `ComponentName.module.css` next to `ComponentName.tsx`. One CSS file per component. Never share CSS module files across components.

```css
/* SearchInput.module.css */
.input {
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
  color: var(--mu-colors-text-default1);
  min-width: 0;
}

.input::placeholder {
  color: var(--mu-colors-text-default2);
}
```

```tsx
// SearchInput.tsx
import styles from "./SearchInput.module.css";

<input className={styles.input} />;
```

### When to Use CSS Modules

- Pseudo-selectors: `::placeholder`, `:hover`, `:focus`, `[data-state="open"]`
- Animations/transitions: `@keyframes`, complex `transition`
- Media queries: `@media (min-width: 960px)`
- Nested/compound selectors: `.row:hover .icon`
- More than ~5 CSS rules for a single element

### CSS Module Patterns

Hover reveal:

```css
.row .icon {
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
}
.row:hover .icon {
  opacity: 1;
}
```

Collapsible rotation:

```css
.chevron {
  transition: transform 0.2s ease;
  transform: rotate(-90deg);
}
button[data-state="open"] .chevron {
  transform: rotate(0deg);
}
```

Responsive layout:

```css
.sidebar {
  display: none;
}
@media (min-width: 1200px) {
  .sidebar {
    display: block;
  }
}
```

## Design Tokens

Always use macaw CSS variables instead of hardcoded values (especially colors, spacing, borders).

### In CSS Modules

Use `var(--mu-*)` variables. Read the full list from: `node_modules/@saleor/macaw-ui/dist/style.css`

Common patterns:

```css
color: var(--mu-colors-text-default1);
background-color: var(--mu-colors-background-default2);
border: 1px solid var(--mu-colors-border-default1);
```

### In TypeScript

Import `vars` from `@saleor/macaw-ui-next` for JS-accessible tokens:

```tsx
import { vars } from "@saleor/macaw-ui-next";

vars.spacing[2]; // spacing token
vars.colors.border.default1; // border color
vars.colors.text.default2; // text color
```

Full TypeScript token structure: `node_modules/@saleor/macaw-ui/dist/theme/contract.css.d.ts`

## Anti-patterns

- **No inline `style={{}}`** - Use Box props or CSS Modules instead
- **No plain `.css` files** for components - Use `.module.css` to scope styles
- **No hardcoded colors** - Use `var(--mu-colors-*)` or Box color props
- **No shared CSS modules** - Each component gets its own `.module.css` file
- **Combining Box + CSS Modules is OK** - Use Box for layout, CSS Module for complex styling within the same component
