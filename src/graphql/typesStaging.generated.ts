export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type ChannelCreateMutationVariables = Exact<{
  input: ChannelCreateInput;
}>;


export type ChannelCreateMutation = { __typename: 'Mutation', channelCreate: { __typename: 'ChannelCreate', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, orderSettings: { __typename: 'OrderSettings', markAsPaidStrategy: MarkAsPaidStrategyEnum, deleteExpiredOrdersAfter: any, allowUnpaidOrders: boolean }, paymentSettings: { __typename: 'PaymentSettings', defaultTransactionFlowStrategy: TransactionFlowStrategyEnum }, checkoutSettings: { __typename: 'CheckoutSettings', automaticallyCompleteFullyPaidCheckouts: boolean, automaticCompletionDelay: any | null, automaticCompletionCutOffDate: any | null, allowLegacyGiftCardUse: boolean }, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type ChannelUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ChannelUpdateInput;
}>;


export type ChannelUpdateMutation = { __typename: 'Mutation', channelUpdate: { __typename: 'ChannelUpdate', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, orderSettings: { __typename: 'OrderSettings', markAsPaidStrategy: MarkAsPaidStrategyEnum, deleteExpiredOrdersAfter: any, allowUnpaidOrders: boolean }, paymentSettings: { __typename: 'PaymentSettings', defaultTransactionFlowStrategy: TransactionFlowStrategyEnum }, checkoutSettings: { __typename: 'CheckoutSettings', automaticallyCompleteFullyPaidCheckouts: boolean, automaticCompletionDelay: any | null, automaticCompletionCutOffDate: any | null, allowLegacyGiftCardUse: boolean }, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null, errors: Array<{ __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null }> } | null };

export type BaseChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type BaseChannelsQuery = { __typename: 'Query', channels: Array<{ __typename: 'Channel', id: string, isActive: boolean, name: string, slug: string, currencyCode: string, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } }> | null };

export type ChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChannelsQuery = { __typename: 'Query', channels: Array<{ __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, orderSettings: { __typename: 'OrderSettings', markAsPaidStrategy: MarkAsPaidStrategyEnum, deleteExpiredOrdersAfter: any, allowUnpaidOrders: boolean }, paymentSettings: { __typename: 'PaymentSettings', defaultTransactionFlowStrategy: TransactionFlowStrategyEnum }, checkoutSettings: { __typename: 'CheckoutSettings', automaticallyCompleteFullyPaidCheckouts: boolean, automaticCompletionDelay: any | null, automaticCompletionCutOffDate: any | null, allowLegacyGiftCardUse: boolean }, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } }> | null };

export type ChannelQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChannelQuery = { __typename: 'Query', channel: { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, orderSettings: { __typename: 'OrderSettings', markAsPaidStrategy: MarkAsPaidStrategyEnum, deleteExpiredOrdersAfter: any, allowUnpaidOrders: boolean }, paymentSettings: { __typename: 'PaymentSettings', defaultTransactionFlowStrategy: TransactionFlowStrategyEnum }, checkoutSettings: { __typename: 'CheckoutSettings', automaticallyCompleteFullyPaidCheckouts: boolean, automaticCompletionDelay: any | null, automaticCompletionCutOffDate: any | null, allowLegacyGiftCardUse: boolean }, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } } | null };

export type AddressFragment = { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } };

export type ChannelErrorFragment = { __typename: 'ChannelError', code: ChannelErrorCode, field: string | null, message: string | null };

export type ChannelFragment = { __typename: 'Channel', id: string, isActive: boolean, name: string, slug: string, currencyCode: string, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } };

export type ChannelDetailsFragment = { __typename: 'Channel', hasOrders: boolean, id: string, isActive: boolean, name: string, slug: string, currencyCode: string, warehouses: Array<{ __typename: 'Warehouse', id: string, name: string }>, orderSettings: { __typename: 'OrderSettings', markAsPaidStrategy: MarkAsPaidStrategyEnum, deleteExpiredOrdersAfter: any, allowUnpaidOrders: boolean }, paymentSettings: { __typename: 'PaymentSettings', defaultTransactionFlowStrategy: TransactionFlowStrategyEnum }, checkoutSettings: { __typename: 'CheckoutSettings', automaticallyCompleteFullyPaidCheckouts: boolean, automaticCompletionDelay: any | null, automaticCompletionCutOffDate: any | null, allowLegacyGiftCardUse: boolean }, defaultCountry: { __typename: 'CountryDisplay', code: string, country: string }, stockSettings: { __typename: 'StockSettings', allocationStrategy: AllocationStrategyEnum } };

export type WarehouseFragment = { __typename: 'Warehouse', id: string, name: string };

export type WarehouseWithShippingFragment = { __typename: 'Warehouse', id: string, name: string, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } };

export type WarehouseDetailsFragment = { __typename: 'Warehouse', isPrivate: boolean, clickAndCollectOption: WarehouseClickAndCollectOptionEnum, email: string, id: string, name: string, address: { __typename: 'Address', city: string, cityArea: string, companyName: string, countryArea: string, firstName: string, id: string, lastName: string, phone: string | null, postalCode: string, streetAddress1: string, streetAddress2: string, country: { __typename: 'CountryDisplay', code: string, country: string } }, shippingZones: { __typename: 'ShippingZoneCountableConnection', edges: Array<{ __typename: 'ShippingZoneCountableEdge', node: { __typename: 'ShippingZone', id: string, name: string } }> } };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: { input: any; output: any; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: any; output: any; }
  /** The `Day` scalar type represents number of days by integer value. */
  Day: { input: any; output: any; }
  /**
   * Custom Decimal implementation.
   *
   * Returns Decimal as a float in the API,
   * parses float to the Decimal on the way back.
   */
  Decimal: { input: any; output: any; }
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: { input: any; output: any; }
  /** The `Hour` scalar type represents number of hours by integer value. */
  Hour: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONString: { input: any; output: any; }
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
  Metadata: { input: any; output: any; }
  /** The `Minute` scalar type represents number of minutes by integer value. */
  Minute: { input: any; output: any; }
  /**
   * Nonnegative Decimal scalar implementation.
   *
   * Should be used in places where value must be nonnegative (0 or greater).
   */
  PositiveDecimal: { input: any; output: any; }
  /**
   * Positive Integer scalar implementation.
   *
   * Should be used in places where value must be positive (greater than 0).
   */
  PositiveInt: { input: any; output: any; }
  UUID: { input: any; output: any; }
  /** Variables of this type must be set to null in mutations. They will be replaced with a filename from a following multipart part containing a binary file. See: https://github.com/jaydenseric/graphql-multipart-request-spec. */
  Upload: { input: any; output: any; }
  WeightScalar: { input: any; output: any; }
  /** _Any value scalar as defined by Federation spec. */
  _Any: { input: any; output: any; }
};

/**
 * Determine the allocation strategy for the channel.
 *
 *     PRIORITIZE_SORTING_ORDER - allocate stocks according to the warehouses' order
 *     within the channel
 *
 *     PRIORITIZE_HIGH_STOCK - allocate stock in a warehouse with the most stock
 */
export type AllocationStrategyEnum =
  | 'PRIORITIZE_HIGH_STOCK'
  | 'PRIORITIZE_SORTING_ORDER';

export type AttributeEntityTypeEnum =
  | 'CATEGORY'
  | 'COLLECTION'
  | 'PAGE'
  | 'PRODUCT'
  | 'PRODUCT_VARIANT';

export type AttributeInputTypeEnum =
  | 'BOOLEAN'
  | 'DATE'
  | 'DATE_TIME'
  | 'DROPDOWN'
  | 'FILE'
  | 'MULTISELECT'
  | 'NUMERIC'
  | 'PLAIN_TEXT'
  | 'REFERENCE'
  | 'RICH_TEXT'
  | 'SINGLE_REFERENCE'
  | 'SWATCH';

export type AttributeTypeEnum =
  | 'PAGE_TYPE'
  | 'PRODUCT_TYPE';

export type ChannelCreateInput = {
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** List of warehouses to assign to the channel. */
  addWarehouses?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The channel checkout settings */
  checkoutSettings?: InputMaybe<CheckoutSettingsInput>;
  /** Currency of the channel. */
  currencyCode: Scalars['String']['input'];
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry: CountryCode;
  /** Determine if channel will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Channel public metadata. Can be read by any API client authorized to read the object it's attached to.
   *
   * Warning: never store sensitive information, including financial data such as credit card details.
   */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** Name of the channel. */
  name: Scalars['String']['input'];
  /** The channel order settings */
  orderSettings?: InputMaybe<OrderSettingsInput>;
  /** The channel payment settings */
  paymentSettings?: InputMaybe<PaymentSettingsInput>;
  /**
   * Channel private metadata. Requires permissions to modify and to read the metadata of the object it's attached to.
   *
   * Warning: never store sensitive information, including financial data such as credit card details.
   */
  privateMetadata?: InputMaybe<Array<MetadataInput>>;
  /** Slug of the channel. */
  slug: Scalars['String']['input'];
  /** The channel stock settings. */
  stockSettings?: InputMaybe<StockSettingsInput>;
};

export type ChannelErrorCode =
  | 'ALREADY_EXISTS'
  | 'CHANNELS_CURRENCY_MUST_BE_THE_SAME'
  | 'CHANNEL_WITH_ORDERS'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type ChannelUpdateInput = {
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** List of warehouses to assign to the channel. */
  addWarehouses?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The channel checkout settings */
  checkoutSettings?: InputMaybe<CheckoutSettingsInput>;
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry?: InputMaybe<CountryCode>;
  /** Determine if channel will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Channel public metadata. Can be read by any API client authorized to read the object it's attached to.
   *
   * Warning: never store sensitive information, including financial data such as credit card details.
   */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** Name of the channel. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The channel order settings */
  orderSettings?: InputMaybe<OrderSettingsInput>;
  /** The channel payment settings */
  paymentSettings?: InputMaybe<PaymentSettingsInput>;
  /**
   * Channel private metadata. Requires permissions to modify and to read the metadata of the object it's attached to.
   *
   * Warning: never store sensitive information, including financial data such as credit card details.
   */
  privateMetadata?: InputMaybe<Array<MetadataInput>>;
  /** List of shipping zones to unassign from the channel. */
  removeShippingZones?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** List of warehouses to unassign from the channel. */
  removeWarehouses?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Slug of the channel. */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** The channel stock settings. */
  stockSettings?: InputMaybe<StockSettingsInput>;
};

export type CheckoutAutoCompleteInput = {
  /** Specifies the earliest date on which fully paid checkouts can begin to be automatically completed. Fully paid checkouts dated before this cut-off will not be automatically completed. Must be less than the threshold of the oldest modified checkout eligible for automatic completion. Default is current date time. */
  cutOffDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The time in minutes after which the fully paid checkout will be automatically completed. Default is 30. Set to 0 for immediate completion. Should be less than the threshold for the oldest modified checkout eligible for automatic completion. */
  delay?: InputMaybe<Scalars['Minute']['input']>;
  /** Default `false`. Determines if the paid checkouts should be automatically completed. This setting applies only to checkouts where payment was processed through transactions.When enabled, the checkout will be automatically completed once the checkout `charge_status` reaches `FULL`. This occurs when the total sum of charged and authorized transaction amounts equals or exceeds the checkout's total amount. */
  enabled: Scalars['Boolean']['input'];
};

export type CheckoutSettingsInput = {
  /**
   * Default to `true`. Determines whether gift cards can be attached to a Checkout via `addPromoCode` mutation. Usage of this mutation with gift cards is deprecated.
   *
   * Added in Saleor 3.23.
   */
  allowLegacyGiftCardUse?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Settings for automatic completion of fully paid checkouts.
   *
   * Added in Saleor 3.22.
   */
  automaticCompletion?: InputMaybe<CheckoutAutoCompleteInput>;
  /**
   * Default `false`. Determines if the paid checkouts should be automatically completed. This setting applies only to checkouts where payment was processed through transactions.When enabled, the checkout will be automatically completed once the checkout `authorize_status` reaches `FULL`. This occurs when the total sum of charged and authorized transaction amounts equals or exceeds the checkout's total amount.
   *
   * Added in Saleor 3.20.
   * @deprecated Use `automatic_completion` instead.
   */
  automaticallyCompleteFullyPaidCheckouts?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Default `true`. Determines if the checkout mutations should use legacy error flow. In legacy flow, all mutations can raise an exception unrelated to the requested action - (e.g. out-of-stock exception when updating checkoutShippingAddress.) If `false`, the errors will be aggregated in `checkout.problems` field. Some of the `problems` can block the finalizing checkout process. The legacy flow will be removed in Saleor 4.0. The flow with `checkout.problems` will be the default one.
   * @deprecated Field no longer supported
   */
  useLegacyErrorFlow?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Represents country codes defined by the ISO 3166-1 alpha-2 standard.
 *
 * The `EU` value is DEPRECATED and will be removed in Saleor 3.21.
 */
export type CountryCode =
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AI'
  | 'AL'
  | 'AM'
  | 'AO'
  | 'AQ'
  | 'AR'
  | 'AS'
  | 'AT'
  | 'AU'
  | 'AW'
  | 'AX'
  | 'AZ'
  | 'BA'
  | 'BB'
  | 'BD'
  | 'BE'
  | 'BF'
  | 'BG'
  | 'BH'
  | 'BI'
  | 'BJ'
  | 'BL'
  | 'BM'
  | 'BN'
  | 'BO'
  | 'BQ'
  | 'BR'
  | 'BS'
  | 'BT'
  | 'BV'
  | 'BW'
  | 'BY'
  | 'BZ'
  | 'CA'
  | 'CC'
  | 'CD'
  | 'CF'
  | 'CG'
  | 'CH'
  | 'CI'
  | 'CK'
  | 'CL'
  | 'CM'
  | 'CN'
  | 'CO'
  | 'CR'
  | 'CU'
  | 'CV'
  | 'CW'
  | 'CX'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DJ'
  | 'DK'
  | 'DM'
  | 'DO'
  | 'DZ'
  | 'EC'
  | 'EE'
  | 'EG'
  | 'EH'
  | 'ER'
  | 'ES'
  | 'ET'
  | 'EU'
  | 'FI'
  | 'FJ'
  | 'FK'
  | 'FM'
  | 'FO'
  | 'FR'
  | 'GA'
  | 'GB'
  | 'GD'
  | 'GE'
  | 'GF'
  | 'GG'
  | 'GH'
  | 'GI'
  | 'GL'
  | 'GM'
  | 'GN'
  | 'GP'
  | 'GQ'
  | 'GR'
  | 'GS'
  | 'GT'
  | 'GU'
  | 'GW'
  | 'GY'
  | 'HK'
  | 'HM'
  | 'HN'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IL'
  | 'IM'
  | 'IN'
  | 'IO'
  | 'IQ'
  | 'IR'
  | 'IS'
  | 'IT'
  | 'JE'
  | 'JM'
  | 'JO'
  | 'JP'
  | 'KE'
  | 'KG'
  | 'KH'
  | 'KI'
  | 'KM'
  | 'KN'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KY'
  | 'KZ'
  | 'LA'
  | 'LB'
  | 'LC'
  | 'LI'
  | 'LK'
  | 'LR'
  | 'LS'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'LY'
  | 'MA'
  | 'MC'
  | 'MD'
  | 'ME'
  | 'MF'
  | 'MG'
  | 'MH'
  | 'MK'
  | 'ML'
  | 'MM'
  | 'MN'
  | 'MO'
  | 'MP'
  | 'MQ'
  | 'MR'
  | 'MS'
  | 'MT'
  | 'MU'
  | 'MV'
  | 'MW'
  | 'MX'
  | 'MY'
  | 'MZ'
  | 'NA'
  | 'NC'
  | 'NE'
  | 'NF'
  | 'NG'
  | 'NI'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NR'
  | 'NU'
  | 'NZ'
  | 'OM'
  | 'PA'
  | 'PE'
  | 'PF'
  | 'PG'
  | 'PH'
  | 'PK'
  | 'PL'
  | 'PM'
  | 'PN'
  | 'PR'
  | 'PS'
  | 'PT'
  | 'PW'
  | 'PY'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'RU'
  | 'RW'
  | 'SA'
  | 'SB'
  | 'SC'
  | 'SD'
  | 'SE'
  | 'SG'
  | 'SH'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SL'
  | 'SM'
  | 'SN'
  | 'SO'
  | 'SR'
  | 'SS'
  | 'ST'
  | 'SV'
  | 'SX'
  | 'SY'
  | 'SZ'
  | 'TC'
  | 'TD'
  | 'TF'
  | 'TG'
  | 'TH'
  | 'TJ'
  | 'TK'
  | 'TL'
  | 'TM'
  | 'TN'
  | 'TO'
  | 'TR'
  | 'TT'
  | 'TV'
  | 'TW'
  | 'TZ'
  | 'UA'
  | 'UG'
  | 'UM'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VA'
  | 'VC'
  | 'VE'
  | 'VG'
  | 'VI'
  | 'VN'
  | 'VU'
  | 'WF'
  | 'WS'
  | 'XK'
  | 'YE'
  | 'YT'
  | 'ZA'
  | 'ZM'
  | 'ZW';

export type LanguageCodeEnum =
  | 'AF'
  | 'AF_NA'
  | 'AF_ZA'
  | 'AGQ'
  | 'AGQ_CM'
  | 'AK'
  | 'AK_GH'
  | 'AM'
  | 'AM_ET'
  | 'AR'
  | 'AR_AE'
  | 'AR_BH'
  | 'AR_DJ'
  | 'AR_DZ'
  | 'AR_EG'
  | 'AR_EH'
  | 'AR_ER'
  | 'AR_IL'
  | 'AR_IQ'
  | 'AR_JO'
  | 'AR_KM'
  | 'AR_KW'
  | 'AR_LB'
  | 'AR_LY'
  | 'AR_MA'
  | 'AR_MR'
  | 'AR_OM'
  | 'AR_PS'
  | 'AR_QA'
  | 'AR_SA'
  | 'AR_SD'
  | 'AR_SO'
  | 'AR_SS'
  | 'AR_SY'
  | 'AR_TD'
  | 'AR_TN'
  | 'AR_YE'
  | 'AS'
  | 'ASA'
  | 'ASA_TZ'
  | 'AST'
  | 'AST_ES'
  | 'AS_IN'
  | 'AZ'
  | 'AZ_CYRL'
  | 'AZ_CYRL_AZ'
  | 'AZ_LATN'
  | 'AZ_LATN_AZ'
  | 'BAS'
  | 'BAS_CM'
  | 'BE'
  | 'BEM'
  | 'BEM_ZM'
  | 'BEZ'
  | 'BEZ_TZ'
  | 'BE_BY'
  | 'BG'
  | 'BG_BG'
  | 'BM'
  | 'BM_ML'
  | 'BN'
  | 'BN_BD'
  | 'BN_IN'
  | 'BO'
  | 'BO_CN'
  | 'BO_IN'
  | 'BR'
  | 'BRX'
  | 'BRX_IN'
  | 'BR_FR'
  | 'BS'
  | 'BS_CYRL'
  | 'BS_CYRL_BA'
  | 'BS_LATN'
  | 'BS_LATN_BA'
  | 'CA'
  | 'CA_AD'
  | 'CA_ES'
  | 'CA_ES_VALENCIA'
  | 'CA_FR'
  | 'CA_IT'
  | 'CCP'
  | 'CCP_BD'
  | 'CCP_IN'
  | 'CE'
  | 'CEB'
  | 'CEB_PH'
  | 'CE_RU'
  | 'CGG'
  | 'CGG_UG'
  | 'CHR'
  | 'CHR_US'
  | 'CKB'
  | 'CKB_IQ'
  | 'CKB_IR'
  | 'CS'
  | 'CS_CZ'
  | 'CU'
  | 'CU_RU'
  | 'CY'
  | 'CY_GB'
  | 'DA'
  | 'DAV'
  | 'DAV_KE'
  | 'DA_DK'
  | 'DA_GL'
  | 'DE'
  | 'DE_AT'
  | 'DE_BE'
  | 'DE_CH'
  | 'DE_DE'
  | 'DE_IT'
  | 'DE_LI'
  | 'DE_LU'
  | 'DJE'
  | 'DJE_NE'
  | 'DSB'
  | 'DSB_DE'
  | 'DUA'
  | 'DUA_CM'
  | 'DYO'
  | 'DYO_SN'
  | 'DZ'
  | 'DZ_BT'
  | 'EBU'
  | 'EBU_KE'
  | 'EE'
  | 'EE_GH'
  | 'EE_TG'
  | 'EL'
  | 'EL_CY'
  | 'EL_GR'
  | 'EN'
  | 'EN_AE'
  | 'EN_AG'
  | 'EN_AI'
  | 'EN_AS'
  | 'EN_AT'
  | 'EN_AU'
  | 'EN_BB'
  | 'EN_BE'
  | 'EN_BI'
  | 'EN_BM'
  | 'EN_BS'
  | 'EN_BW'
  | 'EN_BZ'
  | 'EN_CA'
  | 'EN_CC'
  | 'EN_CH'
  | 'EN_CK'
  | 'EN_CM'
  | 'EN_CX'
  | 'EN_CY'
  | 'EN_DE'
  | 'EN_DG'
  | 'EN_DK'
  | 'EN_DM'
  | 'EN_ER'
  | 'EN_FI'
  | 'EN_FJ'
  | 'EN_FK'
  | 'EN_FM'
  | 'EN_GB'
  | 'EN_GD'
  | 'EN_GG'
  | 'EN_GH'
  | 'EN_GI'
  | 'EN_GM'
  | 'EN_GU'
  | 'EN_GY'
  | 'EN_HK'
  | 'EN_IE'
  | 'EN_IL'
  | 'EN_IM'
  | 'EN_IN'
  | 'EN_IO'
  | 'EN_JE'
  | 'EN_JM'
  | 'EN_KE'
  | 'EN_KI'
  | 'EN_KN'
  | 'EN_KY'
  | 'EN_LC'
  | 'EN_LR'
  | 'EN_LS'
  | 'EN_MG'
  | 'EN_MH'
  | 'EN_MO'
  | 'EN_MP'
  | 'EN_MS'
  | 'EN_MT'
  | 'EN_MU'
  | 'EN_MW'
  | 'EN_MY'
  | 'EN_NA'
  | 'EN_NF'
  | 'EN_NG'
  | 'EN_NL'
  | 'EN_NR'
  | 'EN_NU'
  | 'EN_NZ'
  | 'EN_PG'
  | 'EN_PH'
  | 'EN_PK'
  | 'EN_PN'
  | 'EN_PR'
  | 'EN_PW'
  | 'EN_RW'
  | 'EN_SB'
  | 'EN_SC'
  | 'EN_SD'
  | 'EN_SE'
  | 'EN_SG'
  | 'EN_SH'
  | 'EN_SI'
  | 'EN_SL'
  | 'EN_SS'
  | 'EN_SX'
  | 'EN_SZ'
  | 'EN_TC'
  | 'EN_TK'
  | 'EN_TO'
  | 'EN_TT'
  | 'EN_TV'
  | 'EN_TZ'
  | 'EN_UG'
  | 'EN_UM'
  | 'EN_US'
  | 'EN_VC'
  | 'EN_VG'
  | 'EN_VI'
  | 'EN_VU'
  | 'EN_WS'
  | 'EN_ZA'
  | 'EN_ZM'
  | 'EN_ZW'
  | 'EO'
  | 'ES'
  | 'ES_AR'
  | 'ES_BO'
  | 'ES_BR'
  | 'ES_BZ'
  | 'ES_CL'
  | 'ES_CO'
  | 'ES_CR'
  | 'ES_CU'
  | 'ES_DO'
  | 'ES_EA'
  | 'ES_EC'
  | 'ES_ES'
  | 'ES_GQ'
  | 'ES_GT'
  | 'ES_HN'
  | 'ES_IC'
  | 'ES_MX'
  | 'ES_NI'
  | 'ES_PA'
  | 'ES_PE'
  | 'ES_PH'
  | 'ES_PR'
  | 'ES_PY'
  | 'ES_SV'
  | 'ES_US'
  | 'ES_UY'
  | 'ES_VE'
  | 'ET'
  | 'ET_EE'
  | 'EU'
  | 'EU_ES'
  | 'EWO'
  | 'EWO_CM'
  | 'FA'
  | 'FA_AF'
  | 'FA_IR'
  | 'FF'
  | 'FF_ADLM'
  | 'FF_ADLM_BF'
  | 'FF_ADLM_CM'
  | 'FF_ADLM_GH'
  | 'FF_ADLM_GM'
  | 'FF_ADLM_GN'
  | 'FF_ADLM_GW'
  | 'FF_ADLM_LR'
  | 'FF_ADLM_MR'
  | 'FF_ADLM_NE'
  | 'FF_ADLM_NG'
  | 'FF_ADLM_SL'
  | 'FF_ADLM_SN'
  | 'FF_LATN'
  | 'FF_LATN_BF'
  | 'FF_LATN_CM'
  | 'FF_LATN_GH'
  | 'FF_LATN_GM'
  | 'FF_LATN_GN'
  | 'FF_LATN_GW'
  | 'FF_LATN_LR'
  | 'FF_LATN_MR'
  | 'FF_LATN_NE'
  | 'FF_LATN_NG'
  | 'FF_LATN_SL'
  | 'FF_LATN_SN'
  | 'FI'
  | 'FIL'
  | 'FIL_PH'
  | 'FI_FI'
  | 'FO'
  | 'FO_DK'
  | 'FO_FO'
  | 'FR'
  | 'FR_BE'
  | 'FR_BF'
  | 'FR_BI'
  | 'FR_BJ'
  | 'FR_BL'
  | 'FR_CA'
  | 'FR_CD'
  | 'FR_CF'
  | 'FR_CG'
  | 'FR_CH'
  | 'FR_CI'
  | 'FR_CM'
  | 'FR_DJ'
  | 'FR_DZ'
  | 'FR_FR'
  | 'FR_GA'
  | 'FR_GF'
  | 'FR_GN'
  | 'FR_GP'
  | 'FR_GQ'
  | 'FR_HT'
  | 'FR_KM'
  | 'FR_LU'
  | 'FR_MA'
  | 'FR_MC'
  | 'FR_MF'
  | 'FR_MG'
  | 'FR_ML'
  | 'FR_MQ'
  | 'FR_MR'
  | 'FR_MU'
  | 'FR_NC'
  | 'FR_NE'
  | 'FR_PF'
  | 'FR_PM'
  | 'FR_RE'
  | 'FR_RW'
  | 'FR_SC'
  | 'FR_SN'
  | 'FR_SY'
  | 'FR_TD'
  | 'FR_TG'
  | 'FR_TN'
  | 'FR_VU'
  | 'FR_WF'
  | 'FR_YT'
  | 'FUR'
  | 'FUR_IT'
  | 'FY'
  | 'FY_NL'
  | 'GA'
  | 'GA_GB'
  | 'GA_IE'
  | 'GD'
  | 'GD_GB'
  | 'GL'
  | 'GL_ES'
  | 'GSW'
  | 'GSW_CH'
  | 'GSW_FR'
  | 'GSW_LI'
  | 'GU'
  | 'GUZ'
  | 'GUZ_KE'
  | 'GU_IN'
  | 'GV'
  | 'GV_IM'
  | 'HA'
  | 'HAW'
  | 'HAW_US'
  | 'HA_GH'
  | 'HA_NE'
  | 'HA_NG'
  | 'HE'
  | 'HE_IL'
  | 'HI'
  | 'HI_IN'
  | 'HR'
  | 'HR_BA'
  | 'HR_HR'
  | 'HSB'
  | 'HSB_DE'
  | 'HU'
  | 'HU_HU'
  | 'HY'
  | 'HY_AM'
  | 'IA'
  | 'ID'
  | 'ID_ID'
  | 'IG'
  | 'IG_NG'
  | 'II'
  | 'II_CN'
  | 'IS'
  | 'IS_IS'
  | 'IT'
  | 'IT_CH'
  | 'IT_IT'
  | 'IT_SM'
  | 'IT_VA'
  | 'JA'
  | 'JA_JP'
  | 'JGO'
  | 'JGO_CM'
  | 'JMC'
  | 'JMC_TZ'
  | 'JV'
  | 'JV_ID'
  | 'KA'
  | 'KAB'
  | 'KAB_DZ'
  | 'KAM'
  | 'KAM_KE'
  | 'KA_GE'
  | 'KDE'
  | 'KDE_TZ'
  | 'KEA'
  | 'KEA_CV'
  | 'KHQ'
  | 'KHQ_ML'
  | 'KI'
  | 'KI_KE'
  | 'KK'
  | 'KKJ'
  | 'KKJ_CM'
  | 'KK_KZ'
  | 'KL'
  | 'KLN'
  | 'KLN_KE'
  | 'KL_GL'
  | 'KM'
  | 'KM_KH'
  | 'KN'
  | 'KN_IN'
  | 'KO'
  | 'KOK'
  | 'KOK_IN'
  | 'KO_KP'
  | 'KO_KR'
  | 'KS'
  | 'KSB'
  | 'KSB_TZ'
  | 'KSF'
  | 'KSF_CM'
  | 'KSH'
  | 'KSH_DE'
  | 'KS_ARAB'
  | 'KS_ARAB_IN'
  | 'KU'
  | 'KU_TR'
  | 'KW'
  | 'KW_GB'
  | 'KY'
  | 'KY_KG'
  | 'LAG'
  | 'LAG_TZ'
  | 'LB'
  | 'LB_LU'
  | 'LG'
  | 'LG_UG'
  | 'LKT'
  | 'LKT_US'
  | 'LN'
  | 'LN_AO'
  | 'LN_CD'
  | 'LN_CF'
  | 'LN_CG'
  | 'LO'
  | 'LO_LA'
  | 'LRC'
  | 'LRC_IQ'
  | 'LRC_IR'
  | 'LT'
  | 'LT_LT'
  | 'LU'
  | 'LUO'
  | 'LUO_KE'
  | 'LUY'
  | 'LUY_KE'
  | 'LU_CD'
  | 'LV'
  | 'LV_LV'
  | 'MAI'
  | 'MAI_IN'
  | 'MAS'
  | 'MAS_KE'
  | 'MAS_TZ'
  | 'MER'
  | 'MER_KE'
  | 'MFE'
  | 'MFE_MU'
  | 'MG'
  | 'MGH'
  | 'MGH_MZ'
  | 'MGO'
  | 'MGO_CM'
  | 'MG_MG'
  | 'MI'
  | 'MI_NZ'
  | 'MK'
  | 'MK_MK'
  | 'ML'
  | 'ML_IN'
  | 'MN'
  | 'MNI'
  | 'MNI_BENG'
  | 'MNI_BENG_IN'
  | 'MN_MN'
  | 'MR'
  | 'MR_IN'
  | 'MS'
  | 'MS_BN'
  | 'MS_ID'
  | 'MS_MY'
  | 'MS_SG'
  | 'MT'
  | 'MT_MT'
  | 'MUA'
  | 'MUA_CM'
  | 'MY'
  | 'MY_MM'
  | 'MZN'
  | 'MZN_IR'
  | 'NAQ'
  | 'NAQ_NA'
  | 'NB'
  | 'NB_NO'
  | 'NB_SJ'
  | 'ND'
  | 'NDS'
  | 'NDS_DE'
  | 'NDS_NL'
  | 'ND_ZW'
  | 'NE'
  | 'NE_IN'
  | 'NE_NP'
  | 'NL'
  | 'NL_AW'
  | 'NL_BE'
  | 'NL_BQ'
  | 'NL_CW'
  | 'NL_NL'
  | 'NL_SR'
  | 'NL_SX'
  | 'NMG'
  | 'NMG_CM'
  | 'NN'
  | 'NNH'
  | 'NNH_CM'
  | 'NN_NO'
  | 'NUS'
  | 'NUS_SS'
  | 'NYN'
  | 'NYN_UG'
  | 'OM'
  | 'OM_ET'
  | 'OM_KE'
  | 'OR'
  | 'OR_IN'
  | 'OS'
  | 'OS_GE'
  | 'OS_RU'
  | 'PA'
  | 'PA_ARAB'
  | 'PA_ARAB_PK'
  | 'PA_GURU'
  | 'PA_GURU_IN'
  | 'PCM'
  | 'PCM_NG'
  | 'PL'
  | 'PL_PL'
  | 'PRG'
  | 'PS'
  | 'PS_AF'
  | 'PS_PK'
  | 'PT'
  | 'PT_AO'
  | 'PT_BR'
  | 'PT_CH'
  | 'PT_CV'
  | 'PT_GQ'
  | 'PT_GW'
  | 'PT_LU'
  | 'PT_MO'
  | 'PT_MZ'
  | 'PT_PT'
  | 'PT_ST'
  | 'PT_TL'
  | 'QU'
  | 'QU_BO'
  | 'QU_EC'
  | 'QU_PE'
  | 'RM'
  | 'RM_CH'
  | 'RN'
  | 'RN_BI'
  | 'RO'
  | 'ROF'
  | 'ROF_TZ'
  | 'RO_MD'
  | 'RO_RO'
  | 'RU'
  | 'RU_BY'
  | 'RU_KG'
  | 'RU_KZ'
  | 'RU_MD'
  | 'RU_RU'
  | 'RU_UA'
  | 'RW'
  | 'RWK'
  | 'RWK_TZ'
  | 'RW_RW'
  | 'SAH'
  | 'SAH_RU'
  | 'SAQ'
  | 'SAQ_KE'
  | 'SAT'
  | 'SAT_OLCK'
  | 'SAT_OLCK_IN'
  | 'SBP'
  | 'SBP_TZ'
  | 'SD'
  | 'SD_ARAB'
  | 'SD_ARAB_PK'
  | 'SD_DEVA'
  | 'SD_DEVA_IN'
  | 'SE'
  | 'SEH'
  | 'SEH_MZ'
  | 'SES'
  | 'SES_ML'
  | 'SE_FI'
  | 'SE_NO'
  | 'SE_SE'
  | 'SG'
  | 'SG_CF'
  | 'SHI'
  | 'SHI_LATN'
  | 'SHI_LATN_MA'
  | 'SHI_TFNG'
  | 'SHI_TFNG_MA'
  | 'SI'
  | 'SI_LK'
  | 'SK'
  | 'SK_SK'
  | 'SL'
  | 'SL_SI'
  | 'SMN'
  | 'SMN_FI'
  | 'SN'
  | 'SN_ZW'
  | 'SO'
  | 'SO_DJ'
  | 'SO_ET'
  | 'SO_KE'
  | 'SO_SO'
  | 'SQ'
  | 'SQ_AL'
  | 'SQ_MK'
  | 'SQ_XK'
  | 'SR'
  | 'SR_CYRL'
  | 'SR_CYRL_BA'
  | 'SR_CYRL_ME'
  | 'SR_CYRL_RS'
  | 'SR_CYRL_XK'
  | 'SR_LATN'
  | 'SR_LATN_BA'
  | 'SR_LATN_ME'
  | 'SR_LATN_RS'
  | 'SR_LATN_XK'
  | 'SU'
  | 'SU_LATN'
  | 'SU_LATN_ID'
  | 'SV'
  | 'SV_AX'
  | 'SV_FI'
  | 'SV_SE'
  | 'SW'
  | 'SW_CD'
  | 'SW_KE'
  | 'SW_TZ'
  | 'SW_UG'
  | 'TA'
  | 'TA_IN'
  | 'TA_LK'
  | 'TA_MY'
  | 'TA_SG'
  | 'TE'
  | 'TEO'
  | 'TEO_KE'
  | 'TEO_UG'
  | 'TE_IN'
  | 'TG'
  | 'TG_TJ'
  | 'TH'
  | 'TH_TH'
  | 'TI'
  | 'TI_ER'
  | 'TI_ET'
  | 'TK'
  | 'TK_TM'
  | 'TO'
  | 'TO_TO'
  | 'TR'
  | 'TR_CY'
  | 'TR_TR'
  | 'TT'
  | 'TT_RU'
  | 'TWQ'
  | 'TWQ_NE'
  | 'TZM'
  | 'TZM_MA'
  | 'UG'
  | 'UG_CN'
  | 'UK'
  | 'UK_UA'
  | 'UR'
  | 'UR_IN'
  | 'UR_PK'
  | 'UZ'
  | 'UZ_ARAB'
  | 'UZ_ARAB_AF'
  | 'UZ_CYRL'
  | 'UZ_CYRL_UZ'
  | 'UZ_LATN'
  | 'UZ_LATN_UZ'
  | 'VAI'
  | 'VAI_LATN'
  | 'VAI_LATN_LR'
  | 'VAI_VAII'
  | 'VAI_VAII_LR'
  | 'VI'
  | 'VI_VN'
  | 'VO'
  | 'VUN'
  | 'VUN_TZ'
  | 'WAE'
  | 'WAE_CH'
  | 'WO'
  | 'WO_SN'
  | 'XH'
  | 'XH_ZA'
  | 'XOG'
  | 'XOG_UG'
  | 'YAV'
  | 'YAV_CM'
  | 'YI'
  | 'YO'
  | 'YO_BJ'
  | 'YO_NG'
  | 'YUE'
  | 'YUE_HANS'
  | 'YUE_HANS_CN'
  | 'YUE_HANT'
  | 'YUE_HANT_HK'
  | 'ZGH'
  | 'ZGH_MA'
  | 'ZH'
  | 'ZH_HANS'
  | 'ZH_HANS_CN'
  | 'ZH_HANS_HK'
  | 'ZH_HANS_MO'
  | 'ZH_HANS_SG'
  | 'ZH_HANT'
  | 'ZH_HANT_HK'
  | 'ZH_HANT_MO'
  | 'ZH_HANT_TW'
  | 'ZU'
  | 'ZU_ZA';

/**
 * Determine the mark as paid strategy for the channel.
 *
 *     TRANSACTION_FLOW - new orders marked as paid will receive a
 *     `TransactionItem` object, that will cover the `order.total`.
 *
 *     PAYMENT_FLOW - new orders marked as paid will receive a
 *     `Payment` object, that will cover the `order.total`.
 */
export type MarkAsPaidStrategyEnum =
  | 'PAYMENT_FLOW'
  | 'TRANSACTION_FLOW';

export type MeasurementUnitsEnum =
  | 'ACRE_FT'
  | 'ACRE_IN'
  | 'CM'
  | 'CUBIC_CENTIMETER'
  | 'CUBIC_DECIMETER'
  | 'CUBIC_FOOT'
  | 'CUBIC_INCH'
  | 'CUBIC_METER'
  | 'CUBIC_MILLIMETER'
  | 'CUBIC_YARD'
  | 'DM'
  | 'FL_OZ'
  | 'FT'
  | 'G'
  | 'INCH'
  | 'KG'
  | 'KM'
  | 'LB'
  | 'LITER'
  | 'M'
  | 'MM'
  | 'OZ'
  | 'PINT'
  | 'QT'
  | 'SQ_CM'
  | 'SQ_DM'
  | 'SQ_FT'
  | 'SQ_INCH'
  | 'SQ_KM'
  | 'SQ_M'
  | 'SQ_MM'
  | 'SQ_YD'
  | 'TONNE'
  | 'YD';

export type MetadataInput = {
  /** Key of a metadata item. */
  key: Scalars['String']['input'];
  /** Value of a metadata item. */
  value: Scalars['String']['input'];
};

export type OrderSettingsInput = {
  /** Determine if it is possible to place unpaid order by calling `checkoutComplete` mutation. */
  allowUnpaidOrders?: InputMaybe<Scalars['Boolean']['input']>;
  /** When disabled, all new orders from checkout will be marked as unconfirmed. When enabled orders from checkout will become unfulfilled immediately. By default set to True */
  automaticallyConfirmAllNewOrders?: InputMaybe<Scalars['Boolean']['input']>;
  /** When enabled, all non-shippable gift card orders will be fulfilled automatically. By default set to True. */
  automaticallyFulfillNonShippableGiftCard?: InputMaybe<Scalars['Boolean']['input']>;
  /** The time in days after expired orders will be deleted.Allowed range is from 1 to 120. */
  deleteExpiredOrdersAfter?: InputMaybe<Scalars['Day']['input']>;
  /**
   * Time in hours after which the draft order line price will be refreshed. Default value is 24 hours. Enter 0 or null to disable.
   *
   * Added in Saleor 3.21.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  draftOrderLinePriceFreezePeriod?: InputMaybe<Scalars['Hour']['input']>;
  /** Expiration time in minutes. Default null - means do not expire any orders. Enter 0 or null to disable. */
  expireOrdersAfter?: InputMaybe<Scalars['Minute']['input']>;
  /**
   * Specify whether a coupon applied to draft orders will count toward voucher usage.
   *
   * Warning:  when switching this setting from `false` to `true`, the vouchers will be disconnected from all draft orders.
   *
   * Added in Saleor 3.18.
   *
   * Note: this API is currently in Feature Preview and can be subject to changes at later point.
   */
  includeDraftOrderInVoucherUsage?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Determine what strategy will be used to mark the order as paid. Based on the chosen option, the proper object will be created and attached to the order when it's manually marked as paid.
   * `PAYMENT_FLOW` - [default option] creates the `Payment` object.
   * `TRANSACTION_FLOW` - creates the `TransactionItem` object.
   */
  markAsPaidStrategy?: InputMaybe<MarkAsPaidStrategyEnum>;
  /**
   * This flag only affects orders created from checkout and applies specifically to vouchers of the types: `SPECIFIC_PRODUCT` and `ENTIRE_ORDER` with `applyOncePerOrder` enabled.
   * - When legacy propagation is enabled, discounts from these vouchers are represented as `OrderDiscount` objects, attached to the order and returned in the `Order.discounts` field. Additionally, percentage-based vouchers are converted to fixed-value discounts.
   * - When legacy propagation is disabled, discounts are represented as `OrderLineDiscount` objects, attached to individual lines and returned in the `OrderLine.discounts` field. In this case, percentage-based vouchers retain their original type.
   * In future releases, `OrderLineDiscount` will become the default behavior, and this flag will be deprecated and removed.
   *
   * Added in Saleor 3.21.
   */
  useLegacyLineDiscountPropagation?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PaymentSettingsInput = {
  /**
   * Specifies the earliest date on which funds for expired checkouts can begin to be released. Expired checkouts dated before this cut-off will not have their funds released. Additionally, no funds will be released for checkouts that are more than one year old, regardless of the cut-off date.
   *
   * Added in Saleor 3.20.
   */
  checkoutReleaseFundsCutOffDate?: InputMaybe<Scalars['DateTime']['input']>;
  /**
   * The time in hours after which funds for expired checkouts will be released.
   *
   * Added in Saleor 3.20.
   */
  checkoutTtlBeforeReleasingFunds?: InputMaybe<Scalars['Hour']['input']>;
  /** Determine the transaction flow strategy to be used. Include the selected option in the payload sent to the payment app, as a requested action for the transaction. */
  defaultTransactionFlowStrategy?: InputMaybe<TransactionFlowStrategyEnum>;
  /**
   * Determine if the funds for expired checkouts should be released automatically.
   *
   * Added in Saleor 3.20.
   */
  releaseFundsForExpiredCheckouts?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PostalCodeRuleInclusionTypeEnum =
  | 'EXCLUDE'
  | 'INCLUDE';

export type ProductMediaType =
  | 'IMAGE'
  | 'VIDEO';

export type ProductTypeKindEnum =
  | 'GIFT_CARD'
  | 'NORMAL';

export type ShippingMethodTypeEnum =
  | 'PRICE'
  | 'WEIGHT';

export type StockSettingsInput = {
  /** Allocation strategy options. Strategy defines the preference of warehouses for allocations and reservations. */
  allocationStrategy: AllocationStrategyEnum;
};

export type TaxCalculationStrategy =
  | 'FLAT_RATES'
  | 'TAX_APP';

/**
 * Determine the transaction flow strategy.
 *
 *     AUTHORIZATION - the processed transaction should be only authorized
 *     CHARGE - the processed transaction should be charged.
 */
export type TransactionFlowStrategyEnum =
  | 'AUTHORIZATION'
  | 'CHARGE';

export type WarehouseClickAndCollectOptionEnum =
  | 'ALL'
  | 'DISABLED'
  | 'LOCAL';

export type WeightUnitsEnum =
  | 'G'
  | 'KG'
  | 'LB'
  | 'OZ'
  | 'TONNE';
