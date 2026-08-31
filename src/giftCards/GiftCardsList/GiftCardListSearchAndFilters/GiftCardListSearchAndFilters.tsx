import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardListBulkActions } from "../GiftCardListBulkActions";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import { giftCardListSearchAndFiltersMessages as messages } from "./messages";

const GiftCardListSearchAndFilters = (): JSX.Element => {
  const intl = useIntl();

  const { params, handleSearchChange, selectedRowIds } = useGiftCardList();
  const { openDeleteDialog } = useGiftCardListDialogs();

  return (
    <ListFilters
      type="expression-filter"
      initialSearch={params?.query || ""}
      onSearchChange={handleSearchChange}
      showSearchTooltip
      searchPlaceholder={intl.formatMessage(messages.searchPlaceholder)}
      actions={
        <Box display="flex" gap={4} alignItems="center">
          {selectedRowIds.length > 0 && (
            <>
              <GiftCardListBulkActions />
              <BulkDeleteButton count={selectedRowIds.length} onClick={openDeleteDialog}>
                <FormattedMessage defaultMessage="Delete gift cards" id="d68yq7" />
              </BulkDeleteButton>
            </>
          )}
        </Box>
      }
    />
  );
};

export default GiftCardListSearchAndFilters;
