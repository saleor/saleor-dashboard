/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderLineDiscountDelete
// ====================================================

export interface OrderLineDiscountDelete_orderLineDiscountDelete_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineDiscountDelete_orderLineDiscountDelete_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: OrderLineDiscountDelete_orderLineDiscountDelete_order_events_lines_orderLine | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  relatedOrder: OrderLineDiscountDelete_orderLineDiscountDelete_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderLineDiscountDelete_orderLineDiscountDelete_order_events_user | null;
  lines: (OrderLineDiscountDelete_orderLineDiscountDelete_order_events_lines | null)[] | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_unitPrice;
  thumbnail: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines_orderLine | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments_warehouse | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_unitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_unitPrice_gross;
  net: OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_unitPrice_net;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_unitPrice;
  thumbnail: OrderLineDiscountDelete_orderLineDiscountDelete_order_lines_thumbnail | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingPrice_gross;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountDelete_orderLineDiscountDelete_order_subtotal_gross;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_total {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountDelete_orderLineDiscountDelete_order_total_gross;
  tax: OrderLineDiscountDelete_orderLineDiscountDelete_order_total_tax;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderLineDiscountDelete_orderLineDiscountDelete_order_availableShippingMethods_price | null;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete_order {
  __typename: "Order";
  id: string;
  metadata: (OrderLineDiscountDelete_orderLineDiscountDelete_order_metadata | null)[];
  privateMetadata: (OrderLineDiscountDelete_orderLineDiscountDelete_order_privateMetadata | null)[];
  billingAddress: OrderLineDiscountDelete_orderLineDiscountDelete_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderLineDiscountDelete_orderLineDiscountDelete_order_events | null)[] | null;
  fulfillments: (OrderLineDiscountDelete_orderLineDiscountDelete_order_fulfillments | null)[];
  lines: (OrderLineDiscountDelete_orderLineDiscountDelete_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingAddress | null;
  shippingMethod: OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderLineDiscountDelete_orderLineDiscountDelete_order_shippingPrice;
  status: OrderStatus;
  subtotal: OrderLineDiscountDelete_orderLineDiscountDelete_order_subtotal;
  total: OrderLineDiscountDelete_orderLineDiscountDelete_order_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderLineDiscountDelete_orderLineDiscountDelete_order_totalAuthorized;
  totalCaptured: OrderLineDiscountDelete_orderLineDiscountDelete_order_totalCaptured;
  user: OrderLineDiscountDelete_orderLineDiscountDelete_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderLineDiscountDelete_orderLineDiscountDelete_order_availableShippingMethods | null)[] | null;
  discount: OrderLineDiscountDelete_orderLineDiscountDelete_order_discount | null;
  invoices: (OrderLineDiscountDelete_orderLineDiscountDelete_order_invoices | null)[] | null;
  channel: OrderLineDiscountDelete_orderLineDiscountDelete_order_channel;
  isPaid: boolean;
}

export interface OrderLineDiscountDelete_orderLineDiscountDelete {
  __typename: "OrderLineDiscountDelete";
  errors: OrderLineDiscountDelete_orderLineDiscountDelete_errors[];
  order: OrderLineDiscountDelete_orderLineDiscountDelete_order | null;
}

export interface OrderLineDiscountDelete {
  orderLineDiscountDelete: OrderLineDiscountDelete_orderLineDiscountDelete | null;
}

export interface OrderLineDiscountDeleteVariables {
  orderLineId: string;
}
