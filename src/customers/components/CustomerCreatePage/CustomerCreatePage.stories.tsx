// @ts-strict-ignore
import { AccountErrorCode } from "@dashboard/graphql";
import React from "react";

import CustomerCreatePage, {
  CustomerCreatePageFormData,
  CustomerCreatePageProps,
} from "./CustomerCreatePage";

const props: Omit<CustomerCreatePageProps, "classes"> = {
  countries: [
    { __typename: "CountryDisplay", code: "UK", country: "United Kingdom" },
    { __typename: "CountryDisplay", code: "PL", country: "Poland" },
  ],
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBar: "default",
};

export default {
  title: "Customers / Create customer",
};

export const Default = () => <CustomerCreatePage {...props} />;

export const Loading = () => <CustomerCreatePage {...props} disabled={true} />;

export const FormErrors = () => (
  <CustomerCreatePage
    {...props}
    errors={(
      [
        "city",
        "cityArea",
        "companyName",
        "country",
        "countryArea",
        "email",
        "firstName",
        "lastName",
        "note",
        "phone",
        "postalCode",
        "streetAddress1",
        "streetAddress2",
      ] as Array<keyof CustomerCreatePageFormData>
    ).map(field => ({
      __typename: "AccountError",
      code: AccountErrorCode.INVALID,
      field,
      addressType: null,
      message: "Account invalid error",
    }))}
  />
);
