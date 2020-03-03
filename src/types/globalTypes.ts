/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AddressTypeEnum {
  BILLING = "BILLING",
  SHIPPING = "SHIPPING",
}

export enum AttributeInputTypeEnum {
  DROPDOWN = "DROPDOWN",
  MULTISELECT = "MULTISELECT",
}

export enum AttributeSortField {
  AVAILABLE_IN_GRID = "AVAILABLE_IN_GRID",
  DASHBOARD_PRODUCT_POSITION = "DASHBOARD_PRODUCT_POSITION",
  DASHBOARD_VARIANT_POSITION = "DASHBOARD_VARIANT_POSITION",
  FILTERABLE_IN_DASHBOARD = "FILTERABLE_IN_DASHBOARD",
  FILTERABLE_IN_STOREFRONT = "FILTERABLE_IN_STOREFRONT",
  IS_VARIANT_ONLY = "IS_VARIANT_ONLY",
  NAME = "NAME",
  SLUG = "SLUG",
  STOREFRONT_SEARCH_POSITION = "STOREFRONT_SEARCH_POSITION",
  VALUE_REQUIRED = "VALUE_REQUIRED",
  VISIBLE_IN_STOREFRONT = "VISIBLE_IN_STOREFRONT",
}

export enum AttributeTypeEnum {
  PRODUCT = "PRODUCT",
  VARIANT = "VARIANT",
}

export enum AttributeValueType {
  COLOR = "COLOR",
  GRADIENT = "GRADIENT",
  STRING = "STRING",
  URL = "URL",
}

export enum AuthorizationKeyType {
  FACEBOOK = "FACEBOOK",
  GOOGLE_OAUTH2 = "GOOGLE_OAUTH2",
}

export enum CategorySortField {
  NAME = "NAME",
  PRODUCT_COUNT = "PRODUCT_COUNT",
  SUBCATEGORY_COUNT = "SUBCATEGORY_COUNT",
}

export enum CollectionPublished {
  HIDDEN = "HIDDEN",
  PUBLISHED = "PUBLISHED",
}

export enum CollectionSortField {
  AVAILABILITY = "AVAILABILITY",
  NAME = "NAME",
  PRODUCT_COUNT = "PRODUCT_COUNT",
}

export enum ConfigurationTypeFieldEnum {
  BOOLEAN = "BOOLEAN",
  PASSWORD = "PASSWORD",
  SECRET = "SECRET",
  STRING = "STRING",
}

export enum CountryCode {
  AD = "AD",
  AE = "AE",
  AF = "AF",
  AG = "AG",
  AI = "AI",
  AL = "AL",
  AM = "AM",
  AO = "AO",
  AQ = "AQ",
  AR = "AR",
  AS = "AS",
  AT = "AT",
  AU = "AU",
  AW = "AW",
  AX = "AX",
  AZ = "AZ",
  BA = "BA",
  BB = "BB",
  BD = "BD",
  BE = "BE",
  BF = "BF",
  BG = "BG",
  BH = "BH",
  BI = "BI",
  BJ = "BJ",
  BL = "BL",
  BM = "BM",
  BN = "BN",
  BO = "BO",
  BQ = "BQ",
  BR = "BR",
  BS = "BS",
  BT = "BT",
  BV = "BV",
  BW = "BW",
  BY = "BY",
  BZ = "BZ",
  CA = "CA",
  CC = "CC",
  CD = "CD",
  CF = "CF",
  CG = "CG",
  CH = "CH",
  CI = "CI",
  CK = "CK",
  CL = "CL",
  CM = "CM",
  CN = "CN",
  CO = "CO",
  CR = "CR",
  CU = "CU",
  CV = "CV",
  CW = "CW",
  CX = "CX",
  CY = "CY",
  CZ = "CZ",
  DE = "DE",
  DJ = "DJ",
  DK = "DK",
  DM = "DM",
  DO = "DO",
  DZ = "DZ",
  EC = "EC",
  EE = "EE",
  EG = "EG",
  EH = "EH",
  ER = "ER",
  ES = "ES",
  ET = "ET",
  EU = "EU",
  FI = "FI",
  FJ = "FJ",
  FK = "FK",
  FM = "FM",
  FO = "FO",
  FR = "FR",
  GA = "GA",
  GB = "GB",
  GD = "GD",
  GE = "GE",
  GF = "GF",
  GG = "GG",
  GH = "GH",
  GI = "GI",
  GL = "GL",
  GM = "GM",
  GN = "GN",
  GP = "GP",
  GQ = "GQ",
  GR = "GR",
  GS = "GS",
  GT = "GT",
  GU = "GU",
  GW = "GW",
  GY = "GY",
  HK = "HK",
  HM = "HM",
  HN = "HN",
  HR = "HR",
  HT = "HT",
  HU = "HU",
  ID = "ID",
  IE = "IE",
  IL = "IL",
  IM = "IM",
  IN = "IN",
  IO = "IO",
  IQ = "IQ",
  IR = "IR",
  IS = "IS",
  IT = "IT",
  JE = "JE",
  JM = "JM",
  JO = "JO",
  JP = "JP",
  KE = "KE",
  KG = "KG",
  KH = "KH",
  KI = "KI",
  KM = "KM",
  KN = "KN",
  KP = "KP",
  KR = "KR",
  KW = "KW",
  KY = "KY",
  KZ = "KZ",
  LA = "LA",
  LB = "LB",
  LC = "LC",
  LI = "LI",
  LK = "LK",
  LR = "LR",
  LS = "LS",
  LT = "LT",
  LU = "LU",
  LV = "LV",
  LY = "LY",
  MA = "MA",
  MC = "MC",
  MD = "MD",
  ME = "ME",
  MF = "MF",
  MG = "MG",
  MH = "MH",
  MK = "MK",
  ML = "ML",
  MM = "MM",
  MN = "MN",
  MO = "MO",
  MP = "MP",
  MQ = "MQ",
  MR = "MR",
  MS = "MS",
  MT = "MT",
  MU = "MU",
  MV = "MV",
  MW = "MW",
  MX = "MX",
  MY = "MY",
  MZ = "MZ",
  NA = "NA",
  NC = "NC",
  NE = "NE",
  NF = "NF",
  NG = "NG",
  NI = "NI",
  NL = "NL",
  NO = "NO",
  NP = "NP",
  NR = "NR",
  NU = "NU",
  NZ = "NZ",
  OM = "OM",
  PA = "PA",
  PE = "PE",
  PF = "PF",
  PG = "PG",
  PH = "PH",
  PK = "PK",
  PL = "PL",
  PM = "PM",
  PN = "PN",
  PR = "PR",
  PS = "PS",
  PT = "PT",
  PW = "PW",
  PY = "PY",
  QA = "QA",
  RE = "RE",
  RO = "RO",
  RS = "RS",
  RU = "RU",
  RW = "RW",
  SA = "SA",
  SB = "SB",
  SC = "SC",
  SD = "SD",
  SE = "SE",
  SG = "SG",
  SH = "SH",
  SI = "SI",
  SJ = "SJ",
  SK = "SK",
  SL = "SL",
  SM = "SM",
  SN = "SN",
  SO = "SO",
  SR = "SR",
  SS = "SS",
  ST = "ST",
  SV = "SV",
  SX = "SX",
  SY = "SY",
  SZ = "SZ",
  TC = "TC",
  TD = "TD",
  TF = "TF",
  TG = "TG",
  TH = "TH",
  TJ = "TJ",
  TK = "TK",
  TL = "TL",
  TM = "TM",
  TN = "TN",
  TO = "TO",
  TR = "TR",
  TT = "TT",
  TV = "TV",
  TW = "TW",
  TZ = "TZ",
  UA = "UA",
  UG = "UG",
  UM = "UM",
  US = "US",
  UY = "UY",
  UZ = "UZ",
  VA = "VA",
  VC = "VC",
  VE = "VE",
  VG = "VG",
  VI = "VI",
  VN = "VN",
  VU = "VU",
  WF = "WF",
  WS = "WS",
  YE = "YE",
  YT = "YT",
  ZA = "ZA",
  ZM = "ZM",
  ZW = "ZW",
}

export enum DiscountStatusEnum {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  SCHEDULED = "SCHEDULED",
}

export enum DiscountValueTypeEnum {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum FulfillmentStatus {
  CANCELED = "CANCELED",
  FULFILLED = "FULFILLED",
}

export enum LanguageCodeEnum {
  AR = "AR",
  AZ = "AZ",
  BG = "BG",
  BN = "BN",
  CA = "CA",
  CS = "CS",
  DA = "DA",
  DE = "DE",
  EL = "EL",
  EN = "EN",
  ES = "ES",
  ES_CO = "ES_CO",
  ET = "ET",
  FA = "FA",
  FR = "FR",
  HI = "HI",
  HU = "HU",
  HY = "HY",
  ID = "ID",
  IS = "IS",
  IT = "IT",
  JA = "JA",
  KO = "KO",
  LT = "LT",
  MN = "MN",
  NB = "NB",
  NL = "NL",
  PL = "PL",
  PT = "PT",
  PT_BR = "PT_BR",
  RO = "RO",
  RU = "RU",
  SK = "SK",
  SQ = "SQ",
  SR = "SR",
  SV = "SV",
  SW = "SW",
  TH = "TH",
  TR = "TR",
  UK = "UK",
  VI = "VI",
  ZH_HANS = "ZH_HANS",
  ZH_HANT = "ZH_HANT",
}

export enum MenuSortField {
  ITEMS_COUNT = "ITEMS_COUNT",
  NAME = "NAME",
}

export enum OrderAction {
  CAPTURE = "CAPTURE",
  MARK_AS_PAID = "MARK_AS_PAID",
  REFUND = "REFUND",
  VOID = "VOID",
}

export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export enum OrderEventsEmailsEnum {
  DIGITAL_LINKS = "DIGITAL_LINKS",
  FULFILLMENT_CONFIRMATION = "FULFILLMENT_CONFIRMATION",
  ORDER_CONFIRMATION = "ORDER_CONFIRMATION",
  PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION",
  SHIPPING_CONFIRMATION = "SHIPPING_CONFIRMATION",
  TRACKING_UPDATED = "TRACKING_UPDATED",
}

export enum OrderEventsEnum {
  CANCELED = "CANCELED",
  DRAFT_ADDED_PRODUCTS = "DRAFT_ADDED_PRODUCTS",
  DRAFT_CREATED = "DRAFT_CREATED",
  DRAFT_REMOVED_PRODUCTS = "DRAFT_REMOVED_PRODUCTS",
  EMAIL_SENT = "EMAIL_SENT",
  FULFILLMENT_CANCELED = "FULFILLMENT_CANCELED",
  FULFILLMENT_FULFILLED_ITEMS = "FULFILLMENT_FULFILLED_ITEMS",
  FULFILLMENT_RESTOCKED_ITEMS = "FULFILLMENT_RESTOCKED_ITEMS",
  NOTE_ADDED = "NOTE_ADDED",
  ORDER_FULLY_PAID = "ORDER_FULLY_PAID",
  ORDER_MARKED_AS_PAID = "ORDER_MARKED_AS_PAID",
  OTHER = "OTHER",
  OVERSOLD_ITEMS = "OVERSOLD_ITEMS",
  PAYMENT_CAPTURED = "PAYMENT_CAPTURED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
  PAYMENT_VOIDED = "PAYMENT_VOIDED",
  PLACED = "PLACED",
  PLACED_FROM_DRAFT = "PLACED_FROM_DRAFT",
  TRACKING_UPDATED = "TRACKING_UPDATED",
  UPDATED_ADDRESS = "UPDATED_ADDRESS",
}

export enum OrderSortField {
  CREATION_DATE = "CREATION_DATE",
  CUSTOMER = "CUSTOMER",
  FULFILLMENT_STATUS = "FULFILLMENT_STATUS",
  NUMBER = "NUMBER",
  PAYMENT = "PAYMENT",
  TOTAL = "TOTAL",
}

export enum OrderStatus {
  CANCELED = "CANCELED",
  DRAFT = "DRAFT",
  FULFILLED = "FULFILLED",
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
  UNFULFILLED = "UNFULFILLED",
}

export enum OrderStatusFilter {
  CANCELED = "CANCELED",
  FULFILLED = "FULFILLED",
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
  READY_TO_CAPTURE = "READY_TO_CAPTURE",
  READY_TO_FULFILL = "READY_TO_FULFILL",
  UNFULFILLED = "UNFULFILLED",
}

export enum PageSortField {
  CREATION_DATE = "CREATION_DATE",
  PUBLICATION_DATE = "PUBLICATION_DATE",
  SLUG = "SLUG",
  TITLE = "TITLE",
  VISIBILITY = "VISIBILITY",
}

export enum PaymentChargeStatusEnum {
  FULLY_CHARGED = "FULLY_CHARGED",
  FULLY_REFUNDED = "FULLY_REFUNDED",
  NOT_CHARGED = "NOT_CHARGED",
  PARTIALLY_CHARGED = "PARTIALLY_CHARGED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum PermissionEnum {
  MANAGE_CHECKOUTS = "MANAGE_CHECKOUTS",
  MANAGE_DISCOUNTS = "MANAGE_DISCOUNTS",
  MANAGE_GIFT_CARD = "MANAGE_GIFT_CARD",
  MANAGE_MENUS = "MANAGE_MENUS",
  MANAGE_ORDERS = "MANAGE_ORDERS",
  MANAGE_PAGES = "MANAGE_PAGES",
  MANAGE_PLUGINS = "MANAGE_PLUGINS",
  MANAGE_PRODUCTS = "MANAGE_PRODUCTS",
  MANAGE_SERVICE_ACCOUNTS = "MANAGE_SERVICE_ACCOUNTS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
  MANAGE_SHIPPING = "MANAGE_SHIPPING",
  MANAGE_STAFF = "MANAGE_STAFF",
  MANAGE_TRANSLATIONS = "MANAGE_TRANSLATIONS",
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_WEBHOOKS = "MANAGE_WEBHOOKS",
}

export enum PluginSortField {
  IS_ACTIVE = "IS_ACTIVE",
  NAME = "NAME",
}

export enum ProductErrorCode {
  ALREADY_EXISTS = "ALREADY_EXISTS",
  ATTRIBUTE_ALREADY_ASSIGNED = "ATTRIBUTE_ALREADY_ASSIGNED",
  ATTRIBUTE_CANNOT_BE_ASSIGNED = "ATTRIBUTE_CANNOT_BE_ASSIGNED",
  ATTRIBUTE_VARIANTS_DISABLED = "ATTRIBUTE_VARIANTS_DISABLED",
  GRAPHQL_ERROR = "GRAPHQL_ERROR",
  INVALID = "INVALID",
  NOT_FOUND = "NOT_FOUND",
  NOT_PRODUCTS_IMAGE = "NOT_PRODUCTS_IMAGE",
  REQUIRED = "REQUIRED",
  UNIQUE = "UNIQUE",
  VARIANT_NO_DIGITAL_CONTENT = "VARIANT_NO_DIGITAL_CONTENT",
}

export enum ProductOrderField {
  DATE = "DATE",
  MINIMAL_PRICE = "MINIMAL_PRICE",
  NAME = "NAME",
  PRICE = "PRICE",
  PUBLISHED = "PUBLISHED",
  TYPE = "TYPE",
}

export enum ProductTypeConfigurable {
  CONFIGURABLE = "CONFIGURABLE",
  SIMPLE = "SIMPLE",
}

export enum ProductTypeEnum {
  DIGITAL = "DIGITAL",
  SHIPPABLE = "SHIPPABLE",
}

export enum ProductTypeSortField {
  DIGITAL = "DIGITAL",
  NAME = "NAME",
  SHIPPING_REQUIRED = "SHIPPING_REQUIRED",
}

export enum SaleSortField {
  END_DATE = "END_DATE",
  NAME = "NAME",
  START_DATE = "START_DATE",
  TYPE = "TYPE",
  VALUE = "VALUE",
}

export enum SaleType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum ServiceAccountSortField {
  CREATION_DATE = "CREATION_DATE",
  NAME = "NAME",
}

export enum ShippingMethodTypeEnum {
  PRICE = "PRICE",
  WEIGHT = "WEIGHT",
}

export enum StaffMemberStatus {
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
}

export enum StockAvailability {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export enum TaxRateType {
  ACCOMMODATION = "ACCOMMODATION",
  ADMISSION_TO_CULTURAL_EVENTS = "ADMISSION_TO_CULTURAL_EVENTS",
  ADMISSION_TO_ENTERTAINMENT_EVENTS = "ADMISSION_TO_ENTERTAINMENT_EVENTS",
  ADMISSION_TO_SPORTING_EVENTS = "ADMISSION_TO_SPORTING_EVENTS",
  ADVERTISING = "ADVERTISING",
  AGRICULTURAL_SUPPLIES = "AGRICULTURAL_SUPPLIES",
  BABY_FOODSTUFFS = "BABY_FOODSTUFFS",
  BIKES = "BIKES",
  BOOKS = "BOOKS",
  CHILDRENS_CLOTHING = "CHILDRENS_CLOTHING",
  DOMESTIC_FUEL = "DOMESTIC_FUEL",
  DOMESTIC_SERVICES = "DOMESTIC_SERVICES",
  E_BOOKS = "E_BOOKS",
  FOODSTUFFS = "FOODSTUFFS",
  HOTELS = "HOTELS",
  MEDICAL = "MEDICAL",
  NEWSPAPERS = "NEWSPAPERS",
  PASSENGER_TRANSPORT = "PASSENGER_TRANSPORT",
  PHARMACEUTICALS = "PHARMACEUTICALS",
  PROPERTY_RENOVATIONS = "PROPERTY_RENOVATIONS",
  RESTAURANTS = "RESTAURANTS",
  SOCIAL_HOUSING = "SOCIAL_HOUSING",
  STANDARD = "STANDARD",
  WATER = "WATER",
  WINE = "WINE",
}

export enum UserSortField {
  EMAIL = "EMAIL",
  FIRST_NAME = "FIRST_NAME",
  LAST_NAME = "LAST_NAME",
  ORDER_COUNT = "ORDER_COUNT",
}

export enum VoucherDiscountType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
  SHIPPING = "SHIPPING",
}

export enum VoucherSortField {
  CODE = "CODE",
  END_DATE = "END_DATE",
  MINIMUM_SPENT_AMOUNT = "MINIMUM_SPENT_AMOUNT",
  START_DATE = "START_DATE",
  TYPE = "TYPE",
  USAGE_LIMIT = "USAGE_LIMIT",
  VALUE = "VALUE",
}

export enum VoucherTypeEnum {
  ENTIRE_ORDER = "ENTIRE_ORDER",
  SHIPPING = "SHIPPING",
  SPECIFIC_PRODUCT = "SPECIFIC_PRODUCT",
}

export enum WebhookErrorCode {
  GRAPHQL_ERROR = "GRAPHQL_ERROR",
  INVALID = "INVALID",
  NOT_FOUND = "NOT_FOUND",
  REQUIRED = "REQUIRED",
  UNIQUE = "UNIQUE",
}

export enum WebhookEventTypeEnum {
  ANY_EVENTS = "ANY_EVENTS",
  CHECKOUT_QUANTITY_CHANGED = "CHECKOUT_QUANTITY_CHANGED",
  CUSTOMER_CREATED = "CUSTOMER_CREATED",
  FULFILLMENT_CREATED = "FULFILLMENT_CREATED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_FULFILLED = "ORDER_FULFILLED",
  ORDER_FULLY_PAID = "ORDER_FULLY_PAID",
  ORDER_UPDATED = "ORDER_UPDATED",
  PRODUCT_CREATED = "PRODUCT_CREATED",
}

export enum WebhookSortField {
  NAME = "NAME",
  SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
  TARGET_URL = "TARGET_URL",
}

export enum WeightUnitsEnum {
  G = "G",
  KG = "KG",
  LB = "LB",
  OZ = "OZ",
}

export interface AddressInput {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  cityArea?: string | null;
  postalCode?: string | null;
  country?: CountryCode | null;
  countryArea?: string | null;
  phone?: string | null;
}

export interface AttributeAssignInput {
  id: string;
  type: AttributeTypeEnum;
}

export interface AttributeCreateInput {
  inputType?: AttributeInputTypeEnum | null;
  name: string;
  slug?: string | null;
  values?: (AttributeValueCreateInput | null)[] | null;
  valueRequired?: boolean | null;
  isVariantOnly?: boolean | null;
  visibleInStorefront?: boolean | null;
  filterableInStorefront?: boolean | null;
  filterableInDashboard?: boolean | null;
  storefrontSearchPosition?: number | null;
  availableInGrid?: boolean | null;
}

export interface AttributeFilterInput {
  valueRequired?: boolean | null;
  isVariantOnly?: boolean | null;
  visibleInStorefront?: boolean | null;
  filterableInStorefront?: boolean | null;
  filterableInDashboard?: boolean | null;
  availableInGrid?: boolean | null;
  search?: string | null;
  ids?: (string | null)[] | null;
  inCollection?: string | null;
  inCategory?: string | null;
}

export interface AttributeInput {
  slug: string;
  value?: string | null;
  values?: (string | null)[] | null;
}

export interface AttributeSortingInput {
  direction: OrderDirection;
  field: AttributeSortField;
}

export interface AttributeUpdateInput {
  name?: string | null;
  slug?: string | null;
  removeValues?: (string | null)[] | null;
  addValues?: (AttributeValueCreateInput | null)[] | null;
  valueRequired?: boolean | null;
  isVariantOnly?: boolean | null;
  visibleInStorefront?: boolean | null;
  filterableInStorefront?: boolean | null;
  filterableInDashboard?: boolean | null;
  storefrontSearchPosition?: number | null;
  availableInGrid?: boolean | null;
}

export interface AttributeValueCreateInput {
  name: string;
}

export interface AttributeValueInput {
  id?: string | null;
  values: (string | null)[];
}

export interface AuthorizationKeyInput {
  key: string;
  password: string;
}

export interface CatalogueInput {
  products?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  collections?: (string | null)[] | null;
}

export interface CategoryFilterInput {
  search?: string | null;
  ids?: (string | null)[] | null;
}

export interface CategoryInput {
  description?: string | null;
  descriptionJson?: any | null;
  name?: string | null;
  slug?: string | null;
  seo?: SeoInput | null;
  backgroundImage?: any | null;
  backgroundImageAlt?: string | null;
}

export interface CategorySortingInput {
  direction: OrderDirection;
  field: CategorySortField;
}

export interface CollectionCreateInput {
  isPublished?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionJson?: any | null;
  backgroundImage?: any | null;
  backgroundImageAlt?: string | null;
  seo?: SeoInput | null;
  publicationDate?: any | null;
  products?: (string | null)[] | null;
}

export interface CollectionFilterInput {
  published?: CollectionPublished | null;
  search?: string | null;
  ids?: (string | null)[] | null;
}

export interface CollectionInput {
  isPublished?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionJson?: any | null;
  backgroundImage?: any | null;
  backgroundImageAlt?: string | null;
  seo?: SeoInput | null;
  publicationDate?: any | null;
}

export interface CollectionSortingInput {
  direction: OrderDirection;
  field: CollectionSortField;
}

export interface ConfigurationItemInput {
  name: string;
  value?: string | null;
}

export interface CustomerFilterInput {
  dateJoined?: DateRangeInput | null;
  moneySpent?: PriceRangeInput | null;
  numberOfOrders?: IntRangeInput | null;
  placedOrders?: DateRangeInput | null;
  search?: string | null;
}

export interface CustomerInput {
  defaultBillingAddress?: AddressInput | null;
  defaultShippingAddress?: AddressInput | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
}

export interface DateRangeInput {
  gte?: any | null;
  lte?: any | null;
}

export interface DateTimeRangeInput {
  gte?: any | null;
  lte?: any | null;
}

export interface DraftOrderInput {
  billingAddress?: AddressInput | null;
  user?: string | null;
  userEmail?: string | null;
  discount?: any | null;
  shippingAddress?: AddressInput | null;
  shippingMethod?: string | null;
  voucher?: string | null;
  customerNote?: string | null;
}

export interface FulfillmentCancelInput {
  restock?: boolean | null;
}

export interface FulfillmentCreateInput {
  trackingNumber?: string | null;
  notifyCustomer?: boolean | null;
  lines: (FulfillmentLineInput | null)[];
}

export interface FulfillmentLineInput {
  orderLineId?: string | null;
  quantity?: number | null;
}

export interface FulfillmentUpdateTrackingInput {
  trackingNumber?: string | null;
  notifyCustomer?: boolean | null;
}

export interface IntRangeInput {
  gte?: number | null;
  lte?: number | null;
}

export interface MenuCreateInput {
  name: string;
  items?: (MenuItemInput | null)[] | null;
}

export interface MenuItemCreateInput {
  name: string;
  url?: string | null;
  category?: string | null;
  collection?: string | null;
  page?: string | null;
  menu: string;
  parent?: string | null;
}

export interface MenuItemInput {
  name?: string | null;
  url?: string | null;
  category?: string | null;
  collection?: string | null;
  page?: string | null;
}

export interface MenuItemMoveInput {
  itemId: string;
  parentId?: string | null;
  sortOrder?: number | null;
}

export interface MenuSortingInput {
  direction: OrderDirection;
  field: MenuSortField;
}

export interface NameTranslationInput {
  name?: string | null;
}

export interface OrderAddNoteInput {
  message?: string | null;
}

export interface OrderDraftFilterInput {
  customer?: string | null;
  created?: DateRangeInput | null;
  search?: string | null;
}

export interface OrderFilterInput {
  paymentStatus?: (PaymentChargeStatusEnum | null)[] | null;
  status?: (OrderStatusFilter | null)[] | null;
  customer?: string | null;
  created?: DateRangeInput | null;
  search?: string | null;
}

export interface OrderLineCreateInput {
  quantity: number;
  variantId: string;
}

export interface OrderLineInput {
  quantity: number;
}

export interface OrderSortingInput {
  direction: OrderDirection;
  field: OrderSortField;
}

export interface OrderUpdateInput {
  billingAddress?: AddressInput | null;
  userEmail?: string | null;
  shippingAddress?: AddressInput | null;
}

export interface OrderUpdateShippingInput {
  shippingMethod?: string | null;
}

export interface PageFilterInput {
  search?: string | null;
}

export interface PageInput {
  slug?: string | null;
  title?: string | null;
  content?: string | null;
  contentJson?: any | null;
  isPublished?: boolean | null;
  publicationDate?: string | null;
  seo?: SeoInput | null;
}

export interface PageSortingInput {
  direction: OrderDirection;
  field: PageSortField;
}

export interface PageTranslationInput {
  seoTitle?: string | null;
  seoDescription?: string | null;
  title?: string | null;
  content?: string | null;
  contentJson?: any | null;
}

export interface PluginFilterInput {
  active?: boolean | null;
  search?: string | null;
}

export interface PluginSortingInput {
  direction: OrderDirection;
  field: PluginSortField;
}

export interface PluginUpdateInput {
  active?: boolean | null;
  configuration?: (ConfigurationItemInput | null)[] | null;
}

export interface PriceRangeInput {
  gte?: number | null;
  lte?: number | null;
}

export interface ProductFilterInput {
  isPublished?: boolean | null;
  collections?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  hasCategory?: boolean | null;
  price?: PriceRangeInput | null;
  attributes?: (AttributeInput | null)[] | null;
  stockAvailability?: StockAvailability | null;
  productType?: string | null;
  search?: string | null;
  minimalPrice?: PriceRangeInput | null;
  productTypes?: (string | null)[] | null;
}

export interface ProductOrder {
  direction: OrderDirection;
  attributeId?: string | null;
  field?: ProductOrderField | null;
}

export interface ProductTypeFilterInput {
  search?: string | null;
  configurable?: ProductTypeConfigurable | null;
  productType?: ProductTypeEnum | null;
  ids?: (string | null)[] | null;
}

export interface ProductTypeInput {
  name?: string | null;
  slug?: string | null;
  hasVariants?: boolean | null;
  productAttributes?: (string | null)[] | null;
  variantAttributes?: (string | null)[] | null;
  isShippingRequired?: boolean | null;
  isDigital?: boolean | null;
  weight?: any | null;
  taxCode?: string | null;
}

export interface ProductTypeSortingInput {
  direction: OrderDirection;
  field: ProductTypeSortField;
}

export interface ProductVariantBulkCreateInput {
  attributes: (AttributeValueInput | null)[];
  costPrice?: any | null;
  priceOverride?: any | null;
  sku: string;
  quantity?: number | null;
  trackInventory?: boolean | null;
  weight?: any | null;
}

export interface ProductVariantCreateInput {
  attributes: (AttributeValueInput | null)[];
  costPrice?: any | null;
  priceOverride?: any | null;
  sku?: string | null;
  quantity?: number | null;
  trackInventory?: boolean | null;
  weight?: any | null;
  product: string;
}

export interface ProductVariantInput {
  attributes?: (AttributeValueInput | null)[] | null;
  costPrice?: any | null;
  priceOverride?: any | null;
  sku?: string | null;
  quantity?: number | null;
  trackInventory?: boolean | null;
  weight?: any | null;
}

export interface ReorderInput {
  id: string;
  sortOrder?: number | null;
}

export interface SaleFilterInput {
  status?: (DiscountStatusEnum | null)[] | null;
  saleType?: DiscountValueTypeEnum | null;
  started?: DateTimeRangeInput | null;
  search?: string | null;
}

export interface SaleInput {
  name?: string | null;
  type?: DiscountValueTypeEnum | null;
  value?: any | null;
  products?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  collections?: (string | null)[] | null;
  startDate?: any | null;
  endDate?: any | null;
}

export interface SaleSortingInput {
  direction: OrderDirection;
  field: SaleSortField;
}

export interface SeoInput {
  title?: string | null;
  description?: string | null;
}

export interface ServiceAccountFilterInput {
  search?: string | null;
  isActive?: boolean | null;
}

export interface ServiceAccountInput {
  name?: string | null;
  isActive?: boolean | null;
  permissions?: (PermissionEnum | null)[] | null;
}

export interface ServiceAccountSortingInput {
  direction: OrderDirection;
  field: ServiceAccountSortField;
}

export interface ServiceAccountTokenInput {
  name?: string | null;
  serviceAccount: string;
}

export interface ShippingPriceInput {
  name?: string | null;
  price?: any | null;
  minimumOrderPrice?: any | null;
  maximumOrderPrice?: any | null;
  minimumOrderWeight?: any | null;
  maximumOrderWeight?: any | null;
  type?: ShippingMethodTypeEnum | null;
  shippingZone?: string | null;
}

export interface ShippingZoneInput {
  name?: string | null;
  countries?: (string | null)[] | null;
  default?: boolean | null;
}

export interface ShopSettingsInput {
  headerText?: string | null;
  description?: string | null;
  includeTaxesInPrices?: boolean | null;
  displayGrossPrices?: boolean | null;
  chargeTaxesOnShipping?: boolean | null;
  trackInventoryByDefault?: boolean | null;
  defaultWeightUnit?: WeightUnitsEnum | null;
  automaticFulfillmentDigitalProducts?: boolean | null;
  defaultDigitalMaxDownloads?: number | null;
  defaultDigitalUrlValidDays?: number | null;
  defaultMailSenderName?: string | null;
  defaultMailSenderAddress?: string | null;
  customerSetPasswordUrl?: string | null;
}

export interface SiteDomainInput {
  domain?: string | null;
  name?: string | null;
}

export interface StaffCreateInput {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
  permissions?: (PermissionEnum | null)[] | null;
  redirectUrl?: string | null;
}

export interface StaffInput {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
  permissions?: (PermissionEnum | null)[] | null;
}

export interface StaffUserInput {
  status?: StaffMemberStatus | null;
  search?: string | null;
}

export interface TranslationInput {
  seoTitle?: string | null;
  seoDescription?: string | null;
  name?: string | null;
  description?: string | null;
  descriptionJson?: any | null;
}

export interface UserCreateInput {
  defaultBillingAddress?: AddressInput | null;
  defaultShippingAddress?: AddressInput | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
  note?: string | null;
  redirectUrl?: string | null;
}

export interface UserSortingInput {
  direction: OrderDirection;
  field: UserSortField;
}

export interface VoucherFilterInput {
  status?: (DiscountStatusEnum | null)[] | null;
  timesUsed?: IntRangeInput | null;
  discountType?: (VoucherDiscountType | null)[] | null;
  started?: DateTimeRangeInput | null;
  search?: string | null;
}

export interface VoucherInput {
  type?: VoucherTypeEnum | null;
  name?: string | null;
  code?: string | null;
  startDate?: any | null;
  endDate?: any | null;
  discountValueType?: DiscountValueTypeEnum | null;
  discountValue?: any | null;
  products?: (string | null)[] | null;
  collections?: (string | null)[] | null;
  categories?: (string | null)[] | null;
  minAmountSpent?: any | null;
  minCheckoutItemsQuantity?: number | null;
  countries?: (string | null)[] | null;
  applyOncePerOrder?: boolean | null;
  applyOncePerCustomer?: boolean | null;
  usageLimit?: number | null;
}

export interface VoucherSortingInput {
  direction: OrderDirection;
  field: VoucherSortField;
}

export interface WebhookCreateInput {
  name?: string | null;
  targetUrl?: string | null;
  events?: (WebhookEventTypeEnum | null)[] | null;
  serviceAccount?: string | null;
  isActive?: boolean | null;
  secretKey?: string | null;
}

export interface WebhookFilterInput {
  search?: string | null;
  isActive?: boolean | null;
}

export interface WebhookSortingInput {
  direction: OrderDirection;
  field: WebhookSortField;
}

export interface WebhookUpdateInput {
  name?: string | null;
  targetUrl?: string | null;
  events?: (WebhookEventTypeEnum | null)[] | null;
  serviceAccount?: string | null;
  isActive?: boolean | null;
  secretKey?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
