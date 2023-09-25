// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
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
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  productVariantAddUrl,
  productVariantEditUrl,
} from "@dashboard/products/urls";
import { ReorderAction } from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import { Button, Text } from "@saleor/macaw-ui/next";
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

const ProductVariantNavigation: React.FC<
  ProductVariantNavigationProps
> = props => {
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
  const navigate = useNavigator();
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage(sectionNames.variants)}
      </DashboardCard.Title>
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
                  <Text>
                    {variant ? variant.name || variant.sku : <Skeleton />}
                  </Text>
                  {isDefault && (
                    <Text
                      display="block"
                      variant="caption"
                      color="textNeutralSubdued"
                    >
                      {intl.formatMessage(messages.defaultVariant)}
                    </Text>
                  )}
                </TableCell>
              </SortableTableRow>
            );
          })}
          {!isCreate ? (
            <TableRowLink className={classes.rowNew}>
              <TableCell colSpan={3} className={classes.rowNewCell}>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => navigate(productVariantAddUrl(productId))}
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
                <Text>
                  <FormattedMessage {...messages.newVariant} />
                </Text>
              </TableCell>
            </TableRowLink>
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};
ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
