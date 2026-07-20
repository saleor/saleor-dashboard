import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import { CompanyAddressForm } from "@dashboard/components/CompanyAddressInput/CompanyAddressForm";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { Link } from "@dashboard/components/Link";
import { Savebar } from "@dashboard/components/Savebar";
import { SettingsFieldStack } from "@dashboard/components/Settings/SettingsFieldStack";
import { SettingsHubLayout } from "@dashboard/components/Settings/SettingsHubLayout";
import { SettingsPageContent } from "@dashboard/components/Settings/SettingsPageContent";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { SettingsToggleRow } from "@dashboard/components/Settings/SettingsToggleRow";
import { SimpleRadioGroupField } from "@dashboard/components/SimpleRadioGroupField";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  PasswordLoginModeEnum,
  type ShopErrorFragment,
  type SiteSettingsQuery,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { sectionNames } from "@dashboard/intl";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages as passwordLoginMessages } from "../SitePasswordLoginCard/messages";
import { messages } from "./messages";
import { StoreDetailsFields } from "./StoreDetailsCard/StoreDetailsCard";

const stockAvailabilityWebhooks = [
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK_IN_CHANNEL,
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK_IN_CHANNEL,
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK_FOR_CLICK_AND_COLLECT,
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK_FOR_CLICK_AND_COLLECT,
];

const stockAvailabilityDocsUrl =
  "https://docs.saleor.io/developer/stock/overview#legacy-stock-availability";

interface SiteSettingsPageAddressFormData {
  city: string;
  companyName: string;
  country: string;
  countryArea: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface SiteSettingsPageFormData extends SiteSettingsPageAddressFormData {
  name: string;
  description: string;
  emailConfirmation: boolean;
  useLegacyUpdateWebhookEmission: boolean;
  useLegacyShippingZoneStockAvailability: boolean;
  preserveAllAddressFields: boolean;
  passwordLoginMode: PasswordLoginModeEnum;
}

interface SiteSettingsPageProps {
  disabled: boolean;
  errors: ShopErrorFragment[];
  shop?: SiteSettingsQuery["shop"];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: SiteSettingsPageFormData) => SubmitPromise;
}

export function areAddressInputFieldsModified(data: SiteSettingsPageAddressFormData): boolean {
  return (
    [
      "city",
      "country",
      "countryArea",
      "phone",
      "postalCode",
      "streetAddress1",
      "streetAddress2",
    ] as Array<keyof SiteSettingsPageAddressFormData>
  )
    .map(key => data[key])
    .some(field => field !== "");
}

export const SiteSettingsPage = ({
  disabled,
  errors,
  saveButtonBarState,
  shop,
  onSubmit,
}: SiteSettingsPageProps): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [displayCountry, setDisplayCountry] = useStateFromProps(
    shop?.companyAddress?.country.country || "",
  );
  const { errors: validationErrors, submit: handleSubmitWithAddress } =
    useAddressValidation(onSubmit);
  const initialFormAddress: SiteSettingsPageAddressFormData = {
    city: shop?.companyAddress?.city || "",
    companyName: shop?.companyAddress?.companyName || "",
    country: shop?.companyAddress?.country.code || "",
    countryArea: shop?.companyAddress?.countryArea || "",
    phone: shop?.companyAddress?.phone || "",
    postalCode: shop?.companyAddress?.postalCode || "",
    streetAddress1: shop?.companyAddress?.streetAddress1 || "",
    streetAddress2: shop?.companyAddress?.streetAddress2 || "",
  };
  const initialForm: SiteSettingsPageFormData = {
    ...initialFormAddress,
    name: shop?.name || "",
    description: shop?.description || "",
    emailConfirmation: shop?.enableAccountConfirmationByEmail ?? false,
    useLegacyUpdateWebhookEmission: shop?.useLegacyUpdateWebhookEmission ?? true,
    useLegacyShippingZoneStockAvailability: shop?.useLegacyShippingZoneStockAvailability ?? true,
    preserveAllAddressFields: shop?.preserveAllAddressFields ?? false,
    passwordLoginMode: shop?.passwordLoginMode ?? PasswordLoginModeEnum.ENABLED,
  };

  return (
    <SettingsHubLayout
      backHref={configurationMenuUrl}
      title={intl.formatMessage(sectionNames.siteSettings)}
    >
      <Form
        initial={initialForm}
        onSubmit={data => {
          const submitFunc = areAddressInputFieldsModified(data)
            ? handleSubmitWithAddress
            : onSubmit;

          return submitFunc(data);
        }}
        confirmLeave
        disabled={disabled}
      >
        {({ change, data, set, isSaveDisabled, submit }) => {
          const countryChoices = mapCountriesToChoices(shop?.countries || []);
          const countrySelect = createSingleAutocompleteSelectHandler(
            change,
            setDisplayCountry,
            countryChoices,
          );
          const handleCountrySelect = createCountryHandler(countrySelect, set);

          return (
            <>
              <SettingsPageContent
                description={
                  <FormattedMessage
                    id="En8pZE"
                    defaultMessage="Store identity, company address, and how customers sign in. Advanced options cover legacy API behavior."
                    description="intro under store settings page title"
                  />
                }
              >
                <SettingsSection
                  id={settingsHashes.storeDetails}
                  data-test-id="store-details-settings"
                  ownership="shop"
                  title={intl.formatMessage(messages.sectionStoreDetailsTitle)}
                  description={intl.formatMessage(messages.sectionStoreDetailsDescription)}
                >
                  <SettingsFieldStack>
                    <StoreDetailsFields
                      data={data}
                      errors={errors}
                      disabled={disabled}
                      onChange={change}
                    />
                  </SettingsFieldStack>
                </SettingsSection>

                <SettingsSection
                  id={settingsHashes.storeCompany}
                  data-test-id="company-address-settings"
                  ownership="shop"
                  title={intl.formatMessage(messages.sectionCompanyTitle)}
                  description={intl.formatMessage(messages.sectionCompanyDescription)}
                >
                  <SettingsFieldStack>
                    <CompanyAddressForm
                      data={data}
                      displayCountry={displayCountry}
                      countries={countryChoices}
                      errors={[...errors, ...validationErrors]}
                      disabled={disabled}
                      onChange={change}
                      onCountryChange={handleCountrySelect}
                    />
                  </SettingsFieldStack>
                </SettingsSection>

                <SettingsSection
                  id={settingsHashes.storeCustomerAccounts}
                  data-test-id="customer-accounts-settings"
                  ownership="shop"
                  title={intl.formatMessage(messages.sectionCustomerAccountsTitle)}
                  description={intl.formatMessage(messages.sectionCustomerAccountsDescription)}
                >
                  <SettingsToggleRow
                    id={settingsHashes.storeEmailConfirmation}
                    name="emailConfirmation"
                    title={intl.formatMessage(messages.sectionEmailConfirmationHeader)}
                    description={intl.formatMessage(messages.sectionEmailConfirmationDescription)}
                    checked={data.emailConfirmation}
                    disabled={disabled}
                    onCheckedChange={isEnabled =>
                      change({ target: { name: "emailConfirmation", value: isEnabled } })
                    }
                    data-test-id="require-email-confirmation-checkbox"
                  />
                  <Box id={settingsHashes.storePasswordLogin}>
                    <SettingsFieldStack
                      intro={
                        <Text size={3} fontWeight="medium">
                          {intl.formatMessage(passwordLoginMessages.cardHeader)}
                        </Text>
                      }
                    >
                      <SimpleRadioGroupField
                        name="passwordLoginMode"
                        value={data.passwordLoginMode}
                        onChange={change}
                        choices={[
                          {
                            label: (
                              <Box>
                                <Text>{intl.formatMessage(passwordLoginMessages.enabled)}</Text>
                                <Text size={2} color="default2" display="block">
                                  {intl.formatMessage(passwordLoginMessages.enabledDescription)}
                                </Text>
                              </Box>
                            ),
                            value: PasswordLoginModeEnum.ENABLED,
                          },
                          {
                            label: (
                              <Box>
                                <Text>
                                  {intl.formatMessage(passwordLoginMessages.customersOnly)}
                                </Text>
                                <Text size={2} color="default2" display="block">
                                  {intl.formatMessage(
                                    passwordLoginMessages.customersOnlyDescription,
                                  )}
                                </Text>
                              </Box>
                            ),
                            value: PasswordLoginModeEnum.CUSTOMERS_ONLY,
                          },
                          {
                            label: (
                              <Box>
                                <Text>{intl.formatMessage(passwordLoginMessages.disabled)}</Text>
                                <Text size={2} color="default2" display="block">
                                  {intl.formatMessage(passwordLoginMessages.disabledDescription)}
                                </Text>
                              </Box>
                            ),
                            value: PasswordLoginModeEnum.DISABLED,
                          },
                        ]}
                      />
                    </SettingsFieldStack>
                  </Box>
                </SettingsSection>

                <SettingsSection
                  id={settingsHashes.storeAdvanced}
                  data-test-id="store-advanced-settings"
                  ownership="shop"
                  title={intl.formatMessage(messages.sectionAdvancedTitle)}
                  description={intl.formatMessage(messages.sectionAdvancedDescription)}
                >
                  <SettingsToggleRow
                    id={settingsHashes.storeWebhookEmission}
                    name="useLegacyUpdateWebhookEmission"
                    title={intl.formatMessage(messages.sectionWebhookEmissionHeader)}
                    description={intl.formatMessage(messages.sectionWebhookEmissionDescription)}
                    checked={data.useLegacyUpdateWebhookEmission}
                    disabled={disabled}
                    onCheckedChange={isEnabled =>
                      change({
                        target: { name: "useLegacyUpdateWebhookEmission", value: isEnabled },
                      })
                    }
                    data-test-id="legacy-webhook-emission-checkbox"
                  />
                  <SettingsToggleRow
                    id={settingsHashes.storeStockAvailability}
                    name="useLegacyShippingZoneStockAvailability"
                    title={intl.formatMessage(messages.sectionStockAvailabilityHeader)}
                    description={
                      <FormattedMessage
                        {...messages.sectionStockAvailabilityDescription}
                        values={{
                          a: chunks => (
                            <Link href={stockAvailabilityDocsUrl} target="_blank">
                              {chunks}
                            </Link>
                          ),
                        }}
                      />
                    }
                    checked={data.useLegacyShippingZoneStockAvailability}
                    disabled={disabled}
                    onCheckedChange={isEnabled =>
                      change({
                        target: {
                          name: "useLegacyShippingZoneStockAvailability",
                          value: isEnabled,
                        },
                      })
                    }
                    data-test-id="legacy-shipping-zone-stock-availability-checkbox"
                  />
                  {!data.useLegacyShippingZoneStockAvailability ? (
                    <Box paddingX={6} paddingY={4} display="flex" flexDirection="column" gap={1}>
                      <Text size={2} color="default2">
                        {intl.formatMessage(messages.sectionStockAvailabilityWebhooksIntro)}
                      </Text>
                      <Box as="ul" margin={0} paddingLeft={5}>
                        {stockAvailabilityWebhooks.map(name => (
                          <Box as="li" key={name}>
                            <Text size={2}>{name}</Text>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : null}
                  <SettingsToggleRow
                    id={settingsHashes.storeAddressValidation}
                    name="preserveAllAddressFields"
                    title={intl.formatMessage(messages.sectionAddressValidationHeader)}
                    description={intl.formatMessage(messages.sectionAddressValidationDescription)}
                    checked={data.preserveAllAddressFields}
                    disabled={disabled}
                    onCheckedChange={isEnabled =>
                      change({
                        target: { name: "preserveAllAddressFields", value: isEnabled },
                      })
                    }
                    data-test-id="preserve-all-address-fields-checkbox"
                  />
                </SettingsSection>
              </SettingsPageContent>

              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={!!isSaveDisabled}
                />
              </Savebar>
            </>
          );
        }}
      </Form>
    </SettingsHubLayout>
  );
};
