/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FulfillmentUpdateTrackingInput, OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderFulfillmentUpdateTracking
// ====================================================

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_events_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  message: string | null;
  quantity: number | null;
  type: OrderEventsEnum | null;
  user: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_events_user | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_variant_product {
  __typename: "Product";
  id: string;
  isAvailableForPurchase: boolean | null;
  isPublished: boolean;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  product: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_variant_product;
  quantityAvailable: number;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_unitPrice | null;
  thumbnail: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines_orderLine | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments_warehouse | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_variant_product {
  __typename: "Product";
  id: string;
  isAvailableForPurchase: boolean | null;
  isPublished: boolean;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  product: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_variant_product;
  quantityAvailable: number;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_unitPrice_gross;
  net: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_unitPrice_net;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_unitPrice | null;
  thumbnail: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines_thumbnail | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingPrice_gross;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_subtotal_gross;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_total {
  __typename: "TaxedMoney";
  gross: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_total_gross;
  tax: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_total_tax;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_availableShippingMethods_price | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order {
  __typename: "Order";
  id: string;
  metadata: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_metadata | null)[];
  privateMetadata: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_privateMetadata | null)[];
  billingAddress: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_events | null)[] | null;
  fulfillments: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_fulfillments | null)[];
  lines: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum | null;
  shippingAddress: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingAddress | null;
  shippingMethod: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_shippingPrice | null;
  status: OrderStatus;
  subtotal: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_subtotal | null;
  total: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_total | null;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_totalAuthorized | null;
  totalCaptured: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_totalCaptured | null;
  user: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_availableShippingMethods | null)[] | null;
  discount: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_discount | null;
  invoices: (OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order_invoices | null)[] | null;
}

export interface OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking {
  __typename: "FulfillmentUpdateTracking";
  errors: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_errors[];
  order: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking_order | null;
}

export interface OrderFulfillmentUpdateTracking {
  orderFulfillmentUpdateTracking: OrderFulfillmentUpdateTracking_orderFulfillmentUpdateTracking | null;
}

export interface OrderFulfillmentUpdateTrackingVariables {
  id: string;
  input: FulfillmentUpdateTrackingInput;
}
