// @ts-strict-ignore
import { categoryUrl } from "@dashboard/categories/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CategoryWithTotalProductsFragment } from "@dashboard/graphql";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { IconButton } from "@saleor/macaw-ui";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { messages } from "./messages";
import { useStyles } from "./styles";

interface DiscountCategoriesProps extends ListProps, ListActions {
  categories: CategoryWithTotalProductsFragment[];
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
}

const numberOfColumns = 4;
const DiscountCategories = (props: DiscountCategoriesProps) => {
  const {
    categories,
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
    <DashboardCard data-test-id="assign-category-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountCategoriesHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            onClick={onCategoryAssign}
            data-test-id="assign-category-button"
            variant="secondary"
          >
            <FormattedMessage {...messages.discountCategoriesButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
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
          items={categories}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <>
            <TableCell className={classes.colName}>
              <FormattedMessage {...messages.discountCategoriesTableProductHeader} />
            </TableCell>
            <TableCell className={classes.colProducts}>
              <FormattedMessage {...messages.discountCategoriesTableProductNumber} />
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
            categories,
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
                  <TableCell>{category ? category.name : <Skeleton />}</TableCell>
                  <TableCell>{category ? category.products?.totalCount : <Skeleton />}</TableCell>
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
                        <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
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
    </DashboardCard>
  );
};

DiscountCategories.displayName = "DiscountCategories";
export default DiscountCategories;
