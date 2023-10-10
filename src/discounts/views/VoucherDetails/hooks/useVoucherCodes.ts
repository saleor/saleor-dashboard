import useListSettings from "@dashboard/hooks/useListSettings";
import { ListViews } from "@dashboard/types";

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
    handleGenerateMultipeCodes,
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

  return {
    voucherCodes: clientVoucherCodes,
    addedVoucherCodes,
    voucherCodesLoading: false,
    voucherCodesPagination: clientVoucherCodesPagination,
    voucherCodesSettings,
    updateVoucherCodesListSettings: (key: any, value: any) => {
      updateVoucherCodesListSettings(key, value);
      onSettingsChange(key, value);
    },
    selectedVoucherCodesIds,
    handleSetSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipeCodes,
    handleDeleteVoucherCodes,
  };
};
