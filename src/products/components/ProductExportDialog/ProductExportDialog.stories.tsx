import { channelsList } from "@saleor/channels/fixtures";
import { ExportErrorCode, ExportProductsInput } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { warehouseList } from "@saleor/warehouses/fixtures";
import React from "react";

import { attributes } from "../../../attributes/fixtures";
import ProductExportDialog, {
  ProductExportDialogProps
} from "./ProductExportDialog";

const props: ProductExportDialogProps = {
  attributes: attributes.map(attr => ({
    __typename: "Attribute",
    id: attr.id,
    name: attr.name
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
    filter: 32
  },
  selectedProducts: 18,
  warehouses: warehouseList
};

export default {
  title: "Views / Products / Export / Export settings",
  decorators: [Decorator]
};

export const Interactive = () => <ProductExportDialog {...props} />;

Interactive.story = {
  name: "interactive"
};

export const NoProductsSelected = () => (
  <ProductExportDialog {...props} selectedProducts={0} />
);

NoProductsSelected.story = {
  name: "no products selected"
};

export const Errors = () => (
  <ProductExportDialog
    {...props}
    errors={(["fileType", "scope", null] as Array<
      keyof ExportProductsInput | null
    >).map(field => ({
      __typename: "ExportError",
      code: ExportErrorCode.INVALID,
      field,
      message: "Export invalid"
    }))}
  />
);

Errors.story = {
  name: "errors"
};
