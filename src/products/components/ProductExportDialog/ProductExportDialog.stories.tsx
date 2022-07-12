import { channelsList } from "@saleor/channels/fixtures";
import { ExportErrorCode, ExportProductsInput } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import { attributes } from "../../../attributes/fixtures";
import ProductExportDialog, {
  ProductExportDialogProps,
} from "./ProductExportDialog";

const props: ProductExportDialogProps = {
  attributes: attributes.map(attr => ({
    __typename: "Attribute",
    id: attr.id,
    name: attr.name,
  })),
  channels: channelsList,
  confirmButtonState: "default",
  errors: [],
  hasMore: true,
  loading: true,
  onClose: () => undefined,
  onFetch: () => undefined,
  onFetchMore: () => undefined,
  onSubmit: () => undefined,
  open: true,
  productQuantity: {
    all: 100,
    filter: 32,
  },
  selectedProducts: 18,
  warehouses: warehouseList,
};

storiesOf("Views / Products / Export / Export settings", module)
  .addDecorator(Decorator)
  .add("interactive", () => <ProductExportDialog {...props} />)
  .add("no products selected", () => (
    <ProductExportDialog {...props} selectedProducts={0} />
  ))
  .add("errors", () => (
    <ProductExportDialog
      {...props}
      errors={(["fileType", "scope", null] as Array<
        keyof ExportProductsInput | null
      >).map(field => ({
        __typename: "ExportError",
        code: ExportErrorCode.INVALID,
        field,
        message: "Export invalid",
      }))}
    />
  ));
