import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { DiscountValueTypeEnum } from "@dashboard/graphql";
import { type ChangeEvent as FormChangeEvent } from "@dashboard/hooks/useForm";
import { toFixed } from "@dashboard/utils/toFixed";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderDiscountModal.module.css";

interface DiscountFormFieldsProps {
  value: string;
  reason: string;
  calculationMode: DiscountValueTypeEnum;
  valueErrorMsg: string | null;
  valueFieldSymbol: string;
  onValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReasonChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCalculationModeChange: (event: FormChangeEvent) => void;
}

export const DiscountFormFields = ({
  value,
  reason,
  calculationMode,
  valueErrorMsg,
  valueFieldSymbol,
  onValueChange,
  onReasonChange,
  onCalculationModeChange,
}: DiscountFormFieldsProps) => {
  const intl = useIntl();

  const discountTypeChoices = [
    {
      label: intl.formatMessage(messages.percentageOption),
      value: DiscountValueTypeEnum.PERCENTAGE,
    },
    {
      label: intl.formatMessage(messages.fixedAmountOption),
      value: DiscountValueTypeEnum.FIXED,
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3} overflow="hidden">
      <RadioGroupField
        choices={discountTypeChoices}
        name="discountType"
        value={calculationMode}
        onChange={onCalculationModeChange}
      />
      <Box display="flex" gap={2} alignItems="flex-end">
        <Box flexGrow="1" overflow="hidden">
          <Input
            className={styles.priceInput}
            size="small"
            type="number"
            label={intl.formatMessage(messages.discountValueLabel)}
            error={!!valueErrorMsg}
            helperText={valueErrorMsg || ""}
            value={toFixed(value, 2)}
            onChange={onValueChange}
            min="0"
            step="0.01"
          />
        </Box>
        <Text size={3} color="default2" paddingBottom={valueErrorMsg ? 6 : 2} flexShrink="0">
          {valueFieldSymbol}
        </Text>
      </Box>
      <Box overflow="hidden">
        <Input
          label={intl.formatMessage(messages.discountReasonLabel)}
          value={reason}
          data-test-id="discount-reason"
          onChange={onReasonChange}
        />
      </Box>
    </Box>
  );
};
