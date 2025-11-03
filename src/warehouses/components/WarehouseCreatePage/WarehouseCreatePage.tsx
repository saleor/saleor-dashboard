// @ts-strict-ignore
import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import CompanyAddressInput from "@dashboard/components/CompanyAddressInput";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { AddressTypeInput } from "@dashboard/customers/types";
import { CountryWithCodeFragment, WarehouseErrorFragment } from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { warehouseListUrl } from "@dashboard/warehouses/urls";
import { useIntl } from "react-intl";

import WarehouseInfo from "../WarehouseInfo";

export interface WarehouseCreatePageFormData extends AddressTypeInput {
  name: string;
  email: string;
}
interface WarehouseCreatePageProps {
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
  email: "",
  phone: "",
  postalCode: "",
  streetAddress1: "",
  streetAddress2: "",
};
const WarehouseCreatePage = ({
  countries,
  disabled,
  errors,
  saveButtonBarState,
  onSubmit,
}: WarehouseCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [displayCountry, setDisplayCountry] = useStateFromProps("");
  const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);

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
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={warehouseListUrl()}
              title={intl.formatMessage({
                id: "GhcypC",
                defaultMessage: "Create Warehouse",
                description: "header",
              })}
            />
            <DetailPageLayout.Content>
              <div>
                <WarehouseInfo data={data} disabled={disabled} errors={errors} onChange={change} />
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
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(warehouseListUrl())} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={disabled}
                />
              </Savebar>
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

WarehouseCreatePage.displayName = "WarehouseCreatePage";
export default WarehouseCreatePage;
