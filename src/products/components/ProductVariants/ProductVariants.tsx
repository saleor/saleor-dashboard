import {
  Card,
  CardContent,
  Hidden,
  TableCell,
  Typography,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import LimitReachedAlert from "@saleor/components/LimitReachedAlert";
import LinkChoice from "@saleor/components/LinkChoice";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow,
} from "@saleor/components/SortableTable";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@saleor/components/TableHead";
import {
  ProductDetailsVariantFragment,
  ProductFragment,
  RefreshLimitsQuery,
} from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import {
  productVariantAddUrl,
  productVariantEditUrl,
} from "@saleor/products/urls";
import { isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ChannelProps, ListActions, ReorderAction } from "../../../types";
import ProductVariantSetDefault from "../ProductVariantSetDefault";

type Warehouse = ProductDetailsVariantFragment[][0]["stocks"][0]["warehouse"];

function getWarehouseChoices(
  variants: ProductDetailsVariantFragment[],
  intl: IntlShape,
): SingleAutocompleteChoiceType[] {
  return [
    {
      label: intl.formatMessage({
        id: "JtZ71e",
        defaultMessage: "All Warehouses",
        description: "filtering option",
      }),
      value: null,
    },
    ...variants
      .reduce<Warehouse[]>(
        (warehouses, variant) => [
          ...warehouses,
          ...variant.stocks.reduce<Warehouse[]>((variantStocks, stock) => {
            if (!!warehouses.find(w => w.id === stock.warehouse.id)) {
              return variantStocks;
            }

            return [...variantStocks, stock.warehouse];
          }, []),
        ],
        [],
      )
      .map(w => ({
        label: w.name,
        value: w.id,
      })),
  ];
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 80,
      },
      colInventory: {
        width: 200,
      },
      colName: {},
      colPrice: {
        width: 135,
      },
      colSku: {
        width: 200,
      },
    },
    alert: {
      margin: theme.spacing(3, 3, 0),
    },
    colGrab: {
      width: 60,
    },
    colInventory: {
      textAlign: "right",
    },
    colName: {
      paddingLeft: 0,
    },
    colPrice: {
      textAlign: "right",
    },
    colSku: {},
    colStatus: {},
    defaultVariant: {
      color: fade(theme.palette.text.secondary, 0.6),
      display: "block",
    },
    link: {
      cursor: "pointer",
    },
    select: {
      display: "inline-block",
    },
    textLeft: {
      textAlign: "left" as "left",
    },
    textRight: {
      textAlign: "right" as "right",
    },
    warehouseLabel: {
      display: "inline-block",
      marginRight: theme.spacing(),
    },
    warehouseSelectContainer: {
      paddingTop: theme.spacing(2),
    },
  }),
  { name: "ProductVariants" },
);

function getAvailabilityLabel(
  intl: IntlShape,
  warehouse: string,
  variant: ProductDetailsVariantFragment[][0],
  numAvailable: number,
): string {
  if (variant.preorder) {
    if (variant.preorder.globalThreshold) {
      return intl.formatMessage(
        {
          id: "80FeaT",
          defaultMessage: "{globalThreshold} Global threshold",
          description: "product variant preorder threshold",
        },
        {
          globalThreshold: variant.preorder.globalThreshold,
        },
      );
    }

    return intl.formatMessage({
      id: "qbqMpk",
      defaultMessage: "In preorder",
      description: "product variant preorder threshold",
    });
  }

  const variantStock = variant.stocks.find(s => s.warehouse.id === warehouse);

  if (!!warehouse) {
    if (!!variantStock) {
      if (variantStock.quantity > 0) {
        return intl.formatMessage(
          {
            id: "uVssds",
            defaultMessage:
              "{stockQuantity,plural,one{{stockQuantity} available} other{{stockQuantity} available}}",
            description: "product variant inventory",
          },
          {
            stockQuantity: variantStock.quantity,
          },
        );
      } else {
        return intl.formatMessage({
          id: "7mK2vs",
          defaultMessage: "Unavailable",
          description: "product variant inventory",
        });
      }
    } else {
      return intl.formatMessage({
        id: "9PmyrU",
        defaultMessage: "Not stocked",
        description: "product variant inventory",
      });
    }
  } else {
    if (numAvailable > 0) {
      return intl.formatMessage(
        {
          id: "wWYYBR",
          defaultMessage:
            "{numLocations,plural,one{{numAvailable} available at {numLocations} location} other{{numAvailable} available at {numLocations} locations}}",
          description: "product variant inventory",
        },
        {
          numAvailable,
          numLocations: variant.stocks.length,
        },
      );
    } else {
      return intl.formatMessage({
        id: "6+sMz4",
        defaultMessage: "Unavailable in all locations",
        description: "product variant inventory",
      });
    }
  }
}

interface ProductVariantsProps extends ListActions, ChannelProps {
  productId: string;
  disabled: boolean;
  limits: RefreshLimitsQuery["shop"]["limits"];
  product: ProductFragment;
  variants: ProductDetailsVariantFragment[];
  onVariantReorder: ReorderAction;
  onSetDefaultVariant(variant: ProductDetailsVariantFragment[][0]);
}

const numberOfColumns = 7;

export const ProductVariants: React.FC<ProductVariantsProps> = props => {
  const {
    productId,
    disabled,
    limits,
    variants,
    product,
    onVariantReorder,
    onSetDefaultVariant,
    isChecked,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  const [warehouse, setWarehouse] = React.useState<string>(null);
  const hasVariants = maybe(() => variants.length > 0, true);
  const limitReached = isLimitReached(limits, "productVariants");

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "1kdQdO",
          defaultMessage: "Variants",
          description: "section header",
        })}
        toolbar={
          <Button
            disabled={limitReached}
            href={productVariantAddUrl(productId)}
            variant="tertiary"
            data-test-id="button-add-variant"
          >
            <FormattedMessage
              id="3VyHbJ"
              defaultMessage="Create variant"
              description="button"
            />
          </Button>
        }
      />

      {limitReached && (
        <LimitReachedAlert
          className={classes.alert}
          title={intl.formatMessage({
            id: "FwHWUm",
            defaultMessage: "SKU limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="5Vwnu+"
            defaultMessage="You have reached your SKU limit, you will be no longer able to add SKUs to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}

      {variants.length > 0 ? (
        <CardContent className={classes.warehouseSelectContainer}>
          <Typography className={classes.warehouseLabel}>
            <FormattedMessage
              id="FSinkL"
              defaultMessage="Available inventory at:"
              description="variant stock status"
            />
          </Typography>
          <LinkChoice
            className={classes.select}
            choices={getWarehouseChoices(variants, intl)}
            name="warehouse"
            value={warehouse}
            onChange={event => setWarehouse(event.target.value)}
          />
        </CardContent>
      ) : (
        <CardContent>
          <Typography color={hasVariants ? "textPrimary" : "textSecondary"}>
            <FormattedMessage
              id="rIJbNC"
              defaultMessage="Use variants for products that come in a variety of versions for example different sizes or colors"
            />
          </Typography>
        </CardContent>
      )}
      {hasVariants && (
        <ResponsiveTable>
          <colgroup>
            <col className={classes.colGrab} />
            <col />
            <col className={classes.colName} />
            <col className={classes.colSku} />
            <col className={classes.colPrice} />
            <col className={classes.colInventory} />
            <col className={classes.colActions} />
          </colgroup>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={variants}
            toggleAll={toggleAll}
            toolbar={toolbar}
            dragRows
          >
            <TableCell className={classes.colName}>
              <FormattedMessage
                id="OTek3r"
                defaultMessage="Variant"
                description="product variant name"
              />
            </TableCell>
            <TableCell className={classes.colSku}>
              <FormattedMessage id="k4brJy" defaultMessage="SKU" />
            </TableCell>
            <Hidden smDown>
              <TableCell className={classes.colPrice}>
                <FormattedMessage
                  id="n02c9W"
                  defaultMessage="Price"
                  description="product variant price"
                />
              </TableCell>
            </Hidden>
            <TableCell className={classes.colInventory}>
              <FormattedMessage
                id="kL3C+K"
                defaultMessage="Inventory"
                description="product variant inventory status"
              />
            </TableCell>
            <TableCell className={classes.colActions}></TableCell>
          </TableHead>
          <SortableTableBody onSortEnd={onVariantReorder}>
            {renderCollection(variants, (variant, variantIndex) => {
              const isSelected = variant ? isChecked(variant.id) : false;
              const isDefault =
                variant && product?.defaultVariant?.id === variant?.id;
              const numAvailable =
                variant && variant.stocks
                  ? variant.stocks.reduce(
                      (acc, s) => acc + s.quantity - s.quantityAllocated,
                      0,
                    )
                  : null;
              const channel = variant.channelListings.find(
                listing => listing.channel.id === selectedChannelId,
              );

              return (
                <SortableTableRow
                  data-test-id="product-variant-row"
                  selected={isSelected}
                  hover={!!variant}
                  href={productVariantEditUrl(product.id, variant.id)}
                  key={variant ? variant.id : "skeleton"}
                  index={variantIndex || 0}
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
                  <TableCell className={classes.colName} data-test-id="name">
                    {variant ? variant.name || variant.sku : <Skeleton />}
                    {isDefault && (
                      <span className={classes.defaultVariant}>
                        {intl.formatMessage({
                          id: "vZMs8f",
                          defaultMessage: "Default",
                          description: "default product variant indicator",
                        })}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={classes.colSku} data-test-id="sku">
                    {variant ? variant.sku : <Skeleton />}
                  </TableCell>
                  <Hidden smDown>
                    <TableCell
                      className={classes.colPrice}
                      data-test-id="price"
                    >
                      {variant ? (
                        <Money money={channel?.price} />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                  </Hidden>
                  <TableCell
                    className={classes.colInventory}
                    data-test-id="inventory"
                  >
                    {numAvailable === null ? (
                      <Skeleton />
                    ) : (
                      getAvailabilityLabel(
                        intl,
                        warehouse,
                        variant,
                        numAvailable,
                      )
                    )}
                  </TableCell>
                  <TableButtonWrapper>
                    <TableCell
                      className={classes.colActions}
                      data-test-id="actions"
                    >
                      {variant?.id !== product?.defaultVariant?.id && (
                        <ProductVariantSetDefault
                          onSetDefaultVariant={() =>
                            onSetDefaultVariant(variant)
                          }
                        />
                      )}
                    </TableCell>
                  </TableButtonWrapper>
                </SortableTableRow>
              );
            })}
          </SortableTableBody>
        </ResponsiveTable>
      )}
    </Card>
  );
};
ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
