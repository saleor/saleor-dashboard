import useListSettings from "@dashboard/hooks/useListSettings";
import { ListSettings, ListViews } from "@dashboard/types";

import { useVoucherCodesClient } from "./useVoucherCodesClient";
import { useVoucherCodesRowSelection } from "./useVoucherCodesRowSelection";

export const useVoucherCodes = () => {
  const {
    settings: voucherCodesSettings,
    updateListSettings: updateVoucherCodesListSettings,
  } = useListSettings(ListViews.VOUCHER_CODES);

  const {
    addedVoucherCodes,
    clientVoucherCodes,
    clientVoucherCodesPagination,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteAddedVoucherCodes,
    onSettingsChange,
  } = useVoucherCodesClient(voucherCodesSettings, () => {
    clearRowSelection();
  });

  const {
    selectedVoucherCodesIds,
    handleSetSelectedVoucherCodesIds,
    clearRowSelection,
  } = useVoucherCodesRowSelection(clientVoucherCodes);

  const handleDeleteVoucherCodes = () => {
    clearRowSelection();
    handleDeleteAddedVoucherCodes(selectedVoucherCodesIds);
  };

  const handleUpdateVoucherCodesListSettings = (
    key: keyof ListSettings<ListViews.VOUCHER_CODES>,
    value: number | string[],
  ) => {
    updateVoucherCodesListSettings(key, value);
    onSettingsChange(key, value);
  };

  return {
    voucherCodes: clientVoucherCodes,
    addedVoucherCodes,
    voucherCodesLoading: false,
    voucherCodesPagination: clientVoucherCodesPagination,
    voucherCodesSettings,
    updateVoucherCodesListSettings: handleUpdateVoucherCodesListSettings,
    selectedVoucherCodesIds,
    handleSetSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteVoucherCodes,
  };
};
