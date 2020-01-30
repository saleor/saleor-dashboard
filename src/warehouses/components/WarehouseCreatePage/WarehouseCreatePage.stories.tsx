import { storiesOf } from "@storybook/react";
import React from "react";

import { address, permissions } from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { formError } from "@saleor/storybook/misc";
import { warehouseList } from "../../fixtures";
import WarehouseCreatePage, {
  WarehouseCreatePageProps,
  WarehouseCreatePageFormData
} from "./WarehouseCreatePage";

const props: WarehouseCreatePageProps = {
  disabled: false,
  errors: [],
  saveButtonBarState: "default",
  onBack: () => undefined,
  onSubmit: () => undefined,
  warehouse: {
    ...warehouseList[0],
    address
  }
};
storiesOf("Views / Warehouses / Create warehouse", module)
  .addDecorator(Decorator)
  .add("default", () => <WarehouseCreatePage {...props} />)
  .add("loading", () => (
    <WarehouseCreatePage {...props} service={undefined} disabled={true} />
  ))
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
        "streetAddress2"
      ] as Array<keyof WarehouseCreatePageFormData>).map(field =>
        formError(field)
      )}
    />
  ));
