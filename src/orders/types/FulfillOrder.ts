/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderFulfillInput, OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: FulfillOrder
// ====================================================

export interface FulfillOrder_orderFulfill_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
  warehouse: string | null;
  orderLine: string | null;
}

export interface FulfillOrder_orderFulfill_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface FulfillOrder_orderFulfill_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface FulfillOrder_orderFulfill_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface FulfillOrder_orderFulfill_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: FulfillOrder_orderFulfill_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface FulfillOrder_orderFulfill_order_events_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface FulfillOrder_orderFulfill_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface FulfillOrder_orderFulfill_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: FulfillOrder_orderFulfill_order_events_lines_orderLine | null;
}

export interface FulfillOrder_orderFulfill_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: FulfillOrder_orderFulfill_order_events_user | null;
  lines: (FulfillOrder_orderFulfill_order_events_lines | null)[] | null;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: FulfillOrder_orderFulfill_order_fulfillments_lines_orderLine | null;
}

export interface FulfillOrder_orderFulfill_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface FulfillOrder_orderFulfill_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (FulfillOrder_orderFulfill_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: FulfillOrder_orderFulfill_order_fulfillments_warehouse | null;
}

export interface FulfillOrder_orderFulfill_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface FulfillOrder_orderFulfill_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: FulfillOrder_orderFulfill_order_lines_unitPrice_gross;
  net: FulfillOrder_orderFulfill_order_lines_unitPrice_net;
}

export interface FulfillOrder_orderFulfill_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface FulfillOrder_orderFulfill_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: FulfillOrder_orderFulfill_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: FulfillOrder_orderFulfill_order_lines_unitPrice | null;
  thumbnail: FulfillOrder_orderFulfill_order_lines_thumbnail | null;
}

export interface FulfillOrder_orderFulfill_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface FulfillOrder_orderFulfill_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: FulfillOrder_orderFulfill_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface FulfillOrder_orderFulfill_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface FulfillOrder_orderFulfill_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: FulfillOrder_orderFulfill_order_shippingPrice_gross;
}

export interface FulfillOrder_orderFulfill_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_subtotal {
  __typename: "TaxedMoney";
  gross: FulfillOrder_orderFulfill_order_subtotal_gross;
}

export interface FulfillOrder_orderFulfill_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_total {
  __typename: "TaxedMoney";
  gross: FulfillOrder_orderFulfill_order_total_gross;
  tax: FulfillOrder_orderFulfill_order_total_tax;
}

export interface FulfillOrder_orderFulfill_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface FulfillOrder_orderFulfill_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: FulfillOrder_orderFulfill_order_availableShippingMethods_price | null;
}

export interface FulfillOrder_orderFulfill_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface FulfillOrder_orderFulfill_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface FulfillOrder_orderFulfill_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface FulfillOrder_orderFulfill_order {
  __typename: "Order";
  id: string;
  metadata: (FulfillOrder_orderFulfill_order_metadata | null)[];
  privateMetadata: (FulfillOrder_orderFulfill_order_privateMetadata | null)[];
  billingAddress: FulfillOrder_orderFulfill_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (FulfillOrder_orderFulfill_order_events | null)[] | null;
  fulfillments: (FulfillOrder_orderFulfill_order_fulfillments | null)[];
  lines: (FulfillOrder_orderFulfill_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  shippingAddress: FulfillOrder_orderFulfill_order_shippingAddress | null;
  shippingMethod: FulfillOrder_orderFulfill_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: FulfillOrder_orderFulfill_order_shippingPrice | null;
  status: OrderStatus;
  subtotal: FulfillOrder_orderFulfill_order_subtotal | null;
  total: FulfillOrder_orderFulfill_order_total | null;
  actions: (OrderAction | null)[];
  totalAuthorized: FulfillOrder_orderFulfill_order_totalAuthorized | null;
  totalCaptured: FulfillOrder_orderFulfill_order_totalCaptured | null;
  user: FulfillOrder_orderFulfill_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (FulfillOrder_orderFulfill_order_availableShippingMethods | null)[] | null;
  discount: FulfillOrder_orderFulfill_order_discount | null;
  invoices: (FulfillOrder_orderFulfill_order_invoices | null)[] | null;
  channel: FulfillOrder_orderFulfill_order_channel;
  isPaid: boolean | null;
}

export interface FulfillOrder_orderFulfill {
  __typename: "OrderFulfill";
  errors: FulfillOrder_orderFulfill_errors[];
  order: FulfillOrder_orderFulfill_order | null;
}

export interface FulfillOrder {
  orderFulfill: FulfillOrder_orderFulfill | null;
}

export interface FulfillOrderVariables {
  orderId: string;
  input: OrderFulfillInput;
}
