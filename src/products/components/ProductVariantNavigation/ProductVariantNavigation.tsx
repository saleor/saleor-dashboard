import { Card, TableCell, TableRow } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow,
} from "@saleor/components/SortableTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import {
  ProductVariantCreateDataQuery,
  ProductVariantDetailsQuery,
} from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import {
  productVariantAddUrl,
  productVariantEditUrl,
} from "@saleor/products/urls";
import { ReorderAction } from "@saleor/types";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";

const useStyles = makeStyles(
  theme => ({
    colAvatar: {
      width: 64,
    },
    colName: {
      paddingLeft: 0,
    },
    defaultVariant: {
      color: fade(theme.palette.text.secondary, 0.6),
      display: "block",
    },
    firstVariant: {
      width: 104,
    },
    link: {
      cursor: "pointer",
    },
    noHandle: {
      "&&&": {
        paddingRight: theme.spacing(3),
      },
      textAlign: "right",
    },
    tabActive: {
      "& > td:first-child": {
        "&:before": {
          background: theme.palette.primary.main,
          content: '""',
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: 2,
        },
        position: "relative",
      },
    },
  }),
  { name: "ProductVariantNavigation" },
);

interface ProductVariantNavigationProps {
  current?: string;
  defaultVariantId?: string;
  fallbackThumbnail: string;
  productId: string;
  isCreate?: boolean;
  variants:
    | Array<ProductVariantDetailsQuery["productVariant"]>
    | ProductVariantCreateDataQuery["product"]["variants"];
  onReorder: ReorderAction;
}

const ProductVariantNavigation: React.FC<ProductVariantNavigationProps> = props => {
  const {
    current,
    defaultVariantId,
    fallbackThumbnail,
    productId,
    isCreate,
    variants,
    onReorder,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "1kdQdO",
          defaultMessage: "Variants",
          description: "section header",
        })}
      />
      <ResponsiveTable>
        <SortableTableBody onSortEnd={onReorder}>
          {renderCollection(variants, (variant, variantIndex) => {
            const isDefault = variant && variant.id === defaultVariantId;
            const isActive = variant && variant.id === current;
            const thumbnail = variant?.media?.filter(
              mediaObj => mediaObj.type === "IMAGE",
            )[0];

            return (
              <SortableTableRow
                hover={!!variant}
                key={variant ? variant.id : "skeleton"}
                index={variantIndex || 0}
                className={classNames(classes.link, {
                  [classes.tabActive]: isActive,
                })}
                href={
                  variant
                    ? productVariantEditUrl(productId, variant.id)
                    : undefined
                }
              >
                <TableCellAvatar
                  className={classes.colAvatar}
                  thumbnail={thumbnail?.url || fallbackThumbnail}
                />
                <TableCell className={classes.colName}>
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
              </SortableTableRow>
            );
          })}
          {!isCreate ? (
            <TableRow>
              <TableCell colSpan={3}>
                <Button
                  href={productVariantAddUrl(productId)}
                  data-test-id="button-add-variant"
                >
                  <FormattedMessage
                    id="3C3Nj5"
                    defaultMessage="Add variant"
                    description="button"
                  />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCellAvatar
                alignRight
                className={classNames(
                  classes.colAvatar,
                  classes.tabActive,
                  classes.noHandle,
                  {
                    [classes.firstVariant]: variants?.length === 0,
                  },
                )}
                thumbnail={null}
                colSpan={2}
              />
              <TableCell className={classes.colName}>
                <FormattedMessage
                  id="gF7hbK"
                  defaultMessage="New Variant"
                  description="variant name"
                />
              </TableCell>
            </TableRow>
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
