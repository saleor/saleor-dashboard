// @ts-strict-ignore
import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import CompanyAddressInput from "@dashboard/components/CompanyAddressInput";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import PageSectionHeader from "@dashboard/components/PageSectionHeader";
import Savebar from "@dashboard/components/Savebar";
import { configurationMenuUrl } from "@dashboard/configuration";
import { ShopErrorFragment, SiteSettingsQuery } from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { commonMessages } from "@dashboard/intl";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box, Checkbox, Divider, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import SiteCheckoutSettingsCard from "../SiteCheckoutSettingsCard";
import { messages } from "./messages";

export interface SiteSettingsPageAddressFormData {
  city: string;
  companyName: string;
  country: string;
  countryArea: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2: string;
}

export interface SiteSettingsPageFormData
  extends SiteSettingsPageAddressFormData {
  description: string;
  reserveStockDurationAnonymousUser: number;
  reserveStockDurationAuthenticatedUser: number;
  limitQuantityPerCheckout: number;
  emailConfirmation: boolean;
}

export interface SiteSettingsPageProps {
  disabled: boolean;
  errors: ShopErrorFragment[];
  shop?: SiteSettingsQuery["shop"];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: SiteSettingsPageFormData) => SubmitPromise;
}

export function areAddressInputFieldsModified(
  data: SiteSettingsPageAddressFormData,
): boolean {
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

const SiteSettingsPage: React.FC<SiteSettingsPageProps> = props => {
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
    reserveStockDurationAnonymousUser:
      shop?.reserveStockDurationAnonymousUser ?? 0,
    reserveStockDurationAuthenticatedUser:
      shop?.reserveStockDurationAuthenticatedUser ?? 0,
    limitQuantityPerCheckout: shop?.limitQuantityPerCheckout ?? 0,
    emailConfirmation: shop?.enableAccountConfirmationByEmail ?? false,
  };

  return (
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

        const handleEmailConfirmationChange = isEnabled => {
          change({ target: { name: "emailConfirmation", value: isEnabled } });
        };

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={configurationMenuUrl}
              title={intl.formatMessage(commonMessages.generalInformations)}
            />
            <DetailPageLayout.Content>
              <Box gap={2}>
                <Box
                  display="grid"
                  __gridTemplateColumns="1fr 3fr"
                  paddingLeft={6}
                >
                  <PageSectionHeader
                    title={intl.formatMessage(messages.sectionCheckoutTitle)}
                    description={intl.formatMessage(
                      messages.sectionCheckoutDescription,
                    )}
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
                    description={intl.formatMessage(
                      messages.sectionCompanyDescription,
                    )}
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
                    title={intl.formatMessage(
                      messages.sectionEmailConfirmationTitle,
                    )}
                    description={intl.formatMessage(
                      messages.sectionEmailConfirmationDescription,
                    )}
                  />
                  <DashboardCard>
                    <DashboardCard.Title>
                      {intl.formatMessage(
                        messages.sectionEmailConfirmationHeader,
                      )}
                    </DashboardCard.Title>
                    <DashboardCard.Content>
                      <Checkbox
                        checked={data.emailConfirmation}
                        onCheckedChange={handleEmailConfirmationChange}
                      >
                        <Text>
                          {intl.formatMessage(
                            messages.sectionEmailConfirmationHeader,
                          )}
                        </Text>
                      </Checkbox>
                    </DashboardCard.Content>
                  </DashboardCard>
                </Box>
              </Box>

              <Savebar
                state={saveButtonBarState}
                disabled={!!isSaveDisabled}
                onCancel={() => navigate(configurationMenuUrl)}
                onSubmit={submit}
              />
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

SiteSettingsPage.displayName = "SiteSettingsPage";
export default SiteSettingsPage;
