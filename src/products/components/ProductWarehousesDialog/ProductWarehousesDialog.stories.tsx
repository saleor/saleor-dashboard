import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook//Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { formError } from "@saleor/storybook/misc";
import ProductWarehousesDialog, {
  ProductWarehousesDialogProps
} from "./ProductWarehousesDialog";

const props: ProductWarehousesDialogProps = {
  confirmButtonState: "default",
  disabled: false,
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  stocks: [
    {
      __typename: "Stock",
      id: "5123",
      quantity: 2,
      warehouse: warehouseList[0]
    },
    {
      __typename: "Stock",
      id: "5223",
      quantity: 4,
      warehouse: warehouseList[2]
    }
  ],
  warehouses: warehouseList
};

storiesOf("Views / Products / Edit warehouses", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductWarehousesDialog {...props} />)
  .add("loading warehouses", () => (
    <ProductWarehousesDialog {...props} warehouses={undefined} />
  ))
  .add("loading confirmation", () => (
    <ProductWarehousesDialog
      {...props}
      confirmButtonState="loading"
      disabled={true}
    />
  ))
  .add("with error", () => (
    <ProductWarehousesDialog {...props} errors={[formError(null)]} />
  ));
