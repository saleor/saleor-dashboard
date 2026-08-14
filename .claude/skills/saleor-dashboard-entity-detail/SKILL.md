---
name: saleor-dashboard-entity-detail
description: >
  Update design language for daily entity detail views (channels, products, collections,
  shipping zones, warehouses, customers). Use when refactoring or building entity detail
  pages — layout, TopNav, metadata modal, sidebar ops, settings cards, setup checklist,
  staged assigns, Savebar composition, or fields that cannot change after create
  (currency, attribute type). Not for Configuration hubs (Orders/Tax/Site settings).
---

# Entity detail update language

Conventions for **models you work with daily** — edit surfaces under `src/<feature>/` that use `DetailPageLayout`. Canonical reference: **channel details** (`src/channels/pages/ChannelDetailsPage/`).

**Not this skill:** Configuration hubs under Configuration → use `Settings*` in [`src/components/Settings/`](../../src/components/Settings/) (`SettingsSection`, `SettingsHubLayout`). Same row _idea_, different surface — do not put entity detail UI in `src/components/Settings/`.

**Also see:** [`saleor-dashboard-detail-pages`](./saleor-dashboard-detail-pages/SKILL.md) (metadata modal, TopNav wiring), [`saleor-dashboard-styles`](./saleor-dashboard-styles/SKILL.md) (tokens, `DetailGroupBox`), [`saleor-dashboard-microcopy`](./saleor-dashboard-microcopy/SKILL.md) (hint copy), [`saleor-dashboard-feedback`](./saleor-dashboard-feedback/SKILL.md) (toasts vs inline/banner errors), [`saleor-dashboard-loading`](./saleor-dashboard-loading/SKILL.md) (skeletons, page gates, no fake defaults), [`saleor-dashboard-datagrid`](./saleor-dashboard-datagrid/SKILL.md) (product lists on detail pages).

### External reference — [Vercel design resources](https://vercel.com/design)

Vercel splits **product UI** from **editorial/report surfaces**. Saleor Dashboard is product UI (macaw-ui-next), but several hubs are worth bookmarking:

| Hub                     | URL                                                                                           | Borrow for entity detail                                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design (reports)**    | [vercel.com/design](https://vercel.com/design) · [`/design.md`](https://vercel.com/design.md) | Composition discipline: reader’s job first, **don’t card every block**, spacing before borders, one evidence home per claim, squint/text-mask hierarchy tests. Not literal CSS — reports use `vercel-brand.css`, not dashboard chrome. |
| **Geist foundations**   | [vercel.com/geist](https://vercel.com/geist)                                                  | Colors, typography roles, **materials** (radii, strokes), **grid** — analogs to macaw tokens and our 25% nav + content split.                                                                                                          |
| **Geist components**    | `/geist/*` (Card, Entity, Empty State, Fieldset, Separator, Status Dot, …)                    | Pattern names and when-to-use notes; implement with macaw, not `@vercel/geistcn` in this repo.                                                                                                                                         |
| **Agent-readable docs** | Append `.md` to any Geist URL or `Accept: text/markdown`                                      | Fast lookup for agents/skills without scraping HTML.                                                                                                                                                                                   |

Principles that reinforce our entity-detail rules (from Vercel’s report skill and Geist):

- **Earn a surface** — card/border only when selection, grouping, or empty state needs it; else `DetailSection` + gap.
- **No card nesting** — fields and toggle rows live inside one card, not a card per field.
- **Typography before chrome** — hierarchy via size/weight/color before adding tinted bands.
- **Restraint test** — if a border, pill, or extra section can be removed without losing meaning, remove it.

**Do not** port Vercel report layouts (masthead, `vbg-*` primitives, contrast bands) into Dashboard detail pages — different reader and density.

---

## Page anatomy

```
DetailPageLayout
├── TopNav — title (+ status pill/meta when relevant) | Metadata | Translations | Menu
├── Content
│   ├── SetupChecklist (optional — guided setup only when entity has readiness funnel)
│   └── [ DetailSectionNav | sections ] — nav only when 4+ scroll sections
│         Use `DetailPageSectionLayout` (nav rail `25%` / `min 10rem` + main `gap={4}`)
│         1. DetailSettingsCard — general / identity / media
│         2. Primary entity content — products, rates, lists, …
│         3. SEO — last in the main column (default)
├── RightSidebar — operational membership / availability (not empty status cards)
└── Savebar (+ SavebarCompositionHint when Save bundles multiple areas)
```

**Main column order (default):** identity/settings → primary content (lists, products, rates) → **SEO last**.  
**Sidebar** = things you **assign** or toggle per-channel (warehouses, shipping zones, channel visibility). Category children use `CategoryListDatagrid` in the right sidebar (tree expand, selection, bulk delete) — not custom link rows. Status that is not Save-gated lives in the **header**, not a hollow sidebar card.

---

## Two surfaces — naming families

| Surface            | Prefix      | Folder                           | Use for                                     |
| ------------------ | ----------- | -------------------------------- | ------------------------------------------- |
| Configuration hubs | `Settings*` | `src/components/Settings/`       | Orders settings, Site settings, Refunds hub |
| Entity detail      | `Detail*`   | `src/components/Detail*/`        | Channel/product/collection detail chrome    |
| Guided readiness   | `Setup*`    | `src/components/SetupChecklist/` | Checklist on entity detail                  |
| Membership         | `Assign*`   | `src/components/Assign*/`        | Dialogs + sidebar list cards                |
| Save affordances   | `Savebar*`  | `src/components/Savebar/`        | Savebar + composition hint                  |

### `Detail*` components (entity detail)

| Component                    | Status                 | Use when                                                                                                                                                                                                                                                |
| ---------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DetailPageLayout`           | exists                 | All entity details                                                                                                                                                                                                                                      |
| `DetailGroupBox`             | exists                 | Foldable nested blocks (rates, postal codes, metadata editor) — not primary settings cards                                                                                                                                                              |
| `DetailSettingsCard`         | exists                 | Sectioned settings — title + optional `headerEnd` in header band; leading copy in `intro` row                                                                                                                                                           |
| `DetailPageContent`          | exists                 | Single-column main stack (`gap={4}` + `paddingX/Y={6}`) — collections, categories, gift cards **without** section nav                                                                                                                                   |
| `DetailPageSectionLayout`    | exists                 | **Nav rail + main column** — use with `DetailSectionNav` on long detail pages (channels, vouchers). Owns outer padding once; main column is `gap={4}` only. **Do not nest `DetailPageContent` inside.**                                                 |
| `DetailSettingToggleRow`     | exists                 | Boolean setting row (title + description + Toggle); optional nested fields when on                                                                                                                                                                      |
| `FixedAtCreationField`       | exists                 | Immutable create-time identity (currency, attribute type) — disabled Input + lock + helper. Not a disabled Combobox.                                                                                                                                    |
| `DetailSettingRadioGroup`    | **lift from channels** | Strategy radios with recommended/legacy badges                                                                                                                                                                                                          |
| `DetailSectionNav`           | exists                 | 4+ sections on a long detail page                                                                                                                                                                                                                       |
| `SetupChecklist`             | exists                 | Entity has required setup steps (channel) or strong diagnostics (product availability)                                                                                                                                                                  |
| `SetupReviewShortcut`        | **lift from channels** | Single-row jump to tax/catalog/payments                                                                                                                                                                                                                 |
| `AssignListCard`             | exists                 | Sidebar membership list (Delivery / gift-card customer). Empty state uses `flex-wrap`: wide = one row; when icon+copy (~16rem) + action no longer fit, action wraps right-aligned below. Mirror in `ChannelInventoryCard` until it uses this primitive. |
| `ChannelDisplay` / links     | exists                 | Read-only or linked channel name + globe icon (`src/components/Channel/Channel.tsx`)                                                                                                                                                                    |
| `EntityBackgroundImageField` | exists                 | Shared background image upload/preview/alt for collections, categories, …                                                                                                                                                                               |
| `SavebarCompositionHint`     | exists                 | Presentational “Unsaved changes: …” — entity wrappers supply segments                                                                                                                                                                                   |
| `AssignableListCard`         | exists                 | Flush in-card assignable lists (collection/category products, attribute values, product-type attributes, voucher codes). Owns search-band padding and composes table + pagination. **Do not copy CollectionProducts chrome.**                           |
| `AssignableListTable`        | exists                 | Checkbox + hover-reveal row delete GridTable. `density="compact"` (text) or `"media"` (50px thumbnails). Bulk toolbar in the heading, not the card header.                                                                                              |
| `AssignableListPagination`   | exists                 | Compact “No. of rows” + chevrons. Top border baked in. `inset`: `card` (spacing-6) / `nested` (spacing-4) / `drag` (40px grip column).                                                                                                                  |

Until extraction lands during Phase B, keep legacy `DashboardCard` for shipping-style hints — do not use `SettingsSection` on entity detail.

### `DetailPageSectionLayout` + `DetailSectionNav`

Path: `src/components/DetailPageSectionLayout/DetailPageSectionLayout.tsx` · nav primitive: `src/components/DetailSectionNav/`.

**Canonical reference:** `ChannelDetailsPage` (first consumer).

Use when the main column has **4+ scroll targets** and needs a sticky left rail. Constants: `DETAIL_PAGE_SECTION_NAV_WIDTH` (`25%`), `DETAIL_PAGE_SECTION_NAV_MIN_WIDTH` (`10rem`). Nav is hidden on mobile (`display: none` below tablet).

```tsx
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import { ChannelSectionNav } from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionNav";

<DetailPageLayout.Content>
  <DetailPageSectionLayout
    nav={<ChannelSectionNav items={items} activeId={activeId} onSelect={selectSection} />}
  >
    <ChannelSection id={...}>...</ChannelSection>
  </DetailPageSectionLayout>
</DetailPageLayout.Content>
```

| Do                                                                        | Don't                                                                                  |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Render `DetailSection` / `DetailSettingsCard` sections as direct children | Nest `DetailPageContent` inside (doubles horizontal padding and skews the 25/75 split) |
| Reuse `DetailPageSectionLayout` for every new section-nav detail page     | Copy `__width="25%"` / `__minWidth="10rem"` inline in each view                        |
| Feature-specific nav wrappers (`ChannelSectionNav`, `VoucherSectionNav`)  | Put feature labels in the shared layout component                                      |

**Phase B workflow:** improve a pilot view (collections) in slices; extract `Detail*` when the slice needs it; rewire channels in the same PR. See plan: dogfood-driven extraction, not library-first.

### `DetailSettingToggleRow` (boolean settings)

Path: `src/components/DetailSettingToggleRow/DetailSettingToggleRow.tsx`. Storybook: `Components / DetailSettingToggleRow`.

**Canonical references:** Channel Orders (`ChannelOrdersSection` — allow unpaid, expire orders) · Gift card Details expiry.

Use for **on/off settings** inside a primary `DetailSettingsCard` — not for membership assigns (sidebar) and not for free-form fields alone.

| Rule              | Detail                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Parent card**   | Wrap the toggle stack in `DetailSettingsCard` with **`contentFlush`** so row borders go edge-to-edge                                               |
| **Row anatomy**   | Title (`size={3}` medium) + description (`size={2}` default2) on the left; `Toggle` on the right                                                   |
| **Description**   | Explain the consequence of enabling — not a restatement of the title. Links use `MicrocopyLink`                                                    |
| **Nested fields** | When the setting is on and needs inputs, put them in `DetailSettingNestedField` children (dashed top border, indented)                             |
| **Notice**        | Optional `notice` slot for conditional callouts under the title row (channel expire-orders + auto-confirm)                                         |
| **Mixed content** | If the same card has regular fields above toggles (e.g. tags then expiry), pad that block yourself and give it a bottom border; toggles stay flush |
| **Optional**      | Do **not** append `DetailSettingsOptionalLabel` on toggle titles — off state already means “not set”; say so in the description                    |
| **A11y**          | Title/description are a clickable `role="button"`; Toggle is `aria-hidden` / `tabIndex={-1}` so there is one tab stop                              |

```tsx
<DetailSettingsCard title="Details" contentFlush>
  <Box className={styles.paddedFields}>{/* tags, etc. */}</Box>
  <DetailSettingToggleRow
    title={<FormattedMessage {...messages.expiryTitle} />}
    description={<FormattedMessage {...messages.expiryDescription} />}
    pressed={expires}
    onPressedChange={setExpires}
  >
    {expires ? (
      <DetailSettingNestedField>
        <Input type="date" name="expiryDate" value={expiryDate} onChange={onChange} />
      </DetailSettingNestedField>
    ) : null}
  </DetailSettingToggleRow>
</DetailSettingsCard>
```

**Anti-patterns:** Checkbox + separate label instead of this row; toggle inside a nested card; putting toggles in a padded (non-flush) card body so borders look inset/double-padded.

Channel code may still import `ChannelSettingToggleRow` — that file re-exports `DetailSettingToggleRow`. Prefer the `Detail*` import in new code.

### Settings card headers — primary vs secondary

Two header patterns; both use a bordered card surface but different chrome.

|                            | **Primary** (`DetailSettingsCard`)                                 | **Secondary ops** (Inventory, Delivery, `AssignListCard`)                     |
| -------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Where**                  | Main column scroll sections                                        | Sidebar membership / setup ops                                                |
| **Header band**            | Tinted (`default2`)                                                | White (`default1`) — same as body                                             |
| **Header row**             | Title left; **actions** in `headerEnd` (Upload, Manage)            | Title left; **meta** right on same row (`3 assigned`, `Required to sell`)     |
| **Leading copy**           | `intro` row below header — bordered, full-width band               | `intro` below header — padded text, flows into list (list often `border-top`) |
| **Short meta under title** | `subtitle` only when needed (rare); prefer `intro` for longer copy | Meta lives in header **right**, not under title                               |
| **Reference**              | Payment gateways, General info, SEO                                | `ChannelInventoryCard`, `ChannelDeliveryCard`, `AssignListCard`               |

Primary = settings you edit in place. Secondary = assign/remove membership with count in the header.

`headerEnd` on primary cards: the card **coerces** macaw `Button` / `ButtonGroupWithDropdown` to `size="small"` so title-only and title+action headers share height. Right inset matches the Y gap (`spacing-4`). Callers pass the action — do not set `size` on `headerEnd` buttons. Same for `ChannelAvailabilityCard` Manage in the sidebar toolbar (set `small` there until that primitive coerces too).

### `DetailSettingsCard` API (primary settings card)

Path: `src/components/DetailSettingsCard/DetailSettingsCard.tsx`. Storybook: `Components / DetailSettingsCard`.

| Prop / export                 | Use                                                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `title`                       | String, `FormattedMessage`, or `DetailSettingsCardTitle` — card always renders **`Text size={5}` bold `as="h2"`**           |
| `intro`                       | Leading description — **bordered row below header** (Payment gateways pattern). Prefer over `subtitle` for multi-line copy. |
| `subtitle`                    | Short line under title **inside tinted header** — rare (status/count); don’t put long hints here                            |
| `headerEnd`                   | Actions on the right (Upload, Manage, Assign). Card coerces macaw buttons to `size="small"`; right inset `spacing-4`.       |
| `contentFlush`                | Full-bleed body (lists, image upload dropzone)                                                                              |
| `DetailSettingsCardIntro`     | Reusable intro band when stacking multiple intro blocks (catalog warehouse notes)                                           |
| `DetailSettingsOptionalLabel` | Secondary `size={2}` “Optional” — no brackets; use inside `DetailSettingsCardTitle`                                         |

**Title typography is owned by the card.** Pass plain copy / `FormattedMessage` / `DetailSettingsCardTitle` — do **not** wrap the title in your own `Text`/`h2`. `DetailSettingsCardTitle` only adds optional-mark layout.

```tsx
<DetailSettingsCard
  title={<DetailSettingsCardTitle optional>Background image</DetailSettingsCardTitle>}
  headerEnd={<Button variant="secondary">Upload image</Button>}
  intro={
    <Text size={3} color="default2">
      …
    </Text>
  }
>
  {fields}
</DetailSettingsCard>
```

### Fixed-at-creation fields

Values the API will not let you change after create (channel **currency**, attribute **input type**, attribute **entity** on references).

Use **`FixedAtCreationField`** (`src/components/FixedAtCreationField/FixedAtCreationField.tsx`). Canonical look: channel currency on edit.

| Piece   | Rule                                                                                         |
| ------- | -------------------------------------------------------------------------------------------- |
| Control | Disabled macaw **`Input`** — never a disabled `Combobox` / `Select` (chevron looks editable) |
| Value   | Plain text (e.g. `USD`, `Dropdown`) — no type icons, no dropdown chrome                      |
| Lock    | Lucide `Lock` in `endAdornment`, `color="default2"`, `iconSize.small`                        |
| Helper  | **Required.** Pattern: `Fixed at creation. To {goal}, {alternative}.`                        |
| Create  | Keep a real picker; helper can warn it can’t be changed later                                |

```tsx
<FixedAtCreationField
  data-test-id="channel-currency-locked-input"
  label={intl.formatMessage(messages.channelCurrency)}
  name="currencyCode"
  value={data.currencyCode}
  helperText={intl.formatMessage(messages.channelCurrencyHintLocked)}
/>
```

Copy examples:

- Currency: “Fixed at creation. To sell in another currency, create a second channel.”
- Attribute type: “Fixed at creation. To use a different type, create a new attribute.”

Do **not** grey out a Combobox and leave the chevron. That is the mistake this pattern replaces.

### In-card assignable lists (`AssignableList*`)

Path: `src/components/AssignableListTable/`. Canonical references: collection products, attribute values, product-type attributes, voucher codes.

**Do not copy CollectionProducts CSS, header height, search padding, or pagination chrome into a feature.** Compose:

```tsx
<AssignableListCard
  title="…"
  headerEnd={<Button variant="secondary">Assign …</Button>}
  search={<SearchInput … />}           // optional — padding owned by the card
  footer={
    <AssignableListPagination          // top border owned by pagination
      inset="drag"                     // card | nested | drag
      numberOfRows={…}
      onUpdateListSettings={…}
    />
  }
>
  <AssignableListTable density="compact" … />
  {/* MUI drag tables: ResponsiveTable + tableStyles.assignableTable */}
</AssignableListCard>
```

| Piece           | Contract (owned by the primitive)                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card header     | `DetailSettingsCard` tinted band; title `size={5}` bold; `headerEnd` coerced to `small`; with-action right inset `spacing-4`                                          |
| Search band     | Y `spacing-3`, X `spacing-6`, bottom border                                                                                                                           |
| Table heading   | 40px; `Text size={2}`; selected count + bulk action **in the heading**, not the card header                                                                           |
| Drag column     | 40px, grip centered, first-cell padding 0                                                                                                                             |
| Checkbox column | 20px control + leading inset (`card` = 6, `nested` = 4)                                                                                                               |
| Body rows       | `compact` (text) or `media` (50px thumbnails); cell padding `spacing-2`                                                                                               |
| Row delete      | Hover or delete-control `:focus-within` (not the row — checkbox focus would pin the icon); always visible on `hover: none`                                            |
| Pagination      | Top border (the only separator above the footer); last table row has no bottom border; Y `spacing-2`; small select + chevrons; `inset` aligns to first content column |
| Empty           | `padding={4}` + `Placeholder`                                                                                                                                         |

Tokens live in `assignableListTableLayout.ts`. MUI tables that still need dnd-kit (`SortableTable`) use `tableStyles.assignableTable` so heading height and density match GridTable.

**Anti-patterns:** per-view `.listHeader { height: 40px }`; wrapping pagination in a second top-border box; putting bulk delete in `headerEnd`; `size="medium"` assign buttons in the card header; 50px rows on text-only lists; copying `CollectionProducts/Pagination`.

### When to use a card vs open section

Not everything on entity detail needs a card wrapper. Vercel’s [Geist Card](https://vercel.com/geist/card) describes a card as a surface that **groups related content and actions**; community Geist patterns add: **don’t nest cards**, **don’t use cards purely for layout**. Vercel’s marketing layouts lean on **section spacing** rather than boxing every block — applicable to dashboards as “don’t card by default.”

**Use a bordered card** when the block is:

- A **section-nav scroll target** with its own title and fields (`DetailSettingsCard`)
- **Sidebar ops** — assign lists, channel availability, widgets (`AssignListCard`, `ChannelAvailabilityCard`, …)
- **Self-contained + can be empty** — needs empty state frame (no warehouses, no gateways)
- **Visually separable** from neighbors — different action model (assign vs edit fields)

**Skip the card wrapper** when:

- Content is the **main body** of a section and section nav + heading already provide the map (e.g. products datagrid — card chrome is optional)
- Fields are **continuation of the same settings group** inside an existing card (toggle rows, nested `DetailGroupBox` rows)
- **Layout only** — spacing between `DetailSection` blocks is enough; wrapping would nest surfaces without new semantics
- **Single short group** on a page without section nav — one `DetailSettingsCard` may be enough; don’t add outer card

**Anti-patterns (aligned with Vercel):** card inside card; card around every field group “for consistency”; card when only purpose is padding.

### Channel availability (sidebar + main column)

Three established patterns — pick by **depth of per-channel config**, not by entity type alone.

| Tier                       | Component                                                                | Where used                                                       | Use when                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Membership + publish**   | `ChannelsAvailabilityCard` (`ChannelsAvailabilityCardWrapper`)           | Collection sidebar, vouchers, product create                     | Sidebar ops: assign channels, toggle published/visible; no per-channel health banner or inline expand                            |
| **Status list**            | `ChannelAvailabilityCard` `variant="list"`                               | Shipping method detail (`ShippingMethodChannelAvailabilityCard`) | Main column or sidebar: show each channel with status dot/badge + optional health banner; Manage opens dialog; expand not needed |
| **Expandable per-channel** | `ChannelAvailabilityCard` `variant="accordion"` + `renderChannelDetails` | Channel/shipping patterns using `ChannelAvailabilityItem`        | Per-channel fields or tables inline (prices, listings) — foldable row like shipping rate channel table                           |
| **Diagnostics-heavy**      | `ProductDoctor/AvailabilityCard`                                         | Product update sidebar                                           | Product-only: search, pagination, dirty state, public API verification, issue grouping — do not generalize                       |

**Adjustments when rolling out:**

- Align **chrome** (title, “In X of Y”, Manage placement) across tiers even if internals differ.
- Prefer `ChannelAvailabilityCard` list variant over legacy wrapper when you need **honest readiness** (missing price, draft channel) banners.
- Collections sidebar: legacy `ChannelsAvailabilityCard` is still **correct ops placement**; migrate to list variant only if you need status banners or search at scale.
- Product variant channels (`VariantDetailsChannelsAvailabilityCardContainer`) still uses old accordion-in-`DashboardCard` — converge on `ChannelAvailabilityCard` when touched.

### Foldable blocks (`DetailGroupBox` vs accordion cards)

| Pattern                   | Component                    | Visual                                                                                                            | Use when                                                                                                           |
| ------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Nested list row**       | `DetailGroupBox` (`primary`) | Gray header band, chevron, `Title2`, optional `headerEnd` meta                                                    | **Repeatable child entities** inside a parent card — shipping zone rates, metadata editor rows, postal code groups |
| **Foldable section card** | `DetailGroupBox` (`card`)    | Same chrome as `DetailSettingsCard` (tinted header, card padding, size-5 title) + chevron; `headerEnd` for Assign | When the foldable **is** the section card (e.g. Countries) — do not nest inside `DetailSettingsCard`               |
| **Legacy optional block** | `SeoForm` (wrapped)          | `DashboardCard` + Macaw `Accordion`, Complete/Incomplete in trigger                                               | Pages **without** section nav and without `DetailSettingsCard` — create flows, short forms                         |
| **Section settings**      | `DetailSettingsCard`         | Tinted card header, always-visible body                                                                           | Primary scroll targets on long detail pages (General, Media, SEO with `SeoForm` `unwrapped`)                       |

**SEO on entity detail:**

- **Placement (default across the dashboard):** SEO is **always last** in the main-column stack — after general/settings and after primary content (products, rates, lists). Create flows follow the same order when they include SEO. **Exception only when explicitly decided** for a specific entity (document why in the PR / skill example).
- Chrome: default `SeoForm` secondary + `columnInset={false}` inside `DetailPageContent` (collections / categories).
- With `DetailSectionNav` + SEO as its own scroll target → `DetailSettingsCard` + `SeoForm` `unwrapped` is allowed; SEO section still sorts **last** in the nav/map.
- Do **not** nest `DetailGroupBox` for SEO when section nav exists — double collapse hides optional fields unnecessarily.
- Carry **Complete / Incomplete** in the SEO surface (`intro` or foldable trigger), not above primary content.
- Use foldable `DetailGroupBox` SEO only on **short pages without section nav** where collapse saves space — still keep it last in the stack.
- **Gift card Timeline** is an open (non-carded) section — title + timeline only, **last** in the main column. Do not wrap in `DetailSettingsCard` / `DetailGroupBox`.

`DetailGroupBox` ≠ `ChannelAvailabilityItem` accordion: group box is for **entity rows in a list**; channel item is for **homogeneous channel rows** with shared status model.

### When `DashboardCard` still fits

Shipping-style entity cards with [`DashboardCard.Subtitle`](./saleor-dashboard-microcopy/SKILL.md) + `MicrocopyLink` — hints above fields, not toggle/radio setting rows. Example: shipping zone settings sections.

---

## Principles (apply on every entity detail refresh)

1. **Create light, configure in place** — minimal create modal; detail is the setup home when funnel exists.
2. **Required vs worth-reviewing** — checklist blockers ≠ optional review rows (tax, catalog).
3. **Settings as a map** — section cards; sticky `DetailSectionNav` when long; not one flat form.
4. **Sidebar = ops** — assign/availability; no empty bordered status-only sidebar.
5. **Stage membership until Save** — assign dialogs → form state; create-missing-entity may persist immediately (channel pattern).
6. **Header owns lifecycle status** — pill in title; activate/deactivate confirmed in header, not Save.
7. **Metadata in header modal** on edit views — never inline `<Metadata>` on update.
8. **Modals for create/assign/wizard** — page for ongoing config.
9. **Honest readiness** — don’t claim catalog/setup complete without data.
10. **Recoverable setup** — if checklist dismissible, offer reopen from TopNav menu.
11. **SEO last in the main column** — after identity/settings and primary content; exception only when explicitly decided for that entity.
12. **Primitives own heading typography** — `DetailSettingsCard` / `AssignListCard` / `Title2` set size, weight, and heading level. Callers pass copy only (`string` / `FormattedMessage` / thin wrappers like `DetailSettingsCardTitle`). Never rely on bare browser `<h2>` styles.
13. **Channel references use `ChannelDisplay` / `ChannelDetailsLink`** — globe icon + normal text color; never a bare blue link for a channel name. Other in-card links prefer `Link color="secondary"` with hover underline. See [`saleor-dashboard-styles`](./saleor-dashboard-styles/SKILL.md) → Interactive affordances.
14. **Create-time identity uses `FixedAtCreationField`** — disabled Input + lock + “Fixed at creation. To {goal}, {alternative}.” Never a disabled Combobox/Select.

Not every entity needs all of these. Collections don’t need a setup checklist; channels do.

---

## Entity detail refactor checklist

Work top-down. Skip steps that don’t apply.

- [ ] **Shell** — `DetailPageLayout` + `Savebar`; `actionsGap={3}` on TopNav when multiple actions
- [ ] **TopNav** — `TopNav.MetadataButton` (edit); `TopNav.Menu` for extensions + delete; back via `href` (no `subtitleTop` parent eyebrows yet). Destination `hrefIcon` must match the entity family (`TopNavDestinationIcon.categories` / `.collections` / `.products` — not the catalog parent for siblings).

### `TopNav.Menu` (cogs menu)

Canonical reference: `src/channels/pages/ChannelDetailsPage/ChannelDetailsPage.tsx` (`menuItems` `useMemo`).

| Rule                 | Detail                                                                                                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Trigger**          | Default `TopNav.Menu` — secondary `Settings` cog (`show-more-button`).                                                                                                                                                                                                                                       |
| **Order**            | Extension items → entity-specific actions (e.g. Resend, Create child) → **related store/settings hub** (when appropriate) → **GraphiQL** (`GraphqlIcon`) → **Delete last**. GraphiQL always immediately precedes Delete (or other critical/destructive last item).                                           |
| **Related settings** | Only when the hub is clearly scoped to **this** entity (e.g. channel → tax). Named label, Lucide icon, permission-gated, **immediately above GraphiQL**. Do **not** link shop-wide defaults from a single-entity detail (gift card settings stay on the list gear + Configuration — not the gift card cogs). |
| **Delete**           | `color: "critical1"`, `Trash2` icon (`iconSize.small`), `testId: "delete-<entity>"`. Opens confirm dialog — **not** on `Savebar` (channel + collection pilots).                                                                                                                                              |
| **Icons**            | Every built-in item gets an icon; extensions may omit until avatar support lands.                                                                                                                                                                                                                            |
| **Disabled**         | When page `disabled` or entity not loaded: `menuItems.map(item => ({ ...item, disabled: true }))`.                                                                                                                                                                                                           |
| **Visibility**       | Render only when `menuItems.length > 0`.                                                                                                                                                                                                                                                                     |

Savebar on entity detail: `Spacer` + composition hint (optional) + Cancel + Confirm — no delete button when delete lives in the menu.

- [ ] **Metadata** — `*MetadataDialog` + `?action=view-metadata`; remove inline metadata on edit ([detail-pages skill](./saleor-dashboard-detail-pages/SKILL.md))
- [ ] **Header meta** — status pill / secondary meta in title when entity has lifecycle (channel Active/Inactive)
- [ ] **Main settings** — group fields in `DetailSettingsCard` (or channel reference); toggle/radio rows use `DetailSetting*`; create-time identity uses `FixedAtCreationField`
- [ ] **Lists / primary content** — products, rates, etc. above SEO
- [ ] **SEO** — last in main column (`SeoForm` secondary / `columnInset={false}` unless section-nav `unwrapped` exception); document any non-last placement
- [ ] **Section nav** — optional; add only for long pages like channel details. Skip when stacked cards + foldable blocks already scan well (collections, shipping zones). SEO section last in the map when present.
- [ ] **Sidebar** — operational cards only (`CollectionChannelAvailabilityCard`, `AssignListCard`, widgets)
- [ ] **Staged assigns** — membership changes in form until Save when assign dialogs exist
- [ ] **Savebar hint** — `SavebarCompositionHint` when Save bundles fields + sidebar + listings
- [ ] **Loading** — follow [`saleor-dashboard-loading`](./saleor-dashboard-loading/SKILL.md): layout-shaped shell, gate Form until entity exists, no fake selected defaults / metrics
- [ ] **Setup** — `SetupChecklist` only when entity has a real readiness funnel

---

## Example: collection details (pilot complete)

Reference: [`CollectionDetailsPage`](../../src/collections/components/CollectionDetailsPage/CollectionDetailsPage.tsx).

| Area             | Status                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Metadata         | `CollectionMetadataDialog` + `TopNav.MetadataButton`                                                                                                     |
| TopNav           | `actionsGap={3}`; back via `href`; **Delete collection** in cogs menu (critical + trash icon), not Savebar                                               |
| Content stack    | `DetailPageContent`                                                                                                                                      |
| General / media  | `DetailSettingsCard` + `EntityBackgroundImageField`                                                                                                      |
| Products         | `AssignableListCard` — assign in `headerEnd`; bulk **Unassign** in the table heading; per-row delete on hover; `AssignableListPagination` `inset="drag"` |
| SEO              | **Last** in main column — `SeoForm` secondary / `columnInset={false}`                                                                                    |
| Section nav      | **Optional** — skipped; stacked cards scan well without sticky nav                                                                                       |
| Sidebar          | `CollectionChannelAvailabilityCard` (accordion)                                                                                                          |
| Save composition | `CollectionSaveCompositionHint` → shared `SavebarCompositionHint`                                                                                        |

## Example: category details (dogfood)

Reference: [`CategoryUpdatePage`](../../src/categories/components/CategoryUpdatePage/CategoryUpdatePage.tsx).

| Area             | Status                                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Metadata         | `CategoryMetadataDialog` + `TopNav.MetadataButton`                                                                                 |
| TopNav           | `actionsGap={3}`; ancestor breadcrumbs in `subtitleTop`; **Delete category** in cogs menu, not Savebar                             |
| Content stack    | `DetailPageContent` — this node’s content                                                                                          |
| General / media  | `DetailSettingsCard` + `EntityBackgroundImageField` (immediate upload via `useEntityBackgroundImageUpload`)                        |
| Products         | Main column `AssignableListCard` (always visible — not tabbed with children)                                                       |
| Subcategories    | Right sidebar — reuse `CategorySubcategories` + `CategoryListDatagrid` (tree expand, selection, bulk delete); not custom link rows |
| SEO              | **Last** in main column — `SeoForm` secondary / `columnInset={false}`                                                              |
| Sidebar          | Subcategory datagrid only — do not drop tree/selection/bulk behavior for a slim jump list                                          |
| Save composition | `CategorySaveCompositionHint` → shared `SavebarCompositionHint`                                                                    |

**IA rule:** Category detail = this node’s content in the main column (products, SEO). Subcategories live in the right sidebar via `CategoryListDatagrid` — keep expand/selection/bulk delete; do not replace with custom link rows or peer products/children as tabs.

## Example: shipping zone details (Phase C rollout)

Reference: [`ShippingZoneDetailsPage`](../../src/shipping/components/ShippingZoneDetailsPage/ShippingZoneDetailsPage.tsx).

| Area             | Today → target                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| General info     | `DetailSettingsCard` (done)                                                                                         |
| TopNav           | `actionsGap={3}`; back via `href`                                                                                   |
| Section nav      | **Optional** — skipped; card titles provide structure                                                               |
| Rates sections   | Keep `DashboardCard` + `DetailGroupBox` in rate rows                                                                |
| Sidebar settings | `ShippingZoneSettingsCard` + `DashboardCard.Subtitle` microcopy — **keep** until AssignListCard fits multiselect UX |
| Save composition | `ShippingZoneSaveCompositionHint` (general + channels + warehouses)                                                 |

## Example: shipping method (rate) details

Reference: [`ShippingZoneRatesPage`](../../src/shipping/components/ShippingZoneRatesPage/ShippingZoneRatesPage.tsx) (edit). Create: [`ShippingZoneRatesCreatePage`](../../src/shipping/components/ShippingZoneRatesCreatePage/ShippingZoneRatesCreatePage.tsx).

| Area    | Edit                                                                                                                   | Create                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| TopNav  | `actionsGap={3}`; **Metadata** \| **Translations** \| **Menu** (GraphiQL → Delete last). Delete is **not** on Savebar. | Title + back only — no Metadata / Translations / Menu (no entity id yet) |
| Savebar | Cancel + Save (composition hint optional)                                                                              | Cancel + Save                                                            |

Do not leave edit TopNav as Metadata-only — the cogs menu is required once Delete moves off Savebar.

---

## Canonical implementations

| Pattern                                             | Reference                                                                               |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Full funnel (checklist, nav, staged assign, review) | `src/channels/pages/ChannelDetailsPage/`                                                |
| Boolean setting toggle row                          | `src/components/DetailSettingToggleRow/` · channel Orders · gift card expiry            |
| Metadata modal                                      | `src/products/components/ProductMetadataDialog/`                                        |
| Save composition                                    | `src/components/Savebar/SavebarCompositionHint.tsx` (+ entity segment wrappers)         |
| Content column stack                                | `src/components/DetailPageContent/DetailPageContent.tsx`                                |
| Background image upload                             | `src/components/EntityBackgroundImageField/`                                            |
| Foldable nested UI                                  | `src/shipping/components/ShippingZoneRates/ShippingZoneRateItem.tsx` (`DetailGroupBox`) |
| Channel availability (list + banner)                | `src/shipping/components/ShippingMethodChannelAvailabilityCard/`                        |
| Channel availability (membership sidebar)           | `src/components/ChannelsAvailabilityCard/`                                              |
| Channel availability (accordion row)                | `src/components/ChannelAvailability/ChannelAvailabilityItem.tsx`                        |
| Product diagnostics availability                    | `src/products/components/ProductDoctor/AvailabilityCard.tsx` (product-only)             |
| Collection channel availability (accordion)         | `src/collections/components/CollectionChannelAvailabilityCard/`                         |
| Sidebar assign list (secondary header)              | `src/components/AssignListCard/`; `src/channels/components/ChannelInventoryCard/`       |
| Sidebar assign + microcopy                          | `src/shipping/components/ShippingZoneSettingsCard/` (`DashboardCard.Subtitle`)          |
| Fixed-at-creation field                             | `src/components/FixedAtCreationField/` (channel currency, attribute type)               |
| Configuration hub (not entity detail)               | `src/orders/components/OrderSettingsPage/` (`SettingsHubLayout`)                        |

---

## Anti-patterns

- `TopNav.subtitleTop` parent-list eyebrows (e.g. “Collections” above title) — not in design language yet; use back `href` only
- `SettingsSection` / `SettingsToggleRow` on entity detail (Configuration surface)
- Empty sidebar card only for status
- Full-page create when list modal suffices
- `DetailGroupBox` for primary always-visible settings (use `DetailSettingsCard`)
- SEO **above** primary content (products/lists) without an explicit exception
- Bare `<h2>` / unstyled ReactNode as `DetailSettingsCard` title (card must own `Text size={5}` bold — fixed in the primitive; don’t reintroduce string-only styling)
- Nested heading `Text` inside `title` when the card already styles it
- Wrapped `SeoForm` **under** `DetailSettingsCard` + section nav (double chrome)
- `SeoForm` macaw `Accordion` instead of `DetailGroupBox` (canonical foldable matches shipping country/postal lists)
- `DetailGroupBox` for single optional SEO block when section nav already exposes SEO
- Generalizing `ProductDoctor/AvailabilityCard` to collections or shipping (use tier table above)
- Setup checklist on every entity “for consistency”
- Section nav on a two-card page
- Disabled `Combobox` / `Select` for values fixed at creation (chevron looks editable) — use `FixedAtCreationField`
