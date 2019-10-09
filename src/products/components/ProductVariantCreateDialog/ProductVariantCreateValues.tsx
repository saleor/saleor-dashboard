import { Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";

import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Debounce from "@saleor/components/Debounce";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { maybe } from "@saleor/misc";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { isSelected } from "@saleor/utils/lists";
import { ProductVariantCreateFormData } from "./form";

export interface ProductVariantCreateValuesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  onValueClick: (attributeId: string, valueId: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  hr: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit / 2
  },
  valueContainer: {
    display: "grid",
    gridColumnGap: theme.spacing.unit * 3 + "px",
    gridTemplateColumns: "repeat(3, 1fr)",
    marginBottom: theme.spacing.unit * 3
  }
}));

const ProductVariantCreateValues: React.FC<
  ProductVariantCreateValuesProps
> = props => {
  const { attributes, data, onValueClick } = props;
  const classes = useStyles(props);

  return (
    <>
      {attributes.map(attribute => (
        <React.Fragment key={attribute.id}>
          <Typography color="textSecondary" variant="h5">
            {maybe<React.ReactNode>(() => attribute.name, <Skeleton />)}
          </Typography>
          <Hr className={classes.hr} />
          <div className={classes.valueContainer}>
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
                      ).values,
                      (a, b) => a === b
                    )}
                    name={`value:${value.slug}`}
                    label={value.name}
                    onChange={change}
                  />
                )}
              </Debounce>
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

ProductVariantCreateValues.displayName = "ProductVariantCreateValues";
export default ProductVariantCreateValues;
