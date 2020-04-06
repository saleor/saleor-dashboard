import React from "react";

import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import CardSpacer from "@saleor/components/CardSpacer";
import { ProductVariantCreateFormData } from "./form";
import ProductVariantCreatorPrices from "./ProductVariantCreatorPrices";
import ProductVariantCreatorStock from "./ProductVariantCreatorStock";

export type PriceOrStock = "price" | "stock";
export interface ProductVariantCreatorPriceAndSkuProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  onApplyToAllChange: (applyToAll: boolean, type: PriceOrStock) => void;
  onApplyToAllPriceOrStockChange: (value: string, type: PriceOrStock) => void;
  onAttributeSelect: (id: string, type: PriceOrStock) => void;
  onAttributeValueChange: (
    id: string,
    value: string,
    type: PriceOrStock
  ) => void;
}

const ProductVariantCreatorPriceAndSku: React.FC<ProductVariantCreatorPriceAndSkuProps> = ({
  attributes,
  currencySymbol,
  data,
  onApplyToAllPriceOrStockChange,
  onApplyToAllChange,
  onAttributeSelect,
  onAttributeValueChange
}) => (
  <>
    <ProductVariantCreatorPrices
      attributes={attributes}
      currencySymbol={currencySymbol}
      data={data}
      onApplyToAllChange={value => onApplyToAllChange(value, "price")}
      onApplyToAllPriceChange={value =>
        onApplyToAllPriceOrStockChange(value, "price")
      }
      onAttributeSelect={id => onAttributeSelect(id, "price")}
      onAttributeValueChange={(id, value) =>
        onAttributeValueChange(id, value, "price")
      }
    />
    <CardSpacer />
    <ProductVariantCreatorStock
      attributes={attributes}
      data={data}
      onApplyToAllChange={value => onApplyToAllChange(value, "stock")}
      onApplyToAllStockChange={value =>
        onApplyToAllPriceOrStockChange(value, "stock")
      }
      onAttributeSelect={id => onAttributeSelect(id, "stock")}
      onAttributeValueChange={(id, value) =>
        onAttributeValueChange(id, value, "stock")
      }
    />
  </>
);

ProductVariantCreatorPriceAndSku.displayName =
  "ProductVariantCreatorPriceAndSku";
export default ProductVariantCreatorPriceAndSku;
