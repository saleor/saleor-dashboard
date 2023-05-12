import { countries } from "@dashboard/fixtures";
import { WarehouseErrorCode } from "@dashboard/graphql";
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
  onSubmit: async () => undefined,
  saveButtonBarState: "default",
  warehouse,
};

export default {
  title: "Warehouses / Warehouse details",
};

export const Default = () => <WarehouseDetailsPage {...props} />;

export const FormErrors = () => (
  <WarehouseDetailsPage
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
      ] as Array<keyof WarehouseDetailsPageFormData>
    ).map(field => ({
      __typename: "WarehouseError",
      code: WarehouseErrorCode.INVALID,
      field,
      message: "Warehouse invalid",
    }))}
  />
);
