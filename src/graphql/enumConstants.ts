// This file provides runtime constants for GraphQL enum types
// that have been converted from TypeScript enums to type literals.
// These constants are needed when enum values need to be used at runtime
// (e.g., Object.values(), Object.keys(), iteration, etc.)

import type {
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  CollectionPublished,
  CountryCode,
  DiscountStatusEnum,
  DiscountValueTypeEnum,
  FulfillmentStatus,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
  PaymentMethodTypeEnum,
  PermissionEnum,
  ProductAttributeType,
  ProductTypeEnum,
  StaffMemberStatus,
  VoucherDiscountType,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "./types.generated";

// Collection Published
export const CollectionPublishedValues: CollectionPublished[] = [
  "HIDDEN", "PUBLISHED"
];

// Country Codes
export const CountryCodeValues: CountryCode[] = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR",
  "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE",
  "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ",
  "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD",
  "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR",
  "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM",
  "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "EU",
  "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE",
  "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR",
  "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT",
  "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS",
  "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM",
  "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI",
  "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD",
  "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP",
  "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
  "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR",
  "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL",
  "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO",
  "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH",
  "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST",
  "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ",
  "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ",
  "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG",
  "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM",
  "ZW"
];

// Attribute Type
export const AttributeTypeEnumValues: AttributeTypeEnum[] = [
  "PAGE_TYPE", "PRODUCT_TYPE"
];

// Order Status
export const OrderStatusValues: OrderStatus[] = [
  "CANCELED", "DRAFT", "EXPIRED", "FULFILLED", "PARTIALLY_FULFILLED",
  "PARTIALLY_RETURNED", "RETURNED", "UNCONFIRMED", "UNFULFILLED"
];

// Order Charge Status
export const OrderChargeStatusEnumValues: OrderChargeStatusEnum[] = [
  "FULL", "NONE", "OVERCHARGED", "PARTIAL"
];

// Fulfillment Status
export const FulfillmentStatusValues: FulfillmentStatus[] = [
  "CANCELED", "FULFILLED", "REFUNDED", "REFUNDED_AND_RETURNED", "REPLACED",
  "RETURNED", "WAITING_FOR_APPROVAL"
];

// Order Authorize Status
export const OrderAuthorizeStatusEnumValues: OrderAuthorizeStatusEnum[] = [
  "FULL", "NONE", "PARTIAL"
];

// Payment Method Type
export const PaymentMethodTypeEnumValues: PaymentMethodTypeEnum[] = [
  "CARD", "OTHER"
];

// Product Type
export const ProductTypeEnumValues: ProductTypeEnum[] = [
  "DIGITAL", "SHIPPABLE"
];

// Staff Member Status
export const StaffMemberStatusValues: StaffMemberStatus[] = [
  "ACTIVE", "DEACTIVATED"
];

// Voucher Discount Type
export const VoucherDiscountTypeValues: VoucherDiscountType[] = [
  "FIXED", "PERCENTAGE", "SHIPPING"
];

// Discount Status
export const DiscountStatusEnumValues: DiscountStatusEnum[] = [
  "ACTIVE", "EXPIRED", "SCHEDULED"
];

// Discount Value Type
export const DiscountValueTypeEnumValues: DiscountValueTypeEnum[] = [
  "FIXED", "PERCENTAGE"
];

// Webhook Event Type Async
export const WebhookEventTypeAsyncEnumValues: WebhookEventTypeAsyncEnum[] = [
  "ACCOUNT_CHANGE_EMAIL_REQUESTED",
  "ACCOUNT_CONFIRMATION_REQUESTED",
  "ACCOUNT_CONFIRMED",
  "ACCOUNT_DELETED",
  "ACCOUNT_DELETE_REQUESTED",
  "ACCOUNT_EMAIL_CHANGED",
  "ACCOUNT_SET_PASSWORD_REQUESTED",
  "ADDRESS_CREATED",
  "ADDRESS_DELETED",
  "ADDRESS_UPDATED",
  "ANY_EVENTS",
  "APP_DELETED",
  "APP_INSTALLED",
  "APP_STATUS_CHANGED",
  "APP_UPDATED",
  "ATTRIBUTE_CREATED",
  "ATTRIBUTE_DELETED",
  "ATTRIBUTE_UPDATED",
  "ATTRIBUTE_VALUE_CREATED",
  "ATTRIBUTE_VALUE_DELETED",
  "ATTRIBUTE_VALUE_UPDATED",
  "CATEGORY_CREATED",
  "CATEGORY_DELETED",
  "CATEGORY_UPDATED",
  "CHANNEL_CREATED",
  "CHANNEL_DELETED",
  "CHANNEL_METADATA_UPDATED",
  "CHANNEL_STATUS_CHANGED",
  "CHANNEL_UPDATED",
  "CHECKOUT_CREATED",
  "CHECKOUT_FULLY_AUTHORIZED",
  "CHECKOUT_FULLY_PAID",
  "CHECKOUT_METADATA_UPDATED",
  "CHECKOUT_UPDATED",
  "COLLECTION_CREATED",
  "COLLECTION_DELETED",
  "COLLECTION_METADATA_UPDATED",
  "COLLECTION_UPDATED",
  "CUSTOMER_CREATED",
  "CUSTOMER_DELETED",
  "CUSTOMER_METADATA_UPDATED",
  "CUSTOMER_UPDATED",
  "DRAFT_ORDER_CREATED",
  "DRAFT_ORDER_DELETED",
  "DRAFT_ORDER_UPDATED",
  "FULFILLMENT_APPROVED",
  "FULFILLMENT_CANCELED",
  "FULFILLMENT_CREATED",
  "FULFILLMENT_METADATA_UPDATED",
  "FULFILLMENT_TRACKING_NUMBER_UPDATED",
  "GIFT_CARD_CREATED",
  "GIFT_CARD_DELETED",
  "GIFT_CARD_EXPORT_COMPLETED",
  "GIFT_CARD_METADATA_UPDATED",
  "GIFT_CARD_SENT",
  "GIFT_CARD_STATUS_CHANGED",
  "GIFT_CARD_UPDATED",
  "INVOICE_DELETED",
  "INVOICE_REQUESTED",
  "INVOICE_SENT",
  "MENU_CREATED",
  "MENU_DELETED",
  "MENU_ITEM_CREATED",
  "MENU_ITEM_DELETED",
  "MENU_ITEM_UPDATED",
  "MENU_UPDATED",
  "NOTIFY_USER",
  "OBSERVABILITY",
  "ORDER_BULK_CREATED",
  "ORDER_CANCELLED",
  "ORDER_CONFIRMED",
  "ORDER_CREATED",
  "ORDER_EXPIRED",
  "ORDER_FULFILLED",
  "ORDER_FULLY_PAID",
  "ORDER_FULLY_REFUNDED",
  "ORDER_METADATA_UPDATED",
  "ORDER_PAID",
  "ORDER_REFUNDED"
];

// Webhook Event Type Sync
export const WebhookEventTypeSyncEnumValues: WebhookEventTypeSyncEnum[] = [
  "CHECKOUT_CALCULATE_TAXES",
  "CHECKOUT_FILTER_SHIPPING_METHODS",
  "LIST_STORED_PAYMENT_METHODS",
  "ORDER_CALCULATE_TAXES",
  "ORDER_FILTER_SHIPPING_METHODS",
  "PAYMENT_AUTHORIZE",
  "PAYMENT_CAPTURE",
  "PAYMENT_CONFIRM",
  "PAYMENT_GATEWAY_INITIALIZE_SESSION",
  "PAYMENT_GATEWAY_INITIALIZE_TOKENIZATION_SESSION",
  "PAYMENT_LIST_GATEWAYS",
  "PAYMENT_METHOD_INITIALIZE_TOKENIZATION_SESSION",
  "PAYMENT_METHOD_PROCESS_TOKENIZATION_SESSION",
  "PAYMENT_PROCESS",
  "PAYMENT_REFUND",
  "PAYMENT_VOID",
  "SHIPPING_LIST_METHODS_FOR_CHECKOUT",
  "STORED_PAYMENT_METHOD_DELETE_REQUESTED",
  "TRANSACTION_CANCELATION_REQUESTED",
  "TRANSACTION_CHARGE_REQUESTED",
  "TRANSACTION_INITIALIZE_SESSION",
  "TRANSACTION_PROCESS_SESSION",
  "TRANSACTION_REFUND_REQUESTED"
];

// Permission Enum
export const PermissionEnumValues: PermissionEnum[] = [
  "HANDLE_CHECKOUTS", "HANDLE_PAYMENTS", "HANDLE_TAXES",
  "IMPERSONATE_USER", "MANAGE_APPS", "MANAGE_CHANNELS",
  "MANAGE_CHECKOUTS", "MANAGE_DISCOUNTS", "MANAGE_GIFT_CARD",
  "MANAGE_MENUS", "MANAGE_OBSERVABILITY", "MANAGE_ORDERS",
  "MANAGE_ORDERS_IMPORT", "MANAGE_PAGES", "MANAGE_PAGE_TYPES_AND_ATTRIBUTES",
  "MANAGE_PLUGINS", "MANAGE_PRODUCTS", "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
  "MANAGE_SETTINGS", "MANAGE_SHIPPING", "MANAGE_STAFF",
  "MANAGE_TAXES", "MANAGE_TRANSLATIONS", "MANAGE_USERS"
];

// Product Attribute Type
export const ProductAttributeTypeValues: ProductAttributeType[] = [
  "PRODUCT", "VARIANT"
];

// Attribute Input Type
export const AttributeInputTypeEnumValues: AttributeInputTypeEnum[] = [
  "BOOLEAN", "DATE", "DATE_TIME", "DROPDOWN", "FILE",
  "MULTISELECT", "NUMERIC", "PLAIN_TEXT", "REFERENCE", "RICH_TEXT",
  "SINGLE_REFERENCE", "SWATCH"
];
