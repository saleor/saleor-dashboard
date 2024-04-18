import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Pill } from "@dashboard/components/Pill";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import Savebar from "@dashboard/components/Savebar";
import {
  OrderDetailsGrantRefundFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionReason } from "./components/OrderTransactionReason/OrderTransactionReason";
import {
  OrderRefundTransactionDatagridError,
  OrderTransactionRefundDatagrid,
} from "./components/OrderTransactionRefundDatagrid/OrderRefundTransactionDatagrid";
import { OrderTransactionSummary } from "./components/OrderTransactionRefundSummary/OrderTransactionSummary";
import { OrderTransactionTiles } from "./components/OrderTransactionTiles/OrderTransactionTiles";
import { orderTransactionRefundMessages as messages } from "./messages";
import {
  canRefundShipping,
  createSetMaxQty,
  getRefundFormDefaultValues,
  getRefundFormSubmitBehavior,
  getRefundStatusColor,
  getRefundStatusLabel,
  getRefundViewTitle,
  getSelectedProductsValue,
  handleLinesToRefundChange,
  useRecalculateTotalAmount,
} from "./utils";

export interface OrderTransactionRefundError {
  field: string;
  message: string;
  code: string;
  lines: Array<{
    field: string;
    message: string;
    code: string;
    lineId: string;
  }>;
}
export interface OrderTransactionRefundPageProps {
  errors: OrderTransactionRefundError[];
  order: OrderDetailsGrantRefundFragment | null | undefined;
  draftRefund?: OrderDetailsGrantRefundFragment["grantedRefunds"][0];
  disabled: boolean;
  onSaveDraft: (
    submitData: OrderTransactionRefundPageFormData,
  ) => SubmitPromise;
  onTransferFunds?: () => void;
  onSaveDraftState: ConfirmButtonTransitionState;
  onTransferFundsState?: ConfirmButtonTransitionState;
}

export interface LineToRefund {
  row: number;
  quantity: number;
  reason: string;
  isDirty?: boolean;
}

export interface OrderTransactionRefundPageFormData {
  linesToRefund: LineToRefund[];
  transactionId: string | undefined;
  amount: number | undefined;
  includeShipping: boolean;
  reason: string;
}

const OrderTransactionRefundPage: React.FC<OrderTransactionRefundPageProps> = ({
  errors,
  order,
  draftRefund,
  disabled,
  onSaveDraft,
  onTransferFunds,
  onSaveDraftState,
  onTransferFundsState,
}) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const datagridErrors: OrderRefundTransactionDatagridError[] = errors
    .filter(err => err.field === "lines" || err.field === "addLines")
    .flatMap(error => error?.lines)
    .filter(Boolean);

  const amountError = errors.find(error => error.field === "amount");

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    getValues,
    getFieldState,
    setError,
    formState: { isDirty, errors: formErrors },
  } = useForm<OrderTransactionRefundPageFormData>({
    values: getRefundFormDefaultValues({ order, draftRefund }),
  });

  const permissions = useUserPermissions();
  const canHandlePayments = hasPermissions(permissions ?? [], [
    PermissionEnum.HANDLE_PAYMENTS,
  ]);

  const handleTransferFunds = (data: OrderTransactionRefundPageFormData) => {
    if (!data.amount) {
      setError("amount", {
        type: "custom",
        message: intl.formatMessage(messages.amountError),
      });
      return;
    }

    onTransferFunds?.();
  };

  const submitBehavior = getRefundFormSubmitBehavior({
    canHandlePayments,
    isDirty,
    isEdit: !!draftRefund,
    onTransferFunds: handleTransferFunds,
    onSaveDraft,
    onSaveDraftState,
    onTransferFundsState,
    intl,
  });

  const onSubmit: SubmitHandler<OrderTransactionRefundPageFormData> = data => {
    submitBehavior.onSubmit({
      ...data,
      amount: getFieldState("amount").isDirty ? data.amount : undefined,
    });
  };

  const linesToRefund = watch("linesToRefund");
  const includeShipping = watch("includeShipping");

  const selectedProductsValue = getSelectedProductsValue({
    linesToRefund,
    order,
  });

  useRecalculateTotalAmount({
    getValues,
    includeShipping,
    order,
    linesToRefund,
    setValue,
    selectedProductsValue,
    isFormDirty: isDirty,
  });

  const onSetMaximumQty = createSetMaxQty({
    order,
    draftRefund,
    linesToRefund,
    setValue,
  });

  const onLinesToRefundChange = (data: DatagridChangeOpts) => {
    handleLinesToRefundChange({
      data,
      linesToRefund,
      setValue,
      order,
      draftRefund,
    });
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <Box as="form" display="contents" onSubmit={handleSubmit(onSubmit)}>
        <TopNav
          href={orderUrl(order?.id ?? "")}
          title={getRefundViewTitle(draftRefund, intl)}
        >
          {draftRefund && (
            <Pill
              color={getRefundStatusColor(draftRefund.status)}
              label={getRefundStatusLabel(
                draftRefund.status,
                intl,
              ).toLocaleUpperCase()}
            />
          )}
        </TopNav>
        <DetailPageLayout.Content>
          <DashboardCard>
            <DashboardCard.Content marginBottom={5}>
              <Text fontWeight="medium" as="p" marginTop={5}>
                <FormattedMessage {...messages.selectQuantitiesToRefund} />
              </Text>
            </DashboardCard.Content>
          </DashboardCard>
          <OrderTransactionRefundDatagrid
            errors={datagridErrors}
            order={order}
            draftRefund={draftRefund}
            control={control}
            onChange={onLinesToRefundChange}
            onMaxQtySet={onSetMaximumQty}
            linesToRefund={linesToRefund}
          />
          <DashboardCard marginBottom={5}>
            <DashboardCard.Content>
              <Text fontWeight="medium" as="p" marginTop={5}>
                <FormattedMessage {...messages.selectTransactionToRefund} />
              </Text>
            </DashboardCard.Content>
          </DashboardCard>
          <OrderTransactionTiles
            transactions={order?.transactions}
            control={control}
          />
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar>
          <Box
            __width="400px"
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="space-between"
          >
            <OrderTransactionSummary
              amountError={amountError || formErrors.amount}
              control={control}
              selectedProductsValue={selectedProductsValue}
              canRefundShipping={canRefundShipping(order, draftRefund)}
              shippingCost={order?.shippingPrice.gross}
              currency={order?.total.gross.currency}
            />
            <OrderTransactionReason control={control} />
          </Box>
        </DetailPageLayout.RightSidebar>
        <Savebar
          onSubmit={handleSubmit(onSubmit)}
          onCancel={() => navigate(orderUrl(order?.id ?? ""))}
          disabled={disabled}
          state={submitBehavior.submitState}
          labels={submitBehavior.submitLabels}
        />
      </Box>
    </DetailPageLayout>
  );
};

export default OrderTransactionRefundPage;
