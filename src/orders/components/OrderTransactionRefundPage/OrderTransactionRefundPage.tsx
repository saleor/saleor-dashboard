import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Pill } from "@dashboard/components/Pill";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import Savebar from "@dashboard/components/Savebar";
import { OrderDetailsGrantRefundFragment, PermissionEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionReason } from "./components/OrderTransactionReason/OrderTransactionReason";
import { OrderTransactionReasonModal } from "./components/OrderTransactionReasonModal/OrderTransactionReasonModal";
import { OrderTransactionSummary } from "./components/OrderTransactionRefundSummary/OrderTransactionSummary";
import {
  OrderRefundTransactionDatagridError,
  OrderTransactionRefundTable,
} from "./components/OrderTransactionRefundTable/OrderTransactionRefundTable";
import { OrderTransactionTiles } from "./components/OrderTransactionTiles/OrderTransactionTiles";
import { getRefundFormDefaultValues } from "./formDefaults";
import { orderTransactionRefundMessages as messages } from "./messages";
import {
  canRefundShipping,
  getRefundFormSubmitBehavior,
  getRefundStatusColor,
  getRefundStatusLabel,
  getRefundViewTitle,
  getSelectedProductsValue,
  handleLinesToRefundChange,
  handleReasonChange,
  RefundQuantityChange,
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
  onSaveDraft: (submitData: OrderTransactionRefundPageFormData) => SubmitPromise;
  onTransferFunds?: () => void;
  onSaveDraftState: ConfirmButtonTransitionState;
  onTransferFundsState?: ConfirmButtonTransitionState;
}

export interface LineToRefund {
  quantity: number | string;
  reason: string;
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

  const [refundIndex, setRefundIndex] = React.useState<number | null>(null);

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

  const { fields: refundFields, update: refundFieldsUpdate } = useFieldArray({
    name: "linesToRefund",
    control,
  });

  const permissions = useUserPermissions();
  const canHandlePayments = hasPermissions(permissions ?? [], [PermissionEnum.HANDLE_PAYMENTS]);

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

  const handleSaveDraft = (data: OrderTransactionRefundPageFormData) => {
    onSaveDraft({
      ...data,
      amount: getFieldState("amount").isDirty ? data.amount : undefined,
    });
  };

  const submitBehavior = getRefundFormSubmitBehavior({
    canHandlePayments,
    isDirty,
    isEdit: !!draftRefund,
    onTransferFunds: handleTransferFunds,
    onSaveDraft: handleSaveDraft,
    onSaveDraftState,
    onTransferFundsState,
    intl,
  });

  const onSubmit: SubmitHandler<OrderTransactionRefundPageFormData> = data => {
    submitBehavior.onSubmit(data);
  };

  const linesToRefund = watch("linesToRefund");
  const includeShipping = watch("includeShipping");

  const selectedProductsValue =
    getSelectedProductsValue({
      linesToRefund,
      order,
    }) ?? 0;

  useRecalculateTotalAmount({
    getValues,
    includeShipping,
    order,
    linesToRefund,
    setValue,
    selectedProductsValue,
    isFormDirty: isDirty,
  });

  // const onSetMaximumQty = createSetMaxQty({
  //   order,
  //   draftRefund,
  //   linesToRefund,
  //   setValue,
  // });

  const onLinesToRefundChange = (data: RefundQuantityChange, index: number, validate: boolean) => {
    handleLinesToRefundChange({
      data,
      index,
      validate,
      linesToRefund,
      setValue,
      order,
      draftRefund,
    });
  };

  const onReasonChange = (reason: string, index: number) => {
    handleReasonChange({
      reason,
      index,
      linesToRefund,
      refundFieldsUpdate,
    });
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <Box as="form" display="contents" onSubmit={handleSubmit(onSubmit)}>
        <TopNav href={orderUrl(order?.id ?? "")} title={getRefundViewTitle(draftRefund, intl)}>
          {draftRefund && (
            <Pill
              color={getRefundStatusColor(draftRefund.status)}
              label={getRefundStatusLabel(draftRefund.status, intl).toLocaleUpperCase()}
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
          <DashboardCard paddingX={6}>
            <OrderTransactionRefundTable
              errors={datagridErrors}
              order={order}
              draftRefund={draftRefund}
              control={control}
              onChange={onLinesToRefundChange}
              onEditReasonModal={setRefundIndex}
              linesToRefund={linesToRefund}
              refundFields={refundFields}
              refundFieldsUpdate={refundFieldsUpdate}
            />
          </DashboardCard>
          <DashboardCard marginBottom={5}>
            <DashboardCard.Content>
              <Text fontWeight="medium" as="p" marginTop={5}>
                <FormattedMessage {...messages.selectTransactionToRefund} />
              </Text>
            </DashboardCard.Content>
          </DashboardCard>
          <OrderTransactionTiles transactions={order?.transactions} control={control} />
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
        <OrderTransactionReasonModal
          open={refundIndex !== null}
          reason={linesToRefund[refundIndex!]?.reason}
          onClose={() => setRefundIndex(null)}
          onConfirm={(reason: string) => {
            onReasonChange(reason, refundIndex!);
          }}
        />
      </Box>
    </DetailPageLayout>
  );
};

export default OrderTransactionRefundPage;
