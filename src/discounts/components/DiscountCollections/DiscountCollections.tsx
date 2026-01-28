// @ts-strict-ignore
import { collectionUrl } from "@dashboard/collections/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CollectionWithTotalProductsFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { ListActions, ListProps } from "@dashboard/types";
import { TableBody, TableCell } from "@material-ui/core";
import { IconButton } from "@saleor/macaw-ui";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface DiscountCollectionsProps extends ListProps, ListActions {
  collections: CollectionWithTotalProductsFragment[];
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
}

const numberOfColumns = 4;
const DiscountCollections = (props: DiscountCollectionsProps) => {
  const {
    collections,
    disabled,
    onCollectionAssign,
    onCollectionUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard data-test-id="assign-collection-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.discountCollectionsHeader)}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            onClick={onCollectionAssign}
            data-test-id="assign-collection-button"
            variant="secondary"
          >
            <FormattedMessage {...messages.discountCollectionsButton} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {collections === undefined ? (
          <Skeleton />
        ) : collections.length === 0 ? (
          <Placeholder>
            <FormattedMessage {...messages.discountCollectionsNotFound} />
          </Placeholder>
        ) : (
          <ResponsiveTable footer={<TablePaginationWithContext />}>
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
              items={collections}
              toggleAll={toggleAll}
              toolbar={toolbar}
            >
              <TableCell className={classes.colName}>
                <FormattedMessage {...messages.discountCollectionsTableProductHeader} />
              </TableCell>
              <TableCell className={classes.colProducts}>
                <FormattedMessage {...messages.discountCollectionsTableProductNumber} />
              </TableCell>
              <TableCell />
            </TableHead>
            <TableBody data-test-id="assigned-specific-products-table">
              {renderCollection(collections, collection => {
                const isSelected = collection ? isChecked(collection.id) : false;

                return (
                  <TableRowLink
                    data-test-id="assigned-specific-product"
                    selected={isSelected}
                    hover={!!collection}
                    key={collection ? collection.id : "skeleton"}
                    href={collection && collectionUrl(collection.id)}
                    className={classes.tableRow}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(collection.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName}>
                      {collection ? collection.name : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colProducts}>
                      {collection ? collection?.products.totalCount : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colActions}>
                      <TableButtonWrapper>
                        <IconButton
                          variant="secondary"
                          disabled={!collection || disabled}
                          onClick={event => {
                            event.stopPropagation();
                            onCollectionUnassign(collection.id);
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

DiscountCollections.displayName = "DiscountCollections";
export default DiscountCollections;
