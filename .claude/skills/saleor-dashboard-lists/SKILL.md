---
name: saleor-dashboard-lists
description: >
  Rules for Saleor Dashboard lists and tables: row selection and bulk actions, sorting,
  ConditionalFilter fields, pagination edge cases, counts and status columns. Use when
  building or fixing a datagrid list, a list inside a detail page (codes, variants,
  assigned items), a bulk delete or export, a sortable column, a filter field, or when
  auditing an existing list for bugs. Includes an audit checklist and how to verify in
  the browser.
---

# Saleor Dashboard Lists

Most list bugs found in an external QA benchmark of the voucher screens came from a few
patterns that every list shares. Check each one when you build or fix a list.

**Also see:** [`saleor-dashboard-forms`](../saleor-dashboard-forms/SKILL.md) (saving,
dates, time zones), `saleor-dashboard-loading` (skeletons and empty states) and
`saleor-dashboard-feedback` (bulk action toasts), both in `.claude/skills/`.

---

## 1. Selection follows ids, not row positions

The shared `Datagrid` keeps its selection by **row index**. When the rows change after a
sort, a filter, a search, a page change or a refresh, the same positions now hold other
items. A bulk delete then sends the ids of items nobody picked.

- Clear the selection whenever the ids of the rows shown change: call
  `useClearRowSelectionOnRowsChange({ rows, clearRowSelection })` from
  `src/hooks/useRowSelection.ts` right after the list query.
- Pass `rows` as `undefined` while there is no data (query skipped or loading). Don't
  default it to `[]` for this call: a dialog can reload the filters and briefly skip the
  query, and the dialog still needs the selection.
- A refetch that returns the same rows must keep the selection, so opening the delete
  dialog keeps working.
- The same applies to tables inside detail pages (codes, subcategories, assigned items)
  and to local (client-side) pagination.
- This is a workaround in every list. The root fix belongs in `Datagrid`: keep the
  selection by row id, or clear it when the row ids change. That would cover every list,
  including grids that don't use `useRowSelection`. Until then, a list that forgets the
  hook ships wrong-row bulk actions.

## 2. Each sortable column sorts by what it shows

- Map every column id to the API sort field that orders the value the column displays.
  A Name column that shows names must not sort by code.
- Check the generated enum (`src/graphql/types.generated.ts`) for `@deprecated` sort
  fields; a deprecated field can be ignored by the API.
- If a column id is also a URL key or a saved column setting, keep the key and change
  only the mapping, so bookmarks and saved settings keep working.
- Test it by column title: build the columns, find the one titled "Name", and check the
  sort variables. This catches the mapping, not just the switch statement.

## 3. Filter fields match what the API accepts

ConditionalFilter turns rows into `filter` or `where` variables
(`src/components/ConditionalFilter/`).

- **One row per field** when the API takes one value per field (the legacy `filter`
  inputs). Otherwise a second row silently replaces the first. Set
  `maxOccurrences: 1` on the field in `constants.ts`; multi-select rows already hold
  several values. This only hides the field in the add-row menu (`OccurrenceLimiter`).
  A URL or a saved preset can still hold two rows for the field, so merge or drop the
  extra rows when the filters load.
- **Dates go through a date builder.** A bare `datetime-local` value such as
  `2025-01-31T16:24` is read by the API as UTC. `DateTimeRangeQueryVarsBuilder` converts it
  from the browser's time zone to UTC, but only for the field names in its
  `DATE_FIELD_NAMES` list. Add a new date field there, or it falls through to
  `DefaultQueryVarsBuilder` and is sent bare.
- **Date-only values are not converted to local time.** `buildDateFilter` parses
  `2025-01-31` with `new Date`, which gives UTC midnight, not local midnight. A range on a
  date-only field (`dateJoined`) is off by the time-zone offset at both ends. Build local
  midnight (`2025-01-31T00:00`) when the edges matter.
- **Half-filled ranges.** A "between" with one bound empty must not send `""`; the API
  rejects the whole query and the list fails to load. `buildDateFilter` sends only the
  bound that is set; other range builders must do the same.
- Test filters through the domain's `create…QueryVariables` with real `FilterElement`s,
  and check the exact variables.

## 4. Pagination edge cases

- **Emptied last page.** Deleting or unassigning the only item on the last page must keep
  the pager and step back (or restart from page 1). An empty page that hides the pager
  strands the remaining items.
- **Local pagination** (drafts, assigned items before save): when every page is local,
  use `useLocalPageInfo` with `clampToLastPage` so a removal that empties the last page
  steps back. Leave it off when the pager continues past the local items into server
  pages: a saved voucher's codes run from local drafts into server codes, so
  `useVoucherCodesPagination` keeps it off by default. Pass the page info at the level the
  pager reads.
- **Cursor pagination after removals.** Cached pages still list removed items; drop them
  (see `dropCachedCodePages` in `useVoucherCodesServer.tsx`) or restart from the first
  page.
- Page size changes reset to the first page.

## 5. Counts and statuses come from one source

- Count each thing once. If drafts are both listed and kept in form state, count saved
  items from the list (they have an `id`) and drafts from the form, not both lists.
- A status column must use every condition the API uses, not only dates. Example: a
  voucher whose usage limit is used up is not "Active", and the API's filter already
  calls it expired.
- Match the API's precedence, e.g. a voucher that hasn't started stays "Scheduled" even
  if its limit is used up.

## 6. Dialogs and URL state

- Mount pickers and filter dialogs only while they're open. Every picker on a page reads
  the same numeric URL filter keys (`useUrlFilterStore` has no per-dialog keys), so a
  hidden dialog can throw on another dialog's filter. A picker that unmounts when it
  closes clears those keys (`useModalFilters` calls `useClearModalFiltersOnUnmount`), so
  filters don't carry over to the next picker.
- Items in mixed collections (categories, collections, products, variants) have different
  shapes. Never map one kind as another; branch on the tab or `__typename`.

---

## Audit checklist

Run through this for any list you build or touch:

- [ ] Select rows, then sort, filter, search and change page: the selection clears.
- [ ] Select rows, open the bulk action dialog: the count matches, and the request
      carries exactly the selected ids.
- [ ] Every sortable column orders by the value it shows (try both directions).
- [ ] Two rows for the same filter field are impossible, or both apply.
- [ ] Date filters in a non-UTC browser zone include the right items at the edges.
- [ ] A half-filled "between" range doesn't break the list.
- [ ] Deleting the only item on the last page keeps the pager and the other items.
- [ ] Counts in headers, tabs and checklists match the rows.
- [ ] Status columns agree with the API's own status filter.
- [ ] Loading shows skeletons, an empty result shows an empty state.

## Verifying in the browser

Unit tests don't catch most of these. Script the check in a real browser against a local
API, as described in `saleor-dashboard-forms` ("Verifying in the browser", and section 5
for time zones). For lists, also:

- **Never run destructive requests for real.** Intercept the API URL with `page.route`,
  let through only the operations the check needs (an allowlist), and record and abort
  every other mutation. A name pattern such as `BulkDelete` misses `VoucherDelete`,
  `VoucherCataloguesRemove` or a channel listing update that removes channels.
- Change sort and filters through the URL (`history.pushState` plus a `popstate`
  event) to reproduce what the column header and filter bar do. Confirm each case once
  through the real controls too: the filter bar can write a different URL than one typed
  by hand (a half-filled "between" writes an empty second bound).
