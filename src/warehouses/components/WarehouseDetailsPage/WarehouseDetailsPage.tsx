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
import { SubmitPromise } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { findValueInEnum, maybe } from "@saleor/misc";
import { CountryCode } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WarehouseDetails_warehouse } from "../../types/WarehouseDetails";
import WarehouseInfo from "../WarehouseInfo";
import WarehouseZones from "../WarehouseZones";

export interface WarehouseDetailsPageFormData extends AddressTypeInput {
  name: string;
}
export interface WarehouseDetailsPageProps {
  countries: ShopInfo_shop_countries[];
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouse: WarehouseDetails_warehouse;
  onBack: () => void;
  onDelete: () => void;
  onShippingZoneClick: (id: string) => void;
  onSubmit: (data: WarehouseDetailsPageFormData) => SubmitPromise;
}

const WarehouseDetailsPage: React.FC<WarehouseDetailsPageProps> = ({
  countries,
  disabled,
  errors,
  saveButtonBarState,
  warehouse,
  onBack,
  onDelete,
  onShippingZoneClick,
  onSubmit
}) => {
  const intl = useIntl();
  const [displayCountry, setDisplayCountry] = useStateFromProps(
    warehouse?.address?.country.country || ""
  );

  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onSubmit);

  const initialForm: WarehouseDetailsPageFormData = {
    city: maybe(() => warehouse.address.city, ""),
    companyName: maybe(() => warehouse.address.companyName, ""),
    country: maybe(() =>
      findValueInEnum(warehouse.address.country.code, CountryCode)
    ),
    countryArea: maybe(() => warehouse.address.countryArea, ""),
    name: maybe(() => warehouse.name, ""),
    phone: maybe(() => warehouse.address.phone, ""),
    postalCode: maybe(() => warehouse.address.postalCode, ""),
    streetAddress1: maybe(() => warehouse.address.streetAddress1, ""),
    streetAddress2: maybe(() => warehouse.address.streetAddress2, "")
  };

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, submit }) => {
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
            <PageHeader title={warehouse?.name} />
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
              <div>
                <WarehouseZones
                  zones={warehouse?.shippingZones?.edges.map(edge => edge.node)}
                  onShippingZoneClick={onShippingZoneClick}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};

WarehouseDetailsPage.displayName = "WarehouseDetailsPage";
export default WarehouseDetailsPage;
