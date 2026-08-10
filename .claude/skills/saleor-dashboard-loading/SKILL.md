---
name: saleor-dashboard-loading
description: >
  Geist-aligned loading, skeleton, and empty-state rules for Saleor Dashboard entity
  views. Use when adding loading shells, Skeleton placeholders, spinners, empty states,
  or fixing flashes of default/form UI before async data resolves. Covers page-level
  gates vs in-card skeletons, aria-busy, and anti-patterns (fake selected defaults).
---

# Saleor Dashboard Loading

How merchants wait for data — **without flashing wrong defaults** or layout jumps.

Inspired by [Geist Skeleton](https://vercel.com/geist/skeleton) and Vercel product UI
discipline. Implement with macaw-ui-next `Skeleton` / existing spinners — do **not**
install Geist packages.

**Also see:** [`saleor-dashboard-entity-detail`](../saleor-dashboard-entity-detail/SKILL.md)
(page anatomy), [`saleor-dashboard-feedback`](../saleor-dashboard-feedback/SKILL.md)
(errors vs loading), [`saleor-dashboard-styles`](../saleor-dashboard-styles/SKILL.md)
(tokens).

Canonical dogfood: **voucher details** —
`VoucherDetailsPageLoading` + gate Form until `voucher` (and first codes settle).

---

## Principle

> Loading UI must look like the **final layout**, not like a guessed answer.
> Never show a selected radio, filled metric, or form default that will change when data arrives.

If the user can see “Entire order” selected for a Free shipping voucher for one frame,
the design is wrong — keep the skeleton (or don’t mount the form) until truth is known.

---

## Pick the right indicator

| Indicator       | When                                                           | Examples                                      |
| --------------- | -------------------------------------------------------------- | --------------------------------------------- |
| **Skeleton**    | Async data fills a **known** layout (cards, grids, table rows) | Detail page shell, discount type tiles, lists |
| **Spinner**     | Single in-flight **action** (button, dialog confirm)           | Save, delete, modal submit                    |
| **LoadingDots** | Indeterminate inline wait without a fixed box shape            | Rare; prefer Skeleton when shape is known     |
| **EmptyState**  | Query finished and there is **nothing** to show                | No codes, no channels                         |

**Never** use Skeleton as decoration or as a stand-in for empty. When there’s no data
after load, render EmptyState.

---

## Page vs region

### Page-level shell (entity not loaded)

When the **primary entity** query is unresolved:

1. Render a dedicated `*DetailsPageLoading` (or equivalent) that mirrors
   `DetailPageLayout` — TopNav title skeleton, **skeleton section-nav labels**,
   card titles/intros (static copy OK on cards), **skeleton bodies**, disabled Savebar.
2. **Do not mount** `Form` / controlled selection UIs until `entity` exists.
3. Remount the form with `key={entity.id}` when navigating between entities so
   invent defaults never leak across IDs.

Card titles/intros may stay visible (stable copy). The **section map/nav** should be
skeletons — labels are part of the unknown layout (optional Countries/Catalogue) and
reading real nav while the page is empty is premature chrome.

Anything that encodes **entity-specific truth** (selected discount type, usage counts,
schedule status) must be skeleton or hidden until known.

**Shape fidelity checklist** (compare shell ↔ loaded UI):

- Skeleton the section map/nav labels (correct item count, including reserved optional slot)
- Reserve header actions that always exist (`+ Add`, `Manage`) as **disabled** controls
- Match list/table chrome (header + row + pagination), not one anonymous bar
- Match variant-specific blocks (e.g. shipping callout vs amount controls)
- Sidebar cards: reuse real card components with `loading` so info callouts / intros stay
- Type-dependent nav count: reserve one optional slot **only while entity is unknown**;
  once known, pass real visibility (do not keep a fake Countries row for entire-order vouchers)

### Region skeleton (secondary query)

After the page has revealed, a **sub-list** may still load (e.g. voucher codes
pagination). Skeleton **inside** that card only — do not tear down the whole page
on refetch.

Optional: on **first** paint, keep the page shell until the primary secondary query
settles once, so users don’t see “correct form + one skeleton card” flash. Use a
`hasRevealedContent` flag keyed by `entity.id`; subsequent refetches use in-card
skeletons only.

---

## Shape & motion (Geist)

- Match final **width / height / shape** so reveal doesn’t reflow (CLS).
- Prefer blocks that mirror tiles, inputs, and metric numbers — not one anonymous bar
  for a three-tile selector.
- Skeletons are decorative; wrap the loading region in `aria-busy="true"`.
- **No focusable controls** inside skeleton regions (no enabled Save, Add, Manage).
- Respect `prefers-reduced-motion` where we own animation (macaw Skeleton handles
  common cases; don’t add custom infinite shimmer that ignores it).

---

## Anti-patterns

| Don’t                                                        | Do                                          |
| ------------------------------------------------------------ | ------------------------------------------- |
| Mount Form with `ENTIRE_ORDER` / `0 used` / “Redeemable now” | Gate Form; skeleton metrics and status      |
| Show selected choice tiles before data                       | Skeleton the tile grid                      |
| Reveal type-dependent nav (catalogue/countries) early        | Hide until type known                       |
| Full-page spinner for a known card grid                      | Layout-shaped Skeleton                      |
| Skeleton forever when empty                                  | EmptyState after load                       |
| Fake progress / invented counts                              | Skeleton or “—” only if product copy allows |

---

## Checklist (new / refactored detail views)

- [ ] **Gate** — no Form / selection UI until primary entity exists; `key={id}` on remount
- [ ] **Shell** — loading layout matches final grid (nav + cards + sidebar + savebar)
- [ ] **No fake truth** — no default selected radios, metrics, or schedule status while loading
- [ ] **Secondary lists** — in-card skeleton after reveal; optional first-paint wait
- [ ] **a11y** — `aria-busy` on loading regions; controls disabled in shell
- [ ] **Empty ≠ loading** — EmptyState only after query settles with zero items

---

## Reference implementation

| Piece                         | Path                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| Page loading shell            | `src/discounts/components/VoucherDetailsPage/VoucherDetailsPageLoading.tsx` |
| Gate + form key               | `src/discounts/components/VoucherDetailsPage/VoucherDetailsPage.tsx`        |
| Section skeletons             | `VoucherDiscountSection`, `VoucherInfo`, `VoucherLimits`, …                 |
| Sidebar metrics while loading | `VoucherRedemptionsCard` (`loading` hides used/status copy)                 |
