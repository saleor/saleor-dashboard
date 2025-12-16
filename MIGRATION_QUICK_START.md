# makeStyles → CSS Modules Migration - Quick Start

> **Full details**: See [MAKESTYLES_TO_CSS_MODULES_MIGRATION.md](./MAKESTYLES_TO_CSS_MODULES_MIGRATION.md)

## Current Status

**Progress**: 0/245 files (0%)

**Next Batch**: Batch 1 - Shared Components (~10-14 files in `/src/components/`)

## Quick Migration Steps

### For Inline Styles

1. **Create CSS module**: `ComponentName.module.css`
2. **Convert styles**: Copy from `makeStyles` → CSS, convert JSS syntax
3. **Update component**:

   ```diff
   - import { makeStyles } from "@saleor/macaw-ui";
   + import styles from "./ComponentName.module.css";

   - const useStyles = makeStyles({ ... });

   - const classes = useStyles();
   - <div className={classes.root}>
   + <div className={styles.root}>
   ```

### For Separate Styles Files

1. **Create CSS module**: `ComponentName.module.css`
2. **Convert styles**: Copy from `styles.ts` → CSS
3. **Update component**: Replace `useStyles` import with CSS module import
4. **Delete**: `styles.ts` file

## Key Conversions

### Spacing (8px grid)

```javascript
theme.spacing(1)   → var(--mu-spacing-8)   // 8px
theme.spacing(2)   → var(--mu-spacing-16)  // 16px
theme.spacing(3)   → var(--mu-spacing-24)  // 24px
theme.spacing(4)   → var(--mu-spacing-32)  // 32px
```

### Colors (contextual)

```javascript
// Background
theme.palette... → var(--mu-colors-background-default1)

// Text
theme.palette... → var(--mu-colors-text-default1)
theme.palette.saleor.main[3] → var(--mu-colors-text-default2)

// Border
theme.palette... → var(--mu-colors-border-default1)
```

### Breakpoints (hardcoded from themeOverrides.ts)

```javascript
[theme.breakpoints.down("sm")] → @media (max-width: 600px)
[theme.breakpoints.up("md")]   → @media (min-width: 960px)
[theme.breakpoints.up("lg")]   → @media (min-width: 1680px)
```

### JSS Syntax

```javascript
// Nested selectors
"& > div" → .root > div

// Pseudo-selectors
"& input::-webkit..." → .class input::-webkit...

// Increased specificity
"&&" → .button.button
```

## Testing Commands

```bash
pnpm run lint           # Auto-fix formatting
pnpm run check-types    # Type checking
pnpm run knip           # Check unused imports
pnpm run dev            # Visual testing
```

## Batch Order

1. ✅ **Batch 0**: Setup (No action - CSS vars already exist!)
2. ⏳ **Batch 1**: Shared Components (~14 files in `/src/components/`)
3. ⏳ **Batch 2**: Customers (~1-2 files)
4. ⏳ **Batch 3**: Shipping (~4 files)
5. ⏳ **Batch 4**: Gift Cards (~4 files)
6. ⏳ **Batch 5**: Channels (~3 files)
7. ⏳ **Batch 6**: Taxes (~8 files)
8. ⏳ **Batch 7**: Extensions (~6 files)
9. ⏳ **Batch 8-9**: Discounts (~8 files, 2 batches)
10. ⏳ **Batch 10-15**: Orders (~15 files, 3 batches)
11. ⏳ **Batch 16+**: Remaining modules

## Example Migration

**Before** (`Pill.tsx`):

```typescript
import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles({
  pill: {
    borderRadius: "32px",
    border: "1px solid",
    fontWeight: 500,
    paddingLeft: "2px",
    "& > span": {
      fontWeight: 500,
    },
  },
}, { name: "Pill" });

export const Pill = (props) => {
  const classes = useStyles();
  return <div className={classes.pill}>...</div>;
};
```

**After** (`Pill.tsx` + `Pill.module.css`):

`Pill.tsx`:

```typescript
import styles from "./Pill.module.css";

export const Pill = (props) => {
  return <div className={styles.pill}>...</div>;
};
```

`Pill.module.css`:

```css
.pill {
  border-radius: 32px;
  border: 1px solid;
  font-weight: 500;
  padding-left: 2px;
}

.pill > span {
  font-weight: 500;
}
```

## Workflow

1. Pick a batch from the list
2. Find files with `makeStyles` using: `grep -r "makeStyles" src/[module]/`
3. Convert each file following the patterns above
4. Run testing commands
5. Update progress in `MAKESTYLES_TO_CSS_MODULES_MIGRATION.md`
6. Commit batch changes
7. Move to next batch

## Notes

- CSS variables from `@saleor/macaw-ui-next` are already available globally
- Drop-in replacement - no functional changes
- Visual appearance should be identical after migration
- Use existing CSS modules as reference (see `/src/components/Timeline/*.module.css`)
