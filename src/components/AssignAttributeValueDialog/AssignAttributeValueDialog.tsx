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
    id: "idr+JK",
    defaultMessage: "Assign and save",
    description: "assign reference to a page, button",
  },
  header: {
    id: "5I7Lc2",
    defaultMessage: "Assign page",
    description: "dialog header",
  },
  searchLabel: {
    id: "izJvcM",
    defaultMessage: "Search pages",
    description: "label",
  },
  searchPlaceholder: {
    id: "OFW7nq",
    defaultMessage: "Search by page name, etc...",
    description: "placeholder",
  },
});

type AssignAttributeValueDialogProps = AssignProductDialogProps & {
  entityType: AttributeEntityTypeEnum;
  attribute: AttributeInput;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
};

const AssignAttributeValueDialog = ({
  entityType,
  pages,
  products,
  attribute,
  ...rest
}: AssignAttributeValueDialogProps) => {
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
