import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type OrderDetailsFragment,
  type OrderDraftUpdateMutation,
  type OrderDraftUpdateMutationVariables,
  type OrderErrorFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { type VoucherInputMode } from "@dashboard/orders/components/OrderVoucherDialog/OrderVoucherDialog";
import { useVoucherSearch } from "@dashboard/searches/useVoucherSearch";
import { type PartialMutationProviderOutput } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";

interface UseDraftOrderVoucherArgs {
  order: Pick<OrderDetailsFragment, "id" | "channel">;
  open: boolean;
  orderDraftUpdate: PartialMutationProviderOutput<
    OrderDraftUpdateMutation,
    OrderDraftUpdateMutationVariables
  >;
}

interface DraftOrderVoucher {
  mode: VoucherInputMode;
  errors: OrderErrorFragment[];
  submit: (voucherCode: string) => Promise<boolean>;
  remove: () => Promise<void>;
}

export const useDraftOrderVoucher = ({
  order,
  open,
  orderDraftUpdate,
}: UseDraftOrderVoucherArgs): DraftOrderVoucher => {
  const intl = useIntl();
  const notify = useNotifier();
  const { trackEvent } = useAnalytics();
  // The `vouchers` query requires MANAGE_DISCOUNTS; without it staff type the code.
  const canManageDiscounts = hasPermissions(useUserPermissions() ?? [], [
    PermissionEnum.MANAGE_DISCOUNTS,
  ]);
  const { result, search, loadMore } = useVoucherSearch({
    variables: { ...DEFAULT_INITIAL_SEARCH_DATA, channel: order.channel.slug },
    skip: !canManageDiscounts || !open,
  });
  const mode: VoucherInputMode = canManageDiscounts
    ? {
        kind: "picker",
        vouchers: mapEdgesToItems(result.data?.search) ?? [],
        onSearch: search,
        fetchMore: {
          loading: result.loading,
          hasMore: !!result.data?.search?.pageInfo.hasNextPage,
          onFetchMore: loadMore,
        },
      }
    : { kind: "manual" };

  const submit = async (voucherCode: string): Promise<boolean> => {
    const response = await orderDraftUpdate.mutate({ id: order.id, input: { voucherCode } });
    const succeeded = !!response?.data && !response.data.draftOrderUpdate?.errors?.length;

    trackEvent("draft_order_voucher_changed", {
      action: "apply",
      mode: mode.kind,
      result: succeeded ? "success" : "error",
    });

    return succeeded;
  };

  // Saleor's clean_voucher_code clears both the code and the voucher on null.
  const remove = async (): Promise<void> => {
    const response = await orderDraftUpdate.mutate({ id: order.id, input: { voucherCode: null } });
    const errors = response?.data?.draftOrderUpdate?.errors ?? [];

    trackEvent("draft_order_voucher_changed", {
      action: "remove",
      result: errors.length ? "error" : "success",
    });
    errors.forEach(error => notify({ status: "error", text: getOrderErrorMessage(error, intl) }));
  };

  // `draftOrderUpdate` is shared with other draft dialogs; only show its errors while this one is open.
  const errors = open ? (orderDraftUpdate.opts.data?.draftOrderUpdate?.errors ?? []) : [];

  return { mode, errors, submit, remove };
};
