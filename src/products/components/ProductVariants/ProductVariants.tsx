import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import { maybe, renderCollection } from "../../../misc";
import { ListActions } from "../../../types";
import { ProductDetails_product_variants } from "../../types/ProductDetails";
import { ProductVariant_costPrice } from "../../types/ProductVariant";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colInventory: {
        width: 300
      },
      colName: {},
      colPrice: {
        width: 150
      },
      colSku: {
        width: 200
      }
    },
    colInventory: {
      textAlign: "right"
    },
    colName: {},
    colPrice: {
      textAlign: "right"
    },
    colSku: {},
    colStatus: {},
    denseTable: {
      "& td, & th": {
        paddingRight: theme.spacing(3)
      }
    },
    link: {
      cursor: "pointer"
    },
    textLeft: {
      textAlign: "left" as "left"
    },
    textRight: {
      textAlign: "right" as "right"
    }
  }),
  { name: "ProductVariants" }
);

interface ProductVariantsProps extends ListActions {
  disabled: boolean;
  variants: ProductDetails_product_variants[];
  fallbackPrice?: ProductVariant_costPrice;
  onRowClick: (id: string) => () => void;
  onVariantAdd?();
  onVariantsAdd?();
}

const numberOfColumns = 5;

export const ProductVariants: React.FC<ProductVariantsProps> = props => {
  const {
    disabled,
    variants,
    fallbackPrice,
    onRowClick,
    onVariantAdd,
    onVariantsAdd,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  const hasVariants = maybe(() => variants.length > 0, true);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Variants",
          description: "section header"
        })}
        toolbar={
          hasVariants ? (
            <Button
              onClick={onVariantAdd}
              variant="text"
              color="primary"
              data-tc="button-add-variant"
            >
              <FormattedMessage
                defaultMessage="Create variant"
                description="button"
              />
            </Button>
          ) : (
            <Button
              onClick={onVariantsAdd}
              variant="text"
              color="primary"
              data-tc="button-add-variants"
            >
              <FormattedMessage
                defaultMessage="Create variants"
                description="button"
              />
            </Button>
          )
        }
      />
      {!variants.length && (
        <CardContent>
          <Typography color={hasVariants ? "textPrimary" : "textSecondary"}>
            <FormattedMessage defaultMessage="Use variants for products that come in a variety of versions for example different sizes or colors" />
          </Typography>
        </CardContent>
      )}
      {hasVariants && (
        <ResponsiveTable className={classes.denseTable}>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={variants}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <FormattedMessage
                defaultMessage="Name"
                description="product variant name"
              />
            </TableCell>
            <TableCell className={classes.colSku}>
              <FormattedMessage defaultMessage="SKU" />
            </TableCell>
            <Hidden smDown>
              <TableCell className={classes.colPrice}>
                <FormattedMessage
                  defaultMessage="Price"
                  description="product variant price"
                />
              </TableCell>
            </Hidden>
            <TableCell className={classes.colInventory}>
              <FormattedMessage
                defaultMessage="Inventory"
                description="product variant inventory status"
              />
            </TableCell>
          </TableHead>
          <TableBody>
            {renderCollection(variants, variant => {
              const isSelected = variant ? isChecked(variant.id) : false;
              const numAvailable =
                variant && variant.stock
                  ? variant.stock.reduce((acc, s) => acc + s.quantity, 0)
                  : null;

              return (
                <TableRow
                  selected={isSelected}
                  hover={!!variant}
                  onClick={onRowClick(variant.id)}
                  key={variant ? variant.id : "skeleton"}
                  className={classes.link}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(variant.id)}
                    />
                  </TableCell>
                  <TableCell className={classes.colName} data-tc="name">
                    {variant ? variant.name || variant.sku : <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colSku} data-tc="sku">
                    {variant ? variant.sku : <Skeleton />}
                  </TableCell>
                  <Hidden smDown>
                    <TableCell className={classes.colPrice} data-tc="price">
                      {variant ? (
                        variant.priceOverride ? (
                          <Money money={variant.priceOverride} />
                        ) : fallbackPrice ? (
                          <Money money={fallbackPrice} />
                        ) : (
                          <Skeleton />
                        )
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                  </Hidden>
                  <TableCell
                    className={classes.colInventory}
                    data-tc="inventory"
                  >
                    {numAvailable === null ? (
                      <Skeleton />
                    ) : numAvailable === 0 ? (
                      <FormattedMessage
                        defaultMessage="Unavailable in all locations"
                        description="product variant inventory"
                      />
                    ) : (
                      <FormattedMessage
                        defaultMessage="{numAvailable} available at {numLocations} {numLocations,plural,one{location} other{locations}}"
                        description="product variant inventory"
                        values={{
                          numAvailable,
                          numLocations: variant.stock.length
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      )}
    </Card>
  );
};
ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
