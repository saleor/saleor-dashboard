import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { DiscountValueTypeEnum } from "@dashboard/graphql";
import { toFixed } from "@dashboard/utils/toFixed";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderDiscountModal.module.css";
import { type DiscountFormData } from "./useDiscountForm";

interface DiscountFormFieldsProps {
  control: Control<DiscountFormData>;
  valueFieldSymbol: string;
  valueErrorMsg: string | null;
  onCalculationModeChange: (mode: DiscountValueTypeEnum) => void;
}

export const DiscountFormFields = ({
  control,
  valueFieldSymbol,
  valueErrorMsg,
  onCalculationModeChange,
}: DiscountFormFieldsProps) => {
  const intl = useIntl();
  const calculationMode = useWatch({ control, name: "calculationMode" });

  const discountTypeChoices = useMemo(
    () => [
      {
        label: intl.formatMessage(messages.percentageOption),
        value: DiscountValueTypeEnum.PERCENTAGE,
      },
      {
        label: intl.formatMessage(messages.fixedAmountOption),
        value: DiscountValueTypeEnum.FIXED,
      },
    ],
    [intl],
  );

  return (
    <Box display="flex" flexDirection="column" gap={3} overflow="hidden">
      <RadioGroupField
        choices={discountTypeChoices}
        name="discountType"
        value={calculationMode}
        onChange={event => onCalculationModeChange(event.target.value as DiscountValueTypeEnum)}
      />
      <Box display="flex" gap={2} alignItems="flex-end">
        <Box flexGrow="1" overflow="hidden">
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <Input
                className={styles.priceInput}
                size="small"
                type="number"
                label={intl.formatMessage(messages.discountValueLabel)}
                error={!!valueErrorMsg}
                helperText={valueErrorMsg || ""}
                value={toFixed(field.value, 2)}
                onChange={field.onChange}
                min="0"
                step="0.01"
              />
            )}
          />
        </Box>
        <Text size={3} color="default2" paddingBottom={valueErrorMsg ? 6 : 2} flexShrink="0">
          {valueFieldSymbol}
        </Text>
      </Box>
      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <Box overflow="hidden">
            <Input
              label={intl.formatMessage(messages.discountReasonLabel)}
              value={field.value}
              data-test-id="discount-reason"
              onChange={field.onChange}
            />
          </Box>
        )}
      />
    </Box>
  );
};
