import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "@saleor/storybook//Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { StockErrorCode } from "@saleor/types/globalTypes";
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
  warehouses: warehouseList,
  warehousesWithStocks: [warehouseList[0].id, warehouseList[2].id]
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
    <ProductWarehousesDialog
      {...props}
      errors={[
        {
          __typename: "StockError",
          code: StockErrorCode.INVALID,
          field: null
        }
      ]}
    />
  ));
