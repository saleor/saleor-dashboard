import { type AddressTypeInput } from "@dashboard/customers/types";
import { type WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

export interface WarehouseDetailsPageFormData extends AddressTypeInput {
  name: string;
  email: string;
  isPrivate: boolean;
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
}
