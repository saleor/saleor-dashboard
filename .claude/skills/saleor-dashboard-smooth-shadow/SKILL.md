---
name: saleor-dashboard-smooth-shadow
description: >
  Use shadows sparingly on elevated surfaces (modal, popover, dropdown, menu, tooltip,
  sheet, toast, floating checklist). When elevation is needed, use smooth-shadow-ring
  (hairline baked into the shadow stack) — never border + shadow together. Saleor
  Dashboard implements this in CSS Modules (see ChannelSetupCard); upstream pattern
  from shadow-plugin for Tailwind.
---

# Elevated surfaces: smooth-shadow-ring (sparingly)

**Policy:** Saleor Dashboard is mostly **flat bordered surfaces** (`DetailSettingsCard`, sidebar ops cards, datagrids). Use **shadow elevation only when the UI truly floats** above the page — modals, popovers, dropdowns, menus, tooltips, sheets, toasts, and rare emphasis (e.g. channel setup checklist). Default to border + background tokens, not shadow.

**Also see:** [`saleor-dashboard-styles`](./saleor-dashboard-styles/SKILL.md) (tokens, CSS Modules), [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md) (flat cards vs elevated checklist).

---

## Upstream pattern (credit)

The `smooth-shadow-ring` rule and Tailwind utilities come from **[shadow-plugin](https://github.com/flornkm/shadow-plugin)** ([shadow.floriankiem.com](https://shadow.floriankiem.com/)).

Created by **Nils Eller**, **Eduard Wieandt**, and **Florian Kiem**, in collaboration with **[Rogo](https://rogo.ai/)**.

This repo does **not** install `shadow-plugin` (we use macaw-ui + CSS Modules). Port the **stack + hairline ring** idea manually when needed — see [Dashboard implementation](#dashboard-implementation) below.

The agent skill text below is adapted from shadow-plugin’s published `smooth-shadow-ring` skill (same rules; wording preserved where possible).

---

## When this applies

Any element that floats above the page surface: cards, dialogs, modals,
popovers, dropdowns, menus, tooltips, sheets, toasts, command palettes.

**In Saleor Dashboard:** apply only to those floating layers — **not** to in-page settings cards that sit on the same plane as the content column.

## The problem

Putting a `border-*` (or `ring-*`) and a `shadow-*` on the same element draws
two stacked edges: the border paints a hard 1px stroke, and the shadow begins
just outside it. The result is a visible double border, a crisp line then a
soft one. It looks heavy, greyed, and cheap.

## The rule

If you are about to write a `border-*` or `ring-*` class next to any `shadow-*`
on an elevated surface, use `smooth-shadow-ring-{size}` instead. It bakes a 1px
hairline ring into the final shadow layer, so the edge dissolves into the shadow
as one continuous stroke.

- `border shadow-md` → `smooth-shadow-ring-md`
- `ring-1 ring-neutral-200 shadow-lg` → `smooth-shadow-ring-lg`
- Sizes: `smooth-shadow-ring-xs`, `-sm`, `-md` (or bare `smooth-shadow-ring`), `-lg`, `-xl`, `-2xl`
- Never keep a `border` or `ring` on an element that already has
  `smooth-shadow-ring-*`. The ring is already in there; a second edge doubles up.
- If the surface should have no edge stroke at all, use plain
  `shadow-{size}` (no ring), not a border.

## Coloring

The ring and shadow tint independently and compose on the same element:

- `shadow-{color}` tints the shadow, e.g. `shadow-blue-500`
- `smooth-ring-{color}` tints the ring, e.g. `smooth-ring-black/10`, `smooth-ring-blue-500/40`

The ring defaults to `rgba(0,0,0,0.05)` and flips to `rgba(255,255,255,0.18)`
in dark mode — under `prefers-color-scheme`, a `.dark` class, or
`data-theme="dark"` alike.

The dark alpha is much higher than the light one on purpose. The ring paints
outside the surface, so its rendered colour comes from the page behind it, not
from the surface it outlines. A white hairline therefore lightens _toward_ a
raised dark surface, and too low an alpha makes the edge land on the surface's
own colour and disappear. If a surface is light enough to sit near the ring
anyway (`neutral-700` and up on a dark page), set `smooth-ring-*` explicitly.

## Example

```html
<!-- Wrong: border + shadow renders a double edge -->
<div class="rounded-2xl border border-neutral-200 shadow-md">…</div>

<!-- Right: one continuous edge -->
<div class="rounded-2xl smooth-shadow-ring-md">…</div>

<!-- Right: tuned ring + tinted shadow -->
<div class="rounded-2xl smooth-shadow-ring-md smooth-ring-black/10 shadow-blue-500">…</div>
```

---

## Dashboard implementation

This project uses **CSS Modules** and **macaw tokens**, not Tailwind `smooth-shadow-ring-*` classes.

### Reference port

[`ChannelSetupCard.module.css`](../../src/channels/components/ChannelSetupCard/ChannelSetupCard.module.css) — port of `smooth-shadow-ring-sm`:

- Stacked soft `box-shadow` layers
- Final layer: `0 0 0 1px var(--smooth-ring-color)` (hairline in the stack)
- **`border: none`** on the elevated element — remove any component default border that would double the edge
- Light: `--smooth-ring-color: rgba(0, 0, 0, 0.05)`
- Dark: `.elevatedDark` → `rgba(255, 255, 255, 0.18)`

Copy that pattern for new elevated surfaces; tune size by adjusting the stacked shadow values from [shadow.floriankiem.com](https://shadow.floriankiem.com/) for the desired `-sm` / `-md` / `-lg` preset.

### Flat vs elevated

| Surface                                                 | Treatment                                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `DetailSettingsCard`, `AssignListCard`, datagrid chrome | **Flat** — `border: 1px solid var(--mu-colors-border-default1)`, no shadow  |
| `DashboardModal`, Macaw `Popover`, dropdown menus       | Use macaw primitives; if adding custom elevation, follow smooth-shadow-ring |
| `SetupChecklist` / channel setup emphasis               | **Elevated** — `.elevated` / `.elevatedDark` in ChannelSetupCard            |

### Checklist before shipping elevation

- [ ] Is this surface actually floating? If not, use border only.
- [ ] Removed `border` / `ring` from the same node that has the shadow stack?
- [ ] Hairline is the **last** shadow layer (`0 0 0 1px …`)?
- [ ] Dark theme ring alpha tested (white hairline on dark page)?
- [ ] Shadow is subtle — if it reads as “drop shadow on every card”, remove it.
