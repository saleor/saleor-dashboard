/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderErrorCode, OrderDiscountType, DiscountValueTypeEnum, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderCancel
// ====================================================

export interface OrderCancel_orderCancel_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderCancel_orderCancel_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderCancel_orderCancel_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderCancel_orderCancel_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderCancel_orderCancel_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderCancel_orderCancel_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderCancel_orderCancel_order_discounts_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_discounts {
  __typename: "OrderDiscount";
  id: string;
  type: OrderDiscountType;
  calculationMode: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderCancel_orderCancel_order_discounts_amount;
}

export interface OrderCancel_orderCancel_order_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderCancel_orderCancel_order_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderCancel_orderCancel_order_events_discount_oldAmount | null;
}

export interface OrderCancel_orderCancel_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderCancel_orderCancel_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderCancel_orderCancel_order_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderCancel_orderCancel_order_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderCancel_orderCancel_order_events_lines_discount_oldAmount | null;
}

export interface OrderCancel_orderCancel_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderCancel_orderCancel_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  itemName: string | null;
  discount: OrderCancel_orderCancel_order_events_lines_discount | null;
  orderLine: OrderCancel_orderCancel_order_events_lines_orderLine | null;
}

export interface OrderCancel_orderCancel_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  discount: OrderCancel_orderCancel_order_events_discount | null;
  relatedOrder: OrderCancel_orderCancel_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderCancel_orderCancel_order_events_user | null;
  lines: (OrderCancel_orderCancel_order_events_lines | null)[] | null;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross;
  net: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_undiscountedUnitPrice;
  unitPrice: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_unitPrice;
  thumbnail: OrderCancel_orderCancel_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderCancel_orderCancel_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderCancel_orderCancel_order_fulfillments_lines_orderLine | null;
}

export interface OrderCancel_orderCancel_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderCancel_orderCancel_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderCancel_orderCancel_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderCancel_orderCancel_order_fulfillments_warehouse | null;
}

export interface OrderCancel_orderCancel_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderCancel_orderCancel_order_lines_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_lines_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_lines_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_lines_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderCancel_orderCancel_order_lines_undiscountedUnitPrice_gross;
  net: OrderCancel_orderCancel_order_lines_undiscountedUnitPrice_net;
}

export interface OrderCancel_orderCancel_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderCancel_orderCancel_order_lines_unitPrice_gross;
  net: OrderCancel_orderCancel_order_lines_unitPrice_net;
}

export interface OrderCancel_orderCancel_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderCancel_orderCancel_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderCancel_orderCancel_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderCancel_orderCancel_order_lines_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderCancel_orderCancel_order_lines_undiscountedUnitPrice;
  unitPrice: OrderCancel_orderCancel_order_lines_unitPrice;
  thumbnail: OrderCancel_orderCancel_order_lines_thumbnail | null;
}

export interface OrderCancel_orderCancel_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderCancel_orderCancel_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderCancel_orderCancel_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderCancel_orderCancel_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderCancel_orderCancel_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderCancel_orderCancel_order_shippingPrice_gross;
}

export interface OrderCancel_orderCancel_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_subtotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderCancel_orderCancel_order_subtotal_gross;
  net: OrderCancel_orderCancel_order_subtotal_net;
}

export interface OrderCancel_orderCancel_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_total_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_total {
  __typename: "TaxedMoney";
  gross: OrderCancel_orderCancel_order_total_gross;
  net: OrderCancel_orderCancel_order_total_net;
  tax: OrderCancel_orderCancel_order_total_tax;
}

export interface OrderCancel_orderCancel_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_undiscountedTotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_undiscountedTotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_undiscountedTotal {
  __typename: "TaxedMoney";
  net: OrderCancel_orderCancel_order_undiscountedTotal_net;
  gross: OrderCancel_orderCancel_order_undiscountedTotal_gross;
}

export interface OrderCancel_orderCancel_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderCancel_orderCancel_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderCancel_orderCancel_order_availableShippingMethods_price | null;
}

export interface OrderCancel_orderCancel_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderCancel_orderCancel_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderCancel_orderCancel_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderCancel_orderCancel_order {
  __typename: "Order";
  id: string;
  metadata: (OrderCancel_orderCancel_order_metadata | null)[];
  privateMetadata: (OrderCancel_orderCancel_order_privateMetadata | null)[];
  billingAddress: OrderCancel_orderCancel_order_billingAddress | null;
  isShippingRequired: boolean;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  discounts: OrderCancel_orderCancel_order_discounts[] | null;
  events: (OrderCancel_orderCancel_order_events | null)[] | null;
  fulfillments: (OrderCancel_orderCancel_order_fulfillments | null)[];
  lines: (OrderCancel_orderCancel_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderCancel_orderCancel_order_shippingAddress | null;
  shippingMethod: OrderCancel_orderCancel_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderCancel_orderCancel_order_shippingPrice;
  status: OrderStatus;
  subtotal: OrderCancel_orderCancel_order_subtotal;
  total: OrderCancel_orderCancel_order_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderCancel_orderCancel_order_totalAuthorized;
  totalCaptured: OrderCancel_orderCancel_order_totalCaptured;
  undiscountedTotal: OrderCancel_orderCancel_order_undiscountedTotal;
  user: OrderCancel_orderCancel_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderCancel_orderCancel_order_availableShippingMethods | null)[] | null;
  discount: OrderCancel_orderCancel_order_discount | null;
  invoices: (OrderCancel_orderCancel_order_invoices | null)[] | null;
  channel: OrderCancel_orderCancel_order_channel;
  isPaid: boolean;
}

export interface OrderCancel_orderCancel {
  __typename: "OrderCancel";
  errors: OrderCancel_orderCancel_errors[];
  order: OrderCancel_orderCancel_order | null;
}

export interface OrderCancel {
  orderCancel: OrderCancel_orderCancel | null;
}

export interface OrderCancelVariables {
  id: string;
}
