---
name: saleor-dashboard-forms
description: >
  Rules for Saleor Dashboard create and detail forms: unsaved-changes (dirty) state and the
  Savebar, what the form shows after a save, validating before any request, saves that run
  several mutations, request-level errors, date and time inputs, and time zones. Use when
  building or fixing a form on the legacy `useForm`/`Form` or react-hook-form, a save
  handler, a schedule or date field, or when auditing an existing detail page. Includes an
  audit checklist and edge values to try.
---

# Saleor Dashboard Forms

Most form bugs found in an external QA benchmark of the voucher screens came from a few
patterns: a form that disagrees with what the server stored, a save that half-succeeds,
and date inputs that look empty when they aren't. Check each one when you build or fix a
form.

**Also see:** [`saleor-dashboard-lists`](../saleor-dashboard-lists/SKILL.md) (tables
inside the page), `saleor-dashboard-feedback` (where errors and success are shown) and
`saleor-dashboard-entity-detail` (page anatomy), both in `.claude/skills/`.

---

## 1. "Unsaved changes" means different from what the server stores

- **Load and edit the same representation.** If the page loads a value one way and a
  control writes it another way, switching away and back leaves a change nobody made.
  Example: a saved shipping voucher loads with type `SHIPPING`, so choosing Free shipping
  must write `SHIPPING`, not `ENTIRE_ORDER`.
- **Normalize before comparing**: `0` vs `""` vs `null`, `"10"` vs `"10.00"`, an empty
  start date vs the date the API fills in.
- **Switched-off controls don't count.** Values left in a disabled requirement, an
  unchecked "Set end date" or the inactive amount type are neither dirty nor sent. Clear
  or skip each one before saving. `clearInactiveVoucherDiscountDrafts`
  (`src/discounts/data.ts`) covers only the inactive amount type. The voucher save
  handlers (`src/discounts/views/VoucherCreate/handlers.ts`,
  `src/discounts/views/VoucherDetails/handlers.ts`) drop the requirement and the end date
  inline (`requirementsPicker` checks, `hasEndDate ? … : null`).
- Derive the exit-dialog dirty flag from that same comparison (`FormDirtyStateSync`), not
  from ad hoc `triggerChange` calls.

## 2. After a successful save, show what was saved

The legacy `useForm` merges new initial data into the form and keeps the user's value for
every field whose server value didn't change. When the server stores the same value as
before (a minimum of 0 stored as "no requirement", a cleared start date stored as today),
the draft stays on screen as an unsaved change that no save can clear.

- After a fully successful save, reload the entity, then reset the form to it: `Form`
  (and `useForm`, `useStateFromProps`, `useChannels`) take a `resetKey`; bump it once the
  reload resolves. With react-hook-form, call `reset()` with the reloaded values.
- Keep the page disabled until the reload finishes, so the reset can't drop edits made
  in the meantime. Skip the reset if the user opened another entity meanwhile.
- A failed save keeps the drafts. A failed reload keeps them too; don't leave an
  unhandled promise.
- Check it: after Save, the Savebar is clean, Save is disabled, leaving doesn't prompt,
  and a page reload shows the same values.

## 3. Validate before the first request

The API accepts values the merchant didn't mean, silently:

- Integer fields truncate: `1.5` is stored as `1`. Require whole numbers.
- Decimals are rounded: a tiny percentage can be stored as `0`, so the discount goes live
  at 0%. Limit decimals and reject 0 where it means nothing.
- Some fields accept `0` and treat it as "off" (a usage limit of 0). Require at least 1
  while the setting is on.
- Percentages above 100 are only checked against the stored type; check them in the
  dashboard for every channel.

Show these as inline errors and keep Save off while any field shows one (see
`getDiscountValueIssue` and `getWholeNumberIssue` in `src/discounts/voucherValueValidation.ts`).

## 4. Saves that run several mutations

One Save often runs several requests (details, channel values, assignments, codes).

- **Order the steps** so dependent ones run after what they depend on, and **stop at the
  first failure**. Requests sent in parallel leave half-saved entities, e.g. a type change
  saved while its channel values were rejected.
- **Report what was saved.** Name the parts that went through and the part that failed,
  and drop saved drafts so saving again doesn't send them twice.
- **Create flows**: validate everything before the create mutation. If a later step
  still fails, delete the created entity (and treat "not found" as already gone), or
  open it with the failure shown, so a retry doesn't hit "code already exists".
- **Request-level errors are failures.** A mutation hook with `onError` resolves with
  `errors` and no `data`; reading only `data.x.errors` turns that into a success toast.
  Collect both (see `getVoucherSaveRequestErrors` in `src/discounts/voucherSaveRequestErrors.ts`).
- One terminal toast per Save: success only when every step succeeded.
- **The shared `useMutation` already toasts errors.** `src/hooks/makeMutation.ts` shows an
  error toast for every request error and every payload error. A save that reports its
  own summary must pass `disableErrorHandling: true` to its mutations, or the merchant
  gets one toast per failed step plus the summary. That flag also skips the shared
  session-expired logout and read-only message, so the save must still handle those.

## 5. Dates, times and time zones

- **Partly typed native inputs report `""`.** `<input type="date">` and `type="time"`
  give an empty value until fully typed. Tell "partly typed" from "empty" with
  `event.target.validity.badInput` on change and blur, and block Save with "Enter a
  complete date" (see `getNextIncompleteScheduleFields` in
  `src/discounts/components/DiscountDates/incompleteScheduleFields.ts`).
- **Never fill in silently.** A partly typed time must not become 00:00, and a half-typed
  end date must not become "no end date". A fully cleared time is a different case:
  `joinDateTime` (`src/misc.ts`) sends it as 00:00, and the voucher forms accept that.
  If a form needs an explicit time, require it.
- **Required while switched on**: "Set end date" checked means End Date is required.
- **Send absolute times.** A bare local time is read as UTC. Combine date and time with
  `joinDateTime` (`src/misc.ts`), which adds the browser's offset, or build
  `2025-01-31T00:00` and convert it with `new Date(…).toISOString()`. Don't pass a
  date-only value (`new Date("2025-01-31")` is UTC midnight, not local) or a space
  between date and time (Invalid Date in some Safari versions).
- **Test in a non-UTC zone.** Jest runs in UTC, which hides offset bugs. Check in a
  browser context with another `timezoneId`.
- A status that depends on time (Scheduled, Active, Ended) must update when the time
  passes, or be computed when shown.

## 6. Leaving and deleting

- After deleting an entity with unsaved edits, clear the dirty state before navigating,
  or the leave prompt appears for something that no longer exists.
- Ignore changes must actually discard them, including after the browser's Back button.

---

## Audit checklist

- [ ] Change a field and change it back: no unsaved changes.
- [ ] Switch a mode or scope away and back: no unsaved changes.
- [ ] Save edge values and reload: the screen after Save equals the reloaded page, and
      the Savebar is clean. Try `0`, empty, `1.5`, `101` (percent), `0.0001`, a value
      in a switched-off control, a cleared start date.
- [ ] Every value the API would truncate, round or reinterpret is blocked inline before
      the request.
- [ ] Make one step of a multi-step save fail: nothing after it runs, the message says
      what was saved, and saving again doesn't duplicate anything.
- [ ] Make the create step succeed and a later step fail: no half-created entity is left
      behind, or the merchant lands on it with the failure shown.
- [ ] A request-level error (e.g. a value too large for the API) shows a failure, not
      "Saved".
- [ ] Half-typed dates and times block Save with an inline error.
- [ ] Dates round-trip unchanged in a non-UTC browser zone.
- [ ] Delete with unsaved edits: no leave prompt afterwards.

## Verifying in the browser

Script the cases against a local API (Playwright from the repo's `@playwright/test`):
create a disposable entity through the API, drive the form, read the Savebar text and the
Save button state after saving, then read the entity back through the API and compare.
Run the same script with the fix reverted to prove it reproduces.

- **Type with the keyboard** (`page.keyboard.type`, `Backspace` in a date segment).
  Setting values through JavaScript skips how inputs behave while typing: a number field
  that drops a typed leading zero, or a date input that is only partly filled.
- Use a non-UTC `timezoneId` for anything with dates (section 5).
- Listen for `dialog` events when you check leave prompts. Playwright accepts a
  `beforeunload` dialog on its own, and Chrome shows one only after a real user gesture
  on the page.
