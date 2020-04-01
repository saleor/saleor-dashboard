import React from "react";

import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { isSelected } from "@saleor/utils/lists";
import { ProductVariantCreateFormData } from "./form";
import ProductVariantCreatePrices from "./ProductVariantCreatorPrices";
import ProductVariantCreateSummary from "./ProductVariantCreatorSummary";
import ProductVariantCreateValues from "./ProductVariantCreatorValues";
import { ProductVariantCreateReducerAction } from "./reducer";
import { ProductVariantCreatorStep } from "./types";

export interface ProductVariantCreatorContentProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  dispatchFormDataAction: React.Dispatch<ProductVariantCreateReducerAction>;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
  step: ProductVariantCreatorStep;
}

const ProductVariantCreatorContent: React.FC<ProductVariantCreatorContentProps> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    dispatchFormDataAction,
    errors,
    step
  } = props;
  const selectedAttributes = attributes.filter(attribute =>
    isSelected(
      attribute.id,
      data.attributes.map(dataAttribute => dataAttribute.id),
      (a, b) => a === b
    )
  );

  return (
    <>
      {step === ProductVariantCreatorStep.values && (
        <ProductVariantCreateValues
          attributes={selectedAttributes}
          data={data}
          onValueClick={(attributeId, valueId) =>
            dispatchFormDataAction({
              attributeId,
              type: "selectValue",
              valueId
            })
          }
        />
      )}
      {step === ProductVariantCreatorStep.prices && (
        <ProductVariantCreatePrices
          attributes={selectedAttributes}
          currencySymbol={currencySymbol}
          data={data}
          onApplyPriceOrStockChange={(all, type) =>
            dispatchFormDataAction({
              all,
              type: type === "price" ? "applyPriceToAll" : "applyStockToAll"
            })
          }
          onApplyToAllChange={(value, type) =>
            dispatchFormDataAction({
              type:
                type === "price"
                  ? "changeApplyPriceToAllValue"
                  : "changeApplyStockToAllValue",
              value
            })
          }
          onAttributeSelect={(attributeId, type) =>
            dispatchFormDataAction({
              attributeId,
              type:
                type === "price"
                  ? "changeApplyPriceToAttributeId"
                  : "changeApplyStockToAttributeId"
            })
          }
          onAttributeValueChange={(valueId, value, type) =>
            dispatchFormDataAction({
              type:
                type === "price"
                  ? "changeAttributeValuePrice"
                  : "changeAttributeValueStock",
              value,
              valueId
            })
          }
        />
      )}
      {step === ProductVariantCreatorStep.summary && (
        <ProductVariantCreateSummary
          attributes={selectedAttributes}
          currencySymbol={currencySymbol}
          data={data}
          errors={errors}
          onVariantDataChange={(variantIndex, field, value) =>
            dispatchFormDataAction({
              field,
              type: "changeVariantData",
              value,
              variantIndex
            })
          }
          onVariantDelete={variantIndex =>
            dispatchFormDataAction({
              type: "deleteVariant",
              variantIndex
            })
          }
        />
      )}
    </>
  );
};

ProductVariantCreatorContent.displayName = "ProductVariantCreatorContent";
export default ProductVariantCreatorContent;
