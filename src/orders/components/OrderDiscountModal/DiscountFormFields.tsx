import { HookFormInput } from "@dashboard/components/HookFormInput";
import {
  HookFormRadioGroup,
  type HookFormRadioGroupChoice,
} from "@dashboard/components/HookFormRadioGroup/HookFormRadioGroup";
import { DiscountValueTypeEnum } from "@dashboard/graphql";
import { toFixed } from "@dashboard/utils/toFixed";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { type Control, Controller } from "react-hook-form";
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

  const discountTypeChoices = useMemo<HookFormRadioGroupChoice<DiscountValueTypeEnum>[]>(
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
      <HookFormRadioGroup
        control={control}
        name="calculationMode"
        choices={discountTypeChoices}
        onValueChange={onCalculationModeChange}
      />
      <Box display="flex" gap={2} alignItems="flex-end">
        <Box flexGrow="1" overflow="hidden">
          {/* Kept as Controller: this field has a display transform (toFixed)
              and a cross-field error (valueErrorMsg) derived outside RHF's
              formState — see useDiscountForm for why we don't use setError. */}
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
      <Box overflow="hidden">
        <HookFormInput
          control={control}
          name="reason"
          label={intl.formatMessage(messages.discountReasonLabel)}
          data-test-id="discount-reason"
        />
      </Box>
    </Box>
  );
};
