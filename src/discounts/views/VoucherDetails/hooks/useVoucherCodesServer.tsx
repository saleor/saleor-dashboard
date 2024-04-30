import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { useVoucherCodesQuery } from "@dashboard/graphql";
import useLocalPaginator, {
  LocalPagination,
  PaginationState,
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import { ListSettings } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

interface UseVoucherCodesServerProps {
  settings: ListSettings;
  id: string;
  skipFetch?: boolean;
  isServerPagination?: boolean;
  paginationState?: PaginationState;
}

interface VoucherCodesServer {
  voucherCodesLoading: boolean;
  voucherCodesRefetch: () => void;
  serverVoucherCodesPagination: LocalPagination;
  hasServerPaginationNextPage: boolean;
  hasServerPaginationPrevPage: boolean;
  freeSlotsInServerPagianationPage: number;
  serverVoucherCodes: VoucherCode[];
  restartServerPagination: () => void;
}

export const useVoucherCodesServer = ({
  settings,
  id,
  skipFetch,
  isServerPagination,
  paginationState = {},
}: UseVoucherCodesServerProps): VoucherCodesServer => {
  const [serverVoucherCodesPaginationState, setServerVoucherCodesPaginationState] =
    useLocalPaginationState(settings.rowNumber);
  const serverVoucherCodesPaginate = useLocalPaginator(setServerVoucherCodesPaginationState);
  const restartServerPagination = () => {
    setServerVoucherCodesPaginationState({});
  };
  const {
    data: voucherCodesData,
    loading: voucherCodesLoading,
    refetch: voucherCodesRefetch,
  } = useVoucherCodesQuery({
    skip: skipFetch,
    variables: {
      id,
      ...(!isServerPagination ? paginationState : serverVoucherCodesPaginationState),
    },
  });
  const serverVoucherCodesPagination = serverVoucherCodesPaginate(
    voucherCodesData?.voucher?.codes?.pageInfo,
    serverVoucherCodesPaginationState,
  );
  const hasServerPaginationNextPage = serverVoucherCodesPagination?.pageInfo?.hasNextPage ?? false;
  const hasServerPaginationPrevPage =
    serverVoucherCodesPagination?.pageInfo?.hasPreviousPage ?? false;
  const serverVoucherCodes = (mapEdgesToItems(voucherCodesData?.voucher?.codes) ??
    []) as VoucherCode[];
  const freeSlotsInServerPagianationPage = settings.rowNumber - serverVoucherCodes.length;

  return {
    voucherCodesLoading,
    voucherCodesRefetch,
    serverVoucherCodes,
    serverVoucherCodesPagination,
    hasServerPaginationNextPage,
    hasServerPaginationPrevPage,
    restartServerPagination,
    freeSlotsInServerPagianationPage,
  };
};
