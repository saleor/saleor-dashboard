# Open in GraphiQL — Entity Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Open … in GraphiQL" item to the top-nav kebab menu of 9 entity detail pages, opening the internal Dev Mode panel pre-filled with a lean query and `{ "id": ... }` variables for the current record.

**Architecture:** Mirror the existing Orders/Products implementation exactly — a `defaultGraphiQLQuery` string export in the module's `queries.ts`, an `openGraphiQL` intl message, and an `openPlaygroundURL` handler driving `useDevModeContext()`, wired as one more `TopNav.Menu` item with `testId: "graphiql-redirect"`. No shared abstraction (YAGNI — match the copy-the-pattern convention already in the codebase).

**Tech Stack:** React 17, TypeScript, react-intl, `@dashboard/components/DevModePanel/hooks` (`useDevModeContext`), `@dashboard/components/AppLayout/TopNav` (`TopNav.Menu`).

## Global Constraints

- No default exports for new code; named exports only (existing files keep their style).
- Use `react-intl` for all labels; reuse a message if an equivalent exists.
- Query strings are plain template-literal exports named `defaultGraphiQLQuery` (NOT `gql`-tagged — they are panel text, not Apollo operations), matching `src/orders/queries.ts` / `src/products/queries.ts`.
- Variables string format: `{ "id": "<entity-id>" }`.
- Menu item shape: `{ label, onSelect, testId: "graphiql-redirect" }`.
- Verification gate per task: `pnpm run check-types` and `pnpm run lint` pass. (This pattern has **no unit tests** anywhere in the codebase — Orders/Products included — so type-check + lint is the established gate; do not invent snapshot tests.) Run `pnpm run extract-messages` once at the end (Task 10).

## Reference implementation (read before starting)

- `src/orders/components/OrderDetailsPage/OrderDetailsPage.tsx:199-231`
- `src/orders/queries.ts:279-294` (`defaultGraphiQLQuery`)
- `src/products/components/ProductUpdatePage/ProductUpdatePage.tsx:275-301`

The repeated handler block is:

```ts
const context = useDevModeContext();
const openPlaygroundURL = () => {
  context.setDevModeContent(defaultGraphiQLQuery);
  context.setVariables(`{ "id": "${ENTITY?.id}" }`);
  context.setDevModeVisibility(true);
};
```

The repeated menu item is:

```ts
{
  label: intl.formatMessage(messages.openGraphiQL),
  onSelect: openPlaygroundURL,
  testId: "graphiql-redirect",
}
```

Where a page has no local `messages.ts`, define the message inline at the top of the file with `defineMessages`:

```ts
const messages = defineMessages({
  openGraphiQL: {
    id: "<unique>",
    defaultMessage: "Open this {entity} in GraphiQL",
  },
});
```

(Let `pnpm run extract-messages` assign/replace ids; pick any unique placeholder id that the extractor will normalize, or follow the existing inline-message style in that file.)

---

### Task 1: Categories — `CategoryUpdatePage`

**Files:**

- Modify: `src/categories/queries.ts` (add `defaultGraphiQLQuery` export)
- Modify: `src/categories/components/CategoryUpdatePage/CategoryUpdatePage.tsx` (line ~151 menu, add handler + message)

**Interfaces:**

- Consumes: `category?: CategoryDetailsFragment` prop already in scope; `intl` (already `useIntl()`); `defaultGraphiQLQuery` from `@dashboard/categories/queries`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add query export** to `src/categories/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query CategoryDetails($id: ID!) {
  category(id: $id) {
    id
    name
    slug
  }
}`;
```

- [ ] **Step 2: Wire the page.** In `CategoryUpdatePage.tsx`:
  - Add imports: `import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";` and `import { defaultGraphiQLQuery } from "@dashboard/categories/queries";` and (if not present) `defineMessages` from `react-intl`.
  - Add an inline `messages` object with `openGraphiQL` → `"Open this category in GraphiQL"`.
  - Inside the component body, add the handler block (ENTITY = `category`).
  - Change the menu to include the item:

```tsx
<TopNav.Menu
  items={[
    ...extensionMenuItems,
    {
      label: intl.formatMessage(messages.openGraphiQL),
      onSelect: openPlaygroundURL,
      testId: "graphiql-redirect",
    },
  ]}
  dataTestId="menu"
/>
```

- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: open in GraphiQL on category detail page"`

---

### Task 2: Collections — `CollectionDetailsPage`

**Files:**

- Modify: `src/collections/queries.ts`
- Modify: `src/collections/components/CollectionDetailsPage/CollectionDetailsPage.tsx` (line ~114 menu)

**Interfaces:**

- Consumes: `collection` prop; `intl`; `defaultGraphiQLQuery` from `@dashboard/collections/queries`.

- [ ] **Step 1: Add query export** to `src/collections/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query CollectionDetails($id: ID!) {
  collection(id: $id) {
    id
    name
    slug
  }
}`;
```

- [ ] **Step 2: Wire the page** (ENTITY = `collection`). Same import/handler/message pattern as Task 1, message → `"Open this collection in GraphiQL"`. Replace the `items={[...extensionMenuItems]}` array with the extended array including the GraphiQL item.
- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git commit -m "feat: open in GraphiQL on collection detail page"`

---

### Task 3: Customers — `CustomerDetailsPage`

**Files:**

- Modify: `src/customers/queries.ts`
- Modify: `src/customers/components/CustomerDetailsPage/CustomerDetailsPage.tsx` (uses a `menuItems` array, rendered at line ~196 when `menuItems.length > 0`)

**Interfaces:**

- Consumes: `customer` prop; `intl`; `defaultGraphiQLQuery` from `@dashboard/customers/queries`.

- [ ] **Step 1: Add query export** to `src/customers/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query CustomerDetails($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
  }
}`;
```

- [ ] **Step 2: Wire the page** (ENTITY = `customer`). Add imports/handler/message (`"Open this customer in GraphiQL"`). Push the GraphiQL item into the existing `menuItems` array (so it renders even when there are no extension items — `menuItems.length > 0` becomes always true). Locate where `menuItems` is built and append:

```ts
menuItems.push({
  label: intl.formatMessage(messages.openGraphiQL),
  onSelect: openPlaygroundURL,
  testId: "graphiql-redirect",
});
```

(If `menuItems` is a `const [...]` literal, add the item to the literal instead.)

- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git commit -m "feat: open in GraphiQL on customer detail page"`

---

### Task 4: Vouchers — `VoucherDetailsPage`

**Files:**

- Modify: `src/discounts/queries.ts`
- Modify: `src/discounts/components/VoucherDetailsPage/VoucherDetailsPage.tsx` (line ~282 menu)

**Interfaces:**

- Consumes: `voucher` prop; `intl`; `voucherGraphiQLQuery` from `@dashboard/discounts/queries`.

> Note: name the export `voucherGraphiQLQuery` (Task 5 adds `promotionGraphiQLQuery` to the same `queries.ts`; avoid a generic `defaultGraphiQLQuery` collision within the discounts module).

- [ ] **Step 1: Add query export** to `src/discounts/queries.ts`:

```ts
export const voucherGraphiQLQuery = `query VoucherDetails($id: ID!) {
  voucher(id: $id) {
    id
    name
    type
    discountValueType
  }
}`;
```

- [ ] **Step 2: Wire the page** (ENTITY = `voucher`, content = `voucherGraphiQLQuery`). Add imports/handler/message (`"Open this voucher in GraphiQL"`). Extend the `items={[...extensionMenuItems]}` array.
- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git commit -m "feat: open in GraphiQL on voucher detail page"`

---

### Task 5: Promotions — `DiscountDetailsPage`

**Files:**

- Modify: `src/discounts/queries.ts`
- Modify: `src/discounts/components/DiscountDetailsPage/DiscountDetailsPage.tsx` (line ~85 menu)

**Interfaces:**

- Consumes: `data` prop (the promotion, has `data?.id`); `intl`; `promotionGraphiQLQuery` from `@dashboard/discounts/queries`.

- [ ] **Step 1: Add query export** to `src/discounts/queries.ts`:

```ts
export const promotionGraphiQLQuery = `query PromotionDetails($id: ID!) {
  promotion(id: $id) {
    id
    name
    type
    startDate
    endDate
  }
}`;
```

- [ ] **Step 2: Wire the page** (ENTITY = `data`, content = `promotionGraphiQLQuery`). Add imports/handler/message (`"Open this promotion in GraphiQL"`). Variables: `` `{ "id": "${data?.id}" }` ``. Extend the `items={[...extensionMenuItems]}` array.
- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git commit -m "feat: open in GraphiQL on promotion detail page"`

---

### Task 6: Gift cards — `GiftCardUpdatePageHeader`

**Files:**

- Modify: `src/giftCards/GiftCardUpdate/queries.ts` (add export)
- Modify: `src/giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/GiftCardUpdatePageHeader.tsx`
- Modify: `src/giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/messages.ts` (add `openGraphiQL`)

**Interfaces:**

- Consumes: `giftCard` from `useGiftCardDetails()`; `intl`; `defaultGraphiQLQuery` from `@dashboard/giftCards/GiftCardUpdate/queries`.

> Caveat: this page renders `TopNav.Menu` **only** when `extensionMenuItems.length > 0` (line 72-77). The GraphiQL item must always show, so render the menu unconditionally.

- [ ] **Step 1: Add query export** to `src/giftCards/GiftCardUpdate/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query GiftCardDetails($id: ID!) {
  giftCard(id: $id) {
    id
    displayCode
    isActive
  }
}`;
```

- [ ] **Step 2: Add message** to `src/giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/messages.ts` under `giftCardUpdatePageHeaderMessages`:

```ts
openGraphiQL: {
  id: "<unique>",
  defaultMessage: "Open this gift card in GraphiQL",
},
```

- [ ] **Step 3: Wire the page.** Add imports (`useDevModeContext`, `defaultGraphiQLQuery`), add the handler block (ENTITY = `giftCard`). Replace lines 72-77 so the menu always renders and includes the item:

```tsx
<HorizontalSpacer />
<TopNav.Menu
  items={[
    ...extensionMenuItems,
    {
      label: intl.formatMessage(messages.openGraphiQL),
      onSelect: openPlaygroundURL,
      testId: "graphiql-redirect",
    },
  ]}
  dataTestId="menu"
/>
```

(Note `giftCard` is guaranteed non-null past the line-37 early return, so `giftCard?.id` is safe; keep the optional chaining for consistency.)

- [ ] **Step 4: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: open in GraphiQL on gift card detail page"`

---

### Task 7: Models (pages) — `PageDetailsPage`

**Files:**

- Modify: `src/modeling/queries.ts`
- Modify: `src/modeling/components/PageDetailsPage/PageDetailsPage.tsx` (builds `builtInMenuItems` via `useMemo` at line ~158; menu rendered at ~234 when `menuItems.length > 0`)
- Modify: `src/modeling/components/PageDetailsPage/messages.ts` (add `openGraphiQL`)

**Interfaces:**

- Consumes: `page` prop; `intl`; `defaultGraphiQLQuery` from `@dashboard/modeling/queries`.

- [ ] **Step 1: Add query export** to `src/modeling/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query ModelDetails($id: ID!) {
  page(id: $id) {
    id
    title
    slug
    isPublished
  }
}`;
```

- [ ] **Step 2: Add message** to `src/modeling/components/PageDetailsPage/messages.ts`: `openGraphiQL` → `"Open this model in GraphiQL"`.
- [ ] **Step 3: Wire the page** (ENTITY = `page`). Add imports + handler. Inside the `builtInMenuItems` `useMemo`, `items.push({ label: intl.formatMessage(messages.openGraphiQL), onSelect: openPlaygroundURL, testId: "graphiql-redirect" })` before the `return items;`. Add `openPlaygroundURL` to that `useMemo` dependency array (or wrap it in `useCallback`) to satisfy lint.
- [ ] **Step 4: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: open in GraphiQL on model detail page"`

---

### Task 8: Model types (page types) — `PageTypeDetailsPage`

**Files:**

- Modify: `src/modelTypes/queries.ts`
- Modify: `src/modelTypes/components/PageTypeDetailsPage/PageTypeDetailsPage.tsx` (line ~107 menu; **no `useIntl` currently in this file**)

**Interfaces:**

- Consumes: `pageType` prop; `defaultGraphiQLQuery` from `@dashboard/modelTypes/queries`.

- [ ] **Step 1: Add query export** to `src/modelTypes/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query ModelTypeDetails($id: ID!) {
  pageType(id: $id) {
    id
    name
    slug
  }
}`;
```

- [ ] **Step 2: Wire the page** (ENTITY = `pageType`). Add `import { defineMessages, useIntl } from "react-intl";` (file currently has no intl — add `const intl = useIntl();`), the inline `messages` (`"Open this model type in GraphiQL"`), imports for `useDevModeContext` + `defaultGraphiQLQuery`, the handler, and extend the `items={[...extensionMenuItems]}` array.
- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git commit -m "feat: open in GraphiQL on model type detail page"`

---

### Task 9: Menus — `MenuDetailsPage`

**Files:**

- Modify: `src/structures/queries.ts`
- Modify: `src/structures/components/MenuDetailsPage/MenuDetailsPage.tsx` (line ~93 menu; **no `useIntl` currently in this file**)

**Interfaces:**

- Consumes: `menu` prop; `defaultGraphiQLQuery` from `@dashboard/structures/queries`.

- [ ] **Step 1: Add query export** to `src/structures/queries.ts`:

```ts
export const defaultGraphiQLQuery = `query MenuDetails($id: ID!) {
  menu(id: $id) {
    id
    name
    slug
  }
}`;
```

- [ ] **Step 2: Wire the page** (ENTITY = `menu`). Add `import { defineMessages, useIntl } from "react-intl";` + `const intl = useIntl();`, inline `messages` (`"Open this menu in GraphiQL"`), imports for `useDevModeContext` + `defaultGraphiQLQuery`, the handler, and extend the `items={[...extensionMenuItems]}` array.
- [ ] **Step 3: Verify** — `pnpm run check-types && pnpm run lint`. Expected: PASS.
- [ ] **Step 4: Commit** — `git commit -m "feat: open in GraphiQL on menu detail page"`

---

### Task 10: Finalize — extract messages & full check

**Files:**

- Modify: `locale/defaultMessages.json` (regenerated)

- [ ] **Step 1:** Run `pnpm run extract-messages`.
- [ ] **Step 2:** Run `pnpm run check-types`. Expected: PASS.
- [ ] **Step 3:** Run `pnpm run lint`. Expected: PASS.
- [ ] **Step 4:** Add a changeset (`saleor-dashboard-changesets` skill) — user-facing enhancement: "Added 'Open in GraphiQL' to category, collection, customer, voucher, promotion, gift card, model, model type and menu detail pages."
- [ ] **Step 5: Commit** — `git add -A && git commit -m "chore: extract messages + changeset for GraphiQL menu rollout"`

---

## Self-Review notes

- **Spec coverage:** All 9 in-scope pages from the spec map to Tasks 1-9. Verification (check-types/lint/extract-messages) → Task 10. Out-of-scope pages correctly excluded.
- **Schema fields** (`category{name,slug}`, `collection{name,slug}`, `user{email,firstName,lastName}`, `voucher{name,type,discountValueType}`, `promotion{name,type,startDate,endDate}`, `giftCard{displayCode,isActive}`, `page{title,slug,isPublished}`, `pageType{name,slug}`, `menu{name,slug}`) are standard Saleor fields; confirm against `src/graphql/types.generated.ts` if `check-types`/manual GraphiQL run flags one — but these are panel text, not compiled operations, so a wrong field only shows at runtime in the panel.
- **Naming:** discounts module uses two distinct exports (`voucherGraphiQLQuery`, `promotionGraphiQLQuery`) to avoid collision; all other modules use `defaultGraphiQLQuery`.
- **Lint gotchas:** pages building menus in `useMemo`/`useCallback` (Task 7) must include `openPlaygroundURL` in deps.
