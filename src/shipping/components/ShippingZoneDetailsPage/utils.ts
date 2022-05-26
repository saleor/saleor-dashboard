import { ShippingZoneQuery } from "@saleor/graphql";
import { mapMetadataItemToInput } from "@saleor/utils/maps";

import { ShippingZoneUpdateFormData } from "./types";

export const getInitialFormData = (
  shippingZone?: ShippingZoneQuery["shippingZone"],
): ShippingZoneUpdateFormData => ({
  description: shippingZone?.description || "",
  metadata: shippingZone?.metadata.map(mapMetadataItemToInput),
  name: shippingZone?.name || "",
  privateMetadata: shippingZone?.privateMetadata.map(mapMetadataItemToInput),
  warehouses: shippingZone?.warehouses?.map(warehouse => warehouse.id) || [],
  channels: shippingZone?.channels.map(({ id }) => id) || [],
});
