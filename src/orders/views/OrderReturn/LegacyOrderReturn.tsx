import OrderReturnPage from "@dashboard/orders/components/OrderReturnPage";
import { PaymentSubmitCard } from "@dashboard/orders/components/OrderReturnPage/components/PaymentSubmitCard";
import { getReturnProductsAmountValues } from "@dashboard/orders/components/OrderReturnPage/components/PaymentSubmitCard/utils";
import { type ReactElement } from "react";

import { type OrderReturnViewProps } from "./orderReturnViewProps";
import { useOrderReturnSubmit } from "./useOrderReturnSubmit";

/**
 * Legacy Payments API return.
 *
 * The return mutation performs the refund itself, so this view adds the
 * parser's refund input and owns `PaymentSubmitCard`. It never instantiates
 * the grant/send refund mutations. Must not call resolveOrderPaymentMode.
 */
export const LegacyOrderReturn = ({
  orderId,
  order,
  loading,
  prefilledOrderLineId,
}: OrderReturnViewProps): ReactElement => {
  const { handleSubmit, returnErrors, returnedOrder, submitting } = useOrderReturnSubmit({
    orderId,
    order,
    buildInput: parser => ({ ...parser.getParsedData(), ...parser.getRefundInput() }),
  });
  const orderData = returnedOrder ?? order;
  const isLoading = loading || submitting;

  return (
    <OrderReturnPage
      order={orderData}
      loading={isLoading}
      returnErrors={returnErrors}
      prefilledOrderLineId={prefilledOrderLineId}
      onSubmit={handleSubmit}
      submitCard={({ data, change, isSaveDisabled, submit }) => (
        <PaymentSubmitCard
          allowNoRefund
          isReturn
          amountData={getReturnProductsAmountValues(orderData, data)}
          data={data}
          order={orderData}
          disableSubmitButton={isSaveDisabled}
          disabled={isLoading}
          errors={returnErrors ?? []}
          onChange={change}
          onRefund={() => submit()}
          loading={isLoading}
        />
      )}
    />
  );
};
