// @ts-strict-ignore
import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import CompanyAddressInput from "@dashboard/components/CompanyAddressInput";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Link } from "@dashboard/components/Link";
import PageSectionHeader from "@dashboard/components/PageSectionHeader";
import { Savebar } from "@dashboard/components/Savebar";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import {
  type PasswordLoginModeEnum,
  type ShopErrorFragment,
  type SiteSettingsQuery,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { commonMessages } from "@dashboard/intl";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box, Checkbox, Divider, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import SiteCheckoutSettingsCard from "../SiteCheckoutSettingsCard";
import { SitePasswordLoginCard } from "../SitePasswordLoginCard/SitePasswordLoginCard";
import { messages } from "./messages";

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
  description: string;
  reserveStockDurationAnonymousUser: number;
  reserveStockDurationAuthenticatedUser: number;
  limitQuantityPerCheckout: number;
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

const SiteSettingsPage = (props: SiteSettingsPageProps) => {
  const { disabled, errors, saveButtonBarState, shop, onSubmit } = props;
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
    description: shop?.description || "",
    reserveStockDurationAnonymousUser: shop?.reserveStockDurationAnonymousUser ?? 0,
    reserveStockDurationAuthenticatedUser: shop?.reserveStockDurationAuthenticatedUser ?? 0,
    limitQuantityPerCheckout: shop?.limitQuantityPerCheckout ?? 0,
    emailConfirmation: shop?.enableAccountConfirmationByEmail ?? false,
    useLegacyUpdateWebhookEmission: shop?.useLegacyUpdateWebhookEmission ?? true,
    useLegacyShippingZoneStockAvailability: shop?.useLegacyShippingZoneStockAvailability ?? true,
    preserveAllAddressFields: shop?.preserveAllAddressFields ?? false,
    passwordLoginMode: shop?.passwordLoginMode,
  };

  return (
    <Form
      initial={initialForm}
      onSubmit={data => {
        const submitFunc = areAddressInputFieldsModified(data) ? handleSubmitWithAddress : onSubmit;

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
        const handleEmailConfirmationChange = isEnabled => {
          change({ target: { name: "emailConfirmation", value: isEnabled } });
        };
        const handleWebhookEmissionChange = isEnabled => {
          change({ target: { name: "useLegacyUpdateWebhookEmission", value: isEnabled } });
        };
        const handlePreserveAddressFieldsChange = isEnabled => {
          change({ target: { name: "preserveAllAddressFields", value: isEnabled } });
        };
        const handleLegacyStockAvailabilityChange = isEnabled => {
          change({ target: { name: "useLegacyShippingZoneStockAvailability", value: isEnabled } });
        };

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={configurationMenuUrl}
              title={intl.formatMessage(commonMessages.generalInformations)}
            />
            <DetailPageLayout.Content>
              <Box gap={2}>
                <Box display="grid" __gridTemplateColumns="1fr 3fr" paddingLeft={6}>
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionCheckoutTitle)}
                    description={intl.formatMessage(messages.sectionCheckoutDescription)}
                  />
                  <SiteCheckoutSettingsCard
                    data={data}
                    errors={errors}
                    disabled={disabled}
                    onChange={change}
                  />
                </Box>
                <Divider />
                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                  paddingBottom={8}
                >
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionCompanyTitle)}
                    description={intl.formatMessage(messages.sectionCompanyDescription)}
                  />
                  <CompanyAddressInput
                    data={data}
                    displayCountry={displayCountry}
                    countries={countryChoices}
                    errors={[...errors, ...validationErrors]}
                    disabled={disabled}
                    header={intl.formatMessage({
                      id: "+jCDvp",
                      defaultMessage: "Store Information",
                      description: "section header",
                    })}
                    onChange={change}
                    onCountryChange={handleCountrySelect}
                  />
                </Box>
                <Divider />
                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                  paddingBottom={8}
                >
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionEmailConfirmationTitle)}
                    description={intl.formatMessage(messages.sectionEmailConfirmationDescription)}
                  />
                  <DashboardCard>
                    <DashboardCard.Header>
                      <DashboardCard.Title>
                        {intl.formatMessage(messages.sectionEmailConfirmationHeader)}
                      </DashboardCard.Title>
                    </DashboardCard.Header>
                    <DashboardCard.Content>
                      <Checkbox
                        data-test-id="require-email-confirmation-checkbox"
                        checked={data.emailConfirmation}
                        onCheckedChange={handleEmailConfirmationChange}
                      >
                        <Text>{intl.formatMessage(messages.sectionEmailConfirmationHeader)}</Text>
                      </Checkbox>
                    </DashboardCard.Content>
                  </DashboardCard>
                </Box>
                <Divider />

                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                  paddingBottom={8}
                >
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionPasswordLoginTitle)}
                    description={intl.formatMessage(messages.sectionPasswordLoginDescription)}
                  />
                  <SitePasswordLoginCard value={data.passwordLoginMode} onChange={change} />
                </Box>
                <Divider />
                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                  paddingBottom={8}
                >
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionWebhookEmissionTitle)}
                    description={intl.formatMessage(messages.sectionWebhookEmissionDescription)}
                  />
                  <DashboardCard>
                    <DashboardCard.Header>
                      <DashboardCard.Title>
                        {intl.formatMessage(messages.sectionWebhookEmissionHeader)}
                      </DashboardCard.Title>
                    </DashboardCard.Header>
                    <DashboardCard.Content>
                      <Checkbox
                        data-test-id="legacy-webhook-emission-checkbox"
                        checked={data.useLegacyUpdateWebhookEmission}
                        onCheckedChange={handleWebhookEmissionChange}
                      >
                        <Text>{intl.formatMessage(messages.sectionWebhookEmissionHeader)}</Text>
                      </Checkbox>
                    </DashboardCard.Content>
                  </DashboardCard>
                </Box>
                <Divider />
                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                  paddingBottom={8}
                >
                  <Box paddingTop={6}>
                    <Text size={3} fontWeight="bold" lineHeight={2}>
                      {intl.formatMessage(messages.sectionStockAvailabilityTitle)}
                    </Text>
                    <VerticalSpacer />
                    <Text size={3} fontWeight="regular">
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
                    </Text>
                  </Box>
                  <DashboardCard>
                    <DashboardCard.Header>
                      <DashboardCard.Title>
                        {intl.formatMessage(messages.sectionStockAvailabilityHeader)}
                      </DashboardCard.Title>
                    </DashboardCard.Header>
                    <DashboardCard.Content>
                      <Box display="flex" flexDirection="column" gap={3}>
                        <Checkbox
                          data-test-id="legacy-shipping-zone-stock-availability-checkbox"
                          checked={data.useLegacyShippingZoneStockAvailability}
                          onCheckedChange={handleLegacyStockAvailabilityChange}
                        >
                          <Text>{intl.formatMessage(messages.sectionStockAvailabilityHeader)}</Text>
                        </Checkbox>
                        <Box display="flex" flexDirection="column" gap={1}>
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
                      </Box>
                    </DashboardCard.Content>
                  </DashboardCard>
                </Box>
                <Divider />
                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                  paddingBottom={8}
                >
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionAddressValidationTitle)}
                    description={intl.formatMessage(messages.sectionAddressValidationDescription)}
                  />
                  <DashboardCard>
                    <DashboardCard.Header>
                      <DashboardCard.Title>
                        {intl.formatMessage(messages.sectionAddressValidationHeader)}
                      </DashboardCard.Title>
                    </DashboardCard.Header>
                    <DashboardCard.Content>
                      <Checkbox
                        data-test-id="preserve-all-address-fields-checkbox"
                        checked={data.preserveAllAddressFields}
                        onCheckedChange={handlePreserveAddressFieldsChange}
                      >
                        <Text>{intl.formatMessage(messages.sectionAddressValidationHeader)}</Text>
                      </Checkbox>
                    </DashboardCard.Content>
                  </DashboardCard>
                </Box>
              </Box>

              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(configurationMenuUrl)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={!!isSaveDisabled}
                />
              </Savebar>
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

SiteSettingsPage.displayName = "SiteSettingsPage";
export default SiteSettingsPage;
