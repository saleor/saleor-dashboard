/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum, WeightUnitsEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: OrderDetails
// ====================================================

export interface OrderDetails_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderDetails_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderDetails_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDetails_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderDetails_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderDetails_order_events_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDetails_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderDetails_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: OrderDetails_order_events_lines_orderLine | null;
}

export interface OrderDetails_order_events {
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
  user: OrderDetails_order_events_user | null;
  lines: (OrderDetails_order_events_lines | null)[] | null;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderDetails_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderDetails_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderDetails_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderDetails_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderDetails_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: OrderDetails_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderDetails_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderDetails_order_fulfillments_lines_orderLine | null;
}

export interface OrderDetails_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderDetails_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderDetails_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderDetails_order_fulfillments_warehouse | null;
}

export interface OrderDetails_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderDetails_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderDetails_order_lines_unitPrice_gross;
  net: OrderDetails_order_lines_unitPrice_net;
}

export interface OrderDetails_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderDetails_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderDetails_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderDetails_order_lines_unitPrice | null;
  thumbnail: OrderDetails_order_lines_thumbnail | null;
}

export interface OrderDetails_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDetails_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderDetails_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderDetails_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderDetails_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderDetails_order_shippingPrice_gross;
}

export interface OrderDetails_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderDetails_order_subtotal_gross;
}

export interface OrderDetails_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_total {
  __typename: "TaxedMoney";
  gross: OrderDetails_order_total_gross;
  tax: OrderDetails_order_total_tax;
}

export interface OrderDetails_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDetails_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderDetails_order_availableShippingMethods_price | null;
}

export interface OrderDetails_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderDetails_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderDetails_order {
  __typename: "Order";
  id: string;
  metadata: (OrderDetails_order_metadata | null)[];
  privateMetadata: (OrderDetails_order_privateMetadata | null)[];
  billingAddress: OrderDetails_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderDetails_order_events | null)[] | null;
  fulfillments: (OrderDetails_order_fulfillments | null)[];
  lines: (OrderDetails_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  shippingAddress: OrderDetails_order_shippingAddress | null;
  shippingMethod: OrderDetails_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderDetails_order_shippingPrice | null;
  status: OrderStatus;
  subtotal: OrderDetails_order_subtotal | null;
  total: OrderDetails_order_total | null;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderDetails_order_totalAuthorized | null;
  totalCaptured: OrderDetails_order_totalCaptured | null;
  user: OrderDetails_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderDetails_order_availableShippingMethods | null)[] | null;
  discount: OrderDetails_order_discount | null;
  invoices: (OrderDetails_order_invoices | null)[] | null;
  channel: OrderDetails_order_channel;
  isPaid: boolean | null;
}

export interface OrderDetails_shop_countries {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDetails_shop {
  __typename: "Shop";
  countries: OrderDetails_shop_countries[];
  defaultWeightUnit: WeightUnitsEnum | null;
}

export interface OrderDetails {
  order: OrderDetails_order | null;
  shop: OrderDetails_shop;
}

export interface OrderDetailsVariables {
  id: string;
}
