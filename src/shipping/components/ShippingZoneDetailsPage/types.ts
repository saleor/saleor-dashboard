import { type MetadataFormData } from "@dashboard/components/Metadata";
import { type Option } from "@macaw-ui";

export interface ShippingZoneUpdateFormData extends MetadataFormData {
  name: string;
  description: string;
  warehouses: Option[];
  channels: Option[];
}
