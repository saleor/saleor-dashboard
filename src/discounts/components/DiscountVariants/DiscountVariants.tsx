// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleDetailsFragment, VoucherDetailsFragment } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import { productVariantEditPath } from "@dashboard/products/urls";
import { ListActions, ListProps } from "@dashboard/types";
import { getLoadableList, mapEdgesToItems } from "@dashboard/utils/maps";
import { TableBody, TableCell } from "@material-ui/core";
import { IconButton } from "@saleor/macaw-ui";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface SaleVariantsProps extends ListProps, ListActions {
  variants: SaleDetailsFragment["variants"] | VoucherDetailsFragment["variants"];
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
}

const numberOfColumns = 5;
const DiscountVariants = (props: SaleVariantsProps) => {
  const {
    variants: discountVariants,
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

  const variants = mapEdgesToItems(discountVariants);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountVariantsHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button onClick={onVariantAssign} data-test-id="assign-variant" variant="secondary">
            <FormattedMessage {...messages.discountVariantsButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {variants === undefined ? (
          <Skeleton />
        ) : variants.length === 0 ? (
          <Placeholder>
            <FormattedMessage {...messages.discountVariantsNotFound} />
          </Placeholder>
        ) : (
          <ResponsiveTable footer={<TablePaginationWithContext />}>
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
                  <FormattedMessage {...messages.discountVariantsTableProductHeader} />
                </span>
              </TableCell>
              <TableCell className={classes.colVariantName}>
                <FormattedMessage {...messages.discountVariantsTableVariantHeader} />
              </TableCell>
              <TableCell className={classes.colType}>
                <FormattedMessage {...messages.discountVariantsTableProductHeader} />
              </TableCell>
              <TableCell className={classes.colActions} />
            </TableHead>
            <TableBody>
              {renderCollection(getLoadableList(discountVariants), variant => {
                const isSelected = variant ? isChecked(variant.id) : false;

                return (
                  <TableRowLink
                    hover={!!variant}
                    key={variant ? variant.id : "skeleton"}
                    href={variant && productVariantEditPath(variant.id)}
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
                      {maybe<React.ReactNode>(() => variant.product.name, <Skeleton />)}
                    </TableCellAvatar>
                    <TableCell className={classes.colType}>
                      {maybe<React.ReactNode>(() => variant.name, <Skeleton />)}
                    </TableCell>
                    <TableCell className={classes.colType}>
                      {maybe<React.ReactNode>(() => variant.product.productType.name, <Skeleton />)}
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
                          <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                        </IconButton>
                      </TableButtonWrapper>
                    </TableCell>
                  </TableRowLink>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

DiscountVariants.displayName = "DiscountVariants";
export default DiscountVariants;
