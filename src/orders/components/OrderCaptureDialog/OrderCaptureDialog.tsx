import BackButton from "@dashboard/components/BackButton";
import { Callout } from "@dashboard/components/Callout/Callout";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import Money from "@dashboard/components/Money";
import { Pill } from "@dashboard/components/Pill";
import {
  getCurrencyDecimalPoints,
  limitDecimalPlaces,
  parseDecimalValue,
} from "@dashboard/components/PriceField/utils";
import { OrderErrorFragment, TransactionRequestActionErrorFragment } from "@dashboard/graphql";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { getOrderTransactionErrorMessage } from "@dashboard/utils/errors/transaction";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Input, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, Box as BoxIcon, CheckCircle2, CircleAlert, CreditCard } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { AuthorizationStatus, useCaptureState } from "./useCaptureState";

type CaptureError = OrderErrorFragment | TransactionRequestActionErrorFragment;

const isTransactionError = (
  error: CaptureError,
): error is TransactionRequestActionErrorFragment => {
  // TransactionRequestActionErrorFragment has a different __typename
  return error.__typename === "TransactionRequestActionError";
};

export type CaptureAmountOption = "orderTotal" | "custom";

export interface OrderCaptureDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  orderTotal: IMoney;
  authorizedAmount: IMoney;
  /** Amount already charged/captured - used for display */
  chargedAmount?: IMoney;
  /**
   * Order's total balance (for multi-transaction orders).
   * Negative = customer owes money, Positive = overpaid.
   * When provided, used instead of (orderTotal - chargedAmount) for remaining calculation.
   */
  orderBalance?: IMoney;
  /** Server errors from the capture mutation (supports both Legacy and Transactions API errors) */
  errors?: CaptureError[];
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

export const OrderCaptureDialog = ({
  confirmButtonState,
  orderTotal,
  authorizedAmount,
  chargedAmount,
  orderBalance,
  errors = [],
  onClose,
  onSubmit,
}: OrderCaptureDialogProps): JSX.Element => {
  const intl = useIntl();

  const currency = orderTotal.currency;

  // Use custom hook for capture state calculations
  const captureState = useCaptureState({
    orderTotal,
    authorizedAmount,
    chargedAmount,
    orderBalance,
  });

  const {
    availableToCapture,
    alreadyCharged,
    remainingToPay,
    status: authStatus,
    maxCapturable,
    shortfall,
    canCaptureOrderTotal,
    orderTotalCaptured,
  } = captureState;

  const totalAmount = orderTotal.amount;

  // Default selection: always prefer "orderTotal" unless it's disabled
  const isFirstOptionDisabled = authStatus === "none" || authStatus === "charged";
  const getDefaultOption = (): CaptureAmountOption => {
    // Always default to orderTotal (first option) unless it's disabled
    return isFirstOptionDisabled ? "custom" : "orderTotal";
  };

  const getDefaultCustomAmount = (): number => {
    if (authStatus === "none" || authStatus === "charged") {
      return 0;
    }

    if (authStatus === "partial") {
      // Default to max capturable (remaining auth)
      return availableToCapture;
    }

    // Default to remaining amount to pay
    return remainingToPay;
  };

  const [selectedOption, setSelectedOption] = useState<CaptureAmountOption>(getDefaultOption);
  const [customAmount, setCustomAmount] = useState<number>(getDefaultCustomAmount);
  // String representation for the input field (allows user to type intermediate values like "10.")
  const [customAmountInput, setCustomAmountInput] = useState<string>(
    String(getDefaultCustomAmount()),
  );

  // Get max decimal places for this currency (e.g., 2 for USD, 0 for JPY, 3 for KWD)
  const maxDecimalPlaces = useMemo(() => getCurrencyDecimalPoints(currency), [currency]);

  const handleCustomAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const limitedValue = limitDecimalPlaces(e.target.value, maxDecimalPlaces);

    setCustomAmountInput(limitedValue);
    setCustomAmount(parseDecimalValue(limitedValue));
  };

  const getSelectedAmount = (): number => {
    switch (selectedOption) {
      case "orderTotal":
        // For partial auth, capture max available; for full, capture remaining balance
        return authStatus === "partial" ? availableToCapture : remainingToPay;
      case "custom":
        return customAmount;
    }
  };

  const selectedAmount = getSelectedAmount();
  const isCustomAmountInRange = customAmount > 0 && customAmount <= maxCapturable;
  const isCustomAmountValid = selectedOption !== "custom" || isCustomAmountInRange;
  const showCustomAmountError =
    selectedOption === "custom" &&
    authStatus !== "none" &&
    authStatus !== "charged" &&
    !isCustomAmountInRange;
  const canSubmit =
    authStatus !== "none" && authStatus !== "charged" && isCustomAmountValid && selectedAmount > 0;

  const handleSubmit = (): void => {
    if (canSubmit) {
      onSubmit(selectedAmount);
    }
  };

  const formatMoney = (amount: number): JSX.Element => (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      <Money money={{ amount, currency }} />
    </span>
  );

  // Calculate predicted outcome status after capture (order-wide)
  type OutcomeStatus = "fullyCharged" | "partiallyCharged" | "overcharged";

  const getOutcomeStatus = (): OutcomeStatus => {
    const totalAfterCapture = orderTotalCaptured + selectedAmount;

    if (totalAfterCapture > totalAmount) {
      return "overcharged";
    } else if (totalAfterCapture >= totalAmount) {
      return "fullyCharged";
    } else {
      return "partiallyCharged";
    }
  };

  const outcomeStatus = getOutcomeStatus();

  const getStatusPill = (): JSX.Element => {
    switch (authStatus) {
      case "charged":
        return (
          <Pill
            color="success"
            label={intl.formatMessage(messages.statusFullyCaptured)}
            icon={<CheckCircle2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        );
      case "full":
        return (
          <Pill
            color="success"
            label={intl.formatMessage(messages.statusFullyAuthorized)}
            icon={<CheckCircle2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        );
      case "partial":
        return (
          <Pill
            color="warning"
            label={intl.formatMessage(messages.statusPartial)}
            icon={<CircleAlert size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        );
      case "none":
        return (
          <Pill
            color="error"
            label={intl.formatMessage(messages.statusNoAuthorization)}
            icon={<AlertTriangle size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        );
    }
  };

  type AuthorizationColor = "success1" | "warning1" | "critical1";

  const authStatusColorMap: Record<AuthorizationStatus, AuthorizationColor> = {
    charged: "success1",
    full: "success1",
    partial: "warning1",
    none: "critical1",
  };

  const authorizedAmountColor = authStatusColorMap[authStatus];

  return (
    <DashboardModal open onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          <Box display="flex" alignItems="center" gap={3}>
            <FormattedMessage {...messages.title} />
            {getStatusPill()}
          </Box>
        </DashboardModal.Header>

        <Box display="flex" flexDirection="column" gap={5}>
          {/* Summary box with order and payment sections */}
          <Box
            borderRadius={4}
            borderWidth={1}
            borderStyle="solid"
            borderColor="default1"
            display="flex"
            flexDirection="column"
          >
            {/* Order section */}
            <Box
              padding={4}
              display="flex"
              flexDirection="column"
              gap={2}
              borderBottomWidth={1}
              borderBottomStyle="solid"
              borderColor="default1"
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <BoxIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                  <Text>
                    <FormattedMessage {...messages.orderTotal} />
                  </Text>
                </Box>
                <Text fontWeight="medium">{formatMoney(totalAmount)}</Text>
              </Box>
              {orderTotalCaptured > 0 && (
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box __width="16px" /> {/* Spacer to align with icon above */}
                    <Text>
                      <FormattedMessage {...messages.capturedSoFar} />
                    </Text>
                  </Box>
                  <Text fontWeight="medium">{formatMoney(orderTotalCaptured)}</Text>
                </Box>
              )}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box __width="16px" /> {/* Spacer to align with icon above */}
                  <Text>
                    <FormattedMessage {...messages.balanceDue} />
                  </Text>
                </Box>
                <Text fontWeight="medium">{formatMoney(remainingToPay)}</Text>
              </Box>
            </Box>

            {/* Transaction section */}
            <Box padding={4} display="flex" flexDirection="column" gap={4}>
              <Box display="flex" flexDirection="column" gap={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <CreditCard size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    <Text>
                      <FormattedMessage {...messages.availableToCapture} />
                    </Text>
                  </Box>
                  <Text fontWeight="medium" color={authorizedAmountColor}>
                    {formatMoney(availableToCapture)}
                  </Text>
                </Box>
                {alreadyCharged > 0 && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box __width="16px" /> {/* Spacer to align with icon above */}
                      <Text>
                        <FormattedMessage {...messages.transactionCaptured} />
                      </Text>
                    </Box>
                    <Text fontWeight="medium">{formatMoney(alreadyCharged)}</Text>
                  </Box>
                )}
              </Box>

              {/* Warning/Error messages */}
              {authStatus === "partial" && (
                <Callout
                  type="warning"
                  title={
                    <Text size={2}>
                      <FormattedMessage
                        {...messages.warningPartialAuthorization}
                        values={{
                          shortfall: <strong>{formatMoney(shortfall)}</strong>,
                        }}
                      />
                    </Text>
                  }
                />
              )}

              {authStatus === "none" && (
                <Callout
                  type="error"
                  title={
                    <Text size={2}>
                      <FormattedMessage
                        {...messages.errorNoAuthorization}
                        values={{
                          amount: <strong>{formatMoney(remainingToPay)}</strong>,
                        }}
                      />
                    </Text>
                  }
                />
              )}
            </Box>
          </Box>

          {/* Radio options - primary section */}
          <Box display="flex" flexDirection="column" gap={4}>
            <ModalSectionHeader>
              <FormattedMessage {...messages.selectAmount} />
            </ModalSectionHeader>

            <RadioGroup
              value={selectedOption}
              onValueChange={value => setSelectedOption(value as CaptureAmountOption)}
            >
              <Box display="flex" flexDirection="column" gap={4}>
                {/* Order Total / Remaining Balance / Remaining Max option */}
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingRight={4}
                  >
                    <RadioGroup.Item
                      id="orderTotal"
                      value="orderTotal"
                      disabled={isFirstOptionDisabled}
                    >
                      <Text color={isFirstOptionDisabled ? "default2" : "default1"}>
                        <FormattedMessage
                          {...(authStatus === "partial"
                            ? messages.remainingMax
                            : alreadyCharged > 0
                              ? messages.remainingBalance
                              : messages.optionOrderTotal)}
                        />
                      </Text>
                    </RadioGroup.Item>
                    <Text
                      fontWeight="medium"
                      color={isFirstOptionDisabled ? "default2" : "default1"}
                    >
                      {formatMoney(authStatus === "partial" ? availableToCapture : remainingToPay)}
                    </Text>
                  </Box>
                  {canCaptureOrderTotal && (
                    <Box paddingLeft={5}>
                      <Text size={2} color="default2">
                        <FormattedMessage {...messages.optionOrderTotalHint} />
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Custom amount option */}
                <Box display="flex" flexDirection="column" gap={3}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <RadioGroup.Item
                      id="custom"
                      value="custom"
                      disabled={authStatus === "none" || authStatus === "charged"}
                    >
                      <Text
                        color={
                          authStatus === "none" || authStatus === "charged"
                            ? "default2"
                            : "default1"
                        }
                      >
                        <FormattedMessage {...messages.optionCustom} />
                      </Text>
                    </RadioGroup.Item>
                  </Box>

                  <Box paddingLeft={7} display="flex" alignItems="center" gap={4}>
                    <Box __width="180px">
                      <Input
                        size="small"
                        type="text"
                        inputMode="decimal"
                        value={customAmountInput}
                        onChange={handleCustomAmountChange}
                        error={showCustomAmountError}
                        disabled={
                          authStatus === "none" ||
                          authStatus === "charged" ||
                          selectedOption !== "custom"
                        }
                        endAdornment={
                          <Text size={2} color="default2" marginRight={2}>
                            {currency}
                          </Text>
                        }
                      />
                    </Box>
                    <Text size={2} color="default2">
                      <FormattedMessage
                        {...messages.customAmountMax}
                        values={{
                          amount: intl.formatNumber(maxCapturable, {
                            style: "currency",
                            currency,
                          }),
                        }}
                      />
                    </Text>
                  </Box>
                </Box>
              </Box>
            </RadioGroup>
          </Box>
        </Box>

        {/* Outcome prediction */}
        {canSubmit && selectedAmount > 0 && (
          <Box display="flex" alignItems="center" gap={1}>
            <Text size={2} color="default2">
              <FormattedMessage
                {...messages.outcomeMessage}
                values={{
                  status: (
                    <Pill
                      size="small"
                      color={
                        outcomeStatus === "overcharged"
                          ? "error"
                          : outcomeStatus === "fullyCharged"
                            ? "success"
                            : "warning"
                      }
                      label={intl.formatMessage(
                        outcomeStatus === "overcharged"
                          ? messages.statusOvercapturedPill
                          : outcomeStatus === "fullyCharged"
                            ? messages.statusFullyCapturedPill
                            : messages.statusPartiallyCapturedPill,
                      )}
                    />
                  ),
                }}
              />
            </Text>
          </Box>
        )}

        {errors.length > 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            {errors.map((error, index) => (
              <Text color="critical1" key={index}>
                {isTransactionError(error)
                  ? getOrderTransactionErrorMessage(error, intl)
                  : getOrderErrorMessage(error, intl)}
              </Text>
            ))}
          </Box>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            transitionState={confirmButtonState}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <FormattedMessage
              {...messages.captureButton}
              values={{
                amount: intl.formatNumber(selectedAmount, {
                  style: "currency",
                  currency,
                }),
              }}
            />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCaptureDialog.displayName = "OrderCaptureDialog";
