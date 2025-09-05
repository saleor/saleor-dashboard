// @ts-strict-ignore
import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { customerListUrl } from "@dashboard/customers/urls";
import { AccountErrorFragment, AddressInput, CustomerCreateDataQuery } from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { extractMutationErrors } from "@dashboard/misc";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { useState } from "react";
import { useIntl } from "react-intl";

import { AddressTypeInput } from "../../types";
import CustomerCreateAddress from "../CustomerCreateAddress/CustomerCreateAddress";
import CustomerCreateDetails from "../CustomerCreateDetails";
import CustomerCreateNote from "../CustomerCreateNote/CustomerCreateNote";

export interface CustomerCreatePageFormData {
  customerFirstName: string;
  customerLastName: string;
  email: string;
  note: string;
}
export interface CustomerCreatePageSubmitData extends CustomerCreatePageFormData {
  address: AddressInput;
}

const initialForm: CustomerCreatePageFormData & AddressTypeInput = {
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
  streetAddress2: "",
};

export interface CustomerCreatePageProps {
  countries: CustomerCreateDataQuery["shop"]["countries"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onSubmit: (data: CustomerCreatePageSubmitData) => SubmitPromise;
}

const CustomerCreatePage = ({
  countries,
  disabled,
  errors: apiErrors,
  saveButtonBar,
  onSubmit,
}: CustomerCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [countryDisplayName, setCountryDisplayName] = useState("");
  const countryChoices = mapCountriesToChoices(countries);
  const { errors: validationErrors, submit: handleSubmitWithAddress } = useAddressValidation<
    CustomerCreatePageFormData,
    void
  >(formData =>
    onSubmit({
      address: {
        city: formData.city,
        cityArea: formData.cityArea,
        companyName: formData.companyName,
        country: formData.country,
        countryArea: formData.countryArea,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        postalCode: formData.postalCode,
        streetAddress1: formData.streetAddress1,
        streetAddress2: formData.streetAddress2,
      },
      customerFirstName: formData.customerFirstName,
      customerLastName: formData.customerLastName,
      email: formData.email,
      note: formData.note,
    }),
  );
  const errors = [...apiErrors, ...validationErrors];
  const handleSubmit = (formData: CustomerCreatePageFormData & AddressTypeInput) => {
    const areAddressInputFieldsModified = (
      [
        "city",
        "companyName",
        "country",
        "countryArea",
        "firstName",
        "lastName",
        "phone",
        "postalCode",
        "streetAddress1",
        "streetAddress2",
      ] as Array<keyof AddressTypeInput>
    )
      .map(key => formData[key])
      .some(field => field !== "");

    if (areAddressInputFieldsModified) {
      return handleSubmitWithAddress(formData);
    }

    return extractMutationErrors(
      onSubmit({
        address: null,
        customerFirstName: formData.customerFirstName,
        customerLastName: formData.customerLastName,
        email: formData.email,
        note: formData.note,
      }),
    );
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={handleSubmit} disabled={disabled}>
      {({ change, set, data, isSaveDisabled, submit }) => {
        const countrySelect = createSingleAutocompleteSelectHandler(
          change,
          setCountryDisplayName,
          countryChoices,
        );
        const handleCountrySelect = createCountryHandler(countrySelect, set);

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={customerListUrl()}
              title={intl.formatMessage({
                id: "N76zUg",
                defaultMessage: "Create Customer",
                description: "page header",
              })}
            />
            <DetailPageLayout.Content>
              <div>
                <CustomerCreateDetails
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CustomerCreateAddress
                  countries={countryChoices}
                  countryDisplayName={countryDisplayName}
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  onCountryChange={handleCountrySelect}
                />
                <CardSpacer />
                <CustomerCreateNote
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(customerListUrl())} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBar}
                  onClick={submit}
                  disabled={isSaveDisabled}
                />
              </Savebar>
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

CustomerCreatePage.displayName = "CustomerCreatePage";
export default CustomerCreatePage;
