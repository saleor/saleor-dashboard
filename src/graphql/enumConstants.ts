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
  LanguageCodeEnum,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
  PaymentMethodTypeEnum,
  PermissionEnum,
  ProductAttributeType,
  ProductTypeConfigurable,
  ProductTypeEnum,
  StaffMemberStatus,
  StockAvailability,
  VariantAttributeScope,
  VoucherDiscountType,
  WeightUnitsEnum,
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

// Stock Availability
export const StockAvailabilityValues: StockAvailability[] = [
  "IN_STOCK", "OUT_OF_STOCK"
];

// Weight Units
export const WeightUnitsEnumValues: WeightUnitsEnum[] = [
  "G", "KG", "LB", "OZ", "TONNE"
];

// Language Codes
export const LanguageCodeEnumValues: LanguageCodeEnum[] = [
  "AF", "AF_NA", "AF_ZA", "AGQ", "AGQ_CM", "AK", "AK_GH", "AM", "AM_ET", "AR",
  "AR_AE", "AR_BH", "AR_DJ", "AR_DZ", "AR_EG", "AR_EH", "AR_ER", "AR_IL", "AR_IQ", "AR_JO",
  "AR_KM", "AR_KW", "AR_LB", "AR_LY", "AR_MA", "AR_MR", "AR_OM", "AR_PS", "AR_QA", "AR_SA",
  "AR_SD", "AR_SO", "AR_SS", "AR_SY", "AR_TD", "AR_TN", "AR_YE", "AS", "ASA", "ASA_TZ",
  "AST", "AST_ES", "AS_IN", "AZ", "AZ_CYRL", "AZ_CYRL_AZ", "AZ_LATN", "AZ_LATN_AZ", "BAS", "BAS_CM",
  "BE", "BEM", "BEM_ZM", "BEZ", "BEZ_TZ", "BE_BY", "BG", "BG_BG", "BM", "BM_ML",
  "BN", "BN_BD", "BN_IN", "BO", "BO_CN", "BO_IN", "BR", "BRX", "BRX_IN", "BR_FR",
  "BS", "BS_CYRL", "BS_CYRL_BA", "BS_LATN", "BS_LATN_BA", "CA", "CA_AD", "CA_ES", "CA_ES_VALENCIA", "CA_FR",
  "CA_IT", "CCP", "CCP_BD", "CCP_IN", "CE", "CEB", "CEB_PH", "CE_RU", "CGG", "CGG_UG",
  "CHR", "CHR_US", "CKB", "CKB_IQ", "CKB_IR", "CS", "CS_CZ", "CU", "CU_RU", "CY",
  "CY_GB", "DA", "DAV", "DAV_KE", "DA_DK", "DA_GL", "DE", "DE_AT", "DE_BE", "DE_CH",
  "DE_DE", "DE_IT", "DE_LI", "DE_LU", "DJE", "DJE_NE", "DSB", "DSB_DE", "DUA", "DUA_CM",
  "DYO", "DYO_SN", "DZ", "DZ_BT", "EBU", "EBU_KE", "EE", "EE_GH", "EE_TG", "EL",
  "EL_CY", "EL_GR", "EN", "EN_AE", "EN_AG", "EN_AI", "EN_AS", "EN_AT", "EN_AU", "EN_BB",
  "EN_BE", "EN_BI", "EN_BM", "EN_BS", "EN_BW", "EN_BZ", "EN_CA", "EN_CC", "EN_CH", "EN_CK",
  "EN_CM", "EN_CX", "EN_CY", "EN_DE", "EN_DG", "EN_DK", "EN_DM", "EN_ER", "EN_FI", "EN_FJ",
  "EN_FK", "EN_FM", "EN_GB", "EN_GD", "EN_GG", "EN_GH", "EN_GI", "EN_GM", "EN_GU", "EN_GY",
  "EN_HK", "EN_IE", "EN_IL", "EN_IM", "EN_IN", "EN_IO", "EN_JE", "EN_JM", "EN_KE", "EN_KI",
  "EN_KN", "EN_KY", "EN_LC", "EN_LR", "EN_LS", "EN_MG", "EN_MH", "EN_MO", "EN_MP", "EN_MS",
  "EN_MT", "EN_MU", "EN_MW", "EN_MY", "EN_NA", "EN_NF", "EN_NG", "EN_NL", "EN_NR", "EN_NU",
  "EN_NZ", "EN_PG", "EN_PH", "EN_PK", "EN_PN", "EN_PR", "EN_PW", "EN_RW", "EN_SB", "EN_SC",
  "EN_SD", "EN_SE", "EN_SG", "EN_SH", "EN_SI", "EN_SL", "EN_SS", "EN_SX", "EN_SZ", "EN_TC",
  "EN_TK", "EN_TO", "EN_TT", "EN_TV", "EN_TZ", "EN_UG", "EN_UM", "EN_US", "EN_VC", "EN_VG",
  "EN_VI", "EN_VU", "EN_WS", "EN_ZA", "EN_ZM", "EN_ZW", "EO", "ES", "ES_AR", "ES_BO",
  "ES_BR", "ES_BZ", "ES_CL", "ES_CO", "ES_CR", "ES_CU", "ES_DO", "ES_EA", "ES_EC", "ES_ES",
  "ES_GQ", "ES_GT", "ES_HN", "ES_IC", "ES_MX", "ES_NI", "ES_PA", "ES_PE", "ES_PH", "ES_PR",
  "ES_PY", "ES_SV", "ES_US", "ES_UY", "ES_VE", "ET", "ET_EE", "EU", "EU_ES", "EWO",
  "EWO_CM", "FA", "FA_AF", "FA_IR", "FF", "FF_ADLM", "FF_ADLM_BF", "FF_ADLM_CM", "FF_ADLM_GH", "FF_ADLM_GM",
  "FF_ADLM_GN", "FF_ADLM_GW", "FF_ADLM_LR", "FF_ADLM_MR", "FF_ADLM_NE", "FF_ADLM_NG", "FF_ADLM_SL", "FF_ADLM_SN", "FF_LATN", "FF_LATN_BF",
  "FF_LATN_CM", "FF_LATN_GH", "FF_LATN_GM", "FF_LATN_GN", "FF_LATN_GW", "FF_LATN_LR", "FF_LATN_MR", "FF_LATN_NE", "FF_LATN_NG", "FF_LATN_SL",
  "FF_LATN_SN", "FI", "FIL", "FIL_PH", "FI_FI", "FO", "FO_DK", "FO_FO", "FR", "FR_BE",
  "FR_BF", "FR_BI", "FR_BJ", "FR_BL", "FR_CA", "FR_CD", "FR_CF", "FR_CG", "FR_CH", "FR_CI",
  "FR_CM", "FR_DJ", "FR_DZ", "FR_FR", "FR_GA", "FR_GF", "FR_GN", "FR_GP", "FR_GQ", "FR_HT",
  "FR_KM", "FR_LU", "FR_MA", "FR_MC", "FR_MF", "FR_MG", "FR_ML", "FR_MQ", "FR_MR", "FR_MU",
  "FR_NC", "FR_NE", "FR_PF", "FR_PM", "FR_RE", "FR_RW", "FR_SC", "FR_SN", "FR_SY", "FR_TD",
  "FR_TG", "FR_TN", "FR_VU", "FR_WF", "FR_YT", "FUR", "FUR_IT", "FY", "FY_NL", "GA",
  "GA_GB", "GA_IE", "GD", "GD_GB", "GL", "GL_ES", "GSW", "GSW_CH", "GSW_FR", "GSW_LI",
  "GU", "GUZ", "GUZ_KE", "GU_IN", "GV", "GV_IM", "HA", "HAW", "HAW_US", "HA_GH",
  "HA_NE", "HA_NG", "HE", "HE_IL", "HI", "HI_IN", "HR", "HR_BA", "HR_HR", "HSB",
  "HSB_DE", "HU", "HU_HU", "HY", "HY_AM", "IA", "ID", "ID_ID", "IG", "IG_NG",
  "II", "II_CN", "IS", "IS_IS", "IT", "IT_CH", "IT_IT", "IT_SM", "IT_VA", "JA",
  "JA_JP", "JGO", "JGO_CM", "JMC", "JMC_TZ", "JV", "JV_ID", "KA", "KAB", "KAB_DZ",
  "KAM", "KAM_KE", "KA_GE", "KDE", "KDE_TZ", "KEA", "KEA_CV", "KHQ", "KHQ_ML", "KI",
  "KI_KE", "KK", "KKJ", "KKJ_CM", "KK_KZ", "KL", "KLN", "KLN_KE", "KL_GL", "KM",
  "KM_KH", "KN", "KN_IN", "KO", "KOK", "KOK_IN", "KO_KP", "KO_KR", "KS", "KSB",
  "KSB_TZ", "KSF", "KSF_CM", "KSH", "KSH_DE", "KS_ARAB", "KS_ARAB_IN", "KU", "KU_TR", "KW",
  "KW_GB", "KY", "KY_KG", "LAG", "LAG_TZ", "LB", "LB_LU", "LG", "LG_UG", "LKT",
  "LKT_US", "LN", "LN_AO", "LN_CD", "LN_CF", "LN_CG", "LO", "LO_LA", "LRC", "LRC_IQ",
  "LRC_IR", "LT", "LT_LT", "LU", "LUO", "LUO_KE", "LUY", "LUY_KE", "LU_CD", "LV",
  "LV_LV", "MAI", "MAI_IN", "MAS", "MAS_KE", "MAS_TZ", "MER", "MER_KE", "MFE", "MFE_MU",
  "MG", "MGH", "MGH_MZ", "MGO", "MGO_CM", "MG_MG", "MI", "MI_NZ", "MK", "MK_MK",
  "ML", "ML_IN", "MN", "MNI", "MNI_BENG", "MNI_BENG_IN", "MN_MN", "MR", "MR_IN", "MS",
  "MS_BN", "MS_ID", "MS_MY", "MS_SG", "MT", "MT_MT", "MUA", "MUA_CM", "MY", "MY_MM",
  "MZN", "MZN_IR", "NAQ", "NAQ_NA", "NB", "NB_NO", "NB_SJ", "ND", "NDS", "NDS_DE",
  "NDS_NL", "ND_ZW", "NE", "NE_IN", "NE_NP", "NL", "NL_AW", "NL_BE", "NL_BQ", "NL_CW",
  "NL_NL", "NL_SR", "NL_SX", "NMG", "NMG_CM", "NN", "NNH", "NNH_CM", "NN_NO", "NUS",
  "NUS_SS", "NYN", "NYN_UG", "OM", "OM_ET", "OM_KE", "OR", "OR_IN", "OS", "OS_GE",
  "OS_RU", "PA", "PA_ARAB", "PA_ARAB_PK", "PA_GURU", "PA_GURU_IN", "PCM", "PCM_NG", "PL", "PL_PL",
  "PRG", "PS", "PS_AF", "PS_PK", "PT", "PT_AO", "PT_BR", "PT_CH", "PT_CV", "PT_GQ",
  "PT_GW", "PT_LU", "PT_MO", "PT_MZ", "PT_PT", "PT_ST", "PT_TL", "QU", "QU_BO", "QU_EC",
  "QU_PE", "RM", "RM_CH", "RN", "RN_BI", "RO", "ROF", "ROF_TZ", "RO_MD", "RO_RO",
  "RU", "RU_BY", "RU_KG", "RU_KZ", "RU_MD", "RU_RU", "RU_UA", "RW", "RWK", "RWK_TZ",
  "RW_RW", "SAH", "SAH_RU", "SAQ", "SAQ_KE", "SAT", "SAT_OLCK", "SAT_OLCK_IN", "SBP", "SBP_TZ",
  "SD", "SD_ARAB", "SD_ARAB_PK", "SD_DEVA", "SD_DEVA_IN", "SE", "SEH", "SEH_MZ", "SES", "SES_ML",
  "SE_FI", "SE_NO", "SE_SE", "SG", "SG_CF", "SHI", "SHI_LATN", "SHI_LATN_MA", "SHI_TFNG", "SHI_TFNG_MA",
  "SI", "SI_LK", "SK", "SK_SK", "SL", "SL_SI", "SMN", "SMN_FI", "SN", "SN_ZW",
  "SO", "SO_DJ", "SO_ET", "SO_KE", "SO_SO", "SQ", "SQ_AL", "SQ_MK", "SQ_XK", "SR",
  "SR_CYRL", "SR_CYRL_BA", "SR_CYRL_ME", "SR_CYRL_RS", "SR_CYRL_XK", "SR_LATN", "SR_LATN_BA", "SR_LATN_ME", "SR_LATN_RS", "SR_LATN_XK",
  "SU", "SU_LATN", "SU_LATN_ID", "SV", "SV_AX", "SV_FI", "SV_SE", "SW", "SW_CD", "SW_KE",
  "SW_TZ", "SW_UG", "TA", "TA_IN", "TA_LK", "TA_MY", "TA_SG", "TE", "TEO", "TEO_KE",
  "TEO_UG", "TE_IN", "TG", "TG_TJ", "TH", "TH_TH", "TI", "TI_ER", "TI_ET", "TK",
  "TK_TM", "TO", "TO_TO", "TR", "TR_CY", "TR_TR", "TT", "TT_RU", "TWQ", "TWQ_NE",
  "TZM", "TZM_MA", "UG", "UG_CN", "UK", "UK_UA", "UR", "UR_IN", "UR_PK", "UZ",
  "UZ_ARAB", "UZ_ARAB_AF", "UZ_CYRL", "UZ_CYRL_UZ", "UZ_LATN", "UZ_LATN_UZ", "VAI", "VAI_LATN", "VAI_LATN_LR", "VAI_VAII",
  "VAI_VAII_LR", "VI", "VI_VN", "VO", "VUN", "VUN_TZ", "WAE", "WAE_CH", "WO", "WO_SN",
  "XH", "XH_ZA", "XOG", "XOG_UG", "YAV", "YAV_CM", "YI", "YO", "YO_BJ", "YO_NG",
  "YUE", "YUE_HANS", "YUE_HANS_CN", "YUE_HANT", "YUE_HANT_HK", "ZGH", "ZGH_MA", "ZH", "ZH_HANS", "ZH_HANS_CN",
  "ZH_HANS_HK", "ZH_HANS_MO", "ZH_HANS_SG", "ZH_HANT", "ZH_HANT_HK", "ZH_HANT_MO", "ZH_HANT_TW", "ZU", "ZU_ZA"
];

// Product Type Configurable
export const ProductTypeConfigurableValues: ProductTypeConfigurable[] = [
  "CONFIGURABLE", "SIMPLE"
];

// Variant Attribute Scope
export const VariantAttributeScopeValues: VariantAttributeScope[] = [
  "ALL", "NOT_VARIANT_SELECTION", "VARIANT_SELECTION"
];
