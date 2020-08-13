import { ProductFieldEnum } from "@saleor/types/globalTypes";
import { useIntl } from "react-intl";

function useProductExportFieldMessages() {
  const intl = useIntl();

  const messages = {
    [ProductFieldEnum.CATEGORY]: {
      defaultMessage: "Category",
      description: "product field",
      id: "productExportFieldCategory"
    },
    [ProductFieldEnum.CHARGE_TAXES]: {
      defaultMessage: "Charge Taxes",
      description: "product field",
      id: "productExportFieldTaxes"
    },
    [ProductFieldEnum.COLLECTIONS]: {
      defaultMessage: "Collections",
      description: "product field",
      id: "productExportFieldCollections"
    },
    [ProductFieldEnum.COST_PRICE]: {
      defaultMessage: "Cost Price",
      description: "product field",
      id: "productExportFieldPrice"
    },
    [ProductFieldEnum.DESCRIPTION]: {
      defaultMessage: "Description",
      description: "product field",
      id: "productExportFieldDescription"
    },
    [ProductFieldEnum.NAME]: {
      defaultMessage: "Name",
      description: "product field",
      id: "productExportFieldName"
    },
    [ProductFieldEnum.PRODUCT_IMAGES]: {
      defaultMessage: "Product Images",
      description: "product field",
      id: "productExportFieldProductImages"
    },
    [ProductFieldEnum.PRODUCT_TYPE]: {
      defaultMessage: "Type",
      description: "product field",
      id: "productExportFieldType"
    },
    [ProductFieldEnum.PRODUCT_WEIGHT]: {
      defaultMessage: "Export Product Weight",
      description: "product field",
      id: "productExportFieldProductWeight"
    },
    [ProductFieldEnum.VARIANT_IMAGES]: {
      defaultMessage: "Variant Images",
      description: "product field",
      id: "productExportFieldVariantImages"
    },
    [ProductFieldEnum.VARIANT_PRICE]: {
      defaultMessage: "Variant Price",
      description: "product field",
      id: "productExportFieldVariantPrice"
    },
    [ProductFieldEnum.VARIANT_SKU]: {
      defaultMessage: "Export Variant SKU",
      description: "product field",
      id: "productExportFieldVariantSku"
    },
    [ProductFieldEnum.VARIANT_WEIGHT]: {
      defaultMessage: "Export Variant Weight",
      description: "product field",
      id: "productExportFieldVariantWeight"
    },
    [ProductFieldEnum.VISIBLE]: {
      defaultMessage: "Visibility",
      description: "product field",
      id: "productExportFieldVisibility"
    }
  };

  return (field: ProductFieldEnum) => intl.formatMessage(messages[field]);
}

export default useProductExportFieldMessages;
