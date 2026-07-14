export enum CustomerChangeActionEnum {
  KEEP_ADDRESS = "keepAddress",
  CHANGE_ADDRESS = "changeAddress",
}

export interface OrderCustomerChangeData {
  changeActionOption: CustomerChangeActionEnum;
}
