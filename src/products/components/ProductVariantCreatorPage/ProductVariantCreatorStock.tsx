import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import CardTitle from "@saleor/components/CardTitle";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";
import CardSpacer from "@saleor/components/CardSpacer";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { isSelected } from "@saleor/utils/lists";
import {
  ProductVariantCreateFormData,
  VariantCreatorPricesAndSkuMode
} from "./form";
import { getStockAttributeValues } from "./utils";

const useStyles = makeStyles(
  theme => ({
    hr: {
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(0.5)
    },
    hrAttribute: {
      marginTop: theme.spacing(2)
    },
    label: {
      alignSelf: "center"
    },
    shortInput: {
      width: "33%"
    },
    stockContainer: {
      columnGap: theme.spacing(3) + "px",
      display: "grid",
      gridTemplateColumns: "repeat(3, 288px)",
      rowGap: theme.spacing(2) + "px"
    },
    stockHeader: {
      marginBottom: theme.spacing()
    },
    warehouseContainer: {
      columnGap: theme.spacing(3) + "px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      rowGap: theme.spacing(2) + "px"
    },
    warehouseHeader: {
      marginBottom: theme.spacing()
    },
    warehouseName: {
      marginBottom: theme.spacing()
    },
    warehouseSubheader: {
      marginBottom: theme.spacing(2)
    }
  }),
  { name: "ProductVariantCreatorStock" }
);

export interface ProductVariantCreatorStockProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  warehouses: WarehouseFragment[];
  onApplyToAllChange: (mode: VariantCreatorPricesAndSkuMode) => void;
  onApplyToAllStockChange: (warehouseIndex: number, value: string) => void;
  onAttributeSelect: (id: string) => void;
  onAttributeValueChange: (id: string, value: string) => void;
  onWarehouseToggle: (id: string) => void;
}

const ProductVariantCreatorStock: React.FC<ProductVariantCreatorStockProps> = props => {
  const {
    attributes,
    data,
    warehouses,
    onApplyToAllChange,
    onApplyToAllStockChange,
    onAttributeSelect,
    onAttributeValueChange,
    onWarehouseToggle
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const attributeChoices = attributes.map(attribute => ({
    label: attribute.name,
    value: attribute.id
  }));
  const stockAttributeValues = getStockAttributeValues(data, attributes);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Stock and Warehousing",
          description: "variant stock, header"
        })}
      />
      <CardContent>
        {warehouses.length > 1 && (
          <>
            <Typography className={classes.warehouseHeader} variant="h5">
              <FormattedMessage
                defaultMessage="Warehouses"
                description="header"
                id="productVariantCreatorStockSectionHeader"
              />
            </Typography>
            <Typography className={classes.warehouseSubheader}>
              <FormattedMessage
                defaultMessage="Based on your selections we will create {numberOfProducts} products. Use this step to customize price and stocks for your new products"
                id="productVariantCreatorStockSectionHeader"
                values={{
                  numberOfProducts: data.attributes.reduce(
                    (acc, attr) => acc + attr.values.length,
                    0
                  )
                }}
              />
            </Typography>
            <div className={classes.warehouseContainer}>
              {warehouses.map(warehouse => (
                <ControlledCheckbox
                  checked={isSelected(
                    warehouse.id,
                    data.warehouses,
                    (a, b) => a === b
                  )}
                  name={`warehouse:${warehouse.id}`}
                  label={warehouse.name}
                  onChange={() => onWarehouseToggle(warehouse.id)}
                  key={warehouse.id}
                />
              ))}
            </div>
            <CardSpacer />
            <Hr />
            <CardSpacer />
          </>
        )}
        <Typography className={classes.stockHeader} variant="h5">
          <FormattedMessage
            defaultMessage="Stock"
            description="variant stock, header"
            id="productVariantCreatorStockSectionHeader"
          />
        </Typography>
        <RadioGroup value={data.stock.mode}>
          <FormControlLabel
            value="all"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply single stock to all SKUs"
            })}
            onChange={() => onApplyToAllChange("all")}
          />
          {data.stock.mode === "all" && (
            <div className={classes.stockContainer}>
              {data.warehouses.map((warehouseId, warehouseIndex) => (
                <div>
                  <Typography
                    className={classes.warehouseName}
                    key={warehouseId}
                  >
                    {
                      warehouses.find(warehouse => warehouse.id === warehouseId)
                        .name
                    }
                  </Typography>
                  <TextField
                    fullWidth
                    inputProps={{
                      min: 0,
                      type: "number"
                    }}
                    label={intl.formatMessage({
                      defaultMessage: "Stock",
                      id: "productVariantCreatePricesStockInputLabel"
                    })}
                    value={data.stock.value[warehouseIndex]}
                    onChange={event =>
                      onApplyToAllStockChange(
                        warehouseIndex,
                        event.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
          <FormSpacer />
          <FormControlLabel
            value="attribute"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Apply unique stock by attribute to each SKU"
            })}
            onChange={() => onApplyToAllChange("attribute")}
          />
          {data.stock.mode === "attribute" && (
            <>
              <FormSpacer />
              <Grid variant="uniform">
                <div className={classes.label}>
                  <Typography>
                    <FormattedMessage
                      defaultMessage="Choose attribute"
                      description="variant attribute"
                    />
                  </Typography>
                </div>
                <div>
                  <SingleSelectField
                    choices={attributeChoices}
                    label={intl.formatMessage({
                      defaultMessage: "Attribute",
                      description: "variant attribute"
                    })}
                    value={data.stock.attribute}
                    onChange={onAttributeSelect}
                  />
                </div>
              </Grid>
              {stockAttributeValues &&
                stockAttributeValues.map(attributeValue => (
                  <React.Fragment key={attributeValue.id}>
                    <Hr className={classes.hrAttribute} />
                    <FormSpacer />
                    <Grid variant="uniform">
                      <div className={classes.label}>
                        <Typography>{attributeValue.name}</Typography>
                      </div>
                      <div>
                        <TextField
                          label={intl.formatMessage({
                            defaultMessage: "Stock",
                            description: "variant stock",
                            id: "productVariantCreatePricesSetStockPlaceholder"
                          })}
                          fullWidth
                          value={
                            data.stock.values.find(
                              value => value.slug === attributeValue.slug
                            ).value
                          }
                          onChange={event =>
                            onAttributeValueChange(
                              attributeValue.slug,
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </Grid>
                  </React.Fragment>
                ))}
            </>
          )}
          <FormSpacer />
          <FormControlLabel
            value="skip"
            control={<Radio color="primary" />}
            label={intl.formatMessage({
              defaultMessage: "Skip stock for now"
            })}
            onChange={() => onApplyToAllChange("skip")}
          />
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

ProductVariantCreatorStock.displayName = "ProductVariantCreatorStock";
export default ProductVariantCreatorStock;
