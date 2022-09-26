import Decorator from "@saleor/storybook/Decorator";
import { mapNodeToChoice } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import { productTypesList } from "../../fixtures";
import ProductTypePickerDialog, {
  ProductTypePickerDialogProps,
} from "./ProductTypePickerDialog";

const productTypes = mapNodeToChoice(productTypesList);

const props: ProductTypePickerDialogProps = {
  productTypes,
  confirmButtonState: "default",
  fetchProductTypes: () => undefined,
  fetchMoreProductTypes: {
    hasMore: false,
    loading: false,
    onFetchMore: () => undefined,
  },
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Views / Products / Product type dialog", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductTypePickerDialog {...props} />);
