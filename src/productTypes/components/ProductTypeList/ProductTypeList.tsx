// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ProductTypeFragment } from "@dashboard/graphql";
import { ProductTypeListUrlSortField, productTypeUrl } from "@dashboard/productTypes/urls";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps, SortPage } from "../../../types";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {},
      colTax: {
        width: 300,
      },
      colType: {
        width: 300,
      },
    },
    colName: {
      paddingLeft: 0,
    },
    colTax: {},
    colType: {},
    link: {
      cursor: "pointer",
    },
  }),
  { name: "ProductTypeList" },
);

interface ProductTypeListProps
  extends ListProps,
    ListActions,
    SortPage<ProductTypeListUrlSortField> {
  productTypes: ProductTypeFragment[];
}

const numberOfColumns = 4;
const ProductTypeList: React.FC<ProductTypeListProps> = props => {
  const { disabled, productTypes, onSort, isChecked, selected, sort, toggle, toggleAll, toolbar } =
    props;
  const classes = useStyles(props);
  const location = useLocation();

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={productTypes}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === ProductTypeListUrlSortField.name ? getArrowDirection(sort.asc) : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(ProductTypeListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage
            id="hHOI7D"
            defaultMessage="Type Name"
            description="product type name"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === ProductTypeListUrlSortField.digital
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(ProductTypeListUrlSortField.digital)}
          className={classes.colType}
        >
          <FormattedMessage
            id="9QtKvB"
            defaultMessage="Shippable"
            description="Product type is shippable"
          />
        </TableCellHeader>
        <TableCell className={classes.colTax}>
          <FormattedMessage
            id="+Jgot0"
            defaultMessage="Tax class"
            description="tax class for a product type"
          />
        </TableCell>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext colSpan={numberOfColumns} />
        </TableRowLink>
      </TableFooter>
      <TableBody data-test-id="product-types-list">
        {renderCollection(
          productTypes,
          productType => {
            const isSelected = productType ? isChecked(productType.id) : false;

            return (
              <TableRowLink
                className={productType ? classes.link : undefined}
                hover={!!productType}
                key={productType ? productType.id : "skeleton"}
                href={
                  productType
                    ? {
                        pathname: productTypeUrl(productType.id),
                        state: { prevLocation: location },
                      }
                    : undefined
                }
                selected={isSelected}
                data-test-id={"id-" + maybe(() => productType.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(productType.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  {productType ? <span data-test-id="name">{productType.name}</span> : <Skeleton />}
                </TableCell>
                <TableCell className={classes.colType}>
                  {maybe(() => productType.isShippingRequired) !== undefined ? (
                    productType.isShippingRequired ? (
                      <>
                        <FormattedMessage
                          id="ICeshC"
                          defaultMessage="Shippable"
                          description="product type"
                        />
                      </>
                    ) : (
                      <>
                        <FormattedMessage
                          id="vdk01u"
                          defaultMessage="Not shippable"
                          description="product type"
                        />
                      </>
                    )
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colTax}>
                  {productType?.taxClass?.name ?? "-"}
                </TableCell>
              </TableRowLink>
            );
          },
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="0nLsyM" defaultMessage="No product types found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

ProductTypeList.displayName = "ProductTypeList";
export default ProductTypeList;
