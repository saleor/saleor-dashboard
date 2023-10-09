import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { GenerateMultipleVoucherCodeFormData } from "@dashboard/discounts/components/VoucherCodesGenerateDialog";
import { useVoucherCodesPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useVoucherCodesPagination";
import { generateMultipleIds } from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { ListSettings } from "@dashboard/types";
import { useState } from "react";

export const useVoucherCodesClient = (
  settings: ListSettings,
  resetPagination: () => void,
) => {
  const [addedVoucherCodes, setAddedVoucherCodes] = useState<VoucherCode[]>([]);

  const {
    paginatedCodes: clientVoucherCodes,
    pagination: clientVoucherCodesPagination,
    onSettingsChange,
  } = useVoucherCodesPagination(addedVoucherCodes);

  const hasClientPaginationNextPage =
    clientVoucherCodesPagination?.pageInfo?.hasNextPage;
  const hasClientPaginationPrevPage =
    clientVoucherCodesPagination.pageInfo?.hasPreviousPage;

  const freeSlotsInClientPagianationPage =
    settings.rowNumber - clientVoucherCodes.length;

  const handleAddVoucherCode = (code: string) => [
    setAddedVoucherCodes(codes => [...codes, { code, status: "Draft" }]),
  ];

  const handleGenerateMultipeCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    setAddedVoucherCodes(codes => [
      ...codes,
      ...generateMultipleIds(quantity, prefix),
    ]);
    resetPagination();
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
