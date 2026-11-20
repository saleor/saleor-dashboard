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
  type SearchVoucherCodesQuery,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { type VoucherInputMode } from "@dashboard/orders/components/OrderVoucherDialog/OrderVoucherDialog";
import { useVoucherCodeSearch } from "@dashboard/searches/useVoucherCodeSearch";
import { type PartialMutationProviderOutput } from "@dashboard/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { type Option, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

type SearchedVoucher = NonNullable<SearchVoucherCodesQuery["search"]>["edges"][number]["node"];

// ponytail: lists the first 20 codes per voucher; vouchers with more codes need a per-code search.
const mapVoucherCodeOptions = (vouchers: SearchedVoucher[]): Option[] =>
  vouchers.flatMap(voucher =>
    (voucher.codes?.edges ?? []).flatMap(({ node }) =>
      node.code
        ? [
            {
              value: node.code,
              label: node.code,
              disabled: !node.isActive,
              endAdornment: (
                <Text size={2} color="default2">
                  {voucher.name}
                </Text>
              ),
            },
          ]
        : [],
    ),
  );

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
  const { result, search, loadMore } = useVoucherCodeSearch({
    variables: { ...DEFAULT_INITIAL_SEARCH_DATA, channel: order.channel.slug },
    skip: !canManageDiscounts || !open,
  });
  const mode: VoucherInputMode = canManageDiscounts
    ? {
        kind: "picker",
        options: mapVoucherCodeOptions(mapEdgesToItems(result.data?.search) ?? []),
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
