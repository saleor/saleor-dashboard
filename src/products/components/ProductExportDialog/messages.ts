import { ProductFieldEnum } from "@saleor/types/globalTypes";
import { useIntl } from "react-intl";

function useProductExportFieldMessages() {
  const intl = useIntl();

  const messages = {
    [ProductFieldEnum.CATEGORY]: intl.formatMessage({
      defaultMessage: "Category",
      description: "product field",
      id: "productExportFieldCategory"
    }),
    [ProductFieldEnum.CHARGE_TAXES]: intl.formatMessage({
      defaultMessage: "Charge Taxes",
      description: "product field",
      id: "productExportFieldTaxes"
    }),
    [ProductFieldEnum.COLLECTIONS]: intl.formatMessage({
      defaultMessage: "Collections",
      description: "product field",
      id: "productExportFieldCollections"
    }),
    [ProductFieldEnum.DESCRIPTION]: intl.formatMessage({
      defaultMessage: "Description",
      description: "product field",
      id: "productExportFieldDescription"
    }),
    [ProductFieldEnum.NAME]: intl.formatMessage({
      defaultMessage: "Name",
      description: "product field",
      id: "productExportFieldName"
    }),
    [ProductFieldEnum.PRODUCT_IMAGES]: intl.formatMessage({
      defaultMessage: "Product Images",
      description: "product field",
      id: "productExportFieldProductImages"
    }),
    [ProductFieldEnum.PRODUCT_TYPE]: intl.formatMessage({
      defaultMessage: "Type",
      description: "product field",
      id: "productExportFieldType"
    }),
    [ProductFieldEnum.PRODUCT_WEIGHT]: intl.formatMessage({
      defaultMessage: "Export Product Weight",
      description: "product field",
      id: "productExportFieldProductWeight"
    }),
    [ProductFieldEnum.VARIANT_IMAGES]: intl.formatMessage({
      defaultMessage: "Variant Images",
      description: "product field",
      id: "productExportFieldVariantImages"
    }),
    [ProductFieldEnum.VARIANT_SKU]: intl.formatMessage({
      defaultMessage: "Export Variant SKU",
      description: "product field",
      id: "productExportFieldVariantSku"
    }),
    [ProductFieldEnum.VARIANT_WEIGHT]: intl.formatMessage({
      defaultMessage: "Export Variant Weight",
      description: "product field",
      id: "productExportFieldVariantWeight"
    }),
    [ProductFieldEnum.VISIBLE]: intl.formatMessage({
      defaultMessage: "Visibility",
      description: "product field",
      id: "productExportFieldVisibility"
    })
  };

  return (field: ProductFieldEnum) => messages[field];
}

export default useProductExportFieldMessages;
