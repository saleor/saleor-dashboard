import { ChannelPriceData } from "@saleor/channels/utils";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";
import { FetchMoreProps } from "@saleor/types";
import { isSelected } from "@saleor/utils/lists";
import React from "react";

import { ProductVariantCreateFormData } from "./form";
import ProductVariantCreatorPriceAndSku from "./ProductVariantCreatorPriceAndSku";
import ProductVariantCreatorSummary from "./ProductVariantCreatorSummary";
import ProductVariantCreatorValues from "./ProductVariantCreatorValues";
import {
  ProductVariantCreateReducerAction,
  ProductVariantCreateReducerActionType
} from "./reducer";
import { ProductVariantCreatorStep } from "./types";

export interface ProductVariantCreatorContentProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
  channelListings: ChannelPriceData[];
  data: ProductVariantCreateFormData;
  dispatchFormDataAction: React.Dispatch<ProductVariantCreateReducerAction>;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
  step: ProductVariantCreatorStep;
  variantsLeft: number | null;
  warehouses: WarehouseFragment[];
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues?: FetchMoreProps;
}

const ProductVariantCreatorContent: React.FC<ProductVariantCreatorContentProps> = ({
  attributes,
  attributeValues,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  channelListings,
  data,
  dispatchFormDataAction,
  errors,
  step,
  variantsLeft,
  warehouses
}) => {
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
        <ProductVariantCreatorValues
          attributes={selectedAttributes}
          attributeValues={attributeValues}
          fetchAttributeValues={fetchAttributeValues}
          fetchMoreAttributeValues={fetchMoreAttributeValues}
          data={data}
          variantsLeft={variantsLeft}
          onValueClick={(attributeId, value) =>
            dispatchFormDataAction({
              selectValue: {
                attributeId,
                value
              },
              type: ProductVariantCreateReducerActionType.selectValue
            })
          }
        />
      )}
      {step === ProductVariantCreatorStep.prices && (
        <ProductVariantCreatorPriceAndSku
          attributes={selectedAttributes}
          data={data}
          channelListings={channelListings}
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
          onApplyToAllPriceChange={(channelId, price) =>
            dispatchFormDataAction({
              changeApplyPriceToAllValue: {
                channelId,
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
          onAttributePriceChange={(valueId, price, channelId) =>
            dispatchFormDataAction({
              changeAttributeValuePrice: {
                channelId,
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
        <ProductVariantCreatorSummary
          attributes={selectedAttributes}
          channelListings={channelListings}
          data={data}
          errors={errors}
          onVariantSkuChange={(variantIndex, value) =>
            dispatchFormDataAction({
              changeVariantSku: {
                value,
                variantIndex
              },
              type: ProductVariantCreateReducerActionType.changeVariantSku
            })
          }
          onVariantPriceDataChange={(variantIndex, value) =>
            dispatchFormDataAction({
              changeVariantPriceData: {
                value,
                variantIndex
              },
              type: ProductVariantCreateReducerActionType.changeVariantPriceData
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
