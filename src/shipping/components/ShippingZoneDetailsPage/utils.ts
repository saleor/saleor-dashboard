// @ts-strict-ignore
import { type ShippingZoneQuery } from "@dashboard/graphql";

import { type ShippingZoneUpdateFormData } from "./types";

export const getInitialFormData = (
  shippingZone?: ShippingZoneQuery["shippingZone"],
): ShippingZoneUpdateFormData => ({
  description: shippingZone?.description || "",
  name: shippingZone?.name || "",
  warehouses:
    shippingZone?.warehouses?.map(warehouse => ({ label: warehouse.name, value: warehouse.id })) ||
    [],
  channels: shippingZone?.channels.map(({ id, name }) => ({ label: name, value: id })) || [],
});
