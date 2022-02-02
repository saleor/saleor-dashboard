/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardEventsEnum, OrderDiscountType, DiscountValueTypeEnum, OrderEventsEmailsEnum, OrderEventsEnum, FulfillmentStatus, PaymentChargeStatusEnum, WarehouseClickAndCollectOptionEnum, OrderStatus, OrderAction, JobStatusEnum, WeightUnitsEnum } from "./../../types/globalTypes";

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

export interface OrderDetails_order_giftCards_events_balance_initialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_giftCards_events_balance_currentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_giftCards_events_balance_oldInitialBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_giftCards_events_balance_oldCurrentBalance {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_giftCards_events_balance {
  __typename: "GiftCardEventBalance";
  initialBalance: OrderDetails_order_giftCards_events_balance_initialBalance | null;
  currentBalance: OrderDetails_order_giftCards_events_balance_currentBalance;
  oldInitialBalance: OrderDetails_order_giftCards_events_balance_oldInitialBalance | null;
  oldCurrentBalance: OrderDetails_order_giftCards_events_balance_oldCurrentBalance | null;
}

export interface OrderDetails_order_giftCards_events {
  __typename: "GiftCardEvent";
  id: string;
  type: GiftCardEventsEnum | null;
  orderId: string | null;
  balance: OrderDetails_order_giftCards_events_balance | null;
}

export interface OrderDetails_order_giftCards {
  __typename: "GiftCard";
  events: OrderDetails_order_giftCards_events[];
}

export interface OrderDetails_order_discounts_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_discounts {
  __typename: "OrderDiscount";
  id: string;
  type: OrderDiscountType;
  calculationMode: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDetails_order_discounts_amount;
}

export interface OrderDetails_order_events_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_events_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_events_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDetails_order_events_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderDetails_order_events_discount_oldAmount | null;
}

export interface OrderDetails_order_events_relatedOrder {
  __typename: "Order";
  id: string;
  number: string | null;
}

export interface OrderDetails_order_events_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface OrderDetails_order_events_app {
  __typename: "App";
  id: string;
  name: string | null;
  appUrl: string | null;
}

export interface OrderDetails_order_events_lines_discount_amount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_events_lines_discount_oldAmount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_events_lines_discount {
  __typename: "OrderEventDiscountObject";
  valueType: DiscountValueTypeEnum;
  value: any;
  reason: string | null;
  amount: OrderDetails_order_events_lines_discount_amount | null;
  oldValueType: DiscountValueTypeEnum | null;
  oldValue: any | null;
  oldAmount: OrderDetails_order_events_lines_discount_oldAmount | null;
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
  itemName: string | null;
  discount: OrderDetails_order_events_lines_discount | null;
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
  discount: OrderDetails_order_events_discount | null;
  relatedOrder: OrderDetails_order_events_relatedOrder | null;
  message: string | null;
  quantity: number | null;
  transactionReference: string | null;
  type: OrderEventsEnum | null;
  user: OrderDetails_order_events_user | null;
  app: OrderDetails_order_events_app | null;
  lines: (OrderDetails_order_events_lines | null)[] | null;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number | null;
  preorder: OrderDetails_order_fulfillments_lines_orderLine_variant_preorder | null;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_fulfillments_lines_orderLine_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderDetails_order_fulfillments_lines_orderLine_undiscountedUnitPrice_gross;
  net: OrderDetails_order_fulfillments_lines_orderLine_undiscountedUnitPrice_net;
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
  productSku: string | null;
  quantity: number;
  quantityFulfilled: number;
  quantityToFulfill: number;
  unitDiscount: OrderDetails_order_fulfillments_lines_orderLine_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderDetails_order_fulfillments_lines_orderLine_undiscountedUnitPrice;
  unitPrice: OrderDetails_order_fulfillments_lines_orderLine_unitPrice;
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

export interface OrderDetails_order_lines_variant_preorder {
  __typename: "PreorderData";
  endDate: any | null;
}

export interface OrderDetails_order_lines_variant {
  __typename: "ProductVariant";
  id: string;
  quantityAvailable: number | null;
  preorder: OrderDetails_order_lines_variant_preorder | null;
}

export interface OrderDetails_order_lines_unitDiscount {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_lines_undiscountedUnitPrice_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_lines_undiscountedUnitPrice_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_lines_undiscountedUnitPrice {
  __typename: "TaxedMoney";
  currency: string;
  gross: OrderDetails_order_lines_undiscountedUnitPrice_gross;
  net: OrderDetails_order_lines_undiscountedUnitPrice_net;
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
  productSku: string | null;
  quantity: number;
  quantityFulfilled: number;
  quantityToFulfill: number;
  unitDiscount: OrderDetails_order_lines_unitDiscount;
  unitDiscountValue: any;
  unitDiscountReason: string | null;
  unitDiscountType: DiscountValueTypeEnum | null;
  undiscountedUnitPrice: OrderDetails_order_lines_undiscountedUnitPrice;
  unitPrice: OrderDetails_order_lines_unitPrice;
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

export interface OrderDetails_order_deliveryMethod_ShippingMethod {
  __typename: "ShippingMethod";
  id: string;
}

export interface OrderDetails_order_deliveryMethod_Warehouse {
  __typename: "Warehouse";
  id: string;
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
}

export type OrderDetails_order_deliveryMethod = OrderDetails_order_deliveryMethod_ShippingMethod | OrderDetails_order_deliveryMethod_Warehouse;

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

export interface OrderDetails_order_subtotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_subtotal {
  __typename: "TaxedMoney";
  gross: OrderDetails_order_subtotal_gross;
  net: OrderDetails_order_subtotal_net;
}

export interface OrderDetails_order_total_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_total_net {
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
  net: OrderDetails_order_total_net;
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

export interface OrderDetails_order_undiscountedTotal_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_undiscountedTotal_gross {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_undiscountedTotal {
  __typename: "TaxedMoney";
  net: OrderDetails_order_undiscountedTotal_net;
  gross: OrderDetails_order_undiscountedTotal_gross;
}

export interface OrderDetails_order_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface OrderDetails_order_shippingMethods_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface OrderDetails_order_shippingMethods {
  __typename: "ShippingMethod";
  id: string;
  name: string;
  price: OrderDetails_order_shippingMethods_price;
  active: boolean;
  message: string | null;
}

export interface OrderDetails_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface OrderDetails_order_channel_defaultCountry {
  __typename: "CountryDisplay";
  code: string;
}

export interface OrderDetails_order_channel {
  __typename: "Channel";
  isActive: boolean;
  id: string;
  name: string;
  currencyCode: string;
  slug: string;
  defaultCountry: OrderDetails_order_channel_defaultCountry;
}

export interface OrderDetails_order {
  __typename: "Order";
  id: string;
  token: string;
  metadata: (OrderDetails_order_metadata | null)[];
  privateMetadata: (OrderDetails_order_privateMetadata | null)[];
  billingAddress: OrderDetails_order_billingAddress | null;
  giftCards: (OrderDetails_order_giftCards | null)[] | null;
  isShippingRequired: boolean;
  canFinalize: boolean;
  created: any;
  customerNote: string;
  discounts: OrderDetails_order_discounts[] | null;
  events: (OrderDetails_order_events | null)[] | null;
  fulfillments: (OrderDetails_order_fulfillments | null)[];
  lines: (OrderDetails_order_lines | null)[];
  number: string | null;
  isPaid: boolean;
  paymentStatus: PaymentChargeStatusEnum;
  shippingAddress: OrderDetails_order_shippingAddress | null;
  deliveryMethod: OrderDetails_order_deliveryMethod | null;
  shippingMethod: OrderDetails_order_shippingMethod | null;
  shippingMethodName: string | null;
  collectionPointName: string | null;
  shippingPrice: OrderDetails_order_shippingPrice;
  status: OrderStatus;
  subtotal: OrderDetails_order_subtotal;
  total: OrderDetails_order_total;
  actions: (OrderAction | null)[];
  totalAuthorized: OrderDetails_order_totalAuthorized;
  totalCaptured: OrderDetails_order_totalCaptured;
  undiscountedTotal: OrderDetails_order_undiscountedTotal;
  user: OrderDetails_order_user | null;
  userEmail: string | null;
  shippingMethods: (OrderDetails_order_shippingMethods | null)[] | null;
  invoices: (OrderDetails_order_invoices | null)[] | null;
  channel: OrderDetails_order_channel;
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
  fulfillmentAllowUnpaid: boolean;
  fulfillmentAutoApprove: boolean;
}

export interface OrderDetails {
  order: OrderDetails_order | null;
  shop: OrderDetails_shop;
}

export interface OrderDetailsVariables {
  id: string;
}
