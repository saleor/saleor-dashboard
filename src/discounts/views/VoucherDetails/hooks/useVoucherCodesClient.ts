import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { GenerateMultipleVoucherCodeFormData } from "@dashboard/discounts/components/VoucherCodesGenerateDialog";
import { useVoucherCodesPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useVoucherCodesPagination";
import {
  generateMultipleIds,
  voucherCodeExists,
} from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { UseListSettings } from "@dashboard/hooks/useListSettings";
import { LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { ListSettings } from "@dashboard/types";
import { useState } from "react";

interface UseVoucherCodesClient {
  hasClientPaginationNextPage: boolean;
  hasClientPaginationPrevPage: boolean;
  addedVoucherCodes: VoucherCode[];
  clientVoucherCodes: VoucherCode[];
  clientVoucherCodesPagination: LocalPagination;
  freeSlotsInClientPagianationPage: number;
  onSettingsChange: UseListSettings["updateListSettings"];
  handleDeleteAddedVoucherCodes: (idsToDelete: string[]) => void;
  handleAddVoucherCode: (code: string) => void;
  handleClearAddedVoucherCodes: () => void;
  handleGenerateMultipleCodes: ({ quantity, prefix }: GenerateMultipleVoucherCodeFormData) => void;
}

export const useVoucherCodesClient = (
  settings: ListSettings,
  switchToClientPagination: () => void,
): UseVoucherCodesClient => {
  const [addedVoucherCodes, setAddedVoucherCodes] = useState<VoucherCode[]>([]);
  const {
    paginatedCodes: clientVoucherCodes,
    pagination: clientVoucherCodesPagination,
    onSettingsChange,
    resetPage,
  } = useVoucherCodesPagination(addedVoucherCodes);
  const hasClientPaginationNextPage = clientVoucherCodesPagination?.pageInfo?.hasNextPage ?? false;
  const hasClientPaginationPrevPage =
    clientVoucherCodesPagination.pageInfo?.hasPreviousPage ?? false;
  const freeSlotsInClientPagianationPage = settings.rowNumber - clientVoucherCodes.length;
  const handleAddVoucherCode = (code: string) => {
    if (voucherCodeExists(code, addedVoucherCodes)) {
      throw new Error("Code already exists");
    }

    setAddedVoucherCodes(codes => [{ code, status: "Draft" }, ...codes]);
    switchToClientPagination();
    resetPage();
  };
  const handleGenerateMultipleCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    setAddedVoucherCodes(codes => [...generateMultipleIds(quantity, prefix), ...codes]);
    switchToClientPagination();
    resetPage();
  };
  const handleDeleteAddedVoucherCodes = (idsToDelete: string[]) => {
    setAddedVoucherCodes(codes => codes.filter(({ code }) => !idsToDelete.includes(code)));
  };
  const handleClearAddedVoucherCodes = () => {
    setAddedVoucherCodes([]);
  };

  return {
    addedVoucherCodes,
    clientVoucherCodes,
    clientVoucherCodesPagination,
    onSettingsChange,
    hasClientPaginationNextPage,
    hasClientPaginationPrevPage,
    freeSlotsInClientPagianationPage,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteAddedVoucherCodes,
    handleClearAddedVoucherCodes,
  };
};
