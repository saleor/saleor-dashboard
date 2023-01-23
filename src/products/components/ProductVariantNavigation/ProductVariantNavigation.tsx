import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow,
} from "@dashboard/components/SortableTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  ProductVariantCreateDataQuery,
  ProductVariantDetailsQuery,
} from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import {
  productVariantAddUrl,
  productVariantEditUrl,
} from "@dashboard/products/urls";
import { ReorderAction } from "@dashboard/types";
import { Card, TableCell } from "@material-ui/core";
import clsx from "clsx";
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
                className={clsx(classes.link, {
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
            <TableRowLink className={classes.rowNew}>
              <TableCell colSpan={3}>
                <Button
                  href={productVariantAddUrl(productId)}
                  data-test-id="button-add-variant"
                >
                  <FormattedMessage {...messages.addVariant} />
                </Button>
              </TableCell>
            </TableRowLink>
          ) : (
            <TableRowLink>
              <TableCellAvatar
                alignRight
                className={clsx(
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
            </TableRowLink>
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
