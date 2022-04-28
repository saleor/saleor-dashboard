import { countries } from "@saleor/fixtures";
import { WarehouseErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import WarehouseCreatePage, {
  WarehouseCreatePageFormData,
  WarehouseCreatePageProps
} from "./WarehouseCreatePage";

const props: WarehouseCreatePageProps = {
  countries: countries.map(c => ({
    __typename: "CountryDisplay",
    code: c.code,
    country: c.name
  })),
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

export default {
  title: "Views / Warehouses / Create warehouse",
  decorators: [Decorator]
};

export const Default = () => <WarehouseCreatePage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <WarehouseCreatePage {...props} disabled={true} />;

Loading.story = {
  name: "loading"
};

export const FormErrors = () => (
  <WarehouseCreatePage
    {...props}
    errors={([
      "name",
      "city",
      "cityArea",
      "companyName",
      "country",
      "countryArea",
      "phone",
      "postalCode",
      "streetAddress1",
      "streetAddress2"
    ] as Array<keyof WarehouseCreatePageFormData>).map(field => ({
      __typename: "WarehouseError",
      code: WarehouseErrorCode.INVALID,
      field,
      message: "Warehouse invalid"
    }))}
  />
);

FormErrors.story = {
  name: "form errors"
};
