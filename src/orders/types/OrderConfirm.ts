/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderConfirm
// ====================================================

export interface OrderConfirm_orderConfirm_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderConfirm_orderConfirm_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderConfirm_orderConfirm_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderConfirm_orderConfirm_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderConfirm_orderConfirm_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderConfirm_orderConfirm_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderConfirm_orderConfirm_order_events_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderConfirm_orderConfirm_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderConfirm_orderConfirm_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: OrderConfirm_orderConfirm_order_events_lines_orderLine | null;
}

export interface OrderConfirm_orderConfirm_order_events {
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
  user: OrderConfirm_orderConfirm_order_events_user | null;
  lines: (OrderConfirm_orderConfirm_order_events_lines | null)[] | null;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderConfirm_orderConfirm_order_fulfillments_lines_orderLine | null;
}

export interface OrderConfirm_orderConfirm_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderConfirm_orderConfirm_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderConfirm_orderConfirm_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderConfirm_orderConfirm_order_fulfillments_warehouse | null;
}

export interface OrderConfirm_orderConfirm_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderConfirm_orderConfirm_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderConfirm_orderConfirm_order_lines_unitPrice_gross;
  net: OrderConfirm_orderConfirm_order_lines_unitPrice_net;
}

export interface OrderConfirm_orderConfirm_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderConfirm_orderConfirm_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderConfirm_orderConfirm_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderConfirm_orderConfirm_order_lines_unitPrice | null;
  thumbnail: OrderConfirm_orderConfirm_order_lines_thumbnail | null;
}

export interface OrderConfirm_orderConfirm_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderConfirm_orderConfirm_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderConfirm_orderConfirm_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderConfirm_orderConfirm_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderConfirm_orderConfirm_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderConfirm_orderConfirm_order_shippingPrice_gross;
}

export interface OrderConfirm_orderConfirm_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderConfirm_orderConfirm_order_subtotal_gross;
}

export interface OrderConfirm_orderConfirm_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_total {
  __typename: "TaxedMoney";
  gross: OrderConfirm_orderConfirm_order_total_gross;
  tax: OrderConfirm_orderConfirm_order_total_tax;
}

export interface OrderConfirm_orderConfirm_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderConfirm_orderConfirm_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderConfirm_orderConfirm_order_availableShippingMethods_price | null;
}

export interface OrderConfirm_orderConfirm_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderConfirm_orderConfirm_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderConfirm_orderConfirm_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderConfirm_orderConfirm_order {
  __typename: "Order";
  id: string;
  metadata: (OrderConfirm_orderConfirm_order_metadata | null)[];
  privateMetadata: (OrderConfirm_orderConfirm_order_privateMetadata | null)[];
  billingAddress: OrderConfirm_orderConfirm_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderConfirm_orderConfirm_order_events | null)[] | null;
  fulfillments: (OrderConfirm_orderConfirm_order_fulfillments | null)[];
  lines: (OrderConfirm_orderConfirm_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  shippingAddress: OrderConfirm_orderConfirm_order_shippingAddress | null;
  shippingMethod: OrderConfirm_orderConfirm_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderConfirm_orderConfirm_order_shippingPrice | null;
  status: OrderStatus;
  subtotal: OrderConfirm_orderConfirm_order_subtotal | null;
  total: OrderConfirm_orderConfirm_order_total | null;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderConfirm_orderConfirm_order_totalAuthorized | null;
  totalCaptured: OrderConfirm_orderConfirm_order_totalCaptured | null;
  user: OrderConfirm_orderConfirm_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderConfirm_orderConfirm_order_availableShippingMethods | null)[] | null;
  discount: OrderConfirm_orderConfirm_order_discount | null;
  invoices: (OrderConfirm_orderConfirm_order_invoices | null)[] | null;
  channel: OrderConfirm_orderConfirm_order_channel;
  isPaid: boolean | null;
}

export interface OrderConfirm_orderConfirm {
  __typename: "OrderConfirm";
  errors: OrderConfirm_orderConfirm_errors[];
  order: OrderConfirm_orderConfirm_order | null;
}

export interface OrderConfirm {
  orderConfirm: OrderConfirm_orderConfirm | null;
}

export interface OrderConfirmVariables {
  id: string;
}
