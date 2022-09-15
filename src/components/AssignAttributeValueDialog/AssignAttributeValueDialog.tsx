import { AttributeEntityTypeEnum, SearchPagesQuery } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignContainerDialog from "../AssignContainerDialog";
import AssignProductDialog, {
  AssignProductDialogProps,
} from "../AssignProductDialog";
import AssignVariantDialog from "../AssignVariantDialog";

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
  pages: RelayToFlat<SearchPagesQuery["search"]>;
};

const AssignAttributeValueDialog: React.FC<AssignAttributeValueDialogProps> = ({
  entityType,
  pages,
  products,
  ...rest
}) => {
  const intl = useIntl();

  switch (entityType) {
    case AttributeEntityTypeEnum.PAGE:
      return (
        <AssignContainerDialog
          containers={pages.map(page => ({ id: page.id, name: page.title }))}
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
      return <AssignProductDialog products={products} {...rest} />;
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      return <AssignVariantDialog products={products} {...rest} />;
  }
};
AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
