import { AddressInput } from "@saleor/graphql";

export interface OrderCustomerAddressesEditDialogOutput {
  shippingAddress: AddressInput;
  billingAddress: AddressInput;
}

export type AddressEditDialogVariant =
  | "CHANGE_CUSTOMER_ADDRESS"
  | "CHANGE_SHIPPING_ADDRESS"
  | "CHANGE_BILLING_ADDRESS";
