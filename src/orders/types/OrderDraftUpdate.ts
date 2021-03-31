/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DraftOrderInput, OrderErrorCode, OrderDiscountType, DiscountValueTypeEnum, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderDraftUpdate
// ====================================================

export interface OrderDraftUpdate_draftOrderUpdate_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_metadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_privateMetadata {
  __typename: "MetadataItem";
  key: string;
  value: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_billingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_billingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderDraftUpdate_draftOrderUpdate_order_billingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_discounts_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_discounts {
  __typename: "OrderDiscount";
  id: string;
  type: OrderDiscountType;
  calculationMode: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDraftUpdate_draftOrderUpdate_order_discounts_amount;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDraftUpdate_draftOrderUpdate_order_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderDraftUpdate_draftOrderUpdate_order_events_discount_oldAmount | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDraftUpdate_draftOrderUpdate_order_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderDraftUpdate_draftOrderUpdate_order_events_lines_discount_oldAmount | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  productName: string;
  variantName: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events_lines {
  __typename: "OrderEventOrderLineObject";
  quantity: number | null;
  itemName: string | null;
  discount: OrderDraftUpdate_draftOrderUpdate_order_events_lines_discount | null;
  orderLine: OrderDraftUpdate_draftOrderUpdate_order_events_lines_orderLine | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_events {
  __typename: "OrderEvent";
  id: string;
  amount: number | null;
  shippingCostsIncluded: boolean | null;
  date: any | null;
  email: string | null;
  emailType: OrderEventsEmailsEnum | null;
  invoiceNumber: string | null;
  discount: OrderDraftUpdate_draftOrderUpdate_order_events_discount | null;
  relatedOrder: OrderDraftUpdate_draftOrderUpdate_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderDraftUpdate_draftOrderUpdate_order_events_user | null;
  lines: (OrderDraftUpdate_draftOrderUpdate_order_events_lines | null)[] | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross;
  net: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitPrice_gross;
  net: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitPrice_net;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_undiscountedUnitPrice;
  unitPrice: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_unitPrice;
  thumbnail: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine_thumbnail | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines {
  __typename: "FulfillmentLine";
  id: string;
  quantity: number;
  orderLine: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines_orderLine | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_fulfillments {
  __typename: "Fulfillment";
  id: string;
  lines: (OrderDraftUpdate_draftOrderUpdate_order_fulfillments_lines | null)[] | null;
  fulfillmentOrder: number;
  status: FulfillmentStatus;
  trackingNumber: string;
  warehouse: OrderDraftUpdate_draftOrderUpdate_order_fulfillments_warehouse | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderDraftUpdate_draftOrderUpdate_order_lines_undiscountedUnitPrice_gross;
  net: OrderDraftUpdate_draftOrderUpdate_order_lines_undiscountedUnitPrice_net;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_unitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_unitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_unitPrice {
  __typename: "TaxedMoney";
  gross: OrderDraftUpdate_draftOrderUpdate_order_lines_unitPrice_gross;
  net: OrderDraftUpdate_draftOrderUpdate_order_lines_unitPrice_net;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines_thumbnail {
  __typename: "Image";
  url: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_lines {
  __typename: "OrderLine";
  id: string;
  isShippingRequired: boolean;
  variant: OrderDraftUpdate_draftOrderUpdate_order_lines_variant | null;
  productName: string;
  productSku: string;
  quantity: number;
  quantityFulfilled: number;
  unitDiscount: OrderDraftUpdate_draftOrderUpdate_order_lines_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderDraftUpdate_draftOrderUpdate_order_lines_undiscountedUnitPrice;
  unitPrice: OrderDraftUpdate_draftOrderUpdate_order_lines_unitPrice;
  thumbnail: OrderDraftUpdate_draftOrderUpdate_order_lines_thumbnail | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_shippingAddress_country {
  __typename: "CountryDisplay";
  code: string;
  country: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_shippingAddress {
  __typename: "Address";
  city: string;
  cityArea: string;
  companyName: string;
  country: OrderDraftUpdate_draftOrderUpdate_order_shippingAddress_country;
  countryArea: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string | null;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_shippingPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_shippingPrice {
  __typename: "TaxedMoney";
  gross: OrderDraftUpdate_draftOrderUpdate_order_shippingPrice_gross;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_subtotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_subtotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderDraftUpdate_draftOrderUpdate_order_subtotal_gross;
  net: OrderDraftUpdate_draftOrderUpdate_order_subtotal_net;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_total_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_total_tax {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_total {
  __typename: "TaxedMoney";
  gross: OrderDraftUpdate_draftOrderUpdate_order_total_gross;
  net: OrderDraftUpdate_draftOrderUpdate_order_total_net;
  tax: OrderDraftUpdate_draftOrderUpdate_order_total_tax;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_totalAuthorized {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_totalCaptured {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_undiscountedTotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_undiscountedTotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_undiscountedTotal {
  __typename: "TaxedMoney";
  net: OrderDraftUpdate_draftOrderUpdate_order_undiscountedTotal_net;
  gross: OrderDraftUpdate_draftOrderUpdate_order_undiscountedTotal_gross;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_availableShippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_availableShippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderDraftUpdate_draftOrderUpdate_order_availableShippingMethods_price | null;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_discount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderDraftUpdate_draftOrderUpdate_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
}

export interface OrderDraftUpdate_draftOrderUpdate_order {
  __typename: "Order";
  id: string;
  metadata: (OrderDraftUpdate_draftOrderUpdate_order_metadata | null)[];
  privateMetadata: (OrderDraftUpdate_draftOrderUpdate_order_privateMetadata | null)[];
  billingAddress: OrderDraftUpdate_draftOrderUpdate_order_billingAddress | null;
  isShippingRequired: boolean;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  discounts: OrderDraftUpdate_draftOrderUpdate_order_discounts[] | null;
  events: (OrderDraftUpdate_draftOrderUpdate_order_events | null)[] | null;
  fulfillments: (OrderDraftUpdate_draftOrderUpdate_order_fulfillments | null)[];
  lines: (OrderDraftUpdate_draftOrderUpdate_order_lines | null)[];
  number: string | null;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderDraftUpdate_draftOrderUpdate_order_shippingAddress | null;
  shippingMethod: OrderDraftUpdate_draftOrderUpdate_order_shippingMethod | null;
  shippingMethodName: string | null;
  shippingPrice: OrderDraftUpdate_draftOrderUpdate_order_shippingPrice;
  status: OrderStatus;
  subtotal: OrderDraftUpdate_draftOrderUpdate_order_subtotal;
  total: OrderDraftUpdate_draftOrderUpdate_order_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderDraftUpdate_draftOrderUpdate_order_totalAuthorized;
  totalCaptured: OrderDraftUpdate_draftOrderUpdate_order_totalCaptured;
  undiscountedTotal: OrderDraftUpdate_draftOrderUpdate_order_undiscountedTotal;
  user: OrderDraftUpdate_draftOrderUpdate_order_user | null;
  userEmail: string | null;
  availableShippingMethods: (OrderDraftUpdate_draftOrderUpdate_order_availableShippingMethods | null)[] | null;
  discount: OrderDraftUpdate_draftOrderUpdate_order_discount | null;
  invoices: (OrderDraftUpdate_draftOrderUpdate_order_invoices | null)[] | null;
  channel: OrderDraftUpdate_draftOrderUpdate_order_channel;
  isPaid: boolean;
}

export interface OrderDraftUpdate_draftOrderUpdate {
  __typename: "DraftOrderUpdate";
  errors: OrderDraftUpdate_draftOrderUpdate_errors[];
  order: OrderDraftUpdate_draftOrderUpdate_order | null;
}

export interface OrderDraftUpdate {
  draftOrderUpdate: OrderDraftUpdate_draftOrderUpdate | null;
}

export interface OrderDraftUpdateVariables {
  id: string;
  input: DraftOrderInput;
}
