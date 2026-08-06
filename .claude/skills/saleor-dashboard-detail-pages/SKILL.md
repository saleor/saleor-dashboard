---
name: saleor-dashboard-detail-pages
description: >
  Patterns for Saleor Dashboard entity detail views (channels, products, collections,
  customers, shipping zones, warehouses, models/pages). Use when building or refactoring
  detail pages, moving metadata out of the main form, or aligning TopNav actions.
  For the full update language (sidebar ops, settings cards, checklist), see
  saleor-dashboard-entity-detail skill.
---

# Saleor Dashboard Detail Pages

Conventions for `DetailPageLayout` entity views under `src/<feature>/`.

**Start here for broader refresh:** [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md) — page anatomy, `Detail*` vs `Settings*`, refactor checklist (e.g. collections).

## Foldable sections

For expandable sections (advanced settings, rate rows, postal ranges, etc.) use **`DetailGroupBox`** with `Title2` — documented in [`saleor-dashboard-styles`](../saleor-dashboard-styles/SKILL.md#foldable-sections-detailgroupbox). Do not introduce new UI with the legacy `@dashboard/components/Accordion`.

## Section nav layout

Long detail pages with **`DetailSectionNav`** (4+ scroll sections) use **`DetailPageSectionLayout`** — nav rail at `25%` width (`min 10rem`) + main column with `gap={4}`. Do not nest **`DetailPageContent`** inside (that component is for single-column pages only). See [`saleor-dashboard-entity-detail`](../saleor-dashboard-entity-detail/SKILL.md) for the full table and example.

## Settings sections (`DetailSettingsCard`)

On entity detail pages, group fields in **`DetailSettingsCard`** (not `DashboardCard` or nested cards). Full language:

- Primary vs **secondary** sidebar card headers (Inventory / Delivery pattern)
- **`intro`** row for leading description (Payment gateways pattern)
- **Card vs open section** — when to skip the border
- Channel availability tiers, foldables, SEO `unwrapped`
- **SEO last** in the main column by default (identity → primary content → SEO)
- [Vercel design](https://vercel.com/design) restraint rules (earn a surface, no nesting)

→ [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md)

## Metadata in Header Modal

**Edit views** — metadata lives in a header modal, not the main form.

| Layer                 | Responsibility                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| `*MetadataDialog`     | `MetadataDialog` + `useMetadataForm` + `useHandleMetadataSubmit`        |
| View (`*Details.tsx`) | URL dialog state via `createDialogActionHandlers`, renders dialog       |
| `*DetailsPage`        | `TopNav.MetadataButton` → `onShowMetadata`                              |
| Form                  | No metadata fields on update; create flows may keep inline `<Metadata>` |

### Reference implementations

- `src/products/components/ProductMetadataDialog/`
- `src/customers/components/CustomerMetadataDialog/`
- `src/warehouses/components/WarehouseMetadataDialog/`
- `src/modeling/components/PageMetadataDialog/`

### Checklist (edit view)

1. Add `"view-metadata"` to the entity URL dialog union (`urls.ts`).
2. Create `<Entity>MetadataDialog` using `PageDetailsDocument` (or entity query doc) as `refetchDocument`.
3. View: `openModal("view-metadata")` / `closeModal`; remove `createMetadataUpdateHandler`.
4. Page: `TopNav.MetadataButton` with `data-test-id="show-<entity>-metadata"`.
5. Remove inline `<Metadata>` from page content; skip metadata in update submit data.
6. **Create views** keep inline `<Metadata>` + `createMetadataCreateHandler` (no entity id yet).

### URL dialog wiring

```tsx
const [openModal, closeModal] = createDialogActionHandlers(
  navigate,
  params => entityUrl(id, params),
  params,
);

<EntityMetadataDialog
  open={params.action === "view-metadata" && !!entity}
  onClose={closeModal}
  entity={entity}
/>;
```

### MetadataDialog component

Shared UI: `src/components/MetadataDialog/`. Entity dialogs are thin wrappers — copy an existing one and swap the GraphQL document + title message.

## TopNav Actions

- `TopNav.MetadataButton` — metadata (edit views only)
- `TranslationsButton` — when `MANAGE_TRANSLATIONS`
- `TopNav.Menu` — extensions → entity actions → related settings hub (if any) → GraphiQL → Delete last (see entity-detail skill)
- Set `actionsGap={3}` when multiple header actions

## Further Reading

- [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md) — update language for daily entity details
- `rules/metadata-modal.md` — step-by-step migration from inline metadata
- `saleor-dashboard-styles` skill — layout and Macaw UI patterns
