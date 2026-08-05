---
name: saleor-dashboard-microcopy
description: >
  Patterns for helper text, card subheaders, and inline links in Saleor Dashboard.
  Use when adding or styling hints below section titles, explanatory copy above form
  fields, microcopy with navigation links, or replacing buttons with guidance text.
  Covers DashboardCard.Subtitle and MicrocopyLink — not accent Link or body paragraphs.
---

# Saleor Dashboard Microcopy

Secondary explanatory copy under a title or field: **subheaders**, **hints**, **helper text**. Distinct from card titles, labels, and primary `@dashboard/components/Link` (accent navigation).

## Subheader / hint text

Match **Order Value** and **Order Weight** card subtitles:

```tsx
import { DashboardCard } from "@dashboard/components/Card";
import { FormattedMessage } from "react-intl";

<DashboardCard.Subtitle fontSize={3} color="default2">
  <FormattedMessage {...messages.hint} />
</DashboardCard.Subtitle>;
```

| Do                                                             | Don't                                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `DashboardCard.Subtitle` + `fontSize={3}` + `color="default2"` | Bare `<FormattedMessage />` in card content (inherits wrong size/color)       |
| Same style for all paragraphs in a hint block                  | `Text size={2}` or `size={3}` alone (drifts from card subtitle token)         |
| `CardSpacer` between hint and the control below                | Smaller gray `Text` for some lines and body text for others in the same block |

### Placement

- **Under `DashboardCard.Title`** (in `DashboardCard.Header`): subtitle directly below title in a column `Box` — see `OrderValue`, `OrderWeight`.
- **Above a field inside `DashboardCard.Content`**: subtitle before `Multiselect` / inputs — see `ChannelsSection`, `WarehousesSection`.
- **Below a field**: subtitle after the control — see `ShippingMethodTaxes` tax-class hint.
- **Entity detail `DetailSettingsCard`**: long leading copy in the card’s **`intro` row** (bordered band below header), not in the tinted title band — see Payment gateways, collection SEO. Short Complete/Incomplete status can live in `intro` too.

### Reference files

- `src/shipping/components/OrderValue/OrderValue.tsx`
- `src/shipping/components/OrderWeight/OrderWeight.tsx`
- `src/shipping/components/ShippingZoneSettingsCard/ChannelsSection.tsx`
- `src/shipping/components/ShippingZoneSettingsCard/WarehousesSection.tsx`
- `src/shipping/components/ShippingMethodTaxes/ShippingMethodTaxes.tsx`

- `src/shipping/components/ShippingMethodTaxes/ShippingMethodTaxes.tsx`
- `src/channels/components/ChannelPaymentGatewaysSection/ChannelPaymentGatewaysSection.tsx`
- `src/collections/components/CollectionDetailsPage/CollectionDetailsPage.tsx` (SEO `intro`)

## Optional labels

Mark optional sections/fields without brackets or title-case noise.

| Do                                                                           | Don't                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `DetailSettingsCardTitle` + `optional` prop → `DetailSettingsOptionalLabel`  | `"Background Image (optional)"` in the title string |
| `commonMessages.optionalField` for field helper text (`Optional`, no parens) | `"(Optional)"` in helper text                       |
| `Text size={2} color="default2"` beside the title (baseline-aligned)         | Same size/weight as the section title               |

```tsx
import { DetailSettingsCardTitle } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";

<DetailSettingsCardTitle optional>
  <FormattedMessage defaultMessage="Background image" />
</DetailSettingsCardTitle>;
```

## Inline links inside hints

Use **`MicrocopyLink`** (`src/components/MicrocopyLink.tsx`), not `@dashboard/components/Link`.

```tsx
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { sectionNames } from "@dashboard/intl";
import { warehouseListUrl } from "@dashboard/warehouses/urls";

<DashboardCard.Subtitle fontSize={3} color="default2">
  <FormattedMessage
    {...messages.createWarehouseHint}
    values={{
      link: (
        <MicrocopyLink to={warehouseListUrl()}>
          <FormattedMessage {...sectionNames.warehouses} />
        </MicrocopyLink>
      ),
    }}
  />
</DashboardCard.Subtitle>;
```

### MicrocopyLink rules

| Property   | Value                                           | Why                                                         |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------- |
| Color      | `inherit`                                       | Same gray as parent subtitle (`default2`) — not accent blue |
| Size       | `__fontSize="inherit"`                          | Same size as surrounding sentence — not default `Text` size |
| Weight     | `fontWeight="medium"`                           | Only visual difference from body of hint                    |
| Decoration | none; `textDecoration={{ hover: "underline" }}` | Underline on hover only                                     |

### When to use which link

| Component                                      | Use for                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `MicrocopyLink`                                | Links embedded in hint/subtitle sentences (inherit color; underline on hover)                                |
| `Link color="secondary"`                       | In-component / card / sidebar navigation — **prefer this** (`default1`, underline on hover; not accent blue) |
| `Link` (default `primary`)                     | Rare emphasis where accent blue is intentional (legacy tables/actions)                                       |
| `ChannelDisplay` / `ChannelDetailsLink`        | Channel name + globe icon (read-only or link to channel details) — see styles skill                          |
| `InternalLink` / `RouterLink` in custom `Text` | Avoid — duplicate styling; extend `MicrocopyLink` or use `Link color="secondary"`                            |

**Hover is required** for every interactive link: underline and/or color change. See [`saleor-dashboard-styles`](./saleor-dashboard-styles/SKILL.md) → Interactive affordances.

## i18n

- Define copy in `defineMessages` with `description` for translators.
- Put the link target in `values` (`{link}`, `{taxSettingsLink}`, etc.); keep URL helpers in the component (`warehouseListUrl()`, `taxClassesListUrl()`).
- Reuse `sectionNames.*` for configuration area names when linking to settings sections.

## UX guidance (hints vs modals)

When backend rules make in-context creation fragile (e.g. warehouse must share a channel with the shipping zone), prefer **hint + link to configuration** over an inline create modal on the same page. State the constraint in subtitle copy; link to the list/create flow where the entity is fully configured.

## Checklist

- [ ] Hint uses `DashboardCard.Subtitle fontSize={3} color="default2"`
- [ ] All hint paragraphs in the same block use the same subtitle wrapper
- [ ] Inline links use `MicrocopyLink` with inherit color/size
- [ ] No accent-colored links inside gray hint text
- [ ] `CardSpacer` between hint blocks and form controls
- [ ] Optional sections use `DetailSettingsCardTitle optional`, not “(optional)” in the title
- [ ] Messages extracted with `defineMessages` + `FormattedMessage`

## Related skills

- [`saleor-dashboard-entity-detail`](./saleor-dashboard-entity-detail/SKILL.md) — entity detail surfaces vs Configuration
- Layout/spacing/tokens: `saleor-dashboard-styles`
- Detail page structure: `saleor-dashboard-detail-pages`
