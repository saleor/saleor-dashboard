/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderDiscountCommonInput, OrderErrorCode, AddressTypeEnum, OrderDiscountType, DiscountValueTypeEnum, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderLineDiscountUpdate
// ====================================================

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_discounts_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_discounts {
  __typename: "OrderDiscount";
  id: string;
  type: OrderDiscountType;
  calculationMode: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_discounts_amount;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_discount_oldAmount | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_discount_oldAmount | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  itemName: string | null;
  discount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_discount | null;
  orderLine: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines_orderLine | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  discount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_discount | null;
  relatedOrder: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_user | null;
  lines: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events_lines | null)[] | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice;
  unitPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_unitPrice;
  thumbnail: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines_orderLine | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments_warehouse | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_undiscountedUnitPrice_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_undiscountedUnitPrice_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitPrice_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitPrice_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_undiscountedUnitPrice;
  unitPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_unitPrice;
  thumbnail: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines_thumbnail | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingPrice_gross;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_subtotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_subtotal_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_subtotal_net;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total {
  __typename: "TaxedMoney";
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total_gross;
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total_net;
  tax: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total_tax;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_undiscountedTotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_undiscountedTotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_undiscountedTotal {
  __typename: "TaxedMoney";
  net: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_undiscountedTotal_net;
  gross: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_undiscountedTotal_gross;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_availableShippingMethods_price | null;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
  slug: string;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate_order {
  __typename: "Order";
  id: string;
  metadata: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_metadata | null)[];
  privateMetadata: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_privateMetadata | null)[];
  billingAddress: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_billingAddress | null;
  isShippingRequired: boolean;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  discounts: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_discounts[] | null;
  events: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_events | null)[] | null;
  fulfillments: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_fulfillments | null)[];
  lines: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingAddress | null;
  shippingMethod: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_shippingPrice;
  status: OrderStatus;
  subtotal: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_subtotal;
  total: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_totalAuthorized;
  totalCaptured: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_totalCaptured;
  undiscountedTotal: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_undiscountedTotal;
  user: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_availableShippingMethods | null)[] | null;
  invoices: (OrderLineDiscountUpdate_orderLineDiscountUpdate_order_invoices | null)[] | null;
  channel: OrderLineDiscountUpdate_orderLineDiscountUpdate_order_channel;
  isPaid: boolean;
}

export interface OrderLineDiscountUpdate_orderLineDiscountUpdate {
  __typename: "OrderLineDiscountUpdate";
  errors: OrderLineDiscountUpdate_orderLineDiscountUpdate_errors[];
  order: OrderLineDiscountUpdate_orderLineDiscountUpdate_order | null;
}

export interface OrderLineDiscountUpdate {
  orderLineDiscountUpdate: OrderLineDiscountUpdate_orderLineDiscountUpdate | null;
}

export interface OrderLineDiscountUpdateVariables {
  input: OrderDiscountCommonInput;
  orderLineId: string;
}
