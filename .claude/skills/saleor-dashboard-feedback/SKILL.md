---
name: saleor-dashboard-feedback
description: >
  Rules for surfacing errors, warnings, and success feedback in Saleor Dashboard
  (Geist/Vercel-aligned). Use when adding useNotifier/toasts, save/mutation error
  handling, form validation, banners, setup blockers, or dogfooding feedback quality
  on entity views (vouchers first). Covers when to toast vs inline vs persistent UI,
  toast copy quality, stickiness, and anti-patterns.
---

# Saleor Dashboard Feedback

How merchants learn that something worked, failed, or needs attention — **without
offloading triage into toasts**.

Inspired by [Geist Toast](https://vercel.com/geist/toast) and Vercel product UI
discipline. Implement with macaw-ui-next + `useNotifier` / our toast queue — do not
install Geist packages.

**Also see:** [`saleor-dashboard-entity-detail`](../saleor-dashboard-entity-detail/SKILL.md)
(page anatomy), [`saleor-dashboard-microcopy`](../saleor-dashboard-microcopy/SKILL.md)
(hint copy), toast implementation under `src/components/notifications/`.

---

## Principle

> Feedback lives **next to the problem** when the merchant must act.
> Toasts acknowledge **terminal, non-blocking** outcomes of an action they just took.

If a toast is the only place the full error exists, the design is wrong.

---

## Channel ladder (pick the lowest that fits)

| Channel                  | When                                                                        | Stays until                              | Examples                                               |
| ------------------------ | --------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| **Inline field**         | A specific input is invalid                                                 | Field corrected / next submit            | Required code, bad date, amount out of range           |
| **Section / card error** | Error belongs to a settings block or list row                               | Next successful save or explicit dismiss | Rule form error border, codes table row failure        |
| **Page banner / alert**  | Page-level blocker or recovery path the merchant must see while on the page | Condition clears or dismiss              | Permission denied, channel not ready, conflict on load |
| **Setup checklist**      | Readiness / configuration funnel                                            | Step completed                           | Missing requirements before activate                   |
| **Toast**                | Non-blocking ack of a user-initiated action                                 | Auto (~5s) or sticky if error/action     | “Changes saved”, “Couldn’t delete code. Try again.”    |
| **BackgroundTasks**      | Long-running job                                                            | Task UI                                  | Exports, bulk ops                                      |

**Never** use a toast alone for: billing/permission denials, multi-step triage, field validation, or setup blockers.

---

## When to use a toast

### Do toast

- Success after Save / create / delete / assign the merchant just triggered
- Short failure of that same action when the page already shows context (or a one-line recovery is enough)
- Undo-style confirmations with a single action (`Undo`)
- Terminal state of an async flow (one toast at the end — not start/middle/end)

### Do not toast

- Narrating a multi-step mutation sequence (`Saving…` → `Validating…` → `Saved`)
- Dumping raw GraphQL / API payloads or stack traces
- Repeating the same error on every keystroke or every failed field
- Anything the merchant must still fix **on this page** without a matching inline/banner home
- N toasts for N row failures — aggregate (`3 codes couldn’t be deleted`)

### Pairing rule (Geist)

For serious failures, prefer:

1. **Short toast** (≤ ~6 words in the title sense): `Couldn’t save voucher`
2. **Persistent surface** with the recovery step and enough identity to act

```text
Toast:  Couldn’t save voucher
Page:   banner or field — “End date must be after start date.”
```

---

## Toast quality bar

Our queue: max **3** visible, FIFO overflow, dedupe by `status + title`, dismiss-visible
only when 2+ show. Errors and `actionBtn` stay until dismissed
(`getNotificationDuration` → `Infinity`). See `notificationQueue.tsx`.

### Copy

| Kind             | Shape                                           | Example                             |
| ---------------- | ----------------------------------------------- | ----------------------------------- |
| Success          | `{Noun} {past-participle}` — no “successfully”  | `Voucher saved`, `Codes deleted`    |
| Neutral / cancel | Past tense of what happened                     | `Export canceled`                   |
| Error            | What failed + recovery (two short sentences OK) | `Couldn’t delete codes. Try again.` |
| Warning          | Risk or partial outcome, still scannable        | `Some codes were skipped`           |

- Sentence case. Single-sentence success: **no** trailing period.
- Error: use **Couldn’t** for user/state issues; **Failed to** for system/infra — stay consistent in one flow.
- Match the button verb: Delete → `… deleted`, not `… removed`.
- Title carries the punch; description is optional context — **not** a paragraph.
- Prefer existing `commonMessages` / feature messages over one-off strings.

### Length

Sonner/Geist do **not** ship show-more. Canonical fix is **shorter copy**.

- Default: title only, or title + ≤ 2 short lines of description.
- Our Toast clamps long descriptions (2 lines + chevron) as a **safety net** for legacy/API text — do not rely on it for new work.
- If the full message needs reading time, it belongs in a banner/dialog/checklist, not the toast.

### Behavior

| Status                               | Auto-dismiss                           | Notes                                                                                                                                   |
| ------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| success / info / warning (no action) | ~5s (`DEFAULT_NOTIFICATION_SHOW_TIME`) | Pauses on hover                                                                                                                         |
| error                                | Sticky until dismiss                   | Default; don’t preempt other toasts                                                                                                     |
| error + explicit `autohide`          | That duration                          | Use when field/section already owns recovery (paired ack); prefer `PAIRED_ERROR_NOTIFICATION_SHOW_TIME` (~10s) for save/create failures |
| any + `actionBtn`                    | Sticky until dismiss or action         | One clear action label; wins over `autohide`                                                                                            |

- One terminal toast per user action.
- Deduping replaces same `status + title` — update description if the detail changed; don’t spam.
- Bulk: one aggregated notify, not a toast per row.

### `useNotifier` checklist

```tsx
notify({
  status: "success", // or error | warning | info
  title: intl.formatMessage(messages.voucherSaved), // prefer explicit title
  // text: optional short description
  // actionBtn: only when a single recovery/undo is real
});
```

- Prefer explicit `title`; don’t lean on generic “Error” / “Success” defaults for product flows.
- Pass `actionBtn` only for a safe, single next step (Undo, Open settings) — not primary navigation dumps.
- On save failure: map GraphQL errors to **fields/sections** first; toast is the ack, not the encyclopedia.

---

## Decision tree

```
Did the merchant just complete an action?
  no  → persistent UI only (banner / checklist / empty state). No toast.
  yes → Did it succeed?
          yes → success toast (short). Done.
          no  → Can they fix it on a specific field/section?
                  yes → inline/section error + short error toast (optional if inline is obvious).
                  no  → Is it a page-level / permission / readiness issue?
                          yes → banner or checklist + short error toast.
                          no  → short sticky error toast with recovery sentence;
                                file a follow-up if this keeps happening (wrong surface).
```

---

## Dogfood: vouchers (first)

Use this skill when touching `src/discounts/` voucher create/details/list.

### Audit checklist

- [ ] Save success → one `Voucher saved` / `Changes saved` toast; no second toast from the same submit
- [ ] Field validation (dates, limits, codes) → inline / section errors; toast does not carry the full validation list
- [ ] Code bulk delete / generate failures → aggregated toast; row/section detail if the merchant must retry specifics
- [ ] Permission / channel blockers → banner or checklist, not toast-only
- [ ] No toast on every codes-table refetch or filter change
- [ ] Error toast copy: couldn’t/failed + recovery; sticky by default (or `autohide` when paired with inline/section); no raw API blob in `text`
- [ ] Action buttons on toasts only for real undo/recovery (not “Close”)

### Anti-patterns to remove when found

```tsx
// ❌ Toast-only validation
notify({ status: "error", text: errors.map(e => e.message).join(", ") });

// ❌ Narrating the flow
notify({ status: "info", text: "Saving voucher…" });
notify({ status: "success", text: "Voucher saved successfully." });

// ✅ Terminal ack + inline home for the problem
form.setError("endDate", { message: intl.formatMessage(messages.endBeforeStart) });
notify({
  status: "error",
  title: intl.formatMessage(messages.couldNotSaveVoucher),
  text: intl.formatMessage(messages.checkHighlightedFields),
  autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
});
```

---

## Implementation map

| Concern                      | Where                                                |
| ---------------------------- | ---------------------------------------------------- |
| Notify API                   | `src/hooks/useNotifier/useNotifier.tsx`              |
| Duration / sticky rules      | `src/hooks/useNotifier/utils.ts`                     |
| Queue (cap 3, FIFO, dedupe)  | `src/components/notifications/notificationQueue.tsx` |
| Toast UI (clamp safety net)  | `src/components/notifications/Toast.tsx`             |
| Common success/error strings | `src/intl.ts`, `src/utils/errors/common.ts`          |

---

## Restraint tests

Before shipping feedback:

1. **Squint test** — can you tell success vs failure in under a second?
2. **Absent-toast test** — if the toast never appeared, could the merchant still recover from on-page UI?
3. **Tall-toast test** — if description needs show-more, shorten the copy or move it out of the toast.
4. **Stack test** — would a slow merchant still see the important message with max 3 + FIFO? If not, it shouldn’t be toast-only.
