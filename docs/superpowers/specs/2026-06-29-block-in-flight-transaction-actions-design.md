# Block in-flight transaction action buttons

Date: 2026-06-29
Branch: `lkostrowski/order-async-action-polling`

## Problem

On the order page, each transaction in the Transactions section may expose actions
(Capture / Cancel / Refund) driven by `transaction.actions`. These map to the async,
webhook-driven `transactionRequestAction` mutation.

Verified in Saleor Core (`hong-kong` workspace):

- `TransactionItem.actions` is a stored, **app-driven** `ArrayField`
  (`saleor/payment/models.py:40`, resolved verbatim at
  `saleor/graphql/payment/types.py:693`).
- Core does **not** remove `CHARGE` from `actions` while a charge is pending, and
  `transactionRequestAction` has no `charge_pending_value` guard
  (`transaction_request_action.py:127` only clamps to `authorized_value`).
- Therefore the server lets the user fire a **second capture (or cancel) while the
  first is still in flight**. The dashboard must block this client-side.

Pending _amount_ fields cannot drive the block: Core creates the `*_REQUEST` event
with `include_in_calculations=False`, so right after the click the pending amount is
still 0 (same timing issue we hit in the polling feature). The **event** is the only
immediately-available signal.

## Design

### Detection

An action is "in flight" on a transaction when a `*_REQUEST` event of that action
type exists whose `pspReference` group has **no** `*_SUCCESS`/`*_FAILURE` event
(cross-action resolution counts — a `CHARGE_REQUEST` can be resolved by an
`AUTHORIZATION_SUCCESS` sharing the psp reference). This is the same grouping logic
already used by `useOrderTransactionPolling`.

New per-action helper:

```ts
transactionActionInFlight(transaction, action: TransactionActionEnum): boolean
```

Maps `CHARGE→CHARGE_REQUEST`, `CANCEL→CANCEL_REQUEST`, `REFUND→REFUND_REQUEST`, then
runs the grouping check filtered to that request type.

### Module boundary cleanup

Today `OrderTransactionsSection` (a component) imports
`orderHasInFlightTransactionAction` from the view-layer `useOrderTransactionPolling.ts`
— a layering smell. Extract the pure detection functions into a new strict module
`src/orders/components/OrderTransaction/transactionInFlight.ts`:

- `transactionHasUnresolvedRequest(events, requestTypes?)` — shared grouping logic
- `orderHasInFlightTransactionAction(order)` — order-level (moved here)
- `transactionActionInFlight(transaction, action)` — new per-action

`useOrderTransactionPolling.ts` keeps only the timer/cap/visibility logic and imports
detection from the new module. No behavior change to polling.

### UI (`CardTitle.tsx`)

For each rendered action, compute `inFlight = transactionActionInFlight(transaction, action)`:

- **Capture button (CHARGE):** `disabled`, label → "Capture in progress", small
  `Throbber` inside the button (consistent with the section-level throbber).
- **Cancel menu item (CANCEL):** rendered disabled (no `onClick`, greyed), label →
  "Cancel in progress".

Re-enable is automatic and derived — no explicit re-enable code:

- The button only shows while `transaction.actions` includes the action.
- After a **successful full capture** the app drops `CHARGE` → button disappears on the
  next poll.
- After a **failure** `CHARGE` stays → button re-enables once the resolution event lands.

### Data & polling — already covered

`transaction.events` (with `pspReference` + `type`) is already in the `OrderDetails`
fragment. The post-mutation refetch + existing background polling bring in the
`*_REQUEST` event and later the resolution. No query/fragment changes.

## Testing

Unit-test `transactionInFlight.ts` with typed fixtures:

- charge in flight → CHARGE true / CANCEL false
- resolved by `CHARGE_SUCCESS` → false
- resolved cross-action by `AUTHORIZATION_SUCCESS` (same psp) → false
- failure resolution → false
- multiple psp groups (one unresolved, one resolved)
- cancel in flight → CANCEL true

Keep existing `useOrderTransactionPolling` tests green (they import the moved helper).

## Out of scope

- Refund (handled in the separate "Send refund" view, not the Transactions list).
- Any server-side change.
