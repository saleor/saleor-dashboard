import { defineMessages } from "react-intl";

export const messages = defineMessages({
  channelColumn: {
    id: "ub6zar",
    defaultMessage: "Channel",
    description: "channels list column",
  },
  statusColumn: {
    id: "N2RGVh",
    defaultMessage: "Status",
    description: "channel list column",
  },
  setupColumn: {
    id: "gM6g0w",
    defaultMessage: "Setup",
    description: "channels list setup/health column",
  },
  coverageColumn: {
    id: "CsnhUR",
    defaultMessage: "Coverage",
    description: "channels list warehouses and shipping zones column",
  },
  channelMeta: {
    id: "t3CUFs",
    defaultMessage: "{slug} · {currency} · {country}",
    description: "secondary channel identity line on list",
  },
  statusActive: {
    id: "HBrAXs",
    defaultMessage: "Active",
    description: "channel status",
  },
  statusInactive: {
    id: "rZh6/D",
    defaultMessage: "Inactive",
    description: "channel status",
  },
  needsWarehouseAndShipping: {
    id: "MFPmoe",
    defaultMessage: "Needs warehouse and shipping zone",
    description: "channel list setup hint",
  },
  needsWarehouse: {
    id: "QqClcr",
    defaultMessage: "Needs warehouse",
    description: "channel list setup hint",
  },
  needsShipping: {
    id: "WiR1jA",
    defaultMessage: "Needs shipping zone",
    description: "channel list setup hint",
  },
  warehousesCount: {
    id: "tiAQ48",
    defaultMessage: "{count, plural, one {# warehouse} other {# warehouses}}",
    description: "accessible label for warehouse count on channels list",
  },
  shippingZonesCount: {
    id: "JGmMYz",
    defaultMessage: "{count, plural, one {# shipping zone} other {# shipping zones}}",
    description: "accessible label for shipping zone count on channels list",
  },
});
