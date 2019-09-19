import React from "react";

import { makeStyles } from "@material-ui/styles";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { isSelected } from "@saleor/utils/lists";
import { ProductVariantCreateFormData } from "./form";
import ProductVariantCreateAttributes from "./ProductVariantCreateAttributes";
import ProductVariantCreatePrices from "./ProductVariantCreatePrices";
import ProductVariantCreateSummary from "./ProductVariantCreateSummary";
import ProductVariantCreateTabs from "./ProductVariantCreateTabs";
import ProductVariantCreateValues from "./ProductVariantCreateValues";
import { ProductVariantCreateReducerAction } from "./reducer";
import { ProductVariantCreateStep } from "./types";

const useStyles = makeStyles({
  root: {
    maxHeight: 400,
    overflowY: "scroll"
  }
});

export interface ProductVariantCreateContentProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  dispatchFormDataAction: React.Dispatch<ProductVariantCreateReducerAction>;
  step: ProductVariantCreateStep;
}

const ProductVariantCreateContent: React.FC<
  ProductVariantCreateContentProps
> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    dispatchFormDataAction,
    step
  } = props;
  const classes = useStyles(props);

  const selectedAttributes = attributes.filter(attribute =>
    isSelected(attribute.id, data.attributes, (a, b) => a === b)
  );

  return (
    <div>
      <ProductVariantCreateTabs step={step} />
      <div className={classes.root}>
        {step === "attributes" && (
          <ProductVariantCreateAttributes
            attributes={attributes}
            data={data}
            onAttributeClick={id =>
              dispatchFormDataAction({
                id,
                type: "selectAttribute"
              })
            }
          />
        )}
        {step === "values" && (
          <ProductVariantCreateValues
            attributes={selectedAttributes}
            data={data}
            onValueClick={id =>
              dispatchFormDataAction({
                id,
                type: "selectValue"
              })
            }
          />
        )}
        {step === "prices" && (
          <ProductVariantCreatePrices
            attributes={selectedAttributes}
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
            onAttributeSelect={(id, type) =>
              dispatchFormDataAction({
                id,
                type:
                  type === "price"
                    ? "changeApplyPriceToAttributeId"
                    : "changeApplyStockToAttributeId"
              })
            }
            onValueClick={id =>
              dispatchFormDataAction({
                id,
                type: "selectValue"
              })
            }
          />
        )}
        {step === "summary" && (
          <ProductVariantCreateSummary
            attributes={selectedAttributes}
            currencySymbol={currencySymbol}
            data={data}
          />
        )}
      </div>
    </div>
  );
};

ProductVariantCreateContent.displayName = "ProductVariantCreateContent";
export default ProductVariantCreateContent;
