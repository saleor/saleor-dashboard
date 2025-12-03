# Saleor Dashboard Bundle Size Analysis & Optimization Plan

## Executive Summary

### Critical Finding 🚨

**Minification is DISABLED** in production builds (`minify: false` in vite.config.js:167). This single configuration issue causes the bundle to be **50-70% larger** than necessary.

### Current State

- Build tool: Vite 6.4.1 with SWC compiler
- No bundle analysis tools installed
- Simple vendor/app chunk splitting (all node_modules → single vendor chunk)
- 26 lazy-loaded route sections (✓ excellent code splitting)
- Build output: `build/dashboard/` directory

### Key Issues Identified

1. **Minification disabled** - Immediate 50-70% size impact
2. **Duplicate icon libraries** - Material-UI Icons (67MB) + Lucide React (42MB)
3. **Dual macaw-ui versions** - v0.7.4 (19MB) + v1.4.0 (13MB) both installed
4. **Large GraphQL generated files** - 3.7MB total (includes duplicate staging schemas)
5. **Moment.js in production** - 8MB legacy date library (7 files only)
6. **faker in dependencies** - 16MB test library in production deps
7. **265 namespace imports** - Prevent tree-shaking (`import * as`)

---

## Phase 1: Setup Bundle Analysis Tools

### Install Bundle Analyzer

**Add to package.json devDependencies:**

```bash
pnpm add -D rollup-plugin-visualizer
```

**Modify vite.config.js (line ~101, in plugins array):**

```javascript
import { visualizer } from "rollup-plugin-visualizer";

// In the plugins array, add after other plugins:
if (!isDev) {
  console.log("Enabling service worker...");

  plugins.push(
    visualizer({
      filename: "../build/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap", // or 'sunburst', 'network'
    }),
    sentryVitePlugin({
      authToken: SENTRY_AUTH_TOKEN,
      org: SENTRY_ORG,
      project: SENTRY_PROJECT,
    }),
  );
}
```

**Add npm scripts to package.json:**

```json
{
  "scripts": {
    "build:analyze": "pnpm run build && open build/stats.html",
    "build:stats": "pnpm run build"
  }
}
```

### Create Baseline Measurement

**Run these commands:**

```bash
# Build production bundle
pnpm run build

# Check bundle sizes
ls -lh build/dashboard/*.js
du -sh build/dashboard

# Generate bundle analysis
pnpm run build:analyze
```

**Document these metrics:**

- Total bundle size (MB)
- Main bundle size
- Vendor bundle size
- Number of chunks
- Gzipped sizes
- Top 20 largest dependencies

---

## Phase 2: Low-Hanging Fruit Optimizations (Prioritized)

### CRITICAL Priority: Enable Minification ⚡

**Impact:** 50-70% bundle size reduction
**Effort:** 5 minutes
**Risk:** Low

**File:** `vite.config.js:167`

**Change:**

```javascript
// FROM:
build: {
  sourcemap,
  minify: false,  // ❌ DISABLE THIS

// TO:
build: {
  sourcemap,
  minify: 'esbuild',  // ✅ Fast and effective (recommended)
  // OR: minify: 'terser',  // Slower but better compression
```

**Testing:**

1. Run `pnpm run build`
2. Compare bundle sizes before/after
3. Verify app loads correctly in production mode
4. Run `pnpm run preview` to test locally
5. Check that source maps still work for debugging

**Expected Savings:** 2-4MB → 800KB-1.5MB (typical 50-70% reduction)

---

### HIGH Priority #1: Consolidate Icon Libraries 🎨

**Impact:** 20-50KB bundle savings
**Effort:** 2-4 hours
**Risk:** Low

**Problem:** Using both @material-ui/icons (67MB source) and lucide-react (42MB source)

**Current Usage:**

- Material-UI icons: ~1 import found (StaffMembers icon)
- Lucide React: 26 active imports across codebase

**Files to modify:**

- `src/icons/StaffMembers.tsx` - Only Material-UI icon usage found

**Plan:**

1. Audit remaining Material-UI icon imports: `grep -r "@material-ui/icons" src/`
2. Replace with Lucide React equivalents
3. Remove `@material-ui/icons` from package.json dependencies
4. Run `pnpm install` to clean up
5. Verify icon rendering across the app

**Testing:**

- Visual regression testing for all pages using icons
- Check icon sizes and colors match design system
- Run `pnpm run check-types` to catch missing imports

---

### HIGH Priority #2: Remove faker from Production Dependencies 📦

**Impact:** Exclude 16MB from production bundles
**Effort:** 10 minutes
**Risk:** Very Low

**Problem:** `faker` and `@types/faker` are in `dependencies` instead of `devDependencies`

**File:** `package.json:89`

**Change:**

```json
// Remove from "dependencies":
"@types/faker": "^5.5.9",

// Add to "devDependencies":
"faker": "^5.5.9",
"@types/faker": "^5.5.9"
```

**Commands:**

```bash
pnpm remove faker @types/faker
pnpm add -D faker @types/faker
```

**Verification:**

1. Run `pnpm run build` - faker should NOT be in bundle
2. Run `pnpm run test` - tests should still work
3. Check `build/stats.html` - verify faker is excluded

---

### HIGH Priority #3: Complete macaw-ui Migration 🔄

**Impact:** 50-100KB savings
**Effort:** 4-8 hours (depends on migration status)
**Risk:** Medium

**Problem:** Both macaw-ui versions present

- `@saleor/macaw-ui@0.7.4` (aliased as `@saleor/macaw-ui`)
- `@saleor/macaw-ui@1.4.0` (aliased as `@saleor/macaw-ui-next`)

**Investigation needed:**

1. Search for v0.7.4 imports: `grep -r "@saleor/macaw-ui\"" src/ | grep -v "macaw-ui-next"`
2. Estimate remaining migration scope
3. Create migration checklist

**Plan:**

1. Audit all imports of old macaw-ui
2. Migrate remaining components to macaw-ui-next
3. Update import statements throughout codebase
4. Remove v0.7.4 from package.json
5. Run comprehensive visual testing

**Testing:**

- Full regression test suite
- Visual testing of all UI components
- Check for styling inconsistencies
- Verify theme system still works

---

### MEDIUM Priority #1: Replace moment.js with date-fns 📅

**Impact:** 15-20KB savings
**Effort:** 2-3 hours
**Risk:** Low

**Problem:** moment.js (8MB source) is deprecated and heavy. Only used in 7 files.

**Current usage pattern:**

- Vite config aliases moment to minified version (vite.config.js:207)
- Used via `react-moment` and direct imports
- Includes moment-timezone

**Files to modify:** (search results needed)

```bash
grep -r "moment" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".generated."
```

**Migration steps:**

1. Find all moment usage locations
2. Replace with date-fns equivalents:
   - `moment()` → `new Date()`
   - `moment().format()` → `format(new Date(), 'format')`
   - `moment().add()` → `addDays()`, `addMonths()`, etc.
   - Timezone handling → `date-fns-tz`
3. Install date-fns: `pnpm add date-fns date-fns-tz`
4. Remove moment packages: `pnpm remove moment moment-timezone react-moment`
5. Remove moment alias from vite.config.js:207

**Testing:**

- Check all date formatting across the app
- Verify timezone calculations
- Test relative dates ("2 days ago", etc.)
- Run full test suite

---

### MEDIUM Priority #2: Optimize GraphQL Generated Files 📊

**Impact:** 100-200KB potential savings
**Effort:** 4-6 hours
**Risk:** Medium

**Problem:** 3.7MB of generated GraphQL files with duplication

**Generated files:**

- `types.generated.ts` - 1.2MB (40,700 lines, 1,306 types)
- `hooks.generated.ts` - 913KB (21,432 lines)
- `typePolicies.generated.ts` - 626KB
- `typePoliciesStaging.generated.ts` - 626KB (duplicate!)
- Plus staging versions of types/hooks

**Investigation steps:**

1. Run knip to find unused types: `pnpm run knip --reporter markdown`
2. Analyze codegen configuration in `codegen-main.ts` and `codegen-staging.ts`
3. Check if staging schema is necessary in production

**Optimization approaches:**

1. **Remove unused types** - Configure codegen to skip unused definitions
2. **Consolidate staging schema** - Consider single schema or lazy-loading
3. **Split query files** - Generate hooks per-feature instead of monolithic file
4. **Tree-shake fragments** - Remove unused fragment definitions

**Files to modify:**

- `codegen-main.ts` - Main schema code generation config
- `codegen-staging.ts` - Staging schema config
- GraphQL query/mutation files across features

**Testing:**

- Run `pnpm run generate` to regenerate types
- Run `pnpm run check-types` to verify no type errors
- Test all GraphQL operations across the app
- Check Apollo Client cache behavior

---

### MEDIUM Priority #3: Fix Namespace Imports 🔍

**Impact:** 20-50KB savings
**Effort:** 6-10 hours
**Risk:** Low

**Problem:** 265 instances of `import * as` prevent tree-shaking

**Pattern found:**

```typescript
// Bad (prevents tree-shaking):
import * as Sentry from "@sentry/react";
import * as _ from "lodash";

// Good (enables tree-shaking):
import { captureException, captureMessage } from "@sentry/react";
import { merge, camelCase } from "lodash";
```

**Priority targets** (largest libraries first):

1. @sentry/react - Heavy library with many unused exports
2. lodash/lodash-es - Only import what you need
3. @apollo/client - Large library, selective imports help
4. Internal barrel exports

**Search command:**

```bash
grep -rn "import \* as" src/ --include="*.ts" --include="*.tsx" | wc -l
# Found: 265 instances
```

**Refactoring approach:**

1. Focus on top 20 files with most namespace imports
2. For each file, identify used exports
3. Convert to named imports
4. Run tests to ensure functionality preserved
5. Use ESLint rule to prevent future namespace imports

**Add to .eslintrc:**

```json
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "ImportNamespaceSpecifier",
        "message": "Use named imports instead of namespace imports for better tree-shaking"
      }
    ]
  }
}
```

**Testing:**

- Run full test suite after each batch of changes
- Check bundle size improvements incrementally
- Verify no runtime errors

---

### LOW Priority: Optimize Barrel Exports 🗂️

**Impact:** 50-100KB potential
**Effort:** 10-20 hours
**Risk:** Medium

**Problem:** 575 index.ts files with `export *` can prevent tree-shaking

**Examples found:**

- Large index files (509, 492, 322 lines)
- Deep re-export chains
- Circular dependencies potential

**Investigation:**

```bash
# Find all export * patterns
grep -r "export \* from" src/ --include="*.ts" | wc -l
# Result: 594 instances

# Find largest index files
find src/ -name "index.ts" -o -name "index.tsx" | xargs wc -l | sort -n
```

**Recommendation:**

1. Run knip to identify unused exports: `pnpm run knip --fix --allow-remove-files`
2. Remove dead exports
3. Convert large barrel exports to explicit named exports
4. Use direct imports in consuming code

**This is lower priority** because:

- High effort relative to savings
- May break existing import patterns
- Needs comprehensive testing

---

## Phase 3: Advanced Optimizations (Future Work)

### Improve Chunk Splitting Strategy

**Current:** All node_modules → single vendor chunk
**Better:** Split by feature or update frequency

```javascript
// vite.config.js - manualChunks function
manualChunks: id => {
  if (id.includes("node_modules")) {
    // Split Apollo Client separately
    if (id.includes("@apollo/client")) {
      return "apollo";
    }

    // Split UI libraries
    if (id.includes("@material-ui") || id.includes("@saleor/macaw-ui")) {
      return "ui";
    }

    // Split large data grid
    if (id.includes("@glideapps/glide-data-grid")) {
      return "datagrid";
    }

    // Split rich text editor
    if (id.includes("@editorjs") || id.includes("react-editor-js")) {
      return "editor";
    }

    // Everything else
    return "vendor";
  }
};
```

### Lazy Load Heavy Features

**Target features for code-splitting:**

1. Rich text editor (Editor.js) - 35 files
2. Data grid (@glideapps) - 57 files
3. GraphQL explorer tools - Dev tools only

**Pattern:**

```typescript
// Lazy load editor on demand
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

// Use in component
<Suspense fallback={<Skeleton />}>
  {showEditor && <RichTextEditor />}
</Suspense>
```

### Remove Polyfills for Modern Browsers

**Current:** rollup-plugin-polyfill-node adds Node.js polyfills

**Investigation:** Check if all polyfills are needed for target browsers

---

## Phase 4: Monitoring & Prevention

### Set Bundle Size Budgets

**Add to package.json:**

```json
{
  "scripts": {
    "build:check-size": "pnpm run build && node scripts/check-bundle-size.js"
  }
}
```

**Create script:** `scripts/check-bundle-size.js`

```javascript
// Check that bundle doesn't exceed thresholds
const MAX_BUNDLE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const MAX_VENDOR_SIZE = 800 * 1024; // 800KB
// ... implement size checks
```

### Add CI/CD Checks

**GitHub Actions workflow:**

```yaml
- name: Check bundle size
  run: |
    pnpm run build
    pnpm run build:check-size

- name: Upload bundle analysis
  uses: actions/upload-artifact@v3
  with:
    name: bundle-stats
    path: build/stats.html
```

### ESLint Rules for Tree-Shaking

**Add to .eslintrc:**

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["lodash"],
            "message": "Import from 'lodash-es' with specific functions"
          }
        ]
      }
    ]
  }
}
```

---

## Critical Files Reference

### Must Modify

1. **vite.config.js** - Enable minification, add bundle analyzer
2. **package.json** - Move faker to dev, add scripts, update dependencies

### Should Review

3. **codegen-main.ts** - GraphQL generation config
4. **codegen-staging.ts** - Staging schema config
5. **src/icons/StaffMembers.tsx** - Material-UI icon to replace

### Generated Files (Don't manually edit)

6. `src/graphql/types.generated.ts` - Regenerated by codegen
7. `src/graphql/hooks.generated.ts` - Regenerated by codegen
8. `src/graphql/typePolicies.generated.ts` - Regenerated by codegen

---

## Expected Outcomes

### Immediate Wins (Week 1)

- ✅ Enable minification: **50-70% reduction** (2-4MB → 800KB-1.5MB typical)
- ✅ Setup bundle analysis: **Visibility into size**
- ✅ Move faker to dev: **Exclude 16MB from consideration**

### Short-term (Weeks 2-4)

- ✅ Consolidate icon libraries: **20-50KB**
- ✅ Complete macaw-ui migration: **50-100KB**
- ✅ Replace moment.js: **15-20KB**

### Medium-term (Months 1-3)

- ✅ Optimize GraphQL files: **100-200KB**
- ✅ Fix namespace imports: **20-50KB**
- ✅ Improve chunk splitting: **Better caching**

### Total Estimated Impact

**60-80% total bundle size reduction** (primarily from minification)

**Without minification (current):** ~4-6MB estimated
**With all optimizations:** ~800KB-1.2MB target

---

## Implementation Sequence

### Day 1: Setup & Critical Fix

1. Install rollup-plugin-visualizer
2. Add bundle analysis scripts
3. **Enable minification** ⚡
4. Create baseline measurement
5. Document current vs optimized sizes

### Week 1: Quick Wins

1. Move faker to devDependencies
2. Audit and remove unused dependencies
3. Set up automated size checks

### Week 2-3: Dependency Cleanup

1. Consolidate icon libraries
2. Complete macaw-ui migration
3. Replace moment.js with date-fns

### Month 1-2: Code Optimization

1. Optimize GraphQL generated files
2. Fix namespace imports (top 50 files)
3. Run knip and remove dead code

### Month 2-3: Advanced Optimization

1. Improve chunk splitting
2. Lazy load heavy features
3. Optimize barrel exports
4. Add bundle size monitoring to CI/CD

---

## Testing Strategy

### For Each Change:

1. **Build test:** `pnpm run build` succeeds
2. **Type check:** `pnpm run check-types` passes
3. **Unit tests:** `pnpm run test` passes
4. **Bundle analysis:** Compare before/after in stats.html
5. **Manual testing:** `pnpm run preview` and test affected features

### Regression Testing:

- Test all main user flows (orders, products, customers)
- Verify icons/styling render correctly
- Check date formatting across timezone features
- Test rich text editor functionality
- Verify GraphQL operations work as expected

---

## Success Metrics

### Bundle Size Targets

- **Main bundle:** < 500KB gzipped
- **Vendor bundle:** < 400KB gzipped
- **Total initial load:** < 1.2MB gzipped
- **Largest chunk:** < 300KB gzipped

### Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Total Blocking Time:** < 300ms

### Monitoring

- Track bundle size on every PR
- Alert if bundle grows > 5% without justification
- Monthly dependency audit
- Quarterly architecture review

---

## Next Steps

1. **Review this report** to understand the findings
2. **Run Phase 1** to install bundle analysis tools
3. **Apply CRITICAL fix** - Enable minification (immediate 50-70% win!)
4. **Create baseline measurement** to track improvements
5. **Work through HIGH priority items** for additional gains
6. **Set up monitoring** to prevent future bundle bloat

Ready to proceed with implementation when you are!
