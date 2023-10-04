import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { GenerateMultipleVoucherCodeFormData } from "@dashboard/discounts/components/VoucherCodesGenerateDialog";
import { useVoucherCodesPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useVoucherCodesPagination";
import { generateMultipleIds } from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { useVoucherCodesQuery } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
  LocalPagination,
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import isEqual from "lodash/isEqual";
import { useCallback, useState } from "react";

export const useVoucherCodes = ({ id }: { id: string }) => {
  const {
    settings: voucherCodesSettings,
    updateListSettings: updateVoucherCodesListSettings,
  } = useListSettings(ListViews.VOUCHER_CODES);

  const [addedVoucherCodes, setAddedVoucherCodes] = useState<VoucherCode[]>([]);
  const [isServerPagination, setIsServerPagination] = useState(true);

  const handleAddVoucherCode = (code: string) => [
    setAddedVoucherCodes(codes => [...codes, { code }]),
  ];

  const handleGenerateMultipeCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    setAddedVoucherCodes(codes => [
      ...codes,
      ...generateMultipleIds(quantity, prefix),
    ]);
    setIsServerPagination(false);
  };

  const [
    serverVoucherCodesPaginationState,
    setServerVoucherCodesPaginationState,
  ] = useLocalPaginationState(voucherCodesSettings.rowNumber);

  const serverVoucherCodesPaginate = useLocalPaginator(
    setServerVoucherCodesPaginationState,
  );

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
    voucherCodesSettings.rowNumber - clientVoucherCodes.length;

  const {
    data: voucherCodesData,
    loading: voucherCodesLoading,
    refetch: voucherCodesRefetch,
  } = useVoucherCodesQuery({
    variables: {
      id,
      ...(isServerPagination && serverVoucherCodesPaginationState),
      first:
        !isServerPagination &&
        !hasClientPaginationNextPage &&
        freeSlotsInClientPagianationPage > 0
          ? freeSlotsInClientPagianationPage
          : serverVoucherCodesPaginationState.first,
    },
  });

  const serverVoucherCodesPagination = serverVoucherCodesPaginate(
    voucherCodesData?.voucher?.codes?.pageInfo,
    serverVoucherCodesPaginationState,
  );

  const hasServerPaginationNextPage =
    serverVoucherCodesPagination?.pageInfo?.hasNextPage;
  const hasServerPaginationPrevPage =
    serverVoucherCodesPagination?.pageInfo?.hasPreviousPage;

  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection();

  const serverVoucherCodes =
    mapEdgesToItems(voucherCodesData?.voucher?.codes) ?? [];

  let voucherCodes = [];

  if (isServerPagination) {
    voucherCodes = serverVoucherCodes;
  } else {
    voucherCodes = [
      ...clientVoucherCodes,
      ...(!hasClientPaginationNextPage && freeSlotsInClientPagianationPage > 0
        ? [...serverVoucherCodes]
        : []),
    ];
  }

  let voucherCodesPagination: LocalPagination;

  if (!isServerPagination) {
    voucherCodesPagination = clientVoucherCodesPagination;
  } else {
    voucherCodesPagination = serverVoucherCodesPagination;
  }

  const handleSetSelectedVoucherCodesIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!voucherCodes) {
        return;
      }

      const rowsIds = rows.map(row => voucherCodes[row].code).filter(Boolean);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds as string[]);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      voucherCodes,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return {
    voucherCodes,
    voucherCodesLoading,
    voucherCodesPagination: {
      ...voucherCodesPagination,
      pageInfo: {
        ...voucherCodesPagination.pageInfo,
        hasNextPage: isServerPagination
          ? hasServerPaginationNextPage
          : hasClientPaginationNextPage || serverVoucherCodes.length > 0,
        hasPreviousPage: !isServerPagination
          ? clientVoucherCodesPagination.pageInfo?.hasPreviousPage
          : hasClientPaginationPrevPage || addedVoucherCodes.length > 0,
      },
      loadNextPage: () => {
        if (isServerPagination) {
          voucherCodesPagination.loadNextPage();
        } else {
          if (voucherCodes.length < voucherCodesSettings.rowNumber) {
            setIsServerPagination(true);
          } else {
            clientVoucherCodesPagination.loadNextPage();
          }
        }
      },
      loadPreviousPage: () => {
        if (isServerPagination) {
          if (!hasServerPaginationPrevPage && addedVoucherCodes.length > 0) {
            setIsServerPagination(false);
          } else {
            voucherCodesPagination.loadPreviousPage();
          }
        } else {
          clientVoucherCodesPagination.loadPreviousPage();
        }
      },
    },
    voucherCodesRefetch,
    voucherCodesSettings,
    updateVoucherCodesListSettings: (key: any, value: any) => {
      updateVoucherCodesListSettings(key, value);
      onSettingsChange(key, value);
    },
    selectedVoucherCodesIds: selectedRowIds,
    handleSetSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipeCodes,
  };
};
