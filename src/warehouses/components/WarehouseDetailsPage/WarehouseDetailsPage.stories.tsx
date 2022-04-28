import { countries } from "@saleor/fixtures";
import { WarehouseErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { warehouse } from "../../fixtures";
import WarehouseDetailsPage, {
  WarehouseDetailsPageFormData,
  WarehouseDetailsPageProps
} from "./WarehouseDetailsPage";

const props: WarehouseDetailsPageProps = {
  countries: countries.map(c => ({
    __typename: "CountryDisplay",
    code: c.code,
    country: c.name
  })),
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onDelete: () => undefined,
  onShippingZoneClick: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
  warehouse
};

export default {
  title: "Views / Warehouses / Warehouse details",
  decorators: [Decorator]
};

export const Default = () => <WarehouseDetailsPage {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <WarehouseDetailsPage {...props} warehouse={undefined} disabled={true} />
);

Loading.story = {
  name: "loading"
};

export const FormErrors = () => (
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
      "streetAddress2"
    ] as Array<keyof WarehouseDetailsPageFormData>).map(field => ({
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
