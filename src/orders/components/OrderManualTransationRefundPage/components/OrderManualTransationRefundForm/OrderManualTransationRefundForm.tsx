import Savebar from "@dashboard/components/Savebar";
import {
  OrderTransactionRequestActionMutation,
  TransactionActionEnum,
  useOrderTransactionRequestActionMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { orderUrl } from "@dashboard/orders/urls";
import {
  getOrderTransactionErrorMessage,
  transactionRequestMessages,
} from "@dashboard/utils/errors/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { getValidationSchema, ManualRefundForm } from "./manualRefundValidationSchema";

interface OrderManualTransationRefundFormProps {
  children: ReactNode;
  disabled: boolean;
  initialValues: ManualRefundForm;
  orderId: string;
}

export const OrderManualTransationRefundForm = ({
  disabled,
  orderId,
  initialValues,
  children,
}: OrderManualTransationRefundFormProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const methods = useForm<ManualRefundForm>({
    mode: "onBlur",
    values: initialValues,
    resolver: zodResolver(getValidationSchema(intl)),
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

        <Savebar
          disabled={disabled}
          onCancel={() => navigate(orderUrl(orderId))}
          onSubmit={methods.handleSubmit(handleSubmit)}
          state={manualRefundOpts.status}
        />
      </form>
    </FormProvider>
  );
};
