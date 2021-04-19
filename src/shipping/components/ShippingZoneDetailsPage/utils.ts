import { ShippingZone_shippingZone } from "@saleor/shipping/types/ShippingZone";
import { mapMetadataItemToInput } from "@saleor/utils/maps";

import { FormData } from "./types";

export const getInitialFormData = (
  shippingZone?: ShippingZone_shippingZone
): FormData => ({
  description: shippingZone?.description || "",
  metadata: shippingZone?.metadata.map(mapMetadataItemToInput),
  name: shippingZone?.name || "",
  privateMetadata: shippingZone?.privateMetadata.map(mapMetadataItemToInput),
  warehouses: shippingZone?.warehouses?.map(warehouse => warehouse.id) || [],
  channels: shippingZone?.channels.map(({ id }) => id) || []
});
