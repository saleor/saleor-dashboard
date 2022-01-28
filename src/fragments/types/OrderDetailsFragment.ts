/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardEventsEnum, OrderDiscountType, DiscountValueTypeEnum, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, WarehouseClickAndCollectOptionEnum, OrderStatus, OrderAction, JobStatusEnum } from "./../../types/globalTypes";

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

export interface OrderDetailsFragment_giftCards_events_balance_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_giftCards_events_balance_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_giftCards_events_balance_oldInitialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_giftCards_events_balance_oldCurrentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_giftCards_events_balance {
  __typename: "GiftCardEventBalance";
  initialBalance: OrderDetailsFragment_giftCards_events_balance_initialBalance | null;
  currentBalance: OrderDetailsFragment_giftCards_events_balance_currentBalance;
  oldInitialBalance: OrderDetailsFragment_giftCards_events_balance_oldInitialBalance | null;
  oldCurrentBalance: OrderDetailsFragment_giftCards_events_balance_oldCurrentBalance | null;
}

export interface OrderDetailsFragment_giftCards_events {
  __typename: "GiftCardEvent";
  id: string;
  type: GiftCardEventsEnum | null;
  orderId: string | null;
  balance: OrderDetailsFragment_giftCards_events_balance | null;
}

export interface OrderDetailsFragment_giftCards {
  __typename: "GiftCard";
  events: OrderDetailsFragment_giftCards_events[];
}

export interface OrderDetailsFragment_discounts_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_discounts {
  __typename: "OrderDiscount";
  id: string;
  type: OrderDiscountType;
  calculationMode: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDetailsFragment_discounts_amount;
}

export interface OrderDetailsFragment_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDetailsFragment_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderDetailsFragment_events_discount_oldAmount | null;
}

export interface OrderDetailsFragment_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderDetailsFragment_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderDetailsFragment_events_app {
  __typename: "App";
  id: string;
  name: string | null;
  appUrl: string | null;
}

export interface OrderDetailsFragment_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDetailsFragment_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderDetailsFragment_events_lines_discount_oldAmount | null;
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
  itemName: string | null;
  discount: OrderDetailsFragment_events_lines_discount | null;
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
  discount: OrderDetailsFragment_events_discount | null;
  relatedOrder: OrderDetailsFragment_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderDetailsFragment_events_user | null;
  app: OrderDetailsFragment_events_app | null;
  lines: (OrderDetailsFragment_events_lines | null)[] | null;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number | null;
  preorder: OrderDetailsFragment_fulfillments_lines_orderLine_variant_preorder | null;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_fulfillments_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderDetailsFragment_fulfillments_lines_orderLine_undiscountedUnitPrice_gross;
  net: OrderDetailsFragment_fulfillments_lines_orderLine_undiscountedUnitPrice_net;
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
  productSku: string | null;
  quantity: number;
  quantityFulfilled: number;
  quantityToFulfill: number;
  unitDiscount: OrderDetailsFragment_fulfillments_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderDetailsFragment_fulfillments_lines_orderLine_undiscountedUnitPrice;
  unitPrice: OrderDetailsFragment_fulfillments_lines_orderLine_unitPrice;
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

export interface OrderDetailsFragment_lines_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
}

export interface OrderDetailsFragment_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number | null;
  preorder: OrderDetailsFragment_lines_variant_preorder | null;
}

export interface OrderDetailsFragment_lines_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_lines_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_lines_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_lines_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderDetailsFragment_lines_undiscountedUnitPrice_gross;
  net: OrderDetailsFragment_lines_undiscountedUnitPrice_net;
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
  productSku: string | null;
  quantity: number;
  quantityFulfilled: number;
  quantityToFulfill: number;
  unitDiscount: OrderDetailsFragment_lines_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderDetailsFragment_lines_undiscountedUnitPrice;
  unitPrice: OrderDetailsFragment_lines_unitPrice;
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

export interface OrderDetailsFragment_deliveryMethod_ShippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderDetailsFragment_deliveryMethod_Warehouse {
  __typename: "Warehouse";
  id: string;
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
}

export type OrderDetailsFragment_deliveryMethod = OrderDetailsFragment_deliveryMethod_ShippingMethod | OrderDetailsFragment_deliveryMethod_Warehouse;

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

export interface OrderDetailsFragment_subtotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_subtotal {
  __typename: "TaxedMoney";
  gross: OrderDetailsFragment_subtotal_gross;
  net: OrderDetailsFragment_subtotal_net;
}

export interface OrderDetailsFragment_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_total_net {
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
  net: OrderDetailsFragment_total_net;
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

export interface OrderDetailsFragment_undiscountedTotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_undiscountedTotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_undiscountedTotal {
  __typename: "TaxedMoney";
  net: OrderDetailsFragment_undiscountedTotal_net;
  gross: OrderDetailsFragment_undiscountedTotal_gross;
}

export interface OrderDetailsFragment_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDetailsFragment_shippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetailsFragment_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderDetailsFragment_shippingMethods_price;
  active: boolean;
  message: string | null;
}

export interface OrderDetailsFragment_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderDetailsFragment_channel_defaultCountry {
  __typename: "CountryDisplay";
  code: string;
}

export interface OrderDetailsFragment_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
  slug: string;
  defaultCountry: OrderDetailsFragment_channel_defaultCountry;
}

export interface OrderDetailsFragment {
  __typename: "Order";
  id: string;
  token: string;
  metadata: (OrderDetailsFragment_metadata | null)[];
  privateMetadata: (OrderDetailsFragment_privateMetadata | null)[];
  billingAddress: OrderDetailsFragment_billingAddress | null;
  giftCards: (OrderDetailsFragment_giftCards | null)[] | null;
  isShippingRequired: boolean;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  discounts: OrderDetailsFragment_discounts[] | null;
  events: (OrderDetailsFragment_events | null)[] | null;
  fulfillments: (OrderDetailsFragment_fulfillments | null)[];
  lines: (OrderDetailsFragment_lines | null)[];
  number: string | null;
  isPaid: boolean;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderDetailsFragment_shippingAddress | null;
  deliveryMethod: OrderDetailsFragment_deliveryMethod | null;
  shippingMethod: OrderDetailsFragment_shippingMethod | null;
  shippingMethodName: string | null;
  collectionPointName: string | null;
  shippingPrice: OrderDetailsFragment_shippingPrice;
  status: OrderStatus;
  subtotal: OrderDetailsFragment_subtotal;
  total: OrderDetailsFragment_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderDetailsFragment_totalAuthorized;
  totalCaptured: OrderDetailsFragment_totalCaptured;
  undiscountedTotal: OrderDetailsFragment_undiscountedTotal;
  user: OrderDetailsFragment_user | null;
  userEmail: string | null;
  shippingMethods: (OrderDetailsFragment_shippingMethods | null)[] | null;
  invoices: (OrderDetailsFragment_invoices | null)[] | null;
  channel: OrderDetailsFragment_channel;
}
