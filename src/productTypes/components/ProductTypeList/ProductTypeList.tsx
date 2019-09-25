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
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { ProductTypeList_productTypes_edges_node } from "../../types/ProductTypeList";

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colName: {},
      colTax: {
        width: 300
      },
      colType: {
        width: 300
      }
    },
    colName: {
      paddingLeft: 0
    },
    colTax: {},
    colType: {},
    link: {
      cursor: "pointer"
    }
  });

interface ProductTypeListProps
  extends ListProps,
    ListActions,
    WithStyles<typeof styles> {
  productTypes: ProductTypeList_productTypes_edges_node[];
}

const numberOfColumns = 4;

const ProductTypeList = withStyles(styles, { name: "ProductTypeList" })(
  ({
    classes,
    disabled,
    productTypes,
    pageInfo,
    onNextPage,
    onPreviousPage,
    onRowClick,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: ProductTypeListProps) => {
    const intl = useIntl();

    return (
      <Table>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={productTypes}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <FormattedMessage
              defaultMessage="Type Name"
              description="product type name"
            />
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage
              defaultMessage="Type"
              description="product type is either simple or configurable"
            />
          </TableCell>
          <TableCell className={classes.colTax}>
            <FormattedMessage
              defaultMessage="Tax"
              description="tax rate for a product type"
            />
          </TableCell>
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
            productTypes,
            productType => {
              const isSelected = productType
                ? isChecked(productType.id)
                : false;
              return (
                <TableRow
                  className={!!productType ? classes.link : undefined}
                  hover={!!productType}
                  key={productType ? productType.id : "skeleton"}
                  onClick={productType ? onRowClick(productType.id) : undefined}
                  selected={isSelected}
                  data-tc="id"
                  data-tc-id={maybe(() => productType.id)}
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
                    {productType ? (
                      <>
                        <span data-tc="name">{productType.name}</span>
                        <Typography variant="caption">
                          {maybe(() => productType.hasVariants)
                            ? intl.formatMessage({
                                defaultMessage: "Configurable",
                                description: "product type"
                              })
                            : intl.formatMessage({
                                defaultMessage: "Simple product",
                                description: "product type"
                              })}
                        </Typography>
                      </>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {maybe(() => productType.isShippingRequired) !==
                    undefined ? (
                      productType.isShippingRequired ? (
                        <>
                          <FormattedMessage
                            defaultMessage="Physical"
                            description="product type"
                          />
                        </>
                      ) : (
                        <>
                          <FormattedMessage
                            defaultMessage="Digital"
                            description="product type"
                          />
                        </>
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colTax}>
                    {maybe(() => productType.taxType) ? (
                      productType.taxType.description
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
                  <FormattedMessage defaultMessage="No product types found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    );
  }
);
ProductTypeList.displayName = "ProductTypeList";
export default ProductTypeList;
