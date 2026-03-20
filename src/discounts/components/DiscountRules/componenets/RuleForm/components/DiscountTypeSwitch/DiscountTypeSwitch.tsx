import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import { type KeyboardEvent, useCallback } from "react";
import { useIntl } from "react-intl";

import styles from "./DiscountTypeSwitch.module.css";

interface DiscountTypeSwitchProps {
  selected: RewardValueTypeEnum;
  currencySymbol: string | null;
  onChange: (type: string) => void;
}

const PERCENT_SYMBOL = "%";

export const DiscountTypeSwitch = ({
  selected,
  currencySymbol,
  onChange,
}: DiscountTypeSwitchProps) => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();
  const hasFixedValue = !!currencySymbol;
  const setFixed = useCallback(() => onChange(RewardValueTypeEnum.FIXED), [onChange]);
  const setPercentage = useCallback(() => onChange(RewardValueTypeEnum.PERCENTAGE), [onChange]);
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!hasFixedValue) {
        return;
      }

      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown"
      ) {
        return;
      }

      event.preventDefault();

      if (selected === RewardValueTypeEnum.FIXED) {
        setPercentage();
      } else {
        setFixed();
      }
    },
    [hasFixedValue, selected, setFixed, setPercentage],
  );

  return (
    <div
      className={styles.toggle}
      role="radiogroup"
      aria-label={intl.formatMessage({ defaultMessage: "Reward value type", id: "8ugJiV" })}
      onKeyDown={handleKeyDown}
    >
      {currencySymbol && (
        <button
          type="button"
          role="radio"
          aria-checked={selected === RewardValueTypeEnum.FIXED}
          aria-label={intl.formatMessage({ defaultMessage: "Fixed amount", id: "5A5tMT" })}
          tabIndex={selected === RewardValueTypeEnum.FIXED ? 0 : -1}
          className={styles.item}
          data-active={selected === RewardValueTypeEnum.FIXED}
          data-test-id="fixed-reward-value-type"
          disabled={disabled}
          onClick={setFixed}
        >
          {currencySymbol}
        </button>
      )}
      <button
        type="button"
        role="radio"
        aria-checked={selected === RewardValueTypeEnum.PERCENTAGE}
        aria-label={intl.formatMessage({ defaultMessage: "Percentage", id: "HyMpO2" })}
        tabIndex={selected === RewardValueTypeEnum.PERCENTAGE ? 0 : -1}
        className={`${styles.item} ${styles.percent}`}
        data-active={selected === RewardValueTypeEnum.PERCENTAGE}
        data-test-id="percentage-reward-value-type"
        disabled={disabled}
        onClick={setPercentage}
      >
        {PERCENT_SYMBOL}
      </button>
    </div>
  );
};
