import { AccountErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Customers / Create customer", module)
  .addDecorator(Decorator)
  .add("default", () => <CustomerCreatePage {...props} />)
  .add("loading", () => <CustomerCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <CustomerCreatePage
      {...props}
      errors={([
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
      ] as Array<keyof CustomerCreatePageFormData>).map(field => ({
        __typename: "AccountError",
        code: AccountErrorCode.INVALID,
        field,
        addressType: null,
        message: "Account invalid error",
      }))}
    />
  ));
