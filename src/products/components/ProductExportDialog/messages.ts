import { ProductFieldEnum } from "@saleor/graphql";
import { defineMessages, useIntl } from "react-intl";

export const productExportDialogMessages = defineMessages({
  title: {
    id: "xkjRu5",
    defaultMessage: "Export Information",
    description: "export products to csv file, dialog header",
  },
  confirmButtonLabel: {
    id: "oOFrUd",
    defaultMessage: "export products",
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
    [ProductFieldEnum.CATEGORY]: intl.formatMessage({
      id: "KupNHw",
      defaultMessage: "Category",
      description: "product field",
    }),
    [ProductFieldEnum.CHARGE_TAXES]: intl.formatMessage({
      id: "QVNg8A",
      defaultMessage: "Charge Taxes",
      description: "product field",
    }),
    [ProductFieldEnum.COLLECTIONS]: intl.formatMessage({
      id: "jxoMLL",
      defaultMessage: "Collections",
      description: "product field",
    }),
    [ProductFieldEnum.DESCRIPTION]: intl.formatMessage({
      id: "YVIajc",
      defaultMessage: "Description",
      description: "product field",
    }),
    [ProductFieldEnum.NAME]: intl.formatMessage({
      id: "W8i2Ez",
      defaultMessage: "Name",
      description: "product field",
    }),
    [ProductFieldEnum.PRODUCT_MEDIA]: intl.formatMessage({
      id: "6y+k8V",
      defaultMessage: "Product Images",
      description: "product field",
    }),
    [ProductFieldEnum.PRODUCT_TYPE]: intl.formatMessage({
      id: "Q/Nbku",
      defaultMessage: "Type",
      description: "product field",
    }),
    [ProductFieldEnum.PRODUCT_WEIGHT]: intl.formatMessage({
      id: "7JAAul",
      defaultMessage: "Export Product Weight",
      description: "product field",
    }),
    [ProductFieldEnum.VARIANT_MEDIA]: intl.formatMessage({
      id: "Uo5MoU",
      defaultMessage: "Variant Images",
      description: "product field",
    }),
    [ProductFieldEnum.VARIANT_ID]: intl.formatMessage({
      id: "HYHLsB",
      defaultMessage: "Export Variant ID",
      description: "product field",
    }),
    [ProductFieldEnum.VARIANT_SKU]: intl.formatMessage({
      id: "5kvaFR",
      defaultMessage: "Export Variant SKU",
      description: "product field",
    }),
    [ProductFieldEnum.VARIANT_WEIGHT]: intl.formatMessage({
      id: "XBwpUv",
      defaultMessage: "Export Variant Weight",
      description: "product field",
    }),
  };

  return (field: ProductFieldEnum) => messages[field];
}

export default useProductExportFieldMessages;
