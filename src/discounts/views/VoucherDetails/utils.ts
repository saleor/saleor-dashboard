import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";

export const getVoucherCodesToDisplay = ({
  clientVoucherCodes,
  serverVoucherCodes,
  isServerPagination,
  freeSlotsInServerPagianationPage,
  hasServerPaginationPrevPage,
  hasClientPaginationNextPage,
  freeSlotsInClientPagianationPage,
}: {
  isServerPagination: boolean;
  clientVoucherCodes: VoucherCode[];
  serverVoucherCodes: VoucherCode[];
  freeSlotsInServerPagianationPage: number;
  hasServerPaginationPrevPage: boolean;
  hasClientPaginationNextPage: boolean;
  freeSlotsInClientPagianationPage: number;
}) => {
  if (isServerPagination) {
    // Fill missing slots using client voucher codes when there are no more server voucher codes
    // Happend when user is on navigating back and reach begining of server pagination
    return [
      ...(freeSlotsInServerPagianationPage > 0 && !hasServerPaginationPrevPage
        ? clientVoucherCodes
        : []),
      ...serverVoucherCodes,
    ];
  }

  // Fill missing slots in clinet navigation with server voucher codes
  return [
    ...clientVoucherCodes,
    ...(!hasClientPaginationNextPage && freeSlotsInClientPagianationPage > 0
      ? [...serverVoucherCodes]
      : []),
  ];
};
