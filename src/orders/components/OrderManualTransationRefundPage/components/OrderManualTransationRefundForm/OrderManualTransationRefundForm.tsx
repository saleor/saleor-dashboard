import Savebar from "@dashboard/components/Savebar";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  getValidationSchema,
  ManualRefundForm,
} from "./manualRefundValidationSchema";

interface OrderManualTransationRefundFormProps {
  children: ReactNode;
  loading: boolean;
  initialValues: ManualRefundForm;
  orderId: string;
  onSubmit: (transationId: string, amount: number) => void;
}

export const OrderManualTransationRefundForm = ({
  onSubmit,
  orderId,
  initialValues,
  loading,
  children,
}: OrderManualTransationRefundFormProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const methods = useForm<ManualRefundForm>({
    mode: "onBlur",
    values: initialValues,
    resolver: zodResolver(getValidationSchema(intl)),
  });

  const handleSubmit = (data: ManualRefundForm) => {
    onSubmit(data.transationId, data.amount);
  };

  return (
    <FormProvider {...methods}>
      <form
        id="manual-refund-form"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        {children}

        <Savebar
          disabled={false}
          onCancel={() => navigate(orderUrl(orderId))}
          onSubmit={methods.handleSubmit(handleSubmit)}
          state={loading ? "loading" : "default"}
        />
      </form>
    </FormProvider>
  );
};
