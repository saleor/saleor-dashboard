import { MetadataFormData } from "@dashboard/components/Metadata";
import { Option } from "@saleor/macaw-ui-next";

export interface ShippingZoneUpdateFormData extends MetadataFormData {
  name: string;
  description: string;
  warehouses: string[];
  channels: Option[];
}
