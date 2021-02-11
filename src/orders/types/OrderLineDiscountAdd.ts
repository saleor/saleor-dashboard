/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderDiscountCommonInput, OrderErrorCode, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderLineDiscountAdd
// ====================================================

export interface OrderLineDiscountAdd_orderLineDiscountAdd_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineDiscountAdd_orderLineDiscountAdd_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  orderLine: OrderLineDiscountAdd_orderLineDiscountAdd_order_events_lines_orderLine | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  relatedOrder: OrderLineDiscountAdd_orderLineDiscountAdd_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderLineDiscountAdd_orderLineDiscountAdd_order_events_user | null;
  lines: (OrderLineDiscountAdd_orderLineDiscountAdd_order_events_lines | null)[] | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_unitPrice;
  thumbnail: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines_orderLine | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments_warehouse | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_unitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_unitPrice_gross;
  net: OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_unitPrice_net;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitPrice: OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_unitPrice;
  thumbnail: OrderLineDiscountAdd_orderLineDiscountAdd_order_lines_thumbnail | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingPrice_gross;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountAdd_orderLineDiscountAdd_order_subtotal_gross;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_total {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountAdd_orderLineDiscountAdd_order_total_gross;
  tax: OrderLineDiscountAdd_orderLineDiscountAdd_order_total_tax;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderLineDiscountAdd_orderLineDiscountAdd_order_availableShippingMethods_price | null;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd_order {
  __typename: "Order";
  id: string;
  metadata: (OrderLineDiscountAdd_orderLineDiscountAdd_order_metadata | null)[];
  privateMetadata: (OrderLineDiscountAdd_orderLineDiscountAdd_order_privateMetadata | null)[];
  billingAddress: OrderLineDiscountAdd_orderLineDiscountAdd_order_billingAddress | null;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  events: (OrderLineDiscountAdd_orderLineDiscountAdd_order_events | null)[] | null;
  fulfillments: (OrderLineDiscountAdd_orderLineDiscountAdd_order_fulfillments | null)[];
  lines: (OrderLineDiscountAdd_orderLineDiscountAdd_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingAddress | null;
  shippingMethod: OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderLineDiscountAdd_orderLineDiscountAdd_order_shippingPrice;
  status: OrderStatus;
  subtotal: OrderLineDiscountAdd_orderLineDiscountAdd_order_subtotal;
  total: OrderLineDiscountAdd_orderLineDiscountAdd_order_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderLineDiscountAdd_orderLineDiscountAdd_order_totalAuthorized;
  totalCaptured: OrderLineDiscountAdd_orderLineDiscountAdd_order_totalCaptured;
  user: OrderLineDiscountAdd_orderLineDiscountAdd_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderLineDiscountAdd_orderLineDiscountAdd_order_availableShippingMethods | null)[] | null;
  discount: OrderLineDiscountAdd_orderLineDiscountAdd_order_discount | null;
  invoices: (OrderLineDiscountAdd_orderLineDiscountAdd_order_invoices | null)[] | null;
  channel: OrderLineDiscountAdd_orderLineDiscountAdd_order_channel;
  isPaid: boolean;
}

export interface OrderLineDiscountAdd_orderLineDiscountAdd {
  __typename: "OrderLineDiscountAdd";
  errors: OrderLineDiscountAdd_orderLineDiscountAdd_errors[];
  order: OrderLineDiscountAdd_orderLineDiscountAdd_order | null;
}

export interface OrderLineDiscountAdd {
  orderLineDiscountAdd: OrderLineDiscountAdd_orderLineDiscountAdd | null;
}

export interface OrderLineDiscountAddVariables {
  input: OrderDiscountCommonInput;
  orderLineId: string;
}
