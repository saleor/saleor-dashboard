import { type VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { useVoucherCodesQuery } from "@dashboard/graphql";
import useLocalPaginator, {
  type LocalPagination,
  type PaginationState,
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import { type ListSettings } from "@dashboard/types";
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
  /** Drops the cached pages of codes, so every page loads fresh after a save removed codes. */
  dropCachedCodePages: () => void;
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
    client,
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
  const dropCachedCodePages = (): void => {
    client.cache.modify({
      id: client.cache.identify({ __typename: "Voucher", id }),
      fields: {
        // The field without arguments only holds the total count shown elsewhere on the page.
        codes: (existing, { storeFieldName, DELETE }) =>
          storeFieldName === "codes" ? existing : DELETE,
      },
    });
  };

  return {
    voucherCodesLoading,
    voucherCodesRefetch,
    serverVoucherCodes,
    serverVoucherCodesPagination,
    hasServerPaginationNextPage,
    hasServerPaginationPrevPage,
    restartServerPagination,
    freeSlotsInServerPagianationPage,
    dropCachedCodePages,
  };
};
