// @ts-strict-ignore
import { categoryUrl } from "@dashboard/categories/urls";
import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  SaleDetailsFragment,
  VoucherDetailsFragment,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Card, TableBody, TableCell, TableFooter } from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { messages } from "./messages";
import { useStyles } from "./styles";

export interface DiscountCategoriesProps extends ListProps, ListActions {
  discount: SaleDetailsFragment | VoucherDetailsFragment;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
}

const numberOfColumns = 4;

const DiscountCategories: React.FC<DiscountCategoriesProps> = props => {
  const {
    discount,
    disabled,
    onCategoryAssign,
    onCategoryUnassign,
    toolbar,
    toggle,
    toggleAll,
    selected,
    isChecked,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card data-test-id="assign-category-section">
      <CardTitle
        title={intl.formatMessage(messages.discountCategoriesHeader)}
        toolbar={
          <Button
            onClick={onCategoryAssign}
            data-test-id="assign-category-button"
          >
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
          <TableRowLink>
            <TablePaginationWithContext colSpan={numberOfColumns} />
          </TableRowLink>
        </TableFooter>
        <TableBody data-test-id="assigned-specific-products-table">
          {renderCollection(
            mapEdgesToItems(discount?.categories),
            category => {
              const isSelected = category ? isChecked(category.id) : false;

              return (
                <TableRowLink
                  hover={!!category}
                  key={category ? category.id : "skeleton"}
                  href={category && categoryUrl(category.id)}
                  className={classes.tableRow}
                  selected={isSelected}
                  data-test-id="assigned-specific-product"
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
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <TableButtonWrapper>
                      <IconButton
                        variant="secondary"
                        disabled={!category || disabled}
                        onClick={event => {
                          event.stopPropagation();
                          onCategoryUnassign(category.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableButtonWrapper>
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.discountCategoriesNotFound} />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
DiscountCategories.displayName = "DiscountCategories";
export default DiscountCategories;
