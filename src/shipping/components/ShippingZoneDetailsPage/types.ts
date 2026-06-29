import { type Option } from "@saleor/macaw-ui-next";

export interface ShippingZoneUpdateFormData {
  name: string;
  description: string;
  warehouses: Option[];
  channels: Option[];
}
