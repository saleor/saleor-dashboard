import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type AccountAddressCreateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AccountAddressCreateKeySpecifier)[];
export type AccountAddressCreateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountAddressDeleteKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AccountAddressDeleteKeySpecifier)[];
export type AccountAddressDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountAddressUpdateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AccountAddressUpdateKeySpecifier)[];
export type AccountAddressUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountChangeEmailRequestedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'newEmail' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountChangeEmailRequestedKeySpecifier)[];
export type AccountChangeEmailRequestedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	newEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountConfirmationRequestedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountConfirmationRequestedKeySpecifier)[];
export type AccountConfirmationRequestedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountConfirmedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountConfirmedKeySpecifier)[];
export type AccountConfirmedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountDeleteKeySpecifier)[];
export type AccountDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountDeleteRequestedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountDeleteRequestedKeySpecifier)[];
export type AccountDeleteRequestedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountDeletedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountDeletedKeySpecifier)[];
export type AccountDeletedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountEmailChangedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'newEmail' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountEmailChangedKeySpecifier)[];
export type AccountEmailChangedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	newEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'message' | AccountErrorKeySpecifier)[];
export type AccountErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountRegisterKeySpecifier = ('accountErrors' | 'errors' | 'requiresConfirmation' | 'user' | AccountRegisterKeySpecifier)[];
export type AccountRegisterFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	requiresConfirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountRequestDeletionKeySpecifier = ('accountErrors' | 'errors' | AccountRequestDeletionKeySpecifier)[];
export type AccountRequestDeletionFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountSetDefaultAddressKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountSetDefaultAddressKeySpecifier)[];
export type AccountSetDefaultAddressFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountSetPasswordRequestedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | AccountSetPasswordRequestedKeySpecifier)[];
export type AccountSetPasswordRequestedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountUpdateKeySpecifier)[];
export type AccountUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressKeySpecifier = ('city' | 'cityArea' | 'companyName' | 'country' | 'countryArea' | 'firstName' | 'id' | 'isDefaultBillingAddress' | 'isDefaultShippingAddress' | 'lastName' | 'metadata' | 'metafield' | 'metafields' | 'phone' | 'postalCode' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'streetAddress1' | 'streetAddress2' | AddressKeySpecifier)[];
export type AddressFieldPolicy = {
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	cityArea?: FieldPolicy<any> | FieldReadFunction<any>,
	companyName?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	countryArea?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	phone?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCode?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	streetAddress1?: FieldPolicy<any> | FieldReadFunction<any>,
	streetAddress2?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressCreateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AddressCreateKeySpecifier)[];
export type AddressCreateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressCreatedKeySpecifier = ('address' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AddressCreatedKeySpecifier)[];
export type AddressCreatedFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressDeleteKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AddressDeleteKeySpecifier)[];
export type AddressDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressDeletedKeySpecifier = ('address' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AddressDeletedKeySpecifier)[];
export type AddressDeletedFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressSetDefaultKeySpecifier = ('accountErrors' | 'errors' | 'user' | AddressSetDefaultKeySpecifier)[];
export type AddressSetDefaultFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressUpdateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AddressUpdateKeySpecifier)[];
export type AddressUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressUpdatedKeySpecifier = ('address' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AddressUpdatedKeySpecifier)[];
export type AddressUpdatedFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressValidationDataKeySpecifier = ('addressFormat' | 'addressLatinFormat' | 'allowedFields' | 'cityAreaChoices' | 'cityAreaType' | 'cityChoices' | 'cityType' | 'countryAreaChoices' | 'countryAreaType' | 'countryCode' | 'countryName' | 'postalCodeExamples' | 'postalCodeMatchers' | 'postalCodePrefix' | 'postalCodeType' | 'requiredFields' | 'upperFields' | AddressValidationDataKeySpecifier)[];
export type AddressValidationDataFieldPolicy = {
	addressFormat?: FieldPolicy<any> | FieldReadFunction<any>,
	addressLatinFormat?: FieldPolicy<any> | FieldReadFunction<any>,
	allowedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	cityAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	cityAreaType?: FieldPolicy<any> | FieldReadFunction<any>,
	cityChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	cityType?: FieldPolicy<any> | FieldReadFunction<any>,
	countryAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	countryAreaType?: FieldPolicy<any> | FieldReadFunction<any>,
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	countryName?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeExamples?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeMatchers?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodePrefix?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeType?: FieldPolicy<any> | FieldReadFunction<any>,
	requiredFields?: FieldPolicy<any> | FieldReadFunction<any>,
	upperFields?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AllocationKeySpecifier = ('id' | 'quantity' | 'warehouse' | AllocationKeySpecifier)[];
export type AllocationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppKeySpecifier = ('aboutApp' | 'accessToken' | 'appUrl' | 'author' | 'brand' | 'breakerLastStateChange' | 'breakerState' | 'configurationUrl' | 'created' | 'dataPrivacy' | 'dataPrivacyUrl' | 'extensions' | 'homepageUrl' | 'id' | 'identifier' | 'isActive' | 'manifestUrl' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'permissions' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'supportUrl' | 'tokens' | 'type' | 'version' | 'webhooks' | AppKeySpecifier)[];
export type AppFieldPolicy = {
	aboutApp?: FieldPolicy<any> | FieldReadFunction<any>,
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>,
	appUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	author?: FieldPolicy<any> | FieldReadFunction<any>,
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	breakerLastStateChange?: FieldPolicy<any> | FieldReadFunction<any>,
	breakerState?: FieldPolicy<any> | FieldReadFunction<any>,
	configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	extensions?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	identifier?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	manifestUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	supportUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	tokens?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	webhooks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppActivateKeySpecifier = ('app' | 'appErrors' | 'errors' | AppActivateKeySpecifier)[];
export type AppActivateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppBrandKeySpecifier = ('logo' | AppBrandKeySpecifier)[];
export type AppBrandFieldPolicy = {
	logo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppBrandLogoKeySpecifier = ('default' | AppBrandLogoKeySpecifier)[];
export type AppBrandLogoFieldPolicy = {
	default?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AppCountableConnectionKeySpecifier)[];
export type AppCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCountableEdgeKeySpecifier = ('cursor' | 'node' | AppCountableEdgeKeySpecifier)[];
export type AppCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCreateKeySpecifier = ('app' | 'appErrors' | 'authToken' | 'errors' | AppCreateKeySpecifier)[];
export type AppCreateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeactivateKeySpecifier = ('app' | 'appErrors' | 'errors' | AppDeactivateKeySpecifier)[];
export type AppDeactivateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeleteKeySpecifier = ('app' | 'appErrors' | 'errors' | AppDeleteKeySpecifier)[];
export type AppDeleteFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeleteFailedInstallationKeySpecifier = ('appErrors' | 'appInstallation' | 'errors' | AppDeleteFailedInstallationKeySpecifier)[];
export type AppDeleteFailedInstallationFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeletedKeySpecifier = ('app' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AppDeletedKeySpecifier)[];
export type AppDeletedFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppErrorKeySpecifier = ('code' | 'field' | 'message' | 'permissions' | AppErrorKeySpecifier)[];
export type AppErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppExtensionKeySpecifier = ('accessToken' | 'app' | 'id' | 'label' | 'mount' | 'mountName' | 'options' | 'permissions' | 'settings' | 'target' | 'targetName' | 'url' | AppExtensionKeySpecifier)[];
export type AppExtensionFieldPolicy = {
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	mount?: FieldPolicy<any> | FieldReadFunction<any>,
	mountName?: FieldPolicy<any> | FieldReadFunction<any>,
	options?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	settings?: FieldPolicy<any> | FieldReadFunction<any>,
	target?: FieldPolicy<any> | FieldReadFunction<any>,
	targetName?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppExtensionCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AppExtensionCountableConnectionKeySpecifier)[];
export type AppExtensionCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppExtensionCountableEdgeKeySpecifier = ('cursor' | 'node' | AppExtensionCountableEdgeKeySpecifier)[];
export type AppExtensionCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppExtensionOptionsNewTabKeySpecifier = ('newTabTarget' | AppExtensionOptionsNewTabKeySpecifier)[];
export type AppExtensionOptionsNewTabFieldPolicy = {
	newTabTarget?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppExtensionOptionsWidgetKeySpecifier = ('widgetTarget' | AppExtensionOptionsWidgetKeySpecifier)[];
export type AppExtensionOptionsWidgetFieldPolicy = {
	widgetTarget?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppFetchManifestKeySpecifier = ('appErrors' | 'errors' | 'manifest' | AppFetchManifestKeySpecifier)[];
export type AppFetchManifestFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	manifest?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstallKeySpecifier = ('appErrors' | 'appInstallation' | 'errors' | AppInstallKeySpecifier)[];
export type AppInstallFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstallationKeySpecifier = ('appName' | 'brand' | 'createdAt' | 'id' | 'manifestUrl' | 'message' | 'status' | 'updatedAt' | AppInstallationKeySpecifier)[];
export type AppInstallationFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	manifestUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstalledKeySpecifier = ('app' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AppInstalledKeySpecifier)[];
export type AppInstalledFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppManifestBrandKeySpecifier = ('logo' | AppManifestBrandKeySpecifier)[];
export type AppManifestBrandFieldPolicy = {
	logo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppManifestBrandLogoKeySpecifier = ('default' | AppManifestBrandLogoKeySpecifier)[];
export type AppManifestBrandLogoFieldPolicy = {
	default?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppManifestExtensionKeySpecifier = ('label' | 'mount' | 'mountName' | 'permissions' | 'settings' | 'target' | 'targetName' | 'url' | AppManifestExtensionKeySpecifier)[];
export type AppManifestExtensionFieldPolicy = {
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	mount?: FieldPolicy<any> | FieldReadFunction<any>,
	mountName?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	settings?: FieldPolicy<any> | FieldReadFunction<any>,
	target?: FieldPolicy<any> | FieldReadFunction<any>,
	targetName?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppManifestRequiredSaleorVersionKeySpecifier = ('constraint' | 'satisfied' | AppManifestRequiredSaleorVersionKeySpecifier)[];
export type AppManifestRequiredSaleorVersionFieldPolicy = {
	constraint?: FieldPolicy<any> | FieldReadFunction<any>,
	satisfied?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppManifestWebhookKeySpecifier = ('asyncEvents' | 'name' | 'query' | 'syncEvents' | 'targetUrl' | AppManifestWebhookKeySpecifier)[];
export type AppManifestWebhookFieldPolicy = {
	asyncEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	query?: FieldPolicy<any> | FieldReadFunction<any>,
	syncEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	targetUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppReenableSyncWebhooksKeySpecifier = ('app' | 'appErrors' | 'errors' | AppReenableSyncWebhooksKeySpecifier)[];
export type AppReenableSyncWebhooksFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppRetryInstallKeySpecifier = ('appErrors' | 'appInstallation' | 'errors' | AppRetryInstallKeySpecifier)[];
export type AppRetryInstallFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppStatusChangedKeySpecifier = ('app' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AppStatusChangedKeySpecifier)[];
export type AppStatusChangedFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenKeySpecifier = ('authToken' | 'id' | 'name' | AppTokenKeySpecifier)[];
export type AppTokenFieldPolicy = {
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenCreateKeySpecifier = ('appErrors' | 'appToken' | 'authToken' | 'errors' | AppTokenCreateKeySpecifier)[];
export type AppTokenCreateFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appToken?: FieldPolicy<any> | FieldReadFunction<any>,
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenDeleteKeySpecifier = ('appErrors' | 'appToken' | 'errors' | AppTokenDeleteKeySpecifier)[];
export type AppTokenDeleteFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenVerifyKeySpecifier = ('appErrors' | 'errors' | 'valid' | AppTokenVerifyKeySpecifier)[];
export type AppTokenVerifyFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	valid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppUpdateKeySpecifier = ('app' | 'appErrors' | 'errors' | AppUpdateKeySpecifier)[];
export type AppUpdateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppUpdatedKeySpecifier = ('app' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AppUpdatedKeySpecifier)[];
export type AppUpdatedFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignNavigationKeySpecifier = ('errors' | 'menu' | 'menuErrors' | AssignNavigationKeySpecifier)[];
export type AssignNavigationFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedAttributeKeySpecifier = ('attribute' | AssignedAttributeKeySpecifier)[];
export type AssignedAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedBooleanAttributeKeySpecifier = ('attribute' | 'value' | AssignedBooleanAttributeKeySpecifier)[];
export type AssignedBooleanAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedChoiceAttributeValueKeySpecifier = ('name' | 'slug' | 'translation' | AssignedChoiceAttributeValueKeySpecifier)[];
export type AssignedChoiceAttributeValueFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedDateAttributeKeySpecifier = ('attribute' | 'value' | AssignedDateAttributeKeySpecifier)[];
export type AssignedDateAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedDateTimeAttributeKeySpecifier = ('attribute' | 'value' | AssignedDateTimeAttributeKeySpecifier)[];
export type AssignedDateTimeAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedFileAttributeKeySpecifier = ('attribute' | 'value' | AssignedFileAttributeKeySpecifier)[];
export type AssignedFileAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedMultiCategoryReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedMultiCategoryReferenceAttributeKeySpecifier)[];
export type AssignedMultiCategoryReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedMultiChoiceAttributeKeySpecifier = ('attribute' | 'value' | AssignedMultiChoiceAttributeKeySpecifier)[];
export type AssignedMultiChoiceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedMultiCollectionReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedMultiCollectionReferenceAttributeKeySpecifier)[];
export type AssignedMultiCollectionReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedMultiPageReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedMultiPageReferenceAttributeKeySpecifier)[];
export type AssignedMultiPageReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedMultiProductReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedMultiProductReferenceAttributeKeySpecifier)[];
export type AssignedMultiProductReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedMultiProductVariantReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedMultiProductVariantReferenceAttributeKeySpecifier)[];
export type AssignedMultiProductVariantReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedNumericAttributeKeySpecifier = ('attribute' | 'value' | AssignedNumericAttributeKeySpecifier)[];
export type AssignedNumericAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedPlainTextAttributeKeySpecifier = ('attribute' | 'translation' | 'value' | AssignedPlainTextAttributeKeySpecifier)[];
export type AssignedPlainTextAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSingleCategoryReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedSingleCategoryReferenceAttributeKeySpecifier)[];
export type AssignedSingleCategoryReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSingleChoiceAttributeKeySpecifier = ('attribute' | 'value' | AssignedSingleChoiceAttributeKeySpecifier)[];
export type AssignedSingleChoiceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSingleCollectionReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedSingleCollectionReferenceAttributeKeySpecifier)[];
export type AssignedSingleCollectionReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSinglePageReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedSinglePageReferenceAttributeKeySpecifier)[];
export type AssignedSinglePageReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSingleProductReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedSingleProductReferenceAttributeKeySpecifier)[];
export type AssignedSingleProductReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSingleProductVariantReferenceAttributeKeySpecifier = ('attribute' | 'value' | AssignedSingleProductVariantReferenceAttributeKeySpecifier)[];
export type AssignedSingleProductVariantReferenceAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSwatchAttributeKeySpecifier = ('attribute' | 'value' | AssignedSwatchAttributeKeySpecifier)[];
export type AssignedSwatchAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedSwatchAttributeValueKeySpecifier = ('file' | 'hexColor' | 'name' | 'slug' | AssignedSwatchAttributeValueKeySpecifier)[];
export type AssignedSwatchAttributeValueFieldPolicy = {
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	hexColor?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedTextAttributeKeySpecifier = ('attribute' | 'translation' | 'value' | AssignedTextAttributeKeySpecifier)[];
export type AssignedTextAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignedVariantAttributeKeySpecifier = ('attribute' | 'variantSelection' | AssignedVariantAttributeKeySpecifier)[];
export type AssignedVariantAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	variantSelection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeKeySpecifier = ('availableInGrid' | 'choices' | 'entityType' | 'externalReference' | 'filterableInDashboard' | 'filterableInStorefront' | 'id' | 'inputType' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'productTypes' | 'productVariantTypes' | 'referenceTypes' | 'slug' | 'storefrontSearchPosition' | 'translation' | 'type' | 'unit' | 'valueRequired' | 'visibleInStorefront' | 'withChoices' | AttributeKeySpecifier)[];
export type AttributeFieldPolicy = {
	availableInGrid?: FieldPolicy<any> | FieldReadFunction<any>,
	choices?: FieldPolicy<any> | FieldReadFunction<any>,
	entityType?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	filterableInDashboard?: FieldPolicy<any> | FieldReadFunction<any>,
	filterableInStorefront?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inputType?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	referenceTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	storefrontSearchPosition?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	valueRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	visibleInStorefront?: FieldPolicy<any> | FieldReadFunction<any>,
	withChoices?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkCreateKeySpecifier = ('count' | 'errors' | 'results' | AttributeBulkCreateKeySpecifier)[];
export type AttributeBulkCreateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkCreateErrorKeySpecifier = ('code' | 'message' | 'path' | AttributeBulkCreateErrorKeySpecifier)[];
export type AttributeBulkCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkCreateResultKeySpecifier = ('attribute' | 'errors' | AttributeBulkCreateResultKeySpecifier)[];
export type AttributeBulkCreateResultFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkDeleteKeySpecifier = ('attributeErrors' | 'count' | 'errors' | AttributeBulkDeleteKeySpecifier)[];
export type AttributeBulkDeleteFieldPolicy = {
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkTranslateKeySpecifier = ('count' | 'errors' | 'results' | AttributeBulkTranslateKeySpecifier)[];
export type AttributeBulkTranslateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkTranslateErrorKeySpecifier = ('code' | 'message' | 'path' | AttributeBulkTranslateErrorKeySpecifier)[];
export type AttributeBulkTranslateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkTranslateResultKeySpecifier = ('errors' | 'translation' | AttributeBulkTranslateResultKeySpecifier)[];
export type AttributeBulkTranslateResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkUpdateKeySpecifier = ('count' | 'errors' | 'results' | AttributeBulkUpdateKeySpecifier)[];
export type AttributeBulkUpdateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkUpdateErrorKeySpecifier = ('code' | 'message' | 'path' | AttributeBulkUpdateErrorKeySpecifier)[];
export type AttributeBulkUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkUpdateResultKeySpecifier = ('attribute' | 'errors' | AttributeBulkUpdateResultKeySpecifier)[];
export type AttributeBulkUpdateResultFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AttributeCountableConnectionKeySpecifier)[];
export type AttributeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCountableEdgeKeySpecifier = ('cursor' | 'node' | AttributeCountableEdgeKeySpecifier)[];
export type AttributeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCreateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeCreateKeySpecifier)[];
export type AttributeCreateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCreatedKeySpecifier = ('attribute' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AttributeCreatedKeySpecifier)[];
export type AttributeCreatedFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeDeleteKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeDeleteKeySpecifier)[];
export type AttributeDeleteFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeDeletedKeySpecifier = ('attribute' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AttributeDeletedKeySpecifier)[];
export type AttributeDeletedFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeErrorKeySpecifier = ('code' | 'field' | 'message' | AttributeErrorKeySpecifier)[];
export type AttributeErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeReorderValuesKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeReorderValuesKeySpecifier)[];
export type AttributeReorderValuesFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslatableContentKeySpecifier = ('attribute' | 'attributeId' | 'id' | 'name' | 'translation' | AttributeTranslatableContentKeySpecifier)[];
export type AttributeTranslatableContentFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslateKeySpecifier = ('attribute' | 'errors' | 'translationErrors' | AttributeTranslateKeySpecifier)[];
export type AttributeTranslateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslationKeySpecifier = ('id' | 'language' | 'name' | 'translatableContent' | AttributeTranslationKeySpecifier)[];
export type AttributeTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeUpdateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeUpdateKeySpecifier)[];
export type AttributeUpdateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeUpdatedKeySpecifier = ('attribute' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AttributeUpdatedKeySpecifier)[];
export type AttributeUpdatedFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueKeySpecifier = ('boolean' | 'date' | 'dateTime' | 'externalReference' | 'file' | 'id' | 'inputType' | 'name' | 'plainText' | 'reference' | 'richText' | 'slug' | 'translation' | 'value' | AttributeValueKeySpecifier)[];
export type AttributeValueFieldPolicy = {
	boolean?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	dateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inputType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plainText?: FieldPolicy<any> | FieldReadFunction<any>,
	reference?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueBulkDeleteKeySpecifier = ('attributeErrors' | 'count' | 'errors' | AttributeValueBulkDeleteKeySpecifier)[];
export type AttributeValueBulkDeleteFieldPolicy = {
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueBulkTranslateKeySpecifier = ('count' | 'errors' | 'results' | AttributeValueBulkTranslateKeySpecifier)[];
export type AttributeValueBulkTranslateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueBulkTranslateErrorKeySpecifier = ('code' | 'message' | 'path' | AttributeValueBulkTranslateErrorKeySpecifier)[];
export type AttributeValueBulkTranslateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueBulkTranslateResultKeySpecifier = ('errors' | 'translation' | AttributeValueBulkTranslateResultKeySpecifier)[];
export type AttributeValueBulkTranslateResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AttributeValueCountableConnectionKeySpecifier)[];
export type AttributeValueCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCountableEdgeKeySpecifier = ('cursor' | 'node' | AttributeValueCountableEdgeKeySpecifier)[];
export type AttributeValueCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCreateKeySpecifier = ('attribute' | 'attributeErrors' | 'attributeValue' | 'errors' | AttributeValueCreateKeySpecifier)[];
export type AttributeValueCreateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCreatedKeySpecifier = ('attributeValue' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AttributeValueCreatedKeySpecifier)[];
export type AttributeValueCreatedFieldPolicy = {
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueDeleteKeySpecifier = ('attribute' | 'attributeErrors' | 'attributeValue' | 'errors' | AttributeValueDeleteKeySpecifier)[];
export type AttributeValueDeleteFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueDeletedKeySpecifier = ('attributeValue' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AttributeValueDeletedKeySpecifier)[];
export type AttributeValueDeletedFieldPolicy = {
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslatableContentKeySpecifier = ('attribute' | 'attributeValue' | 'attributeValueId' | 'id' | 'name' | 'plainText' | 'richText' | 'translation' | AttributeValueTranslatableContentKeySpecifier)[];
export type AttributeValueTranslatableContentFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plainText?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslateKeySpecifier = ('attributeValue' | 'errors' | 'translationErrors' | AttributeValueTranslateKeySpecifier)[];
export type AttributeValueTranslateFieldPolicy = {
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslationKeySpecifier = ('id' | 'language' | 'name' | 'plainText' | 'richText' | 'translatableContent' | AttributeValueTranslationKeySpecifier)[];
export type AttributeValueTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plainText?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueUpdateKeySpecifier = ('attribute' | 'attributeErrors' | 'attributeValue' | 'errors' | AttributeValueUpdateKeySpecifier)[];
export type AttributeValueUpdateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueUpdatedKeySpecifier = ('attributeValue' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | AttributeValueUpdatedKeySpecifier)[];
export type AttributeValueUpdatedFieldPolicy = {
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BulkProductErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'field' | 'index' | 'message' | 'values' | 'warehouses' | BulkProductErrorKeySpecifier)[];
export type BulkProductErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BulkStockErrorKeySpecifier = ('attributes' | 'code' | 'field' | 'index' | 'message' | 'values' | BulkStockErrorKeySpecifier)[];
export type BulkStockErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CalculateTaxesKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'taxBase' | 'version' | CalculateTaxesKeySpecifier)[];
export type CalculateTaxesFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	taxBase?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CardPaymentMethodDetailsKeySpecifier = ('brand' | 'expMonth' | 'expYear' | 'firstDigits' | 'lastDigits' | 'name' | CardPaymentMethodDetailsKeySpecifier)[];
export type CardPaymentMethodDetailsFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	expMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	expYear?: FieldPolicy<any> | FieldReadFunction<any>,
	firstDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	lastDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryKeySpecifier = ('ancestors' | 'backgroundImage' | 'children' | 'description' | 'descriptionJson' | 'id' | 'level' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'parent' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'products' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | 'updatedAt' | CategoryKeySpecifier)[];
export type CategoryFieldPolicy = {
	ancestors?: FieldPolicy<any> | FieldReadFunction<any>,
	backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | CategoryBulkDeleteKeySpecifier)[];
export type CategoryBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CategoryCountableConnectionKeySpecifier)[];
export type CategoryCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCountableEdgeKeySpecifier = ('cursor' | 'node' | CategoryCountableEdgeKeySpecifier)[];
export type CategoryCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCreateKeySpecifier = ('category' | 'errors' | 'productErrors' | CategoryCreateKeySpecifier)[];
export type CategoryCreateFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCreatedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CategoryCreatedKeySpecifier)[];
export type CategoryCreatedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryDeleteKeySpecifier = ('category' | 'errors' | 'productErrors' | CategoryDeleteKeySpecifier)[];
export type CategoryDeleteFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryDeletedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CategoryDeletedKeySpecifier)[];
export type CategoryDeletedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslatableContentKeySpecifier = ('category' | 'categoryId' | 'description' | 'descriptionJson' | 'id' | 'name' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | CategoryTranslatableContentKeySpecifier)[];
export type CategoryTranslatableContentFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryId?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslateKeySpecifier = ('category' | 'errors' | 'translationErrors' | CategoryTranslateKeySpecifier)[];
export type CategoryTranslateFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslationKeySpecifier = ('description' | 'descriptionJson' | 'id' | 'language' | 'name' | 'seoDescription' | 'seoTitle' | 'slug' | 'translatableContent' | CategoryTranslationKeySpecifier)[];
export type CategoryTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryUpdateKeySpecifier = ('category' | 'errors' | 'productErrors' | CategoryUpdateKeySpecifier)[];
export type CategoryUpdateFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryUpdatedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CategoryUpdatedKeySpecifier)[];
export type CategoryUpdatedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelKeySpecifier = ('availableShippingMethodsPerCountry' | 'checkoutSettings' | 'countries' | 'currencyCode' | 'defaultCountry' | 'hasOrders' | 'id' | 'isActive' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'orderSettings' | 'paymentSettings' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'slug' | 'stockSettings' | 'taxConfiguration' | 'warehouses' | ChannelKeySpecifier)[];
export type ChannelFieldPolicy = {
	availableShippingMethodsPerCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	currencyCode?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	hasOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	stockSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	taxConfiguration?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelActivateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelActivateKeySpecifier)[];
export type ChannelActivateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelCreateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelCreateKeySpecifier)[];
export type ChannelCreateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelCreatedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | ChannelCreatedKeySpecifier)[];
export type ChannelCreatedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeactivateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelDeactivateKeySpecifier)[];
export type ChannelDeactivateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeleteKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelDeleteKeySpecifier)[];
export type ChannelDeleteFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeletedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | ChannelDeletedKeySpecifier)[];
export type ChannelDeletedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelErrorKeySpecifier = ('code' | 'field' | 'message' | 'shippingZones' | 'warehouses' | ChannelErrorKeySpecifier)[];
export type ChannelErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelMetadataUpdatedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | ChannelMetadataUpdatedKeySpecifier)[];
export type ChannelMetadataUpdatedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelReorderWarehousesKeySpecifier = ('channel' | 'errors' | ChannelReorderWarehousesKeySpecifier)[];
export type ChannelReorderWarehousesFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelStatusChangedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | ChannelStatusChangedKeySpecifier)[];
export type ChannelStatusChangedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelUpdateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelUpdateKeySpecifier)[];
export type ChannelUpdateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelUpdatedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | ChannelUpdatedKeySpecifier)[];
export type ChannelUpdatedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutKeySpecifier = ('authorizeStatus' | 'availableCollectionPoints' | 'availablePaymentGateways' | 'availableShippingMethods' | 'billingAddress' | 'channel' | 'chargeStatus' | 'created' | 'customerNote' | 'deliveryMethod' | 'discount' | 'discountName' | 'displayGrossPrices' | 'email' | 'giftCards' | 'id' | 'isShippingRequired' | 'languageCode' | 'lastChange' | 'lines' | 'metadata' | 'metafield' | 'metafields' | 'note' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'problems' | 'quantity' | 'shippingAddress' | 'shippingMethod' | 'shippingMethods' | 'shippingPrice' | 'stockReservationExpires' | 'storedPaymentMethods' | 'subtotalPrice' | 'taxExemption' | 'token' | 'totalBalance' | 'totalPrice' | 'transactions' | 'translatedDiscountName' | 'updatedAt' | 'user' | 'voucher' | 'voucherCode' | CheckoutKeySpecifier)[];
export type CheckoutFieldPolicy = {
	authorizeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	availableCollectionPoints?: FieldPolicy<any> | FieldReadFunction<any>,
	availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	billingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	customerNote?: FieldPolicy<any> | FieldReadFunction<any>,
	deliveryMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountName?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	lastChange?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	problems?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	stockReservationExpires?: FieldPolicy<any> | FieldReadFunction<any>,
	storedPaymentMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	subtotalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	taxExemption?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	totalBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutAddPromoCodeKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutAddPromoCodeKeySpecifier)[];
export type CheckoutAddPromoCodeFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutBillingAddressUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutBillingAddressUpdateKeySpecifier)[];
export type CheckoutBillingAddressUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCompleteKeySpecifier = ('checkoutErrors' | 'confirmationData' | 'confirmationNeeded' | 'errors' | 'order' | CheckoutCompleteKeySpecifier)[];
export type CheckoutCompleteFieldPolicy = {
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmationData?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmationNeeded?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CheckoutCountableConnectionKeySpecifier)[];
export type CheckoutCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCountableEdgeKeySpecifier = ('cursor' | 'node' | CheckoutCountableEdgeKeySpecifier)[];
export type CheckoutCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreateKeySpecifier = ('checkout' | 'checkoutErrors' | 'created' | 'errors' | CheckoutCreateKeySpecifier)[];
export type CheckoutCreateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreateFromOrderKeySpecifier = ('checkout' | 'errors' | 'unavailableVariants' | CheckoutCreateFromOrderKeySpecifier)[];
export type CheckoutCreateFromOrderFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	unavailableVariants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreateFromOrderErrorKeySpecifier = ('code' | 'field' | 'message' | CheckoutCreateFromOrderErrorKeySpecifier)[];
export type CheckoutCreateFromOrderErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreateFromOrderUnavailableVariantKeySpecifier = ('code' | 'lineId' | 'message' | 'variantId' | CheckoutCreateFromOrderUnavailableVariantKeySpecifier)[];
export type CheckoutCreateFromOrderUnavailableVariantFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	lineId?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	variantId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreatedKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CheckoutCreatedKeySpecifier)[];
export type CheckoutCreatedFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCustomerAttachKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutCustomerAttachKeySpecifier)[];
export type CheckoutCustomerAttachFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCustomerDetachKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutCustomerDetachKeySpecifier)[];
export type CheckoutCustomerDetachFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCustomerNoteUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutCustomerNoteUpdateKeySpecifier)[];
export type CheckoutCustomerNoteUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutDeliveryMethodUpdateKeySpecifier = ('checkout' | 'errors' | CheckoutDeliveryMethodUpdateKeySpecifier)[];
export type CheckoutDeliveryMethodUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutEmailUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutEmailUpdateKeySpecifier)[];
export type CheckoutEmailUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'lines' | 'message' | 'variants' | CheckoutErrorKeySpecifier)[];
export type CheckoutErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutFilterShippingMethodsKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingMethods' | 'version' | CheckoutFilterShippingMethodsKeySpecifier)[];
export type CheckoutFilterShippingMethodsFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutFullyAuthorizedKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CheckoutFullyAuthorizedKeySpecifier)[];
export type CheckoutFullyAuthorizedFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutFullyPaidKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CheckoutFullyPaidKeySpecifier)[];
export type CheckoutFullyPaidFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLanguageCodeUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLanguageCodeUpdateKeySpecifier)[];
export type CheckoutLanguageCodeUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineKeySpecifier = ('id' | 'isGift' | 'metadata' | 'metafield' | 'metafields' | 'priorTotalPrice' | 'priorUnitPrice' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'problems' | 'quantity' | 'requiresShipping' | 'totalPrice' | 'undiscountedTotalPrice' | 'undiscountedUnitPrice' | 'unitPrice' | 'variant' | CheckoutLineKeySpecifier)[];
export type CheckoutLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isGift?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	priorTotalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	priorUnitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	problems?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	requiresShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedTotalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedUnitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	unitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CheckoutLineCountableConnectionKeySpecifier)[];
export type CheckoutLineCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineCountableEdgeKeySpecifier = ('cursor' | 'node' | CheckoutLineCountableEdgeKeySpecifier)[];
export type CheckoutLineCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineDeleteKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLineDeleteKeySpecifier)[];
export type CheckoutLineDeleteFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineProblemInsufficientStockKeySpecifier = ('availableQuantity' | 'line' | 'variant' | CheckoutLineProblemInsufficientStockKeySpecifier)[];
export type CheckoutLineProblemInsufficientStockFieldPolicy = {
	availableQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	line?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineProblemVariantNotAvailableKeySpecifier = ('line' | CheckoutLineProblemVariantNotAvailableKeySpecifier)[];
export type CheckoutLineProblemVariantNotAvailableFieldPolicy = {
	line?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLinesAddKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLinesAddKeySpecifier)[];
export type CheckoutLinesAddFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLinesDeleteKeySpecifier = ('checkout' | 'errors' | CheckoutLinesDeleteKeySpecifier)[];
export type CheckoutLinesDeleteFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLinesUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLinesUpdateKeySpecifier)[];
export type CheckoutLinesUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutMetadataUpdatedKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CheckoutMetadataUpdatedKeySpecifier)[];
export type CheckoutMetadataUpdatedFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutPaymentCreateKeySpecifier = ('checkout' | 'errors' | 'payment' | 'paymentErrors' | CheckoutPaymentCreateKeySpecifier)[];
export type CheckoutPaymentCreateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutRemovePromoCodeKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutRemovePromoCodeKeySpecifier)[];
export type CheckoutRemovePromoCodeFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutSettingsKeySpecifier = ('automaticallyCompleteFullyPaidCheckouts' | 'useLegacyErrorFlow' | CheckoutSettingsKeySpecifier)[];
export type CheckoutSettingsFieldPolicy = {
	automaticallyCompleteFullyPaidCheckouts?: FieldPolicy<any> | FieldReadFunction<any>,
	useLegacyErrorFlow?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutShippingAddressUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutShippingAddressUpdateKeySpecifier)[];
export type CheckoutShippingAddressUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutShippingMethodUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutShippingMethodUpdateKeySpecifier)[];
export type CheckoutShippingMethodUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutUpdatedKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CheckoutUpdatedKeySpecifier)[];
export type CheckoutUpdatedFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChoiceValueKeySpecifier = ('raw' | 'verbose' | ChoiceValueKeySpecifier)[];
export type ChoiceValueFieldPolicy = {
	raw?: FieldPolicy<any> | FieldReadFunction<any>,
	verbose?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionKeySpecifier = ('backgroundImage' | 'channel' | 'channelListings' | 'description' | 'descriptionJson' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'products' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | CollectionKeySpecifier)[];
export type CollectionFieldPolicy = {
	backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionAddProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionAddProductsKeySpecifier)[];
export type CollectionAddProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionBulkDeleteKeySpecifier = ('collectionErrors' | 'count' | 'errors' | CollectionBulkDeleteKeySpecifier)[];
export type CollectionBulkDeleteFieldPolicy = {
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingKeySpecifier = ('channel' | 'id' | 'isPublished' | 'publicationDate' | 'publishedAt' | CollectionChannelListingKeySpecifier)[];
export type CollectionChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	publishedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'field' | 'message' | 'values' | CollectionChannelListingErrorKeySpecifier)[];
export type CollectionChannelListingErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingUpdateKeySpecifier = ('collection' | 'collectionChannelListingErrors' | 'errors' | CollectionChannelListingUpdateKeySpecifier)[];
export type CollectionChannelListingUpdateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CollectionCountableConnectionKeySpecifier)[];
export type CollectionCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCountableEdgeKeySpecifier = ('cursor' | 'node' | CollectionCountableEdgeKeySpecifier)[];
export type CollectionCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCreateKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionCreateKeySpecifier)[];
export type CollectionCreateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCreatedKeySpecifier = ('collection' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CollectionCreatedKeySpecifier)[];
export type CollectionCreatedFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionDeleteKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionDeleteKeySpecifier)[];
export type CollectionDeleteFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionDeletedKeySpecifier = ('collection' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CollectionDeletedKeySpecifier)[];
export type CollectionDeletedFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionErrorKeySpecifier = ('code' | 'field' | 'message' | 'products' | CollectionErrorKeySpecifier)[];
export type CollectionErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionMetadataUpdatedKeySpecifier = ('collection' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CollectionMetadataUpdatedKeySpecifier)[];
export type CollectionMetadataUpdatedFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionRemoveProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionRemoveProductsKeySpecifier)[];
export type CollectionRemoveProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionReorderProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionReorderProductsKeySpecifier)[];
export type CollectionReorderProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslatableContentKeySpecifier = ('collection' | 'collectionId' | 'description' | 'descriptionJson' | 'id' | 'name' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | CollectionTranslatableContentKeySpecifier)[];
export type CollectionTranslatableContentFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionId?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslateKeySpecifier = ('collection' | 'errors' | 'translationErrors' | CollectionTranslateKeySpecifier)[];
export type CollectionTranslateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslationKeySpecifier = ('description' | 'descriptionJson' | 'id' | 'language' | 'name' | 'seoDescription' | 'seoTitle' | 'slug' | 'translatableContent' | CollectionTranslationKeySpecifier)[];
export type CollectionTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionUpdateKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionUpdateKeySpecifier)[];
export type CollectionUpdateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionUpdatedKeySpecifier = ('collection' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | CollectionUpdatedKeySpecifier)[];
export type CollectionUpdatedFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfigurationItemKeySpecifier = ('helpText' | 'label' | 'name' | 'type' | 'value' | ConfigurationItemKeySpecifier)[];
export type ConfigurationItemFieldPolicy = {
	helpText?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfirmAccountKeySpecifier = ('accountErrors' | 'errors' | 'user' | ConfirmAccountKeySpecifier)[];
export type ConfirmAccountFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfirmEmailChangeKeySpecifier = ('accountErrors' | 'errors' | 'user' | ConfirmEmailChangeKeySpecifier)[];
export type ConfirmEmailChangeFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CountryDisplayKeySpecifier = ('code' | 'country' | 'vat' | CountryDisplayKeySpecifier)[];
export type CountryDisplayFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	vat?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateTokenKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | CreateTokenKeySpecifier)[];
export type CreateTokenFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreditCardKeySpecifier = ('brand' | 'expMonth' | 'expYear' | 'firstDigits' | 'lastDigits' | CreditCardKeySpecifier)[];
export type CreditCardFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	expMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	expYear?: FieldPolicy<any> | FieldReadFunction<any>,
	firstDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	lastDigits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerBulkDeleteKeySpecifier = ('accountErrors' | 'count' | 'errors' | CustomerBulkDeleteKeySpecifier)[];
export type CustomerBulkDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerBulkResultKeySpecifier = ('customer' | 'errors' | CustomerBulkResultKeySpecifier)[];
export type CustomerBulkResultFieldPolicy = {
	customer?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerBulkUpdateKeySpecifier = ('count' | 'errors' | 'results' | CustomerBulkUpdateKeySpecifier)[];
export type CustomerBulkUpdateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerBulkUpdateErrorKeySpecifier = ('code' | 'message' | 'path' | CustomerBulkUpdateErrorKeySpecifier)[];
export type CustomerBulkUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerCreateKeySpecifier = ('accountErrors' | 'errors' | 'user' | CustomerCreateKeySpecifier)[];
export type CustomerCreateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | CustomerCreatedKeySpecifier)[];
export type CustomerCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | CustomerDeleteKeySpecifier)[];
export type CustomerDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerEventKeySpecifier = ('app' | 'count' | 'date' | 'id' | 'message' | 'order' | 'orderLine' | 'type' | 'user' | CustomerEventKeySpecifier)[];
export type CustomerEventFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | CustomerMetadataUpdatedKeySpecifier)[];
export type CustomerMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | CustomerUpdateKeySpecifier)[];
export type CustomerUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | CustomerUpdatedKeySpecifier)[];
export type CustomerUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeactivateAllUserTokensKeySpecifier = ('accountErrors' | 'errors' | DeactivateAllUserTokensKeySpecifier)[];
export type DeactivateAllUserTokensFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeleteMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | DeleteMetadataKeySpecifier)[];
export type DeleteMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeletePrivateMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | DeletePrivateMetadataKeySpecifier)[];
export type DeletePrivateMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentKeySpecifier = ('automaticFulfillment' | 'contentFile' | 'id' | 'maxDownloads' | 'metadata' | 'metafield' | 'metafields' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'productVariant' | 'urlValidDays' | 'urls' | 'useDefaultSettings' | DigitalContentKeySpecifier)[];
export type DigitalContentFieldPolicy = {
	automaticFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	contentFile?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maxDownloads?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	urlValidDays?: FieldPolicy<any> | FieldReadFunction<any>,
	urls?: FieldPolicy<any> | FieldReadFunction<any>,
	useDefaultSettings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | DigitalContentCountableConnectionKeySpecifier)[];
export type DigitalContentCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCountableEdgeKeySpecifier = ('cursor' | 'node' | DigitalContentCountableEdgeKeySpecifier)[];
export type DigitalContentCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCreateKeySpecifier = ('content' | 'errors' | 'productErrors' | 'variant' | DigitalContentCreateKeySpecifier)[];
export type DigitalContentCreateFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentDeleteKeySpecifier = ('errors' | 'productErrors' | 'variant' | DigitalContentDeleteKeySpecifier)[];
export type DigitalContentDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUpdateKeySpecifier = ('content' | 'errors' | 'productErrors' | 'variant' | DigitalContentUpdateKeySpecifier)[];
export type DigitalContentUpdateFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUrlKeySpecifier = ('content' | 'created' | 'downloadNum' | 'id' | 'token' | 'url' | DigitalContentUrlKeySpecifier)[];
export type DigitalContentUrlFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	downloadNum?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUrlCreateKeySpecifier = ('digitalContentUrl' | 'errors' | 'productErrors' | DigitalContentUrlCreateKeySpecifier)[];
export type DigitalContentUrlCreateFieldPolicy = {
	digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DiscountErrorKeySpecifier = ('channels' | 'code' | 'field' | 'message' | 'products' | 'voucherCodes' | DiscountErrorKeySpecifier)[];
export type DiscountErrorFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DomainKeySpecifier = ('host' | 'sslEnabled' | 'url' | DomainKeySpecifier)[];
export type DomainFieldPolicy = {
	host?: FieldPolicy<any> | FieldReadFunction<any>,
	sslEnabled?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderBulkDeleteKeySpecifier = ('count' | 'errors' | 'orderErrors' | DraftOrderBulkDeleteKeySpecifier)[];
export type DraftOrderBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCompleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderCompleteKeySpecifier)[];
export type DraftOrderCompleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCreateKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderCreateKeySpecifier)[];
export type DraftOrderCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | DraftOrderCreatedKeySpecifier)[];
export type DraftOrderCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderDeleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderDeleteKeySpecifier)[];
export type DraftOrderDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | DraftOrderDeletedKeySpecifier)[];
export type DraftOrderDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderLinesBulkDeleteKeySpecifier = ('count' | 'errors' | 'orderErrors' | DraftOrderLinesBulkDeleteKeySpecifier)[];
export type DraftOrderLinesBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderUpdateKeySpecifier)[];
export type DraftOrderUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | DraftOrderUpdatedKeySpecifier)[];
export type DraftOrderUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | EventKeySpecifier)[];
export type EventFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryKeySpecifier = ('attempts' | 'createdAt' | 'eventType' | 'id' | 'payload' | 'status' | EventDeliveryKeySpecifier)[];
export type EventDeliveryFieldPolicy = {
	attempts?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	payload?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryAttemptKeySpecifier = ('createdAt' | 'duration' | 'id' | 'requestHeaders' | 'response' | 'responseHeaders' | 'responseStatusCode' | 'status' | 'taskId' | EventDeliveryAttemptKeySpecifier)[];
export type EventDeliveryAttemptFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	duration?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	requestHeaders?: FieldPolicy<any> | FieldReadFunction<any>,
	response?: FieldPolicy<any> | FieldReadFunction<any>,
	responseHeaders?: FieldPolicy<any> | FieldReadFunction<any>,
	responseStatusCode?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	taskId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryAttemptCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | EventDeliveryAttemptCountableConnectionKeySpecifier)[];
export type EventDeliveryAttemptCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryAttemptCountableEdgeKeySpecifier = ('cursor' | 'node' | EventDeliveryAttemptCountableEdgeKeySpecifier)[];
export type EventDeliveryAttemptCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | EventDeliveryCountableConnectionKeySpecifier)[];
export type EventDeliveryCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryCountableEdgeKeySpecifier = ('cursor' | 'node' | EventDeliveryCountableEdgeKeySpecifier)[];
export type EventDeliveryCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventDeliveryRetryKeySpecifier = ('delivery' | 'errors' | EventDeliveryRetryKeySpecifier)[];
export type EventDeliveryRetryFieldPolicy = {
	delivery?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportErrorKeySpecifier = ('code' | 'field' | 'message' | ExportErrorKeySpecifier)[];
export type ExportErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportEventKeySpecifier = ('app' | 'date' | 'id' | 'message' | 'type' | 'user' | ExportEventKeySpecifier)[];
export type ExportEventFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileKeySpecifier = ('app' | 'createdAt' | 'events' | 'id' | 'message' | 'status' | 'updatedAt' | 'url' | 'user' | ExportFileKeySpecifier)[];
export type ExportFileFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ExportFileCountableConnectionKeySpecifier)[];
export type ExportFileCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileCountableEdgeKeySpecifier = ('cursor' | 'node' | ExportFileCountableEdgeKeySpecifier)[];
export type ExportFileCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportGiftCardsKeySpecifier = ('errors' | 'exportFile' | ExportGiftCardsKeySpecifier)[];
export type ExportGiftCardsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportProductsKeySpecifier = ('errors' | 'exportErrors' | 'exportFile' | ExportProductsKeySpecifier)[];
export type ExportProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	exportErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportVoucherCodesKeySpecifier = ('errors' | 'exportFile' | ExportVoucherCodesKeySpecifier)[];
export type ExportVoucherCodesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalAuthenticationKeySpecifier = ('id' | 'name' | ExternalAuthenticationKeySpecifier)[];
export type ExternalAuthenticationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalAuthenticationUrlKeySpecifier = ('accountErrors' | 'authenticationData' | 'errors' | ExternalAuthenticationUrlKeySpecifier)[];
export type ExternalAuthenticationUrlFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	authenticationData?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalLogoutKeySpecifier = ('accountErrors' | 'errors' | 'logoutData' | ExternalLogoutKeySpecifier)[];
export type ExternalLogoutFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	logoutData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalNotificationErrorKeySpecifier = ('code' | 'field' | 'message' | ExternalNotificationErrorKeySpecifier)[];
export type ExternalNotificationErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalNotificationTriggerKeySpecifier = ('errors' | ExternalNotificationTriggerKeySpecifier)[];
export type ExternalNotificationTriggerFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalObtainAccessTokensKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | ExternalObtainAccessTokensKeySpecifier)[];
export type ExternalObtainAccessTokensFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalRefreshKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | ExternalRefreshKeySpecifier)[];
export type ExternalRefreshFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalVerifyKeySpecifier = ('accountErrors' | 'errors' | 'isValid' | 'user' | 'verifyData' | ExternalVerifyKeySpecifier)[];
export type ExternalVerifyFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	isValid?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('contentType' | 'url' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	contentType?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileUploadKeySpecifier = ('errors' | 'uploadErrors' | 'uploadedFile' | FileUploadKeySpecifier)[];
export type FileUploadFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadedFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentKeySpecifier = ('created' | 'fulfillmentOrder' | 'id' | 'lines' | 'metadata' | 'metafield' | 'metafields' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'shippingRefundedAmount' | 'status' | 'statusDisplay' | 'totalRefundedAmount' | 'trackingNumber' | 'warehouse' | FulfillmentKeySpecifier)[];
export type FulfillmentFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillmentOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingRefundedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	totalRefundedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	trackingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentApproveKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentApproveKeySpecifier)[];
export type FulfillmentApproveFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentApprovedKeySpecifier = ('fulfillment' | 'issuedAt' | 'issuingPrincipal' | 'notifyCustomer' | 'order' | 'recipient' | 'version' | FulfillmentApprovedKeySpecifier)[];
export type FulfillmentApprovedFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	notifyCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentCancelKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentCancelKeySpecifier)[];
export type FulfillmentCancelFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentCanceledKeySpecifier = ('fulfillment' | 'issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | FulfillmentCanceledKeySpecifier)[];
export type FulfillmentCanceledFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentCreatedKeySpecifier = ('fulfillment' | 'issuedAt' | 'issuingPrincipal' | 'notifyCustomer' | 'order' | 'recipient' | 'version' | FulfillmentCreatedKeySpecifier)[];
export type FulfillmentCreatedFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	notifyCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentLineKeySpecifier = ('id' | 'orderLine' | 'quantity' | FulfillmentLineKeySpecifier)[];
export type FulfillmentLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentMetadataUpdatedKeySpecifier = ('fulfillment' | 'issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | FulfillmentMetadataUpdatedKeySpecifier)[];
export type FulfillmentMetadataUpdatedFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentRefundProductsKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentRefundProductsKeySpecifier)[];
export type FulfillmentRefundProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentReturnProductsKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'replaceFulfillment' | 'replaceOrder' | 'returnFulfillment' | FulfillmentReturnProductsKeySpecifier)[];
export type FulfillmentReturnProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	replaceFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	replaceOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	returnFulfillment?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentTrackingNumberUpdatedKeySpecifier = ('fulfillment' | 'issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | FulfillmentTrackingNumberUpdatedKeySpecifier)[];
export type FulfillmentTrackingNumberUpdatedFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentUpdateTrackingKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentUpdateTrackingKeySpecifier)[];
export type FulfillmentUpdateTrackingFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GatewayConfigLineKeySpecifier = ('field' | 'value' | GatewayConfigLineKeySpecifier)[];
export type GatewayConfigLineFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardKeySpecifier = ('app' | 'boughtInChannel' | 'code' | 'created' | 'createdBy' | 'createdByEmail' | 'currentBalance' | 'displayCode' | 'endDate' | 'events' | 'expiryDate' | 'id' | 'initialBalance' | 'isActive' | 'last4CodeChars' | 'lastUsedOn' | 'metadata' | 'metafield' | 'metafields' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'product' | 'startDate' | 'tags' | 'usedBy' | 'usedByEmail' | 'user' | GiftCardKeySpecifier)[];
export type GiftCardFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	boughtInChannel?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	createdByEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	currentBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	displayCode?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	expiryDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	initialBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	last4CodeChars?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUsedOn?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	usedBy?: FieldPolicy<any> | FieldReadFunction<any>,
	usedByEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardActivateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardActivateKeySpecifier)[];
export type GiftCardActivateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardAddNoteKeySpecifier = ('errors' | 'event' | 'giftCard' | GiftCardAddNoteKeySpecifier)[];
export type GiftCardAddNoteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardBulkActivateKeySpecifier = ('count' | 'errors' | GiftCardBulkActivateKeySpecifier)[];
export type GiftCardBulkActivateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardBulkCreateKeySpecifier = ('count' | 'errors' | 'giftCards' | GiftCardBulkCreateKeySpecifier)[];
export type GiftCardBulkCreateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardBulkDeactivateKeySpecifier = ('count' | 'errors' | GiftCardBulkDeactivateKeySpecifier)[];
export type GiftCardBulkDeactivateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardBulkDeleteKeySpecifier = ('count' | 'errors' | GiftCardBulkDeleteKeySpecifier)[];
export type GiftCardBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | GiftCardCountableConnectionKeySpecifier)[];
export type GiftCardCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCountableEdgeKeySpecifier = ('cursor' | 'node' | GiftCardCountableEdgeKeySpecifier)[];
export type GiftCardCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCreateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardCreateKeySpecifier)[];
export type GiftCardCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCreatedKeySpecifier = ('giftCard' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | GiftCardCreatedKeySpecifier)[];
export type GiftCardCreatedFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardDeactivateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardDeactivateKeySpecifier)[];
export type GiftCardDeactivateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardDeleteKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardDeleteKeySpecifier)[];
export type GiftCardDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardDeletedKeySpecifier = ('giftCard' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | GiftCardDeletedKeySpecifier)[];
export type GiftCardDeletedFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardErrorKeySpecifier = ('code' | 'field' | 'message' | 'tags' | GiftCardErrorKeySpecifier)[];
export type GiftCardErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardEventKeySpecifier = ('app' | 'balance' | 'date' | 'email' | 'expiryDate' | 'id' | 'message' | 'oldExpiryDate' | 'oldTags' | 'orderId' | 'orderNumber' | 'tags' | 'type' | 'user' | GiftCardEventKeySpecifier)[];
export type GiftCardEventFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	balance?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	expiryDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	oldExpiryDate?: FieldPolicy<any> | FieldReadFunction<any>,
	oldTags?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardEventBalanceKeySpecifier = ('currentBalance' | 'initialBalance' | 'oldCurrentBalance' | 'oldInitialBalance' | GiftCardEventBalanceKeySpecifier)[];
export type GiftCardEventBalanceFieldPolicy = {
	currentBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	initialBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	oldCurrentBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	oldInitialBalance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardExportCompletedKeySpecifier = ('export' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | GiftCardExportCompletedKeySpecifier)[];
export type GiftCardExportCompletedFieldPolicy = {
	export?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardMetadataUpdatedKeySpecifier = ('giftCard' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | GiftCardMetadataUpdatedKeySpecifier)[];
export type GiftCardMetadataUpdatedFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardResendKeySpecifier = ('errors' | 'giftCard' | GiftCardResendKeySpecifier)[];
export type GiftCardResendFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardSentKeySpecifier = ('channel' | 'giftCard' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'sentToEmail' | 'version' | GiftCardSentKeySpecifier)[];
export type GiftCardSentFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sentToEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardSettingsKeySpecifier = ('expiryPeriod' | 'expiryType' | GiftCardSettingsKeySpecifier)[];
export type GiftCardSettingsFieldPolicy = {
	expiryPeriod?: FieldPolicy<any> | FieldReadFunction<any>,
	expiryType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardSettingsErrorKeySpecifier = ('code' | 'field' | 'message' | GiftCardSettingsErrorKeySpecifier)[];
export type GiftCardSettingsErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardSettingsUpdateKeySpecifier = ('errors' | 'giftCardSettings' | GiftCardSettingsUpdateKeySpecifier)[];
export type GiftCardSettingsUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardSettings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardStatusChangedKeySpecifier = ('giftCard' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | GiftCardStatusChangedKeySpecifier)[];
export type GiftCardStatusChangedFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardTagKeySpecifier = ('id' | 'name' | GiftCardTagKeySpecifier)[];
export type GiftCardTagFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardTagCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | GiftCardTagCountableConnectionKeySpecifier)[];
export type GiftCardTagCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardTagCountableEdgeKeySpecifier = ('cursor' | 'node' | GiftCardTagCountableEdgeKeySpecifier)[];
export type GiftCardTagCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardUpdateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardUpdateKeySpecifier)[];
export type GiftCardUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardUpdatedKeySpecifier = ('giftCard' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | GiftCardUpdatedKeySpecifier)[];
export type GiftCardUpdatedFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupKeySpecifier = ('accessibleChannels' | 'id' | 'name' | 'permissions' | 'restrictedAccessToChannels' | 'userCanManage' | 'users' | GroupKeySpecifier)[];
export type GroupFieldPolicy = {
	accessibleChannels?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	restrictedAccessToChannels?: FieldPolicy<any> | FieldReadFunction<any>,
	userCanManage?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | GroupCountableConnectionKeySpecifier)[];
export type GroupCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupCountableEdgeKeySpecifier = ('cursor' | 'node' | GroupCountableEdgeKeySpecifier)[];
export type GroupCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ImageKeySpecifier = ('alt' | 'url' | ImageKeySpecifier)[];
export type ImageFieldPolicy = {
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceKeySpecifier = ('createdAt' | 'externalUrl' | 'id' | 'message' | 'metadata' | 'metafield' | 'metafields' | 'number' | 'order' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'status' | 'updatedAt' | 'url' | InvoiceKeySpecifier)[];
export type InvoiceFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	externalUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceCreateKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceCreateKeySpecifier)[];
export type InvoiceCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceDeleteKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceDeleteKeySpecifier)[];
export type InvoiceDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceDeletedKeySpecifier = ('invoice' | 'issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | InvoiceDeletedKeySpecifier)[];
export type InvoiceDeletedFieldPolicy = {
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceErrorKeySpecifier = ('code' | 'field' | 'message' | InvoiceErrorKeySpecifier)[];
export type InvoiceErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | 'order' | InvoiceRequestKeySpecifier)[];
export type InvoiceRequestFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestDeleteKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceRequestDeleteKeySpecifier)[];
export type InvoiceRequestDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestedKeySpecifier = ('invoice' | 'issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | InvoiceRequestedKeySpecifier)[];
export type InvoiceRequestedFieldPolicy = {
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceSendNotificationKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceSendNotificationKeySpecifier)[];
export type InvoiceSendNotificationFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceSentKeySpecifier = ('invoice' | 'issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | InvoiceSentKeySpecifier)[];
export type InvoiceSentFieldPolicy = {
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceUpdateKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceUpdateKeySpecifier)[];
export type InvoiceUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JobKeySpecifier = ('createdAt' | 'message' | 'status' | 'updatedAt' | JobKeySpecifier)[];
export type JobFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LanguageDisplayKeySpecifier = ('code' | 'language' | LanguageDisplayKeySpecifier)[];
export type LanguageDisplayFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitInfoKeySpecifier = ('allowedUsage' | 'currentUsage' | LimitInfoKeySpecifier)[];
export type LimitInfoFieldPolicy = {
	allowedUsage?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUsage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitsKeySpecifier = ('channels' | 'orders' | 'productVariants' | 'staffUsers' | 'warehouses' | LimitsKeySpecifier)[];
export type LimitsFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ListStoredPaymentMethodsKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | ListStoredPaymentMethodsKeySpecifier)[];
export type ListStoredPaymentMethodsFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ManifestKeySpecifier = ('about' | 'appUrl' | 'audience' | 'author' | 'brand' | 'configurationUrl' | 'dataPrivacy' | 'dataPrivacyUrl' | 'extensions' | 'homepageUrl' | 'identifier' | 'name' | 'permissions' | 'requiredSaleorVersion' | 'supportUrl' | 'tokenTargetUrl' | 'version' | 'webhooks' | ManifestKeySpecifier)[];
export type ManifestFieldPolicy = {
	about?: FieldPolicy<any> | FieldReadFunction<any>,
	appUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	audience?: FieldPolicy<any> | FieldReadFunction<any>,
	author?: FieldPolicy<any> | FieldReadFunction<any>,
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	extensions?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	identifier?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	requiredSaleorVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	supportUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenTargetUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	webhooks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MarginKeySpecifier = ('start' | 'stop' | MarginKeySpecifier)[];
export type MarginFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuKeySpecifier = ('id' | 'items' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'slug' | MenuKeySpecifier)[];
export type MenuFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuBulkDeleteKeySpecifier = ('count' | 'errors' | 'menuErrors' | MenuBulkDeleteKeySpecifier)[];
export type MenuBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | MenuCountableConnectionKeySpecifier)[];
export type MenuCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCountableEdgeKeySpecifier = ('cursor' | 'node' | MenuCountableEdgeKeySpecifier)[];
export type MenuCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCreateKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuCreateKeySpecifier)[];
export type MenuCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'menu' | 'recipient' | 'version' | MenuCreatedKeySpecifier)[];
export type MenuCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuDeleteKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuDeleteKeySpecifier)[];
export type MenuDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'menu' | 'recipient' | 'version' | MenuDeletedKeySpecifier)[];
export type MenuDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuErrorKeySpecifier = ('code' | 'field' | 'message' | MenuErrorKeySpecifier)[];
export type MenuErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemKeySpecifier = ('category' | 'children' | 'collection' | 'id' | 'level' | 'menu' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'page' | 'parent' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'translation' | 'url' | MenuItemKeySpecifier)[];
export type MenuItemFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemBulkDeleteKeySpecifier = ('count' | 'errors' | 'menuErrors' | MenuItemBulkDeleteKeySpecifier)[];
export type MenuItemBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | MenuItemCountableConnectionKeySpecifier)[];
export type MenuItemCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCountableEdgeKeySpecifier = ('cursor' | 'node' | MenuItemCountableEdgeKeySpecifier)[];
export type MenuItemCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCreateKeySpecifier = ('errors' | 'menuErrors' | 'menuItem' | MenuItemCreateKeySpecifier)[];
export type MenuItemCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'menuItem' | 'recipient' | 'version' | MenuItemCreatedKeySpecifier)[];
export type MenuItemCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemDeleteKeySpecifier = ('errors' | 'menuErrors' | 'menuItem' | MenuItemDeleteKeySpecifier)[];
export type MenuItemDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'menuItem' | 'recipient' | 'version' | MenuItemDeletedKeySpecifier)[];
export type MenuItemDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemMoveKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuItemMoveKeySpecifier)[];
export type MenuItemMoveFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslatableContentKeySpecifier = ('id' | 'menuItem' | 'menuItemId' | 'name' | 'translation' | MenuItemTranslatableContentKeySpecifier)[];
export type MenuItemTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemId?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslateKeySpecifier = ('errors' | 'menuItem' | 'translationErrors' | MenuItemTranslateKeySpecifier)[];
export type MenuItemTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslationKeySpecifier = ('id' | 'language' | 'name' | 'translatableContent' | MenuItemTranslationKeySpecifier)[];
export type MenuItemTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemUpdateKeySpecifier = ('errors' | 'menuErrors' | 'menuItem' | MenuItemUpdateKeySpecifier)[];
export type MenuItemUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'menuItem' | 'recipient' | 'version' | MenuItemUpdatedKeySpecifier)[];
export type MenuItemUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuUpdateKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuUpdateKeySpecifier)[];
export type MenuUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'menu' | 'recipient' | 'version' | MenuUpdatedKeySpecifier)[];
export type MenuUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetadataErrorKeySpecifier = ('code' | 'field' | 'message' | MetadataErrorKeySpecifier)[];
export type MetadataErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetadataItemKeySpecifier = ('key' | 'value' | MetadataItemKeySpecifier)[];
export type MetadataItemFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MoneyKeySpecifier = ('amount' | 'currency' | 'fractionDigits' | 'fractionalAmount' | MoneyKeySpecifier)[];
export type MoneyFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	fractionDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	fractionalAmount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MoneyRangeKeySpecifier = ('start' | 'stop' | MoneyRangeKeySpecifier)[];
export type MoneyRangeFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('accountAddressCreate' | 'accountAddressDelete' | 'accountAddressUpdate' | 'accountDelete' | 'accountRegister' | 'accountRequestDeletion' | 'accountSetDefaultAddress' | 'accountUpdate' | 'addressCreate' | 'addressDelete' | 'addressSetDefault' | 'addressUpdate' | 'appActivate' | 'appCreate' | 'appDeactivate' | 'appDelete' | 'appDeleteFailedInstallation' | 'appFetchManifest' | 'appInstall' | 'appReenableSyncWebhooks' | 'appRetryInstall' | 'appTokenCreate' | 'appTokenDelete' | 'appTokenVerify' | 'appUpdate' | 'assignNavigation' | 'assignWarehouseShippingZone' | 'attributeBulkCreate' | 'attributeBulkDelete' | 'attributeBulkTranslate' | 'attributeBulkUpdate' | 'attributeCreate' | 'attributeDelete' | 'attributeReorderValues' | 'attributeTranslate' | 'attributeUpdate' | 'attributeValueBulkDelete' | 'attributeValueBulkTranslate' | 'attributeValueCreate' | 'attributeValueDelete' | 'attributeValueTranslate' | 'attributeValueUpdate' | 'categoryBulkDelete' | 'categoryCreate' | 'categoryDelete' | 'categoryTranslate' | 'categoryUpdate' | 'channelActivate' | 'channelCreate' | 'channelDeactivate' | 'channelDelete' | 'channelReorderWarehouses' | 'channelUpdate' | 'checkoutAddPromoCode' | 'checkoutBillingAddressUpdate' | 'checkoutComplete' | 'checkoutCreate' | 'checkoutCreateFromOrder' | 'checkoutCustomerAttach' | 'checkoutCustomerDetach' | 'checkoutCustomerNoteUpdate' | 'checkoutDeliveryMethodUpdate' | 'checkoutEmailUpdate' | 'checkoutLanguageCodeUpdate' | 'checkoutLineDelete' | 'checkoutLinesAdd' | 'checkoutLinesDelete' | 'checkoutLinesUpdate' | 'checkoutPaymentCreate' | 'checkoutRemovePromoCode' | 'checkoutShippingAddressUpdate' | 'checkoutShippingMethodUpdate' | 'collectionAddProducts' | 'collectionBulkDelete' | 'collectionChannelListingUpdate' | 'collectionCreate' | 'collectionDelete' | 'collectionRemoveProducts' | 'collectionReorderProducts' | 'collectionTranslate' | 'collectionUpdate' | 'confirmAccount' | 'confirmEmailChange' | 'createWarehouse' | 'customerBulkDelete' | 'customerBulkUpdate' | 'customerCreate' | 'customerDelete' | 'customerUpdate' | 'deleteMetadata' | 'deletePrivateMetadata' | 'deleteWarehouse' | 'digitalContentCreate' | 'digitalContentDelete' | 'digitalContentUpdate' | 'digitalContentUrlCreate' | 'draftOrderBulkDelete' | 'draftOrderComplete' | 'draftOrderCreate' | 'draftOrderDelete' | 'draftOrderLinesBulkDelete' | 'draftOrderUpdate' | 'eventDeliveryRetry' | 'exportGiftCards' | 'exportProducts' | 'exportVoucherCodes' | 'externalAuthenticationUrl' | 'externalLogout' | 'externalNotificationTrigger' | 'externalObtainAccessTokens' | 'externalRefresh' | 'externalVerify' | 'fileUpload' | 'giftCardActivate' | 'giftCardAddNote' | 'giftCardBulkActivate' | 'giftCardBulkCreate' | 'giftCardBulkDeactivate' | 'giftCardBulkDelete' | 'giftCardCreate' | 'giftCardDeactivate' | 'giftCardDelete' | 'giftCardResend' | 'giftCardSettingsUpdate' | 'giftCardUpdate' | 'invoiceCreate' | 'invoiceDelete' | 'invoiceRequest' | 'invoiceRequestDelete' | 'invoiceSendNotification' | 'invoiceUpdate' | 'menuBulkDelete' | 'menuCreate' | 'menuDelete' | 'menuItemBulkDelete' | 'menuItemCreate' | 'menuItemDelete' | 'menuItemMove' | 'menuItemTranslate' | 'menuItemUpdate' | 'menuUpdate' | 'orderAddNote' | 'orderBulkCancel' | 'orderBulkCreate' | 'orderCancel' | 'orderCapture' | 'orderConfirm' | 'orderCreateFromCheckout' | 'orderDiscountAdd' | 'orderDiscountDelete' | 'orderDiscountUpdate' | 'orderFulfill' | 'orderFulfillmentApprove' | 'orderFulfillmentCancel' | 'orderFulfillmentRefundProducts' | 'orderFulfillmentReturnProducts' | 'orderFulfillmentUpdateTracking' | 'orderGrantRefundCreate' | 'orderGrantRefundUpdate' | 'orderLineDelete' | 'orderLineDiscountRemove' | 'orderLineDiscountUpdate' | 'orderLineUpdate' | 'orderLinesCreate' | 'orderMarkAsPaid' | 'orderNoteAdd' | 'orderNoteUpdate' | 'orderRefund' | 'orderSettingsUpdate' | 'orderUpdate' | 'orderUpdateShipping' | 'orderVoid' | 'pageAttributeAssign' | 'pageAttributeUnassign' | 'pageBulkDelete' | 'pageBulkPublish' | 'pageCreate' | 'pageDelete' | 'pageReorderAttributeValues' | 'pageTranslate' | 'pageTypeBulkDelete' | 'pageTypeCreate' | 'pageTypeDelete' | 'pageTypeReorderAttributes' | 'pageTypeUpdate' | 'pageUpdate' | 'passwordChange' | 'paymentCapture' | 'paymentCheckBalance' | 'paymentGatewayInitialize' | 'paymentGatewayInitializeTokenization' | 'paymentInitialize' | 'paymentMethodInitializeTokenization' | 'paymentMethodProcessTokenization' | 'paymentRefund' | 'paymentVoid' | 'permissionGroupCreate' | 'permissionGroupDelete' | 'permissionGroupUpdate' | 'pluginUpdate' | 'productAttributeAssign' | 'productAttributeAssignmentUpdate' | 'productAttributeUnassign' | 'productBulkCreate' | 'productBulkDelete' | 'productBulkTranslate' | 'productChannelListingUpdate' | 'productCreate' | 'productDelete' | 'productMediaBulkDelete' | 'productMediaCreate' | 'productMediaDelete' | 'productMediaReorder' | 'productMediaUpdate' | 'productReorderAttributeValues' | 'productTranslate' | 'productTypeBulkDelete' | 'productTypeCreate' | 'productTypeDelete' | 'productTypeReorderAttributes' | 'productTypeUpdate' | 'productUpdate' | 'productVariantBulkCreate' | 'productVariantBulkDelete' | 'productVariantBulkTranslate' | 'productVariantBulkUpdate' | 'productVariantChannelListingUpdate' | 'productVariantCreate' | 'productVariantDelete' | 'productVariantPreorderDeactivate' | 'productVariantReorder' | 'productVariantReorderAttributeValues' | 'productVariantSetDefault' | 'productVariantStocksCreate' | 'productVariantStocksDelete' | 'productVariantStocksUpdate' | 'productVariantTranslate' | 'productVariantUpdate' | 'promotionBulkDelete' | 'promotionCreate' | 'promotionDelete' | 'promotionRuleCreate' | 'promotionRuleDelete' | 'promotionRuleTranslate' | 'promotionRuleUpdate' | 'promotionTranslate' | 'promotionUpdate' | 'refundReasonReferenceClear' | 'refundSettingsUpdate' | 'requestEmailChange' | 'requestPasswordReset' | 'saleBulkDelete' | 'saleCataloguesAdd' | 'saleCataloguesRemove' | 'saleChannelListingUpdate' | 'saleCreate' | 'saleDelete' | 'saleTranslate' | 'saleUpdate' | 'sendConfirmationEmail' | 'setPassword' | 'shippingMethodChannelListingUpdate' | 'shippingPriceBulkDelete' | 'shippingPriceCreate' | 'shippingPriceDelete' | 'shippingPriceExcludeProducts' | 'shippingPriceRemoveProductFromExclude' | 'shippingPriceTranslate' | 'shippingPriceUpdate' | 'shippingZoneBulkDelete' | 'shippingZoneCreate' | 'shippingZoneDelete' | 'shippingZoneUpdate' | 'shopAddressUpdate' | 'shopDomainUpdate' | 'shopFetchTaxRates' | 'shopSettingsTranslate' | 'shopSettingsUpdate' | 'staffBulkDelete' | 'staffCreate' | 'staffDelete' | 'staffNotificationRecipientCreate' | 'staffNotificationRecipientDelete' | 'staffNotificationRecipientUpdate' | 'staffUpdate' | 'stockBulkUpdate' | 'storedPaymentMethodRequestDelete' | 'taxClassCreate' | 'taxClassDelete' | 'taxClassUpdate' | 'taxConfigurationUpdate' | 'taxCountryConfigurationDelete' | 'taxCountryConfigurationUpdate' | 'taxExemptionManage' | 'tokenCreate' | 'tokenRefresh' | 'tokenVerify' | 'tokensDeactivateAll' | 'transactionCreate' | 'transactionEventReport' | 'transactionInitialize' | 'transactionProcess' | 'transactionRequestAction' | 'transactionRequestRefundForGrantedRefund' | 'transactionUpdate' | 'unassignWarehouseShippingZone' | 'updateMetadata' | 'updatePrivateMetadata' | 'updateWarehouse' | 'userAvatarDelete' | 'userAvatarUpdate' | 'userBulkSetActive' | 'variantMediaAssign' | 'variantMediaUnassign' | 'voucherBulkDelete' | 'voucherCataloguesAdd' | 'voucherCataloguesRemove' | 'voucherChannelListingUpdate' | 'voucherCodeBulkDelete' | 'voucherCreate' | 'voucherDelete' | 'voucherTranslate' | 'voucherUpdate' | 'webhookCreate' | 'webhookDelete' | 'webhookDryRun' | 'webhookTrigger' | 'webhookUpdate' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	accountAddressCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	accountRegister?: FieldPolicy<any> | FieldReadFunction<any>,
	accountRequestDeletion?: FieldPolicy<any> | FieldReadFunction<any>,
	accountSetDefaultAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	accountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	addressCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	addressDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	addressSetDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	addressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	appActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	appCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	appDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	appDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	appDeleteFailedInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	appFetchManifest?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstall?: FieldPolicy<any> | FieldReadFunction<any>,
	appReenableSyncWebhooks?: FieldPolicy<any> | FieldReadFunction<any>,
	appRetryInstall?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	appUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	assignNavigation?: FieldPolicy<any> | FieldReadFunction<any>,
	assignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeBulkTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeBulkUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeReorderValues?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueBulkTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	channelReorderWarehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	channelUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutAddPromoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutBillingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutComplete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCreateFromOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerAttach?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerDetach?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerNoteUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutDeliveryMethodUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutEmailUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLanguageCodeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLineDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutPaymentCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutRemovePromoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutShippingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutShippingMethodUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionAddProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionRemoveProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionReorderProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmEmailChange?: FieldPolicy<any> | FieldReadFunction<any>,
	createWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	customerBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	customerBulkUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	customerCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	customerDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	customerUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	deletePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrlCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderComplete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderLinesBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	eventDeliveryRetry?: FieldPolicy<any> | FieldReadFunction<any>,
	exportGiftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	exportProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	exportVoucherCodes?: FieldPolicy<any> | FieldReadFunction<any>,
	externalAuthenticationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	externalLogout?: FieldPolicy<any> | FieldReadFunction<any>,
	externalNotificationTrigger?: FieldPolicy<any> | FieldReadFunction<any>,
	externalObtainAccessTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	externalRefresh?: FieldPolicy<any> | FieldReadFunction<any>,
	externalVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	fileUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardAddNote?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardBulkActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardBulkDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardResend?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceRequest?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceRequestDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceSendNotification?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemMove?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderAddNote?: FieldPolicy<any> | FieldReadFunction<any>,
	orderBulkCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCapture?: FieldPolicy<any> | FieldReadFunction<any>,
	orderConfirm?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCreateFromCheckout?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfill?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentApprove?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentRefundProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentReturnProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentUpdateTracking?: FieldPolicy<any> | FieldReadFunction<any>,
	orderGrantRefundCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderGrantRefundUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDiscountRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLinesCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderMarkAsPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	orderNoteAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	orderNoteUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdateShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	orderVoid?: FieldPolicy<any> | FieldReadFunction<any>,
	pageAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	pageAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	pageBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageBulkPublish?: FieldPolicy<any> | FieldReadFunction<any>,
	pageCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	passwordChange?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentCapture?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentCheckBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentGatewayInitialize?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentGatewayInitializeTokenization?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentInitialize?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodInitializeTokenization?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodProcessTokenization?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentVoid?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pluginUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeAssignmentUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	productBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productBulkTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaReorder?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	productTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantPreorderDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantReorder?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantSetDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRuleCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRuleDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRuleTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRuleUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	refundReasonReferenceClear?: FieldPolicy<any> | FieldReadFunction<any>,
	refundSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	requestEmailChange?: FieldPolicy<any> | FieldReadFunction<any>,
	requestPasswordReset?: FieldPolicy<any> | FieldReadFunction<any>,
	saleBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	saleChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	saleTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	sendConfirmationEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	setPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceExcludeProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceRemoveProductFromExclude?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopDomainUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopFetchTaxRates?: FieldPolicy<any> | FieldReadFunction<any>,
	shopSettingsTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	stockBulkUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	storedPaymentMethodRequestDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	taxConfigurationUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCountryConfigurationDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCountryConfigurationUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	taxExemptionManage?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenRefresh?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	tokensDeactivateAll?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionEventReport?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionInitialize?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionProcess?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionRequestAction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionRequestRefundForGrantedRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	unassignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	updateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	updateWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	userAvatarDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	userAvatarUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	userBulkSetActive?: FieldPolicy<any> | FieldReadFunction<any>,
	variantMediaAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	variantMediaUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCodeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookDryRun?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookTrigger?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookUpdate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NewTabTargetOptionsKeySpecifier = ('method' | NewTabTargetOptionsKeySpecifier)[];
export type NewTabTargetOptionsFieldPolicy = {
	method?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ObjectWithAttributesKeySpecifier = ('assignedAttribute' | 'assignedAttributes' | ObjectWithAttributesKeySpecifier)[];
export type ObjectWithAttributesFieldPolicy = {
	assignedAttribute?: FieldPolicy<any> | FieldReadFunction<any>,
	assignedAttributes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ObjectWithMetadataKeySpecifier = ('metadata' | 'metafield' | 'metafields' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | ObjectWithMetadataKeySpecifier)[];
export type ObjectWithMetadataFieldPolicy = {
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderKeySpecifier = ('actions' | 'authorizeStatus' | 'availableCollectionPoints' | 'availableShippingMethods' | 'billingAddress' | 'canFinalize' | 'channel' | 'chargeStatus' | 'checkoutId' | 'collectionPointName' | 'created' | 'customerNote' | 'deliveryMethod' | 'discount' | 'discountName' | 'discounts' | 'displayGrossPrices' | 'errors' | 'events' | 'externalReference' | 'fulfillments' | 'giftCards' | 'grantedRefunds' | 'id' | 'invoices' | 'isPaid' | 'isShippingRequired' | 'languageCode' | 'languageCodeEnum' | 'lines' | 'metadata' | 'metafield' | 'metafields' | 'number' | 'origin' | 'original' | 'paymentStatus' | 'paymentStatusDisplay' | 'payments' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'redirectUrl' | 'shippingAddress' | 'shippingMethod' | 'shippingMethodName' | 'shippingMethods' | 'shippingPrice' | 'shippingTaxClass' | 'shippingTaxClassMetadata' | 'shippingTaxClassName' | 'shippingTaxClassPrivateMetadata' | 'shippingTaxRate' | 'status' | 'statusDisplay' | 'subtotal' | 'taxExemption' | 'token' | 'total' | 'totalAuthorizePending' | 'totalAuthorized' | 'totalBalance' | 'totalCancelPending' | 'totalCanceled' | 'totalCaptured' | 'totalChargePending' | 'totalCharged' | 'totalGrantedRefund' | 'totalRefundPending' | 'totalRefunded' | 'totalRemainingGrant' | 'trackingClientId' | 'transactions' | 'translatedDiscountName' | 'undiscountedShippingPrice' | 'undiscountedTotal' | 'updatedAt' | 'user' | 'userEmail' | 'voucher' | 'voucherCode' | 'weight' | OrderKeySpecifier)[];
export type OrderFieldPolicy = {
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	availableCollectionPoints?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	billingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	canFinalize?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutId?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionPointName?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	customerNote?: FieldPolicy<any> | FieldReadFunction<any>,
	deliveryMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountName?: FieldPolicy<any> | FieldReadFunction<any>,
	discounts?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillments?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	grantedRefunds?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invoices?: FieldPolicy<any> | FieldReadFunction<any>,
	isPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCodeEnum?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	origin?: FieldPolicy<any> | FieldReadFunction<any>,
	original?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentStatusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodName?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxClass?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxClassMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxClassName?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxClassPrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxRate?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	subtotal?: FieldPolicy<any> | FieldReadFunction<any>,
	taxExemption?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAuthorizePending?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAuthorized?: FieldPolicy<any> | FieldReadFunction<any>,
	totalBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCancelPending?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCanceled?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCaptured?: FieldPolicy<any> | FieldReadFunction<any>,
	totalChargePending?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCharged?: FieldPolicy<any> | FieldReadFunction<any>,
	totalGrantedRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	totalRefundPending?: FieldPolicy<any> | FieldReadFunction<any>,
	totalRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	totalRemainingGrant?: FieldPolicy<any> | FieldReadFunction<any>,
	trackingClientId?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedShippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	userEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCode?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderAddNoteKeySpecifier = ('errors' | 'event' | 'order' | 'orderErrors' | OrderAddNoteKeySpecifier)[];
export type OrderAddNoteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCancelKeySpecifier = ('count' | 'errors' | 'orderErrors' | OrderBulkCancelKeySpecifier)[];
export type OrderBulkCancelFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCreateKeySpecifier = ('count' | 'errors' | 'results' | OrderBulkCreateKeySpecifier)[];
export type OrderBulkCreateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCreateErrorKeySpecifier = ('code' | 'message' | 'path' | OrderBulkCreateErrorKeySpecifier)[];
export type OrderBulkCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCreateResultKeySpecifier = ('errors' | 'order' | OrderBulkCreateResultKeySpecifier)[];
export type OrderBulkCreateResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'orders' | 'recipient' | 'version' | OrderBulkCreatedKeySpecifier)[];
export type OrderBulkCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCancelKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderCancelKeySpecifier)[];
export type OrderCancelFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCancelledKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderCancelledKeySpecifier)[];
export type OrderCancelledFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCaptureKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderCaptureKeySpecifier)[];
export type OrderCaptureFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderConfirmKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderConfirmKeySpecifier)[];
export type OrderConfirmFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderConfirmedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderConfirmedKeySpecifier)[];
export type OrderConfirmedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | OrderCountableConnectionKeySpecifier)[];
export type OrderCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCountableEdgeKeySpecifier = ('cursor' | 'node' | OrderCountableEdgeKeySpecifier)[];
export type OrderCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCreateFromCheckoutKeySpecifier = ('errors' | 'order' | OrderCreateFromCheckoutKeySpecifier)[];
export type OrderCreateFromCheckoutFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCreateFromCheckoutErrorKeySpecifier = ('code' | 'field' | 'lines' | 'message' | 'variants' | OrderCreateFromCheckoutErrorKeySpecifier)[];
export type OrderCreateFromCheckoutErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderCreatedKeySpecifier)[];
export type OrderCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountKeySpecifier = ('amount' | 'id' | 'name' | 'reason' | 'total' | 'translatedName' | 'type' | 'value' | 'valueType' | OrderDiscountKeySpecifier)[];
export type OrderDiscountFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedName?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	valueType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountAddKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderDiscountAddKeySpecifier)[];
export type OrderDiscountAddFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountDeleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderDiscountDeleteKeySpecifier)[];
export type OrderDiscountDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderDiscountUpdateKeySpecifier)[];
export type OrderDiscountUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'message' | 'orderLines' | 'variants' | 'warehouse' | OrderErrorKeySpecifier)[];
export type OrderErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLines?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventKeySpecifier = ('amount' | 'app' | 'composedId' | 'date' | 'discount' | 'email' | 'emailType' | 'fulfilledItems' | 'id' | 'invoiceNumber' | 'lines' | 'message' | 'orderNumber' | 'oversoldItems' | 'paymentGateway' | 'paymentId' | 'quantity' | 'reference' | 'related' | 'relatedOrder' | 'shippingCostsIncluded' | 'transactionReference' | 'type' | 'user' | 'warehouse' | OrderEventKeySpecifier)[];
export type OrderEventFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	composedId?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	emailType?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfilledItems?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	orderNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	oversoldItems?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentGateway?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentId?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	reference?: FieldPolicy<any> | FieldReadFunction<any>,
	related?: FieldPolicy<any> | FieldReadFunction<any>,
	relatedOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingCostsIncluded?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionReference?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | OrderEventCountableConnectionKeySpecifier)[];
export type OrderEventCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventCountableEdgeKeySpecifier = ('cursor' | 'node' | OrderEventCountableEdgeKeySpecifier)[];
export type OrderEventCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventDiscountObjectKeySpecifier = ('amount' | 'oldAmount' | 'oldValue' | 'oldValueType' | 'reason' | 'value' | 'valueType' | OrderEventDiscountObjectKeySpecifier)[];
export type OrderEventDiscountObjectFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	oldAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	oldValue?: FieldPolicy<any> | FieldReadFunction<any>,
	oldValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	valueType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventOrderLineObjectKeySpecifier = ('discount' | 'itemName' | 'orderLine' | 'quantity' | OrderEventOrderLineObjectKeySpecifier)[];
export type OrderEventOrderLineObjectFieldPolicy = {
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	itemName?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderExpiredKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderExpiredKeySpecifier)[];
export type OrderExpiredFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFilterShippingMethodsKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'shippingMethods' | 'version' | OrderFilterShippingMethodsKeySpecifier)[];
export type OrderFilterShippingMethodsFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFulfillKeySpecifier = ('errors' | 'fulfillments' | 'order' | 'orderErrors' | OrderFulfillKeySpecifier)[];
export type OrderFulfillFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillments?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFulfilledKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderFulfilledKeySpecifier)[];
export type OrderFulfilledFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFullyPaidKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderFullyPaidKeySpecifier)[];
export type OrderFullyPaidFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFullyRefundedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderFullyRefundedKeySpecifier)[];
export type OrderFullyRefundedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantRefundCreateKeySpecifier = ('errors' | 'grantedRefund' | 'order' | OrderGrantRefundCreateKeySpecifier)[];
export type OrderGrantRefundCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	grantedRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantRefundCreateErrorKeySpecifier = ('code' | 'field' | 'lines' | 'message' | OrderGrantRefundCreateErrorKeySpecifier)[];
export type OrderGrantRefundCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantRefundCreateLineErrorKeySpecifier = ('code' | 'field' | 'lineId' | 'message' | OrderGrantRefundCreateLineErrorKeySpecifier)[];
export type OrderGrantRefundCreateLineErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	lineId?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantRefundUpdateKeySpecifier = ('errors' | 'grantedRefund' | 'order' | OrderGrantRefundUpdateKeySpecifier)[];
export type OrderGrantRefundUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	grantedRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantRefundUpdateErrorKeySpecifier = ('addLines' | 'code' | 'field' | 'message' | 'removeLines' | OrderGrantRefundUpdateErrorKeySpecifier)[];
export type OrderGrantRefundUpdateErrorFieldPolicy = {
	addLines?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	removeLines?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantRefundUpdateLineErrorKeySpecifier = ('code' | 'field' | 'lineId' | 'message' | OrderGrantRefundUpdateLineErrorKeySpecifier)[];
export type OrderGrantRefundUpdateLineErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	lineId?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantedRefundKeySpecifier = ('amount' | 'app' | 'createdAt' | 'id' | 'lines' | 'reason' | 'reasonReference' | 'shippingCostsIncluded' | 'status' | 'transaction' | 'transactionEvents' | 'updatedAt' | 'user' | OrderGrantedRefundKeySpecifier)[];
export type OrderGrantedRefundFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	reasonReference?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingCostsIncluded?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderGrantedRefundLineKeySpecifier = ('id' | 'orderLine' | 'quantity' | 'reason' | OrderGrantedRefundLineKeySpecifier)[];
export type OrderGrantedRefundLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineKeySpecifier = ('allocations' | 'digitalContentUrl' | 'discounts' | 'id' | 'isGift' | 'isPriceOverridden' | 'isShippingRequired' | 'metadata' | 'metafield' | 'metafields' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'productName' | 'productSku' | 'productVariantId' | 'quantity' | 'quantityFulfilled' | 'quantityToFulfill' | 'saleId' | 'taxClass' | 'taxClassMetadata' | 'taxClassName' | 'taxClassPrivateMetadata' | 'taxRate' | 'thumbnail' | 'totalPrice' | 'translatedProductName' | 'translatedVariantName' | 'undiscountedTotalPrice' | 'undiscountedUnitPrice' | 'unitDiscount' | 'unitDiscountReason' | 'unitDiscountType' | 'unitDiscountValue' | 'unitPrice' | 'variant' | 'variantName' | 'voucherCode' | OrderLineKeySpecifier)[];
export type OrderLineFieldPolicy = {
	allocations?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	discounts?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isGift?: FieldPolicy<any> | FieldReadFunction<any>,
	isPriceOverridden?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	productName?: FieldPolicy<any> | FieldReadFunction<any>,
	productSku?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantId?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityFulfilled?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityToFulfill?: FieldPolicy<any> | FieldReadFunction<any>,
	saleId?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassName?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassPrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	taxRate?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedProductName?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedVariantName?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedTotalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedUnitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscount?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountReason?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountType?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	unitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	variantName?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDeleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineDeleteKeySpecifier)[];
export type OrderLineDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountKeySpecifier = ('id' | 'name' | 'reason' | 'total' | 'translatedName' | 'type' | 'unit' | 'value' | 'valueType' | OrderLineDiscountKeySpecifier)[];
export type OrderLineDiscountFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedName?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	valueType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountRemoveKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineDiscountRemoveKeySpecifier)[];
export type OrderLineDiscountRemoveFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineDiscountUpdateKeySpecifier)[];
export type OrderLineDiscountUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineUpdateKeySpecifier)[];
export type OrderLineUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLinesCreateKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLines' | OrderLinesCreateKeySpecifier)[];
export type OrderLinesCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLines?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderMarkAsPaidKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderMarkAsPaidKeySpecifier)[];
export type OrderMarkAsPaidFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderMetadataUpdatedKeySpecifier)[];
export type OrderMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderNoteAddKeySpecifier = ('errors' | 'event' | 'order' | OrderNoteAddKeySpecifier)[];
export type OrderNoteAddFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderNoteAddErrorKeySpecifier = ('code' | 'field' | 'message' | OrderNoteAddErrorKeySpecifier)[];
export type OrderNoteAddErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderNoteUpdateKeySpecifier = ('errors' | 'event' | 'order' | OrderNoteUpdateKeySpecifier)[];
export type OrderNoteUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderNoteUpdateErrorKeySpecifier = ('code' | 'field' | 'message' | OrderNoteUpdateErrorKeySpecifier)[];
export type OrderNoteUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderPaidKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderPaidKeySpecifier)[];
export type OrderPaidFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderRefundKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderRefundKeySpecifier)[];
export type OrderRefundFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderRefundedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderRefundedKeySpecifier)[];
export type OrderRefundedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsKeySpecifier = ('allowUnpaidOrders' | 'automaticallyConfirmAllNewOrders' | 'automaticallyFulfillNonShippableGiftCard' | 'deleteExpiredOrdersAfter' | 'draftOrderLinePriceFreezePeriod' | 'expireOrdersAfter' | 'includeDraftOrderInVoucherUsage' | 'markAsPaidStrategy' | 'useLegacyLineDiscountPropagation' | OrderSettingsKeySpecifier)[];
export type OrderSettingsFieldPolicy = {
	allowUnpaidOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	automaticallyConfirmAllNewOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	automaticallyFulfillNonShippableGiftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteExpiredOrdersAfter?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderLinePriceFreezePeriod?: FieldPolicy<any> | FieldReadFunction<any>,
	expireOrdersAfter?: FieldPolicy<any> | FieldReadFunction<any>,
	includeDraftOrderInVoucherUsage?: FieldPolicy<any> | FieldReadFunction<any>,
	markAsPaidStrategy?: FieldPolicy<any> | FieldReadFunction<any>,
	useLegacyLineDiscountPropagation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsErrorKeySpecifier = ('code' | 'field' | 'message' | OrderSettingsErrorKeySpecifier)[];
export type OrderSettingsErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsUpdateKeySpecifier = ('errors' | 'orderSettings' | 'orderSettingsErrors' | OrderSettingsUpdateKeySpecifier)[];
export type OrderSettingsUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettingsErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderUpdateKeySpecifier)[];
export type OrderUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdateShippingKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderUpdateShippingKeySpecifier)[];
export type OrderUpdateShippingFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'order' | 'recipient' | 'version' | OrderUpdatedKeySpecifier)[];
export type OrderUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderVoidKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderVoidKeySpecifier)[];
export type OrderVoidFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OtherPaymentMethodDetailsKeySpecifier = ('name' | OtherPaymentMethodDetailsKeySpecifier)[];
export type OtherPaymentMethodDetailsFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageKeySpecifier = ('assignedAttribute' | 'assignedAttributes' | 'attribute' | 'attributes' | 'content' | 'contentJson' | 'created' | 'id' | 'isPublished' | 'metadata' | 'metafield' | 'metafields' | 'pageType' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'publicationDate' | 'publishedAt' | 'seoDescription' | 'seoTitle' | 'slug' | 'title' | 'translation' | PageKeySpecifier)[];
export type PageFieldPolicy = {
	assignedAttribute?: FieldPolicy<any> | FieldReadFunction<any>,
	assignedAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	publishedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageAttributeAssignKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageAttributeAssignKeySpecifier)[];
export type PageAttributeAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageAttributeUnassignKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageAttributeUnassignKeySpecifier)[];
export type PageAttributeUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageBulkDeleteKeySpecifier = ('count' | 'errors' | 'pageErrors' | PageBulkDeleteKeySpecifier)[];
export type PageBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageBulkPublishKeySpecifier = ('count' | 'errors' | 'pageErrors' | PageBulkPublishKeySpecifier)[];
export type PageBulkPublishFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PageCountableConnectionKeySpecifier)[];
export type PageCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCountableEdgeKeySpecifier = ('cursor' | 'node' | PageCountableEdgeKeySpecifier)[];
export type PageCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCreateKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageCreateKeySpecifier)[];
export type PageCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'page' | 'recipient' | 'version' | PageCreatedKeySpecifier)[];
export type PageCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageDeleteKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageDeleteKeySpecifier)[];
export type PageDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'page' | 'recipient' | 'version' | PageDeletedKeySpecifier)[];
export type PageDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageErrorKeySpecifier = ('attributes' | 'code' | 'field' | 'message' | 'values' | PageErrorKeySpecifier)[];
export type PageErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageReorderAttributeValuesKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageReorderAttributeValuesKeySpecifier)[];
export type PageReorderAttributeValuesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslatableContentKeySpecifier = ('attributeValues' | 'content' | 'contentJson' | 'id' | 'page' | 'pageId' | 'seoDescription' | 'seoTitle' | 'slug' | 'title' | 'translation' | PageTranslatableContentKeySpecifier)[];
export type PageTranslatableContentFieldPolicy = {
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageId?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslateKeySpecifier = ('errors' | 'page' | 'translationErrors' | PageTranslateKeySpecifier)[];
export type PageTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslationKeySpecifier = ('content' | 'contentJson' | 'id' | 'language' | 'seoDescription' | 'seoTitle' | 'slug' | 'title' | 'translatableContent' | PageTranslationKeySpecifier)[];
export type PageTranslationFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeKeySpecifier = ('attributes' | 'availableAttributes' | 'hasPages' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'slug' | PageTypeKeySpecifier)[];
export type PageTypeFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPages?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeBulkDeleteKeySpecifier = ('count' | 'errors' | 'pageErrors' | PageTypeBulkDeleteKeySpecifier)[];
export type PageTypeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PageTypeCountableConnectionKeySpecifier)[];
export type PageTypeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCountableEdgeKeySpecifier = ('cursor' | 'node' | PageTypeCountableEdgeKeySpecifier)[];
export type PageTypeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCreateKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeCreateKeySpecifier)[];
export type PageTypeCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'pageType' | 'recipient' | 'version' | PageTypeCreatedKeySpecifier)[];
export type PageTypeCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeDeleteKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeDeleteKeySpecifier)[];
export type PageTypeDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'pageType' | 'recipient' | 'version' | PageTypeDeletedKeySpecifier)[];
export type PageTypeDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeReorderAttributesKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeReorderAttributesKeySpecifier)[];
export type PageTypeReorderAttributesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeUpdateKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeUpdateKeySpecifier)[];
export type PageTypeUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'pageType' | 'recipient' | 'version' | PageTypeUpdatedKeySpecifier)[];
export type PageTypeUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageUpdateKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageUpdateKeySpecifier)[];
export type PageUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'page' | 'recipient' | 'version' | PageUpdatedKeySpecifier)[];
export type PageUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PasswordChangeKeySpecifier = ('accountErrors' | 'errors' | 'user' | PasswordChangeKeySpecifier)[];
export type PasswordChangeFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentKeySpecifier = ('actions' | 'availableCaptureAmount' | 'availableRefundAmount' | 'capturedAmount' | 'chargeStatus' | 'checkout' | 'created' | 'creditCard' | 'customerIpAddress' | 'gateway' | 'id' | 'isActive' | 'metadata' | 'metafield' | 'metafields' | 'modified' | 'order' | 'partial' | 'paymentMethodType' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'pspReference' | 'token' | 'total' | 'transactions' | PaymentKeySpecifier)[];
export type PaymentFieldPolicy = {
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	availableCaptureAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	availableRefundAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	capturedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	creditCard?: FieldPolicy<any> | FieldReadFunction<any>,
	customerIpAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	modified?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	partial?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodType?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	pspReference?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentAuthorizeKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'payment' | 'recipient' | 'version' | PaymentAuthorizeKeySpecifier)[];
export type PaymentAuthorizeFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCaptureKeySpecifier = ('errors' | 'payment' | 'paymentErrors' | PaymentCaptureKeySpecifier)[];
export type PaymentCaptureFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCaptureEventKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'payment' | 'recipient' | 'version' | PaymentCaptureEventKeySpecifier)[];
export type PaymentCaptureEventFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCheckBalanceKeySpecifier = ('data' | 'errors' | 'paymentErrors' | PaymentCheckBalanceKeySpecifier)[];
export type PaymentCheckBalanceFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentConfirmEventKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'payment' | 'recipient' | 'version' | PaymentConfirmEventKeySpecifier)[];
export type PaymentConfirmEventFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PaymentCountableConnectionKeySpecifier)[];
export type PaymentCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCountableEdgeKeySpecifier = ('cursor' | 'node' | PaymentCountableEdgeKeySpecifier)[];
export type PaymentCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentErrorKeySpecifier = ('code' | 'field' | 'message' | 'variants' | PaymentErrorKeySpecifier)[];
export type PaymentErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayKeySpecifier = ('config' | 'currencies' | 'id' | 'name' | PaymentGatewayKeySpecifier)[];
export type PaymentGatewayFieldPolicy = {
	config?: FieldPolicy<any> | FieldReadFunction<any>,
	currencies?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayConfigKeySpecifier = ('data' | 'errors' | 'id' | PaymentGatewayConfigKeySpecifier)[];
export type PaymentGatewayConfigFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayConfigErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentGatewayConfigErrorKeySpecifier)[];
export type PaymentGatewayConfigErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayInitializeKeySpecifier = ('errors' | 'gatewayConfigs' | PaymentGatewayInitializeKeySpecifier)[];
export type PaymentGatewayInitializeFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	gatewayConfigs?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayInitializeErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentGatewayInitializeErrorKeySpecifier)[];
export type PaymentGatewayInitializeErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayInitializeSessionKeySpecifier = ('amount' | 'data' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'sourceObject' | 'version' | PaymentGatewayInitializeSessionKeySpecifier)[];
export type PaymentGatewayInitializeSessionFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sourceObject?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayInitializeTokenizationKeySpecifier = ('data' | 'errors' | 'result' | PaymentGatewayInitializeTokenizationKeySpecifier)[];
export type PaymentGatewayInitializeTokenizationFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayInitializeTokenizationErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentGatewayInitializeTokenizationErrorKeySpecifier)[];
export type PaymentGatewayInitializeTokenizationErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayInitializeTokenizationSessionKeySpecifier = ('channel' | 'data' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | PaymentGatewayInitializeTokenizationSessionKeySpecifier)[];
export type PaymentGatewayInitializeTokenizationSessionFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentInitializeKeySpecifier = ('errors' | 'initializedPayment' | 'paymentErrors' | PaymentInitializeKeySpecifier)[];
export type PaymentInitializeFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	initializedPayment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentInitializedKeySpecifier = ('data' | 'gateway' | 'name' | PaymentInitializedKeySpecifier)[];
export type PaymentInitializedFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentListGatewaysKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | PaymentListGatewaysKeySpecifier)[];
export type PaymentListGatewaysFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodDetailsKeySpecifier = ('name' | PaymentMethodDetailsKeySpecifier)[];
export type PaymentMethodDetailsFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodInitializeTokenizationKeySpecifier = ('data' | 'errors' | 'id' | 'result' | PaymentMethodInitializeTokenizationKeySpecifier)[];
export type PaymentMethodInitializeTokenizationFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodInitializeTokenizationErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentMethodInitializeTokenizationErrorKeySpecifier)[];
export type PaymentMethodInitializeTokenizationErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodInitializeTokenizationSessionKeySpecifier = ('channel' | 'data' | 'issuedAt' | 'issuingPrincipal' | 'paymentFlowToSupport' | 'recipient' | 'user' | 'version' | PaymentMethodInitializeTokenizationSessionKeySpecifier)[];
export type PaymentMethodInitializeTokenizationSessionFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentFlowToSupport?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodProcessTokenizationKeySpecifier = ('data' | 'errors' | 'id' | 'result' | PaymentMethodProcessTokenizationKeySpecifier)[];
export type PaymentMethodProcessTokenizationFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodProcessTokenizationErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentMethodProcessTokenizationErrorKeySpecifier)[];
export type PaymentMethodProcessTokenizationErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodProcessTokenizationSessionKeySpecifier = ('channel' | 'data' | 'id' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | PaymentMethodProcessTokenizationSessionKeySpecifier)[];
export type PaymentMethodProcessTokenizationSessionFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentMethodRequestDeleteErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentMethodRequestDeleteErrorKeySpecifier)[];
export type PaymentMethodRequestDeleteErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentProcessEventKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'payment' | 'recipient' | 'version' | PaymentProcessEventKeySpecifier)[];
export type PaymentProcessEventFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentRefundKeySpecifier = ('errors' | 'payment' | 'paymentErrors' | PaymentRefundKeySpecifier)[];
export type PaymentRefundFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentRefundEventKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'payment' | 'recipient' | 'version' | PaymentRefundEventKeySpecifier)[];
export type PaymentRefundEventFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentSettingsKeySpecifier = ('checkoutReleaseFundsCutOffDate' | 'checkoutTtlBeforeReleasingFunds' | 'defaultTransactionFlowStrategy' | 'releaseFundsForExpiredCheckouts' | PaymentSettingsKeySpecifier)[];
export type PaymentSettingsFieldPolicy = {
	checkoutReleaseFundsCutOffDate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutTtlBeforeReleasingFunds?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultTransactionFlowStrategy?: FieldPolicy<any> | FieldReadFunction<any>,
	releaseFundsForExpiredCheckouts?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentSourceKeySpecifier = ('creditCardInfo' | 'gateway' | 'metadata' | 'paymentMethodId' | PaymentSourceKeySpecifier)[];
export type PaymentSourceFieldPolicy = {
	creditCardInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentVoidKeySpecifier = ('errors' | 'payment' | 'paymentErrors' | PaymentVoidKeySpecifier)[];
export type PaymentVoidFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentVoidEventKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'payment' | 'recipient' | 'version' | PaymentVoidEventKeySpecifier)[];
export type PaymentVoidEventFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionKeySpecifier = ('code' | 'name' | PermissionKeySpecifier)[];
export type PermissionFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupCreateKeySpecifier = ('errors' | 'group' | 'permissionGroupErrors' | PermissionGroupCreateKeySpecifier)[];
export type PermissionGroupCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'permissionGroup' | 'recipient' | 'version' | PermissionGroupCreatedKeySpecifier)[];
export type PermissionGroupCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupDeleteKeySpecifier = ('errors' | 'group' | 'permissionGroupErrors' | PermissionGroupDeleteKeySpecifier)[];
export type PermissionGroupDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'permissionGroup' | 'recipient' | 'version' | PermissionGroupDeletedKeySpecifier)[];
export type PermissionGroupDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupErrorKeySpecifier = ('channels' | 'code' | 'field' | 'message' | 'permissions' | 'users' | PermissionGroupErrorKeySpecifier)[];
export type PermissionGroupErrorFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupUpdateKeySpecifier = ('errors' | 'group' | 'permissionGroupErrors' | PermissionGroupUpdateKeySpecifier)[];
export type PermissionGroupUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'permissionGroup' | 'recipient' | 'version' | PermissionGroupUpdatedKeySpecifier)[];
export type PermissionGroupUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginKeySpecifier = ('channelConfigurations' | 'description' | 'globalConfiguration' | 'id' | 'name' | PluginKeySpecifier)[];
export type PluginFieldPolicy = {
	channelConfigurations?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	globalConfiguration?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginConfigurationKeySpecifier = ('active' | 'channel' | 'configuration' | PluginConfigurationKeySpecifier)[];
export type PluginConfigurationFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	configuration?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PluginCountableConnectionKeySpecifier)[];
export type PluginCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginCountableEdgeKeySpecifier = ('cursor' | 'node' | PluginCountableEdgeKeySpecifier)[];
export type PluginCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginErrorKeySpecifier = ('code' | 'field' | 'message' | PluginErrorKeySpecifier)[];
export type PluginErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginUpdateKeySpecifier = ('errors' | 'plugin' | 'pluginsErrors' | PluginUpdateKeySpecifier)[];
export type PluginUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	pluginsErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PreorderDataKeySpecifier = ('endDate' | 'globalSoldUnits' | 'globalThreshold' | PreorderDataKeySpecifier)[];
export type PreorderDataFieldPolicy = {
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	globalSoldUnits?: FieldPolicy<any> | FieldReadFunction<any>,
	globalThreshold?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PreorderThresholdKeySpecifier = ('quantity' | 'soldUnits' | PreorderThresholdKeySpecifier)[];
export type PreorderThresholdFieldPolicy = {
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	soldUnits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductKeySpecifier = ('assignedAttribute' | 'assignedAttributes' | 'attribute' | 'attributes' | 'availableForPurchase' | 'availableForPurchaseAt' | 'category' | 'channel' | 'channelListings' | 'chargeTaxes' | 'collections' | 'created' | 'defaultVariant' | 'description' | 'descriptionJson' | 'externalReference' | 'id' | 'imageById' | 'images' | 'isAvailable' | 'isAvailableForPurchase' | 'media' | 'mediaById' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'pricing' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'productType' | 'productVariants' | 'rating' | 'seoDescription' | 'seoTitle' | 'slug' | 'taxClass' | 'taxType' | 'thumbnail' | 'translation' | 'updatedAt' | 'variant' | 'variants' | 'weight' | ProductKeySpecifier)[];
export type ProductFieldPolicy = {
	assignedAttribute?: FieldPolicy<any> | FieldReadFunction<any>,
	assignedAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	availableForPurchaseAt?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imageById?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	mediaById?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	rating?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>,
	taxType?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeAssignKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductAttributeAssignKeySpecifier)[];
export type ProductAttributeAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeAssignmentUpdateKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductAttributeAssignmentUpdateKeySpecifier)[];
export type ProductAttributeAssignmentUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeUnassignKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductAttributeUnassignKeySpecifier)[];
export type ProductAttributeUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkCreateKeySpecifier = ('count' | 'errors' | 'results' | ProductBulkCreateKeySpecifier)[];
export type ProductBulkCreateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkCreateErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'message' | 'path' | 'values' | 'warehouses' | ProductBulkCreateErrorKeySpecifier)[];
export type ProductBulkCreateErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductBulkDeleteKeySpecifier)[];
export type ProductBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkResultKeySpecifier = ('errors' | 'product' | ProductBulkResultKeySpecifier)[];
export type ProductBulkResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkTranslateKeySpecifier = ('count' | 'errors' | 'results' | ProductBulkTranslateKeySpecifier)[];
export type ProductBulkTranslateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkTranslateErrorKeySpecifier = ('code' | 'message' | 'path' | ProductBulkTranslateErrorKeySpecifier)[];
export type ProductBulkTranslateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkTranslateResultKeySpecifier = ('errors' | 'translation' | ProductBulkTranslateResultKeySpecifier)[];
export type ProductBulkTranslateResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingKeySpecifier = ('availableForPurchase' | 'availableForPurchaseAt' | 'channel' | 'discountedPrice' | 'id' | 'isAvailableForPurchase' | 'isPublished' | 'margin' | 'pricing' | 'publicationDate' | 'publishedAt' | 'purchaseCost' | 'visibleInListings' | ProductChannelListingKeySpecifier)[];
export type ProductChannelListingFieldPolicy = {
	availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	availableForPurchaseAt?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	discountedPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	publishedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	purchaseCost?: FieldPolicy<any> | FieldReadFunction<any>,
	visibleInListings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'field' | 'message' | 'values' | 'variants' | ProductChannelListingErrorKeySpecifier)[];
export type ProductChannelListingErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingUpdateKeySpecifier = ('errors' | 'product' | 'productChannelListingErrors' | ProductChannelListingUpdateKeySpecifier)[];
export type ProductChannelListingUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProductCountableConnectionKeySpecifier)[];
export type ProductCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCountableEdgeKeySpecifier = ('cursor' | 'node' | ProductCountableEdgeKeySpecifier)[];
export type ProductCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCreateKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductCreateKeySpecifier)[];
export type ProductCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCreatedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'product' | 'recipient' | 'version' | ProductCreatedKeySpecifier)[];
export type ProductCreatedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductDeleteKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductDeleteKeySpecifier)[];
export type ProductDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductDeletedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'product' | 'recipient' | 'version' | ProductDeletedKeySpecifier)[];
export type ProductDeletedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductErrorKeySpecifier = ('attributes' | 'code' | 'field' | 'message' | 'values' | ProductErrorKeySpecifier)[];
export type ProductErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductExportCompletedKeySpecifier = ('export' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | ProductExportCompletedKeySpecifier)[];
export type ProductExportCompletedFieldPolicy = {
	export?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductImageKeySpecifier = ('alt' | 'id' | 'sortOrder' | 'url' | ProductImageKeySpecifier)[];
export type ProductImageFieldPolicy = {
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sortOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaKeySpecifier = ('alt' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'oembedData' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'productId' | 'sortOrder' | 'type' | 'url' | ProductMediaKeySpecifier)[];
export type ProductMediaFieldPolicy = {
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	oembedData?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	productId?: FieldPolicy<any> | FieldReadFunction<any>,
	sortOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductMediaBulkDeleteKeySpecifier)[];
export type ProductMediaBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaCreateKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaCreateKeySpecifier)[];
export type ProductMediaCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productMedia' | 'recipient' | 'version' | ProductMediaCreatedKeySpecifier)[];
export type ProductMediaCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productMedia?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaDeleteKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaDeleteKeySpecifier)[];
export type ProductMediaDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productMedia' | 'recipient' | 'version' | ProductMediaDeletedKeySpecifier)[];
export type ProductMediaDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productMedia?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaReorderKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaReorderKeySpecifier)[];
export type ProductMediaReorderFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaUpdateKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaUpdateKeySpecifier)[];
export type ProductMediaUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productMedia' | 'recipient' | 'version' | ProductMediaUpdatedKeySpecifier)[];
export type ProductMediaUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productMedia?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMetadataUpdatedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'product' | 'recipient' | 'version' | ProductMetadataUpdatedKeySpecifier)[];
export type ProductMetadataUpdatedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductPricingInfoKeySpecifier = ('discount' | 'discountLocalCurrency' | 'discountPrior' | 'displayGrossPrices' | 'onSale' | 'priceRange' | 'priceRangeLocalCurrency' | 'priceRangePrior' | 'priceRangeUndiscounted' | ProductPricingInfoKeySpecifier)[];
export type ProductPricingInfoFieldPolicy = {
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountPrior?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	onSale?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRange?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangeLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangePrior?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangeUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductReorderAttributeValuesKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductReorderAttributeValuesKeySpecifier)[];
export type ProductReorderAttributeValuesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslatableContentKeySpecifier = ('attributeValues' | 'description' | 'descriptionJson' | 'id' | 'name' | 'product' | 'productId' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | ProductTranslatableContentKeySpecifier)[];
export type ProductTranslatableContentFieldPolicy = {
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productId?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslateKeySpecifier = ('errors' | 'product' | 'translationErrors' | ProductTranslateKeySpecifier)[];
export type ProductTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslationKeySpecifier = ('description' | 'descriptionJson' | 'id' | 'language' | 'name' | 'seoDescription' | 'seoTitle' | 'slug' | 'translatableContent' | ProductTranslationKeySpecifier)[];
export type ProductTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeKeySpecifier = ('assignedVariantAttributes' | 'availableAttributes' | 'hasVariants' | 'id' | 'isDigital' | 'isShippingRequired' | 'kind' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'productAttributes' | 'products' | 'slug' | 'taxClass' | 'taxType' | 'variantAttributes' | 'weight' | ProductTypeKeySpecifier)[];
export type ProductTypeFieldPolicy = {
	assignedVariantAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	hasVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isDigital?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	kind?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>,
	taxType?: FieldPolicy<any> | FieldReadFunction<any>,
	variantAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductTypeBulkDeleteKeySpecifier)[];
export type ProductTypeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProductTypeCountableConnectionKeySpecifier)[];
export type ProductTypeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCountableEdgeKeySpecifier = ('cursor' | 'node' | ProductTypeCountableEdgeKeySpecifier)[];
export type ProductTypeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCreateKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeCreateKeySpecifier)[];
export type ProductTypeCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeDeleteKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeDeleteKeySpecifier)[];
export type ProductTypeDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeReorderAttributesKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeReorderAttributesKeySpecifier)[];
export type ProductTypeReorderAttributesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeUpdateKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeUpdateKeySpecifier)[];
export type ProductTypeUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductUpdateKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductUpdateKeySpecifier)[];
export type ProductUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductUpdatedKeySpecifier = ('category' | 'issuedAt' | 'issuingPrincipal' | 'product' | 'recipient' | 'version' | ProductUpdatedKeySpecifier)[];
export type ProductUpdatedFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantKeySpecifier = ('assignedAttribute' | 'assignedAttributes' | 'attributes' | 'breakingField' | 'channel' | 'channelListings' | 'created' | 'digitalContent' | 'externalReference' | 'id' | 'images' | 'margin' | 'media' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'preorder' | 'pricing' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'product' | 'quantityAvailable' | 'quantityLimitPerCustomer' | 'quantityOrdered' | 'revenue' | 'sku' | 'stocks' | 'trackInventory' | 'translation' | 'updatedAt' | 'weight' | ProductVariantKeySpecifier)[];
export type ProductVariantFieldPolicy = {
	assignedAttribute?: FieldPolicy<any> | FieldReadFunction<any>,
	assignedAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	breakingField?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContent?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	preorder?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityAvailable?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityLimitPerCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityOrdered?: FieldPolicy<any> | FieldReadFunction<any>,
	revenue?: FieldPolicy<any> | FieldReadFunction<any>,
	sku?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	trackInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBackInStockKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | 'warehouse' | ProductVariantBackInStockKeySpecifier)[];
export type ProductVariantBackInStockFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkCreateKeySpecifier = ('bulkProductErrors' | 'count' | 'errors' | 'productVariants' | 'results' | ProductVariantBulkCreateKeySpecifier)[];
export type ProductVariantBulkCreateFieldPolicy = {
	bulkProductErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductVariantBulkDeleteKeySpecifier)[];
export type ProductVariantBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkErrorKeySpecifier = ('attributes' | 'channelListings' | 'channels' | 'code' | 'field' | 'message' | 'path' | 'stocks' | 'values' | 'warehouses' | ProductVariantBulkErrorKeySpecifier)[];
export type ProductVariantBulkErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkResultKeySpecifier = ('errors' | 'productVariant' | ProductVariantBulkResultKeySpecifier)[];
export type ProductVariantBulkResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkTranslateKeySpecifier = ('count' | 'errors' | 'results' | ProductVariantBulkTranslateKeySpecifier)[];
export type ProductVariantBulkTranslateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkTranslateErrorKeySpecifier = ('code' | 'message' | 'path' | ProductVariantBulkTranslateErrorKeySpecifier)[];
export type ProductVariantBulkTranslateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkTranslateResultKeySpecifier = ('errors' | 'translation' | ProductVariantBulkTranslateResultKeySpecifier)[];
export type ProductVariantBulkTranslateResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkUpdateKeySpecifier = ('count' | 'errors' | 'results' | ProductVariantBulkUpdateKeySpecifier)[];
export type ProductVariantBulkUpdateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantChannelListingKeySpecifier = ('channel' | 'costPrice' | 'id' | 'margin' | 'preorderThreshold' | 'price' | 'priorPrice' | ProductVariantChannelListingKeySpecifier)[];
export type ProductVariantChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	costPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	preorderThreshold?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	priorPrice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantChannelListingUpdateKeySpecifier = ('errors' | 'productChannelListingErrors' | 'variant' | ProductVariantChannelListingUpdateKeySpecifier)[];
export type ProductVariantChannelListingUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProductVariantCountableConnectionKeySpecifier)[];
export type ProductVariantCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCountableEdgeKeySpecifier = ('cursor' | 'node' | ProductVariantCountableEdgeKeySpecifier)[];
export type ProductVariantCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCreateKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantCreateKeySpecifier)[];
export type ProductVariantCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | ProductVariantCreatedKeySpecifier)[];
export type ProductVariantCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantDeleteKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantDeleteKeySpecifier)[];
export type ProductVariantDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | ProductVariantDeletedKeySpecifier)[];
export type ProductVariantDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | ProductVariantMetadataUpdatedKeySpecifier)[];
export type ProductVariantMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantOutOfStockKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | 'warehouse' | ProductVariantOutOfStockKeySpecifier)[];
export type ProductVariantOutOfStockFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantPreorderDeactivateKeySpecifier = ('errors' | 'productVariant' | ProductVariantPreorderDeactivateKeySpecifier)[];
export type ProductVariantPreorderDeactivateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantReorderKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductVariantReorderKeySpecifier)[];
export type ProductVariantReorderFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantReorderAttributeValuesKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantReorderAttributeValuesKeySpecifier)[];
export type ProductVariantReorderAttributeValuesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantSetDefaultKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductVariantSetDefaultKeySpecifier)[];
export type ProductVariantSetDefaultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStockUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | 'warehouse' | ProductVariantStockUpdatedKeySpecifier)[];
export type ProductVariantStockUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksCreateKeySpecifier = ('bulkStockErrors' | 'errors' | 'productVariant' | ProductVariantStocksCreateKeySpecifier)[];
export type ProductVariantStocksCreateFieldPolicy = {
	bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksDeleteKeySpecifier = ('errors' | 'productVariant' | 'stockErrors' | ProductVariantStocksDeleteKeySpecifier)[];
export type ProductVariantStocksDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	stockErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksUpdateKeySpecifier = ('bulkStockErrors' | 'errors' | 'productVariant' | ProductVariantStocksUpdateKeySpecifier)[];
export type ProductVariantStocksUpdateFieldPolicy = {
	bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslatableContentKeySpecifier = ('attributeValues' | 'id' | 'name' | 'productVariant' | 'productVariantId' | 'translation' | ProductVariantTranslatableContentKeySpecifier)[];
export type ProductVariantTranslatableContentFieldPolicy = {
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantId?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslateKeySpecifier = ('errors' | 'productVariant' | 'translationErrors' | ProductVariantTranslateKeySpecifier)[];
export type ProductVariantTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslationKeySpecifier = ('id' | 'language' | 'name' | 'translatableContent' | ProductVariantTranslationKeySpecifier)[];
export type ProductVariantTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantUpdateKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantUpdateKeySpecifier)[];
export type ProductVariantUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'productVariant' | 'recipient' | 'version' | ProductVariantUpdatedKeySpecifier)[];
export type ProductVariantUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionKeySpecifier = ('createdAt' | 'description' | 'endDate' | 'events' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'rules' | 'startDate' | 'translation' | 'type' | 'updatedAt' | PromotionKeySpecifier)[];
export type PromotionFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	rules?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionBulkDeleteKeySpecifier = ('count' | 'errors' | PromotionBulkDeleteKeySpecifier)[];
export type PromotionBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PromotionCountableConnectionKeySpecifier)[];
export type PromotionCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionCountableEdgeKeySpecifier = ('cursor' | 'node' | PromotionCountableEdgeKeySpecifier)[];
export type PromotionCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionCreateKeySpecifier = ('errors' | 'promotion' | PromotionCreateKeySpecifier)[];
export type PromotionCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionCreateErrorKeySpecifier = ('code' | 'field' | 'giftsLimit' | 'giftsLimitExceedBy' | 'index' | 'message' | 'rulesLimit' | 'rulesLimitExceedBy' | PromotionCreateErrorKeySpecifier)[];
export type PromotionCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimitExceedBy?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	rulesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	rulesLimitExceedBy?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotion' | 'recipient' | 'version' | PromotionCreatedKeySpecifier)[];
export type PromotionCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionCreatedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'type' | PromotionCreatedEventKeySpecifier)[];
export type PromotionCreatedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionDeleteKeySpecifier = ('errors' | 'promotion' | PromotionDeleteKeySpecifier)[];
export type PromotionDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionDeleteErrorKeySpecifier = ('code' | 'field' | 'message' | PromotionDeleteErrorKeySpecifier)[];
export type PromotionDeleteErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotion' | 'recipient' | 'version' | PromotionDeletedKeySpecifier)[];
export type PromotionDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionEndedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotion' | 'recipient' | 'version' | PromotionEndedKeySpecifier)[];
export type PromotionEndedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionEndedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'type' | PromotionEndedEventKeySpecifier)[];
export type PromotionEndedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionEventInterfaceKeySpecifier = ('createdBy' | 'date' | 'id' | 'type' | PromotionEventInterfaceKeySpecifier)[];
export type PromotionEventInterfaceFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleKeySpecifier = ('cataloguePredicate' | 'channels' | 'description' | 'giftIds' | 'giftsLimit' | 'id' | 'name' | 'orderPredicate' | 'predicateType' | 'promotion' | 'rewardType' | 'rewardValue' | 'rewardValueType' | 'translation' | PromotionRuleKeySpecifier)[];
export type PromotionRuleFieldPolicy = {
	cataloguePredicate?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	giftIds?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	orderPredicate?: FieldPolicy<any> | FieldReadFunction<any>,
	predicateType?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardType?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardValue?: FieldPolicy<any> | FieldReadFunction<any>,
	rewardValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleCreateKeySpecifier = ('errors' | 'promotionRule' | PromotionRuleCreateKeySpecifier)[];
export type PromotionRuleCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleCreateErrorKeySpecifier = ('code' | 'field' | 'giftsLimit' | 'giftsLimitExceedBy' | 'message' | 'rulesLimit' | 'rulesLimitExceedBy' | PromotionRuleCreateErrorKeySpecifier)[];
export type PromotionRuleCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimitExceedBy?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	rulesLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	rulesLimitExceedBy?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotionRule' | 'recipient' | 'version' | PromotionRuleCreatedKeySpecifier)[];
export type PromotionRuleCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleCreatedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'ruleId' | 'type' | PromotionRuleCreatedEventKeySpecifier)[];
export type PromotionRuleCreatedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleId?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleDeleteKeySpecifier = ('errors' | 'promotionRule' | PromotionRuleDeleteKeySpecifier)[];
export type PromotionRuleDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleDeleteErrorKeySpecifier = ('code' | 'field' | 'message' | PromotionRuleDeleteErrorKeySpecifier)[];
export type PromotionRuleDeleteErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotionRule' | 'recipient' | 'version' | PromotionRuleDeletedKeySpecifier)[];
export type PromotionRuleDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleDeletedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'ruleId' | 'type' | PromotionRuleDeletedEventKeySpecifier)[];
export type PromotionRuleDeletedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleId?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleEventInterfaceKeySpecifier = ('ruleId' | PromotionRuleEventInterfaceKeySpecifier)[];
export type PromotionRuleEventInterfaceFieldPolicy = {
	ruleId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleTranslatableContentKeySpecifier = ('description' | 'id' | 'name' | 'promotionRuleId' | 'translation' | PromotionRuleTranslatableContentKeySpecifier)[];
export type PromotionRuleTranslatableContentFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRuleId?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleTranslateKeySpecifier = ('errors' | 'promotionRule' | PromotionRuleTranslateKeySpecifier)[];
export type PromotionRuleTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleTranslationKeySpecifier = ('description' | 'id' | 'language' | 'name' | 'translatableContent' | PromotionRuleTranslationKeySpecifier)[];
export type PromotionRuleTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleUpdateKeySpecifier = ('errors' | 'promotionRule' | PromotionRuleUpdateKeySpecifier)[];
export type PromotionRuleUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleUpdateErrorKeySpecifier = ('channels' | 'code' | 'field' | 'giftsLimit' | 'giftsLimitExceedBy' | 'message' | PromotionRuleUpdateErrorKeySpecifier)[];
export type PromotionRuleUpdateErrorFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	giftsLimitExceedBy?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotionRule' | 'recipient' | 'version' | PromotionRuleUpdatedKeySpecifier)[];
export type PromotionRuleUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionRule?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionRuleUpdatedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'ruleId' | 'type' | PromotionRuleUpdatedEventKeySpecifier)[];
export type PromotionRuleUpdatedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleId?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionStartedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotion' | 'recipient' | 'version' | PromotionStartedKeySpecifier)[];
export type PromotionStartedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionStartedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'type' | PromotionStartedEventKeySpecifier)[];
export type PromotionStartedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionTranslatableContentKeySpecifier = ('description' | 'id' | 'name' | 'promotionId' | 'translation' | PromotionTranslatableContentKeySpecifier)[];
export type PromotionTranslatableContentFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	promotionId?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionTranslateKeySpecifier = ('errors' | 'promotion' | PromotionTranslateKeySpecifier)[];
export type PromotionTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionTranslationKeySpecifier = ('description' | 'id' | 'language' | 'name' | 'translatableContent' | PromotionTranslationKeySpecifier)[];
export type PromotionTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionUpdateKeySpecifier = ('errors' | 'promotion' | PromotionUpdateKeySpecifier)[];
export type PromotionUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionUpdateErrorKeySpecifier = ('code' | 'field' | 'message' | PromotionUpdateErrorKeySpecifier)[];
export type PromotionUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'promotion' | 'recipient' | 'version' | PromotionUpdatedKeySpecifier)[];
export type PromotionUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PromotionUpdatedEventKeySpecifier = ('createdBy' | 'date' | 'id' | 'type' | PromotionUpdatedEventKeySpecifier)[];
export type PromotionUpdatedEventFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('_entities' | '_service' | 'address' | 'addressValidationRules' | 'app' | 'appExtension' | 'appExtensions' | 'apps' | 'appsInstallations' | 'attribute' | 'attributes' | 'categories' | 'category' | 'channel' | 'channels' | 'checkout' | 'checkoutLines' | 'checkouts' | 'collection' | 'collections' | 'customers' | 'digitalContent' | 'digitalContents' | 'draftOrders' | 'exportFile' | 'exportFiles' | 'giftCard' | 'giftCardCurrencies' | 'giftCardSettings' | 'giftCardTags' | 'giftCards' | 'homepageEvents' | 'me' | 'menu' | 'menuItem' | 'menuItems' | 'menus' | 'order' | 'orderByToken' | 'orderSettings' | 'orders' | 'ordersTotal' | 'page' | 'pageType' | 'pageTypes' | 'pages' | 'payment' | 'payments' | 'permissionGroup' | 'permissionGroups' | 'plugin' | 'plugins' | 'product' | 'productType' | 'productTypes' | 'productVariant' | 'productVariants' | 'products' | 'promotion' | 'promotions' | 'refundSettings' | 'reportProductSales' | 'sale' | 'sales' | 'shippingZone' | 'shippingZones' | 'shop' | 'staffUsers' | 'stock' | 'stocks' | 'taxClass' | 'taxClasses' | 'taxConfiguration' | 'taxConfigurations' | 'taxCountryConfiguration' | 'taxCountryConfigurations' | 'taxTypes' | 'transaction' | 'translation' | 'translations' | 'user' | 'voucher' | 'vouchers' | 'warehouse' | 'warehouses' | 'webhook' | 'webhookEvents' | 'webhookSamplePayload' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	_entities?: FieldPolicy<any> | FieldReadFunction<any>,
	_service?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	addressValidationRules?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appExtension?: FieldPolicy<any> | FieldReadFunction<any>,
	appExtensions?: FieldPolicy<any> | FieldReadFunction<any>,
	apps?: FieldPolicy<any> | FieldReadFunction<any>,
	appsInstallations?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLines?: FieldPolicy<any> | FieldReadFunction<any>,
	checkouts?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	customers?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContent?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContents?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFiles?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardCurrencies?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardTags?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItems?: FieldPolicy<any> | FieldReadFunction<any>,
	menus?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderByToken?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	ordersTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	pages?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	plugins?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	promotion?: FieldPolicy<any> | FieldReadFunction<any>,
	promotions?: FieldPolicy<any> | FieldReadFunction<any>,
	refundSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	reportProductSales?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	sales?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	stock?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClasses?: FieldPolicy<any> | FieldReadFunction<any>,
	taxConfiguration?: FieldPolicy<any> | FieldReadFunction<any>,
	taxConfigurations?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCountryConfiguration?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCountryConfigurations?: FieldPolicy<any> | FieldReadFunction<any>,
	taxTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	vouchers?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookSamplePayload?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReducedRateKeySpecifier = ('rate' | 'rateType' | ReducedRateKeySpecifier)[];
export type ReducedRateFieldPolicy = {
	rate?: FieldPolicy<any> | FieldReadFunction<any>,
	rateType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefreshTokenKeySpecifier = ('accountErrors' | 'errors' | 'token' | 'user' | RefreshTokenKeySpecifier)[];
export type RefreshTokenFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefundReasonReferenceTypeClearKeySpecifier = ('errors' | 'refundSettings' | 'refundSettingsErrors' | RefundReasonReferenceTypeClearKeySpecifier)[];
export type RefundReasonReferenceTypeClearFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refundSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	refundSettingsErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefundReasonReferenceTypeClearErrorKeySpecifier = ('code' | 'field' | 'message' | RefundReasonReferenceTypeClearErrorKeySpecifier)[];
export type RefundReasonReferenceTypeClearErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefundSettingsKeySpecifier = ('reasonReferenceType' | RefundSettingsKeySpecifier)[];
export type RefundSettingsFieldPolicy = {
	reasonReferenceType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefundSettingsUpdateKeySpecifier = ('errors' | 'refundSettings' | 'refundSettingsErrors' | RefundSettingsUpdateKeySpecifier)[];
export type RefundSettingsUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refundSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	refundSettingsErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefundSettingsUpdateErrorKeySpecifier = ('code' | 'field' | 'message' | RefundSettingsUpdateErrorKeySpecifier)[];
export type RefundSettingsUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RequestEmailChangeKeySpecifier = ('accountErrors' | 'errors' | 'user' | RequestEmailChangeKeySpecifier)[];
export type RequestEmailChangeFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RequestPasswordResetKeySpecifier = ('accountErrors' | 'errors' | RequestPasswordResetKeySpecifier)[];
export type RequestPasswordResetFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleKeySpecifier = ('categories' | 'channelListings' | 'collections' | 'created' | 'currency' | 'discountValue' | 'endDate' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'products' | 'startDate' | 'translation' | 'type' | 'updatedAt' | 'variants' | SaleKeySpecifier)[];
export type SaleFieldPolicy = {
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleAddCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleAddCataloguesKeySpecifier)[];
export type SaleAddCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleBulkDeleteKeySpecifier = ('count' | 'discountErrors' | 'errors' | SaleBulkDeleteKeySpecifier)[];
export type SaleBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleChannelListingKeySpecifier = ('channel' | 'currency' | 'discountValue' | 'id' | SaleChannelListingKeySpecifier)[];
export type SaleChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleChannelListingUpdateKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleChannelListingUpdateKeySpecifier)[];
export type SaleChannelListingUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | SaleCountableConnectionKeySpecifier)[];
export type SaleCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCountableEdgeKeySpecifier = ('cursor' | 'node' | SaleCountableEdgeKeySpecifier)[];
export type SaleCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCreateKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleCreateKeySpecifier)[];
export type SaleCreateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'sale' | 'version' | SaleCreatedKeySpecifier)[];
export type SaleCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleDeleteKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleDeleteKeySpecifier)[];
export type SaleDeleteFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'sale' | 'version' | SaleDeletedKeySpecifier)[];
export type SaleDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleRemoveCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleRemoveCataloguesKeySpecifier)[];
export type SaleRemoveCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleToggleKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'sale' | 'version' | SaleToggleKeySpecifier)[];
export type SaleToggleFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslatableContentKeySpecifier = ('id' | 'name' | 'sale' | 'saleId' | 'translation' | SaleTranslatableContentKeySpecifier)[];
export type SaleTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	saleId?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslateKeySpecifier = ('errors' | 'sale' | 'translationErrors' | SaleTranslateKeySpecifier)[];
export type SaleTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslationKeySpecifier = ('id' | 'language' | 'name' | 'translatableContent' | SaleTranslationKeySpecifier)[];
export type SaleTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleUpdateKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleUpdateKeySpecifier)[];
export type SaleUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'sale' | 'version' | SaleUpdatedKeySpecifier)[];
export type SaleUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SelectedAttributeKeySpecifier = ('attribute' | 'values' | SelectedAttributeKeySpecifier)[];
export type SelectedAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SendConfirmationEmailKeySpecifier = ('errors' | SendConfirmationEmailKeySpecifier)[];
export type SendConfirmationEmailFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SendConfirmationEmailErrorKeySpecifier = ('code' | 'field' | 'message' | SendConfirmationEmailErrorKeySpecifier)[];
export type SendConfirmationEmailErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SetPasswordKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | SetPasswordKeySpecifier)[];
export type SetPasswordFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingErrorKeySpecifier = ('channels' | 'code' | 'field' | 'message' | 'warehouses' | ShippingErrorKeySpecifier)[];
export type ShippingErrorFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingListMethodsForCheckoutKeySpecifier = ('checkout' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingMethods' | 'version' | ShippingListMethodsForCheckoutKeySpecifier)[];
export type ShippingListMethodsForCheckoutFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodKeySpecifier = ('active' | 'description' | 'id' | 'maximumDeliveryDays' | 'maximumOrderPrice' | 'maximumOrderWeight' | 'message' | 'metadata' | 'metafield' | 'metafields' | 'minimumDeliveryDays' | 'minimumOrderPrice' | 'minimumOrderWeight' | 'name' | 'price' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'translation' | 'type' | ShippingMethodKeySpecifier)[];
export type ShippingMethodFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodChannelListingKeySpecifier = ('channel' | 'id' | 'maximumOrderPrice' | 'minimumOrderPrice' | 'price' | ShippingMethodChannelListingKeySpecifier)[];
export type ShippingMethodChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodChannelListingUpdateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | ShippingMethodChannelListingUpdateKeySpecifier)[];
export type ShippingMethodChannelListingUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodPostalCodeRuleKeySpecifier = ('end' | 'id' | 'inclusionType' | 'start' | ShippingMethodPostalCodeRuleKeySpecifier)[];
export type ShippingMethodPostalCodeRuleFieldPolicy = {
	end?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inclusionType?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTranslatableContentKeySpecifier = ('description' | 'id' | 'name' | 'shippingMethod' | 'shippingMethodId' | 'translation' | ShippingMethodTranslatableContentKeySpecifier)[];
export type ShippingMethodTranslatableContentFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodId?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTranslationKeySpecifier = ('description' | 'id' | 'language' | 'name' | 'translatableContent' | ShippingMethodTranslationKeySpecifier)[];
export type ShippingMethodTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTypeKeySpecifier = ('channelListings' | 'description' | 'excludedProducts' | 'id' | 'maximumDeliveryDays' | 'maximumOrderPrice' | 'maximumOrderWeight' | 'metadata' | 'metafield' | 'metafields' | 'minimumDeliveryDays' | 'minimumOrderPrice' | 'minimumOrderWeight' | 'name' | 'postalCodeRules' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'taxClass' | 'translation' | 'type' | ShippingMethodTypeKeySpecifier)[];
export type ShippingMethodTypeFieldPolicy = {
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	excludedProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeRules?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodsPerCountryKeySpecifier = ('countryCode' | 'shippingMethods' | ShippingMethodsPerCountryKeySpecifier)[];
export type ShippingMethodsPerCountryFieldPolicy = {
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceBulkDeleteKeySpecifier = ('count' | 'errors' | 'shippingErrors' | ShippingPriceBulkDeleteKeySpecifier)[];
export type ShippingPriceBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceCreateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | 'shippingZone' | ShippingPriceCreateKeySpecifier)[];
export type ShippingPriceCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingMethod' | 'shippingZone' | 'version' | ShippingPriceCreatedKeySpecifier)[];
export type ShippingPriceCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceDeleteKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | 'shippingZone' | ShippingPriceDeleteKeySpecifier)[];
export type ShippingPriceDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingMethod' | 'shippingZone' | 'version' | ShippingPriceDeletedKeySpecifier)[];
export type ShippingPriceDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceExcludeProductsKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | ShippingPriceExcludeProductsKeySpecifier)[];
export type ShippingPriceExcludeProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceRemoveProductFromExcludeKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | ShippingPriceRemoveProductFromExcludeKeySpecifier)[];
export type ShippingPriceRemoveProductFromExcludeFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceTranslateKeySpecifier = ('errors' | 'shippingMethod' | 'translationErrors' | ShippingPriceTranslateKeySpecifier)[];
export type ShippingPriceTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceUpdateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | 'shippingZone' | ShippingPriceUpdateKeySpecifier)[];
export type ShippingPriceUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingMethod' | 'shippingZone' | 'version' | ShippingPriceUpdatedKeySpecifier)[];
export type ShippingPriceUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneKeySpecifier = ('channels' | 'countries' | 'default' | 'description' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'priceRange' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'shippingMethods' | 'warehouses' | ShippingZoneKeySpecifier)[];
export type ShippingZoneFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	default?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRange?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneBulkDeleteKeySpecifier = ('count' | 'errors' | 'shippingErrors' | ShippingZoneBulkDeleteKeySpecifier)[];
export type ShippingZoneBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ShippingZoneCountableConnectionKeySpecifier)[];
export type ShippingZoneCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCountableEdgeKeySpecifier = ('cursor' | 'node' | ShippingZoneCountableEdgeKeySpecifier)[];
export type ShippingZoneCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCreateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingZone' | ShippingZoneCreateKeySpecifier)[];
export type ShippingZoneCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingZone' | 'version' | ShippingZoneCreatedKeySpecifier)[];
export type ShippingZoneCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneDeleteKeySpecifier = ('errors' | 'shippingErrors' | 'shippingZone' | ShippingZoneDeleteKeySpecifier)[];
export type ShippingZoneDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingZone' | 'version' | ShippingZoneDeletedKeySpecifier)[];
export type ShippingZoneDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingZone' | 'version' | ShippingZoneMetadataUpdatedKeySpecifier)[];
export type ShippingZoneMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneUpdateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingZone' | ShippingZoneUpdateKeySpecifier)[];
export type ShippingZoneUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shippingZone' | 'version' | ShippingZoneUpdatedKeySpecifier)[];
export type ShippingZoneUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopKeySpecifier = ('allowLoginWithoutConfirmation' | 'automaticFulfillmentDigitalProducts' | 'availableExternalAuthentications' | 'availablePaymentGateways' | 'availableShippingMethods' | 'availableTaxApps' | 'channelCurrencies' | 'chargeTaxesOnShipping' | 'companyAddress' | 'countries' | 'customerSetPasswordUrl' | 'defaultCountry' | 'defaultDigitalMaxDownloads' | 'defaultDigitalUrlValidDays' | 'defaultMailSenderAddress' | 'defaultMailSenderName' | 'defaultWeightUnit' | 'description' | 'displayGrossPrices' | 'domain' | 'enableAccountConfirmationByEmail' | 'fulfillmentAllowUnpaid' | 'fulfillmentAutoApprove' | 'headerText' | 'id' | 'includeTaxesInPrices' | 'languages' | 'limitQuantityPerCheckout' | 'limits' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'permissions' | 'phonePrefixes' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'reserveStockDurationAnonymousUser' | 'reserveStockDurationAuthenticatedUser' | 'schemaVersion' | 'staffNotificationRecipients' | 'trackInventoryByDefault' | 'translation' | 'version' | ShopKeySpecifier)[];
export type ShopFieldPolicy = {
	allowLoginWithoutConfirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	automaticFulfillmentDigitalProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	availableExternalAuthentications?: FieldPolicy<any> | FieldReadFunction<any>,
	availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	availableTaxApps?: FieldPolicy<any> | FieldReadFunction<any>,
	channelCurrencies?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxesOnShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	companyAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	customerSetPasswordUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultDigitalMaxDownloads?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultDigitalUrlValidDays?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultMailSenderAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultMailSenderName?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultWeightUnit?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	domain?: FieldPolicy<any> | FieldReadFunction<any>,
	enableAccountConfirmationByEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillmentAllowUnpaid?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillmentAutoApprove?: FieldPolicy<any> | FieldReadFunction<any>,
	headerText?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTaxesInPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	languages?: FieldPolicy<any> | FieldReadFunction<any>,
	limitQuantityPerCheckout?: FieldPolicy<any> | FieldReadFunction<any>,
	limits?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	phonePrefixes?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	reserveStockDurationAnonymousUser?: FieldPolicy<any> | FieldReadFunction<any>,
	reserveStockDurationAuthenticatedUser?: FieldPolicy<any> | FieldReadFunction<any>,
	schemaVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipients?: FieldPolicy<any> | FieldReadFunction<any>,
	trackInventoryByDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopAddressUpdateKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopAddressUpdateKeySpecifier)[];
export type ShopAddressUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopDomainUpdateKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopDomainUpdateKeySpecifier)[];
export type ShopDomainUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopErrorKeySpecifier = ('code' | 'field' | 'message' | ShopErrorKeySpecifier)[];
export type ShopErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopFetchTaxRatesKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopFetchTaxRatesKeySpecifier)[];
export type ShopFetchTaxRatesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'shop' | 'version' | ShopMetadataUpdatedKeySpecifier)[];
export type ShopMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopSettingsTranslateKeySpecifier = ('errors' | 'shop' | 'translationErrors' | ShopSettingsTranslateKeySpecifier)[];
export type ShopSettingsTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopSettingsUpdateKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopSettingsUpdateKeySpecifier)[];
export type ShopSettingsUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopTranslationKeySpecifier = ('description' | 'headerText' | 'id' | 'language' | ShopTranslationKeySpecifier)[];
export type ShopTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	headerText?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffBulkDeleteKeySpecifier = ('count' | 'errors' | 'staffErrors' | StaffBulkDeleteKeySpecifier)[];
export type StaffBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffCreateKeySpecifier = ('errors' | 'staffErrors' | 'user' | StaffCreateKeySpecifier)[];
export type StaffCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | StaffCreatedKeySpecifier)[];
export type StaffCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffDeleteKeySpecifier = ('errors' | 'staffErrors' | 'user' | StaffDeleteKeySpecifier)[];
export type StaffDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | StaffDeletedKeySpecifier)[];
export type StaffDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'groups' | 'message' | 'permissions' | 'users' | StaffErrorKeySpecifier)[];
export type StaffErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	groups?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientKeySpecifier = ('active' | 'email' | 'id' | 'user' | StaffNotificationRecipientKeySpecifier)[];
export type StaffNotificationRecipientFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientCreateKeySpecifier = ('errors' | 'shopErrors' | 'staffNotificationRecipient' | StaffNotificationRecipientCreateKeySpecifier)[];
export type StaffNotificationRecipientCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientDeleteKeySpecifier = ('errors' | 'shopErrors' | 'staffNotificationRecipient' | StaffNotificationRecipientDeleteKeySpecifier)[];
export type StaffNotificationRecipientDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientUpdateKeySpecifier = ('errors' | 'shopErrors' | 'staffNotificationRecipient' | StaffNotificationRecipientUpdateKeySpecifier)[];
export type StaffNotificationRecipientUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffSetPasswordRequestedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'redirectUrl' | 'shop' | 'token' | 'user' | 'version' | StaffSetPasswordRequestedKeySpecifier)[];
export type StaffSetPasswordRequestedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffUpdateKeySpecifier = ('errors' | 'staffErrors' | 'user' | StaffUpdateKeySpecifier)[];
export type StaffUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'user' | 'version' | StaffUpdatedKeySpecifier)[];
export type StaffUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockKeySpecifier = ('id' | 'productVariant' | 'quantity' | 'quantityAllocated' | 'quantityReserved' | 'warehouse' | StockKeySpecifier)[];
export type StockFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityAllocated?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityReserved?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockBulkResultKeySpecifier = ('errors' | 'stock' | StockBulkResultKeySpecifier)[];
export type StockBulkResultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	stock?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockBulkUpdateKeySpecifier = ('count' | 'errors' | 'results' | StockBulkUpdateKeySpecifier)[];
export type StockBulkUpdateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	results?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockBulkUpdateErrorKeySpecifier = ('code' | 'field' | 'message' | StockBulkUpdateErrorKeySpecifier)[];
export type StockBulkUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | StockCountableConnectionKeySpecifier)[];
export type StockCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockCountableEdgeKeySpecifier = ('cursor' | 'node' | StockCountableEdgeKeySpecifier)[];
export type StockCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockErrorKeySpecifier = ('code' | 'field' | 'message' | StockErrorKeySpecifier)[];
export type StockErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockSettingsKeySpecifier = ('allocationStrategy' | StockSettingsKeySpecifier)[];
export type StockSettingsFieldPolicy = {
	allocationStrategy?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoredPaymentMethodKeySpecifier = ('creditCardInfo' | 'data' | 'gateway' | 'id' | 'name' | 'paymentMethodId' | 'supportedPaymentFlows' | 'type' | StoredPaymentMethodKeySpecifier)[];
export type StoredPaymentMethodFieldPolicy = {
	creditCardInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodId?: FieldPolicy<any> | FieldReadFunction<any>,
	supportedPaymentFlows?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoredPaymentMethodDeleteRequestedKeySpecifier = ('channel' | 'issuedAt' | 'issuingPrincipal' | 'paymentMethodId' | 'recipient' | 'user' | 'version' | StoredPaymentMethodDeleteRequestedKeySpecifier)[];
export type StoredPaymentMethodDeleteRequestedFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodId?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoredPaymentMethodRequestDeleteKeySpecifier = ('errors' | 'result' | StoredPaymentMethodRequestDeleteKeySpecifier)[];
export type StoredPaymentMethodRequestDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	result?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('checkoutCreated' | 'checkoutFullyAuthorized' | 'checkoutFullyPaid' | 'checkoutMetadataUpdated' | 'checkoutUpdated' | 'draftOrderCreated' | 'draftOrderDeleted' | 'draftOrderUpdated' | 'event' | 'orderBulkCreated' | 'orderCancelled' | 'orderConfirmed' | 'orderCreated' | 'orderExpired' | 'orderFulfilled' | 'orderFullyPaid' | 'orderFullyRefunded' | 'orderMetadataUpdated' | 'orderPaid' | 'orderRefunded' | 'orderUpdated' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	checkoutCreated?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutFullyAuthorized?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutFullyPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutMetadataUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderCreated?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderDeleted?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	orderBulkCreated?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCancelled?: FieldPolicy<any> | FieldReadFunction<any>,
	orderConfirmed?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCreated?: FieldPolicy<any> | FieldReadFunction<any>,
	orderExpired?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfilled?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFullyPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFullyRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	orderMetadataUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	orderPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	orderRefunded?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassKeySpecifier = ('countries' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | TaxClassKeySpecifier)[];
export type TaxClassFieldPolicy = {
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | TaxClassCountableConnectionKeySpecifier)[];
export type TaxClassCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassCountableEdgeKeySpecifier = ('cursor' | 'node' | TaxClassCountableEdgeKeySpecifier)[];
export type TaxClassCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassCountryRateKeySpecifier = ('country' | 'rate' | 'taxClass' | TaxClassCountryRateKeySpecifier)[];
export type TaxClassCountryRateFieldPolicy = {
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	rate?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassCreateKeySpecifier = ('errors' | 'taxClass' | TaxClassCreateKeySpecifier)[];
export type TaxClassCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassCreateErrorKeySpecifier = ('code' | 'countryCodes' | 'field' | 'message' | TaxClassCreateErrorKeySpecifier)[];
export type TaxClassCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	countryCodes?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassDeleteKeySpecifier = ('errors' | 'taxClass' | TaxClassDeleteKeySpecifier)[];
export type TaxClassDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassDeleteErrorKeySpecifier = ('code' | 'field' | 'message' | TaxClassDeleteErrorKeySpecifier)[];
export type TaxClassDeleteErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassUpdateKeySpecifier = ('errors' | 'taxClass' | TaxClassUpdateKeySpecifier)[];
export type TaxClassUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClass?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxClassUpdateErrorKeySpecifier = ('code' | 'countryCodes' | 'field' | 'message' | TaxClassUpdateErrorKeySpecifier)[];
export type TaxClassUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	countryCodes?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxConfigurationKeySpecifier = ('channel' | 'chargeTaxes' | 'countries' | 'displayGrossPrices' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'pricesEnteredWithTax' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'taxAppId' | 'taxCalculationStrategy' | 'useWeightedTaxForShipping' | TaxConfigurationKeySpecifier)[];
export type TaxConfigurationFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	pricesEnteredWithTax?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	taxAppId?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCalculationStrategy?: FieldPolicy<any> | FieldReadFunction<any>,
	useWeightedTaxForShipping?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxConfigurationCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | TaxConfigurationCountableConnectionKeySpecifier)[];
export type TaxConfigurationCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxConfigurationCountableEdgeKeySpecifier = ('cursor' | 'node' | TaxConfigurationCountableEdgeKeySpecifier)[];
export type TaxConfigurationCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxConfigurationPerCountryKeySpecifier = ('chargeTaxes' | 'country' | 'displayGrossPrices' | 'taxAppId' | 'taxCalculationStrategy' | 'useWeightedTaxForShipping' | TaxConfigurationPerCountryKeySpecifier)[];
export type TaxConfigurationPerCountryFieldPolicy = {
	chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	taxAppId?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCalculationStrategy?: FieldPolicy<any> | FieldReadFunction<any>,
	useWeightedTaxForShipping?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxConfigurationUpdateKeySpecifier = ('errors' | 'taxConfiguration' | TaxConfigurationUpdateKeySpecifier)[];
export type TaxConfigurationUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxConfiguration?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxConfigurationUpdateErrorKeySpecifier = ('code' | 'countryCodes' | 'field' | 'message' | TaxConfigurationUpdateErrorKeySpecifier)[];
export type TaxConfigurationUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	countryCodes?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxCountryConfigurationKeySpecifier = ('country' | 'taxClassCountryRates' | TaxCountryConfigurationKeySpecifier)[];
export type TaxCountryConfigurationFieldPolicy = {
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassCountryRates?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxCountryConfigurationDeleteKeySpecifier = ('errors' | 'taxCountryConfiguration' | TaxCountryConfigurationDeleteKeySpecifier)[];
export type TaxCountryConfigurationDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCountryConfiguration?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxCountryConfigurationDeleteErrorKeySpecifier = ('code' | 'field' | 'message' | TaxCountryConfigurationDeleteErrorKeySpecifier)[];
export type TaxCountryConfigurationDeleteErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxCountryConfigurationUpdateKeySpecifier = ('errors' | 'taxCountryConfiguration' | TaxCountryConfigurationUpdateKeySpecifier)[];
export type TaxCountryConfigurationUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCountryConfiguration?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxCountryConfigurationUpdateErrorKeySpecifier = ('code' | 'field' | 'message' | 'taxClassIds' | TaxCountryConfigurationUpdateErrorKeySpecifier)[];
export type TaxCountryConfigurationUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	taxClassIds?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxExemptionManageKeySpecifier = ('errors' | 'taxableObject' | TaxExemptionManageKeySpecifier)[];
export type TaxExemptionManageFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	taxableObject?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxExemptionManageErrorKeySpecifier = ('code' | 'field' | 'message' | TaxExemptionManageErrorKeySpecifier)[];
export type TaxExemptionManageErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxTypeKeySpecifier = ('description' | 'taxCode' | TaxTypeKeySpecifier)[];
export type TaxTypeFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxableObjectKeySpecifier = ('address' | 'channel' | 'currency' | 'discounts' | 'lines' | 'pricesEnteredWithTax' | 'shippingPrice' | 'sourceObject' | TaxableObjectKeySpecifier)[];
export type TaxableObjectFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discounts?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	pricesEnteredWithTax?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	sourceObject?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxableObjectDiscountKeySpecifier = ('amount' | 'name' | 'type' | TaxableObjectDiscountKeySpecifier)[];
export type TaxableObjectDiscountFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxableObjectLineKeySpecifier = ('chargeTaxes' | 'productName' | 'productSku' | 'quantity' | 'sourceLine' | 'totalPrice' | 'unitPrice' | 'variantName' | TaxableObjectLineKeySpecifier)[];
export type TaxableObjectLineFieldPolicy = {
	chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>,
	productName?: FieldPolicy<any> | FieldReadFunction<any>,
	productSku?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	sourceLine?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	unitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	variantName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxedMoneyKeySpecifier = ('currency' | 'gross' | 'net' | 'tax' | TaxedMoneyKeySpecifier)[];
export type TaxedMoneyFieldPolicy = {
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	gross?: FieldPolicy<any> | FieldReadFunction<any>,
	net?: FieldPolicy<any> | FieldReadFunction<any>,
	tax?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxedMoneyRangeKeySpecifier = ('start' | 'stop' | TaxedMoneyRangeKeySpecifier)[];
export type TaxedMoneyRangeFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ThumbnailCreatedKeySpecifier = ('id' | 'issuedAt' | 'issuingPrincipal' | 'mediaUrl' | 'objectId' | 'recipient' | 'url' | 'version' | ThumbnailCreatedKeySpecifier)[];
export type ThumbnailCreatedFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	mediaUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	objectId?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TimePeriodKeySpecifier = ('amount' | 'type' | TimePeriodKeySpecifier)[];
export type TimePeriodFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionKeySpecifier = ('amount' | 'created' | 'error' | 'gatewayResponse' | 'id' | 'isSuccess' | 'kind' | 'payment' | 'token' | TransactionKeySpecifier)[];
export type TransactionFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	error?: FieldPolicy<any> | FieldReadFunction<any>,
	gatewayResponse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isSuccess?: FieldPolicy<any> | FieldReadFunction<any>,
	kind?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionActionKeySpecifier = ('actionType' | 'amount' | 'currency' | TransactionActionKeySpecifier)[];
export type TransactionActionFieldPolicy = {
	actionType?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionCancelationRequestedKeySpecifier = ('action' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'transaction' | 'version' | TransactionCancelationRequestedKeySpecifier)[];
export type TransactionCancelationRequestedFieldPolicy = {
	action?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionChargeRequestedKeySpecifier = ('action' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'transaction' | 'version' | TransactionChargeRequestedKeySpecifier)[];
export type TransactionChargeRequestedFieldPolicy = {
	action?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionCreateKeySpecifier = ('errors' | 'transaction' | TransactionCreateKeySpecifier)[];
export type TransactionCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionCreateErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionCreateErrorKeySpecifier)[];
export type TransactionCreateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionEventKeySpecifier = ('amount' | 'createdAt' | 'createdBy' | 'externalUrl' | 'id' | 'idempotencyKey' | 'message' | 'pspReference' | 'reasonReference' | 'type' | TransactionEventKeySpecifier)[];
export type TransactionEventFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	externalUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	idempotencyKey?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	pspReference?: FieldPolicy<any> | FieldReadFunction<any>,
	reasonReference?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionEventReportKeySpecifier = ('alreadyProcessed' | 'errors' | 'transaction' | 'transactionEvent' | TransactionEventReportKeySpecifier)[];
export type TransactionEventReportFieldPolicy = {
	alreadyProcessed?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionEventReportErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionEventReportErrorKeySpecifier)[];
export type TransactionEventReportErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionInitializeKeySpecifier = ('data' | 'errors' | 'transaction' | 'transactionEvent' | TransactionInitializeKeySpecifier)[];
export type TransactionInitializeFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionInitializeErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionInitializeErrorKeySpecifier)[];
export type TransactionInitializeErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionInitializeSessionKeySpecifier = ('action' | 'customerIpAddress' | 'data' | 'idempotencyKey' | 'issuedAt' | 'issuingPrincipal' | 'merchantReference' | 'recipient' | 'sourceObject' | 'transaction' | 'version' | TransactionInitializeSessionKeySpecifier)[];
export type TransactionInitializeSessionFieldPolicy = {
	action?: FieldPolicy<any> | FieldReadFunction<any>,
	customerIpAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	idempotencyKey?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	merchantReference?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sourceObject?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionItemKeySpecifier = ('actions' | 'authorizePendingAmount' | 'authorizedAmount' | 'cancelPendingAmount' | 'canceledAmount' | 'chargePendingAmount' | 'chargedAmount' | 'checkout' | 'createdAt' | 'createdBy' | 'events' | 'externalUrl' | 'id' | 'message' | 'metadata' | 'metafield' | 'metafields' | 'modifiedAt' | 'name' | 'order' | 'paymentMethodDetails' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'pspReference' | 'reason' | 'reasonReference' | 'refundPendingAmount' | 'refundedAmount' | 'token' | TransactionItemKeySpecifier)[];
export type TransactionItemFieldPolicy = {
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizePendingAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	authorizedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	cancelPendingAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	canceledAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	chargePendingAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	chargedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	externalUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	modifiedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodDetails?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	pspReference?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	reasonReference?: FieldPolicy<any> | FieldReadFunction<any>,
	refundPendingAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	refundedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionItemMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'transaction' | 'version' | TransactionItemMetadataUpdatedKeySpecifier)[];
export type TransactionItemMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionProcessKeySpecifier = ('data' | 'errors' | 'transaction' | 'transactionEvent' | TransactionProcessKeySpecifier)[];
export type TransactionProcessFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionProcessActionKeySpecifier = ('actionType' | 'amount' | 'currency' | TransactionProcessActionKeySpecifier)[];
export type TransactionProcessActionFieldPolicy = {
	actionType?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionProcessErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionProcessErrorKeySpecifier)[];
export type TransactionProcessErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionProcessSessionKeySpecifier = ('action' | 'customerIpAddress' | 'data' | 'issuedAt' | 'issuingPrincipal' | 'merchantReference' | 'recipient' | 'sourceObject' | 'transaction' | 'version' | TransactionProcessSessionKeySpecifier)[];
export type TransactionProcessSessionFieldPolicy = {
	action?: FieldPolicy<any> | FieldReadFunction<any>,
	customerIpAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	merchantReference?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	sourceObject?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionRefundRequestedKeySpecifier = ('action' | 'grantedRefund' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'transaction' | 'version' | TransactionRefundRequestedKeySpecifier)[];
export type TransactionRefundRequestedFieldPolicy = {
	action?: FieldPolicy<any> | FieldReadFunction<any>,
	grantedRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionRequestActionKeySpecifier = ('errors' | 'transaction' | TransactionRequestActionKeySpecifier)[];
export type TransactionRequestActionFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionRequestActionErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionRequestActionErrorKeySpecifier)[];
export type TransactionRequestActionErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionRequestRefundForGrantedRefundKeySpecifier = ('errors' | 'transaction' | TransactionRequestRefundForGrantedRefundKeySpecifier)[];
export type TransactionRequestRefundForGrantedRefundFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionRequestRefundForGrantedRefundErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionRequestRefundForGrantedRefundErrorKeySpecifier)[];
export type TransactionRequestRefundForGrantedRefundErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionUpdateKeySpecifier = ('errors' | 'transaction' | TransactionUpdateKeySpecifier)[];
export type TransactionUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	transaction?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionUpdateErrorKeySpecifier = ('code' | 'field' | 'message' | TransactionUpdateErrorKeySpecifier)[];
export type TransactionUpdateErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslatableItemConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | TranslatableItemConnectionKeySpecifier)[];
export type TranslatableItemConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslatableItemEdgeKeySpecifier = ('cursor' | 'node' | TranslatableItemEdgeKeySpecifier)[];
export type TranslatableItemEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslationCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'translation' | 'version' | TranslationCreatedKeySpecifier)[];
export type TranslationCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslationErrorKeySpecifier = ('code' | 'field' | 'message' | TranslationErrorKeySpecifier)[];
export type TranslationErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslationUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'translation' | 'version' | TranslationUpdatedKeySpecifier)[];
export type TranslationUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | UpdateMetadataKeySpecifier)[];
export type UpdateMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdatePrivateMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | UpdatePrivateMetadataKeySpecifier)[];
export type UpdatePrivateMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UploadErrorKeySpecifier = ('code' | 'field' | 'message' | UploadErrorKeySpecifier)[];
export type UploadErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('accessibleChannels' | 'addresses' | 'avatar' | 'checkout' | 'checkoutIds' | 'checkoutTokens' | 'checkouts' | 'dateJoined' | 'defaultBillingAddress' | 'defaultShippingAddress' | 'editableGroups' | 'email' | 'events' | 'externalReference' | 'firstName' | 'giftCards' | 'id' | 'isActive' | 'isConfirmed' | 'isStaff' | 'languageCode' | 'lastLogin' | 'lastName' | 'metadata' | 'metafield' | 'metafields' | 'note' | 'orders' | 'permissionGroups' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'restrictedAccessToChannels' | 'storedPaymentMethods' | 'storedPaymentSources' | 'updatedAt' | 'userPermissions' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	accessibleChannels?: FieldPolicy<any> | FieldReadFunction<any>,
	addresses?: FieldPolicy<any> | FieldReadFunction<any>,
	avatar?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutIds?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	checkouts?: FieldPolicy<any> | FieldReadFunction<any>,
	dateJoined?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	editableGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	isConfirmed?: FieldPolicy<any> | FieldReadFunction<any>,
	isStaff?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	lastLogin?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	restrictedAccessToChannels?: FieldPolicy<any> | FieldReadFunction<any>,
	storedPaymentMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	storedPaymentSources?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	userPermissions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAvatarDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | UserAvatarDeleteKeySpecifier)[];
export type UserAvatarDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAvatarUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | UserAvatarUpdateKeySpecifier)[];
export type UserAvatarUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserBulkSetActiveKeySpecifier = ('accountErrors' | 'count' | 'errors' | UserBulkSetActiveKeySpecifier)[];
export type UserBulkSetActiveFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | UserCountableConnectionKeySpecifier)[];
export type UserCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCountableEdgeKeySpecifier = ('cursor' | 'node' | UserCountableEdgeKeySpecifier)[];
export type UserCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserPermissionKeySpecifier = ('code' | 'name' | 'sourcePermissionGroups' | UserPermissionKeySpecifier)[];
export type UserPermissionFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sourcePermissionGroups?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VATKeySpecifier = ('countryCode' | 'reducedRates' | 'standardRate' | VATKeySpecifier)[];
export type VATFieldPolicy = {
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	reducedRates?: FieldPolicy<any> | FieldReadFunction<any>,
	standardRate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantMediaAssignKeySpecifier = ('errors' | 'media' | 'productErrors' | 'productVariant' | VariantMediaAssignKeySpecifier)[];
export type VariantMediaAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantMediaUnassignKeySpecifier = ('errors' | 'media' | 'productErrors' | 'productVariant' | VariantMediaUnassignKeySpecifier)[];
export type VariantMediaUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantPricingInfoKeySpecifier = ('discount' | 'discountLocalCurrency' | 'discountPrior' | 'onSale' | 'price' | 'priceLocalCurrency' | 'pricePrior' | 'priceUndiscounted' | VariantPricingInfoKeySpecifier)[];
export type VariantPricingInfoFieldPolicy = {
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountPrior?: FieldPolicy<any> | FieldReadFunction<any>,
	onSale?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	priceLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	pricePrior?: FieldPolicy<any> | FieldReadFunction<any>,
	priceUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VerifyTokenKeySpecifier = ('accountErrors' | 'errors' | 'isValid' | 'payload' | 'user' | VerifyTokenKeySpecifier)[];
export type VerifyTokenFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	isValid?: FieldPolicy<any> | FieldReadFunction<any>,
	payload?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherKeySpecifier = ('applyOncePerCustomer' | 'applyOncePerOrder' | 'categories' | 'channelListings' | 'code' | 'codes' | 'collections' | 'countries' | 'currency' | 'discountValue' | 'discountValueType' | 'endDate' | 'id' | 'metadata' | 'metafield' | 'metafields' | 'minCheckoutItemsQuantity' | 'minSpent' | 'name' | 'onlyForStaff' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'products' | 'singleUse' | 'startDate' | 'translation' | 'type' | 'usageLimit' | 'used' | 'variants' | VoucherKeySpecifier)[];
export type VoucherFieldPolicy = {
	applyOncePerCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	applyOncePerOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	codes?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	minCheckoutItemsQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	minSpent?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	onlyForStaff?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	singleUse?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	usageLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	used?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherAddCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherAddCataloguesKeySpecifier)[];
export type VoucherAddCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherBulkDeleteKeySpecifier = ('count' | 'discountErrors' | 'errors' | VoucherBulkDeleteKeySpecifier)[];
export type VoucherBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherChannelListingKeySpecifier = ('channel' | 'currency' | 'discountValue' | 'id' | 'minSpent' | VoucherChannelListingKeySpecifier)[];
export type VoucherChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	minSpent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherChannelListingUpdateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherChannelListingUpdateKeySpecifier)[];
export type VoucherChannelListingUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodeKeySpecifier = ('code' | 'createdAt' | 'id' | 'isActive' | 'used' | VoucherCodeKeySpecifier)[];
export type VoucherCodeFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	used?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodeBulkDeleteKeySpecifier = ('count' | 'errors' | VoucherCodeBulkDeleteKeySpecifier)[];
export type VoucherCodeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodeBulkDeleteErrorKeySpecifier = ('code' | 'message' | 'path' | 'voucherCodes' | VoucherCodeBulkDeleteErrorKeySpecifier)[];
export type VoucherCodeBulkDeleteErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	path?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | VoucherCodeCountableConnectionKeySpecifier)[];
export type VoucherCodeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodeCountableEdgeKeySpecifier = ('cursor' | 'node' | VoucherCodeCountableEdgeKeySpecifier)[];
export type VoucherCodeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodeExportCompletedKeySpecifier = ('export' | 'issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | VoucherCodeExportCompletedKeySpecifier)[];
export type VoucherCodeExportCompletedFieldPolicy = {
	export?: FieldPolicy<any> | FieldReadFunction<any>,
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodesCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'voucherCodes' | VoucherCodesCreatedKeySpecifier)[];
export type VoucherCodesCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCodesDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'voucherCodes' | VoucherCodesDeletedKeySpecifier)[];
export type VoucherCodesDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | VoucherCountableConnectionKeySpecifier)[];
export type VoucherCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCountableEdgeKeySpecifier = ('cursor' | 'node' | VoucherCountableEdgeKeySpecifier)[];
export type VoucherCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCreateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherCreateKeySpecifier)[];
export type VoucherCreateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'voucher' | VoucherCreatedKeySpecifier)[];
export type VoucherCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherDeleteKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherDeleteKeySpecifier)[];
export type VoucherDeleteFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'voucher' | VoucherDeletedKeySpecifier)[];
export type VoucherDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'voucher' | VoucherMetadataUpdatedKeySpecifier)[];
export type VoucherMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherRemoveCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherRemoveCataloguesKeySpecifier)[];
export type VoucherRemoveCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'voucher' | 'voucherId' | VoucherTranslatableContentKeySpecifier)[];
export type VoucherTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslateKeySpecifier = ('errors' | 'translationErrors' | 'voucher' | VoucherTranslateKeySpecifier)[];
export type VoucherTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslationKeySpecifier = ('id' | 'language' | 'name' | 'translatableContent' | VoucherTranslationKeySpecifier)[];
export type VoucherTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatableContent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherUpdateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherUpdateKeySpecifier)[];
export type VoucherUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'voucher' | VoucherUpdatedKeySpecifier)[];
export type VoucherUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseKeySpecifier = ('address' | 'clickAndCollectOption' | 'companyName' | 'email' | 'externalReference' | 'id' | 'isPrivate' | 'metadata' | 'metafield' | 'metafields' | 'name' | 'privateMetadata' | 'privateMetafield' | 'privateMetafields' | 'shippingZones' | 'slug' | 'stocks' | WarehouseKeySpecifier)[];
export type WarehouseFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	clickAndCollectOption?: FieldPolicy<any> | FieldReadFunction<any>,
	companyName?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	externalReference?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isPrivate?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metafield?: FieldPolicy<any> | FieldReadFunction<any>,
	metafields?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafield?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetafields?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | WarehouseCountableConnectionKeySpecifier)[];
export type WarehouseCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCountableEdgeKeySpecifier = ('cursor' | 'node' | WarehouseCountableEdgeKeySpecifier)[];
export type WarehouseCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCreateKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseCreateKeySpecifier)[];
export type WarehouseCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCreatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'warehouse' | WarehouseCreatedKeySpecifier)[];
export type WarehouseCreatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseDeleteKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseDeleteKeySpecifier)[];
export type WarehouseDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseDeletedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'warehouse' | WarehouseDeletedKeySpecifier)[];
export type WarehouseDeletedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseErrorKeySpecifier = ('code' | 'field' | 'message' | 'shippingZones' | WarehouseErrorKeySpecifier)[];
export type WarehouseErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseMetadataUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'warehouse' | WarehouseMetadataUpdatedKeySpecifier)[];
export type WarehouseMetadataUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseShippingZoneAssignKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseShippingZoneAssignKeySpecifier)[];
export type WarehouseShippingZoneAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseShippingZoneUnassignKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseShippingZoneUnassignKeySpecifier)[];
export type WarehouseShippingZoneUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseUpdateKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseUpdateKeySpecifier)[];
export type WarehouseUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseUpdatedKeySpecifier = ('issuedAt' | 'issuingPrincipal' | 'recipient' | 'version' | 'warehouse' | WarehouseUpdatedKeySpecifier)[];
export type WarehouseUpdatedFieldPolicy = {
	issuedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	issuingPrincipal?: FieldPolicy<any> | FieldReadFunction<any>,
	recipient?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookKeySpecifier = ('app' | 'asyncEvents' | 'customHeaders' | 'eventDeliveries' | 'events' | 'id' | 'isActive' | 'name' | 'secretKey' | 'subscriptionQuery' | 'syncEvents' | 'targetUrl' | WebhookKeySpecifier)[];
export type WebhookFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	asyncEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	customHeaders?: FieldPolicy<any> | FieldReadFunction<any>,
	eventDeliveries?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	secretKey?: FieldPolicy<any> | FieldReadFunction<any>,
	subscriptionQuery?: FieldPolicy<any> | FieldReadFunction<any>,
	syncEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	targetUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookCreateKeySpecifier = ('errors' | 'webhook' | 'webhookErrors' | WebhookCreateKeySpecifier)[];
export type WebhookCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookDeleteKeySpecifier = ('errors' | 'webhook' | 'webhookErrors' | WebhookDeleteKeySpecifier)[];
export type WebhookDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookDryRunKeySpecifier = ('errors' | 'payload' | WebhookDryRunKeySpecifier)[];
export type WebhookDryRunFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payload?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookDryRunErrorKeySpecifier = ('code' | 'field' | 'message' | WebhookDryRunErrorKeySpecifier)[];
export type WebhookDryRunErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookErrorKeySpecifier = ('code' | 'field' | 'message' | WebhookErrorKeySpecifier)[];
export type WebhookErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookEventKeySpecifier = ('eventType' | 'name' | WebhookEventKeySpecifier)[];
export type WebhookEventFieldPolicy = {
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookEventAsyncKeySpecifier = ('eventType' | 'name' | WebhookEventAsyncKeySpecifier)[];
export type WebhookEventAsyncFieldPolicy = {
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookEventSyncKeySpecifier = ('eventType' | 'name' | WebhookEventSyncKeySpecifier)[];
export type WebhookEventSyncFieldPolicy = {
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookTriggerKeySpecifier = ('delivery' | 'errors' | WebhookTriggerKeySpecifier)[];
export type WebhookTriggerFieldPolicy = {
	delivery?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookTriggerErrorKeySpecifier = ('code' | 'field' | 'message' | WebhookTriggerErrorKeySpecifier)[];
export type WebhookTriggerErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookUpdateKeySpecifier = ('errors' | 'webhook' | 'webhookErrors' | WebhookUpdateKeySpecifier)[];
export type WebhookUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WeightKeySpecifier = ('unit' | 'value' | WeightKeySpecifier)[];
export type WeightFieldPolicy = {
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WidgetTargetOptionsKeySpecifier = ('method' | WidgetTargetOptionsKeySpecifier)[];
export type WidgetTargetOptionsFieldPolicy = {
	method?: FieldPolicy<any> | FieldReadFunction<any>
};
export type _ServiceKeySpecifier = ('sdl' | _ServiceKeySpecifier)[];
export type _ServiceFieldPolicy = {
	sdl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	AccountAddressCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountAddressCreateKeySpecifier | (() => undefined | AccountAddressCreateKeySpecifier),
		fields?: AccountAddressCreateFieldPolicy,
	},
	AccountAddressDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountAddressDeleteKeySpecifier | (() => undefined | AccountAddressDeleteKeySpecifier),
		fields?: AccountAddressDeleteFieldPolicy,
	},
	AccountAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountAddressUpdateKeySpecifier | (() => undefined | AccountAddressUpdateKeySpecifier),
		fields?: AccountAddressUpdateFieldPolicy,
	},
	AccountChangeEmailRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountChangeEmailRequestedKeySpecifier | (() => undefined | AccountChangeEmailRequestedKeySpecifier),
		fields?: AccountChangeEmailRequestedFieldPolicy,
	},
	AccountConfirmationRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountConfirmationRequestedKeySpecifier | (() => undefined | AccountConfirmationRequestedKeySpecifier),
		fields?: AccountConfirmationRequestedFieldPolicy,
	},
	AccountConfirmed?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountConfirmedKeySpecifier | (() => undefined | AccountConfirmedKeySpecifier),
		fields?: AccountConfirmedFieldPolicy,
	},
	AccountDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountDeleteKeySpecifier | (() => undefined | AccountDeleteKeySpecifier),
		fields?: AccountDeleteFieldPolicy,
	},
	AccountDeleteRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountDeleteRequestedKeySpecifier | (() => undefined | AccountDeleteRequestedKeySpecifier),
		fields?: AccountDeleteRequestedFieldPolicy,
	},
	AccountDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountDeletedKeySpecifier | (() => undefined | AccountDeletedKeySpecifier),
		fields?: AccountDeletedFieldPolicy,
	},
	AccountEmailChanged?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountEmailChangedKeySpecifier | (() => undefined | AccountEmailChangedKeySpecifier),
		fields?: AccountEmailChangedFieldPolicy,
	},
	AccountError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountErrorKeySpecifier | (() => undefined | AccountErrorKeySpecifier),
		fields?: AccountErrorFieldPolicy,
	},
	AccountRegister?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountRegisterKeySpecifier | (() => undefined | AccountRegisterKeySpecifier),
		fields?: AccountRegisterFieldPolicy,
	},
	AccountRequestDeletion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountRequestDeletionKeySpecifier | (() => undefined | AccountRequestDeletionKeySpecifier),
		fields?: AccountRequestDeletionFieldPolicy,
	},
	AccountSetDefaultAddress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountSetDefaultAddressKeySpecifier | (() => undefined | AccountSetDefaultAddressKeySpecifier),
		fields?: AccountSetDefaultAddressFieldPolicy,
	},
	AccountSetPasswordRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountSetPasswordRequestedKeySpecifier | (() => undefined | AccountSetPasswordRequestedKeySpecifier),
		fields?: AccountSetPasswordRequestedFieldPolicy,
	},
	AccountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountUpdateKeySpecifier | (() => undefined | AccountUpdateKeySpecifier),
		fields?: AccountUpdateFieldPolicy,
	},
	Address?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressKeySpecifier | (() => undefined | AddressKeySpecifier),
		fields?: AddressFieldPolicy,
	},
	AddressCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressCreateKeySpecifier | (() => undefined | AddressCreateKeySpecifier),
		fields?: AddressCreateFieldPolicy,
	},
	AddressCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressCreatedKeySpecifier | (() => undefined | AddressCreatedKeySpecifier),
		fields?: AddressCreatedFieldPolicy,
	},
	AddressDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressDeleteKeySpecifier | (() => undefined | AddressDeleteKeySpecifier),
		fields?: AddressDeleteFieldPolicy,
	},
	AddressDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressDeletedKeySpecifier | (() => undefined | AddressDeletedKeySpecifier),
		fields?: AddressDeletedFieldPolicy,
	},
	AddressSetDefault?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressSetDefaultKeySpecifier | (() => undefined | AddressSetDefaultKeySpecifier),
		fields?: AddressSetDefaultFieldPolicy,
	},
	AddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressUpdateKeySpecifier | (() => undefined | AddressUpdateKeySpecifier),
		fields?: AddressUpdateFieldPolicy,
	},
	AddressUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressUpdatedKeySpecifier | (() => undefined | AddressUpdatedKeySpecifier),
		fields?: AddressUpdatedFieldPolicy,
	},
	AddressValidationData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressValidationDataKeySpecifier | (() => undefined | AddressValidationDataKeySpecifier),
		fields?: AddressValidationDataFieldPolicy,
	},
	Allocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AllocationKeySpecifier | (() => undefined | AllocationKeySpecifier),
		fields?: AllocationFieldPolicy,
	},
	App?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppKeySpecifier | (() => undefined | AppKeySpecifier),
		fields?: AppFieldPolicy,
	},
	AppActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppActivateKeySpecifier | (() => undefined | AppActivateKeySpecifier),
		fields?: AppActivateFieldPolicy,
	},
	AppBrand?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppBrandKeySpecifier | (() => undefined | AppBrandKeySpecifier),
		fields?: AppBrandFieldPolicy,
	},
	AppBrandLogo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppBrandLogoKeySpecifier | (() => undefined | AppBrandLogoKeySpecifier),
		fields?: AppBrandLogoFieldPolicy,
	},
	AppCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppCountableConnectionKeySpecifier | (() => undefined | AppCountableConnectionKeySpecifier),
		fields?: AppCountableConnectionFieldPolicy,
	},
	AppCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppCountableEdgeKeySpecifier | (() => undefined | AppCountableEdgeKeySpecifier),
		fields?: AppCountableEdgeFieldPolicy,
	},
	AppCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppCreateKeySpecifier | (() => undefined | AppCreateKeySpecifier),
		fields?: AppCreateFieldPolicy,
	},
	AppDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeactivateKeySpecifier | (() => undefined | AppDeactivateKeySpecifier),
		fields?: AppDeactivateFieldPolicy,
	},
	AppDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeleteKeySpecifier | (() => undefined | AppDeleteKeySpecifier),
		fields?: AppDeleteFieldPolicy,
	},
	AppDeleteFailedInstallation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeleteFailedInstallationKeySpecifier | (() => undefined | AppDeleteFailedInstallationKeySpecifier),
		fields?: AppDeleteFailedInstallationFieldPolicy,
	},
	AppDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeletedKeySpecifier | (() => undefined | AppDeletedKeySpecifier),
		fields?: AppDeletedFieldPolicy,
	},
	AppError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppErrorKeySpecifier | (() => undefined | AppErrorKeySpecifier),
		fields?: AppErrorFieldPolicy,
	},
	AppExtension?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppExtensionKeySpecifier | (() => undefined | AppExtensionKeySpecifier),
		fields?: AppExtensionFieldPolicy,
	},
	AppExtensionCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppExtensionCountableConnectionKeySpecifier | (() => undefined | AppExtensionCountableConnectionKeySpecifier),
		fields?: AppExtensionCountableConnectionFieldPolicy,
	},
	AppExtensionCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppExtensionCountableEdgeKeySpecifier | (() => undefined | AppExtensionCountableEdgeKeySpecifier),
		fields?: AppExtensionCountableEdgeFieldPolicy,
	},
	AppExtensionOptionsNewTab?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppExtensionOptionsNewTabKeySpecifier | (() => undefined | AppExtensionOptionsNewTabKeySpecifier),
		fields?: AppExtensionOptionsNewTabFieldPolicy,
	},
	AppExtensionOptionsWidget?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppExtensionOptionsWidgetKeySpecifier | (() => undefined | AppExtensionOptionsWidgetKeySpecifier),
		fields?: AppExtensionOptionsWidgetFieldPolicy,
	},
	AppFetchManifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppFetchManifestKeySpecifier | (() => undefined | AppFetchManifestKeySpecifier),
		fields?: AppFetchManifestFieldPolicy,
	},
	AppInstall?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppInstallKeySpecifier | (() => undefined | AppInstallKeySpecifier),
		fields?: AppInstallFieldPolicy,
	},
	AppInstallation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppInstallationKeySpecifier | (() => undefined | AppInstallationKeySpecifier),
		fields?: AppInstallationFieldPolicy,
	},
	AppInstalled?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppInstalledKeySpecifier | (() => undefined | AppInstalledKeySpecifier),
		fields?: AppInstalledFieldPolicy,
	},
	AppManifestBrand?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppManifestBrandKeySpecifier | (() => undefined | AppManifestBrandKeySpecifier),
		fields?: AppManifestBrandFieldPolicy,
	},
	AppManifestBrandLogo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppManifestBrandLogoKeySpecifier | (() => undefined | AppManifestBrandLogoKeySpecifier),
		fields?: AppManifestBrandLogoFieldPolicy,
	},
	AppManifestExtension?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppManifestExtensionKeySpecifier | (() => undefined | AppManifestExtensionKeySpecifier),
		fields?: AppManifestExtensionFieldPolicy,
	},
	AppManifestRequiredSaleorVersion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppManifestRequiredSaleorVersionKeySpecifier | (() => undefined | AppManifestRequiredSaleorVersionKeySpecifier),
		fields?: AppManifestRequiredSaleorVersionFieldPolicy,
	},
	AppManifestWebhook?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppManifestWebhookKeySpecifier | (() => undefined | AppManifestWebhookKeySpecifier),
		fields?: AppManifestWebhookFieldPolicy,
	},
	AppReenableSyncWebhooks?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppReenableSyncWebhooksKeySpecifier | (() => undefined | AppReenableSyncWebhooksKeySpecifier),
		fields?: AppReenableSyncWebhooksFieldPolicy,
	},
	AppRetryInstall?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppRetryInstallKeySpecifier | (() => undefined | AppRetryInstallKeySpecifier),
		fields?: AppRetryInstallFieldPolicy,
	},
	AppStatusChanged?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppStatusChangedKeySpecifier | (() => undefined | AppStatusChangedKeySpecifier),
		fields?: AppStatusChangedFieldPolicy,
	},
	AppToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenKeySpecifier | (() => undefined | AppTokenKeySpecifier),
		fields?: AppTokenFieldPolicy,
	},
	AppTokenCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenCreateKeySpecifier | (() => undefined | AppTokenCreateKeySpecifier),
		fields?: AppTokenCreateFieldPolicy,
	},
	AppTokenDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenDeleteKeySpecifier | (() => undefined | AppTokenDeleteKeySpecifier),
		fields?: AppTokenDeleteFieldPolicy,
	},
	AppTokenVerify?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenVerifyKeySpecifier | (() => undefined | AppTokenVerifyKeySpecifier),
		fields?: AppTokenVerifyFieldPolicy,
	},
	AppUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppUpdateKeySpecifier | (() => undefined | AppUpdateKeySpecifier),
		fields?: AppUpdateFieldPolicy,
	},
	AppUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppUpdatedKeySpecifier | (() => undefined | AppUpdatedKeySpecifier),
		fields?: AppUpdatedFieldPolicy,
	},
	AssignNavigation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignNavigationKeySpecifier | (() => undefined | AssignNavigationKeySpecifier),
		fields?: AssignNavigationFieldPolicy,
	},
	AssignedAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedAttributeKeySpecifier | (() => undefined | AssignedAttributeKeySpecifier),
		fields?: AssignedAttributeFieldPolicy,
	},
	AssignedBooleanAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedBooleanAttributeKeySpecifier | (() => undefined | AssignedBooleanAttributeKeySpecifier),
		fields?: AssignedBooleanAttributeFieldPolicy,
	},
	AssignedChoiceAttributeValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedChoiceAttributeValueKeySpecifier | (() => undefined | AssignedChoiceAttributeValueKeySpecifier),
		fields?: AssignedChoiceAttributeValueFieldPolicy,
	},
	AssignedDateAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedDateAttributeKeySpecifier | (() => undefined | AssignedDateAttributeKeySpecifier),
		fields?: AssignedDateAttributeFieldPolicy,
	},
	AssignedDateTimeAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedDateTimeAttributeKeySpecifier | (() => undefined | AssignedDateTimeAttributeKeySpecifier),
		fields?: AssignedDateTimeAttributeFieldPolicy,
	},
	AssignedFileAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedFileAttributeKeySpecifier | (() => undefined | AssignedFileAttributeKeySpecifier),
		fields?: AssignedFileAttributeFieldPolicy,
	},
	AssignedMultiCategoryReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedMultiCategoryReferenceAttributeKeySpecifier | (() => undefined | AssignedMultiCategoryReferenceAttributeKeySpecifier),
		fields?: AssignedMultiCategoryReferenceAttributeFieldPolicy,
	},
	AssignedMultiChoiceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedMultiChoiceAttributeKeySpecifier | (() => undefined | AssignedMultiChoiceAttributeKeySpecifier),
		fields?: AssignedMultiChoiceAttributeFieldPolicy,
	},
	AssignedMultiCollectionReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedMultiCollectionReferenceAttributeKeySpecifier | (() => undefined | AssignedMultiCollectionReferenceAttributeKeySpecifier),
		fields?: AssignedMultiCollectionReferenceAttributeFieldPolicy,
	},
	AssignedMultiPageReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedMultiPageReferenceAttributeKeySpecifier | (() => undefined | AssignedMultiPageReferenceAttributeKeySpecifier),
		fields?: AssignedMultiPageReferenceAttributeFieldPolicy,
	},
	AssignedMultiProductReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedMultiProductReferenceAttributeKeySpecifier | (() => undefined | AssignedMultiProductReferenceAttributeKeySpecifier),
		fields?: AssignedMultiProductReferenceAttributeFieldPolicy,
	},
	AssignedMultiProductVariantReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedMultiProductVariantReferenceAttributeKeySpecifier | (() => undefined | AssignedMultiProductVariantReferenceAttributeKeySpecifier),
		fields?: AssignedMultiProductVariantReferenceAttributeFieldPolicy,
	},
	AssignedNumericAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedNumericAttributeKeySpecifier | (() => undefined | AssignedNumericAttributeKeySpecifier),
		fields?: AssignedNumericAttributeFieldPolicy,
	},
	AssignedPlainTextAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedPlainTextAttributeKeySpecifier | (() => undefined | AssignedPlainTextAttributeKeySpecifier),
		fields?: AssignedPlainTextAttributeFieldPolicy,
	},
	AssignedSingleCategoryReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSingleCategoryReferenceAttributeKeySpecifier | (() => undefined | AssignedSingleCategoryReferenceAttributeKeySpecifier),
		fields?: AssignedSingleCategoryReferenceAttributeFieldPolicy,
	},
	AssignedSingleChoiceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSingleChoiceAttributeKeySpecifier | (() => undefined | AssignedSingleChoiceAttributeKeySpecifier),
		fields?: AssignedSingleChoiceAttributeFieldPolicy,
	},
	AssignedSingleCollectionReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSingleCollectionReferenceAttributeKeySpecifier | (() => undefined | AssignedSingleCollectionReferenceAttributeKeySpecifier),
		fields?: AssignedSingleCollectionReferenceAttributeFieldPolicy,
	},
	AssignedSinglePageReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSinglePageReferenceAttributeKeySpecifier | (() => undefined | AssignedSinglePageReferenceAttributeKeySpecifier),
		fields?: AssignedSinglePageReferenceAttributeFieldPolicy,
	},
	AssignedSingleProductReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSingleProductReferenceAttributeKeySpecifier | (() => undefined | AssignedSingleProductReferenceAttributeKeySpecifier),
		fields?: AssignedSingleProductReferenceAttributeFieldPolicy,
	},
	AssignedSingleProductVariantReferenceAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSingleProductVariantReferenceAttributeKeySpecifier | (() => undefined | AssignedSingleProductVariantReferenceAttributeKeySpecifier),
		fields?: AssignedSingleProductVariantReferenceAttributeFieldPolicy,
	},
	AssignedSwatchAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSwatchAttributeKeySpecifier | (() => undefined | AssignedSwatchAttributeKeySpecifier),
		fields?: AssignedSwatchAttributeFieldPolicy,
	},
	AssignedSwatchAttributeValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedSwatchAttributeValueKeySpecifier | (() => undefined | AssignedSwatchAttributeValueKeySpecifier),
		fields?: AssignedSwatchAttributeValueFieldPolicy,
	},
	AssignedTextAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedTextAttributeKeySpecifier | (() => undefined | AssignedTextAttributeKeySpecifier),
		fields?: AssignedTextAttributeFieldPolicy,
	},
	AssignedVariantAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignedVariantAttributeKeySpecifier | (() => undefined | AssignedVariantAttributeKeySpecifier),
		fields?: AssignedVariantAttributeFieldPolicy,
	},
	Attribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeKeySpecifier | (() => undefined | AttributeKeySpecifier),
		fields?: AttributeFieldPolicy,
	},
	AttributeBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkCreateKeySpecifier | (() => undefined | AttributeBulkCreateKeySpecifier),
		fields?: AttributeBulkCreateFieldPolicy,
	},
	AttributeBulkCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkCreateErrorKeySpecifier | (() => undefined | AttributeBulkCreateErrorKeySpecifier),
		fields?: AttributeBulkCreateErrorFieldPolicy,
	},
	AttributeBulkCreateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkCreateResultKeySpecifier | (() => undefined | AttributeBulkCreateResultKeySpecifier),
		fields?: AttributeBulkCreateResultFieldPolicy,
	},
	AttributeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkDeleteKeySpecifier | (() => undefined | AttributeBulkDeleteKeySpecifier),
		fields?: AttributeBulkDeleteFieldPolicy,
	},
	AttributeBulkTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkTranslateKeySpecifier | (() => undefined | AttributeBulkTranslateKeySpecifier),
		fields?: AttributeBulkTranslateFieldPolicy,
	},
	AttributeBulkTranslateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkTranslateErrorKeySpecifier | (() => undefined | AttributeBulkTranslateErrorKeySpecifier),
		fields?: AttributeBulkTranslateErrorFieldPolicy,
	},
	AttributeBulkTranslateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkTranslateResultKeySpecifier | (() => undefined | AttributeBulkTranslateResultKeySpecifier),
		fields?: AttributeBulkTranslateResultFieldPolicy,
	},
	AttributeBulkUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkUpdateKeySpecifier | (() => undefined | AttributeBulkUpdateKeySpecifier),
		fields?: AttributeBulkUpdateFieldPolicy,
	},
	AttributeBulkUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkUpdateErrorKeySpecifier | (() => undefined | AttributeBulkUpdateErrorKeySpecifier),
		fields?: AttributeBulkUpdateErrorFieldPolicy,
	},
	AttributeBulkUpdateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkUpdateResultKeySpecifier | (() => undefined | AttributeBulkUpdateResultKeySpecifier),
		fields?: AttributeBulkUpdateResultFieldPolicy,
	},
	AttributeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCountableConnectionKeySpecifier | (() => undefined | AttributeCountableConnectionKeySpecifier),
		fields?: AttributeCountableConnectionFieldPolicy,
	},
	AttributeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCountableEdgeKeySpecifier | (() => undefined | AttributeCountableEdgeKeySpecifier),
		fields?: AttributeCountableEdgeFieldPolicy,
	},
	AttributeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCreateKeySpecifier | (() => undefined | AttributeCreateKeySpecifier),
		fields?: AttributeCreateFieldPolicy,
	},
	AttributeCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCreatedKeySpecifier | (() => undefined | AttributeCreatedKeySpecifier),
		fields?: AttributeCreatedFieldPolicy,
	},
	AttributeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeDeleteKeySpecifier | (() => undefined | AttributeDeleteKeySpecifier),
		fields?: AttributeDeleteFieldPolicy,
	},
	AttributeDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeDeletedKeySpecifier | (() => undefined | AttributeDeletedKeySpecifier),
		fields?: AttributeDeletedFieldPolicy,
	},
	AttributeError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeErrorKeySpecifier | (() => undefined | AttributeErrorKeySpecifier),
		fields?: AttributeErrorFieldPolicy,
	},
	AttributeReorderValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeReorderValuesKeySpecifier | (() => undefined | AttributeReorderValuesKeySpecifier),
		fields?: AttributeReorderValuesFieldPolicy,
	},
	AttributeTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeTranslatableContentKeySpecifier | (() => undefined | AttributeTranslatableContentKeySpecifier),
		fields?: AttributeTranslatableContentFieldPolicy,
	},
	AttributeTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeTranslateKeySpecifier | (() => undefined | AttributeTranslateKeySpecifier),
		fields?: AttributeTranslateFieldPolicy,
	},
	AttributeTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeTranslationKeySpecifier | (() => undefined | AttributeTranslationKeySpecifier),
		fields?: AttributeTranslationFieldPolicy,
	},
	AttributeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeUpdateKeySpecifier | (() => undefined | AttributeUpdateKeySpecifier),
		fields?: AttributeUpdateFieldPolicy,
	},
	AttributeUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeUpdatedKeySpecifier | (() => undefined | AttributeUpdatedKeySpecifier),
		fields?: AttributeUpdatedFieldPolicy,
	},
	AttributeValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueKeySpecifier | (() => undefined | AttributeValueKeySpecifier),
		fields?: AttributeValueFieldPolicy,
	},
	AttributeValueBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueBulkDeleteKeySpecifier | (() => undefined | AttributeValueBulkDeleteKeySpecifier),
		fields?: AttributeValueBulkDeleteFieldPolicy,
	},
	AttributeValueBulkTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueBulkTranslateKeySpecifier | (() => undefined | AttributeValueBulkTranslateKeySpecifier),
		fields?: AttributeValueBulkTranslateFieldPolicy,
	},
	AttributeValueBulkTranslateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueBulkTranslateErrorKeySpecifier | (() => undefined | AttributeValueBulkTranslateErrorKeySpecifier),
		fields?: AttributeValueBulkTranslateErrorFieldPolicy,
	},
	AttributeValueBulkTranslateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueBulkTranslateResultKeySpecifier | (() => undefined | AttributeValueBulkTranslateResultKeySpecifier),
		fields?: AttributeValueBulkTranslateResultFieldPolicy,
	},
	AttributeValueCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCountableConnectionKeySpecifier | (() => undefined | AttributeValueCountableConnectionKeySpecifier),
		fields?: AttributeValueCountableConnectionFieldPolicy,
	},
	AttributeValueCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCountableEdgeKeySpecifier | (() => undefined | AttributeValueCountableEdgeKeySpecifier),
		fields?: AttributeValueCountableEdgeFieldPolicy,
	},
	AttributeValueCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCreateKeySpecifier | (() => undefined | AttributeValueCreateKeySpecifier),
		fields?: AttributeValueCreateFieldPolicy,
	},
	AttributeValueCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCreatedKeySpecifier | (() => undefined | AttributeValueCreatedKeySpecifier),
		fields?: AttributeValueCreatedFieldPolicy,
	},
	AttributeValueDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueDeleteKeySpecifier | (() => undefined | AttributeValueDeleteKeySpecifier),
		fields?: AttributeValueDeleteFieldPolicy,
	},
	AttributeValueDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueDeletedKeySpecifier | (() => undefined | AttributeValueDeletedKeySpecifier),
		fields?: AttributeValueDeletedFieldPolicy,
	},
	AttributeValueTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueTranslatableContentKeySpecifier | (() => undefined | AttributeValueTranslatableContentKeySpecifier),
		fields?: AttributeValueTranslatableContentFieldPolicy,
	},
	AttributeValueTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueTranslateKeySpecifier | (() => undefined | AttributeValueTranslateKeySpecifier),
		fields?: AttributeValueTranslateFieldPolicy,
	},
	AttributeValueTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueTranslationKeySpecifier | (() => undefined | AttributeValueTranslationKeySpecifier),
		fields?: AttributeValueTranslationFieldPolicy,
	},
	AttributeValueUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueUpdateKeySpecifier | (() => undefined | AttributeValueUpdateKeySpecifier),
		fields?: AttributeValueUpdateFieldPolicy,
	},
	AttributeValueUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueUpdatedKeySpecifier | (() => undefined | AttributeValueUpdatedKeySpecifier),
		fields?: AttributeValueUpdatedFieldPolicy,
	},
	BulkProductError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BulkProductErrorKeySpecifier | (() => undefined | BulkProductErrorKeySpecifier),
		fields?: BulkProductErrorFieldPolicy,
	},
	BulkStockError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BulkStockErrorKeySpecifier | (() => undefined | BulkStockErrorKeySpecifier),
		fields?: BulkStockErrorFieldPolicy,
	},
	CalculateTaxes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CalculateTaxesKeySpecifier | (() => undefined | CalculateTaxesKeySpecifier),
		fields?: CalculateTaxesFieldPolicy,
	},
	CardPaymentMethodDetails?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CardPaymentMethodDetailsKeySpecifier | (() => undefined | CardPaymentMethodDetailsKeySpecifier),
		fields?: CardPaymentMethodDetailsFieldPolicy,
	},
	Category?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryKeySpecifier | (() => undefined | CategoryKeySpecifier),
		fields?: CategoryFieldPolicy,
	},
	CategoryBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryBulkDeleteKeySpecifier | (() => undefined | CategoryBulkDeleteKeySpecifier),
		fields?: CategoryBulkDeleteFieldPolicy,
	},
	CategoryCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCountableConnectionKeySpecifier | (() => undefined | CategoryCountableConnectionKeySpecifier),
		fields?: CategoryCountableConnectionFieldPolicy,
	},
	CategoryCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCountableEdgeKeySpecifier | (() => undefined | CategoryCountableEdgeKeySpecifier),
		fields?: CategoryCountableEdgeFieldPolicy,
	},
	CategoryCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCreateKeySpecifier | (() => undefined | CategoryCreateKeySpecifier),
		fields?: CategoryCreateFieldPolicy,
	},
	CategoryCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCreatedKeySpecifier | (() => undefined | CategoryCreatedKeySpecifier),
		fields?: CategoryCreatedFieldPolicy,
	},
	CategoryDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryDeleteKeySpecifier | (() => undefined | CategoryDeleteKeySpecifier),
		fields?: CategoryDeleteFieldPolicy,
	},
	CategoryDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryDeletedKeySpecifier | (() => undefined | CategoryDeletedKeySpecifier),
		fields?: CategoryDeletedFieldPolicy,
	},
	CategoryTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryTranslatableContentKeySpecifier | (() => undefined | CategoryTranslatableContentKeySpecifier),
		fields?: CategoryTranslatableContentFieldPolicy,
	},
	CategoryTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryTranslateKeySpecifier | (() => undefined | CategoryTranslateKeySpecifier),
		fields?: CategoryTranslateFieldPolicy,
	},
	CategoryTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryTranslationKeySpecifier | (() => undefined | CategoryTranslationKeySpecifier),
		fields?: CategoryTranslationFieldPolicy,
	},
	CategoryUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryUpdateKeySpecifier | (() => undefined | CategoryUpdateKeySpecifier),
		fields?: CategoryUpdateFieldPolicy,
	},
	CategoryUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryUpdatedKeySpecifier | (() => undefined | CategoryUpdatedKeySpecifier),
		fields?: CategoryUpdatedFieldPolicy,
	},
	Channel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelKeySpecifier | (() => undefined | ChannelKeySpecifier),
		fields?: ChannelFieldPolicy,
	},
	ChannelActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelActivateKeySpecifier | (() => undefined | ChannelActivateKeySpecifier),
		fields?: ChannelActivateFieldPolicy,
	},
	ChannelCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelCreateKeySpecifier | (() => undefined | ChannelCreateKeySpecifier),
		fields?: ChannelCreateFieldPolicy,
	},
	ChannelCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelCreatedKeySpecifier | (() => undefined | ChannelCreatedKeySpecifier),
		fields?: ChannelCreatedFieldPolicy,
	},
	ChannelDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelDeactivateKeySpecifier | (() => undefined | ChannelDeactivateKeySpecifier),
		fields?: ChannelDeactivateFieldPolicy,
	},
	ChannelDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelDeleteKeySpecifier | (() => undefined | ChannelDeleteKeySpecifier),
		fields?: ChannelDeleteFieldPolicy,
	},
	ChannelDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelDeletedKeySpecifier | (() => undefined | ChannelDeletedKeySpecifier),
		fields?: ChannelDeletedFieldPolicy,
	},
	ChannelError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelErrorKeySpecifier | (() => undefined | ChannelErrorKeySpecifier),
		fields?: ChannelErrorFieldPolicy,
	},
	ChannelMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelMetadataUpdatedKeySpecifier | (() => undefined | ChannelMetadataUpdatedKeySpecifier),
		fields?: ChannelMetadataUpdatedFieldPolicy,
	},
	ChannelReorderWarehouses?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelReorderWarehousesKeySpecifier | (() => undefined | ChannelReorderWarehousesKeySpecifier),
		fields?: ChannelReorderWarehousesFieldPolicy,
	},
	ChannelStatusChanged?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelStatusChangedKeySpecifier | (() => undefined | ChannelStatusChangedKeySpecifier),
		fields?: ChannelStatusChangedFieldPolicy,
	},
	ChannelUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelUpdateKeySpecifier | (() => undefined | ChannelUpdateKeySpecifier),
		fields?: ChannelUpdateFieldPolicy,
	},
	ChannelUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelUpdatedKeySpecifier | (() => undefined | ChannelUpdatedKeySpecifier),
		fields?: ChannelUpdatedFieldPolicy,
	},
	Checkout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutKeySpecifier | (() => undefined | CheckoutKeySpecifier),
		fields?: CheckoutFieldPolicy,
	},
	CheckoutAddPromoCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutAddPromoCodeKeySpecifier | (() => undefined | CheckoutAddPromoCodeKeySpecifier),
		fields?: CheckoutAddPromoCodeFieldPolicy,
	},
	CheckoutBillingAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutBillingAddressUpdateKeySpecifier | (() => undefined | CheckoutBillingAddressUpdateKeySpecifier),
		fields?: CheckoutBillingAddressUpdateFieldPolicy,
	},
	CheckoutComplete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCompleteKeySpecifier | (() => undefined | CheckoutCompleteKeySpecifier),
		fields?: CheckoutCompleteFieldPolicy,
	},
	CheckoutCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCountableConnectionKeySpecifier | (() => undefined | CheckoutCountableConnectionKeySpecifier),
		fields?: CheckoutCountableConnectionFieldPolicy,
	},
	CheckoutCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCountableEdgeKeySpecifier | (() => undefined | CheckoutCountableEdgeKeySpecifier),
		fields?: CheckoutCountableEdgeFieldPolicy,
	},
	CheckoutCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCreateKeySpecifier | (() => undefined | CheckoutCreateKeySpecifier),
		fields?: CheckoutCreateFieldPolicy,
	},
	CheckoutCreateFromOrder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCreateFromOrderKeySpecifier | (() => undefined | CheckoutCreateFromOrderKeySpecifier),
		fields?: CheckoutCreateFromOrderFieldPolicy,
	},
	CheckoutCreateFromOrderError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCreateFromOrderErrorKeySpecifier | (() => undefined | CheckoutCreateFromOrderErrorKeySpecifier),
		fields?: CheckoutCreateFromOrderErrorFieldPolicy,
	},
	CheckoutCreateFromOrderUnavailableVariant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCreateFromOrderUnavailableVariantKeySpecifier | (() => undefined | CheckoutCreateFromOrderUnavailableVariantKeySpecifier),
		fields?: CheckoutCreateFromOrderUnavailableVariantFieldPolicy,
	},
	CheckoutCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCreatedKeySpecifier | (() => undefined | CheckoutCreatedKeySpecifier),
		fields?: CheckoutCreatedFieldPolicy,
	},
	CheckoutCustomerAttach?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCustomerAttachKeySpecifier | (() => undefined | CheckoutCustomerAttachKeySpecifier),
		fields?: CheckoutCustomerAttachFieldPolicy,
	},
	CheckoutCustomerDetach?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCustomerDetachKeySpecifier | (() => undefined | CheckoutCustomerDetachKeySpecifier),
		fields?: CheckoutCustomerDetachFieldPolicy,
	},
	CheckoutCustomerNoteUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCustomerNoteUpdateKeySpecifier | (() => undefined | CheckoutCustomerNoteUpdateKeySpecifier),
		fields?: CheckoutCustomerNoteUpdateFieldPolicy,
	},
	CheckoutDeliveryMethodUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutDeliveryMethodUpdateKeySpecifier | (() => undefined | CheckoutDeliveryMethodUpdateKeySpecifier),
		fields?: CheckoutDeliveryMethodUpdateFieldPolicy,
	},
	CheckoutEmailUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutEmailUpdateKeySpecifier | (() => undefined | CheckoutEmailUpdateKeySpecifier),
		fields?: CheckoutEmailUpdateFieldPolicy,
	},
	CheckoutError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutErrorKeySpecifier | (() => undefined | CheckoutErrorKeySpecifier),
		fields?: CheckoutErrorFieldPolicy,
	},
	CheckoutFilterShippingMethods?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutFilterShippingMethodsKeySpecifier | (() => undefined | CheckoutFilterShippingMethodsKeySpecifier),
		fields?: CheckoutFilterShippingMethodsFieldPolicy,
	},
	CheckoutFullyAuthorized?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutFullyAuthorizedKeySpecifier | (() => undefined | CheckoutFullyAuthorizedKeySpecifier),
		fields?: CheckoutFullyAuthorizedFieldPolicy,
	},
	CheckoutFullyPaid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutFullyPaidKeySpecifier | (() => undefined | CheckoutFullyPaidKeySpecifier),
		fields?: CheckoutFullyPaidFieldPolicy,
	},
	CheckoutLanguageCodeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLanguageCodeUpdateKeySpecifier | (() => undefined | CheckoutLanguageCodeUpdateKeySpecifier),
		fields?: CheckoutLanguageCodeUpdateFieldPolicy,
	},
	CheckoutLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineKeySpecifier | (() => undefined | CheckoutLineKeySpecifier),
		fields?: CheckoutLineFieldPolicy,
	},
	CheckoutLineCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineCountableConnectionKeySpecifier | (() => undefined | CheckoutLineCountableConnectionKeySpecifier),
		fields?: CheckoutLineCountableConnectionFieldPolicy,
	},
	CheckoutLineCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineCountableEdgeKeySpecifier | (() => undefined | CheckoutLineCountableEdgeKeySpecifier),
		fields?: CheckoutLineCountableEdgeFieldPolicy,
	},
	CheckoutLineDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineDeleteKeySpecifier | (() => undefined | CheckoutLineDeleteKeySpecifier),
		fields?: CheckoutLineDeleteFieldPolicy,
	},
	CheckoutLineProblemInsufficientStock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineProblemInsufficientStockKeySpecifier | (() => undefined | CheckoutLineProblemInsufficientStockKeySpecifier),
		fields?: CheckoutLineProblemInsufficientStockFieldPolicy,
	},
	CheckoutLineProblemVariantNotAvailable?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineProblemVariantNotAvailableKeySpecifier | (() => undefined | CheckoutLineProblemVariantNotAvailableKeySpecifier),
		fields?: CheckoutLineProblemVariantNotAvailableFieldPolicy,
	},
	CheckoutLinesAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLinesAddKeySpecifier | (() => undefined | CheckoutLinesAddKeySpecifier),
		fields?: CheckoutLinesAddFieldPolicy,
	},
	CheckoutLinesDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLinesDeleteKeySpecifier | (() => undefined | CheckoutLinesDeleteKeySpecifier),
		fields?: CheckoutLinesDeleteFieldPolicy,
	},
	CheckoutLinesUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLinesUpdateKeySpecifier | (() => undefined | CheckoutLinesUpdateKeySpecifier),
		fields?: CheckoutLinesUpdateFieldPolicy,
	},
	CheckoutMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutMetadataUpdatedKeySpecifier | (() => undefined | CheckoutMetadataUpdatedKeySpecifier),
		fields?: CheckoutMetadataUpdatedFieldPolicy,
	},
	CheckoutPaymentCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutPaymentCreateKeySpecifier | (() => undefined | CheckoutPaymentCreateKeySpecifier),
		fields?: CheckoutPaymentCreateFieldPolicy,
	},
	CheckoutRemovePromoCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutRemovePromoCodeKeySpecifier | (() => undefined | CheckoutRemovePromoCodeKeySpecifier),
		fields?: CheckoutRemovePromoCodeFieldPolicy,
	},
	CheckoutSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutSettingsKeySpecifier | (() => undefined | CheckoutSettingsKeySpecifier),
		fields?: CheckoutSettingsFieldPolicy,
	},
	CheckoutShippingAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutShippingAddressUpdateKeySpecifier | (() => undefined | CheckoutShippingAddressUpdateKeySpecifier),
		fields?: CheckoutShippingAddressUpdateFieldPolicy,
	},
	CheckoutShippingMethodUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutShippingMethodUpdateKeySpecifier | (() => undefined | CheckoutShippingMethodUpdateKeySpecifier),
		fields?: CheckoutShippingMethodUpdateFieldPolicy,
	},
	CheckoutUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutUpdatedKeySpecifier | (() => undefined | CheckoutUpdatedKeySpecifier),
		fields?: CheckoutUpdatedFieldPolicy,
	},
	ChoiceValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChoiceValueKeySpecifier | (() => undefined | ChoiceValueKeySpecifier),
		fields?: ChoiceValueFieldPolicy,
	},
	Collection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionKeySpecifier | (() => undefined | CollectionKeySpecifier),
		fields?: CollectionFieldPolicy,
	},
	CollectionAddProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionAddProductsKeySpecifier | (() => undefined | CollectionAddProductsKeySpecifier),
		fields?: CollectionAddProductsFieldPolicy,
	},
	CollectionBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionBulkDeleteKeySpecifier | (() => undefined | CollectionBulkDeleteKeySpecifier),
		fields?: CollectionBulkDeleteFieldPolicy,
	},
	CollectionChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionChannelListingKeySpecifier | (() => undefined | CollectionChannelListingKeySpecifier),
		fields?: CollectionChannelListingFieldPolicy,
	},
	CollectionChannelListingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionChannelListingErrorKeySpecifier | (() => undefined | CollectionChannelListingErrorKeySpecifier),
		fields?: CollectionChannelListingErrorFieldPolicy,
	},
	CollectionChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionChannelListingUpdateKeySpecifier | (() => undefined | CollectionChannelListingUpdateKeySpecifier),
		fields?: CollectionChannelListingUpdateFieldPolicy,
	},
	CollectionCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCountableConnectionKeySpecifier | (() => undefined | CollectionCountableConnectionKeySpecifier),
		fields?: CollectionCountableConnectionFieldPolicy,
	},
	CollectionCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCountableEdgeKeySpecifier | (() => undefined | CollectionCountableEdgeKeySpecifier),
		fields?: CollectionCountableEdgeFieldPolicy,
	},
	CollectionCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCreateKeySpecifier | (() => undefined | CollectionCreateKeySpecifier),
		fields?: CollectionCreateFieldPolicy,
	},
	CollectionCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCreatedKeySpecifier | (() => undefined | CollectionCreatedKeySpecifier),
		fields?: CollectionCreatedFieldPolicy,
	},
	CollectionDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionDeleteKeySpecifier | (() => undefined | CollectionDeleteKeySpecifier),
		fields?: CollectionDeleteFieldPolicy,
	},
	CollectionDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionDeletedKeySpecifier | (() => undefined | CollectionDeletedKeySpecifier),
		fields?: CollectionDeletedFieldPolicy,
	},
	CollectionError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionErrorKeySpecifier | (() => undefined | CollectionErrorKeySpecifier),
		fields?: CollectionErrorFieldPolicy,
	},
	CollectionMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionMetadataUpdatedKeySpecifier | (() => undefined | CollectionMetadataUpdatedKeySpecifier),
		fields?: CollectionMetadataUpdatedFieldPolicy,
	},
	CollectionRemoveProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionRemoveProductsKeySpecifier | (() => undefined | CollectionRemoveProductsKeySpecifier),
		fields?: CollectionRemoveProductsFieldPolicy,
	},
	CollectionReorderProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionReorderProductsKeySpecifier | (() => undefined | CollectionReorderProductsKeySpecifier),
		fields?: CollectionReorderProductsFieldPolicy,
	},
	CollectionTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionTranslatableContentKeySpecifier | (() => undefined | CollectionTranslatableContentKeySpecifier),
		fields?: CollectionTranslatableContentFieldPolicy,
	},
	CollectionTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionTranslateKeySpecifier | (() => undefined | CollectionTranslateKeySpecifier),
		fields?: CollectionTranslateFieldPolicy,
	},
	CollectionTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionTranslationKeySpecifier | (() => undefined | CollectionTranslationKeySpecifier),
		fields?: CollectionTranslationFieldPolicy,
	},
	CollectionUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionUpdateKeySpecifier | (() => undefined | CollectionUpdateKeySpecifier),
		fields?: CollectionUpdateFieldPolicy,
	},
	CollectionUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionUpdatedKeySpecifier | (() => undefined | CollectionUpdatedKeySpecifier),
		fields?: CollectionUpdatedFieldPolicy,
	},
	ConfigurationItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConfigurationItemKeySpecifier | (() => undefined | ConfigurationItemKeySpecifier),
		fields?: ConfigurationItemFieldPolicy,
	},
	ConfirmAccount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConfirmAccountKeySpecifier | (() => undefined | ConfirmAccountKeySpecifier),
		fields?: ConfirmAccountFieldPolicy,
	},
	ConfirmEmailChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConfirmEmailChangeKeySpecifier | (() => undefined | ConfirmEmailChangeKeySpecifier),
		fields?: ConfirmEmailChangeFieldPolicy,
	},
	CountryDisplay?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CountryDisplayKeySpecifier | (() => undefined | CountryDisplayKeySpecifier),
		fields?: CountryDisplayFieldPolicy,
	},
	CreateToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateTokenKeySpecifier | (() => undefined | CreateTokenKeySpecifier),
		fields?: CreateTokenFieldPolicy,
	},
	CreditCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreditCardKeySpecifier | (() => undefined | CreditCardKeySpecifier),
		fields?: CreditCardFieldPolicy,
	},
	CustomerBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerBulkDeleteKeySpecifier | (() => undefined | CustomerBulkDeleteKeySpecifier),
		fields?: CustomerBulkDeleteFieldPolicy,
	},
	CustomerBulkResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerBulkResultKeySpecifier | (() => undefined | CustomerBulkResultKeySpecifier),
		fields?: CustomerBulkResultFieldPolicy,
	},
	CustomerBulkUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerBulkUpdateKeySpecifier | (() => undefined | CustomerBulkUpdateKeySpecifier),
		fields?: CustomerBulkUpdateFieldPolicy,
	},
	CustomerBulkUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerBulkUpdateErrorKeySpecifier | (() => undefined | CustomerBulkUpdateErrorKeySpecifier),
		fields?: CustomerBulkUpdateErrorFieldPolicy,
	},
	CustomerCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerCreateKeySpecifier | (() => undefined | CustomerCreateKeySpecifier),
		fields?: CustomerCreateFieldPolicy,
	},
	CustomerCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerCreatedKeySpecifier | (() => undefined | CustomerCreatedKeySpecifier),
		fields?: CustomerCreatedFieldPolicy,
	},
	CustomerDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerDeleteKeySpecifier | (() => undefined | CustomerDeleteKeySpecifier),
		fields?: CustomerDeleteFieldPolicy,
	},
	CustomerEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerEventKeySpecifier | (() => undefined | CustomerEventKeySpecifier),
		fields?: CustomerEventFieldPolicy,
	},
	CustomerMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerMetadataUpdatedKeySpecifier | (() => undefined | CustomerMetadataUpdatedKeySpecifier),
		fields?: CustomerMetadataUpdatedFieldPolicy,
	},
	CustomerUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerUpdateKeySpecifier | (() => undefined | CustomerUpdateKeySpecifier),
		fields?: CustomerUpdateFieldPolicy,
	},
	CustomerUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerUpdatedKeySpecifier | (() => undefined | CustomerUpdatedKeySpecifier),
		fields?: CustomerUpdatedFieldPolicy,
	},
	DeactivateAllUserTokens?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeactivateAllUserTokensKeySpecifier | (() => undefined | DeactivateAllUserTokensKeySpecifier),
		fields?: DeactivateAllUserTokensFieldPolicy,
	},
	DeleteMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteMetadataKeySpecifier | (() => undefined | DeleteMetadataKeySpecifier),
		fields?: DeleteMetadataFieldPolicy,
	},
	DeletePrivateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeletePrivateMetadataKeySpecifier | (() => undefined | DeletePrivateMetadataKeySpecifier),
		fields?: DeletePrivateMetadataFieldPolicy,
	},
	DigitalContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentKeySpecifier | (() => undefined | DigitalContentKeySpecifier),
		fields?: DigitalContentFieldPolicy,
	},
	DigitalContentCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentCountableConnectionKeySpecifier | (() => undefined | DigitalContentCountableConnectionKeySpecifier),
		fields?: DigitalContentCountableConnectionFieldPolicy,
	},
	DigitalContentCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentCountableEdgeKeySpecifier | (() => undefined | DigitalContentCountableEdgeKeySpecifier),
		fields?: DigitalContentCountableEdgeFieldPolicy,
	},
	DigitalContentCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentCreateKeySpecifier | (() => undefined | DigitalContentCreateKeySpecifier),
		fields?: DigitalContentCreateFieldPolicy,
	},
	DigitalContentDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentDeleteKeySpecifier | (() => undefined | DigitalContentDeleteKeySpecifier),
		fields?: DigitalContentDeleteFieldPolicy,
	},
	DigitalContentUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentUpdateKeySpecifier | (() => undefined | DigitalContentUpdateKeySpecifier),
		fields?: DigitalContentUpdateFieldPolicy,
	},
	DigitalContentUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentUrlKeySpecifier | (() => undefined | DigitalContentUrlKeySpecifier),
		fields?: DigitalContentUrlFieldPolicy,
	},
	DigitalContentUrlCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentUrlCreateKeySpecifier | (() => undefined | DigitalContentUrlCreateKeySpecifier),
		fields?: DigitalContentUrlCreateFieldPolicy,
	},
	DiscountError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DiscountErrorKeySpecifier | (() => undefined | DiscountErrorKeySpecifier),
		fields?: DiscountErrorFieldPolicy,
	},
	Domain?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DomainKeySpecifier | (() => undefined | DomainKeySpecifier),
		fields?: DomainFieldPolicy,
	},
	DraftOrderBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderBulkDeleteKeySpecifier | (() => undefined | DraftOrderBulkDeleteKeySpecifier),
		fields?: DraftOrderBulkDeleteFieldPolicy,
	},
	DraftOrderComplete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderCompleteKeySpecifier | (() => undefined | DraftOrderCompleteKeySpecifier),
		fields?: DraftOrderCompleteFieldPolicy,
	},
	DraftOrderCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderCreateKeySpecifier | (() => undefined | DraftOrderCreateKeySpecifier),
		fields?: DraftOrderCreateFieldPolicy,
	},
	DraftOrderCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderCreatedKeySpecifier | (() => undefined | DraftOrderCreatedKeySpecifier),
		fields?: DraftOrderCreatedFieldPolicy,
	},
	DraftOrderDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderDeleteKeySpecifier | (() => undefined | DraftOrderDeleteKeySpecifier),
		fields?: DraftOrderDeleteFieldPolicy,
	},
	DraftOrderDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderDeletedKeySpecifier | (() => undefined | DraftOrderDeletedKeySpecifier),
		fields?: DraftOrderDeletedFieldPolicy,
	},
	DraftOrderLinesBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderLinesBulkDeleteKeySpecifier | (() => undefined | DraftOrderLinesBulkDeleteKeySpecifier),
		fields?: DraftOrderLinesBulkDeleteFieldPolicy,
	},
	DraftOrderUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderUpdateKeySpecifier | (() => undefined | DraftOrderUpdateKeySpecifier),
		fields?: DraftOrderUpdateFieldPolicy,
	},
	DraftOrderUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderUpdatedKeySpecifier | (() => undefined | DraftOrderUpdatedKeySpecifier),
		fields?: DraftOrderUpdatedFieldPolicy,
	},
	Event?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventKeySpecifier | (() => undefined | EventKeySpecifier),
		fields?: EventFieldPolicy,
	},
	EventDelivery?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryKeySpecifier | (() => undefined | EventDeliveryKeySpecifier),
		fields?: EventDeliveryFieldPolicy,
	},
	EventDeliveryAttempt?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryAttemptKeySpecifier | (() => undefined | EventDeliveryAttemptKeySpecifier),
		fields?: EventDeliveryAttemptFieldPolicy,
	},
	EventDeliveryAttemptCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryAttemptCountableConnectionKeySpecifier | (() => undefined | EventDeliveryAttemptCountableConnectionKeySpecifier),
		fields?: EventDeliveryAttemptCountableConnectionFieldPolicy,
	},
	EventDeliveryAttemptCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryAttemptCountableEdgeKeySpecifier | (() => undefined | EventDeliveryAttemptCountableEdgeKeySpecifier),
		fields?: EventDeliveryAttemptCountableEdgeFieldPolicy,
	},
	EventDeliveryCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryCountableConnectionKeySpecifier | (() => undefined | EventDeliveryCountableConnectionKeySpecifier),
		fields?: EventDeliveryCountableConnectionFieldPolicy,
	},
	EventDeliveryCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryCountableEdgeKeySpecifier | (() => undefined | EventDeliveryCountableEdgeKeySpecifier),
		fields?: EventDeliveryCountableEdgeFieldPolicy,
	},
	EventDeliveryRetry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventDeliveryRetryKeySpecifier | (() => undefined | EventDeliveryRetryKeySpecifier),
		fields?: EventDeliveryRetryFieldPolicy,
	},
	ExportError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportErrorKeySpecifier | (() => undefined | ExportErrorKeySpecifier),
		fields?: ExportErrorFieldPolicy,
	},
	ExportEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportEventKeySpecifier | (() => undefined | ExportEventKeySpecifier),
		fields?: ExportEventFieldPolicy,
	},
	ExportFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportFileKeySpecifier | (() => undefined | ExportFileKeySpecifier),
		fields?: ExportFileFieldPolicy,
	},
	ExportFileCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportFileCountableConnectionKeySpecifier | (() => undefined | ExportFileCountableConnectionKeySpecifier),
		fields?: ExportFileCountableConnectionFieldPolicy,
	},
	ExportFileCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportFileCountableEdgeKeySpecifier | (() => undefined | ExportFileCountableEdgeKeySpecifier),
		fields?: ExportFileCountableEdgeFieldPolicy,
	},
	ExportGiftCards?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportGiftCardsKeySpecifier | (() => undefined | ExportGiftCardsKeySpecifier),
		fields?: ExportGiftCardsFieldPolicy,
	},
	ExportProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportProductsKeySpecifier | (() => undefined | ExportProductsKeySpecifier),
		fields?: ExportProductsFieldPolicy,
	},
	ExportVoucherCodes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportVoucherCodesKeySpecifier | (() => undefined | ExportVoucherCodesKeySpecifier),
		fields?: ExportVoucherCodesFieldPolicy,
	},
	ExternalAuthentication?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalAuthenticationKeySpecifier | (() => undefined | ExternalAuthenticationKeySpecifier),
		fields?: ExternalAuthenticationFieldPolicy,
	},
	ExternalAuthenticationUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalAuthenticationUrlKeySpecifier | (() => undefined | ExternalAuthenticationUrlKeySpecifier),
		fields?: ExternalAuthenticationUrlFieldPolicy,
	},
	ExternalLogout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalLogoutKeySpecifier | (() => undefined | ExternalLogoutKeySpecifier),
		fields?: ExternalLogoutFieldPolicy,
	},
	ExternalNotificationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalNotificationErrorKeySpecifier | (() => undefined | ExternalNotificationErrorKeySpecifier),
		fields?: ExternalNotificationErrorFieldPolicy,
	},
	ExternalNotificationTrigger?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalNotificationTriggerKeySpecifier | (() => undefined | ExternalNotificationTriggerKeySpecifier),
		fields?: ExternalNotificationTriggerFieldPolicy,
	},
	ExternalObtainAccessTokens?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalObtainAccessTokensKeySpecifier | (() => undefined | ExternalObtainAccessTokensKeySpecifier),
		fields?: ExternalObtainAccessTokensFieldPolicy,
	},
	ExternalRefresh?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalRefreshKeySpecifier | (() => undefined | ExternalRefreshKeySpecifier),
		fields?: ExternalRefreshFieldPolicy,
	},
	ExternalVerify?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalVerifyKeySpecifier | (() => undefined | ExternalVerifyKeySpecifier),
		fields?: ExternalVerifyFieldPolicy,
	},
	File?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	FileUpload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileUploadKeySpecifier | (() => undefined | FileUploadKeySpecifier),
		fields?: FileUploadFieldPolicy,
	},
	Fulfillment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentKeySpecifier | (() => undefined | FulfillmentKeySpecifier),
		fields?: FulfillmentFieldPolicy,
	},
	FulfillmentApprove?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentApproveKeySpecifier | (() => undefined | FulfillmentApproveKeySpecifier),
		fields?: FulfillmentApproveFieldPolicy,
	},
	FulfillmentApproved?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentApprovedKeySpecifier | (() => undefined | FulfillmentApprovedKeySpecifier),
		fields?: FulfillmentApprovedFieldPolicy,
	},
	FulfillmentCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentCancelKeySpecifier | (() => undefined | FulfillmentCancelKeySpecifier),
		fields?: FulfillmentCancelFieldPolicy,
	},
	FulfillmentCanceled?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentCanceledKeySpecifier | (() => undefined | FulfillmentCanceledKeySpecifier),
		fields?: FulfillmentCanceledFieldPolicy,
	},
	FulfillmentCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentCreatedKeySpecifier | (() => undefined | FulfillmentCreatedKeySpecifier),
		fields?: FulfillmentCreatedFieldPolicy,
	},
	FulfillmentLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentLineKeySpecifier | (() => undefined | FulfillmentLineKeySpecifier),
		fields?: FulfillmentLineFieldPolicy,
	},
	FulfillmentMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentMetadataUpdatedKeySpecifier | (() => undefined | FulfillmentMetadataUpdatedKeySpecifier),
		fields?: FulfillmentMetadataUpdatedFieldPolicy,
	},
	FulfillmentRefundProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentRefundProductsKeySpecifier | (() => undefined | FulfillmentRefundProductsKeySpecifier),
		fields?: FulfillmentRefundProductsFieldPolicy,
	},
	FulfillmentReturnProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentReturnProductsKeySpecifier | (() => undefined | FulfillmentReturnProductsKeySpecifier),
		fields?: FulfillmentReturnProductsFieldPolicy,
	},
	FulfillmentTrackingNumberUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentTrackingNumberUpdatedKeySpecifier | (() => undefined | FulfillmentTrackingNumberUpdatedKeySpecifier),
		fields?: FulfillmentTrackingNumberUpdatedFieldPolicy,
	},
	FulfillmentUpdateTracking?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentUpdateTrackingKeySpecifier | (() => undefined | FulfillmentUpdateTrackingKeySpecifier),
		fields?: FulfillmentUpdateTrackingFieldPolicy,
	},
	GatewayConfigLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GatewayConfigLineKeySpecifier | (() => undefined | GatewayConfigLineKeySpecifier),
		fields?: GatewayConfigLineFieldPolicy,
	},
	GiftCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardKeySpecifier | (() => undefined | GiftCardKeySpecifier),
		fields?: GiftCardFieldPolicy,
	},
	GiftCardActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardActivateKeySpecifier | (() => undefined | GiftCardActivateKeySpecifier),
		fields?: GiftCardActivateFieldPolicy,
	},
	GiftCardAddNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardAddNoteKeySpecifier | (() => undefined | GiftCardAddNoteKeySpecifier),
		fields?: GiftCardAddNoteFieldPolicy,
	},
	GiftCardBulkActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardBulkActivateKeySpecifier | (() => undefined | GiftCardBulkActivateKeySpecifier),
		fields?: GiftCardBulkActivateFieldPolicy,
	},
	GiftCardBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardBulkCreateKeySpecifier | (() => undefined | GiftCardBulkCreateKeySpecifier),
		fields?: GiftCardBulkCreateFieldPolicy,
	},
	GiftCardBulkDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardBulkDeactivateKeySpecifier | (() => undefined | GiftCardBulkDeactivateKeySpecifier),
		fields?: GiftCardBulkDeactivateFieldPolicy,
	},
	GiftCardBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardBulkDeleteKeySpecifier | (() => undefined | GiftCardBulkDeleteKeySpecifier),
		fields?: GiftCardBulkDeleteFieldPolicy,
	},
	GiftCardCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCountableConnectionKeySpecifier | (() => undefined | GiftCardCountableConnectionKeySpecifier),
		fields?: GiftCardCountableConnectionFieldPolicy,
	},
	GiftCardCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCountableEdgeKeySpecifier | (() => undefined | GiftCardCountableEdgeKeySpecifier),
		fields?: GiftCardCountableEdgeFieldPolicy,
	},
	GiftCardCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCreateKeySpecifier | (() => undefined | GiftCardCreateKeySpecifier),
		fields?: GiftCardCreateFieldPolicy,
	},
	GiftCardCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCreatedKeySpecifier | (() => undefined | GiftCardCreatedKeySpecifier),
		fields?: GiftCardCreatedFieldPolicy,
	},
	GiftCardDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardDeactivateKeySpecifier | (() => undefined | GiftCardDeactivateKeySpecifier),
		fields?: GiftCardDeactivateFieldPolicy,
	},
	GiftCardDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardDeleteKeySpecifier | (() => undefined | GiftCardDeleteKeySpecifier),
		fields?: GiftCardDeleteFieldPolicy,
	},
	GiftCardDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardDeletedKeySpecifier | (() => undefined | GiftCardDeletedKeySpecifier),
		fields?: GiftCardDeletedFieldPolicy,
	},
	GiftCardError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardErrorKeySpecifier | (() => undefined | GiftCardErrorKeySpecifier),
		fields?: GiftCardErrorFieldPolicy,
	},
	GiftCardEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardEventKeySpecifier | (() => undefined | GiftCardEventKeySpecifier),
		fields?: GiftCardEventFieldPolicy,
	},
	GiftCardEventBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardEventBalanceKeySpecifier | (() => undefined | GiftCardEventBalanceKeySpecifier),
		fields?: GiftCardEventBalanceFieldPolicy,
	},
	GiftCardExportCompleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardExportCompletedKeySpecifier | (() => undefined | GiftCardExportCompletedKeySpecifier),
		fields?: GiftCardExportCompletedFieldPolicy,
	},
	GiftCardMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardMetadataUpdatedKeySpecifier | (() => undefined | GiftCardMetadataUpdatedKeySpecifier),
		fields?: GiftCardMetadataUpdatedFieldPolicy,
	},
	GiftCardResend?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardResendKeySpecifier | (() => undefined | GiftCardResendKeySpecifier),
		fields?: GiftCardResendFieldPolicy,
	},
	GiftCardSent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardSentKeySpecifier | (() => undefined | GiftCardSentKeySpecifier),
		fields?: GiftCardSentFieldPolicy,
	},
	GiftCardSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardSettingsKeySpecifier | (() => undefined | GiftCardSettingsKeySpecifier),
		fields?: GiftCardSettingsFieldPolicy,
	},
	GiftCardSettingsError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardSettingsErrorKeySpecifier | (() => undefined | GiftCardSettingsErrorKeySpecifier),
		fields?: GiftCardSettingsErrorFieldPolicy,
	},
	GiftCardSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardSettingsUpdateKeySpecifier | (() => undefined | GiftCardSettingsUpdateKeySpecifier),
		fields?: GiftCardSettingsUpdateFieldPolicy,
	},
	GiftCardStatusChanged?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardStatusChangedKeySpecifier | (() => undefined | GiftCardStatusChangedKeySpecifier),
		fields?: GiftCardStatusChangedFieldPolicy,
	},
	GiftCardTag?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardTagKeySpecifier | (() => undefined | GiftCardTagKeySpecifier),
		fields?: GiftCardTagFieldPolicy,
	},
	GiftCardTagCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardTagCountableConnectionKeySpecifier | (() => undefined | GiftCardTagCountableConnectionKeySpecifier),
		fields?: GiftCardTagCountableConnectionFieldPolicy,
	},
	GiftCardTagCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardTagCountableEdgeKeySpecifier | (() => undefined | GiftCardTagCountableEdgeKeySpecifier),
		fields?: GiftCardTagCountableEdgeFieldPolicy,
	},
	GiftCardUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardUpdateKeySpecifier | (() => undefined | GiftCardUpdateKeySpecifier),
		fields?: GiftCardUpdateFieldPolicy,
	},
	GiftCardUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardUpdatedKeySpecifier | (() => undefined | GiftCardUpdatedKeySpecifier),
		fields?: GiftCardUpdatedFieldPolicy,
	},
	Group?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupKeySpecifier | (() => undefined | GroupKeySpecifier),
		fields?: GroupFieldPolicy,
	},
	GroupCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupCountableConnectionKeySpecifier | (() => undefined | GroupCountableConnectionKeySpecifier),
		fields?: GroupCountableConnectionFieldPolicy,
	},
	GroupCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupCountableEdgeKeySpecifier | (() => undefined | GroupCountableEdgeKeySpecifier),
		fields?: GroupCountableEdgeFieldPolicy,
	},
	Image?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ImageKeySpecifier | (() => undefined | ImageKeySpecifier),
		fields?: ImageFieldPolicy,
	},
	Invoice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceKeySpecifier | (() => undefined | InvoiceKeySpecifier),
		fields?: InvoiceFieldPolicy,
	},
	InvoiceCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceCreateKeySpecifier | (() => undefined | InvoiceCreateKeySpecifier),
		fields?: InvoiceCreateFieldPolicy,
	},
	InvoiceDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceDeleteKeySpecifier | (() => undefined | InvoiceDeleteKeySpecifier),
		fields?: InvoiceDeleteFieldPolicy,
	},
	InvoiceDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceDeletedKeySpecifier | (() => undefined | InvoiceDeletedKeySpecifier),
		fields?: InvoiceDeletedFieldPolicy,
	},
	InvoiceError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceErrorKeySpecifier | (() => undefined | InvoiceErrorKeySpecifier),
		fields?: InvoiceErrorFieldPolicy,
	},
	InvoiceRequest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceRequestKeySpecifier | (() => undefined | InvoiceRequestKeySpecifier),
		fields?: InvoiceRequestFieldPolicy,
	},
	InvoiceRequestDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceRequestDeleteKeySpecifier | (() => undefined | InvoiceRequestDeleteKeySpecifier),
		fields?: InvoiceRequestDeleteFieldPolicy,
	},
	InvoiceRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceRequestedKeySpecifier | (() => undefined | InvoiceRequestedKeySpecifier),
		fields?: InvoiceRequestedFieldPolicy,
	},
	InvoiceSendNotification?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceSendNotificationKeySpecifier | (() => undefined | InvoiceSendNotificationKeySpecifier),
		fields?: InvoiceSendNotificationFieldPolicy,
	},
	InvoiceSent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceSentKeySpecifier | (() => undefined | InvoiceSentKeySpecifier),
		fields?: InvoiceSentFieldPolicy,
	},
	InvoiceUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceUpdateKeySpecifier | (() => undefined | InvoiceUpdateKeySpecifier),
		fields?: InvoiceUpdateFieldPolicy,
	},
	Job?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JobKeySpecifier | (() => undefined | JobKeySpecifier),
		fields?: JobFieldPolicy,
	},
	LanguageDisplay?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LanguageDisplayKeySpecifier | (() => undefined | LanguageDisplayKeySpecifier),
		fields?: LanguageDisplayFieldPolicy,
	},
	LimitInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LimitInfoKeySpecifier | (() => undefined | LimitInfoKeySpecifier),
		fields?: LimitInfoFieldPolicy,
	},
	Limits?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LimitsKeySpecifier | (() => undefined | LimitsKeySpecifier),
		fields?: LimitsFieldPolicy,
	},
	ListStoredPaymentMethods?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ListStoredPaymentMethodsKeySpecifier | (() => undefined | ListStoredPaymentMethodsKeySpecifier),
		fields?: ListStoredPaymentMethodsFieldPolicy,
	},
	Manifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ManifestKeySpecifier | (() => undefined | ManifestKeySpecifier),
		fields?: ManifestFieldPolicy,
	},
	Margin?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MarginKeySpecifier | (() => undefined | MarginKeySpecifier),
		fields?: MarginFieldPolicy,
	},
	Menu?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuKeySpecifier | (() => undefined | MenuKeySpecifier),
		fields?: MenuFieldPolicy,
	},
	MenuBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuBulkDeleteKeySpecifier | (() => undefined | MenuBulkDeleteKeySpecifier),
		fields?: MenuBulkDeleteFieldPolicy,
	},
	MenuCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCountableConnectionKeySpecifier | (() => undefined | MenuCountableConnectionKeySpecifier),
		fields?: MenuCountableConnectionFieldPolicy,
	},
	MenuCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCountableEdgeKeySpecifier | (() => undefined | MenuCountableEdgeKeySpecifier),
		fields?: MenuCountableEdgeFieldPolicy,
	},
	MenuCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCreateKeySpecifier | (() => undefined | MenuCreateKeySpecifier),
		fields?: MenuCreateFieldPolicy,
	},
	MenuCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCreatedKeySpecifier | (() => undefined | MenuCreatedKeySpecifier),
		fields?: MenuCreatedFieldPolicy,
	},
	MenuDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuDeleteKeySpecifier | (() => undefined | MenuDeleteKeySpecifier),
		fields?: MenuDeleteFieldPolicy,
	},
	MenuDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuDeletedKeySpecifier | (() => undefined | MenuDeletedKeySpecifier),
		fields?: MenuDeletedFieldPolicy,
	},
	MenuError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuErrorKeySpecifier | (() => undefined | MenuErrorKeySpecifier),
		fields?: MenuErrorFieldPolicy,
	},
	MenuItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemKeySpecifier | (() => undefined | MenuItemKeySpecifier),
		fields?: MenuItemFieldPolicy,
	},
	MenuItemBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemBulkDeleteKeySpecifier | (() => undefined | MenuItemBulkDeleteKeySpecifier),
		fields?: MenuItemBulkDeleteFieldPolicy,
	},
	MenuItemCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCountableConnectionKeySpecifier | (() => undefined | MenuItemCountableConnectionKeySpecifier),
		fields?: MenuItemCountableConnectionFieldPolicy,
	},
	MenuItemCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCountableEdgeKeySpecifier | (() => undefined | MenuItemCountableEdgeKeySpecifier),
		fields?: MenuItemCountableEdgeFieldPolicy,
	},
	MenuItemCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCreateKeySpecifier | (() => undefined | MenuItemCreateKeySpecifier),
		fields?: MenuItemCreateFieldPolicy,
	},
	MenuItemCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCreatedKeySpecifier | (() => undefined | MenuItemCreatedKeySpecifier),
		fields?: MenuItemCreatedFieldPolicy,
	},
	MenuItemDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemDeleteKeySpecifier | (() => undefined | MenuItemDeleteKeySpecifier),
		fields?: MenuItemDeleteFieldPolicy,
	},
	MenuItemDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemDeletedKeySpecifier | (() => undefined | MenuItemDeletedKeySpecifier),
		fields?: MenuItemDeletedFieldPolicy,
	},
	MenuItemMove?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemMoveKeySpecifier | (() => undefined | MenuItemMoveKeySpecifier),
		fields?: MenuItemMoveFieldPolicy,
	},
	MenuItemTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemTranslatableContentKeySpecifier | (() => undefined | MenuItemTranslatableContentKeySpecifier),
		fields?: MenuItemTranslatableContentFieldPolicy,
	},
	MenuItemTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemTranslateKeySpecifier | (() => undefined | MenuItemTranslateKeySpecifier),
		fields?: MenuItemTranslateFieldPolicy,
	},
	MenuItemTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemTranslationKeySpecifier | (() => undefined | MenuItemTranslationKeySpecifier),
		fields?: MenuItemTranslationFieldPolicy,
	},
	MenuItemUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemUpdateKeySpecifier | (() => undefined | MenuItemUpdateKeySpecifier),
		fields?: MenuItemUpdateFieldPolicy,
	},
	MenuItemUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemUpdatedKeySpecifier | (() => undefined | MenuItemUpdatedKeySpecifier),
		fields?: MenuItemUpdatedFieldPolicy,
	},
	MenuUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuUpdateKeySpecifier | (() => undefined | MenuUpdateKeySpecifier),
		fields?: MenuUpdateFieldPolicy,
	},
	MenuUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuUpdatedKeySpecifier | (() => undefined | MenuUpdatedKeySpecifier),
		fields?: MenuUpdatedFieldPolicy,
	},
	MetadataError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MetadataErrorKeySpecifier | (() => undefined | MetadataErrorKeySpecifier),
		fields?: MetadataErrorFieldPolicy,
	},
	MetadataItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MetadataItemKeySpecifier | (() => undefined | MetadataItemKeySpecifier),
		fields?: MetadataItemFieldPolicy,
	},
	Money?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MoneyKeySpecifier | (() => undefined | MoneyKeySpecifier),
		fields?: MoneyFieldPolicy,
	},
	MoneyRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MoneyRangeKeySpecifier | (() => undefined | MoneyRangeKeySpecifier),
		fields?: MoneyRangeFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	NewTabTargetOptions?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NewTabTargetOptionsKeySpecifier | (() => undefined | NewTabTargetOptionsKeySpecifier),
		fields?: NewTabTargetOptionsFieldPolicy,
	},
	Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier),
		fields?: NodeFieldPolicy,
	},
	ObjectWithAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ObjectWithAttributesKeySpecifier | (() => undefined | ObjectWithAttributesKeySpecifier),
		fields?: ObjectWithAttributesFieldPolicy,
	},
	ObjectWithMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ObjectWithMetadataKeySpecifier | (() => undefined | ObjectWithMetadataKeySpecifier),
		fields?: ObjectWithMetadataFieldPolicy,
	},
	Order?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderKeySpecifier | (() => undefined | OrderKeySpecifier),
		fields?: OrderFieldPolicy,
	},
	OrderAddNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderAddNoteKeySpecifier | (() => undefined | OrderAddNoteKeySpecifier),
		fields?: OrderAddNoteFieldPolicy,
	},
	OrderBulkCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderBulkCancelKeySpecifier | (() => undefined | OrderBulkCancelKeySpecifier),
		fields?: OrderBulkCancelFieldPolicy,
	},
	OrderBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderBulkCreateKeySpecifier | (() => undefined | OrderBulkCreateKeySpecifier),
		fields?: OrderBulkCreateFieldPolicy,
	},
	OrderBulkCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderBulkCreateErrorKeySpecifier | (() => undefined | OrderBulkCreateErrorKeySpecifier),
		fields?: OrderBulkCreateErrorFieldPolicy,
	},
	OrderBulkCreateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderBulkCreateResultKeySpecifier | (() => undefined | OrderBulkCreateResultKeySpecifier),
		fields?: OrderBulkCreateResultFieldPolicy,
	},
	OrderBulkCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderBulkCreatedKeySpecifier | (() => undefined | OrderBulkCreatedKeySpecifier),
		fields?: OrderBulkCreatedFieldPolicy,
	},
	OrderCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCancelKeySpecifier | (() => undefined | OrderCancelKeySpecifier),
		fields?: OrderCancelFieldPolicy,
	},
	OrderCancelled?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCancelledKeySpecifier | (() => undefined | OrderCancelledKeySpecifier),
		fields?: OrderCancelledFieldPolicy,
	},
	OrderCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCaptureKeySpecifier | (() => undefined | OrderCaptureKeySpecifier),
		fields?: OrderCaptureFieldPolicy,
	},
	OrderConfirm?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderConfirmKeySpecifier | (() => undefined | OrderConfirmKeySpecifier),
		fields?: OrderConfirmFieldPolicy,
	},
	OrderConfirmed?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderConfirmedKeySpecifier | (() => undefined | OrderConfirmedKeySpecifier),
		fields?: OrderConfirmedFieldPolicy,
	},
	OrderCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCountableConnectionKeySpecifier | (() => undefined | OrderCountableConnectionKeySpecifier),
		fields?: OrderCountableConnectionFieldPolicy,
	},
	OrderCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCountableEdgeKeySpecifier | (() => undefined | OrderCountableEdgeKeySpecifier),
		fields?: OrderCountableEdgeFieldPolicy,
	},
	OrderCreateFromCheckout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCreateFromCheckoutKeySpecifier | (() => undefined | OrderCreateFromCheckoutKeySpecifier),
		fields?: OrderCreateFromCheckoutFieldPolicy,
	},
	OrderCreateFromCheckoutError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCreateFromCheckoutErrorKeySpecifier | (() => undefined | OrderCreateFromCheckoutErrorKeySpecifier),
		fields?: OrderCreateFromCheckoutErrorFieldPolicy,
	},
	OrderCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCreatedKeySpecifier | (() => undefined | OrderCreatedKeySpecifier),
		fields?: OrderCreatedFieldPolicy,
	},
	OrderDiscount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountKeySpecifier | (() => undefined | OrderDiscountKeySpecifier),
		fields?: OrderDiscountFieldPolicy,
	},
	OrderDiscountAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountAddKeySpecifier | (() => undefined | OrderDiscountAddKeySpecifier),
		fields?: OrderDiscountAddFieldPolicy,
	},
	OrderDiscountDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountDeleteKeySpecifier | (() => undefined | OrderDiscountDeleteKeySpecifier),
		fields?: OrderDiscountDeleteFieldPolicy,
	},
	OrderDiscountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountUpdateKeySpecifier | (() => undefined | OrderDiscountUpdateKeySpecifier),
		fields?: OrderDiscountUpdateFieldPolicy,
	},
	OrderError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderErrorKeySpecifier | (() => undefined | OrderErrorKeySpecifier),
		fields?: OrderErrorFieldPolicy,
	},
	OrderEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventKeySpecifier | (() => undefined | OrderEventKeySpecifier),
		fields?: OrderEventFieldPolicy,
	},
	OrderEventCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventCountableConnectionKeySpecifier | (() => undefined | OrderEventCountableConnectionKeySpecifier),
		fields?: OrderEventCountableConnectionFieldPolicy,
	},
	OrderEventCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventCountableEdgeKeySpecifier | (() => undefined | OrderEventCountableEdgeKeySpecifier),
		fields?: OrderEventCountableEdgeFieldPolicy,
	},
	OrderEventDiscountObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventDiscountObjectKeySpecifier | (() => undefined | OrderEventDiscountObjectKeySpecifier),
		fields?: OrderEventDiscountObjectFieldPolicy,
	},
	OrderEventOrderLineObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventOrderLineObjectKeySpecifier | (() => undefined | OrderEventOrderLineObjectKeySpecifier),
		fields?: OrderEventOrderLineObjectFieldPolicy,
	},
	OrderExpired?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderExpiredKeySpecifier | (() => undefined | OrderExpiredKeySpecifier),
		fields?: OrderExpiredFieldPolicy,
	},
	OrderFilterShippingMethods?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderFilterShippingMethodsKeySpecifier | (() => undefined | OrderFilterShippingMethodsKeySpecifier),
		fields?: OrderFilterShippingMethodsFieldPolicy,
	},
	OrderFulfill?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderFulfillKeySpecifier | (() => undefined | OrderFulfillKeySpecifier),
		fields?: OrderFulfillFieldPolicy,
	},
	OrderFulfilled?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderFulfilledKeySpecifier | (() => undefined | OrderFulfilledKeySpecifier),
		fields?: OrderFulfilledFieldPolicy,
	},
	OrderFullyPaid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderFullyPaidKeySpecifier | (() => undefined | OrderFullyPaidKeySpecifier),
		fields?: OrderFullyPaidFieldPolicy,
	},
	OrderFullyRefunded?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderFullyRefundedKeySpecifier | (() => undefined | OrderFullyRefundedKeySpecifier),
		fields?: OrderFullyRefundedFieldPolicy,
	},
	OrderGrantRefundCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantRefundCreateKeySpecifier | (() => undefined | OrderGrantRefundCreateKeySpecifier),
		fields?: OrderGrantRefundCreateFieldPolicy,
	},
	OrderGrantRefundCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantRefundCreateErrorKeySpecifier | (() => undefined | OrderGrantRefundCreateErrorKeySpecifier),
		fields?: OrderGrantRefundCreateErrorFieldPolicy,
	},
	OrderGrantRefundCreateLineError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantRefundCreateLineErrorKeySpecifier | (() => undefined | OrderGrantRefundCreateLineErrorKeySpecifier),
		fields?: OrderGrantRefundCreateLineErrorFieldPolicy,
	},
	OrderGrantRefundUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantRefundUpdateKeySpecifier | (() => undefined | OrderGrantRefundUpdateKeySpecifier),
		fields?: OrderGrantRefundUpdateFieldPolicy,
	},
	OrderGrantRefundUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantRefundUpdateErrorKeySpecifier | (() => undefined | OrderGrantRefundUpdateErrorKeySpecifier),
		fields?: OrderGrantRefundUpdateErrorFieldPolicy,
	},
	OrderGrantRefundUpdateLineError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantRefundUpdateLineErrorKeySpecifier | (() => undefined | OrderGrantRefundUpdateLineErrorKeySpecifier),
		fields?: OrderGrantRefundUpdateLineErrorFieldPolicy,
	},
	OrderGrantedRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantedRefundKeySpecifier | (() => undefined | OrderGrantedRefundKeySpecifier),
		fields?: OrderGrantedRefundFieldPolicy,
	},
	OrderGrantedRefundLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderGrantedRefundLineKeySpecifier | (() => undefined | OrderGrantedRefundLineKeySpecifier),
		fields?: OrderGrantedRefundLineFieldPolicy,
	},
	OrderLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineKeySpecifier | (() => undefined | OrderLineKeySpecifier),
		fields?: OrderLineFieldPolicy,
	},
	OrderLineDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDeleteKeySpecifier | (() => undefined | OrderLineDeleteKeySpecifier),
		fields?: OrderLineDeleteFieldPolicy,
	},
	OrderLineDiscount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDiscountKeySpecifier | (() => undefined | OrderLineDiscountKeySpecifier),
		fields?: OrderLineDiscountFieldPolicy,
	},
	OrderLineDiscountRemove?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDiscountRemoveKeySpecifier | (() => undefined | OrderLineDiscountRemoveKeySpecifier),
		fields?: OrderLineDiscountRemoveFieldPolicy,
	},
	OrderLineDiscountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDiscountUpdateKeySpecifier | (() => undefined | OrderLineDiscountUpdateKeySpecifier),
		fields?: OrderLineDiscountUpdateFieldPolicy,
	},
	OrderLineUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineUpdateKeySpecifier | (() => undefined | OrderLineUpdateKeySpecifier),
		fields?: OrderLineUpdateFieldPolicy,
	},
	OrderLinesCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLinesCreateKeySpecifier | (() => undefined | OrderLinesCreateKeySpecifier),
		fields?: OrderLinesCreateFieldPolicy,
	},
	OrderMarkAsPaid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderMarkAsPaidKeySpecifier | (() => undefined | OrderMarkAsPaidKeySpecifier),
		fields?: OrderMarkAsPaidFieldPolicy,
	},
	OrderMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderMetadataUpdatedKeySpecifier | (() => undefined | OrderMetadataUpdatedKeySpecifier),
		fields?: OrderMetadataUpdatedFieldPolicy,
	},
	OrderNoteAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderNoteAddKeySpecifier | (() => undefined | OrderNoteAddKeySpecifier),
		fields?: OrderNoteAddFieldPolicy,
	},
	OrderNoteAddError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderNoteAddErrorKeySpecifier | (() => undefined | OrderNoteAddErrorKeySpecifier),
		fields?: OrderNoteAddErrorFieldPolicy,
	},
	OrderNoteUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderNoteUpdateKeySpecifier | (() => undefined | OrderNoteUpdateKeySpecifier),
		fields?: OrderNoteUpdateFieldPolicy,
	},
	OrderNoteUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderNoteUpdateErrorKeySpecifier | (() => undefined | OrderNoteUpdateErrorKeySpecifier),
		fields?: OrderNoteUpdateErrorFieldPolicy,
	},
	OrderPaid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderPaidKeySpecifier | (() => undefined | OrderPaidKeySpecifier),
		fields?: OrderPaidFieldPolicy,
	},
	OrderRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderRefundKeySpecifier | (() => undefined | OrderRefundKeySpecifier),
		fields?: OrderRefundFieldPolicy,
	},
	OrderRefunded?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderRefundedKeySpecifier | (() => undefined | OrderRefundedKeySpecifier),
		fields?: OrderRefundedFieldPolicy,
	},
	OrderSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderSettingsKeySpecifier | (() => undefined | OrderSettingsKeySpecifier),
		fields?: OrderSettingsFieldPolicy,
	},
	OrderSettingsError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderSettingsErrorKeySpecifier | (() => undefined | OrderSettingsErrorKeySpecifier),
		fields?: OrderSettingsErrorFieldPolicy,
	},
	OrderSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderSettingsUpdateKeySpecifier | (() => undefined | OrderSettingsUpdateKeySpecifier),
		fields?: OrderSettingsUpdateFieldPolicy,
	},
	OrderUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderUpdateKeySpecifier | (() => undefined | OrderUpdateKeySpecifier),
		fields?: OrderUpdateFieldPolicy,
	},
	OrderUpdateShipping?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderUpdateShippingKeySpecifier | (() => undefined | OrderUpdateShippingKeySpecifier),
		fields?: OrderUpdateShippingFieldPolicy,
	},
	OrderUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderUpdatedKeySpecifier | (() => undefined | OrderUpdatedKeySpecifier),
		fields?: OrderUpdatedFieldPolicy,
	},
	OrderVoid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderVoidKeySpecifier | (() => undefined | OrderVoidKeySpecifier),
		fields?: OrderVoidFieldPolicy,
	},
	OtherPaymentMethodDetails?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OtherPaymentMethodDetailsKeySpecifier | (() => undefined | OtherPaymentMethodDetailsKeySpecifier),
		fields?: OtherPaymentMethodDetailsFieldPolicy,
	},
	Page?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageKeySpecifier | (() => undefined | PageKeySpecifier),
		fields?: PageFieldPolicy,
	},
	PageAttributeAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageAttributeAssignKeySpecifier | (() => undefined | PageAttributeAssignKeySpecifier),
		fields?: PageAttributeAssignFieldPolicy,
	},
	PageAttributeUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageAttributeUnassignKeySpecifier | (() => undefined | PageAttributeUnassignKeySpecifier),
		fields?: PageAttributeUnassignFieldPolicy,
	},
	PageBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageBulkDeleteKeySpecifier | (() => undefined | PageBulkDeleteKeySpecifier),
		fields?: PageBulkDeleteFieldPolicy,
	},
	PageBulkPublish?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageBulkPublishKeySpecifier | (() => undefined | PageBulkPublishKeySpecifier),
		fields?: PageBulkPublishFieldPolicy,
	},
	PageCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCountableConnectionKeySpecifier | (() => undefined | PageCountableConnectionKeySpecifier),
		fields?: PageCountableConnectionFieldPolicy,
	},
	PageCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCountableEdgeKeySpecifier | (() => undefined | PageCountableEdgeKeySpecifier),
		fields?: PageCountableEdgeFieldPolicy,
	},
	PageCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCreateKeySpecifier | (() => undefined | PageCreateKeySpecifier),
		fields?: PageCreateFieldPolicy,
	},
	PageCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCreatedKeySpecifier | (() => undefined | PageCreatedKeySpecifier),
		fields?: PageCreatedFieldPolicy,
	},
	PageDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageDeleteKeySpecifier | (() => undefined | PageDeleteKeySpecifier),
		fields?: PageDeleteFieldPolicy,
	},
	PageDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageDeletedKeySpecifier | (() => undefined | PageDeletedKeySpecifier),
		fields?: PageDeletedFieldPolicy,
	},
	PageError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageErrorKeySpecifier | (() => undefined | PageErrorKeySpecifier),
		fields?: PageErrorFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	PageReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageReorderAttributeValuesKeySpecifier | (() => undefined | PageReorderAttributeValuesKeySpecifier),
		fields?: PageReorderAttributeValuesFieldPolicy,
	},
	PageTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTranslatableContentKeySpecifier | (() => undefined | PageTranslatableContentKeySpecifier),
		fields?: PageTranslatableContentFieldPolicy,
	},
	PageTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTranslateKeySpecifier | (() => undefined | PageTranslateKeySpecifier),
		fields?: PageTranslateFieldPolicy,
	},
	PageTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTranslationKeySpecifier | (() => undefined | PageTranslationKeySpecifier),
		fields?: PageTranslationFieldPolicy,
	},
	PageType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeKeySpecifier | (() => undefined | PageTypeKeySpecifier),
		fields?: PageTypeFieldPolicy,
	},
	PageTypeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeBulkDeleteKeySpecifier | (() => undefined | PageTypeBulkDeleteKeySpecifier),
		fields?: PageTypeBulkDeleteFieldPolicy,
	},
	PageTypeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCountableConnectionKeySpecifier | (() => undefined | PageTypeCountableConnectionKeySpecifier),
		fields?: PageTypeCountableConnectionFieldPolicy,
	},
	PageTypeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCountableEdgeKeySpecifier | (() => undefined | PageTypeCountableEdgeKeySpecifier),
		fields?: PageTypeCountableEdgeFieldPolicy,
	},
	PageTypeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCreateKeySpecifier | (() => undefined | PageTypeCreateKeySpecifier),
		fields?: PageTypeCreateFieldPolicy,
	},
	PageTypeCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCreatedKeySpecifier | (() => undefined | PageTypeCreatedKeySpecifier),
		fields?: PageTypeCreatedFieldPolicy,
	},
	PageTypeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeDeleteKeySpecifier | (() => undefined | PageTypeDeleteKeySpecifier),
		fields?: PageTypeDeleteFieldPolicy,
	},
	PageTypeDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeDeletedKeySpecifier | (() => undefined | PageTypeDeletedKeySpecifier),
		fields?: PageTypeDeletedFieldPolicy,
	},
	PageTypeReorderAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeReorderAttributesKeySpecifier | (() => undefined | PageTypeReorderAttributesKeySpecifier),
		fields?: PageTypeReorderAttributesFieldPolicy,
	},
	PageTypeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeUpdateKeySpecifier | (() => undefined | PageTypeUpdateKeySpecifier),
		fields?: PageTypeUpdateFieldPolicy,
	},
	PageTypeUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeUpdatedKeySpecifier | (() => undefined | PageTypeUpdatedKeySpecifier),
		fields?: PageTypeUpdatedFieldPolicy,
	},
	PageUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageUpdateKeySpecifier | (() => undefined | PageUpdateKeySpecifier),
		fields?: PageUpdateFieldPolicy,
	},
	PageUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageUpdatedKeySpecifier | (() => undefined | PageUpdatedKeySpecifier),
		fields?: PageUpdatedFieldPolicy,
	},
	PasswordChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PasswordChangeKeySpecifier | (() => undefined | PasswordChangeKeySpecifier),
		fields?: PasswordChangeFieldPolicy,
	},
	Payment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentKeySpecifier | (() => undefined | PaymentKeySpecifier),
		fields?: PaymentFieldPolicy,
	},
	PaymentAuthorize?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentAuthorizeKeySpecifier | (() => undefined | PaymentAuthorizeKeySpecifier),
		fields?: PaymentAuthorizeFieldPolicy,
	},
	PaymentCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCaptureKeySpecifier | (() => undefined | PaymentCaptureKeySpecifier),
		fields?: PaymentCaptureFieldPolicy,
	},
	PaymentCaptureEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCaptureEventKeySpecifier | (() => undefined | PaymentCaptureEventKeySpecifier),
		fields?: PaymentCaptureEventFieldPolicy,
	},
	PaymentCheckBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCheckBalanceKeySpecifier | (() => undefined | PaymentCheckBalanceKeySpecifier),
		fields?: PaymentCheckBalanceFieldPolicy,
	},
	PaymentConfirmEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentConfirmEventKeySpecifier | (() => undefined | PaymentConfirmEventKeySpecifier),
		fields?: PaymentConfirmEventFieldPolicy,
	},
	PaymentCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCountableConnectionKeySpecifier | (() => undefined | PaymentCountableConnectionKeySpecifier),
		fields?: PaymentCountableConnectionFieldPolicy,
	},
	PaymentCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCountableEdgeKeySpecifier | (() => undefined | PaymentCountableEdgeKeySpecifier),
		fields?: PaymentCountableEdgeFieldPolicy,
	},
	PaymentError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentErrorKeySpecifier | (() => undefined | PaymentErrorKeySpecifier),
		fields?: PaymentErrorFieldPolicy,
	},
	PaymentGateway?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayKeySpecifier | (() => undefined | PaymentGatewayKeySpecifier),
		fields?: PaymentGatewayFieldPolicy,
	},
	PaymentGatewayConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayConfigKeySpecifier | (() => undefined | PaymentGatewayConfigKeySpecifier),
		fields?: PaymentGatewayConfigFieldPolicy,
	},
	PaymentGatewayConfigError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayConfigErrorKeySpecifier | (() => undefined | PaymentGatewayConfigErrorKeySpecifier),
		fields?: PaymentGatewayConfigErrorFieldPolicy,
	},
	PaymentGatewayInitialize?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayInitializeKeySpecifier | (() => undefined | PaymentGatewayInitializeKeySpecifier),
		fields?: PaymentGatewayInitializeFieldPolicy,
	},
	PaymentGatewayInitializeError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayInitializeErrorKeySpecifier | (() => undefined | PaymentGatewayInitializeErrorKeySpecifier),
		fields?: PaymentGatewayInitializeErrorFieldPolicy,
	},
	PaymentGatewayInitializeSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayInitializeSessionKeySpecifier | (() => undefined | PaymentGatewayInitializeSessionKeySpecifier),
		fields?: PaymentGatewayInitializeSessionFieldPolicy,
	},
	PaymentGatewayInitializeTokenization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayInitializeTokenizationKeySpecifier | (() => undefined | PaymentGatewayInitializeTokenizationKeySpecifier),
		fields?: PaymentGatewayInitializeTokenizationFieldPolicy,
	},
	PaymentGatewayInitializeTokenizationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayInitializeTokenizationErrorKeySpecifier | (() => undefined | PaymentGatewayInitializeTokenizationErrorKeySpecifier),
		fields?: PaymentGatewayInitializeTokenizationErrorFieldPolicy,
	},
	PaymentGatewayInitializeTokenizationSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayInitializeTokenizationSessionKeySpecifier | (() => undefined | PaymentGatewayInitializeTokenizationSessionKeySpecifier),
		fields?: PaymentGatewayInitializeTokenizationSessionFieldPolicy,
	},
	PaymentInitialize?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentInitializeKeySpecifier | (() => undefined | PaymentInitializeKeySpecifier),
		fields?: PaymentInitializeFieldPolicy,
	},
	PaymentInitialized?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentInitializedKeySpecifier | (() => undefined | PaymentInitializedKeySpecifier),
		fields?: PaymentInitializedFieldPolicy,
	},
	PaymentListGateways?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentListGatewaysKeySpecifier | (() => undefined | PaymentListGatewaysKeySpecifier),
		fields?: PaymentListGatewaysFieldPolicy,
	},
	PaymentMethodDetails?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodDetailsKeySpecifier | (() => undefined | PaymentMethodDetailsKeySpecifier),
		fields?: PaymentMethodDetailsFieldPolicy,
	},
	PaymentMethodInitializeTokenization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodInitializeTokenizationKeySpecifier | (() => undefined | PaymentMethodInitializeTokenizationKeySpecifier),
		fields?: PaymentMethodInitializeTokenizationFieldPolicy,
	},
	PaymentMethodInitializeTokenizationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodInitializeTokenizationErrorKeySpecifier | (() => undefined | PaymentMethodInitializeTokenizationErrorKeySpecifier),
		fields?: PaymentMethodInitializeTokenizationErrorFieldPolicy,
	},
	PaymentMethodInitializeTokenizationSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodInitializeTokenizationSessionKeySpecifier | (() => undefined | PaymentMethodInitializeTokenizationSessionKeySpecifier),
		fields?: PaymentMethodInitializeTokenizationSessionFieldPolicy,
	},
	PaymentMethodProcessTokenization?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodProcessTokenizationKeySpecifier | (() => undefined | PaymentMethodProcessTokenizationKeySpecifier),
		fields?: PaymentMethodProcessTokenizationFieldPolicy,
	},
	PaymentMethodProcessTokenizationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodProcessTokenizationErrorKeySpecifier | (() => undefined | PaymentMethodProcessTokenizationErrorKeySpecifier),
		fields?: PaymentMethodProcessTokenizationErrorFieldPolicy,
	},
	PaymentMethodProcessTokenizationSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodProcessTokenizationSessionKeySpecifier | (() => undefined | PaymentMethodProcessTokenizationSessionKeySpecifier),
		fields?: PaymentMethodProcessTokenizationSessionFieldPolicy,
	},
	PaymentMethodRequestDeleteError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentMethodRequestDeleteErrorKeySpecifier | (() => undefined | PaymentMethodRequestDeleteErrorKeySpecifier),
		fields?: PaymentMethodRequestDeleteErrorFieldPolicy,
	},
	PaymentProcessEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentProcessEventKeySpecifier | (() => undefined | PaymentProcessEventKeySpecifier),
		fields?: PaymentProcessEventFieldPolicy,
	},
	PaymentRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentRefundKeySpecifier | (() => undefined | PaymentRefundKeySpecifier),
		fields?: PaymentRefundFieldPolicy,
	},
	PaymentRefundEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentRefundEventKeySpecifier | (() => undefined | PaymentRefundEventKeySpecifier),
		fields?: PaymentRefundEventFieldPolicy,
	},
	PaymentSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentSettingsKeySpecifier | (() => undefined | PaymentSettingsKeySpecifier),
		fields?: PaymentSettingsFieldPolicy,
	},
	PaymentSource?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentSourceKeySpecifier | (() => undefined | PaymentSourceKeySpecifier),
		fields?: PaymentSourceFieldPolicy,
	},
	PaymentVoid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVoidKeySpecifier | (() => undefined | PaymentVoidKeySpecifier),
		fields?: PaymentVoidFieldPolicy,
	},
	PaymentVoidEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVoidEventKeySpecifier | (() => undefined | PaymentVoidEventKeySpecifier),
		fields?: PaymentVoidEventFieldPolicy,
	},
	Permission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionKeySpecifier | (() => undefined | PermissionKeySpecifier),
		fields?: PermissionFieldPolicy,
	},
	PermissionGroupCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupCreateKeySpecifier | (() => undefined | PermissionGroupCreateKeySpecifier),
		fields?: PermissionGroupCreateFieldPolicy,
	},
	PermissionGroupCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupCreatedKeySpecifier | (() => undefined | PermissionGroupCreatedKeySpecifier),
		fields?: PermissionGroupCreatedFieldPolicy,
	},
	PermissionGroupDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupDeleteKeySpecifier | (() => undefined | PermissionGroupDeleteKeySpecifier),
		fields?: PermissionGroupDeleteFieldPolicy,
	},
	PermissionGroupDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupDeletedKeySpecifier | (() => undefined | PermissionGroupDeletedKeySpecifier),
		fields?: PermissionGroupDeletedFieldPolicy,
	},
	PermissionGroupError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupErrorKeySpecifier | (() => undefined | PermissionGroupErrorKeySpecifier),
		fields?: PermissionGroupErrorFieldPolicy,
	},
	PermissionGroupUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupUpdateKeySpecifier | (() => undefined | PermissionGroupUpdateKeySpecifier),
		fields?: PermissionGroupUpdateFieldPolicy,
	},
	PermissionGroupUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupUpdatedKeySpecifier | (() => undefined | PermissionGroupUpdatedKeySpecifier),
		fields?: PermissionGroupUpdatedFieldPolicy,
	},
	Plugin?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginKeySpecifier | (() => undefined | PluginKeySpecifier),
		fields?: PluginFieldPolicy,
	},
	PluginConfiguration?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginConfigurationKeySpecifier | (() => undefined | PluginConfigurationKeySpecifier),
		fields?: PluginConfigurationFieldPolicy,
	},
	PluginCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginCountableConnectionKeySpecifier | (() => undefined | PluginCountableConnectionKeySpecifier),
		fields?: PluginCountableConnectionFieldPolicy,
	},
	PluginCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginCountableEdgeKeySpecifier | (() => undefined | PluginCountableEdgeKeySpecifier),
		fields?: PluginCountableEdgeFieldPolicy,
	},
	PluginError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginErrorKeySpecifier | (() => undefined | PluginErrorKeySpecifier),
		fields?: PluginErrorFieldPolicy,
	},
	PluginUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginUpdateKeySpecifier | (() => undefined | PluginUpdateKeySpecifier),
		fields?: PluginUpdateFieldPolicy,
	},
	PreorderData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PreorderDataKeySpecifier | (() => undefined | PreorderDataKeySpecifier),
		fields?: PreorderDataFieldPolicy,
	},
	PreorderThreshold?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PreorderThresholdKeySpecifier | (() => undefined | PreorderThresholdKeySpecifier),
		fields?: PreorderThresholdFieldPolicy,
	},
	Product?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductKeySpecifier | (() => undefined | ProductKeySpecifier),
		fields?: ProductFieldPolicy,
	},
	ProductAttributeAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAttributeAssignKeySpecifier | (() => undefined | ProductAttributeAssignKeySpecifier),
		fields?: ProductAttributeAssignFieldPolicy,
	},
	ProductAttributeAssignmentUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAttributeAssignmentUpdateKeySpecifier | (() => undefined | ProductAttributeAssignmentUpdateKeySpecifier),
		fields?: ProductAttributeAssignmentUpdateFieldPolicy,
	},
	ProductAttributeUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAttributeUnassignKeySpecifier | (() => undefined | ProductAttributeUnassignKeySpecifier),
		fields?: ProductAttributeUnassignFieldPolicy,
	},
	ProductBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkCreateKeySpecifier | (() => undefined | ProductBulkCreateKeySpecifier),
		fields?: ProductBulkCreateFieldPolicy,
	},
	ProductBulkCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkCreateErrorKeySpecifier | (() => undefined | ProductBulkCreateErrorKeySpecifier),
		fields?: ProductBulkCreateErrorFieldPolicy,
	},
	ProductBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkDeleteKeySpecifier | (() => undefined | ProductBulkDeleteKeySpecifier),
		fields?: ProductBulkDeleteFieldPolicy,
	},
	ProductBulkResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkResultKeySpecifier | (() => undefined | ProductBulkResultKeySpecifier),
		fields?: ProductBulkResultFieldPolicy,
	},
	ProductBulkTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkTranslateKeySpecifier | (() => undefined | ProductBulkTranslateKeySpecifier),
		fields?: ProductBulkTranslateFieldPolicy,
	},
	ProductBulkTranslateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkTranslateErrorKeySpecifier | (() => undefined | ProductBulkTranslateErrorKeySpecifier),
		fields?: ProductBulkTranslateErrorFieldPolicy,
	},
	ProductBulkTranslateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkTranslateResultKeySpecifier | (() => undefined | ProductBulkTranslateResultKeySpecifier),
		fields?: ProductBulkTranslateResultFieldPolicy,
	},
	ProductChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductChannelListingKeySpecifier | (() => undefined | ProductChannelListingKeySpecifier),
		fields?: ProductChannelListingFieldPolicy,
	},
	ProductChannelListingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductChannelListingErrorKeySpecifier | (() => undefined | ProductChannelListingErrorKeySpecifier),
		fields?: ProductChannelListingErrorFieldPolicy,
	},
	ProductChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductChannelListingUpdateKeySpecifier | (() => undefined | ProductChannelListingUpdateKeySpecifier),
		fields?: ProductChannelListingUpdateFieldPolicy,
	},
	ProductCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCountableConnectionKeySpecifier | (() => undefined | ProductCountableConnectionKeySpecifier),
		fields?: ProductCountableConnectionFieldPolicy,
	},
	ProductCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCountableEdgeKeySpecifier | (() => undefined | ProductCountableEdgeKeySpecifier),
		fields?: ProductCountableEdgeFieldPolicy,
	},
	ProductCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCreateKeySpecifier | (() => undefined | ProductCreateKeySpecifier),
		fields?: ProductCreateFieldPolicy,
	},
	ProductCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCreatedKeySpecifier | (() => undefined | ProductCreatedKeySpecifier),
		fields?: ProductCreatedFieldPolicy,
	},
	ProductDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductDeleteKeySpecifier | (() => undefined | ProductDeleteKeySpecifier),
		fields?: ProductDeleteFieldPolicy,
	},
	ProductDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductDeletedKeySpecifier | (() => undefined | ProductDeletedKeySpecifier),
		fields?: ProductDeletedFieldPolicy,
	},
	ProductError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductErrorKeySpecifier | (() => undefined | ProductErrorKeySpecifier),
		fields?: ProductErrorFieldPolicy,
	},
	ProductExportCompleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductExportCompletedKeySpecifier | (() => undefined | ProductExportCompletedKeySpecifier),
		fields?: ProductExportCompletedFieldPolicy,
	},
	ProductImage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductImageKeySpecifier | (() => undefined | ProductImageKeySpecifier),
		fields?: ProductImageFieldPolicy,
	},
	ProductMedia?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaKeySpecifier | (() => undefined | ProductMediaKeySpecifier),
		fields?: ProductMediaFieldPolicy,
	},
	ProductMediaBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaBulkDeleteKeySpecifier | (() => undefined | ProductMediaBulkDeleteKeySpecifier),
		fields?: ProductMediaBulkDeleteFieldPolicy,
	},
	ProductMediaCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaCreateKeySpecifier | (() => undefined | ProductMediaCreateKeySpecifier),
		fields?: ProductMediaCreateFieldPolicy,
	},
	ProductMediaCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaCreatedKeySpecifier | (() => undefined | ProductMediaCreatedKeySpecifier),
		fields?: ProductMediaCreatedFieldPolicy,
	},
	ProductMediaDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaDeleteKeySpecifier | (() => undefined | ProductMediaDeleteKeySpecifier),
		fields?: ProductMediaDeleteFieldPolicy,
	},
	ProductMediaDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaDeletedKeySpecifier | (() => undefined | ProductMediaDeletedKeySpecifier),
		fields?: ProductMediaDeletedFieldPolicy,
	},
	ProductMediaReorder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaReorderKeySpecifier | (() => undefined | ProductMediaReorderKeySpecifier),
		fields?: ProductMediaReorderFieldPolicy,
	},
	ProductMediaUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaUpdateKeySpecifier | (() => undefined | ProductMediaUpdateKeySpecifier),
		fields?: ProductMediaUpdateFieldPolicy,
	},
	ProductMediaUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaUpdatedKeySpecifier | (() => undefined | ProductMediaUpdatedKeySpecifier),
		fields?: ProductMediaUpdatedFieldPolicy,
	},
	ProductMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMetadataUpdatedKeySpecifier | (() => undefined | ProductMetadataUpdatedKeySpecifier),
		fields?: ProductMetadataUpdatedFieldPolicy,
	},
	ProductPricingInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductPricingInfoKeySpecifier | (() => undefined | ProductPricingInfoKeySpecifier),
		fields?: ProductPricingInfoFieldPolicy,
	},
	ProductReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductReorderAttributeValuesKeySpecifier | (() => undefined | ProductReorderAttributeValuesKeySpecifier),
		fields?: ProductReorderAttributeValuesFieldPolicy,
	},
	ProductTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTranslatableContentKeySpecifier | (() => undefined | ProductTranslatableContentKeySpecifier),
		fields?: ProductTranslatableContentFieldPolicy,
	},
	ProductTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTranslateKeySpecifier | (() => undefined | ProductTranslateKeySpecifier),
		fields?: ProductTranslateFieldPolicy,
	},
	ProductTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTranslationKeySpecifier | (() => undefined | ProductTranslationKeySpecifier),
		fields?: ProductTranslationFieldPolicy,
	},
	ProductType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeKeySpecifier | (() => undefined | ProductTypeKeySpecifier),
		fields?: ProductTypeFieldPolicy,
	},
	ProductTypeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeBulkDeleteKeySpecifier | (() => undefined | ProductTypeBulkDeleteKeySpecifier),
		fields?: ProductTypeBulkDeleteFieldPolicy,
	},
	ProductTypeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeCountableConnectionKeySpecifier | (() => undefined | ProductTypeCountableConnectionKeySpecifier),
		fields?: ProductTypeCountableConnectionFieldPolicy,
	},
	ProductTypeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeCountableEdgeKeySpecifier | (() => undefined | ProductTypeCountableEdgeKeySpecifier),
		fields?: ProductTypeCountableEdgeFieldPolicy,
	},
	ProductTypeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeCreateKeySpecifier | (() => undefined | ProductTypeCreateKeySpecifier),
		fields?: ProductTypeCreateFieldPolicy,
	},
	ProductTypeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeDeleteKeySpecifier | (() => undefined | ProductTypeDeleteKeySpecifier),
		fields?: ProductTypeDeleteFieldPolicy,
	},
	ProductTypeReorderAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeReorderAttributesKeySpecifier | (() => undefined | ProductTypeReorderAttributesKeySpecifier),
		fields?: ProductTypeReorderAttributesFieldPolicy,
	},
	ProductTypeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeUpdateKeySpecifier | (() => undefined | ProductTypeUpdateKeySpecifier),
		fields?: ProductTypeUpdateFieldPolicy,
	},
	ProductUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductUpdateKeySpecifier | (() => undefined | ProductUpdateKeySpecifier),
		fields?: ProductUpdateFieldPolicy,
	},
	ProductUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductUpdatedKeySpecifier | (() => undefined | ProductUpdatedKeySpecifier),
		fields?: ProductUpdatedFieldPolicy,
	},
	ProductVariant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantKeySpecifier | (() => undefined | ProductVariantKeySpecifier),
		fields?: ProductVariantFieldPolicy,
	},
	ProductVariantBackInStock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBackInStockKeySpecifier | (() => undefined | ProductVariantBackInStockKeySpecifier),
		fields?: ProductVariantBackInStockFieldPolicy,
	},
	ProductVariantBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkCreateKeySpecifier | (() => undefined | ProductVariantBulkCreateKeySpecifier),
		fields?: ProductVariantBulkCreateFieldPolicy,
	},
	ProductVariantBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkDeleteKeySpecifier | (() => undefined | ProductVariantBulkDeleteKeySpecifier),
		fields?: ProductVariantBulkDeleteFieldPolicy,
	},
	ProductVariantBulkError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkErrorKeySpecifier | (() => undefined | ProductVariantBulkErrorKeySpecifier),
		fields?: ProductVariantBulkErrorFieldPolicy,
	},
	ProductVariantBulkResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkResultKeySpecifier | (() => undefined | ProductVariantBulkResultKeySpecifier),
		fields?: ProductVariantBulkResultFieldPolicy,
	},
	ProductVariantBulkTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkTranslateKeySpecifier | (() => undefined | ProductVariantBulkTranslateKeySpecifier),
		fields?: ProductVariantBulkTranslateFieldPolicy,
	},
	ProductVariantBulkTranslateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkTranslateErrorKeySpecifier | (() => undefined | ProductVariantBulkTranslateErrorKeySpecifier),
		fields?: ProductVariantBulkTranslateErrorFieldPolicy,
	},
	ProductVariantBulkTranslateResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkTranslateResultKeySpecifier | (() => undefined | ProductVariantBulkTranslateResultKeySpecifier),
		fields?: ProductVariantBulkTranslateResultFieldPolicy,
	},
	ProductVariantBulkUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkUpdateKeySpecifier | (() => undefined | ProductVariantBulkUpdateKeySpecifier),
		fields?: ProductVariantBulkUpdateFieldPolicy,
	},
	ProductVariantChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantChannelListingKeySpecifier | (() => undefined | ProductVariantChannelListingKeySpecifier),
		fields?: ProductVariantChannelListingFieldPolicy,
	},
	ProductVariantChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantChannelListingUpdateKeySpecifier | (() => undefined | ProductVariantChannelListingUpdateKeySpecifier),
		fields?: ProductVariantChannelListingUpdateFieldPolicy,
	},
	ProductVariantCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCountableConnectionKeySpecifier | (() => undefined | ProductVariantCountableConnectionKeySpecifier),
		fields?: ProductVariantCountableConnectionFieldPolicy,
	},
	ProductVariantCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCountableEdgeKeySpecifier | (() => undefined | ProductVariantCountableEdgeKeySpecifier),
		fields?: ProductVariantCountableEdgeFieldPolicy,
	},
	ProductVariantCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCreateKeySpecifier | (() => undefined | ProductVariantCreateKeySpecifier),
		fields?: ProductVariantCreateFieldPolicy,
	},
	ProductVariantCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCreatedKeySpecifier | (() => undefined | ProductVariantCreatedKeySpecifier),
		fields?: ProductVariantCreatedFieldPolicy,
	},
	ProductVariantDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantDeleteKeySpecifier | (() => undefined | ProductVariantDeleteKeySpecifier),
		fields?: ProductVariantDeleteFieldPolicy,
	},
	ProductVariantDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantDeletedKeySpecifier | (() => undefined | ProductVariantDeletedKeySpecifier),
		fields?: ProductVariantDeletedFieldPolicy,
	},
	ProductVariantMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantMetadataUpdatedKeySpecifier | (() => undefined | ProductVariantMetadataUpdatedKeySpecifier),
		fields?: ProductVariantMetadataUpdatedFieldPolicy,
	},
	ProductVariantOutOfStock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantOutOfStockKeySpecifier | (() => undefined | ProductVariantOutOfStockKeySpecifier),
		fields?: ProductVariantOutOfStockFieldPolicy,
	},
	ProductVariantPreorderDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantPreorderDeactivateKeySpecifier | (() => undefined | ProductVariantPreorderDeactivateKeySpecifier),
		fields?: ProductVariantPreorderDeactivateFieldPolicy,
	},
	ProductVariantReorder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantReorderKeySpecifier | (() => undefined | ProductVariantReorderKeySpecifier),
		fields?: ProductVariantReorderFieldPolicy,
	},
	ProductVariantReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantReorderAttributeValuesKeySpecifier | (() => undefined | ProductVariantReorderAttributeValuesKeySpecifier),
		fields?: ProductVariantReorderAttributeValuesFieldPolicy,
	},
	ProductVariantSetDefault?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantSetDefaultKeySpecifier | (() => undefined | ProductVariantSetDefaultKeySpecifier),
		fields?: ProductVariantSetDefaultFieldPolicy,
	},
	ProductVariantStockUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStockUpdatedKeySpecifier | (() => undefined | ProductVariantStockUpdatedKeySpecifier),
		fields?: ProductVariantStockUpdatedFieldPolicy,
	},
	ProductVariantStocksCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStocksCreateKeySpecifier | (() => undefined | ProductVariantStocksCreateKeySpecifier),
		fields?: ProductVariantStocksCreateFieldPolicy,
	},
	ProductVariantStocksDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStocksDeleteKeySpecifier | (() => undefined | ProductVariantStocksDeleteKeySpecifier),
		fields?: ProductVariantStocksDeleteFieldPolicy,
	},
	ProductVariantStocksUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStocksUpdateKeySpecifier | (() => undefined | ProductVariantStocksUpdateKeySpecifier),
		fields?: ProductVariantStocksUpdateFieldPolicy,
	},
	ProductVariantTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantTranslatableContentKeySpecifier | (() => undefined | ProductVariantTranslatableContentKeySpecifier),
		fields?: ProductVariantTranslatableContentFieldPolicy,
	},
	ProductVariantTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantTranslateKeySpecifier | (() => undefined | ProductVariantTranslateKeySpecifier),
		fields?: ProductVariantTranslateFieldPolicy,
	},
	ProductVariantTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantTranslationKeySpecifier | (() => undefined | ProductVariantTranslationKeySpecifier),
		fields?: ProductVariantTranslationFieldPolicy,
	},
	ProductVariantUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantUpdateKeySpecifier | (() => undefined | ProductVariantUpdateKeySpecifier),
		fields?: ProductVariantUpdateFieldPolicy,
	},
	ProductVariantUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantUpdatedKeySpecifier | (() => undefined | ProductVariantUpdatedKeySpecifier),
		fields?: ProductVariantUpdatedFieldPolicy,
	},
	Promotion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionKeySpecifier | (() => undefined | PromotionKeySpecifier),
		fields?: PromotionFieldPolicy,
	},
	PromotionBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionBulkDeleteKeySpecifier | (() => undefined | PromotionBulkDeleteKeySpecifier),
		fields?: PromotionBulkDeleteFieldPolicy,
	},
	PromotionCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionCountableConnectionKeySpecifier | (() => undefined | PromotionCountableConnectionKeySpecifier),
		fields?: PromotionCountableConnectionFieldPolicy,
	},
	PromotionCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionCountableEdgeKeySpecifier | (() => undefined | PromotionCountableEdgeKeySpecifier),
		fields?: PromotionCountableEdgeFieldPolicy,
	},
	PromotionCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionCreateKeySpecifier | (() => undefined | PromotionCreateKeySpecifier),
		fields?: PromotionCreateFieldPolicy,
	},
	PromotionCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionCreateErrorKeySpecifier | (() => undefined | PromotionCreateErrorKeySpecifier),
		fields?: PromotionCreateErrorFieldPolicy,
	},
	PromotionCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionCreatedKeySpecifier | (() => undefined | PromotionCreatedKeySpecifier),
		fields?: PromotionCreatedFieldPolicy,
	},
	PromotionCreatedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionCreatedEventKeySpecifier | (() => undefined | PromotionCreatedEventKeySpecifier),
		fields?: PromotionCreatedEventFieldPolicy,
	},
	PromotionDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionDeleteKeySpecifier | (() => undefined | PromotionDeleteKeySpecifier),
		fields?: PromotionDeleteFieldPolicy,
	},
	PromotionDeleteError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionDeleteErrorKeySpecifier | (() => undefined | PromotionDeleteErrorKeySpecifier),
		fields?: PromotionDeleteErrorFieldPolicy,
	},
	PromotionDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionDeletedKeySpecifier | (() => undefined | PromotionDeletedKeySpecifier),
		fields?: PromotionDeletedFieldPolicy,
	},
	PromotionEnded?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionEndedKeySpecifier | (() => undefined | PromotionEndedKeySpecifier),
		fields?: PromotionEndedFieldPolicy,
	},
	PromotionEndedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionEndedEventKeySpecifier | (() => undefined | PromotionEndedEventKeySpecifier),
		fields?: PromotionEndedEventFieldPolicy,
	},
	PromotionEventInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionEventInterfaceKeySpecifier | (() => undefined | PromotionEventInterfaceKeySpecifier),
		fields?: PromotionEventInterfaceFieldPolicy,
	},
	PromotionRule?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleKeySpecifier | (() => undefined | PromotionRuleKeySpecifier),
		fields?: PromotionRuleFieldPolicy,
	},
	PromotionRuleCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleCreateKeySpecifier | (() => undefined | PromotionRuleCreateKeySpecifier),
		fields?: PromotionRuleCreateFieldPolicy,
	},
	PromotionRuleCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleCreateErrorKeySpecifier | (() => undefined | PromotionRuleCreateErrorKeySpecifier),
		fields?: PromotionRuleCreateErrorFieldPolicy,
	},
	PromotionRuleCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleCreatedKeySpecifier | (() => undefined | PromotionRuleCreatedKeySpecifier),
		fields?: PromotionRuleCreatedFieldPolicy,
	},
	PromotionRuleCreatedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleCreatedEventKeySpecifier | (() => undefined | PromotionRuleCreatedEventKeySpecifier),
		fields?: PromotionRuleCreatedEventFieldPolicy,
	},
	PromotionRuleDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleDeleteKeySpecifier | (() => undefined | PromotionRuleDeleteKeySpecifier),
		fields?: PromotionRuleDeleteFieldPolicy,
	},
	PromotionRuleDeleteError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleDeleteErrorKeySpecifier | (() => undefined | PromotionRuleDeleteErrorKeySpecifier),
		fields?: PromotionRuleDeleteErrorFieldPolicy,
	},
	PromotionRuleDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleDeletedKeySpecifier | (() => undefined | PromotionRuleDeletedKeySpecifier),
		fields?: PromotionRuleDeletedFieldPolicy,
	},
	PromotionRuleDeletedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleDeletedEventKeySpecifier | (() => undefined | PromotionRuleDeletedEventKeySpecifier),
		fields?: PromotionRuleDeletedEventFieldPolicy,
	},
	PromotionRuleEventInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleEventInterfaceKeySpecifier | (() => undefined | PromotionRuleEventInterfaceKeySpecifier),
		fields?: PromotionRuleEventInterfaceFieldPolicy,
	},
	PromotionRuleTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleTranslatableContentKeySpecifier | (() => undefined | PromotionRuleTranslatableContentKeySpecifier),
		fields?: PromotionRuleTranslatableContentFieldPolicy,
	},
	PromotionRuleTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleTranslateKeySpecifier | (() => undefined | PromotionRuleTranslateKeySpecifier),
		fields?: PromotionRuleTranslateFieldPolicy,
	},
	PromotionRuleTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleTranslationKeySpecifier | (() => undefined | PromotionRuleTranslationKeySpecifier),
		fields?: PromotionRuleTranslationFieldPolicy,
	},
	PromotionRuleUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleUpdateKeySpecifier | (() => undefined | PromotionRuleUpdateKeySpecifier),
		fields?: PromotionRuleUpdateFieldPolicy,
	},
	PromotionRuleUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleUpdateErrorKeySpecifier | (() => undefined | PromotionRuleUpdateErrorKeySpecifier),
		fields?: PromotionRuleUpdateErrorFieldPolicy,
	},
	PromotionRuleUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleUpdatedKeySpecifier | (() => undefined | PromotionRuleUpdatedKeySpecifier),
		fields?: PromotionRuleUpdatedFieldPolicy,
	},
	PromotionRuleUpdatedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionRuleUpdatedEventKeySpecifier | (() => undefined | PromotionRuleUpdatedEventKeySpecifier),
		fields?: PromotionRuleUpdatedEventFieldPolicy,
	},
	PromotionStarted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionStartedKeySpecifier | (() => undefined | PromotionStartedKeySpecifier),
		fields?: PromotionStartedFieldPolicy,
	},
	PromotionStartedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionStartedEventKeySpecifier | (() => undefined | PromotionStartedEventKeySpecifier),
		fields?: PromotionStartedEventFieldPolicy,
	},
	PromotionTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionTranslatableContentKeySpecifier | (() => undefined | PromotionTranslatableContentKeySpecifier),
		fields?: PromotionTranslatableContentFieldPolicy,
	},
	PromotionTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionTranslateKeySpecifier | (() => undefined | PromotionTranslateKeySpecifier),
		fields?: PromotionTranslateFieldPolicy,
	},
	PromotionTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionTranslationKeySpecifier | (() => undefined | PromotionTranslationKeySpecifier),
		fields?: PromotionTranslationFieldPolicy,
	},
	PromotionUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionUpdateKeySpecifier | (() => undefined | PromotionUpdateKeySpecifier),
		fields?: PromotionUpdateFieldPolicy,
	},
	PromotionUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionUpdateErrorKeySpecifier | (() => undefined | PromotionUpdateErrorKeySpecifier),
		fields?: PromotionUpdateErrorFieldPolicy,
	},
	PromotionUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionUpdatedKeySpecifier | (() => undefined | PromotionUpdatedKeySpecifier),
		fields?: PromotionUpdatedFieldPolicy,
	},
	PromotionUpdatedEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PromotionUpdatedEventKeySpecifier | (() => undefined | PromotionUpdatedEventKeySpecifier),
		fields?: PromotionUpdatedEventFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	ReducedRate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReducedRateKeySpecifier | (() => undefined | ReducedRateKeySpecifier),
		fields?: ReducedRateFieldPolicy,
	},
	RefreshToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefreshTokenKeySpecifier | (() => undefined | RefreshTokenKeySpecifier),
		fields?: RefreshTokenFieldPolicy,
	},
	RefundReasonReferenceTypeClear?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefundReasonReferenceTypeClearKeySpecifier | (() => undefined | RefundReasonReferenceTypeClearKeySpecifier),
		fields?: RefundReasonReferenceTypeClearFieldPolicy,
	},
	RefundReasonReferenceTypeClearError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefundReasonReferenceTypeClearErrorKeySpecifier | (() => undefined | RefundReasonReferenceTypeClearErrorKeySpecifier),
		fields?: RefundReasonReferenceTypeClearErrorFieldPolicy,
	},
	RefundSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefundSettingsKeySpecifier | (() => undefined | RefundSettingsKeySpecifier),
		fields?: RefundSettingsFieldPolicy,
	},
	RefundSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefundSettingsUpdateKeySpecifier | (() => undefined | RefundSettingsUpdateKeySpecifier),
		fields?: RefundSettingsUpdateFieldPolicy,
	},
	RefundSettingsUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefundSettingsUpdateErrorKeySpecifier | (() => undefined | RefundSettingsUpdateErrorKeySpecifier),
		fields?: RefundSettingsUpdateErrorFieldPolicy,
	},
	RequestEmailChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RequestEmailChangeKeySpecifier | (() => undefined | RequestEmailChangeKeySpecifier),
		fields?: RequestEmailChangeFieldPolicy,
	},
	RequestPasswordReset?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RequestPasswordResetKeySpecifier | (() => undefined | RequestPasswordResetKeySpecifier),
		fields?: RequestPasswordResetFieldPolicy,
	},
	Sale?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleKeySpecifier | (() => undefined | SaleKeySpecifier),
		fields?: SaleFieldPolicy,
	},
	SaleAddCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleAddCataloguesKeySpecifier | (() => undefined | SaleAddCataloguesKeySpecifier),
		fields?: SaleAddCataloguesFieldPolicy,
	},
	SaleBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleBulkDeleteKeySpecifier | (() => undefined | SaleBulkDeleteKeySpecifier),
		fields?: SaleBulkDeleteFieldPolicy,
	},
	SaleChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleChannelListingKeySpecifier | (() => undefined | SaleChannelListingKeySpecifier),
		fields?: SaleChannelListingFieldPolicy,
	},
	SaleChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleChannelListingUpdateKeySpecifier | (() => undefined | SaleChannelListingUpdateKeySpecifier),
		fields?: SaleChannelListingUpdateFieldPolicy,
	},
	SaleCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCountableConnectionKeySpecifier | (() => undefined | SaleCountableConnectionKeySpecifier),
		fields?: SaleCountableConnectionFieldPolicy,
	},
	SaleCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCountableEdgeKeySpecifier | (() => undefined | SaleCountableEdgeKeySpecifier),
		fields?: SaleCountableEdgeFieldPolicy,
	},
	SaleCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCreateKeySpecifier | (() => undefined | SaleCreateKeySpecifier),
		fields?: SaleCreateFieldPolicy,
	},
	SaleCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCreatedKeySpecifier | (() => undefined | SaleCreatedKeySpecifier),
		fields?: SaleCreatedFieldPolicy,
	},
	SaleDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleDeleteKeySpecifier | (() => undefined | SaleDeleteKeySpecifier),
		fields?: SaleDeleteFieldPolicy,
	},
	SaleDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleDeletedKeySpecifier | (() => undefined | SaleDeletedKeySpecifier),
		fields?: SaleDeletedFieldPolicy,
	},
	SaleRemoveCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleRemoveCataloguesKeySpecifier | (() => undefined | SaleRemoveCataloguesKeySpecifier),
		fields?: SaleRemoveCataloguesFieldPolicy,
	},
	SaleToggle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleToggleKeySpecifier | (() => undefined | SaleToggleKeySpecifier),
		fields?: SaleToggleFieldPolicy,
	},
	SaleTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleTranslatableContentKeySpecifier | (() => undefined | SaleTranslatableContentKeySpecifier),
		fields?: SaleTranslatableContentFieldPolicy,
	},
	SaleTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleTranslateKeySpecifier | (() => undefined | SaleTranslateKeySpecifier),
		fields?: SaleTranslateFieldPolicy,
	},
	SaleTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleTranslationKeySpecifier | (() => undefined | SaleTranslationKeySpecifier),
		fields?: SaleTranslationFieldPolicy,
	},
	SaleUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleUpdateKeySpecifier | (() => undefined | SaleUpdateKeySpecifier),
		fields?: SaleUpdateFieldPolicy,
	},
	SaleUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleUpdatedKeySpecifier | (() => undefined | SaleUpdatedKeySpecifier),
		fields?: SaleUpdatedFieldPolicy,
	},
	SelectedAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SelectedAttributeKeySpecifier | (() => undefined | SelectedAttributeKeySpecifier),
		fields?: SelectedAttributeFieldPolicy,
	},
	SendConfirmationEmail?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SendConfirmationEmailKeySpecifier | (() => undefined | SendConfirmationEmailKeySpecifier),
		fields?: SendConfirmationEmailFieldPolicy,
	},
	SendConfirmationEmailError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SendConfirmationEmailErrorKeySpecifier | (() => undefined | SendConfirmationEmailErrorKeySpecifier),
		fields?: SendConfirmationEmailErrorFieldPolicy,
	},
	SetPassword?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SetPasswordKeySpecifier | (() => undefined | SetPasswordKeySpecifier),
		fields?: SetPasswordFieldPolicy,
	},
	ShippingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingErrorKeySpecifier | (() => undefined | ShippingErrorKeySpecifier),
		fields?: ShippingErrorFieldPolicy,
	},
	ShippingListMethodsForCheckout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingListMethodsForCheckoutKeySpecifier | (() => undefined | ShippingListMethodsForCheckoutKeySpecifier),
		fields?: ShippingListMethodsForCheckoutFieldPolicy,
	},
	ShippingMethod?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodKeySpecifier | (() => undefined | ShippingMethodKeySpecifier),
		fields?: ShippingMethodFieldPolicy,
	},
	ShippingMethodChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodChannelListingKeySpecifier | (() => undefined | ShippingMethodChannelListingKeySpecifier),
		fields?: ShippingMethodChannelListingFieldPolicy,
	},
	ShippingMethodChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodChannelListingUpdateKeySpecifier | (() => undefined | ShippingMethodChannelListingUpdateKeySpecifier),
		fields?: ShippingMethodChannelListingUpdateFieldPolicy,
	},
	ShippingMethodPostalCodeRule?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodPostalCodeRuleKeySpecifier | (() => undefined | ShippingMethodPostalCodeRuleKeySpecifier),
		fields?: ShippingMethodPostalCodeRuleFieldPolicy,
	},
	ShippingMethodTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodTranslatableContentKeySpecifier | (() => undefined | ShippingMethodTranslatableContentKeySpecifier),
		fields?: ShippingMethodTranslatableContentFieldPolicy,
	},
	ShippingMethodTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodTranslationKeySpecifier | (() => undefined | ShippingMethodTranslationKeySpecifier),
		fields?: ShippingMethodTranslationFieldPolicy,
	},
	ShippingMethodType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodTypeKeySpecifier | (() => undefined | ShippingMethodTypeKeySpecifier),
		fields?: ShippingMethodTypeFieldPolicy,
	},
	ShippingMethodsPerCountry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodsPerCountryKeySpecifier | (() => undefined | ShippingMethodsPerCountryKeySpecifier),
		fields?: ShippingMethodsPerCountryFieldPolicy,
	},
	ShippingPriceBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceBulkDeleteKeySpecifier | (() => undefined | ShippingPriceBulkDeleteKeySpecifier),
		fields?: ShippingPriceBulkDeleteFieldPolicy,
	},
	ShippingPriceCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceCreateKeySpecifier | (() => undefined | ShippingPriceCreateKeySpecifier),
		fields?: ShippingPriceCreateFieldPolicy,
	},
	ShippingPriceCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceCreatedKeySpecifier | (() => undefined | ShippingPriceCreatedKeySpecifier),
		fields?: ShippingPriceCreatedFieldPolicy,
	},
	ShippingPriceDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceDeleteKeySpecifier | (() => undefined | ShippingPriceDeleteKeySpecifier),
		fields?: ShippingPriceDeleteFieldPolicy,
	},
	ShippingPriceDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceDeletedKeySpecifier | (() => undefined | ShippingPriceDeletedKeySpecifier),
		fields?: ShippingPriceDeletedFieldPolicy,
	},
	ShippingPriceExcludeProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceExcludeProductsKeySpecifier | (() => undefined | ShippingPriceExcludeProductsKeySpecifier),
		fields?: ShippingPriceExcludeProductsFieldPolicy,
	},
	ShippingPriceRemoveProductFromExclude?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceRemoveProductFromExcludeKeySpecifier | (() => undefined | ShippingPriceRemoveProductFromExcludeKeySpecifier),
		fields?: ShippingPriceRemoveProductFromExcludeFieldPolicy,
	},
	ShippingPriceTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceTranslateKeySpecifier | (() => undefined | ShippingPriceTranslateKeySpecifier),
		fields?: ShippingPriceTranslateFieldPolicy,
	},
	ShippingPriceUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceUpdateKeySpecifier | (() => undefined | ShippingPriceUpdateKeySpecifier),
		fields?: ShippingPriceUpdateFieldPolicy,
	},
	ShippingPriceUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceUpdatedKeySpecifier | (() => undefined | ShippingPriceUpdatedKeySpecifier),
		fields?: ShippingPriceUpdatedFieldPolicy,
	},
	ShippingZone?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneKeySpecifier | (() => undefined | ShippingZoneKeySpecifier),
		fields?: ShippingZoneFieldPolicy,
	},
	ShippingZoneBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneBulkDeleteKeySpecifier | (() => undefined | ShippingZoneBulkDeleteKeySpecifier),
		fields?: ShippingZoneBulkDeleteFieldPolicy,
	},
	ShippingZoneCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCountableConnectionKeySpecifier | (() => undefined | ShippingZoneCountableConnectionKeySpecifier),
		fields?: ShippingZoneCountableConnectionFieldPolicy,
	},
	ShippingZoneCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCountableEdgeKeySpecifier | (() => undefined | ShippingZoneCountableEdgeKeySpecifier),
		fields?: ShippingZoneCountableEdgeFieldPolicy,
	},
	ShippingZoneCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCreateKeySpecifier | (() => undefined | ShippingZoneCreateKeySpecifier),
		fields?: ShippingZoneCreateFieldPolicy,
	},
	ShippingZoneCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCreatedKeySpecifier | (() => undefined | ShippingZoneCreatedKeySpecifier),
		fields?: ShippingZoneCreatedFieldPolicy,
	},
	ShippingZoneDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneDeleteKeySpecifier | (() => undefined | ShippingZoneDeleteKeySpecifier),
		fields?: ShippingZoneDeleteFieldPolicy,
	},
	ShippingZoneDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneDeletedKeySpecifier | (() => undefined | ShippingZoneDeletedKeySpecifier),
		fields?: ShippingZoneDeletedFieldPolicy,
	},
	ShippingZoneMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneMetadataUpdatedKeySpecifier | (() => undefined | ShippingZoneMetadataUpdatedKeySpecifier),
		fields?: ShippingZoneMetadataUpdatedFieldPolicy,
	},
	ShippingZoneUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneUpdateKeySpecifier | (() => undefined | ShippingZoneUpdateKeySpecifier),
		fields?: ShippingZoneUpdateFieldPolicy,
	},
	ShippingZoneUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneUpdatedKeySpecifier | (() => undefined | ShippingZoneUpdatedKeySpecifier),
		fields?: ShippingZoneUpdatedFieldPolicy,
	},
	Shop?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopKeySpecifier | (() => undefined | ShopKeySpecifier),
		fields?: ShopFieldPolicy,
	},
	ShopAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopAddressUpdateKeySpecifier | (() => undefined | ShopAddressUpdateKeySpecifier),
		fields?: ShopAddressUpdateFieldPolicy,
	},
	ShopDomainUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopDomainUpdateKeySpecifier | (() => undefined | ShopDomainUpdateKeySpecifier),
		fields?: ShopDomainUpdateFieldPolicy,
	},
	ShopError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopErrorKeySpecifier | (() => undefined | ShopErrorKeySpecifier),
		fields?: ShopErrorFieldPolicy,
	},
	ShopFetchTaxRates?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopFetchTaxRatesKeySpecifier | (() => undefined | ShopFetchTaxRatesKeySpecifier),
		fields?: ShopFetchTaxRatesFieldPolicy,
	},
	ShopMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopMetadataUpdatedKeySpecifier | (() => undefined | ShopMetadataUpdatedKeySpecifier),
		fields?: ShopMetadataUpdatedFieldPolicy,
	},
	ShopSettingsTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopSettingsTranslateKeySpecifier | (() => undefined | ShopSettingsTranslateKeySpecifier),
		fields?: ShopSettingsTranslateFieldPolicy,
	},
	ShopSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopSettingsUpdateKeySpecifier | (() => undefined | ShopSettingsUpdateKeySpecifier),
		fields?: ShopSettingsUpdateFieldPolicy,
	},
	ShopTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopTranslationKeySpecifier | (() => undefined | ShopTranslationKeySpecifier),
		fields?: ShopTranslationFieldPolicy,
	},
	StaffBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffBulkDeleteKeySpecifier | (() => undefined | StaffBulkDeleteKeySpecifier),
		fields?: StaffBulkDeleteFieldPolicy,
	},
	StaffCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffCreateKeySpecifier | (() => undefined | StaffCreateKeySpecifier),
		fields?: StaffCreateFieldPolicy,
	},
	StaffCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffCreatedKeySpecifier | (() => undefined | StaffCreatedKeySpecifier),
		fields?: StaffCreatedFieldPolicy,
	},
	StaffDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffDeleteKeySpecifier | (() => undefined | StaffDeleteKeySpecifier),
		fields?: StaffDeleteFieldPolicy,
	},
	StaffDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffDeletedKeySpecifier | (() => undefined | StaffDeletedKeySpecifier),
		fields?: StaffDeletedFieldPolicy,
	},
	StaffError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffErrorKeySpecifier | (() => undefined | StaffErrorKeySpecifier),
		fields?: StaffErrorFieldPolicy,
	},
	StaffNotificationRecipient?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientKeySpecifier | (() => undefined | StaffNotificationRecipientKeySpecifier),
		fields?: StaffNotificationRecipientFieldPolicy,
	},
	StaffNotificationRecipientCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientCreateKeySpecifier | (() => undefined | StaffNotificationRecipientCreateKeySpecifier),
		fields?: StaffNotificationRecipientCreateFieldPolicy,
	},
	StaffNotificationRecipientDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientDeleteKeySpecifier | (() => undefined | StaffNotificationRecipientDeleteKeySpecifier),
		fields?: StaffNotificationRecipientDeleteFieldPolicy,
	},
	StaffNotificationRecipientUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientUpdateKeySpecifier | (() => undefined | StaffNotificationRecipientUpdateKeySpecifier),
		fields?: StaffNotificationRecipientUpdateFieldPolicy,
	},
	StaffSetPasswordRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffSetPasswordRequestedKeySpecifier | (() => undefined | StaffSetPasswordRequestedKeySpecifier),
		fields?: StaffSetPasswordRequestedFieldPolicy,
	},
	StaffUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffUpdateKeySpecifier | (() => undefined | StaffUpdateKeySpecifier),
		fields?: StaffUpdateFieldPolicy,
	},
	StaffUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffUpdatedKeySpecifier | (() => undefined | StaffUpdatedKeySpecifier),
		fields?: StaffUpdatedFieldPolicy,
	},
	Stock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockKeySpecifier | (() => undefined | StockKeySpecifier),
		fields?: StockFieldPolicy,
	},
	StockBulkResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockBulkResultKeySpecifier | (() => undefined | StockBulkResultKeySpecifier),
		fields?: StockBulkResultFieldPolicy,
	},
	StockBulkUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockBulkUpdateKeySpecifier | (() => undefined | StockBulkUpdateKeySpecifier),
		fields?: StockBulkUpdateFieldPolicy,
	},
	StockBulkUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockBulkUpdateErrorKeySpecifier | (() => undefined | StockBulkUpdateErrorKeySpecifier),
		fields?: StockBulkUpdateErrorFieldPolicy,
	},
	StockCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockCountableConnectionKeySpecifier | (() => undefined | StockCountableConnectionKeySpecifier),
		fields?: StockCountableConnectionFieldPolicy,
	},
	StockCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockCountableEdgeKeySpecifier | (() => undefined | StockCountableEdgeKeySpecifier),
		fields?: StockCountableEdgeFieldPolicy,
	},
	StockError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockErrorKeySpecifier | (() => undefined | StockErrorKeySpecifier),
		fields?: StockErrorFieldPolicy,
	},
	StockSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockSettingsKeySpecifier | (() => undefined | StockSettingsKeySpecifier),
		fields?: StockSettingsFieldPolicy,
	},
	StoredPaymentMethod?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoredPaymentMethodKeySpecifier | (() => undefined | StoredPaymentMethodKeySpecifier),
		fields?: StoredPaymentMethodFieldPolicy,
	},
	StoredPaymentMethodDeleteRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoredPaymentMethodDeleteRequestedKeySpecifier | (() => undefined | StoredPaymentMethodDeleteRequestedKeySpecifier),
		fields?: StoredPaymentMethodDeleteRequestedFieldPolicy,
	},
	StoredPaymentMethodRequestDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoredPaymentMethodRequestDeleteKeySpecifier | (() => undefined | StoredPaymentMethodRequestDeleteKeySpecifier),
		fields?: StoredPaymentMethodRequestDeleteFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	TaxClass?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassKeySpecifier | (() => undefined | TaxClassKeySpecifier),
		fields?: TaxClassFieldPolicy,
	},
	TaxClassCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassCountableConnectionKeySpecifier | (() => undefined | TaxClassCountableConnectionKeySpecifier),
		fields?: TaxClassCountableConnectionFieldPolicy,
	},
	TaxClassCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassCountableEdgeKeySpecifier | (() => undefined | TaxClassCountableEdgeKeySpecifier),
		fields?: TaxClassCountableEdgeFieldPolicy,
	},
	TaxClassCountryRate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassCountryRateKeySpecifier | (() => undefined | TaxClassCountryRateKeySpecifier),
		fields?: TaxClassCountryRateFieldPolicy,
	},
	TaxClassCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassCreateKeySpecifier | (() => undefined | TaxClassCreateKeySpecifier),
		fields?: TaxClassCreateFieldPolicy,
	},
	TaxClassCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassCreateErrorKeySpecifier | (() => undefined | TaxClassCreateErrorKeySpecifier),
		fields?: TaxClassCreateErrorFieldPolicy,
	},
	TaxClassDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassDeleteKeySpecifier | (() => undefined | TaxClassDeleteKeySpecifier),
		fields?: TaxClassDeleteFieldPolicy,
	},
	TaxClassDeleteError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassDeleteErrorKeySpecifier | (() => undefined | TaxClassDeleteErrorKeySpecifier),
		fields?: TaxClassDeleteErrorFieldPolicy,
	},
	TaxClassUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassUpdateKeySpecifier | (() => undefined | TaxClassUpdateKeySpecifier),
		fields?: TaxClassUpdateFieldPolicy,
	},
	TaxClassUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxClassUpdateErrorKeySpecifier | (() => undefined | TaxClassUpdateErrorKeySpecifier),
		fields?: TaxClassUpdateErrorFieldPolicy,
	},
	TaxConfiguration?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxConfigurationKeySpecifier | (() => undefined | TaxConfigurationKeySpecifier),
		fields?: TaxConfigurationFieldPolicy,
	},
	TaxConfigurationCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxConfigurationCountableConnectionKeySpecifier | (() => undefined | TaxConfigurationCountableConnectionKeySpecifier),
		fields?: TaxConfigurationCountableConnectionFieldPolicy,
	},
	TaxConfigurationCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxConfigurationCountableEdgeKeySpecifier | (() => undefined | TaxConfigurationCountableEdgeKeySpecifier),
		fields?: TaxConfigurationCountableEdgeFieldPolicy,
	},
	TaxConfigurationPerCountry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxConfigurationPerCountryKeySpecifier | (() => undefined | TaxConfigurationPerCountryKeySpecifier),
		fields?: TaxConfigurationPerCountryFieldPolicy,
	},
	TaxConfigurationUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxConfigurationUpdateKeySpecifier | (() => undefined | TaxConfigurationUpdateKeySpecifier),
		fields?: TaxConfigurationUpdateFieldPolicy,
	},
	TaxConfigurationUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxConfigurationUpdateErrorKeySpecifier | (() => undefined | TaxConfigurationUpdateErrorKeySpecifier),
		fields?: TaxConfigurationUpdateErrorFieldPolicy,
	},
	TaxCountryConfiguration?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxCountryConfigurationKeySpecifier | (() => undefined | TaxCountryConfigurationKeySpecifier),
		fields?: TaxCountryConfigurationFieldPolicy,
	},
	TaxCountryConfigurationDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxCountryConfigurationDeleteKeySpecifier | (() => undefined | TaxCountryConfigurationDeleteKeySpecifier),
		fields?: TaxCountryConfigurationDeleteFieldPolicy,
	},
	TaxCountryConfigurationDeleteError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxCountryConfigurationDeleteErrorKeySpecifier | (() => undefined | TaxCountryConfigurationDeleteErrorKeySpecifier),
		fields?: TaxCountryConfigurationDeleteErrorFieldPolicy,
	},
	TaxCountryConfigurationUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxCountryConfigurationUpdateKeySpecifier | (() => undefined | TaxCountryConfigurationUpdateKeySpecifier),
		fields?: TaxCountryConfigurationUpdateFieldPolicy,
	},
	TaxCountryConfigurationUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxCountryConfigurationUpdateErrorKeySpecifier | (() => undefined | TaxCountryConfigurationUpdateErrorKeySpecifier),
		fields?: TaxCountryConfigurationUpdateErrorFieldPolicy,
	},
	TaxExemptionManage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxExemptionManageKeySpecifier | (() => undefined | TaxExemptionManageKeySpecifier),
		fields?: TaxExemptionManageFieldPolicy,
	},
	TaxExemptionManageError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxExemptionManageErrorKeySpecifier | (() => undefined | TaxExemptionManageErrorKeySpecifier),
		fields?: TaxExemptionManageErrorFieldPolicy,
	},
	TaxType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxTypeKeySpecifier | (() => undefined | TaxTypeKeySpecifier),
		fields?: TaxTypeFieldPolicy,
	},
	TaxableObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxableObjectKeySpecifier | (() => undefined | TaxableObjectKeySpecifier),
		fields?: TaxableObjectFieldPolicy,
	},
	TaxableObjectDiscount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxableObjectDiscountKeySpecifier | (() => undefined | TaxableObjectDiscountKeySpecifier),
		fields?: TaxableObjectDiscountFieldPolicy,
	},
	TaxableObjectLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxableObjectLineKeySpecifier | (() => undefined | TaxableObjectLineKeySpecifier),
		fields?: TaxableObjectLineFieldPolicy,
	},
	TaxedMoney?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxedMoneyKeySpecifier | (() => undefined | TaxedMoneyKeySpecifier),
		fields?: TaxedMoneyFieldPolicy,
	},
	TaxedMoneyRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxedMoneyRangeKeySpecifier | (() => undefined | TaxedMoneyRangeKeySpecifier),
		fields?: TaxedMoneyRangeFieldPolicy,
	},
	ThumbnailCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ThumbnailCreatedKeySpecifier | (() => undefined | ThumbnailCreatedKeySpecifier),
		fields?: ThumbnailCreatedFieldPolicy,
	},
	TimePeriod?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TimePeriodKeySpecifier | (() => undefined | TimePeriodKeySpecifier),
		fields?: TimePeriodFieldPolicy,
	},
	Transaction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionKeySpecifier | (() => undefined | TransactionKeySpecifier),
		fields?: TransactionFieldPolicy,
	},
	TransactionAction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionActionKeySpecifier | (() => undefined | TransactionActionKeySpecifier),
		fields?: TransactionActionFieldPolicy,
	},
	TransactionCancelationRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionCancelationRequestedKeySpecifier | (() => undefined | TransactionCancelationRequestedKeySpecifier),
		fields?: TransactionCancelationRequestedFieldPolicy,
	},
	TransactionChargeRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionChargeRequestedKeySpecifier | (() => undefined | TransactionChargeRequestedKeySpecifier),
		fields?: TransactionChargeRequestedFieldPolicy,
	},
	TransactionCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionCreateKeySpecifier | (() => undefined | TransactionCreateKeySpecifier),
		fields?: TransactionCreateFieldPolicy,
	},
	TransactionCreateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionCreateErrorKeySpecifier | (() => undefined | TransactionCreateErrorKeySpecifier),
		fields?: TransactionCreateErrorFieldPolicy,
	},
	TransactionEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionEventKeySpecifier | (() => undefined | TransactionEventKeySpecifier),
		fields?: TransactionEventFieldPolicy,
	},
	TransactionEventReport?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionEventReportKeySpecifier | (() => undefined | TransactionEventReportKeySpecifier),
		fields?: TransactionEventReportFieldPolicy,
	},
	TransactionEventReportError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionEventReportErrorKeySpecifier | (() => undefined | TransactionEventReportErrorKeySpecifier),
		fields?: TransactionEventReportErrorFieldPolicy,
	},
	TransactionInitialize?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionInitializeKeySpecifier | (() => undefined | TransactionInitializeKeySpecifier),
		fields?: TransactionInitializeFieldPolicy,
	},
	TransactionInitializeError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionInitializeErrorKeySpecifier | (() => undefined | TransactionInitializeErrorKeySpecifier),
		fields?: TransactionInitializeErrorFieldPolicy,
	},
	TransactionInitializeSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionInitializeSessionKeySpecifier | (() => undefined | TransactionInitializeSessionKeySpecifier),
		fields?: TransactionInitializeSessionFieldPolicy,
	},
	TransactionItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionItemKeySpecifier | (() => undefined | TransactionItemKeySpecifier),
		fields?: TransactionItemFieldPolicy,
	},
	TransactionItemMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionItemMetadataUpdatedKeySpecifier | (() => undefined | TransactionItemMetadataUpdatedKeySpecifier),
		fields?: TransactionItemMetadataUpdatedFieldPolicy,
	},
	TransactionProcess?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionProcessKeySpecifier | (() => undefined | TransactionProcessKeySpecifier),
		fields?: TransactionProcessFieldPolicy,
	},
	TransactionProcessAction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionProcessActionKeySpecifier | (() => undefined | TransactionProcessActionKeySpecifier),
		fields?: TransactionProcessActionFieldPolicy,
	},
	TransactionProcessError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionProcessErrorKeySpecifier | (() => undefined | TransactionProcessErrorKeySpecifier),
		fields?: TransactionProcessErrorFieldPolicy,
	},
	TransactionProcessSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionProcessSessionKeySpecifier | (() => undefined | TransactionProcessSessionKeySpecifier),
		fields?: TransactionProcessSessionFieldPolicy,
	},
	TransactionRefundRequested?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionRefundRequestedKeySpecifier | (() => undefined | TransactionRefundRequestedKeySpecifier),
		fields?: TransactionRefundRequestedFieldPolicy,
	},
	TransactionRequestAction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionRequestActionKeySpecifier | (() => undefined | TransactionRequestActionKeySpecifier),
		fields?: TransactionRequestActionFieldPolicy,
	},
	TransactionRequestActionError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionRequestActionErrorKeySpecifier | (() => undefined | TransactionRequestActionErrorKeySpecifier),
		fields?: TransactionRequestActionErrorFieldPolicy,
	},
	TransactionRequestRefundForGrantedRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionRequestRefundForGrantedRefundKeySpecifier | (() => undefined | TransactionRequestRefundForGrantedRefundKeySpecifier),
		fields?: TransactionRequestRefundForGrantedRefundFieldPolicy,
	},
	TransactionRequestRefundForGrantedRefundError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionRequestRefundForGrantedRefundErrorKeySpecifier | (() => undefined | TransactionRequestRefundForGrantedRefundErrorKeySpecifier),
		fields?: TransactionRequestRefundForGrantedRefundErrorFieldPolicy,
	},
	TransactionUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionUpdateKeySpecifier | (() => undefined | TransactionUpdateKeySpecifier),
		fields?: TransactionUpdateFieldPolicy,
	},
	TransactionUpdateError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionUpdateErrorKeySpecifier | (() => undefined | TransactionUpdateErrorKeySpecifier),
		fields?: TransactionUpdateErrorFieldPolicy,
	},
	TranslatableItemConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslatableItemConnectionKeySpecifier | (() => undefined | TranslatableItemConnectionKeySpecifier),
		fields?: TranslatableItemConnectionFieldPolicy,
	},
	TranslatableItemEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslatableItemEdgeKeySpecifier | (() => undefined | TranslatableItemEdgeKeySpecifier),
		fields?: TranslatableItemEdgeFieldPolicy,
	},
	TranslationCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslationCreatedKeySpecifier | (() => undefined | TranslationCreatedKeySpecifier),
		fields?: TranslationCreatedFieldPolicy,
	},
	TranslationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslationErrorKeySpecifier | (() => undefined | TranslationErrorKeySpecifier),
		fields?: TranslationErrorFieldPolicy,
	},
	TranslationUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslationUpdatedKeySpecifier | (() => undefined | TranslationUpdatedKeySpecifier),
		fields?: TranslationUpdatedFieldPolicy,
	},
	UpdateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateMetadataKeySpecifier | (() => undefined | UpdateMetadataKeySpecifier),
		fields?: UpdateMetadataFieldPolicy,
	},
	UpdatePrivateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdatePrivateMetadataKeySpecifier | (() => undefined | UpdatePrivateMetadataKeySpecifier),
		fields?: UpdatePrivateMetadataFieldPolicy,
	},
	UploadError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UploadErrorKeySpecifier | (() => undefined | UploadErrorKeySpecifier),
		fields?: UploadErrorFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserAvatarDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAvatarDeleteKeySpecifier | (() => undefined | UserAvatarDeleteKeySpecifier),
		fields?: UserAvatarDeleteFieldPolicy,
	},
	UserAvatarUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAvatarUpdateKeySpecifier | (() => undefined | UserAvatarUpdateKeySpecifier),
		fields?: UserAvatarUpdateFieldPolicy,
	},
	UserBulkSetActive?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserBulkSetActiveKeySpecifier | (() => undefined | UserBulkSetActiveKeySpecifier),
		fields?: UserBulkSetActiveFieldPolicy,
	},
	UserCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCountableConnectionKeySpecifier | (() => undefined | UserCountableConnectionKeySpecifier),
		fields?: UserCountableConnectionFieldPolicy,
	},
	UserCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCountableEdgeKeySpecifier | (() => undefined | UserCountableEdgeKeySpecifier),
		fields?: UserCountableEdgeFieldPolicy,
	},
	UserPermission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserPermissionKeySpecifier | (() => undefined | UserPermissionKeySpecifier),
		fields?: UserPermissionFieldPolicy,
	},
	VAT?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VATKeySpecifier | (() => undefined | VATKeySpecifier),
		fields?: VATFieldPolicy,
	},
	VariantMediaAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VariantMediaAssignKeySpecifier | (() => undefined | VariantMediaAssignKeySpecifier),
		fields?: VariantMediaAssignFieldPolicy,
	},
	VariantMediaUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VariantMediaUnassignKeySpecifier | (() => undefined | VariantMediaUnassignKeySpecifier),
		fields?: VariantMediaUnassignFieldPolicy,
	},
	VariantPricingInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VariantPricingInfoKeySpecifier | (() => undefined | VariantPricingInfoKeySpecifier),
		fields?: VariantPricingInfoFieldPolicy,
	},
	VerifyToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VerifyTokenKeySpecifier | (() => undefined | VerifyTokenKeySpecifier),
		fields?: VerifyTokenFieldPolicy,
	},
	Voucher?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherKeySpecifier | (() => undefined | VoucherKeySpecifier),
		fields?: VoucherFieldPolicy,
	},
	VoucherAddCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherAddCataloguesKeySpecifier | (() => undefined | VoucherAddCataloguesKeySpecifier),
		fields?: VoucherAddCataloguesFieldPolicy,
	},
	VoucherBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherBulkDeleteKeySpecifier | (() => undefined | VoucherBulkDeleteKeySpecifier),
		fields?: VoucherBulkDeleteFieldPolicy,
	},
	VoucherChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherChannelListingKeySpecifier | (() => undefined | VoucherChannelListingKeySpecifier),
		fields?: VoucherChannelListingFieldPolicy,
	},
	VoucherChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherChannelListingUpdateKeySpecifier | (() => undefined | VoucherChannelListingUpdateKeySpecifier),
		fields?: VoucherChannelListingUpdateFieldPolicy,
	},
	VoucherCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodeKeySpecifier | (() => undefined | VoucherCodeKeySpecifier),
		fields?: VoucherCodeFieldPolicy,
	},
	VoucherCodeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodeBulkDeleteKeySpecifier | (() => undefined | VoucherCodeBulkDeleteKeySpecifier),
		fields?: VoucherCodeBulkDeleteFieldPolicy,
	},
	VoucherCodeBulkDeleteError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodeBulkDeleteErrorKeySpecifier | (() => undefined | VoucherCodeBulkDeleteErrorKeySpecifier),
		fields?: VoucherCodeBulkDeleteErrorFieldPolicy,
	},
	VoucherCodeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodeCountableConnectionKeySpecifier | (() => undefined | VoucherCodeCountableConnectionKeySpecifier),
		fields?: VoucherCodeCountableConnectionFieldPolicy,
	},
	VoucherCodeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodeCountableEdgeKeySpecifier | (() => undefined | VoucherCodeCountableEdgeKeySpecifier),
		fields?: VoucherCodeCountableEdgeFieldPolicy,
	},
	VoucherCodeExportCompleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodeExportCompletedKeySpecifier | (() => undefined | VoucherCodeExportCompletedKeySpecifier),
		fields?: VoucherCodeExportCompletedFieldPolicy,
	},
	VoucherCodesCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodesCreatedKeySpecifier | (() => undefined | VoucherCodesCreatedKeySpecifier),
		fields?: VoucherCodesCreatedFieldPolicy,
	},
	VoucherCodesDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCodesDeletedKeySpecifier | (() => undefined | VoucherCodesDeletedKeySpecifier),
		fields?: VoucherCodesDeletedFieldPolicy,
	},
	VoucherCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCountableConnectionKeySpecifier | (() => undefined | VoucherCountableConnectionKeySpecifier),
		fields?: VoucherCountableConnectionFieldPolicy,
	},
	VoucherCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCountableEdgeKeySpecifier | (() => undefined | VoucherCountableEdgeKeySpecifier),
		fields?: VoucherCountableEdgeFieldPolicy,
	},
	VoucherCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCreateKeySpecifier | (() => undefined | VoucherCreateKeySpecifier),
		fields?: VoucherCreateFieldPolicy,
	},
	VoucherCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCreatedKeySpecifier | (() => undefined | VoucherCreatedKeySpecifier),
		fields?: VoucherCreatedFieldPolicy,
	},
	VoucherDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherDeleteKeySpecifier | (() => undefined | VoucherDeleteKeySpecifier),
		fields?: VoucherDeleteFieldPolicy,
	},
	VoucherDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherDeletedKeySpecifier | (() => undefined | VoucherDeletedKeySpecifier),
		fields?: VoucherDeletedFieldPolicy,
	},
	VoucherMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherMetadataUpdatedKeySpecifier | (() => undefined | VoucherMetadataUpdatedKeySpecifier),
		fields?: VoucherMetadataUpdatedFieldPolicy,
	},
	VoucherRemoveCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherRemoveCataloguesKeySpecifier | (() => undefined | VoucherRemoveCataloguesKeySpecifier),
		fields?: VoucherRemoveCataloguesFieldPolicy,
	},
	VoucherTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherTranslatableContentKeySpecifier | (() => undefined | VoucherTranslatableContentKeySpecifier),
		fields?: VoucherTranslatableContentFieldPolicy,
	},
	VoucherTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherTranslateKeySpecifier | (() => undefined | VoucherTranslateKeySpecifier),
		fields?: VoucherTranslateFieldPolicy,
	},
	VoucherTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherTranslationKeySpecifier | (() => undefined | VoucherTranslationKeySpecifier),
		fields?: VoucherTranslationFieldPolicy,
	},
	VoucherUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherUpdateKeySpecifier | (() => undefined | VoucherUpdateKeySpecifier),
		fields?: VoucherUpdateFieldPolicy,
	},
	VoucherUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherUpdatedKeySpecifier | (() => undefined | VoucherUpdatedKeySpecifier),
		fields?: VoucherUpdatedFieldPolicy,
	},
	Warehouse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseKeySpecifier | (() => undefined | WarehouseKeySpecifier),
		fields?: WarehouseFieldPolicy,
	},
	WarehouseCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCountableConnectionKeySpecifier | (() => undefined | WarehouseCountableConnectionKeySpecifier),
		fields?: WarehouseCountableConnectionFieldPolicy,
	},
	WarehouseCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCountableEdgeKeySpecifier | (() => undefined | WarehouseCountableEdgeKeySpecifier),
		fields?: WarehouseCountableEdgeFieldPolicy,
	},
	WarehouseCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCreateKeySpecifier | (() => undefined | WarehouseCreateKeySpecifier),
		fields?: WarehouseCreateFieldPolicy,
	},
	WarehouseCreated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCreatedKeySpecifier | (() => undefined | WarehouseCreatedKeySpecifier),
		fields?: WarehouseCreatedFieldPolicy,
	},
	WarehouseDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseDeleteKeySpecifier | (() => undefined | WarehouseDeleteKeySpecifier),
		fields?: WarehouseDeleteFieldPolicy,
	},
	WarehouseDeleted?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseDeletedKeySpecifier | (() => undefined | WarehouseDeletedKeySpecifier),
		fields?: WarehouseDeletedFieldPolicy,
	},
	WarehouseError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseErrorKeySpecifier | (() => undefined | WarehouseErrorKeySpecifier),
		fields?: WarehouseErrorFieldPolicy,
	},
	WarehouseMetadataUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseMetadataUpdatedKeySpecifier | (() => undefined | WarehouseMetadataUpdatedKeySpecifier),
		fields?: WarehouseMetadataUpdatedFieldPolicy,
	},
	WarehouseShippingZoneAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseShippingZoneAssignKeySpecifier | (() => undefined | WarehouseShippingZoneAssignKeySpecifier),
		fields?: WarehouseShippingZoneAssignFieldPolicy,
	},
	WarehouseShippingZoneUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseShippingZoneUnassignKeySpecifier | (() => undefined | WarehouseShippingZoneUnassignKeySpecifier),
		fields?: WarehouseShippingZoneUnassignFieldPolicy,
	},
	WarehouseUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseUpdateKeySpecifier | (() => undefined | WarehouseUpdateKeySpecifier),
		fields?: WarehouseUpdateFieldPolicy,
	},
	WarehouseUpdated?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseUpdatedKeySpecifier | (() => undefined | WarehouseUpdatedKeySpecifier),
		fields?: WarehouseUpdatedFieldPolicy,
	},
	Webhook?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookKeySpecifier | (() => undefined | WebhookKeySpecifier),
		fields?: WebhookFieldPolicy,
	},
	WebhookCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookCreateKeySpecifier | (() => undefined | WebhookCreateKeySpecifier),
		fields?: WebhookCreateFieldPolicy,
	},
	WebhookDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookDeleteKeySpecifier | (() => undefined | WebhookDeleteKeySpecifier),
		fields?: WebhookDeleteFieldPolicy,
	},
	WebhookDryRun?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookDryRunKeySpecifier | (() => undefined | WebhookDryRunKeySpecifier),
		fields?: WebhookDryRunFieldPolicy,
	},
	WebhookDryRunError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookDryRunErrorKeySpecifier | (() => undefined | WebhookDryRunErrorKeySpecifier),
		fields?: WebhookDryRunErrorFieldPolicy,
	},
	WebhookError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookErrorKeySpecifier | (() => undefined | WebhookErrorKeySpecifier),
		fields?: WebhookErrorFieldPolicy,
	},
	WebhookEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookEventKeySpecifier | (() => undefined | WebhookEventKeySpecifier),
		fields?: WebhookEventFieldPolicy,
	},
	WebhookEventAsync?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookEventAsyncKeySpecifier | (() => undefined | WebhookEventAsyncKeySpecifier),
		fields?: WebhookEventAsyncFieldPolicy,
	},
	WebhookEventSync?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookEventSyncKeySpecifier | (() => undefined | WebhookEventSyncKeySpecifier),
		fields?: WebhookEventSyncFieldPolicy,
	},
	WebhookTrigger?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookTriggerKeySpecifier | (() => undefined | WebhookTriggerKeySpecifier),
		fields?: WebhookTriggerFieldPolicy,
	},
	WebhookTriggerError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookTriggerErrorKeySpecifier | (() => undefined | WebhookTriggerErrorKeySpecifier),
		fields?: WebhookTriggerErrorFieldPolicy,
	},
	WebhookUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookUpdateKeySpecifier | (() => undefined | WebhookUpdateKeySpecifier),
		fields?: WebhookUpdateFieldPolicy,
	},
	Weight?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WeightKeySpecifier | (() => undefined | WeightKeySpecifier),
		fields?: WeightFieldPolicy,
	},
	WidgetTargetOptions?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WidgetTargetOptionsKeySpecifier | (() => undefined | WidgetTargetOptionsKeySpecifier),
		fields?: WidgetTargetOptionsFieldPolicy,
	},
	_Service?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | _ServiceKeySpecifier | (() => undefined | _ServiceKeySpecifier),
		fields?: _ServiceFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;