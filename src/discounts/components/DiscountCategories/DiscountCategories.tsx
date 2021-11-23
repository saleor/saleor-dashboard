import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { Button, IconButton } from "@saleor/macaw-ui";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { SaleDetails_sale } from "../../types/SaleDetails";
import { VoucherDetails_voucher } from "../../types/VoucherDetails";
import { messages } from "./messages";
import { useStyles } from "./styles";
export interface DiscountCategoriesProps extends ListProps, ListActions {
  discount: SaleDetails_sale | VoucherDetails_voucher;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
}

const numberOfColumns = 4;

const DiscountCategories: React.FC<DiscountCategoriesProps> = props => {
  const {
    discount,
    disabled,
    pageInfo,
    onCategoryAssign,
    onCategoryUnassign,
    onRowClick,
    onPreviousPage,
    onNextPage,
    toolbar,
    toggle,
    toggleAll,
    selected,
    isChecked
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.discountCategoriesHeader)}
        toolbar={
          <Button onClick={onCategoryAssign}>
            <FormattedMessage {...messages.discountCategoriesButton} />
          </Button>
        }
      />
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colName} />
          <col className={classes.colProducts} />
          <col className={classes.colActions} />
        </colgroup>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={mapEdgesToItems(discount?.categories)}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <>
            <TableCell className={classes.colName}>
              <FormattedMessage
                {...messages.discountCategoriesTableProductHeader}
              />
            </TableCell>
            <TableCell className={classes.colProducts}>
              <FormattedMessage
                {...messages.discountCategoriesTableProductNumber}
              />
            </TableCell>
            <TableCell />
          </>
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
            mapEdgesToItems(discount?.categories),
            category => {
              const isSelected = category ? isChecked(category.id) : false;

              return (
                <TableRow
                  hover={!!category}
                  key={category ? category.id : "skeleton"}
                  onClick={category && onRowClick(category.id)}
                  className={classes.tableRow}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(category.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {maybe<React.ReactNode>(() => category.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colProducts}>
                    {maybe<React.ReactNode>(
                      () => category.products.totalCount,
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <IconButton
                      variant="secondary"
                      disabled={!category || disabled}
                      onClick={event => {
                        event.stopPropagation();
                        onCategoryUnassign(category.id);
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
                  <FormattedMessage {...messages.discountCategoriesNotFound} />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
DiscountCategories.displayName = "DiscountCategories";
export default DiscountCategories;
