/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: OrderDetailsFragment
// ====================================================

export interface OrderDetailsFragment_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderDetailsFragment_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderDetailsFragment_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDetailsFragment_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderDetailsFragment_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderDetailsFragment_events_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDetailsFragment_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderDetailsFragment_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: OrderDetailsFragment_events_lines_orderLine | null;
}

export interface OrderDetailsFragment_events {
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
  user: OrderDetailsFragment_events_user | null;
  lines: (OrderDetailsFragment_events_lines | null)[] | null;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderDetailsFragment_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: OrderDetailsFragment_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderDetailsFragment_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderDetailsFragment_fulfillments_lines_orderLine | null;
}

export interface OrderDetailsFragment_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderDetailsFragment_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderDetailsFragment_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderDetailsFragment_fulfillments_warehouse | null;
}

export interface OrderDetailsFragment_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderDetailsFragment_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderDetailsFragment_lines_unitPrice_gross;
  net: OrderDetailsFragment_lines_unitPrice_net;
}

export interface OrderDetailsFragment_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderDetailsFragment_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderDetailsFragment_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderDetailsFragment_lines_unitPrice | null;
  thumbnail: OrderDetailsFragment_lines_thumbnail | null;
}

export interface OrderDetailsFragment_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDetailsFragment_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderDetailsFragment_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderDetailsFragment_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderDetailsFragment_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderDetailsFragment_shippingPrice_gross;
}

export interface OrderDetailsFragment_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_subtotal {
  __typename: "TaxedMoney";
  gross: OrderDetailsFragment_subtotal_gross;
}

export interface OrderDetailsFragment_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_total {
  __typename: "TaxedMoney";
  gross: OrderDetailsFragment_total_gross;
  tax: OrderDetailsFragment_total_tax;
}

export interface OrderDetailsFragment_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDetailsFragment_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderDetailsFragment_availableShippingMethods_price | null;
}

export interface OrderDetailsFragment_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderDetailsFragment_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderDetailsFragment {
  __typename: "Order";
  id: string;
  metadata: (OrderDetailsFragment_metadata | null)[];
  privateMetadata: (OrderDetailsFragment_privateMetadata | null)[];
  billingAddress: OrderDetailsFragment_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderDetailsFragment_events | null)[] | null;
  fulfillments: (OrderDetailsFragment_fulfillments | null)[];
  lines: (OrderDetailsFragment_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  shippingAddress: OrderDetailsFragment_shippingAddress | null;
  shippingMethod: OrderDetailsFragment_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderDetailsFragment_shippingPrice | null;
  status: OrderStatus;
  subtotal: OrderDetailsFragment_subtotal | null;
  total: OrderDetailsFragment_total | null;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderDetailsFragment_totalAuthorized | null;
  totalCaptured: OrderDetailsFragment_totalCaptured | null;
  user: OrderDetailsFragment_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderDetailsFragment_availableShippingMethods | null)[] | null;
  discount: OrderDetailsFragment_discount | null;
  invoices: (OrderDetailsFragment_invoices | null)[] | null;
  channel: OrderDetailsFragment_channel;
  isPaid: boolean | null;
}
