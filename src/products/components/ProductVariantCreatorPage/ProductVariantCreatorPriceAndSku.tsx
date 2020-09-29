import { ChannelPriceData } from "@saleor/channels/utils";
import CardSpacer from "@saleor/components/CardSpacer";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import React from "react";

import {
  ProductVariantCreateFormData,
  VariantCreatorPricesAndSkuMode
} from "./form";
import ProductVariantCreatorPrices from "./ProductVariantCreatorPrices";
import ProductVariantCreatorStock from "./ProductVariantCreatorStock";

export type PriceOrStock = "price" | "stock";
export interface ProductVariantCreatorPriceAndSkuProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  channelListings: ChannelPriceData[];
  data: ProductVariantCreateFormData;
  warehouses: WarehouseFragment[];
  onApplyToAllChange: (
    value: VariantCreatorPricesAndSkuMode,
    type: PriceOrStock
  ) => void;
  onApplyToAllPriceChange: (channelId: string, value: string) => void;
  onApplyToAllStockChange: (quantity: number, warehouseIndex: number) => void;
  onAttributeSelect: (id: string, type: PriceOrStock) => void;
  onAttributePriceChange: (
    id: string,
    value: string,
    channelId: string
  ) => void;
  onAttributeStockChange: (
    id: string,
    quantity: number,
    warehouseIndex: number
  ) => void;
  onWarehouseToggle: (id: string) => void;
}

const ProductVariantCreatorPriceAndSku: React.FC<ProductVariantCreatorPriceAndSkuProps> = ({
  attributes,
  channelListings,
  data,
  warehouses,
  onApplyToAllChange,
  onApplyToAllPriceChange,
  onApplyToAllStockChange,
  onAttributeSelect,
  onAttributePriceChange,
  onAttributeStockChange,
  onWarehouseToggle
}) => (
  <>
    <ProductVariantCreatorPrices
      attributes={attributes}
      channelListings={channelListings}
      data={data}
      onApplyToAllChange={value => onApplyToAllChange(value, "price")}
      onApplyToAllPriceChange={onApplyToAllPriceChange}
      onAttributeSelect={id => onAttributeSelect(id, "price")}
      onAttributeValueChange={onAttributePriceChange}
    />
    <CardSpacer />
    <ProductVariantCreatorStock
      attributes={attributes}
      data={data}
      warehouses={warehouses}
      onApplyToAllChange={value => onApplyToAllChange(value, "stock")}
      onApplyToAllStockChange={onApplyToAllStockChange}
      onAttributeSelect={id => onAttributeSelect(id, "stock")}
      onAttributeValueChange={onAttributeStockChange}
      onWarehouseToggle={onWarehouseToggle}
    />
  </>
);

ProductVariantCreatorPriceAndSku.displayName =
  "ProductVariantCreatorPriceAndSku";
export default ProductVariantCreatorPriceAndSku;
