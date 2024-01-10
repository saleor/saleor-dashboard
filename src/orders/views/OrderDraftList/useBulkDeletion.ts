import { useOrderDraftBulkCancelMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { useIntl } from "react-intl";

export const useBulkDeletion = (onComplete: () => void) => {
  const notify = useNotifier();
  const intl = useIntl();
  const [orderDraftBulkDelete, orderDraftBulkDeleteOpts] =
    useOrderDraftBulkCancelMutation({
      onCompleted: data => {
        if (data?.draftOrderBulkDelete?.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              id: "ra2O4j",
              defaultMessage: "Deleted draft orders",
            }),
          });

          onComplete();
        }
      },
    });

  const onOrderDraftBulkDelete = async (selectedRowIds: string[]) => {
    await orderDraftBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
  };

  return { onOrderDraftBulkDelete, orderDraftBulkDeleteOpts };
};
