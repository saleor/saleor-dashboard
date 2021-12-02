import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { Button, DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { SaleDetails_sale_variants_edges_node } from "../../types/SaleDetails";
import { messages } from "./messages";
import { useStyles } from "./styles";
export interface SaleVariantsProps
  extends Omit<ListProps, "onRowClick">,
    ListActions {
  variants: SaleDetails_sale_variants_edges_node[] | null;
  onVariantAssign: () => void;
  onRowClick: (productId: string, variantId: string) => () => void;
  onVariantUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const DiscountVariants: React.FC<SaleVariantsProps> = props => {
  const {
    variants,
    disabled,
    pageInfo,
    onRowClick,
    onPreviousPage,
    onVariantAssign,
    onVariantUnassign,
    onNextPage,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.discountVariantsHeader)}
        toolbar={
          <Button onClick={onVariantAssign} data-test-id="assign-variant">
            <FormattedMessage {...messages.discountVariantsButton} />
          </Button>
        }
      />
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colProductName} />
          <col className={classes.colVariantName} />
          <col className={classes.colType} />
          <col className={classes.colActions} />
        </colgroup>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={variants}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colProductName}>
            <span className={variants?.length > 0 && classes.colNameLabel}>
              <FormattedMessage
                {...messages.discountVariantsTableProductHeader}
              />
            </span>
          </TableCell>
          <TableCell className={classes.colVariantName}>
            <FormattedMessage
              {...messages.discountVariantsTableVariantHeader}
            />
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage
              {...messages.discountVariantsTableProductHeader}
            />
          </TableCell>
          <TableCell className={classes.colActions} />
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            variants,
            variant => {
              const isSelected = variant ? isChecked(variant.id) : false;

              return (
                <TableRow
                  hover={!!variant}
                  key={variant ? variant.id : "skeleton"}
                  onClick={
                    variant && onRowClick(variant.product.id, variant.id)
                  }
                  className={classes.tableRow}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(variant.id)}
                    />
                  </TableCell>
                  <TableCellAvatar
                    className={classes.colProductName}
                    thumbnail={maybe(() => variant.product.thumbnail.url)}
                  >
                    {maybe<React.ReactNode>(
                      () => variant.product.name,
                      <Skeleton />
                    )}
                  </TableCellAvatar>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(() => variant.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(
                      () => variant.product.productType.name,
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <IconButton
                      variant="secondary"
                      disabled={!variant || disabled}
                      onClick={event => {
                        event.stopPropagation();
                        onVariantUnassign(variant.id);
                      }}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.discountVariantsNotFound} />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
DiscountVariants.displayName = "DiscountVariants";
export default DiscountVariants;
