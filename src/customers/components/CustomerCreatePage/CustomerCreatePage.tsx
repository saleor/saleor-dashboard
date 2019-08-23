import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { UserError } from "../../../types";
import { AddressTypeInput } from "../../types";
import { CustomerCreateData_shop_countries } from "../../types/CustomerCreateData";
import CustomerCreateAddress from "../CustomerCreateAddress/CustomerCreateAddress";
import CustomerCreateDetails from "../CustomerCreateDetails";
import CustomerCreateNote from "../CustomerCreateNote/CustomerCreateNote";

export interface CustomerCreatePageFormData extends AddressTypeInput {
  customerFirstName: string;
  customerLastName: string;
  email: string;
  note: string;
}

const initialForm: CustomerCreatePageFormData = {
  city: "",
  cityArea: "",
  companyName: "",
  country: "",
  countryArea: "",
  customerFirstName: "",
  customerLastName: "",
  email: "",
  firstName: "",
  lastName: "",
  note: "",
  phone: "",
  postalCode: "",
  streetAddress1: "",
  streetAddress2: ""
};

export interface CustomerCreatePageProps {
  countries: CustomerCreateData_shop_countries[];
  disabled: boolean;
  errors: UserError[];
  saveButtonBar: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: CustomerCreatePageFormData) => void;
}

const CustomerCreatePage: React.StatelessComponent<CustomerCreatePageProps> = ({
  countries,
  disabled,
  errors,
  saveButtonBar,
  onBack,
  onSubmit
}: CustomerCreatePageProps) => {
  const intl = useIntl();

  const [countryDisplayName, setCountryDisplayName] = React.useState("");
  const countryChoices = countries.map(country => ({
    label: country.country,
    value: country.code
  }));

  return (
    <Form
      initial={initialForm}
      onSubmit={onSubmit}
      errors={errors}
      confirmLeave
    >
      {({ change, data, errors: formErrors, hasChanged, submit }) => {
        const handleCountrySelect = createSingleAutocompleteSelectHandler(
          change,
          setCountryDisplayName,
          countryChoices
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage {...sectionNames.customers} />
            </AppHeader>
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Add customer",
                description: "page header"
              })}
            />
            <Grid>
              <div>
                <CustomerCreateDetails
                  data={data}
                  disabled={disabled}
                  errors={formErrors}
                  onChange={change}
                />
                <CardSpacer />
                <CustomerCreateAddress
                  countries={countryChoices}
                  countryDisplayName={countryDisplayName}
                  data={data}
                  disabled={disabled}
                  errors={formErrors}
                  onChange={change}
                  onCountryChange={handleCountrySelect}
                />
                <CardSpacer />
                <CustomerCreateNote
                  data={data}
                  disabled={disabled}
                  errors={formErrors}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBar}
              onSave={submit}
              onCancel={onBack}
            />
          </Container>
        );
      }}
    </Form>
  );
};
CustomerCreatePage.displayName = "CustomerCreatePage";
export default CustomerCreatePage;
