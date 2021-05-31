import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Alert from "@saleor/components/Alert/Alert";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Debounce from "@saleor/components/Debounce";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { isSelected } from "@saleor/utils/lists";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductVariantCreateFormData } from "./form";

export function getVariantsNumber(data: ProductVariantCreateFormData): number {
  return data.attributes.reduce(
    (variants, attribute) => variants * attribute.values.length,
    1
  );
}

export interface ProductVariantCreatorValuesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  variantsLeft: number | null;
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
  const { attributes, data, variantsLeft, onValueClick } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const variantsNumber = getVariantsNumber(data);

  return (
    <>
      {variantsLeft !== null && (
        <Alert
          show={variantsNumber > variantsLeft}
          title={intl.formatMessage({
            defaultMessage: "SKU limit reached",
            description: "alert"
          })}
        >
          <FormattedMessage
            defaultMessage="You choices will add {variantsNumber} SKUs to your catalog which will exceed your limit by {aboveLimitVariantsNumber}. If you would like to up your limit, contact your administration staff about raising your limits."
            values={{
              variantsNumber,
              aboveLimitVariantsNumber: variantsNumber - variantsLeft
            }}
          />
        </Alert>
      )}
      {attributes.map(attribute => (
        <React.Fragment key={attribute.id}>
          <Card>
            <CardTitle title={attribute?.name || <Skeleton />} />
            <CardContent
              className={classes.valueContainer}
              data-test-id="value-container"
            >
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
