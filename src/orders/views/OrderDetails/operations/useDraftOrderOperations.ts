import {
  useOrderDraftCancelMutation,
  useOrderDraftFinalizeMutation,
  useOrderDraftUpdateMutation,
  useOrderLineDeleteMutation,
  useOrderLinesAddMutation,
  useOrderLineUpdateMutation,
  useOrderNoteAddMutation,
  useOrderNoteUpdateMutation,
  useOrderShippingMethodUpdateMutation,
} from "@dashboard/graphql";

import { getMutationProviderData } from "../../../../misc";
import { type OrderOperationHandlers } from "./handlers";

/**
 * Draft-order mutations. Instantiated only by OrderDraftDetails, so draft never
 * creates payment, transaction, fulfillment, invoice, or cancel hooks it cannot
 * use. Notes and line/shipping edits are shared with the editable order flow.
 */
export const useDraftOrderOperations = (handlers: OrderOperationHandlers) => {
  const addNote = useOrderNoteAddMutation({ onCompleted: handlers.onNoteAdd });
  const updateNote = useOrderNoteUpdateMutation({ onCompleted: handlers.onNoteUpdate });
  const updateDraft = useOrderDraftUpdateMutation({
    onCompleted: handlers.onDraftUpdate,
    // Same as orderUpdate — address validation errors belong on the form fields.
    disableErrorHandling: true,
  });
  const finalizeDraft = useOrderDraftFinalizeMutation({ onCompleted: handlers.onDraftFinalize });
  const cancelDraft = useOrderDraftCancelMutation({ onCompleted: handlers.onDraftCancel });
  const deleteOrderLine = useOrderLineDeleteMutation({ onCompleted: handlers.onOrderLineDelete });
  const addOrderLine = useOrderLinesAddMutation({ onCompleted: handlers.onOrderLinesAdd });
  const updateOrderLine = useOrderLineUpdateMutation({ onCompleted: handlers.onOrderLineUpdate });
  const updateShippingMethod = useOrderShippingMethodUpdateMutation({
    onCompleted: handlers.onShippingMethodUpdate,
  });

  return {
    orderAddNote: getMutationProviderData(...addNote),
    orderUpdateNote: getMutationProviderData(...updateNote),
    orderDraftUpdate: getMutationProviderData(...updateDraft),
    orderDraftFinalize: getMutationProviderData(...finalizeDraft),
    orderDraftCancel: getMutationProviderData(...cancelDraft),
    orderLineDelete: getMutationProviderData(...deleteOrderLine),
    orderLinesAdd: getMutationProviderData(...addOrderLine),
    orderLineUpdate: getMutationProviderData(...updateOrderLine),
    orderShippingMethodUpdate: getMutationProviderData(...updateShippingMethod),
  };
};
