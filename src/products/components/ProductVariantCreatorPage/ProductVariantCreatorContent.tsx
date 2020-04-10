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
              selectValue: {
                attributeId,
                valueId
              },
              type: ProductVariantCreateReducerActionType.selectValue
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
              applyPriceOrStockToAll: {
                all
              },
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.applyPriceToAll
                  : ProductVariantCreateReducerActionType.applyStockToAll
            })
          }
          // TODO: Stock change is not fixed in this PR so we won't include it here
          onApplyToAllChange={(price, type) =>
            dispatchFormDataAction(
              type === "price" && {
                changeApplyPriceToAllValue: {
                  price
                },
                type:
                  ProductVariantCreateReducerActionType.changeApplyPriceToAllValue
              }
            )
          }
          onAttributeSelect={(attributeId, type) =>
            dispatchFormDataAction({
              changeApplyPriceOrStockToAttributeId: {
                attributeId
              },
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.changeApplyPriceToAttributeId
                  : ProductVariantCreateReducerActionType.changeApplyStockToAttributeId
            })
          }
          // TODO: Stock change is not fixed in this PR so we won't include it here
          onAttributeValueChange={(valueId, price, type) =>
            dispatchFormDataAction(
              type === "price" && {
                changeAttributeValuePrice: {
                  price,
                  valueId
                },
                type:
                  ProductVariantCreateReducerActionType.changeAttributeValuePrice
              }
            )
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
              changeVariantData: {
                field,
                value,
                variantIndex
              },
              type: ProductVariantCreateReducerActionType.changeVariantData
            })
          }
          onVariantStockDataChange={(variantIndex, warehouse, value) =>
            dispatchFormDataAction({
              changeVariantStockData: {
                stock: {
                  quantity: parseInt(value, 10),
                  warehouse
                },
                variantIndex
              },
              type: ProductVariantCreateReducerActionType.changeVariantStockData
            })
          }
          onVariantDelete={variantIndex =>
            dispatchFormDataAction({
              deleteVariant: {
                variantIndex
              },
              type: ProductVariantCreateReducerActionType.deleteVariant
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
