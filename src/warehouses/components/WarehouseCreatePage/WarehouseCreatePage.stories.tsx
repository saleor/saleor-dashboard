import { countries } from "@dashboard/fixtures";
import { WarehouseErrorCode } from "@dashboard/graphql";
import Decorator from "@dashboard/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import WarehouseCreatePage, {
  WarehouseCreatePageFormData,
  WarehouseCreatePageProps,
} from "./WarehouseCreatePage";

const props: WarehouseCreatePageProps = {
  countries: countries.map(c => ({
    __typename: "CountryDisplay",
    code: c.code,
    country: c.name,
  })),
  disabled: false,
  errors: [],
  onSubmit: async () => undefined,
  saveButtonBarState: "default",
};
storiesOf("Warehouses / Create warehouse", module)
  .addDecorator(Decorator)
  .add("default", () => <WarehouseCreatePage {...props} />)
  .add("loading", () => <WarehouseCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
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
        "streetAddress2",
      ] as Array<keyof WarehouseCreatePageFormData>).map(field => ({
        __typename: "WarehouseError",
        code: WarehouseErrorCode.INVALID,
        field,
        message: "Warehouse invalid",
      }))}
    />
  ));
