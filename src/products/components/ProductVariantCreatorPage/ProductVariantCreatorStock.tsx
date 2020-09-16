import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { isSelected } from "@saleor/utils/lists";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  ProductVariantCreateFormData,
  VariantCreatorPricesAndSkuMode
} from "./form";
import { getStockAttributeValues } from "./utils";

const useStyles = makeStyles(
  theme => ({
    attributeStockContainer: {
      columnGap: theme.spacing(3) + "px",
      display: "grid",
      gridTemplateColumns: ({ data }: ProductVariantCreatorStockProps) =>
        `150px repeat(${data.warehouses.length}, 288px)`,
      rowGap: theme.spacing(2) + "px"
    },
    attributeStockScroll: {
      overflowX: "scroll",
      width: "100%"
    },
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
      marginTop: theme.spacing(2),
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
  onApplyToAllStockChange: (quantity: number, warehouseIndex: number) => void;
  onAttributeSelect: (id: string) => void;
  onAttributeValueChange: (
    id: string,
    quantity: number,
    warehouseIndex: number
  ) => void;
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
        {!warehouses.length ? (
          <Typography color="textSecondary">
            <FormattedMessage
              defaultMessage="There are no warehouses set up for your store. You can configure your variants without providing stock quantites."
              description="no warehouses info"
              id="productVariantCreatorWarehouseSectionDescription"
            />
          </Typography>
        ) : (
          <>
            {warehouses.length > 1 && (
              <>
                <Typography className={classes.warehouseHeader} variant="h5">
                  <FormattedMessage
                    defaultMessage="Warehouses"
                    description="header"
                    id="productVariantCreatorWarehouseSectionHeader"
                  />
                </Typography>
                <Typography className={classes.warehouseSubheader}>
                  <FormattedMessage
                    defaultMessage="Based on your selections we will create {numberOfProducts} products. Use this step to customize price and stocks for your new products"
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
                    <div key={warehouseId}>
                      <Typography className={classes.warehouseName}>
                        {
                          warehouses.find(
                            warehouse => warehouse.id === warehouseId
                          ).name
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
                            parseInt(event.target.value, 10),
                            warehouseIndex
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
                  <SingleSelectField
                    className={classes.shortInput}
                    choices={attributeChoices}
                    label={intl.formatMessage({
                      defaultMessage: "Select Attribute",
                      description: "variant attribute"
                    })}
                    value={data.stock.attribute}
                    onChange={event => onAttributeSelect(event.target.value)}
                  />
                  {stockAttributeValues && (
                    <>
                      <Hr className={classes.hrAttribute} />
                      <FormSpacer />
                      <div className={classes.attributeStockScroll}>
                        <div className={classes.attributeStockContainer}>
                          <div />
                          {data.stock.attribute &&
                            data.warehouses.map(warehouseId => (
                              <Typography
                                className={classes.warehouseName}
                                key={warehouseId}
                              >
                                {
                                  warehouses.find(
                                    warehouse => warehouse.id === warehouseId
                                  ).name
                                }
                              </Typography>
                            ))}
                          {stockAttributeValues.map(attributeValue => (
                            <React.Fragment key={attributeValue.id}>
                              <Typography>{attributeValue.name}</Typography>
                              {data.warehouses.map(
                                (warehouseId, warehouseIndex) => (
                                  <TextField
                                    fullWidth
                                    inputProps={{
                                      min: 0,
                                      type: "number"
                                    }}
                                    label={intl.formatMessage({
                                      defaultMessage: "Stock",
                                      id:
                                        "productVariantCreatePricesStockInputLabel"
                                    })}
                                    value={
                                      data.stock.values.find(
                                        value =>
                                          value.slug === attributeValue.slug
                                      ).value[warehouseIndex]
                                    }
                                    onChange={event =>
                                      onAttributeValueChange(
                                        attributeValue.slug,
                                        parseInt(event.target.value, 10),
                                        warehouseIndex
                                      )
                                    }
                                    key={warehouseId}
                                  />
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {data.stock.mode === "attribute" && !!data.stock.attribute && (
                <>
                  <FormSpacer />
                  <Hr />
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

ProductVariantCreatorStock.displayName = "ProductVariantCreatorStock";
export default ProductVariantCreatorStock;
