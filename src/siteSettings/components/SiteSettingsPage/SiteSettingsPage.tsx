import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CompanyAddressInput from "@saleor/components/CompanyAddressInput";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShopErrorFragment } from "@saleor/fragments/types/ShopErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages, sectionNames } from "@saleor/intl";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { SiteSettings_shop } from "../../types/SiteSettings";
import SiteSettingsDetails from "../SiteSettingsDetails/SiteSettingsDetails";
import SiteSettingsMailing, {
  SiteSettingsMailingFormData
} from "../SiteSettingsMailing";

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
  extends SiteSettingsPageAddressFormData,
    SiteSettingsMailingFormData {
  description: string;
  domain: string;
  name: string;
}

export interface SiteSettingsPageProps {
  disabled: boolean;
  errors: ShopErrorFragment[];
  shop: SiteSettings_shop;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: SiteSettingsPageFormData) => SubmitPromise;
}

export function areAddressInputFieldsModified(
  data: SiteSettingsPageAddressFormData
): boolean {
  return ([
    "city",
    "country",
    "countryArea",
    "phone",
    "postalCode",
    "streetAddress1",
    "streetAddress2"
  ] as Array<keyof SiteSettingsPageAddressFormData>)
    .map(key => data[key])
    .some(field => field !== "");
}

const useStyles = makeStyles(
  theme => ({
    hr: {
      gridColumnEnd: "span 2",
      margin: theme.spacing(1, 0)
    }
  }),
  {
    name: "SiteSettingsPage"
  }
);

const SiteSettingsPage: React.FC<SiteSettingsPageProps> = props => {
  const {
    disabled,
    errors,
    saveButtonBarState,
    shop,
    onBack,
    onSubmit
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [displayCountry, setDisplayCountry] = useStateFromProps(
    maybe(() => shop.companyAddress.country.code, "")
  );

  const {
    errors: validationErrors,
    submit: handleSubmitWithAddress
  } = useAddressValidation(onSubmit);

  const initialFormAddress: SiteSettingsPageAddressFormData = {
    city: maybe(() => shop.companyAddress.city, ""),
    companyName: maybe(() => shop.companyAddress.companyName, ""),
    country: maybe(() => shop.companyAddress.country.code, ""),
    countryArea: maybe(() => shop.companyAddress.countryArea, ""),
    phone: maybe(() => shop.companyAddress.phone, ""),
    postalCode: maybe(() => shop.companyAddress.postalCode, ""),
    streetAddress1: maybe(() => shop.companyAddress.streetAddress1, ""),
    streetAddress2: maybe(() => shop.companyAddress.streetAddress2, "")
  };
  const initialForm: SiteSettingsPageFormData = {
    ...initialFormAddress,
    customerSetPasswordUrl: maybe(() => shop.customerSetPasswordUrl, ""),
    defaultMailSenderAddress: maybe(() => shop.defaultMailSenderAddress, ""),
    defaultMailSenderName: maybe(() => shop.defaultMailSenderName, ""),
    description: maybe(() => shop.description, ""),
    domain: maybe(() => shop.domain.host, ""),
    name: maybe(() => shop.name, "")
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
    >
      {({ change, data, hasChanged, submit }) => {
        const countryChoices = mapCountriesToChoices(shop?.countries || []);
        const handleCountryChange = createSingleAutocompleteSelectHandler(
          change,
          setDisplayCountry,
          countryChoices
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.configuration)}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage(commonMessages.generalInformations)}
            />
            <Grid variant="inverted">
              <div>
                <Typography>
                  {intl.formatMessage(sectionNames.siteSettings)}
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage defaultMessage="These are general information about your store. They define what is the URL of your store and what is shown in browsers taskbar." />
                </Typography>
              </div>
              <SiteSettingsDetails
                data={data}
                errors={errors}
                disabled={disabled}
                onChange={change}
              />
              <Hr className={classes.hr} />
              <div>
                <Typography>
                  <FormattedMessage
                    defaultMessage="Mailing Configuration"
                    description="section header"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage defaultMessage="This where you will find all of the settings determining your stores e-mails. You can determine main email address and some of the contents of your emails." />
                </Typography>
              </div>
              <SiteSettingsMailing
                data={data}
                errors={errors}
                disabled={disabled}
                onChange={change}
              />
              <Hr className={classes.hr} />
              <div>
                <Typography>
                  <FormattedMessage
                    defaultMessage="Company Information"
                    description="section header"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage defaultMessage="This adress will be used to generate invoices and calculate shipping rates." />
                  <FormattedMessage defaultMessage="Email adress you provide here will be used as a contact adress for your customers." />
                </Typography>
              </div>
              <CompanyAddressInput
                data={data}
                displayCountry={displayCountry}
                countries={countryChoices}
                errors={[...errors, ...validationErrors]}
                disabled={disabled}
                header={intl.formatMessage({
                  defaultMessage: "Store Information",
                  description: "section header"
                })}
                onChange={change}
                onCountryChange={handleCountryChange}
              />
            </Grid>
            <SaveButtonBar
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};

SiteSettingsPage.displayName = "SiteSettingsPage";
export default SiteSettingsPage;
