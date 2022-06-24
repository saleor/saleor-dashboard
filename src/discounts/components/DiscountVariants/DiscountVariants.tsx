import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { SaleDetailsFragment } from "@saleor/graphql";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { productVariantEditPath } from "@saleor/products/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps, RelayToFlat } from "../../../types";
import { messages } from "./messages";
import { useStyles } from "./styles";

export interface SaleVariantsProps extends ListProps, ListActions {
  variants: RelayToFlat<SaleDetailsFragment["variants"]> | null;
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const DiscountVariants: React.FC<SaleVariantsProps> = props => {
  const {
    variants,
    disabled,
    onVariantAssign,
    onVariantUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
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
            <TablePaginationWithContext colSpan={numberOfColumns} />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            variants,
            variant => {
              const isSelected = variant ? isChecked(variant.id) : false;

              return (
                <TableRowLink
                  hover={!!variant}
                  key={variant ? variant.id : "skeleton"}
                  href={
                    variant &&
                    productVariantEditPath(variant.product.id, variant.id)
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
                      <Skeleton />,
                    )}
                  </TableCellAvatar>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(() => variant.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(
                      () => variant.product.productType.name,
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <TableButtonWrapper>
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
                    </TableButtonWrapper>
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.discountVariantsNotFound} />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
DiscountVariants.displayName = "DiscountVariants";
export default DiscountVariants;
