import { countries } from "@dashboard/fixtures";
import { WarehouseErrorCode } from "@dashboard/graphql";
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

export default {
  title: "Warehouses / Create warehouse",
};

export const Default = () => <WarehouseCreatePage {...props} />;

export const Loading = () => <WarehouseCreatePage {...props} disabled={true} />;

export const FormErrors = () => (
  <WarehouseCreatePage
    {...props}
    errors={(
      [
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
      ] as Array<keyof WarehouseCreatePageFormData>
    ).map(field => ({
      __typename: "WarehouseError",
      code: WarehouseErrorCode.INVALID,
      field,
      message: "Warehouse invalid",
    }))}
  />
);
