import {
  Button,
  Card,
  IconButton,
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
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { makeStyles } from "@saleor/macaw-ui";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { SaleDetails_sale } from "../../types/SaleDetails";

export interface SaleVariantsProps
  extends Omit<ListProps, "onRowClick">,
    ListActions {
  discount: SaleDetails_sale;
  onVariantAssign: () => void;
  onRowClick: (productId: string, variantId: string) => () => void;
  onVariantUnassign: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    colActions: {
      "&:last-child": {
        paddingRight: 0
      },
      width: `calc(76px + ${theme.spacing(0.5)})`
    },
    colProductName: {
      paddingLeft: 0,
      width: "auto"
    },
    colNameLabel: {
      marginLeft: `calc(${AVATAR_MARGIN}px + ${theme.spacing(3)})`
    },
    colVariantName: {
      width: 150
    },
    colType: {
      width: 200
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "DiscountVariants" }
);

const numberOfColumns = 5;

const DiscountVariants: React.FC<SaleVariantsProps> = props => {
  const {
    discount: sale,
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
        title={intl.formatMessage({
          defaultMessage: "Eligible Variants",
          description: "section header"
        })}
        toolbar={
          <Button
            color="primary"
            onClick={onVariantAssign}
            data-test-id="assign-variant"
          >
            <FormattedMessage
              defaultMessage="Assign variants"
              description="button"
            />
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
          items={mapEdgesToItems(sale?.variants)}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colProductName}>
            <span className={classes.colNameLabel}>
              <FormattedMessage defaultMessage="Product Name" />
            </span>
          </TableCell>
          <TableCell className={classes.colVariantName}>
            <FormattedMessage defaultMessage="Variant Name" />
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage defaultMessage="Product Type" />
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
            mapEdgesToItems(sale?.variants),
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
                  <FormattedMessage defaultMessage="No variants found" />
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
