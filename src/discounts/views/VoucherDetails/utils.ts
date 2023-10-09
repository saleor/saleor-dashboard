import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";

export const getVoucherCodesToDisplay = ({
  clientVoucherCodes,
  serverVoucherCodes,
  isServerPagination,
  freeSlotsInServerPagianationPage,
  hasServerPaginationPrevPage,
  addedVoucherCodes,
  hasClientPaginationNextPage,
  freeSlotsInClientPagianationPage,
}: {
  isServerPagination: boolean;
  clientVoucherCodes: VoucherCode[];
  serverVoucherCodes: VoucherCode[];
  freeSlotsInServerPagianationPage: number;
  hasServerPaginationPrevPage: boolean;
  addedVoucherCodes: VoucherCode[];
  hasClientPaginationNextPage: boolean;
  freeSlotsInClientPagianationPage: number;
}) => {
  if (isServerPagination) {
    return [
      ...(freeSlotsInServerPagianationPage > 0 && !hasServerPaginationPrevPage
        ? addedVoucherCodes.slice(-freeSlotsInServerPagianationPage)
        : []),
      ...serverVoucherCodes,
    ];
  }

  return [
    ...clientVoucherCodes,
    ...(!hasClientPaginationNextPage && freeSlotsInClientPagianationPage > 0
      ? [...serverVoucherCodes]
      : []),
  ];
};
