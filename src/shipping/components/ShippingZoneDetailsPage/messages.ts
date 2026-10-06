import { defineMessages } from "react-intl";

export const messages = defineMessages({
  saveCompositionGeneral: {
    id: "m3tAcs",
    defaultMessage: "general",
    description: "Save composition segment for shipping zone name and description",
  },
  saveCompositionChannels: {
    id: "6YiZ6R",
    defaultMessage: "channels",
    description: "Save composition segment for shipping zone channel assignment",
  },
  saveCompositionWarehouses: {
    id: "F1s09x",
    defaultMessage: "warehouses",
    description: "Save composition segment for shipping zone warehouse assignment",
  },
  countries: {
    id: "55LMJv",
    defaultMessage: "Countries",
    description: "country list header",
  },
  unlinkWarehousesTitle: {
    id: "Vo2VDa",
    defaultMessage: "Unlink locations?",
    description: "confirm removing a channel that unlinks warehouses from the zone",
  },
  unlinkWarehousesBody: {
    id: "BTq6zF",
    defaultMessage:
      "{warehouses} will be unlinked from this zone, because they share no other channel.",
    description: "warehouses that lose their only shared channel",
  },
  noCountriesAssigned: {
    id: "y7mfbl",
    defaultMessage: "Currently, there are no countries assigned to this shipping zone",
  },
});
