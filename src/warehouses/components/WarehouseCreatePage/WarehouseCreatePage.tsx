import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import { Content } from "@dashboard/components/AppLayout/Content";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import CompanyAddressInput from "@dashboard/components/CompanyAddressInput";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import Savebar from "@dashboard/components/Savebar";
import { AddressTypeInput } from "@dashboard/customers/types";
import {
  CountryWithCodeFragment,
  WarehouseErrorFragment,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { warehouseListUrl } from "@dashboard/warehouses/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import WarehouseInfo from "../WarehouseInfo";

export interface WarehouseCreatePageFormData extends AddressTypeInput {
  name: string;
}
export interface WarehouseCreatePageProps {
  countries: CountryWithCodeFragment[];
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: WarehouseCreatePageFormData) => SubmitPromise;
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
  streetAddress2: "",
};

const WarehouseCreatePage: React.FC<WarehouseCreatePageProps> = ({
  countries,
  disabled,
  errors,
  saveButtonBarState,
  onSubmit,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const [displayCountry, setDisplayCountry] = useStateFromProps("");

  const {
    errors: validationErrors,
    submit: handleSubmit,
  } = useAddressValidation(onSubmit);

  return (
    <Form confirmLeave initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, set, submit }) => {
        const countryChoices = mapCountriesToChoices(countries);
        const countrySelect = createSingleAutocompleteSelectHandler(
          change,
          setDisplayCountry,
          countryChoices,
        );

        const handleCountrySelect = createCountryHandler(countrySelect, set);

        return (
          <>
            <TopNav
              href={warehouseListUrl()}
              title={intl.formatMessage({
                id: "GhcypC",
                defaultMessage: "Create Warehouse",
                description: "header",
              })}
            />
            <Content>
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
                      id: "43Nlay",
                      defaultMessage: "Address Information",
                      description: "warehouse",
                    })}
                    onChange={change}
                    onCountryChange={handleCountrySelect}
                  />
                </div>
              </Grid>
              <Savebar
                disabled={disabled}
                onCancel={() => navigate(warehouseListUrl())}
                onSubmit={submit}
                state={saveButtonBarState}
              />
            </Content>
          </>
        );
      }}
    </Form>
  );
};

WarehouseCreatePage.displayName = "WarehouseCreatePage";
export default WarehouseCreatePage;
