import { countries } from "@saleor/fixtures";
import { WarehouseErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { warehouse } from "../../fixtures";
import WarehouseDetailsPage, {
  WarehouseDetailsPageFormData,
  WarehouseDetailsPageProps,
} from "./WarehouseDetailsPage";

const props: WarehouseDetailsPageProps = {
  countries: countries.map(c => ({
    __typename: "CountryDisplay",
    code: c.code,
    country: c.name,
  })),
  disabled: false,
  errors: [],
  onDelete: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  warehouse,
};
storiesOf("Views / Warehouses / Warehouse details", module)
  .addDecorator(Decorator)
  .add("default", () => <WarehouseDetailsPage {...props} />)
  .add("loading", () => (
    <WarehouseDetailsPage {...props} warehouse={undefined} disabled={true} />
  ))
  .add("form errors", () => (
    <WarehouseDetailsPage
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
      ] as Array<keyof WarehouseDetailsPageFormData>).map(field => ({
        __typename: "WarehouseError",
        code: WarehouseErrorCode.INVALID,
        field,
        message: "Warehouse invalid",
      }))}
    />
  ));
