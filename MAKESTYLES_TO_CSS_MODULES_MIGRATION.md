# makeStyles to CSS Modules Migration Plan

> **Quick Start**: For a concise guide to pick up and continue this migration, see [MIGRATION_QUICK_START.md](./MIGRATION_QUICK_START.md)

## Overview

Migrating 245 files from Material-UI/macaw-ui makeStyles to CSS modules.

**Scope**:

- 178 components with inline makeStyles
- 67 separate styles.ts files

**Strategy**: Small batches (10-15 files), organized by feature module, using CSS variables for theme values.

**Status**: 0/245 files migrated (0%)

---

## Migration Strategy

### CSS Variables - Use Existing Macaw-UI Variables

**Source**: Variables are already defined by `@saleor/macaw-ui-next` and globally available

**Existing Variable Naming Convention**:

```css
/* Spacing - Direct pixel values */
--mu-spacing-0
--mu-spacing-4  (0.5 * 8px)
--mu-spacing-8  (1 * 8px)
--mu-spacing-16 (2 * 8px)
--mu-spacing-24 (3 * 8px)
--mu-spacing-32 (4 * 8px)
/* Available: 0, px, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, etc. */

/* Colors - Macaw UI theme colors */
--mu-colors-background-default1
--mu-colors-background-default2
--mu-colors-background-default3
--mu-colors-text-default1
--mu-colors-text-default2
--mu-colors-border-default1
--mu-colors-border-default2
/* Also: accent1, critical1, critical2, info1, success1, warning1, etc. */

/* Typography */
--mu-fontSize-1 through --mu-fontSize-11
--mu-fontWeight-light, --mu-fontWeight-regular, --mu-fontWeight-medium, --mu-fontWeight-bold
--mu-lineHeight-1 through --mu-lineHeight-11
```

**Mapping from Material-UI Theme to Macaw Variables**:

- `theme.spacing(1)` → `var(--mu-spacing-8)` (8px)
- `theme.spacing(2)` → `var(--mu-spacing-16)` (16px)
- `theme.spacing(3)` → `var(--mu-spacing-24)` (24px)
- `theme.spacing(4)` → `var(--mu-spacing-32)` (32px)
- `theme.palette.saleor.main[3]` → `var(--mu-colors-text-default2)` (or appropriate color - TBD per context)
- `theme.breakpoints.up("sm")` → `@media (min-width: 600px)` (hardcoded breakpoint values)

---

## Conversion Patterns

### Pattern A: Inline Styles (111 files)

**Before** (`Component.tsx`):

```typescript
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "flex",
      padding: theme.spacing(1),
      gap: theme.spacing(2),
    },
  }),
  { name: "ComponentName" },
);

const Component = () => {
  const classes = useStyles();
  return <div className={classes.root}>Content</div>;
};
```

**After** (`Component.tsx` + `Component.module.css`):

`Component.tsx`:

```typescript
import styles from "./Component.module.css";

const Component = () => {
  return <div className={styles.root}>Content</div>;
};
```

`Component.module.css`:

```css
.root {
  display: flex;
  padding: var(--mu-spacing-8);
  gap: var(--mu-spacing-16);
}
```

**Steps**:

1. Create `Component.module.css` next to component file
2. Copy styles from makeStyles object to CSS file
3. Convert JSS syntax to CSS syntax
4. Replace `theme.spacing()` with CSS variables
5. Replace `theme.palette` with CSS variables
6. Update component: remove makeStyles import, add CSS module import
7. Replace `classes.styleName` with `styles.styleName`
8. Remove makeStyles declaration

---

### Pattern B: Separate Styles Files (67 files)

**Before** (`styles.ts` + `Component.tsx`):

`styles.ts`:

```typescript
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    root: {
      display: "flex",
      gap: theme.spacing(1),
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "ComponentName" },
);
```

`Component.tsx`:

```typescript
import { useStyles } from "./styles";

const Component = () => {
  const classes = useStyles();
  return <div className={classes.root}>Content</div>;
};
```

**After** (`Component.module.css` + `Component.tsx`):

`Component.module.css`:

```css
.root {
  display: flex;
  gap: var(--mu-spacing-8);
  color: var(--mu-colors-text-default2);
}
```

`Component.tsx`:

```typescript
import styles from "./Component.module.css";

const Component = () => {
  return <div className={styles.root}>Content</div>;
};
```

**Steps**:

1. Create `Component.module.css` next to component file
2. Copy styles from styles.ts to CSS file
3. Convert JSS syntax to CSS syntax
4. Convert theme values to CSS variables
5. Update component: remove styles.ts import, add CSS module import
6. Replace `classes.styleName` with `styles.styleName`
7. Delete `styles.ts` file

---

## JSS to CSS Syntax Conversion

### Nested Selectors

**JSS**:

```javascript
{
  root: {
    "& > div": {
      margin: "8px",
    },
    "& > svg": {
      marginLeft: "8px",
    },
  }
}
```

**CSS**:

```css
.root > div {
  margin: 8px;
}

.root > svg {
  margin-left: 8px;
}
```

### Pseudo-selectors

**JSS**:

```javascript
{
  hideSpinboxes: {
    "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
      appearance: "none",
      margin: 0,
    },
  }
}
```

**CSS**:

```css
.hideSpinboxes input::-webkit-outer-spin-button,
.hideSpinboxes input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
```

### Increased Specificity (`&&`)

**JSS**:

```javascript
{
  button: {
    "&&": {
      color: "red",
    }
  }
}
```

**CSS**:

```css
.button.button {
  color: red;
}
```

### Responsive Styles

**JSS**:

```javascript
{
  root: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
    }
  }
}
```

**CSS**:

```css
@media (max-width: 600px) {
  .root {
    display: none;
  }
}

@media (min-width: 960px) {
  .root {
    display: flex;
  }
}
```

**Breakpoint Values** (from themeOverrides.ts):

- xs: 0px
- sm: 600px
- md: 960px (note: custom value, not 1280px)
- lg: 1680px (note: custom value, not 1280px)
- xl: 1920px

---

## Edge Cases & Solutions

### 1. Multiple useStyles in One Component

**Solution**: Merge into single CSS module with multiple class names.

### 2. Dynamic Styles (Based on Props)

**Solution**: Keep inline styles for truly dynamic values, use CSS modules for static styles.

Example:

```typescript
<div
  className={styles.root}
  style={{ backgroundColor: dynamicColor }}
>
```

### 3. Conditional Classes

**Before**:

```typescript
className={clsx(classes.root, condition && classes.active)}
```

**After**:

```typescript
className={clsx(styles.root, condition && styles.active)}
```

### 4. Class Concatenation with Component Props

**Solution**: Use `clsx` to combine CSS module classes with external classes:

```typescript
<Component className={clsx(styles.wrapper, props.className)} />
```

---

## Batch Plan by Feature Module

### Batch 1: Shared Components (Start Here - Most Reusable)

**Files**: ~14 files in `/src/components/`

- Start with simple components (no theme usage)
- These are used everywhere, so good early test

### Batch 2: Customers

**Files**: ~1-2 files in `/src/customers/`

- Smallest module, quick win

### Batch 3: Shipping

**Files**: ~4 files in `/src/shipping/`

- Small module, medium complexity

### Batch 4: Gift Cards

**Files**: ~4 files in `/src/giftCards/`

- Small module, isolated feature

### Batch 5: Channels

**Files**: ~3 files in `/src/channels/`

- Small module

### Batch 6: Taxes

**Files**: ~8 files in `/src/taxes/`

- Medium module

### Batch 7: Extensions

**Files**: ~6 files in `/src/extensions/`

- Medium module

### Batch 8: Discounts Part 1

**Files**: ~8 files (first batch) in `/src/discounts/`

### Batch 9: Discounts Part 2

**Files**: ~remaining files in `/src/discounts/`

### Batch 10-15: Orders

**Files**: ~15 files in `/src/orders/` (split into 2-3 batches)

- Largest module, split into multiple batches

### Batch 16+: Remaining Modules

Continue with other modules with scattered usage

---

## Testing Checklist (Per Batch)

**Before Migration**:

- [ ] Feature works correctly
- [ ] Visual regression baseline (screenshot)

**After Migration**:

- [ ] Run `pnpm run lint` - auto-fix formatting
- [ ] Run `pnpm run check-types` - ensure type safety
- [ ] Run `pnpm run knip` - check for unused imports
- [ ] Visual comparison - does it look the same?
- [ ] Test feature functionality manually
- [ ] Check responsive behavior (if applicable)
- [ ] Check dark mode (if applicable)

---

## Progress Tracking

### Status Legend

- ⏳ **Not Started** - Not yet migrated
- 🚧 **In Progress** - Currently being worked on
- ✅ **Completed** - Migrated and tested
- ⚠️ **Blocked** - Issue preventing migration

---

## Completed Batches

### ✅ Batch 0: Setup (No Action Needed!)

- [x] CSS variables already exist from `@saleor/macaw-ui-next`
- [x] Variables are globally available via theme provider
- [x] All `--mu-*` prefixed variables ready to use
- [ ] **TODO**: Document color mapping from `theme.palette.saleor.main[X]` to appropriate `--mu-colors-*` variables
  - Will be determined contextually during migration based on usage (text color vs background vs border)

---

## Batch 1: Shared Components ⏳

**Target**: `/src/components/` (10-15 files)

### Files to Migrate:

1. ⏳ `/src/components/Pill/Pill.tsx` (inline)
2. ⏳ `/src/components/Filter/FilterKeyValueField.tsx` (inline)
3. ⏳ `/src/components/AppLayout/` (separate styles.ts)
4. ⏳ [Add more after exploration]

**Notes**: Start with simplest components first.

---

## Batch 2: Customers ⏳

**Target**: `/src/customers/` (1-2 files)

### Files to Migrate:

1. ⏳ [To be determined after Batch 1]

---

## Batch 3: Shipping ⏳

**Target**: `/src/shipping/` (~4 files)

### Files to Migrate:

1. ⏳ [To be determined]

---

## Batch 4: Gift Cards ⏳

**Target**: `/src/giftCards/` (~4 files)

### Files to Migrate:

1. ⏳ [To be determined]

---

## Batch 5: Channels ⏳

**Target**: `/src/channels/` (~3 files)

### Files to Migrate:

1. ⏳ [To be determined]

---

## Batch 6: Taxes ⏳

**Target**: `/src/taxes/` (~8 files)

### Files to Migrate:

1. ⏳ `/src/taxes/components/TaxInput/` (separate styles.ts)
   - Has pseudo-selectors for hiding spinboxes
   - Uses inputPadding class
2. ⏳ [More files TBD]

---

## Batch 7: Extensions ⏳

**Target**: `/src/extensions/` (~6 files)

### Files to Migrate:

1. ⏳ [To be determined]

---

## Batch 8-9: Discounts ⏳

**Target**: `/src/discounts/` (~8 files, split into batches)

### Files to Migrate:

1. ⏳ [To be determined]

---

## Batch 10-15: Orders ⏳

**Target**: `/src/orders/` (~15 files, split across batches)

### Files to Migrate:

1. ⏳ `/src/orders/components/OrderPaymentSummaryCard/` (separate styles.ts)
   - Uses theme.spacing extensively
   - Uses theme.palette.saleor.main for colors
   - Complex layout with flexbox and grid
2. ⏳ [More files TBD]

---

## Batch 16+: Remaining Modules ⏳

**Target**: Other modules with scattered usage

### Files to Migrate:

1. ⏳ [To be determined based on remaining files]

---

## Notes & Learnings

### Common Issues

[To be filled in during migration]

### Patterns That Worked Well

[To be filled in during migration]

### Things to Avoid

[To be filled in during migration]

---

## Quick Reference

### Import Changes

**Remove**:

```typescript
import { makeStyles } from "@saleor/macaw-ui";
import { makeStyles } from "@material-ui/core";
```

**Add**:

```typescript
import styles from "./ComponentName.module.css";
```

### Usage Changes

**Before**: `const classes = useStyles();`
**After**: (remove this line)

**Before**: `className={classes.root}`
**After**: `className={styles.root}`

### Theme Value Conversions

**Spacing** (Material-UI 8px grid):

- `theme.spacing(0.5)` → `var(--mu-spacing-4)`
- `theme.spacing(1)` → `var(--mu-spacing-8)`
- `theme.spacing(1.5)` → `var(--mu-spacing-12)`
- `theme.spacing(2)` → `var(--mu-spacing-16)`
- `theme.spacing(3)` → `var(--mu-spacing-24)`
- `theme.spacing(4)` → `var(--mu-spacing-32)`

**Colors** (contextual - check usage):

- Background: `var(--mu-colors-background-default1)`, `default2`, `default3`
- Text: `var(--mu-colors-text-default1)`, `default2`
- Border: `var(--mu-colors-border-default1)`, `default2`
- Accent: `var(--mu-colors-background-accent1)`, `var(--mu-colors-text-accent1)`
- Critical: `var(--mu-colors-background-critical1)`, `var(--mu-colors-text-critical1)`

**Examples from existing CSS modules**:

- See `/src/components/Timeline/TimelineNoteEdit.module.css`
- See `/src/orders/components/OrderTransaction/components/TransactionEvents/components/PspReference.module.css`

---

## Commands to Run After Each Batch

```bash
# Format and fix linting issues
pnpm run lint

# Check TypeScript types
pnpm run check-types

# Check for unused code
pnpm run knip

# Run tests (if applicable)
pnpm run test:quiet <path/to/test>

# Start dev server to test visually
pnpm run dev
```

---

## Current Session: Batch [NUMBER]

**Status**: [Not Started/In Progress/Completed]

**Files in this batch**:

- [ ] File 1
- [ ] File 2
- [ ] File 3

**Notes**:
[Session-specific notes here]

---

Last Updated: 2025-12-16
Total Progress: 0/245 files (0%)
