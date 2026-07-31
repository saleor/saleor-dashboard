import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import {
  type OrderDetailsFragment,
  OrderErrorCode,
  type OrderErrorFragment,
  type OrderReturnProductsInput,
  useFulfillmentReturnProductsMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import { type OrderReturnFormData } from "@dashboard/orders/components/OrderReturnPage/form";
import { orderUrl } from "@dashboard/orders/urls";
import { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import ReturnFormDataParser, { getSuccessMessage } from "./utils";

interface UseOrderReturnSubmitOpts {
  orderId: string;
  order: OrderDetailsFragment | undefined | null;
  /** The concrete view decides what the return mutation itself refunds. */
  buildInput: (parser: ReturnFormDataParser) => OrderReturnProductsInput;
  /** Mutations that run after a successful return — the transactions view grants/sends a refund. */
  afterReturn?: (formData: OrderReturnFormData) => Promise<{
    grantRefundErrors: Array<{ code: string }>;
    sendRefundErrors: Array<{ code: string }>;
  }>;
}

interface UseOrderReturnSubmitResult {
  handleSubmit: (formData: OrderReturnFormData) => Promise<void>;
  returnErrors: OrderErrorFragment[] | undefined;
  returnedOrder: OrderDetailsFragment | undefined | null;
  submitStatus: ConfirmButtonTransitionState;
  submitting: boolean;
}

/**
 * Creates the return and reports its outcome. Payment-neutral: what gets
 * refunded, and how, is entirely in `buildInput` and `afterReturn`.
 */
export const useOrderReturnSubmit = ({
  orderId,
  order,
  buildInput,
  afterReturn,
}: UseOrderReturnSubmitOpts): UseOrderReturnSubmitResult => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [replacedOrder, setReplacedOrder] = useState<string | null>(null);
  const [returnCreate, returnCreateOpts] = useFulfillmentReturnProductsMutation({
    onCompleted: data => {
      if (!data.orderFulfillmentReturnProducts?.errors.length) {
        const replaceOrder = data.orderFulfillmentReturnProducts?.replaceOrder;

        if (replaceOrder?.id) {
          setReplacedOrder(replaceOrder.id);
        }
      }
    },
  });

  const handleSubmit = async (formData: OrderReturnFormData) => {
    if (!order) {
      return;
    }

    const returnErrors = await extractMutationErrors(
      returnCreate({
        variables: {
          id: order.id,
          input: buildInput(new ReturnFormDataParser({ order, formData })),
        },
      }),
    );

    if (returnErrors.length) {
      return;
    }

    const { grantRefundErrors, sendRefundErrors } = afterReturn
      ? await afterReturn(formData)
      : { grantRefundErrors: [], sendRefundErrors: [] };
    const errors = [...grantRefundErrors, ...sendRefundErrors];

    if (errors.some(err => err.code === OrderErrorCode.CANNOT_REFUND)) {
      notify({
        autohide: 5000,
        status: "error",
        text: intl.formatMessage(messages.cannotRefundDescription),
        title: intl.formatMessage(messages.cannotRefundTitle),
      });
    }

    if (!errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(
          getSuccessMessage(formData.autoGrantRefund, formData.autoSendRefund),
        ),
      });
      navigate(orderUrl(replacedOrder ?? orderId));
    }
  };

  return {
    handleSubmit,
    returnErrors: returnCreateOpts.data?.orderFulfillmentReturnProducts?.errors,
    returnedOrder: returnCreateOpts.data?.orderFulfillmentReturnProducts?.order,
    submitStatus: returnCreateOpts.status,
    submitting: returnCreateOpts.loading,
  };
};
