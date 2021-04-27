/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderUpdateShippingInput, OrderErrorCode, AddressTypeEnum, OrderDiscountType, DiscountValueTypeEnum, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderShippingMethodUpdate
// ====================================================

export interface OrderShippingMethodUpdate_orderUpdateShipping_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderShippingMethodUpdate_orderUpdateShipping_order_availableShippingMethods_price | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_total_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_total {
  __typename: "TaxedMoney";
  tax: OrderShippingMethodUpdate_orderUpdateShipping_order_total_tax;
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_total_gross;
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_total_net;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_shippingMethod_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderShippingMethodUpdate_orderUpdateShipping_order_shippingMethod_price | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_shippingPrice_gross;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderShippingMethodUpdate_orderUpdateShipping_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_discounts_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_discounts {
  __typename: "OrderDiscount";
  id: string;
  type: OrderDiscountType;
  calculationMode: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderShippingMethodUpdate_orderUpdateShipping_order_discounts_amount;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderShippingMethodUpdate_orderUpdateShipping_order_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderShippingMethodUpdate_orderUpdateShipping_order_events_discount_oldAmount | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_discount_oldAmount | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  itemName: string | null;
  discount: OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_discount | null;
  orderLine: OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines_orderLine | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  discount: OrderShippingMethodUpdate_orderUpdateShipping_order_events_discount | null;
  relatedOrder: OrderShippingMethodUpdate_orderUpdateShipping_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderShippingMethodUpdate_orderUpdateShipping_order_events_user | null;
  lines: (OrderShippingMethodUpdate_orderUpdateShipping_order_events_lines | null)[] | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross;
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_undiscountedUnitPrice;
  unitPrice: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_unitPrice;
  thumbnail: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines_orderLine | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments_warehouse | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_undiscountedUnitPrice_gross;
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_undiscountedUnitPrice_net;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitPrice_gross;
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitPrice_net;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_undiscountedUnitPrice;
  unitPrice: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_unitPrice;
  thumbnail: OrderShippingMethodUpdate_orderUpdateShipping_order_lines_thumbnail | null;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderShippingMethodUpdate_orderUpdateShipping_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_subtotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_subtotal_gross;
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_subtotal_net;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_undiscountedTotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_undiscountedTotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_undiscountedTotal {
  __typename: "TaxedMoney";
  net: OrderShippingMethodUpdate_orderUpdateShipping_order_undiscountedTotal_net;
  gross: OrderShippingMethodUpdate_orderUpdateShipping_order_undiscountedTotal_gross;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
  slug: string;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping_order {
  __typename: "Order";
  availableShippingMethods: (OrderShippingMethodUpdate_orderUpdateShipping_order_availableShippingMethods | null)[] | null;
  total: OrderShippingMethodUpdate_orderUpdateShipping_order_total;
  id: string;
  shippingMethod: OrderShippingMethodUpdate_orderUpdateShipping_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderShippingMethodUpdate_orderUpdateShipping_order_shippingPrice;
  metadata: (OrderShippingMethodUpdate_orderUpdateShipping_order_metadata | null)[];
  privateMetadata: (OrderShippingMethodUpdate_orderUpdateShipping_order_privateMetadata | null)[];
  billingAddress: OrderShippingMethodUpdate_orderUpdateShipping_order_billingAddress | null;
  isShippingRequired: boolean;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  discounts: OrderShippingMethodUpdate_orderUpdateShipping_order_discounts[] | null;
  events: (OrderShippingMethodUpdate_orderUpdateShipping_order_events | null)[] | null;
  fulfillments: (OrderShippingMethodUpdate_orderUpdateShipping_order_fulfillments | null)[];
  lines: (OrderShippingMethodUpdate_orderUpdateShipping_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderShippingMethodUpdate_orderUpdateShipping_order_shippingAddress | null;
  status: OrderStatus;
  subtotal: OrderShippingMethodUpdate_orderUpdateShipping_order_subtotal;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderShippingMethodUpdate_orderUpdateShipping_order_totalAuthorized;
  totalCaptured: OrderShippingMethodUpdate_orderUpdateShipping_order_totalCaptured;
  undiscountedTotal: OrderShippingMethodUpdate_orderUpdateShipping_order_undiscountedTotal;
  user: OrderShippingMethodUpdate_orderUpdateShipping_order_user | null;
  userEmail: string | null;
  invoices: (OrderShippingMethodUpdate_orderUpdateShipping_order_invoices | null)[] | null;
  channel: OrderShippingMethodUpdate_orderUpdateShipping_order_channel;
  isPaid: boolean;
}

export interface OrderShippingMethodUpdate_orderUpdateShipping {
  __typename: "OrderUpdateShipping";
  errors: OrderShippingMethodUpdate_orderUpdateShipping_errors[];
  order: OrderShippingMethodUpdate_orderUpdateShipping_order | null;
}

export interface OrderShippingMethodUpdate {
  orderUpdateShipping: OrderShippingMethodUpdate_orderUpdateShipping | null;
}

export interface OrderShippingMethodUpdateVariables {
  id: string;
  input: OrderUpdateShippingInput;
}
