import {
  FieldPolicy,
  FieldReadFunction,
  TypePolicies,
  TypePolicy
} from "@apollo/client/cache";
export type AccountAddressCreateKeySpecifier = Array<
  | "user"
  | "accountErrors"
  | "errors"
  | "address"
  | AccountAddressCreateKeySpecifier
>;
export interface AccountAddressCreateFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountAddressDeleteKeySpecifier = Array<
  | "user"
  | "accountErrors"
  | "errors"
  | "address"
  | AccountAddressDeleteKeySpecifier
>;
export interface AccountAddressDeleteFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountAddressUpdateKeySpecifier = Array<
  | "user"
  | "accountErrors"
  | "errors"
  | "address"
  | AccountAddressUpdateKeySpecifier
>;
export interface AccountAddressUpdateFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountDeleteKeySpecifier = Array<
  "accountErrors" | "errors" | "user" | AccountDeleteKeySpecifier
>;
export interface AccountDeleteFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountErrorKeySpecifier = Array<
  "field" | "message" | "code" | "addressType" | AccountErrorKeySpecifier
>;
export interface AccountErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  addressType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountRegisterKeySpecifier = Array<
  | "requiresConfirmation"
  | "accountErrors"
  | "errors"
  | "user"
  | AccountRegisterKeySpecifier
>;
export interface AccountRegisterFieldPolicy {
  requiresConfirmation?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountRequestDeletionKeySpecifier = Array<
  "accountErrors" | "errors" | AccountRequestDeletionKeySpecifier
>;
export interface AccountRequestDeletionFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountSetDefaultAddressKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | AccountSetDefaultAddressKeySpecifier
>;
export interface AccountSetDefaultAddressFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AccountUpdateKeySpecifier = Array<
  "accountErrors" | "errors" | "user" | AccountUpdateKeySpecifier
>;
export interface AccountUpdateFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AddressKeySpecifier = Array<
  | "id"
  | "firstName"
  | "lastName"
  | "companyName"
  | "streetAddress1"
  | "streetAddress2"
  | "city"
  | "cityArea"
  | "postalCode"
  | "country"
  | "countryArea"
  | "phone"
  | "isDefaultShippingAddress"
  | "isDefaultBillingAddress"
  | AddressKeySpecifier
>;
export interface AddressFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  firstName?: FieldPolicy<any> | FieldReadFunction<any>;
  lastName?: FieldPolicy<any> | FieldReadFunction<any>;
  companyName?: FieldPolicy<any> | FieldReadFunction<any>;
  streetAddress1?: FieldPolicy<any> | FieldReadFunction<any>;
  streetAddress2?: FieldPolicy<any> | FieldReadFunction<any>;
  city?: FieldPolicy<any> | FieldReadFunction<any>;
  cityArea?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCode?: FieldPolicy<any> | FieldReadFunction<any>;
  country?: FieldPolicy<any> | FieldReadFunction<any>;
  countryArea?: FieldPolicy<any> | FieldReadFunction<any>;
  phone?: FieldPolicy<any> | FieldReadFunction<any>;
  isDefaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  isDefaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AddressCreateKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | "address" | AddressCreateKeySpecifier
>;
export interface AddressCreateFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AddressDeleteKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | "address" | AddressDeleteKeySpecifier
>;
export interface AddressDeleteFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AddressSetDefaultKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | AddressSetDefaultKeySpecifier
>;
export interface AddressSetDefaultFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AddressUpdateKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | "address" | AddressUpdateKeySpecifier
>;
export interface AddressUpdateFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AddressValidationDataKeySpecifier = Array<
  | "countryCode"
  | "countryName"
  | "addressFormat"
  | "addressLatinFormat"
  | "allowedFields"
  | "requiredFields"
  | "upperFields"
  | "countryAreaType"
  | "countryAreaChoices"
  | "cityType"
  | "cityChoices"
  | "cityAreaType"
  | "cityAreaChoices"
  | "postalCodeType"
  | "postalCodeMatchers"
  | "postalCodeExamples"
  | "postalCodePrefix"
  | AddressValidationDataKeySpecifier
>;
export interface AddressValidationDataFieldPolicy {
  countryCode?: FieldPolicy<any> | FieldReadFunction<any>;
  countryName?: FieldPolicy<any> | FieldReadFunction<any>;
  addressFormat?: FieldPolicy<any> | FieldReadFunction<any>;
  addressLatinFormat?: FieldPolicy<any> | FieldReadFunction<any>;
  allowedFields?: FieldPolicy<any> | FieldReadFunction<any>;
  requiredFields?: FieldPolicy<any> | FieldReadFunction<any>;
  upperFields?: FieldPolicy<any> | FieldReadFunction<any>;
  countryAreaType?: FieldPolicy<any> | FieldReadFunction<any>;
  countryAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>;
  cityType?: FieldPolicy<any> | FieldReadFunction<any>;
  cityChoices?: FieldPolicy<any> | FieldReadFunction<any>;
  cityAreaType?: FieldPolicy<any> | FieldReadFunction<any>;
  cityAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCodeType?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCodeMatchers?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCodeExamples?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCodePrefix?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AllocationKeySpecifier = Array<
  "id" | "quantity" | "warehouse" | AllocationKeySpecifier
>;
export interface AllocationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "permissions"
  | "created"
  | "isActive"
  | "name"
  | "type"
  | "tokens"
  | "webhooks"
  | "aboutApp"
  | "dataPrivacy"
  | "dataPrivacyUrl"
  | "homepageUrl"
  | "supportUrl"
  | "configurationUrl"
  | "appUrl"
  | "version"
  | "accessToken"
  | "extensions"
  | AppKeySpecifier
>;
export interface AppFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  isActive?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  tokens?: FieldPolicy<any> | FieldReadFunction<any>;
  webhooks?: FieldPolicy<any> | FieldReadFunction<any>;
  aboutApp?: FieldPolicy<any> | FieldReadFunction<any>;
  dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>;
  dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  supportUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  appUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  version?: FieldPolicy<any> | FieldReadFunction<any>;
  accessToken?: FieldPolicy<any> | FieldReadFunction<any>;
  extensions?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppActivateKeySpecifier = Array<
  "appErrors" | "errors" | "app" | AppActivateKeySpecifier
>;
export interface AppActivateFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | AppCountableConnectionKeySpecifier
>;
export interface AppCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | AppCountableEdgeKeySpecifier
>;
export interface AppCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppCreateKeySpecifier = Array<
  "authToken" | "appErrors" | "errors" | "app" | AppCreateKeySpecifier
>;
export interface AppCreateFieldPolicy {
  authToken?: FieldPolicy<any> | FieldReadFunction<any>;
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppDeactivateKeySpecifier = Array<
  "appErrors" | "errors" | "app" | AppDeactivateKeySpecifier
>;
export interface AppDeactivateFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppDeleteKeySpecifier = Array<
  "appErrors" | "errors" | "app" | AppDeleteKeySpecifier
>;
export interface AppDeleteFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppDeleteFailedInstallationKeySpecifier = Array<
  | "appErrors"
  | "errors"
  | "appInstallation"
  | AppDeleteFailedInstallationKeySpecifier
>;
export interface AppDeleteFailedInstallationFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  appInstallation?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppErrorKeySpecifier = Array<
  "field" | "message" | "code" | "permissions" | AppErrorKeySpecifier
>;
export interface AppErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppExtensionKeySpecifier = Array<
  | "id"
  | "permissions"
  | "label"
  | "url"
  | "mount"
  | "target"
  | "app"
  | "accessToken"
  | AppExtensionKeySpecifier
>;
export interface AppExtensionFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  label?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  mount?: FieldPolicy<any> | FieldReadFunction<any>;
  target?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  accessToken?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppExtensionCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | AppExtensionCountableConnectionKeySpecifier
>;
export interface AppExtensionCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppExtensionCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | AppExtensionCountableEdgeKeySpecifier
>;
export interface AppExtensionCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppFetchManifestKeySpecifier = Array<
  "manifest" | "appErrors" | "errors" | AppFetchManifestKeySpecifier
>;
export interface AppFetchManifestFieldPolicy {
  manifest?: FieldPolicy<any> | FieldReadFunction<any>;
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppInstallKeySpecifier = Array<
  "appErrors" | "errors" | "appInstallation" | AppInstallKeySpecifier
>;
export interface AppInstallFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  appInstallation?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppInstallationKeySpecifier = Array<
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "message"
  | "appName"
  | "manifestUrl"
  | AppInstallationKeySpecifier
>;
export interface AppInstallationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  appName?: FieldPolicy<any> | FieldReadFunction<any>;
  manifestUrl?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppManifestExtensionKeySpecifier = Array<
  | "permissions"
  | "label"
  | "url"
  | "mount"
  | "target"
  | AppManifestExtensionKeySpecifier
>;
export interface AppManifestExtensionFieldPolicy {
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  label?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  mount?: FieldPolicy<any> | FieldReadFunction<any>;
  target?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppRetryInstallKeySpecifier = Array<
  "appErrors" | "errors" | "appInstallation" | AppRetryInstallKeySpecifier
>;
export interface AppRetryInstallFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  appInstallation?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppTokenKeySpecifier = Array<
  "id" | "name" | "authToken" | AppTokenKeySpecifier
>;
export interface AppTokenFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  authToken?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppTokenCreateKeySpecifier = Array<
  "authToken" | "appErrors" | "errors" | "appToken" | AppTokenCreateKeySpecifier
>;
export interface AppTokenCreateFieldPolicy {
  authToken?: FieldPolicy<any> | FieldReadFunction<any>;
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  appToken?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppTokenDeleteKeySpecifier = Array<
  "appErrors" | "errors" | "appToken" | AppTokenDeleteKeySpecifier
>;
export interface AppTokenDeleteFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  appToken?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppTokenVerifyKeySpecifier = Array<
  "valid" | "appErrors" | "errors" | AppTokenVerifyKeySpecifier
>;
export interface AppTokenVerifyFieldPolicy {
  valid?: FieldPolicy<any> | FieldReadFunction<any>;
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AppUpdateKeySpecifier = Array<
  "appErrors" | "errors" | "app" | AppUpdateKeySpecifier
>;
export interface AppUpdateFieldPolicy {
  appErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AssignNavigationKeySpecifier = Array<
  "menu" | "menuErrors" | "errors" | AssignNavigationKeySpecifier
>;
export interface AssignNavigationFieldPolicy {
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AssignedVariantAttributeKeySpecifier = Array<
  "attribute" | "variantSelection" | AssignedVariantAttributeKeySpecifier
>;
export interface AssignedVariantAttributeFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  variantSelection?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "inputType"
  | "entityType"
  | "name"
  | "slug"
  | "type"
  | "unit"
  | "choices"
  | "valueRequired"
  | "visibleInStorefront"
  | "filterableInStorefront"
  | "filterableInDashboard"
  | "availableInGrid"
  | "translation"
  | "storefrontSearchPosition"
  | "withChoices"
  | "productTypes"
  | "productVariantTypes"
  | AttributeKeySpecifier
>;
export interface AttributeFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  inputType?: FieldPolicy<any> | FieldReadFunction<any>;
  entityType?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  unit?: FieldPolicy<any> | FieldReadFunction<any>;
  choices?: FieldPolicy<any> | FieldReadFunction<any>;
  valueRequired?: FieldPolicy<any> | FieldReadFunction<any>;
  visibleInStorefront?: FieldPolicy<any> | FieldReadFunction<any>;
  filterableInStorefront?: FieldPolicy<any> | FieldReadFunction<any>;
  filterableInDashboard?: FieldPolicy<any> | FieldReadFunction<any>;
  availableInGrid?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  storefrontSearchPosition?: FieldPolicy<any> | FieldReadFunction<any>;
  withChoices?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypes?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantTypes?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeBulkDeleteKeySpecifier = Array<
  "count" | "attributeErrors" | "errors" | AttributeBulkDeleteKeySpecifier
>;
export interface AttributeBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | AttributeCountableConnectionKeySpecifier
>;
export interface AttributeCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | AttributeCountableEdgeKeySpecifier
>;
export interface AttributeCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeCreateKeySpecifier = Array<
  "attribute" | "attributeErrors" | "errors" | AttributeCreateKeySpecifier
>;
export interface AttributeCreateFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeDeleteKeySpecifier = Array<
  "attributeErrors" | "errors" | "attribute" | AttributeDeleteKeySpecifier
>;
export interface AttributeDeleteFieldPolicy {
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeErrorKeySpecifier = Array<
  "field" | "message" | "code" | AttributeErrorKeySpecifier
>;
export interface AttributeErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeReorderValuesKeySpecifier = Array<
  | "attribute"
  | "attributeErrors"
  | "errors"
  | AttributeReorderValuesKeySpecifier
>;
export interface AttributeReorderValuesFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeTranslatableContentKeySpecifier = Array<
  | "id"
  | "name"
  | "translation"
  | "attribute"
  | AttributeTranslatableContentKeySpecifier
>;
export interface AttributeTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "attribute" | AttributeTranslateKeySpecifier
>;
export interface AttributeTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeTranslationKeySpecifier = Array<
  "id" | "language" | "name" | AttributeTranslationKeySpecifier
>;
export interface AttributeTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeUpdateKeySpecifier = Array<
  "attribute" | "attributeErrors" | "errors" | AttributeUpdateKeySpecifier
>;
export interface AttributeUpdateFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueKeySpecifier = Array<
  | "id"
  | "name"
  | "slug"
  | "value"
  | "translation"
  | "inputType"
  | "reference"
  | "file"
  | "richText"
  | "boolean"
  | "date"
  | "dateTime"
  | AttributeValueKeySpecifier
>;
export interface AttributeValueFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  inputType?: FieldPolicy<any> | FieldReadFunction<any>;
  reference?: FieldPolicy<any> | FieldReadFunction<any>;
  file?: FieldPolicy<any> | FieldReadFunction<any>;
  richText?: FieldPolicy<any> | FieldReadFunction<any>;
  boolean?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  dateTime?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueBulkDeleteKeySpecifier = Array<
  "count" | "attributeErrors" | "errors" | AttributeValueBulkDeleteKeySpecifier
>;
export interface AttributeValueBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | AttributeValueCountableConnectionKeySpecifier
>;
export interface AttributeValueCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | AttributeValueCountableEdgeKeySpecifier
>;
export interface AttributeValueCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueCreateKeySpecifier = Array<
  | "attribute"
  | "attributeErrors"
  | "errors"
  | "attributeValue"
  | AttributeValueCreateKeySpecifier
>;
export interface AttributeValueCreateFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValue?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueDeleteKeySpecifier = Array<
  | "attribute"
  | "attributeErrors"
  | "errors"
  | "attributeValue"
  | AttributeValueDeleteKeySpecifier
>;
export interface AttributeValueDeleteFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValue?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueTranslatableContentKeySpecifier = Array<
  | "id"
  | "name"
  | "richText"
  | "translation"
  | "attributeValue"
  | AttributeValueTranslatableContentKeySpecifier
>;
export interface AttributeValueTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  richText?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValue?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueTranslateKeySpecifier = Array<
  | "translationErrors"
  | "errors"
  | "attributeValue"
  | AttributeValueTranslateKeySpecifier
>;
export interface AttributeValueTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValue?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueTranslationKeySpecifier = Array<
  | "id"
  | "language"
  | "name"
  | "richText"
  | AttributeValueTranslationKeySpecifier
>;
export interface AttributeValueTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  richText?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type AttributeValueUpdateKeySpecifier = Array<
  | "attribute"
  | "attributeErrors"
  | "errors"
  | "attributeValue"
  | AttributeValueUpdateKeySpecifier
>;
export interface AttributeValueUpdateFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValue?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type BulkProductErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "attributes"
  | "values"
  | "index"
  | "warehouses"
  | "channels"
  | BulkProductErrorKeySpecifier
>;
export interface BulkProductErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
  index?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouses?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type BulkStockErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "attributes"
  | "values"
  | "index"
  | BulkStockErrorKeySpecifier
>;
export interface BulkStockErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
  index?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "slug"
  | "parent"
  | "level"
  | "descriptionJson"
  | "ancestors"
  | "products"
  | "children"
  | "backgroundImage"
  | "translation"
  | CategoryKeySpecifier
>;
export interface CategoryFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  parent?: FieldPolicy<any> | FieldReadFunction<any>;
  level?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
  ancestors?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  children?: FieldPolicy<any> | FieldReadFunction<any>;
  backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryBulkDeleteKeySpecifier = Array<
  "count" | "productErrors" | "errors" | CategoryBulkDeleteKeySpecifier
>;
export interface CategoryBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | CategoryCountableConnectionKeySpecifier
>;
export interface CategoryCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | CategoryCountableEdgeKeySpecifier
>;
export interface CategoryCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryCreateKeySpecifier = Array<
  "productErrors" | "errors" | "category" | CategoryCreateKeySpecifier
>;
export interface CategoryCreateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryDeleteKeySpecifier = Array<
  "productErrors" | "errors" | "category" | CategoryDeleteKeySpecifier
>;
export interface CategoryDeleteFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryTranslatableContentKeySpecifier = Array<
  | "id"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "descriptionJson"
  | "translation"
  | "category"
  | CategoryTranslatableContentKeySpecifier
>;
export interface CategoryTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "category" | CategoryTranslateKeySpecifier
>;
export interface CategoryTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryTranslationKeySpecifier = Array<
  | "id"
  | "language"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "descriptionJson"
  | CategoryTranslationKeySpecifier
>;
export interface CategoryTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CategoryUpdateKeySpecifier = Array<
  "productErrors" | "errors" | "category" | CategoryUpdateKeySpecifier
>;
export interface CategoryUpdateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelKeySpecifier = Array<
  | "id"
  | "name"
  | "isActive"
  | "currencyCode"
  | "slug"
  | "hasOrders"
  | "defaultCountry"
  | ChannelKeySpecifier
>;
export interface ChannelFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  isActive?: FieldPolicy<any> | FieldReadFunction<any>;
  currencyCode?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  hasOrders?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelActivateKeySpecifier = Array<
  "channel" | "channelErrors" | "errors" | ChannelActivateKeySpecifier
>;
export interface ChannelActivateFieldPolicy {
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  channelErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelCreateKeySpecifier = Array<
  "channelErrors" | "errors" | "channel" | ChannelCreateKeySpecifier
>;
export interface ChannelCreateFieldPolicy {
  channelErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelDeactivateKeySpecifier = Array<
  "channel" | "channelErrors" | "errors" | ChannelDeactivateKeySpecifier
>;
export interface ChannelDeactivateFieldPolicy {
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  channelErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelDeleteKeySpecifier = Array<
  "channelErrors" | "errors" | "channel" | ChannelDeleteKeySpecifier
>;
export interface ChannelDeleteFieldPolicy {
  channelErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelErrorKeySpecifier = Array<
  "field" | "message" | "code" | "shippingZones" | ChannelErrorKeySpecifier
>;
export interface ChannelErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZones?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChannelUpdateKeySpecifier = Array<
  "channelErrors" | "errors" | "channel" | ChannelUpdateKeySpecifier
>;
export interface ChannelUpdateFieldPolicy {
  channelErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "created"
  | "lastChange"
  | "user"
  | "channel"
  | "billingAddress"
  | "shippingAddress"
  | "note"
  | "discount"
  | "discountName"
  | "translatedDiscountName"
  | "voucherCode"
  | "availableShippingMethods"
  | "shippingMethods"
  | "availableCollectionPoints"
  | "availablePaymentGateways"
  | "email"
  | "giftCards"
  | "isShippingRequired"
  | "quantity"
  | "stockReservationExpires"
  | "lines"
  | "shippingPrice"
  | "shippingMethod"
  | "deliveryMethod"
  | "subtotalPrice"
  | "token"
  | "totalPrice"
  | "languageCode"
  | CheckoutKeySpecifier
>;
export interface CheckoutFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  lastChange?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  billingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  note?: FieldPolicy<any> | FieldReadFunction<any>;
  discount?: FieldPolicy<any> | FieldReadFunction<any>;
  discountName?: FieldPolicy<any> | FieldReadFunction<any>;
  translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherCode?: FieldPolicy<any> | FieldReadFunction<any>;
  availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>;
  availableCollectionPoints?: FieldPolicy<any> | FieldReadFunction<any>;
  availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCards?: FieldPolicy<any> | FieldReadFunction<any>;
  isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  stockReservationExpires?: FieldPolicy<any> | FieldReadFunction<any>;
  lines?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  deliveryMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  subtotalPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  totalPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  languageCode?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutAddPromoCodeKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutAddPromoCodeKeySpecifier
>;
export interface CheckoutAddPromoCodeFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutBillingAddressUpdateKeySpecifier = Array<
  | "checkout"
  | "checkoutErrors"
  | "errors"
  | CheckoutBillingAddressUpdateKeySpecifier
>;
export interface CheckoutBillingAddressUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutCompleteKeySpecifier = Array<
  | "order"
  | "confirmationNeeded"
  | "confirmationData"
  | "checkoutErrors"
  | "errors"
  | CheckoutCompleteKeySpecifier
>;
export interface CheckoutCompleteFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  confirmationNeeded?: FieldPolicy<any> | FieldReadFunction<any>;
  confirmationData?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | CheckoutCountableConnectionKeySpecifier
>;
export interface CheckoutCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | CheckoutCountableEdgeKeySpecifier
>;
export interface CheckoutCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutCreateKeySpecifier = Array<
  | "created"
  | "checkoutErrors"
  | "errors"
  | "checkout"
  | CheckoutCreateKeySpecifier
>;
export interface CheckoutCreateFieldPolicy {
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutCustomerAttachKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutCustomerAttachKeySpecifier
>;
export interface CheckoutCustomerAttachFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutCustomerDetachKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutCustomerDetachKeySpecifier
>;
export interface CheckoutCustomerDetachFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutDeliveryMethodUpdateKeySpecifier = Array<
  "checkout" | "errors" | CheckoutDeliveryMethodUpdateKeySpecifier
>;
export interface CheckoutDeliveryMethodUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutEmailUpdateKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutEmailUpdateKeySpecifier
>;
export interface CheckoutEmailUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "variants"
  | "lines"
  | "addressType"
  | CheckoutErrorKeySpecifier
>;
export interface CheckoutErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  variants?: FieldPolicy<any> | FieldReadFunction<any>;
  lines?: FieldPolicy<any> | FieldReadFunction<any>;
  addressType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLanguageCodeUpdateKeySpecifier = Array<
  | "checkout"
  | "checkoutErrors"
  | "errors"
  | CheckoutLanguageCodeUpdateKeySpecifier
>;
export interface CheckoutLanguageCodeUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLineKeySpecifier = Array<
  | "id"
  | "variant"
  | "quantity"
  | "totalPrice"
  | "requiresShipping"
  | CheckoutLineKeySpecifier
>;
export interface CheckoutLineFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  totalPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  requiresShipping?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLineCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | CheckoutLineCountableConnectionKeySpecifier
>;
export interface CheckoutLineCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLineCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | CheckoutLineCountableEdgeKeySpecifier
>;
export interface CheckoutLineCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLineDeleteKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutLineDeleteKeySpecifier
>;
export interface CheckoutLineDeleteFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLinesAddKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutLinesAddKeySpecifier
>;
export interface CheckoutLinesAddFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLinesDeleteKeySpecifier = Array<
  "checkout" | "errors" | CheckoutLinesDeleteKeySpecifier
>;
export interface CheckoutLinesDeleteFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutLinesUpdateKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutLinesUpdateKeySpecifier
>;
export interface CheckoutLinesUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutPaymentCreateKeySpecifier = Array<
  | "checkout"
  | "payment"
  | "paymentErrors"
  | "errors"
  | CheckoutPaymentCreateKeySpecifier
>;
export interface CheckoutPaymentCreateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutRemovePromoCodeKeySpecifier = Array<
  "checkout" | "checkoutErrors" | "errors" | CheckoutRemovePromoCodeKeySpecifier
>;
export interface CheckoutRemovePromoCodeFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutShippingAddressUpdateKeySpecifier = Array<
  | "checkout"
  | "checkoutErrors"
  | "errors"
  | CheckoutShippingAddressUpdateKeySpecifier
>;
export interface CheckoutShippingAddressUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CheckoutShippingMethodUpdateKeySpecifier = Array<
  | "checkout"
  | "checkoutErrors"
  | "errors"
  | CheckoutShippingMethodUpdateKeySpecifier
>;
export interface CheckoutShippingMethodUpdateFieldPolicy {
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ChoiceValueKeySpecifier = Array<
  "raw" | "verbose" | ChoiceValueKeySpecifier
>;
export interface ChoiceValueFieldPolicy {
  raw?: FieldPolicy<any> | FieldReadFunction<any>;
  verbose?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "slug"
  | "channel"
  | "descriptionJson"
  | "products"
  | "backgroundImage"
  | "translation"
  | "channelListings"
  | CollectionKeySpecifier
>;
export interface CollectionFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  channelListings?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionAddProductsKeySpecifier = Array<
  | "collection"
  | "collectionErrors"
  | "errors"
  | CollectionAddProductsKeySpecifier
>;
export interface CollectionAddProductsFieldPolicy {
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionBulkDeleteKeySpecifier = Array<
  "count" | "collectionErrors" | "errors" | CollectionBulkDeleteKeySpecifier
>;
export interface CollectionBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionChannelListingKeySpecifier = Array<
  | "id"
  | "publicationDate"
  | "isPublished"
  | "channel"
  | CollectionChannelListingKeySpecifier
>;
export interface CollectionChannelListingFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  publicationDate?: FieldPolicy<any> | FieldReadFunction<any>;
  isPublished?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionChannelListingErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "attributes"
  | "values"
  | "channels"
  | CollectionChannelListingErrorKeySpecifier
>;
export interface CollectionChannelListingErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionChannelListingUpdateKeySpecifier = Array<
  | "collection"
  | "collectionChannelListingErrors"
  | "errors"
  | CollectionChannelListingUpdateKeySpecifier
>;
export interface CollectionChannelListingUpdateFieldPolicy {
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | CollectionCountableConnectionKeySpecifier
>;
export interface CollectionCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | CollectionCountableEdgeKeySpecifier
>;
export interface CollectionCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionCreateKeySpecifier = Array<
  "collectionErrors" | "errors" | "collection" | CollectionCreateKeySpecifier
>;
export interface CollectionCreateFieldPolicy {
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionDeleteKeySpecifier = Array<
  "collectionErrors" | "errors" | "collection" | CollectionDeleteKeySpecifier
>;
export interface CollectionDeleteFieldPolicy {
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionErrorKeySpecifier = Array<
  "field" | "message" | "products" | "code" | CollectionErrorKeySpecifier
>;
export interface CollectionErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionRemoveProductsKeySpecifier = Array<
  | "collection"
  | "collectionErrors"
  | "errors"
  | CollectionRemoveProductsKeySpecifier
>;
export interface CollectionRemoveProductsFieldPolicy {
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionReorderProductsKeySpecifier = Array<
  | "collection"
  | "collectionErrors"
  | "errors"
  | CollectionReorderProductsKeySpecifier
>;
export interface CollectionReorderProductsFieldPolicy {
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionTranslatableContentKeySpecifier = Array<
  | "id"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "descriptionJson"
  | "translation"
  | "collection"
  | CollectionTranslatableContentKeySpecifier
>;
export interface CollectionTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionTranslateKeySpecifier = Array<
  | "translationErrors"
  | "errors"
  | "collection"
  | CollectionTranslateKeySpecifier
>;
export interface CollectionTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionTranslationKeySpecifier = Array<
  | "id"
  | "language"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "descriptionJson"
  | CollectionTranslationKeySpecifier
>;
export interface CollectionTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CollectionUpdateKeySpecifier = Array<
  "collectionErrors" | "errors" | "collection" | CollectionUpdateKeySpecifier
>;
export interface CollectionUpdateFieldPolicy {
  collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ConfigurationItemKeySpecifier = Array<
  | "name"
  | "value"
  | "type"
  | "helpText"
  | "label"
  | ConfigurationItemKeySpecifier
>;
export interface ConfigurationItemFieldPolicy {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  helpText?: FieldPolicy<any> | FieldReadFunction<any>;
  label?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ConfirmAccountKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | ConfirmAccountKeySpecifier
>;
export interface ConfirmAccountFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ConfirmEmailChangeKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | ConfirmEmailChangeKeySpecifier
>;
export interface ConfirmEmailChangeFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CountryDisplayKeySpecifier = Array<
  "code" | "country" | "vat" | CountryDisplayKeySpecifier
>;
export interface CountryDisplayFieldPolicy {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  country?: FieldPolicy<any> | FieldReadFunction<any>;
  vat?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CreateTokenKeySpecifier = Array<
  | "token"
  | "refreshToken"
  | "csrfToken"
  | "user"
  | "accountErrors"
  | "errors"
  | CreateTokenKeySpecifier
>;
export interface CreateTokenFieldPolicy {
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  refreshToken?: FieldPolicy<any> | FieldReadFunction<any>;
  csrfToken?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CreditCardKeySpecifier = Array<
  | "brand"
  | "firstDigits"
  | "lastDigits"
  | "expMonth"
  | "expYear"
  | CreditCardKeySpecifier
>;
export interface CreditCardFieldPolicy {
  brand?: FieldPolicy<any> | FieldReadFunction<any>;
  firstDigits?: FieldPolicy<any> | FieldReadFunction<any>;
  lastDigits?: FieldPolicy<any> | FieldReadFunction<any>;
  expMonth?: FieldPolicy<any> | FieldReadFunction<any>;
  expYear?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CustomerBulkDeleteKeySpecifier = Array<
  "count" | "accountErrors" | "errors" | CustomerBulkDeleteKeySpecifier
>;
export interface CustomerBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CustomerCreateKeySpecifier = Array<
  "accountErrors" | "errors" | "user" | CustomerCreateKeySpecifier
>;
export interface CustomerCreateFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CustomerDeleteKeySpecifier = Array<
  "accountErrors" | "errors" | "user" | CustomerDeleteKeySpecifier
>;
export interface CustomerDeleteFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CustomerEventKeySpecifier = Array<
  | "id"
  | "date"
  | "type"
  | "user"
  | "app"
  | "message"
  | "count"
  | "order"
  | "orderLine"
  | CustomerEventKeySpecifier
>;
export interface CustomerEventFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type CustomerUpdateKeySpecifier = Array<
  "accountErrors" | "errors" | "user" | CustomerUpdateKeySpecifier
>;
export interface CustomerUpdateFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DeactivateAllUserTokensKeySpecifier = Array<
  "accountErrors" | "errors" | DeactivateAllUserTokensKeySpecifier
>;
export interface DeactivateAllUserTokensFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DeleteMetadataKeySpecifier = Array<
  "metadataErrors" | "errors" | "item" | DeleteMetadataKeySpecifier
>;
export interface DeleteMetadataFieldPolicy {
  metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  item?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DeletePrivateMetadataKeySpecifier = Array<
  "metadataErrors" | "errors" | "item" | DeletePrivateMetadataKeySpecifier
>;
export interface DeletePrivateMetadataFieldPolicy {
  metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  item?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "useDefaultSettings"
  | "automaticFulfillment"
  | "contentFile"
  | "maxDownloads"
  | "urlValidDays"
  | "urls"
  | "productVariant"
  | DigitalContentKeySpecifier
>;
export interface DigitalContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  useDefaultSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  automaticFulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  contentFile?: FieldPolicy<any> | FieldReadFunction<any>;
  maxDownloads?: FieldPolicy<any> | FieldReadFunction<any>;
  urlValidDays?: FieldPolicy<any> | FieldReadFunction<any>;
  urls?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | DigitalContentCountableConnectionKeySpecifier
>;
export interface DigitalContentCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | DigitalContentCountableEdgeKeySpecifier
>;
export interface DigitalContentCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentCreateKeySpecifier = Array<
  | "variant"
  | "content"
  | "productErrors"
  | "errors"
  | DigitalContentCreateKeySpecifier
>;
export interface DigitalContentCreateFieldPolicy {
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentDeleteKeySpecifier = Array<
  "variant" | "productErrors" | "errors" | DigitalContentDeleteKeySpecifier
>;
export interface DigitalContentDeleteFieldPolicy {
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentUpdateKeySpecifier = Array<
  | "variant"
  | "content"
  | "productErrors"
  | "errors"
  | DigitalContentUpdateKeySpecifier
>;
export interface DigitalContentUpdateFieldPolicy {
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentUrlKeySpecifier = Array<
  | "id"
  | "content"
  | "created"
  | "downloadNum"
  | "url"
  | "token"
  | DigitalContentUrlKeySpecifier
>;
export interface DigitalContentUrlFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  downloadNum?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  token?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DigitalContentUrlCreateKeySpecifier = Array<
  | "productErrors"
  | "errors"
  | "digitalContentUrl"
  | DigitalContentUrlCreateKeySpecifier
>;
export interface DigitalContentUrlCreateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DiscountErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "products"
  | "code"
  | "channels"
  | DiscountErrorKeySpecifier
>;
export interface DiscountErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DomainKeySpecifier = Array<
  "host" | "sslEnabled" | "url" | DomainKeySpecifier
>;
export interface DomainFieldPolicy {
  host?: FieldPolicy<any> | FieldReadFunction<any>;
  sslEnabled?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DraftOrderBulkDeleteKeySpecifier = Array<
  "count" | "orderErrors" | "errors" | DraftOrderBulkDeleteKeySpecifier
>;
export interface DraftOrderBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DraftOrderCompleteKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | DraftOrderCompleteKeySpecifier
>;
export interface DraftOrderCompleteFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DraftOrderCreateKeySpecifier = Array<
  "orderErrors" | "errors" | "order" | DraftOrderCreateKeySpecifier
>;
export interface DraftOrderCreateFieldPolicy {
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DraftOrderDeleteKeySpecifier = Array<
  "orderErrors" | "errors" | "order" | DraftOrderDeleteKeySpecifier
>;
export interface DraftOrderDeleteFieldPolicy {
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DraftOrderLinesBulkDeleteKeySpecifier = Array<
  "count" | "orderErrors" | "errors" | DraftOrderLinesBulkDeleteKeySpecifier
>;
export interface DraftOrderLinesBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type DraftOrderUpdateKeySpecifier = Array<
  "orderErrors" | "errors" | "order" | DraftOrderUpdateKeySpecifier
>;
export interface DraftOrderUpdateFieldPolicy {
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryKeySpecifier = Array<
  | "id"
  | "createdAt"
  | "status"
  | "eventType"
  | "attempts"
  | "payload"
  | EventDeliveryKeySpecifier
>;
export interface EventDeliveryFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  eventType?: FieldPolicy<any> | FieldReadFunction<any>;
  attempts?: FieldPolicy<any> | FieldReadFunction<any>;
  payload?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryAttemptKeySpecifier = Array<
  | "id"
  | "createdAt"
  | "taskId"
  | "duration"
  | "response"
  | "responseHeaders"
  | "requestHeaders"
  | "status"
  | EventDeliveryAttemptKeySpecifier
>;
export interface EventDeliveryAttemptFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  taskId?: FieldPolicy<any> | FieldReadFunction<any>;
  duration?: FieldPolicy<any> | FieldReadFunction<any>;
  response?: FieldPolicy<any> | FieldReadFunction<any>;
  responseHeaders?: FieldPolicy<any> | FieldReadFunction<any>;
  requestHeaders?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryAttemptCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | EventDeliveryAttemptCountableConnectionKeySpecifier
>;
export interface EventDeliveryAttemptCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryAttemptCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | EventDeliveryAttemptCountableEdgeKeySpecifier
>;
export interface EventDeliveryAttemptCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | EventDeliveryCountableConnectionKeySpecifier
>;
export interface EventDeliveryCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | EventDeliveryCountableEdgeKeySpecifier
>;
export interface EventDeliveryCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type EventDeliveryRetryKeySpecifier = Array<
  "delivery" | "errors" | EventDeliveryRetryKeySpecifier
>;
export interface EventDeliveryRetryFieldPolicy {
  delivery?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportErrorKeySpecifier = Array<
  "field" | "message" | "code" | ExportErrorKeySpecifier
>;
export interface ExportErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportEventKeySpecifier = Array<
  "id" | "date" | "type" | "user" | "app" | "message" | ExportEventKeySpecifier
>;
export interface ExportEventFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportFileKeySpecifier = Array<
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "message"
  | "url"
  | "events"
  | "user"
  | "app"
  | ExportFileKeySpecifier
>;
export interface ExportFileFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  events?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportFileCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | ExportFileCountableConnectionKeySpecifier
>;
export interface ExportFileCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportFileCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | ExportFileCountableEdgeKeySpecifier
>;
export interface ExportFileCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportGiftCardsKeySpecifier = Array<
  "exportFile" | "errors" | ExportGiftCardsKeySpecifier
>;
export interface ExportGiftCardsFieldPolicy {
  exportFile?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExportProductsKeySpecifier = Array<
  "exportFile" | "exportErrors" | "errors" | ExportProductsKeySpecifier
>;
export interface ExportProductsFieldPolicy {
  exportFile?: FieldPolicy<any> | FieldReadFunction<any>;
  exportErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalAuthenticationKeySpecifier = Array<
  "id" | "name" | ExternalAuthenticationKeySpecifier
>;
export interface ExternalAuthenticationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalAuthenticationUrlKeySpecifier = Array<
  | "authenticationData"
  | "accountErrors"
  | "errors"
  | ExternalAuthenticationUrlKeySpecifier
>;
export interface ExternalAuthenticationUrlFieldPolicy {
  authenticationData?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalLogoutKeySpecifier = Array<
  "logoutData" | "accountErrors" | "errors" | ExternalLogoutKeySpecifier
>;
export interface ExternalLogoutFieldPolicy {
  logoutData?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalNotificationErrorKeySpecifier = Array<
  "field" | "message" | "code" | ExternalNotificationErrorKeySpecifier
>;
export interface ExternalNotificationErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalNotificationTriggerKeySpecifier = Array<
  "errors" | ExternalNotificationTriggerKeySpecifier
>;
export interface ExternalNotificationTriggerFieldPolicy {
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalObtainAccessTokensKeySpecifier = Array<
  | "token"
  | "refreshToken"
  | "csrfToken"
  | "user"
  | "accountErrors"
  | "errors"
  | ExternalObtainAccessTokensKeySpecifier
>;
export interface ExternalObtainAccessTokensFieldPolicy {
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  refreshToken?: FieldPolicy<any> | FieldReadFunction<any>;
  csrfToken?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalRefreshKeySpecifier = Array<
  | "token"
  | "refreshToken"
  | "csrfToken"
  | "user"
  | "accountErrors"
  | "errors"
  | ExternalRefreshKeySpecifier
>;
export interface ExternalRefreshFieldPolicy {
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  refreshToken?: FieldPolicy<any> | FieldReadFunction<any>;
  csrfToken?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ExternalVerifyKeySpecifier = Array<
  | "user"
  | "isValid"
  | "verifyData"
  | "accountErrors"
  | "errors"
  | ExternalVerifyKeySpecifier
>;
export interface ExternalVerifyFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  isValid?: FieldPolicy<any> | FieldReadFunction<any>;
  verifyData?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FileKeySpecifier = Array<"url" | "contentType" | FileKeySpecifier>;
export interface FileFieldPolicy {
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  contentType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FileUploadKeySpecifier = Array<
  "uploadedFile" | "uploadErrors" | "errors" | FileUploadKeySpecifier
>;
export interface FileUploadFieldPolicy {
  uploadedFile?: FieldPolicy<any> | FieldReadFunction<any>;
  uploadErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "fulfillmentOrder"
  | "status"
  | "trackingNumber"
  | "created"
  | "lines"
  | "statusDisplay"
  | "warehouse"
  | FulfillmentKeySpecifier
>;
export interface FulfillmentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  fulfillmentOrder?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  trackingNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  lines?: FieldPolicy<any> | FieldReadFunction<any>;
  statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentApproveKeySpecifier = Array<
  | "fulfillment"
  | "order"
  | "orderErrors"
  | "errors"
  | FulfillmentApproveKeySpecifier
>;
export interface FulfillmentApproveFieldPolicy {
  fulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentCancelKeySpecifier = Array<
  | "fulfillment"
  | "order"
  | "orderErrors"
  | "errors"
  | FulfillmentCancelKeySpecifier
>;
export interface FulfillmentCancelFieldPolicy {
  fulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentLineKeySpecifier = Array<
  "id" | "quantity" | "orderLine" | FulfillmentLineKeySpecifier
>;
export interface FulfillmentLineFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentRefundProductsKeySpecifier = Array<
  | "fulfillment"
  | "order"
  | "orderErrors"
  | "errors"
  | FulfillmentRefundProductsKeySpecifier
>;
export interface FulfillmentRefundProductsFieldPolicy {
  fulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentReturnProductsKeySpecifier = Array<
  | "returnFulfillment"
  | "replaceFulfillment"
  | "order"
  | "replaceOrder"
  | "orderErrors"
  | "errors"
  | FulfillmentReturnProductsKeySpecifier
>;
export interface FulfillmentReturnProductsFieldPolicy {
  returnFulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  replaceFulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  replaceOrder?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type FulfillmentUpdateTrackingKeySpecifier = Array<
  | "fulfillment"
  | "order"
  | "orderErrors"
  | "errors"
  | FulfillmentUpdateTrackingKeySpecifier
>;
export interface FulfillmentUpdateTrackingFieldPolicy {
  fulfillment?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GatewayConfigLineKeySpecifier = Array<
  "field" | "value" | GatewayConfigLineKeySpecifier
>;
export interface GatewayConfigLineFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "displayCode"
  | "last4CodeChars"
  | "code"
  | "created"
  | "createdBy"
  | "usedBy"
  | "createdByEmail"
  | "usedByEmail"
  | "lastUsedOn"
  | "expiryDate"
  | "app"
  | "product"
  | "events"
  | "tags"
  | "boughtInChannel"
  | "isActive"
  | "initialBalance"
  | "currentBalance"
  | "user"
  | "endDate"
  | "startDate"
  | GiftCardKeySpecifier
>;
export interface GiftCardFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  displayCode?: FieldPolicy<any> | FieldReadFunction<any>;
  last4CodeChars?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  usedBy?: FieldPolicy<any> | FieldReadFunction<any>;
  createdByEmail?: FieldPolicy<any> | FieldReadFunction<any>;
  usedByEmail?: FieldPolicy<any> | FieldReadFunction<any>;
  lastUsedOn?: FieldPolicy<any> | FieldReadFunction<any>;
  expiryDate?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  events?: FieldPolicy<any> | FieldReadFunction<any>;
  tags?: FieldPolicy<any> | FieldReadFunction<any>;
  boughtInChannel?: FieldPolicy<any> | FieldReadFunction<any>;
  isActive?: FieldPolicy<any> | FieldReadFunction<any>;
  initialBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  currentBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  endDate?: FieldPolicy<any> | FieldReadFunction<any>;
  startDate?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardActivateKeySpecifier = Array<
  "giftCard" | "giftCardErrors" | "errors" | GiftCardActivateKeySpecifier
>;
export interface GiftCardActivateFieldPolicy {
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardAddNoteKeySpecifier = Array<
  "giftCard" | "event" | "errors" | GiftCardAddNoteKeySpecifier
>;
export interface GiftCardAddNoteFieldPolicy {
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
  event?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardBulkActivateKeySpecifier = Array<
  "count" | "errors" | GiftCardBulkActivateKeySpecifier
>;
export interface GiftCardBulkActivateFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardBulkCreateKeySpecifier = Array<
  "count" | "giftCards" | "errors" | GiftCardBulkCreateKeySpecifier
>;
export interface GiftCardBulkCreateFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCards?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardBulkDeactivateKeySpecifier = Array<
  "count" | "errors" | GiftCardBulkDeactivateKeySpecifier
>;
export interface GiftCardBulkDeactivateFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardBulkDeleteKeySpecifier = Array<
  "count" | "errors" | GiftCardBulkDeleteKeySpecifier
>;
export interface GiftCardBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | GiftCardCountableConnectionKeySpecifier
>;
export interface GiftCardCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | GiftCardCountableEdgeKeySpecifier
>;
export interface GiftCardCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardCreateKeySpecifier = Array<
  "giftCardErrors" | "errors" | "giftCard" | GiftCardCreateKeySpecifier
>;
export interface GiftCardCreateFieldPolicy {
  giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardDeactivateKeySpecifier = Array<
  "giftCard" | "giftCardErrors" | "errors" | GiftCardDeactivateKeySpecifier
>;
export interface GiftCardDeactivateFieldPolicy {
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardDeleteKeySpecifier = Array<
  "giftCardErrors" | "errors" | "giftCard" | GiftCardDeleteKeySpecifier
>;
export interface GiftCardDeleteFieldPolicy {
  giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardErrorKeySpecifier = Array<
  "field" | "message" | "code" | "tags" | GiftCardErrorKeySpecifier
>;
export interface GiftCardErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  tags?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardEventKeySpecifier = Array<
  | "id"
  | "date"
  | "type"
  | "user"
  | "app"
  | "message"
  | "email"
  | "orderId"
  | "orderNumber"
  | "tags"
  | "oldTags"
  | "balance"
  | "expiryDate"
  | "oldExpiryDate"
  | GiftCardEventKeySpecifier
>;
export interface GiftCardEventFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  orderId?: FieldPolicy<any> | FieldReadFunction<any>;
  orderNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  tags?: FieldPolicy<any> | FieldReadFunction<any>;
  oldTags?: FieldPolicy<any> | FieldReadFunction<any>;
  balance?: FieldPolicy<any> | FieldReadFunction<any>;
  expiryDate?: FieldPolicy<any> | FieldReadFunction<any>;
  oldExpiryDate?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardEventBalanceKeySpecifier = Array<
  | "initialBalance"
  | "currentBalance"
  | "oldInitialBalance"
  | "oldCurrentBalance"
  | GiftCardEventBalanceKeySpecifier
>;
export interface GiftCardEventBalanceFieldPolicy {
  initialBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  currentBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  oldInitialBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  oldCurrentBalance?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardResendKeySpecifier = Array<
  "giftCard" | "errors" | GiftCardResendKeySpecifier
>;
export interface GiftCardResendFieldPolicy {
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardSettingsKeySpecifier = Array<
  "expiryType" | "expiryPeriod" | GiftCardSettingsKeySpecifier
>;
export interface GiftCardSettingsFieldPolicy {
  expiryType?: FieldPolicy<any> | FieldReadFunction<any>;
  expiryPeriod?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardSettingsErrorKeySpecifier = Array<
  "field" | "message" | "code" | GiftCardSettingsErrorKeySpecifier
>;
export interface GiftCardSettingsErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardSettingsUpdateKeySpecifier = Array<
  "giftCardSettings" | "errors" | GiftCardSettingsUpdateKeySpecifier
>;
export interface GiftCardSettingsUpdateFieldPolicy {
  giftCardSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardTagKeySpecifier = Array<
  "id" | "name" | GiftCardTagKeySpecifier
>;
export interface GiftCardTagFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardTagCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | GiftCardTagCountableConnectionKeySpecifier
>;
export interface GiftCardTagCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardTagCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | GiftCardTagCountableEdgeKeySpecifier
>;
export interface GiftCardTagCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GiftCardUpdateKeySpecifier = Array<
  "giftCardErrors" | "errors" | "giftCard" | GiftCardUpdateKeySpecifier
>;
export interface GiftCardUpdateFieldPolicy {
  giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GroupKeySpecifier = Array<
  "id" | "name" | "users" | "permissions" | "userCanManage" | GroupKeySpecifier
>;
export interface GroupFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  users?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  userCanManage?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GroupCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | GroupCountableConnectionKeySpecifier
>;
export interface GroupCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type GroupCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | GroupCountableEdgeKeySpecifier
>;
export interface GroupCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ImageKeySpecifier = Array<"url" | "alt" | ImageKeySpecifier>;
export interface ImageFieldPolicy {
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  alt?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceKeySpecifier = Array<
  | "privateMetadata"
  | "metadata"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "message"
  | "id"
  | "number"
  | "externalUrl"
  | "url"
  | InvoiceKeySpecifier
>;
export interface InvoiceFieldPolicy {
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  number?: FieldPolicy<any> | FieldReadFunction<any>;
  externalUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceCreateKeySpecifier = Array<
  "invoiceErrors" | "errors" | "invoice" | InvoiceCreateKeySpecifier
>;
export interface InvoiceCreateFieldPolicy {
  invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  invoice?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceDeleteKeySpecifier = Array<
  "invoiceErrors" | "errors" | "invoice" | InvoiceDeleteKeySpecifier
>;
export interface InvoiceDeleteFieldPolicy {
  invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  invoice?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceErrorKeySpecifier = Array<
  "field" | "message" | "code" | InvoiceErrorKeySpecifier
>;
export interface InvoiceErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceRequestKeySpecifier = Array<
  "order" | "invoiceErrors" | "errors" | "invoice" | InvoiceRequestKeySpecifier
>;
export interface InvoiceRequestFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  invoice?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceRequestDeleteKeySpecifier = Array<
  "invoiceErrors" | "errors" | "invoice" | InvoiceRequestDeleteKeySpecifier
>;
export interface InvoiceRequestDeleteFieldPolicy {
  invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  invoice?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceSendNotificationKeySpecifier = Array<
  "invoiceErrors" | "errors" | "invoice" | InvoiceSendNotificationKeySpecifier
>;
export interface InvoiceSendNotificationFieldPolicy {
  invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  invoice?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type InvoiceUpdateKeySpecifier = Array<
  "invoiceErrors" | "errors" | "invoice" | InvoiceUpdateKeySpecifier
>;
export interface InvoiceUpdateFieldPolicy {
  invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  invoice?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type JobKeySpecifier = Array<
  "status" | "createdAt" | "updatedAt" | "message" | JobKeySpecifier
>;
export interface JobFieldPolicy {
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type LanguageDisplayKeySpecifier = Array<
  "code" | "language" | LanguageDisplayKeySpecifier
>;
export interface LanguageDisplayFieldPolicy {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type LimitInfoKeySpecifier = Array<
  "currentUsage" | "allowedUsage" | LimitInfoKeySpecifier
>;
export interface LimitInfoFieldPolicy {
  currentUsage?: FieldPolicy<any> | FieldReadFunction<any>;
  allowedUsage?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type LimitsKeySpecifier = Array<
  | "channels"
  | "orders"
  | "productVariants"
  | "staffUsers"
  | "warehouses"
  | LimitsKeySpecifier
>;
export interface LimitsFieldPolicy {
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
  orders?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariants?: FieldPolicy<any> | FieldReadFunction<any>;
  staffUsers?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouses?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ManifestKeySpecifier = Array<
  | "identifier"
  | "version"
  | "name"
  | "about"
  | "permissions"
  | "appUrl"
  | "configurationUrl"
  | "tokenTargetUrl"
  | "dataPrivacy"
  | "dataPrivacyUrl"
  | "homepageUrl"
  | "supportUrl"
  | "extensions"
  | ManifestKeySpecifier
>;
export interface ManifestFieldPolicy {
  identifier?: FieldPolicy<any> | FieldReadFunction<any>;
  version?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  about?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  appUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  tokenTargetUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>;
  dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  supportUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  extensions?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MarginKeySpecifier = Array<"start" | "stop" | MarginKeySpecifier>;
export interface MarginFieldPolicy {
  start?: FieldPolicy<any> | FieldReadFunction<any>;
  stop?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "slug"
  | "items"
  | MenuKeySpecifier
>;
export interface MenuFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuBulkDeleteKeySpecifier = Array<
  "count" | "menuErrors" | "errors" | MenuBulkDeleteKeySpecifier
>;
export interface MenuBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | MenuCountableConnectionKeySpecifier
>;
export interface MenuCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | MenuCountableEdgeKeySpecifier
>;
export interface MenuCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuCreateKeySpecifier = Array<
  "menuErrors" | "errors" | "menu" | MenuCreateKeySpecifier
>;
export interface MenuCreateFieldPolicy {
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuDeleteKeySpecifier = Array<
  "menuErrors" | "errors" | "menu" | MenuDeleteKeySpecifier
>;
export interface MenuDeleteFieldPolicy {
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuErrorKeySpecifier = Array<
  "field" | "message" | "code" | MenuErrorKeySpecifier
>;
export interface MenuErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "menu"
  | "parent"
  | "category"
  | "collection"
  | "page"
  | "level"
  | "children"
  | "url"
  | "translation"
  | MenuItemKeySpecifier
>;
export interface MenuItemFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
  parent?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
  level?: FieldPolicy<any> | FieldReadFunction<any>;
  children?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemBulkDeleteKeySpecifier = Array<
  "count" | "menuErrors" | "errors" | MenuItemBulkDeleteKeySpecifier
>;
export interface MenuItemBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | MenuItemCountableConnectionKeySpecifier
>;
export interface MenuItemCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | MenuItemCountableEdgeKeySpecifier
>;
export interface MenuItemCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemCreateKeySpecifier = Array<
  "menuErrors" | "errors" | "menuItem" | MenuItemCreateKeySpecifier
>;
export interface MenuItemCreateFieldPolicy {
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItem?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemDeleteKeySpecifier = Array<
  "menuErrors" | "errors" | "menuItem" | MenuItemDeleteKeySpecifier
>;
export interface MenuItemDeleteFieldPolicy {
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItem?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemMoveKeySpecifier = Array<
  "menu" | "menuErrors" | "errors" | MenuItemMoveKeySpecifier
>;
export interface MenuItemMoveFieldPolicy {
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemTranslatableContentKeySpecifier = Array<
  | "id"
  | "name"
  | "translation"
  | "menuItem"
  | MenuItemTranslatableContentKeySpecifier
>;
export interface MenuItemTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItem?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "menuItem" | MenuItemTranslateKeySpecifier
>;
export interface MenuItemTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItem?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemTranslationKeySpecifier = Array<
  "id" | "language" | "name" | MenuItemTranslationKeySpecifier
>;
export interface MenuItemTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuItemUpdateKeySpecifier = Array<
  "menuErrors" | "errors" | "menuItem" | MenuItemUpdateKeySpecifier
>;
export interface MenuItemUpdateFieldPolicy {
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItem?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MenuUpdateKeySpecifier = Array<
  "menuErrors" | "errors" | "menu" | MenuUpdateKeySpecifier
>;
export interface MenuUpdateFieldPolicy {
  menuErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MetadataErrorKeySpecifier = Array<
  "field" | "message" | "code" | MetadataErrorKeySpecifier
>;
export interface MetadataErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MetadataItemKeySpecifier = Array<
  "key" | "value" | MetadataItemKeySpecifier
>;
export interface MetadataItemFieldPolicy {
  key?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MoneyKeySpecifier = Array<
  "currency" | "amount" | MoneyKeySpecifier
>;
export interface MoneyFieldPolicy {
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MoneyRangeKeySpecifier = Array<
  "start" | "stop" | MoneyRangeKeySpecifier
>;
export interface MoneyRangeFieldPolicy {
  start?: FieldPolicy<any> | FieldReadFunction<any>;
  stop?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type MutationKeySpecifier = Array<
  | "webhookCreate"
  | "webhookDelete"
  | "webhookUpdate"
  | "eventDeliveryRetry"
  | "createWarehouse"
  | "updateWarehouse"
  | "deleteWarehouse"
  | "assignWarehouseShippingZone"
  | "unassignWarehouseShippingZone"
  | "staffNotificationRecipientCreate"
  | "staffNotificationRecipientUpdate"
  | "staffNotificationRecipientDelete"
  | "shopDomainUpdate"
  | "shopSettingsUpdate"
  | "shopFetchTaxRates"
  | "shopSettingsTranslate"
  | "shopAddressUpdate"
  | "orderSettingsUpdate"
  | "giftCardSettingsUpdate"
  | "shippingMethodChannelListingUpdate"
  | "shippingPriceCreate"
  | "shippingPriceDelete"
  | "shippingPriceBulkDelete"
  | "shippingPriceUpdate"
  | "shippingPriceTranslate"
  | "shippingPriceExcludeProducts"
  | "shippingPriceRemoveProductFromExclude"
  | "shippingZoneCreate"
  | "shippingZoneDelete"
  | "shippingZoneBulkDelete"
  | "shippingZoneUpdate"
  | "productAttributeAssign"
  | "productAttributeAssignmentUpdate"
  | "productAttributeUnassign"
  | "categoryCreate"
  | "categoryDelete"
  | "categoryBulkDelete"
  | "categoryUpdate"
  | "categoryTranslate"
  | "collectionAddProducts"
  | "collectionCreate"
  | "collectionDelete"
  | "collectionReorderProducts"
  | "collectionBulkDelete"
  | "collectionRemoveProducts"
  | "collectionUpdate"
  | "collectionTranslate"
  | "collectionChannelListingUpdate"
  | "productCreate"
  | "productDelete"
  | "productBulkDelete"
  | "productUpdate"
  | "productTranslate"
  | "productChannelListingUpdate"
  | "productMediaCreate"
  | "productVariantReorder"
  | "productMediaDelete"
  | "productMediaBulkDelete"
  | "productMediaReorder"
  | "productMediaUpdate"
  | "productTypeCreate"
  | "productTypeDelete"
  | "productTypeBulkDelete"
  | "productTypeUpdate"
  | "productTypeReorderAttributes"
  | "productReorderAttributeValues"
  | "digitalContentCreate"
  | "digitalContentDelete"
  | "digitalContentUpdate"
  | "digitalContentUrlCreate"
  | "productVariantCreate"
  | "productVariantDelete"
  | "productVariantBulkCreate"
  | "productVariantBulkDelete"
  | "productVariantStocksCreate"
  | "productVariantStocksDelete"
  | "productVariantStocksUpdate"
  | "productVariantUpdate"
  | "productVariantSetDefault"
  | "productVariantTranslate"
  | "productVariantChannelListingUpdate"
  | "productVariantReorderAttributeValues"
  | "productVariantPreorderDeactivate"
  | "variantMediaAssign"
  | "variantMediaUnassign"
  | "paymentCapture"
  | "paymentRefund"
  | "paymentVoid"
  | "paymentInitialize"
  | "paymentCheckBalance"
  | "pageCreate"
  | "pageDelete"
  | "pageBulkDelete"
  | "pageBulkPublish"
  | "pageUpdate"
  | "pageTranslate"
  | "pageTypeCreate"
  | "pageTypeUpdate"
  | "pageTypeDelete"
  | "pageTypeBulkDelete"
  | "pageAttributeAssign"
  | "pageAttributeUnassign"
  | "pageTypeReorderAttributes"
  | "pageReorderAttributeValues"
  | "draftOrderComplete"
  | "draftOrderCreate"
  | "draftOrderDelete"
  | "draftOrderBulkDelete"
  | "draftOrderLinesBulkDelete"
  | "draftOrderUpdate"
  | "orderAddNote"
  | "orderCancel"
  | "orderCapture"
  | "orderConfirm"
  | "orderFulfill"
  | "orderFulfillmentCancel"
  | "orderFulfillmentApprove"
  | "orderFulfillmentUpdateTracking"
  | "orderFulfillmentRefundProducts"
  | "orderFulfillmentReturnProducts"
  | "orderLinesCreate"
  | "orderLineDelete"
  | "orderLineUpdate"
  | "orderDiscountAdd"
  | "orderDiscountUpdate"
  | "orderDiscountDelete"
  | "orderLineDiscountUpdate"
  | "orderLineDiscountRemove"
  | "orderMarkAsPaid"
  | "orderRefund"
  | "orderUpdate"
  | "orderUpdateShipping"
  | "orderVoid"
  | "orderBulkCancel"
  | "deleteMetadata"
  | "deletePrivateMetadata"
  | "updateMetadata"
  | "updatePrivateMetadata"
  | "assignNavigation"
  | "menuCreate"
  | "menuDelete"
  | "menuBulkDelete"
  | "menuUpdate"
  | "menuItemCreate"
  | "menuItemDelete"
  | "menuItemBulkDelete"
  | "menuItemUpdate"
  | "menuItemTranslate"
  | "menuItemMove"
  | "invoiceRequest"
  | "invoiceRequestDelete"
  | "invoiceCreate"
  | "invoiceDelete"
  | "invoiceUpdate"
  | "invoiceSendNotification"
  | "giftCardActivate"
  | "giftCardCreate"
  | "giftCardDelete"
  | "giftCardDeactivate"
  | "giftCardUpdate"
  | "giftCardResend"
  | "giftCardAddNote"
  | "giftCardBulkCreate"
  | "giftCardBulkDelete"
  | "giftCardBulkActivate"
  | "giftCardBulkDeactivate"
  | "pluginUpdate"
  | "externalNotificationTrigger"
  | "saleCreate"
  | "saleDelete"
  | "saleBulkDelete"
  | "saleUpdate"
  | "saleCataloguesAdd"
  | "saleCataloguesRemove"
  | "saleTranslate"
  | "saleChannelListingUpdate"
  | "voucherCreate"
  | "voucherDelete"
  | "voucherBulkDelete"
  | "voucherUpdate"
  | "voucherCataloguesAdd"
  | "voucherCataloguesRemove"
  | "voucherTranslate"
  | "voucherChannelListingUpdate"
  | "exportProducts"
  | "exportGiftCards"
  | "fileUpload"
  | "checkoutAddPromoCode"
  | "checkoutBillingAddressUpdate"
  | "checkoutComplete"
  | "checkoutCreate"
  | "checkoutCustomerAttach"
  | "checkoutCustomerDetach"
  | "checkoutEmailUpdate"
  | "checkoutLineDelete"
  | "checkoutLinesDelete"
  | "checkoutLinesAdd"
  | "checkoutLinesUpdate"
  | "checkoutRemovePromoCode"
  | "checkoutPaymentCreate"
  | "checkoutShippingAddressUpdate"
  | "checkoutShippingMethodUpdate"
  | "checkoutDeliveryMethodUpdate"
  | "checkoutLanguageCodeUpdate"
  | "channelCreate"
  | "channelUpdate"
  | "channelDelete"
  | "channelActivate"
  | "channelDeactivate"
  | "attributeCreate"
  | "attributeDelete"
  | "attributeUpdate"
  | "attributeTranslate"
  | "attributeBulkDelete"
  | "attributeValueBulkDelete"
  | "attributeValueCreate"
  | "attributeValueDelete"
  | "attributeValueUpdate"
  | "attributeValueTranslate"
  | "attributeReorderValues"
  | "appCreate"
  | "appUpdate"
  | "appDelete"
  | "appTokenCreate"
  | "appTokenDelete"
  | "appTokenVerify"
  | "appInstall"
  | "appRetryInstall"
  | "appDeleteFailedInstallation"
  | "appFetchManifest"
  | "appActivate"
  | "appDeactivate"
  | "tokenCreate"
  | "tokenRefresh"
  | "tokenVerify"
  | "tokensDeactivateAll"
  | "externalAuthenticationUrl"
  | "externalObtainAccessTokens"
  | "externalRefresh"
  | "externalLogout"
  | "externalVerify"
  | "requestPasswordReset"
  | "confirmAccount"
  | "setPassword"
  | "passwordChange"
  | "requestEmailChange"
  | "confirmEmailChange"
  | "accountAddressCreate"
  | "accountAddressUpdate"
  | "accountAddressDelete"
  | "accountSetDefaultAddress"
  | "accountRegister"
  | "accountUpdate"
  | "accountRequestDeletion"
  | "accountDelete"
  | "addressCreate"
  | "addressUpdate"
  | "addressDelete"
  | "addressSetDefault"
  | "customerCreate"
  | "customerUpdate"
  | "customerDelete"
  | "customerBulkDelete"
  | "staffCreate"
  | "staffUpdate"
  | "staffDelete"
  | "staffBulkDelete"
  | "userAvatarUpdate"
  | "userAvatarDelete"
  | "userBulkSetActive"
  | "permissionGroupCreate"
  | "permissionGroupUpdate"
  | "permissionGroupDelete"
  | MutationKeySpecifier
>;
export interface MutationFieldPolicy {
  webhookCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  webhookDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  webhookUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  eventDeliveryRetry?: FieldPolicy<any> | FieldReadFunction<any>;
  createWarehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  updateWarehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteWarehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  assignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
  unassignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipientCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipientUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipientDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  shopDomainUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  shopSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  shopFetchTaxRates?: FieldPolicy<any> | FieldReadFunction<any>;
  shopSettingsTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  shopAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethodChannelListingUpdate?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
  shippingPriceCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPriceDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPriceBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPriceUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPriceTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPriceExcludeProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPriceRemoveProductFromExclude?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
  shippingZoneCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZoneDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZoneBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZoneUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>;
  productAttributeAssignmentUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>;
  categoryCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  categoryDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  categoryBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  categoryUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  categoryTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionAddProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionReorderProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionRemoveProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  productChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productMediaCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantReorder?: FieldPolicy<any> | FieldReadFunction<any>;
  productMediaDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productMediaBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productMediaReorder?: FieldPolicy<any> | FieldReadFunction<any>;
  productMediaUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  productReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContentCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContentDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContentUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContentUrlCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantStocksCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantStocksDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantStocksUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantSetDefault?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantChannelListingUpdate?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
  productVariantReorderAttributeValues?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
  productVariantPreorderDeactivate?: FieldPolicy<any> | FieldReadFunction<any>;
  variantMediaAssign?: FieldPolicy<any> | FieldReadFunction<any>;
  variantMediaUnassign?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentCapture?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentRefund?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentVoid?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentInitialize?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentCheckBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  pageCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  pageDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pageBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pageBulkPublish?: FieldPolicy<any> | FieldReadFunction<any>;
  pageUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pageAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>;
  pageAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  pageReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrderComplete?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrderCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrderDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrderBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrderLinesBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrderUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderAddNote?: FieldPolicy<any> | FieldReadFunction<any>;
  orderCancel?: FieldPolicy<any> | FieldReadFunction<any>;
  orderCapture?: FieldPolicy<any> | FieldReadFunction<any>;
  orderConfirm?: FieldPolicy<any> | FieldReadFunction<any>;
  orderFulfill?: FieldPolicy<any> | FieldReadFunction<any>;
  orderFulfillmentCancel?: FieldPolicy<any> | FieldReadFunction<any>;
  orderFulfillmentApprove?: FieldPolicy<any> | FieldReadFunction<any>;
  orderFulfillmentUpdateTracking?: FieldPolicy<any> | FieldReadFunction<any>;
  orderFulfillmentRefundProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  orderFulfillmentReturnProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLinesCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLineDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLineUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderDiscountAdd?: FieldPolicy<any> | FieldReadFunction<any>;
  orderDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderDiscountDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLineDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLineDiscountRemove?: FieldPolicy<any> | FieldReadFunction<any>;
  orderMarkAsPaid?: FieldPolicy<any> | FieldReadFunction<any>;
  orderRefund?: FieldPolicy<any> | FieldReadFunction<any>;
  orderUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orderUpdateShipping?: FieldPolicy<any> | FieldReadFunction<any>;
  orderVoid?: FieldPolicy<any> | FieldReadFunction<any>;
  orderBulkCancel?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  deletePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  updateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  updatePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  assignNavigation?: FieldPolicy<any> | FieldReadFunction<any>;
  menuCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  menuDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  menuBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  menuUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItemCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItemDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItemBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItemUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItemTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItemMove?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceRequest?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceRequestDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceSendNotification?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardActivate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardDeactivate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardResend?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardAddNote?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardBulkActivate?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardBulkDeactivate?: FieldPolicy<any> | FieldReadFunction<any>;
  pluginUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  externalNotificationTrigger?: FieldPolicy<any> | FieldReadFunction<any>;
  saleCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  saleDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  saleBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  saleUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  saleCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>;
  saleCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>;
  saleTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  saleChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  voucherChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  exportProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  exportGiftCards?: FieldPolicy<any> | FieldReadFunction<any>;
  fileUpload?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutAddPromoCode?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutBillingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutComplete?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutCustomerAttach?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutCustomerDetach?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutEmailUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutLineDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutLinesDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutLinesAdd?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutLinesUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutRemovePromoCode?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutPaymentCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutShippingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutShippingMethodUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutDeliveryMethodUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutLanguageCodeUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  channelCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  channelUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  channelDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  channelActivate?: FieldPolicy<any> | FieldReadFunction<any>;
  channelDeactivate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValueBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValueCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValueDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValueUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValueTranslate?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeReorderValues?: FieldPolicy<any> | FieldReadFunction<any>;
  appCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  appUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  appDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  appTokenCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  appTokenDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  appTokenVerify?: FieldPolicy<any> | FieldReadFunction<any>;
  appInstall?: FieldPolicy<any> | FieldReadFunction<any>;
  appRetryInstall?: FieldPolicy<any> | FieldReadFunction<any>;
  appDeleteFailedInstallation?: FieldPolicy<any> | FieldReadFunction<any>;
  appFetchManifest?: FieldPolicy<any> | FieldReadFunction<any>;
  appActivate?: FieldPolicy<any> | FieldReadFunction<any>;
  appDeactivate?: FieldPolicy<any> | FieldReadFunction<any>;
  tokenCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  tokenRefresh?: FieldPolicy<any> | FieldReadFunction<any>;
  tokenVerify?: FieldPolicy<any> | FieldReadFunction<any>;
  tokensDeactivateAll?: FieldPolicy<any> | FieldReadFunction<any>;
  externalAuthenticationUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  externalObtainAccessTokens?: FieldPolicy<any> | FieldReadFunction<any>;
  externalRefresh?: FieldPolicy<any> | FieldReadFunction<any>;
  externalLogout?: FieldPolicy<any> | FieldReadFunction<any>;
  externalVerify?: FieldPolicy<any> | FieldReadFunction<any>;
  requestPasswordReset?: FieldPolicy<any> | FieldReadFunction<any>;
  confirmAccount?: FieldPolicy<any> | FieldReadFunction<any>;
  setPassword?: FieldPolicy<any> | FieldReadFunction<any>;
  passwordChange?: FieldPolicy<any> | FieldReadFunction<any>;
  requestEmailChange?: FieldPolicy<any> | FieldReadFunction<any>;
  confirmEmailChange?: FieldPolicy<any> | FieldReadFunction<any>;
  accountAddressCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  accountAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  accountAddressDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  accountSetDefaultAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  accountRegister?: FieldPolicy<any> | FieldReadFunction<any>;
  accountUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  accountRequestDeletion?: FieldPolicy<any> | FieldReadFunction<any>;
  accountDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  addressCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  addressUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  addressDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  addressSetDefault?: FieldPolicy<any> | FieldReadFunction<any>;
  customerCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  customerUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  customerDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  customerBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  staffCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  staffUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  staffDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  staffBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  userAvatarUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  userAvatarDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  userBulkSetActive?: FieldPolicy<any> | FieldReadFunction<any>;
  permissionGroupCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  permissionGroupUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  permissionGroupDelete?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type NodeKeySpecifier = Array<"id" | NodeKeySpecifier>;
export interface NodeFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ObjectWithMetadataKeySpecifier = Array<
  "privateMetadata" | "metadata" | ObjectWithMetadataKeySpecifier
>;
export interface ObjectWithMetadataFieldPolicy {
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "created"
  | "status"
  | "user"
  | "trackingClientId"
  | "billingAddress"
  | "shippingAddress"
  | "shippingMethodName"
  | "collectionPointName"
  | "channel"
  | "fulfillments"
  | "lines"
  | "actions"
  | "availableShippingMethods"
  | "shippingMethods"
  | "availableCollectionPoints"
  | "invoices"
  | "number"
  | "original"
  | "origin"
  | "isPaid"
  | "paymentStatus"
  | "paymentStatusDisplay"
  | "payments"
  | "total"
  | "undiscountedTotal"
  | "shippingMethod"
  | "shippingPrice"
  | "shippingTaxRate"
  | "token"
  | "voucher"
  | "giftCards"
  | "displayGrossPrices"
  | "customerNote"
  | "weight"
  | "redirectUrl"
  | "subtotal"
  | "statusDisplay"
  | "canFinalize"
  | "totalAuthorized"
  | "totalCaptured"
  | "events"
  | "totalBalance"
  | "userEmail"
  | "isShippingRequired"
  | "deliveryMethod"
  | "languageCode"
  | "languageCodeEnum"
  | "discount"
  | "discountName"
  | "translatedDiscountName"
  | "discounts"
  | "errors"
  | OrderKeySpecifier
>;
export interface OrderFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  trackingClientId?: FieldPolicy<any> | FieldReadFunction<any>;
  billingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethodName?: FieldPolicy<any> | FieldReadFunction<any>;
  collectionPointName?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  fulfillments?: FieldPolicy<any> | FieldReadFunction<any>;
  lines?: FieldPolicy<any> | FieldReadFunction<any>;
  actions?: FieldPolicy<any> | FieldReadFunction<any>;
  availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>;
  availableCollectionPoints?: FieldPolicy<any> | FieldReadFunction<any>;
  invoices?: FieldPolicy<any> | FieldReadFunction<any>;
  number?: FieldPolicy<any> | FieldReadFunction<any>;
  original?: FieldPolicy<any> | FieldReadFunction<any>;
  origin?: FieldPolicy<any> | FieldReadFunction<any>;
  isPaid?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentStatus?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentStatusDisplay?: FieldPolicy<any> | FieldReadFunction<any>;
  payments?: FieldPolicy<any> | FieldReadFunction<any>;
  total?: FieldPolicy<any> | FieldReadFunction<any>;
  undiscountedTotal?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingTaxRate?: FieldPolicy<any> | FieldReadFunction<any>;
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCards?: FieldPolicy<any> | FieldReadFunction<any>;
  displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>;
  customerNote?: FieldPolicy<any> | FieldReadFunction<any>;
  weight?: FieldPolicy<any> | FieldReadFunction<any>;
  redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  subtotal?: FieldPolicy<any> | FieldReadFunction<any>;
  statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>;
  canFinalize?: FieldPolicy<any> | FieldReadFunction<any>;
  totalAuthorized?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCaptured?: FieldPolicy<any> | FieldReadFunction<any>;
  events?: FieldPolicy<any> | FieldReadFunction<any>;
  totalBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  userEmail?: FieldPolicy<any> | FieldReadFunction<any>;
  isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>;
  deliveryMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  languageCode?: FieldPolicy<any> | FieldReadFunction<any>;
  languageCodeEnum?: FieldPolicy<any> | FieldReadFunction<any>;
  discount?: FieldPolicy<any> | FieldReadFunction<any>;
  discountName?: FieldPolicy<any> | FieldReadFunction<any>;
  translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>;
  discounts?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderAddNoteKeySpecifier = Array<
  "order" | "event" | "orderErrors" | "errors" | OrderAddNoteKeySpecifier
>;
export interface OrderAddNoteFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  event?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderBulkCancelKeySpecifier = Array<
  "count" | "orderErrors" | "errors" | OrderBulkCancelKeySpecifier
>;
export interface OrderBulkCancelFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderCancelKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderCancelKeySpecifier
>;
export interface OrderCancelFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderCaptureKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderCaptureKeySpecifier
>;
export interface OrderCaptureFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderConfirmKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderConfirmKeySpecifier
>;
export interface OrderConfirmFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | OrderCountableConnectionKeySpecifier
>;
export interface OrderCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | OrderCountableEdgeKeySpecifier
>;
export interface OrderCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderDiscountKeySpecifier = Array<
  | "id"
  | "type"
  | "name"
  | "translatedName"
  | "valueType"
  | "value"
  | "reason"
  | "amount"
  | OrderDiscountKeySpecifier
>;
export interface OrderDiscountFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  translatedName?: FieldPolicy<any> | FieldReadFunction<any>;
  valueType?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
  reason?: FieldPolicy<any> | FieldReadFunction<any>;
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderDiscountAddKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderDiscountAddKeySpecifier
>;
export interface OrderDiscountAddFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderDiscountDeleteKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderDiscountDeleteKeySpecifier
>;
export interface OrderDiscountDeleteFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderDiscountUpdateKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderDiscountUpdateKeySpecifier
>;
export interface OrderDiscountUpdateFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "warehouse"
  | "orderLines"
  | "variants"
  | "addressType"
  | OrderErrorKeySpecifier
>;
export interface OrderErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLines?: FieldPolicy<any> | FieldReadFunction<any>;
  variants?: FieldPolicy<any> | FieldReadFunction<any>;
  addressType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderEventKeySpecifier = Array<
  | "id"
  | "date"
  | "type"
  | "user"
  | "app"
  | "message"
  | "email"
  | "emailType"
  | "amount"
  | "paymentId"
  | "paymentGateway"
  | "quantity"
  | "composedId"
  | "orderNumber"
  | "invoiceNumber"
  | "oversoldItems"
  | "lines"
  | "fulfilledItems"
  | "warehouse"
  | "transactionReference"
  | "shippingCostsIncluded"
  | "relatedOrder"
  | "discount"
  | OrderEventKeySpecifier
>;
export interface OrderEventFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  emailType?: FieldPolicy<any> | FieldReadFunction<any>;
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentId?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentGateway?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  composedId?: FieldPolicy<any> | FieldReadFunction<any>;
  orderNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  invoiceNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  oversoldItems?: FieldPolicy<any> | FieldReadFunction<any>;
  lines?: FieldPolicy<any> | FieldReadFunction<any>;
  fulfilledItems?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  transactionReference?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingCostsIncluded?: FieldPolicy<any> | FieldReadFunction<any>;
  relatedOrder?: FieldPolicy<any> | FieldReadFunction<any>;
  discount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderEventCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | OrderEventCountableConnectionKeySpecifier
>;
export interface OrderEventCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderEventCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | OrderEventCountableEdgeKeySpecifier
>;
export interface OrderEventCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderEventDiscountObjectKeySpecifier = Array<
  | "valueType"
  | "value"
  | "reason"
  | "amount"
  | "oldValueType"
  | "oldValue"
  | "oldAmount"
  | OrderEventDiscountObjectKeySpecifier
>;
export interface OrderEventDiscountObjectFieldPolicy {
  valueType?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
  reason?: FieldPolicy<any> | FieldReadFunction<any>;
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
  oldValueType?: FieldPolicy<any> | FieldReadFunction<any>;
  oldValue?: FieldPolicy<any> | FieldReadFunction<any>;
  oldAmount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderEventOrderLineObjectKeySpecifier = Array<
  | "quantity"
  | "orderLine"
  | "itemName"
  | "discount"
  | OrderEventOrderLineObjectKeySpecifier
>;
export interface OrderEventOrderLineObjectFieldPolicy {
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
  itemName?: FieldPolicy<any> | FieldReadFunction<any>;
  discount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderFulfillKeySpecifier = Array<
  "fulfillments" | "order" | "orderErrors" | "errors" | OrderFulfillKeySpecifier
>;
export interface OrderFulfillFieldPolicy {
  fulfillments?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderLineKeySpecifier = Array<
  | "id"
  | "productName"
  | "variantName"
  | "productSku"
  | "productVariantId"
  | "isShippingRequired"
  | "quantity"
  | "quantityFulfilled"
  | "unitDiscountReason"
  | "taxRate"
  | "digitalContentUrl"
  | "thumbnail"
  | "unitPrice"
  | "undiscountedUnitPrice"
  | "unitDiscount"
  | "unitDiscountValue"
  | "totalPrice"
  | "variant"
  | "translatedProductName"
  | "translatedVariantName"
  | "allocations"
  | "quantityToFulfill"
  | "unitDiscountType"
  | OrderLineKeySpecifier
>;
export interface OrderLineFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  productName?: FieldPolicy<any> | FieldReadFunction<any>;
  variantName?: FieldPolicy<any> | FieldReadFunction<any>;
  productSku?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariantId?: FieldPolicy<any> | FieldReadFunction<any>;
  isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityFulfilled?: FieldPolicy<any> | FieldReadFunction<any>;
  unitDiscountReason?: FieldPolicy<any> | FieldReadFunction<any>;
  taxRate?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  thumbnail?: FieldPolicy<any> | FieldReadFunction<any>;
  unitPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  undiscountedUnitPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  unitDiscount?: FieldPolicy<any> | FieldReadFunction<any>;
  unitDiscountValue?: FieldPolicy<any> | FieldReadFunction<any>;
  totalPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
  translatedProductName?: FieldPolicy<any> | FieldReadFunction<any>;
  translatedVariantName?: FieldPolicy<any> | FieldReadFunction<any>;
  allocations?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityToFulfill?: FieldPolicy<any> | FieldReadFunction<any>;
  unitDiscountType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderLineDeleteKeySpecifier = Array<
  "order" | "orderLine" | "orderErrors" | "errors" | OrderLineDeleteKeySpecifier
>;
export interface OrderLineDeleteFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderLineDiscountRemoveKeySpecifier = Array<
  | "orderLine"
  | "order"
  | "orderErrors"
  | "errors"
  | OrderLineDiscountRemoveKeySpecifier
>;
export interface OrderLineDiscountRemoveFieldPolicy {
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderLineDiscountUpdateKeySpecifier = Array<
  | "orderLine"
  | "order"
  | "orderErrors"
  | "errors"
  | OrderLineDiscountUpdateKeySpecifier
>;
export interface OrderLineDiscountUpdateFieldPolicy {
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderLineUpdateKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | "orderLine" | OrderLineUpdateKeySpecifier
>;
export interface OrderLineUpdateFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLine?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderLinesCreateKeySpecifier = Array<
  | "order"
  | "orderLines"
  | "orderErrors"
  | "errors"
  | OrderLinesCreateKeySpecifier
>;
export interface OrderLinesCreateFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderLines?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderMarkAsPaidKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderMarkAsPaidKeySpecifier
>;
export interface OrderMarkAsPaidFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderRefundKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderRefundKeySpecifier
>;
export interface OrderRefundFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderSettingsKeySpecifier = Array<
  | "automaticallyConfirmAllNewOrders"
  | "automaticallyFulfillNonShippableGiftCard"
  | OrderSettingsKeySpecifier
>;
export interface OrderSettingsFieldPolicy {
  automaticallyConfirmAllNewOrders?: FieldPolicy<any> | FieldReadFunction<any>;
  automaticallyFulfillNonShippableGiftCard?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
}
export type OrderSettingsErrorKeySpecifier = Array<
  "field" | "message" | "code" | OrderSettingsErrorKeySpecifier
>;
export interface OrderSettingsErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderSettingsUpdateKeySpecifier = Array<
  | "orderSettings"
  | "orderSettingsErrors"
  | "errors"
  | OrderSettingsUpdateKeySpecifier
>;
export interface OrderSettingsUpdateFieldPolicy {
  orderSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  orderSettingsErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderUpdateKeySpecifier = Array<
  "orderErrors" | "errors" | "order" | OrderUpdateKeySpecifier
>;
export interface OrderUpdateFieldPolicy {
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderUpdateShippingKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderUpdateShippingKeySpecifier
>;
export interface OrderUpdateShippingFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type OrderVoidKeySpecifier = Array<
  "order" | "orderErrors" | "errors" | OrderVoidKeySpecifier
>;
export interface OrderVoidFieldPolicy {
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orderErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "seoTitle"
  | "seoDescription"
  | "title"
  | "content"
  | "publicationDate"
  | "isPublished"
  | "slug"
  | "pageType"
  | "created"
  | "contentJson"
  | "translation"
  | "attributes"
  | PageKeySpecifier
>;
export interface PageFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
  publicationDate?: FieldPolicy<any> | FieldReadFunction<any>;
  isPublished?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  contentJson?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageAttributeAssignKeySpecifier = Array<
  "pageType" | "pageErrors" | "errors" | PageAttributeAssignKeySpecifier
>;
export interface PageAttributeAssignFieldPolicy {
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageAttributeUnassignKeySpecifier = Array<
  "pageType" | "pageErrors" | "errors" | PageAttributeUnassignKeySpecifier
>;
export interface PageAttributeUnassignFieldPolicy {
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageBulkDeleteKeySpecifier = Array<
  "count" | "pageErrors" | "errors" | PageBulkDeleteKeySpecifier
>;
export interface PageBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageBulkPublishKeySpecifier = Array<
  "count" | "pageErrors" | "errors" | PageBulkPublishKeySpecifier
>;
export interface PageBulkPublishFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | PageCountableConnectionKeySpecifier
>;
export interface PageCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | PageCountableEdgeKeySpecifier
>;
export interface PageCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageCreateKeySpecifier = Array<
  "pageErrors" | "errors" | "page" | PageCreateKeySpecifier
>;
export interface PageCreateFieldPolicy {
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageDeleteKeySpecifier = Array<
  "pageErrors" | "errors" | "page" | PageDeleteKeySpecifier
>;
export interface PageDeleteFieldPolicy {
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageErrorKeySpecifier = Array<
  "field" | "message" | "code" | "attributes" | "values" | PageErrorKeySpecifier
>;
export interface PageErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageInfoKeySpecifier = Array<
  | "hasNextPage"
  | "hasPreviousPage"
  | "startCursor"
  | "endCursor"
  | PageInfoKeySpecifier
>;
export interface PageInfoFieldPolicy {
  hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>;
  hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>;
  startCursor?: FieldPolicy<any> | FieldReadFunction<any>;
  endCursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageReorderAttributeValuesKeySpecifier = Array<
  "page" | "pageErrors" | "errors" | PageReorderAttributeValuesKeySpecifier
>;
export interface PageReorderAttributeValuesFieldPolicy {
  page?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTranslatableContentKeySpecifier = Array<
  | "id"
  | "seoTitle"
  | "seoDescription"
  | "title"
  | "content"
  | "contentJson"
  | "translation"
  | "page"
  | "attributeValues"
  | PageTranslatableContentKeySpecifier
>;
export interface PageTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
  contentJson?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValues?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "page" | PageTranslateKeySpecifier
>;
export interface PageTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTranslationKeySpecifier = Array<
  | "id"
  | "language"
  | "seoTitle"
  | "seoDescription"
  | "title"
  | "content"
  | "contentJson"
  | PageTranslationKeySpecifier
>;
export interface PageTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
  contentJson?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "slug"
  | "attributes"
  | "availableAttributes"
  | "hasPages"
  | PageTypeKeySpecifier
>;
export interface PageTypeFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  hasPages?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeBulkDeleteKeySpecifier = Array<
  "count" | "pageErrors" | "errors" | PageTypeBulkDeleteKeySpecifier
>;
export interface PageTypeBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | PageTypeCountableConnectionKeySpecifier
>;
export interface PageTypeCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | PageTypeCountableEdgeKeySpecifier
>;
export interface PageTypeCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeCreateKeySpecifier = Array<
  "pageErrors" | "errors" | "pageType" | PageTypeCreateKeySpecifier
>;
export interface PageTypeCreateFieldPolicy {
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeDeleteKeySpecifier = Array<
  "pageErrors" | "errors" | "pageType" | PageTypeDeleteKeySpecifier
>;
export interface PageTypeDeleteFieldPolicy {
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeReorderAttributesKeySpecifier = Array<
  "pageType" | "pageErrors" | "errors" | PageTypeReorderAttributesKeySpecifier
>;
export interface PageTypeReorderAttributesFieldPolicy {
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageTypeUpdateKeySpecifier = Array<
  "pageErrors" | "errors" | "pageType" | PageTypeUpdateKeySpecifier
>;
export interface PageTypeUpdateFieldPolicy {
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PageUpdateKeySpecifier = Array<
  "pageErrors" | "errors" | "page" | PageUpdateKeySpecifier
>;
export interface PageUpdateFieldPolicy {
  pageErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PasswordChangeKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | PasswordChangeKeySpecifier
>;
export interface PasswordChangeFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "gateway"
  | "isActive"
  | "created"
  | "modified"
  | "token"
  | "checkout"
  | "order"
  | "paymentMethodType"
  | "customerIpAddress"
  | "chargeStatus"
  | "actions"
  | "total"
  | "capturedAmount"
  | "transactions"
  | "availableCaptureAmount"
  | "availableRefundAmount"
  | "creditCard"
  | PaymentKeySpecifier
>;
export interface PaymentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  gateway?: FieldPolicy<any> | FieldReadFunction<any>;
  isActive?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  modified?: FieldPolicy<any> | FieldReadFunction<any>;
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentMethodType?: FieldPolicy<any> | FieldReadFunction<any>;
  customerIpAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  chargeStatus?: FieldPolicy<any> | FieldReadFunction<any>;
  actions?: FieldPolicy<any> | FieldReadFunction<any>;
  total?: FieldPolicy<any> | FieldReadFunction<any>;
  capturedAmount?: FieldPolicy<any> | FieldReadFunction<any>;
  transactions?: FieldPolicy<any> | FieldReadFunction<any>;
  availableCaptureAmount?: FieldPolicy<any> | FieldReadFunction<any>;
  availableRefundAmount?: FieldPolicy<any> | FieldReadFunction<any>;
  creditCard?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentCaptureKeySpecifier = Array<
  "payment" | "paymentErrors" | "errors" | PaymentCaptureKeySpecifier
>;
export interface PaymentCaptureFieldPolicy {
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentCheckBalanceKeySpecifier = Array<
  "data" | "paymentErrors" | "errors" | PaymentCheckBalanceKeySpecifier
>;
export interface PaymentCheckBalanceFieldPolicy {
  data?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | PaymentCountableConnectionKeySpecifier
>;
export interface PaymentCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | PaymentCountableEdgeKeySpecifier
>;
export interface PaymentCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentErrorKeySpecifier = Array<
  "field" | "message" | "code" | PaymentErrorKeySpecifier
>;
export interface PaymentErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentGatewayKeySpecifier = Array<
  "name" | "id" | "config" | "currencies" | PaymentGatewayKeySpecifier
>;
export interface PaymentGatewayFieldPolicy {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  config?: FieldPolicy<any> | FieldReadFunction<any>;
  currencies?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentInitializeKeySpecifier = Array<
  | "initializedPayment"
  | "paymentErrors"
  | "errors"
  | PaymentInitializeKeySpecifier
>;
export interface PaymentInitializeFieldPolicy {
  initializedPayment?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentInitializedKeySpecifier = Array<
  "gateway" | "name" | "data" | PaymentInitializedKeySpecifier
>;
export interface PaymentInitializedFieldPolicy {
  gateway?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  data?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentRefundKeySpecifier = Array<
  "payment" | "paymentErrors" | "errors" | PaymentRefundKeySpecifier
>;
export interface PaymentRefundFieldPolicy {
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentSourceKeySpecifier = Array<
  | "gateway"
  | "paymentMethodId"
  | "creditCardInfo"
  | "metadata"
  | PaymentSourceKeySpecifier
>;
export interface PaymentSourceFieldPolicy {
  gateway?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentMethodId?: FieldPolicy<any> | FieldReadFunction<any>;
  creditCardInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PaymentVoidKeySpecifier = Array<
  "payment" | "paymentErrors" | "errors" | PaymentVoidKeySpecifier
>;
export interface PaymentVoidFieldPolicy {
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PermissionKeySpecifier = Array<
  "code" | "name" | PermissionKeySpecifier
>;
export interface PermissionFieldPolicy {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PermissionGroupCreateKeySpecifier = Array<
  | "permissionGroupErrors"
  | "errors"
  | "group"
  | PermissionGroupCreateKeySpecifier
>;
export interface PermissionGroupCreateFieldPolicy {
  permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  group?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PermissionGroupDeleteKeySpecifier = Array<
  | "permissionGroupErrors"
  | "errors"
  | "group"
  | PermissionGroupDeleteKeySpecifier
>;
export interface PermissionGroupDeleteFieldPolicy {
  permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  group?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PermissionGroupErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "permissions"
  | "users"
  | PermissionGroupErrorKeySpecifier
>;
export interface PermissionGroupErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  users?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PermissionGroupUpdateKeySpecifier = Array<
  | "permissionGroupErrors"
  | "errors"
  | "group"
  | PermissionGroupUpdateKeySpecifier
>;
export interface PermissionGroupUpdateFieldPolicy {
  permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  group?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PluginKeySpecifier = Array<
  | "id"
  | "name"
  | "description"
  | "globalConfiguration"
  | "channelConfigurations"
  | PluginKeySpecifier
>;
export interface PluginFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  globalConfiguration?: FieldPolicy<any> | FieldReadFunction<any>;
  channelConfigurations?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PluginConfigurationKeySpecifier = Array<
  "active" | "channel" | "configuration" | PluginConfigurationKeySpecifier
>;
export interface PluginConfigurationFieldPolicy {
  active?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  configuration?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PluginCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | PluginCountableConnectionKeySpecifier
>;
export interface PluginCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PluginCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | PluginCountableEdgeKeySpecifier
>;
export interface PluginCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PluginErrorKeySpecifier = Array<
  "field" | "message" | "code" | PluginErrorKeySpecifier
>;
export interface PluginErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PluginUpdateKeySpecifier = Array<
  "plugin" | "pluginsErrors" | "errors" | PluginUpdateKeySpecifier
>;
export interface PluginUpdateFieldPolicy {
  plugin?: FieldPolicy<any> | FieldReadFunction<any>;
  pluginsErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PreorderDataKeySpecifier = Array<
  "globalThreshold" | "globalSoldUnits" | "endDate" | PreorderDataKeySpecifier
>;
export interface PreorderDataFieldPolicy {
  globalThreshold?: FieldPolicy<any> | FieldReadFunction<any>;
  globalSoldUnits?: FieldPolicy<any> | FieldReadFunction<any>;
  endDate?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type PreorderThresholdKeySpecifier = Array<
  "quantity" | "soldUnits" | PreorderThresholdKeySpecifier
>;
export interface PreorderThresholdFieldPolicy {
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  soldUnits?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "productType"
  | "slug"
  | "category"
  | "updatedAt"
  | "chargeTaxes"
  | "weight"
  | "defaultVariant"
  | "rating"
  | "channel"
  | "descriptionJson"
  | "thumbnail"
  | "pricing"
  | "isAvailable"
  | "taxType"
  | "attributes"
  | "channelListings"
  | "mediaById"
  | "imageById"
  | "variants"
  | "media"
  | "images"
  | "collections"
  | "translation"
  | "availableForPurchase"
  | "isAvailableForPurchase"
  | ProductKeySpecifier
>;
export interface ProductFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
  updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>;
  weight?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  rating?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
  thumbnail?: FieldPolicy<any> | FieldReadFunction<any>;
  pricing?: FieldPolicy<any> | FieldReadFunction<any>;
  isAvailable?: FieldPolicy<any> | FieldReadFunction<any>;
  taxType?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  channelListings?: FieldPolicy<any> | FieldReadFunction<any>;
  mediaById?: FieldPolicy<any> | FieldReadFunction<any>;
  imageById?: FieldPolicy<any> | FieldReadFunction<any>;
  variants?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  images?: FieldPolicy<any> | FieldReadFunction<any>;
  collections?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>;
  isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductAttributeAssignKeySpecifier = Array<
  | "productType"
  | "productErrors"
  | "errors"
  | ProductAttributeAssignKeySpecifier
>;
export interface ProductAttributeAssignFieldPolicy {
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductAttributeAssignmentUpdateKeySpecifier = Array<
  | "productType"
  | "productErrors"
  | "errors"
  | ProductAttributeAssignmentUpdateKeySpecifier
>;
export interface ProductAttributeAssignmentUpdateFieldPolicy {
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductAttributeUnassignKeySpecifier = Array<
  | "productType"
  | "productErrors"
  | "errors"
  | ProductAttributeUnassignKeySpecifier
>;
export interface ProductAttributeUnassignFieldPolicy {
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductBulkDeleteKeySpecifier = Array<
  "count" | "productErrors" | "errors" | ProductBulkDeleteKeySpecifier
>;
export interface ProductBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductChannelListingKeySpecifier = Array<
  | "id"
  | "publicationDate"
  | "isPublished"
  | "channel"
  | "visibleInListings"
  | "availableForPurchase"
  | "discountedPrice"
  | "purchaseCost"
  | "margin"
  | "isAvailableForPurchase"
  | "pricing"
  | ProductChannelListingKeySpecifier
>;
export interface ProductChannelListingFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  publicationDate?: FieldPolicy<any> | FieldReadFunction<any>;
  isPublished?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  visibleInListings?: FieldPolicy<any> | FieldReadFunction<any>;
  availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>;
  discountedPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  purchaseCost?: FieldPolicy<any> | FieldReadFunction<any>;
  margin?: FieldPolicy<any> | FieldReadFunction<any>;
  isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>;
  pricing?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductChannelListingErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "attributes"
  | "values"
  | "channels"
  | "variants"
  | ProductChannelListingErrorKeySpecifier
>;
export interface ProductChannelListingErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
  variants?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductChannelListingUpdateKeySpecifier = Array<
  | "product"
  | "productChannelListingErrors"
  | "errors"
  | ProductChannelListingUpdateKeySpecifier
>;
export interface ProductChannelListingUpdateFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | ProductCountableConnectionKeySpecifier
>;
export interface ProductCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | ProductCountableEdgeKeySpecifier
>;
export interface ProductCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductCreateKeySpecifier = Array<
  "productErrors" | "errors" | "product" | ProductCreateKeySpecifier
>;
export interface ProductCreateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductDeleteKeySpecifier = Array<
  "productErrors" | "errors" | "product" | ProductDeleteKeySpecifier
>;
export interface ProductDeleteFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "attributes"
  | "values"
  | ProductErrorKeySpecifier
>;
export interface ProductErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductImageKeySpecifier = Array<
  "id" | "alt" | "sortOrder" | "url" | ProductImageKeySpecifier
>;
export interface ProductImageFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  alt?: FieldPolicy<any> | FieldReadFunction<any>;
  sortOrder?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductMediaKeySpecifier = Array<
  | "id"
  | "sortOrder"
  | "alt"
  | "type"
  | "oembedData"
  | "url"
  | ProductMediaKeySpecifier
>;
export interface ProductMediaFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  sortOrder?: FieldPolicy<any> | FieldReadFunction<any>;
  alt?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  oembedData?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductMediaBulkDeleteKeySpecifier = Array<
  "count" | "productErrors" | "errors" | ProductMediaBulkDeleteKeySpecifier
>;
export interface ProductMediaBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductMediaCreateKeySpecifier = Array<
  | "product"
  | "media"
  | "productErrors"
  | "errors"
  | ProductMediaCreateKeySpecifier
>;
export interface ProductMediaCreateFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductMediaDeleteKeySpecifier = Array<
  | "product"
  | "media"
  | "productErrors"
  | "errors"
  | ProductMediaDeleteKeySpecifier
>;
export interface ProductMediaDeleteFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductMediaReorderKeySpecifier = Array<
  | "product"
  | "media"
  | "productErrors"
  | "errors"
  | ProductMediaReorderKeySpecifier
>;
export interface ProductMediaReorderFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductMediaUpdateKeySpecifier = Array<
  | "product"
  | "media"
  | "productErrors"
  | "errors"
  | ProductMediaUpdateKeySpecifier
>;
export interface ProductMediaUpdateFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductPricingInfoKeySpecifier = Array<
  | "onSale"
  | "discount"
  | "discountLocalCurrency"
  | "priceRange"
  | "priceRangeUndiscounted"
  | "priceRangeLocalCurrency"
  | ProductPricingInfoKeySpecifier
>;
export interface ProductPricingInfoFieldPolicy {
  onSale?: FieldPolicy<any> | FieldReadFunction<any>;
  discount?: FieldPolicy<any> | FieldReadFunction<any>;
  discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>;
  priceRange?: FieldPolicy<any> | FieldReadFunction<any>;
  priceRangeUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>;
  priceRangeLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductReorderAttributeValuesKeySpecifier = Array<
  | "product"
  | "productErrors"
  | "errors"
  | ProductReorderAttributeValuesKeySpecifier
>;
export interface ProductReorderAttributeValuesFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTranslatableContentKeySpecifier = Array<
  | "id"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "descriptionJson"
  | "translation"
  | "product"
  | "attributeValues"
  | ProductTranslatableContentKeySpecifier
>;
export interface ProductTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValues?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "product" | ProductTranslateKeySpecifier
>;
export interface ProductTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTranslationKeySpecifier = Array<
  | "id"
  | "language"
  | "seoTitle"
  | "seoDescription"
  | "name"
  | "description"
  | "descriptionJson"
  | ProductTranslationKeySpecifier
>;
export interface ProductTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  seoTitle?: FieldPolicy<any> | FieldReadFunction<any>;
  seoDescription?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "slug"
  | "hasVariants"
  | "isShippingRequired"
  | "isDigital"
  | "weight"
  | "kind"
  | "products"
  | "taxType"
  | "variantAttributes"
  | "assignedVariantAttributes"
  | "productAttributes"
  | "availableAttributes"
  | ProductTypeKeySpecifier
>;
export interface ProductTypeFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  hasVariants?: FieldPolicy<any> | FieldReadFunction<any>;
  isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>;
  isDigital?: FieldPolicy<any> | FieldReadFunction<any>;
  weight?: FieldPolicy<any> | FieldReadFunction<any>;
  kind?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  taxType?: FieldPolicy<any> | FieldReadFunction<any>;
  variantAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  assignedVariantAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  productAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeBulkDeleteKeySpecifier = Array<
  "count" | "productErrors" | "errors" | ProductTypeBulkDeleteKeySpecifier
>;
export interface ProductTypeBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | ProductTypeCountableConnectionKeySpecifier
>;
export interface ProductTypeCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | ProductTypeCountableEdgeKeySpecifier
>;
export interface ProductTypeCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeCreateKeySpecifier = Array<
  "productErrors" | "errors" | "productType" | ProductTypeCreateKeySpecifier
>;
export interface ProductTypeCreateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeDeleteKeySpecifier = Array<
  "productErrors" | "errors" | "productType" | ProductTypeDeleteKeySpecifier
>;
export interface ProductTypeDeleteFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeReorderAttributesKeySpecifier = Array<
  | "productType"
  | "productErrors"
  | "errors"
  | ProductTypeReorderAttributesKeySpecifier
>;
export interface ProductTypeReorderAttributesFieldPolicy {
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductTypeUpdateKeySpecifier = Array<
  "productErrors" | "errors" | "productType" | ProductTypeUpdateKeySpecifier
>;
export interface ProductTypeUpdateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductUpdateKeySpecifier = Array<
  "productErrors" | "errors" | "product" | ProductUpdateKeySpecifier
>;
export interface ProductUpdateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "sku"
  | "product"
  | "trackInventory"
  | "quantityLimitPerCustomer"
  | "weight"
  | "channel"
  | "channelListings"
  | "pricing"
  | "attributes"
  | "margin"
  | "quantityOrdered"
  | "revenue"
  | "images"
  | "media"
  | "translation"
  | "digitalContent"
  | "stocks"
  | "quantityAvailable"
  | "preorder"
  | ProductVariantKeySpecifier
>;
export interface ProductVariantFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  sku?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  trackInventory?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityLimitPerCustomer?: FieldPolicy<any> | FieldReadFunction<any>;
  weight?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  channelListings?: FieldPolicy<any> | FieldReadFunction<any>;
  pricing?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  margin?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityOrdered?: FieldPolicy<any> | FieldReadFunction<any>;
  revenue?: FieldPolicy<any> | FieldReadFunction<any>;
  images?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContent?: FieldPolicy<any> | FieldReadFunction<any>;
  stocks?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityAvailable?: FieldPolicy<any> | FieldReadFunction<any>;
  preorder?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantBulkCreateKeySpecifier = Array<
  | "count"
  | "productVariants"
  | "bulkProductErrors"
  | "errors"
  | ProductVariantBulkCreateKeySpecifier
>;
export interface ProductVariantBulkCreateFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariants?: FieldPolicy<any> | FieldReadFunction<any>;
  bulkProductErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantBulkDeleteKeySpecifier = Array<
  "count" | "productErrors" | "errors" | ProductVariantBulkDeleteKeySpecifier
>;
export interface ProductVariantBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantChannelListingKeySpecifier = Array<
  | "id"
  | "channel"
  | "price"
  | "costPrice"
  | "margin"
  | "preorderThreshold"
  | ProductVariantChannelListingKeySpecifier
>;
export interface ProductVariantChannelListingFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  price?: FieldPolicy<any> | FieldReadFunction<any>;
  costPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  margin?: FieldPolicy<any> | FieldReadFunction<any>;
  preorderThreshold?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantChannelListingUpdateKeySpecifier = Array<
  | "variant"
  | "productChannelListingErrors"
  | "errors"
  | ProductVariantChannelListingUpdateKeySpecifier
>;
export interface ProductVariantChannelListingUpdateFieldPolicy {
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
  productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | ProductVariantCountableConnectionKeySpecifier
>;
export interface ProductVariantCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | ProductVariantCountableEdgeKeySpecifier
>;
export interface ProductVariantCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantCreateKeySpecifier = Array<
  | "productErrors"
  | "errors"
  | "productVariant"
  | ProductVariantCreateKeySpecifier
>;
export interface ProductVariantCreateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantDeleteKeySpecifier = Array<
  | "productErrors"
  | "errors"
  | "productVariant"
  | ProductVariantDeleteKeySpecifier
>;
export interface ProductVariantDeleteFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantPreorderDeactivateKeySpecifier = Array<
  "productVariant" | "errors" | ProductVariantPreorderDeactivateKeySpecifier
>;
export interface ProductVariantPreorderDeactivateFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantReorderKeySpecifier = Array<
  "product" | "productErrors" | "errors" | ProductVariantReorderKeySpecifier
>;
export interface ProductVariantReorderFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantReorderAttributeValuesKeySpecifier = Array<
  | "productVariant"
  | "productErrors"
  | "errors"
  | ProductVariantReorderAttributeValuesKeySpecifier
>;
export interface ProductVariantReorderAttributeValuesFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantSetDefaultKeySpecifier = Array<
  "product" | "productErrors" | "errors" | ProductVariantSetDefaultKeySpecifier
>;
export interface ProductVariantSetDefaultFieldPolicy {
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantStocksCreateKeySpecifier = Array<
  | "productVariant"
  | "bulkStockErrors"
  | "errors"
  | ProductVariantStocksCreateKeySpecifier
>;
export interface ProductVariantStocksCreateFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantStocksDeleteKeySpecifier = Array<
  | "productVariant"
  | "stockErrors"
  | "errors"
  | ProductVariantStocksDeleteKeySpecifier
>;
export interface ProductVariantStocksDeleteFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  stockErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantStocksUpdateKeySpecifier = Array<
  | "productVariant"
  | "bulkStockErrors"
  | "errors"
  | ProductVariantStocksUpdateKeySpecifier
>;
export interface ProductVariantStocksUpdateFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantTranslatableContentKeySpecifier = Array<
  | "id"
  | "name"
  | "translation"
  | "productVariant"
  | "attributeValues"
  | ProductVariantTranslatableContentKeySpecifier
>;
export interface ProductVariantTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  attributeValues?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantTranslateKeySpecifier = Array<
  | "translationErrors"
  | "errors"
  | "productVariant"
  | ProductVariantTranslateKeySpecifier
>;
export interface ProductVariantTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantTranslationKeySpecifier = Array<
  "id" | "language" | "name" | ProductVariantTranslationKeySpecifier
>;
export interface ProductVariantTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ProductVariantUpdateKeySpecifier = Array<
  | "productErrors"
  | "errors"
  | "productVariant"
  | ProductVariantUpdateKeySpecifier
>;
export interface ProductVariantUpdateFieldPolicy {
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type QueryKeySpecifier = Array<
  | "webhook"
  | "webhookEvents"
  | "webhookSamplePayload"
  | "warehouse"
  | "warehouses"
  | "translations"
  | "translation"
  | "stock"
  | "stocks"
  | "shop"
  | "orderSettings"
  | "giftCardSettings"
  | "shippingZone"
  | "shippingZones"
  | "digitalContent"
  | "digitalContents"
  | "categories"
  | "category"
  | "collection"
  | "collections"
  | "product"
  | "products"
  | "productType"
  | "productTypes"
  | "productVariant"
  | "productVariants"
  | "reportProductSales"
  | "payment"
  | "payments"
  | "page"
  | "pages"
  | "pageType"
  | "pageTypes"
  | "homepageEvents"
  | "order"
  | "orders"
  | "draftOrders"
  | "ordersTotal"
  | "orderByToken"
  | "menu"
  | "menus"
  | "menuItem"
  | "menuItems"
  | "giftCard"
  | "giftCards"
  | "giftCardCurrencies"
  | "giftCardTags"
  | "plugin"
  | "plugins"
  | "sale"
  | "sales"
  | "voucher"
  | "vouchers"
  | "exportFile"
  | "exportFiles"
  | "taxTypes"
  | "checkout"
  | "checkouts"
  | "checkoutLines"
  | "channel"
  | "channels"
  | "attributes"
  | "attribute"
  | "appsInstallations"
  | "apps"
  | "app"
  | "appExtensions"
  | "appExtension"
  | "addressValidationRules"
  | "address"
  | "customers"
  | "permissionGroups"
  | "permissionGroup"
  | "me"
  | "staffUsers"
  | "user"
  | "_entities"
  | "_service"
  | QueryKeySpecifier
>;
export interface QueryFieldPolicy {
  webhook?: FieldPolicy<any> | FieldReadFunction<any>;
  webhookEvents?: FieldPolicy<any> | FieldReadFunction<any>;
  webhookSamplePayload?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouses?: FieldPolicy<any> | FieldReadFunction<any>;
  translations?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  stock?: FieldPolicy<any> | FieldReadFunction<any>;
  stocks?: FieldPolicy<any> | FieldReadFunction<any>;
  shop?: FieldPolicy<any> | FieldReadFunction<any>;
  orderSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZones?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContent?: FieldPolicy<any> | FieldReadFunction<any>;
  digitalContents?: FieldPolicy<any> | FieldReadFunction<any>;
  categories?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
  collection?: FieldPolicy<any> | FieldReadFunction<any>;
  collections?: FieldPolicy<any> | FieldReadFunction<any>;
  product?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  productType?: FieldPolicy<any> | FieldReadFunction<any>;
  productTypes?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariants?: FieldPolicy<any> | FieldReadFunction<any>;
  reportProductSales?: FieldPolicy<any> | FieldReadFunction<any>;
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  payments?: FieldPolicy<any> | FieldReadFunction<any>;
  page?: FieldPolicy<any> | FieldReadFunction<any>;
  pages?: FieldPolicy<any> | FieldReadFunction<any>;
  pageType?: FieldPolicy<any> | FieldReadFunction<any>;
  pageTypes?: FieldPolicy<any> | FieldReadFunction<any>;
  homepageEvents?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
  orders?: FieldPolicy<any> | FieldReadFunction<any>;
  draftOrders?: FieldPolicy<any> | FieldReadFunction<any>;
  ordersTotal?: FieldPolicy<any> | FieldReadFunction<any>;
  orderByToken?: FieldPolicy<any> | FieldReadFunction<any>;
  menu?: FieldPolicy<any> | FieldReadFunction<any>;
  menus?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItem?: FieldPolicy<any> | FieldReadFunction<any>;
  menuItems?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCard?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCards?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardCurrencies?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCardTags?: FieldPolicy<any> | FieldReadFunction<any>;
  plugin?: FieldPolicy<any> | FieldReadFunction<any>;
  plugins?: FieldPolicy<any> | FieldReadFunction<any>;
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
  sales?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
  vouchers?: FieldPolicy<any> | FieldReadFunction<any>;
  exportFile?: FieldPolicy<any> | FieldReadFunction<any>;
  exportFiles?: FieldPolicy<any> | FieldReadFunction<any>;
  taxTypes?: FieldPolicy<any> | FieldReadFunction<any>;
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkouts?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutLines?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  appsInstallations?: FieldPolicy<any> | FieldReadFunction<any>;
  apps?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  appExtensions?: FieldPolicy<any> | FieldReadFunction<any>;
  appExtension?: FieldPolicy<any> | FieldReadFunction<any>;
  addressValidationRules?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
  customers?: FieldPolicy<any> | FieldReadFunction<any>;
  permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>;
  permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>;
  me?: FieldPolicy<any> | FieldReadFunction<any>;
  staffUsers?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  _entities?: FieldPolicy<any> | FieldReadFunction<any>;
  _service?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ReducedRateKeySpecifier = Array<
  "rate" | "rateType" | ReducedRateKeySpecifier
>;
export interface ReducedRateFieldPolicy {
  rate?: FieldPolicy<any> | FieldReadFunction<any>;
  rateType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type RefreshTokenKeySpecifier = Array<
  "token" | "user" | "accountErrors" | "errors" | RefreshTokenKeySpecifier
>;
export interface RefreshTokenFieldPolicy {
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type RequestEmailChangeKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | RequestEmailChangeKeySpecifier
>;
export interface RequestEmailChangeFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type RequestPasswordResetKeySpecifier = Array<
  "accountErrors" | "errors" | RequestPasswordResetKeySpecifier
>;
export interface RequestPasswordResetFieldPolicy {
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "type"
  | "startDate"
  | "endDate"
  | "categories"
  | "collections"
  | "products"
  | "variants"
  | "translation"
  | "channelListings"
  | "discountValue"
  | "currency"
  | SaleKeySpecifier
>;
export interface SaleFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  startDate?: FieldPolicy<any> | FieldReadFunction<any>;
  endDate?: FieldPolicy<any> | FieldReadFunction<any>;
  categories?: FieldPolicy<any> | FieldReadFunction<any>;
  collections?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  variants?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  channelListings?: FieldPolicy<any> | FieldReadFunction<any>;
  discountValue?: FieldPolicy<any> | FieldReadFunction<any>;
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleAddCataloguesKeySpecifier = Array<
  "sale" | "discountErrors" | "errors" | SaleAddCataloguesKeySpecifier
>;
export interface SaleAddCataloguesFieldPolicy {
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleBulkDeleteKeySpecifier = Array<
  "count" | "discountErrors" | "errors" | SaleBulkDeleteKeySpecifier
>;
export interface SaleBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleChannelListingKeySpecifier = Array<
  | "id"
  | "channel"
  | "discountValue"
  | "currency"
  | SaleChannelListingKeySpecifier
>;
export interface SaleChannelListingFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  discountValue?: FieldPolicy<any> | FieldReadFunction<any>;
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleChannelListingUpdateKeySpecifier = Array<
  "sale" | "discountErrors" | "errors" | SaleChannelListingUpdateKeySpecifier
>;
export interface SaleChannelListingUpdateFieldPolicy {
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | SaleCountableConnectionKeySpecifier
>;
export interface SaleCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | SaleCountableEdgeKeySpecifier
>;
export interface SaleCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleCreateKeySpecifier = Array<
  "discountErrors" | "errors" | "sale" | SaleCreateKeySpecifier
>;
export interface SaleCreateFieldPolicy {
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleDeleteKeySpecifier = Array<
  "discountErrors" | "errors" | "sale" | SaleDeleteKeySpecifier
>;
export interface SaleDeleteFieldPolicy {
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleRemoveCataloguesKeySpecifier = Array<
  "sale" | "discountErrors" | "errors" | SaleRemoveCataloguesKeySpecifier
>;
export interface SaleRemoveCataloguesFieldPolicy {
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleTranslatableContentKeySpecifier = Array<
  "id" | "name" | "translation" | "sale" | SaleTranslatableContentKeySpecifier
>;
export interface SaleTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "sale" | SaleTranslateKeySpecifier
>;
export interface SaleTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleTranslationKeySpecifier = Array<
  "id" | "language" | "name" | SaleTranslationKeySpecifier
>;
export interface SaleTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SaleUpdateKeySpecifier = Array<
  "discountErrors" | "errors" | "sale" | SaleUpdateKeySpecifier
>;
export interface SaleUpdateFieldPolicy {
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  sale?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SelectedAttributeKeySpecifier = Array<
  "attribute" | "values" | SelectedAttributeKeySpecifier
>;
export interface SelectedAttributeFieldPolicy {
  attribute?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type SetPasswordKeySpecifier = Array<
  | "token"
  | "refreshToken"
  | "csrfToken"
  | "user"
  | "accountErrors"
  | "errors"
  | SetPasswordKeySpecifier
>;
export interface SetPasswordFieldPolicy {
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  refreshToken?: FieldPolicy<any> | FieldReadFunction<any>;
  csrfToken?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "warehouses"
  | "channels"
  | ShippingErrorKeySpecifier
>;
export interface ShippingErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouses?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "type"
  | "name"
  | "description"
  | "maximumDeliveryDays"
  | "minimumDeliveryDays"
  | "maximumOrderWeight"
  | "minimumOrderWeight"
  | "translation"
  | "price"
  | "maximumOrderPrice"
  | "minimumOrderPrice"
  | "active"
  | "message"
  | ShippingMethodKeySpecifier
>;
export interface ShippingMethodFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  price?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  active?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodChannelListingKeySpecifier = Array<
  | "id"
  | "channel"
  | "maximumOrderPrice"
  | "minimumOrderPrice"
  | "price"
  | ShippingMethodChannelListingKeySpecifier
>;
export interface ShippingMethodChannelListingFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  price?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodChannelListingUpdateKeySpecifier = Array<
  | "shippingMethod"
  | "shippingErrors"
  | "errors"
  | ShippingMethodChannelListingUpdateKeySpecifier
>;
export interface ShippingMethodChannelListingUpdateFieldPolicy {
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodPostalCodeRuleKeySpecifier = Array<
  | "id"
  | "start"
  | "end"
  | "inclusionType"
  | ShippingMethodPostalCodeRuleKeySpecifier
>;
export interface ShippingMethodPostalCodeRuleFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  start?: FieldPolicy<any> | FieldReadFunction<any>;
  end?: FieldPolicy<any> | FieldReadFunction<any>;
  inclusionType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodTranslatableContentKeySpecifier = Array<
  | "id"
  | "name"
  | "description"
  | "translation"
  | "shippingMethod"
  | ShippingMethodTranslatableContentKeySpecifier
>;
export interface ShippingMethodTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodTranslationKeySpecifier = Array<
  | "id"
  | "language"
  | "name"
  | "description"
  | ShippingMethodTranslationKeySpecifier
>;
export interface ShippingMethodTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingMethodTypeKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "description"
  | "type"
  | "translation"
  | "channelListings"
  | "maximumOrderPrice"
  | "minimumOrderPrice"
  | "postalCodeRules"
  | "excludedProducts"
  | "minimumOrderWeight"
  | "maximumOrderWeight"
  | "maximumDeliveryDays"
  | "minimumDeliveryDays"
  | ShippingMethodTypeKeySpecifier
>;
export interface ShippingMethodTypeFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  channelListings?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCodeRules?: FieldPolicy<any> | FieldReadFunction<any>;
  excludedProducts?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>;
  maximumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>;
  minimumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceBulkDeleteKeySpecifier = Array<
  "count" | "shippingErrors" | "errors" | ShippingPriceBulkDeleteKeySpecifier
>;
export interface ShippingPriceBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceCreateKeySpecifier = Array<
  | "shippingZone"
  | "shippingMethod"
  | "shippingErrors"
  | "errors"
  | ShippingPriceCreateKeySpecifier
>;
export interface ShippingPriceCreateFieldPolicy {
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceDeleteKeySpecifier = Array<
  | "shippingMethod"
  | "shippingZone"
  | "shippingErrors"
  | "errors"
  | ShippingPriceDeleteKeySpecifier
>;
export interface ShippingPriceDeleteFieldPolicy {
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceExcludeProductsKeySpecifier = Array<
  | "shippingMethod"
  | "shippingErrors"
  | "errors"
  | ShippingPriceExcludeProductsKeySpecifier
>;
export interface ShippingPriceExcludeProductsFieldPolicy {
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceRemoveProductFromExcludeKeySpecifier = Array<
  | "shippingMethod"
  | "shippingErrors"
  | "errors"
  | ShippingPriceRemoveProductFromExcludeKeySpecifier
>;
export interface ShippingPriceRemoveProductFromExcludeFieldPolicy {
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceTranslateKeySpecifier = Array<
  | "translationErrors"
  | "errors"
  | "shippingMethod"
  | ShippingPriceTranslateKeySpecifier
>;
export interface ShippingPriceTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingPriceUpdateKeySpecifier = Array<
  | "shippingZone"
  | "shippingMethod"
  | "shippingErrors"
  | "errors"
  | ShippingPriceUpdateKeySpecifier
>;
export interface ShippingPriceUpdateFieldPolicy {
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "default"
  | "priceRange"
  | "countries"
  | "shippingMethods"
  | "warehouses"
  | "channels"
  | "description"
  | ShippingZoneKeySpecifier
>;
export interface ShippingZoneFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  default?: FieldPolicy<any> | FieldReadFunction<any>;
  priceRange?: FieldPolicy<any> | FieldReadFunction<any>;
  countries?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouses?: FieldPolicy<any> | FieldReadFunction<any>;
  channels?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneBulkDeleteKeySpecifier = Array<
  "count" | "shippingErrors" | "errors" | ShippingZoneBulkDeleteKeySpecifier
>;
export interface ShippingZoneBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneCountableConnectionKeySpecifier = Array<
  | "pageInfo"
  | "edges"
  | "totalCount"
  | ShippingZoneCountableConnectionKeySpecifier
>;
export interface ShippingZoneCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | ShippingZoneCountableEdgeKeySpecifier
>;
export interface ShippingZoneCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneCreateKeySpecifier = Array<
  "shippingErrors" | "errors" | "shippingZone" | ShippingZoneCreateKeySpecifier
>;
export interface ShippingZoneCreateFieldPolicy {
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneDeleteKeySpecifier = Array<
  "shippingErrors" | "errors" | "shippingZone" | ShippingZoneDeleteKeySpecifier
>;
export interface ShippingZoneDeleteFieldPolicy {
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShippingZoneUpdateKeySpecifier = Array<
  "shippingErrors" | "errors" | "shippingZone" | ShippingZoneUpdateKeySpecifier
>;
export interface ShippingZoneUpdateFieldPolicy {
  shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZone?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopKeySpecifier = Array<
  | "availablePaymentGateways"
  | "availableExternalAuthentications"
  | "availableShippingMethods"
  | "channelCurrencies"
  | "countries"
  | "defaultCountry"
  | "defaultMailSenderName"
  | "defaultMailSenderAddress"
  | "description"
  | "domain"
  | "languages"
  | "name"
  | "permissions"
  | "phonePrefixes"
  | "headerText"
  | "includeTaxesInPrices"
  | "fulfillmentAutoApprove"
  | "fulfillmentAllowUnpaid"
  | "displayGrossPrices"
  | "chargeTaxesOnShipping"
  | "trackInventoryByDefault"
  | "defaultWeightUnit"
  | "translation"
  | "automaticFulfillmentDigitalProducts"
  | "reserveStockDurationAnonymousUser"
  | "reserveStockDurationAuthenticatedUser"
  | "limitQuantityPerCheckout"
  | "defaultDigitalMaxDownloads"
  | "defaultDigitalUrlValidDays"
  | "companyAddress"
  | "customerSetPasswordUrl"
  | "staffNotificationRecipients"
  | "limits"
  | "version"
  | ShopKeySpecifier
>;
export interface ShopFieldPolicy {
  availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>;
  availableExternalAuthentications?: FieldPolicy<any> | FieldReadFunction<any>;
  availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>;
  channelCurrencies?: FieldPolicy<any> | FieldReadFunction<any>;
  countries?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultMailSenderName?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultMailSenderAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  domain?: FieldPolicy<any> | FieldReadFunction<any>;
  languages?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  phonePrefixes?: FieldPolicy<any> | FieldReadFunction<any>;
  headerText?: FieldPolicy<any> | FieldReadFunction<any>;
  includeTaxesInPrices?: FieldPolicy<any> | FieldReadFunction<any>;
  fulfillmentAutoApprove?: FieldPolicy<any> | FieldReadFunction<any>;
  fulfillmentAllowUnpaid?: FieldPolicy<any> | FieldReadFunction<any>;
  displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>;
  chargeTaxesOnShipping?: FieldPolicy<any> | FieldReadFunction<any>;
  trackInventoryByDefault?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultWeightUnit?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  automaticFulfillmentDigitalProducts?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
  reserveStockDurationAnonymousUser?: FieldPolicy<any> | FieldReadFunction<any>;
  reserveStockDurationAuthenticatedUser?:
    | FieldPolicy<any>
    | FieldReadFunction<any>;
  limitQuantityPerCheckout?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultDigitalMaxDownloads?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultDigitalUrlValidDays?: FieldPolicy<any> | FieldReadFunction<any>;
  companyAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  customerSetPasswordUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipients?: FieldPolicy<any> | FieldReadFunction<any>;
  limits?: FieldPolicy<any> | FieldReadFunction<any>;
  version?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopAddressUpdateKeySpecifier = Array<
  "shop" | "shopErrors" | "errors" | ShopAddressUpdateKeySpecifier
>;
export interface ShopAddressUpdateFieldPolicy {
  shop?: FieldPolicy<any> | FieldReadFunction<any>;
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopDomainUpdateKeySpecifier = Array<
  "shop" | "shopErrors" | "errors" | ShopDomainUpdateKeySpecifier
>;
export interface ShopDomainUpdateFieldPolicy {
  shop?: FieldPolicy<any> | FieldReadFunction<any>;
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopErrorKeySpecifier = Array<
  "field" | "message" | "code" | ShopErrorKeySpecifier
>;
export interface ShopErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopFetchTaxRatesKeySpecifier = Array<
  "shop" | "shopErrors" | "errors" | ShopFetchTaxRatesKeySpecifier
>;
export interface ShopFetchTaxRatesFieldPolicy {
  shop?: FieldPolicy<any> | FieldReadFunction<any>;
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopSettingsTranslateKeySpecifier = Array<
  "shop" | "translationErrors" | "errors" | ShopSettingsTranslateKeySpecifier
>;
export interface ShopSettingsTranslateFieldPolicy {
  shop?: FieldPolicy<any> | FieldReadFunction<any>;
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopSettingsUpdateKeySpecifier = Array<
  "shop" | "shopErrors" | "errors" | ShopSettingsUpdateKeySpecifier
>;
export interface ShopSettingsUpdateFieldPolicy {
  shop?: FieldPolicy<any> | FieldReadFunction<any>;
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type ShopTranslationKeySpecifier = Array<
  "id" | "language" | "headerText" | "description" | ShopTranslationKeySpecifier
>;
export interface ShopTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  headerText?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffBulkDeleteKeySpecifier = Array<
  "count" | "staffErrors" | "errors" | StaffBulkDeleteKeySpecifier
>;
export interface StaffBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  staffErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffCreateKeySpecifier = Array<
  "staffErrors" | "errors" | "user" | StaffCreateKeySpecifier
>;
export interface StaffCreateFieldPolicy {
  staffErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffDeleteKeySpecifier = Array<
  "staffErrors" | "errors" | "user" | StaffDeleteKeySpecifier
>;
export interface StaffDeleteFieldPolicy {
  staffErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffErrorKeySpecifier = Array<
  | "field"
  | "message"
  | "code"
  | "addressType"
  | "permissions"
  | "groups"
  | "users"
  | StaffErrorKeySpecifier
>;
export interface StaffErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  addressType?: FieldPolicy<any> | FieldReadFunction<any>;
  permissions?: FieldPolicy<any> | FieldReadFunction<any>;
  groups?: FieldPolicy<any> | FieldReadFunction<any>;
  users?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffNotificationRecipientKeySpecifier = Array<
  "id" | "user" | "email" | "active" | StaffNotificationRecipientKeySpecifier
>;
export interface StaffNotificationRecipientFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  active?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffNotificationRecipientCreateKeySpecifier = Array<
  | "shopErrors"
  | "errors"
  | "staffNotificationRecipient"
  | StaffNotificationRecipientCreateKeySpecifier
>;
export interface StaffNotificationRecipientCreateFieldPolicy {
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffNotificationRecipientDeleteKeySpecifier = Array<
  | "shopErrors"
  | "errors"
  | "staffNotificationRecipient"
  | StaffNotificationRecipientDeleteKeySpecifier
>;
export interface StaffNotificationRecipientDeleteFieldPolicy {
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffNotificationRecipientUpdateKeySpecifier = Array<
  | "shopErrors"
  | "errors"
  | "staffNotificationRecipient"
  | StaffNotificationRecipientUpdateKeySpecifier
>;
export interface StaffNotificationRecipientUpdateFieldPolicy {
  shopErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StaffUpdateKeySpecifier = Array<
  "staffErrors" | "errors" | "user" | StaffUpdateKeySpecifier
>;
export interface StaffUpdateFieldPolicy {
  staffErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StockKeySpecifier = Array<
  | "id"
  | "warehouse"
  | "productVariant"
  | "quantity"
  | "quantityAllocated"
  | "quantityReserved"
  | StockKeySpecifier
>;
export interface StockFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityAllocated?: FieldPolicy<any> | FieldReadFunction<any>;
  quantityReserved?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StockCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | StockCountableConnectionKeySpecifier
>;
export interface StockCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StockCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | StockCountableEdgeKeySpecifier
>;
export interface StockCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type StockErrorKeySpecifier = Array<
  "field" | "message" | "code" | StockErrorKeySpecifier
>;
export interface StockErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TaxTypeKeySpecifier = Array<
  "description" | "taxCode" | TaxTypeKeySpecifier
>;
export interface TaxTypeFieldPolicy {
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  taxCode?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TaxedMoneyKeySpecifier = Array<
  "currency" | "gross" | "net" | "tax" | TaxedMoneyKeySpecifier
>;
export interface TaxedMoneyFieldPolicy {
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  gross?: FieldPolicy<any> | FieldReadFunction<any>;
  net?: FieldPolicy<any> | FieldReadFunction<any>;
  tax?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TaxedMoneyRangeKeySpecifier = Array<
  "start" | "stop" | TaxedMoneyRangeKeySpecifier
>;
export interface TaxedMoneyRangeFieldPolicy {
  start?: FieldPolicy<any> | FieldReadFunction<any>;
  stop?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TimePeriodKeySpecifier = Array<
  "amount" | "type" | TimePeriodKeySpecifier
>;
export interface TimePeriodFieldPolicy {
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TransactionKeySpecifier = Array<
  | "id"
  | "created"
  | "payment"
  | "token"
  | "kind"
  | "isSuccess"
  | "error"
  | "gatewayResponse"
  | "amount"
  | TransactionKeySpecifier
>;
export interface TransactionFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  created?: FieldPolicy<any> | FieldReadFunction<any>;
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  token?: FieldPolicy<any> | FieldReadFunction<any>;
  kind?: FieldPolicy<any> | FieldReadFunction<any>;
  isSuccess?: FieldPolicy<any> | FieldReadFunction<any>;
  error?: FieldPolicy<any> | FieldReadFunction<any>;
  gatewayResponse?: FieldPolicy<any> | FieldReadFunction<any>;
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TranslatableItemConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | TranslatableItemConnectionKeySpecifier
>;
export interface TranslatableItemConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TranslatableItemEdgeKeySpecifier = Array<
  "node" | "cursor" | TranslatableItemEdgeKeySpecifier
>;
export interface TranslatableItemEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type TranslationErrorKeySpecifier = Array<
  "field" | "message" | "code" | TranslationErrorKeySpecifier
>;
export interface TranslationErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UpdateMetadataKeySpecifier = Array<
  "metadataErrors" | "errors" | "item" | UpdateMetadataKeySpecifier
>;
export interface UpdateMetadataFieldPolicy {
  metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  item?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UpdatePrivateMetadataKeySpecifier = Array<
  "metadataErrors" | "errors" | "item" | UpdatePrivateMetadataKeySpecifier
>;
export interface UpdatePrivateMetadataFieldPolicy {
  metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  item?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UploadErrorKeySpecifier = Array<
  "field" | "message" | "code" | UploadErrorKeySpecifier
>;
export interface UploadErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "email"
  | "firstName"
  | "lastName"
  | "isStaff"
  | "isActive"
  | "addresses"
  | "checkout"
  | "checkoutTokens"
  | "giftCards"
  | "note"
  | "orders"
  | "userPermissions"
  | "permissionGroups"
  | "editableGroups"
  | "avatar"
  | "events"
  | "storedPaymentSources"
  | "languageCode"
  | "defaultShippingAddress"
  | "defaultBillingAddress"
  | "lastLogin"
  | "dateJoined"
  | UserKeySpecifier
>;
export interface UserFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  firstName?: FieldPolicy<any> | FieldReadFunction<any>;
  lastName?: FieldPolicy<any> | FieldReadFunction<any>;
  isStaff?: FieldPolicy<any> | FieldReadFunction<any>;
  isActive?: FieldPolicy<any> | FieldReadFunction<any>;
  addresses?: FieldPolicy<any> | FieldReadFunction<any>;
  checkout?: FieldPolicy<any> | FieldReadFunction<any>;
  checkoutTokens?: FieldPolicy<any> | FieldReadFunction<any>;
  giftCards?: FieldPolicy<any> | FieldReadFunction<any>;
  note?: FieldPolicy<any> | FieldReadFunction<any>;
  orders?: FieldPolicy<any> | FieldReadFunction<any>;
  userPermissions?: FieldPolicy<any> | FieldReadFunction<any>;
  permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>;
  editableGroups?: FieldPolicy<any> | FieldReadFunction<any>;
  avatar?: FieldPolicy<any> | FieldReadFunction<any>;
  events?: FieldPolicy<any> | FieldReadFunction<any>;
  storedPaymentSources?: FieldPolicy<any> | FieldReadFunction<any>;
  languageCode?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  defaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>;
  lastLogin?: FieldPolicy<any> | FieldReadFunction<any>;
  dateJoined?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserAvatarDeleteKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | UserAvatarDeleteKeySpecifier
>;
export interface UserAvatarDeleteFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserAvatarUpdateKeySpecifier = Array<
  "user" | "accountErrors" | "errors" | UserAvatarUpdateKeySpecifier
>;
export interface UserAvatarUpdateFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserBulkSetActiveKeySpecifier = Array<
  "count" | "accountErrors" | "errors" | UserBulkSetActiveKeySpecifier
>;
export interface UserBulkSetActiveFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | UserCountableConnectionKeySpecifier
>;
export interface UserCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | UserCountableEdgeKeySpecifier
>;
export interface UserCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type UserPermissionKeySpecifier = Array<
  "code" | "name" | "sourcePermissionGroups" | UserPermissionKeySpecifier
>;
export interface UserPermissionFieldPolicy {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  sourcePermissionGroups?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VATKeySpecifier = Array<
  "countryCode" | "standardRate" | "reducedRates" | VATKeySpecifier
>;
export interface VATFieldPolicy {
  countryCode?: FieldPolicy<any> | FieldReadFunction<any>;
  standardRate?: FieldPolicy<any> | FieldReadFunction<any>;
  reducedRates?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VariantMediaAssignKeySpecifier = Array<
  | "productVariant"
  | "media"
  | "productErrors"
  | "errors"
  | VariantMediaAssignKeySpecifier
>;
export interface VariantMediaAssignFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VariantMediaUnassignKeySpecifier = Array<
  | "productVariant"
  | "media"
  | "productErrors"
  | "errors"
  | VariantMediaUnassignKeySpecifier
>;
export interface VariantMediaUnassignFieldPolicy {
  productVariant?: FieldPolicy<any> | FieldReadFunction<any>;
  media?: FieldPolicy<any> | FieldReadFunction<any>;
  productErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VariantPricingInfoKeySpecifier = Array<
  | "onSale"
  | "discount"
  | "discountLocalCurrency"
  | "price"
  | "priceUndiscounted"
  | "priceLocalCurrency"
  | VariantPricingInfoKeySpecifier
>;
export interface VariantPricingInfoFieldPolicy {
  onSale?: FieldPolicy<any> | FieldReadFunction<any>;
  discount?: FieldPolicy<any> | FieldReadFunction<any>;
  discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>;
  price?: FieldPolicy<any> | FieldReadFunction<any>;
  priceUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>;
  priceLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VerifyTokenKeySpecifier = Array<
  | "user"
  | "isValid"
  | "payload"
  | "accountErrors"
  | "errors"
  | VerifyTokenKeySpecifier
>;
export interface VerifyTokenFieldPolicy {
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  isValid?: FieldPolicy<any> | FieldReadFunction<any>;
  payload?: FieldPolicy<any> | FieldReadFunction<any>;
  accountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "code"
  | "usageLimit"
  | "used"
  | "startDate"
  | "endDate"
  | "applyOncePerOrder"
  | "applyOncePerCustomer"
  | "onlyForStaff"
  | "minCheckoutItemsQuantity"
  | "categories"
  | "collections"
  | "products"
  | "variants"
  | "countries"
  | "translation"
  | "discountValueType"
  | "discountValue"
  | "currency"
  | "minSpent"
  | "type"
  | "channelListings"
  | VoucherKeySpecifier
>;
export interface VoucherFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  usageLimit?: FieldPolicy<any> | FieldReadFunction<any>;
  used?: FieldPolicy<any> | FieldReadFunction<any>;
  startDate?: FieldPolicy<any> | FieldReadFunction<any>;
  endDate?: FieldPolicy<any> | FieldReadFunction<any>;
  applyOncePerOrder?: FieldPolicy<any> | FieldReadFunction<any>;
  applyOncePerCustomer?: FieldPolicy<any> | FieldReadFunction<any>;
  onlyForStaff?: FieldPolicy<any> | FieldReadFunction<any>;
  minCheckoutItemsQuantity?: FieldPolicy<any> | FieldReadFunction<any>;
  categories?: FieldPolicy<any> | FieldReadFunction<any>;
  collections?: FieldPolicy<any> | FieldReadFunction<any>;
  products?: FieldPolicy<any> | FieldReadFunction<any>;
  variants?: FieldPolicy<any> | FieldReadFunction<any>;
  countries?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  discountValueType?: FieldPolicy<any> | FieldReadFunction<any>;
  discountValue?: FieldPolicy<any> | FieldReadFunction<any>;
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  minSpent?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  channelListings?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherAddCataloguesKeySpecifier = Array<
  "voucher" | "discountErrors" | "errors" | VoucherAddCataloguesKeySpecifier
>;
export interface VoucherAddCataloguesFieldPolicy {
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherBulkDeleteKeySpecifier = Array<
  "count" | "discountErrors" | "errors" | VoucherBulkDeleteKeySpecifier
>;
export interface VoucherBulkDeleteFieldPolicy {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherChannelListingKeySpecifier = Array<
  | "id"
  | "channel"
  | "discountValue"
  | "currency"
  | "minSpent"
  | VoucherChannelListingKeySpecifier
>;
export interface VoucherChannelListingFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  channel?: FieldPolicy<any> | FieldReadFunction<any>;
  discountValue?: FieldPolicy<any> | FieldReadFunction<any>;
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  minSpent?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherChannelListingUpdateKeySpecifier = Array<
  | "voucher"
  | "discountErrors"
  | "errors"
  | VoucherChannelListingUpdateKeySpecifier
>;
export interface VoucherChannelListingUpdateFieldPolicy {
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | VoucherCountableConnectionKeySpecifier
>;
export interface VoucherCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | VoucherCountableEdgeKeySpecifier
>;
export interface VoucherCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherCreateKeySpecifier = Array<
  "discountErrors" | "errors" | "voucher" | VoucherCreateKeySpecifier
>;
export interface VoucherCreateFieldPolicy {
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherDeleteKeySpecifier = Array<
  "discountErrors" | "errors" | "voucher" | VoucherDeleteKeySpecifier
>;
export interface VoucherDeleteFieldPolicy {
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherRemoveCataloguesKeySpecifier = Array<
  "voucher" | "discountErrors" | "errors" | VoucherRemoveCataloguesKeySpecifier
>;
export interface VoucherRemoveCataloguesFieldPolicy {
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherTranslatableContentKeySpecifier = Array<
  | "id"
  | "name"
  | "translation"
  | "voucher"
  | VoucherTranslatableContentKeySpecifier
>;
export interface VoucherTranslatableContentFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  translation?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherTranslateKeySpecifier = Array<
  "translationErrors" | "errors" | "voucher" | VoucherTranslateKeySpecifier
>;
export interface VoucherTranslateFieldPolicy {
  translationErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherTranslationKeySpecifier = Array<
  "id" | "language" | "name" | VoucherTranslationKeySpecifier
>;
export interface VoucherTranslationFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  language?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type VoucherUpdateKeySpecifier = Array<
  "discountErrors" | "errors" | "voucher" | VoucherUpdateKeySpecifier
>;
export interface VoucherUpdateFieldPolicy {
  discountErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  voucher?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseKeySpecifier = Array<
  | "id"
  | "privateMetadata"
  | "metadata"
  | "name"
  | "slug"
  | "email"
  | "isPrivate"
  | "address"
  | "companyName"
  | "clickAndCollectOption"
  | "shippingZones"
  | WarehouseKeySpecifier
>;
export interface WarehouseFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>;
  metadata?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slug?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  isPrivate?: FieldPolicy<any> | FieldReadFunction<any>;
  address?: FieldPolicy<any> | FieldReadFunction<any>;
  companyName?: FieldPolicy<any> | FieldReadFunction<any>;
  clickAndCollectOption?: FieldPolicy<any> | FieldReadFunction<any>;
  shippingZones?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseCountableConnectionKeySpecifier = Array<
  "pageInfo" | "edges" | "totalCount" | WarehouseCountableConnectionKeySpecifier
>;
export interface WarehouseCountableConnectionFieldPolicy {
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseCountableEdgeKeySpecifier = Array<
  "node" | "cursor" | WarehouseCountableEdgeKeySpecifier
>;
export interface WarehouseCountableEdgeFieldPolicy {
  node?: FieldPolicy<any> | FieldReadFunction<any>;
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseCreateKeySpecifier = Array<
  "warehouseErrors" | "errors" | "warehouse" | WarehouseCreateKeySpecifier
>;
export interface WarehouseCreateFieldPolicy {
  warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseDeleteKeySpecifier = Array<
  "warehouseErrors" | "errors" | "warehouse" | WarehouseDeleteKeySpecifier
>;
export interface WarehouseDeleteFieldPolicy {
  warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseErrorKeySpecifier = Array<
  "field" | "message" | "code" | WarehouseErrorKeySpecifier
>;
export interface WarehouseErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseShippingZoneAssignKeySpecifier = Array<
  | "warehouseErrors"
  | "errors"
  | "warehouse"
  | WarehouseShippingZoneAssignKeySpecifier
>;
export interface WarehouseShippingZoneAssignFieldPolicy {
  warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseShippingZoneUnassignKeySpecifier = Array<
  | "warehouseErrors"
  | "errors"
  | "warehouse"
  | WarehouseShippingZoneUnassignKeySpecifier
>;
export interface WarehouseShippingZoneUnassignFieldPolicy {
  warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WarehouseUpdateKeySpecifier = Array<
  "warehouseErrors" | "errors" | "warehouse" | WarehouseUpdateKeySpecifier
>;
export interface WarehouseUpdateFieldPolicy {
  warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  warehouse?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookKeySpecifier = Array<
  | "id"
  | "name"
  | "events"
  | "syncEvents"
  | "asyncEvents"
  | "app"
  | "eventDeliveries"
  | "targetUrl"
  | "isActive"
  | "secretKey"
  | WebhookKeySpecifier
>;
export interface WebhookFieldPolicy {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  events?: FieldPolicy<any> | FieldReadFunction<any>;
  syncEvents?: FieldPolicy<any> | FieldReadFunction<any>;
  asyncEvents?: FieldPolicy<any> | FieldReadFunction<any>;
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  eventDeliveries?: FieldPolicy<any> | FieldReadFunction<any>;
  targetUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  isActive?: FieldPolicy<any> | FieldReadFunction<any>;
  secretKey?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookCreateKeySpecifier = Array<
  "webhookErrors" | "errors" | "webhook" | WebhookCreateKeySpecifier
>;
export interface WebhookCreateFieldPolicy {
  webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  webhook?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookDeleteKeySpecifier = Array<
  "webhookErrors" | "errors" | "webhook" | WebhookDeleteKeySpecifier
>;
export interface WebhookDeleteFieldPolicy {
  webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  webhook?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookErrorKeySpecifier = Array<
  "field" | "message" | "code" | WebhookErrorKeySpecifier
>;
export interface WebhookErrorFieldPolicy {
  field?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  code?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookEventKeySpecifier = Array<
  "name" | "eventType" | WebhookEventKeySpecifier
>;
export interface WebhookEventFieldPolicy {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  eventType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookEventAsyncKeySpecifier = Array<
  "name" | "eventType" | WebhookEventAsyncKeySpecifier
>;
export interface WebhookEventAsyncFieldPolicy {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  eventType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookEventSyncKeySpecifier = Array<
  "name" | "eventType" | WebhookEventSyncKeySpecifier
>;
export interface WebhookEventSyncFieldPolicy {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  eventType?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WebhookUpdateKeySpecifier = Array<
  "webhookErrors" | "errors" | "webhook" | WebhookUpdateKeySpecifier
>;
export interface WebhookUpdateFieldPolicy {
  webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>;
  errors?: FieldPolicy<any> | FieldReadFunction<any>;
  webhook?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type WeightKeySpecifier = Array<"unit" | "value" | WeightKeySpecifier>;
export interface WeightFieldPolicy {
  unit?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
}
export type _ServiceKeySpecifier = Array<"sdl" | _ServiceKeySpecifier>;
export interface _ServiceFieldPolicy {
  sdl?: FieldPolicy<any> | FieldReadFunction<any>;
}
export interface StrictTypedTypePolicies {
  AccountAddressCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountAddressCreateKeySpecifier
      | (() => undefined | AccountAddressCreateKeySpecifier);
    fields?: AccountAddressCreateFieldPolicy;
  };
  AccountAddressDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountAddressDeleteKeySpecifier
      | (() => undefined | AccountAddressDeleteKeySpecifier);
    fields?: AccountAddressDeleteFieldPolicy;
  };
  AccountAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountAddressUpdateKeySpecifier
      | (() => undefined | AccountAddressUpdateKeySpecifier);
    fields?: AccountAddressUpdateFieldPolicy;
  };
  AccountDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountDeleteKeySpecifier
      | (() => undefined | AccountDeleteKeySpecifier);
    fields?: AccountDeleteFieldPolicy;
  };
  AccountError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountErrorKeySpecifier
      | (() => undefined | AccountErrorKeySpecifier);
    fields?: AccountErrorFieldPolicy;
  };
  AccountRegister?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountRegisterKeySpecifier
      | (() => undefined | AccountRegisterKeySpecifier);
    fields?: AccountRegisterFieldPolicy;
  };
  AccountRequestDeletion?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountRequestDeletionKeySpecifier
      | (() => undefined | AccountRequestDeletionKeySpecifier);
    fields?: AccountRequestDeletionFieldPolicy;
  };
  AccountSetDefaultAddress?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountSetDefaultAddressKeySpecifier
      | (() => undefined | AccountSetDefaultAddressKeySpecifier);
    fields?: AccountSetDefaultAddressFieldPolicy;
  };
  AccountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AccountUpdateKeySpecifier
      | (() => undefined | AccountUpdateKeySpecifier);
    fields?: AccountUpdateFieldPolicy;
  };
  Address?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddressKeySpecifier
      | (() => undefined | AddressKeySpecifier);
    fields?: AddressFieldPolicy;
  };
  AddressCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddressCreateKeySpecifier
      | (() => undefined | AddressCreateKeySpecifier);
    fields?: AddressCreateFieldPolicy;
  };
  AddressDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddressDeleteKeySpecifier
      | (() => undefined | AddressDeleteKeySpecifier);
    fields?: AddressDeleteFieldPolicy;
  };
  AddressSetDefault?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddressSetDefaultKeySpecifier
      | (() => undefined | AddressSetDefaultKeySpecifier);
    fields?: AddressSetDefaultFieldPolicy;
  };
  AddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddressUpdateKeySpecifier
      | (() => undefined | AddressUpdateKeySpecifier);
    fields?: AddressUpdateFieldPolicy;
  };
  AddressValidationData?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AddressValidationDataKeySpecifier
      | (() => undefined | AddressValidationDataKeySpecifier);
    fields?: AddressValidationDataFieldPolicy;
  };
  Allocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AllocationKeySpecifier
      | (() => undefined | AllocationKeySpecifier);
    fields?: AllocationFieldPolicy;
  };
  App?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | AppKeySpecifier | (() => undefined | AppKeySpecifier);
    fields?: AppFieldPolicy;
  };
  AppActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppActivateKeySpecifier
      | (() => undefined | AppActivateKeySpecifier);
    fields?: AppActivateFieldPolicy;
  };
  AppCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppCountableConnectionKeySpecifier
      | (() => undefined | AppCountableConnectionKeySpecifier);
    fields?: AppCountableConnectionFieldPolicy;
  };
  AppCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppCountableEdgeKeySpecifier
      | (() => undefined | AppCountableEdgeKeySpecifier);
    fields?: AppCountableEdgeFieldPolicy;
  };
  AppCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppCreateKeySpecifier
      | (() => undefined | AppCreateKeySpecifier);
    fields?: AppCreateFieldPolicy;
  };
  AppDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppDeactivateKeySpecifier
      | (() => undefined | AppDeactivateKeySpecifier);
    fields?: AppDeactivateFieldPolicy;
  };
  AppDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppDeleteKeySpecifier
      | (() => undefined | AppDeleteKeySpecifier);
    fields?: AppDeleteFieldPolicy;
  };
  AppDeleteFailedInstallation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppDeleteFailedInstallationKeySpecifier
      | (() => undefined | AppDeleteFailedInstallationKeySpecifier);
    fields?: AppDeleteFailedInstallationFieldPolicy;
  };
  AppError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppErrorKeySpecifier
      | (() => undefined | AppErrorKeySpecifier);
    fields?: AppErrorFieldPolicy;
  };
  AppExtension?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppExtensionKeySpecifier
      | (() => undefined | AppExtensionKeySpecifier);
    fields?: AppExtensionFieldPolicy;
  };
  AppExtensionCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppExtensionCountableConnectionKeySpecifier
      | (() => undefined | AppExtensionCountableConnectionKeySpecifier);
    fields?: AppExtensionCountableConnectionFieldPolicy;
  };
  AppExtensionCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppExtensionCountableEdgeKeySpecifier
      | (() => undefined | AppExtensionCountableEdgeKeySpecifier);
    fields?: AppExtensionCountableEdgeFieldPolicy;
  };
  AppFetchManifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppFetchManifestKeySpecifier
      | (() => undefined | AppFetchManifestKeySpecifier);
    fields?: AppFetchManifestFieldPolicy;
  };
  AppInstall?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppInstallKeySpecifier
      | (() => undefined | AppInstallKeySpecifier);
    fields?: AppInstallFieldPolicy;
  };
  AppInstallation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppInstallationKeySpecifier
      | (() => undefined | AppInstallationKeySpecifier);
    fields?: AppInstallationFieldPolicy;
  };
  AppManifestExtension?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppManifestExtensionKeySpecifier
      | (() => undefined | AppManifestExtensionKeySpecifier);
    fields?: AppManifestExtensionFieldPolicy;
  };
  AppRetryInstall?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppRetryInstallKeySpecifier
      | (() => undefined | AppRetryInstallKeySpecifier);
    fields?: AppRetryInstallFieldPolicy;
  };
  AppToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppTokenKeySpecifier
      | (() => undefined | AppTokenKeySpecifier);
    fields?: AppTokenFieldPolicy;
  };
  AppTokenCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppTokenCreateKeySpecifier
      | (() => undefined | AppTokenCreateKeySpecifier);
    fields?: AppTokenCreateFieldPolicy;
  };
  AppTokenDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppTokenDeleteKeySpecifier
      | (() => undefined | AppTokenDeleteKeySpecifier);
    fields?: AppTokenDeleteFieldPolicy;
  };
  AppTokenVerify?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppTokenVerifyKeySpecifier
      | (() => undefined | AppTokenVerifyKeySpecifier);
    fields?: AppTokenVerifyFieldPolicy;
  };
  AppUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppUpdateKeySpecifier
      | (() => undefined | AppUpdateKeySpecifier);
    fields?: AppUpdateFieldPolicy;
  };
  AssignNavigation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AssignNavigationKeySpecifier
      | (() => undefined | AssignNavigationKeySpecifier);
    fields?: AssignNavigationFieldPolicy;
  };
  AssignedVariantAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AssignedVariantAttributeKeySpecifier
      | (() => undefined | AssignedVariantAttributeKeySpecifier);
    fields?: AssignedVariantAttributeFieldPolicy;
  };
  Attribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeKeySpecifier
      | (() => undefined | AttributeKeySpecifier);
    fields?: AttributeFieldPolicy;
  };
  AttributeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeBulkDeleteKeySpecifier
      | (() => undefined | AttributeBulkDeleteKeySpecifier);
    fields?: AttributeBulkDeleteFieldPolicy;
  };
  AttributeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeCountableConnectionKeySpecifier
      | (() => undefined | AttributeCountableConnectionKeySpecifier);
    fields?: AttributeCountableConnectionFieldPolicy;
  };
  AttributeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeCountableEdgeKeySpecifier
      | (() => undefined | AttributeCountableEdgeKeySpecifier);
    fields?: AttributeCountableEdgeFieldPolicy;
  };
  AttributeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeCreateKeySpecifier
      | (() => undefined | AttributeCreateKeySpecifier);
    fields?: AttributeCreateFieldPolicy;
  };
  AttributeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeDeleteKeySpecifier
      | (() => undefined | AttributeDeleteKeySpecifier);
    fields?: AttributeDeleteFieldPolicy;
  };
  AttributeError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeErrorKeySpecifier
      | (() => undefined | AttributeErrorKeySpecifier);
    fields?: AttributeErrorFieldPolicy;
  };
  AttributeReorderValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeReorderValuesKeySpecifier
      | (() => undefined | AttributeReorderValuesKeySpecifier);
    fields?: AttributeReorderValuesFieldPolicy;
  };
  AttributeTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeTranslatableContentKeySpecifier
      | (() => undefined | AttributeTranslatableContentKeySpecifier);
    fields?: AttributeTranslatableContentFieldPolicy;
  };
  AttributeTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeTranslateKeySpecifier
      | (() => undefined | AttributeTranslateKeySpecifier);
    fields?: AttributeTranslateFieldPolicy;
  };
  AttributeTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeTranslationKeySpecifier
      | (() => undefined | AttributeTranslationKeySpecifier);
    fields?: AttributeTranslationFieldPolicy;
  };
  AttributeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeUpdateKeySpecifier
      | (() => undefined | AttributeUpdateKeySpecifier);
    fields?: AttributeUpdateFieldPolicy;
  };
  AttributeValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueKeySpecifier
      | (() => undefined | AttributeValueKeySpecifier);
    fields?: AttributeValueFieldPolicy;
  };
  AttributeValueBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueBulkDeleteKeySpecifier
      | (() => undefined | AttributeValueBulkDeleteKeySpecifier);
    fields?: AttributeValueBulkDeleteFieldPolicy;
  };
  AttributeValueCountableConnection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | AttributeValueCountableConnectionKeySpecifier
      | (() => undefined | AttributeValueCountableConnectionKeySpecifier);
    fields?: AttributeValueCountableConnectionFieldPolicy;
  };
  AttributeValueCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueCountableEdgeKeySpecifier
      | (() => undefined | AttributeValueCountableEdgeKeySpecifier);
    fields?: AttributeValueCountableEdgeFieldPolicy;
  };
  AttributeValueCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueCreateKeySpecifier
      | (() => undefined | AttributeValueCreateKeySpecifier);
    fields?: AttributeValueCreateFieldPolicy;
  };
  AttributeValueDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueDeleteKeySpecifier
      | (() => undefined | AttributeValueDeleteKeySpecifier);
    fields?: AttributeValueDeleteFieldPolicy;
  };
  AttributeValueTranslatableContent?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | AttributeValueTranslatableContentKeySpecifier
      | (() => undefined | AttributeValueTranslatableContentKeySpecifier);
    fields?: AttributeValueTranslatableContentFieldPolicy;
  };
  AttributeValueTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueTranslateKeySpecifier
      | (() => undefined | AttributeValueTranslateKeySpecifier);
    fields?: AttributeValueTranslateFieldPolicy;
  };
  AttributeValueTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueTranslationKeySpecifier
      | (() => undefined | AttributeValueTranslationKeySpecifier);
    fields?: AttributeValueTranslationFieldPolicy;
  };
  AttributeValueUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AttributeValueUpdateKeySpecifier
      | (() => undefined | AttributeValueUpdateKeySpecifier);
    fields?: AttributeValueUpdateFieldPolicy;
  };
  BulkProductError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | BulkProductErrorKeySpecifier
      | (() => undefined | BulkProductErrorKeySpecifier);
    fields?: BulkProductErrorFieldPolicy;
  };
  BulkStockError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | BulkStockErrorKeySpecifier
      | (() => undefined | BulkStockErrorKeySpecifier);
    fields?: BulkStockErrorFieldPolicy;
  };
  Category?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryKeySpecifier
      | (() => undefined | CategoryKeySpecifier);
    fields?: CategoryFieldPolicy;
  };
  CategoryBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryBulkDeleteKeySpecifier
      | (() => undefined | CategoryBulkDeleteKeySpecifier);
    fields?: CategoryBulkDeleteFieldPolicy;
  };
  CategoryCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryCountableConnectionKeySpecifier
      | (() => undefined | CategoryCountableConnectionKeySpecifier);
    fields?: CategoryCountableConnectionFieldPolicy;
  };
  CategoryCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryCountableEdgeKeySpecifier
      | (() => undefined | CategoryCountableEdgeKeySpecifier);
    fields?: CategoryCountableEdgeFieldPolicy;
  };
  CategoryCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryCreateKeySpecifier
      | (() => undefined | CategoryCreateKeySpecifier);
    fields?: CategoryCreateFieldPolicy;
  };
  CategoryDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryDeleteKeySpecifier
      | (() => undefined | CategoryDeleteKeySpecifier);
    fields?: CategoryDeleteFieldPolicy;
  };
  CategoryTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryTranslatableContentKeySpecifier
      | (() => undefined | CategoryTranslatableContentKeySpecifier);
    fields?: CategoryTranslatableContentFieldPolicy;
  };
  CategoryTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryTranslateKeySpecifier
      | (() => undefined | CategoryTranslateKeySpecifier);
    fields?: CategoryTranslateFieldPolicy;
  };
  CategoryTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryTranslationKeySpecifier
      | (() => undefined | CategoryTranslationKeySpecifier);
    fields?: CategoryTranslationFieldPolicy;
  };
  CategoryUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CategoryUpdateKeySpecifier
      | (() => undefined | CategoryUpdateKeySpecifier);
    fields?: CategoryUpdateFieldPolicy;
  };
  Channel?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelKeySpecifier
      | (() => undefined | ChannelKeySpecifier);
    fields?: ChannelFieldPolicy;
  };
  ChannelActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelActivateKeySpecifier
      | (() => undefined | ChannelActivateKeySpecifier);
    fields?: ChannelActivateFieldPolicy;
  };
  ChannelCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelCreateKeySpecifier
      | (() => undefined | ChannelCreateKeySpecifier);
    fields?: ChannelCreateFieldPolicy;
  };
  ChannelDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelDeactivateKeySpecifier
      | (() => undefined | ChannelDeactivateKeySpecifier);
    fields?: ChannelDeactivateFieldPolicy;
  };
  ChannelDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelDeleteKeySpecifier
      | (() => undefined | ChannelDeleteKeySpecifier);
    fields?: ChannelDeleteFieldPolicy;
  };
  ChannelError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelErrorKeySpecifier
      | (() => undefined | ChannelErrorKeySpecifier);
    fields?: ChannelErrorFieldPolicy;
  };
  ChannelUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChannelUpdateKeySpecifier
      | (() => undefined | ChannelUpdateKeySpecifier);
    fields?: ChannelUpdateFieldPolicy;
  };
  Checkout?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutKeySpecifier
      | (() => undefined | CheckoutKeySpecifier);
    fields?: CheckoutFieldPolicy;
  };
  CheckoutAddPromoCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutAddPromoCodeKeySpecifier
      | (() => undefined | CheckoutAddPromoCodeKeySpecifier);
    fields?: CheckoutAddPromoCodeFieldPolicy;
  };
  CheckoutBillingAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutBillingAddressUpdateKeySpecifier
      | (() => undefined | CheckoutBillingAddressUpdateKeySpecifier);
    fields?: CheckoutBillingAddressUpdateFieldPolicy;
  };
  CheckoutComplete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutCompleteKeySpecifier
      | (() => undefined | CheckoutCompleteKeySpecifier);
    fields?: CheckoutCompleteFieldPolicy;
  };
  CheckoutCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutCountableConnectionKeySpecifier
      | (() => undefined | CheckoutCountableConnectionKeySpecifier);
    fields?: CheckoutCountableConnectionFieldPolicy;
  };
  CheckoutCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutCountableEdgeKeySpecifier
      | (() => undefined | CheckoutCountableEdgeKeySpecifier);
    fields?: CheckoutCountableEdgeFieldPolicy;
  };
  CheckoutCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutCreateKeySpecifier
      | (() => undefined | CheckoutCreateKeySpecifier);
    fields?: CheckoutCreateFieldPolicy;
  };
  CheckoutCustomerAttach?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutCustomerAttachKeySpecifier
      | (() => undefined | CheckoutCustomerAttachKeySpecifier);
    fields?: CheckoutCustomerAttachFieldPolicy;
  };
  CheckoutCustomerDetach?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutCustomerDetachKeySpecifier
      | (() => undefined | CheckoutCustomerDetachKeySpecifier);
    fields?: CheckoutCustomerDetachFieldPolicy;
  };
  CheckoutDeliveryMethodUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutDeliveryMethodUpdateKeySpecifier
      | (() => undefined | CheckoutDeliveryMethodUpdateKeySpecifier);
    fields?: CheckoutDeliveryMethodUpdateFieldPolicy;
  };
  CheckoutEmailUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutEmailUpdateKeySpecifier
      | (() => undefined | CheckoutEmailUpdateKeySpecifier);
    fields?: CheckoutEmailUpdateFieldPolicy;
  };
  CheckoutError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutErrorKeySpecifier
      | (() => undefined | CheckoutErrorKeySpecifier);
    fields?: CheckoutErrorFieldPolicy;
  };
  CheckoutLanguageCodeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLanguageCodeUpdateKeySpecifier
      | (() => undefined | CheckoutLanguageCodeUpdateKeySpecifier);
    fields?: CheckoutLanguageCodeUpdateFieldPolicy;
  };
  CheckoutLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLineKeySpecifier
      | (() => undefined | CheckoutLineKeySpecifier);
    fields?: CheckoutLineFieldPolicy;
  };
  CheckoutLineCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLineCountableConnectionKeySpecifier
      | (() => undefined | CheckoutLineCountableConnectionKeySpecifier);
    fields?: CheckoutLineCountableConnectionFieldPolicy;
  };
  CheckoutLineCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLineCountableEdgeKeySpecifier
      | (() => undefined | CheckoutLineCountableEdgeKeySpecifier);
    fields?: CheckoutLineCountableEdgeFieldPolicy;
  };
  CheckoutLineDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLineDeleteKeySpecifier
      | (() => undefined | CheckoutLineDeleteKeySpecifier);
    fields?: CheckoutLineDeleteFieldPolicy;
  };
  CheckoutLinesAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLinesAddKeySpecifier
      | (() => undefined | CheckoutLinesAddKeySpecifier);
    fields?: CheckoutLinesAddFieldPolicy;
  };
  CheckoutLinesDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLinesDeleteKeySpecifier
      | (() => undefined | CheckoutLinesDeleteKeySpecifier);
    fields?: CheckoutLinesDeleteFieldPolicy;
  };
  CheckoutLinesUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutLinesUpdateKeySpecifier
      | (() => undefined | CheckoutLinesUpdateKeySpecifier);
    fields?: CheckoutLinesUpdateFieldPolicy;
  };
  CheckoutPaymentCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutPaymentCreateKeySpecifier
      | (() => undefined | CheckoutPaymentCreateKeySpecifier);
    fields?: CheckoutPaymentCreateFieldPolicy;
  };
  CheckoutRemovePromoCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutRemovePromoCodeKeySpecifier
      | (() => undefined | CheckoutRemovePromoCodeKeySpecifier);
    fields?: CheckoutRemovePromoCodeFieldPolicy;
  };
  CheckoutShippingAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutShippingAddressUpdateKeySpecifier
      | (() => undefined | CheckoutShippingAddressUpdateKeySpecifier);
    fields?: CheckoutShippingAddressUpdateFieldPolicy;
  };
  CheckoutShippingMethodUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CheckoutShippingMethodUpdateKeySpecifier
      | (() => undefined | CheckoutShippingMethodUpdateKeySpecifier);
    fields?: CheckoutShippingMethodUpdateFieldPolicy;
  };
  ChoiceValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ChoiceValueKeySpecifier
      | (() => undefined | ChoiceValueKeySpecifier);
    fields?: ChoiceValueFieldPolicy;
  };
  Collection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionKeySpecifier
      | (() => undefined | CollectionKeySpecifier);
    fields?: CollectionFieldPolicy;
  };
  CollectionAddProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionAddProductsKeySpecifier
      | (() => undefined | CollectionAddProductsKeySpecifier);
    fields?: CollectionAddProductsFieldPolicy;
  };
  CollectionBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionBulkDeleteKeySpecifier
      | (() => undefined | CollectionBulkDeleteKeySpecifier);
    fields?: CollectionBulkDeleteFieldPolicy;
  };
  CollectionChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionChannelListingKeySpecifier
      | (() => undefined | CollectionChannelListingKeySpecifier);
    fields?: CollectionChannelListingFieldPolicy;
  };
  CollectionChannelListingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionChannelListingErrorKeySpecifier
      | (() => undefined | CollectionChannelListingErrorKeySpecifier);
    fields?: CollectionChannelListingErrorFieldPolicy;
  };
  CollectionChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionChannelListingUpdateKeySpecifier
      | (() => undefined | CollectionChannelListingUpdateKeySpecifier);
    fields?: CollectionChannelListingUpdateFieldPolicy;
  };
  CollectionCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionCountableConnectionKeySpecifier
      | (() => undefined | CollectionCountableConnectionKeySpecifier);
    fields?: CollectionCountableConnectionFieldPolicy;
  };
  CollectionCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionCountableEdgeKeySpecifier
      | (() => undefined | CollectionCountableEdgeKeySpecifier);
    fields?: CollectionCountableEdgeFieldPolicy;
  };
  CollectionCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionCreateKeySpecifier
      | (() => undefined | CollectionCreateKeySpecifier);
    fields?: CollectionCreateFieldPolicy;
  };
  CollectionDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionDeleteKeySpecifier
      | (() => undefined | CollectionDeleteKeySpecifier);
    fields?: CollectionDeleteFieldPolicy;
  };
  CollectionError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionErrorKeySpecifier
      | (() => undefined | CollectionErrorKeySpecifier);
    fields?: CollectionErrorFieldPolicy;
  };
  CollectionRemoveProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionRemoveProductsKeySpecifier
      | (() => undefined | CollectionRemoveProductsKeySpecifier);
    fields?: CollectionRemoveProductsFieldPolicy;
  };
  CollectionReorderProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionReorderProductsKeySpecifier
      | (() => undefined | CollectionReorderProductsKeySpecifier);
    fields?: CollectionReorderProductsFieldPolicy;
  };
  CollectionTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionTranslatableContentKeySpecifier
      | (() => undefined | CollectionTranslatableContentKeySpecifier);
    fields?: CollectionTranslatableContentFieldPolicy;
  };
  CollectionTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionTranslateKeySpecifier
      | (() => undefined | CollectionTranslateKeySpecifier);
    fields?: CollectionTranslateFieldPolicy;
  };
  CollectionTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionTranslationKeySpecifier
      | (() => undefined | CollectionTranslationKeySpecifier);
    fields?: CollectionTranslationFieldPolicy;
  };
  CollectionUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CollectionUpdateKeySpecifier
      | (() => undefined | CollectionUpdateKeySpecifier);
    fields?: CollectionUpdateFieldPolicy;
  };
  ConfigurationItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ConfigurationItemKeySpecifier
      | (() => undefined | ConfigurationItemKeySpecifier);
    fields?: ConfigurationItemFieldPolicy;
  };
  ConfirmAccount?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ConfirmAccountKeySpecifier
      | (() => undefined | ConfirmAccountKeySpecifier);
    fields?: ConfirmAccountFieldPolicy;
  };
  ConfirmEmailChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ConfirmEmailChangeKeySpecifier
      | (() => undefined | ConfirmEmailChangeKeySpecifier);
    fields?: ConfirmEmailChangeFieldPolicy;
  };
  CountryDisplay?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CountryDisplayKeySpecifier
      | (() => undefined | CountryDisplayKeySpecifier);
    fields?: CountryDisplayFieldPolicy;
  };
  CreateToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CreateTokenKeySpecifier
      | (() => undefined | CreateTokenKeySpecifier);
    fields?: CreateTokenFieldPolicy;
  };
  CreditCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CreditCardKeySpecifier
      | (() => undefined | CreditCardKeySpecifier);
    fields?: CreditCardFieldPolicy;
  };
  CustomerBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CustomerBulkDeleteKeySpecifier
      | (() => undefined | CustomerBulkDeleteKeySpecifier);
    fields?: CustomerBulkDeleteFieldPolicy;
  };
  CustomerCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CustomerCreateKeySpecifier
      | (() => undefined | CustomerCreateKeySpecifier);
    fields?: CustomerCreateFieldPolicy;
  };
  CustomerDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CustomerDeleteKeySpecifier
      | (() => undefined | CustomerDeleteKeySpecifier);
    fields?: CustomerDeleteFieldPolicy;
  };
  CustomerEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CustomerEventKeySpecifier
      | (() => undefined | CustomerEventKeySpecifier);
    fields?: CustomerEventFieldPolicy;
  };
  CustomerUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CustomerUpdateKeySpecifier
      | (() => undefined | CustomerUpdateKeySpecifier);
    fields?: CustomerUpdateFieldPolicy;
  };
  DeactivateAllUserTokens?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DeactivateAllUserTokensKeySpecifier
      | (() => undefined | DeactivateAllUserTokensKeySpecifier);
    fields?: DeactivateAllUserTokensFieldPolicy;
  };
  DeleteMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DeleteMetadataKeySpecifier
      | (() => undefined | DeleteMetadataKeySpecifier);
    fields?: DeleteMetadataFieldPolicy;
  };
  DeletePrivateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DeletePrivateMetadataKeySpecifier
      | (() => undefined | DeletePrivateMetadataKeySpecifier);
    fields?: DeletePrivateMetadataFieldPolicy;
  };
  DigitalContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentKeySpecifier
      | (() => undefined | DigitalContentKeySpecifier);
    fields?: DigitalContentFieldPolicy;
  };
  DigitalContentCountableConnection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | DigitalContentCountableConnectionKeySpecifier
      | (() => undefined | DigitalContentCountableConnectionKeySpecifier);
    fields?: DigitalContentCountableConnectionFieldPolicy;
  };
  DigitalContentCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentCountableEdgeKeySpecifier
      | (() => undefined | DigitalContentCountableEdgeKeySpecifier);
    fields?: DigitalContentCountableEdgeFieldPolicy;
  };
  DigitalContentCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentCreateKeySpecifier
      | (() => undefined | DigitalContentCreateKeySpecifier);
    fields?: DigitalContentCreateFieldPolicy;
  };
  DigitalContentDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentDeleteKeySpecifier
      | (() => undefined | DigitalContentDeleteKeySpecifier);
    fields?: DigitalContentDeleteFieldPolicy;
  };
  DigitalContentUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentUpdateKeySpecifier
      | (() => undefined | DigitalContentUpdateKeySpecifier);
    fields?: DigitalContentUpdateFieldPolicy;
  };
  DigitalContentUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentUrlKeySpecifier
      | (() => undefined | DigitalContentUrlKeySpecifier);
    fields?: DigitalContentUrlFieldPolicy;
  };
  DigitalContentUrlCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DigitalContentUrlCreateKeySpecifier
      | (() => undefined | DigitalContentUrlCreateKeySpecifier);
    fields?: DigitalContentUrlCreateFieldPolicy;
  };
  DiscountError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DiscountErrorKeySpecifier
      | (() => undefined | DiscountErrorKeySpecifier);
    fields?: DiscountErrorFieldPolicy;
  };
  Domain?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DomainKeySpecifier
      | (() => undefined | DomainKeySpecifier);
    fields?: DomainFieldPolicy;
  };
  DraftOrderBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DraftOrderBulkDeleteKeySpecifier
      | (() => undefined | DraftOrderBulkDeleteKeySpecifier);
    fields?: DraftOrderBulkDeleteFieldPolicy;
  };
  DraftOrderComplete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DraftOrderCompleteKeySpecifier
      | (() => undefined | DraftOrderCompleteKeySpecifier);
    fields?: DraftOrderCompleteFieldPolicy;
  };
  DraftOrderCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DraftOrderCreateKeySpecifier
      | (() => undefined | DraftOrderCreateKeySpecifier);
    fields?: DraftOrderCreateFieldPolicy;
  };
  DraftOrderDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DraftOrderDeleteKeySpecifier
      | (() => undefined | DraftOrderDeleteKeySpecifier);
    fields?: DraftOrderDeleteFieldPolicy;
  };
  DraftOrderLinesBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DraftOrderLinesBulkDeleteKeySpecifier
      | (() => undefined | DraftOrderLinesBulkDeleteKeySpecifier);
    fields?: DraftOrderLinesBulkDeleteFieldPolicy;
  };
  DraftOrderUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DraftOrderUpdateKeySpecifier
      | (() => undefined | DraftOrderUpdateKeySpecifier);
    fields?: DraftOrderUpdateFieldPolicy;
  };
  EventDelivery?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | EventDeliveryKeySpecifier
      | (() => undefined | EventDeliveryKeySpecifier);
    fields?: EventDeliveryFieldPolicy;
  };
  EventDeliveryAttempt?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | EventDeliveryAttemptKeySpecifier
      | (() => undefined | EventDeliveryAttemptKeySpecifier);
    fields?: EventDeliveryAttemptFieldPolicy;
  };
  EventDeliveryAttemptCountableConnection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | EventDeliveryAttemptCountableConnectionKeySpecifier
      | (() => undefined | EventDeliveryAttemptCountableConnectionKeySpecifier);
    fields?: EventDeliveryAttemptCountableConnectionFieldPolicy;
  };
  EventDeliveryAttemptCountableEdge?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | EventDeliveryAttemptCountableEdgeKeySpecifier
      | (() => undefined | EventDeliveryAttemptCountableEdgeKeySpecifier);
    fields?: EventDeliveryAttemptCountableEdgeFieldPolicy;
  };
  EventDeliveryCountableConnection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | EventDeliveryCountableConnectionKeySpecifier
      | (() => undefined | EventDeliveryCountableConnectionKeySpecifier);
    fields?: EventDeliveryCountableConnectionFieldPolicy;
  };
  EventDeliveryCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | EventDeliveryCountableEdgeKeySpecifier
      | (() => undefined | EventDeliveryCountableEdgeKeySpecifier);
    fields?: EventDeliveryCountableEdgeFieldPolicy;
  };
  EventDeliveryRetry?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | EventDeliveryRetryKeySpecifier
      | (() => undefined | EventDeliveryRetryKeySpecifier);
    fields?: EventDeliveryRetryFieldPolicy;
  };
  ExportError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportErrorKeySpecifier
      | (() => undefined | ExportErrorKeySpecifier);
    fields?: ExportErrorFieldPolicy;
  };
  ExportEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportEventKeySpecifier
      | (() => undefined | ExportEventKeySpecifier);
    fields?: ExportEventFieldPolicy;
  };
  ExportFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportFileKeySpecifier
      | (() => undefined | ExportFileKeySpecifier);
    fields?: ExportFileFieldPolicy;
  };
  ExportFileCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportFileCountableConnectionKeySpecifier
      | (() => undefined | ExportFileCountableConnectionKeySpecifier);
    fields?: ExportFileCountableConnectionFieldPolicy;
  };
  ExportFileCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportFileCountableEdgeKeySpecifier
      | (() => undefined | ExportFileCountableEdgeKeySpecifier);
    fields?: ExportFileCountableEdgeFieldPolicy;
  };
  ExportGiftCards?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportGiftCardsKeySpecifier
      | (() => undefined | ExportGiftCardsKeySpecifier);
    fields?: ExportGiftCardsFieldPolicy;
  };
  ExportProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExportProductsKeySpecifier
      | (() => undefined | ExportProductsKeySpecifier);
    fields?: ExportProductsFieldPolicy;
  };
  ExternalAuthentication?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalAuthenticationKeySpecifier
      | (() => undefined | ExternalAuthenticationKeySpecifier);
    fields?: ExternalAuthenticationFieldPolicy;
  };
  ExternalAuthenticationUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalAuthenticationUrlKeySpecifier
      | (() => undefined | ExternalAuthenticationUrlKeySpecifier);
    fields?: ExternalAuthenticationUrlFieldPolicy;
  };
  ExternalLogout?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalLogoutKeySpecifier
      | (() => undefined | ExternalLogoutKeySpecifier);
    fields?: ExternalLogoutFieldPolicy;
  };
  ExternalNotificationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalNotificationErrorKeySpecifier
      | (() => undefined | ExternalNotificationErrorKeySpecifier);
    fields?: ExternalNotificationErrorFieldPolicy;
  };
  ExternalNotificationTrigger?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalNotificationTriggerKeySpecifier
      | (() => undefined | ExternalNotificationTriggerKeySpecifier);
    fields?: ExternalNotificationTriggerFieldPolicy;
  };
  ExternalObtainAccessTokens?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalObtainAccessTokensKeySpecifier
      | (() => undefined | ExternalObtainAccessTokensKeySpecifier);
    fields?: ExternalObtainAccessTokensFieldPolicy;
  };
  ExternalRefresh?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalRefreshKeySpecifier
      | (() => undefined | ExternalRefreshKeySpecifier);
    fields?: ExternalRefreshFieldPolicy;
  };
  ExternalVerify?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ExternalVerifyKeySpecifier
      | (() => undefined | ExternalVerifyKeySpecifier);
    fields?: ExternalVerifyFieldPolicy;
  };
  File?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier);
    fields?: FileFieldPolicy;
  };
  FileUpload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FileUploadKeySpecifier
      | (() => undefined | FileUploadKeySpecifier);
    fields?: FileUploadFieldPolicy;
  };
  Fulfillment?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentKeySpecifier
      | (() => undefined | FulfillmentKeySpecifier);
    fields?: FulfillmentFieldPolicy;
  };
  FulfillmentApprove?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentApproveKeySpecifier
      | (() => undefined | FulfillmentApproveKeySpecifier);
    fields?: FulfillmentApproveFieldPolicy;
  };
  FulfillmentCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentCancelKeySpecifier
      | (() => undefined | FulfillmentCancelKeySpecifier);
    fields?: FulfillmentCancelFieldPolicy;
  };
  FulfillmentLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentLineKeySpecifier
      | (() => undefined | FulfillmentLineKeySpecifier);
    fields?: FulfillmentLineFieldPolicy;
  };
  FulfillmentRefundProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentRefundProductsKeySpecifier
      | (() => undefined | FulfillmentRefundProductsKeySpecifier);
    fields?: FulfillmentRefundProductsFieldPolicy;
  };
  FulfillmentReturnProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentReturnProductsKeySpecifier
      | (() => undefined | FulfillmentReturnProductsKeySpecifier);
    fields?: FulfillmentReturnProductsFieldPolicy;
  };
  FulfillmentUpdateTracking?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FulfillmentUpdateTrackingKeySpecifier
      | (() => undefined | FulfillmentUpdateTrackingKeySpecifier);
    fields?: FulfillmentUpdateTrackingFieldPolicy;
  };
  GatewayConfigLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GatewayConfigLineKeySpecifier
      | (() => undefined | GatewayConfigLineKeySpecifier);
    fields?: GatewayConfigLineFieldPolicy;
  };
  GiftCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardKeySpecifier
      | (() => undefined | GiftCardKeySpecifier);
    fields?: GiftCardFieldPolicy;
  };
  GiftCardActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardActivateKeySpecifier
      | (() => undefined | GiftCardActivateKeySpecifier);
    fields?: GiftCardActivateFieldPolicy;
  };
  GiftCardAddNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardAddNoteKeySpecifier
      | (() => undefined | GiftCardAddNoteKeySpecifier);
    fields?: GiftCardAddNoteFieldPolicy;
  };
  GiftCardBulkActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardBulkActivateKeySpecifier
      | (() => undefined | GiftCardBulkActivateKeySpecifier);
    fields?: GiftCardBulkActivateFieldPolicy;
  };
  GiftCardBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardBulkCreateKeySpecifier
      | (() => undefined | GiftCardBulkCreateKeySpecifier);
    fields?: GiftCardBulkCreateFieldPolicy;
  };
  GiftCardBulkDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardBulkDeactivateKeySpecifier
      | (() => undefined | GiftCardBulkDeactivateKeySpecifier);
    fields?: GiftCardBulkDeactivateFieldPolicy;
  };
  GiftCardBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardBulkDeleteKeySpecifier
      | (() => undefined | GiftCardBulkDeleteKeySpecifier);
    fields?: GiftCardBulkDeleteFieldPolicy;
  };
  GiftCardCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardCountableConnectionKeySpecifier
      | (() => undefined | GiftCardCountableConnectionKeySpecifier);
    fields?: GiftCardCountableConnectionFieldPolicy;
  };
  GiftCardCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardCountableEdgeKeySpecifier
      | (() => undefined | GiftCardCountableEdgeKeySpecifier);
    fields?: GiftCardCountableEdgeFieldPolicy;
  };
  GiftCardCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardCreateKeySpecifier
      | (() => undefined | GiftCardCreateKeySpecifier);
    fields?: GiftCardCreateFieldPolicy;
  };
  GiftCardDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardDeactivateKeySpecifier
      | (() => undefined | GiftCardDeactivateKeySpecifier);
    fields?: GiftCardDeactivateFieldPolicy;
  };
  GiftCardDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardDeleteKeySpecifier
      | (() => undefined | GiftCardDeleteKeySpecifier);
    fields?: GiftCardDeleteFieldPolicy;
  };
  GiftCardError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardErrorKeySpecifier
      | (() => undefined | GiftCardErrorKeySpecifier);
    fields?: GiftCardErrorFieldPolicy;
  };
  GiftCardEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardEventKeySpecifier
      | (() => undefined | GiftCardEventKeySpecifier);
    fields?: GiftCardEventFieldPolicy;
  };
  GiftCardEventBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardEventBalanceKeySpecifier
      | (() => undefined | GiftCardEventBalanceKeySpecifier);
    fields?: GiftCardEventBalanceFieldPolicy;
  };
  GiftCardResend?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardResendKeySpecifier
      | (() => undefined | GiftCardResendKeySpecifier);
    fields?: GiftCardResendFieldPolicy;
  };
  GiftCardSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardSettingsKeySpecifier
      | (() => undefined | GiftCardSettingsKeySpecifier);
    fields?: GiftCardSettingsFieldPolicy;
  };
  GiftCardSettingsError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardSettingsErrorKeySpecifier
      | (() => undefined | GiftCardSettingsErrorKeySpecifier);
    fields?: GiftCardSettingsErrorFieldPolicy;
  };
  GiftCardSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardSettingsUpdateKeySpecifier
      | (() => undefined | GiftCardSettingsUpdateKeySpecifier);
    fields?: GiftCardSettingsUpdateFieldPolicy;
  };
  GiftCardTag?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardTagKeySpecifier
      | (() => undefined | GiftCardTagKeySpecifier);
    fields?: GiftCardTagFieldPolicy;
  };
  GiftCardTagCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardTagCountableConnectionKeySpecifier
      | (() => undefined | GiftCardTagCountableConnectionKeySpecifier);
    fields?: GiftCardTagCountableConnectionFieldPolicy;
  };
  GiftCardTagCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardTagCountableEdgeKeySpecifier
      | (() => undefined | GiftCardTagCountableEdgeKeySpecifier);
    fields?: GiftCardTagCountableEdgeFieldPolicy;
  };
  GiftCardUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GiftCardUpdateKeySpecifier
      | (() => undefined | GiftCardUpdateKeySpecifier);
    fields?: GiftCardUpdateFieldPolicy;
  };
  Group?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GroupKeySpecifier
      | (() => undefined | GroupKeySpecifier);
    fields?: GroupFieldPolicy;
  };
  GroupCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GroupCountableConnectionKeySpecifier
      | (() => undefined | GroupCountableConnectionKeySpecifier);
    fields?: GroupCountableConnectionFieldPolicy;
  };
  GroupCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GroupCountableEdgeKeySpecifier
      | (() => undefined | GroupCountableEdgeKeySpecifier);
    fields?: GroupCountableEdgeFieldPolicy;
  };
  Image?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ImageKeySpecifier
      | (() => undefined | ImageKeySpecifier);
    fields?: ImageFieldPolicy;
  };
  Invoice?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceKeySpecifier
      | (() => undefined | InvoiceKeySpecifier);
    fields?: InvoiceFieldPolicy;
  };
  InvoiceCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceCreateKeySpecifier
      | (() => undefined | InvoiceCreateKeySpecifier);
    fields?: InvoiceCreateFieldPolicy;
  };
  InvoiceDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceDeleteKeySpecifier
      | (() => undefined | InvoiceDeleteKeySpecifier);
    fields?: InvoiceDeleteFieldPolicy;
  };
  InvoiceError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceErrorKeySpecifier
      | (() => undefined | InvoiceErrorKeySpecifier);
    fields?: InvoiceErrorFieldPolicy;
  };
  InvoiceRequest?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceRequestKeySpecifier
      | (() => undefined | InvoiceRequestKeySpecifier);
    fields?: InvoiceRequestFieldPolicy;
  };
  InvoiceRequestDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceRequestDeleteKeySpecifier
      | (() => undefined | InvoiceRequestDeleteKeySpecifier);
    fields?: InvoiceRequestDeleteFieldPolicy;
  };
  InvoiceSendNotification?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceSendNotificationKeySpecifier
      | (() => undefined | InvoiceSendNotificationKeySpecifier);
    fields?: InvoiceSendNotificationFieldPolicy;
  };
  InvoiceUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | InvoiceUpdateKeySpecifier
      | (() => undefined | InvoiceUpdateKeySpecifier);
    fields?: InvoiceUpdateFieldPolicy;
  };
  Job?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | JobKeySpecifier | (() => undefined | JobKeySpecifier);
    fields?: JobFieldPolicy;
  };
  LanguageDisplay?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LanguageDisplayKeySpecifier
      | (() => undefined | LanguageDisplayKeySpecifier);
    fields?: LanguageDisplayFieldPolicy;
  };
  LimitInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LimitInfoKeySpecifier
      | (() => undefined | LimitInfoKeySpecifier);
    fields?: LimitInfoFieldPolicy;
  };
  Limits?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LimitsKeySpecifier
      | (() => undefined | LimitsKeySpecifier);
    fields?: LimitsFieldPolicy;
  };
  Manifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ManifestKeySpecifier
      | (() => undefined | ManifestKeySpecifier);
    fields?: ManifestFieldPolicy;
  };
  Margin?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MarginKeySpecifier
      | (() => undefined | MarginKeySpecifier);
    fields?: MarginFieldPolicy;
  };
  Menu?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | MenuKeySpecifier | (() => undefined | MenuKeySpecifier);
    fields?: MenuFieldPolicy;
  };
  MenuBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuBulkDeleteKeySpecifier
      | (() => undefined | MenuBulkDeleteKeySpecifier);
    fields?: MenuBulkDeleteFieldPolicy;
  };
  MenuCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuCountableConnectionKeySpecifier
      | (() => undefined | MenuCountableConnectionKeySpecifier);
    fields?: MenuCountableConnectionFieldPolicy;
  };
  MenuCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuCountableEdgeKeySpecifier
      | (() => undefined | MenuCountableEdgeKeySpecifier);
    fields?: MenuCountableEdgeFieldPolicy;
  };
  MenuCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuCreateKeySpecifier
      | (() => undefined | MenuCreateKeySpecifier);
    fields?: MenuCreateFieldPolicy;
  };
  MenuDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuDeleteKeySpecifier
      | (() => undefined | MenuDeleteKeySpecifier);
    fields?: MenuDeleteFieldPolicy;
  };
  MenuError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuErrorKeySpecifier
      | (() => undefined | MenuErrorKeySpecifier);
    fields?: MenuErrorFieldPolicy;
  };
  MenuItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemKeySpecifier
      | (() => undefined | MenuItemKeySpecifier);
    fields?: MenuItemFieldPolicy;
  };
  MenuItemBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemBulkDeleteKeySpecifier
      | (() => undefined | MenuItemBulkDeleteKeySpecifier);
    fields?: MenuItemBulkDeleteFieldPolicy;
  };
  MenuItemCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemCountableConnectionKeySpecifier
      | (() => undefined | MenuItemCountableConnectionKeySpecifier);
    fields?: MenuItemCountableConnectionFieldPolicy;
  };
  MenuItemCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemCountableEdgeKeySpecifier
      | (() => undefined | MenuItemCountableEdgeKeySpecifier);
    fields?: MenuItemCountableEdgeFieldPolicy;
  };
  MenuItemCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemCreateKeySpecifier
      | (() => undefined | MenuItemCreateKeySpecifier);
    fields?: MenuItemCreateFieldPolicy;
  };
  MenuItemDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemDeleteKeySpecifier
      | (() => undefined | MenuItemDeleteKeySpecifier);
    fields?: MenuItemDeleteFieldPolicy;
  };
  MenuItemMove?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemMoveKeySpecifier
      | (() => undefined | MenuItemMoveKeySpecifier);
    fields?: MenuItemMoveFieldPolicy;
  };
  MenuItemTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemTranslatableContentKeySpecifier
      | (() => undefined | MenuItemTranslatableContentKeySpecifier);
    fields?: MenuItemTranslatableContentFieldPolicy;
  };
  MenuItemTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemTranslateKeySpecifier
      | (() => undefined | MenuItemTranslateKeySpecifier);
    fields?: MenuItemTranslateFieldPolicy;
  };
  MenuItemTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemTranslationKeySpecifier
      | (() => undefined | MenuItemTranslationKeySpecifier);
    fields?: MenuItemTranslationFieldPolicy;
  };
  MenuItemUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuItemUpdateKeySpecifier
      | (() => undefined | MenuItemUpdateKeySpecifier);
    fields?: MenuItemUpdateFieldPolicy;
  };
  MenuUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MenuUpdateKeySpecifier
      | (() => undefined | MenuUpdateKeySpecifier);
    fields?: MenuUpdateFieldPolicy;
  };
  MetadataError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MetadataErrorKeySpecifier
      | (() => undefined | MetadataErrorKeySpecifier);
    fields?: MetadataErrorFieldPolicy;
  };
  MetadataItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MetadataItemKeySpecifier
      | (() => undefined | MetadataItemKeySpecifier);
    fields?: MetadataItemFieldPolicy;
  };
  Money?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MoneyKeySpecifier
      | (() => undefined | MoneyKeySpecifier);
    fields?: MoneyFieldPolicy;
  };
  MoneyRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MoneyRangeKeySpecifier
      | (() => undefined | MoneyRangeKeySpecifier);
    fields?: MoneyRangeFieldPolicy;
  };
  Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | MutationKeySpecifier
      | (() => undefined | MutationKeySpecifier);
    fields?: MutationFieldPolicy;
  };
  Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier);
    fields?: NodeFieldPolicy;
  };
  ObjectWithMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ObjectWithMetadataKeySpecifier
      | (() => undefined | ObjectWithMetadataKeySpecifier);
    fields?: ObjectWithMetadataFieldPolicy;
  };
  Order?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderKeySpecifier
      | (() => undefined | OrderKeySpecifier);
    fields?: OrderFieldPolicy;
  };
  OrderAddNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderAddNoteKeySpecifier
      | (() => undefined | OrderAddNoteKeySpecifier);
    fields?: OrderAddNoteFieldPolicy;
  };
  OrderBulkCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderBulkCancelKeySpecifier
      | (() => undefined | OrderBulkCancelKeySpecifier);
    fields?: OrderBulkCancelFieldPolicy;
  };
  OrderCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderCancelKeySpecifier
      | (() => undefined | OrderCancelKeySpecifier);
    fields?: OrderCancelFieldPolicy;
  };
  OrderCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderCaptureKeySpecifier
      | (() => undefined | OrderCaptureKeySpecifier);
    fields?: OrderCaptureFieldPolicy;
  };
  OrderConfirm?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderConfirmKeySpecifier
      | (() => undefined | OrderConfirmKeySpecifier);
    fields?: OrderConfirmFieldPolicy;
  };
  OrderCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderCountableConnectionKeySpecifier
      | (() => undefined | OrderCountableConnectionKeySpecifier);
    fields?: OrderCountableConnectionFieldPolicy;
  };
  OrderCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderCountableEdgeKeySpecifier
      | (() => undefined | OrderCountableEdgeKeySpecifier);
    fields?: OrderCountableEdgeFieldPolicy;
  };
  OrderDiscount?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderDiscountKeySpecifier
      | (() => undefined | OrderDiscountKeySpecifier);
    fields?: OrderDiscountFieldPolicy;
  };
  OrderDiscountAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderDiscountAddKeySpecifier
      | (() => undefined | OrderDiscountAddKeySpecifier);
    fields?: OrderDiscountAddFieldPolicy;
  };
  OrderDiscountDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderDiscountDeleteKeySpecifier
      | (() => undefined | OrderDiscountDeleteKeySpecifier);
    fields?: OrderDiscountDeleteFieldPolicy;
  };
  OrderDiscountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderDiscountUpdateKeySpecifier
      | (() => undefined | OrderDiscountUpdateKeySpecifier);
    fields?: OrderDiscountUpdateFieldPolicy;
  };
  OrderError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderErrorKeySpecifier
      | (() => undefined | OrderErrorKeySpecifier);
    fields?: OrderErrorFieldPolicy;
  };
  OrderEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderEventKeySpecifier
      | (() => undefined | OrderEventKeySpecifier);
    fields?: OrderEventFieldPolicy;
  };
  OrderEventCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderEventCountableConnectionKeySpecifier
      | (() => undefined | OrderEventCountableConnectionKeySpecifier);
    fields?: OrderEventCountableConnectionFieldPolicy;
  };
  OrderEventCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderEventCountableEdgeKeySpecifier
      | (() => undefined | OrderEventCountableEdgeKeySpecifier);
    fields?: OrderEventCountableEdgeFieldPolicy;
  };
  OrderEventDiscountObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderEventDiscountObjectKeySpecifier
      | (() => undefined | OrderEventDiscountObjectKeySpecifier);
    fields?: OrderEventDiscountObjectFieldPolicy;
  };
  OrderEventOrderLineObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderEventOrderLineObjectKeySpecifier
      | (() => undefined | OrderEventOrderLineObjectKeySpecifier);
    fields?: OrderEventOrderLineObjectFieldPolicy;
  };
  OrderFulfill?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderFulfillKeySpecifier
      | (() => undefined | OrderFulfillKeySpecifier);
    fields?: OrderFulfillFieldPolicy;
  };
  OrderLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderLineKeySpecifier
      | (() => undefined | OrderLineKeySpecifier);
    fields?: OrderLineFieldPolicy;
  };
  OrderLineDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderLineDeleteKeySpecifier
      | (() => undefined | OrderLineDeleteKeySpecifier);
    fields?: OrderLineDeleteFieldPolicy;
  };
  OrderLineDiscountRemove?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderLineDiscountRemoveKeySpecifier
      | (() => undefined | OrderLineDiscountRemoveKeySpecifier);
    fields?: OrderLineDiscountRemoveFieldPolicy;
  };
  OrderLineDiscountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderLineDiscountUpdateKeySpecifier
      | (() => undefined | OrderLineDiscountUpdateKeySpecifier);
    fields?: OrderLineDiscountUpdateFieldPolicy;
  };
  OrderLineUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderLineUpdateKeySpecifier
      | (() => undefined | OrderLineUpdateKeySpecifier);
    fields?: OrderLineUpdateFieldPolicy;
  };
  OrderLinesCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderLinesCreateKeySpecifier
      | (() => undefined | OrderLinesCreateKeySpecifier);
    fields?: OrderLinesCreateFieldPolicy;
  };
  OrderMarkAsPaid?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderMarkAsPaidKeySpecifier
      | (() => undefined | OrderMarkAsPaidKeySpecifier);
    fields?: OrderMarkAsPaidFieldPolicy;
  };
  OrderRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderRefundKeySpecifier
      | (() => undefined | OrderRefundKeySpecifier);
    fields?: OrderRefundFieldPolicy;
  };
  OrderSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderSettingsKeySpecifier
      | (() => undefined | OrderSettingsKeySpecifier);
    fields?: OrderSettingsFieldPolicy;
  };
  OrderSettingsError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderSettingsErrorKeySpecifier
      | (() => undefined | OrderSettingsErrorKeySpecifier);
    fields?: OrderSettingsErrorFieldPolicy;
  };
  OrderSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderSettingsUpdateKeySpecifier
      | (() => undefined | OrderSettingsUpdateKeySpecifier);
    fields?: OrderSettingsUpdateFieldPolicy;
  };
  OrderUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderUpdateKeySpecifier
      | (() => undefined | OrderUpdateKeySpecifier);
    fields?: OrderUpdateFieldPolicy;
  };
  OrderUpdateShipping?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderUpdateShippingKeySpecifier
      | (() => undefined | OrderUpdateShippingKeySpecifier);
    fields?: OrderUpdateShippingFieldPolicy;
  };
  OrderVoid?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrderVoidKeySpecifier
      | (() => undefined | OrderVoidKeySpecifier);
    fields?: OrderVoidFieldPolicy;
  };
  Page?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PageKeySpecifier | (() => undefined | PageKeySpecifier);
    fields?: PageFieldPolicy;
  };
  PageAttributeAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageAttributeAssignKeySpecifier
      | (() => undefined | PageAttributeAssignKeySpecifier);
    fields?: PageAttributeAssignFieldPolicy;
  };
  PageAttributeUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageAttributeUnassignKeySpecifier
      | (() => undefined | PageAttributeUnassignKeySpecifier);
    fields?: PageAttributeUnassignFieldPolicy;
  };
  PageBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageBulkDeleteKeySpecifier
      | (() => undefined | PageBulkDeleteKeySpecifier);
    fields?: PageBulkDeleteFieldPolicy;
  };
  PageBulkPublish?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageBulkPublishKeySpecifier
      | (() => undefined | PageBulkPublishKeySpecifier);
    fields?: PageBulkPublishFieldPolicy;
  };
  PageCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageCountableConnectionKeySpecifier
      | (() => undefined | PageCountableConnectionKeySpecifier);
    fields?: PageCountableConnectionFieldPolicy;
  };
  PageCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageCountableEdgeKeySpecifier
      | (() => undefined | PageCountableEdgeKeySpecifier);
    fields?: PageCountableEdgeFieldPolicy;
  };
  PageCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageCreateKeySpecifier
      | (() => undefined | PageCreateKeySpecifier);
    fields?: PageCreateFieldPolicy;
  };
  PageDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageDeleteKeySpecifier
      | (() => undefined | PageDeleteKeySpecifier);
    fields?: PageDeleteFieldPolicy;
  };
  PageError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageErrorKeySpecifier
      | (() => undefined | PageErrorKeySpecifier);
    fields?: PageErrorFieldPolicy;
  };
  PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageInfoKeySpecifier
      | (() => undefined | PageInfoKeySpecifier);
    fields?: PageInfoFieldPolicy;
  };
  PageReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageReorderAttributeValuesKeySpecifier
      | (() => undefined | PageReorderAttributeValuesKeySpecifier);
    fields?: PageReorderAttributeValuesFieldPolicy;
  };
  PageTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTranslatableContentKeySpecifier
      | (() => undefined | PageTranslatableContentKeySpecifier);
    fields?: PageTranslatableContentFieldPolicy;
  };
  PageTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTranslateKeySpecifier
      | (() => undefined | PageTranslateKeySpecifier);
    fields?: PageTranslateFieldPolicy;
  };
  PageTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTranslationKeySpecifier
      | (() => undefined | PageTranslationKeySpecifier);
    fields?: PageTranslationFieldPolicy;
  };
  PageType?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeKeySpecifier
      | (() => undefined | PageTypeKeySpecifier);
    fields?: PageTypeFieldPolicy;
  };
  PageTypeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeBulkDeleteKeySpecifier
      | (() => undefined | PageTypeBulkDeleteKeySpecifier);
    fields?: PageTypeBulkDeleteFieldPolicy;
  };
  PageTypeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeCountableConnectionKeySpecifier
      | (() => undefined | PageTypeCountableConnectionKeySpecifier);
    fields?: PageTypeCountableConnectionFieldPolicy;
  };
  PageTypeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeCountableEdgeKeySpecifier
      | (() => undefined | PageTypeCountableEdgeKeySpecifier);
    fields?: PageTypeCountableEdgeFieldPolicy;
  };
  PageTypeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeCreateKeySpecifier
      | (() => undefined | PageTypeCreateKeySpecifier);
    fields?: PageTypeCreateFieldPolicy;
  };
  PageTypeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeDeleteKeySpecifier
      | (() => undefined | PageTypeDeleteKeySpecifier);
    fields?: PageTypeDeleteFieldPolicy;
  };
  PageTypeReorderAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeReorderAttributesKeySpecifier
      | (() => undefined | PageTypeReorderAttributesKeySpecifier);
    fields?: PageTypeReorderAttributesFieldPolicy;
  };
  PageTypeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageTypeUpdateKeySpecifier
      | (() => undefined | PageTypeUpdateKeySpecifier);
    fields?: PageTypeUpdateFieldPolicy;
  };
  PageUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PageUpdateKeySpecifier
      | (() => undefined | PageUpdateKeySpecifier);
    fields?: PageUpdateFieldPolicy;
  };
  PasswordChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PasswordChangeKeySpecifier
      | (() => undefined | PasswordChangeKeySpecifier);
    fields?: PasswordChangeFieldPolicy;
  };
  Payment?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentKeySpecifier
      | (() => undefined | PaymentKeySpecifier);
    fields?: PaymentFieldPolicy;
  };
  PaymentCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentCaptureKeySpecifier
      | (() => undefined | PaymentCaptureKeySpecifier);
    fields?: PaymentCaptureFieldPolicy;
  };
  PaymentCheckBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentCheckBalanceKeySpecifier
      | (() => undefined | PaymentCheckBalanceKeySpecifier);
    fields?: PaymentCheckBalanceFieldPolicy;
  };
  PaymentCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentCountableConnectionKeySpecifier
      | (() => undefined | PaymentCountableConnectionKeySpecifier);
    fields?: PaymentCountableConnectionFieldPolicy;
  };
  PaymentCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentCountableEdgeKeySpecifier
      | (() => undefined | PaymentCountableEdgeKeySpecifier);
    fields?: PaymentCountableEdgeFieldPolicy;
  };
  PaymentError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentErrorKeySpecifier
      | (() => undefined | PaymentErrorKeySpecifier);
    fields?: PaymentErrorFieldPolicy;
  };
  PaymentGateway?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentGatewayKeySpecifier
      | (() => undefined | PaymentGatewayKeySpecifier);
    fields?: PaymentGatewayFieldPolicy;
  };
  PaymentInitialize?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentInitializeKeySpecifier
      | (() => undefined | PaymentInitializeKeySpecifier);
    fields?: PaymentInitializeFieldPolicy;
  };
  PaymentInitialized?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentInitializedKeySpecifier
      | (() => undefined | PaymentInitializedKeySpecifier);
    fields?: PaymentInitializedFieldPolicy;
  };
  PaymentRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentRefundKeySpecifier
      | (() => undefined | PaymentRefundKeySpecifier);
    fields?: PaymentRefundFieldPolicy;
  };
  PaymentSource?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentSourceKeySpecifier
      | (() => undefined | PaymentSourceKeySpecifier);
    fields?: PaymentSourceFieldPolicy;
  };
  PaymentVoid?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PaymentVoidKeySpecifier
      | (() => undefined | PaymentVoidKeySpecifier);
    fields?: PaymentVoidFieldPolicy;
  };
  Permission?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PermissionKeySpecifier
      | (() => undefined | PermissionKeySpecifier);
    fields?: PermissionFieldPolicy;
  };
  PermissionGroupCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PermissionGroupCreateKeySpecifier
      | (() => undefined | PermissionGroupCreateKeySpecifier);
    fields?: PermissionGroupCreateFieldPolicy;
  };
  PermissionGroupDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PermissionGroupDeleteKeySpecifier
      | (() => undefined | PermissionGroupDeleteKeySpecifier);
    fields?: PermissionGroupDeleteFieldPolicy;
  };
  PermissionGroupError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PermissionGroupErrorKeySpecifier
      | (() => undefined | PermissionGroupErrorKeySpecifier);
    fields?: PermissionGroupErrorFieldPolicy;
  };
  PermissionGroupUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PermissionGroupUpdateKeySpecifier
      | (() => undefined | PermissionGroupUpdateKeySpecifier);
    fields?: PermissionGroupUpdateFieldPolicy;
  };
  Plugin?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PluginKeySpecifier
      | (() => undefined | PluginKeySpecifier);
    fields?: PluginFieldPolicy;
  };
  PluginConfiguration?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PluginConfigurationKeySpecifier
      | (() => undefined | PluginConfigurationKeySpecifier);
    fields?: PluginConfigurationFieldPolicy;
  };
  PluginCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PluginCountableConnectionKeySpecifier
      | (() => undefined | PluginCountableConnectionKeySpecifier);
    fields?: PluginCountableConnectionFieldPolicy;
  };
  PluginCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PluginCountableEdgeKeySpecifier
      | (() => undefined | PluginCountableEdgeKeySpecifier);
    fields?: PluginCountableEdgeFieldPolicy;
  };
  PluginError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PluginErrorKeySpecifier
      | (() => undefined | PluginErrorKeySpecifier);
    fields?: PluginErrorFieldPolicy;
  };
  PluginUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PluginUpdateKeySpecifier
      | (() => undefined | PluginUpdateKeySpecifier);
    fields?: PluginUpdateFieldPolicy;
  };
  PreorderData?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PreorderDataKeySpecifier
      | (() => undefined | PreorderDataKeySpecifier);
    fields?: PreorderDataFieldPolicy;
  };
  PreorderThreshold?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PreorderThresholdKeySpecifier
      | (() => undefined | PreorderThresholdKeySpecifier);
    fields?: PreorderThresholdFieldPolicy;
  };
  Product?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductKeySpecifier
      | (() => undefined | ProductKeySpecifier);
    fields?: ProductFieldPolicy;
  };
  ProductAttributeAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductAttributeAssignKeySpecifier
      | (() => undefined | ProductAttributeAssignKeySpecifier);
    fields?: ProductAttributeAssignFieldPolicy;
  };
  ProductAttributeAssignmentUpdate?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ProductAttributeAssignmentUpdateKeySpecifier
      | (() => undefined | ProductAttributeAssignmentUpdateKeySpecifier);
    fields?: ProductAttributeAssignmentUpdateFieldPolicy;
  };
  ProductAttributeUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductAttributeUnassignKeySpecifier
      | (() => undefined | ProductAttributeUnassignKeySpecifier);
    fields?: ProductAttributeUnassignFieldPolicy;
  };
  ProductBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductBulkDeleteKeySpecifier
      | (() => undefined | ProductBulkDeleteKeySpecifier);
    fields?: ProductBulkDeleteFieldPolicy;
  };
  ProductChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductChannelListingKeySpecifier
      | (() => undefined | ProductChannelListingKeySpecifier);
    fields?: ProductChannelListingFieldPolicy;
  };
  ProductChannelListingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductChannelListingErrorKeySpecifier
      | (() => undefined | ProductChannelListingErrorKeySpecifier);
    fields?: ProductChannelListingErrorFieldPolicy;
  };
  ProductChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductChannelListingUpdateKeySpecifier
      | (() => undefined | ProductChannelListingUpdateKeySpecifier);
    fields?: ProductChannelListingUpdateFieldPolicy;
  };
  ProductCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductCountableConnectionKeySpecifier
      | (() => undefined | ProductCountableConnectionKeySpecifier);
    fields?: ProductCountableConnectionFieldPolicy;
  };
  ProductCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductCountableEdgeKeySpecifier
      | (() => undefined | ProductCountableEdgeKeySpecifier);
    fields?: ProductCountableEdgeFieldPolicy;
  };
  ProductCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductCreateKeySpecifier
      | (() => undefined | ProductCreateKeySpecifier);
    fields?: ProductCreateFieldPolicy;
  };
  ProductDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductDeleteKeySpecifier
      | (() => undefined | ProductDeleteKeySpecifier);
    fields?: ProductDeleteFieldPolicy;
  };
  ProductError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductErrorKeySpecifier
      | (() => undefined | ProductErrorKeySpecifier);
    fields?: ProductErrorFieldPolicy;
  };
  ProductImage?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductImageKeySpecifier
      | (() => undefined | ProductImageKeySpecifier);
    fields?: ProductImageFieldPolicy;
  };
  ProductMedia?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductMediaKeySpecifier
      | (() => undefined | ProductMediaKeySpecifier);
    fields?: ProductMediaFieldPolicy;
  };
  ProductMediaBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductMediaBulkDeleteKeySpecifier
      | (() => undefined | ProductMediaBulkDeleteKeySpecifier);
    fields?: ProductMediaBulkDeleteFieldPolicy;
  };
  ProductMediaCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductMediaCreateKeySpecifier
      | (() => undefined | ProductMediaCreateKeySpecifier);
    fields?: ProductMediaCreateFieldPolicy;
  };
  ProductMediaDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductMediaDeleteKeySpecifier
      | (() => undefined | ProductMediaDeleteKeySpecifier);
    fields?: ProductMediaDeleteFieldPolicy;
  };
  ProductMediaReorder?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductMediaReorderKeySpecifier
      | (() => undefined | ProductMediaReorderKeySpecifier);
    fields?: ProductMediaReorderFieldPolicy;
  };
  ProductMediaUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductMediaUpdateKeySpecifier
      | (() => undefined | ProductMediaUpdateKeySpecifier);
    fields?: ProductMediaUpdateFieldPolicy;
  };
  ProductPricingInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductPricingInfoKeySpecifier
      | (() => undefined | ProductPricingInfoKeySpecifier);
    fields?: ProductPricingInfoFieldPolicy;
  };
  ProductReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductReorderAttributeValuesKeySpecifier
      | (() => undefined | ProductReorderAttributeValuesKeySpecifier);
    fields?: ProductReorderAttributeValuesFieldPolicy;
  };
  ProductTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTranslatableContentKeySpecifier
      | (() => undefined | ProductTranslatableContentKeySpecifier);
    fields?: ProductTranslatableContentFieldPolicy;
  };
  ProductTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTranslateKeySpecifier
      | (() => undefined | ProductTranslateKeySpecifier);
    fields?: ProductTranslateFieldPolicy;
  };
  ProductTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTranslationKeySpecifier
      | (() => undefined | ProductTranslationKeySpecifier);
    fields?: ProductTranslationFieldPolicy;
  };
  ProductType?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeKeySpecifier
      | (() => undefined | ProductTypeKeySpecifier);
    fields?: ProductTypeFieldPolicy;
  };
  ProductTypeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeBulkDeleteKeySpecifier
      | (() => undefined | ProductTypeBulkDeleteKeySpecifier);
    fields?: ProductTypeBulkDeleteFieldPolicy;
  };
  ProductTypeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeCountableConnectionKeySpecifier
      | (() => undefined | ProductTypeCountableConnectionKeySpecifier);
    fields?: ProductTypeCountableConnectionFieldPolicy;
  };
  ProductTypeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeCountableEdgeKeySpecifier
      | (() => undefined | ProductTypeCountableEdgeKeySpecifier);
    fields?: ProductTypeCountableEdgeFieldPolicy;
  };
  ProductTypeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeCreateKeySpecifier
      | (() => undefined | ProductTypeCreateKeySpecifier);
    fields?: ProductTypeCreateFieldPolicy;
  };
  ProductTypeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeDeleteKeySpecifier
      | (() => undefined | ProductTypeDeleteKeySpecifier);
    fields?: ProductTypeDeleteFieldPolicy;
  };
  ProductTypeReorderAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeReorderAttributesKeySpecifier
      | (() => undefined | ProductTypeReorderAttributesKeySpecifier);
    fields?: ProductTypeReorderAttributesFieldPolicy;
  };
  ProductTypeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductTypeUpdateKeySpecifier
      | (() => undefined | ProductTypeUpdateKeySpecifier);
    fields?: ProductTypeUpdateFieldPolicy;
  };
  ProductUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductUpdateKeySpecifier
      | (() => undefined | ProductUpdateKeySpecifier);
    fields?: ProductUpdateFieldPolicy;
  };
  ProductVariant?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantKeySpecifier
      | (() => undefined | ProductVariantKeySpecifier);
    fields?: ProductVariantFieldPolicy;
  };
  ProductVariantBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantBulkCreateKeySpecifier
      | (() => undefined | ProductVariantBulkCreateKeySpecifier);
    fields?: ProductVariantBulkCreateFieldPolicy;
  };
  ProductVariantBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantBulkDeleteKeySpecifier
      | (() => undefined | ProductVariantBulkDeleteKeySpecifier);
    fields?: ProductVariantBulkDeleteFieldPolicy;
  };
  ProductVariantChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantChannelListingKeySpecifier
      | (() => undefined | ProductVariantChannelListingKeySpecifier);
    fields?: ProductVariantChannelListingFieldPolicy;
  };
  ProductVariantChannelListingUpdate?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ProductVariantChannelListingUpdateKeySpecifier
      | (() => undefined | ProductVariantChannelListingUpdateKeySpecifier);
    fields?: ProductVariantChannelListingUpdateFieldPolicy;
  };
  ProductVariantCountableConnection?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ProductVariantCountableConnectionKeySpecifier
      | (() => undefined | ProductVariantCountableConnectionKeySpecifier);
    fields?: ProductVariantCountableConnectionFieldPolicy;
  };
  ProductVariantCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantCountableEdgeKeySpecifier
      | (() => undefined | ProductVariantCountableEdgeKeySpecifier);
    fields?: ProductVariantCountableEdgeFieldPolicy;
  };
  ProductVariantCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantCreateKeySpecifier
      | (() => undefined | ProductVariantCreateKeySpecifier);
    fields?: ProductVariantCreateFieldPolicy;
  };
  ProductVariantDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantDeleteKeySpecifier
      | (() => undefined | ProductVariantDeleteKeySpecifier);
    fields?: ProductVariantDeleteFieldPolicy;
  };
  ProductVariantPreorderDeactivate?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ProductVariantPreorderDeactivateKeySpecifier
      | (() => undefined | ProductVariantPreorderDeactivateKeySpecifier);
    fields?: ProductVariantPreorderDeactivateFieldPolicy;
  };
  ProductVariantReorder?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantReorderKeySpecifier
      | (() => undefined | ProductVariantReorderKeySpecifier);
    fields?: ProductVariantReorderFieldPolicy;
  };
  ProductVariantReorderAttributeValues?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ProductVariantReorderAttributeValuesKeySpecifier
      | (() => undefined | ProductVariantReorderAttributeValuesKeySpecifier);
    fields?: ProductVariantReorderAttributeValuesFieldPolicy;
  };
  ProductVariantSetDefault?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantSetDefaultKeySpecifier
      | (() => undefined | ProductVariantSetDefaultKeySpecifier);
    fields?: ProductVariantSetDefaultFieldPolicy;
  };
  ProductVariantStocksCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantStocksCreateKeySpecifier
      | (() => undefined | ProductVariantStocksCreateKeySpecifier);
    fields?: ProductVariantStocksCreateFieldPolicy;
  };
  ProductVariantStocksDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantStocksDeleteKeySpecifier
      | (() => undefined | ProductVariantStocksDeleteKeySpecifier);
    fields?: ProductVariantStocksDeleteFieldPolicy;
  };
  ProductVariantStocksUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantStocksUpdateKeySpecifier
      | (() => undefined | ProductVariantStocksUpdateKeySpecifier);
    fields?: ProductVariantStocksUpdateFieldPolicy;
  };
  ProductVariantTranslatableContent?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ProductVariantTranslatableContentKeySpecifier
      | (() => undefined | ProductVariantTranslatableContentKeySpecifier);
    fields?: ProductVariantTranslatableContentFieldPolicy;
  };
  ProductVariantTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantTranslateKeySpecifier
      | (() => undefined | ProductVariantTranslateKeySpecifier);
    fields?: ProductVariantTranslateFieldPolicy;
  };
  ProductVariantTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantTranslationKeySpecifier
      | (() => undefined | ProductVariantTranslationKeySpecifier);
    fields?: ProductVariantTranslationFieldPolicy;
  };
  ProductVariantUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ProductVariantUpdateKeySpecifier
      | (() => undefined | ProductVariantUpdateKeySpecifier);
    fields?: ProductVariantUpdateFieldPolicy;
  };
  Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | QueryKeySpecifier
      | (() => undefined | QueryKeySpecifier);
    fields?: QueryFieldPolicy;
  };
  ReducedRate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ReducedRateKeySpecifier
      | (() => undefined | ReducedRateKeySpecifier);
    fields?: ReducedRateFieldPolicy;
  };
  RefreshToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | RefreshTokenKeySpecifier
      | (() => undefined | RefreshTokenKeySpecifier);
    fields?: RefreshTokenFieldPolicy;
  };
  RequestEmailChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | RequestEmailChangeKeySpecifier
      | (() => undefined | RequestEmailChangeKeySpecifier);
    fields?: RequestEmailChangeFieldPolicy;
  };
  RequestPasswordReset?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | RequestPasswordResetKeySpecifier
      | (() => undefined | RequestPasswordResetKeySpecifier);
    fields?: RequestPasswordResetFieldPolicy;
  };
  Sale?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | SaleKeySpecifier | (() => undefined | SaleKeySpecifier);
    fields?: SaleFieldPolicy;
  };
  SaleAddCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleAddCataloguesKeySpecifier
      | (() => undefined | SaleAddCataloguesKeySpecifier);
    fields?: SaleAddCataloguesFieldPolicy;
  };
  SaleBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleBulkDeleteKeySpecifier
      | (() => undefined | SaleBulkDeleteKeySpecifier);
    fields?: SaleBulkDeleteFieldPolicy;
  };
  SaleChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleChannelListingKeySpecifier
      | (() => undefined | SaleChannelListingKeySpecifier);
    fields?: SaleChannelListingFieldPolicy;
  };
  SaleChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleChannelListingUpdateKeySpecifier
      | (() => undefined | SaleChannelListingUpdateKeySpecifier);
    fields?: SaleChannelListingUpdateFieldPolicy;
  };
  SaleCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleCountableConnectionKeySpecifier
      | (() => undefined | SaleCountableConnectionKeySpecifier);
    fields?: SaleCountableConnectionFieldPolicy;
  };
  SaleCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleCountableEdgeKeySpecifier
      | (() => undefined | SaleCountableEdgeKeySpecifier);
    fields?: SaleCountableEdgeFieldPolicy;
  };
  SaleCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleCreateKeySpecifier
      | (() => undefined | SaleCreateKeySpecifier);
    fields?: SaleCreateFieldPolicy;
  };
  SaleDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleDeleteKeySpecifier
      | (() => undefined | SaleDeleteKeySpecifier);
    fields?: SaleDeleteFieldPolicy;
  };
  SaleRemoveCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleRemoveCataloguesKeySpecifier
      | (() => undefined | SaleRemoveCataloguesKeySpecifier);
    fields?: SaleRemoveCataloguesFieldPolicy;
  };
  SaleTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleTranslatableContentKeySpecifier
      | (() => undefined | SaleTranslatableContentKeySpecifier);
    fields?: SaleTranslatableContentFieldPolicy;
  };
  SaleTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleTranslateKeySpecifier
      | (() => undefined | SaleTranslateKeySpecifier);
    fields?: SaleTranslateFieldPolicy;
  };
  SaleTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleTranslationKeySpecifier
      | (() => undefined | SaleTranslationKeySpecifier);
    fields?: SaleTranslationFieldPolicy;
  };
  SaleUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SaleUpdateKeySpecifier
      | (() => undefined | SaleUpdateKeySpecifier);
    fields?: SaleUpdateFieldPolicy;
  };
  SelectedAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SelectedAttributeKeySpecifier
      | (() => undefined | SelectedAttributeKeySpecifier);
    fields?: SelectedAttributeFieldPolicy;
  };
  SetPassword?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SetPasswordKeySpecifier
      | (() => undefined | SetPasswordKeySpecifier);
    fields?: SetPasswordFieldPolicy;
  };
  ShippingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingErrorKeySpecifier
      | (() => undefined | ShippingErrorKeySpecifier);
    fields?: ShippingErrorFieldPolicy;
  };
  ShippingMethod?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingMethodKeySpecifier
      | (() => undefined | ShippingMethodKeySpecifier);
    fields?: ShippingMethodFieldPolicy;
  };
  ShippingMethodChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingMethodChannelListingKeySpecifier
      | (() => undefined | ShippingMethodChannelListingKeySpecifier);
    fields?: ShippingMethodChannelListingFieldPolicy;
  };
  ShippingMethodChannelListingUpdate?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ShippingMethodChannelListingUpdateKeySpecifier
      | (() => undefined | ShippingMethodChannelListingUpdateKeySpecifier);
    fields?: ShippingMethodChannelListingUpdateFieldPolicy;
  };
  ShippingMethodPostalCodeRule?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingMethodPostalCodeRuleKeySpecifier
      | (() => undefined | ShippingMethodPostalCodeRuleKeySpecifier);
    fields?: ShippingMethodPostalCodeRuleFieldPolicy;
  };
  ShippingMethodTranslatableContent?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ShippingMethodTranslatableContentKeySpecifier
      | (() => undefined | ShippingMethodTranslatableContentKeySpecifier);
    fields?: ShippingMethodTranslatableContentFieldPolicy;
  };
  ShippingMethodTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingMethodTranslationKeySpecifier
      | (() => undefined | ShippingMethodTranslationKeySpecifier);
    fields?: ShippingMethodTranslationFieldPolicy;
  };
  ShippingMethodType?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingMethodTypeKeySpecifier
      | (() => undefined | ShippingMethodTypeKeySpecifier);
    fields?: ShippingMethodTypeFieldPolicy;
  };
  ShippingPriceBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingPriceBulkDeleteKeySpecifier
      | (() => undefined | ShippingPriceBulkDeleteKeySpecifier);
    fields?: ShippingPriceBulkDeleteFieldPolicy;
  };
  ShippingPriceCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingPriceCreateKeySpecifier
      | (() => undefined | ShippingPriceCreateKeySpecifier);
    fields?: ShippingPriceCreateFieldPolicy;
  };
  ShippingPriceDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingPriceDeleteKeySpecifier
      | (() => undefined | ShippingPriceDeleteKeySpecifier);
    fields?: ShippingPriceDeleteFieldPolicy;
  };
  ShippingPriceExcludeProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingPriceExcludeProductsKeySpecifier
      | (() => undefined | ShippingPriceExcludeProductsKeySpecifier);
    fields?: ShippingPriceExcludeProductsFieldPolicy;
  };
  ShippingPriceRemoveProductFromExclude?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | ShippingPriceRemoveProductFromExcludeKeySpecifier
      | (() => undefined | ShippingPriceRemoveProductFromExcludeKeySpecifier);
    fields?: ShippingPriceRemoveProductFromExcludeFieldPolicy;
  };
  ShippingPriceTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingPriceTranslateKeySpecifier
      | (() => undefined | ShippingPriceTranslateKeySpecifier);
    fields?: ShippingPriceTranslateFieldPolicy;
  };
  ShippingPriceUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingPriceUpdateKeySpecifier
      | (() => undefined | ShippingPriceUpdateKeySpecifier);
    fields?: ShippingPriceUpdateFieldPolicy;
  };
  ShippingZone?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneKeySpecifier
      | (() => undefined | ShippingZoneKeySpecifier);
    fields?: ShippingZoneFieldPolicy;
  };
  ShippingZoneBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneBulkDeleteKeySpecifier
      | (() => undefined | ShippingZoneBulkDeleteKeySpecifier);
    fields?: ShippingZoneBulkDeleteFieldPolicy;
  };
  ShippingZoneCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneCountableConnectionKeySpecifier
      | (() => undefined | ShippingZoneCountableConnectionKeySpecifier);
    fields?: ShippingZoneCountableConnectionFieldPolicy;
  };
  ShippingZoneCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneCountableEdgeKeySpecifier
      | (() => undefined | ShippingZoneCountableEdgeKeySpecifier);
    fields?: ShippingZoneCountableEdgeFieldPolicy;
  };
  ShippingZoneCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneCreateKeySpecifier
      | (() => undefined | ShippingZoneCreateKeySpecifier);
    fields?: ShippingZoneCreateFieldPolicy;
  };
  ShippingZoneDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneDeleteKeySpecifier
      | (() => undefined | ShippingZoneDeleteKeySpecifier);
    fields?: ShippingZoneDeleteFieldPolicy;
  };
  ShippingZoneUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShippingZoneUpdateKeySpecifier
      | (() => undefined | ShippingZoneUpdateKeySpecifier);
    fields?: ShippingZoneUpdateFieldPolicy;
  };
  Shop?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | ShopKeySpecifier | (() => undefined | ShopKeySpecifier);
    fields?: ShopFieldPolicy;
  };
  ShopAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopAddressUpdateKeySpecifier
      | (() => undefined | ShopAddressUpdateKeySpecifier);
    fields?: ShopAddressUpdateFieldPolicy;
  };
  ShopDomainUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopDomainUpdateKeySpecifier
      | (() => undefined | ShopDomainUpdateKeySpecifier);
    fields?: ShopDomainUpdateFieldPolicy;
  };
  ShopError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopErrorKeySpecifier
      | (() => undefined | ShopErrorKeySpecifier);
    fields?: ShopErrorFieldPolicy;
  };
  ShopFetchTaxRates?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopFetchTaxRatesKeySpecifier
      | (() => undefined | ShopFetchTaxRatesKeySpecifier);
    fields?: ShopFetchTaxRatesFieldPolicy;
  };
  ShopSettingsTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopSettingsTranslateKeySpecifier
      | (() => undefined | ShopSettingsTranslateKeySpecifier);
    fields?: ShopSettingsTranslateFieldPolicy;
  };
  ShopSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopSettingsUpdateKeySpecifier
      | (() => undefined | ShopSettingsUpdateKeySpecifier);
    fields?: ShopSettingsUpdateFieldPolicy;
  };
  ShopTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ShopTranslationKeySpecifier
      | (() => undefined | ShopTranslationKeySpecifier);
    fields?: ShopTranslationFieldPolicy;
  };
  StaffBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StaffBulkDeleteKeySpecifier
      | (() => undefined | StaffBulkDeleteKeySpecifier);
    fields?: StaffBulkDeleteFieldPolicy;
  };
  StaffCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StaffCreateKeySpecifier
      | (() => undefined | StaffCreateKeySpecifier);
    fields?: StaffCreateFieldPolicy;
  };
  StaffDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StaffDeleteKeySpecifier
      | (() => undefined | StaffDeleteKeySpecifier);
    fields?: StaffDeleteFieldPolicy;
  };
  StaffError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StaffErrorKeySpecifier
      | (() => undefined | StaffErrorKeySpecifier);
    fields?: StaffErrorFieldPolicy;
  };
  StaffNotificationRecipient?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StaffNotificationRecipientKeySpecifier
      | (() => undefined | StaffNotificationRecipientKeySpecifier);
    fields?: StaffNotificationRecipientFieldPolicy;
  };
  StaffNotificationRecipientCreate?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | StaffNotificationRecipientCreateKeySpecifier
      | (() => undefined | StaffNotificationRecipientCreateKeySpecifier);
    fields?: StaffNotificationRecipientCreateFieldPolicy;
  };
  StaffNotificationRecipientDelete?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | StaffNotificationRecipientDeleteKeySpecifier
      | (() => undefined | StaffNotificationRecipientDeleteKeySpecifier);
    fields?: StaffNotificationRecipientDeleteFieldPolicy;
  };
  StaffNotificationRecipientUpdate?: Omit<
    TypePolicy,
    "fields" | "keyFields"
  > & {
    keyFields?:
      | false
      | StaffNotificationRecipientUpdateKeySpecifier
      | (() => undefined | StaffNotificationRecipientUpdateKeySpecifier);
    fields?: StaffNotificationRecipientUpdateFieldPolicy;
  };
  StaffUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StaffUpdateKeySpecifier
      | (() => undefined | StaffUpdateKeySpecifier);
    fields?: StaffUpdateFieldPolicy;
  };
  Stock?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StockKeySpecifier
      | (() => undefined | StockKeySpecifier);
    fields?: StockFieldPolicy;
  };
  StockCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StockCountableConnectionKeySpecifier
      | (() => undefined | StockCountableConnectionKeySpecifier);
    fields?: StockCountableConnectionFieldPolicy;
  };
  StockCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StockCountableEdgeKeySpecifier
      | (() => undefined | StockCountableEdgeKeySpecifier);
    fields?: StockCountableEdgeFieldPolicy;
  };
  StockError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | StockErrorKeySpecifier
      | (() => undefined | StockErrorKeySpecifier);
    fields?: StockErrorFieldPolicy;
  };
  TaxType?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TaxTypeKeySpecifier
      | (() => undefined | TaxTypeKeySpecifier);
    fields?: TaxTypeFieldPolicy;
  };
  TaxedMoney?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TaxedMoneyKeySpecifier
      | (() => undefined | TaxedMoneyKeySpecifier);
    fields?: TaxedMoneyFieldPolicy;
  };
  TaxedMoneyRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TaxedMoneyRangeKeySpecifier
      | (() => undefined | TaxedMoneyRangeKeySpecifier);
    fields?: TaxedMoneyRangeFieldPolicy;
  };
  TimePeriod?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TimePeriodKeySpecifier
      | (() => undefined | TimePeriodKeySpecifier);
    fields?: TimePeriodFieldPolicy;
  };
  Transaction?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TransactionKeySpecifier
      | (() => undefined | TransactionKeySpecifier);
    fields?: TransactionFieldPolicy;
  };
  TranslatableItemConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TranslatableItemConnectionKeySpecifier
      | (() => undefined | TranslatableItemConnectionKeySpecifier);
    fields?: TranslatableItemConnectionFieldPolicy;
  };
  TranslatableItemEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TranslatableItemEdgeKeySpecifier
      | (() => undefined | TranslatableItemEdgeKeySpecifier);
    fields?: TranslatableItemEdgeFieldPolicy;
  };
  TranslationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | TranslationErrorKeySpecifier
      | (() => undefined | TranslationErrorKeySpecifier);
    fields?: TranslationErrorFieldPolicy;
  };
  UpdateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UpdateMetadataKeySpecifier
      | (() => undefined | UpdateMetadataKeySpecifier);
    fields?: UpdateMetadataFieldPolicy;
  };
  UpdatePrivateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UpdatePrivateMetadataKeySpecifier
      | (() => undefined | UpdatePrivateMetadataKeySpecifier);
    fields?: UpdatePrivateMetadataFieldPolicy;
  };
  UploadError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UploadErrorKeySpecifier
      | (() => undefined | UploadErrorKeySpecifier);
    fields?: UploadErrorFieldPolicy;
  };
  User?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier);
    fields?: UserFieldPolicy;
  };
  UserAvatarDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserAvatarDeleteKeySpecifier
      | (() => undefined | UserAvatarDeleteKeySpecifier);
    fields?: UserAvatarDeleteFieldPolicy;
  };
  UserAvatarUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserAvatarUpdateKeySpecifier
      | (() => undefined | UserAvatarUpdateKeySpecifier);
    fields?: UserAvatarUpdateFieldPolicy;
  };
  UserBulkSetActive?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserBulkSetActiveKeySpecifier
      | (() => undefined | UserBulkSetActiveKeySpecifier);
    fields?: UserBulkSetActiveFieldPolicy;
  };
  UserCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCountableConnectionKeySpecifier
      | (() => undefined | UserCountableConnectionKeySpecifier);
    fields?: UserCountableConnectionFieldPolicy;
  };
  UserCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserCountableEdgeKeySpecifier
      | (() => undefined | UserCountableEdgeKeySpecifier);
    fields?: UserCountableEdgeFieldPolicy;
  };
  UserPermission?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserPermissionKeySpecifier
      | (() => undefined | UserPermissionKeySpecifier);
    fields?: UserPermissionFieldPolicy;
  };
  VAT?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | VATKeySpecifier | (() => undefined | VATKeySpecifier);
    fields?: VATFieldPolicy;
  };
  VariantMediaAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VariantMediaAssignKeySpecifier
      | (() => undefined | VariantMediaAssignKeySpecifier);
    fields?: VariantMediaAssignFieldPolicy;
  };
  VariantMediaUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VariantMediaUnassignKeySpecifier
      | (() => undefined | VariantMediaUnassignKeySpecifier);
    fields?: VariantMediaUnassignFieldPolicy;
  };
  VariantPricingInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VariantPricingInfoKeySpecifier
      | (() => undefined | VariantPricingInfoKeySpecifier);
    fields?: VariantPricingInfoFieldPolicy;
  };
  VerifyToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VerifyTokenKeySpecifier
      | (() => undefined | VerifyTokenKeySpecifier);
    fields?: VerifyTokenFieldPolicy;
  };
  Voucher?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherKeySpecifier
      | (() => undefined | VoucherKeySpecifier);
    fields?: VoucherFieldPolicy;
  };
  VoucherAddCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherAddCataloguesKeySpecifier
      | (() => undefined | VoucherAddCataloguesKeySpecifier);
    fields?: VoucherAddCataloguesFieldPolicy;
  };
  VoucherBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherBulkDeleteKeySpecifier
      | (() => undefined | VoucherBulkDeleteKeySpecifier);
    fields?: VoucherBulkDeleteFieldPolicy;
  };
  VoucherChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherChannelListingKeySpecifier
      | (() => undefined | VoucherChannelListingKeySpecifier);
    fields?: VoucherChannelListingFieldPolicy;
  };
  VoucherChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherChannelListingUpdateKeySpecifier
      | (() => undefined | VoucherChannelListingUpdateKeySpecifier);
    fields?: VoucherChannelListingUpdateFieldPolicy;
  };
  VoucherCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherCountableConnectionKeySpecifier
      | (() => undefined | VoucherCountableConnectionKeySpecifier);
    fields?: VoucherCountableConnectionFieldPolicy;
  };
  VoucherCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherCountableEdgeKeySpecifier
      | (() => undefined | VoucherCountableEdgeKeySpecifier);
    fields?: VoucherCountableEdgeFieldPolicy;
  };
  VoucherCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherCreateKeySpecifier
      | (() => undefined | VoucherCreateKeySpecifier);
    fields?: VoucherCreateFieldPolicy;
  };
  VoucherDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherDeleteKeySpecifier
      | (() => undefined | VoucherDeleteKeySpecifier);
    fields?: VoucherDeleteFieldPolicy;
  };
  VoucherRemoveCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherRemoveCataloguesKeySpecifier
      | (() => undefined | VoucherRemoveCataloguesKeySpecifier);
    fields?: VoucherRemoveCataloguesFieldPolicy;
  };
  VoucherTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherTranslatableContentKeySpecifier
      | (() => undefined | VoucherTranslatableContentKeySpecifier);
    fields?: VoucherTranslatableContentFieldPolicy;
  };
  VoucherTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherTranslateKeySpecifier
      | (() => undefined | VoucherTranslateKeySpecifier);
    fields?: VoucherTranslateFieldPolicy;
  };
  VoucherTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherTranslationKeySpecifier
      | (() => undefined | VoucherTranslationKeySpecifier);
    fields?: VoucherTranslationFieldPolicy;
  };
  VoucherUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | VoucherUpdateKeySpecifier
      | (() => undefined | VoucherUpdateKeySpecifier);
    fields?: VoucherUpdateFieldPolicy;
  };
  Warehouse?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseKeySpecifier
      | (() => undefined | WarehouseKeySpecifier);
    fields?: WarehouseFieldPolicy;
  };
  WarehouseCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseCountableConnectionKeySpecifier
      | (() => undefined | WarehouseCountableConnectionKeySpecifier);
    fields?: WarehouseCountableConnectionFieldPolicy;
  };
  WarehouseCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseCountableEdgeKeySpecifier
      | (() => undefined | WarehouseCountableEdgeKeySpecifier);
    fields?: WarehouseCountableEdgeFieldPolicy;
  };
  WarehouseCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseCreateKeySpecifier
      | (() => undefined | WarehouseCreateKeySpecifier);
    fields?: WarehouseCreateFieldPolicy;
  };
  WarehouseDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseDeleteKeySpecifier
      | (() => undefined | WarehouseDeleteKeySpecifier);
    fields?: WarehouseDeleteFieldPolicy;
  };
  WarehouseError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseErrorKeySpecifier
      | (() => undefined | WarehouseErrorKeySpecifier);
    fields?: WarehouseErrorFieldPolicy;
  };
  WarehouseShippingZoneAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseShippingZoneAssignKeySpecifier
      | (() => undefined | WarehouseShippingZoneAssignKeySpecifier);
    fields?: WarehouseShippingZoneAssignFieldPolicy;
  };
  WarehouseShippingZoneUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseShippingZoneUnassignKeySpecifier
      | (() => undefined | WarehouseShippingZoneUnassignKeySpecifier);
    fields?: WarehouseShippingZoneUnassignFieldPolicy;
  };
  WarehouseUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WarehouseUpdateKeySpecifier
      | (() => undefined | WarehouseUpdateKeySpecifier);
    fields?: WarehouseUpdateFieldPolicy;
  };
  Webhook?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookKeySpecifier
      | (() => undefined | WebhookKeySpecifier);
    fields?: WebhookFieldPolicy;
  };
  WebhookCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookCreateKeySpecifier
      | (() => undefined | WebhookCreateKeySpecifier);
    fields?: WebhookCreateFieldPolicy;
  };
  WebhookDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookDeleteKeySpecifier
      | (() => undefined | WebhookDeleteKeySpecifier);
    fields?: WebhookDeleteFieldPolicy;
  };
  WebhookError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookErrorKeySpecifier
      | (() => undefined | WebhookErrorKeySpecifier);
    fields?: WebhookErrorFieldPolicy;
  };
  WebhookEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookEventKeySpecifier
      | (() => undefined | WebhookEventKeySpecifier);
    fields?: WebhookEventFieldPolicy;
  };
  WebhookEventAsync?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookEventAsyncKeySpecifier
      | (() => undefined | WebhookEventAsyncKeySpecifier);
    fields?: WebhookEventAsyncFieldPolicy;
  };
  WebhookEventSync?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookEventSyncKeySpecifier
      | (() => undefined | WebhookEventSyncKeySpecifier);
    fields?: WebhookEventSyncFieldPolicy;
  };
  WebhookUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebhookUpdateKeySpecifier
      | (() => undefined | WebhookUpdateKeySpecifier);
    fields?: WebhookUpdateFieldPolicy;
  };
  Weight?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WeightKeySpecifier
      | (() => undefined | WeightKeySpecifier);
    fields?: WeightFieldPolicy;
  };
  _Service?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | _ServiceKeySpecifier
      | (() => undefined | _ServiceKeySpecifier);
    fields?: _ServiceFieldPolicy;
  };
}
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
