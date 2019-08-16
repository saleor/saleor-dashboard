import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
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
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colName: {
        width: 840
      },
      colProducts: {
        width: 160
      },
      colSubcategories: {
        width: 160
      }
    },
    colName: {
      paddingLeft: "0 !important"
    },
    colProducts: {
      textAlign: "center"
    },
    colSubcategories: {
      textAlign: "center"
    },
    tableRow: {
      cursor: "pointer"
    }
  });

interface CategoryListProps
  extends ListProps,
    ListActions,
    WithStyles<typeof styles> {
  categories?: Array<{
    id: string;
    name: string;
    children: {
      totalCount: number;
    };
    products: {
      totalCount: number;
    };
  }>;
  isRoot: boolean;
  onAdd?();
}

const numberOfColumns = 4;

const CategoryList = withStyles(styles, { name: "CategoryList" })(
  ({
    categories,
    classes,
    disabled,
    settings,
    isRoot,
    pageInfo,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
    onAdd,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick
  }: CategoryListProps) => {
    const intl = useIntl();

    return (
      <Card>
        {!isRoot && (
          <CardTitle
            title={intl.formatMessage({
              defaultMessage: "All Subcategories",
              description: "section header",
              id: "categoryListSubcategoriesSectionHeader"
            })}
            toolbar={
              <Button color="primary" variant="text" onClick={onAdd}>
                <FormattedMessage
                  defaultMessage="Add subcategory"
                  description="button"
                  id="categoryListAddSubcategoryButton"
                />
              </Button>
            }
          />
        )}
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={categories}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <FormattedMessage
                defaultMessage="Category Name"
                description="category list: name column header"
                id="categoryListNameColumnHeader"
              />
            </TableCell>
            <TableCell className={classes.colSubcategories}>
              <FormattedMessage
                defaultMessage="Subcategories"
                description="category list: subcategories column header"
                id="categoryListSubcategoriesColumnHeader"
              />
            </TableCell>
            <TableCell className={classes.colProducts}>
              <FormattedMessage
                defaultMessage="No. Products"
                description="category list: number of products column header"
                id="categoryListNumberOfProductsColumnHeader"
              />
            </TableCell>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                settings={settings}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
                onNextPage={onNextPage}
                onUpdateListSettings={onUpdateListSettings}
                hasPreviousPage={
                  pageInfo && !disabled ? pageInfo.hasPreviousPage : false
                }
                onPreviousPage={onPreviousPage}
              />
            </TableRow>
          </TableFooter>
          <TableBody>
            {renderCollection(
              categories,
              category => {
                const isSelected = category ? isChecked(category.id) : false;

                return (
                  <TableRow
                    className={classes.tableRow}
                    hover={!!category}
                    onClick={category ? onRowClick(category.id) : undefined}
                    key={category ? category.id : "skeleton"}
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
                    <TableCell className={classes.colName}>
                      {category && category.name ? category.name : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colSubcategories}>
                      {category &&
                      category.children &&
                      category.children.totalCount !== undefined ? (
                        category.children.totalCount
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colProducts}>
                      {category &&
                      category.products &&
                      category.products.totalCount !== undefined ? (
                        category.products.totalCount
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    {isRoot ? (
                      <FormattedMessage
                        defaultMessage="No categories found"
                        id="categoryListNoCategories"
                      />
                    ) : (
                      <FormattedMessage
                        defaultMessage="No subcategories found"
                        id="categoryListNoSubcategories"
                      />
                    )}
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
CategoryList.displayName = "CategoryList";
export default CategoryList;
