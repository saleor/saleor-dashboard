import { Savebar } from "@dashboard/components/Savebar";
import {
  OrderTransactionRequestActionMutation,
  TransactionActionEnum,
  TransactionItemFragment,
  useOrderTransactionRequestActionMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { refundSavebarMessages } from "@dashboard/orders/components/OrderTransactionRefundPage/messages";
import { orderUrl } from "@dashboard/orders/urls";
import {
  getOrderTransactionErrorMessage,
  transactionRequestMessages,
} from "@dashboard/utils/errors/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidationSchema, ManualRefundForm } from "./manualRefundValidationSchema";

interface OrderManualTransactionRefundFormProps {
  children: ReactNode;
  disabled: boolean;
  initialValues: ManualRefundForm;
  orderId: string;
  transactions: TransactionItemFragment[];
}

export const OrderManualTransactionRefundForm = ({
  disabled,
  orderId,
  initialValues,
  transactions,
  children,
}: OrderManualTransactionRefundFormProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const methods = useForm<ManualRefundForm>({
    mode: "onBlur",
    values: initialValues,
    resolver: zodResolver(getValidationSchema(intl, transactions)),
  });

  const [manualRefund, manualRefundOpts] = useOrderTransactionRequestActionMutation({
    onCompleted: (data: OrderTransactionRequestActionMutation) => {
      if (data.transactionRequestAction?.errors?.length) {
        notify({
          status: "error",
          text: getOrderTransactionErrorMessage(data.transactionRequestAction?.errors[0], intl),
        });
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(transactionRequestMessages.success),
        });
        navigate(orderUrl(orderId));
      }
    },
  });
  const handleSubmit = (data: ManualRefundForm) => {
    manualRefund({
      variables: {
        action: TransactionActionEnum.REFUND,
        transactionId: data.transationId,
        amount: data.amount,
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form id="manual-refund-form" onSubmit={methods.handleSubmit(handleSubmit)}>
        {children}

        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={() => navigate(orderUrl(orderId))} />
          <Savebar.ConfirmButton
            transitionState={manualRefundOpts.status}
            onClick={methods.handleSubmit(handleSubmit)}
            disabled={disabled}
          >
            {intl.formatMessage(refundSavebarMessages.transferFunds)}
          </Savebar.ConfirmButton>
        </Savebar>
      </form>
    </FormProvider>
  );
};
