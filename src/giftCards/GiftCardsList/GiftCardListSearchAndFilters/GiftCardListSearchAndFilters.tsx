// @ts-strict-ignore
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardListBulkActions } from "../GiftCardListBulkActions";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import { GiftCardListActionParamsEnum } from "../types";
import { giftCardListSearchAndFiltersMessages as messages } from "./messages";

const GiftCardListSearchAndFilters = () => {
  const intl = useIntl();

  const {
    params,
    handleSearchChange,
    onPresetSave,
    onPresetDelete,
    getPresetNameToDelete,
    selectedRowIds,
  } = useGiftCardList();
  const { onClose, openDeleteDialog } = useGiftCardListDialogs();

  return (
    <>
      <ListFilters
        type="expression-filter"
        initialSearch={params?.query || ""}
        onSearchChange={handleSearchChange}
        searchPlaceholder={intl.formatMessage(messages.searchPlaceholder, {
          exampleGiftCardCode: "21F1-39DY-V4U2",
        })}
        actions={
          <Box display="flex" gap={4}>
            {selectedRowIds.length > 0 && (
              <>
                <GiftCardListBulkActions />
                <BulkDeleteButton onClick={openDeleteDialog}>
                  <FormattedMessage defaultMessage="Delete gift cards" id="d68yq7" />
                </BulkDeleteButton>
              </>
            )}
          </Box>
        }
      />

      <SaveFilterTabDialog
        open={params.action === GiftCardListActionParamsEnum.SAVE_SEARCH}
        confirmButtonState="default"
        onClose={onClose}
        onSubmit={onPresetSave}
      />

      <DeleteFilterTabDialog
        open={params.action === GiftCardListActionParamsEnum.DELETE_SEARCH}
        confirmButtonState="default"
        onClose={onClose}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </>
  );
};

export default GiftCardListSearchAndFilters;
