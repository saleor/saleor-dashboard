import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import CompanyAddressInput from "@saleor/components/CompanyAddressInput";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { AddressTypeInput } from "@saleor/customers/types";
import { WarehouseErrorFragment } from "@saleor/fragments/types/WarehouseErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseInfo from "../WarehouseInfo";

export interface WarehouseCreatePageFormData extends AddressTypeInput {
  name: string;
}
export interface WarehouseCreatePageProps {
  countries: ShopInfo_shop_countries[];
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: WarehouseCreatePageFormData) => void;
}

const initialForm: WarehouseCreatePageFormData = {
  city: "",
  companyName: "",
  country: "",
  countryArea: "",
  name: "",
  phone: "",
  postalCode: "",
  streetAddress1: "",
  streetAddress2: ""
};

const WarehouseCreatePage: React.FC<WarehouseCreatePageProps> = ({
  countries,
  disabled,
  errors,
  saveButtonBarState,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const [displayCountry, setDisplayCountry] = useStateFromProps("");

  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onSubmit);

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, submit }) => {
        const countryChoices = mapCountriesToChoices(countries);
        const handleCountryChange = createSingleAutocompleteSelectHandler(
          change,
          setDisplayCountry,
          countryChoices
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage {...sectionNames.warehouses} />
            </AppHeader>
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Create Warehouse",
                description: "header"
              })}
            />
            <Grid>
              <div>
                <WarehouseInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CompanyAddressInput
                  countries={countryChoices}
                  data={data}
                  disabled={disabled}
                  displayCountry={displayCountry}
                  errors={[...errors, ...validationErrors]}
                  header={intl.formatMessage({
                    defaultMessage: "Address Information",
                    description: "warehouse"
                  })}
                  onChange={change}
                  onCountryChange={handleCountryChange}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled}
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};

WarehouseCreatePage.displayName = "WarehouseCreatePage";
export default WarehouseCreatePage;
