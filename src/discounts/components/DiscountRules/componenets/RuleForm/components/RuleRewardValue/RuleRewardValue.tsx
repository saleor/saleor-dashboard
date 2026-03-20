import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { type Rule } from "@dashboard/discounts/models";
import { Input, Text } from "@saleor/macaw-ui-next";
import { useController, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { DiscountTypeSwitch } from "../DiscountTypeSwitch";
import { RuleInputWrapper } from "../RuleInputWrapper";
import styles from "./RuleRewardValue.module.css";

interface RuleRewardPriceProps {
  currencySymbol: string | null;
  error: string | undefined;
}

export const RuleRewardValue = ({ currencySymbol, error }: RuleRewardPriceProps) => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();
  const { watch, formState } = useFormContext<Rule>();
  const discountType = watch("rewardValueType");
  const { field: rewardTypeField } = useController<Rule, "rewardValueType">({
    name: "rewardValueType",
  });
  const { field: rewardValueType } = useController<Rule, "rewardValue">({
    name: "rewardValue",
  });
  const rewardValueError = error || formState.errors?.rewardValue?.message;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} data-error={!!rewardValueError}>
        <DiscountTypeSwitch
          onChange={type => rewardTypeField.onChange(type)}
          selected={discountType}
          currencySymbol={currencySymbol}
        />
        <div className={styles.divider} />
        <RuleInputWrapper width="100%">
          <Input
            value={rewardValueType.value || ""}
            onBlur={rewardValueType.onBlur}
            name={rewardValueType.name}
            ref={rewardValueType.ref}
            onChange={e => {
              const value = parseInt(e.target.value, 10);

              rewardValueType.onChange(Number.isNaN(value) ? null : value);
            }}
            error={!!rewardValueError}
            disabled={disabled || rewardValueType.disabled}
            type="number"
            size="small"
            label={intl.formatMessage(messages.discountValue)}
            data-test-id="reward-value-input"
          />
        </RuleInputWrapper>
      </div>
      {rewardValueError && (
        <Text className={styles.error} color="critical1" size={2}>
          {rewardValueError}
        </Text>
      )}
    </div>
  );
};
