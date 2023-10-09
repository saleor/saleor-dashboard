import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { GenerateMultipleVoucherCodeFormData } from "@dashboard/discounts/components/VoucherCodesGenerateDialog";
import { useVoucherCodesPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useVoucherCodesPagination";
import { generateMultipleIds } from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { UseListSettings } from "@dashboard/hooks/useListSettings";
import { ListSettings } from "@dashboard/types";
import { useState } from "react";

interface UseVoucherCodesClient {
  hasClientPaginationNextPage: boolean;
  hasClientPaginationPrevPage: boolean;
  addedVoucherCodes: VoucherCode[];
  clientVoucherCodes: VoucherCode[];
  clientVoucherCodesPagination: any;
  freeSlotsInClientPagianationPage: number;
  onSettingsChange: UseListSettings["updateListSettings"];
  handleAddVoucherCode: (code: string) => void;
  handleGenerateMultipeCodes: ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => void;
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

  const hasClientPaginationNextPage =
    clientVoucherCodesPagination?.pageInfo?.hasNextPage ?? false;
  const hasClientPaginationPrevPage =
    clientVoucherCodesPagination.pageInfo?.hasPreviousPage ?? false;

  const freeSlotsInClientPagianationPage =
    settings.rowNumber - clientVoucherCodes.length;

  const handleAddVoucherCode = (code: string) => {
    setAddedVoucherCodes(codes => [{ code, status: "Draft" }, ...codes]);
    switchToClientPagination();
    resetPage();
  };

  const handleGenerateMultipeCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    setAddedVoucherCodes(codes => [
      ...generateMultipleIds(quantity, prefix),
      ...codes,
    ]);
    switchToClientPagination();
    resetPage();
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
    handleGenerateMultipeCodes,
  };
};
