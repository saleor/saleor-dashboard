import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { SaleDetails_sale } from "../../types/SaleDetails";
import { VoucherDetails_voucher } from "../../types/VoucherDetails";

export interface DiscountCategoriesProps extends ListProps, ListActions {
  discount: SaleDetails_sale | VoucherDetails_voucher;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    iconCell: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 48 + theme.spacing.unit / 2
    },
    tableRow: {
      cursor: "pointer"
    },
    textRight: {
      textAlign: "right"
    },
    wideColumn: {
      width: "60%"
    }
  });

const numberOfColumns = 4;

const DiscountCategories = withStyles(styles, {
  name: "DiscountCategories"
})(
  ({
    discount: sale,
    classes,
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
  }: DiscountCategoriesProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Eligible Categories",
            description: "section header"
          })}
          toolbar={
            <Button color="primary" onClick={onCategoryAssign}>
              <FormattedMessage
                defaultMessage="Assign categories"
                description="button"
              />
            </Button>
          }
        />
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={maybe(() => sale.categories.edges.map(edge => edge.node))}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <>
              <TableCell className={classes.wideColumn}>
                <FormattedMessage defaultMessage="Category name" />
              </TableCell>
              <TableCell className={classes.textRight}>
                <FormattedMessage
                  defaultMessage="Products"
                  description="number of products"
                />
              </TableCell>
              <TableCell />
            </>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
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
              maybe(() => sale.categories.edges.map(edge => edge.node)),
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
                      {maybe<React.ReactNode>(
                        () => category.name,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.textRight}>
                      {maybe<React.ReactNode>(
                        () => category.products.totalCount,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.iconCell}>
                      <IconButton
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
                    <FormattedMessage defaultMessage="No categories found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
DiscountCategories.displayName = "DiscountCategories";
export default DiscountCategories;
