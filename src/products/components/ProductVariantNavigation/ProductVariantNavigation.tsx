import { Card, TableCell, TableRow } from "@material-ui/core";
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
import { sectionNames } from "@saleor/intl";
import {
  productVariantAddUrl,
  productVariantEditUrl,
} from "@saleor/products/urls";
import { ReorderAction } from "@saleor/types";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { messages } from "./messages";
import { useStyles } from "./styles";

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
      <CardTitle title={intl.formatMessage(sectionNames.variants)} />
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
                  [classes.rowActive]: isActive,
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
                      {intl.formatMessage(messages.defaultVariant)}
                    </span>
                  )}
                </TableCell>
              </SortableTableRow>
            );
          })}
          {!isCreate ? (
            <TableRow className={classes.rowNew}>
              <TableCell colSpan={3}>
                <Button
                  href={productVariantAddUrl(productId)}
                  data-test-id="button-add-variant"
                >
                  <FormattedMessage {...messages.addVariant} />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCellAvatar
                alignRight
                className={classNames(
                  classes.colAvatar,
                  classes.rowActive,
                  classes.noHandle,
                  {
                    [classes.firstVariant]: variants?.length === 0,
                  },
                )}
                thumbnail={null}
                colSpan={2}
              />
              <TableCell className={classes.colName}>
                <FormattedMessage {...messages.newVariant} />
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
