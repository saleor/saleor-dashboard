// @ts-strict-ignore
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { maybe, renderCollection } from "@dashboard/misc";
import { TableBody, TableCell } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { AssignPickerBackfillExhaustedRow } from "../AssignPickerBackfillExhausted/AssignPickerBackfillExhausted";
import { AssignPickerListEmptyStateRow } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "../AssignPickerListLoading/AssignPickerListLoading";
import Checkbox from "../Checkbox";
import { AssignProductPickerSelectAll } from "./AssignProductPickerSelectAll";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { type AssignProductPicker } from "./useAssignProductPicker";

interface AssignProductPickerListProps {
  picker: AssignProductPicker;
  scrollableTargetId: string;
}

export const AssignProductPickerList = ({
  picker,
  scrollableTargetId,
}: AssignProductPickerListProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const {
    displayedProducts,
    handleChange,
    hasMore,
    isProductAvailable,
    loading,
    onFetchMore,
    productUnavailableText,
    productsDict,
    resumeBackfill,
    showBackfillExhausted,
    showEmptyState,
    showListLoading,
  } = picker;

  // An empty list cannot be scrolled, so InfiniteScroll would call `next` in a loop. While
  // backfill owns that empty state (loading or the Load more dead-end), keep hasMore false
  // so those fetches stay on the budgeted path instead of storming the API.
  const allowScrollFetch = Boolean(hasMore) && displayedProducts.length > 0;

  return (
    <>
      <AssignProductPickerSelectAll picker={picker} />
      <InfiniteScroll
        flush
        dataLength={displayedProducts.length}
        next={onFetchMore}
        hasMore={allowScrollFetch}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable bleed fillHeight key="table">
          <TableBody data-test-id="products-list">
            {showListLoading ? (
              <AssignPickerListLoadingRow colSpan={3} />
            ) : showBackfillExhausted ? (
              <AssignPickerBackfillExhaustedRow
                colSpan={3}
                loading={loading}
                message={intl.formatMessage(messages.allLoadedProductsFilteredOut)}
                buttonLabel={intl.formatMessage(messages.loadMoreProducts)}
                onLoadMore={resumeBackfill}
              />
            ) : (
              renderCollection(
                displayedProducts,
                product => {
                  if (!product) {
                    return null;
                  }

                  const isSelected = productsDict[product.id] || false;
                  const productAvailable = isProductAvailable(product);

                  return (
                    <TableRowLink key={product.id} data-test-id="assign-product-table-row">
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          disabled={!productAvailable}
                          onChange={() => handleChange(product.id)}
                        />
                      </TableCell>
                      <TableCellAvatar
                        className={classes.avatar}
                        thumbnail={maybe(() => product.thumbnail.url)}
                        style={{
                          opacity: !productAvailable ? 0.5 : 1,
                        }}
                      />
                      <TableCell className={classes.wideCell}>
                        {product.name}
                        {!productAvailable && productUnavailableText ? (
                          <Text display="block" size={1} color="default2">
                            {productUnavailableText}
                          </Text>
                        ) : null}
                      </TableCell>
                    </TableRowLink>
                  );
                },
                () =>
                  showEmptyState && (
                    <AssignPickerListEmptyStateRow colSpan={3}>
                      {intl.formatMessage(messages.noProductsFound)}
                    </AssignPickerListEmptyStateRow>
                  ),
              )
            )}
          </TableBody>
        </ResponsiveTable>
      </InfiniteScroll>
    </>
  );
};
