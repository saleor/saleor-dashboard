/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderLineInput, OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderLineUpdate
// ====================================================

export interface OrderLineUpdate_draftOrderLineUpdate_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineUpdate_draftOrderLineUpdate_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_events_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: OrderLineUpdate_draftOrderLineUpdate_order_events_lines_orderLine | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_events {
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
  user: OrderLineUpdate_draftOrderLineUpdate_order_events_user | null;
  lines: (OrderLineUpdate_draftOrderLineUpdate_order_events_lines | null)[] | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines_orderLine | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderLineUpdate_draftOrderLineUpdate_order_fulfillments_warehouse | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineUpdate_draftOrderLineUpdate_order_lines_unitPrice_gross;
  net: OrderLineUpdate_draftOrderLineUpdate_order_lines_unitPrice_net;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineUpdate_draftOrderLineUpdate_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineUpdate_draftOrderLineUpdate_order_lines_unitPrice | null;
  thumbnail: OrderLineUpdate_draftOrderLineUpdate_order_lines_thumbnail | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineUpdate_draftOrderLineUpdate_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderLineUpdate_draftOrderLineUpdate_order_shippingPrice_gross;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderLineUpdate_draftOrderLineUpdate_order_subtotal_gross;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_total {
  __typename: "TaxedMoney";
  gross: OrderLineUpdate_draftOrderLineUpdate_order_total_gross;
  tax: OrderLineUpdate_draftOrderLineUpdate_order_total_tax;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderLineUpdate_draftOrderLineUpdate_order_availableShippingMethods_price | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderLineUpdate_draftOrderLineUpdate_order {
  __typename: "Order";
  id: string;
  metadata: (OrderLineUpdate_draftOrderLineUpdate_order_metadata | null)[];
  privateMetadata: (OrderLineUpdate_draftOrderLineUpdate_order_privateMetadata | null)[];
  billingAddress: OrderLineUpdate_draftOrderLineUpdate_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderLineUpdate_draftOrderLineUpdate_order_events | null)[] | null;
  fulfillments: (OrderLineUpdate_draftOrderLineUpdate_order_fulfillments | null)[];
  lines: (OrderLineUpdate_draftOrderLineUpdate_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  shippingAddress: OrderLineUpdate_draftOrderLineUpdate_order_shippingAddress | null;
  shippingMethod: OrderLineUpdate_draftOrderLineUpdate_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderLineUpdate_draftOrderLineUpdate_order_shippingPrice | null;
  status: OrderStatus;
  subtotal: OrderLineUpdate_draftOrderLineUpdate_order_subtotal | null;
  total: OrderLineUpdate_draftOrderLineUpdate_order_total | null;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderLineUpdate_draftOrderLineUpdate_order_totalAuthorized | null;
  totalCaptured: OrderLineUpdate_draftOrderLineUpdate_order_totalCaptured | null;
  user: OrderLineUpdate_draftOrderLineUpdate_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderLineUpdate_draftOrderLineUpdate_order_availableShippingMethods | null)[] | null;
  discount: OrderLineUpdate_draftOrderLineUpdate_order_discount | null;
  invoices: (OrderLineUpdate_draftOrderLineUpdate_order_invoices | null)[] | null;
  channel: OrderLineUpdate_draftOrderLineUpdate_order_channel;
  isPaid: boolean | null;
}

export interface OrderLineUpdate_draftOrderLineUpdate {
  __typename: "DraftOrderLineUpdate";
  errors: OrderLineUpdate_draftOrderLineUpdate_errors[];
  order: OrderLineUpdate_draftOrderLineUpdate_order | null;
}

export interface OrderLineUpdate {
  draftOrderLineUpdate: OrderLineUpdate_draftOrderLineUpdate | null;
}

export interface OrderLineUpdateVariables {
  id: string;
  input: OrderLineInput;
}
