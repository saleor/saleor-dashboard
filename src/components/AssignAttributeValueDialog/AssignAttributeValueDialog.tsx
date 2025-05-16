import { AttributeEntityTypeEnum, SearchPagesQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignContainerDialog from "../AssignContainerDialog";
import AssignProductDialog, { AssignProductDialogProps } from "../AssignProductDialog";
import AssignVariantDialog from "../AssignVariantDialog";
import { AttributeInput } from "../Attributes";
import { filterPagesByAttributeValues, filterProductsByAttributeValues } from "./utils";

const pagesMessages = defineMessages({
  confirmBtn: {
    id: "ch96Wv",
    defaultMessage: "Assign and save",
    description: "assign reference to a model, button",
  },
  header: {
    id: "Z+m5hG",
    defaultMessage: "Assign model",
    description: "dialog header",
  },
  searchLabel: {
    id: "kTt3D2",
    defaultMessage: "Search models",
    description: "label",
  },
  searchPlaceholder: {
    id: "Z768vg",
    defaultMessage: "Search by model name, etc...",
    description: "placeholder",
  },
});

type AssignAttributeValueDialogProps = AssignProductDialogProps & {
  entityType: AttributeEntityTypeEnum;
  attribute: AttributeInput;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
};

const AssignAttributeValueDialog: React.FC<AssignAttributeValueDialogProps> = ({
  entityType,
  pages,
  products,
  attribute,
  labels,
  ...rest
}) => {
  const intl = useIntl();
  const filteredProducts = filterProductsByAttributeValues(products, attribute);
  const filteredPages = filterPagesByAttributeValues(pages, attribute);

  switch (entityType) {
    case AttributeEntityTypeEnum.PAGE:
      return (
        <AssignContainerDialog
          containers={
            filteredPages?.map(page => ({
              id: page.id,
              name: page.title,
            })) ?? []
          }
          labels={{
            confirmBtn: intl.formatMessage(pagesMessages.confirmBtn),
            label: intl.formatMessage(pagesMessages.searchLabel),
            placeholder: intl.formatMessage(pagesMessages.searchPlaceholder),
            title: intl.formatMessage(pagesMessages.header),
            ...labels,
          }}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.PRODUCT:
      return <AssignProductDialog products={filteredProducts ?? []} {...rest} />;
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      return <AssignVariantDialog products={filteredProducts} {...rest} />;
  }
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
