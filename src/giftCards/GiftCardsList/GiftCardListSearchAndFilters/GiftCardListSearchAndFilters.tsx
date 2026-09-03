import { ListFilters } from "@dashboard/components/AppLayout/ListFilters/ListFilters";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton/BulkDeleteButton";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardListBulkActions } from "../GiftCardListBulkActions/GiftCardListBulkActions";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider/GiftCardListProvider";
import { giftCardListSearchAndFiltersMessages as messages } from "./messages";

const GiftCardListSearchAndFilters = (): React.ReactNode => {
  const intl = useIntl();

  const { params, handleSearchChange, selectedRowIds } = useGiftCardList();
  const { openDeleteDialog } = useGiftCardListDialogs();

  return (
    <ListFilters
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
