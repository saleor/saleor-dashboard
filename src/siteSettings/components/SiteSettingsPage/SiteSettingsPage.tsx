import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages, sectionNames } from "@saleor/intl";
import { UserError } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import { maybe } from "../../../misc";
import { AuthorizationKeyType } from "../../../types/globalTypes";
import { SiteSettings_shop } from "../../types/SiteSettings";
import SiteSettingsAddress from "../SiteSettingsAddress/SiteSettingsAddress";
import SiteSettingsDetails from "../SiteSettingsDetails/SiteSettingsDetails";
import SiteSettingsKeys from "../SiteSettingsKeys/SiteSettingsKeys";
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
  errors: UserError[];
  shop: SiteSettings_shop;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onKeyAdd: () => void;
  onKeyRemove: (keyType: AuthorizationKeyType) => void;
  onSubmit: (data: SiteSettingsPageFormData) => void;
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
    onKeyAdd,
    onKeyRemove,
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
  } = useAddressValidation<SiteSettingsPageFormData>(onSubmit);

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

  const formErrors = [...errors, ...validationErrors];

  return (
    <Form
      initial={initialForm}
      onSubmit={data => {
        const submitFunc = areAddressInputFieldsModified(data)
          ? handleSubmitWithAddress
          : onSubmit;
        submitFunc(data);
      }}
      confirmLeave
    >
      {({ change, data, hasChanged, submit }) => {
        const countryChoices = mapCountriesToChoices(
          maybe(() => shop.countries, [])
        );
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
                errors={formErrors}
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
                errors={formErrors}
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
              <SiteSettingsAddress
                data={data}
                displayCountry={displayCountry}
                countries={countryChoices}
                errors={formErrors}
                disabled={disabled}
                onChange={change}
                onCountryChange={handleCountryChange}
              />
              <Hr className={classes.hr} />
              <div>
                <Typography>
                  <FormattedMessage
                    defaultMessage="Authentication Methods"
                    description="section header"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage defaultMessage="Authentication method defines additional ways that customers can log in to your ecommerce." />
                </Typography>
              </div>
              <SiteSettingsKeys
                disabled={disabled}
                keys={maybe(() => shop.authorizationKeys)}
                onAdd={onKeyAdd}
                onRemove={onKeyRemove}
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
