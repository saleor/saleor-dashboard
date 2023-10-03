import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { GenerateMultipleVoucherCodeFormData } from "@dashboard/discounts/components/VoucherCodesGenerateDialog";
import { useVoucherCodesPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useVoucherCodesPagination";
import { generateMultipleIds } from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { useVoucherCodesQuery } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
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
  const [serverPagination, setServerPagination] = useState(true);

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
    setServerPagination(false);
  };

  const [voucherCodesPaginationState, setVoucherCodesPaginationState] =
    useLocalPaginationState(voucherCodesSettings.rowNumber);

  const voucherCodesPaginate = useLocalPaginator(
    setVoucherCodesPaginationState,
  );

  const {
    data: voucherCodesData,
    loading: voucherCodesLoading,
    refetch: voucherCodesRefetch,
  } = useVoucherCodesQuery({
    variables: {
      id,
      ...voucherCodesPaginationState,
    },
  });

  let voucherCodesPagination = voucherCodesPaginate(
    voucherCodesData?.voucher?.codes?.pageInfo,
    voucherCodesPaginationState,
  );

  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection();

  const serverVoucherCodes =
    mapEdgesToItems(voucherCodesData?.voucher?.codes) ?? [];

  const { paginatedCodes, pagination: clientPagination } =
    useVoucherCodesPagination(addedVoucherCodes);

  let voucherCodes = [];

  if (serverPagination) {
    voucherCodes = serverVoucherCodes;
  } else {
    voucherCodes = paginatedCodes;
  }

  if (!serverPagination) {
    voucherCodesPagination = clientPagination;
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

  const finalPagination = serverPagination
    ? voucherCodesPagination
    : clientPagination;

  return {
    voucherCodes,
    voucherCodesLoading,
    voucherCodesPagination: {
      ...finalPagination,
      pageInfo: {
        ...finalPagination.pageInfo,
        hasNextPage: serverPagination
          ? voucherCodesPagination?.pageInfo?.hasNextPage
          : clientPagination?.pageInfo?.hasNextPage ||
            voucherCodesData?.voucher?.codes?.edges.length > 0,
        hasPreviousPage: !serverPagination
          ? clientPagination.pageInfo?.hasPreviousPage
          : voucherCodesPagination?.pageInfo?.hasPreviousPage ||
            addedVoucherCodes.length > 0,
      },
      loadNextPage: () => {
        if (serverPagination) {
          voucherCodesPagination.loadNextPage();
        } else {
          if (voucherCodes.length < voucherCodesSettings.rowNumber) {
            setServerPagination(true);
          } else {
            clientPagination.loadNextPage();
          }
        }
      },
      loadPreviousPage: () => {
        if (serverPagination) {
          if (
            !voucherCodesPagination?.pageInfo?.hasPreviousPage &&
            addedVoucherCodes.length > 0
          ) {
            setServerPagination(false);
          } else {
            voucherCodesPagination.loadPreviousPage();
          }
        } else {
          clientPagination.loadPreviousPage();
        }
      },
    },
    voucherCodesRefetch,
    voucherCodesSettings,
    updateVoucherCodesListSettings,
    selectedVoucherCodesIds: selectedRowIds,
    handleSetSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipeCodes,
  };
};
