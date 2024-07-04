// @ts-strict-ignore
import { ShippingZoneQuery } from "@dashboard/graphql";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";

import { ShippingZoneUpdateFormData } from "./types";

export const getInitialFormData = (
  shippingZone?: ShippingZoneQuery["shippingZone"],
): ShippingZoneUpdateFormData => ({
  description: shippingZone?.description || "",
  metadata: shippingZone?.metadata.map(mapMetadataItemToInput),
  name: shippingZone?.name || "",
  privateMetadata: shippingZone?.privateMetadata.map(mapMetadataItemToInput),
  warehouses:
    shippingZone?.warehouses?.map(warehouse => ({
      label: warehouse.name,
      value: warehouse.id,
    })) || [],
  channels:
    shippingZone?.channels.map(({ id, name }) => ({
      label: name,
      value: id,
    })) || [],
});
