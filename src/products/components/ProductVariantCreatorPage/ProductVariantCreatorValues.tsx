import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Debounce from "@saleor/components/Debounce";
import Skeleton from "@saleor/components/Skeleton";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { isSelected } from "@saleor/utils/lists";
import React from "react";

import { ProductVariantCreateFormData } from "./form";

export interface ProductVariantCreatorValuesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  onValueClick: (attributeId: string, valueId: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    valueContainer: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "repeat(5, 1fr)"
    }
  }),
  { name: "ProductVariantCreatorValues" }
);

const ProductVariantCreatorValues: React.FC<ProductVariantCreatorValuesProps> = props => {
  const { attributes, data, onValueClick } = props;
  const classes = useStyles(props);

  return (
    <>
      {attributes.map(attribute => (
        <React.Fragment key={attribute.id}>
          <Card>
            <CardTitle title={attribute?.name || <Skeleton />} />
            <CardContent className={classes.valueContainer}>
              {attribute.values.map(value => (
                <Debounce
                  debounceFn={() => onValueClick(attribute.id, value.slug)}
                  time={100}
                  key={value.slug}
                >
                  {change => (
                    <ControlledCheckbox
                      checked={isSelected(
                        value.slug,
                        data.attributes.find(
                          dataAttribute => attribute.id === dataAttribute.id
                        )?.values || [],
                        (a, b) => a === b
                      )}
                      name={`value:${value.slug}`}
                      label={value.name}
                      onChange={change}
                    />
                  )}
                </Debounce>
              ))}
            </CardContent>
          </Card>
          <CardSpacer />
        </React.Fragment>
      ))}
    </>
  );
};

ProductVariantCreatorValues.displayName = "ProductVariantCreatorValues";
export default ProductVariantCreatorValues;
