---
name: saleor-dashboard-styles
description: Styling guide for Saleor Dashboard React components using macaw-ui design system. Use when creating, refactoring, or modifying React components that need styling - especially layout, spacing, colors, borders, or any visual changes. Triggers on component creation, UI refactors, and style-related tasks.
---

# Saleor Dashboard Styling

Two strategies for styling components. Choose based on complexity.

**Entity detail vs Configuration:** Entity detail chrome and in-page settings use the **`Detail*`** family (`DetailSettingsCard`, `DetailSectionNav`, …). Configuration hubs use **`Settings*`** in `src/components/Settings/`. Do not mix. See [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md) for page anatomy, card vs section criteria, primary/secondary headers, channel availability tiers, and Vercel-aligned restraint rules.

**Elevation:** Use shadows sparingly. When a surface truly floats (modal, popover, menu, setup checklist), follow [`saleor-dashboard-smooth-shadow`](./saleor-dashboard-smooth-shadow/SKILL.md) — never `border` + `box-shadow` on the same elevated node.

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

## Foldable sections (`DetailGroupBox`)

For expandable/collapsible sections on detail and create pages, use **`DetailGroupBox`** — not the legacy `@dashboard/components/Accordion` wrapper and not a one-off Macaw `Accordion` with custom chrome.

**Component:** [`src/components/DetailGroupBox/DetailGroupBox.tsx`](../../src/components/DetailGroupBox/DetailGroupBox.tsx)

**Reference usages:**

- Shipping zone rates: `src/shipping/components/ShippingZoneRates/ShippingZoneRateItem.tsx`
- Shipping postal codes: `src/shipping/components/ShippingZonePostalCodes/ShippingZonePostalCodes.tsx`
- Countries list, metadata editors, translation groups

```tsx
import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { Box } from "@saleor/macaw-ui-next";

<DetailGroupBox
  groupId="unique-section-id"
  dataTestId="my-section"
  triggerButtonTestId="my-section-expand"
  defaultExpanded={false}
  marginTop={4}
  headerStart={<Title2>{title}</Title2>}
  headerEnd={optionalMetaOrActions}
>
  <Box padding={5}>{/* section body */}</Box>
</DetailGroupBox>;
```

### Rules

- **Header title:** prefer `Title2` for the foldable label (same as shipping rates)
- **`groupId`:** stable unique string (or entity id when listing many foldables)
- **`defaultExpanded`:** `false` for optional/advanced content; `true` only when the section is primary
- **Do not full-bleed:** nest `DetailGroupBox` inside `DashboardCard.Content` (or another padded container). Shipping zone rates/postal codes do this — a bare `DetailGroupBox` as a page sibling of cards spans the content column edge-to-edge and looks wrong
- **Body padding:** content area has no built-in padding — wrap children in `<Box padding={5}>` (or match the surrounding list/table pattern)
- **Actions in the header:** put icon buttons in `headerEnd` and call `event.stopPropagation()` so they don’t toggle expand/collapse
- **Do not** use `@dashboard/components/Accordion` for new UI — that is the older bordered accordion pattern

### When to use what

| Need                                                                        | Use                                                                      |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Foldable section inside a card (advanced settings, rate row, postal ranges) | `DetailGroupBox` inside `DashboardCard.Content`                          |
| Full always-visible settings block on **entity detail**                     | `DetailSettingsCard` (+ `DetailSetting*` rows) — see entity-detail skill |
| Full always-visible block on **Configuration hub**                          | `SettingsSection` + `SettingsToggleRow`                                  |
| Shipping-style card with subtitle hints                                     | `DashboardCard` + `DashboardCard.Subtitle`                               |
| Nested disclose inside an already-padded surface                            | `DetailGroupBox` with `marginTop={0}` when it is the only content        |

## Typography & semantics (shared)

- Prefer macaw `Text` tokens (`size`, `fontWeight`, `color`) over browser defaults or ad-hoc CSS `font-size`.
- **Section card titles** on entity detail: always `Text size={5} fontWeight="bold" as="h2"` — owned by `DetailSettingsCard` (and matching secondary cards). Pass title _content_ only.
- **Foldable nested rows:** `Title2` inside `DetailGroupBox` — do not invent a third heading style.
- **Column / table headers** (datagrid, list headers) stay secondary (`size={2}`–`3`, regular/medium) — they are not section titles.
- One visual system for the same role across collections, categories, channels, shipping — if a title looks “off”, fix the shared primitive, not a one-off page style.

## Interactive affordances (hover / focus)

Every clickable control must show a hover (and focus-visible) state. Prefer one of:

| Pattern                   | When                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Underline on hover**    | Text links, channel name links, product name rows, microcopy links                               |
| **Color change on hover** | Icon buttons, chips, rows that don’t read as links (`default2` → `default1`, or background tint) |
| **Both**                  | Dense ops lists where underline alone is easy to miss                                            |

Do **not** ship interactive elements that only change the cursor. Focus-visible outlines stay required for keyboard users (`outline` / macaw focus rings).

### Links in UI components — prefer normal text color

Inside cards, sidebars, provenance, tooltips, and other product UI chrome, prefer **normal text colors** over accent blue:

| Use                                                | Color                                                        | Hover                                                     |
| -------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| In-component navigation (`Link color="secondary"`) | `default1`                                                   | Underline (built into `Link` when not already underlined) |
| Hint / subtitle embeds                             | `MicrocopyLink` → `inherit`                                  | Underline                                                 |
| Read-only / clickable channel                      | `ChannelDisplay` / `ChannelDetailsLink` / `ClickableChannel` | Underline on name (or color on `ClickableChannel`)        |
| Marketing / rare emphasis                          | `Link` default `primary` (`accent1`)                         | Underline                                                 |

```tsx
// ✅ Preferred in entity detail / sidebar chrome
<Link href={orderUrl} color="secondary">
  <Text size={3} as="span">#{orderNumber}</Text>
</Link>

// ✅ Channel with globe icon
<ChannelDetailsLink channel={channel} size={3} color="default1" fontWeight="regular" />

// ❌ Avoid for body/meta links in cards
<Link href={orderUrl}>#{orderNumber}</Link> // accent blue
```

**Channel display primitives** live in `src/components/Channel/Channel.tsx`:

- `ChannelDisplay` — read-only name + globe icon (optional inactive suffix)
- `ChannelDetailsLink` — same chrome, links to channel details
- `ClickableChannel` — same chrome, links to orders filtered by channel (permission-gated)

Do not hand-roll `Globe` + blue `Link` for channel names.

## Entity detail settings card (`DetailSettingsCard`)

Primary bordered settings surface on entity detail pages. Full rules (primary vs secondary header, card vs section, Vercel restraint) live in [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md).

| Piece              | Style                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Card shell         | `DetailSettingsCard.module.css` — `default1` body, 8px radius, 1px border                        |
| Primary header     | Tinted `default2` band; `align-items: center`; title left, `headerEnd` right                     |
| Title              | Always `Text size={5} fontWeight="bold" as="h2"` — string **and** ReactNode titles               |
| Header with action | `.headerWithEnd` — same Y padding as title-only; `size="small"` actions; right inset `spacing-4` |
| Leading copy       | `intro` prop — white band + bottom border below header (not under title in tinted band)          |
| Optional in title  | `DetailSettingsCardTitle optional` + `DetailSettingsOptionalLabel` (`size={2}`, `default2`)      |
| Body               | `.content` padding `5/6`; `contentFlush` for lists and upload zones                              |

Secondary sidebar ops cards (`AssignListCard`, `ChannelInventoryCard`) use **white** headers with meta on the right — not `DetailSettingsCard`.

## Anti-patterns

- **No inline `style={{}}`** - Use Box props or CSS Modules instead
- **No plain `.css` files** for components - Use `.module.css` to scope styles
- **No hardcoded colors** - Use `var(--mu-colors-*)` or Box color props
- **No shared CSS modules** - Each component gets its own `.module.css` file
- **Combining Box + CSS Modules is OK** - Use Box for layout, CSS Module for complex styling within the same component
- **No legacy `@dashboard/components/Accordion` for new foldable sections** - Use `DetailGroupBox` (see above)
- **No `border` + `box-shadow` on elevated surfaces** - See [`saleor-dashboard-smooth-shadow`](./saleor-dashboard-smooth-shadow/SKILL.md)
- **No bare browser heading styles for card titles** - Do not style only string `title`s; the primitive must style all title nodes
