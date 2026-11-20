---
name: saleor-datetime-display
description: >
  How Saleor shows timestamps to merchants: a coarse label on the page, UTC and
  the local offset in the tooltip. Use when adding or changing relative times,
  date tooltips, Date, DateTime, or MerchantDate.
---

# Date and time display

The page names the event and stays coarse. The tooltip shows two clocks: **UTC**
and the merchant’s offset, each with that clock’s own date and time.

```
UTC      September 14, 2026    12:29:00 PM
GMT+2    September 14, 2026     2:29:00 PM
```

Those dates can differ. Show both.

## When this tooltip earns its space

Use it for a timestamp a merchant may need to match exactly: order placed, created,
timeline events.

Skip it for date-only fields (`Date`). Skip it when a column or group header already
names the calendar day and the cell has no time.

## What the page shows

Follow `MerchantDate`:

- Name the event (`Placed`, `Created`) unless a column or group header already does.
- Under an hour: `Placed 4 minutes ago`. Do not count seconds.
- Today and yesterday: `Placed today at 2:29 PM`.
- Older: a calendar date, with a short time while it is still this year.
- A bare `3 months ago` only when the header already says what the time is.
- `<time dateTime={iso}>` so the machine value stays UTC.

## Tooltip

Two rows only. No second relative line.

1. `UTC` and the local short offset (`GMT+2`, `GMT-5`, `GMT+5:30`) — not only
   `CEST` / `EST`, and not UTC alone.
2. Each row shows that clock’s own calendar date and time, including seconds.

Use macaw `Tooltip` (hover and focus). `src/components/Date/DateTime.tsx` and
`MerchantDate.tsx` currently show one local clock. When you next touch them, add
the UTC row. Extend `MerchantDate` when the label names the event, and `DateTime`
when a header already does.

## Do not

- Show raw ISO (`2026-09-14T12:29:00Z`) to the merchant.
- Put only the local clock in the tooltip and call the pattern done.
- Replace `Placed today at 2:29 PM` with a coarser `4 hours ago`.
- Add another date component. `Date` stays date-only.
