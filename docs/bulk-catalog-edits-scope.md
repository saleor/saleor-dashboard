# Bulk catalog edits — scope

**Status:** proposal
**Trigger:** merchant feedback — "I have to edit each variant individually, which is very time-consuming"

The merchant asked for four things: activating multiple products/variants at once, adding a warehouse
to multiple products/variants, updating inventory/warehouse settings across products, and "other
similar changes to multiple products at the same time".

---

## The structural gap

**No surface in the dashboard spans variants across products.** Every multi-variant editor is scoped
to a single product. That single fact explains all four complaints.

Two of the four asks are already partly solvable with features the merchant almost certainly hasn't
found; the rest are genuinely missing.

| Ask                              | Today                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Activate multiple products       | Bulk publish wizard covers it — but only from **Channel → Catalog → Add products** (see below)                         |
| Add warehouse to many variants   | **Nothing.** `AssignWarehouseDialog` is one variant at a time; the warehouse detail page has no product or stock UI    |
| Update inventory across variants | Works **inside one product** (variant grid warehouse columns, fill handle, spreadsheet paste); nothing across products |
| Other bulk changes               | Product list is a read-only grid; only bulk delete and export                                                          |

### The publish wizard was an onboarding tool — now partly a bulk editor

Worth recording, because it is the template for everything below.

Originally **price was mandatory and uniform per product**: `ProductPublishDraft.price` is one string
applied to every variant, it started empty even for already-listed products, and validation blocked
the wizard until it was filled. That meant you could not change _only_ stock or _only_ visibility —
every run rewrote prices — and on a product whose variants are deliberately priced differently, one
run **flattened them all to one value**, silently and irreversibly. A merchant looking for a way past
the gate could also type `0`, which validation accepts, zeroing an entire selection.

**Fixed.** Price is now required only where there is nothing to fall back on — a product with no
listing in the channel, since Saleor needs a price to create one. For already-listed products a blank
price leaves prices untouched (`channelListings.update` simply omits the field), matching how cost
price and stock already behaved. The review step shows each product's current price as the field
placeholder, marks rows whose price will change, and warns inline before flattening a product whose
variants are priced differently.

Still open, in rough priority order:

- **Visibility flags are still an unconditional overwrite.** `productChannelListingUpdate` always
  writes `isPublished`, `visibleInListings`, and `isAvailableForPurchase` from the defaults step, so
  running the wizard on a listed product to change _only_ stock will also republish it. This is the
  same destructive-overwrite class we just fixed for price, and the fix is the same shape — the
  defaults step needs a "leave unchanged" state per toggle, not just on/off. Deliberately not done
  here because it changes the defaults UX rather than correcting a bug.
- The wizard sets **one price per product**, so per-variant repricing needs the Phase 3 grid.
- It is still reachable only from the channel page.

A vocabulary problem sits underneath the first row: **"active" has no product-level meaning in Saleor.**
Live = `isPublished` + `visibleInListings` + `isAvailableForPurchase` per channel, _plus_ a variant
channel listing with a price. Four booleans and a price across two entities. Merchants clicking into
every variant may be doing so because they have no model of what "live" means. Any UI here should
express one concept ("make available for sale in _channel_") and handle all five underneath.

---

## API ceiling

Verified against `schema.graphql` and the Saleor bulk docs. These constraints shape every option below.

- **No `productBulkUpdate`.** Product-level changes (category, collections, publication) are N separate
  `productUpdate` / `productChannelListingUpdate` calls. `productBulkCreate`, `productBulkDelete`,
  `productBulkTranslate` exist; only delete is used.
- **`productVariantBulkUpdate` takes `product: ID!`** — bulk _within_ a product, not across the catalog.
  Cross-product edits mean one call per product, chunked at 100 variants. Supports `stocks`
  (create/update/remove), `channelListings`, `trackInventory`, `quantityLimitPerCustomer`, `sku`, `name`,
  `weight`, `metadata`.
- **`stockBulkUpdate` is the only genuinely cross-catalog mutation** — a flat list of
  `{ variantId, warehouseId, quantity }`, unused by the dashboard. **It cannot create stock rows:**
  `NOT_FOUND` when the warehouse isn't already assigned to the variant. Creation must go through
  `productVariantBulkUpdate.stocks.create`, which in turn errors `STOCK_ALREADY_EXISTS` if the row is
  already there. Any warehouse operation must therefore read current stocks and split create vs update.
- **Top-level `productVariants` query exists** with `search`, sorting, and `where` on sku / attributes /
  metadata / updatedAt — but **no filtering by channel, category, stock level, or warehouse**. A
  standalone variants list is buildable but its filters would be too weak to answer "variants with no
  stock in warehouse X". Selection has to stay on the product list, which has rich filters.
- **No import.** Export emails CSV/XLSX; nothing reads it back. The export → edit → import round trip
  power merchants want is core work, not dashboard work.

---

## Jobs to be done

1. **"Open a new location."** A warehouse goes live and every variant needs a stock row there. Rare,
   completely blocking, currently impossible at scale. **Highest priority.**
2. **"Get this batch live."** New drop or new supplier — publish, set visibility, price, stock.
   Episodic, same change applied broadly. Partly served, badly discoverable.
3. **"Run the weekly count."** Different quantity per variant across many products. Needs to _see_ the
   numbers — a spreadsheet job, not a wizard job. `stockBulkUpdate` is built for exactly this.
4. **"Change a policy."** Track inventory, quantity limit per customer, across a segment. Same value
   applied broadly — wizard job.
5. **"Find what's broken."** Unstated but load-bearing: merchants often don't know _which_ products
   lack a price in a channel or have zero stock, so they can't even build a correct selection.

---

## Design: three modes, one frame

"Datagrid vs bulk tool" is a false choice — they serve different job shapes.

- **Bulk apply (wizard)** — same change, or a rule, across many rows. Jobs 1, 2, 4.
- **Inline grid** — different value per row; the merchant must see the data. Job 3.
- **Find-and-fix** — the merchant doesn't know which rows need changing. Job 5.

The frame to build is a **single bulk-action wizard on the product list with a pluggable operation
catalogue**. Merchants learn one flow; each new capability is a new operation, not a new UI.

`BulkPublishToChannelDialog` already provides the shell: wizard steps, product picker with select-all
and caps, draft model with defaults → per-row overrides, spreadsheet paste, sequential loop with
chunking, per-item progress, retry-failed, idempotent re-fetch before mutating. The work is extracting
the operation-specific parts behind an interface.

---

## Phase 1 — "Add warehouse" from the product list

Delivers job 1 and establishes the frame.

### UX

Entry: product list → select products → **Bulk edit** button next to `BulkDeleteButton` in
`ListFilters.actions` (`ProductListPage.tsx` ~L243). Opens URL-driven modal (`?action=bulk-edit`).

1. **Operation** — pick from the catalogue. Phase 1 ships "Add warehouse"; later phases add entries here.
2. **Configure** — choose warehouse, and a quantity strategy: fixed value / copy from another warehouse /
   zero. Warn when the warehouse isn't assigned to the channels the selected products sell in (stock
   there won't be allocatable).
3. **Review** — per-product rows with the resolved quantity, overridable, spreadsheet paste. Show the
   blast radius: _"Creates stock rows for N variants across M products; K already have stock here and
   will be updated."_
4. **Apply** — per-product progress list, retry failed, partial-failure warning toast.

### Implementation

Generalise, don't fork:

- Extract from `src/channels/components/BulkPublishToChannelDialog/` into
  `src/products/components/BulkEditProductsDialog/` (or a shared `src/components/BulkEdit/`):
  the wizard shell, `chunkBulkPublishItems`, the progress/retry machinery in
  `BulkPublishConfirmStep.tsx`, the draft merge model in `bulkPublishDrafts.ts`, and
  `fetchBulkPublishProductVariants.ts`.
- `bulkPublishVariantStocks.ts` → `buildBulkPublishVariantStocksInput` is **already the exact primitive**
  needed: it reads `variant.stocks`, splits into `create` (missing rows) and `update` (by stock id).
  Rename and reuse as-is.
- Define a `BulkOperation` interface: config step component, review row component, draft type, a
  `buildProductMutations(product, variants, draft)` function, and validation. `useBulkPublishToChannelSubmit`
  becomes a generic runner that walks products sequentially and delegates per-product work to the operation.
- Keep `disableErrorHandling: true` and `ErrorPolicyEnum.REJECT_FAILED_ROWS`.
- Keep the re-fetch-before-mutate step (`useBulkPublishToChannelSubmit.ts` L321–324) — it is what makes
  retries idempotent, and it doubles as the read of current stocks that the create/update split needs.

Once extracted, re-point the channel wizard at the shared frame so there is one implementation.

---

## Phase 2 — Operation catalogue

Each is small once the frame exists.

- **Make available in channel** — today's publish wizard, reachable from the product list. The
  "leave prices unchanged" behaviour it needs to run against an existing catalog is already done.
- **Inventory policy** — `trackInventory`, `quantityLimitPerCustomer` via `productVariantBulkUpdate`.
- **Pricing** — set / ±% / round, per channel, via `channelListings.update`.
- **Organisation** — category and collections. Note: N× `productUpdate` (no product bulk update);
  collections have dedicated `collectionAddProducts` / `collectionRemoveProducts`.
- **Remove warehouse** — `stocks.remove`, with a hard warning about allocated stock.

---

## Phase 3 — Cross-product stock grid

Job 3 needs a grid, not a wizard, because values differ per row. Given the weak variant filters, scope
it as "select products → edit all their variants' stock in one grid" rather than a standalone variants
list view.

Reuse the `ProductVariants` datagrid machinery (warehouse column adapter, fill handle, paste, staged
edits via `variantGridStagedEdits.ts`). Save via a **single `stockBulkUpdate` call** — the one place the
flat cross-product API fits, and dramatically faster than the per-product loop. Rows whose stock does
not yet exist must be routed through `productVariantBulkUpdate.stocks.create` instead, or blocked with a
prompt to run "Add warehouse" first.

---

## Phase 4 — Find-and-fix

Catalog readiness filters on the product list — no price in channel, no stock anywhere, not published,
missing category — feeding directly into the bulk actions. Builds on the catalog health signals already
on the channel detail page.

---

## Scale

The current wizard caps at 50 products. A merchant with thousands of SKUs hits that immediately.

**Decision: stay client-side, raise the cap to a few hundred, and make progress resumable.**

- Raising the cap alone isn't enough — a sequential per-product loop at 500 products takes minutes with
  the tab held hostage. Progress must persist (session storage keyed by operation + selection) so a
  refresh or accidental close resumes rather than restarts.
- Keep the per-product progress list as the primary feedback; it already communicates "this is a long
  job" honestly.
- Warn before starting when the estimate exceeds ~1 minute.
- The real answer at catalog scale is an **async server-side bulk-edit job** modelled on the existing
  export job. That is core work — worth raising separately, out of scope here.

---

## Safety rules

- **No undo.** Bulk edits are irreversible, so the review step is load-bearing: always state
  "this will change N variants across M products" before applying.
- **Never silently partial.** Per-item errors in the progress list, warning toast on partial failure,
  modal stays open, retry applies only to failed IDs.
- **Idempotent retries.** Re-fetch state before mutating so a retry can't duplicate listings or trip
  `STOCK_ALREADY_EXISTS`.

---

## Open questions

- Which channels' warehouses should "Add warehouse" offer — all shop warehouses, or only those assigned
  to channels the selected products sell in? Offering all is simpler but creates unallocatable stock.
- Should the merchant's "activating" mean per-channel publication, or is there an expectation of a
  global on/off that Saleor doesn't have? Worth confirming before building Phase 2's first operation.
- Does the merchant work from spreadsheets today? If yes, Phase 3 and the (core-side) import story
  matter more than the wizard catalogue.

---

## Summary

> Close the cross-product gap with one bulk-action wizard on the product list, generalised from the
> channel bulk publish wizard, starting with "add warehouse to many variants" — the one job with no path
> at all today — then grow the operation catalogue and add a cross-product stock grid for per-row edits.
