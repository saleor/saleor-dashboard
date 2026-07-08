import { type AddressInput, type AddressTypeEnum } from "@dashboard/graphql";

export const ORDER_CUSTOMER_ADDRESSES_EDIT_FORM_ID = "order-customer-addresses-edit-form";

export interface OrderCustomerSearchAddressState {
  open: boolean;
  type: AddressTypeEnum;
}
export interface OrderCustomerAddressesEditDialogOutput {
  shippingAddress: AddressInput;
  billingAddress: AddressInput;
}
export enum AddressEditDialogVariant {
  CHANGE_CUSTOMER,
  CHANGE_SHIPPING_ADDRESS,
  CHANGE_BILLING_ADDRESS,
}
