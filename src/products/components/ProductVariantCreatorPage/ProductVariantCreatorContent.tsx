import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ListActionsWithoutToolbar } from "@saleor/types";
import { isSelected } from "@saleor/utils/lists";
import React from "react";

import { ProductVariantCreateFormData } from "./form";
import ProductVariantChooseAttributes from "./ProductVariantChooseAttributes";
import ProductVariantCreatePriceAndSku from "./ProductVariantCreatorPriceAndSku";
import ProductVariantCreateSummary from "./ProductVariantCreatorSummary";
import ProductVariantCreateValues from "./ProductVariantCreatorValues";
import {
  ProductVariantCreateReducerAction,
  ProductVariantCreateReducerActionType
} from "./reducer";
import { ProductVariantCreatorStep } from "./types";

export interface ProductVariantCreatorContentProps
  extends ListActionsWithoutToolbar {
  attributesListElements: string[];
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  dispatchFormDataAction: React.Dispatch<ProductVariantCreateReducerAction>;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
  step: ProductVariantCreatorStep;
  warehouses: WarehouseFragment[];
}

const ProductVariantCreatorContent: React.FC<ProductVariantCreatorContentProps> = ({
  attributes,
  attributesListElements,
  currencySymbol,
  data,
  dispatchFormDataAction,
  errors,
  step,
  warehouses,
  ...listProps
}) => {
  const selectedAttributes = attributes.filter(attribute =>
    isSelected(
      attribute.id,
      attributesListElements.map(dataAttribute => dataAttribute),
      (a, b) => a === b
    )
  );
  return (
    <>
      {step === ProductVariantCreatorStep.attributes && (
        <ProductVariantChooseAttributes
          attributes={attributes}
          {...listProps}
        />
      )}
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
        <ProductVariantCreatePriceAndSku
          attributes={selectedAttributes}
          currencySymbol={currencySymbol}
          data={data}
          warehouses={warehouses}
          onApplyToAllChange={(mode, type) =>
            dispatchFormDataAction({
              applyPriceOrStockToAll: {
                mode
              },
              type:
                type === "price"
                  ? ProductVariantCreateReducerActionType.applyPriceToAll
                  : ProductVariantCreateReducerActionType.applyStockToAll
            })
          }
          onApplyToAllPriceChange={price =>
            dispatchFormDataAction({
              changeApplyPriceToAllValue: {
                price
              },
              type:
                ProductVariantCreateReducerActionType.changeApplyPriceToAllValue
            })
          }
          onApplyToAllStockChange={(quantity, warehouseIndex) =>
            dispatchFormDataAction({
              changeApplyStockToAllValue: {
                quantity,
                warehouseIndex
              },
              type:
                ProductVariantCreateReducerActionType.changeApplyStockToAllValue
            })
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
          onAttributePriceChange={(valueId, price) =>
            dispatchFormDataAction({
              changeAttributeValuePrice: {
                price,
                valueId
              },
              type:
                ProductVariantCreateReducerActionType.changeAttributeValuePrice
            })
          }
          onAttributeStockChange={(valueId, quantity, warehouseIndex) =>
            dispatchFormDataAction({
              changeAttributeValueStock: {
                quantity,
                valueId,
                warehouseIndex
              },
              type:
                ProductVariantCreateReducerActionType.changeAttributeValueStock
            })
          }
          onWarehouseToggle={warehouseId =>
            dispatchFormDataAction({
              changeWarehouses: {
                warehouseId
              },
              type: ProductVariantCreateReducerActionType.changeWarehouses
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
