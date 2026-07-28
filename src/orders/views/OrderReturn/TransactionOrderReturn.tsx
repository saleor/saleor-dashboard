import { useRefundSettingsQuery } from "@dashboard/graphql";
import { calculateCanRefundShipping } from "@dashboard/orders/components/OrderGrantRefundPage/utils";
import OrderReturnPage from "@dashboard/orders/components/OrderReturnPage";
import { TransactionSubmitCard } from "@dashboard/orders/components/OrderReturnPage/components";
import { getReturnProductsAmountValues } from "@dashboard/orders/components/OrderReturnPage/components/PaymentSubmitCard/utils";
import { type ReactElement, useState } from "react";

import { type OrderReturnViewProps } from "./orderReturnViewProps";
import { useOrderReturnSubmit } from "./useOrderReturnSubmit";
import { useRefundWithinReturn } from "./useRefundWithinReturn";

/**
 * Transactions API return.
 *
 * The return mutation refunds nothing; this view grants and sends the refund
 * through its own mutations and owns `TransactionSubmitCard`, the transaction
 * selection and the refund-reason requirement. Must not call
 * resolveOrderPaymentMode.
 */
export const TransactionOrderReturn = ({
  orderId,
  order,
  loading,
  prefilledOrderLineId,
}: OrderReturnViewProps): ReactElement => {
  const { data: refundSettingsData } = useRefundSettingsQuery();
  const refundReasonReferenceTypeId =
    refundSettingsData?.refundSettings.reasonReferenceType?.id ?? "";
  // Selecting a refund reason is required once a reason type is configured.
  // Track whether a submit was attempted while it was still missing.
  const [showRefundReasonError, setShowRefundReasonError] = useState(false);
  const { sendMutations, grantRefundErrors, sendRefundErrors, grantRefundResponseOrderData } =
    useRefundWithinReturn({
      orderId,
      transactionId: order?.transactions[0]?.id,
    });
  const { handleSubmit, returnErrors, returnedOrder, submitStatus, submitting } =
    useOrderReturnSubmit({
      orderId,
      order,
      // The refund happens in the grant/send mutations, never in the return itself.
      buildInput: parser => ({ ...parser.getParsedData(), amountToRefund: 0, refund: false }),
      afterReturn: sendMutations,
    });
  const orderData = grantRefundResponseOrderData ?? returnedOrder ?? order;

  return (
    <OrderReturnPage
      order={orderData}
      loading={loading || submitting}
      returnErrors={returnErrors}
      prefilledOrderLineId={prefilledOrderLineId}
      onSubmit={handleSubmit}
      submitCard={({ data, change, onAmountChange, isAmountDirty, isSaveDisabled, submit }) => {
        const isRefundReasonMissing =
          data.autoGrantRefund && !!refundReasonReferenceTypeId && !data.refundReasonReference;

        return (
          <TransactionSubmitCard
            transactions={orderData?.transactions ?? []}
            grantRefundErrors={grantRefundErrors}
            sendRefundErrors={sendRefundErrors}
            customRefundValue={data.amount}
            autoGrantRefund={data.autoGrantRefund}
            autoSendRefund={data.autoSendRefund}
            refundShipmentCosts={data.refundShipmentCosts}
            canRefundShipping={calculateCanRefundShipping(undefined, orderData?.grantedRefunds)}
            transactionId={data.transactionId}
            amountData={getReturnProductsAmountValues(orderData, data)}
            onChange={change}
            disabled={isSaveDisabled}
            onSubmit={() => {
              setShowRefundReasonError(isRefundReasonMissing);
              submit(isRefundReasonMissing);
            }}
            submitStatus={submitStatus}
            onAmountChange={onAmountChange}
            isAmountDirty={isAmountDirty}
            refundReason={data.refundReason}
            refundReasonReference={data.refundReasonReference}
            refundReasonReferenceTypeId={refundReasonReferenceTypeId}
            refundReasonError={showRefundReasonError}
            onClearRefundReasonError={() => setShowRefundReasonError(false)}
          />
        );
      }}
    />
  );
};
