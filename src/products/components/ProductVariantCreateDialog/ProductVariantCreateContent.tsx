import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import React from "react";

import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors } from "@saleor/products/types/ProductVariantBulkCreate";
import { isSelected } from "@saleor/utils/lists";
import { ProductVariantCreateFormData } from "./form";
import ProductVariantCreatePrices from "./ProductVariantCreatePrices";
import ProductVariantCreateSummary from "./ProductVariantCreateSummary";
import ProductVariantCreateTabs from "./ProductVariantCreateTabs";
import ProductVariantCreateValues from "./ProductVariantCreateValues";
import { ProductVariantCreateReducerAction } from "./reducer";
import { ProductVariantCreateStep } from "./types";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: 400,
    overflowX: "hidden",
    overflowY: "scroll",
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 2,
    position: "relative",
    right: theme.spacing.unit * 3,
    width: `calc(100% + ${theme.spacing.unit * 3}px)`
  }
}));

export interface ProductVariantCreateContentProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  dispatchFormDataAction: React.Dispatch<ProductVariantCreateReducerAction>;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors[];
  step: ProductVariantCreateStep;
  onStepClick: (step: ProductVariantCreateStep) => void;
}

const ProductVariantCreateContent: React.FC<
  ProductVariantCreateContentProps
> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    dispatchFormDataAction,
    errors,
    step,
    onStepClick
  } = props;
  const classes = useStyles(props);

  const selectedAttributes = attributes.filter(attribute =>
    isSelected(
      attribute.id,
      data.attributes.map(dataAttribute => dataAttribute.id),
      (a, b) => a === b
    )
  );

  return (
    <div>
      <ProductVariantCreateTabs step={step} onStepClick={onStepClick} />
      <div className={classes.root}>
        {step === "values" && (
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
        {step === "prices" && (
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
        {step === "summary" && (
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
      </div>
    </div>
  );
};

ProductVariantCreateContent.displayName = "ProductVariantCreateContent";
export default ProductVariantCreateContent;
