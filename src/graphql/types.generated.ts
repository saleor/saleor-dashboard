/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
  JSONString: any;
  /**
   * Metadata is a map of key-value pairs, both keys and values are `String`.
   *
   * Example:
   * ```
   * {
   *     "key1": "value1",
   *     "key2": "value2"
   * }
   * ```
   */
  Metadata: any;
  /**
   * Positive Decimal scalar implementation.
   *
   * Should be used in places where value must be positive.
   */
  PositiveDecimal: any;
  UUID: any;
  /** Variables of this type must be set to null in mutations. They will be replaced with a filename from a following multipart part containing a binary file. See: https://github.com/jaydenseric/graphql-multipart-request-spec. */
  Upload: any;
  WeightScalar: any;
  /** _Any value scalar as defined by Federation spec. */
  _Any: any;
};

/** An enumeration. */
export enum AccountErrorCode {
  ACTIVATE_OWN_ACCOUNT = 'ACTIVATE_OWN_ACCOUNT',
  ACTIVATE_SUPERUSER_ACCOUNT = 'ACTIVATE_SUPERUSER_ACCOUNT',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM',
  DEACTIVATE_OWN_ACCOUNT = 'DEACTIVATE_OWN_ACCOUNT',
  DEACTIVATE_SUPERUSER_ACCOUNT = 'DEACTIVATE_SUPERUSER_ACCOUNT',
  DELETE_NON_STAFF_USER = 'DELETE_NON_STAFF_USER',
  DELETE_OWN_ACCOUNT = 'DELETE_OWN_ACCOUNT',
  DELETE_STAFF_ACCOUNT = 'DELETE_STAFF_ACCOUNT',
  DELETE_SUPERUSER_ACCOUNT = 'DELETE_SUPERUSER_ACCOUNT',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INACTIVE = 'INACTIVE',
  INVALID = 'INVALID',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  LEFT_NOT_MANAGEABLE_PERMISSION = 'LEFT_NOT_MANAGEABLE_PERMISSION',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NOT_FOUND = 'NOT_FOUND',
  OUT_OF_SCOPE_USER = 'OUT_OF_SCOPE_USER',
  OUT_OF_SCOPE_GROUP = 'OUT_OF_SCOPE_GROUP',
  OUT_OF_SCOPE_PERMISSION = 'OUT_OF_SCOPE_PERMISSION',
  PASSWORD_ENTIRELY_NUMERIC = 'PASSWORD_ENTIRELY_NUMERIC',
  PASSWORD_TOO_COMMON = 'PASSWORD_TOO_COMMON',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  PASSWORD_TOO_SIMILAR = 'PASSWORD_TOO_SIMILAR',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  JWT_SIGNATURE_EXPIRED = 'JWT_SIGNATURE_EXPIRED',
  JWT_INVALID_TOKEN = 'JWT_INVALID_TOKEN',
  JWT_DECODE_ERROR = 'JWT_DECODE_ERROR',
  JWT_MISSING_TOKEN = 'JWT_MISSING_TOKEN',
  JWT_INVALID_CSRF_TOKEN = 'JWT_INVALID_CSRF_TOKEN',
  CHANNEL_INACTIVE = 'CHANNEL_INACTIVE',
  MISSING_CHANNEL_SLUG = 'MISSING_CHANNEL_SLUG',
  ACCOUNT_NOT_CONFIRMED = 'ACCOUNT_NOT_CONFIRMED'
}

export type AccountInput = {
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** Billing address of the customer. */
  defaultBillingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: InputMaybe<AddressInput>;
};

export type AccountRegisterInput = {
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** The email address of the user. */
  email: Scalars['String'];
  /** Password. */
  password: Scalars['String'];
  /** Base of frontend URL that will be needed to create confirmation URL. */
  redirectUrl?: InputMaybe<Scalars['String']>;
  /** User public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** Slug of a channel which will be used to notify users. Optional when only one channel exists. */
  channel?: InputMaybe<Scalars['String']>;
};

export type AddressInput = {
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** Company or organization. */
  companyName?: InputMaybe<Scalars['String']>;
  /** Address. */
  streetAddress1?: InputMaybe<Scalars['String']>;
  /** Address. */
  streetAddress2?: InputMaybe<Scalars['String']>;
  /** City. */
  city?: InputMaybe<Scalars['String']>;
  /** District. */
  cityArea?: InputMaybe<Scalars['String']>;
  /** Postal code. */
  postalCode?: InputMaybe<Scalars['String']>;
  /** Country. */
  country?: InputMaybe<CountryCode>;
  /** State or province. */
  countryArea?: InputMaybe<Scalars['String']>;
  /** Phone number. */
  phone?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum AddressTypeEnum {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING'
}

/**
 * Determine the allocation strategy for the channel.
 *
 *     PRIORITIZE_SORTING_ORDER - allocate stocks according to the warehouses' order
 *     within the channel
 *
 *     PRIORITIZE_HIGH_STOCK - allocate stock in a warehouse with the most stock
 *
 */
export enum AllocationStrategyEnum {
  PRIORITIZE_SORTING_ORDER = 'PRIORITIZE_SORTING_ORDER',
  PRIORITIZE_HIGH_STOCK = 'PRIORITIZE_HIGH_STOCK'
}

/** An enumeration. */
export enum AppErrorCode {
  FORBIDDEN = 'FORBIDDEN',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  INVALID_STATUS = 'INVALID_STATUS',
  INVALID_PERMISSION = 'INVALID_PERMISSION',
  INVALID_URL_FORMAT = 'INVALID_URL_FORMAT',
  INVALID_MANIFEST_FORMAT = 'INVALID_MANIFEST_FORMAT',
  MANIFEST_URL_CANT_CONNECT = 'MANIFEST_URL_CANT_CONNECT',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  OUT_OF_SCOPE_APP = 'OUT_OF_SCOPE_APP',
  OUT_OF_SCOPE_PERMISSION = 'OUT_OF_SCOPE_PERMISSION'
}

export type AppExtensionFilterInput = {
  mount?: InputMaybe<Array<AppExtensionMountEnum>>;
  target?: InputMaybe<AppExtensionTargetEnum>;
};

/** All places where app extension can be mounted. */
export enum AppExtensionMountEnum {
  CUSTOMER_OVERVIEW_CREATE = 'CUSTOMER_OVERVIEW_CREATE',
  CUSTOMER_OVERVIEW_MORE_ACTIONS = 'CUSTOMER_OVERVIEW_MORE_ACTIONS',
  CUSTOMER_DETAILS_MORE_ACTIONS = 'CUSTOMER_DETAILS_MORE_ACTIONS',
  PRODUCT_OVERVIEW_CREATE = 'PRODUCT_OVERVIEW_CREATE',
  PRODUCT_OVERVIEW_MORE_ACTIONS = 'PRODUCT_OVERVIEW_MORE_ACTIONS',
  PRODUCT_DETAILS_MORE_ACTIONS = 'PRODUCT_DETAILS_MORE_ACTIONS',
  NAVIGATION_CATALOG = 'NAVIGATION_CATALOG',
  NAVIGATION_ORDERS = 'NAVIGATION_ORDERS',
  NAVIGATION_CUSTOMERS = 'NAVIGATION_CUSTOMERS',
  NAVIGATION_DISCOUNTS = 'NAVIGATION_DISCOUNTS',
  NAVIGATION_TRANSLATIONS = 'NAVIGATION_TRANSLATIONS',
  NAVIGATION_PAGES = 'NAVIGATION_PAGES',
  ORDER_DETAILS_MORE_ACTIONS = 'ORDER_DETAILS_MORE_ACTIONS',
  ORDER_OVERVIEW_CREATE = 'ORDER_OVERVIEW_CREATE',
  ORDER_OVERVIEW_MORE_ACTIONS = 'ORDER_OVERVIEW_MORE_ACTIONS'
}

/**
 * All available ways of opening an app extension.
 *
 *     POPUP - app's extension will be mounted as a popup window
 *     APP_PAGE - redirect to app's page
 *
 */
export enum AppExtensionTargetEnum {
  POPUP = 'POPUP',
  APP_PAGE = 'APP_PAGE'
}

export type AppFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<AppTypeEnum>;
};

export type AppInput = {
  /** Name of the app. */
  name?: InputMaybe<Scalars['String']>;
  /** List of permission code names to assign to this app. */
  permissions?: InputMaybe<Array<PermissionEnum>>;
};

export type AppInstallInput = {
  /** Name of the app to install. */
  appName?: InputMaybe<Scalars['String']>;
  /** Url to app's manifest in JSON format. */
  manifestUrl?: InputMaybe<Scalars['String']>;
  /** Determine if app will be set active or not. */
  activateAfterInstallation?: InputMaybe<Scalars['Boolean']>;
  /** List of permission code names to assign to this app. */
  permissions?: InputMaybe<Array<PermissionEnum>>;
};

export enum AppSortField {
  /** Sort apps by name. */
  NAME = 'NAME',
  /** Sort apps by creation date. */
  CREATION_DATE = 'CREATION_DATE'
}

export type AppSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort apps by the selected field. */
  field: AppSortField;
};

export type AppTokenInput = {
  /** Name of the token. */
  name?: InputMaybe<Scalars['String']>;
  /** ID of app. */
  app: Scalars['ID'];
};

/** Enum determining type of your App. */
export enum AppTypeEnum {
  /** Local Saleor App. The app is fully manageable from dashboard. You can change assigned permissions, add webhooks, or authentication token */
  LOCAL = 'LOCAL',
  /** Third party external App. Installation is fully automated. Saleor uses a defined App manifest to gather all required information. */
  THIRDPARTY = 'THIRDPARTY'
}

/** An enumeration. */
export enum AreaUnitsEnum {
  SQ_CM = 'SQ_CM',
  SQ_M = 'SQ_M',
  SQ_KM = 'SQ_KM',
  SQ_FT = 'SQ_FT',
  SQ_YD = 'SQ_YD',
  SQ_INCH = 'SQ_INCH'
}

export enum AttributeChoicesSortField {
  /** Sort attribute choice by name. */
  NAME = 'NAME',
  /** Sort attribute choice by slug. */
  SLUG = 'SLUG'
}

export type AttributeChoicesSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attribute choices by the selected field. */
  field: AttributeChoicesSortField;
};

export type AttributeCreateInput = {
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: InputMaybe<AttributeInputTypeEnum>;
  /** The entity type which can be used as a reference. */
  entityType?: InputMaybe<AttributeEntityTypeEnum>;
  /** Name of an attribute displayed in the interface. */
  name: Scalars['String'];
  /** Internal representation of an attribute name. */
  slug?: InputMaybe<Scalars['String']>;
  /** The attribute type. */
  type: AttributeTypeEnum;
  /** The unit of attribute values. */
  unit?: InputMaybe<MeasurementUnitsEnum>;
  /** List of attribute's values. */
  values?: InputMaybe<Array<AttributeValueCreateInput>>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute is for variants only. */
  isVariantOnly?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard?: InputMaybe<Scalars['Boolean']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition?: InputMaybe<Scalars['Int']>;
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum AttributeEntityTypeEnum {
  PAGE = 'PAGE',
  PRODUCT = 'PRODUCT'
}

/** An enumeration. */
export enum AttributeErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

export type AttributeFilterInput = {
  valueRequired?: InputMaybe<Scalars['Boolean']>;
  isVariantOnly?: InputMaybe<Scalars['Boolean']>;
  visibleInStorefront?: InputMaybe<Scalars['Boolean']>;
  filterableInStorefront?: InputMaybe<Scalars['Boolean']>;
  filterableInDashboard?: InputMaybe<Scalars['Boolean']>;
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  search?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  type?: InputMaybe<AttributeTypeEnum>;
  inCollection?: InputMaybe<Scalars['ID']>;
  inCategory?: InputMaybe<Scalars['ID']>;
  /**
   * Specifies the channel by which the data should be filtered.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
};

export type AttributeInput = {
  /** Internal representation of an attribute name. */
  slug: Scalars['String'];
  /** Internal representation of a value (unique per attribute). */
  values?: InputMaybe<Array<Scalars['String']>>;
  /** The range that the returned values should be in. */
  valuesRange?: InputMaybe<IntRangeInput>;
  /** The date/time range that the returned values should be in. */
  dateTime?: InputMaybe<DateTimeRangeInput>;
  /** The date range that the returned values should be in. In case of date/time attributes, the UTC midnight of the given date is used. */
  date?: InputMaybe<DateRangeInput>;
  /** The boolean value of the attribute. */
  boolean?: InputMaybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum AttributeInputTypeEnum {
  DROPDOWN = 'DROPDOWN',
  MULTISELECT = 'MULTISELECT',
  FILE = 'FILE',
  REFERENCE = 'REFERENCE',
  NUMERIC = 'NUMERIC',
  RICH_TEXT = 'RICH_TEXT',
  PLAIN_TEXT = 'PLAIN_TEXT',
  SWATCH = 'SWATCH',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME'
}

export enum AttributeSortField {
  /** Sort attributes by name */
  NAME = 'NAME',
  /** Sort attributes by slug */
  SLUG = 'SLUG',
  /** Sort attributes by the value required flag */
  VALUE_REQUIRED = 'VALUE_REQUIRED',
  /** Sort attributes by the variant only flag */
  IS_VARIANT_ONLY = 'IS_VARIANT_ONLY',
  /** Sort attributes by visibility in the storefront */
  VISIBLE_IN_STOREFRONT = 'VISIBLE_IN_STOREFRONT',
  /** Sort attributes by the filterable in storefront flag */
  FILTERABLE_IN_STOREFRONT = 'FILTERABLE_IN_STOREFRONT',
  /** Sort attributes by the filterable in dashboard flag */
  FILTERABLE_IN_DASHBOARD = 'FILTERABLE_IN_DASHBOARD',
  /** Sort attributes by their position in storefront */
  STOREFRONT_SEARCH_POSITION = 'STOREFRONT_SEARCH_POSITION',
  /** Sort attributes based on whether they can be displayed or not in a product grid. */
  AVAILABLE_IN_GRID = 'AVAILABLE_IN_GRID'
}

export type AttributeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attributes by the selected field. */
  field: AttributeSortField;
};

/** An enumeration. */
export enum AttributeTypeEnum {
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  PAGE_TYPE = 'PAGE_TYPE'
}

export type AttributeUpdateInput = {
  /** Name of an attribute displayed in the interface. */
  name?: InputMaybe<Scalars['String']>;
  /** Internal representation of an attribute name. */
  slug?: InputMaybe<Scalars['String']>;
  /** The unit of attribute values. */
  unit?: InputMaybe<MeasurementUnitsEnum>;
  /** IDs of values to be removed from this attribute. */
  removeValues?: InputMaybe<Array<Scalars['ID']>>;
  /** New values to be created for this attribute. */
  addValues?: InputMaybe<Array<AttributeValueUpdateInput>>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute is for variants only. */
  isVariantOnly?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard?: InputMaybe<Scalars['Boolean']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition?: InputMaybe<Scalars['Int']>;
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
};

export type AttributeValueCreateInput = {
  /** Represent value of the attribute value (e.g. color values for swatch attributes). */
  value?: InputMaybe<Scalars['String']>;
  /**
   * Represents the text of the attribute value, includes formatting.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Represents the text of the attribute value, plain text without formating. */
  plainText?: InputMaybe<Scalars['String']>;
  /** URL of the file attribute. Every time, a new value is created. */
  fileUrl?: InputMaybe<Scalars['String']>;
  /** File content type. */
  contentType?: InputMaybe<Scalars['String']>;
  /** Name of a value displayed in the interface. */
  name: Scalars['String'];
};

export type AttributeValueFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type AttributeValueInput = {
  /** ID of the selected attribute. */
  id?: InputMaybe<Scalars['ID']>;
  /** The value or slug of an attribute to resolve. If the passed value is non-existent, it will be created. */
  values?: InputMaybe<Array<Scalars['String']>>;
  /** URL of the file attribute. Every time, a new value is created. */
  file?: InputMaybe<Scalars['String']>;
  /** File content type. */
  contentType?: InputMaybe<Scalars['String']>;
  /** List of entity IDs that will be used as references. */
  references?: InputMaybe<Array<Scalars['ID']>>;
  /** Text content in JSON format. */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Plain text content. */
  plainText?: InputMaybe<Scalars['String']>;
  /** Represents the boolean value of the attribute value. */
  boolean?: InputMaybe<Scalars['Boolean']>;
  /** Represents the date value of the attribute value. */
  date?: InputMaybe<Scalars['Date']>;
  /** Represents the date/time value of the attribute value. */
  dateTime?: InputMaybe<Scalars['DateTime']>;
};

export type AttributeValueTranslationInput = {
  name?: InputMaybe<Scalars['String']>;
  /**
   * Translated text.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Translated text. */
  plainText?: InputMaybe<Scalars['String']>;
};

export type AttributeValueUpdateInput = {
  /** Represent value of the attribute value (e.g. color values for swatch attributes). */
  value?: InputMaybe<Scalars['String']>;
  /**
   * Represents the text of the attribute value, includes formatting.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Represents the text of the attribute value, plain text without formating. */
  plainText?: InputMaybe<Scalars['String']>;
  /** URL of the file attribute. Every time, a new value is created. */
  fileUrl?: InputMaybe<Scalars['String']>;
  /** File content type. */
  contentType?: InputMaybe<Scalars['String']>;
  /** Name of a value displayed in the interface. */
  name?: InputMaybe<Scalars['String']>;
};

export type BulkAttributeValueInput = {
  /** ID of the selected attribute. */
  id?: InputMaybe<Scalars['ID']>;
  /** The value or slug of an attribute to resolve. If the passed value is non-existent, it will be created. */
  values?: InputMaybe<Array<Scalars['String']>>;
  /** The boolean value of an attribute to resolve. If the passed value is non-existent, it will be created. */
  boolean?: InputMaybe<Scalars['Boolean']>;
};

export type CardInput = {
  /** Payment method nonce, a token returned by the appropriate provider's SDK. */
  code: Scalars['String'];
  /** Card security code. */
  cvc?: InputMaybe<Scalars['String']>;
  /** Information about currency and amount. */
  money: MoneyInput;
};

export type CatalogueInput = {
  /** Products related to the discount. */
  products?: InputMaybe<Array<Scalars['ID']>>;
  /** Categories related to the discount. */
  categories?: InputMaybe<Array<Scalars['ID']>>;
  /** Collections related to the discount. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * Product variant related to the discount.
   *
   * Added in Saleor 3.1.
   */
  variants?: InputMaybe<Array<Scalars['ID']>>;
};

export type CategoryFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type CategoryInput = {
  /**
   * Category description.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Category name. */
  name?: InputMaybe<Scalars['String']>;
  /** Category slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Background image file. */
  backgroundImage?: InputMaybe<Scalars['Upload']>;
  /** Alt text for a product media. */
  backgroundImageAlt?: InputMaybe<Scalars['String']>;
};

export enum CategorySortField {
  /** Sort categories by name. */
  NAME = 'NAME',
  /** Sort categories by product count. */
  PRODUCT_COUNT = 'PRODUCT_COUNT',
  /** Sort categories by subcategory count. */
  SUBCATEGORY_COUNT = 'SUBCATEGORY_COUNT'
}

export type CategorySortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Sort categories by the selected field. */
  field: CategorySortField;
};

export type ChannelCreateInput = {
  /** isActive flag. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /**
   * The channel stock settings.
   *
   * Added in Saleor 3.7.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  stockSettings?: InputMaybe<StockSettingsInput>;
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * List of warehouses to assign to the channel.
   *
   * Added in Saleor 3.5.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  addWarehouses?: InputMaybe<Array<Scalars['ID']>>;
  /** Name of the channel. */
  name: Scalars['String'];
  /** Slug of the channel. */
  slug: Scalars['String'];
  /** Currency of the channel. */
  currencyCode: Scalars['String'];
  /**
   * Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  defaultCountry: CountryCode;
};

export type ChannelDeleteInput = {
  /** ID of channel to migrate orders from origin channel. */
  channelId: Scalars['ID'];
};

/** An enumeration. */
export enum ChannelErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  CHANNELS_CURRENCY_MUST_BE_THE_SAME = 'CHANNELS_CURRENCY_MUST_BE_THE_SAME',
  CHANNEL_WITH_ORDERS = 'CHANNEL_WITH_ORDERS',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM'
}

export type ChannelUpdateInput = {
  /** isActive flag. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /**
   * The channel stock settings.
   *
   * Added in Saleor 3.7.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  stockSettings?: InputMaybe<StockSettingsInput>;
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * List of warehouses to assign to the channel.
   *
   * Added in Saleor 3.5.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  addWarehouses?: InputMaybe<Array<Scalars['ID']>>;
  /** Name of the channel. */
  name?: InputMaybe<Scalars['String']>;
  /** Slug of the channel. */
  slug?: InputMaybe<Scalars['String']>;
  /**
   * Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided.
   *
   * Added in Saleor 3.1.
   */
  defaultCountry?: InputMaybe<CountryCode>;
  /** List of shipping zones to unassign from the channel. */
  removeShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * List of warehouses to unassign from the channel.
   *
   * Added in Saleor 3.5.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  removeWarehouses?: InputMaybe<Array<Scalars['ID']>>;
};

export type CheckoutAddressValidationRules = {
  /** Determines if an error should be raised when the provided address doesn't have all the required fields. The list of required fields is dynamic and depends on the country code (use the `addressValidationRules` query to fetch them). Note: country code is mandatory for all addresses regardless of the rules provided in this input. */
  checkRequiredFields?: InputMaybe<Scalars['Boolean']>;
  /** Determines if an error should be raised when the provided address doesn't match the expected format. Example: using letters for postal code when the numbers are expected. */
  checkFieldsFormat?: InputMaybe<Scalars['Boolean']>;
  /** Determines if Saleor should apply normalization on address fields. Example: converting city field to uppercase letters. */
  enableFieldsNormalization?: InputMaybe<Scalars['Boolean']>;
};

export type CheckoutCreateInput = {
  /** Slug of a channel in which to create a checkout. */
  channel?: InputMaybe<Scalars['String']>;
  /** A list of checkout lines, each containing information about an item in the checkout. */
  lines: Array<CheckoutLineInput>;
  /** The customer's email address. */
  email?: InputMaybe<Scalars['String']>;
  /** The mailing address to where the checkout will be shipped. Note: the address will be ignored if the checkout doesn't contain shippable items. */
  shippingAddress?: InputMaybe<AddressInput>;
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** Checkout language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /**
   * The checkout validation rules that can be changed.
   *
   * Added in Saleor 3.5.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  validationRules?: InputMaybe<CheckoutValidationRules>;
};

/** An enumeration. */
export enum CheckoutErrorCode {
  BILLING_ADDRESS_NOT_SET = 'BILLING_ADDRESS_NOT_SET',
  CHECKOUT_NOT_FULLY_PAID = 'CHECKOUT_NOT_FULLY_PAID',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  PRODUCT_NOT_PUBLISHED = 'PRODUCT_NOT_PUBLISHED',
  PRODUCT_UNAVAILABLE_FOR_PURCHASE = 'PRODUCT_UNAVAILABLE_FOR_PURCHASE',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  INVALID = 'INVALID',
  INVALID_SHIPPING_METHOD = 'INVALID_SHIPPING_METHOD',
  NOT_FOUND = 'NOT_FOUND',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  QUANTITY_GREATER_THAN_LIMIT = 'QUANTITY_GREATER_THAN_LIMIT',
  REQUIRED = 'REQUIRED',
  SHIPPING_ADDRESS_NOT_SET = 'SHIPPING_ADDRESS_NOT_SET',
  SHIPPING_METHOD_NOT_APPLICABLE = 'SHIPPING_METHOD_NOT_APPLICABLE',
  DELIVERY_METHOD_NOT_APPLICABLE = 'DELIVERY_METHOD_NOT_APPLICABLE',
  SHIPPING_METHOD_NOT_SET = 'SHIPPING_METHOD_NOT_SET',
  SHIPPING_NOT_REQUIRED = 'SHIPPING_NOT_REQUIRED',
  TAX_ERROR = 'TAX_ERROR',
  UNIQUE = 'UNIQUE',
  VOUCHER_NOT_APPLICABLE = 'VOUCHER_NOT_APPLICABLE',
  GIFT_CARD_NOT_APPLICABLE = 'GIFT_CARD_NOT_APPLICABLE',
  ZERO_QUANTITY = 'ZERO_QUANTITY',
  MISSING_CHANNEL_SLUG = 'MISSING_CHANNEL_SLUG',
  CHANNEL_INACTIVE = 'CHANNEL_INACTIVE',
  UNAVAILABLE_VARIANT_IN_CHANNEL = 'UNAVAILABLE_VARIANT_IN_CHANNEL',
  EMAIL_NOT_SET = 'EMAIL_NOT_SET',
  NO_LINES = 'NO_LINES'
}

export type CheckoutFilterInput = {
  customer?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  channels?: InputMaybe<Array<Scalars['ID']>>;
};

export type CheckoutLineInput = {
  /** The number of items purchased. */
  quantity: Scalars['Int'];
  /** ID of the product variant. */
  variantId: Scalars['ID'];
  /**
   * Custom price of the item. Can be set only by apps with `HANDLE_CHECKOUTS` permission. When the line with the same variant will be provided multiple times, the last price will be used.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  price?: InputMaybe<Scalars['PositiveDecimal']>;
  /**
   * Flag that allow force splitting the same variant into multiple lines by skipping the matching logic.
   *
   * Added in Saleor 3.6.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  forceNewLine?: InputMaybe<Scalars['Boolean']>;
};

export type CheckoutLineUpdateInput = {
  /**
   * ID of the product variant.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `lineId` instead.
   */
  variantId?: InputMaybe<Scalars['ID']>;
  /** The number of items purchased. Optional for apps, required for any other users. */
  quantity?: InputMaybe<Scalars['Int']>;
  /**
   * Custom price of the item. Can be set only by apps with `HANDLE_CHECKOUTS` permission. When the line with the same variant will be provided multiple times, the last price will be used.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  price?: InputMaybe<Scalars['PositiveDecimal']>;
  /**
   * ID of the line.
   *
   * Added in Saleor 3.6.
   */
  lineId?: InputMaybe<Scalars['ID']>;
};

export enum CheckoutSortField {
  /** Sort checkouts by creation date. */
  CREATION_DATE = 'CREATION_DATE',
  /** Sort checkouts by customer. */
  CUSTOMER = 'CUSTOMER',
  /** Sort checkouts by payment. */
  PAYMENT = 'PAYMENT'
}

export type CheckoutSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort checkouts by the selected field. */
  field: CheckoutSortField;
};

export type CheckoutValidationRules = {
  /** The validation rules that can be applied to provided shipping address data. */
  shippingAddress?: InputMaybe<CheckoutAddressValidationRules>;
  /** The validation rules that can be applied to provided billing address data. */
  billingAddress?: InputMaybe<CheckoutAddressValidationRules>;
};

export type CollectionChannelListingUpdateInput = {
  /** List of channels to which the collection should be assigned. */
  addChannels?: InputMaybe<Array<PublishableChannelListingInput>>;
  /** List of channels from which the collection should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

export type CollectionCreateInput = {
  /** Informs whether a collection is published. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Name of the collection. */
  name?: InputMaybe<Scalars['String']>;
  /** Slug of the collection. */
  slug?: InputMaybe<Scalars['String']>;
  /**
   * Description of the collection.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Background image file. */
  backgroundImage?: InputMaybe<Scalars['Upload']>;
  /** Alt text for an image. */
  backgroundImageAlt?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /**
   * Publication date. ISO 8601 standard.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  publicationDate?: InputMaybe<Scalars['Date']>;
  /** List of products to be added to the collection. */
  products?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum CollectionErrorCode {
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT'
}

export type CollectionFilterInput = {
  published?: InputMaybe<CollectionPublished>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * Specifies the channel by which the data should be filtered.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
};

export type CollectionInput = {
  /** Informs whether a collection is published. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Name of the collection. */
  name?: InputMaybe<Scalars['String']>;
  /** Slug of the collection. */
  slug?: InputMaybe<Scalars['String']>;
  /**
   * Description of the collection.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Background image file. */
  backgroundImage?: InputMaybe<Scalars['Upload']>;
  /** Alt text for an image. */
  backgroundImageAlt?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /**
   * Publication date. ISO 8601 standard.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  publicationDate?: InputMaybe<Scalars['Date']>;
};

export enum CollectionPublished {
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN'
}

export enum CollectionSortField {
  /** Sort collections by name. */
  NAME = 'NAME',
  /**
   * Sort collections by availability.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  AVAILABILITY = 'AVAILABILITY',
  /** Sort collections by product count. */
  PRODUCT_COUNT = 'PRODUCT_COUNT',
  /**
   * Sort collections by publication date.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  PUBLICATION_DATE = 'PUBLICATION_DATE',
  /**
   * Sort collections by publication date.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  PUBLISHED_AT = 'PUBLISHED_AT'
}

export type CollectionSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Sort collections by the selected field. */
  field: CollectionSortField;
};

export type ConfigurationItemInput = {
  /** Name of the field to update. */
  name: Scalars['String'];
  /** Value of the given field to update. */
  value?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum ConfigurationTypeFieldEnum {
  STRING = 'STRING',
  MULTILINE = 'MULTILINE',
  BOOLEAN = 'BOOLEAN',
  SECRET = 'SECRET',
  PASSWORD = 'PASSWORD',
  SECRETMULTILINE = 'SECRETMULTILINE',
  OUTPUT = 'OUTPUT'
}

/** An enumeration. */
export enum CountryCode {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  EU = 'EU',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW'
}

export type CountryFilterInput = {
  /** Boolean for filtering countries by having shipping zone assigned.If 'true', return countries with shipping zone assigned.If 'false', return countries without any shipping zone assigned.If the argument is not provided (null), return all countries. */
  attachedToShippingZones?: InputMaybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum CustomerEventsEnum {
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  ACCOUNT_ACTIVATED = 'ACCOUNT_ACTIVATED',
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',
  PASSWORD_RESET_LINK_SENT = 'PASSWORD_RESET_LINK_SENT',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_CHANGED_REQUEST = 'EMAIL_CHANGED_REQUEST',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  EMAIL_CHANGED = 'EMAIL_CHANGED',
  PLACED_ORDER = 'PLACED_ORDER',
  NOTE_ADDED_TO_ORDER = 'NOTE_ADDED_TO_ORDER',
  DIGITAL_LINK_DOWNLOADED = 'DIGITAL_LINK_DOWNLOADED',
  CUSTOMER_DELETED = 'CUSTOMER_DELETED',
  NAME_ASSIGNED = 'NAME_ASSIGNED',
  EMAIL_ASSIGNED = 'EMAIL_ASSIGNED',
  NOTE_ADDED = 'NOTE_ADDED'
}

export type CustomerFilterInput = {
  dateJoined?: InputMaybe<DateRangeInput>;
  numberOfOrders?: InputMaybe<IntRangeInput>;
  placedOrders?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

export type CustomerInput = {
  /** Billing address of the customer. */
  defaultBillingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: InputMaybe<AddressInput>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
};

export type DateRangeInput = {
  /** Start date. */
  gte?: InputMaybe<Scalars['Date']>;
  /** End date. */
  lte?: InputMaybe<Scalars['Date']>;
};

export type DateTimeRangeInput = {
  /** Start date. */
  gte?: InputMaybe<Scalars['DateTime']>;
  /** End date. */
  lte?: InputMaybe<Scalars['DateTime']>;
};

export type DigitalContentInput = {
  /** Use default digital content settings for this product. */
  useDefaultSettings: Scalars['Boolean'];
  /** Determines how many times a download link can be accessed by a customer. */
  maxDownloads?: InputMaybe<Scalars['Int']>;
  /** Determines for how many days a download link is active since it was generated. */
  urlValidDays?: InputMaybe<Scalars['Int']>;
  /** Overwrite default automatic_fulfillment setting for variant. */
  automaticFulfillment?: InputMaybe<Scalars['Boolean']>;
};

export type DigitalContentUploadInput = {
  /** Use default digital content settings for this product. */
  useDefaultSettings: Scalars['Boolean'];
  /** Determines how many times a download link can be accessed by a customer. */
  maxDownloads?: InputMaybe<Scalars['Int']>;
  /** Determines for how many days a download link is active since it was generated. */
  urlValidDays?: InputMaybe<Scalars['Int']>;
  /** Overwrite default automatic_fulfillment setting for variant. */
  automaticFulfillment?: InputMaybe<Scalars['Boolean']>;
  /** Represents an file in a multipart request. */
  contentFile: Scalars['Upload'];
};

export type DigitalContentUrlCreateInput = {
  /** Digital content ID which URL will belong to. */
  content: Scalars['ID'];
};

/** An enumeration. */
export enum DiscountErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM'
}

export enum DiscountStatusEnum {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SCHEDULED = 'SCHEDULED'
}

export enum DiscountValueTypeEnum {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

/** An enumeration. */
export enum DistanceUnitsEnum {
  CM = 'CM',
  M = 'M',
  KM = 'KM',
  FT = 'FT',
  YD = 'YD',
  INCH = 'INCH'
}

export type DraftOrderCreateInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** Customer associated with the draft order. */
  user?: InputMaybe<Scalars['ID']>;
  /** Email address of the customer. */
  userEmail?: InputMaybe<Scalars['String']>;
  /** Discount amount for the order. */
  discount?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Shipping address of the customer. */
  shippingAddress?: InputMaybe<AddressInput>;
  /** ID of a selected shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
  /** ID of the voucher associated with the order. */
  voucher?: InputMaybe<Scalars['ID']>;
  /** A note from a customer. Visible by customers in the order summary. */
  customerNote?: InputMaybe<Scalars['String']>;
  /** ID of the channel associated with the order. */
  channelId?: InputMaybe<Scalars['ID']>;
  /** URL of a view where users should be redirected to see the order details. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
  /** Variant line input consisting of variant ID and quantity of products. */
  lines?: InputMaybe<Array<OrderLineCreateInput>>;
};

export type DraftOrderInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** Customer associated with the draft order. */
  user?: InputMaybe<Scalars['ID']>;
  /** Email address of the customer. */
  userEmail?: InputMaybe<Scalars['String']>;
  /** Discount amount for the order. */
  discount?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Shipping address of the customer. */
  shippingAddress?: InputMaybe<AddressInput>;
  /** ID of a selected shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
  /** ID of the voucher associated with the order. */
  voucher?: InputMaybe<Scalars['ID']>;
  /** A note from a customer. Visible by customers in the order summary. */
  customerNote?: InputMaybe<Scalars['String']>;
  /** ID of the channel associated with the order. */
  channelId?: InputMaybe<Scalars['ID']>;
  /** URL of a view where users should be redirected to see the order details. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export enum EventDeliveryAttemptSortField {
  /** Sort event delivery attempts by created at. */
  CREATED_AT = 'CREATED_AT'
}

export type EventDeliveryAttemptSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attempts by the selected field. */
  field: EventDeliveryAttemptSortField;
};

export type EventDeliveryFilterInput = {
  status?: InputMaybe<EventDeliveryStatusEnum>;
  eventType?: InputMaybe<WebhookEventTypeEnum>;
};

export enum EventDeliverySortField {
  /** Sort event deliveries by created at. */
  CREATED_AT = 'CREATED_AT'
}

export type EventDeliverySortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort deliveries by the selected field. */
  field: EventDeliverySortField;
};

export enum EventDeliveryStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

/** An enumeration. */
export enum ExportErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED'
}

/** An enumeration. */
export enum ExportEventsEnum {
  EXPORT_PENDING = 'EXPORT_PENDING',
  EXPORT_SUCCESS = 'EXPORT_SUCCESS',
  EXPORT_FAILED = 'EXPORT_FAILED',
  EXPORT_DELETED = 'EXPORT_DELETED',
  EXPORTED_FILE_SENT = 'EXPORTED_FILE_SENT',
  EXPORT_FAILED_INFO_SENT = 'EXPORT_FAILED_INFO_SENT'
}

export type ExportFileFilterInput = {
  createdAt?: InputMaybe<DateTimeRangeInput>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
  status?: InputMaybe<JobStatusEnum>;
  user?: InputMaybe<Scalars['String']>;
  app?: InputMaybe<Scalars['String']>;
};

export enum ExportFileSortField {
  STATUS = 'STATUS',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  LAST_MODIFIED_AT = 'LAST_MODIFIED_AT'
}

export type ExportFileSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort export file by the selected field. */
  field: ExportFileSortField;
};

export type ExportGiftCardsInput = {
  /** Determine which gift cards should be exported. */
  scope: ExportScope;
  /** Filtering options for gift cards. */
  filter?: InputMaybe<GiftCardFilterInput>;
  /** List of gift cards IDs to export. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Type of exported file. */
  fileType: FileTypesEnum;
};

export type ExportInfoInput = {
  /** List of attribute ids witch should be exported. */
  attributes?: InputMaybe<Array<Scalars['ID']>>;
  /** List of warehouse ids witch should be exported. */
  warehouses?: InputMaybe<Array<Scalars['ID']>>;
  /** List of channels ids which should be exported. */
  channels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of product fields witch should be exported. */
  fields?: InputMaybe<Array<ProductFieldEnum>>;
};

export type ExportProductsInput = {
  /** Determine which products should be exported. */
  scope: ExportScope;
  /** Filtering options for products. */
  filter?: InputMaybe<ProductFilterInput>;
  /** List of products IDs to export. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Input with info about fields which should be exported. */
  exportInfo?: InputMaybe<ExportInfoInput>;
  /** Type of exported file. */
  fileType: FileTypesEnum;
};

export enum ExportScope {
  /** Export all products. */
  ALL = 'ALL',
  /** Export products with given ids. */
  IDS = 'IDS',
  /** Export the filtered products. */
  FILTER = 'FILTER'
}

/** An enumeration. */
export enum ExternalNotificationErrorCodes {
  REQUIRED = 'REQUIRED',
  INVALID_MODEL_TYPE = 'INVALID_MODEL_TYPE',
  NOT_FOUND = 'NOT_FOUND',
  CHANNEL_INACTIVE = 'CHANNEL_INACTIVE'
}

export type ExternalNotificationTriggerInput = {
  /** The list of customers or orders node IDs that will be serialized and included in the notification payload. */
  ids: Array<Scalars['ID']>;
  /** Additional payload that will be merged with the one based on the bussines object ID. */
  extraPayload?: InputMaybe<Scalars['JSONString']>;
  /** External event type. This field is passed to a plugin as an event type. */
  externalEventType: Scalars['String'];
};

/** An enumeration. */
export enum FileTypesEnum {
  CSV = 'CSV',
  XLSX = 'XLSX'
}

export type FulfillmentCancelInput = {
  /** ID of a warehouse where items will be restocked. Optional when fulfillment is in WAITING_FOR_APPROVAL state. */
  warehouseId?: InputMaybe<Scalars['ID']>;
};

/** An enumeration. */
export enum FulfillmentStatus {
  FULFILLED = 'FULFILLED',
  REFUNDED = 'REFUNDED',
  RETURNED = 'RETURNED',
  REPLACED = 'REPLACED',
  REFUNDED_AND_RETURNED = 'REFUNDED_AND_RETURNED',
  CANCELED = 'CANCELED',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL'
}

export type FulfillmentUpdateTrackingInput = {
  /** Fulfillment tracking number. */
  trackingNumber?: InputMaybe<Scalars['String']>;
  /** If true, send an email notification to the customer. */
  notifyCustomer?: InputMaybe<Scalars['Boolean']>;
};

export type GiftCardAddNoteInput = {
  /** Note message. */
  message: Scalars['String'];
};

export type GiftCardBulkCreateInput = {
  /** The number of cards to issue. */
  count: Scalars['Int'];
  /** Balance of the gift card. */
  balance: PriceInput;
  /** The gift card tags. */
  tags?: InputMaybe<Array<Scalars['String']>>;
  /** The gift card expiry date. */
  expiryDate?: InputMaybe<Scalars['Date']>;
  /** Determine if gift card is active. */
  isActive: Scalars['Boolean'];
};

export type GiftCardCreateInput = {
  /**
   * The gift card tags to add.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  addTags?: InputMaybe<Array<Scalars['String']>>;
  /**
   * The gift card expiry date.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  expiryDate?: InputMaybe<Scalars['Date']>;
  /**
   * Start date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  startDate?: InputMaybe<Scalars['Date']>;
  /**
   * End date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `expiryDate` from `expirySettings` instead.
   */
  endDate?: InputMaybe<Scalars['Date']>;
  /** Balance of the gift card. */
  balance: PriceInput;
  /** Email of the customer to whom gift card will be sent. */
  userEmail?: InputMaybe<Scalars['String']>;
  /**
   * Slug of a channel from which the email should be sent.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  channel?: InputMaybe<Scalars['String']>;
  /**
   * Determine if gift card is active.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  isActive: Scalars['Boolean'];
  /**
   * Code to use the gift card.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. The code is now auto generated.
   */
  code?: InputMaybe<Scalars['String']>;
  /**
   * The gift card note from the staff member.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  note?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum GiftCardErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  EXPIRED_GIFT_CARD = 'EXPIRED_GIFT_CARD',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM'
}

export type GiftCardEventFilterInput = {
  type?: InputMaybe<GiftCardEventsEnum>;
  orders?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum GiftCardEventsEnum {
  ISSUED = 'ISSUED',
  BOUGHT = 'BOUGHT',
  UPDATED = 'UPDATED',
  ACTIVATED = 'ACTIVATED',
  DEACTIVATED = 'DEACTIVATED',
  BALANCE_RESET = 'BALANCE_RESET',
  EXPIRY_DATE_UPDATED = 'EXPIRY_DATE_UPDATED',
  TAGS_UPDATED = 'TAGS_UPDATED',
  SENT_TO_CUSTOMER = 'SENT_TO_CUSTOMER',
  RESENT = 'RESENT',
  NOTE_ADDED = 'NOTE_ADDED',
  USED_IN_ORDER = 'USED_IN_ORDER'
}

export type GiftCardFilterInput = {
  isActive?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  products?: InputMaybe<Array<Scalars['ID']>>;
  usedBy?: InputMaybe<Array<Scalars['ID']>>;
  used?: InputMaybe<Scalars['Boolean']>;
  currency?: InputMaybe<Scalars['String']>;
  currentBalance?: InputMaybe<PriceRangeInput>;
  initialBalance?: InputMaybe<PriceRangeInput>;
  code?: InputMaybe<Scalars['String']>;
};

export type GiftCardResendInput = {
  /** ID of a gift card to resend. */
  id: Scalars['ID'];
  /** Email to which gift card should be send. */
  email?: InputMaybe<Scalars['String']>;
  /** Slug of a channel from which the email should be sent. */
  channel: Scalars['String'];
};

/** An enumeration. */
export enum GiftCardSettingsErrorCode {
  INVALID = 'INVALID',
  REQUIRED = 'REQUIRED',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR'
}

/** An enumeration. */
export enum GiftCardSettingsExpiryTypeEnum {
  NEVER_EXPIRE = 'NEVER_EXPIRE',
  EXPIRY_PERIOD = 'EXPIRY_PERIOD'
}

export type GiftCardSettingsUpdateInput = {
  /** Defines gift card default expiry settings. */
  expiryType?: InputMaybe<GiftCardSettingsExpiryTypeEnum>;
  /** Defines gift card expiry period. */
  expiryPeriod?: InputMaybe<TimePeriodInputType>;
};

export enum GiftCardSortField {
  /** Sort orders by product. */
  PRODUCT = 'PRODUCT',
  /** Sort orders by used by. */
  USED_BY = 'USED_BY',
  /** Sort orders by current balance. */
  CURRENT_BALANCE = 'CURRENT_BALANCE'
}

export type GiftCardSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort gift cards by the selected field. */
  field: GiftCardSortField;
};

export type GiftCardTagFilterInput = {
  search?: InputMaybe<Scalars['String']>;
};

export type GiftCardUpdateInput = {
  /**
   * The gift card tags to add.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  addTags?: InputMaybe<Array<Scalars['String']>>;
  /**
   * The gift card expiry date.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  expiryDate?: InputMaybe<Scalars['Date']>;
  /**
   * Start date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  startDate?: InputMaybe<Scalars['Date']>;
  /**
   * End date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `expiryDate` from `expirySettings` instead.
   */
  endDate?: InputMaybe<Scalars['Date']>;
  /**
   * The gift card tags to remove.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  removeTags?: InputMaybe<Array<Scalars['String']>>;
  /**
   * The gift card balance amount.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  balanceAmount?: InputMaybe<Scalars['PositiveDecimal']>;
};

export type IntRangeInput = {
  /** Value greater than or equal to. */
  gte?: InputMaybe<Scalars['Int']>;
  /** Value less than or equal to. */
  lte?: InputMaybe<Scalars['Int']>;
};

export type InvoiceCreateInput = {
  /** Invoice number. */
  number: Scalars['String'];
  /** URL of an invoice to download. */
  url: Scalars['String'];
};

/** An enumeration. */
export enum InvoiceErrorCode {
  REQUIRED = 'REQUIRED',
  NOT_READY = 'NOT_READY',
  URL_NOT_SET = 'URL_NOT_SET',
  EMAIL_NOT_SET = 'EMAIL_NOT_SET',
  NUMBER_NOT_SET = 'NUMBER_NOT_SET',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_STATUS = 'INVALID_STATUS',
  NO_INVOICE_PLUGIN = 'NO_INVOICE_PLUGIN'
}

/** An enumeration. */
export enum JobStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  DELETED = 'DELETED'
}

/** An enumeration. */
export enum LanguageCodeEnum {
  AF = 'AF',
  AF_NA = 'AF_NA',
  AF_ZA = 'AF_ZA',
  AGQ = 'AGQ',
  AGQ_CM = 'AGQ_CM',
  AK = 'AK',
  AK_GH = 'AK_GH',
  AM = 'AM',
  AM_ET = 'AM_ET',
  AR = 'AR',
  AR_AE = 'AR_AE',
  AR_BH = 'AR_BH',
  AR_DJ = 'AR_DJ',
  AR_DZ = 'AR_DZ',
  AR_EG = 'AR_EG',
  AR_EH = 'AR_EH',
  AR_ER = 'AR_ER',
  AR_IL = 'AR_IL',
  AR_IQ = 'AR_IQ',
  AR_JO = 'AR_JO',
  AR_KM = 'AR_KM',
  AR_KW = 'AR_KW',
  AR_LB = 'AR_LB',
  AR_LY = 'AR_LY',
  AR_MA = 'AR_MA',
  AR_MR = 'AR_MR',
  AR_OM = 'AR_OM',
  AR_PS = 'AR_PS',
  AR_QA = 'AR_QA',
  AR_SA = 'AR_SA',
  AR_SD = 'AR_SD',
  AR_SO = 'AR_SO',
  AR_SS = 'AR_SS',
  AR_SY = 'AR_SY',
  AR_TD = 'AR_TD',
  AR_TN = 'AR_TN',
  AR_YE = 'AR_YE',
  AS = 'AS',
  AS_IN = 'AS_IN',
  ASA = 'ASA',
  ASA_TZ = 'ASA_TZ',
  AST = 'AST',
  AST_ES = 'AST_ES',
  AZ = 'AZ',
  AZ_CYRL = 'AZ_CYRL',
  AZ_CYRL_AZ = 'AZ_CYRL_AZ',
  AZ_LATN = 'AZ_LATN',
  AZ_LATN_AZ = 'AZ_LATN_AZ',
  BAS = 'BAS',
  BAS_CM = 'BAS_CM',
  BE = 'BE',
  BE_BY = 'BE_BY',
  BEM = 'BEM',
  BEM_ZM = 'BEM_ZM',
  BEZ = 'BEZ',
  BEZ_TZ = 'BEZ_TZ',
  BG = 'BG',
  BG_BG = 'BG_BG',
  BM = 'BM',
  BM_ML = 'BM_ML',
  BN = 'BN',
  BN_BD = 'BN_BD',
  BN_IN = 'BN_IN',
  BO = 'BO',
  BO_CN = 'BO_CN',
  BO_IN = 'BO_IN',
  BR = 'BR',
  BR_FR = 'BR_FR',
  BRX = 'BRX',
  BRX_IN = 'BRX_IN',
  BS = 'BS',
  BS_CYRL = 'BS_CYRL',
  BS_CYRL_BA = 'BS_CYRL_BA',
  BS_LATN = 'BS_LATN',
  BS_LATN_BA = 'BS_LATN_BA',
  CA = 'CA',
  CA_AD = 'CA_AD',
  CA_ES = 'CA_ES',
  CA_ES_VALENCIA = 'CA_ES_VALENCIA',
  CA_FR = 'CA_FR',
  CA_IT = 'CA_IT',
  CCP = 'CCP',
  CCP_BD = 'CCP_BD',
  CCP_IN = 'CCP_IN',
  CE = 'CE',
  CE_RU = 'CE_RU',
  CEB = 'CEB',
  CEB_PH = 'CEB_PH',
  CGG = 'CGG',
  CGG_UG = 'CGG_UG',
  CHR = 'CHR',
  CHR_US = 'CHR_US',
  CKB = 'CKB',
  CKB_IQ = 'CKB_IQ',
  CKB_IR = 'CKB_IR',
  CS = 'CS',
  CS_CZ = 'CS_CZ',
  CU = 'CU',
  CU_RU = 'CU_RU',
  CY = 'CY',
  CY_GB = 'CY_GB',
  DA = 'DA',
  DA_DK = 'DA_DK',
  DA_GL = 'DA_GL',
  DAV = 'DAV',
  DAV_KE = 'DAV_KE',
  DE = 'DE',
  DE_AT = 'DE_AT',
  DE_BE = 'DE_BE',
  DE_CH = 'DE_CH',
  DE_DE = 'DE_DE',
  DE_IT = 'DE_IT',
  DE_LI = 'DE_LI',
  DE_LU = 'DE_LU',
  DJE = 'DJE',
  DJE_NE = 'DJE_NE',
  DSB = 'DSB',
  DSB_DE = 'DSB_DE',
  DUA = 'DUA',
  DUA_CM = 'DUA_CM',
  DYO = 'DYO',
  DYO_SN = 'DYO_SN',
  DZ = 'DZ',
  DZ_BT = 'DZ_BT',
  EBU = 'EBU',
  EBU_KE = 'EBU_KE',
  EE = 'EE',
  EE_GH = 'EE_GH',
  EE_TG = 'EE_TG',
  EL = 'EL',
  EL_CY = 'EL_CY',
  EL_GR = 'EL_GR',
  EN = 'EN',
  EN_AE = 'EN_AE',
  EN_AG = 'EN_AG',
  EN_AI = 'EN_AI',
  EN_AS = 'EN_AS',
  EN_AT = 'EN_AT',
  EN_AU = 'EN_AU',
  EN_BB = 'EN_BB',
  EN_BE = 'EN_BE',
  EN_BI = 'EN_BI',
  EN_BM = 'EN_BM',
  EN_BS = 'EN_BS',
  EN_BW = 'EN_BW',
  EN_BZ = 'EN_BZ',
  EN_CA = 'EN_CA',
  EN_CC = 'EN_CC',
  EN_CH = 'EN_CH',
  EN_CK = 'EN_CK',
  EN_CM = 'EN_CM',
  EN_CX = 'EN_CX',
  EN_CY = 'EN_CY',
  EN_DE = 'EN_DE',
  EN_DG = 'EN_DG',
  EN_DK = 'EN_DK',
  EN_DM = 'EN_DM',
  EN_ER = 'EN_ER',
  EN_FI = 'EN_FI',
  EN_FJ = 'EN_FJ',
  EN_FK = 'EN_FK',
  EN_FM = 'EN_FM',
  EN_GB = 'EN_GB',
  EN_GD = 'EN_GD',
  EN_GG = 'EN_GG',
  EN_GH = 'EN_GH',
  EN_GI = 'EN_GI',
  EN_GM = 'EN_GM',
  EN_GU = 'EN_GU',
  EN_GY = 'EN_GY',
  EN_HK = 'EN_HK',
  EN_IE = 'EN_IE',
  EN_IL = 'EN_IL',
  EN_IM = 'EN_IM',
  EN_IN = 'EN_IN',
  EN_IO = 'EN_IO',
  EN_JE = 'EN_JE',
  EN_JM = 'EN_JM',
  EN_KE = 'EN_KE',
  EN_KI = 'EN_KI',
  EN_KN = 'EN_KN',
  EN_KY = 'EN_KY',
  EN_LC = 'EN_LC',
  EN_LR = 'EN_LR',
  EN_LS = 'EN_LS',
  EN_MG = 'EN_MG',
  EN_MH = 'EN_MH',
  EN_MO = 'EN_MO',
  EN_MP = 'EN_MP',
  EN_MS = 'EN_MS',
  EN_MT = 'EN_MT',
  EN_MU = 'EN_MU',
  EN_MW = 'EN_MW',
  EN_MY = 'EN_MY',
  EN_NA = 'EN_NA',
  EN_NF = 'EN_NF',
  EN_NG = 'EN_NG',
  EN_NL = 'EN_NL',
  EN_NR = 'EN_NR',
  EN_NU = 'EN_NU',
  EN_NZ = 'EN_NZ',
  EN_PG = 'EN_PG',
  EN_PH = 'EN_PH',
  EN_PK = 'EN_PK',
  EN_PN = 'EN_PN',
  EN_PR = 'EN_PR',
  EN_PW = 'EN_PW',
  EN_RW = 'EN_RW',
  EN_SB = 'EN_SB',
  EN_SC = 'EN_SC',
  EN_SD = 'EN_SD',
  EN_SE = 'EN_SE',
  EN_SG = 'EN_SG',
  EN_SH = 'EN_SH',
  EN_SI = 'EN_SI',
  EN_SL = 'EN_SL',
  EN_SS = 'EN_SS',
  EN_SX = 'EN_SX',
  EN_SZ = 'EN_SZ',
  EN_TC = 'EN_TC',
  EN_TK = 'EN_TK',
  EN_TO = 'EN_TO',
  EN_TT = 'EN_TT',
  EN_TV = 'EN_TV',
  EN_TZ = 'EN_TZ',
  EN_UG = 'EN_UG',
  EN_UM = 'EN_UM',
  EN_US = 'EN_US',
  EN_VC = 'EN_VC',
  EN_VG = 'EN_VG',
  EN_VI = 'EN_VI',
  EN_VU = 'EN_VU',
  EN_WS = 'EN_WS',
  EN_ZA = 'EN_ZA',
  EN_ZM = 'EN_ZM',
  EN_ZW = 'EN_ZW',
  EO = 'EO',
  ES = 'ES',
  ES_AR = 'ES_AR',
  ES_BO = 'ES_BO',
  ES_BR = 'ES_BR',
  ES_BZ = 'ES_BZ',
  ES_CL = 'ES_CL',
  ES_CO = 'ES_CO',
  ES_CR = 'ES_CR',
  ES_CU = 'ES_CU',
  ES_DO = 'ES_DO',
  ES_EA = 'ES_EA',
  ES_EC = 'ES_EC',
  ES_ES = 'ES_ES',
  ES_GQ = 'ES_GQ',
  ES_GT = 'ES_GT',
  ES_HN = 'ES_HN',
  ES_IC = 'ES_IC',
  ES_MX = 'ES_MX',
  ES_NI = 'ES_NI',
  ES_PA = 'ES_PA',
  ES_PE = 'ES_PE',
  ES_PH = 'ES_PH',
  ES_PR = 'ES_PR',
  ES_PY = 'ES_PY',
  ES_SV = 'ES_SV',
  ES_US = 'ES_US',
  ES_UY = 'ES_UY',
  ES_VE = 'ES_VE',
  ET = 'ET',
  ET_EE = 'ET_EE',
  EU = 'EU',
  EU_ES = 'EU_ES',
  EWO = 'EWO',
  EWO_CM = 'EWO_CM',
  FA = 'FA',
  FA_AF = 'FA_AF',
  FA_IR = 'FA_IR',
  FF = 'FF',
  FF_ADLM = 'FF_ADLM',
  FF_ADLM_BF = 'FF_ADLM_BF',
  FF_ADLM_CM = 'FF_ADLM_CM',
  FF_ADLM_GH = 'FF_ADLM_GH',
  FF_ADLM_GM = 'FF_ADLM_GM',
  FF_ADLM_GN = 'FF_ADLM_GN',
  FF_ADLM_GW = 'FF_ADLM_GW',
  FF_ADLM_LR = 'FF_ADLM_LR',
  FF_ADLM_MR = 'FF_ADLM_MR',
  FF_ADLM_NE = 'FF_ADLM_NE',
  FF_ADLM_NG = 'FF_ADLM_NG',
  FF_ADLM_SL = 'FF_ADLM_SL',
  FF_ADLM_SN = 'FF_ADLM_SN',
  FF_LATN = 'FF_LATN',
  FF_LATN_BF = 'FF_LATN_BF',
  FF_LATN_CM = 'FF_LATN_CM',
  FF_LATN_GH = 'FF_LATN_GH',
  FF_LATN_GM = 'FF_LATN_GM',
  FF_LATN_GN = 'FF_LATN_GN',
  FF_LATN_GW = 'FF_LATN_GW',
  FF_LATN_LR = 'FF_LATN_LR',
  FF_LATN_MR = 'FF_LATN_MR',
  FF_LATN_NE = 'FF_LATN_NE',
  FF_LATN_NG = 'FF_LATN_NG',
  FF_LATN_SL = 'FF_LATN_SL',
  FF_LATN_SN = 'FF_LATN_SN',
  FI = 'FI',
  FI_FI = 'FI_FI',
  FIL = 'FIL',
  FIL_PH = 'FIL_PH',
  FO = 'FO',
  FO_DK = 'FO_DK',
  FO_FO = 'FO_FO',
  FR = 'FR',
  FR_BE = 'FR_BE',
  FR_BF = 'FR_BF',
  FR_BI = 'FR_BI',
  FR_BJ = 'FR_BJ',
  FR_BL = 'FR_BL',
  FR_CA = 'FR_CA',
  FR_CD = 'FR_CD',
  FR_CF = 'FR_CF',
  FR_CG = 'FR_CG',
  FR_CH = 'FR_CH',
  FR_CI = 'FR_CI',
  FR_CM = 'FR_CM',
  FR_DJ = 'FR_DJ',
  FR_DZ = 'FR_DZ',
  FR_FR = 'FR_FR',
  FR_GA = 'FR_GA',
  FR_GF = 'FR_GF',
  FR_GN = 'FR_GN',
  FR_GP = 'FR_GP',
  FR_GQ = 'FR_GQ',
  FR_HT = 'FR_HT',
  FR_KM = 'FR_KM',
  FR_LU = 'FR_LU',
  FR_MA = 'FR_MA',
  FR_MC = 'FR_MC',
  FR_MF = 'FR_MF',
  FR_MG = 'FR_MG',
  FR_ML = 'FR_ML',
  FR_MQ = 'FR_MQ',
  FR_MR = 'FR_MR',
  FR_MU = 'FR_MU',
  FR_NC = 'FR_NC',
  FR_NE = 'FR_NE',
  FR_PF = 'FR_PF',
  FR_PM = 'FR_PM',
  FR_RE = 'FR_RE',
  FR_RW = 'FR_RW',
  FR_SC = 'FR_SC',
  FR_SN = 'FR_SN',
  FR_SY = 'FR_SY',
  FR_TD = 'FR_TD',
  FR_TG = 'FR_TG',
  FR_TN = 'FR_TN',
  FR_VU = 'FR_VU',
  FR_WF = 'FR_WF',
  FR_YT = 'FR_YT',
  FUR = 'FUR',
  FUR_IT = 'FUR_IT',
  FY = 'FY',
  FY_NL = 'FY_NL',
  GA = 'GA',
  GA_GB = 'GA_GB',
  GA_IE = 'GA_IE',
  GD = 'GD',
  GD_GB = 'GD_GB',
  GL = 'GL',
  GL_ES = 'GL_ES',
  GSW = 'GSW',
  GSW_CH = 'GSW_CH',
  GSW_FR = 'GSW_FR',
  GSW_LI = 'GSW_LI',
  GU = 'GU',
  GU_IN = 'GU_IN',
  GUZ = 'GUZ',
  GUZ_KE = 'GUZ_KE',
  GV = 'GV',
  GV_IM = 'GV_IM',
  HA = 'HA',
  HA_GH = 'HA_GH',
  HA_NE = 'HA_NE',
  HA_NG = 'HA_NG',
  HAW = 'HAW',
  HAW_US = 'HAW_US',
  HE = 'HE',
  HE_IL = 'HE_IL',
  HI = 'HI',
  HI_IN = 'HI_IN',
  HR = 'HR',
  HR_BA = 'HR_BA',
  HR_HR = 'HR_HR',
  HSB = 'HSB',
  HSB_DE = 'HSB_DE',
  HU = 'HU',
  HU_HU = 'HU_HU',
  HY = 'HY',
  HY_AM = 'HY_AM',
  IA = 'IA',
  ID = 'ID',
  ID_ID = 'ID_ID',
  IG = 'IG',
  IG_NG = 'IG_NG',
  II = 'II',
  II_CN = 'II_CN',
  IS = 'IS',
  IS_IS = 'IS_IS',
  IT = 'IT',
  IT_CH = 'IT_CH',
  IT_IT = 'IT_IT',
  IT_SM = 'IT_SM',
  IT_VA = 'IT_VA',
  JA = 'JA',
  JA_JP = 'JA_JP',
  JGO = 'JGO',
  JGO_CM = 'JGO_CM',
  JMC = 'JMC',
  JMC_TZ = 'JMC_TZ',
  JV = 'JV',
  JV_ID = 'JV_ID',
  KA = 'KA',
  KA_GE = 'KA_GE',
  KAB = 'KAB',
  KAB_DZ = 'KAB_DZ',
  KAM = 'KAM',
  KAM_KE = 'KAM_KE',
  KDE = 'KDE',
  KDE_TZ = 'KDE_TZ',
  KEA = 'KEA',
  KEA_CV = 'KEA_CV',
  KHQ = 'KHQ',
  KHQ_ML = 'KHQ_ML',
  KI = 'KI',
  KI_KE = 'KI_KE',
  KK = 'KK',
  KK_KZ = 'KK_KZ',
  KKJ = 'KKJ',
  KKJ_CM = 'KKJ_CM',
  KL = 'KL',
  KL_GL = 'KL_GL',
  KLN = 'KLN',
  KLN_KE = 'KLN_KE',
  KM = 'KM',
  KM_KH = 'KM_KH',
  KN = 'KN',
  KN_IN = 'KN_IN',
  KO = 'KO',
  KO_KP = 'KO_KP',
  KO_KR = 'KO_KR',
  KOK = 'KOK',
  KOK_IN = 'KOK_IN',
  KS = 'KS',
  KS_ARAB = 'KS_ARAB',
  KS_ARAB_IN = 'KS_ARAB_IN',
  KSB = 'KSB',
  KSB_TZ = 'KSB_TZ',
  KSF = 'KSF',
  KSF_CM = 'KSF_CM',
  KSH = 'KSH',
  KSH_DE = 'KSH_DE',
  KU = 'KU',
  KU_TR = 'KU_TR',
  KW = 'KW',
  KW_GB = 'KW_GB',
  KY = 'KY',
  KY_KG = 'KY_KG',
  LAG = 'LAG',
  LAG_TZ = 'LAG_TZ',
  LB = 'LB',
  LB_LU = 'LB_LU',
  LG = 'LG',
  LG_UG = 'LG_UG',
  LKT = 'LKT',
  LKT_US = 'LKT_US',
  LN = 'LN',
  LN_AO = 'LN_AO',
  LN_CD = 'LN_CD',
  LN_CF = 'LN_CF',
  LN_CG = 'LN_CG',
  LO = 'LO',
  LO_LA = 'LO_LA',
  LRC = 'LRC',
  LRC_IQ = 'LRC_IQ',
  LRC_IR = 'LRC_IR',
  LT = 'LT',
  LT_LT = 'LT_LT',
  LU = 'LU',
  LU_CD = 'LU_CD',
  LUO = 'LUO',
  LUO_KE = 'LUO_KE',
  LUY = 'LUY',
  LUY_KE = 'LUY_KE',
  LV = 'LV',
  LV_LV = 'LV_LV',
  MAI = 'MAI',
  MAI_IN = 'MAI_IN',
  MAS = 'MAS',
  MAS_KE = 'MAS_KE',
  MAS_TZ = 'MAS_TZ',
  MER = 'MER',
  MER_KE = 'MER_KE',
  MFE = 'MFE',
  MFE_MU = 'MFE_MU',
  MG = 'MG',
  MG_MG = 'MG_MG',
  MGH = 'MGH',
  MGH_MZ = 'MGH_MZ',
  MGO = 'MGO',
  MGO_CM = 'MGO_CM',
  MI = 'MI',
  MI_NZ = 'MI_NZ',
  MK = 'MK',
  MK_MK = 'MK_MK',
  ML = 'ML',
  ML_IN = 'ML_IN',
  MN = 'MN',
  MN_MN = 'MN_MN',
  MNI = 'MNI',
  MNI_BENG = 'MNI_BENG',
  MNI_BENG_IN = 'MNI_BENG_IN',
  MR = 'MR',
  MR_IN = 'MR_IN',
  MS = 'MS',
  MS_BN = 'MS_BN',
  MS_ID = 'MS_ID',
  MS_MY = 'MS_MY',
  MS_SG = 'MS_SG',
  MT = 'MT',
  MT_MT = 'MT_MT',
  MUA = 'MUA',
  MUA_CM = 'MUA_CM',
  MY = 'MY',
  MY_MM = 'MY_MM',
  MZN = 'MZN',
  MZN_IR = 'MZN_IR',
  NAQ = 'NAQ',
  NAQ_NA = 'NAQ_NA',
  NB = 'NB',
  NB_NO = 'NB_NO',
  NB_SJ = 'NB_SJ',
  ND = 'ND',
  ND_ZW = 'ND_ZW',
  NDS = 'NDS',
  NDS_DE = 'NDS_DE',
  NDS_NL = 'NDS_NL',
  NE = 'NE',
  NE_IN = 'NE_IN',
  NE_NP = 'NE_NP',
  NL = 'NL',
  NL_AW = 'NL_AW',
  NL_BE = 'NL_BE',
  NL_BQ = 'NL_BQ',
  NL_CW = 'NL_CW',
  NL_NL = 'NL_NL',
  NL_SR = 'NL_SR',
  NL_SX = 'NL_SX',
  NMG = 'NMG',
  NMG_CM = 'NMG_CM',
  NN = 'NN',
  NN_NO = 'NN_NO',
  NNH = 'NNH',
  NNH_CM = 'NNH_CM',
  NUS = 'NUS',
  NUS_SS = 'NUS_SS',
  NYN = 'NYN',
  NYN_UG = 'NYN_UG',
  OM = 'OM',
  OM_ET = 'OM_ET',
  OM_KE = 'OM_KE',
  OR = 'OR',
  OR_IN = 'OR_IN',
  OS = 'OS',
  OS_GE = 'OS_GE',
  OS_RU = 'OS_RU',
  PA = 'PA',
  PA_ARAB = 'PA_ARAB',
  PA_ARAB_PK = 'PA_ARAB_PK',
  PA_GURU = 'PA_GURU',
  PA_GURU_IN = 'PA_GURU_IN',
  PCM = 'PCM',
  PCM_NG = 'PCM_NG',
  PL = 'PL',
  PL_PL = 'PL_PL',
  PRG = 'PRG',
  PS = 'PS',
  PS_AF = 'PS_AF',
  PS_PK = 'PS_PK',
  PT = 'PT',
  PT_AO = 'PT_AO',
  PT_BR = 'PT_BR',
  PT_CH = 'PT_CH',
  PT_CV = 'PT_CV',
  PT_GQ = 'PT_GQ',
  PT_GW = 'PT_GW',
  PT_LU = 'PT_LU',
  PT_MO = 'PT_MO',
  PT_MZ = 'PT_MZ',
  PT_PT = 'PT_PT',
  PT_ST = 'PT_ST',
  PT_TL = 'PT_TL',
  QU = 'QU',
  QU_BO = 'QU_BO',
  QU_EC = 'QU_EC',
  QU_PE = 'QU_PE',
  RM = 'RM',
  RM_CH = 'RM_CH',
  RN = 'RN',
  RN_BI = 'RN_BI',
  RO = 'RO',
  RO_MD = 'RO_MD',
  RO_RO = 'RO_RO',
  ROF = 'ROF',
  ROF_TZ = 'ROF_TZ',
  RU = 'RU',
  RU_BY = 'RU_BY',
  RU_KG = 'RU_KG',
  RU_KZ = 'RU_KZ',
  RU_MD = 'RU_MD',
  RU_RU = 'RU_RU',
  RU_UA = 'RU_UA',
  RW = 'RW',
  RW_RW = 'RW_RW',
  RWK = 'RWK',
  RWK_TZ = 'RWK_TZ',
  SAH = 'SAH',
  SAH_RU = 'SAH_RU',
  SAQ = 'SAQ',
  SAQ_KE = 'SAQ_KE',
  SAT = 'SAT',
  SAT_OLCK = 'SAT_OLCK',
  SAT_OLCK_IN = 'SAT_OLCK_IN',
  SBP = 'SBP',
  SBP_TZ = 'SBP_TZ',
  SD = 'SD',
  SD_ARAB = 'SD_ARAB',
  SD_ARAB_PK = 'SD_ARAB_PK',
  SD_DEVA = 'SD_DEVA',
  SD_DEVA_IN = 'SD_DEVA_IN',
  SE = 'SE',
  SE_FI = 'SE_FI',
  SE_NO = 'SE_NO',
  SE_SE = 'SE_SE',
  SEH = 'SEH',
  SEH_MZ = 'SEH_MZ',
  SES = 'SES',
  SES_ML = 'SES_ML',
  SG = 'SG',
  SG_CF = 'SG_CF',
  SHI = 'SHI',
  SHI_LATN = 'SHI_LATN',
  SHI_LATN_MA = 'SHI_LATN_MA',
  SHI_TFNG = 'SHI_TFNG',
  SHI_TFNG_MA = 'SHI_TFNG_MA',
  SI = 'SI',
  SI_LK = 'SI_LK',
  SK = 'SK',
  SK_SK = 'SK_SK',
  SL = 'SL',
  SL_SI = 'SL_SI',
  SMN = 'SMN',
  SMN_FI = 'SMN_FI',
  SN = 'SN',
  SN_ZW = 'SN_ZW',
  SO = 'SO',
  SO_DJ = 'SO_DJ',
  SO_ET = 'SO_ET',
  SO_KE = 'SO_KE',
  SO_SO = 'SO_SO',
  SQ = 'SQ',
  SQ_AL = 'SQ_AL',
  SQ_MK = 'SQ_MK',
  SQ_XK = 'SQ_XK',
  SR = 'SR',
  SR_CYRL = 'SR_CYRL',
  SR_CYRL_BA = 'SR_CYRL_BA',
  SR_CYRL_ME = 'SR_CYRL_ME',
  SR_CYRL_RS = 'SR_CYRL_RS',
  SR_CYRL_XK = 'SR_CYRL_XK',
  SR_LATN = 'SR_LATN',
  SR_LATN_BA = 'SR_LATN_BA',
  SR_LATN_ME = 'SR_LATN_ME',
  SR_LATN_RS = 'SR_LATN_RS',
  SR_LATN_XK = 'SR_LATN_XK',
  SU = 'SU',
  SU_LATN = 'SU_LATN',
  SU_LATN_ID = 'SU_LATN_ID',
  SV = 'SV',
  SV_AX = 'SV_AX',
  SV_FI = 'SV_FI',
  SV_SE = 'SV_SE',
  SW = 'SW',
  SW_CD = 'SW_CD',
  SW_KE = 'SW_KE',
  SW_TZ = 'SW_TZ',
  SW_UG = 'SW_UG',
  TA = 'TA',
  TA_IN = 'TA_IN',
  TA_LK = 'TA_LK',
  TA_MY = 'TA_MY',
  TA_SG = 'TA_SG',
  TE = 'TE',
  TE_IN = 'TE_IN',
  TEO = 'TEO',
  TEO_KE = 'TEO_KE',
  TEO_UG = 'TEO_UG',
  TG = 'TG',
  TG_TJ = 'TG_TJ',
  TH = 'TH',
  TH_TH = 'TH_TH',
  TI = 'TI',
  TI_ER = 'TI_ER',
  TI_ET = 'TI_ET',
  TK = 'TK',
  TK_TM = 'TK_TM',
  TO = 'TO',
  TO_TO = 'TO_TO',
  TR = 'TR',
  TR_CY = 'TR_CY',
  TR_TR = 'TR_TR',
  TT = 'TT',
  TT_RU = 'TT_RU',
  TWQ = 'TWQ',
  TWQ_NE = 'TWQ_NE',
  TZM = 'TZM',
  TZM_MA = 'TZM_MA',
  UG = 'UG',
  UG_CN = 'UG_CN',
  UK = 'UK',
  UK_UA = 'UK_UA',
  UR = 'UR',
  UR_IN = 'UR_IN',
  UR_PK = 'UR_PK',
  UZ = 'UZ',
  UZ_ARAB = 'UZ_ARAB',
  UZ_ARAB_AF = 'UZ_ARAB_AF',
  UZ_CYRL = 'UZ_CYRL',
  UZ_CYRL_UZ = 'UZ_CYRL_UZ',
  UZ_LATN = 'UZ_LATN',
  UZ_LATN_UZ = 'UZ_LATN_UZ',
  VAI = 'VAI',
  VAI_LATN = 'VAI_LATN',
  VAI_LATN_LR = 'VAI_LATN_LR',
  VAI_VAII = 'VAI_VAII',
  VAI_VAII_LR = 'VAI_VAII_LR',
  VI = 'VI',
  VI_VN = 'VI_VN',
  VO = 'VO',
  VUN = 'VUN',
  VUN_TZ = 'VUN_TZ',
  WAE = 'WAE',
  WAE_CH = 'WAE_CH',
  WO = 'WO',
  WO_SN = 'WO_SN',
  XH = 'XH',
  XH_ZA = 'XH_ZA',
  XOG = 'XOG',
  XOG_UG = 'XOG_UG',
  YAV = 'YAV',
  YAV_CM = 'YAV_CM',
  YI = 'YI',
  YO = 'YO',
  YO_BJ = 'YO_BJ',
  YO_NG = 'YO_NG',
  YUE = 'YUE',
  YUE_HANS = 'YUE_HANS',
  YUE_HANS_CN = 'YUE_HANS_CN',
  YUE_HANT = 'YUE_HANT',
  YUE_HANT_HK = 'YUE_HANT_HK',
  ZGH = 'ZGH',
  ZGH_MA = 'ZGH_MA',
  ZH = 'ZH',
  ZH_HANS = 'ZH_HANS',
  ZH_HANS_CN = 'ZH_HANS_CN',
  ZH_HANS_HK = 'ZH_HANS_HK',
  ZH_HANS_MO = 'ZH_HANS_MO',
  ZH_HANS_SG = 'ZH_HANS_SG',
  ZH_HANT = 'ZH_HANT',
  ZH_HANT_HK = 'ZH_HANT_HK',
  ZH_HANT_MO = 'ZH_HANT_MO',
  ZH_HANT_TW = 'ZH_HANT_TW',
  ZU = 'ZU',
  ZU_ZA = 'ZU_ZA'
}

/** An enumeration. */
export enum MeasurementUnitsEnum {
  CM = 'CM',
  M = 'M',
  KM = 'KM',
  FT = 'FT',
  YD = 'YD',
  INCH = 'INCH',
  SQ_CM = 'SQ_CM',
  SQ_M = 'SQ_M',
  SQ_KM = 'SQ_KM',
  SQ_FT = 'SQ_FT',
  SQ_YD = 'SQ_YD',
  SQ_INCH = 'SQ_INCH',
  CUBIC_MILLIMETER = 'CUBIC_MILLIMETER',
  CUBIC_CENTIMETER = 'CUBIC_CENTIMETER',
  CUBIC_DECIMETER = 'CUBIC_DECIMETER',
  CUBIC_METER = 'CUBIC_METER',
  LITER = 'LITER',
  CUBIC_FOOT = 'CUBIC_FOOT',
  CUBIC_INCH = 'CUBIC_INCH',
  CUBIC_YARD = 'CUBIC_YARD',
  QT = 'QT',
  PINT = 'PINT',
  FL_OZ = 'FL_OZ',
  ACRE_IN = 'ACRE_IN',
  ACRE_FT = 'ACRE_FT',
  G = 'G',
  LB = 'LB',
  OZ = 'OZ',
  KG = 'KG',
  TONNE = 'TONNE'
}

export type MenuCreateInput = {
  /** Name of the menu. */
  name: Scalars['String'];
  /** Slug of the menu. Will be generated if not provided. */
  slug?: InputMaybe<Scalars['String']>;
  /** List of menu items. */
  items?: InputMaybe<Array<MenuItemInput>>;
};

/** An enumeration. */
export enum MenuErrorCode {
  CANNOT_ASSIGN_NODE = 'CANNOT_ASSIGN_NODE',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  INVALID_MENU_ITEM = 'INVALID_MENU_ITEM',
  NO_MENU_ITEM_PROVIDED = 'NO_MENU_ITEM_PROVIDED',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  TOO_MANY_MENU_ITEMS = 'TOO_MANY_MENU_ITEMS',
  UNIQUE = 'UNIQUE'
}

export type MenuFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Array<Scalars['String']>>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
};

export type MenuInput = {
  /** Name of the menu. */
  name?: InputMaybe<Scalars['String']>;
  /** Slug of the menu. */
  slug?: InputMaybe<Scalars['String']>;
};

export type MenuItemCreateInput = {
  /** Name of the menu item. */
  name: Scalars['String'];
  /** URL of the pointed item. */
  url?: InputMaybe<Scalars['String']>;
  /** Category to which item points. */
  category?: InputMaybe<Scalars['ID']>;
  /** Collection to which item points. */
  collection?: InputMaybe<Scalars['ID']>;
  /** Page to which item points. */
  page?: InputMaybe<Scalars['ID']>;
  /** Menu to which item belongs. */
  menu: Scalars['ID'];
  /** ID of the parent menu. If empty, menu will be top level menu. */
  parent?: InputMaybe<Scalars['ID']>;
};

export type MenuItemFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
};

export type MenuItemInput = {
  /** Name of the menu item. */
  name?: InputMaybe<Scalars['String']>;
  /** URL of the pointed item. */
  url?: InputMaybe<Scalars['String']>;
  /** Category to which item points. */
  category?: InputMaybe<Scalars['ID']>;
  /** Collection to which item points. */
  collection?: InputMaybe<Scalars['ID']>;
  /** Page to which item points. */
  page?: InputMaybe<Scalars['ID']>;
};

export type MenuItemMoveInput = {
  /** The menu item ID to move. */
  itemId: Scalars['ID'];
  /** ID of the parent menu. If empty, menu will be top level menu. */
  parentId?: InputMaybe<Scalars['ID']>;
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type MenuItemSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort menu items by the selected field. */
  field: MenuItemsSortField;
};

export enum MenuItemsSortField {
  /** Sort menu items by name. */
  NAME = 'NAME'
}

export enum MenuSortField {
  /** Sort menus by name. */
  NAME = 'NAME',
  /** Sort menus by items count. */
  ITEMS_COUNT = 'ITEMS_COUNT'
}

export type MenuSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort menus by the selected field. */
  field: MenuSortField;
};

/** An enumeration. */
export enum MetadataErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  NOT_UPDATED = 'NOT_UPDATED'
}

export type MetadataFilter = {
  /** Key of a metadata item. */
  key: Scalars['String'];
  /** Value of a metadata item. */
  value?: InputMaybe<Scalars['String']>;
};

export type MetadataInput = {
  /** Key of a metadata item. */
  key: Scalars['String'];
  /** Value of a metadata item. */
  value: Scalars['String'];
};

export type MoneyInput = {
  /** Currency code. */
  currency: Scalars['String'];
  /** Amount of money. */
  amount: Scalars['PositiveDecimal'];
};

export type MoveProductInput = {
  /** The ID of the product to move. */
  productId: Scalars['ID'];
  /** The relative sorting position of the product (from -inf to +inf) starting from the first given product's actual position.1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type NameTranslationInput = {
  name?: InputMaybe<Scalars['String']>;
};

export enum NavigationType {
  /** Main storefront navigation. */
  MAIN = 'MAIN',
  /** Secondary storefront navigation. */
  SECONDARY = 'SECONDARY'
}

export enum OrderAction {
  /** Represents the capture action. */
  CAPTURE = 'CAPTURE',
  /** Represents a mark-as-paid action. */
  MARK_AS_PAID = 'MARK_AS_PAID',
  /** Represents a refund action. */
  REFUND = 'REFUND',
  /** Represents a void action. */
  VOID = 'VOID'
}

export type OrderAddNoteInput = {
  /** Note message. */
  message: Scalars['String'];
};

/**
 * Determine a current authorize status for order.
 *
 *     We treat the order as fully authorized when the sum of authorized and charged funds
 *     cover the order.total.
 *     We treat the order as partially authorized when the sum of authorized and charged
 *     funds covers only part of the order.total
 *     We treat the order as not authorized when the sum of authorized and charged funds is
 *     0.
 *
 *     NONE - the funds are not authorized
 *     PARTIAL - the funds that are authorized or charged don't cover fully the order's
 *     total
 *     FULL - the funds that are authorized or charged fully cover the order's total
 *
 */
export enum OrderAuthorizeStatusEnum {
  NONE = 'NONE',
  PARTIAL = 'PARTIAL',
  FULL = 'FULL'
}

/**
 * Determine the current charge status for the order.
 *
 *     We treat the order as overcharged when the charged amount is bigger that order.total
 *     We treat the order as fully charged when the charged amount is equal to order.total.
 *     We treat the order as partially charged when the charged amount covers only part of
 *     the order.total
 *
 *     NONE - the funds are not charged.
 *     PARTIAL - the funds that are charged don't cover the order's total
 *     FULL - the funds that are charged fully cover the order's total
 *     OVERCHARGED - the charged funds are bigger than order's total
 *
 */
export enum OrderChargeStatusEnum {
  NONE = 'NONE',
  PARTIAL = 'PARTIAL',
  FULL = 'FULL',
  OVERCHARGED = 'OVERCHARGED'
}

/** An enumeration. */
export enum OrderCreateFromCheckoutErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  CHECKOUT_NOT_FOUND = 'CHECKOUT_NOT_FOUND',
  CHANNEL_INACTIVE = 'CHANNEL_INACTIVE',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  VOUCHER_NOT_APPLICABLE = 'VOUCHER_NOT_APPLICABLE',
  GIFT_CARD_NOT_APPLICABLE = 'GIFT_CARD_NOT_APPLICABLE',
  TAX_ERROR = 'TAX_ERROR',
  SHIPPING_METHOD_NOT_SET = 'SHIPPING_METHOD_NOT_SET',
  BILLING_ADDRESS_NOT_SET = 'BILLING_ADDRESS_NOT_SET',
  SHIPPING_ADDRESS_NOT_SET = 'SHIPPING_ADDRESS_NOT_SET',
  INVALID_SHIPPING_METHOD = 'INVALID_SHIPPING_METHOD',
  NO_LINES = 'NO_LINES',
  EMAIL_NOT_SET = 'EMAIL_NOT_SET',
  UNAVAILABLE_VARIANT_IN_CHANNEL = 'UNAVAILABLE_VARIANT_IN_CHANNEL'
}

export enum OrderDirection {
  /** Specifies an ascending sort order. */
  ASC = 'ASC',
  /** Specifies a descending sort order. */
  DESC = 'DESC'
}

export type OrderDiscountCommonInput = {
  /** Type of the discount: fixed or percent */
  valueType: DiscountValueTypeEnum;
  /** Value of the discount. Can store fixed value or percent value */
  value: Scalars['PositiveDecimal'];
  /** Explanation for the applied discount. */
  reason?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum OrderDiscountType {
  VOUCHER = 'VOUCHER',
  MANUAL = 'MANUAL'
}

export type OrderDraftFilterInput = {
  customer?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  channels?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum OrderErrorCode {
  BILLING_ADDRESS_NOT_SET = 'BILLING_ADDRESS_NOT_SET',
  CANNOT_CANCEL_FULFILLMENT = 'CANNOT_CANCEL_FULFILLMENT',
  CANNOT_CANCEL_ORDER = 'CANNOT_CANCEL_ORDER',
  CANNOT_DELETE = 'CANNOT_DELETE',
  CANNOT_DISCOUNT = 'CANNOT_DISCOUNT',
  CANNOT_REFUND = 'CANNOT_REFUND',
  CANNOT_FULFILL_UNPAID_ORDER = 'CANNOT_FULFILL_UNPAID_ORDER',
  CAPTURE_INACTIVE_PAYMENT = 'CAPTURE_INACTIVE_PAYMENT',
  GIFT_CARD_LINE = 'GIFT_CARD_LINE',
  NOT_EDITABLE = 'NOT_EDITABLE',
  FULFILL_ORDER_LINE = 'FULFILL_ORDER_LINE',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  PRODUCT_NOT_PUBLISHED = 'PRODUCT_NOT_PUBLISHED',
  PRODUCT_UNAVAILABLE_FOR_PURCHASE = 'PRODUCT_UNAVAILABLE_FOR_PURCHASE',
  NOT_FOUND = 'NOT_FOUND',
  ORDER_NO_SHIPPING_ADDRESS = 'ORDER_NO_SHIPPING_ADDRESS',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  PAYMENT_MISSING = 'PAYMENT_MISSING',
  REQUIRED = 'REQUIRED',
  SHIPPING_METHOD_NOT_APPLICABLE = 'SHIPPING_METHOD_NOT_APPLICABLE',
  SHIPPING_METHOD_REQUIRED = 'SHIPPING_METHOD_REQUIRED',
  TAX_ERROR = 'TAX_ERROR',
  UNIQUE = 'UNIQUE',
  VOID_INACTIVE_PAYMENT = 'VOID_INACTIVE_PAYMENT',
  ZERO_QUANTITY = 'ZERO_QUANTITY',
  INVALID_QUANTITY = 'INVALID_QUANTITY',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM',
  NOT_AVAILABLE_IN_CHANNEL = 'NOT_AVAILABLE_IN_CHANNEL',
  CHANNEL_INACTIVE = 'CHANNEL_INACTIVE',
  MISSING_TRANSACTION_ACTION_REQUEST_WEBHOOK = 'MISSING_TRANSACTION_ACTION_REQUEST_WEBHOOK'
}

/** An enumeration. */
export enum OrderEventsEmailsEnum {
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  SHIPPING_CONFIRMATION = 'SHIPPING_CONFIRMATION',
  TRACKING_UPDATED = 'TRACKING_UPDATED',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  ORDER_CANCEL = 'ORDER_CANCEL',
  ORDER_REFUND = 'ORDER_REFUND',
  FULFILLMENT_CONFIRMATION = 'FULFILLMENT_CONFIRMATION',
  DIGITAL_LINKS = 'DIGITAL_LINKS'
}

/** An enumeration. */
export enum OrderEventsEnum {
  DRAFT_CREATED = 'DRAFT_CREATED',
  DRAFT_CREATED_FROM_REPLACE = 'DRAFT_CREATED_FROM_REPLACE',
  ADDED_PRODUCTS = 'ADDED_PRODUCTS',
  REMOVED_PRODUCTS = 'REMOVED_PRODUCTS',
  PLACED = 'PLACED',
  PLACED_FROM_DRAFT = 'PLACED_FROM_DRAFT',
  OVERSOLD_ITEMS = 'OVERSOLD_ITEMS',
  CANCELED = 'CANCELED',
  ORDER_MARKED_AS_PAID = 'ORDER_MARKED_AS_PAID',
  ORDER_FULLY_PAID = 'ORDER_FULLY_PAID',
  ORDER_REPLACEMENT_CREATED = 'ORDER_REPLACEMENT_CREATED',
  ORDER_DISCOUNT_ADDED = 'ORDER_DISCOUNT_ADDED',
  ORDER_DISCOUNT_AUTOMATICALLY_UPDATED = 'ORDER_DISCOUNT_AUTOMATICALLY_UPDATED',
  ORDER_DISCOUNT_UPDATED = 'ORDER_DISCOUNT_UPDATED',
  ORDER_DISCOUNT_DELETED = 'ORDER_DISCOUNT_DELETED',
  ORDER_LINE_DISCOUNT_UPDATED = 'ORDER_LINE_DISCOUNT_UPDATED',
  ORDER_LINE_DISCOUNT_REMOVED = 'ORDER_LINE_DISCOUNT_REMOVED',
  ORDER_LINE_PRODUCT_DELETED = 'ORDER_LINE_PRODUCT_DELETED',
  ORDER_LINE_VARIANT_DELETED = 'ORDER_LINE_VARIANT_DELETED',
  UPDATED_ADDRESS = 'UPDATED_ADDRESS',
  EMAIL_SENT = 'EMAIL_SENT',
  CONFIRMED = 'CONFIRMED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  PAYMENT_CAPTURED = 'PAYMENT_CAPTURED',
  EXTERNAL_SERVICE_NOTIFICATION = 'EXTERNAL_SERVICE_NOTIFICATION',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  PAYMENT_VOIDED = 'PAYMENT_VOIDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  TRANSACTION_EVENT = 'TRANSACTION_EVENT',
  TRANSACTION_CAPTURE_REQUESTED = 'TRANSACTION_CAPTURE_REQUESTED',
  TRANSACTION_REFUND_REQUESTED = 'TRANSACTION_REFUND_REQUESTED',
  TRANSACTION_VOID_REQUESTED = 'TRANSACTION_VOID_REQUESTED',
  INVOICE_REQUESTED = 'INVOICE_REQUESTED',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  INVOICE_UPDATED = 'INVOICE_UPDATED',
  INVOICE_SENT = 'INVOICE_SENT',
  FULFILLMENT_CANCELED = 'FULFILLMENT_CANCELED',
  FULFILLMENT_RESTOCKED_ITEMS = 'FULFILLMENT_RESTOCKED_ITEMS',
  FULFILLMENT_FULFILLED_ITEMS = 'FULFILLMENT_FULFILLED_ITEMS',
  FULFILLMENT_REFUNDED = 'FULFILLMENT_REFUNDED',
  FULFILLMENT_RETURNED = 'FULFILLMENT_RETURNED',
  FULFILLMENT_REPLACED = 'FULFILLMENT_REPLACED',
  FULFILLMENT_AWAITS_APPROVAL = 'FULFILLMENT_AWAITS_APPROVAL',
  TRACKING_UPDATED = 'TRACKING_UPDATED',
  NOTE_ADDED = 'NOTE_ADDED',
  OTHER = 'OTHER'
}

export type OrderFilterInput = {
  paymentStatus?: InputMaybe<Array<PaymentChargeStatusEnum>>;
  status?: InputMaybe<Array<OrderStatusFilter>>;
  customer?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  channels?: InputMaybe<Array<Scalars['ID']>>;
  authorizeStatus?: InputMaybe<Array<OrderAuthorizeStatusEnum>>;
  chargeStatus?: InputMaybe<Array<OrderChargeStatusEnum>>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
  isClickAndCollect?: InputMaybe<Scalars['Boolean']>;
  isPreorder?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  giftCardUsed?: InputMaybe<Scalars['Boolean']>;
  giftCardBought?: InputMaybe<Scalars['Boolean']>;
  numbers?: InputMaybe<Array<Scalars['String']>>;
};

export type OrderFulfillInput = {
  /** List of items informing how to fulfill the order. */
  lines: Array<OrderFulfillLineInput>;
  /** If true, send an email notification to the customer. */
  notifyCustomer?: InputMaybe<Scalars['Boolean']>;
  /** If true, then allow proceed fulfillment when stock is exceeded. */
  allowStockToBeExceeded?: InputMaybe<Scalars['Boolean']>;
  /**
   * Fulfillment tracking number.
   *
   * Added in Saleor 3.6.
   */
  trackingNumber?: InputMaybe<Scalars['String']>;
};

export type OrderFulfillLineInput = {
  /** The ID of the order line. */
  orderLineId?: InputMaybe<Scalars['ID']>;
  /** List of stock items to create. */
  stocks: Array<OrderFulfillStockInput>;
};

export type OrderFulfillStockInput = {
  /** The number of line items to be fulfilled from given warehouse. */
  quantity: Scalars['Int'];
  /** ID of the warehouse from which the item will be fulfilled. */
  warehouse: Scalars['ID'];
};

export type OrderLineCreateInput = {
  /** Number of variant items ordered. */
  quantity: Scalars['Int'];
  /** Product variant ID. */
  variantId: Scalars['ID'];
  /**
   * Flag that allow force splitting the same variant into multiple lines by skipping the matching logic.
   *
   * Added in Saleor 3.6.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  forceNewLine?: InputMaybe<Scalars['Boolean']>;
};

export type OrderLineInput = {
  /** Number of variant items ordered. */
  quantity: Scalars['Int'];
};

/** An enumeration. */
export enum OrderOriginEnum {
  CHECKOUT = 'CHECKOUT',
  DRAFT = 'DRAFT',
  REISSUE = 'REISSUE'
}

export type OrderRefundFulfillmentLineInput = {
  /** The ID of the fulfillment line to refund. */
  fulfillmentLineId: Scalars['ID'];
  /** The number of items to be refunded. */
  quantity: Scalars['Int'];
};

export type OrderRefundLineInput = {
  /** The ID of the order line to refund. */
  orderLineId: Scalars['ID'];
  /** The number of items to be refunded. */
  quantity: Scalars['Int'];
};

export type OrderRefundProductsInput = {
  /** List of unfulfilled lines to refund. */
  orderLines?: InputMaybe<Array<OrderRefundLineInput>>;
  /** List of fulfilled lines to refund. */
  fulfillmentLines?: InputMaybe<Array<OrderRefundFulfillmentLineInput>>;
  /** The total amount of refund when the value is provided manually. */
  amountToRefund?: InputMaybe<Scalars['PositiveDecimal']>;
  /** If true, Saleor will refund shipping costs. If amountToRefund is providedincludeShippingCosts will be ignored. */
  includeShippingCosts?: InputMaybe<Scalars['Boolean']>;
};

export type OrderReturnFulfillmentLineInput = {
  /** The ID of the fulfillment line to return. */
  fulfillmentLineId: Scalars['ID'];
  /** The number of items to be returned. */
  quantity: Scalars['Int'];
  /** Determines, if the line should be added to replace order. */
  replace?: InputMaybe<Scalars['Boolean']>;
};

export type OrderReturnLineInput = {
  /** The ID of the order line to return. */
  orderLineId: Scalars['ID'];
  /** The number of items to be returned. */
  quantity: Scalars['Int'];
  /** Determines, if the line should be added to replace order. */
  replace?: InputMaybe<Scalars['Boolean']>;
};

export type OrderReturnProductsInput = {
  /** List of unfulfilled lines to return. */
  orderLines?: InputMaybe<Array<OrderReturnLineInput>>;
  /** List of fulfilled lines to return. */
  fulfillmentLines?: InputMaybe<Array<OrderReturnFulfillmentLineInput>>;
  /** The total amount of refund when the value is provided manually. */
  amountToRefund?: InputMaybe<Scalars['PositiveDecimal']>;
  /** If true, Saleor will refund shipping costs. If amountToRefund is providedincludeShippingCosts will be ignored. */
  includeShippingCosts?: InputMaybe<Scalars['Boolean']>;
  /** If true, Saleor will call refund action for all lines. */
  refund?: InputMaybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum OrderSettingsErrorCode {
  INVALID = 'INVALID'
}

export type OrderSettingsUpdateInput = {
  /** When disabled, all new orders from checkout will be marked as unconfirmed. When enabled orders from checkout will become unfulfilled immediately. */
  automaticallyConfirmAllNewOrders?: InputMaybe<Scalars['Boolean']>;
  /** When enabled, all non-shippable gift card orders will be fulfilled automatically. */
  automaticallyFulfillNonShippableGiftCard?: InputMaybe<Scalars['Boolean']>;
};

export enum OrderSortField {
  /** Sort orders by number. */
  NUMBER = 'NUMBER',
  /** Sort orders by rank. Note: This option is available only with the `search` filter. */
  RANK = 'RANK',
  /**
   * Sort orders by creation date.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  CREATION_DATE = 'CREATION_DATE',
  /**
   * Sort orders by creation date.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  CREATED_AT = 'CREATED_AT',
  /** Sort orders by last modified at. */
  LAST_MODIFIED_AT = 'LAST_MODIFIED_AT',
  /** Sort orders by customer. */
  CUSTOMER = 'CUSTOMER',
  /** Sort orders by payment. */
  PAYMENT = 'PAYMENT',
  /** Sort orders by fulfillment status. */
  FULFILLMENT_STATUS = 'FULFILLMENT_STATUS'
}

export type OrderSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort orders by the selected field. */
  field: OrderSortField;
};

/** An enumeration. */
export enum OrderStatus {
  DRAFT = 'DRAFT',
  UNCONFIRMED = 'UNCONFIRMED',
  UNFULFILLED = 'UNFULFILLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  PARTIALLY_RETURNED = 'PARTIALLY_RETURNED',
  RETURNED = 'RETURNED',
  FULFILLED = 'FULFILLED',
  CANCELED = 'CANCELED'
}

export enum OrderStatusFilter {
  READY_TO_FULFILL = 'READY_TO_FULFILL',
  READY_TO_CAPTURE = 'READY_TO_CAPTURE',
  UNFULFILLED = 'UNFULFILLED',
  UNCONFIRMED = 'UNCONFIRMED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELED = 'CANCELED'
}

export type OrderUpdateInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** Email address of the customer. */
  userEmail?: InputMaybe<Scalars['String']>;
  /** Shipping address of the customer. */
  shippingAddress?: InputMaybe<AddressInput>;
};

export type OrderUpdateShippingInput = {
  /** ID of the selected shipping method, pass null to remove currently assigned shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
};

export type PageCreateInput = {
  /** Page internal name. */
  slug?: InputMaybe<Scalars['String']>;
  /** Page title. */
  title?: InputMaybe<Scalars['String']>;
  /**
   * Page content.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  content?: InputMaybe<Scalars['JSONString']>;
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** Determines if page is visible in the storefront. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /**
   * Publication date. ISO 8601 standard.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `publishedAt` field instead.
   */
  publicationDate?: InputMaybe<Scalars['String']>;
  /**
   * Publication date time. ISO 8601 standard.
   *
   * Added in Saleor 3.3.
   */
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** ID of the page type that page belongs to. */
  pageType: Scalars['ID'];
};

/** An enumeration. */
export enum PageErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM',
  ATTRIBUTE_ALREADY_ASSIGNED = 'ATTRIBUTE_ALREADY_ASSIGNED'
}

export type PageFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  pageTypes?: InputMaybe<Array<Scalars['ID']>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type PageInput = {
  /** Page internal name. */
  slug?: InputMaybe<Scalars['String']>;
  /** Page title. */
  title?: InputMaybe<Scalars['String']>;
  /**
   * Page content.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  content?: InputMaybe<Scalars['JSONString']>;
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** Determines if page is visible in the storefront. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /**
   * Publication date. ISO 8601 standard.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `publishedAt` field instead.
   */
  publicationDate?: InputMaybe<Scalars['String']>;
  /**
   * Publication date time. ISO 8601 standard.
   *
   * Added in Saleor 3.3.
   */
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
};

export enum PageSortField {
  /** Sort pages by title. */
  TITLE = 'TITLE',
  /** Sort pages by slug. */
  SLUG = 'SLUG',
  /** Sort pages by visibility. */
  VISIBILITY = 'VISIBILITY',
  /** Sort pages by creation date. */
  CREATION_DATE = 'CREATION_DATE',
  /**
   * Sort pages by publication date.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  PUBLICATION_DATE = 'PUBLICATION_DATE',
  /**
   * Sort pages by publication date.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  PUBLISHED_AT = 'PUBLISHED_AT'
}

export type PageSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort pages by the selected field. */
  field: PageSortField;
};

export type PageTranslationInput = {
  seoTitle?: InputMaybe<Scalars['String']>;
  seoDescription?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  /**
   * Translated page content.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  content?: InputMaybe<Scalars['JSONString']>;
};

export type PageTypeCreateInput = {
  /** Name of the page type. */
  name?: InputMaybe<Scalars['String']>;
  /** Page type slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** List of attribute IDs to be assigned to the page type. */
  addAttributes?: InputMaybe<Array<Scalars['ID']>>;
};

export type PageTypeFilterInput = {
  search?: InputMaybe<Scalars['String']>;
};

export enum PageTypeSortField {
  /** Sort page types by name. */
  NAME = 'NAME',
  /** Sort page types by slug. */
  SLUG = 'SLUG'
}

export type PageTypeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort page types by the selected field. */
  field: PageTypeSortField;
};

export type PageTypeUpdateInput = {
  /** Name of the page type. */
  name?: InputMaybe<Scalars['String']>;
  /** Page type slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** List of attribute IDs to be assigned to the page type. */
  addAttributes?: InputMaybe<Array<Scalars['ID']>>;
  /** List of attribute IDs to be assigned to the page type. */
  removeAttributes?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum PaymentChargeStatusEnum {
  NOT_CHARGED = 'NOT_CHARGED',
  PENDING = 'PENDING',
  PARTIALLY_CHARGED = 'PARTIALLY_CHARGED',
  FULLY_CHARGED = 'FULLY_CHARGED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  FULLY_REFUNDED = 'FULLY_REFUNDED',
  REFUSED = 'REFUSED',
  CANCELLED = 'CANCELLED'
}

export type PaymentCheckBalanceInput = {
  /** An ID of a payment gateway to check. */
  gatewayId: Scalars['String'];
  /** Payment method name. */
  method: Scalars['String'];
  /** Slug of a channel for which the data should be returned. */
  channel: Scalars['String'];
  /** Information about card. */
  card: CardInput;
};

/** An enumeration. */
export enum PaymentErrorCode {
  BILLING_ADDRESS_NOT_SET = 'BILLING_ADDRESS_NOT_SET',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  PARTIAL_PAYMENT_NOT_ALLOWED = 'PARTIAL_PAYMENT_NOT_ALLOWED',
  SHIPPING_ADDRESS_NOT_SET = 'SHIPPING_ADDRESS_NOT_SET',
  INVALID_SHIPPING_METHOD = 'INVALID_SHIPPING_METHOD',
  SHIPPING_METHOD_NOT_SET = 'SHIPPING_METHOD_NOT_SET',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  NOT_SUPPORTED_GATEWAY = 'NOT_SUPPORTED_GATEWAY',
  CHANNEL_INACTIVE = 'CHANNEL_INACTIVE',
  BALANCE_CHECK_ERROR = 'BALANCE_CHECK_ERROR',
  CHECKOUT_EMAIL_NOT_SET = 'CHECKOUT_EMAIL_NOT_SET',
  UNAVAILABLE_VARIANT_IN_CHANNEL = 'UNAVAILABLE_VARIANT_IN_CHANNEL',
  NO_CHECKOUT_LINES = 'NO_CHECKOUT_LINES'
}

export type PaymentFilterInput = {
  checkouts?: InputMaybe<Array<Scalars['ID']>>;
};

export type PaymentInput = {
  /** A gateway to use with that payment. */
  gateway: Scalars['String'];
  /** Client-side generated payment token, representing customer's billing data in a secure manner. */
  token?: InputMaybe<Scalars['String']>;
  /** Total amount of the transaction, including all taxes and discounts. If no amount is provided, the checkout total will be used. */
  amount?: InputMaybe<Scalars['PositiveDecimal']>;
  /** URL of a storefront view where user should be redirected after requiring additional actions. Payment with additional actions will not be finished if this field is not provided. */
  returnUrl?: InputMaybe<Scalars['String']>;
  /**
   * Payment store type.
   *
   * Added in Saleor 3.1.
   */
  storePaymentMethod?: InputMaybe<StorePaymentMethodEnum>;
  /**
   * User public metadata.
   *
   * Added in Saleor 3.1.
   */
  metadata?: InputMaybe<Array<MetadataInput>>;
};

/** An enumeration. */
export enum PermissionEnum {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_STAFF = 'MANAGE_STAFF',
  IMPERSONATE_USER = 'IMPERSONATE_USER',
  MANAGE_APPS = 'MANAGE_APPS',
  MANAGE_OBSERVABILITY = 'MANAGE_OBSERVABILITY',
  MANAGE_CHANNELS = 'MANAGE_CHANNELS',
  MANAGE_DISCOUNTS = 'MANAGE_DISCOUNTS',
  MANAGE_PLUGINS = 'MANAGE_PLUGINS',
  MANAGE_GIFT_CARD = 'MANAGE_GIFT_CARD',
  MANAGE_MENUS = 'MANAGE_MENUS',
  MANAGE_ORDERS = 'MANAGE_ORDERS',
  MANAGE_PAGES = 'MANAGE_PAGES',
  MANAGE_PAGE_TYPES_AND_ATTRIBUTES = 'MANAGE_PAGE_TYPES_AND_ATTRIBUTES',
  HANDLE_PAYMENTS = 'HANDLE_PAYMENTS',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES = 'MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES',
  MANAGE_SHIPPING = 'MANAGE_SHIPPING',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  MANAGE_TRANSLATIONS = 'MANAGE_TRANSLATIONS',
  MANAGE_CHECKOUTS = 'MANAGE_CHECKOUTS',
  HANDLE_CHECKOUTS = 'HANDLE_CHECKOUTS',
  HANDLE_TAXES = 'HANDLE_TAXES'
}

export type PermissionGroupCreateInput = {
  /** List of permission code names to assign to this group. */
  addPermissions?: InputMaybe<Array<PermissionEnum>>;
  /** List of users to assign to this group. */
  addUsers?: InputMaybe<Array<Scalars['ID']>>;
  /** Group name. */
  name: Scalars['String'];
};

/** An enumeration. */
export enum PermissionGroupErrorCode {
  ASSIGN_NON_STAFF_MEMBER = 'ASSIGN_NON_STAFF_MEMBER',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM',
  CANNOT_REMOVE_FROM_LAST_GROUP = 'CANNOT_REMOVE_FROM_LAST_GROUP',
  LEFT_NOT_MANAGEABLE_PERMISSION = 'LEFT_NOT_MANAGEABLE_PERMISSION',
  OUT_OF_SCOPE_PERMISSION = 'OUT_OF_SCOPE_PERMISSION',
  OUT_OF_SCOPE_USER = 'OUT_OF_SCOPE_USER',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

export type PermissionGroupFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export enum PermissionGroupSortField {
  /** Sort permission group accounts by name. */
  NAME = 'NAME'
}

export type PermissionGroupSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort permission group by the selected field. */
  field: PermissionGroupSortField;
};

export type PermissionGroupUpdateInput = {
  /** List of permission code names to assign to this group. */
  addPermissions?: InputMaybe<Array<PermissionEnum>>;
  /** List of users to assign to this group. */
  addUsers?: InputMaybe<Array<Scalars['ID']>>;
  /** Group name. */
  name?: InputMaybe<Scalars['String']>;
  /** List of permission code names to unassign from this group. */
  removePermissions?: InputMaybe<Array<PermissionEnum>>;
  /** List of users to unassign from this group. */
  removeUsers?: InputMaybe<Array<Scalars['ID']>>;
};

export enum PluginConfigurationType {
  PER_CHANNEL = 'PER_CHANNEL',
  GLOBAL = 'GLOBAL'
}

/** An enumeration. */
export enum PluginErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  PLUGIN_MISCONFIGURED = 'PLUGIN_MISCONFIGURED',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

export type PluginFilterInput = {
  statusInChannels?: InputMaybe<PluginStatusInChannelsInput>;
  search?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<PluginConfigurationType>;
};

export enum PluginSortField {
  NAME = 'NAME',
  IS_ACTIVE = 'IS_ACTIVE'
}

export type PluginSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort plugins by the selected field. */
  field: PluginSortField;
};

export type PluginStatusInChannelsInput = {
  active: Scalars['Boolean'];
  channels: Array<Scalars['ID']>;
};

export type PluginUpdateInput = {
  /** Indicates whether the plugin should be enabled. */
  active?: InputMaybe<Scalars['Boolean']>;
  /** Configuration of the plugin. */
  configuration?: InputMaybe<Array<ConfigurationItemInput>>;
};

/** An enumeration. */
export enum PostalCodeRuleInclusionTypeEnum {
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE'
}

export type PreorderSettingsInput = {
  /** The global threshold for preorder variant. */
  globalThreshold?: InputMaybe<Scalars['Int']>;
  /** The end date for preorder. */
  endDate?: InputMaybe<Scalars['DateTime']>;
};

export type PriceInput = {
  /** Currency code. */
  currency: Scalars['String'];
  /** Amount of money. */
  amount: Scalars['PositiveDecimal'];
};

export type PriceRangeInput = {
  /** Price greater than or equal to. */
  gte?: InputMaybe<Scalars['Float']>;
  /** Price less than or equal to. */
  lte?: InputMaybe<Scalars['Float']>;
};

export type ProductAttributeAssignInput = {
  /** The ID of the attribute to assign. */
  id: Scalars['ID'];
  /** The attribute type to be assigned as. */
  type: ProductAttributeType;
  /**
   * Whether attribute is allowed in variant selection. Allowed types are: ['dropdown', 'boolean', 'swatch', 'numeric'].
   *
   * Added in Saleor 3.1.
   */
  variantSelection?: InputMaybe<Scalars['Boolean']>;
};

export type ProductAttributeAssignmentUpdateInput = {
  /** The ID of the attribute to assign. */
  id: Scalars['ID'];
  /**
   * Whether attribute is allowed in variant selection. Allowed types are: ['dropdown', 'boolean', 'swatch', 'numeric'].
   *
   * Added in Saleor 3.1.
   */
  variantSelection: Scalars['Boolean'];
};

export enum ProductAttributeType {
  PRODUCT = 'PRODUCT',
  VARIANT = 'VARIANT'
}

export type ProductChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Determines if object is visible to customers. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /**
   * Publication date. ISO 8601 standard.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `publishedAt` field instead.
   */
  publicationDate?: InputMaybe<Scalars['Date']>;
  /**
   * Publication date time. ISO 8601 standard.
   *
   * Added in Saleor 3.3.
   */
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  /** Determines if product is visible in product listings (doesn't apply to product collections). */
  visibleInListings?: InputMaybe<Scalars['Boolean']>;
  /** Determine if product should be available for purchase. */
  isAvailableForPurchase?: InputMaybe<Scalars['Boolean']>;
  /**
   * A start date from which a product will be available for purchase. When not set and isAvailable is set to True, the current day is assumed.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `availableForPurchaseAt` field instead.
   */
  availableForPurchaseDate?: InputMaybe<Scalars['Date']>;
  /**
   * A start date time from which a product will be available for purchase. When not set and `isAvailable` is set to True, the current day is assumed.
   *
   * Added in Saleor 3.3.
   */
  availableForPurchaseAt?: InputMaybe<Scalars['DateTime']>;
  /** List of variants to which the channel should be assigned. */
  addVariants?: InputMaybe<Array<Scalars['ID']>>;
  /** List of variants from which the channel should be unassigned. */
  removeVariants?: InputMaybe<Array<Scalars['ID']>>;
};

export type ProductChannelListingUpdateInput = {
  /** List of channels to which the product should be assigned or updated. */
  updateChannels?: InputMaybe<Array<ProductChannelListingAddInput>>;
  /** List of channels from which the product should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

export type ProductCreateInput = {
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** ID of the product's category. */
  category?: InputMaybe<Scalars['ID']>;
  /** Determine if taxes are being charged for the product. */
  chargeTaxes?: InputMaybe<Scalars['Boolean']>;
  /** List of IDs of collections that the product belongs to. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * Product description.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Product name. */
  name?: InputMaybe<Scalars['String']>;
  /** Product slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Weight of the Product. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
  /** Defines the product rating value. */
  rating?: InputMaybe<Scalars['Float']>;
  /** ID of the type that product belongs to. */
  productType: Scalars['ID'];
};

/** An enumeration. */
export enum ProductErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  ATTRIBUTE_ALREADY_ASSIGNED = 'ATTRIBUTE_ALREADY_ASSIGNED',
  ATTRIBUTE_CANNOT_BE_ASSIGNED = 'ATTRIBUTE_CANNOT_BE_ASSIGNED',
  ATTRIBUTE_VARIANTS_DISABLED = 'ATTRIBUTE_VARIANTS_DISABLED',
  MEDIA_ALREADY_ASSIGNED = 'MEDIA_ALREADY_ASSIGNED',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  PRODUCT_WITHOUT_CATEGORY = 'PRODUCT_WITHOUT_CATEGORY',
  NOT_PRODUCTS_IMAGE = 'NOT_PRODUCTS_IMAGE',
  NOT_PRODUCTS_VARIANT = 'NOT_PRODUCTS_VARIANT',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  VARIANT_NO_DIGITAL_CONTENT = 'VARIANT_NO_DIGITAL_CONTENT',
  CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  PRODUCT_NOT_ASSIGNED_TO_CHANNEL = 'PRODUCT_NOT_ASSIGNED_TO_CHANNEL',
  UNSUPPORTED_MEDIA_PROVIDER = 'UNSUPPORTED_MEDIA_PROVIDER',
  PREORDER_VARIANT_CANNOT_BE_DEACTIVATED = 'PREORDER_VARIANT_CANNOT_BE_DEACTIVATED'
}

export enum ProductFieldEnum {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  CATEGORY = 'CATEGORY',
  PRODUCT_WEIGHT = 'PRODUCT_WEIGHT',
  COLLECTIONS = 'COLLECTIONS',
  CHARGE_TAXES = 'CHARGE_TAXES',
  PRODUCT_MEDIA = 'PRODUCT_MEDIA',
  VARIANT_ID = 'VARIANT_ID',
  VARIANT_SKU = 'VARIANT_SKU',
  VARIANT_WEIGHT = 'VARIANT_WEIGHT',
  VARIANT_MEDIA = 'VARIANT_MEDIA'
}

export type ProductFilterInput = {
  isPublished?: InputMaybe<Scalars['Boolean']>;
  collections?: InputMaybe<Array<Scalars['ID']>>;
  categories?: InputMaybe<Array<Scalars['ID']>>;
  hasCategory?: InputMaybe<Scalars['Boolean']>;
  attributes?: InputMaybe<Array<AttributeInput>>;
  /** Filter by variants having specific stock status. */
  stockAvailability?: InputMaybe<StockAvailability>;
  stocks?: InputMaybe<ProductStockFilterInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  price?: InputMaybe<PriceRangeInput>;
  /** Filter by the lowest variant price after discounts. */
  minimalPrice?: InputMaybe<PriceRangeInput>;
  /** Filter by when was the most recent update. */
  updatedAt?: InputMaybe<DateTimeRangeInput>;
  productTypes?: InputMaybe<Array<Scalars['ID']>>;
  /** Filter on whether product is a gift card or not. */
  giftCard?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  hasPreorderedVariants?: InputMaybe<Scalars['Boolean']>;
  /**
   * Specifies the channel by which the data should be filtered.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
};

export type ProductInput = {
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** ID of the product's category. */
  category?: InputMaybe<Scalars['ID']>;
  /** Determine if taxes are being charged for the product. */
  chargeTaxes?: InputMaybe<Scalars['Boolean']>;
  /** List of IDs of collections that the product belongs to. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * Product description.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Product name. */
  name?: InputMaybe<Scalars['String']>;
  /** Product slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Weight of the Product. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
  /** Defines the product rating value. */
  rating?: InputMaybe<Scalars['Float']>;
};

export type ProductMediaCreateInput = {
  /** Alt text for a product media. */
  alt?: InputMaybe<Scalars['String']>;
  /** Represents an image file in a multipart request. */
  image?: InputMaybe<Scalars['Upload']>;
  /** ID of an product. */
  product: Scalars['ID'];
  /** Represents an URL to an external media. */
  mediaUrl?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum ProductMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type ProductMediaUpdateInput = {
  /** Alt text for a product media. */
  alt?: InputMaybe<Scalars['String']>;
};

export type ProductOrder = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /**
   * Sort product by the selected attribute's values.
   * Note: this doesn't take translations into account yet.
   */
  attributeId?: InputMaybe<Scalars['ID']>;
  /** Sort products by the selected field. */
  field?: InputMaybe<ProductOrderField>;
};

export enum ProductOrderField {
  /** Sort products by name. */
  NAME = 'NAME',
  /** Sort products by rank. Note: This option is available only with the `search` filter. */
  RANK = 'RANK',
  /**
   * Sort products by price.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  PRICE = 'PRICE',
  /**
   * Sort products by a minimal price of a product's variant.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  MINIMAL_PRICE = 'MINIMAL_PRICE',
  /** Sort products by update date. */
  LAST_MODIFIED = 'LAST_MODIFIED',
  /** Sort products by update date. */
  DATE = 'DATE',
  /** Sort products by type. */
  TYPE = 'TYPE',
  /**
   * Sort products by publication status.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  PUBLISHED = 'PUBLISHED',
  /**
   * Sort products by publication date.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  PUBLICATION_DATE = 'PUBLICATION_DATE',
  /**
   * Sort products by publication date.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  PUBLISHED_AT = 'PUBLISHED_AT',
  /** Sort products by update date. */
  LAST_MODIFIED_AT = 'LAST_MODIFIED_AT',
  /**
   * Sort products by collection. Note: This option is available only for the `Collection.products` query.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  COLLECTION = 'COLLECTION',
  /** Sort products by rating. */
  RATING = 'RATING'
}

export type ProductStockFilterInput = {
  warehouseIds?: InputMaybe<Array<Scalars['ID']>>;
  quantity?: InputMaybe<IntRangeInput>;
};

export enum ProductTypeConfigurable {
  CONFIGURABLE = 'CONFIGURABLE',
  SIMPLE = 'SIMPLE'
}

export enum ProductTypeEnum {
  DIGITAL = 'DIGITAL',
  SHIPPABLE = 'SHIPPABLE'
}

export type ProductTypeFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  configurable?: InputMaybe<ProductTypeConfigurable>;
  productType?: InputMaybe<ProductTypeEnum>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  kind?: InputMaybe<ProductTypeKindEnum>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type ProductTypeInput = {
  /** Name of the product type. */
  name?: InputMaybe<Scalars['String']>;
  /** Product type slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** The product type kind. */
  kind?: InputMaybe<ProductTypeKindEnum>;
  /** Determines if product of this type has multiple variants. This option mainly simplifies product management in the dashboard. There is always at least one variant created under the hood. */
  hasVariants?: InputMaybe<Scalars['Boolean']>;
  /** List of attributes shared among all product variants. */
  productAttributes?: InputMaybe<Array<Scalars['ID']>>;
  /** List of attributes used to distinguish between different variants of a product. */
  variantAttributes?: InputMaybe<Array<Scalars['ID']>>;
  /** Determines if shipping is required for products of this variant. */
  isShippingRequired?: InputMaybe<Scalars['Boolean']>;
  /** Determines if products are digital. */
  isDigital?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the ProductType items. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum ProductTypeKindEnum {
  NORMAL = 'NORMAL',
  GIFT_CARD = 'GIFT_CARD'
}

export enum ProductTypeSortField {
  /** Sort products by name. */
  NAME = 'NAME',
  /** Sort products by type. */
  DIGITAL = 'DIGITAL',
  /** Sort products by shipping. */
  SHIPPING_REQUIRED = 'SHIPPING_REQUIRED'
}

export type ProductTypeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort product types by the selected field. */
  field: ProductTypeSortField;
};

export type ProductVariantBulkCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<BulkAttributeValueInput>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Variant name. */
  name?: InputMaybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
  /**
   * Determines if variant is in preorder.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  preorder?: InputMaybe<PreorderSettingsInput>;
  /**
   * Determines maximum quantity of `ProductVariant`,that can be bought in a single checkout.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
  /** Stocks of a product available for sale. */
  stocks?: InputMaybe<Array<StockInput>>;
  /** List of prices assigned to channels. */
  channelListings?: InputMaybe<Array<ProductVariantChannelListingAddInput>>;
};

export type ProductVariantChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Price of the particular variant in channel. */
  price: Scalars['PositiveDecimal'];
  /** Cost price of the variant in channel. */
  costPrice?: InputMaybe<Scalars['PositiveDecimal']>;
  /**
   * The threshold for preorder variant in channel.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  preorderThreshold?: InputMaybe<Scalars['Int']>;
};

export type ProductVariantCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<AttributeValueInput>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Variant name. */
  name?: InputMaybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
  /**
   * Determines if variant is in preorder.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  preorder?: InputMaybe<PreorderSettingsInput>;
  /**
   * Determines maximum quantity of `ProductVariant`,that can be bought in a single checkout.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
  /** Product ID of which type is the variant. */
  product: Scalars['ID'];
  /** Stocks of a product available for sale. */
  stocks?: InputMaybe<Array<StockInput>>;
};

export type ProductVariantFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Array<Scalars['String']>>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  isPreorder?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

export type ProductVariantInput = {
  /** List of attributes specific to this variant. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Variant name. */
  name?: InputMaybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
  /**
   * Determines if variant is in preorder.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  preorder?: InputMaybe<PreorderSettingsInput>;
  /**
   * Determines maximum quantity of `ProductVariant`,that can be bought in a single checkout.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
};

export enum ProductVariantSortField {
  /** Sort products variants by last modified at. */
  LAST_MODIFIED_AT = 'LAST_MODIFIED_AT'
}

export type ProductVariantSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort productVariants by the selected field. */
  field: ProductVariantSortField;
};

export type PublishableChannelListingInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Determines if object is visible to customers. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /**
   * Publication date. ISO 8601 standard.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `publishedAt` field instead.
   */
  publicationDate?: InputMaybe<Scalars['Date']>;
  /**
   * Publication date time. ISO 8601 standard.
   *
   * Added in Saleor 3.3.
   */
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export type ReorderInput = {
  /** The ID of the item to move. */
  id: Scalars['ID'];
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export enum ReportingPeriod {
  TODAY = 'TODAY',
  THIS_MONTH = 'THIS_MONTH'
}

export type SaleChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** The value of the discount. */
  discountValue: Scalars['PositiveDecimal'];
};

export type SaleChannelListingInput = {
  /** List of channels to which the sale should be assigned. */
  addChannels?: InputMaybe<Array<SaleChannelListingAddInput>>;
  /** List of channels from which the sale should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

export type SaleFilterInput = {
  status?: InputMaybe<Array<DiscountStatusEnum>>;
  saleType?: InputMaybe<DiscountValueTypeEnum>;
  started?: InputMaybe<DateTimeRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

export type SaleInput = {
  /** Voucher name. */
  name?: InputMaybe<Scalars['String']>;
  /** Fixed or percentage. */
  type?: InputMaybe<DiscountValueTypeEnum>;
  /** Value of the voucher. */
  value?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Products related to the discount. */
  products?: InputMaybe<Array<Scalars['ID']>>;
  variants?: InputMaybe<Array<Scalars['ID']>>;
  /** Categories related to the discount. */
  categories?: InputMaybe<Array<Scalars['ID']>>;
  /** Collections related to the discount. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /** Start date of the voucher in ISO 8601 format. */
  startDate?: InputMaybe<Scalars['DateTime']>;
  /** End date of the voucher in ISO 8601 format. */
  endDate?: InputMaybe<Scalars['DateTime']>;
};

export enum SaleSortField {
  /** Sort sales by name. */
  NAME = 'NAME',
  /** Sort sales by start date. */
  START_DATE = 'START_DATE',
  /** Sort sales by end date. */
  END_DATE = 'END_DATE',
  /**
   * Sort sales by value.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  VALUE = 'VALUE',
  /** Sort sales by type. */
  TYPE = 'TYPE',
  /** Sort sales by created at. */
  CREATED_AT = 'CREATED_AT',
  /** Sort sales by last modified at. */
  LAST_MODIFIED_AT = 'LAST_MODIFIED_AT'
}

export type SaleSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Sort sales by the selected field. */
  field: SaleSortField;
};

export enum SaleType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

export type SeoInput = {
  /** SEO title. */
  title?: InputMaybe<Scalars['String']>;
  /** SEO description. */
  description?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum ShippingErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  MAX_LESS_THAN_MIN = 'MAX_LESS_THAN_MIN',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE',
  DUPLICATED_INPUT_ITEM = 'DUPLICATED_INPUT_ITEM'
}

export type ShippingMethodChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Shipping price of the shipping method in this channel. */
  price?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Minimum order price to use this shipping method. */
  minimumOrderPrice?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Maximum order price to use this shipping method. */
  maximumOrderPrice?: InputMaybe<Scalars['PositiveDecimal']>;
};

export type ShippingMethodChannelListingInput = {
  /** List of channels to which the shipping method should be assigned. */
  addChannels?: InputMaybe<Array<ShippingMethodChannelListingAddInput>>;
  /** List of channels from which the shipping method should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum ShippingMethodTypeEnum {
  PRICE = 'PRICE',
  WEIGHT = 'WEIGHT'
}

export type ShippingPostalCodeRulesCreateInputRange = {
  /** Start range of the postal code. */
  start: Scalars['String'];
  /** End range of the postal code. */
  end?: InputMaybe<Scalars['String']>;
};

export type ShippingPriceExcludeProductsInput = {
  /** List of products which will be excluded. */
  products: Array<Scalars['ID']>;
};

export type ShippingPriceInput = {
  /** Name of the shipping method. */
  name?: InputMaybe<Scalars['String']>;
  /** Shipping method description. */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Minimum order weight to use this shipping method. */
  minimumOrderWeight?: InputMaybe<Scalars['WeightScalar']>;
  /** Maximum order weight to use this shipping method. */
  maximumOrderWeight?: InputMaybe<Scalars['WeightScalar']>;
  /** Maximum number of days for delivery. */
  maximumDeliveryDays?: InputMaybe<Scalars['Int']>;
  /** Minimal number of days for delivery. */
  minimumDeliveryDays?: InputMaybe<Scalars['Int']>;
  /** Shipping type: price or weight based. */
  type?: InputMaybe<ShippingMethodTypeEnum>;
  /** Shipping zone this method belongs to. */
  shippingZone?: InputMaybe<Scalars['ID']>;
  /** Postal code rules to add. */
  addPostalCodeRules?: InputMaybe<Array<ShippingPostalCodeRulesCreateInputRange>>;
  /** Postal code rules to delete. */
  deletePostalCodeRules?: InputMaybe<Array<Scalars['ID']>>;
  /** Inclusion type for currently assigned postal code rules. */
  inclusionType?: InputMaybe<PostalCodeRuleInclusionTypeEnum>;
};

export type ShippingPriceTranslationInput = {
  name?: InputMaybe<Scalars['String']>;
  /**
   * Translated shipping method description.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
};

export type ShippingZoneCreateInput = {
  /** Shipping zone's name. Visible only to the staff. */
  name?: InputMaybe<Scalars['String']>;
  /** Description of the shipping zone. */
  description?: InputMaybe<Scalars['String']>;
  /** List of countries in this shipping zone. */
  countries?: InputMaybe<Array<Scalars['String']>>;
  /** Default shipping zone will be used for countries not covered by other zones. */
  default?: InputMaybe<Scalars['Boolean']>;
  /** List of warehouses to assign to a shipping zone */
  addWarehouses?: InputMaybe<Array<Scalars['ID']>>;
  /** List of channels to assign to the shipping zone. */
  addChannels?: InputMaybe<Array<Scalars['ID']>>;
};

export type ShippingZoneFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  channels?: InputMaybe<Array<Scalars['ID']>>;
};

export type ShippingZoneUpdateInput = {
  /** Shipping zone's name. Visible only to the staff. */
  name?: InputMaybe<Scalars['String']>;
  /** Description of the shipping zone. */
  description?: InputMaybe<Scalars['String']>;
  /** List of countries in this shipping zone. */
  countries?: InputMaybe<Array<Scalars['String']>>;
  /** Default shipping zone will be used for countries not covered by other zones. */
  default?: InputMaybe<Scalars['Boolean']>;
  /** List of warehouses to assign to a shipping zone */
  addWarehouses?: InputMaybe<Array<Scalars['ID']>>;
  /** List of channels to assign to the shipping zone. */
  addChannels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of warehouses to unassign from a shipping zone */
  removeWarehouses?: InputMaybe<Array<Scalars['ID']>>;
  /** List of channels to unassign from the shipping zone. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum ShopErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CANNOT_FETCH_TAX_RATES = 'CANNOT_FETCH_TAX_RATES',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

export type ShopSettingsInput = {
  /** Header text. */
  headerText?: InputMaybe<Scalars['String']>;
  /** SEO description. */
  description?: InputMaybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices?: InputMaybe<Scalars['Boolean']>;
  /** Display prices with tax in store. */
  displayGrossPrices?: InputMaybe<Scalars['Boolean']>;
  /** Charge taxes on shipping. */
  chargeTaxesOnShipping?: InputMaybe<Scalars['Boolean']>;
  /** Enable inventory tracking. */
  trackInventoryByDefault?: InputMaybe<Scalars['Boolean']>;
  /** Default weight unit. */
  defaultWeightUnit?: InputMaybe<WeightUnitsEnum>;
  /** Enable automatic fulfillment for all digital products. */
  automaticFulfillmentDigitalProducts?: InputMaybe<Scalars['Boolean']>;
  /**
   * Enable automatic approval of all new fulfillments.
   *
   * Added in Saleor 3.1.
   */
  fulfillmentAutoApprove?: InputMaybe<Scalars['Boolean']>;
  /**
   * Enable ability to approve fulfillments which are unpaid.
   *
   * Added in Saleor 3.1.
   */
  fulfillmentAllowUnpaid?: InputMaybe<Scalars['Boolean']>;
  /** Default number of max downloads per digital content URL. */
  defaultDigitalMaxDownloads?: InputMaybe<Scalars['Int']>;
  /** Default number of days which digital content URL will be valid. */
  defaultDigitalUrlValidDays?: InputMaybe<Scalars['Int']>;
  /** Default email sender's name. */
  defaultMailSenderName?: InputMaybe<Scalars['String']>;
  /** Default email sender's address. */
  defaultMailSenderAddress?: InputMaybe<Scalars['String']>;
  /** URL of a view where customers can set their password. */
  customerSetPasswordUrl?: InputMaybe<Scalars['String']>;
  /**
   * Default number of minutes stock will be reserved for anonymous checkout. Enter 0 or null to disable.
   *
   * Added in Saleor 3.1.
   */
  reserveStockDurationAnonymousUser?: InputMaybe<Scalars['Int']>;
  /**
   * Default number of minutes stock will be reserved for authenticated checkout. Enter 0 or null to disable.
   *
   * Added in Saleor 3.1.
   */
  reserveStockDurationAuthenticatedUser?: InputMaybe<Scalars['Int']>;
  /**
   * Default number of maximum line quantity in single checkout. Minimum possible value is 1, default value is 50.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  limitQuantityPerCheckout?: InputMaybe<Scalars['Int']>;
};

export type ShopSettingsTranslationInput = {
  headerText?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
};

export type SiteDomainInput = {
  /** Domain name for shop. */
  domain?: InputMaybe<Scalars['String']>;
  /** Shop site name. */
  name?: InputMaybe<Scalars['String']>;
};

export type StaffCreateInput = {
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** List of permission group IDs to which user should be assigned. */
  addGroups?: InputMaybe<Array<Scalars['ID']>>;
  /** URL of a view where users should be redirected to set the password. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export enum StaffMemberStatus {
  /** User account has been activated. */
  ACTIVE = 'ACTIVE',
  /** User account has not been activated yet. */
  DEACTIVATED = 'DEACTIVATED'
}

export type StaffNotificationRecipientInput = {
  /** The ID of the user subscribed to email notifications.. */
  user?: InputMaybe<Scalars['ID']>;
  /** Email address of a user subscribed to email notifications. */
  email?: InputMaybe<Scalars['String']>;
  /** Determines if a notification active. */
  active?: InputMaybe<Scalars['Boolean']>;
};

export type StaffUpdateInput = {
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** List of permission group IDs to which user should be assigned. */
  addGroups?: InputMaybe<Array<Scalars['ID']>>;
  /** List of permission group IDs from which user should be unassigned. */
  removeGroups?: InputMaybe<Array<Scalars['ID']>>;
};

export type StaffUserInput = {
  status?: InputMaybe<StaffMemberStatus>;
  search?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export enum StockAvailability {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

/** An enumeration. */
export enum StockErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

export type StockFilterInput = {
  quantity?: InputMaybe<Scalars['Float']>;
  search?: InputMaybe<Scalars['String']>;
};

export type StockInput = {
  /** Warehouse in which stock is located. */
  warehouse: Scalars['ID'];
  /** Quantity of items available for sell. */
  quantity: Scalars['Int'];
};

export type StockSettingsInput = {
  /** Allocation strategy options. Strategy defines the preference of warehouses for allocations and reservations. */
  allocationStrategy: AllocationStrategyEnum;
};

/** Enum representing the type of a payment storage in a gateway. */
export enum StorePaymentMethodEnum {
  /** On session storage type. The payment is stored only to be reused when the customer is present in the checkout flow. */
  ON_SESSION = 'ON_SESSION',
  /** Off session storage type. The payment is stored to be reused even if the customer is absent. */
  OFF_SESSION = 'OFF_SESSION',
  /** Storage is disabled. The payment is not stored. */
  NONE = 'NONE'
}

/** An enumeration. */
export enum ThumbnailFormatEnum {
  WEBP = 'WEBP'
}

export type TimePeriodInputType = {
  /** The length of the period. */
  amount: Scalars['Int'];
  /** The type of the period. */
  type: TimePeriodTypeEnum;
};

/** An enumeration. */
export enum TimePeriodTypeEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

/**
 * Represents possible actions on payment transaction.
 *
 *     The following actions are possible:
 *     CHARGE - Represents the charge action.
 *     REFUND - Represents a refund action.
 *     VOID - Represents a void action.
 *
 */
export enum TransactionActionEnum {
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  VOID = 'VOID'
}

/** An enumeration. */
export enum TransactionCreateErrorCode {
  INVALID = 'INVALID',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INCORRECT_CURRENCY = 'INCORRECT_CURRENCY',
  METADATA_KEY_REQUIRED = 'METADATA_KEY_REQUIRED'
}

export type TransactionCreateInput = {
  /** Status of the transaction. */
  status: Scalars['String'];
  /** Payment type used for this transaction. */
  type: Scalars['String'];
  /** Reference of the transaction. */
  reference?: InputMaybe<Scalars['String']>;
  /** List of all possible actions for the transaction */
  availableActions?: InputMaybe<Array<TransactionActionEnum>>;
  /** Amount authorized by this transaction. */
  amountAuthorized?: InputMaybe<MoneyInput>;
  /** Amount charged by this transaction. */
  amountCharged?: InputMaybe<MoneyInput>;
  /** Amount refunded by this transaction. */
  amountRefunded?: InputMaybe<MoneyInput>;
  /** Amount voided by this transaction. */
  amountVoided?: InputMaybe<MoneyInput>;
  /** Payment public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** Payment private metadata. */
  privateMetadata?: InputMaybe<Array<MetadataInput>>;
};

export type TransactionEventInput = {
  /** Current status of the payment transaction. */
  status: TransactionStatus;
  /** Reference of the transaction. */
  reference?: InputMaybe<Scalars['String']>;
  /** Name of the transaction. */
  name?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum TransactionKind {
  EXTERNAL = 'EXTERNAL',
  AUTH = 'AUTH',
  PENDING = 'PENDING',
  ACTION_TO_CONFIRM = 'ACTION_TO_CONFIRM',
  REFUND = 'REFUND',
  REFUND_ONGOING = 'REFUND_ONGOING',
  CAPTURE = 'CAPTURE',
  VOID = 'VOID',
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL'
}

/** An enumeration. */
export enum TransactionRequestActionErrorCode {
  INVALID = 'INVALID',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  MISSING_TRANSACTION_ACTION_REQUEST_WEBHOOK = 'MISSING_TRANSACTION_ACTION_REQUEST_WEBHOOK'
}

/** An enumeration. */
export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

/** An enumeration. */
export enum TransactionUpdateErrorCode {
  INVALID = 'INVALID',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INCORRECT_CURRENCY = 'INCORRECT_CURRENCY',
  METADATA_KEY_REQUIRED = 'METADATA_KEY_REQUIRED'
}

export type TransactionUpdateInput = {
  /** Status of the transaction. */
  status?: InputMaybe<Scalars['String']>;
  /** Payment type used for this transaction. */
  type?: InputMaybe<Scalars['String']>;
  /** Reference of the transaction. */
  reference?: InputMaybe<Scalars['String']>;
  /** List of all possible actions for the transaction */
  availableActions?: InputMaybe<Array<TransactionActionEnum>>;
  /** Amount authorized by this transaction. */
  amountAuthorized?: InputMaybe<MoneyInput>;
  /** Amount charged by this transaction. */
  amountCharged?: InputMaybe<MoneyInput>;
  /** Amount refunded by this transaction. */
  amountRefunded?: InputMaybe<MoneyInput>;
  /** Amount voided by this transaction. */
  amountVoided?: InputMaybe<MoneyInput>;
  /** Payment public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** Payment private metadata. */
  privateMetadata?: InputMaybe<Array<MetadataInput>>;
};

export enum TranslatableKinds {
  ATTRIBUTE = 'ATTRIBUTE',
  ATTRIBUTE_VALUE = 'ATTRIBUTE_VALUE',
  CATEGORY = 'CATEGORY',
  COLLECTION = 'COLLECTION',
  MENU_ITEM = 'MENU_ITEM',
  PAGE = 'PAGE',
  PRODUCT = 'PRODUCT',
  SALE = 'SALE',
  SHIPPING_METHOD = 'SHIPPING_METHOD',
  VARIANT = 'VARIANT',
  VOUCHER = 'VOUCHER'
}

/** An enumeration. */
export enum TranslationErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED'
}

export type TranslationInput = {
  seoTitle?: InputMaybe<Scalars['String']>;
  seoDescription?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  /**
   * Translated description.
   *
   * Rich text format. For reference see https://editorjs.io/
   */
  description?: InputMaybe<Scalars['JSONString']>;
};

export type UpdateInvoiceInput = {
  /** Invoice number */
  number?: InputMaybe<Scalars['String']>;
  /** URL of an invoice to download. */
  url?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum UploadErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR'
}

export type UserCreateInput = {
  /** Billing address of the customer. */
  defaultBillingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: InputMaybe<AddressInput>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** URL of a view where users should be redirected to set the password. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
  /** Slug of a channel which will be used for notify user. Optional when only one channel exists. */
  channel?: InputMaybe<Scalars['String']>;
};

export enum UserSortField {
  /** Sort users by first name. */
  FIRST_NAME = 'FIRST_NAME',
  /** Sort users by last name. */
  LAST_NAME = 'LAST_NAME',
  /** Sort users by email. */
  EMAIL = 'EMAIL',
  /** Sort users by order count. */
  ORDER_COUNT = 'ORDER_COUNT',
  /** Sort users by created at. */
  CREATED_AT = 'CREATED_AT',
  /** Sort users by last modified at. */
  LAST_MODIFIED_AT = 'LAST_MODIFIED_AT'
}

export type UserSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort users by the selected field. */
  field: UserSortField;
};

export enum VariantAttributeScope {
  ALL = 'ALL',
  VARIANT_SELECTION = 'VARIANT_SELECTION',
  NOT_VARIANT_SELECTION = 'NOT_VARIANT_SELECTION'
}

/** An enumeration. */
export enum VolumeUnitsEnum {
  CUBIC_MILLIMETER = 'CUBIC_MILLIMETER',
  CUBIC_CENTIMETER = 'CUBIC_CENTIMETER',
  CUBIC_DECIMETER = 'CUBIC_DECIMETER',
  CUBIC_METER = 'CUBIC_METER',
  LITER = 'LITER',
  CUBIC_FOOT = 'CUBIC_FOOT',
  CUBIC_INCH = 'CUBIC_INCH',
  CUBIC_YARD = 'CUBIC_YARD',
  QT = 'QT',
  PINT = 'PINT',
  FL_OZ = 'FL_OZ',
  ACRE_IN = 'ACRE_IN',
  ACRE_FT = 'ACRE_FT'
}

export type VoucherChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Value of the voucher. */
  discountValue?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Min purchase amount required to apply the voucher. */
  minAmountSpent?: InputMaybe<Scalars['PositiveDecimal']>;
};

export type VoucherChannelListingInput = {
  /** List of channels to which the voucher should be assigned. */
  addChannels?: InputMaybe<Array<VoucherChannelListingAddInput>>;
  /** List of channels from which the voucher should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

export enum VoucherDiscountType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
  SHIPPING = 'SHIPPING'
}

export type VoucherFilterInput = {
  status?: InputMaybe<Array<DiscountStatusEnum>>;
  timesUsed?: InputMaybe<IntRangeInput>;
  discountType?: InputMaybe<Array<VoucherDiscountType>>;
  started?: InputMaybe<DateTimeRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<MetadataFilter>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type VoucherInput = {
  /** Voucher type: PRODUCT, CATEGORY SHIPPING or ENTIRE_ORDER. */
  type?: InputMaybe<VoucherTypeEnum>;
  /** Voucher name. */
  name?: InputMaybe<Scalars['String']>;
  /** Code to use the voucher. */
  code?: InputMaybe<Scalars['String']>;
  /** Start date of the voucher in ISO 8601 format. */
  startDate?: InputMaybe<Scalars['DateTime']>;
  /** End date of the voucher in ISO 8601 format. */
  endDate?: InputMaybe<Scalars['DateTime']>;
  /** Choices: fixed or percentage. */
  discountValueType?: InputMaybe<DiscountValueTypeEnum>;
  /** Products discounted by the voucher. */
  products?: InputMaybe<Array<Scalars['ID']>>;
  /**
   * Variants discounted by the voucher.
   *
   * Added in Saleor 3.1.
   */
  variants?: InputMaybe<Array<Scalars['ID']>>;
  /** Collections discounted by the voucher. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /** Categories discounted by the voucher. */
  categories?: InputMaybe<Array<Scalars['ID']>>;
  /** Minimal quantity of checkout items required to apply the voucher. */
  minCheckoutItemsQuantity?: InputMaybe<Scalars['Int']>;
  /** Country codes that can be used with the shipping voucher. */
  countries?: InputMaybe<Array<Scalars['String']>>;
  /** Voucher should be applied to the cheapest item or entire order. */
  applyOncePerOrder?: InputMaybe<Scalars['Boolean']>;
  /** Voucher should be applied once per customer. */
  applyOncePerCustomer?: InputMaybe<Scalars['Boolean']>;
  /** Voucher can be used only by staff user. */
  onlyForStaff?: InputMaybe<Scalars['Boolean']>;
  /** Limit number of times this voucher can be used in total. */
  usageLimit?: InputMaybe<Scalars['Int']>;
};

export enum VoucherSortField {
  /** Sort vouchers by code. */
  CODE = 'CODE',
  /** Sort vouchers by start date. */
  START_DATE = 'START_DATE',
  /** Sort vouchers by end date. */
  END_DATE = 'END_DATE',
  /**
   * Sort vouchers by value.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  VALUE = 'VALUE',
  /** Sort vouchers by type. */
  TYPE = 'TYPE',
  /** Sort vouchers by usage limit. */
  USAGE_LIMIT = 'USAGE_LIMIT',
  /**
   * Sort vouchers by minimum spent amount.
   *
   * This option requires a channel filter to work as the values can vary between channels.
   */
  MINIMUM_SPENT_AMOUNT = 'MINIMUM_SPENT_AMOUNT'
}

export type VoucherSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Sort vouchers by the selected field. */
  field: VoucherSortField;
};

export enum VoucherTypeEnum {
  SHIPPING = 'SHIPPING',
  ENTIRE_ORDER = 'ENTIRE_ORDER',
  SPECIFIC_PRODUCT = 'SPECIFIC_PRODUCT'
}

/** An enumeration. */
export enum WarehouseClickAndCollectOptionEnum {
  DISABLED = 'DISABLED',
  LOCAL = 'LOCAL',
  ALL = 'ALL'
}

export type WarehouseCreateInput = {
  /** Warehouse slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** The email address of the warehouse. */
  email?: InputMaybe<Scalars['String']>;
  /** Warehouse name. */
  name: Scalars['String'];
  /** Address of the warehouse. */
  address: AddressInput;
  /**
   * Shipping zones supported by the warehouse.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Providing the zone ids will raise a ValidationError.
   */
  shippingZones?: InputMaybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum WarehouseErrorCode {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

export type WarehouseFilterInput = {
  clickAndCollectOption?: InputMaybe<WarehouseClickAndCollectOptionEnum>;
  search?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  channels?: InputMaybe<Array<Scalars['ID']>>;
};

export enum WarehouseSortField {
  /** Sort warehouses by name. */
  NAME = 'NAME'
}

export type WarehouseSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort warehouses by the selected field. */
  field: WarehouseSortField;
};

export type WarehouseUpdateInput = {
  /** Warehouse slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** The email address of the warehouse. */
  email?: InputMaybe<Scalars['String']>;
  /** Warehouse name. */
  name?: InputMaybe<Scalars['String']>;
  /** Address of the warehouse. */
  address?: InputMaybe<AddressInput>;
  /**
   * Click and collect options: local, all or disabled.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  clickAndCollectOption?: InputMaybe<WarehouseClickAndCollectOptionEnum>;
  /**
   * Visibility of warehouse stocks.
   *
   * Added in Saleor 3.1.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  isPrivate?: InputMaybe<Scalars['Boolean']>;
};

export type WebhookCreateInput = {
  /** The name of the webhook. */
  name?: InputMaybe<Scalars['String']>;
  /** The url to receive the payload. */
  targetUrl?: InputMaybe<Scalars['String']>;
  /**
   * The events that webhook wants to subscribe.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `asyncEvents` or `syncEvents` instead.
   */
  events?: InputMaybe<Array<WebhookEventTypeEnum>>;
  /** The asynchronous events that webhook wants to subscribe. */
  asyncEvents?: InputMaybe<Array<WebhookEventTypeAsyncEnum>>;
  /** The synchronous events that webhook wants to subscribe. */
  syncEvents?: InputMaybe<Array<WebhookEventTypeSyncEnum>>;
  /** ID of the app to which webhook belongs. */
  app?: InputMaybe<Scalars['ID']>;
  /** Determine if webhook will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /**
   * The secret key used to create a hash signature with each payload.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. As of Saleor 3.5, webhook payloads default to signing using a verifiable JWS.
   */
  secretKey?: InputMaybe<Scalars['String']>;
  /**
   * Subscription query used to define a webhook payload.
   *
   * Added in Saleor 3.2.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  query?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum WebhookErrorCode {
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  REQUIRED = 'REQUIRED',
  UNIQUE = 'UNIQUE'
}

/** Enum determining type of webhook. */
export enum WebhookEventTypeAsyncEnum {
  /** All the events. */
  ANY_EVENTS = 'ANY_EVENTS',
  /** A new address created. */
  ADDRESS_CREATED = 'ADDRESS_CREATED',
  /** An address updated. */
  ADDRESS_UPDATED = 'ADDRESS_UPDATED',
  /** An address deleted. */
  ADDRESS_DELETED = 'ADDRESS_DELETED',
  /** A new app installed. */
  APP_INSTALLED = 'APP_INSTALLED',
  /** An app updated. */
  APP_UPDATED = 'APP_UPDATED',
  /** An app deleted. */
  APP_DELETED = 'APP_DELETED',
  /** An app status is changed. */
  APP_STATUS_CHANGED = 'APP_STATUS_CHANGED',
  /** A new attribute is created. */
  ATTRIBUTE_CREATED = 'ATTRIBUTE_CREATED',
  /** An attribute is updated. */
  ATTRIBUTE_UPDATED = 'ATTRIBUTE_UPDATED',
  /** An attribute is deleted. */
  ATTRIBUTE_DELETED = 'ATTRIBUTE_DELETED',
  /** A new attribute value is created. */
  ATTRIBUTE_VALUE_CREATED = 'ATTRIBUTE_VALUE_CREATED',
  /** An attribute value is updated. */
  ATTRIBUTE_VALUE_UPDATED = 'ATTRIBUTE_VALUE_UPDATED',
  /** An attribute value is deleted. */
  ATTRIBUTE_VALUE_DELETED = 'ATTRIBUTE_VALUE_DELETED',
  /** A new category created. */
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  /** A category is updated. */
  CATEGORY_UPDATED = 'CATEGORY_UPDATED',
  /** A category is deleted. */
  CATEGORY_DELETED = 'CATEGORY_DELETED',
  /** A new channel created. */
  CHANNEL_CREATED = 'CHANNEL_CREATED',
  /** A channel is updated. */
  CHANNEL_UPDATED = 'CHANNEL_UPDATED',
  /** A channel is deleted. */
  CHANNEL_DELETED = 'CHANNEL_DELETED',
  /** A channel status is changed. */
  CHANNEL_STATUS_CHANGED = 'CHANNEL_STATUS_CHANGED',
  /** A new gift card created. */
  GIFT_CARD_CREATED = 'GIFT_CARD_CREATED',
  /** A gift card is updated. */
  GIFT_CARD_UPDATED = 'GIFT_CARD_UPDATED',
  /** A gift card is deleted. */
  GIFT_CARD_DELETED = 'GIFT_CARD_DELETED',
  /** A gift card status is changed. */
  GIFT_CARD_STATUS_CHANGED = 'GIFT_CARD_STATUS_CHANGED',
  /** A new menu created. */
  MENU_CREATED = 'MENU_CREATED',
  /** A menu is updated. */
  MENU_UPDATED = 'MENU_UPDATED',
  /** A menu is deleted. */
  MENU_DELETED = 'MENU_DELETED',
  /** A new menu item created. */
  MENU_ITEM_CREATED = 'MENU_ITEM_CREATED',
  /** A menu item is updated. */
  MENU_ITEM_UPDATED = 'MENU_ITEM_UPDATED',
  /** A menu item is deleted. */
  MENU_ITEM_DELETED = 'MENU_ITEM_DELETED',
  /** A new order is placed. */
  ORDER_CREATED = 'ORDER_CREATED',
  /** An order is confirmed (status change unconfirmed -> unfulfilled) by a staff user using the OrderConfirm mutation. It also triggers when the user completes the checkout and the shop setting `automatically_confirm_all_new_orders` is enabled. */
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  /** Payment is made and an order is fully paid. */
  ORDER_FULLY_PAID = 'ORDER_FULLY_PAID',
  /** An order is updated; triggered for all changes related to an order; covers all other order webhooks, except for ORDER_CREATED. */
  ORDER_UPDATED = 'ORDER_UPDATED',
  /** An order is cancelled. */
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  /** An order is fulfilled. */
  ORDER_FULFILLED = 'ORDER_FULFILLED',
  /** A draft order is created. */
  DRAFT_ORDER_CREATED = 'DRAFT_ORDER_CREATED',
  /** A draft order is updated. */
  DRAFT_ORDER_UPDATED = 'DRAFT_ORDER_UPDATED',
  /** A draft order is deleted. */
  DRAFT_ORDER_DELETED = 'DRAFT_ORDER_DELETED',
  /** A sale is created. */
  SALE_CREATED = 'SALE_CREATED',
  /** A sale is updated. */
  SALE_UPDATED = 'SALE_UPDATED',
  /** A sale is deleted. */
  SALE_DELETED = 'SALE_DELETED',
  /** A sale is activated or deactivated. */
  SALE_TOGGLE = 'SALE_TOGGLE',
  /** An invoice for order requested. */
  INVOICE_REQUESTED = 'INVOICE_REQUESTED',
  /** An invoice is deleted. */
  INVOICE_DELETED = 'INVOICE_DELETED',
  /** Invoice has been sent. */
  INVOICE_SENT = 'INVOICE_SENT',
  /** A new customer account is created. */
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  /** A customer account is updated. */
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  /** A customer account is deleted. */
  CUSTOMER_DELETED = 'CUSTOMER_DELETED',
  /** A new collection is created. */
  COLLECTION_CREATED = 'COLLECTION_CREATED',
  /** A collection is updated. */
  COLLECTION_UPDATED = 'COLLECTION_UPDATED',
  /** A collection is deleted. */
  COLLECTION_DELETED = 'COLLECTION_DELETED',
  /** A new product is created. */
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  /** A product is updated. */
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  /** A product is deleted. */
  PRODUCT_DELETED = 'PRODUCT_DELETED',
  /** A new product variant is created. */
  PRODUCT_VARIANT_CREATED = 'PRODUCT_VARIANT_CREATED',
  /** A product variant is updated. */
  PRODUCT_VARIANT_UPDATED = 'PRODUCT_VARIANT_UPDATED',
  /** A product variant is deleted. */
  PRODUCT_VARIANT_DELETED = 'PRODUCT_VARIANT_DELETED',
  /** A product variant is out of stock. */
  PRODUCT_VARIANT_OUT_OF_STOCK = 'PRODUCT_VARIANT_OUT_OF_STOCK',
  /** A product variant is back in stock. */
  PRODUCT_VARIANT_BACK_IN_STOCK = 'PRODUCT_VARIANT_BACK_IN_STOCK',
  /** A new checkout is created. */
  CHECKOUT_CREATED = 'CHECKOUT_CREATED',
  /** A checkout is updated. It also triggers all updates related to the checkout. */
  CHECKOUT_UPDATED = 'CHECKOUT_UPDATED',
  /** A new fulfillment is created. */
  FULFILLMENT_CREATED = 'FULFILLMENT_CREATED',
  /** A fulfillment is cancelled. */
  FULFILLMENT_CANCELED = 'FULFILLMENT_CANCELED',
  /** A fulfillment is approved. */
  FULFILLMENT_APPROVED = 'FULFILLMENT_APPROVED',
  /** User notification triggered. */
  NOTIFY_USER = 'NOTIFY_USER',
  /** A new page is created. */
  PAGE_CREATED = 'PAGE_CREATED',
  /** A page is updated. */
  PAGE_UPDATED = 'PAGE_UPDATED',
  /** A page is deleted. */
  PAGE_DELETED = 'PAGE_DELETED',
  /** A new page type is created. */
  PAGE_TYPE_CREATED = 'PAGE_TYPE_CREATED',
  /** A page type is updated. */
  PAGE_TYPE_UPDATED = 'PAGE_TYPE_UPDATED',
  /** A page type is deleted. */
  PAGE_TYPE_DELETED = 'PAGE_TYPE_DELETED',
  /** A new permission group is created. */
  PERMISSION_GROUP_CREATED = 'PERMISSION_GROUP_CREATED',
  /** A permission group is updated. */
  PERMISSION_GROUP_UPDATED = 'PERMISSION_GROUP_UPDATED',
  /** A permission group is deleted. */
  PERMISSION_GROUP_DELETED = 'PERMISSION_GROUP_DELETED',
  /** A new shipping price is created. */
  SHIPPING_PRICE_CREATED = 'SHIPPING_PRICE_CREATED',
  /** A shipping price is updated. */
  SHIPPING_PRICE_UPDATED = 'SHIPPING_PRICE_UPDATED',
  /** A shipping price is deleted. */
  SHIPPING_PRICE_DELETED = 'SHIPPING_PRICE_DELETED',
  /** A new shipping zone is created. */
  SHIPPING_ZONE_CREATED = 'SHIPPING_ZONE_CREATED',
  /** A shipping zone is updated. */
  SHIPPING_ZONE_UPDATED = 'SHIPPING_ZONE_UPDATED',
  /** A shipping zone is deleted. */
  SHIPPING_ZONE_DELETED = 'SHIPPING_ZONE_DELETED',
  /** A new staff user is created. */
  STAFF_CREATED = 'STAFF_CREATED',
  /** A staff user is updated. */
  STAFF_UPDATED = 'STAFF_UPDATED',
  /** A staff user is deleted. */
  STAFF_DELETED = 'STAFF_DELETED',
  /** An action requested for transaction. */
  TRANSACTION_ACTION_REQUEST = 'TRANSACTION_ACTION_REQUEST',
  /** A new translation is created. */
  TRANSLATION_CREATED = 'TRANSLATION_CREATED',
  /** A translation is updated. */
  TRANSLATION_UPDATED = 'TRANSLATION_UPDATED',
  /** A new warehouse created. */
  WAREHOUSE_CREATED = 'WAREHOUSE_CREATED',
  /** A warehouse is updated. */
  WAREHOUSE_UPDATED = 'WAREHOUSE_UPDATED',
  /** A warehouse is deleted. */
  WAREHOUSE_DELETED = 'WAREHOUSE_DELETED',
  /** A new voucher created. */
  VOUCHER_CREATED = 'VOUCHER_CREATED',
  /** A voucher is updated. */
  VOUCHER_UPDATED = 'VOUCHER_UPDATED',
  /** A voucher is deleted. */
  VOUCHER_DELETED = 'VOUCHER_DELETED',
  /** An observability event is created. */
  OBSERVABILITY = 'OBSERVABILITY'
}

/** Enum determining type of webhook. */
export enum WebhookEventTypeEnum {
  /** All the events. */
  ANY_EVENTS = 'ANY_EVENTS',
  /** A new address created. */
  ADDRESS_CREATED = 'ADDRESS_CREATED',
  /** An address updated. */
  ADDRESS_UPDATED = 'ADDRESS_UPDATED',
  /** An address deleted. */
  ADDRESS_DELETED = 'ADDRESS_DELETED',
  /** A new app installed. */
  APP_INSTALLED = 'APP_INSTALLED',
  /** An app updated. */
  APP_UPDATED = 'APP_UPDATED',
  /** An app deleted. */
  APP_DELETED = 'APP_DELETED',
  /** An app status is changed. */
  APP_STATUS_CHANGED = 'APP_STATUS_CHANGED',
  /** A new attribute is created. */
  ATTRIBUTE_CREATED = 'ATTRIBUTE_CREATED',
  /** An attribute is updated. */
  ATTRIBUTE_UPDATED = 'ATTRIBUTE_UPDATED',
  /** An attribute is deleted. */
  ATTRIBUTE_DELETED = 'ATTRIBUTE_DELETED',
  /** A new attribute value is created. */
  ATTRIBUTE_VALUE_CREATED = 'ATTRIBUTE_VALUE_CREATED',
  /** An attribute value is updated. */
  ATTRIBUTE_VALUE_UPDATED = 'ATTRIBUTE_VALUE_UPDATED',
  /** An attribute value is deleted. */
  ATTRIBUTE_VALUE_DELETED = 'ATTRIBUTE_VALUE_DELETED',
  /** A new category created. */
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  /** A category is updated. */
  CATEGORY_UPDATED = 'CATEGORY_UPDATED',
  /** A category is deleted. */
  CATEGORY_DELETED = 'CATEGORY_DELETED',
  /** A new channel created. */
  CHANNEL_CREATED = 'CHANNEL_CREATED',
  /** A channel is updated. */
  CHANNEL_UPDATED = 'CHANNEL_UPDATED',
  /** A channel is deleted. */
  CHANNEL_DELETED = 'CHANNEL_DELETED',
  /** A channel status is changed. */
  CHANNEL_STATUS_CHANGED = 'CHANNEL_STATUS_CHANGED',
  /** A new gift card created. */
  GIFT_CARD_CREATED = 'GIFT_CARD_CREATED',
  /** A gift card is updated. */
  GIFT_CARD_UPDATED = 'GIFT_CARD_UPDATED',
  /** A gift card is deleted. */
  GIFT_CARD_DELETED = 'GIFT_CARD_DELETED',
  /** A gift card status is changed. */
  GIFT_CARD_STATUS_CHANGED = 'GIFT_CARD_STATUS_CHANGED',
  /** A new menu created. */
  MENU_CREATED = 'MENU_CREATED',
  /** A menu is updated. */
  MENU_UPDATED = 'MENU_UPDATED',
  /** A menu is deleted. */
  MENU_DELETED = 'MENU_DELETED',
  /** A new menu item created. */
  MENU_ITEM_CREATED = 'MENU_ITEM_CREATED',
  /** A menu item is updated. */
  MENU_ITEM_UPDATED = 'MENU_ITEM_UPDATED',
  /** A menu item is deleted. */
  MENU_ITEM_DELETED = 'MENU_ITEM_DELETED',
  /** A new order is placed. */
  ORDER_CREATED = 'ORDER_CREATED',
  /** An order is confirmed (status change unconfirmed -> unfulfilled) by a staff user using the OrderConfirm mutation. It also triggers when the user completes the checkout and the shop setting `automatically_confirm_all_new_orders` is enabled. */
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  /** Payment is made and an order is fully paid. */
  ORDER_FULLY_PAID = 'ORDER_FULLY_PAID',
  /** An order is updated; triggered for all changes related to an order; covers all other order webhooks, except for ORDER_CREATED. */
  ORDER_UPDATED = 'ORDER_UPDATED',
  /** An order is cancelled. */
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  /** An order is fulfilled. */
  ORDER_FULFILLED = 'ORDER_FULFILLED',
  /** A draft order is created. */
  DRAFT_ORDER_CREATED = 'DRAFT_ORDER_CREATED',
  /** A draft order is updated. */
  DRAFT_ORDER_UPDATED = 'DRAFT_ORDER_UPDATED',
  /** A draft order is deleted. */
  DRAFT_ORDER_DELETED = 'DRAFT_ORDER_DELETED',
  /** A sale is created. */
  SALE_CREATED = 'SALE_CREATED',
  /** A sale is updated. */
  SALE_UPDATED = 'SALE_UPDATED',
  /** A sale is deleted. */
  SALE_DELETED = 'SALE_DELETED',
  /** A sale is activated or deactivated. */
  SALE_TOGGLE = 'SALE_TOGGLE',
  /** An invoice for order requested. */
  INVOICE_REQUESTED = 'INVOICE_REQUESTED',
  /** An invoice is deleted. */
  INVOICE_DELETED = 'INVOICE_DELETED',
  /** Invoice has been sent. */
  INVOICE_SENT = 'INVOICE_SENT',
  /** A new customer account is created. */
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  /** A customer account is updated. */
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  /** A customer account is deleted. */
  CUSTOMER_DELETED = 'CUSTOMER_DELETED',
  /** A new collection is created. */
  COLLECTION_CREATED = 'COLLECTION_CREATED',
  /** A collection is updated. */
  COLLECTION_UPDATED = 'COLLECTION_UPDATED',
  /** A collection is deleted. */
  COLLECTION_DELETED = 'COLLECTION_DELETED',
  /** A new product is created. */
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  /** A product is updated. */
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  /** A product is deleted. */
  PRODUCT_DELETED = 'PRODUCT_DELETED',
  /** A new product variant is created. */
  PRODUCT_VARIANT_CREATED = 'PRODUCT_VARIANT_CREATED',
  /** A product variant is updated. */
  PRODUCT_VARIANT_UPDATED = 'PRODUCT_VARIANT_UPDATED',
  /** A product variant is deleted. */
  PRODUCT_VARIANT_DELETED = 'PRODUCT_VARIANT_DELETED',
  /** A product variant is out of stock. */
  PRODUCT_VARIANT_OUT_OF_STOCK = 'PRODUCT_VARIANT_OUT_OF_STOCK',
  /** A product variant is back in stock. */
  PRODUCT_VARIANT_BACK_IN_STOCK = 'PRODUCT_VARIANT_BACK_IN_STOCK',
  /** A new checkout is created. */
  CHECKOUT_CREATED = 'CHECKOUT_CREATED',
  /** A checkout is updated. It also triggers all updates related to the checkout. */
  CHECKOUT_UPDATED = 'CHECKOUT_UPDATED',
  /** A new fulfillment is created. */
  FULFILLMENT_CREATED = 'FULFILLMENT_CREATED',
  /** A fulfillment is cancelled. */
  FULFILLMENT_CANCELED = 'FULFILLMENT_CANCELED',
  /** A fulfillment is approved. */
  FULFILLMENT_APPROVED = 'FULFILLMENT_APPROVED',
  /** User notification triggered. */
  NOTIFY_USER = 'NOTIFY_USER',
  /** A new page is created. */
  PAGE_CREATED = 'PAGE_CREATED',
  /** A page is updated. */
  PAGE_UPDATED = 'PAGE_UPDATED',
  /** A page is deleted. */
  PAGE_DELETED = 'PAGE_DELETED',
  /** A new page type is created. */
  PAGE_TYPE_CREATED = 'PAGE_TYPE_CREATED',
  /** A page type is updated. */
  PAGE_TYPE_UPDATED = 'PAGE_TYPE_UPDATED',
  /** A page type is deleted. */
  PAGE_TYPE_DELETED = 'PAGE_TYPE_DELETED',
  /** A new permission group is created. */
  PERMISSION_GROUP_CREATED = 'PERMISSION_GROUP_CREATED',
  /** A permission group is updated. */
  PERMISSION_GROUP_UPDATED = 'PERMISSION_GROUP_UPDATED',
  /** A permission group is deleted. */
  PERMISSION_GROUP_DELETED = 'PERMISSION_GROUP_DELETED',
  /** A new shipping price is created. */
  SHIPPING_PRICE_CREATED = 'SHIPPING_PRICE_CREATED',
  /** A shipping price is updated. */
  SHIPPING_PRICE_UPDATED = 'SHIPPING_PRICE_UPDATED',
  /** A shipping price is deleted. */
  SHIPPING_PRICE_DELETED = 'SHIPPING_PRICE_DELETED',
  /** A new shipping zone is created. */
  SHIPPING_ZONE_CREATED = 'SHIPPING_ZONE_CREATED',
  /** A shipping zone is updated. */
  SHIPPING_ZONE_UPDATED = 'SHIPPING_ZONE_UPDATED',
  /** A shipping zone is deleted. */
  SHIPPING_ZONE_DELETED = 'SHIPPING_ZONE_DELETED',
  /** A new staff user is created. */
  STAFF_CREATED = 'STAFF_CREATED',
  /** A staff user is updated. */
  STAFF_UPDATED = 'STAFF_UPDATED',
  /** A staff user is deleted. */
  STAFF_DELETED = 'STAFF_DELETED',
  /** An action requested for transaction. */
  TRANSACTION_ACTION_REQUEST = 'TRANSACTION_ACTION_REQUEST',
  /** A new translation is created. */
  TRANSLATION_CREATED = 'TRANSLATION_CREATED',
  /** A translation is updated. */
  TRANSLATION_UPDATED = 'TRANSLATION_UPDATED',
  /** A new warehouse created. */
  WAREHOUSE_CREATED = 'WAREHOUSE_CREATED',
  /** A warehouse is updated. */
  WAREHOUSE_UPDATED = 'WAREHOUSE_UPDATED',
  /** A warehouse is deleted. */
  WAREHOUSE_DELETED = 'WAREHOUSE_DELETED',
  /** A new voucher created. */
  VOUCHER_CREATED = 'VOUCHER_CREATED',
  /** A voucher is updated. */
  VOUCHER_UPDATED = 'VOUCHER_UPDATED',
  /** A voucher is deleted. */
  VOUCHER_DELETED = 'VOUCHER_DELETED',
  /** An observability event is created. */
  OBSERVABILITY = 'OBSERVABILITY',
  /** Authorize payment. */
  PAYMENT_AUTHORIZE = 'PAYMENT_AUTHORIZE',
  /** Capture payment. */
  PAYMENT_CAPTURE = 'PAYMENT_CAPTURE',
  /** Confirm payment. */
  PAYMENT_CONFIRM = 'PAYMENT_CONFIRM',
  /** Listing available payment gateways. */
  PAYMENT_LIST_GATEWAYS = 'PAYMENT_LIST_GATEWAYS',
  /** Process payment. */
  PAYMENT_PROCESS = 'PAYMENT_PROCESS',
  /** Refund payment. */
  PAYMENT_REFUND = 'PAYMENT_REFUND',
  /** Void payment. */
  PAYMENT_VOID = 'PAYMENT_VOID',
  /**
   * Event called for checkout tax calculation.
   *
   * Added in Saleor 3.6.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  CHECKOUT_CALCULATE_TAXES = 'CHECKOUT_CALCULATE_TAXES',
  /**
   * Event called for order tax calculation.
   *
   * Added in Saleor 3.6.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  ORDER_CALCULATE_TAXES = 'ORDER_CALCULATE_TAXES',
  /** Fetch external shipping methods for checkout. */
  SHIPPING_LIST_METHODS_FOR_CHECKOUT = 'SHIPPING_LIST_METHODS_FOR_CHECKOUT',
  /** Filter shipping methods for order. */
  ORDER_FILTER_SHIPPING_METHODS = 'ORDER_FILTER_SHIPPING_METHODS',
  /** Filter shipping methods for checkout. */
  CHECKOUT_FILTER_SHIPPING_METHODS = 'CHECKOUT_FILTER_SHIPPING_METHODS'
}

/** Enum determining type of webhook. */
export enum WebhookEventTypeSyncEnum {
  /** Authorize payment. */
  PAYMENT_AUTHORIZE = 'PAYMENT_AUTHORIZE',
  /** Capture payment. */
  PAYMENT_CAPTURE = 'PAYMENT_CAPTURE',
  /** Confirm payment. */
  PAYMENT_CONFIRM = 'PAYMENT_CONFIRM',
  /** Listing available payment gateways. */
  PAYMENT_LIST_GATEWAYS = 'PAYMENT_LIST_GATEWAYS',
  /** Process payment. */
  PAYMENT_PROCESS = 'PAYMENT_PROCESS',
  /** Refund payment. */
  PAYMENT_REFUND = 'PAYMENT_REFUND',
  /** Void payment. */
  PAYMENT_VOID = 'PAYMENT_VOID',
  /**
   * Event called for checkout tax calculation.
   *
   * Added in Saleor 3.6.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  CHECKOUT_CALCULATE_TAXES = 'CHECKOUT_CALCULATE_TAXES',
  /**
   * Event called for order tax calculation.
   *
   * Added in Saleor 3.6.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  ORDER_CALCULATE_TAXES = 'ORDER_CALCULATE_TAXES',
  /** Fetch external shipping methods for checkout. */
  SHIPPING_LIST_METHODS_FOR_CHECKOUT = 'SHIPPING_LIST_METHODS_FOR_CHECKOUT',
  /** Filter shipping methods for order. */
  ORDER_FILTER_SHIPPING_METHODS = 'ORDER_FILTER_SHIPPING_METHODS',
  /** Filter shipping methods for checkout. */
  CHECKOUT_FILTER_SHIPPING_METHODS = 'CHECKOUT_FILTER_SHIPPING_METHODS'
}

/** An enumeration. */
export enum WebhookSampleEventTypeEnum {
  ADDRESS_CREATED = 'ADDRESS_CREATED',
  ADDRESS_UPDATED = 'ADDRESS_UPDATED',
  ADDRESS_DELETED = 'ADDRESS_DELETED',
  APP_INSTALLED = 'APP_INSTALLED',
  APP_UPDATED = 'APP_UPDATED',
  APP_DELETED = 'APP_DELETED',
  APP_STATUS_CHANGED = 'APP_STATUS_CHANGED',
  ATTRIBUTE_CREATED = 'ATTRIBUTE_CREATED',
  ATTRIBUTE_UPDATED = 'ATTRIBUTE_UPDATED',
  ATTRIBUTE_DELETED = 'ATTRIBUTE_DELETED',
  ATTRIBUTE_VALUE_CREATED = 'ATTRIBUTE_VALUE_CREATED',
  ATTRIBUTE_VALUE_UPDATED = 'ATTRIBUTE_VALUE_UPDATED',
  ATTRIBUTE_VALUE_DELETED = 'ATTRIBUTE_VALUE_DELETED',
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  CATEGORY_UPDATED = 'CATEGORY_UPDATED',
  CATEGORY_DELETED = 'CATEGORY_DELETED',
  CHANNEL_CREATED = 'CHANNEL_CREATED',
  CHANNEL_UPDATED = 'CHANNEL_UPDATED',
  CHANNEL_DELETED = 'CHANNEL_DELETED',
  CHANNEL_STATUS_CHANGED = 'CHANNEL_STATUS_CHANGED',
  GIFT_CARD_CREATED = 'GIFT_CARD_CREATED',
  GIFT_CARD_UPDATED = 'GIFT_CARD_UPDATED',
  GIFT_CARD_DELETED = 'GIFT_CARD_DELETED',
  GIFT_CARD_STATUS_CHANGED = 'GIFT_CARD_STATUS_CHANGED',
  MENU_CREATED = 'MENU_CREATED',
  MENU_UPDATED = 'MENU_UPDATED',
  MENU_DELETED = 'MENU_DELETED',
  MENU_ITEM_CREATED = 'MENU_ITEM_CREATED',
  MENU_ITEM_UPDATED = 'MENU_ITEM_UPDATED',
  MENU_ITEM_DELETED = 'MENU_ITEM_DELETED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_FULLY_PAID = 'ORDER_FULLY_PAID',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_FULFILLED = 'ORDER_FULFILLED',
  DRAFT_ORDER_CREATED = 'DRAFT_ORDER_CREATED',
  DRAFT_ORDER_UPDATED = 'DRAFT_ORDER_UPDATED',
  DRAFT_ORDER_DELETED = 'DRAFT_ORDER_DELETED',
  SALE_CREATED = 'SALE_CREATED',
  SALE_UPDATED = 'SALE_UPDATED',
  SALE_DELETED = 'SALE_DELETED',
  SALE_TOGGLE = 'SALE_TOGGLE',
  INVOICE_REQUESTED = 'INVOICE_REQUESTED',
  INVOICE_DELETED = 'INVOICE_DELETED',
  INVOICE_SENT = 'INVOICE_SENT',
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  CUSTOMER_DELETED = 'CUSTOMER_DELETED',
  COLLECTION_CREATED = 'COLLECTION_CREATED',
  COLLECTION_UPDATED = 'COLLECTION_UPDATED',
  COLLECTION_DELETED = 'COLLECTION_DELETED',
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  PRODUCT_DELETED = 'PRODUCT_DELETED',
  PRODUCT_VARIANT_CREATED = 'PRODUCT_VARIANT_CREATED',
  PRODUCT_VARIANT_UPDATED = 'PRODUCT_VARIANT_UPDATED',
  PRODUCT_VARIANT_DELETED = 'PRODUCT_VARIANT_DELETED',
  PRODUCT_VARIANT_OUT_OF_STOCK = 'PRODUCT_VARIANT_OUT_OF_STOCK',
  PRODUCT_VARIANT_BACK_IN_STOCK = 'PRODUCT_VARIANT_BACK_IN_STOCK',
  CHECKOUT_CREATED = 'CHECKOUT_CREATED',
  CHECKOUT_UPDATED = 'CHECKOUT_UPDATED',
  FULFILLMENT_CREATED = 'FULFILLMENT_CREATED',
  FULFILLMENT_CANCELED = 'FULFILLMENT_CANCELED',
  FULFILLMENT_APPROVED = 'FULFILLMENT_APPROVED',
  NOTIFY_USER = 'NOTIFY_USER',
  PAGE_CREATED = 'PAGE_CREATED',
  PAGE_UPDATED = 'PAGE_UPDATED',
  PAGE_DELETED = 'PAGE_DELETED',
  PAGE_TYPE_CREATED = 'PAGE_TYPE_CREATED',
  PAGE_TYPE_UPDATED = 'PAGE_TYPE_UPDATED',
  PAGE_TYPE_DELETED = 'PAGE_TYPE_DELETED',
  PERMISSION_GROUP_CREATED = 'PERMISSION_GROUP_CREATED',
  PERMISSION_GROUP_UPDATED = 'PERMISSION_GROUP_UPDATED',
  PERMISSION_GROUP_DELETED = 'PERMISSION_GROUP_DELETED',
  SHIPPING_PRICE_CREATED = 'SHIPPING_PRICE_CREATED',
  SHIPPING_PRICE_UPDATED = 'SHIPPING_PRICE_UPDATED',
  SHIPPING_PRICE_DELETED = 'SHIPPING_PRICE_DELETED',
  SHIPPING_ZONE_CREATED = 'SHIPPING_ZONE_CREATED',
  SHIPPING_ZONE_UPDATED = 'SHIPPING_ZONE_UPDATED',
  SHIPPING_ZONE_DELETED = 'SHIPPING_ZONE_DELETED',
  STAFF_CREATED = 'STAFF_CREATED',
  STAFF_UPDATED = 'STAFF_UPDATED',
  STAFF_DELETED = 'STAFF_DELETED',
  TRANSACTION_ACTION_REQUEST = 'TRANSACTION_ACTION_REQUEST',
  TRANSLATION_CREATED = 'TRANSLATION_CREATED',
  TRANSLATION_UPDATED = 'TRANSLATION_UPDATED',
  WAREHOUSE_CREATED = 'WAREHOUSE_CREATED',
  WAREHOUSE_UPDATED = 'WAREHOUSE_UPDATED',
  WAREHOUSE_DELETED = 'WAREHOUSE_DELETED',
  VOUCHER_CREATED = 'VOUCHER_CREATED',
  VOUCHER_UPDATED = 'VOUCHER_UPDATED',
  VOUCHER_DELETED = 'VOUCHER_DELETED',
  OBSERVABILITY = 'OBSERVABILITY'
}

export type WebhookUpdateInput = {
  /** The new name of the webhook. */
  name?: InputMaybe<Scalars['String']>;
  /** The url to receive the payload. */
  targetUrl?: InputMaybe<Scalars['String']>;
  /**
   * The events that webhook wants to subscribe.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `asyncEvents` or `syncEvents` instead.
   */
  events?: InputMaybe<Array<WebhookEventTypeEnum>>;
  /** The asynchronous events that webhook wants to subscribe. */
  asyncEvents?: InputMaybe<Array<WebhookEventTypeAsyncEnum>>;
  /** The synchronous events that webhook wants to subscribe. */
  syncEvents?: InputMaybe<Array<WebhookEventTypeSyncEnum>>;
  /** ID of the app to which webhook belongs. */
  app?: InputMaybe<Scalars['ID']>;
  /** Determine if webhook will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /**
   * Use to create a hash signature with each payload.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. As of Saleor 3.5, webhook payloads default to signing using a verifiable JWS.
   */
  secretKey?: InputMaybe<Scalars['String']>;
  /**
   * Subscription query used to define a webhook payload.
   *
   * Added in Saleor 3.2.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  query?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum WeightUnitsEnum {
  G = 'G',
  LB = 'LB',
  OZ = 'OZ',
  KG = 'KG',
  TONNE = 'TONNE'
}

export type AppCreateMutationVariables = Exact<{
  input: AppInput;
}>;


export type AppCreateMutation = { __typename: 'Mutation', appCreate: { __typename: 'AppCreate', authToken: string | null, app: { __typename: 'App', id: string, name: string | null, created: any | null, isActive: boolean | null, type: AppTypeEnum | null, homepageUrl: string | null, appUrl: string | null, manifestUrl: string | null, configurationUrl: string | null, supportUrl: string | null, version: string | null, accessToken: string | null, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, tokens: Array<{ __typename: 'AppToken', authToken: string | null, id: string, name: string | null }> | null, webhooks: Array<{ __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } }> | null } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppDeleteMutation = { __typename: 'Mutation', appDelete: { __typename: 'AppDelete', app: { __typename: 'App', id: string, name: string | null, created: any | null, isActive: boolean | null, type: AppTypeEnum | null, homepageUrl: string | null, appUrl: string | null, manifestUrl: string | null, configurationUrl: string | null, supportUrl: string | null, version: string | null, accessToken: string | null, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, tokens: Array<{ __typename: 'AppToken', authToken: string | null, id: string, name: string | null }> | null, webhooks: Array<{ __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } }> | null } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppDeleteFailedInstallationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppDeleteFailedInstallationMutation = { __typename: 'Mutation', appDeleteFailedInstallation: { __typename: 'AppDeleteFailedInstallation', appInstallation: { __typename: 'AppInstallation', id: string, status: JobStatusEnum, appName: string, message: string | null } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppFetchMutationVariables = Exact<{
  manifestUrl: Scalars['String'];
}>;


export type AppFetchMutation = { __typename: 'Mutation', appFetchManifest: { __typename: 'AppFetchManifest', manifest: { __typename: 'Manifest', identifier: string, version: string, about: string | null, name: string, appUrl: string | null, configurationUrl: string | null, tokenTargetUrl: string | null, dataPrivacy: string | null, dataPrivacyUrl: string | null, homepageUrl: string | null, supportUrl: string | null, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppInstallMutationVariables = Exact<{
  input: AppInstallInput;
}>;


export type AppInstallMutation = { __typename: 'Mutation', appInstall: { __typename: 'AppInstall', appInstallation: { __typename: 'AppInstallation', id: string, status: JobStatusEnum, appName: string, manifestUrl: string } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppRetryInstallMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppRetryInstallMutation = { __typename: 'Mutation', appRetryInstall: { __typename: 'AppRetryInstall', appInstallation: { __typename: 'AppInstallation', id: string, status: JobStatusEnum, appName: string, manifestUrl: string } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AppInput;
}>;


export type AppUpdateMutation = { __typename: 'Mutation', appUpdate: { __typename: 'AppUpdate', app: { __typename: 'App', id: string, name: string | null, created: any | null, isActive: boolean | null, type: AppTypeEnum | null, homepageUrl: string | null, appUrl: string | null, manifestUrl: string | null, configurationUrl: string | null, supportUrl: string | null, version: string | null, accessToken: string | null, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, tokens: Array<{ __typename: 'AppToken', authToken: string | null, id: string, name: string | null }> | null, webhooks: Array<{ __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } }> | null } | null, errors: Array<{ __typename: 'AppError', message: string | null, permissions: Array<PermissionEnum> | null, field: string | null, code: AppErrorCode }> } | null };

export type AppTokenCreateMutationVariables = Exact<{
  input: AppTokenInput;
}>;


export type AppTokenCreateMutation = { __typename: 'Mutation', appTokenCreate: { __typename: 'AppTokenCreate', authToken: string | null, appToken: { __typename: 'AppToken', name: string | null, authToken: string | null, id: string } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppTokenDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppTokenDeleteMutation = { __typename: 'Mutation', appTokenDelete: { __typename: 'AppTokenDelete', appToken: { __typename: 'AppToken', name: string | null, authToken: string | null, id: string } | null, errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppActivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppActivateMutation = { __typename: 'Mutation', appActivate: { __typename: 'AppActivate', errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppDeactivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppDeactivateMutation = { __typename: 'Mutation', appDeactivate: { __typename: 'AppDeactivate', errors: Array<{ __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null }> } | null };

export type AppsListQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<AppSortingInput>;
  filter?: InputMaybe<AppFilterInput>;
}>;


export type AppsListQuery = { __typename: 'Query', apps: { __typename: 'AppCountableConnection', totalCount: number | null, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null }, edges: Array<{ __typename: 'AppCountableEdge', node: { __typename: 'App', id: string, name: string | null, isActive: boolean | null, type: AppTypeEnum | null, appUrl: string | null, manifestUrl: string | null, permissions: Array<{ __typename: 'Permission', name: string, code: PermissionEnum }> | null } }> } | null };

export type AppsInstallationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AppsInstallationsQuery = { __typename: 'Query', appsInstallations: Array<{ __typename: 'AppInstallation', status: JobStatusEnum, message: string | null, appName: string, manifestUrl: string, id: string }> };

export type AppQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AppQuery = { __typename: 'Query', app: { __typename: 'App', aboutApp: string | null, dataPrivacy: string | null, dataPrivacyUrl: string | null, id: string, name: string | null, created: any | null, isActive: boolean | null, type: AppTypeEnum | null, homepageUrl: string | null, appUrl: string | null, manifestUrl: string | null, configurationUrl: string | null, supportUrl: string | null, version: string | null, accessToken: string | null, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, tokens: Array<{ __typename: 'AppToken', authToken: string | null, id: string, name: string | null }> | null, webhooks: Array<{ __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } }> | null } | null };

export type ExtensionListQueryVariables = Exact<{
  filter: AppExtensionFilterInput;
}>;


export type ExtensionListQuery = { __typename: 'Query', appExtensions: { __typename: 'AppExtensionCountableConnection', edges: Array<{ __typename: 'AppExtensionCountableEdge', node: { __typename: 'AppExtension', id: string, label: string, url: string, mount: AppExtensionMountEnum, target: AppExtensionTargetEnum, accessToken: string | null, permissions: Array<{ __typename: 'Permission', code: PermissionEnum }>, app: { __typename: 'App', id: string, appUrl: string | null } } }> } | null };

export type AttributeBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type AttributeBulkDeleteMutation = { __typename: 'Mutation', attributeBulkDelete: { __typename: 'AttributeBulkDelete', errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AttributeDeleteMutation = { __typename: 'Mutation', attributeDelete: { __typename: 'AttributeDelete', errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AttributeUpdateInput;
}>;


export type AttributeUpdateMutation = { __typename: 'Mutation', attributeUpdate: { __typename: 'AttributeUpdate', attribute: { __typename: 'Attribute', availableInGrid: boolean, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, unit: MeasurementUnitsEnum | null, storefrontSearchPosition: number, valueRequired: boolean, id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeValueDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type AttributeValueDeleteMutation = { __typename: 'Mutation', attributeValueDelete: { __typename: 'AttributeValueDelete', attribute: { __typename: 'Attribute', id: string, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null } | null, errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeValueUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AttributeValueUpdateInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type AttributeValueUpdateMutation = { __typename: 'Mutation', attributeValueUpdate: { __typename: 'AttributeValueUpdate', attribute: { __typename: 'Attribute', id: string, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null } | null, errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeValueCreateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AttributeValueCreateInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type AttributeValueCreateMutation = { __typename: 'Mutation', attributeValueCreate: { __typename: 'AttributeValueCreate', attribute: { __typename: 'Attribute', id: string, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null } | null, errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeCreateMutationVariables = Exact<{
  input: AttributeCreateInput;
}>;


export type AttributeCreateMutation = { __typename: 'Mutation', attributeCreate: { __typename: 'AttributeCreate', attribute: { __typename: 'Attribute', id: string } | null, errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeValueReorderMutationVariables = Exact<{
  id: Scalars['ID'];
  move: ReorderInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type AttributeValueReorderMutation = { __typename: 'Mutation', attributeReorderValues: { __typename: 'AttributeReorderValues', attribute: { __typename: 'Attribute', id: string, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', id: string } }> } | null } | null, errors: Array<{ __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null }> } | null };

export type AttributeDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type AttributeDetailsQuery = { __typename: 'Query', attribute: { __typename: 'Attribute', availableInGrid: boolean, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, unit: MeasurementUnitsEnum | null, storefrontSearchPosition: number, valueRequired: boolean, id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type AttributeListQueryVariables = Exact<{
  filter?: InputMaybe<AttributeFilterInput>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<AttributeSortingInput>;
}>;


export type AttributeListQuery = { __typename: 'Query', attributes: { __typename: 'AttributeCountableConnection', edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
}>;


export type RequestPasswordResetMutation = { __typename: 'Mutation', requestPasswordReset: { __typename: 'RequestPasswordReset', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }> } | null };

export type AvailableExternalAuthenticationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableExternalAuthenticationsQuery = { __typename: 'Query', shop: { __typename: 'Shop', availableExternalAuthentications: Array<{ __typename: 'ExternalAuthentication', id: string, name: string | null }> } };

export type UserDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDetailsQuery = { __typename: 'Query', me: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, name: string }> | null, avatar: { __typename: 'Image', url: string } | null } | null };

export type CategoryDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CategoryDeleteMutation = { __typename: 'Mutation', categoryDelete: { __typename: 'CategoryDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type CategoryCreateMutationVariables = Exact<{
  parent?: InputMaybe<Scalars['ID']>;
  input: CategoryInput;
}>;


export type CategoryCreateMutation = { __typename: 'Mutation', categoryCreate: { __typename: 'CategoryCreate', category: { __typename: 'Category', id: string, name: string, slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, parent: { __typename: 'Category', id: string } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type CategoryUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: CategoryInput;
}>;


export type CategoryUpdateMutation = { __typename: 'Mutation', categoryUpdate: { __typename: 'CategoryUpdate', category: { __typename: 'Category', id: string, name: string, slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, parent: { __typename: 'Category', id: string } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type CategoryBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type CategoryBulkDeleteMutation = { __typename: 'Mutation', categoryBulkDelete: { __typename: 'CategoryBulkDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type RootCategoriesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CategoryFilterInput>;
  sort?: InputMaybe<CategorySortingInput>;
}>;


export type RootCategoriesQuery = { __typename: 'Query', categories: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, children: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type CategoryDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type CategoryDetailsQuery = { __typename: 'Query', category: { __typename: 'Category', id: string, name: string, slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, children: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, children: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, products: { __typename: 'ProductCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'ProductCountableEdge', cursor: string, node: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null } }> } | null, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, parent: { __typename: 'Category', id: string } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type ChannelCreateMutationVariables = Exact<{
  input: ChannelCreateInput;
}>;


export type ChannelCreateMutation = { __typename: 'Mutation', channelCreate: { __typename: 'ChannelCreate', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ChannelUpdateInput;
}>;


export type ChannelUpdateMutation = { __typename: 'Mutation', channelUpdate: { __typename: 'ChannelUpdate', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
  input?: InputMaybe<ChannelDeleteInput>;
}>;


export type ChannelDeleteMutation = { __typename: 'Mutation', channelDelete: { __typename: 'ChannelDelete', errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelActivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChannelActivateMutation = { __typename: 'Mutation', channelActivate: { __typename: 'ChannelActivate', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelDeactivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChannelDeactivateMutation = { __typename: 'Mutation', channelDeactivate: { __typename: 'ChannelDeactivate', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelReorderWarehousesMutationVariables = Exact<{
  channelId: Scalars['ID'];
  moves: Array<ReorderInput> | ReorderInput;
}>;


export type ChannelReorderWarehousesMutation = { __typename: 'Mutation', channelReorderWarehouses: { __typename: 'ChannelReorderWarehouses', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type BaseChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type BaseChannelsQuery = { __typename: 'Query', channels: Array<{ __typename: 'Channel', id: string, isActive: boolean, name: string, slug: string, currencyCode: string, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } }> | null };

export type ChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChannelsQuery = { __typename: 'Query', channels: Array<{ __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } }> | null };

export type ChannelQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChannelQuery = { __typename: 'Query', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null };

export type CollectionUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: CollectionInput;
}>;


export type CollectionUpdateMutation = { __typename: 'Mutation', collectionUpdate: { __typename: 'CollectionUpdate', collection: { __typename: 'Collection', slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, id: string, name: string, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, errors: Array<{ __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null }> } | null };

export type CollectionAssignProductMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  productIds: Array<Scalars['ID']> | Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type CollectionAssignProductMutation = { __typename: 'Mutation', collectionAddProducts: { __typename: 'CollectionAddProducts', collection: { __typename: 'Collection', id: string, products: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null } | null, errors: Array<{ __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null }> } | null };

export type CreateCollectionMutationVariables = Exact<{
  input: CollectionCreateInput;
}>;


export type CreateCollectionMutation = { __typename: 'Mutation', collectionCreate: { __typename: 'CollectionCreate', collection: { __typename: 'Collection', slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, id: string, name: string, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, errors: Array<{ __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null }> } | null };

export type RemoveCollectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveCollectionMutation = { __typename: 'Mutation', collectionDelete: { __typename: 'CollectionDelete', errors: Array<{ __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null }> } | null };

export type UnassignCollectionProductMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  productIds: Array<Scalars['ID']> | Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type UnassignCollectionProductMutation = { __typename: 'Mutation', collectionRemoveProducts: { __typename: 'CollectionRemoveProducts', collection: { __typename: 'Collection', id: string, products: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null } | null, errors: Array<{ __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null }> } | null };

export type CollectionBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type CollectionBulkDeleteMutation = { __typename: 'Mutation', collectionBulkDelete: { __typename: 'CollectionBulkDelete', errors: Array<{ __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null }> } | null };

export type CollectionChannelListingUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: CollectionChannelListingUpdateInput;
}>;


export type CollectionChannelListingUpdateMutation = { __typename: 'Mutation', collectionChannelListingUpdate: { __typename: 'CollectionChannelListingUpdate', errors: Array<{ __typename: 'CollectionChannelListingError', code: ProductErrorCode, field: string | null, message: string | null, channels: Array<string> | null }> } | null };

export type CollectionListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CollectionFilterInput>;
  sort?: InputMaybe<CollectionSortingInput>;
  channel?: InputMaybe<Scalars['String']>;
}>;


export type CollectionListQuery = { __typename: 'Query', collections: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type CollectionDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type CollectionDetailsQuery = { __typename: 'Query', collection: { __typename: 'Collection', slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, id: string, name: string, products: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type CheckIfOrderExistsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CheckIfOrderExistsQuery = { __typename: 'Query', order: { __typename: 'Order', id: string, status: OrderStatus } | null };

export type SearchCatalogQueryVariables = Exact<{
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchCatalogQuery = { __typename: 'Query', categories: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string } }> } | null, collections: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null } }> } | null, products: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, category: { __typename: 'Category', id: string, name: string } | null } }> } | null };

export type ShopInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type ShopInfoQuery = { __typename: 'Query', shop: { __typename: 'Shop', defaultWeightUnit: WeightUnitsEnum | null, displayGrossPrices: boolean, includeTaxesInPrices: boolean, name: string, trackInventoryByDefault: boolean | null, version: string, countries: Array<{ __typename: 'CountryDisplay', country: string, code: string }>, defaultCountry: { __typename: 'CountryDisplay', country: string, code: string } | null, domain: { __typename: 'Domain', host: string, url: string }, languages: Array<{ __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string }>, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> } };

export type ShopCountriesQueryVariables = Exact<{
  filter?: InputMaybe<CountryFilterInput>;
}>;


export type ShopCountriesQuery = { __typename: 'Query', shop: { __typename: 'Shop', countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> } };

export type RefreshLimitsQueryVariables = Exact<{
  channels: Scalars['Boolean'];
  orders: Scalars['Boolean'];
  productVariants: Scalars['Boolean'];
  staffUsers: Scalars['Boolean'];
  warehouses: Scalars['Boolean'];
}>;


export type RefreshLimitsQuery = { __typename: 'Query', shop: { __typename: 'Shop', limits: { __typename: 'LimitInfo', currentUsage: { __typename: 'Limits', channels?: number | null, orders?: number | null, productVariants?: number | null, staffUsers?: number | null, warehouses?: number | null }, allowedUsage: { __typename: 'Limits', channels?: number | null, orders?: number | null, productVariants?: number | null, staffUsers?: number | null, warehouses?: number | null } } } };

export type CheckExportFileStatusQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CheckExportFileStatusQuery = { __typename: 'Query', exportFile: { __typename: 'ExportFile', id: string, status: JobStatusEnum } | null };

export type CheckOrderInvoicesStatusQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CheckOrderInvoicesStatusQuery = { __typename: 'Query', order: { __typename: 'Order', id: string, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }> } | null };

export type UpdateCustomerMutationVariables = Exact<{
  id: Scalars['ID'];
  input: CustomerInput;
}>;


export type UpdateCustomerMutation = { __typename: 'Mutation', customerUpdate: { __typename: 'CustomerUpdate', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, user: { __typename: 'User', dateJoined: any, lastLogin: any | null, note: string | null, isActive: boolean, id: string, email: string, firstName: string, lastName: string, defaultShippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, defaultBillingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type CreateCustomerMutationVariables = Exact<{
  input: UserCreateInput;
}>;


export type CreateCustomerMutation = { __typename: 'Mutation', customerCreate: { __typename: 'CustomerCreate', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, user: { __typename: 'User', id: string } | null } | null };

export type RemoveCustomerMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveCustomerMutation = { __typename: 'Mutation', customerDelete: { __typename: 'CustomerDelete', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }> } | null };

export type SetCustomerDefaultAddressMutationVariables = Exact<{
  addressId: Scalars['ID'];
  userId: Scalars['ID'];
  type: AddressTypeEnum;
}>;


export type SetCustomerDefaultAddressMutation = { __typename: 'Mutation', addressSetDefault: { __typename: 'AddressSetDefault', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, addresses: Array<{ __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }>, defaultBillingAddress: { __typename: 'Address', id: string } | null, defaultShippingAddress: { __typename: 'Address', id: string } | null } | null } | null };

export type CreateCustomerAddressMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AddressInput;
}>;


export type CreateCustomerAddressMutation = { __typename: 'Mutation', addressCreate: { __typename: 'AddressCreate', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, addresses: Array<{ __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }>, defaultBillingAddress: { __typename: 'Address', id: string } | null, defaultShippingAddress: { __typename: 'Address', id: string } | null } | null } | null };

export type UpdateCustomerAddressMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AddressInput;
}>;


export type UpdateCustomerAddressMutation = { __typename: 'Mutation', addressUpdate: { __typename: 'AddressUpdate', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null } | null };

export type RemoveCustomerAddressMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveCustomerAddressMutation = { __typename: 'Mutation', addressDelete: { __typename: 'AddressDelete', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, addresses: Array<{ __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }>, defaultBillingAddress: { __typename: 'Address', id: string } | null, defaultShippingAddress: { __typename: 'Address', id: string } | null } | null } | null };

export type BulkRemoveCustomersMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type BulkRemoveCustomersMutation = { __typename: 'Mutation', customerBulkDelete: { __typename: 'CustomerBulkDelete', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }> } | null };

export type ListCustomersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<CustomerFilterInput>;
  sort?: InputMaybe<UserSortingInput>;
  PERMISSION_MANAGE_ORDERS: Scalars['Boolean'];
}>;


export type ListCustomersQuery = { __typename: 'Query', customers: { __typename: 'UserCountableConnection', edges: Array<{ __typename: 'UserCountableEdge', node: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, orders?: { __typename: 'OrderCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type CustomerDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  PERMISSION_MANAGE_ORDERS: Scalars['Boolean'];
}>;


export type CustomerDetailsQuery = { __typename: 'Query', user: { __typename: 'User', dateJoined: any, lastLogin: any | null, note: string | null, isActive: boolean, id: string, email: string, firstName: string, lastName: string, orders?: { __typename: 'OrderCountableConnection', edges: Array<{ __typename: 'OrderCountableEdge', node: { __typename: 'Order', id: string, created: any, number: string, paymentStatus: PaymentChargeStatusEnum, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', currency: string, amount: number } } } }> } | null, lastPlacedOrder: { __typename: 'OrderCountableConnection', edges: Array<{ __typename: 'OrderCountableEdge', node: { __typename: 'Order', id: string, created: any } }> } | null, defaultShippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, defaultBillingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type CustomerAddressesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CustomerAddressesQuery = { __typename: 'Query', user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, addresses: Array<{ __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }>, defaultBillingAddress: { __typename: 'Address', id: string } | null, defaultShippingAddress: { __typename: 'Address', id: string } | null } | null };

export type CustomerCreateDataQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomerCreateDataQuery = { __typename: 'Query', shop: { __typename: 'Shop', countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> } };

export type SaleUpdateMutationVariables = Exact<{
  input: SaleInput;
  id: Scalars['ID'];
  channelInput: SaleChannelListingInput;
}>;


export type SaleUpdateMutation = { __typename: 'Mutation', saleUpdate: { __typename: 'SaleUpdate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }> } | null, saleChannelListingUpdate: { __typename: 'SaleChannelListingUpdate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, sale: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type SaleCataloguesAddMutationVariables = Exact<{
  input: CatalogueInput;
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  includeVariants: Scalars['Boolean'];
  includeProducts: Scalars['Boolean'];
  includeCollections: Scalars['Boolean'];
  includeCategories: Scalars['Boolean'];
}>;


export type SaleCataloguesAddMutation = { __typename: 'Mutation', saleCataloguesAdd: { __typename: 'SaleAddCatalogues', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, sale: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, variantsCount: { __typename: 'ProductVariantCountableConnection', totalCount: number | null } | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, variants?: { __typename: 'ProductVariantCountableConnection', edges: Array<{ __typename: 'ProductVariantCountableEdge', node: { __typename: 'ProductVariant', id: string, name: string, product: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, productType: { __typename: 'ProductType', id: string, name: string }, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type SaleCataloguesRemoveMutationVariables = Exact<{
  input: CatalogueInput;
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  includeVariants: Scalars['Boolean'];
  includeProducts: Scalars['Boolean'];
  includeCollections: Scalars['Boolean'];
  includeCategories: Scalars['Boolean'];
}>;


export type SaleCataloguesRemoveMutation = { __typename: 'Mutation', saleCataloguesRemove: { __typename: 'SaleRemoveCatalogues', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, sale: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, variantsCount: { __typename: 'ProductVariantCountableConnection', totalCount: number | null } | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, variants?: { __typename: 'ProductVariantCountableConnection', edges: Array<{ __typename: 'ProductVariantCountableEdge', node: { __typename: 'ProductVariant', id: string, name: string, product: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, productType: { __typename: 'ProductType', id: string, name: string }, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type SaleCreateMutationVariables = Exact<{
  input: SaleInput;
}>;


export type SaleCreateMutation = { __typename: 'Mutation', saleCreate: { __typename: 'SaleCreate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, sale: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type SaleDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SaleDeleteMutation = { __typename: 'Mutation', saleDelete: { __typename: 'SaleDelete', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }> } | null };

export type SaleBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type SaleBulkDeleteMutation = { __typename: 'Mutation', saleBulkDelete: { __typename: 'SaleBulkDelete', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, message: string | null }> } | null };

export type SaleChannelListingUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: SaleChannelListingInput;
}>;


export type SaleChannelListingUpdateMutation = { __typename: 'Mutation', saleChannelListingUpdate: { __typename: 'SaleChannelListingUpdate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, sale: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VoucherChannelListingUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: VoucherChannelListingInput;
}>;


export type VoucherChannelListingUpdateMutation = { __typename: 'Mutation', voucherChannelListingUpdate: { __typename: 'VoucherChannelListingUpdate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, voucher: { __typename: 'Voucher', id: string, code: string, startDate: any, endDate: any | null, usageLimit: number | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VoucherUpdateMutationVariables = Exact<{
  input: VoucherInput;
  id: Scalars['ID'];
}>;


export type VoucherUpdateMutation = { __typename: 'Mutation', voucherUpdate: { __typename: 'VoucherUpdate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, voucher: { __typename: 'Voucher', id: string, code: string, startDate: any, endDate: any | null, usageLimit: number | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VoucherCataloguesAddMutationVariables = Exact<{
  input: CatalogueInput;
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  includeProducts: Scalars['Boolean'];
  includeCollections: Scalars['Boolean'];
  includeCategories: Scalars['Boolean'];
}>;


export type VoucherCataloguesAddMutation = { __typename: 'Mutation', voucherCataloguesAdd: { __typename: 'VoucherAddCatalogues', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, voucher: { __typename: 'Voucher', code: string, usageLimit: number | null, used: number, applyOncePerOrder: boolean, applyOncePerCustomer: boolean, onlyForStaff: boolean, id: string, startDate: any, endDate: any | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VoucherCataloguesRemoveMutationVariables = Exact<{
  input: CatalogueInput;
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  includeProducts: Scalars['Boolean'];
  includeCollections: Scalars['Boolean'];
  includeCategories: Scalars['Boolean'];
}>;


export type VoucherCataloguesRemoveMutation = { __typename: 'Mutation', voucherCataloguesRemove: { __typename: 'VoucherRemoveCatalogues', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, voucher: { __typename: 'Voucher', code: string, usageLimit: number | null, used: number, applyOncePerOrder: boolean, applyOncePerCustomer: boolean, onlyForStaff: boolean, id: string, startDate: any, endDate: any | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VoucherCreateMutationVariables = Exact<{
  input: VoucherInput;
}>;


export type VoucherCreateMutation = { __typename: 'Mutation', voucherCreate: { __typename: 'VoucherCreate', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }>, voucher: { __typename: 'Voucher', id: string, code: string, startDate: any, endDate: any | null, usageLimit: number | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VoucherDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VoucherDeleteMutation = { __typename: 'Mutation', voucherDelete: { __typename: 'VoucherDelete', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null }> } | null };

export type VoucherBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type VoucherBulkDeleteMutation = { __typename: 'Mutation', voucherBulkDelete: { __typename: 'VoucherBulkDelete', errors: Array<{ __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, message: string | null }> } | null };

export type SaleListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<SaleFilterInput>;
  sort?: InputMaybe<SaleSortingInput>;
  channel?: InputMaybe<Scalars['String']>;
}>;


export type SaleListQuery = { __typename: 'Query', sales: { __typename: 'SaleCountableConnection', edges: Array<{ __typename: 'SaleCountableEdge', node: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type VoucherListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<VoucherFilterInput>;
  sort?: InputMaybe<VoucherSortingInput>;
  channel?: InputMaybe<Scalars['String']>;
}>;


export type VoucherListQuery = { __typename: 'Query', vouchers: { __typename: 'VoucherCountableConnection', edges: Array<{ __typename: 'VoucherCountableEdge', node: { __typename: 'Voucher', id: string, code: string, startDate: any, endDate: any | null, usageLimit: number | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SaleDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  includeVariants: Scalars['Boolean'];
  includeProducts: Scalars['Boolean'];
  includeCollections: Scalars['Boolean'];
  includeCategories: Scalars['Boolean'];
}>;


export type SaleDetailsQuery = { __typename: 'Query', sale: { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, variantsCount: { __typename: 'ProductVariantCountableConnection', totalCount: number | null } | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, variants?: { __typename: 'ProductVariantCountableConnection', edges: Array<{ __typename: 'ProductVariantCountableEdge', node: { __typename: 'ProductVariant', id: string, name: string, product: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, productType: { __typename: 'ProductType', id: string, name: string }, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type VoucherDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  includeProducts: Scalars['Boolean'];
  includeCollections: Scalars['Boolean'];
  includeCategories: Scalars['Boolean'];
}>;


export type VoucherDetailsQuery = { __typename: 'Query', voucher: { __typename: 'Voucher', code: string, usageLimit: number | null, used: number, applyOncePerOrder: boolean, applyOncePerCustomer: boolean, onlyForStaff: boolean, id: string, startDate: any, endDate: any | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type FileUploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type FileUploadMutation = { __typename: 'Mutation', fileUpload: { __typename: 'FileUpload', uploadedFile: { __typename: 'File', url: string, contentType: string | null } | null, errors: Array<{ __typename: 'UploadError', code: UploadErrorCode, field: string | null, message: string | null }> } | null };

export type AddressFragment = { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } };

export type AppFragment = { __typename: 'App', id: string, name: string | null, created: any | null, isActive: boolean | null, type: AppTypeEnum | null, homepageUrl: string | null, appUrl: string | null, manifestUrl: string | null, configurationUrl: string | null, supportUrl: string | null, version: string | null, accessToken: string | null, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, tokens: Array<{ __typename: 'AppToken', authToken: string | null, id: string, name: string | null }> | null, webhooks: Array<{ __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } }> | null };

export type AppListItemFragment = { __typename: 'App', id: string, name: string | null, isActive: boolean | null, type: AppTypeEnum | null, appUrl: string | null, manifestUrl: string | null, permissions: Array<{ __typename: 'Permission', name: string, code: PermissionEnum }> | null };

export type AppPermissionFragment = { __typename: 'Permission', name: string, code: PermissionEnum };

export type AttributeValueFragment = { __typename: 'AttributeValue', id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null };

export type AttributeValueDetailsFragment = { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null };

export type AttributeFragment = { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null };

export type AttributeDetailsFragment = { __typename: 'Attribute', availableInGrid: boolean, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, unit: MeasurementUnitsEnum | null, storefrontSearchPosition: number, valueRequired: boolean, id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type AttributeValueListFragment = { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> };

export type AvailableAttributeFragment = { __typename: 'Attribute', id: string, name: string | null, slug: string | null };

export type UserPermissionFragment = { __typename: 'UserPermission', code: PermissionEnum, name: string };

export type UserFragment = { __typename: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, name: string }> | null, avatar: { __typename: 'Image', url: string } | null };

export type UserBaseFragment = { __typename: 'User', id: string, firstName: string, lastName: string };

export type CategoryFragment = { __typename: 'Category', id: string, name: string, children: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null };

export type CategoryDetailsFragment = { __typename: 'Category', id: string, name: string, slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, parent: { __typename: 'Category', id: string } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type ChannelErrorFragment = { __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null };

export type ChannelFragment = { __typename: 'Channel', id: string, isActive: boolean, name: string, slug: string, currencyCode: string, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } };

export type ChannelDetailsFragment = { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } };

export type CollectionFragment = { __typename: 'Collection', id: string, name: string, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null };

export type CollectionDetailsFragment = { __typename: 'Collection', slug: string, description: any | null, seoDescription: string | null, seoTitle: string | null, id: string, name: string, backgroundImage: { __typename: 'Image', alt: string | null, url: string } | null, channelListings: Array<{ __typename: 'CollectionChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type CollectionProductFragment = { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null };

export type CustomerFragment = { __typename: 'User', id: string, email: string, firstName: string, lastName: string };

export type CustomerDetailsFragment = { __typename: 'User', dateJoined: any, lastLogin: any | null, note: string | null, isActive: boolean, id: string, email: string, firstName: string, lastName: string, defaultShippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, defaultBillingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type CustomerAddressesFragment = { __typename: 'User', id: string, email: string, firstName: string, lastName: string, addresses: Array<{ __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }>, defaultBillingAddress: { __typename: 'Address', id: string } | null, defaultShippingAddress: { __typename: 'Address', id: string } | null };

export type SaleFragment = { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type SaleDetailsFragment = { __typename: 'Sale', id: string, name: string, type: SaleType, startDate: any, endDate: any | null, variantsCount: { __typename: 'ProductVariantCountableConnection', totalCount: number | null } | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, variants?: { __typename: 'ProductVariantCountableConnection', edges: Array<{ __typename: 'ProductVariantCountableEdge', node: { __typename: 'ProductVariant', id: string, name: string, product: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, productType: { __typename: 'ProductType', id: string, name: string }, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, channelListings: Array<{ __typename: 'SaleChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type VoucherFragment = { __typename: 'Voucher', id: string, code: string, startDate: any, endDate: any | null, usageLimit: number | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type VoucherDetailsFragment = { __typename: 'Voucher', code: string, usageLimit: number | null, used: number, applyOncePerOrder: boolean, applyOncePerCustomer: boolean, onlyForStaff: boolean, id: string, startDate: any, endDate: any | null, type: VoucherTypeEnum, discountValueType: DiscountValueTypeEnum, minCheckoutItemsQuantity: number | null, productsCount: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, collectionsCount: { __typename: 'CollectionCountableConnection', totalCount: number | null } | null, categoriesCount: { __typename: 'CategoryCountableConnection', totalCount: number | null } | null, products?: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, productType: { __typename: 'ProductType', id: string, name: string }, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, collections?: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, categories?: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string, products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> | null, channelListings: Array<{ __typename: 'VoucherChannelListing', id: string, discountValue: number, currency: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, minSpent: { __typename: 'Money', amount: number, currency: string } | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type AttributeErrorFragment = { __typename: 'AttributeError', code: AttributeErrorCode, field: string | null, message: string | null };

export type ProductErrorFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductErrorWithAttributesFragment = { __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null };

export type ProductChannelListingErrorFragment = { __typename: 'ProductChannelListingError', code: ProductErrorCode, field: string | null, message: string | null, channels: Array<string> | null };

export type CollectionChannelListingErrorFragment = { __typename: 'CollectionChannelListingError', code: ProductErrorCode, field: string | null, message: string | null, channels: Array<string> | null };

export type AccountErrorFragment = { __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null };

export type DiscountErrorFragment = { __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, channels: Array<string> | null, message: string | null };

export type MenuErrorFragment = { __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null };

export type OrderErrorFragment = { __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null };

export type OrderSettingsErrorFragment = { __typename: 'OrderSettingsError', code: OrderSettingsErrorCode, field: string | null, message: string | null };

export type PageErrorFragment = { __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null };

export type PageErrorWithAttributesFragment = { __typename: 'PageError', attributes: Array<string> | null, code: PageErrorCode, field: string | null, message: string | null };

export type PermissionGroupErrorFragment = { __typename: 'PermissionGroupError', code: PermissionGroupErrorCode, field: string | null, message: string | null };

export type BulkProductErrorFragment = { __typename: 'BulkProductError', field: string | null, code: ProductErrorCode, index: number | null, channels: Array<string> | null, message: string | null };

export type BulkStockErrorFragment = { __typename: 'BulkStockError', code: ProductErrorCode, field: string | null, index: number | null, message: string | null };

export type StockErrorFragment = { __typename: 'StockError', code: StockErrorCode, field: string | null, message: string | null };

export type ShippingChannelsErrorFragment = { __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, channels: Array<string> | null, message: string | null };

export type ShippingErrorFragment = { __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null };

export type ShopErrorFragment = { __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null };

export type StaffErrorFragment = { __typename: 'StaffError', code: AccountErrorCode, field: string | null, message: string | null };

export type WarehouseErrorFragment = { __typename: 'WarehouseError', code: WarehouseErrorCode, field: string | null, message: string | null };

export type WebhookErrorFragment = { __typename: 'WebhookError', code: WebhookErrorCode, field: string | null, message: string | null };

export type InvoiceErrorFragment = { __typename: 'InvoiceError', code: InvoiceErrorCode, field: string | null, message: string | null };

export type AppErrorFragment = { __typename: 'AppError', field: string | null, message: string | null, code: AppErrorCode, permissions: Array<PermissionEnum> | null };

export type ExportErrorFragment = { __typename: 'ExportError', code: ExportErrorCode, field: string | null, message: string | null };

export type PluginErrorFragment = { __typename: 'PluginError', code: PluginErrorCode, field: string | null, message: string | null };

export type MetadataErrorFragment = { __typename: 'MetadataError', code: MetadataErrorCode, field: string | null, message: string | null };

export type CollectionErrorFragment = { __typename: 'CollectionError', code: CollectionErrorCode, field: string | null, message: string | null };

export type UploadErrorFragment = { __typename: 'UploadError', code: UploadErrorCode, field: string | null, message: string | null };

export type GiftCardErrorFragment = { __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null };

export type GiftCardSettingsErrorFragment = { __typename: 'GiftCardSettingsError', code: GiftCardSettingsErrorCode, field: string | null, message: string | null };

export type SaleBulkDeleteErrorFragment = { __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, message: string | null };

export type VoucherBulkDeleteErrorFragment = { __typename: 'DiscountError', code: DiscountErrorCode, field: string | null, message: string | null };

export type GiftCardBulkCreateErrorFragmentFragment = { __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null };

export type GiftCardCreateErrorFragmentFragment = { __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null };

export type PageBulkPublishErrorFragmentFragment = { __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null };

export type PageBulkRemoveErrorFragmentFragment = { __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null };

export type PageTypeDeleteErrorFragmentFragment = { __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null };

export type ProductVariantStocksDeleteErrorFragment = { __typename: 'StockError', code: StockErrorCode, field: string | null, message: string | null };

export type ProductTypeDeleteErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductTypeBulkDeleteErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductTypeBulkUpdateErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductAttributeAssignErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductAttributeUnassignErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductTypeCreateErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductTypeReorderAttributesErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null };

export type ProductAttributeAssignmentUpdateErrorFragmentFragment = { __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null, attributes: Array<string> | null };

export type ShopSettingsUpdateErrorFragmentFragment = { __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null };

export type ShopFetchTaxRatesErrorFragmentFragment = { __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null };

export type ProductTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type ProductVariantTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type CategoryTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type CollectionTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type PageTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type VoucherTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type SaleTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type AttributeTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type AttributeValueTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type ShippingPriceTranslateErrorFragmentFragment = { __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null };

export type FileFragment = { __typename: 'File', url: string, contentType: string | null };

export type GiftCardsSettingsFragment = { __typename: 'GiftCardSettings', expiryType: GiftCardSettingsExpiryTypeEnum, expiryPeriod: { __typename: 'TimePeriod', type: TimePeriodTypeEnum, amount: number } | null };

export type GiftCardEventFragment = { __typename: 'GiftCardEvent', expiryDate: any | null, oldExpiryDate: any | null, id: string, date: any | null, type: GiftCardEventsEnum | null, message: string | null, email: string | null, orderId: string | null, orderNumber: string | null, tags: Array<string> | null, oldTags: Array<string> | null, user: { __typename: 'User', email: string, id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null };

export type GiftCardDataFragment = { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type CustomerGiftCardFragment = { __typename: 'GiftCard', id: string, last4CodeChars: string, expiryDate: any | null, isActive: boolean, currentBalance: { __typename: 'Money', amount: number, currency: string } };

export type MetadataItemFragment = { __typename: 'MetadataItem', key: string, value: string };

type Metadata_App_Fragment = { __typename: 'App', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Attribute_Fragment = { __typename: 'Attribute', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Category_Fragment = { __typename: 'Category', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Checkout_Fragment = { __typename: 'Checkout', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_CheckoutLine_Fragment = { __typename: 'CheckoutLine', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Collection_Fragment = { __typename: 'Collection', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_DigitalContent_Fragment = { __typename: 'DigitalContent', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Fulfillment_Fragment = { __typename: 'Fulfillment', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_GiftCard_Fragment = { __typename: 'GiftCard', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Invoice_Fragment = { __typename: 'Invoice', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Menu_Fragment = { __typename: 'Menu', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_MenuItem_Fragment = { __typename: 'MenuItem', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Order_Fragment = { __typename: 'Order', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_OrderLine_Fragment = { __typename: 'OrderLine', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Page_Fragment = { __typename: 'Page', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_PageType_Fragment = { __typename: 'PageType', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Payment_Fragment = { __typename: 'Payment', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Product_Fragment = { __typename: 'Product', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_ProductType_Fragment = { __typename: 'ProductType', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_ProductVariant_Fragment = { __typename: 'ProductVariant', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Sale_Fragment = { __typename: 'Sale', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_ShippingMethod_Fragment = { __typename: 'ShippingMethod', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_ShippingMethodType_Fragment = { __typename: 'ShippingMethodType', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_ShippingZone_Fragment = { __typename: 'ShippingZone', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_TransactionItem_Fragment = { __typename: 'TransactionItem', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_User_Fragment = { __typename: 'User', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Voucher_Fragment = { __typename: 'Voucher', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

type Metadata_Warehouse_Fragment = { __typename: 'Warehouse', metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type MetadataFragment = Metadata_App_Fragment | Metadata_Attribute_Fragment | Metadata_Category_Fragment | Metadata_Checkout_Fragment | Metadata_CheckoutLine_Fragment | Metadata_Collection_Fragment | Metadata_DigitalContent_Fragment | Metadata_Fulfillment_Fragment | Metadata_GiftCard_Fragment | Metadata_Invoice_Fragment | Metadata_Menu_Fragment | Metadata_MenuItem_Fragment | Metadata_Order_Fragment | Metadata_OrderLine_Fragment | Metadata_Page_Fragment | Metadata_PageType_Fragment | Metadata_Payment_Fragment | Metadata_Product_Fragment | Metadata_ProductType_Fragment | Metadata_ProductVariant_Fragment | Metadata_Sale_Fragment | Metadata_ShippingMethod_Fragment | Metadata_ShippingMethodType_Fragment | Metadata_ShippingZone_Fragment | Metadata_TransactionItem_Fragment | Metadata_User_Fragment | Metadata_Voucher_Fragment | Metadata_Warehouse_Fragment;

export type MenuFragment = { __typename: 'Menu', id: string, name: string, items: Array<{ __typename: 'MenuItem', id: string }> | null };

export type MenuItemFragment = { __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null };

export type MenuItemNestedFragment = { __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null };

export type MenuDetailsFragment = { __typename: 'Menu', id: string, name: string, items: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null };

export type OrderEventFragment = { __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null };

export type OrderLineFragment = { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null };

export type RefundOrderLineFragment = { __typename: 'OrderLine', id: string, productName: string, quantity: number, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null };

export type FulfillmentFragment = { __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null };

export type InvoiceFragment = { __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum };

export type OrderDetailsFragment = { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type OrderSettingsFragment = { __typename: 'OrderSettings', automaticallyConfirmAllNewOrders: boolean, automaticallyFulfillNonShippableGiftCard: boolean };

export type ShopOrderSettingsFragment = { __typename: 'Shop', fulfillmentAutoApprove: boolean, fulfillmentAllowUnpaid: boolean };

export type OrderFulfillLineFragment = { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, quantity: number, quantityFulfilled: number, quantityToFulfill: number, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, preorder: { __typename: 'PreorderData', endDate: any | null } | null, attributes: Array<{ __typename: 'SelectedAttribute', values: Array<{ __typename: 'AttributeValue', id: string, name: string | null }> }>, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null } | null, thumbnail: { __typename: 'Image', url: string } | null };

export type OrderLineStockDataFragment = { __typename: 'OrderLine', id: string, quantity: number, quantityToFulfill: number, allocations: Array<{ __typename: 'Allocation', quantity: number, warehouse: { __typename: 'Warehouse', id: string } }> | null, variant: { __typename: 'ProductVariant', stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null } | null };

export type PageInfoFragment = { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null };

export type PageTypeFragment = { __typename: 'PageType', id: string, name: string, hasPages: boolean | null };

export type PageTypeDetailsFragment = { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type PageFragment = { __typename: 'Page', id: string, title: string, slug: string, isPublished: boolean };

export type PageSelectedAttributeFragment = { __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> };

export type PageAttributesFragment = { __typename: 'Page', attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, pageType: { __typename: 'PageType', id: string, name: string, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null } };

export type PageDetailsFragment = { __typename: 'Page', content: any | null, seoTitle: string | null, seoDescription: string | null, publicationDate: any | null, id: string, title: string, slug: string, isPublished: boolean, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, pageType: { __typename: 'PageType', id: string, name: string, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type PermissionGroupFragment = { __typename: 'Group', id: string, name: string, userCanManage: boolean, users: Array<{ __typename: 'User', id: string, firstName: string, lastName: string }> | null };

export type PermissionFragment = { __typename: 'Permission', code: PermissionEnum, name: string };

export type PermissionGroupMemberFragment = { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string, avatar: { __typename: 'Image', url: string } | null };

export type PermissionGroupDetailsFragment = { __typename: 'Group', id: string, name: string, userCanManage: boolean, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null, users: Array<{ __typename: 'User', id: string, firstName: string, lastName: string, email: string, isActive: boolean, avatar: { __typename: 'Image', url: string } | null }> | null };

export type ConfigurationItemFragment = { __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null };

export type PluginConfigurationBaseFragment = { __typename: 'PluginConfiguration', active: boolean, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null };

export type PluginConfigurationExtendedFragment = { __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null };

export type PluginBaseFragment = { __typename: 'Plugin', id: string, name: string, description: string, channelConfigurations: Array<{ __typename: 'PluginConfiguration', active: boolean, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null }>, globalConfiguration: { __typename: 'PluginConfiguration', active: boolean, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null } | null };

export type PluginsDetailsFragment = { __typename: 'Plugin', id: string, name: string, description: string, globalConfiguration: { __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null } | null, channelConfigurations: Array<{ __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null }> };

export type ProductTypeFragment = { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null };

export type ProductTypeDetailsFragment = { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type StockFragment = { __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } };

export type MoneyFragment = { __typename: 'Money', amount: number, currency: string };

export type PreorderFragment = { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null };

export type PriceRangeFragment = { __typename: 'TaxedMoneyRange', start: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null, stop: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null };

export type ProductMediaFragment = { __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any };

export type ChannelListingProductWithoutPricingFragment = { __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } };

export type ChannelListingProductFragment = { __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, pricing: { __typename: 'ProductPricingInfo', priceRange: { __typename: 'TaxedMoneyRange', start: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null, stop: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null } | null } | null, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } };

export type ChannelListingProductVariantFragment = { __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null };

export type ProductWithChannelListingsFragment = { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean }, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, pricing?: { __typename: 'ProductPricingInfo', priceRange: { __typename: 'TaxedMoneyRange', start: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null, stop: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null } | null } | null, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null };

export type ProductVariantAttributesFragment = { __typename: 'Product', id: string, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, productType: { __typename: 'ProductType', id: string, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, channelListings: Array<{ __typename: 'ProductChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null };

export type ProductDetailsVariantFragment = { __typename: 'ProductVariant', id: string, sku: string | null, name: string, margin: number | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, media: Array<{ __typename: 'ProductMedia', url: string }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null };

export type ProductFragment = { __typename: 'Product', name: string, slug: string, description: any | null, seoTitle: string | null, seoDescription: string | null, rating: number | null, chargeTaxes: boolean, isAvailable: boolean | null, id: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, category: { __typename: 'Category', id: string, name: string } | null, collections: Array<{ __typename: 'Collection', id: string, name: string }> | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, sku: string | null, name: string, margin: number | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, media: Array<{ __typename: 'ProductMedia', url: string }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null }> | null, productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type VariantAttributeFragment = { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null };

export type SelectedVariantAttributeFragment = { __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> };

export type ProductVariantFragment = { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type ExportFileFragment = { __typename: 'ExportFile', id: string, status: JobStatusEnum, url: string | null };

export type ProductListAttributeFragment = { __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string }, values: Array<{ __typename: 'AttributeValue', id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> };

export type ShippingZoneFragment = { __typename: 'ShippingZone', id: string, name: string, description: string | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type ShippingMethodWithPostalCodesFragment = { __typename: 'ShippingMethodType', id: string, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null };

export type ShippingMethodTypeFragment = { __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type ShippingMethodWithExcludedProductsFragment = { __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, excludedProducts: { __typename: 'ProductCountableConnection', pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor: string | null, startCursor: string | null }, edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null } }> } | null, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type ShippingZoneDetailsFragment = { __typename: 'ShippingZone', id: string, name: string, description: string | null, shippingMethods: Array<{ __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> }> | null, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> };

export type CountryWithCodeFragment = { __typename: 'CountryDisplay', country: string, code: string };

export type LanguageFragment = { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string };

export type LimitInfoFragment = { __typename: 'Limits', channels?: number | null, orders?: number | null, productVariants?: number | null, staffUsers?: number | null, warehouses?: number | null };

export type ShopLimitFragment = { __typename: 'Shop', limits: { __typename: 'LimitInfo', currentUsage: { __typename: 'Limits', channels?: number | null, orders?: number | null, productVariants?: number | null, staffUsers?: number | null, warehouses?: number | null }, allowedUsage: { __typename: 'Limits', channels?: number | null, orders?: number | null, productVariants?: number | null, staffUsers?: number | null, warehouses?: number | null } } };

export type ShopFragment = { __typename: 'Shop', customerSetPasswordUrl: string | null, defaultMailSenderAddress: string | null, defaultMailSenderName: string | null, description: string | null, name: string, reserveStockDurationAnonymousUser: number | null, reserveStockDurationAuthenticatedUser: number | null, limitQuantityPerCheckout: number | null, companyAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, domain: { __typename: 'Domain', host: string } };

export type StaffMemberFragment = { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string };

export type StaffMemberDetailsFragment = { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string, permissionGroups: Array<{ __typename: 'Group', id: string, name: string, userCanManage: boolean }> | null, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, name: string }> | null, avatar: { __typename: 'Image', url: string } | null };

export type TaxedMoneyFragment = { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } };

export type CountryFragment = { __typename: 'CountryDisplay', country: string, code: string };

export type CountryWithTaxesFragment = { __typename: 'CountryDisplay', country: string, code: string, vat: { __typename: 'VAT', standardRate: number | null, reducedRates: Array<{ __typename: 'ReducedRate', rateType: string, rate: number }> } | null };

export type ShopTaxesFragment = { __typename: 'Shop', chargeTaxesOnShipping: boolean, includeTaxesInPrices: boolean, displayGrossPrices: boolean };

export type TaxTypeFragment = { __typename: 'TaxType', description: string | null, taxCode: string | null };

export type TimePeriodFragment = { __typename: 'TimePeriod', amount: number, type: TimePeriodTypeEnum };

export type CategoryTranslationFragment = { __typename: 'CategoryTranslatableContent', translation: { __typename: 'CategoryTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null, category: { __typename: 'Category', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null };

export type CollectionTranslationFragment = { __typename: 'CollectionTranslatableContent', collection: { __typename: 'Collection', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null, translation: { __typename: 'CollectionTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null };

export type ProductTranslationFragment = { __typename: 'ProductTranslatableContent', product: { __typename: 'Product', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null, translation: { __typename: 'ProductTranslation', id: string, seoTitle: string | null, seoDescription: string | null, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> };

export type ProductVariantTranslationFragment = { __typename: 'ProductVariantTranslatableContent', name: string, productVariant: { __typename: 'ProductVariant', id: string } | null, translation: { __typename: 'ProductVariantTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> };

export type SaleTranslationFragment = { __typename: 'SaleTranslatableContent', sale: { __typename: 'Sale', id: string, name: string } | null, translation: { __typename: 'SaleTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null };

export type VoucherTranslationFragment = { __typename: 'VoucherTranslatableContent', name: string | null, voucher: { __typename: 'Voucher', id: string, name: string | null } | null, translation: { __typename: 'VoucherTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null };

export type ShippingMethodTranslationFragment = { __typename: 'ShippingMethodTranslatableContent', id: string, name: string, description: any | null, shippingMethod: { __typename: 'ShippingMethodType', id: string } | null, translation: { __typename: 'ShippingMethodTranslation', id: string, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null };

export type PageTranslationFragment = { __typename: 'PageTranslatableContent', page: { __typename: 'Page', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string } | null, translation: { __typename: 'PageTranslation', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> };

export type PageTranslatableFragment = { __typename: 'PageTranslatableContent', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string, translation: { __typename: 'PageTranslation', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null };

export type AttributeChoicesTranslationFragment = { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', id: string, name: string | null, richText: any | null, inputType: AttributeInputTypeEnum | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null } | null } }> };

export type AttributeTranslationFragment = { __typename: 'AttributeTranslatableContent', id: string, name: string, translation: { __typename: 'AttributeTranslation', id: string, name: string } | null, attribute: { __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null } | null };

export type AttributeTranslationDetailsFragment = { __typename: 'AttributeTranslatableContent', translation: { __typename: 'AttributeTranslation', id: string, name: string } | null, attribute: { __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, withChoices: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', id: string, name: string | null, richText: any | null, inputType: AttributeInputTypeEnum | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null } | null } }> } | null } | null };

export type AttributeValueTranslatableContentFragment = { __typename: 'AttributeTranslatableContent', translation: { __typename: 'AttributeTranslation', id: string, name: string } | null, attribute: { __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', id: string, name: string | null, richText: any | null, inputType: AttributeInputTypeEnum | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null } | null } }> } | null } | null };

export type MenuItemTranslationFragment = { __typename: 'MenuItemTranslatableContent', translation: { __typename: 'MenuItemTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', language: string } } | null, menuItem: { __typename: 'MenuItem', id: string, name: string } | null };

export type WarehouseFragment = { __typename: 'Warehouse', id: string, name: string };

export type WarehouseWithShippingFragment = { __typename: 'Warehouse', id: string, name: string, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } };

export type WarehouseDetailsFragment = { __typename: 'Warehouse', isPrivate: boolean, clickAndCollectOption: WarehouseClickAndCollectOptionEnum, id: string, name: string, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } };

export type WebhookFragment = { __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } };

export type WebhooksDetailsFragment = { __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } };

export type WeightFragment = { __typename: 'Weight', unit: WeightUnitsEnum, value: number };

export type GiftCardBulkCreateMutationVariables = Exact<{
  input: GiftCardBulkCreateInput;
}>;


export type GiftCardBulkCreateMutation = { __typename: 'Mutation', giftCardBulkCreate: { __typename: 'GiftCardBulkCreate', giftCards: Array<{ __typename: 'GiftCard', id: string }>, errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }> } | null };

export type GiftCardCreateMutationVariables = Exact<{
  input: GiftCardCreateInput;
}>;


export type GiftCardCreateMutation = { __typename: 'Mutation', giftCardCreate: { __typename: 'GiftCardCreate', giftCard: { __typename: 'GiftCard', code: string } | null, errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelCurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type ChannelCurrenciesQuery = { __typename: 'Query', shop: { __typename: 'Shop', channelCurrencies: Array<string> } };

export type ExportGiftCardsMutationVariables = Exact<{
  input: ExportGiftCardsInput;
}>;


export type ExportGiftCardsMutation = { __typename: 'Mutation', exportGiftCards: { __typename: 'ExportGiftCards', errors: Array<{ __typename: 'ExportError', code: ExportErrorCode, field: string | null, message: string | null }>, exportFile: { __typename: 'ExportFile', id: string } | null } | null };

export type GiftCardSettingsUpdateMutationVariables = Exact<{
  input: GiftCardSettingsUpdateInput;
}>;


export type GiftCardSettingsUpdateMutation = { __typename: 'Mutation', giftCardSettingsUpdate: { __typename: 'GiftCardSettingsUpdate', errors: Array<{ __typename: 'GiftCardSettingsError', code: GiftCardSettingsErrorCode, field: string | null, message: string | null }>, giftCardSettings: { __typename: 'GiftCardSettings', expiryType: GiftCardSettingsExpiryTypeEnum, expiryPeriod: { __typename: 'TimePeriod', type: TimePeriodTypeEnum, amount: number } | null } | null } | null };

export type GiftCardSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GiftCardSettingsQuery = { __typename: 'Query', giftCardSettings: { __typename: 'GiftCardSettings', expiryType: GiftCardSettingsExpiryTypeEnum, expiryPeriod: { __typename: 'TimePeriod', type: TimePeriodTypeEnum, amount: number } | null } };

export type GiftCardResendMutationVariables = Exact<{
  input: GiftCardResendInput;
}>;


export type GiftCardResendMutation = { __typename: 'Mutation', giftCardResend: { __typename: 'GiftCardResend', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }>, giftCard: { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type GiftCardActivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GiftCardActivateMutation = { __typename: 'Mutation', giftCardActivate: { __typename: 'GiftCardActivate', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }>, giftCard: { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type GiftCardDeactivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GiftCardDeactivateMutation = { __typename: 'Mutation', giftCardDeactivate: { __typename: 'GiftCardDeactivate', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }>, giftCard: { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type GiftCardUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: GiftCardUpdateInput;
}>;


export type GiftCardUpdateMutation = { __typename: 'Mutation', giftCardUpdate: { __typename: 'GiftCardUpdate', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }>, giftCard: { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, events: Array<{ __typename: 'GiftCardEvent', expiryDate: any | null, oldExpiryDate: any | null, id: string, date: any | null, type: GiftCardEventsEnum | null, message: string | null, email: string | null, orderId: string | null, orderNumber: string | null, tags: Array<string> | null, oldTags: Array<string> | null, user: { __typename: 'User', email: string, id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }>, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type GiftCardAddNoteMutationVariables = Exact<{
  id: Scalars['ID'];
  input: GiftCardAddNoteInput;
}>;


export type GiftCardAddNoteMutation = { __typename: 'Mutation', giftCardAddNote: { __typename: 'GiftCardAddNote', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }>, giftCard: { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, event: { __typename: 'GiftCardEvent', expiryDate: any | null, oldExpiryDate: any | null, id: string, date: any | null, type: GiftCardEventsEnum | null, message: string | null, email: string | null, orderId: string | null, orderNumber: string | null, tags: Array<string> | null, oldTags: Array<string> | null, user: { __typename: 'User', email: string, id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null } | null } | null };

export type GiftCardDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GiftCardDetailsQuery = { __typename: 'Query', giftCard: { __typename: 'GiftCard', last4CodeChars: string, boughtInChannel: string | null, usedByEmail: string | null, createdByEmail: string | null, created: any, expiryDate: any | null, lastUsedOn: any | null, isActive: boolean, id: string, events: Array<{ __typename: 'GiftCardEvent', expiryDate: any | null, oldExpiryDate: any | null, id: string, date: any | null, type: GiftCardEventsEnum | null, message: string | null, email: string | null, orderId: string | null, orderNumber: string | null, tags: Array<string> | null, oldTags: Array<string> | null, user: { __typename: 'User', email: string, id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }>, createdBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, product: { __typename: 'Product', id: string, name: string } | null, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null } | null, initialBalance: { __typename: 'Money', amount: number, currency: string }, currentBalance: { __typename: 'Money', amount: number, currency: string }, tags: Array<{ __typename: 'GiftCardTag', name: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type GiftCardCurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GiftCardCurrenciesQuery = { __typename: 'Query', giftCardCurrencies: Array<string> };

export type GiftCardBulkActivateMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GiftCardBulkActivateMutation = { __typename: 'Mutation', giftCardBulkActivate: { __typename: 'GiftCardBulkActivate', count: number, errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }> } | null };

export type GiftCardBulkDeactivateMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GiftCardBulkDeactivateMutation = { __typename: 'Mutation', giftCardBulkDeactivate: { __typename: 'GiftCardBulkDeactivate', count: number, errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }> } | null };

export type DeleteGiftCardMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteGiftCardMutation = { __typename: 'Mutation', giftCardDelete: { __typename: 'GiftCardDelete', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }> } | null };

export type BulkDeleteGiftCardMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type BulkDeleteGiftCardMutation = { __typename: 'Mutation', giftCardBulkDelete: { __typename: 'GiftCardBulkDelete', errors: Array<{ __typename: 'GiftCardError', code: GiftCardErrorCode, field: string | null, message: string | null }> } | null };

export type GiftCardListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GiftCardFilterInput>;
  sort?: InputMaybe<GiftCardSortingInput>;
}>;


export type GiftCardListQuery = { __typename: 'Query', giftCards: { __typename: 'GiftCardCountableConnection', totalCount: number | null, edges: Array<{ __typename: 'GiftCardCountableEdge', node: { __typename: 'GiftCard', id: string, usedByEmail: string | null, last4CodeChars: string, isActive: boolean, expiryDate: any | null, product: { __typename: 'Product', id: string, name: string } | null, tags: Array<{ __typename: 'GiftCardTag', name: string }>, usedBy: { __typename: 'User', id: string, firstName: string, lastName: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string } } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type GiftCardTotalCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GiftCardTotalCountQuery = { __typename: 'Query', giftCards: { __typename: 'GiftCardCountableConnection', totalCount: number | null } | null };

export type GiftCardProductsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GiftCardProductsCountQuery = { __typename: 'Query', giftCardProductTypes: { __typename: 'ProductTypeCountableConnection', totalCount: number | null } | null, giftCardProducts: { __typename: 'ProductCountableConnection', totalCount: number | null } | null };

export type CustomerGiftCardListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<GiftCardFilterInput>;
}>;


export type CustomerGiftCardListQuery = { __typename: 'Query', giftCards: { __typename: 'GiftCardCountableConnection', edges: Array<{ __typename: 'GiftCardCountableEdge', node: { __typename: 'GiftCard', id: string, last4CodeChars: string, expiryDate: any | null, isActive: boolean, currentBalance: { __typename: 'Money', amount: number, currency: string } } }> } | null };

export type HomeQueryVariables = Exact<{
  channel: Scalars['String'];
  datePeriod: DateRangeInput;
  PERMISSION_MANAGE_PRODUCTS: Scalars['Boolean'];
  PERMISSION_MANAGE_ORDERS: Scalars['Boolean'];
}>;


export type HomeQuery = { __typename: 'Query', salesToday: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } } | null, ordersToday: { __typename: 'OrderCountableConnection', totalCount: number | null } | null, ordersToFulfill: { __typename: 'OrderCountableConnection', totalCount: number | null } | null, ordersToCapture: { __typename: 'OrderCountableConnection', totalCount: number | null } | null, productsOutOfStock: { __typename: 'ProductCountableConnection', totalCount: number | null } | null, productTopToday: { __typename: 'ProductVariantCountableConnection', edges: Array<{ __typename: 'ProductVariantCountableEdge', node: { __typename: 'ProductVariant', id: string, quantityOrdered: number | null, revenue: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } } | null, attributes: Array<{ __typename: 'SelectedAttribute', values: Array<{ __typename: 'AttributeValue', id: string, name: string | null }> }>, product: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null } } }> } | null, activities: { __typename: 'OrderEventCountableConnection', edges: Array<{ __typename: 'OrderEventCountableEdge', node: { __typename: 'OrderEvent', amount: number | null, composedId: string | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, id: string, message: string | null, orderNumber: string | null, oversoldItems: Array<string> | null, quantity: number | null, type: OrderEventsEnum | null, user: { __typename: 'User', id: string, email: string } | null } }> } | null };

export type MenuCreateMutationVariables = Exact<{
  input: MenuCreateInput;
}>;


export type MenuCreateMutation = { __typename: 'Mutation', menuCreate: { __typename: 'MenuCreate', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }>, menu: { __typename: 'Menu', id: string } | null } | null };

export type MenuBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type MenuBulkDeleteMutation = { __typename: 'Mutation', menuBulkDelete: { __typename: 'MenuBulkDelete', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }> } | null };

export type MenuDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MenuDeleteMutation = { __typename: 'Mutation', menuDelete: { __typename: 'MenuDelete', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }> } | null };

export type MenuItemCreateMutationVariables = Exact<{
  input: MenuItemCreateInput;
}>;


export type MenuItemCreateMutation = { __typename: 'Mutation', menuItemCreate: { __typename: 'MenuItemCreate', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }>, menuItem: { __typename: 'MenuItem', menu: { __typename: 'Menu', id: string, items: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null } } | null } | null };

export type MenuUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
  moves: Array<MenuItemMoveInput> | MenuItemMoveInput;
  removeIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type MenuUpdateMutation = { __typename: 'Mutation', menuUpdate: { __typename: 'MenuUpdate', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }> } | null, menuItemMove: { __typename: 'MenuItemMove', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }> } | null, menuItemBulkDelete: { __typename: 'MenuItemBulkDelete', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }> } | null };

export type MenuItemUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: MenuItemInput;
}>;


export type MenuItemUpdateMutation = { __typename: 'Mutation', menuItemUpdate: { __typename: 'MenuItemUpdate', errors: Array<{ __typename: 'MenuError', code: MenuErrorCode, field: string | null, message: string | null }>, menuItem: { __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null } | null } | null };

export type MenuListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<MenuSortingInput>;
}>;


export type MenuListQuery = { __typename: 'Query', menus: { __typename: 'MenuCountableConnection', edges: Array<{ __typename: 'MenuCountableEdge', node: { __typename: 'Menu', id: string, name: string, items: Array<{ __typename: 'MenuItem', id: string }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type MenuDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MenuDetailsQuery = { __typename: 'Query', menu: { __typename: 'Menu', id: string, name: string, items: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, children: Array<{ __typename: 'MenuItem', id: string, level: number, name: string, url: string | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null, category: { __typename: 'Category', id: string, name: string } | null, collection: { __typename: 'Collection', id: string, name: string } | null, page: { __typename: 'Page', id: string, title: string } | null }> | null } | null };

export type OrderCancelMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderCancelMutation = { __typename: 'Mutation', orderCancel: { __typename: 'OrderCancel', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDiscountAddMutationVariables = Exact<{
  input: OrderDiscountCommonInput;
  orderId: Scalars['ID'];
}>;


export type OrderDiscountAddMutation = { __typename: 'Mutation', orderDiscountAdd: { __typename: 'OrderDiscountAdd', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDiscountDeleteMutationVariables = Exact<{
  discountId: Scalars['ID'];
}>;


export type OrderDiscountDeleteMutation = { __typename: 'Mutation', orderDiscountDelete: { __typename: 'OrderDiscountDelete', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderLineDiscountRemoveMutationVariables = Exact<{
  orderLineId: Scalars['ID'];
}>;


export type OrderLineDiscountRemoveMutation = { __typename: 'Mutation', orderLineDiscountRemove: { __typename: 'OrderLineDiscountRemove', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderLineDiscountUpdateMutationVariables = Exact<{
  input: OrderDiscountCommonInput;
  orderLineId: Scalars['ID'];
}>;


export type OrderLineDiscountUpdateMutation = { __typename: 'Mutation', orderLineDiscountUpdate: { __typename: 'OrderLineDiscountUpdate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDiscountUpdateMutationVariables = Exact<{
  input: OrderDiscountCommonInput;
  discountId: Scalars['ID'];
}>;


export type OrderDiscountUpdateMutation = { __typename: 'Mutation', orderDiscountUpdate: { __typename: 'OrderDiscountUpdate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDraftCancelMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderDraftCancelMutation = { __typename: 'Mutation', draftOrderDelete: { __typename: 'DraftOrderDelete', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDraftBulkCancelMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type OrderDraftBulkCancelMutation = { __typename: 'Mutation', draftOrderBulkDelete: { __typename: 'DraftOrderBulkDelete', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }> } | null };

export type OrderConfirmMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderConfirmMutation = { __typename: 'Mutation', orderConfirm: { __typename: 'OrderConfirm', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDraftFinalizeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderDraftFinalizeMutation = { __typename: 'Mutation', draftOrderComplete: { __typename: 'DraftOrderComplete', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type FulfillmentReturnProductsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: OrderReturnProductsInput;
}>;


export type FulfillmentReturnProductsMutation = { __typename: 'Mutation', orderFulfillmentReturnProducts: { __typename: 'FulfillmentReturnProducts', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string } | null, replaceOrder: { __typename: 'Order', id: string } | null } | null };

export type OrderRefundMutationVariables = Exact<{
  id: Scalars['ID'];
  amount: Scalars['PositiveDecimal'];
}>;


export type OrderRefundMutation = { __typename: 'Mutation', orderRefund: { __typename: 'OrderRefund', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderFulfillmentRefundProductsMutationVariables = Exact<{
  input: OrderRefundProductsInput;
  order: Scalars['ID'];
}>;


export type OrderFulfillmentRefundProductsMutation = { __typename: 'Mutation', orderFulfillmentRefundProducts: { __typename: 'FulfillmentRefundProducts', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, fulfillment: { __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null } | null, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderVoidMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderVoidMutation = { __typename: 'Mutation', orderVoid: { __typename: 'OrderVoid', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderMarkAsPaidMutationVariables = Exact<{
  id: Scalars['ID'];
  transactionReference?: InputMaybe<Scalars['String']>;
}>;


export type OrderMarkAsPaidMutation = { __typename: 'Mutation', orderMarkAsPaid: { __typename: 'OrderMarkAsPaid', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderCaptureMutationVariables = Exact<{
  id: Scalars['ID'];
  amount: Scalars['PositiveDecimal'];
}>;


export type OrderCaptureMutation = { __typename: 'Mutation', orderCapture: { __typename: 'OrderCapture', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderFulfillmentUpdateTrackingMutationVariables = Exact<{
  id: Scalars['ID'];
  input: FulfillmentUpdateTrackingInput;
}>;


export type OrderFulfillmentUpdateTrackingMutation = { __typename: 'Mutation', orderFulfillmentUpdateTracking: { __typename: 'FulfillmentUpdateTracking', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderFulfillmentApproveMutationVariables = Exact<{
  id: Scalars['ID'];
  notifyCustomer: Scalars['Boolean'];
  allowStockToBeExceeded?: InputMaybe<Scalars['Boolean']>;
}>;


export type OrderFulfillmentApproveMutation = { __typename: 'Mutation', orderFulfillmentApprove: { __typename: 'FulfillmentApprove', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderFulfillmentCancelMutationVariables = Exact<{
  id: Scalars['ID'];
  input: FulfillmentCancelInput;
}>;


export type OrderFulfillmentCancelMutation = { __typename: 'Mutation', orderFulfillmentCancel: { __typename: 'FulfillmentCancel', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderAddNoteMutationVariables = Exact<{
  order: Scalars['ID'];
  input: OrderAddNoteInput;
}>;


export type OrderAddNoteMutation = { __typename: 'Mutation', orderAddNote: { __typename: 'OrderAddNote', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }> } | null } | null };

export type OrderUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: OrderUpdateInput;
}>;


export type OrderUpdateMutation = { __typename: 'Mutation', orderUpdate: { __typename: 'OrderUpdate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDraftUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: DraftOrderInput;
}>;


export type OrderDraftUpdateMutation = { __typename: 'Mutation', draftOrderUpdate: { __typename: 'DraftOrderUpdate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderShippingMethodUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: OrderUpdateShippingInput;
}>;


export type OrderShippingMethodUpdateMutation = { __typename: 'Mutation', orderUpdateShipping: { __typename: 'OrderUpdateShipping', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, shippingMethodName: string | null, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, total: { __typename: 'TaxedMoney', tax: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, shippingMethod: { __typename: 'ShippingMethod', id: string, name: string, price: { __typename: 'Money', amount: number, currency: string } } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type OrderDraftCreateMutationVariables = Exact<{
  input: DraftOrderCreateInput;
}>;


export type OrderDraftCreateMutation = { __typename: 'Mutation', draftOrderCreate: { __typename: 'DraftOrderCreate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string } | null } | null };

export type OrderLineDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderLineDeleteMutation = { __typename: 'Mutation', orderLineDelete: { __typename: 'OrderLineDelete', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }> } | null } | null };

export type OrderLinesAddMutationVariables = Exact<{
  id: Scalars['ID'];
  input: Array<OrderLineCreateInput> | OrderLineCreateInput;
}>;


export type OrderLinesAddMutation = { __typename: 'Mutation', orderLinesCreate: { __typename: 'OrderLinesCreate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }> } | null } | null };

export type OrderLineUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: OrderLineInput;
}>;


export type OrderLineUpdateMutation = { __typename: 'Mutation', orderLineUpdate: { __typename: 'OrderLineUpdate', errors: Array<{ __typename: 'OrderError', code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null } | null };

export type FulfillOrderMutationVariables = Exact<{
  orderId: Scalars['ID'];
  input: OrderFulfillInput;
}>;


export type FulfillOrderMutation = { __typename: 'Mutation', orderFulfill: { __typename: 'OrderFulfill', errors: Array<{ __typename: 'OrderError', warehouse: string | null, code: OrderErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null, orderLines: Array<string> | null }>, order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type InvoiceRequestMutationVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type InvoiceRequestMutation = { __typename: 'Mutation', invoiceRequest: { __typename: 'InvoiceRequest', errors: Array<{ __typename: 'InvoiceError', code: InvoiceErrorCode, field: string | null, message: string | null }>, invoice: { __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum } | null, order: { __typename: 'Order', id: string, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }> } | null } | null };

export type InvoiceEmailSendMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type InvoiceEmailSendMutation = { __typename: 'Mutation', invoiceSendNotification: { __typename: 'InvoiceSendNotification', errors: Array<{ __typename: 'InvoiceError', code: InvoiceErrorCode, field: string | null, message: string | null }>, invoice: { __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum } | null } | null };

export type OrderSettingsUpdateMutationVariables = Exact<{
  orderSettingsInput: OrderSettingsUpdateInput;
  shopSettingsInput: ShopSettingsInput;
}>;


export type OrderSettingsUpdateMutation = { __typename: 'Mutation', orderSettingsUpdate: { __typename: 'OrderSettingsUpdate', errors: Array<{ __typename: 'OrderSettingsError', code: OrderSettingsErrorCode, field: string | null, message: string | null }>, orderSettings: { __typename: 'OrderSettings', automaticallyConfirmAllNewOrders: boolean, automaticallyFulfillNonShippableGiftCard: boolean } | null } | null, shopSettingsUpdate: { __typename: 'ShopSettingsUpdate', errors: Array<{ __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null }>, shop: { __typename: 'Shop', fulfillmentAutoApprove: boolean, fulfillmentAllowUnpaid: boolean } | null } | null };

export type OrderListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<OrderFilterInput>;
  sort?: InputMaybe<OrderSortingInput>;
}>;


export type OrderListQuery = { __typename: 'Query', orders: { __typename: 'OrderCountableConnection', edges: Array<{ __typename: 'OrderCountableEdge', node: { __typename: 'Order', created: any, id: string, number: string, paymentStatus: PaymentChargeStatusEnum, status: OrderStatus, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } } } }>, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type OrderDraftListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<OrderDraftFilterInput>;
  sort?: InputMaybe<OrderSortingInput>;
}>;


export type OrderDraftListQuery = { __typename: 'Query', draftOrders: { __typename: 'OrderCountableConnection', edges: Array<{ __typename: 'OrderCountableEdge', node: { __typename: 'Order', created: any, id: string, number: string, paymentStatus: PaymentChargeStatusEnum, status: OrderStatus, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } } } }>, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type OrderDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderDetailsQuery = { __typename: 'Query', order: { __typename: 'Order', id: string, token: string, isShippingRequired: boolean, canFinalize: boolean, created: any, customerNote: string, number: string, isPaid: boolean, paymentStatus: PaymentChargeStatusEnum, shippingMethodName: string | null, collectionPointName: string | null, status: OrderStatus, actions: Array<OrderAction>, userEmail: string | null, billingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, giftCards: Array<{ __typename: 'GiftCard', events: Array<{ __typename: 'GiftCardEvent', id: string, type: GiftCardEventsEnum | null, orderId: string | null, balance: { __typename: 'GiftCardEventBalance', initialBalance: { __typename: 'Money', amount: number, currency: string } | null, currentBalance: { __typename: 'Money', amount: number, currency: string }, oldInitialBalance: { __typename: 'Money', amount: number, currency: string } | null, oldCurrentBalance: { __typename: 'Money', amount: number, currency: string } | null } | null }> }>, discounts: Array<{ __typename: 'OrderDiscount', id: string, type: OrderDiscountType, value: any, reason: string | null, calculationMode: DiscountValueTypeEnum, amount: { __typename: 'Money', amount: number, currency: string } }>, events: Array<{ __typename: 'OrderEvent', id: string, amount: number | null, shippingCostsIncluded: boolean | null, date: any | null, email: string | null, emailType: OrderEventsEmailsEnum | null, invoiceNumber: string | null, message: string | null, quantity: number | null, transactionReference: string | null, type: OrderEventsEnum | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, relatedOrder: { __typename: 'Order', id: string, number: string } | null, user: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } | null, app: { __typename: 'App', id: string, name: string | null, appUrl: string | null } | null, lines: Array<{ __typename: 'OrderEventOrderLineObject', quantity: number | null, itemName: string | null, discount: { __typename: 'OrderEventDiscountObject', valueType: DiscountValueTypeEnum, value: any, reason: string | null, oldValueType: DiscountValueTypeEnum | null, oldValue: any | null, amount: { __typename: 'Money', amount: number, currency: string } | null, oldAmount: { __typename: 'Money', amount: number, currency: string } | null } | null, orderLine: { __typename: 'OrderLine', id: string, productName: string, variantName: string } | null }> | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, fulfillmentOrder: number, status: FulfillmentStatus, trackingNumber: string, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null, warehouse: { __typename: 'Warehouse', id: string, name: string } | null }>, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, productSku: string | null, quantity: number, quantityFulfilled: number, quantityToFulfill: number, unitDiscountValue: any, unitDiscountReason: string | null, unitDiscountType: DiscountValueTypeEnum | null, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, quantityAvailable: number | null, preorder: { __typename: 'PreorderData', endDate: any | null } | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, product: { __typename: 'Product', id: string, isAvailableForPurchase: boolean | null } } | null, unitDiscount: { __typename: 'Money', amount: number, currency: string }, undiscountedUnitPrice: { __typename: 'TaxedMoney', currency: string, gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, shippingAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, shippingMethod: { __typename: 'ShippingMethod', id: string } | null, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, subtotal: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string } }, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string }, net: { __typename: 'Money', amount: number, currency: string }, tax: { __typename: 'Money', amount: number, currency: string } }, totalAuthorized: { __typename: 'Money', amount: number, currency: string }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, totalBalance: { __typename: 'Money', amount: number, currency: string }, undiscountedTotal: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string }, gross: { __typename: 'Money', amount: number, currency: string } }, user: { __typename: 'User', id: string, email: string } | null, shippingMethods: Array<{ __typename: 'ShippingMethod', id: string, name: string, active: boolean, message: string | null, price: { __typename: 'Money', amount: number, currency: string } }>, invoices: Array<{ __typename: 'Invoice', id: string, number: string | null, createdAt: any, url: string | null, status: JobStatusEnum }>, channel: { __typename: 'Channel', isActive: boolean, id: string, name: string, currencyCode: string, slug: string, defaultCountry: { __typename: 'CountryDisplay', code: string } }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, shop: { __typename: 'Shop', defaultWeightUnit: WeightUnitsEnum | null, fulfillmentAllowUnpaid: boolean, fulfillmentAutoApprove: boolean, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }> } };

export type OrderFulfillDataQueryVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type OrderFulfillDataQuery = { __typename: 'Query', order: { __typename: 'Order', id: string, isPaid: boolean, number: string, deliveryMethod: { __typename: 'Warehouse', id: string, clickAndCollectOption: WarehouseClickAndCollectOptionEnum } | { __typename: 'ShippingMethod', id: string } | null, lines: Array<{ __typename: 'OrderLine', id: string, isShippingRequired: boolean, productName: string, quantity: number, quantityFulfilled: number, quantityToFulfill: number, allocations: Array<{ __typename: 'Allocation', id: string, quantity: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, variant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, preorder: { __typename: 'PreorderData', endDate: any | null } | null, attributes: Array<{ __typename: 'SelectedAttribute', values: Array<{ __typename: 'AttributeValue', id: string, name: string | null }> }>, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null } | null, thumbnail: { __typename: 'Image', url: string } | null }> } | null };

export type OrderFulfillSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrderFulfillSettingsQuery = { __typename: 'Query', shop: { __typename: 'Shop', fulfillmentAutoApprove: boolean, fulfillmentAllowUnpaid: boolean } };

export type OrderSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrderSettingsQuery = { __typename: 'Query', orderSettings: { __typename: 'OrderSettings', automaticallyConfirmAllNewOrders: boolean, automaticallyFulfillNonShippableGiftCard: boolean } | null, shop: { __typename: 'Shop', fulfillmentAutoApprove: boolean, fulfillmentAllowUnpaid: boolean } };

export type OrderRefundDataQueryVariables = Exact<{
  orderId: Scalars['ID'];
}>;


export type OrderRefundDataQuery = { __typename: 'Query', order: { __typename: 'Order', id: string, number: string, total: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, totalCaptured: { __typename: 'Money', amount: number, currency: string }, shippingPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, lines: Array<{ __typename: 'OrderLine', quantityToFulfill: number, id: string, productName: string, quantity: number, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null }>, fulfillments: Array<{ __typename: 'Fulfillment', id: string, status: FulfillmentStatus, fulfillmentOrder: number, lines: Array<{ __typename: 'FulfillmentLine', id: string, quantity: number, orderLine: { __typename: 'OrderLine', id: string, productName: string, quantity: number, unitPrice: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } }, thumbnail: { __typename: 'Image', url: string } | null } | null }> | null }> } | null };

export type ChannelUsabilityDataQueryVariables = Exact<{
  channel: Scalars['String'];
}>;


export type ChannelUsabilityDataQuery = { __typename: 'Query', products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null };

export type PageTypeUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: PageTypeUpdateInput;
}>;


export type PageTypeUpdateMutation = { __typename: 'Mutation', pageTypeUpdate: { __typename: 'PageTypeUpdate', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }>, pageType: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type PageTypeCreateMutationVariables = Exact<{
  input: PageTypeCreateInput;
}>;


export type PageTypeCreateMutation = { __typename: 'Mutation', pageTypeCreate: { __typename: 'PageTypeCreate', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }>, pageType: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type AssignPageAttributeMutationVariables = Exact<{
  id: Scalars['ID'];
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type AssignPageAttributeMutation = { __typename: 'Mutation', pageAttributeAssign: { __typename: 'PageAttributeAssign', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }>, pageType: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type UnassignPageAttributeMutationVariables = Exact<{
  id: Scalars['ID'];
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type UnassignPageAttributeMutation = { __typename: 'Mutation', pageAttributeUnassign: { __typename: 'PageAttributeUnassign', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }>, pageType: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type PageTypeDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PageTypeDeleteMutation = { __typename: 'Mutation', pageTypeDelete: { __typename: 'PageTypeDelete', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }>, pageType: { __typename: 'PageType', id: string } | null } | null };

export type PageTypeBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type PageTypeBulkDeleteMutation = { __typename: 'Mutation', pageTypeBulkDelete: { __typename: 'PageTypeBulkDelete', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }> } | null };

export type PageTypeAttributeReorderMutationVariables = Exact<{
  move: ReorderInput;
  pageTypeId: Scalars['ID'];
}>;


export type PageTypeAttributeReorderMutation = { __typename: 'Mutation', pageTypeReorderAttributes: { __typename: 'PageTypeReorderAttributes', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }>, pageType: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type PageTypeListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<PageTypeFilterInput>;
  sort?: InputMaybe<PageTypeSortingInput>;
}>;


export type PageTypeListQuery = { __typename: 'Query', pageTypes: { __typename: 'PageTypeCountableConnection', edges: Array<{ __typename: 'PageTypeCountableEdge', node: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type PageTypeDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PageTypeDetailsQuery = { __typename: 'Query', pageType: { __typename: 'PageType', id: string, name: string, hasPages: boolean | null, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type PageCreateMutationVariables = Exact<{
  input: PageCreateInput;
}>;


export type PageCreateMutation = { __typename: 'Mutation', pageCreate: { __typename: 'PageCreate', errors: Array<{ __typename: 'PageError', attributes: Array<string> | null, code: PageErrorCode, field: string | null, message: string | null }>, page: { __typename: 'Page', id: string } | null } | null };

export type PageUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: PageInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type PageUpdateMutation = { __typename: 'Mutation', pageUpdate: { __typename: 'PageUpdate', errors: Array<{ __typename: 'PageError', attributes: Array<string> | null, code: PageErrorCode, field: string | null, message: string | null }>, page: { __typename: 'Page', content: any | null, seoTitle: string | null, seoDescription: string | null, publicationDate: any | null, id: string, title: string, slug: string, isPublished: boolean, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, pageType: { __typename: 'PageType', id: string, name: string, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type PageRemoveMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PageRemoveMutation = { __typename: 'Mutation', pageDelete: { __typename: 'PageDelete', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }> } | null };

export type PageBulkPublishMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
  isPublished: Scalars['Boolean'];
}>;


export type PageBulkPublishMutation = { __typename: 'Mutation', pageBulkPublish: { __typename: 'PageBulkPublish', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }> } | null };

export type PageBulkRemoveMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type PageBulkRemoveMutation = { __typename: 'Mutation', pageBulkDelete: { __typename: 'PageBulkDelete', errors: Array<{ __typename: 'PageError', code: PageErrorCode, field: string | null, message: string | null }> } | null };

export type PageListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<PageSortingInput>;
  filter?: InputMaybe<PageFilterInput>;
}>;


export type PageListQuery = { __typename: 'Query', pages: { __typename: 'PageCountableConnection', edges: Array<{ __typename: 'PageCountableEdge', node: { __typename: 'Page', id: string, title: string, slug: string, isPublished: boolean } }>, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type PageDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type PageDetailsQuery = { __typename: 'Query', page: { __typename: 'Page', content: any | null, seoTitle: string | null, seoDescription: string | null, publicationDate: any | null, id: string, title: string, slug: string, isPublished: boolean, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, pageType: { __typename: 'PageType', id: string, name: string, attributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type PageTypeQueryVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type PageTypeQuery = { __typename: 'Query', pageType: { __typename: 'PageType', id: string, name: string, attributes: Array<{ __typename: 'Attribute', id: string, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, slug: string | null, name: string | null, valueRequired: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null } | null };

export type PageCountQueryVariables = Exact<{
  filter?: InputMaybe<PageFilterInput>;
}>;


export type PageCountQuery = { __typename: 'Query', pages: { __typename: 'PageCountableConnection', totalCount: number | null } | null };

export type PermissionGroupDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PermissionGroupDeleteMutation = { __typename: 'Mutation', permissionGroupDelete: { __typename: 'PermissionGroupDelete', errors: Array<{ __typename: 'PermissionGroupError', code: PermissionGroupErrorCode, field: string | null, message: string | null }> } | null };

export type PermissionGroupCreateMutationVariables = Exact<{
  input: PermissionGroupCreateInput;
}>;


export type PermissionGroupCreateMutation = { __typename: 'Mutation', permissionGroupCreate: { __typename: 'PermissionGroupCreate', errors: Array<{ __typename: 'PermissionGroupError', code: PermissionGroupErrorCode, field: string | null, message: string | null }>, group: { __typename: 'Group', id: string, name: string, userCanManage: boolean, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null, users: Array<{ __typename: 'User', id: string, firstName: string, lastName: string, email: string, isActive: boolean, avatar: { __typename: 'Image', url: string } | null }> | null } | null } | null };

export type PermissionGroupUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: PermissionGroupUpdateInput;
}>;


export type PermissionGroupUpdateMutation = { __typename: 'Mutation', permissionGroupUpdate: { __typename: 'PermissionGroupUpdate', errors: Array<{ __typename: 'PermissionGroupError', code: PermissionGroupErrorCode, field: string | null, message: string | null }>, group: { __typename: 'Group', id: string, name: string, userCanManage: boolean, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null, users: Array<{ __typename: 'User', id: string, firstName: string, lastName: string, email: string, isActive: boolean, avatar: { __typename: 'Image', url: string } | null }> | null } | null } | null };

export type PermissionGroupListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<PermissionGroupFilterInput>;
  sort?: InputMaybe<PermissionGroupSortingInput>;
}>;


export type PermissionGroupListQuery = { __typename: 'Query', permissionGroups: { __typename: 'GroupCountableConnection', edges: Array<{ __typename: 'GroupCountableEdge', node: { __typename: 'Group', id: string, name: string, userCanManage: boolean, users: Array<{ __typename: 'User', id: string, firstName: string, lastName: string }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type PermissionGroupDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type PermissionGroupDetailsQuery = { __typename: 'Query', permissionGroup: { __typename: 'Group', id: string, name: string, userCanManage: boolean, permissions: Array<{ __typename: 'Permission', code: PermissionEnum, name: string }> | null, users: Array<{ __typename: 'User', id: string, firstName: string, lastName: string, email: string, isActive: boolean, avatar: { __typename: 'Image', url: string } | null }> | null } | null, user: { __typename: 'User', editableGroups: Array<{ __typename: 'Group', id: string }> | null, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, sourcePermissionGroups: Array<{ __typename: 'Group', id: string }> | null }> | null } | null };

export type PluginUpdateMutationVariables = Exact<{
  channelId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  input: PluginUpdateInput;
}>;


export type PluginUpdateMutation = { __typename: 'Mutation', pluginUpdate: { __typename: 'PluginUpdate', errors: Array<{ __typename: 'PluginError', code: PluginErrorCode, field: string | null, message: string | null }>, plugin: { __typename: 'Plugin', id: string, name: string, description: string, globalConfiguration: { __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null } | null, channelConfigurations: Array<{ __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null }> } | null } | null };

export type PluginsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PluginFilterInput>;
  sort?: InputMaybe<PluginSortingInput>;
}>;


export type PluginsQuery = { __typename: 'Query', plugins: { __typename: 'PluginCountableConnection', edges: Array<{ __typename: 'PluginCountableEdge', node: { __typename: 'Plugin', id: string, name: string, description: string, channelConfigurations: Array<{ __typename: 'PluginConfiguration', active: boolean, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null }>, globalConfiguration: { __typename: 'PluginConfiguration', active: boolean, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null } | null } }>, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type PluginQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PluginQuery = { __typename: 'Query', plugin: { __typename: 'Plugin', id: string, name: string, description: string, globalConfiguration: { __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null } | null, channelConfigurations: Array<{ __typename: 'PluginConfiguration', active: boolean, configuration: Array<{ __typename: 'ConfigurationItem', name: string, value: string | null, type: ConfigurationTypeFieldEnum | null, helpText: string | null, label: string | null }> | null, channel: { __typename: 'Channel', id: string, name: string, slug: string } | null }> } | null };

export type ProductTypeDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductTypeDeleteMutation = { __typename: 'Mutation', productTypeDelete: { __typename: 'ProductTypeDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productType: { __typename: 'ProductType', id: string } | null } | null };

export type ProductTypeBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type ProductTypeBulkDeleteMutation = { __typename: 'Mutation', productTypeBulkDelete: { __typename: 'ProductTypeBulkDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type ProductTypeUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ProductTypeInput;
}>;


export type ProductTypeUpdateMutation = { __typename: 'Mutation', productTypeUpdate: { __typename: 'ProductTypeUpdate', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type AssignProductAttributeMutationVariables = Exact<{
  id: Scalars['ID'];
  operations: Array<ProductAttributeAssignInput> | ProductAttributeAssignInput;
}>;


export type AssignProductAttributeMutation = { __typename: 'Mutation', productAttributeAssign: { __typename: 'ProductAttributeAssign', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type UnassignProductAttributeMutationVariables = Exact<{
  id: Scalars['ID'];
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type UnassignProductAttributeMutation = { __typename: 'Mutation', productAttributeUnassign: { __typename: 'ProductAttributeUnassign', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type ProductTypeCreateMutationVariables = Exact<{
  input: ProductTypeInput;
}>;


export type ProductTypeCreateMutation = { __typename: 'Mutation', productTypeCreate: { __typename: 'ProductTypeCreate', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type ProductTypeAttributeReorderMutationVariables = Exact<{
  move: ReorderInput;
  productTypeId: Scalars['ID'];
  type: ProductAttributeType;
}>;


export type ProductTypeAttributeReorderMutation = { __typename: 'Mutation', productTypeReorderAttributes: { __typename: 'ProductTypeReorderAttributes', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type ProductAttributeAssignmentUpdateMutationVariables = Exact<{
  operations: Array<ProductAttributeAssignmentUpdateInput> | ProductAttributeAssignmentUpdateInput;
  productTypeId: Scalars['ID'];
}>;


export type ProductAttributeAssignmentUpdateMutation = { __typename: 'Mutation', productAttributeAssignmentUpdate: { __typename: 'ProductAttributeAssignmentUpdate', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null, attributes: Array<string> | null }>, productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type ProductTypeListQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<ProductTypeFilterInput>;
  sort?: InputMaybe<ProductTypeSortingInput>;
}>;


export type ProductTypeListQuery = { __typename: 'Query', productTypes: { __typename: 'ProductTypeCountableConnection', edges: Array<{ __typename: 'ProductTypeCountableEdge', node: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type ProductTypeDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductTypeDetailsQuery = { __typename: 'Query', productType: { __typename: 'ProductType', id: string, name: string, kind: ProductTypeKindEnum, hasVariants: boolean, isShippingRequired: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null }> | null, assignedVariantAttributes: Array<{ __typename: 'AssignedVariantAttribute', variantSelection: boolean, attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, type: AttributeTypeEnum | null, visibleInStorefront: boolean, filterableInDashboard: boolean, filterableInStorefront: boolean, unit: MeasurementUnitsEnum | null, inputType: AttributeInputTypeEnum | null } }> | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, shop: { __typename: 'Shop', defaultWeightUnit: WeightUnitsEnum | null }, taxTypes: Array<{ __typename: 'TaxType', taxCode: string | null, description: string | null }> | null };

export type ProductTypeCreateDataQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductTypeCreateDataQuery = { __typename: 'Query', shop: { __typename: 'Shop', defaultWeightUnit: WeightUnitsEnum | null }, taxTypes: Array<{ __typename: 'TaxType', taxCode: string | null, description: string | null }> | null };

export type ProductMediaCreateMutationVariables = Exact<{
  product: Scalars['ID'];
  image?: InputMaybe<Scalars['Upload']>;
  alt?: InputMaybe<Scalars['String']>;
  mediaUrl?: InputMaybe<Scalars['String']>;
}>;


export type ProductMediaCreateMutation = { __typename: 'Mutation', productMediaCreate: { __typename: 'ProductMediaCreate', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null } | null } | null };

export type ProductDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductDeleteMutation = { __typename: 'Mutation', productDelete: { __typename: 'ProductDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string } | null } | null };

export type ProductMediaReorderMutationVariables = Exact<{
  productId: Scalars['ID'];
  mediaIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type ProductMediaReorderMutation = { __typename: 'Mutation', productMediaReorder: { __typename: 'ProductMediaReorder', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string }> | null } | null } | null };

export type ProductVariantSetDefaultMutationVariables = Exact<{
  productId: Scalars['ID'];
  variantId: Scalars['ID'];
}>;


export type ProductVariantSetDefaultMutation = { __typename: 'Mutation', productVariantSetDefault: { __typename: 'ProductVariantSetDefault', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, defaultVariant: { __typename: 'ProductVariant', id: string, name: string } | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string }> | null } | null } | null };

export type ProductUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ProductInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type ProductUpdateMutation = { __typename: 'Mutation', productUpdate: { __typename: 'ProductUpdate', errors: Array<{ __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', name: string, slug: string, description: any | null, seoTitle: string | null, seoDescription: string | null, rating: number | null, chargeTaxes: boolean, isAvailable: boolean | null, id: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, category: { __typename: 'Category', id: string, name: string } | null, collections: Array<{ __typename: 'Collection', id: string, name: string }> | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, sku: string | null, name: string, margin: number | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, media: Array<{ __typename: 'ProductMedia', url: string }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null }> | null, productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type SimpleProductUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ProductInput;
  productVariantId: Scalars['ID'];
  productVariantInput: ProductVariantInput;
  addStocks: Array<StockInput> | StockInput;
  deleteStocks: Array<Scalars['ID']> | Scalars['ID'];
  updateStocks: Array<StockInput> | StockInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type SimpleProductUpdateMutation = { __typename: 'Mutation', productUpdate: { __typename: 'ProductUpdate', errors: Array<{ __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', name: string, slug: string, description: any | null, seoTitle: string | null, seoDescription: string | null, rating: number | null, chargeTaxes: boolean, isAvailable: boolean | null, id: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, category: { __typename: 'Category', id: string, name: string } | null, collections: Array<{ __typename: 'Collection', id: string, name: string }> | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, sku: string | null, name: string, margin: number | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, media: Array<{ __typename: 'ProductMedia', url: string }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null }> | null, productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, productVariantUpdate: { __typename: 'ProductVariantUpdate', errors: Array<{ __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, productVariantStocksCreate: { __typename: 'ProductVariantStocksCreate', errors: Array<{ __typename: 'BulkStockError', code: ProductErrorCode, field: string | null, index: number | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, productVariantStocksDelete: { __typename: 'ProductVariantStocksDelete', errors: Array<{ __typename: 'StockError', code: StockErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, productVariantStocksUpdate: { __typename: 'ProductVariantStocksUpdate', errors: Array<{ __typename: 'BulkStockError', code: ProductErrorCode, field: string | null, index: number | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type ProductCreateMutationVariables = Exact<{
  input: ProductCreateInput;
}>;


export type ProductCreateMutation = { __typename: 'Mutation', productCreate: { __typename: 'ProductCreate', errors: Array<{ __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string } | null } | null };

export type VariantDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VariantDeleteMutation = { __typename: 'Mutation', productVariantDelete: { __typename: 'ProductVariantDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string } | null } | null };

export type VariantUpdateMutationVariables = Exact<{
  addStocks: Array<StockInput> | StockInput;
  removeStocks: Array<Scalars['ID']> | Scalars['ID'];
  id: Scalars['ID'];
  attributes?: InputMaybe<Array<AttributeValueInput> | AttributeValueInput>;
  sku?: InputMaybe<Scalars['String']>;
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
  trackInventory: Scalars['Boolean'];
  stocks: Array<StockInput> | StockInput;
  preorder?: InputMaybe<PreorderSettingsInput>;
  weight?: InputMaybe<Scalars['WeightScalar']>;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type VariantUpdateMutation = { __typename: 'Mutation', productVariantStocksDelete: { __typename: 'ProductVariantStocksDelete', errors: Array<{ __typename: 'StockError', code: StockErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null } | null } | null, productVariantStocksCreate: { __typename: 'ProductVariantStocksCreate', errors: Array<{ __typename: 'BulkStockError', code: ProductErrorCode, field: string | null, index: number | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null } | null } | null, productVariantStocksUpdate: { __typename: 'ProductVariantStocksUpdate', errors: Array<{ __typename: 'BulkStockError', code: ProductErrorCode, field: string | null, index: number | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, productVariantUpdate: { __typename: 'ProductVariantUpdate', errors: Array<{ __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type VariantCreateMutationVariables = Exact<{
  input: ProductVariantCreateInput;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type VariantCreateMutation = { __typename: 'Mutation', productVariantCreate: { __typename: 'ProductVariantCreate', errors: Array<{ __typename: 'ProductError', attributes: Array<string> | null, code: ProductErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type ProductMediaDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductMediaDeleteMutation = { __typename: 'Mutation', productMediaDelete: { __typename: 'ProductMediaDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, media: Array<{ __typename: 'ProductMedia', id: string }> | null } | null } | null };

export type ProductMediaUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  alt: Scalars['String'];
}>;


export type ProductMediaUpdateMutation = { __typename: 'Mutation', productMediaUpdate: { __typename: 'ProductMediaUpdate', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null } | null } | null };

export type VariantMediaAssignMutationVariables = Exact<{
  variantId: Scalars['ID'];
  mediaId: Scalars['ID'];
}>;


export type VariantMediaAssignMutation = { __typename: 'Mutation', variantMediaAssign: { __typename: 'VariantMediaAssign', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null }> | null } } | null } | null };

export type VariantMediaUnassignMutationVariables = Exact<{
  variantId: Scalars['ID'];
  mediaId: Scalars['ID'];
}>;


export type VariantMediaUnassignMutation = { __typename: 'Mutation', variantMediaUnassign: { __typename: 'VariantMediaUnassign', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null }> | null } } | null } | null };

export type ProductBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type ProductBulkDeleteMutation = { __typename: 'Mutation', productBulkDelete: { __typename: 'ProductBulkDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type ProductVariantBulkDeleteMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type ProductVariantBulkDeleteMutation = { __typename: 'Mutation', productVariantBulkDelete: { __typename: 'ProductVariantBulkDelete', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type ProductExportMutationVariables = Exact<{
  input: ExportProductsInput;
}>;


export type ProductExportMutation = { __typename: 'Mutation', exportProducts: { __typename: 'ExportProducts', exportFile: { __typename: 'ExportFile', id: string, status: JobStatusEnum, url: string | null } | null, errors: Array<{ __typename: 'ExportError', code: ExportErrorCode, field: string | null, message: string | null }> } | null };

export type ProductChannelListingUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ProductChannelListingUpdateInput;
}>;


export type ProductChannelListingUpdateMutation = { __typename: 'Mutation', productChannelListingUpdate: { __typename: 'ProductChannelListingUpdate', product: { __typename: 'Product', id: string, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null }> | null } | null, errors: Array<{ __typename: 'ProductChannelListingError', code: ProductErrorCode, field: string | null, message: string | null, channels: Array<string> | null }> } | null };

export type ProductVariantReorderMutationVariables = Exact<{
  move: ReorderInput;
  productId: Scalars['ID'];
}>;


export type ProductVariantReorderMutation = { __typename: 'Mutation', productVariantReorder: { __typename: 'ProductVariantReorder', errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, variants: Array<{ __typename: 'ProductVariant', id: string }> | null } | null } | null };

export type ProductVariantChannelListingUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: Array<ProductVariantChannelListingAddInput> | ProductVariantChannelListingAddInput;
}>;


export type ProductVariantChannelListingUpdateMutation = { __typename: 'Mutation', productVariantChannelListingUpdate: { __typename: 'ProductVariantChannelListingUpdate', variant: { __typename: 'ProductVariant', id: string, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, product: { __typename: 'Product', id: string, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } } | null, errors: Array<{ __typename: 'ProductChannelListingError', code: ProductErrorCode, field: string | null, message: string | null, channels: Array<string> | null }> } | null };

export type ProductVariantPreorderDeactivateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductVariantPreorderDeactivateMutation = { __typename: 'Mutation', productVariantPreorderDeactivate: { __typename: 'ProductVariantPreorderDeactivate', productVariant: { __typename: 'ProductVariant', id: string, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null } | null, errors: Array<{ __typename: 'ProductError', code: ProductErrorCode, field: string | null, message: string | null }> } | null };

export type InitialProductFilterAttributesQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialProductFilterAttributesQuery = { __typename: 'Query', attributes: { __typename: 'AttributeCountableConnection', edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, slug: string | null } }> } | null };

export type InitialProductFilterCategoriesQueryVariables = Exact<{
  categories?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type InitialProductFilterCategoriesQuery = { __typename: 'Query', categories: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string } }> } | null };

export type InitialProductFilterCollectionsQueryVariables = Exact<{
  collections?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type InitialProductFilterCollectionsQuery = { __typename: 'Query', collections: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string } }> } | null };

export type InitialProductFilterProductTypesQueryVariables = Exact<{
  productTypes?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type InitialProductFilterProductTypesQuery = { __typename: 'Query', productTypes: { __typename: 'ProductTypeCountableConnection', edges: Array<{ __typename: 'ProductTypeCountableEdge', node: { __typename: 'ProductType', id: string, name: string } }> } | null };

export type ProductListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProductFilterInput>;
  channel?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<ProductOrder>;
  hasChannel: Scalars['Boolean'];
  hasSelectedAttributes: Scalars['Boolean'];
}>;


export type ProductListQuery = { __typename: 'Query', products: { __typename: 'ProductCountableConnection', totalCount: number | null, edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', updatedAt: any, id: string, name: string, attributes?: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string }, values: Array<{ __typename: 'AttributeValue', id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, thumbnail: { __typename: 'Image', url: string } | null, productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean }, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, pricing?: { __typename: 'ProductPricingInfo', priceRange: { __typename: 'TaxedMoneyRange', start: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null, stop: { __typename: 'TaxedMoney', net: { __typename: 'Money', amount: number, currency: string } } | null } | null } | null, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null } }>, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type ProductCountQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilterInput>;
  channel?: InputMaybe<Scalars['String']>;
}>;


export type ProductCountQuery = { __typename: 'Query', products: { __typename: 'ProductCountableConnection', totalCount: number | null } | null };

export type ProductDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  channel?: InputMaybe<Scalars['String']>;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type ProductDetailsQuery = { __typename: 'Query', product: { __typename: 'Product', name: string, slug: string, description: any | null, seoTitle: string | null, seoDescription: string | null, rating: number | null, chargeTaxes: boolean, isAvailable: boolean | null, id: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, category: { __typename: 'Category', id: string, name: string } | null, collections: Array<{ __typename: 'Collection', id: string, name: string }> | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, isAvailableForPurchase: boolean | null, availableForPurchase: any | null, visibleInListings: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, sku: string | null, name: string, margin: number | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, media: Array<{ __typename: 'ProductMedia', url: string }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null }> | null, productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, variantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null, attributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, slug: string | null, name: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, taxTypes: Array<{ __typename: 'TaxType', description: string | null, taxCode: string | null }> | null };

export type ProductTypeQueryVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type ProductTypeQuery = { __typename: 'Query', productType: { __typename: 'ProductType', id: string, name: string, hasVariants: boolean, productAttributes: Array<{ __typename: 'Attribute', id: string, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, slug: string | null, name: string | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null, taxType: { __typename: 'TaxType', description: string | null, taxCode: string | null } | null } | null };

export type ProductVariantDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type ProductVariantDetailsQuery = { __typename: 'Query', productVariant: { __typename: 'ProductVariant', id: string, name: string, sku: string | null, trackInventory: boolean, quantityLimitPerCustomer: number | null, selectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, nonSelectionAttributes: Array<{ __typename: 'SelectedAttribute', attribute: { __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }, values: Array<{ __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null }> }>, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null, product: { __typename: 'Product', id: string, name: string, defaultVariant: { __typename: 'ProductVariant', id: string } | null, media: Array<{ __typename: 'ProductMedia', id: string, alt: string, sortOrder: number | null, url: string, type: ProductMediaType, oembedData: any }> | null, thumbnail: { __typename: 'Image', url: string } | null, channelListings: Array<{ __typename: 'ProductChannelListing', publicationDate: any | null, isPublished: boolean, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType, oembedData: any }> | null }> | null }, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, costPrice: { __typename: 'Money', amount: number, currency: string } | null, preorderThreshold: { __typename: 'PreorderThreshold', quantity: number | null, soldUnits: number } | null }> | null, stocks: Array<{ __typename: 'Stock', id: string, quantity: number, quantityAllocated: number, warehouse: { __typename: 'Warehouse', id: string, name: string } }> | null, preorder: { __typename: 'PreorderData', globalThreshold: number | null, globalSoldUnits: number, endDate: any | null } | null, weight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type ProductVariantCreateDataQueryVariables = Exact<{
  id: Scalars['ID'];
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type ProductVariantCreateDataQuery = { __typename: 'Query', product: { __typename: 'Product', id: string, name: string, media: Array<{ __typename: 'ProductMedia', id: string, sortOrder: number | null, url: string }> | null, channelListings: Array<{ __typename: 'ProductChannelListing', isPublished: boolean, publicationDate: any | null, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string } }> | null, productType: { __typename: 'ProductType', id: string, selectionVariantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null, nonSelectionVariantAttributes: Array<{ __typename: 'Attribute', id: string, name: string | null, slug: string | null, inputType: AttributeInputTypeEnum | null, entityType: AttributeEntityTypeEnum | null, valueRequired: boolean, unit: MeasurementUnitsEnum | null, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }> } | null }> | null }, thumbnail: { __typename: 'Image', url: string } | null, defaultVariant: { __typename: 'ProductVariant', id: string } | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, type: ProductMediaType }> | null }> | null } | null };

export type ProductMediaByIdQueryVariables = Exact<{
  productId: Scalars['ID'];
  mediaId: Scalars['ID'];
}>;


export type ProductMediaByIdQuery = { __typename: 'Query', product: { __typename: 'Product', id: string, name: string, mainImage: { __typename: 'ProductMedia', id: string, alt: string, url: string, type: ProductMediaType, oembedData: any } | null, media: Array<{ __typename: 'ProductMedia', id: string, url: string, alt: string, type: ProductMediaType, oembedData: any }> | null } | null };

export type GridAttributesQueryVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GridAttributesQuery = { __typename: 'Query', grid: { __typename: 'AttributeCountableConnection', edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null } }> } | null };

export type SearchAttributesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchAttributesQuery = { __typename: 'Query', search: { __typename: 'AttributeCountableConnection', edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchAttributeValuesQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchAttributeValuesQuery = { __typename: 'Query', attribute: { __typename: 'Attribute', id: string, choices: { __typename: 'AttributeValueCountableConnection', edges: Array<{ __typename: 'AttributeValueCountableEdge', node: { __typename: 'AttributeValue', plainText: string | null, richText: any | null, id: string, name: string | null, slug: string | null, reference: string | null, boolean: boolean | null, date: any | null, dateTime: any | null, value: string | null, file: { __typename: 'File', url: string, contentType: string | null } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null } | null };

export type SearchAvailableInGridAttributesQueryVariables = Exact<{
  first: Scalars['Int'];
  after?: InputMaybe<Scalars['String']>;
  query: Scalars['String'];
}>;


export type SearchAvailableInGridAttributesQuery = { __typename: 'Query', availableInGrid: { __typename: 'AttributeCountableConnection', totalCount: number | null, edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchAvailablePageAttributesQueryVariables = Exact<{
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchAvailablePageAttributesQuery = { __typename: 'Query', pageType: { __typename: 'PageType', id: string, availableAttributes: { __typename: 'AttributeCountableConnection', edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null, slug: string | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null } | null };

export type SearchAvailableProductAttributesQueryVariables = Exact<{
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchAvailableProductAttributesQuery = { __typename: 'Query', productType: { __typename: 'ProductType', id: string, availableAttributes: { __typename: 'AttributeCountableConnection', edges: Array<{ __typename: 'AttributeCountableEdge', node: { __typename: 'Attribute', id: string, name: string | null, slug: string | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null } | null };

export type SearchCategoriesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchCategoriesQuery = { __typename: 'Query', search: { __typename: 'CategoryCountableConnection', edges: Array<{ __typename: 'CategoryCountableEdge', node: { __typename: 'Category', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchCollectionsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchCollectionsQuery = { __typename: 'Query', search: { __typename: 'CollectionCountableConnection', edges: Array<{ __typename: 'CollectionCountableEdge', node: { __typename: 'Collection', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchCustomersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchCustomersQuery = { __typename: 'Query', search: { __typename: 'UserCountableConnection', edges: Array<{ __typename: 'UserCountableEdge', node: { __typename: 'User', id: string, email: string, firstName: string, lastName: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchGiftCardTagsQueryVariables = Exact<{
  query: Scalars['String'];
  first: Scalars['Int'];
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type SearchGiftCardTagsQuery = { __typename: 'Query', search: { __typename: 'GiftCardTagCountableConnection', totalCount: number | null, edges: Array<{ __typename: 'GiftCardTagCountableEdge', node: { __typename: 'GiftCardTag', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchOrderVariantQueryVariables = Exact<{
  channel: Scalars['String'];
  first: Scalars['Int'];
  query: Scalars['String'];
  after?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<AddressInput>;
  isPublished?: InputMaybe<Scalars['Boolean']>;
  stockAvailability?: InputMaybe<StockAvailability>;
}>;


export type SearchOrderVariantQuery = { __typename: 'Query', search: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, pricing: { __typename: 'VariantPricingInfo', onSale: boolean | null, priceUndiscounted: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } } | null, price: { __typename: 'TaxedMoney', gross: { __typename: 'Money', amount: number, currency: string } } | null } | null }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchPagesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchPagesQuery = { __typename: 'Query', search: { __typename: 'PageCountableConnection', edges: Array<{ __typename: 'PageCountableEdge', node: { __typename: 'Page', id: string, title: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchPageTypesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchPageTypesQuery = { __typename: 'Query', search: { __typename: 'PageTypeCountableConnection', edges: Array<{ __typename: 'PageTypeCountableEdge', node: { __typename: 'PageType', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchPermissionGroupsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchPermissionGroupsQuery = { __typename: 'Query', search: { __typename: 'GroupCountableConnection', edges: Array<{ __typename: 'GroupCountableEdge', node: { __typename: 'Group', id: string, name: string, userCanManage: boolean } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchProductsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchProductsQuery = { __typename: 'Query', search: { __typename: 'ProductCountableConnection', edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null, channelListings: Array<{ __typename: 'ProductVariantChannelListing', channel: { __typename: 'Channel', id: string, isActive: boolean, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null }> | null }> | null, collections: Array<{ __typename: 'Collection', id: string }> | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchProductTypesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchProductTypesQuery = { __typename: 'Query', search: { __typename: 'ProductTypeCountableConnection', edges: Array<{ __typename: 'ProductTypeCountableEdge', node: { __typename: 'ProductType', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchShippingZonesQueryVariables = Exact<{
  query: Scalars['String'];
  first: Scalars['Int'];
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type SearchShippingZonesQuery = { __typename: 'Query', search: { __typename: 'ShippingZoneCountableConnection', totalCount: number | null, edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchStaffMembersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchStaffMembersQuery = { __typename: 'Query', search: { __typename: 'UserCountableConnection', edges: Array<{ __typename: 'UserCountableEdge', node: { __typename: 'User', id: string, email: string, firstName: string, lastName: string, isActive: boolean, avatar: { __typename: 'Image', alt: string | null, url: string } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SearchWarehousesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  query: Scalars['String'];
}>;


export type SearchWarehousesQuery = { __typename: 'Query', search: { __typename: 'WarehouseCountableConnection', totalCount: number | null, edges: Array<{ __typename: 'WarehouseCountableEdge', node: { __typename: 'Warehouse', id: string, name: string } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type DeleteShippingZoneMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteShippingZoneMutation = { __typename: 'Mutation', shippingZoneDelete: { __typename: 'ShippingZoneDelete', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }> } | null };

export type BulkDeleteShippingZoneMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type BulkDeleteShippingZoneMutation = { __typename: 'Mutation', shippingZoneBulkDelete: { __typename: 'ShippingZoneBulkDelete', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }> } | null };

export type UpdateDefaultWeightUnitMutationVariables = Exact<{
  unit?: InputMaybe<WeightUnitsEnum>;
}>;


export type UpdateDefaultWeightUnitMutation = { __typename: 'Mutation', shopSettingsUpdate: { __typename: 'ShopSettingsUpdate', errors: Array<{ __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null }>, shop: { __typename: 'Shop', defaultWeightUnit: WeightUnitsEnum | null } | null } | null };

export type CreateShippingZoneMutationVariables = Exact<{
  input: ShippingZoneCreateInput;
}>;


export type CreateShippingZoneMutation = { __typename: 'Mutation', shippingZoneCreate: { __typename: 'ShippingZoneCreate', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }>, shippingZone: { __typename: 'ShippingZone', id: string, name: string, countries: Array<{ __typename: 'CountryDisplay', country: string, code: string }> } | null } | null };

export type UpdateShippingZoneMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ShippingZoneUpdateInput;
}>;


export type UpdateShippingZoneMutation = { __typename: 'Mutation', shippingZoneUpdate: { __typename: 'ShippingZoneUpdate', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }>, shippingZone: { __typename: 'ShippingZone', id: string, name: string, countries: Array<{ __typename: 'CountryDisplay', country: string, code: string }> } | null } | null };

export type UpdateShippingRateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ShippingPriceInput;
}>;


export type UpdateShippingRateMutation = { __typename: 'Mutation', shippingPriceUpdate: { __typename: 'ShippingPriceUpdate', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }>, shippingMethod: { __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type CreateShippingRateMutationVariables = Exact<{
  input: ShippingPriceInput;
}>;


export type CreateShippingRateMutation = { __typename: 'Mutation', shippingPriceCreate: { __typename: 'ShippingPriceCreate', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }>, shippingZone: { __typename: 'ShippingZone', id: string, name: string, description: string | null, shippingMethods: Array<{ __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> }> | null, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, shippingMethod: { __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type DeleteShippingRateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteShippingRateMutation = { __typename: 'Mutation', shippingPriceDelete: { __typename: 'ShippingPriceDelete', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }>, shippingZone: { __typename: 'ShippingZone', id: string, name: string, description: string | null, shippingMethods: Array<{ __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> }> | null, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type BulkDeleteShippingRateMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type BulkDeleteShippingRateMutation = { __typename: 'Mutation', shippingPriceBulkDelete: { __typename: 'ShippingPriceBulkDelete', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }> } | null };

export type ShippingMethodChannelListingUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ShippingMethodChannelListingInput;
}>;


export type ShippingMethodChannelListingUpdateMutation = { __typename: 'Mutation', shippingMethodChannelListingUpdate: { __typename: 'ShippingMethodChannelListingUpdate', shippingMethod: { __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null, errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, channels: Array<string> | null, message: string | null }> } | null };

export type ShippingPriceExcludeProductMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ShippingPriceExcludeProductsInput;
}>;


export type ShippingPriceExcludeProductMutation = { __typename: 'Mutation', shippingPriceExcludeProducts: { __typename: 'ShippingPriceExcludeProducts', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }> } | null };

export type ShippingPriceRemoveProductFromExcludeMutationVariables = Exact<{
  id: Scalars['ID'];
  products: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type ShippingPriceRemoveProductFromExcludeMutation = { __typename: 'Mutation', shippingPriceRemoveProductFromExclude: { __typename: 'ShippingPriceRemoveProductFromExclude', errors: Array<{ __typename: 'ShippingError', code: ShippingErrorCode, field: string | null, message: string | null }> } | null };

export type ShippingZonesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type ShippingZonesQuery = { __typename: 'Query', shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string, description: string | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type ShippingZoneQueryVariables = Exact<{
  id: Scalars['ID'];
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
}>;


export type ShippingZoneQuery = { __typename: 'Query', shippingZone: { __typename: 'ShippingZone', default: boolean, id: string, name: string, description: string | null, shippingMethods: Array<{ __typename: 'ShippingMethodType', minimumDeliveryDays: number | null, maximumDeliveryDays: number | null, name: string, description: any | null, type: ShippingMethodTypeEnum | null, id: string, excludedProducts: { __typename: 'ProductCountableConnection', pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor: string | null, startCursor: string | null }, edges: Array<{ __typename: 'ProductCountableEdge', node: { __typename: 'Product', id: string, name: string, thumbnail: { __typename: 'Image', url: string } | null } }> } | null, minimumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, maximumOrderWeight: { __typename: 'Weight', unit: WeightUnitsEnum, value: number } | null, channelListings: Array<{ __typename: 'ShippingMethodChannelListing', id: string, channel: { __typename: 'Channel', id: string, name: string, currencyCode: string }, price: { __typename: 'Money', amount: number, currency: string } | null, minimumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null, maximumOrderPrice: { __typename: 'Money', amount: number, currency: string } | null }> | null, postalCodeRules: Array<{ __typename: 'ShippingMethodPostalCodeRule', id: string, inclusionType: PostalCodeRuleInclusionTypeEnum | null, start: string | null, end: string | null }> | null, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> }> | null, channels: Array<{ __typename: 'Channel', id: string, name: string, currencyCode: string }>, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null };

export type ShippingZoneChannelsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ShippingZoneChannelsQuery = { __typename: 'Query', shippingZone: { __typename: 'ShippingZone', id: string, channels: Array<{ __typename: 'Channel', id: string, name: string, currencyCode: string }> } | null };

export type ChannelShippingZonesQueryVariables = Exact<{
  filter?: InputMaybe<ShippingZoneFilterInput>;
}>;


export type ChannelShippingZonesQuery = { __typename: 'Query', shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } | null };

export type ShippingZonesCountQueryVariables = Exact<{ [key: string]: never; }>;


export type ShippingZonesCountQuery = { __typename: 'Query', shippingZones: { __typename: 'ShippingZoneCountableConnection', totalCount: number | null } | null };

export type ShopSettingsUpdateMutationVariables = Exact<{
  shopSettingsInput: ShopSettingsInput;
  addressInput?: InputMaybe<AddressInput>;
}>;


export type ShopSettingsUpdateMutation = { __typename: 'Mutation', shopSettingsUpdate: { __typename: 'ShopSettingsUpdate', errors: Array<{ __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null }>, shop: { __typename: 'Shop', customerSetPasswordUrl: string | null, defaultMailSenderAddress: string | null, defaultMailSenderName: string | null, description: string | null, name: string, reserveStockDurationAnonymousUser: number | null, reserveStockDurationAuthenticatedUser: number | null, limitQuantityPerCheckout: number | null, companyAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, domain: { __typename: 'Domain', host: string } } | null } | null, shopAddressUpdate: { __typename: 'ShopAddressUpdate', errors: Array<{ __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null }>, shop: { __typename: 'Shop', companyAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null } | null } | null };

export type SiteSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SiteSettingsQuery = { __typename: 'Query', shop: { __typename: 'Shop', customerSetPasswordUrl: string | null, defaultMailSenderAddress: string | null, defaultMailSenderName: string | null, description: string | null, name: string, reserveStockDurationAnonymousUser: number | null, reserveStockDurationAuthenticatedUser: number | null, limitQuantityPerCheckout: number | null, companyAddress: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } } | null, countries: Array<{ __typename: 'CountryDisplay', code: string, country: string }>, domain: { __typename: 'Domain', host: string } } };

export type StaffMemberAddMutationVariables = Exact<{
  input: StaffCreateInput;
}>;


export type StaffMemberAddMutation = { __typename: 'Mutation', staffCreate: { __typename: 'StaffCreate', errors: Array<{ __typename: 'StaffError', code: AccountErrorCode, field: string | null, message: string | null }>, user: { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string, permissionGroups: Array<{ __typename: 'Group', id: string, name: string, userCanManage: boolean }> | null, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, name: string }> | null, avatar: { __typename: 'Image', url: string } | null } | null } | null };

export type StaffMemberUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: StaffUpdateInput;
}>;


export type StaffMemberUpdateMutation = { __typename: 'Mutation', staffUpdate: { __typename: 'StaffUpdate', errors: Array<{ __typename: 'StaffError', code: AccountErrorCode, field: string | null, message: string | null }>, user: { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string, permissionGroups: Array<{ __typename: 'Group', id: string, name: string, userCanManage: boolean }> | null, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, name: string }> | null, avatar: { __typename: 'Image', url: string } | null } | null } | null };

export type StaffMemberDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StaffMemberDeleteMutation = { __typename: 'Mutation', staffDelete: { __typename: 'StaffDelete', errors: Array<{ __typename: 'StaffError', code: AccountErrorCode, field: string | null, message: string | null }> } | null };

export type StaffAvatarUpdateMutationVariables = Exact<{
  image: Scalars['Upload'];
}>;


export type StaffAvatarUpdateMutation = { __typename: 'Mutation', userAvatarUpdate: { __typename: 'UserAvatarUpdate', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, user: { __typename: 'User', id: string, avatar: { __typename: 'Image', url: string } | null } | null } | null };

export type StaffAvatarDeleteMutationVariables = Exact<{ [key: string]: never; }>;


export type StaffAvatarDeleteMutation = { __typename: 'Mutation', userAvatarDelete: { __typename: 'UserAvatarDelete', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }>, user: { __typename: 'User', id: string, avatar: { __typename: 'Image', url: string } | null } | null } | null };

export type ChangeStaffPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type ChangeStaffPasswordMutation = { __typename: 'Mutation', passwordChange: { __typename: 'PasswordChange', errors: Array<{ __typename: 'AccountError', code: AccountErrorCode, field: string | null, addressType: AddressTypeEnum | null, message: string | null }> } | null };

export type StaffListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<StaffUserInput>;
  sort?: InputMaybe<UserSortingInput>;
}>;


export type StaffListQuery = { __typename: 'Query', staffUsers: { __typename: 'UserCountableConnection', edges: Array<{ __typename: 'UserCountableEdge', cursor: string, node: { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string, avatar: { __typename: 'Image', url: string } | null } }>, pageInfo: { __typename: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor: string | null, endCursor: string | null } } | null };

export type StaffMemberDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StaffMemberDetailsQuery = { __typename: 'Query', user: { __typename: 'User', id: string, email: string, firstName: string, isActive: boolean, lastName: string, permissionGroups: Array<{ __typename: 'Group', id: string, name: string, userCanManage: boolean }> | null, userPermissions: Array<{ __typename: 'UserPermission', code: PermissionEnum, name: string }> | null, avatar: { __typename: 'Image', url: string } | null } | null };

export type UpdateTaxSettingsMutationVariables = Exact<{
  input: ShopSettingsInput;
}>;


export type UpdateTaxSettingsMutation = { __typename: 'Mutation', shopSettingsUpdate: { __typename: 'ShopSettingsUpdate', errors: Array<{ __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null }>, shop: { __typename: 'Shop', chargeTaxesOnShipping: boolean, includeTaxesInPrices: boolean, displayGrossPrices: boolean } | null } | null };

export type FetchTaxesMutationVariables = Exact<{ [key: string]: never; }>;


export type FetchTaxesMutation = { __typename: 'Mutation', shopFetchTaxRates: { __typename: 'ShopFetchTaxRates', errors: Array<{ __typename: 'ShopError', code: ShopErrorCode, field: string | null, message: string | null }>, shop: { __typename: 'Shop', countries: Array<{ __typename: 'CountryDisplay', country: string, code: string }> } | null } | null };

export type CountryListQueryVariables = Exact<{ [key: string]: never; }>;


export type CountryListQuery = { __typename: 'Query', shop: { __typename: 'Shop', chargeTaxesOnShipping: boolean, includeTaxesInPrices: boolean, displayGrossPrices: boolean, countries: Array<{ __typename: 'CountryDisplay', country: string, code: string, vat: { __typename: 'VAT', standardRate: number | null, reducedRates: Array<{ __typename: 'ReducedRate', rateType: string, rate: number }> } | null }> } };

export type TaxTypeListQueryVariables = Exact<{ [key: string]: never; }>;


export type TaxTypeListQuery = { __typename: 'Query', taxTypes: Array<{ __typename: 'TaxType', description: string | null, taxCode: string | null }> | null };

export type UpdateProductTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: TranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateProductTranslationsMutation = { __typename: 'Mutation', productTranslate: { __typename: 'ProductTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, product: { __typename: 'Product', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null, translation: { __typename: 'ProductTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | null } | null };

export type UpdateProductVariantTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: NameTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateProductVariantTranslationsMutation = { __typename: 'Mutation', productVariantTranslate: { __typename: 'ProductVariantTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, productVariant: { __typename: 'ProductVariant', id: string, name: string, translation: { __typename: 'ProductVariantTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | null } | null };

export type UpdateCategoryTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: TranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateCategoryTranslationsMutation = { __typename: 'Mutation', categoryTranslate: { __typename: 'CategoryTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, category: { __typename: 'Category', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null, translation: { __typename: 'CategoryTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null } | null } | null };

export type UpdateCollectionTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: TranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateCollectionTranslationsMutation = { __typename: 'Mutation', collectionTranslate: { __typename: 'CollectionTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, collection: { __typename: 'Collection', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null, translation: { __typename: 'CollectionTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null } | null } | null };

export type UpdatePageTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: PageTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdatePageTranslationsMutation = { __typename: 'Mutation', pageTranslate: { __typename: 'PageTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, page: { __typename: 'PageTranslatableContent', page: { __typename: 'Page', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string } | null, translation: { __typename: 'PageTranslation', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> } | null } | null };

export type UpdateVoucherTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: NameTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateVoucherTranslationsMutation = { __typename: 'Mutation', voucherTranslate: { __typename: 'VoucherTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, voucher: { __typename: 'Voucher', id: string, name: string | null, translation: { __typename: 'VoucherTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | null } | null };

export type UpdateSaleTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: NameTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateSaleTranslationsMutation = { __typename: 'Mutation', saleTranslate: { __typename: 'SaleTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, sale: { __typename: 'Sale', id: string, name: string, translation: { __typename: 'SaleTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | null } | null };

export type UpdateAttributeTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: NameTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateAttributeTranslationsMutation = { __typename: 'Mutation', attributeTranslate: { __typename: 'AttributeTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, attribute: { __typename: 'Attribute', id: string, name: string | null, translation: { __typename: 'AttributeTranslation', id: string, name: string } | null } | null } | null };

export type UpdateAttributeValueTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: AttributeValueTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateAttributeValueTranslationsMutation = { __typename: 'Mutation', attributeValueTranslate: { __typename: 'AttributeValueTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, attributeValue: { __typename: 'AttributeValue', id: string, name: string | null, richText: any | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null } | null } | null } | null };

export type UpdateShippingMethodTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ShippingPriceTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateShippingMethodTranslationsMutation = { __typename: 'Mutation', shippingPriceTranslate: { __typename: 'ShippingPriceTranslate', errors: Array<{ __typename: 'TranslationError', code: TranslationErrorCode, field: string | null, message: string | null }>, shippingMethod: { __typename: 'ShippingMethodType', id: string, name: string, description: any | null, translation: { __typename: 'ShippingMethodTranslation', id: string, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', language: string } } | null } | null } | null };

export type UpdateMenuItemTranslationsMutationVariables = Exact<{
  id: Scalars['ID'];
  input: NameTranslationInput;
  language: LanguageCodeEnum;
}>;


export type UpdateMenuItemTranslationsMutation = { __typename: 'Mutation', menuItemTranslate: { __typename: 'MenuItemTranslate', errors: Array<{ __typename: 'TranslationError', field: string | null, message: string | null }>, menuItem: { __typename: 'MenuItem', id: string, name: string, translation: { __typename: 'MenuItemTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', language: string } } | null } | null } | null };

export type CategoryTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type CategoryTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent', translation: { __typename: 'CategoryTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null, category: { __typename: 'Category', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type CollectionTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type CollectionTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent', collection: { __typename: 'Collection', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null, translation: { __typename: 'CollectionTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type ProductTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type ProductTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent', product: { __typename: 'Product', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null, translation: { __typename: 'ProductTranslation', id: string, seoTitle: string | null, seoDescription: string | null, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type PageTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type PageTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent', page: { __typename: 'Page', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string } | null, translation: { __typename: 'PageTranslation', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type VoucherTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type VoucherTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent', name: string | null, voucher: { __typename: 'Voucher', id: string, name: string | null } | null, translation: { __typename: 'VoucherTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type SaleTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type SaleTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent', sale: { __typename: 'Sale', id: string, name: string } | null, translation: { __typename: 'SaleTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type AttributeTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type AttributeTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent', id: string, name: string, translation: { __typename: 'AttributeTranslation', id: string, name: string } | null, attribute: { __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null } | null } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type ShippingMethodTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type ShippingMethodTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent', id: string, name: string, description: any | null, shippingMethod: { __typename: 'ShippingMethodType', id: string } | null, translation: { __typename: 'ShippingMethodTranslation', id: string, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type MenuItemTranslationsQueryVariables = Exact<{
  language: LanguageCodeEnum;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type MenuItemTranslationsQuery = { __typename: 'Query', translations: { __typename: 'TranslatableItemConnection', edges: Array<{ __typename: 'TranslatableItemEdge', node: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent', translation: { __typename: 'MenuItemTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', language: string } } | null, menuItem: { __typename: 'MenuItem', id: string, name: string } | null } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type ProductTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type ProductTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent', product: { __typename: 'Product', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null, translation: { __typename: 'ProductTranslation', id: string, seoTitle: string | null, seoDescription: string | null, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type ProductVariantListQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProductVariantListQuery = { __typename: 'Query', product: { __typename: 'Product', id: string, variants: Array<{ __typename: 'ProductVariant', id: string, name: string, sku: string | null }> | null } | null };

export type ProductVariantTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type ProductVariantTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent', name: string, productVariant: { __typename: 'ProductVariant', id: string } | null, translation: { __typename: 'ProductVariantTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type CategoryTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type CategoryTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent', translation: { __typename: 'CategoryTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null, category: { __typename: 'Category', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type CollectionTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type CollectionTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent', collection: { __typename: 'Collection', id: string, name: string, description: any | null, seoDescription: string | null, seoTitle: string | null } | null, translation: { __typename: 'CollectionTranslation', id: string, description: any | null, name: string | null, seoDescription: string | null, seoTitle: string | null, language: { __typename: 'LanguageDisplay', language: string } } | null } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type PageTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type PageTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent', page: { __typename: 'Page', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string } | null, translation: { __typename: 'PageTranslation', id: string, content: any | null, seoDescription: string | null, seoTitle: string | null, title: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null, attributeValues: Array<{ __typename: 'AttributeValueTranslatableContent', id: string, name: string, richText: any | null, attributeValue: { __typename: 'AttributeValue', id: string } | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null }> } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type SaleTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type SaleTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent', sale: { __typename: 'Sale', id: string, name: string } | null, translation: { __typename: 'SaleTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type VoucherTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type VoucherTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent', name: string | null, voucher: { __typename: 'Voucher', id: string, name: string | null } | null, translation: { __typename: 'VoucherTranslation', id: string, name: string | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | { __typename: 'MenuItemTranslatableContent' } | null };

export type AttributeTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
  firstValues?: InputMaybe<Scalars['Int']>;
  afterValues?: InputMaybe<Scalars['String']>;
  lastValues?: InputMaybe<Scalars['Int']>;
  beforeValues?: InputMaybe<Scalars['String']>;
}>;


export type AttributeTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent', translation: { __typename: 'AttributeTranslation', id: string, name: string } | null, attribute: { __typename: 'Attribute', id: string, name: string | null, inputType: AttributeInputTypeEnum | null, withChoices: boolean, choices: { __typename: 'AttributeValueCountableConnection', pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null }, edges: Array<{ __typename: 'AttributeValueCountableEdge', cursor: string, node: { __typename: 'AttributeValue', id: string, name: string | null, richText: any | null, inputType: AttributeInputTypeEnum | null, translation: { __typename: 'AttributeValueTranslation', id: string, name: string, richText: any | null } | null } }> } | null } | null } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type ShippingMethodTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type ShippingMethodTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent', id: string, name: string, description: any | null, shippingMethod: { __typename: 'ShippingMethodType', id: string } | null, translation: { __typename: 'ShippingMethodTranslation', id: string, name: string | null, description: any | null, language: { __typename: 'LanguageDisplay', code: LanguageCodeEnum, language: string } } | null } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent' } | null };

export type MenuItemTranslationDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
  language: LanguageCodeEnum;
}>;


export type MenuItemTranslationDetailsQuery = { __typename: 'Query', translation: { __typename: 'ProductTranslatableContent' } | { __typename: 'CollectionTranslatableContent' } | { __typename: 'CategoryTranslatableContent' } | { __typename: 'AttributeTranslatableContent' } | { __typename: 'AttributeValueTranslatableContent' } | { __typename: 'ProductVariantTranslatableContent' } | { __typename: 'PageTranslatableContent' } | { __typename: 'ShippingMethodTranslatableContent' } | { __typename: 'SaleTranslatableContent' } | { __typename: 'VoucherTranslatableContent' } | { __typename: 'MenuItemTranslatableContent', translation: { __typename: 'MenuItemTranslation', id: string, name: string, language: { __typename: 'LanguageDisplay', language: string } } | null, menuItem: { __typename: 'MenuItem', id: string, name: string } | null } | null };

export type UpdateMetadataMutationVariables = Exact<{
  id: Scalars['ID'];
  input: Array<MetadataInput> | MetadataInput;
  keysToDelete: Array<Scalars['String']> | Scalars['String'];
}>;


export type UpdateMetadataMutation = { __typename: 'Mutation', updateMetadata: { __typename: 'UpdateMetadata', errors: Array<{ __typename: 'MetadataError', code: MetadataErrorCode, field: string | null, message: string | null }>, item: { __typename: 'App', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Attribute', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Category', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Checkout', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'CheckoutLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Collection', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'DigitalContent', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Fulfillment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'GiftCard', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Invoice', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Menu', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'MenuItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Order', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'OrderLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Page', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'PageType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Payment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Product', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductVariant', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Sale', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethod', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethodType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingZone', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'TransactionItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'User', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Voucher', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Warehouse', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, deleteMetadata: { __typename: 'DeleteMetadata', errors: Array<{ __typename: 'MetadataError', code: MetadataErrorCode, field: string | null, message: string | null }>, item: { __typename: 'App', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Attribute', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Category', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Checkout', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'CheckoutLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Collection', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'DigitalContent', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Fulfillment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'GiftCard', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Invoice', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Menu', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'MenuItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Order', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'OrderLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Page', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'PageType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Payment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Product', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductVariant', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Sale', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethod', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethodType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingZone', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'TransactionItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'User', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Voucher', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Warehouse', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type UpdatePrivateMetadataMutationVariables = Exact<{
  id: Scalars['ID'];
  input: Array<MetadataInput> | MetadataInput;
  keysToDelete: Array<Scalars['String']> | Scalars['String'];
}>;


export type UpdatePrivateMetadataMutation = { __typename: 'Mutation', updatePrivateMetadata: { __typename: 'UpdatePrivateMetadata', errors: Array<{ __typename: 'MetadataError', code: MetadataErrorCode, field: string | null, message: string | null }>, item: { __typename: 'App', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Attribute', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Category', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Checkout', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'CheckoutLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Collection', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'DigitalContent', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Fulfillment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'GiftCard', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Invoice', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Menu', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'MenuItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Order', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'OrderLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Page', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'PageType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Payment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Product', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductVariant', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Sale', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethod', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethodType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingZone', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'TransactionItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'User', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Voucher', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Warehouse', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null, deletePrivateMetadata: { __typename: 'DeletePrivateMetadata', errors: Array<{ __typename: 'MetadataError', code: MetadataErrorCode, field: string | null, message: string | null }>, item: { __typename: 'App', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Attribute', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Category', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Checkout', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'CheckoutLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Collection', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'DigitalContent', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Fulfillment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'GiftCard', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Invoice', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Menu', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'MenuItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Order', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'OrderLine', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Page', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'PageType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Payment', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Product', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ProductVariant', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Sale', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethod', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingMethodType', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'ShippingZone', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'TransactionItem', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'User', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Voucher', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | { __typename: 'Warehouse', id: string, metadata: Array<{ __typename: 'MetadataItem', key: string, value: string }>, privateMetadata: Array<{ __typename: 'MetadataItem', key: string, value: string }> } | null } | null };

export type WarehouseDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type WarehouseDeleteMutation = { __typename: 'Mutation', deleteWarehouse: { __typename: 'WarehouseDelete', errors: Array<{ __typename: 'WarehouseError', code: WarehouseErrorCode, field: string | null, message: string | null }> } | null };

export type WarehouseCreateMutationVariables = Exact<{
  input: WarehouseCreateInput;
}>;


export type WarehouseCreateMutation = { __typename: 'Mutation', createWarehouse: { __typename: 'WarehouseCreate', errors: Array<{ __typename: 'WarehouseError', code: WarehouseErrorCode, field: string | null, message: string | null }>, warehouse: { __typename: 'Warehouse', isPrivate: boolean, clickAndCollectOption: WarehouseClickAndCollectOptionEnum, id: string, name: string, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } } | null } | null };

export type WarehouseUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: WarehouseUpdateInput;
}>;


export type WarehouseUpdateMutation = { __typename: 'Mutation', updateWarehouse: { __typename: 'WarehouseUpdate', errors: Array<{ __typename: 'WarehouseError', code: WarehouseErrorCode, field: string | null, message: string | null }>, warehouse: { __typename: 'Warehouse', isPrivate: boolean, clickAndCollectOption: WarehouseClickAndCollectOptionEnum, id: string, name: string, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } } | null } | null };

export type WarehouseListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<WarehouseFilterInput>;
  sort?: InputMaybe<WarehouseSortingInput>;
}>;


export type WarehouseListQuery = { __typename: 'Query', warehouses: { __typename: 'WarehouseCountableConnection', edges: Array<{ __typename: 'WarehouseCountableEdge', node: { __typename: 'Warehouse', id: string, name: string, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } } }>, pageInfo: { __typename: 'PageInfo', endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null } } | null };

export type WarehouseDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type WarehouseDetailsQuery = { __typename: 'Query', warehouse: { __typename: 'Warehouse', isPrivate: boolean, clickAndCollectOption: WarehouseClickAndCollectOptionEnum, id: string, name: string, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } } | null };

export type WarehousesCountQueryVariables = Exact<{ [key: string]: never; }>;


export type WarehousesCountQuery = { __typename: 'Query', warehouses: { __typename: 'WarehouseCountableConnection', totalCount: number | null } | null };

export type WebhookCreateMutationVariables = Exact<{
  input: WebhookCreateInput;
}>;


export type WebhookCreateMutation = { __typename: 'Mutation', webhookCreate: { __typename: 'WebhookCreate', errors: Array<{ __typename: 'WebhookError', code: WebhookErrorCode, field: string | null, message: string | null }>, webhook: { __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } } | null } | null };

export type WebhookUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: WebhookUpdateInput;
}>;


export type WebhookUpdateMutation = { __typename: 'Mutation', webhookUpdate: { __typename: 'WebhookUpdate', errors: Array<{ __typename: 'WebhookError', code: WebhookErrorCode, field: string | null, message: string | null }>, webhook: { __typename: 'Webhook', id: string, name: string, isActive: boolean, app: { __typename: 'App', id: string, name: string | null } } | null } | null };

export type WebhookDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type WebhookDeleteMutation = { __typename: 'Mutation', webhookDelete: { __typename: 'WebhookDelete', errors: Array<{ __typename: 'WebhookError', code: WebhookErrorCode, field: string | null, message: string | null }> } | null };

export type WebhookDetailsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type WebhookDetailsQuery = { __typename: 'Query', webhook: { __typename: 'Webhook', secretKey: string | null, targetUrl: string, id: string, name: string, isActive: boolean, syncEvents: Array<{ __typename: 'WebhookEventSync', eventType: WebhookEventTypeSyncEnum }>, asyncEvents: Array<{ __typename: 'WebhookEventAsync', eventType: WebhookEventTypeAsyncEnum }>, app: { __typename: 'App', id: string, name: string | null } } | null };
