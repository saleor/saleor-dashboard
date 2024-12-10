// @ts-strict-ignore
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { useGiftCardCurrenciesQuery } from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import useGiftCardTagsSearch from "@dashboard/searches/useGiftCardTagsSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import compact from "lodash/compact";
import { FormattedMessage, useIntl } from "react-intl";

import { createFilterStructure, getFilterOpts } from "../filters";
import { GiftCardListBulkActions } from "../GiftCardListBulkActions";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import { GiftCardListActionParamsEnum } from "../types";
import {
  giftCardListFilterErrorMessages as errorMessages,
  giftCardListSearchAndFiltersMessages as messages,
} from "./messages";

const GiftCardListSearchAndFilters = () => {
  const intl = useIntl();
  const [selectedChannel] = useLocalStorage("channel", "");
  const { availableChannels } = useAppChannel(false);
  const selectedChannelData = availableChannels.find(channel => channel.slug === selectedChannel);
  const {
    params,
    changeFilters,
    handleSearchChange,
    onPresetSave,
    onPresetDelete,
    getPresetNameToDelete,
    selectedRowIds,
  } = useGiftCardList();
  const { onClose, openDeleteDialog } = useGiftCardListDialogs();
  const defaultSearchVariables = {
    variables: { ...DEFAULT_INITIAL_SEARCH_DATA, first: 5 },
  };
  const {
    loadMore: fetchMoreCustomers,
    search: searchCustomers,
    result: searchCustomersResult,
  } = useCustomerSearch(defaultSearchVariables);
  const {
    loadMore: fetchMoreProducts,
    search: searchProducts,
    result: searchProductsResult,
  } = useProductSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
      channel: selectedChannel,
    },
  });
  const {
    loadMore: fetchMoreGiftCardTags,
    search: searchGiftCardTags,
    result: searchGiftCardTagsResult,
  } = useGiftCardTagsSearch(defaultSearchVariables);
  const { data: giftCardCurrenciesData, loading: loadingGiftCardCurrencies } =
    useGiftCardCurrenciesQuery();
  const filterOpts = getFilterOpts({
    params,
    productSearchProps: {
      ...getSearchFetchMoreProps(searchProductsResult, fetchMoreProducts),
      onSearchChange: searchProducts,
    },
    products: mapEdgesToItems(searchProductsResult?.data?.search),
    currencies: giftCardCurrenciesData?.giftCardCurrencies,
    loadingCurrencies: loadingGiftCardCurrencies,
    customerSearchProps: {
      ...getSearchFetchMoreProps(searchCustomersResult, fetchMoreCustomers),
      onSearchChange: searchCustomers,
    },
    customers: mapEdgesToItems(searchCustomersResult?.data?.search),
    tagSearchProps: {
      ...getSearchFetchMoreProps(searchGiftCardTagsResult, fetchMoreGiftCardTags),
      onSearchChange: searchGiftCardTags,
    },
    tags: compact(mapEdgesToItems(searchGiftCardTagsResult?.data?.search)?.map(({ name }) => name)),
  });
  const filterStructure = createFilterStructure(intl, filterOpts);

  return (
    <>
      <ListFilters
        errorMessages={{
          initialBalanceAmount: errorMessages.balanceAmount,
          initialBalanceCurrency: errorMessages.balanceCurrency,
          currentBalanceAmount: errorMessages.balanceAmount,
          currentBalanceCurrency: errorMessages.balanceCurrency,
        }}
        currencySymbol={selectedChannelData?.currencyCode || ""}
        initialSearch={params?.query || ""}
        onFilterChange={changeFilters}
        onSearchChange={handleSearchChange}
        filterStructure={filterStructure}
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
