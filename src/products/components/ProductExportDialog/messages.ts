import { ProductFieldEnum } from "@dashboard/graphql";
import { defineMessages, useIntl } from "react-intl";

export const productExportDialogMessages = defineMessages({
  title: {
    id: "xkjRu5",
    defaultMessage: "Export Information",
    description: "export products to csv file, dialog header",
  },
  confirmButtonLabel: {
    id: "2JBvj0",
    defaultMessage: "Export products",
    description: "export products to csv file, button",
  },
  productsLabel: {
    id: "dc5KWn",
    defaultMessage: "products",
    description: "products export type label",
  },
});

function useProductExportFieldMessages() {
  const intl = useIntl();
  const messages = {
    ["CATEGORY"]: intl.formatMessage({
      id: "KupNHw",
      defaultMessage: "Category",
      description: "product field",
    }),
    ["CHARGE_TAXES"]: intl.formatMessage({
      id: "QVNg8A",
      defaultMessage: "Charge Taxes",
      description: "product field",
    }),
    ["COLLECTIONS"]: intl.formatMessage({
      id: "jxoMLL",
      defaultMessage: "Collections",
      description: "product field",
    }),
    ["DESCRIPTION"]: intl.formatMessage({
      id: "YVIajc",
      defaultMessage: "Description",
      description: "product field",
    }),
    ["NAME"]: intl.formatMessage({
      id: "W8i2Ez",
      defaultMessage: "Name",
      description: "product field",
    }),
    ["PRODUCT_MEDIA"]: intl.formatMessage({
      id: "6y+k8V",
      defaultMessage: "Product Images",
      description: "product field",
    }),
    ["PRODUCT_TYPE"]: intl.formatMessage({
      id: "Q/Nbku",
      defaultMessage: "Type",
      description: "product field",
    }),
    ["PRODUCT_WEIGHT"]: intl.formatMessage({
      id: "7JAAul",
      defaultMessage: "Export Product Weight",
      description: "product field",
    }),
    ["VARIANT_MEDIA"]: intl.formatMessage({
      id: "Uo5MoU",
      defaultMessage: "Variant Images",
      description: "product field",
    }),
    ["VARIANT_ID"]: intl.formatMessage({
      id: "HYHLsB",
      defaultMessage: "Export Variant ID",
      description: "product field",
    }),
    ["VARIANT_SKU"]: intl.formatMessage({
      id: "5kvaFR",
      defaultMessage: "Export Variant SKU",
      description: "product field",
    }),
    ["VARIANT_WEIGHT"]: intl.formatMessage({
      id: "XBwpUv",
      defaultMessage: "Export Variant Weight",
      description: "product field",
    }),
  };

  return (field: ProductFieldEnum) => messages[field];
}

export default useProductExportFieldMessages;
