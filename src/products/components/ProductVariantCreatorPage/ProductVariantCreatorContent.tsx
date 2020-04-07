import React from "react";

import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { isSelected } from "@saleor/utils/lists";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";
import { ProductVariantCreateFormData } from "./form";
import ProductVariantCreatePrices from "./ProductVariantCreatorPrices";
import ProductVariantCreateSummary from "./ProductVariantCreatorSummary";
import ProductVariantCreateValues from "./ProductVariantCreatorValues";
import {
  ProductVariantCreateReducerAction,
  ProductVariantCreateReducerActionType
} from "./reducer";
import { ProductVariantCreatorStep } from "./types";

export interface ProductVariantCreatorContentProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  dispatchFormDataAction: React.Dispatch<ProductVariantCreateReducerAction>;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
  step: ProductVariantCreatorStep;
  warehouses: WarehouseFragment[];
}

const ProductVariantCreatorContent: React.FC<ProductVariantCreatorContentProps> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    dispatchFormDataAction,
    errors,
    step,
    warehouses
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
              type: ProductVariantCreateReducerActionType.selectValue,
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
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.applyPriceToAll
                  : ProductVariantCreateReducerActionType.applyStockToAll
            })
          }
          onApplyToAllChange={(value, type) =>
            dispatchFormDataAction({
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.changeApplyPriceToAllValue
                  : ProductVariantCreateReducerActionType.changeApplyStockToAllValue,
              value
            })
          }
          onAttributeSelect={(attributeId, type) =>
            dispatchFormDataAction({
              attributeId,
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.changeApplyPriceToAttributeId
                  : ProductVariantCreateReducerActionType.changeApplyStockToAttributeId
            })
          }
          onAttributeValueChange={(valueId, value, type) =>
            dispatchFormDataAction({
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.changeAttributeValuePrice
                  : ProductVariantCreateReducerActionType.changeAttributeValueStock,
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
              type: ProductVariantCreateReducerActionType.changeVariantData,
              value,
              variantIndex
            })
          }
          onVariantStockDataChange={(variantIndex, warehouse, value) =>
            dispatchFormDataAction({
              stock: {
                quantity: parseInt(value, 10),
                warehouse
              },
              type:
                ProductVariantCreateReducerActionType.changeVariantStockData,
              variantIndex
            })
          }
          onVariantDelete={variantIndex =>
            dispatchFormDataAction({
              type: ProductVariantCreateReducerActionType.deleteVariant,
              variantIndex
            })
          }
          warehouses={warehouses}
        />
      )}
    </>
  );
};

ProductVariantCreatorContent.displayName = "ProductVariantCreatorContent";
export default ProductVariantCreatorContent;
